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
  rotation: 0,
  layerOffsetY: 0,
  gridStepY: 24,
  annots: {}, // { [pageNumber]: Array<annotation> }
};

let activeAnnotId = null;

function annotsForPage() {
  return (state.annots[state.page] ||= []);
}

async function openFile(file) {
  if (!file) return;
  resetDocumentAdjustments();
  const buf = await file.arrayBuffer();
  if (file.type === "application/pdf" || /\.pdf$/i.test(file.name)) {
    await loadPdf(buf);
  } else {
    await loadImage(URL.createObjectURL(new Blob([buf], { type: file.type || "image/png" })));
  }
}

async function openUrl(url) {
  resetDocumentAdjustments();
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
      renderImageDocument();
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
  const source = document.createElement("canvas");
  source.width = Math.floor(viewport.width);
  source.height = Math.floor(viewport.height);
  const ctx = source.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, source.width, source.height);
  await page.render({ canvasContext: ctx, viewport }).promise;
  drawRotatedDocument(source);
  $("pageNum").textContent = String(state.page);
  afterRender();
}

function resetDocumentAdjustments() {
  state.rotation = 0;
  state.layerOffsetY = 0;
  state.gridStepY = Number($("gridSize").value);
  $("rotateAngle").value = "0";
  $("layerOffsetY").value = "0";
  $("gridStepY").value = String(state.gridStepY);
  updateRotationLabel();
  updateLayerOffsetLabel();
  updateGridStepYLabel();
}

function renderImageDocument() {
  const source = document.createElement("canvas");
  source.width = state.image.naturalWidth;
  source.height = state.image.naturalHeight;
  source.getContext("2d").drawImage(state.image, 0, 0);
  drawRotatedDocument(source);
}

function drawRotatedDocument(source) {
  drawCanvasInto(docCanvas, source, state.rotation);
}

function afterRender() {
  closeSignatureModal();
  $("empty").hidden = true;
  $("stageWrap").hidden = false;
  const stage = $("stage");
  stage.style.width = docCanvas.width + "px";
  stage.style.height = docCanvas.height + "px";
  applyZoom();
  applyGrid();
  applyLayerOffset();
  renderAnnots();
}

function showHome(reset = false) {
  closeSignatureModal();
  if (reset) {
    state.kind = null;
    state.pdf = null;
    state.page = 1;
    state.pages = 1;
    state.image = null;
    state.rotation = 0;
    state.layerOffsetY = 0;
    state.gridStepY = Number($("gridSize").value);
    state.annots = {};
    activeAnnotId = null;
    overlay.innerHTML = "";
    docCanvas.getContext("2d").clearRect(0, 0, docCanvas.width, docCanvas.height);
    $("fileInput").value = "";
    $("fileInput2").value = "";
    $("rotateAngle").value = "0";
    $("layerOffsetY").value = "0";
    $("gridStepY").value = String(state.gridStepY);
    updateRotationLabel();
    updateLayerOffsetLabel();
    updateGridStepYLabel();
  }
  $("empty").hidden = false;
  $("stageWrap").hidden = true;
  $("pageNav").hidden = true;
}

$("fileInput").onchange = (e) => openFile(e.target.files[0]);
$("fileInput2").onchange = (e) => openFile(e.target.files[0]);
$("homeBtn").onclick = () => showHome(true);
$("savedSignaturesBtn").onclick = () => chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
$("homeCreateSignatureBtn").onclick = () => openSignatureModal();
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

function updateRotationLabel() {
  $("rotateLabel").textContent = `${Number(state.rotation).toFixed(1).replace(".0", "")}°`;
}

async function rerenderCurrentDocument() {
  if (state.kind === "pdf") await renderPage();
  else if (state.kind === "image") {
    renderImageDocument();
    afterRender();
  } else {
    updateRotationLabel();
  }
}

$("rotateAngle").oninput = async (e) => {
  state.rotation = Number(e.target.value);
  updateRotationLabel();
  await rerenderCurrentDocument();
};
$("rotateReset").onclick = async () => {
  state.rotation = 0;
  $("rotateAngle").value = "0";
  updateRotationLabel();
  await rerenderCurrentDocument();
};

function updateLayerOffsetLabel() {
  $("layerOffsetLabel").textContent = `${state.layerOffsetY} px`;
}

function applyLayerOffset() {
  const offset = `${state.layerOffsetY}px`;
  gridEl.style.transform = `translateY(${offset})`;
  overlay.style.transform = `translateY(${offset})`;
  updateLayerOffsetLabel();
}

$("layerOffsetY").oninput = (e) => {
  state.layerOffsetY = Number(e.target.value);
  applyLayerOffset();
};
$("layerOffsetReset").onclick = () => {
  state.layerOffsetY = 0;
  $("layerOffsetY").value = "0";
  applyLayerOffset();
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
  const sizeX = Number($("gridSize").value);
  state.gridStepY = Number($("gridStepY").value);
  const mode = $("gridMode").value;
  gridEl.className = "grid" + (on ? (mode === "grid" ? " grid-cells" : " grid-lines") : "");
  gridEl.style.backgroundSize = `${sizeX}px ${state.gridStepY}px`;
  updateGridStepYLabel();
}

function updateGridStepYLabel() {
  $("gridStepYLabel").textContent = `${state.gridStepY} px`;
}

["gridToggle", "gridMode", "gridSize", "gridStepY"].forEach((id) => ($(id).oninput = applyGrid));

/* ================= 2. Текстовый слой ================= */
const textStyle = { family: "sans-serif", size: 16, bold: false, italic: false, color: "#111111", lineHeight: 1.15 };

function activeAnnot() {
  return annotsForPage().find((a) => a.id === activeAnnotId) || null;
}

function selectAnnot(a) {
  activeAnnotId = a?.id || null;
  if (a?.type === "text") {
    textStyle.family = a.family;
    textStyle.size = Math.round(a.size / RENDER_SCALE);
    textStyle.color = a.color;
    textStyle.bold = a.bold;
    textStyle.italic = a.italic;
    textStyle.lineHeight = a.lineHeight || 1.15;
    $("fontFamily").value = a.family;
    $("fontSize").value = String(textStyle.size);
    $("textColor").value = a.color;
    $("lineHeight").value = String(textStyle.lineHeight);
    updateLineHeightLabel();
    $("boldBtn").classList.toggle("active", a.bold);
    $("italicBtn").classList.toggle("active", a.italic);
  }
  updateSelectedItems();
}

function updateSelectedItems() {
  overlay.querySelectorAll(".item").forEach((el) => {
    el.classList.toggle("selected", el.dataset.id === activeAnnotId);
  });
}

function applyTextStyleToActive(change) {
  const a = activeAnnot();
  Object.assign(textStyle, change);
  if (a?.type !== "text") return;
  if (change.family) a.family = change.family;
  if (change.size) a.size = change.size * RENDER_SCALE;
  if (Object.prototype.hasOwnProperty.call(change, "bold")) a.bold = change.bold;
  if (Object.prototype.hasOwnProperty.call(change, "italic")) a.italic = change.italic;
  if (change.color) a.color = change.color;
  if (change.lineHeight) a.lineHeight = change.lineHeight;
  renderAnnots();
}

$("fontFamily").onchange = (e) => applyTextStyleToActive({ family: e.target.value });
$("fontSize").onchange = (e) => applyTextStyleToActive({ size: Number(e.target.value) });
$("textColor").oninput = (e) => applyTextStyleToActive({ color: e.target.value });
$("lineHeight").oninput = (e) => {
  const value = Number(e.target.value);
  updateLineHeightLabel(value);
  applyTextStyleToActive({ lineHeight: value });
};
$("boldBtn").onclick = (e) => {
  const a = activeAnnot();
  const next = a?.type === "text" ? !a.bold : !textStyle.bold;
  e.currentTarget.classList.toggle("active", next);
  applyTextStyleToActive({ bold: next });
};
$("italicBtn").onclick = (e) => {
  const a = activeAnnot();
  const next = a?.type === "text" ? !a.italic : !textStyle.italic;
  e.currentTarget.classList.toggle("active", next);
  applyTextStyleToActive({ italic: next });
};

function updateLineHeightLabel(value = Number($("lineHeight").value)) {
  $("lineHeightLabel").textContent = value.toFixed(2).replace(/0$/, "");
}

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
    y: snapY(y),
    text: "",
    family: textStyle.family,
    size,
    bold: textStyle.bold,
    italic: textStyle.italic,
    color: textStyle.color,
    lineHeight: textStyle.lineHeight,
  };
  annotsForPage().push(a);
  activeAnnotId = a.id;
  renderAnnots();
  const node = overlay.querySelector(`[data-id="${a.id}"] textarea`);
  node?.focus();
});

function snap(v) {
  if (!$("gridToggle").checked) return v;
  const step = Number($("gridSize").value);
  return Math.round(v / step) * step;
}

function snapY(v) {
  if (!$("gridToggle").checked) return v;
  return Math.round(v / state.gridStepY) * state.gridStepY;
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
  el.classList.toggle("selected", a.id === activeAnnotId);
  el.addEventListener("mousedown", () => selectAnnot(a));

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
    if (activeAnnotId === a.id) activeAnnotId = null;
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
  ta.style.lineHeight = String(a.lineHeight || 1.15);
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
  ta.addEventListener("focus", () => selectAnnot(a));
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
    a.y = snapY(y0 + (m.clientY - sy) / state.zoom);
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
      img.title = state.kind ? "Вставить сохранённую подпись в документ" : "Сначала выберите документ";
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

function openSignatureModal() {
  $("sigModal").hidden = false;
  renderSigStrips();
}

function closeSignatureModal() {
  $("sigModal").hidden = true;
}

$("signBtn").onclick = () => openSignatureModal();
$("sigClose").onclick = closeSignatureModal;
$("sigBack").onclick = closeSignatureModal;
$("sigModal").addEventListener("pointerdown", (e) => {
  if (e.target === $("sigModal")) closeSignatureModal();
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !$("sigModal").hidden) closeSignatureModal();
});

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

["threshold", "removeBg", "sigDarkness", "sigSharpness", "sigThickness"].forEach((id) => {
  $(id).oninput = () => {
    updateSignatureEnhancementLabels();
    if (cropImg) previewCrop();
  };
});

function updateSignatureEnhancementLabels() {
  $("sigDarknessLabel").textContent = `${$("sigDarkness").value}%`;
  $("sigSharpnessLabel").textContent = `${$("sigSharpness").value}%`;
  $("sigThicknessLabel").textContent = Number($("sigThickness").value).toFixed(2).replace(/0$/, "").replace(/\.$/, "");
}

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

  strengthenSignature(out);
  return $("removeBg").checked ? trimTransparent(out) : out;
}

function strengthenSignature(canvas) {
  const ctx = canvas.getContext("2d");
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const p = data.data;
  const removeBg = $("removeBg").checked;
  const threshold = Number($("threshold").value);
  const darkness = Number($("sigDarkness").value) / 100;
  const sharpness = Number($("sigSharpness").value) / 100;
  const thickness = Number($("sigThickness").value);
  const alphaBoost = 0.55 + darkness * 0.65 + sharpness * 0.35;
  const colorFactor = Math.max(0.03, 1 - darkness * 0.94);

  for (let i = 0; i < p.length; i += 4) {
    const lum = 0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2];
    if (removeBg && lum >= threshold) {
      p[i + 3] = 0;
      continue;
    }

    if (!removeBg && lum > 245) continue;

    const ink = removeBg
      ? Math.max(0, Math.min(1, (threshold - lum) / Math.max(1, threshold)))
      : Math.max(0, Math.min(1, (245 - lum) / 245));
    const sharpenedInk = Math.pow(ink, Math.max(0.35, 1 - sharpness * 0.65));
    const alpha = removeBg
      ? Math.min(255, Math.round(255 * sharpenedInk * alphaBoost))
      : Math.min(255, Math.round(p[i + 3] * (1 + darkness * 0.35)));

    p[i] = Math.round(p[i] * colorFactor);
    p[i + 1] = Math.round(p[i + 1] * colorFactor);
    p[i + 2] = Math.round(p[i + 2] * colorFactor);
    p[i + 3] = Math.max(p[i + 3], alpha);
  }

  if (sharpness > 0) sharpenInkEdges(p, new Uint8ClampedArray(p), canvas.width, canvas.height, sharpness);
  if (thickness > 0) thickenAlpha(p, canvas.width, canvas.height, thickness);
  ctx.putImageData(data, 0, 0);
}

function thickenAlpha(pixels, width, height, radius) {
  const original = new Uint8ClampedArray(pixels);
  const full = Math.floor(radius);
  const fractional = radius - full;
  const limit = Math.ceil(radius);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      if (original[idx + 3] > 180) continue;
      let best = 0;
      let src = -1;
      for (let dy = -limit; dy <= limit; dy++) {
        for (let dx = -limit; dx <= limit; dx++) {
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > radius) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const ni = (ny * width + nx) * 4;
          if (original[ni + 3] > best) {
            best = original[ni + 3];
            src = ni;
          }
        }
      }
      if (best > 64 && src >= 0) {
        const mix = full > 0 ? 0.82 : Math.max(0.25, fractional);
        pixels[idx] = original[src];
        pixels[idx + 1] = original[src + 1];
        pixels[idx + 2] = original[src + 2];
        pixels[idx + 3] = Math.max(pixels[idx + 3], Math.round(best * mix));
      }
    }
  }
}

function sharpenInkEdges(pixels, original, width, height, amount) {
  const strength = amount * 0.75;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      if (pixels[idx + 3] < 16) continue;
      const left = original[idx - 4 + 3];
      const right = original[idx + 4 + 3];
      const top = original[((y - 1) * width + x) * 4 + 3];
      const bottom = original[((y + 1) * width + x) * 4 + 3];
      const edge = Math.abs(original[idx + 3] * 4 - left - right - top - bottom);
      if (edge < 24) continue;
      pixels[idx + 3] = Math.min(255, Math.round(pixels[idx + 3] + edge * strength));
      pixels[idx] = Math.round(pixels[idx] * (1 - strength * 0.35));
      pixels[idx + 1] = Math.round(pixels[idx + 1] * (1 - strength * 0.35));
      pixels[idx + 2] = Math.round(pixels[idx + 2] * (1 - strength * 0.35));
    }
  }
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
    const source = document.createElement("canvas");
    source.width = Math.floor(viewport.width);
    source.height = Math.floor(viewport.height);
    const c = source.getContext("2d");
    c.fillStyle = "#fff";
    c.fillRect(0, 0, source.width, source.height);
    await page.render({ canvasContext: c, viewport }).promise;
    base = document.createElement("canvas");
    drawCanvasInto(base, source, state.rotation);
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
      const lineH = a.size * (a.lineHeight || 1.15);
      a.text.split("\n").forEach((line, i) => ctx.fillText(line, a.x + 2, a.y + state.layerOffsetY + i * lineH));
    } else {
      const img = await loadImg(a.dataUrl);
      ctx.drawImage(img, a.x, a.y + state.layerOffsetY, a.w, a.h);
    }
  }
  return out;
}

function drawCanvasInto(target, source, degrees) {
  const angle = (degrees * Math.PI) / 180;
  const sin = Math.abs(Math.sin(angle));
  const cos = Math.abs(Math.cos(angle));
  const w = source.width;
  const h = source.height;
  target.width = Math.ceil(w * cos + h * sin);
  target.height = Math.ceil(w * sin + h * cos);
  const ctx = target.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, target.width, target.height);
  ctx.translate(target.width / 2, target.height / 2);
  ctx.rotate(angle);
  ctx.drawImage(source, -w / 2, -h / 2);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
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
closeSignatureModal();
showApp();
showHome(false);
updateGridStepYLabel();
updateLineHeightLabel();
updateSignatureEnhancementLabels();
const srcParam = new URLSearchParams(location.search).get("src");
if (srcParam) openUrl(srcParam).catch((e) => alert("Не удалось открыть файл: " + e.message));
