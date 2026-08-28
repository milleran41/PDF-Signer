/* PDF Signer — MVP editor
 * Слои: docCanvas (документ) -> #grid (вспомогательная сетка, НЕ экспортируется)
 *       -> #overlay (текст + подписи, экспортируется)
 */

const SIG_KEY = "pdfsigner.signatures";
const USER_KEY = "pdfsigner.user";
const DEMO_CODE = "000000";

const $ = (id) => document.getElementById(id);

/* ================= 3a. Авторизация (заглушка) ================= */
const auth = {
  get user() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || "null");
    } catch {
      return null;
    }
  },
  login(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    showApp();
  },
  logout() {
    localStorage.removeItem(USER_KEY);
    location.reload();
  },
};

function authError(msg) {
  const el = $("authErr");
  el.textContent = msg || "";
  el.hidden = !msg;
}

function showApp() {
  $("authScreen").hidden = true;
  $("app").hidden = false;
  renderSigStrips();
}

$("googleBtn").onclick = () =>
  auth.login({ provider: "google", email: "demo.user@gmail.com", at: Date.now() });

$("sendCode").onclick = () => {
  const email = $("email").value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return authError("Введите корректный e-mail");
  authError("");
  $("emailEcho").textContent = email;
  $("emailStep").hidden = true;
  $("codeStep").hidden = false;
};

$("backToEmail").onclick = () => {
  $("codeStep").hidden = true;
  $("emailStep").hidden = false;
  authError("");
};

$("verify").onclick = () => {
  if ($("code").value.trim() !== DEMO_CODE) return authError("Неверный код (демо-код: 000000)");
  authError("");
  auth.login({ provider: "email", email: $("emailEcho").textContent, at: Date.now() });
};

if ($("logout")) $("logout").onclick = () => auth.logout();

/* ================= 1. Загрузка и отображение документа ================= */
if (window.pdfjsLib) {
  // В расширении путь берём через chrome.runtime, при обычном просмотре — относительно страницы.
  const workerUrl =
    typeof chrome !== "undefined" && chrome.runtime?.getURL
      ? chrome.runtime.getURL("vendor/pdf.worker.min.js")
      : new URL("vendor/pdf.worker.min.js", location.href).href;
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
}

const RENDER_SCALE = 2; // качество рендера PDF (1pt -> 2px)
const docCanvas = $("docCanvas");
const overlay = $("overlay");
const gridEl = $("grid");

const state = {
  kind: null, // 'pdf' | 'image'
  pdf: null,
  page: 1,
  pages: 1,
  image: null,
  zoom: 1,
  annots: {}, // { [pageNumber]: Array<annotation> }
};

function annotsForPage() {
  return (state.annots[state.page] ||= []);
}

async function openFile(file) {
  if (!file) return;
  const buf = await file.arrayBuffer();
  if (file.type === "application/pdf" || /\.pdf$/i.test(file.name)) {
    await loadPdf(buf);
  } else {
    await loadImage(URL.createObjectURL(new Blob([buf], { type: file.type || "image/png" })));
  }
}

async function openUrl(url) {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  const type = res.headers.get("content-type") || "";
  if (type.includes("pdf") || /\.pdf(\?|$)/i.test(url)) await loadPdf(buf);
  else await loadImage(URL.createObjectURL(new Blob([buf], { type: type || "image/png" })));
}

async function loadPdf(buf) {
  state.pdf = await pdfjsLib.getDocument({ data: buf }).promise;
  state.kind = "pdf";
  state.image = null;
  state.pages = state.pdf.numPages;
  state.page = 1;
  state.annots = {};
  $("pageNav").hidden = state.pages < 2;
  $("pageCount").textContent = String(state.pages);
  await renderPage();
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      state.kind = "image";
      state.pdf = null;
      state.image = img;
      state.pages = 1;
      state.page = 1;
      state.annots = {};
      $("pageNav").hidden = true;
      docCanvas.width = img.naturalWidth;
      docCanvas.height = img.naturalHeight;
      docCanvas.getContext("2d").drawImage(img, 0, 0);
      afterRender();
      resolve();
    };
    img.onerror = reject;
    img.src = src;
  });
}

async function renderPage() {
  const page = await state.pdf.getPage(state.page);
  const viewport = page.getViewport({ scale: RENDER_SCALE });
  docCanvas.width = Math.floor(viewport.width);
  docCanvas.height = Math.floor(viewport.height);
  const ctx = docCanvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, docCanvas.width, docCanvas.height);
  await page.render({ canvasContext: ctx, viewport }).promise;
  $("pageNum").textContent = String(state.page);
  afterRender();
}

function afterRender() {
  $("empty").hidden = true;
  $("stageWrap").hidden = false;
  const stage = $("stage");
  stage.style.width = docCanvas.width + "px";
  stage.style.height = docCanvas.height + "px";
  applyZoom();
  applyGrid();
  renderAnnots();
}

function showHome(reset = false) {
  if (reset) {
    state.kind = null;
    state.pdf = null;
    state.page = 1;
    state.pages = 1;
    state.image = null;
    state.annots = {};
    overlay.innerHTML = "";
    docCanvas.getContext("2d").clearRect(0, 0, docCanvas.width, docCanvas.height);
    $("fileInput").value = "";
    $("fileInput2").value = "";
  }
  $("empty").hidden = false;
  $("stageWrap").hidden = true;
  $("pageNav").hidden = true;
  $("sigModal").hidden = true;
}

$("fileInput").onchange = (e) => openFile(e.target.files[0]);
$("fileInput2").onchange = (e) => openFile(e.target.files[0]);
$("homeBtn").onclick = () => showHome(true);
$("prevPage").onclick = async () => {
  if (state.page > 1) {
    state.page--;
    await renderPage();
  }
};
$("nextPage").onclick = async () => {
  if (state.page < state.pages) {
    state.page++;
    await renderPage();
  }
};

/* ---------- зум ---------- */
function applyZoom() {
  $("stage").style.transform = `scale(${state.zoom})`;
  $("stageWrap").style.height = docCanvas.height * state.zoom + "px";
  $("stageWrap").style.width = docCanvas.width * state.zoom + "px";
  $("zoomLabel").textContent = Math.round(state.zoom * 100) + "%";
}
$("zoomIn").onclick = () => {
  state.zoom = Math.min(3, state.zoom + 0.1);
  applyZoom();
};
$("zoomOut").onclick = () => {
  state.zoom = Math.max(0.2, state.zoom - 0.1);
  applyZoom();
};

/* ---------- сетка ---------- */
function applyGrid() {
  const on = $("gridToggle").checked;
  const size = Number($("gridSize").value);
  const mode = $("gridMode").value;
  gridEl.className = "grid" + (on ? (mode === "grid" ? " grid-cells" : " grid-lines") : "");
  gridEl.style.backgroundSize = `${size}px ${size}px`;
}
["gridToggle", "gridMode", "gridSize"].forEach((id) => ($(id).oninput = applyGrid));

/* ================= 2. Текстовый слой ================= */
const textStyle = { family: "sans-serif", size: 16, bold: false, italic: false, color: "#111111" };

$("fontFamily").onchange = (e) => (textStyle.family = e.target.value);
$("fontSize").onchange = (e) => (textStyle.size = Number(e.target.value));
$("textColor").oninput = (e) => (textStyle.color = e.target.value);
$("boldBtn").onclick = (e) => {
  textStyle.bold = !textStyle.bold;
  e.currentTarget.classList.toggle("active", textStyle.bold);
};
$("italicBtn").onclick = (e) => {
  textStyle.italic = !textStyle.italic;
  e.currentTarget.classList.toggle("active", textStyle.italic);
};

// клик по документу -> новое текстовое поле в координатах документа
overlay.addEventListener("mousedown", (e) => {
  if (e.target !== overlay) return;
  const rect = overlay.getBoundingClientRect();
  const x = (e.clientX - rect.left) / state.zoom;
  const y = (e.clientY - rect.top) / state.zoom;
  const size = textStyle.size * RENDER_SCALE;
  const a = {
    id: crypto.randomUUID(),
    type: "text",
    x: snap(x),
    y: snap(y),
    text: "",
    family: textStyle.family,
    size,
    bold: textStyle.bold,
    italic: textStyle.italic,
    color: textStyle.color,
  };
  annotsForPage().push(a);
  renderAnnots();
  const node = overlay.querySelector(`[data-id="${a.id}"] textarea`);
  node?.focus();
});

function snap(v) {
  if (!$("gridToggle").checked) return v;
  const step = Number($("gridSize").value);
  return Math.round(v / step) * step;
}

function renderAnnots() {
  overlay.innerHTML = "";
  annotsForPage().forEach((a) => overlay.appendChild(a.type === "text" ? textNode(a) : sigNode(a)));
}

function baseNode(a, cls) {
  const el = document.createElement("div");
  el.className = `item ${cls}`;
  el.dataset.id = a.id;
  el.style.left = a.x + "px";
  el.style.top = a.y + "px";

  const handle = document.createElement("button");
  handle.className = "handle";
  handle.textContent = "⠿";
  handle.title = "Переместить";
  handle.addEventListener("mousedown", (ev) => startDrag(ev, a, el));

  const del = document.createElement("button");
  del.className = "del";
  del.textContent = "×";
  del.title = "Удалить";
  del.onclick = () => {
    state.annots[state.page] = annotsForPage().filter((x) => x !== a);
    renderAnnots();
  };

  el.append(handle, del);
  return el;
}

function textNode(a) {
  const el = baseNode(a, "item-text");
  const ta = document.createElement("textarea");
  ta.rows = 1;
  ta.value = a.text;
  ta.spellcheck = false;
  ta.style.font = `${a.italic ? "italic " : ""}${a.bold ? "700 " : "400 "}${a.size}px ${a.family}`;
  ta.style.color = a.color;
  const autosize = () => {
    ta.style.width = "10px";
    ta.style.height = "10px";
    ta.style.width = ta.scrollWidth + 6 + "px";
    ta.style.height = ta.scrollHeight + "px";
  };
  ta.addEventListener("input", () => {
    a.text = ta.value;
    autosize();
  });
  ta.addEventListener("focus", () => el.classList.add("selected"));
  ta.addEventListener("blur", () => el.classList.remove("selected"));
  el.appendChild(ta);
  requestAnimationFrame(autosize);
  return el;
}

function sigNode(a) {
  const el = baseNode(a, "item-sig");
  el.style.width = a.w + "px";
  el.style.height = a.h + "px";
  const img = document.createElement("img");
  img.src = a.dataUrl;
  img.draggable = false;
  el.appendChild(img);

  img.addEventListener("mousedown", (ev) => startDrag(ev, a, el));

  const rz = document.createElement("div");
  rz.className = "resize";
  rz.addEventListener("mousedown", (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    const sx = ev.clientX;
    const ratio = a.h / a.w;
    const w0 = a.w;
    const move = (m) => {
      a.w = Math.max(40, w0 + (m.clientX - sx) / state.zoom);
      a.h = a.w * ratio;
      el.style.width = a.w + "px";
      el.style.height = a.h + "px";
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  });
  el.appendChild(rz);
  return el;
}

function startDrag(ev, a, el) {
  ev.preventDefault();
  ev.stopPropagation();
  const sx = ev.clientX;
  const sy = ev.clientY;
  const x0 = a.x;
  const y0 = a.y;
  el.classList.add("selected");
  const move = (m) => {
    a.x = snap(x0 + (m.clientX - sx) / state.zoom);
    a.y = snap(y0 + (m.clientY - sy) / state.zoom);
    el.style.left = a.x + "px";
    el.style.top = a.y + "px";
  };
  const up = () => {
    el.classList.remove("selected");
    window.removeEventListener("mousemove", move);
    window.removeEventListener("mouseup", up);
  };
  window.addEventListener("mousemove", move);
  window.addEventListener("mouseup", up);
}

/* ================= 3b. Подписи ================= */
const sigStore = {
  list() {
    try {
      return JSON.parse(localStorage.getItem(SIG_KEY) || "[]");
    } catch {
      return [];
    }
  },
  add(dataUrl) {
    const list = sigStore.list();
    list.unshift({ name: `Подпись ${list.length + 1}`, dataUrl, at: Date.now() });
    localStorage.setItem(SIG_KEY, JSON.stringify(list.slice(0, 12)));
    renderSigStrips();
  },
};

function renderSigStrips() {
  const list = sigStore.list();
  [$("sigStrip"), $("sigStripModal")].forEach((strip) => {
    if (!strip) return;
    strip.innerHTML = "";
    if (!list.length) {
      strip.innerHTML = '<span class="muted small">нет сохранённых</span>';
      return;
    }
    list.forEach((s) => {
      const img = new Image();
      img.src = s.dataUrl;
      img.title = "Вставить в документ";
      img.onclick = () => insertSignature(s.dataUrl);
      strip.appendChild(img);
    });
  });
}

function insertSignature(dataUrl) {
  if (!state.kind) return alert("Сначала откройте документ");
  const probe = new Image();
  probe.onload = () => {
    const w = Math.min(360, probe.naturalWidth);
    annotsForPage().push({
      id: crypto.randomUUID(),
      type: "sig",
      dataUrl,
      x: 60,
      y: Math.max(60, docCanvas.height - 240),
      w,
      h: (w * probe.naturalHeight) / probe.naturalWidth,
    });
    renderAnnots();
    $("sigModal").hidden = true;
  };
  probe.src = dataUrl;
}

$("signBtn").onclick = () => {
  $("sigModal").hidden = false;
  renderSigStrips();
};
$("sigClose").onclick = () => ($("sigModal").hidden = true);
$("sigBack").onclick = () => showHome(true);

document.querySelectorAll(".tab").forEach((tab) => {
  tab.onclick = () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t === tab));
    document
      .querySelectorAll(".tab-panel")
      .forEach((p) => (p.hidden = p.dataset.panel !== tab.dataset.tab));
  };
});

/* ---------- a) Signature pad ---------- */
const pad = $("padCanvas");
const padCtx = pad.getContext("2d");
let drawing = false;
let padDirty = false;

function padPos(e) {
  const r = pad.getBoundingClientRect();
  return { x: ((e.clientX - r.left) * pad.width) / r.width, y: ((e.clientY - r.top) * pad.height) / r.height };
}
function padStart(e) {
  e.preventDefault();
  drawing = true;
  padDirty = true;
  const p = padPos(e);
  padCtx.beginPath();
  padCtx.moveTo(p.x, p.y);
}
function padMove(e) {
  if (!drawing) return;
  const p = padPos(e);
  padCtx.lineCap = "round";
  padCtx.lineJoin = "round";
  padCtx.lineWidth = Number($("penWidth").value) * 1.6;
  padCtx.strokeStyle = $("penColor").value;
  padCtx.lineTo(p.x, p.y);
  padCtx.stroke();
}
const padEnd = () => (drawing = false);
pad.addEventListener("pointerdown", padStart);
pad.addEventListener("pointermove", padMove);
window.addEventListener("pointerup", padEnd);

$("padClear").onclick = () => {
  padCtx.clearRect(0, 0, pad.width, pad.height);
  padDirty = false;
};

$("padSave").onclick = () => {
  if (!padDirty) return alert("Сначала нарисуйте подпись");
  const trimmed = trimTransparent(pad);
  sigStore.add(trimmed.toDataURL("image/png"));
  $("padClear").click();
};

// обрезка прозрачных полей
function trimTransparent(canvas) {
  const ctx = canvas.getContext("2d");
  const { width: w, height: h } = canvas;
  const d = ctx.getImageData(0, 0, w, h).data;
  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (d[(y * w + x) * 4 + 3] > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return canvas;
  const pad2 = 6;
  minX = Math.max(0, minX - pad2);
  minY = Math.max(0, minY - pad2);
  maxX = Math.min(w - 1, maxX + pad2);
  maxY = Math.min(h - 1, maxY + pad2);
  const out = document.createElement("canvas");
  out.width = maxX - minX + 1;
  out.height = maxY - minY + 1;
  out.getContext("2d").drawImage(canvas, minX, minY, out.width, out.height, 0, 0, out.width, out.height);
  return out;
}

/* ---------- b) Файл/буфер + рамка + удаление фона ---------- */
const cropCanvas = $("cropCanvas");
const cropBox = $("cropBox");
let cropImg = null;
let cropSourceUrl = null;
let crop = null; // в координатах cropCanvas
let sigPdf = null;
let sigPdfPage = 1;
let sigPdfScale = 2;

function resetSignatureImport() {
  cropImg = null;
  crop = null;
  cropBox.hidden = true;
  $("sigPageNav").hidden = true;
  const ctx = cropCanvas.getContext("2d");
  ctx.clearRect(0, 0, cropCanvas.width, cropCanvas.height);
  const prev = $("sigPreview");
  prev.width = 320;
  prev.height = 120;
  prev.getContext("2d").clearRect(0, 0, prev.width, prev.height);
  $("sigPreviewHint").textContent = "После выбора файла здесь появится подпись с удалённым фоном.";
}

function setCropImageSource(src) {
  if (cropSourceUrl) URL.revokeObjectURL(cropSourceUrl);
  cropSourceUrl = src.startsWith("blob:") ? src : null;
  const img = new Image();
  img.onload = () => {
    cropImg = img;
    const maxW = 680;
    const scale = Math.min(1, maxW / img.naturalWidth);
    cropCanvas.width = Math.round(img.naturalWidth * scale);
    cropCanvas.height = Math.round(img.naturalHeight * scale);
    cropCanvas.getContext("2d").drawImage(img, 0, 0, cropCanvas.width, cropCanvas.height);
    crop = null;
    cropBox.hidden = true;
    previewCrop();
  };
  img.onerror = () => alert("Не удалось загрузить изображение из этого файла");
  img.src = src;
}

async function setCropPdf(file) {
  resetSignatureImport();
  if (!window.pdfjsLib) return alert("PDF-модуль не загружен");
  sigPdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  sigPdfPage = 1;
  $("sigPageNav").hidden = sigPdf.numPages < 2;
  $("sigPageCount").textContent = String(sigPdf.numPages);
  await renderSignaturePdfPage();
}

async function renderSignaturePdfPage() {
  if (!sigPdf) return;
  const page = await sigPdf.getPage(sigPdfPage);
  const viewport = page.getViewport({ scale: sigPdfScale });
  const canvas = document.createElement("canvas");
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport }).promise;
  $("sigPageNum").textContent = String(sigPdfPage);
  setCropImageSource(canvas.toDataURL("image/png"));
}

async function loadSignatureFile(file) {
  if (!file) return;
  try {
    sigPdf = null;
    if (file.type === "application/pdf" || /\.pdf$/i.test(file.name || "")) {
      await setCropPdf(file);
      return;
    }
    setCropImageSource(URL.createObjectURL(file));
  } catch (err) {
    console.error(err);
    alert("Не удалось открыть файл для поиска подписи: " + err.message);
  }
}

$("sigFile").onchange = (e) => loadSignatureFile(e.target.files[0]);

$("sigPrevPage").onclick = async () => {
  if (!sigPdf || sigPdfPage <= 1) return;
  sigPdfPage--;
  await renderSignaturePdfPage();
};

$("sigNextPage").onclick = async () => {
  if (!sigPdf || sigPdfPage >= sigPdf.numPages) return;
  sigPdfPage++;
  await renderSignaturePdfPage();
};

async function pasteSignatureFromClipboard() {
  try {
    if (navigator.clipboard?.read) {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const type = item.types.find((t) => t.startsWith("image/") || t === "application/pdf");
        if (type) {
          const blob = await item.getType(type);
          await loadSignatureFile(new File([blob], `clipboard.${type.includes("pdf") ? "pdf" : "png"}`, { type }));
          return;
        }
      }
    }
    alert("В буфере обмена не найдено изображение. Скопируйте скриншот или картинку и нажмите Ctrl+V прямо в этом окне.");
  } catch (err) {
    console.error(err);
    alert("Браузер не дал прочитать буфер. Нажмите Ctrl+V в окне подписи или загрузите файл.");
  }
}

$("pasteSig").onclick = pasteSignatureFromClipboard;

async function loadSignatureFromPasteEvent(e) {
  if ($("sigModal").hidden) return;
  const files = [...(e.clipboardData?.files || [])];
  let file = files.find((f) => f.type.startsWith("image/") || f.type === "application/pdf");
  if (!file) {
    const items = [...(e.clipboardData?.items || [])];
    const item = items.find((x) => x.kind === "file" && (x.type.startsWith("image/") || x.type === "application/pdf"));
    file = item?.getAsFile();
  }
  if (file) {
    e.preventDefault();
    await loadSignatureFile(file);
    return;
  }
  const html = e.clipboardData?.getData("text/html") || "";
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (match?.[1]?.startsWith("data:image/")) {
    e.preventDefault();
    setCropImageSource(match[1]);
  }
}

window.addEventListener("paste", loadSignatureFromPasteEvent);
document.addEventListener("paste", loadSignatureFromPasteEvent);

cropCanvas.addEventListener("pointerdown", (e) => {
  if (!cropImg) return;
  const r = cropCanvas.getBoundingClientRect();
  const kx = cropCanvas.width / r.width;
  const ky = cropCanvas.height / r.height;
  const sx = (e.clientX - r.left) * kx;
  const sy = (e.clientY - r.top) * ky;
  crop = { x: sx, y: sy, w: 0, h: 0 };
  cropBox.hidden = false;

  const move = (m) => {
    const cx = (m.clientX - r.left) * kx;
    const cy = (m.clientY - r.top) * ky;
    crop = { x: Math.min(sx, cx), y: Math.min(sy, cy), w: Math.abs(cx - sx), h: Math.abs(cy - sy) };
    cropBox.style.left = crop.x / kx + "px";
    cropBox.style.top = crop.y / ky + "px";
    cropBox.style.width = crop.w / kx + "px";
    cropBox.style.height = crop.h / ky + "px";
  };
  const up = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
    if (crop && crop.w > 8 && crop.h > 8) previewCrop();
  };
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
});

["threshold", "removeBg"].forEach((id) => ($(id).oninput = () => cropImg && previewCrop()));

function buildSignatureFromCrop() {
  if (!cropImg) return null;
  const area = crop && crop.w > 8 && crop.h > 8
    ? crop
    : { x: 0, y: 0, w: cropCanvas.width, h: cropCanvas.height };
  // работаем в исходном разрешении картинки для качества
  const k = cropImg.naturalWidth / cropCanvas.width;
  const out = document.createElement("canvas");
  out.width = Math.round(area.w * k);
  out.height = Math.round(area.h * k);
  const ctx = out.getContext("2d");
  ctx.drawImage(cropImg, area.x * k, area.y * k, area.w * k, area.h * k, 0, 0, out.width, out.height);

  if ($("removeBg").checked) {
    const t = Number($("threshold").value);
    const data = ctx.getImageData(0, 0, out.width, out.height);
    const p = data.data;
    for (let i = 0; i < p.length; i += 4) {
      const lum = 0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2];
      if (lum >= t) {
        p[i + 3] = 0; // светлый фон -> прозрачный
      } else {
        // мягкое сглаживание края
        p[i + 3] = Math.min(255, Math.round(255 * (1 - lum / t) + 40));
      }
    }
    ctx.putImageData(data, 0, 0);
    return trimTransparent(out);
  }
  return out;
}

function previewCrop() {
  const sig = buildSignatureFromCrop();
  if (!sig) return;
  const prev = $("sigPreview");
  const maxW = 320;
  const maxH = 120;
  const scale = Math.min(maxW / sig.width, maxH / sig.height, 1);
  const w = Math.max(1, Math.round(sig.width * scale));
  const h = Math.max(1, Math.round(sig.height * scale));
  prev.width = maxW;
  prev.height = maxH;
  const ctx = prev.getContext("2d");
  ctx.clearRect(0, 0, prev.width, prev.height);
  ctx.drawImage(sig, Math.round((maxW - w) / 2), Math.round((maxH - h) / 2), w, h);
  $("sigPreviewHint").textContent = crop && crop.w > 8 && crop.h > 8
    ? "Так подпись будет сохранена в шаблоны."
    : "Сейчас показан весь файл. Выделите рамкой только подпись, если нужно обрезать точнее.";
}

$("cropSave").onclick = () => {
  const sig = buildSignatureFromCrop();
  if (!sig) return alert("Сначала выберите файл или вставьте изображение из буфера");
  sigStore.add(sig.toDataURL("image/png"));
};

/* ================= 4. Экспорт (сплющивание слоёв, без сетки) ================= */
async function flattenPage(pageNumber) {
  // документ
  let base = docCanvas;
  if (state.kind === "pdf" && pageNumber !== state.page) {
    const page = await state.pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: RENDER_SCALE });
    base = document.createElement("canvas");
    base.width = Math.floor(viewport.width);
    base.height = Math.floor(viewport.height);
    const c = base.getContext("2d");
    c.fillStyle = "#fff";
    c.fillRect(0, 0, base.width, base.height);
    await page.render({ canvasContext: c, viewport }).promise;
  }

  const out = document.createElement("canvas");
  out.width = base.width;
  out.height = base.height;
  const ctx = out.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(base, 0, 0);

  const items = state.annots[pageNumber] || [];
  for (const a of items) {
    if (a.type === "text") {
      if (!a.text.trim()) continue;
      ctx.fillStyle = a.color;
      ctx.textBaseline = "top";
      ctx.font = `${a.italic ? "italic " : ""}${a.bold ? "700 " : "400 "}${a.size}px ${a.family}`;
      const lineH = a.size * 1.15;
      a.text.split("\n").forEach((line, i) => ctx.fillText(line, a.x + 2, a.y + i * lineH));
    } else {
      const img = await loadImg(a.dataUrl);
      ctx.drawImage(img, a.x, a.y, a.w, a.h);
    }
  }
  return out;
}

function loadImg(src) {
  return new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });
}

function downloadDataUrl(dataUrl, filename) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

$("saveBtn").onclick = async () => {
  if (!state.kind) return alert("Сначала откройте документ");
  const btn = $("saveBtn");
  btn.disabled = true;
  btn.textContent = "Сохраняю…";
  try {
    const fmt = $("exportFormat").value;
    if (fmt === "png") {
      const canvas = await flattenPage(state.page);
      downloadDataUrl(canvas.toDataURL("image/png"), `document-page-${state.page}.png`);
    } else {
      const { jsPDF } = window.jspdf;
      let pdf = null;
      for (let p = 1; p <= state.pages; p++) {
        const canvas = await flattenPage(p);
        const w = canvas.width / RENDER_SCALE;
        const h = canvas.height / RENDER_SCALE;
        const orientation = w > h ? "landscape" : "portrait";
        if (!pdf) pdf = new jsPDF({ unit: "pt", format: [w, h], orientation });
        else pdf.addPage([w, h], orientation);
        pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, w, h);
      }
      pdf.save("document-signed.pdf");
    }
  } catch (err) {
    console.error(err);
    alert("Не удалось сохранить документ: " + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = "Сохранить документ";
  }
};

/* ================= bootstrap ================= */
showApp();
showHome(false);
const srcParam = new URLSearchParams(location.search).get("src");
if (srcParam) openUrl(srcParam).catch((e) => alert("Не удалось открыть файл: " + e.message));
