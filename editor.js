/* PDF Signer — MVP editor
 * Слои: docCanvas (документ) -> #grid (вспомогательная сетка, НЕ экспортируется)
 *       -> #overlay (текст + подписи, экспортируется)
 */

const SIG_KEY = "pdfsigner.signatures";
const USER_KEY = "pdfsigner.user";
const DEMO_CODE = "000000";
const LANG_KEY = "pdfsigner.language";

const $ = (id) => document.getElementById(id);

const i18n = {
  ru: {
    title: "PDF Signer — редактор бланка",
    addFiles: "Добавить файлы",
    clearDocs: "Очистить",
    prevPage: "Предыдущая страница",
    nextPage: "Следующая страница",
    grid: "Сетка",
    gridCells: "В клеточку",
    gridLines: "В линейку",
    cellSize: "Размер клетки",
    rowStep: "Шаг строк",
    rowStepTitle: "Расстояние между строками сетки",
    layerOffset: "Сдвиг слоя",
    layerOffsetTitle: "Сдвиг сетки и вводимого текста",
    docSize: "Размер документа",
    docSizeTitle: "Реальный размер документа при редактировании и сохранении",
    rotation: "Поворот",
    rotationTitle: "Выравнивание скана",
    guide: "Ориентир",
    guideTitle: "Положение ориентира",
    languageTitle: "Язык интерфейса",
    createSignature: "Создать подпись",
    mySignatures: "Мои подписи",
    saveDocument: "Сохранить документ",
    home: "Главная",
    text: "Текст:",
    bold: "Жирный",
    italic: "Курсив",
    textColor: "Цвет текста",
    lift: "Подъём",
    liftTitle: "Смещение текста относительно строки",
    spacing: "Интервал",
    spacingTitle: "Межстрочный интервал текста",
    signatures: "Подписи:",
    noSaved: "нет сохранённых",
    editorHint: "Клик по документу — новое текстовое поле. Выделите строку и меняйте подъём отдельно.",
    homeTitle: "Главная страница",
    homeText: "Выберите документ, который нужно заполнить, а затем добавьте текст и подпись.",
    chooseDocument: "Выбрать документ",
    supportedFiles: "Поддерживаются PDF, DOCX и изображения. Всё обрабатывается локально в браузере.",
    signatureTitle: "Цифровая подпись",
    backToDocument: "К документу",
    draw: "Нарисовать",
    fromFileOrClipboard: "Из файла или буфера",
    thickness: "Толщина",
    clear: "Очистить",
    saveSignature: "Сохранить подпись",
    chooseFile: "Выбрать файл",
    pasteClipboard: "Вставить из буфера",
    bgThreshold: "Порог удаления фона",
    darker: "Темнее",
    sharper: "Резче",
    thicker: "Толще",
    color: "Цвет",
    purple: "Фиолетовый",
    black: "Чёрный",
    transparentBg: "Прозрачный фон",
    saveThisVariant: "Сохранить этот вариант",
    signatureImportHint: "Загрузите PDF, PNG, JPG или вставьте скриншот из буфера. Выделите подпись рамкой, светлый фон внутри выделения будет удалён.",
    previewBeforeSave: "Предпросмотр перед сохранением",
    signaturePreviewEmpty: "После выбора файла здесь появится подпись с удалённым фоном.",
    saved: "Сохранённые:",
    unsupportedOpen: "Не удалось открыть",
    legacyDocUnsupported: "Старый формат Word .doc браузерное расширение не может надёжно отрисовать напрямую. Сохраните такой файл как .docx, PDF или сделайте изображение/скриншот, затем добавьте его сюда.",
    failedFiles: "Некоторые файлы не удалось обработать:",
    docxModuleMissing: "Модуль DOCX не загружен. Проверьте файлы vendor/jszip, vendor/docx-preview и vendor/html2canvas.",
    docxReadFailed: "Не удалось прочитать DOCX",
    removePage: "Удалить лист",
    move: "Переместить",
    delete: "Удалить",
    savedSignatureName: "Подпись",
    insertSavedSignature: "Вставить сохранённую подпись в документ",
    chooseDocumentFirst: "Сначала выберите документ",
    openDocumentFirst: "Сначала откройте документ",
    drawSignatureFirst: "Сначала нарисуйте подпись",
    signaturePreviewReady: "Так подпись будет сохранена в шаблоны.",
    signaturePreviewWholeFile: "Сейчас показан весь файл. Выделите рамкой только подпись, если нужно обрезать точнее.",
    imageLoadFailed: "Не удалось загрузить изображение из этого файла",
    pdfModuleMissing: "PDF-модуль не загружен",
    signatureFileOpenFailed: "Не удалось открыть файл для поиска подписи: ",
    clipboardNoImage: "В буфере обмена не найдено изображение. Скопируйте скриншот или картинку и нажмите Ctrl+V прямо в этом окне.",
    clipboardDenied: "Браузер не дал прочитать буфер. Нажмите Ctrl+V в окне подписи или загрузите файл.",
    chooseSignatureSource: "Сначала выберите файл или вставьте изображение из буфера",
    saving: "Сохраняю…",
    saveFailed: "Не удалось сохранить документ: ",
    openFileFailed: "Не удалось открыть файл: ",
    pageNotFound: "Страница не найдена",
    page: "Страница",
  },
  de: {
    title: "PDF Signer — Formular-Editor",
    addFiles: "Dateien hinzufügen",
    clearDocs: "Leeren",
    prevPage: "Vorherige Seite",
    nextPage: "Nächste Seite",
    grid: "Raster",
    gridCells: "Kästchen",
    gridLines: "Linien",
    cellSize: "Kästchengröße",
    rowStep: "Zeilenabstand",
    rowStepTitle: "Abstand zwischen Rasterzeilen",
    layerOffset: "Ebene verschieben",
    layerOffsetTitle: "Raster und Eingabetext verschieben",
    docSize: "Dokumentgröße",
    docSizeTitle: "Tatsächliche Dokumentgröße beim Bearbeiten und Speichern",
    rotation: "Drehung",
    rotationTitle: "Scan ausrichten",
    guide: "Hilfslinie",
    guideTitle: "Position der Hilfslinie",
    languageTitle: "Sprache der Oberfläche",
    createSignature: "Signatur erstellen",
    mySignatures: "Meine Signaturen",
    saveDocument: "Dokument speichern",
    home: "Start",
    text: "Text:",
    bold: "Fett",
    italic: "Kursiv",
    textColor: "Textfarbe",
    lift: "Anheben",
    liftTitle: "Textversatz zur Zeile",
    spacing: "Abstand",
    spacingTitle: "Zeilenhöhe des Textes",
    signatures: "Signaturen:",
    noSaved: "keine gespeichert",
    editorHint: "Klick ins Dokument: neues Textfeld. Markiere eine Zeile und passe das Anheben separat an.",
    homeTitle: "Startseite",
    homeText: "Wähle das Dokument aus, das ausgefüllt werden soll, und füge dann Text und Signatur hinzu.",
    chooseDocument: "Dokument wählen",
    supportedFiles: "PDF, DOCX und Bilder werden unterstützt. Alles wird lokal im Browser verarbeitet.",
    signatureTitle: "Digitale Signatur",
    backToDocument: "Zum Dokument",
    draw: "Zeichnen",
    fromFileOrClipboard: "Aus Datei oder Zwischenablage",
    thickness: "Dicke",
    clear: "Leeren",
    saveSignature: "Signatur speichern",
    chooseFile: "Datei wählen",
    pasteClipboard: "Aus Zwischenablage einfügen",
    bgThreshold: "Hintergrund entfernen",
    darker: "Dunkler",
    sharper: "Schärfer",
    thicker: "Dicker",
    color: "Farbe",
    purple: "Violett",
    black: "Schwarz",
    transparentBg: "Transparenter Hintergrund",
    saveThisVariant: "Diese Variante speichern",
    signatureImportHint: "Lade PDF, PNG, JPG oder füge einen Screenshot ein. Markiere die Signatur; heller Hintergrund wird entfernt.",
    previewBeforeSave: "Vorschau vor dem Speichern",
    signaturePreviewEmpty: "Nach der Dateiauswahl erscheint hier die Signatur mit entferntem Hintergrund.",
    saved: "Gespeichert:",
    unsupportedOpen: "Konnte nicht öffnen",
    legacyDocUnsupported: "Das alte Word-Format .doc kann die Browser-Erweiterung nicht zuverlässig direkt darstellen. Speichere die Datei als .docx, PDF oder Bild/Screenshot und füge sie dann hier hinzu.",
    failedFiles: "Einige Dateien konnten nicht verarbeitet werden:",
    docxModuleMissing: "Das DOCX-Modul wurde nicht geladen. Prüfe vendor/jszip, vendor/docx-preview und vendor/html2canvas.",
    docxReadFailed: "DOCX konnte nicht gelesen werden",
    removePage: "Seite entfernen",
    move: "Verschieben",
    delete: "Löschen",
    savedSignatureName: "Signatur",
    insertSavedSignature: "Gespeicherte Signatur ins Dokument einfügen",
    chooseDocumentFirst: "Bitte zuerst ein Dokument wählen",
    openDocumentFirst: "Bitte zuerst ein Dokument öffnen",
    drawSignatureFirst: "Bitte zuerst eine Signatur zeichnen",
    signaturePreviewReady: "So wird die Signatur als Vorlage gespeichert.",
    signaturePreviewWholeFile: "Aktuell wird die ganze Datei gezeigt. Markiere nur die Signatur, falls genauer zugeschnitten werden soll.",
    imageLoadFailed: "Das Bild aus dieser Datei konnte nicht geladen werden",
    pdfModuleMissing: "PDF-Modul wurde nicht geladen",
    signatureFileOpenFailed: "Datei zur Signatursuche konnte nicht geöffnet werden: ",
    clipboardNoImage: "In der Zwischenablage wurde kein Bild gefunden. Kopiere einen Screenshot oder ein Bild und drücke Ctrl+V in diesem Fenster.",
    clipboardDenied: "Der Browser konnte die Zwischenablage nicht lesen. Drücke Ctrl+V im Signaturfenster oder lade eine Datei.",
    chooseSignatureSource: "Bitte zuerst eine Datei wählen oder ein Bild aus der Zwischenablage einfügen",
    saving: "Speichern…",
    saveFailed: "Dokument konnte nicht gespeichert werden: ",
    openFileFailed: "Datei konnte nicht geöffnet werden: ",
    pageNotFound: "Seite nicht gefunden",
    page: "Seite",
  },
  en: {
    title: "PDF Signer — form editor",
    addFiles: "Add files",
    clearDocs: "Clear",
    prevPage: "Previous page",
    nextPage: "Next page",
    grid: "Grid",
    gridCells: "Cells",
    gridLines: "Lines",
    cellSize: "Cell size",
    rowStep: "Row step",
    rowStepTitle: "Distance between grid rows",
    layerOffset: "Layer offset",
    layerOffsetTitle: "Move grid and entered text",
    docSize: "Document size",
    docSizeTitle: "Real document size for editing and saving",
    rotation: "Rotation",
    rotationTitle: "Align scanned document",
    guide: "Guide",
    guideTitle: "Guide position",
    languageTitle: "Interface language",
    createSignature: "Create signature",
    mySignatures: "My signatures",
    saveDocument: "Save document",
    home: "Home",
    text: "Text:",
    bold: "Bold",
    italic: "Italic",
    textColor: "Text color",
    lift: "Lift",
    liftTitle: "Text offset from the line",
    spacing: "Spacing",
    spacingTitle: "Text line height",
    signatures: "Signatures:",
    noSaved: "none saved",
    editorHint: "Click the document to add a text field. Select a line to adjust its lift separately.",
    homeTitle: "Home page",
    homeText: "Choose the document you need to fill, then add text and a signature.",
    chooseDocument: "Choose document",
    supportedFiles: "PDF, DOCX and images are supported. Everything is processed locally in the browser.",
    signatureTitle: "Digital signature",
    backToDocument: "To document",
    draw: "Draw",
    fromFileOrClipboard: "From file or clipboard",
    thickness: "Thickness",
    clear: "Clear",
    saveSignature: "Save signature",
    chooseFile: "Choose file",
    pasteClipboard: "Paste from clipboard",
    bgThreshold: "Background threshold",
    darker: "Darker",
    sharper: "Sharper",
    thicker: "Thicker",
    color: "Color",
    purple: "Purple",
    black: "Black",
    transparentBg: "Transparent background",
    saveThisVariant: "Save this variant",
    signatureImportHint: "Upload PDF, PNG, JPG or paste a screenshot. Select the signature area; light background will be removed.",
    previewBeforeSave: "Preview before saving",
    signaturePreviewEmpty: "After choosing a file, the signature with removed background will appear here.",
    saved: "Saved:",
    unsupportedOpen: "Could not open",
    legacyDocUnsupported: "The old Word .doc format cannot be rendered reliably inside the browser extension. Save it as .docx, PDF, or an image/screenshot, then add it here.",
    failedFiles: "Some files could not be processed:",
    docxModuleMissing: "DOCX module is not loaded. Check vendor/jszip, vendor/docx-preview and vendor/html2canvas.",
    docxReadFailed: "Could not read DOCX",
    removePage: "Remove page",
    move: "Move",
    delete: "Delete",
    savedSignatureName: "Signature",
    insertSavedSignature: "Insert saved signature into document",
    chooseDocumentFirst: "Choose a document first",
    openDocumentFirst: "Open a document first",
    drawSignatureFirst: "Draw a signature first",
    signaturePreviewReady: "This is how the signature will be saved as a template.",
    signaturePreviewWholeFile: "The whole file is shown now. Select only the signature if you need a tighter crop.",
    imageLoadFailed: "Could not load an image from this file",
    pdfModuleMissing: "PDF module is not loaded",
    signatureFileOpenFailed: "Could not open file for signature extraction: ",
    clipboardNoImage: "No image was found in the clipboard. Copy a screenshot or image and press Ctrl+V in this window.",
    clipboardDenied: "The browser did not allow clipboard reading. Press Ctrl+V in the signature window or upload a file.",
    chooseSignatureSource: "Choose a file or paste an image from the clipboard first",
    saving: "Saving…",
    saveFailed: "Could not save document: ",
    openFileFailed: "Could not open file: ",
    pageNotFound: "Page not found",
    page: "Page",
  },
};

let currentLang = localStorage.getItem(LANG_KEY) || "ru";

function t(key) {
  return (i18n[currentLang] && i18n[currentLang][key]) || i18n.ru[key] || key;
}

function setElementText(el, text) {
  const textNode = Array.from(el.childNodes).find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
  if (textNode) {
    textNode.textContent = text;
  } else {
    el.insertBefore(document.createTextNode(text), el.firstChild);
  }
}

function applyLanguage(lang = currentLang) {
  currentLang = i18n[lang] ? lang : "ru";
  localStorage.setItem(LANG_KEY, currentLang);
  document.documentElement.lang = currentLang;
  document.title = t("title");
  $("languageSelect").value = currentLang;
  document.querySelectorAll("[data-i18n]").forEach((el) => setElementText(el, t(el.dataset.i18n)));
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    el.title = t(el.dataset.i18nTitle);
  });
  renderSigStrips();
}

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
const guideEl = $("guide");
const docxRenderHost = $("docxRenderHost");

const state = {
  kind: null, // 'document'
  pageSources: [],
  page: 1,
  pages: 1,
  zoom: 1,
  docScale: 1,
  rotation: 0,
  layerOffsetY: 0,
  gridStepY: 20,
  guideY: 45,
  textOffsetY: -6,
  annots: {}, // { [pageNumber]: Array<annotation> }
};

let activeAnnotId = null;
let docScaleTimer = null;

function annotsForPage() {
  return (state.annots[state.page] ||= []);
}

async function openFile(file) {
  if (!file) return;
  await openFiles([file], { append: false });
}

async function openFiles(files, { append = false } = {}) {
  const list = Array.from(files || []);
  if (!list.length) return;
  if (!append) {
    resetDocumentState();
    resetDocumentAdjustments();
  }
  const unsupported = [];
  const failed = [];
  const added = [];
  for (const file of list) {
    const name = file.name || "document";
    if (isDocxFile(file)) {
      try {
        added.push(...(await renderDocxFileToSources(file)));
      } catch (err) {
        console.error(err);
        failed.push(`${name}: ${err.message}`);
      }
      continue;
    }
    if (isLegacyDocFile(file)) {
      unsupported.push(name);
      continue;
    }
    const buf = await file.arrayBuffer();
    if (file.type === "application/pdf" || /\.pdf$/i.test(name)) {
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        added.push({ type: "pdf", pdf, pageNumber, label: `${name} · ${pageNumber}/${pdf.numPages}` });
      }
    } else if (file.type.startsWith("image/") || /\.(png|jpe?g|webp|gif|bmp)$/i.test(name)) {
      const img = await loadImageElement(URL.createObjectURL(new Blob([buf], { type: file.type || "image/png" })));
      added.push({ type: "image", image: img, label: name });
    } else {
      unsupported.push(name);
    }
  }

  if (added.length) {
    const oldPages = state.pageSources.length;
    state.pageSources.push(...added);
    state.kind = "document";
    state.pages = state.pageSources.length;
    state.page = append && oldPages ? oldPages + 1 : 1;
    $("pageNav").hidden = state.pages < 2;
    $("pageCount").textContent = String(state.pages);
    await renderPage();
    await renderThumbnails();
  }

  if (unsupported.length) {
    alert(
      `${t("unsupportedOpen")}: ${unsupported.join(", ")}\n\n` +
        t("legacyDocUnsupported")
    );
  }
  if (failed.length) {
    alert(`${t("failedFiles")}\n\n` + failed.join("\n"));
  }
}

function isDocxFile(file) {
  return (
    /\.docx$/i.test(file.name || "") ||
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );
}

function isLegacyDocFile(file) {
  return (
    /\.doc$/i.test(file.name || "") ||
    file.type === "application/msword"
  );
}

async function renderDocxFileToSources(file) {
  if (!window.docx?.renderAsync || !window.html2canvas || !window.JSZip) {
    throw new Error(t("docxModuleMissing"));
  }
  try {
    docxRenderHost.innerHTML = "";
    docxRenderHost.style.display = "block";
    const buffer = await file.arrayBuffer();
    await window.docx.renderAsync(buffer, docxRenderHost, null, {
      className: "docx",
      inWrapper: true,
      breakPages: false,
      ignoreLastRenderedPageBreak: true,
      ignoreWidth: false,
      ignoreHeight: false,
      renderHeaders: true,
      renderFooters: true,
      renderFootnotes: true,
      renderEndnotes: true,
      useBase64URL: true,
    });
    if (document.fonts?.ready) await document.fonts.ready;
    await nextFrame();

    const sections = Array.from(docxRenderHost.querySelectorAll("section.docx"));
    const targets = sections.length ? sections : [docxRenderHost.querySelector(".docx-wrapper") || docxRenderHost];
    const canvases = [];
    for (const target of targets) {
      target.style.height = "auto";
      target.style.overflow = "visible";
      canvases.push(await htmlElementToCanvas(target));
    }
    const canvas = mergeCanvasesVertically(canvases);
    const img = await loadImageElement(canvas.toDataURL("image/png"));
    return [{ type: "image", image: img, label: `${file.name} · PNG` }];
  } finally {
    docxRenderHost.innerHTML = "";
    docxRenderHost.style.display = "none";
  }
}

async function htmlElementToCanvas(target) {
  return window.html2canvas(target, {
    backgroundColor: "#ffffff",
    scale: 2,
    logging: false,
    useCORS: true,
    allowTaint: true,
    width: Math.ceil(target.scrollWidth || target.getBoundingClientRect().width),
    height: Math.ceil(target.scrollHeight || target.getBoundingClientRect().height),
    windowWidth: Math.ceil(target.scrollWidth || target.getBoundingClientRect().width),
    windowHeight: Math.ceil(target.scrollHeight || target.getBoundingClientRect().height),
  });
}

function mergeCanvasesVertically(canvases) {
  if (canvases.length === 1) return canvases[0];
  const gap = 24;
  const width = Math.max(...canvases.map((canvas) => canvas.width));
  const height = canvases.reduce((sum, canvas) => sum + canvas.height, 0) + gap * (canvases.length - 1);
  const merged = document.createElement("canvas");
  merged.width = width;
  merged.height = height;
  const ctx = merged.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  let y = 0;
  for (const canvas of canvases) {
    ctx.drawImage(canvas, Math.round((width - canvas.width) / 2), y);
    y += canvas.height + gap;
  }
  return merged;
}

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

async function openUrl(url) {
  resetDocumentState();
  resetDocumentAdjustments();
  const res = await fetch(url);
  const type = res.headers.get("content-type") || "";
  const blob = new Blob([await res.arrayBuffer()], { type: type || "application/octet-stream" });
  const name = decodeURIComponent(url.split("/").pop()?.split("?")[0] || "document");
  if (type.includes("pdf") || /\.pdf(\?|$)/i.test(url)) {
    const pdf = await pdfjsLib.getDocument({ data: await blob.arrayBuffer() }).promise;
    state.pageSources = Array.from({ length: pdf.numPages }, (_, i) => ({
      type: "pdf",
      pdf,
      pageNumber: i + 1,
      label: `${name} · ${i + 1}/${pdf.numPages}`,
    }));
  } else if (
    type.includes("wordprocessingml.document") ||
    /\.docx(\?|$)/i.test(url)
  ) {
    state.pageSources = await renderDocxFileToSources(new File([blob], name, { type }));
  } else if (type.includes("msword") || /\.doc(\?|$)/i.test(url)) {
    throw new Error(t("legacyDocUnsupported"));
  } else {
    const img = await loadImageElement(URL.createObjectURL(blob));
    state.pageSources = [{ type: "image", image: img, label: name }];
  }
  state.kind = "document";
  state.pages = state.pageSources.length;
  state.page = 1;
  $("pageNav").hidden = state.pages < 2;
  $("pageCount").textContent = String(state.pages);
  await renderPage();
  await renderThumbnails();
}

function loadImageElement(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function renderPage() {
  const source = state.pageSources[state.page - 1];
  if (!source) return;
  const pageCanvas = await renderSourceCanvas(source, RENDER_SCALE);
  drawRotatedDocument(pageCanvas);
  $("pageNum").textContent = String(state.page);
  $("pageCount").textContent = String(state.pages);
  updateThumbSelection();
  afterRender();
}

async function renderSourceCanvas(source, scale = RENDER_SCALE) {
  if (source.type === "pdf") {
    const page = await source.pdf.getPage(source.pageNumber);
    const viewport = page.getViewport({ scale: scale * state.docScale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
    return canvas;
  }
  const canvas = document.createElement("canvas");
  const imageScale = (scale / RENDER_SCALE) * state.docScale;
  canvas.width = Math.max(1, Math.round(source.image.naturalWidth * imageScale));
  canvas.height = Math.max(1, Math.round(source.image.naturalHeight * imageScale));
  canvas.getContext("2d").drawImage(source.image, 0, 0, canvas.width, canvas.height);
  return canvas;
}

async function renderThumbnails() {
  const pane = $("thumbPane");
  pane.innerHTML = "";
  pane.hidden = !state.kind || state.pages < 1;
  $("canvasArea").classList.toggle("with-thumbs", !pane.hidden);
  if (pane.hidden) return;
  for (let i = 0; i < state.pageSources.length; i++) {
    const card = document.createElement("div");
    card.className = "thumb-card";
    card.dataset.page = String(i + 1);
    card.tabIndex = 0;
    const canvas = document.createElement("canvas");
    const title = document.createElement("span");
    title.className = "thumb-title";
    title.textContent = `${i + 1}. ${state.pageSources[i].label || t("page")}`;
    const remove = document.createElement("button");
    remove.className = "thumb-remove";
    remove.type = "button";
    remove.title = t("removePage");
    remove.textContent = "×";
    const openPage = async () => {
      state.page = i + 1;
      await renderPage();
    };
    card.onclick = openPage;
    card.onkeydown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openPage();
      }
    };
    remove.onclick = async (e) => {
      e.stopPropagation();
      await removeDocumentPage(i);
    };
    card.append(canvas, title, remove);
    pane.append(card);
    renderThumbnailCanvas(state.pageSources[i], canvas).catch(console.error);
  }
  updateThumbSelection();
}

async function removeDocumentPage(index) {
  if (index < 0 || index >= state.pageSources.length) return;
  const removedPage = index + 1;
  state.pageSources.splice(index, 1);
  const nextAnnots = {};
  Object.entries(state.annots).forEach(([page, items]) => {
    const pageNumber = Number(page);
    if (pageNumber === removedPage) return;
    nextAnnots[pageNumber > removedPage ? pageNumber - 1 : pageNumber] = items;
  });
  state.annots = nextAnnots;
  activeAnnotId = null;

  if (!state.pageSources.length) {
    showHome(true);
    return;
  }

  state.pages = state.pageSources.length;
  if (state.page > removedPage) state.page--;
  state.page = Math.max(1, Math.min(state.page, state.pages));
  $("pageNav").hidden = state.pages < 2;
  $("pageCount").textContent = String(state.pages);
  await renderPage();
  await renderThumbnails();
}

async function renderThumbnailCanvas(source, target) {
  const canvas = await renderSourceCanvas(source, 0.25);
  const maxW = 116;
  const scale = Math.min(maxW / canvas.width, 1);
  target.width = Math.max(1, Math.round(canvas.width * scale));
  target.height = Math.max(1, Math.round(canvas.height * scale));
  const ctx = target.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, target.width, target.height);
  ctx.drawImage(canvas, 0, 0, target.width, target.height);
}

function updateThumbSelection() {
  document.querySelectorAll(".thumb-card").forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.page) === state.page);
  });
}

function resetDocumentState() {
  state.kind = null;
  state.pageSources = [];
  state.page = 1;
  state.pages = 1;
  state.docScale = 1;
  state.annots = {};
  activeAnnotId = null;
  overlay.innerHTML = "";
  $("thumbPane").innerHTML = "";
  $("thumbPane").hidden = true;
  $("canvasArea").classList.remove("with-thumbs");
  $("docScale").value = "100";
  updateDocScaleLabel();
}

function resetDocumentAdjustments() {
  state.rotation = 0;
  state.layerOffsetY = 0;
  state.gridStepY = 20;
  state.guideY = 45;
  state.textOffsetY = -6;
  $("rotateAngle").value = "0";
  $("layerOffsetY").value = "0";
  $("gridStepY").value = String(state.gridStepY);
  $("guideY").value = String(state.guideY);
  $("textOffsetY").value = String(state.textOffsetY);
  $("guideToggle").checked = true;
  updateRotationLabel();
  updateLayerOffsetLabel();
  updateGridStepYLabel();
  applyGuide();
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
  applyGuide();
  applyLayerOffset();
  renderAnnots();
}

function showHome(reset = false) {
  closeSignatureModal();
  if (reset) {
    resetDocumentState();
    state.rotation = 0;
    state.layerOffsetY = 0;
    state.gridStepY = 20;
    state.guideY = 45;
    state.textOffsetY = -6;
    docCanvas.getContext("2d").clearRect(0, 0, docCanvas.width, docCanvas.height);
    $("fileInput").value = "";
    $("fileInput2").value = "";
    $("rotateAngle").value = "0";
    $("layerOffsetY").value = "0";
    $("gridStepY").value = String(state.gridStepY);
    $("guideY").value = String(state.guideY);
    $("textOffsetY").value = String(state.textOffsetY);
    $("guideToggle").checked = true;
    updateRotationLabel();
    updateLayerOffsetLabel();
    updateGridStepYLabel();
    applyGuide();
  }
  $("empty").hidden = false;
  $("stageWrap").hidden = true;
  $("pageNav").hidden = true;
  $("thumbPane").hidden = true;
  $("canvasArea").classList.remove("with-thumbs");
}

$("fileInput").onchange = async (e) => {
  await openFiles(e.target.files, { append: Boolean(state.kind) });
  e.target.value = "";
};
$("fileInput2").onchange = async (e) => {
  await openFiles(e.target.files, { append: false });
  e.target.value = "";
};
$("clearDocsBtn").onclick = () => showHome(true);
["dragenter", "dragover"].forEach((eventName) => {
  $("canvasArea").addEventListener(eventName, (e) => {
    e.preventDefault();
    $("canvasArea").classList.add("drag-over");
  });
});
["dragleave", "drop"].forEach((eventName) => {
  $("canvasArea").addEventListener(eventName, (e) => {
    e.preventDefault();
    $("canvasArea").classList.remove("drag-over");
  });
});
$("canvasArea").addEventListener("drop", async (e) => {
  const files = e.dataTransfer?.files;
  if (files?.length) await openFiles(files, { append: Boolean(state.kind) });
});
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
  if (state.kind) await renderPage();
  else updateRotationLabel();
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

function applyGuide() {
  guideEl.hidden = !$("guideToggle").checked || !state.kind;
  state.guideY = Number($("guideY").value);
  guideEl.style.top = `${state.guideY}%`;
}

$("guideToggle").oninput = applyGuide;
$("guideY").oninput = applyGuide;

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

/* ---------- реальный размер документа ---------- */
function updateDocScaleLabel(value = state.docScale * 100) {
  $("docScaleLabel").textContent = `${Math.round(value)}%`;
}

function scaleAllAnnotations(factor) {
  if (!Number.isFinite(factor) || factor <= 0 || Math.abs(factor - 1) < 0.001) return;
  Object.values(state.annots).forEach((items) => {
    items.forEach((a) => {
      a.x *= factor;
      a.y *= factor;
      if (a.type === "text") {
        a.size *= factor;
        if (typeof a.offsetY === "number") a.offsetY *= factor;
      } else {
        a.w *= factor;
        a.h *= factor;
      }
    });
  });
}

async function applyDocumentScale(percent) {
  const nextScale = Math.max(0.5, Math.min(2, Number(percent) / 100 || 1));
  const factor = nextScale / state.docScale;
  scaleAllAnnotations(factor);
  state.docScale = nextScale;
  updateDocScaleLabel();
  if (!state.kind) return;
  await renderPage();
  await renderThumbnails();
}

$("docScale").oninput = (e) => {
  updateDocScaleLabel(Number(e.target.value));
  clearTimeout(docScaleTimer);
  docScaleTimer = setTimeout(() => applyDocumentScale(e.target.value), 160);
};
$("docScale").onchange = (e) => {
  clearTimeout(docScaleTimer);
  applyDocumentScale(e.target.value);
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
  state.gridStepY = Math.max(8, Math.min(120, Number($("gridStepY").value) || sizeX));
  const mode = $("gridMode").value;
  gridEl.className = "grid" + (on ? (mode === "grid" ? " grid-cells" : " grid-lines") : "");
  gridEl.style.backgroundSize = `${sizeX}px ${state.gridStepY}px`;
  updateGridStepYLabel();
}

function updateGridStepYLabel() {
  $("gridStepY").value = Number(state.gridStepY).toFixed(1).replace(".0", "");
}

["gridToggle", "gridMode", "gridSize"].forEach((id) => ($(id).oninput = applyGrid));
$("gridStepY").oninput = applyGrid;
$("gridStepY").onchange = applyGrid;

/* ================= 2. Текстовый слой ================= */
const textStyle = {
  family: "sans-serif",
  size: 16,
  bold: false,
  italic: false,
  color: "#111111",
  lineHeight: 1.15,
  offsetY: -6,
};

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
    textStyle.offsetY = a.offsetY ?? state.textOffsetY;
    $("fontFamily").value = a.family;
    $("fontSize").value = String(textStyle.size);
    $("textColor").value = a.color;
    $("textOffsetY").value = String(textStyle.offsetY);
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
  if (Object.prototype.hasOwnProperty.call(change, "offsetY")) a.offsetY = change.offsetY;
  renderAnnots();
}

$("fontFamily").onchange = (e) => applyTextStyleToActive({ family: e.target.value });
$("fontSize").onchange = (e) => applyTextStyleToActive({ size: Number(e.target.value) });
$("textColor").oninput = (e) => applyTextStyleToActive({ color: e.target.value });
$("textOffsetY").oninput = (e) => {
  const value = Math.max(-40, Math.min(40, Number(e.target.value) || 0));
  $("textOffsetY").value = String(value);
  if (activeAnnot()?.type === "text") {
    applyTextStyleToActive({ offsetY: value });
  } else {
    state.textOffsetY = value;
    textStyle.offsetY = value;
  }
};
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
    offsetY: textStyle.offsetY,
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
  handle.title = t("move");
  handle.addEventListener("mousedown", (ev) => startDrag(ev, a, el));

  const del = document.createElement("button");
  del.className = "del";
  del.textContent = "×";
  del.title = t("delete");
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
  el.style.top = a.y + (a.offsetY ?? state.textOffsetY) + "px";
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
    list.unshift({ name: `${t("savedSignatureName")} ${list.length + 1}`, dataUrl, at: Date.now() });
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
      const empty = document.createElement("span");
      empty.className = "muted small";
      empty.textContent = t("noSaved");
      strip.appendChild(empty);
      return;
    }
    list.forEach((s) => {
      const img = new Image();
      img.src = s.dataUrl;
      img.title = state.kind ? t("insertSavedSignature") : t("chooseDocumentFirst");
      img.onclick = () => insertSignature(s.dataUrl);
      strip.appendChild(img);
    });
  });
}

function insertSignature(dataUrl) {
  if (!state.kind) return alert(t("openDocumentFirst"));
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
  if (!padDirty) return alert(t("drawSignatureFirst"));
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
  $("sigPreviewHint").textContent = t("signaturePreviewEmpty");
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
  img.onerror = () => alert(t("imageLoadFailed"));
  img.src = src;
}

async function setCropPdf(file) {
  resetSignatureImport();
  if (!window.pdfjsLib) return alert(t("pdfModuleMissing"));
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
    alert(t("signatureFileOpenFailed") + err.message);
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
    alert(t("clipboardNoImage"));
  } catch (err) {
    console.error(err);
    alert(t("clipboardDenied"));
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

["threshold", "removeBg", "sigDarkness", "sigSharpness", "sigThickness", "sigColor"].forEach((id) => {
  $(id).oninput = () => {
    updateSignatureEnhancementLabels();
    if (cropImg) previewCrop();
  };
});
$("sigColor").onchange = $("sigColor").oninput;

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
  const inkColor = $("sigColor").value === "black" ? [18, 18, 18] : [45, 38, 125];
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

    const mix = 0.65 + darkness * 0.35;
    p[i] = Math.round(p[i] * colorFactor * (1 - mix) + inkColor[0] * mix);
    p[i + 1] = Math.round(p[i + 1] * colorFactor * (1 - mix) + inkColor[1] * mix);
    p[i + 2] = Math.round(p[i + 2] * colorFactor * (1 - mix) + inkColor[2] * mix);
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
    ? t("signaturePreviewReady")
    : t("signaturePreviewWholeFile");
}

$("cropSave").onclick = () => {
  const sig = buildSignatureFromCrop();
  if (!sig) return alert(t("chooseSignatureSource"));
  sigStore.add(sig.toDataURL("image/png"));
};

/* ================= 4. Экспорт (сплющивание слоёв, без сетки) ================= */
async function flattenPage(pageNumber) {
  const source = state.pageSources[pageNumber - 1];
  if (!source) throw new Error(`${t("pageNotFound")}: ${pageNumber}`);
  const sourceCanvas = await renderSourceCanvas(source, RENDER_SCALE);
  const base = document.createElement("canvas");
  drawCanvasInto(base, sourceCanvas, state.rotation);

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
      a.text.split("\n").forEach((line, i) =>
        ctx.fillText(line, a.x + 2, a.y + state.layerOffsetY + (a.offsetY ?? state.textOffsetY) + i * lineH)
      );
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
  if (!state.kind) return alert(t("openDocumentFirst"));
  const btn = $("saveBtn");
  btn.disabled = true;
  btn.textContent = t("saving");
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
    alert(t("saveFailed") + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = t("saveDocument");
  }
};

/* ================= bootstrap ================= */
closeSignatureModal();
showApp();
showHome(false);
updateGridStepYLabel();
updateDocScaleLabel();
updateLineHeightLabel();
updateSignatureEnhancementLabels();
$("languageSelect").onchange = (e) => applyLanguage(e.target.value);
applyLanguage(currentLang);
const srcParam = new URLSearchParams(location.search).get("src");
if (srcParam) openUrl(srcParam).catch((e) => alert(t("openFileFailed") + e.message));
