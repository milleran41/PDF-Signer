/* BRINO — MVP editor
 * Слои: docCanvas (документ) -> #grid (вспомогательная сетка, НЕ экспортируется)
 *       -> #overlay (текст + подписи, экспортируется)
 */

const SIG_KEY = "pdfsigner.signatures";
const USER_KEY = "pdfsigner.user";
const DEMO_CODE = "000000";
const LANG_KEY = "pdfsigner.language";
const DRAFT_DB_NAME = "pdfsigner.drafts";
const DRAFT_STORE = "drafts";
const DRAFT_KEY = "current";
const RATE_LAUNCH_COUNT_KEY = "pdfsigner.rate.launchCount";
const RATE_LAST_PROMPT_KEY = "pdfsigner.rate.lastPrompt";
const RATE_DISMISSED_KEY = "pdfsigner.rate.dismissed";
const RATE_FIRST_PROMPT_AT = 5;
const RATE_REPEAT_EVERY = 5;
const HIDDEN_MARK = "CodeWerk Studio | BRINO";
const HIDDEN_MARK_KEYWORDS = "CodeWerk Studio, BRINO, hidden origin mark";

const $ = (id) => document.getElementById(id);

const i18n = {
  ru: {
    title: "BRINO — редактор бланка",
    addFiles: "Добавить файлы",
    addTextField: "Добавить текстовое поле",
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
    zoomView: "Просмотр",
    rotation: "Поворот",
    rotationTitle: "Выравнивание скана",
    guide: "Ориентир",
    guideTitle: "Положение ориентира",
    languageTitle: "Язык интерфейса",
    helpTitle: "Справка",
    helpHowTitle: "Как пользоваться",
    helpButtonsTitle: "Назначение кнопок",
    helpStep1: "Нажмите «Добавить файлы» или выберите документ на главной странице. Можно добавлять PDF, DOCX и изображения.",
    helpStep2: "Выберите нужный лист слева. Ненужные листы можно удалить крестиком на миниатюре.",
    helpStep3: "Выровняйте скан поворотом и при необходимости настройте общий размер документа.",
    helpStep4: "Нажмите «Добавить текстовое поле» или кликните по документу. Поле можно перетаскивать и менять шрифт, цвет, подъём и интервал.",
    helpStep5: "Создайте или выберите сохранённую подпись, вставьте её в документ и нажмите «Сохранить документ».",
    helpAddFiles: "Загружает один или несколько документов в редактор.",
    helpAddTextField: "Добавляет новое поле в центр видимой части документа. Его можно перетащить в нужное место.",
    helpClearDocs: "Удаляет все загруженные листы и возвращает главную страницу.",
    helpGrid: "Включает вспомогательную сетку или линейки. В сохранённый документ она не попадает.",
    helpRowStep: "Меняет расстояние между горизонтальными линиями в режиме «В линейку». В режиме «В клеточку» клетки всегда остаются квадратными.",
    helpLayerOffset: "Двигает сетку и общий слой ввода выше или ниже.",
    helpDocSize: "Увеличивает или уменьшает сам документ для удобной работы и сохранения.",
    helpZoomView: "Меняет только масштаб просмотра на экране. На размер сохранённого документа не влияет.",
    helpRotation: "Слегка поворачивает криво отсканированный документ.",
    helpGuide: "Показывает красную линию, по которой удобно выравнивать скан.",
    helpCreateSignature: "Открывает окно создания подписи: можно нарисовать, загрузить файл или вставить из буфера.",
    helpMySignatures: "Открывает страницу с сохранёнными шаблонами подписей.",
    helpSignatureStrip: "Показывает сохранённые подписи для быстрой вставки в документ.",
    helpSave: "Сохраняет весь загруженный документ целиком в выбранном формате.",
    rateTitle: "Нравится BRINO?",
    rateText: "Если программа помогает вам заполнять документы и экономить бумагу, пожалуйста, поставьте оценку или оставьте отзыв в Microsoft Edge Add-ons.",
    rateNow: "Оценить",
    rateLater: "Позже",
    rateNever: "Больше не показывать",
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
    editorHint: "Добавьте текстовое поле кнопкой сверху или кликом по документу. Каждое поле можно перетаскивать отдельно.",
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
    clipboardPressCtrlV: "Нажмите Ctrl+V прямо сейчас в этом окне. Браузер иногда не отдаёт изображение кнопке, но обычная вставка работает.",
    chooseSignatureSource: "Сначала выберите файл или вставьте изображение из буфера",
    saving: "Сохраняю…",
    saveFailed: "Не удалось сохранить документ: ",
    openFileFailed: "Не удалось открыть файл: ",
    pageNotFound: "Страница не найдена",
    page: "Страница",
  },
  de: {
    title: "BRINO — Formular-Editor",
    addFiles: "Dateien hinzufügen",
    addTextField: "Textfeld hinzufügen",
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
    zoomView: "Ansicht",
    rotation: "Drehung",
    rotationTitle: "Scan ausrichten",
    guide: "Hilfslinie",
    guideTitle: "Position der Hilfslinie",
    languageTitle: "Sprache der Oberfläche",
    helpTitle: "Hilfe",
    helpHowTitle: "So funktioniert es",
    helpButtonsTitle: "Schaltflächen",
    helpStep1: "Klicke auf „Dateien hinzufügen“ oder wähle ein Dokument auf der Startseite. PDF, DOCX und Bilder sind möglich.",
    helpStep2: "Wähle links die gewünschte Seite. Nicht benötigte Seiten kannst du mit dem Kreuz auf der Miniatur entfernen.",
    helpStep3: "Richte den Scan mit Drehung aus und passe bei Bedarf die gesamte Dokumentgröße an.",
    helpStep4: "Klicke auf „Textfeld hinzufügen“ oder ins Dokument. Das Feld lässt sich verschieben und in Schrift, Farbe, Anheben und Abstand ändern.",
    helpStep5: "Erstelle oder wähle eine gespeicherte Signatur, füge sie in das Dokument ein und klicke auf „Dokument speichern“.",
    helpAddFiles: "Lädt ein oder mehrere Dokumente in den Editor.",
    helpAddTextField: "Fügt ein neues Feld in die Mitte des sichtbaren Dokumentbereichs ein. Du kannst es an die gewünschte Stelle ziehen.",
    helpClearDocs: "Entfernt alle geladenen Seiten und zeigt wieder die Startseite.",
    helpGrid: "Schaltet das Hilfsraster oder Linien ein. Es wird nicht mit gespeichert.",
    helpRowStep: "Ändert den Abstand zwischen horizontalen Linien im Linienmodus. Im Kästchenmodus bleiben die Zellen immer quadratisch.",
    helpLayerOffset: "Verschiebt Raster und Eingabeebene nach oben oder unten.",
    helpDocSize: "Vergrößert oder verkleinert das Dokument zum Bearbeiten und Speichern.",
    helpZoomView: "Ändert nur die Bildschirmansicht. Die Größe des gespeicherten Dokuments bleibt unverändert.",
    helpRotation: "Dreht einen schief gescannten Beleg leicht.",
    helpGuide: "Zeigt eine rote Linie zum Ausrichten des Scans.",
    helpCreateSignature: "Öffnet das Signaturfenster: zeichnen, Datei laden oder aus der Zwischenablage einfügen.",
    helpMySignatures: "Öffnet die Seite mit gespeicherten Signaturvorlagen.",
    helpSignatureStrip: "Zeigt gespeicherte Signaturen zum schnellen Einfügen.",
    helpSave: "Speichert das ganze geladene Dokument im gewählten Format.",
    rateTitle: "Gefällt dir BRINO?",
    rateText: "Wenn dir das Programm beim Ausfüllen von Dokumenten hilft und Papier spart, gib bitte eine Bewertung oder Rezension bei Microsoft Edge Add-ons ab.",
    rateNow: "Bewerten",
    rateLater: "Später",
    rateNever: "Nicht mehr anzeigen",
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
    editorHint: "Füge ein Textfeld über die Schaltfläche oben oder per Klick ins Dokument hinzu. Jedes Feld kann separat verschoben werden.",
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
    clipboardPressCtrlV: "Drücke jetzt Ctrl+V in diesem Fenster. Der Browser gibt das Bild manchmal nicht an die Schaltfläche frei, aber normales Einfügen funktioniert.",
    chooseSignatureSource: "Bitte zuerst eine Datei wählen oder ein Bild aus der Zwischenablage einfügen",
    saving: "Speichern…",
    saveFailed: "Dokument konnte nicht gespeichert werden: ",
    openFileFailed: "Datei konnte nicht geöffnet werden: ",
    pageNotFound: "Seite nicht gefunden",
    page: "Seite",
  },
  en: {
    title: "BRINO — form editor",
    addFiles: "Add files",
    addTextField: "Add text field",
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
    zoomView: "View",
    rotation: "Rotation",
    rotationTitle: "Align scanned document",
    guide: "Guide",
    guideTitle: "Guide position",
    languageTitle: "Interface language",
    helpTitle: "Help",
    helpHowTitle: "How to use",
    helpButtonsTitle: "Button guide",
    helpStep1: "Click Add files or choose a document on the home page. You can add PDF, DOCX and image files.",
    helpStep2: "Select the needed page on the left. Remove unnecessary pages with the cross on the thumbnail.",
    helpStep3: "Straighten the scan with rotation and adjust the overall document size if needed.",
    helpStep4: "Click Add text field or click the document. The field can be dragged and edited with font, color, lift and spacing controls.",
    helpStep5: "Create or choose a saved signature, insert it into the document, then click Save document.",
    helpAddFiles: "Loads one or more documents into the editor.",
    helpAddTextField: "Adds a new field in the center of the visible document area. You can drag it to the exact place you need.",
    helpClearDocs: "Removes all loaded pages and returns to the home page.",
    helpGrid: "Turns the helper grid or ruled lines on. It is not exported into the saved document.",
    helpRowStep: "Changes the distance between horizontal lines in lined mode. In cell mode, cells always stay square.",
    helpLayerOffset: "Moves the grid and input layer up or down.",
    helpDocSize: "Scales the document for editing and saving.",
    helpZoomView: "Changes only the on-screen view scale. It does not affect the saved document size.",
    helpRotation: "Slightly rotates a skewed scanned document.",
    helpGuide: "Shows a red line for scan alignment.",
    helpCreateSignature: "Opens the signature window: draw, load a file or paste from the clipboard.",
    helpMySignatures: "Opens the page with saved signature templates.",
    helpSignatureStrip: "Shows saved signatures for quick insertion.",
    helpSave: "Saves the entire loaded document in the selected format.",
    rateTitle: "Enjoying BRINO?",
    rateText: "If the app helps you fill documents and save paper, please leave a rating or review in Microsoft Edge Add-ons.",
    rateNow: "Rate",
    rateLater: "Later",
    rateNever: "Don't show again",
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
    editorHint: "Add a text field with the top button or by clicking the document. Each field can be moved separately.",
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
    clipboardPressCtrlV: "Press Ctrl+V in this window now. The browser sometimes does not expose the image to the button, but normal paste works.",
    chooseSignatureSource: "Choose a file or paste an image from the clipboard first",
    saving: "Saving…",
    saveFailed: "Could not save document: ",
    openFileFailed: "Could not open file: ",
    pageNotFound: "Page not found",
    page: "Page",
  },
};

const extraLocales = {
  es: {
    title: "BRINO — editor de formularios",
    addFiles: "Añadir archivos",
    addTextField: "Añadir campo de texto",
    clearDocs: "Limpiar",
    prevPage: "Página anterior",
    nextPage: "Página siguiente",
    grid: "Cuadrícula",
    gridCells: "Celdas",
    gridLines: "Líneas",
    cellSize: "Tamaño de celda",
    rowStep: "Paso de línea",
    rowStepTitle: "Distancia entre líneas de la cuadrícula",
    layerOffset: "Desplazar capa",
    layerOffsetTitle: "Mover la cuadrícula y el texto introducido",
    docSize: "Tamaño del documento",
    docSizeTitle: "Tamaño real del documento al editar y guardar",
    zoomView: "Vista",
    rotation: "Rotación",
    rotationTitle: "Alinear el escaneo",
    guide: "Guía",
    guideTitle: "Posición de la guía",
    languageTitle: "Idioma de la interfaz",
    helpTitle: "Ayuda",
    helpHowTitle: "Cómo usar",
    helpButtonsTitle: "Guía de botones",
    helpStep1: "Haz clic en Añadir archivos o elige un documento en la página principal. Puedes añadir PDF, DOCX e imágenes.",
    helpStep2: "Selecciona la página necesaria a la izquierda. Elimina páginas innecesarias con la cruz de la miniatura.",
    helpStep3: "Endereza el escaneo con la rotación y ajusta el tamaño general del documento si hace falta.",
    helpStep4: "Haz clic en Añadir campo de texto o en el documento. El campo se puede arrastrar y editar con fuente, color, elevación y espaciado.",
    helpStep5: "Crea o elige una firma guardada, insértala en el documento y haz clic en Guardar documento.",
    helpAddFiles: "Carga uno o varios documentos en el editor.",
    helpAddTextField: "Añade un nuevo campo en el centro de la parte visible del documento. Puedes arrastrarlo al lugar exacto.",
    helpClearDocs: "Elimina todas las páginas cargadas y vuelve a la página principal.",
    helpGrid: "Activa la cuadrícula auxiliar o las líneas. No se exporta al documento guardado.",
    helpRowStep: "Cambia la distancia entre las líneas horizontales de la cuadrícula.",
    helpLayerOffset: "Mueve la cuadrícula y la capa de entrada hacia arriba o abajo.",
    helpDocSize: "Escala el documento para editarlo y guardarlo.",
    helpZoomView: "Cambia solo la escala de vista en pantalla. No afecta al tamaño del documento guardado.",
    helpRotation: "Gira ligeramente un documento escaneado torcido.",
    helpGuide: "Muestra una línea roja para alinear el escaneo.",
    helpCreateSignature: "Abre la ventana de firma: dibujar, cargar un archivo o pegar desde el portapapeles.",
    helpMySignatures: "Abre la página con plantillas de firma guardadas.",
    helpSignatureStrip: "Muestra firmas guardadas para insertarlas rápidamente.",
    helpSave: "Guarda todo el documento cargado en el formato elegido.",
    createSignature: "Crear firma",
    mySignatures: "Mis firmas",
    saveDocument: "Guardar documento",
    text: "Texto:",
    bold: "Negrita",
    italic: "Cursiva",
    textColor: "Color del texto",
    lift: "Elevación",
    liftTitle: "Desplazamiento del texto respecto a la línea",
    spacing: "Espaciado",
    spacingTitle: "Altura de línea del texto",
    signatures: "Firmas:",
    noSaved: "ninguna guardada",
    editorHint: "Añade un campo de texto con el botón superior o haciendo clic en el documento. Cada campo se puede mover por separado.",
    homeTitle: "Página principal",
    homeText: "Elige el documento que necesitas rellenar y luego añade texto y firma.",
    chooseDocument: "Elegir documento",
    supportedFiles: "Se admiten PDF, DOCX e imágenes. Todo se procesa localmente en el navegador.",
    signatureTitle: "Firma digital",
    backToDocument: "Al documento",
    draw: "Dibujar",
    fromFileOrClipboard: "Desde archivo o portapapeles",
    thickness: "Grosor",
    clear: "Limpiar",
    saveSignature: "Guardar firma",
    chooseFile: "Elegir archivo",
    pasteClipboard: "Pegar desde portapapeles",
    bgThreshold: "Umbral de fondo",
    darker: "Más oscuro",
    sharper: "Más nítido",
    thicker: "Más grueso",
    color: "Color",
    purple: "Violeta",
    black: "Negro",
    transparentBg: "Fondo transparente",
    saveThisVariant: "Guardar esta variante",
    previewBeforeSave: "Vista previa antes de guardar",
    saved: "Guardadas:",
    removePage: "Eliminar página",
    move: "Mover",
    delete: "Eliminar",
    page: "Página",
  },
  fr: {
    title: "BRINO — éditeur de formulaire",
    addFiles: "Ajouter des fichiers",
    addTextField: "Ajouter un champ texte",
    clearDocs: "Effacer",
    prevPage: "Page précédente",
    nextPage: "Page suivante",
    grid: "Grille",
    gridCells: "Carreaux",
    gridLines: "Lignes",
    cellSize: "Taille des carreaux",
    rowStep: "Pas des lignes",
    rowStepTitle: "Distance entre les lignes de la grille",
    layerOffset: "Décalage du calque",
    layerOffsetTitle: "Déplacer la grille et le texte saisi",
    docSize: "Taille du document",
    docSizeTitle: "Taille réelle du document lors de l’édition et de l’enregistrement",
    zoomView: "Vue",
    rotation: "Rotation",
    rotationTitle: "Aligner le scan",
    guide: "Repère",
    guideTitle: "Position du repère",
    languageTitle: "Langue de l’interface",
    helpTitle: "Aide",
    helpHowTitle: "Mode d’emploi",
    helpButtonsTitle: "Rôle des boutons",
    helpStep1: "Cliquez sur Ajouter des fichiers ou choisissez un document sur la page d’accueil. PDF, DOCX et images sont acceptés.",
    helpStep2: "Sélectionnez la page voulue à gauche. Supprimez les pages inutiles avec la croix sur la miniature.",
    helpStep3: "Redressez le scan avec la rotation et ajustez la taille générale du document si nécessaire.",
    helpStep4: "Cliquez sur Ajouter un champ texte ou sur le document. Le champ peut être déplacé et modifié avec la police, la couleur, le décalage et l’interligne.",
    helpStep5: "Créez ou choisissez une signature enregistrée, insérez-la dans le document, puis cliquez sur Enregistrer le document.",
    helpAddFiles: "Charge un ou plusieurs documents dans l’éditeur.",
    helpAddTextField: "Ajoute un nouveau champ au centre de la zone visible du document. Vous pouvez le faire glisser à l’endroit voulu.",
    helpClearDocs: "Supprime toutes les pages chargées et revient à la page d’accueil.",
    helpGrid: "Active la grille ou les lignes d’aide. Elle n’est pas exportée dans le document enregistré.",
    helpRowStep: "Modifie la distance entre les lignes horizontales de la grille.",
    helpLayerOffset: "Déplace la grille et le calque de saisie vers le haut ou le bas.",
    helpDocSize: "Agrandit ou réduit le document pour l’édition et l’enregistrement.",
    helpZoomView: "Change seulement l’échelle d’affichage à l’écran. N’influence pas la taille du document enregistré.",
    helpRotation: "Fait pivoter légèrement un document scanné de travers.",
    helpGuide: "Affiche une ligne rouge pour aligner le scan.",
    helpCreateSignature: "Ouvre la fenêtre de signature : dessiner, charger un fichier ou coller depuis le presse-papiers.",
    helpMySignatures: "Ouvre la page des modèles de signature enregistrés.",
    helpSignatureStrip: "Affiche les signatures enregistrées pour une insertion rapide.",
    helpSave: "Enregistre tout le document chargé dans le format choisi.",
    createSignature: "Créer une signature",
    mySignatures: "Mes signatures",
    saveDocument: "Enregistrer le document",
    text: "Texte :",
    bold: "Gras",
    italic: "Italique",
    textColor: "Couleur du texte",
    lift: "Décalage",
    liftTitle: "Décalage du texte par rapport à la ligne",
    spacing: "Interligne",
    spacingTitle: "Hauteur de ligne du texte",
    signatures: "Signatures :",
    noSaved: "aucune enregistrée",
    editorHint: "Ajoutez un champ texte avec le bouton du haut ou en cliquant sur le document. Chaque champ peut être déplacé séparément.",
    homeTitle: "Page d’accueil",
    homeText: "Choisissez le document à remplir, puis ajoutez du texte et une signature.",
    chooseDocument: "Choisir un document",
    supportedFiles: "PDF, DOCX et images sont pris en charge. Tout est traité localement dans le navigateur.",
    signatureTitle: "Signature numérique",
    backToDocument: "Au document",
    draw: "Dessiner",
    fromFileOrClipboard: "Depuis fichier ou presse-papiers",
    thickness: "Épaisseur",
    clear: "Effacer",
    saveSignature: "Enregistrer la signature",
    chooseFile: "Choisir un fichier",
    pasteClipboard: "Coller depuis le presse-papiers",
    bgThreshold: "Seuil du fond",
    darker: "Plus sombre",
    sharper: "Plus net",
    thicker: "Plus épais",
    color: "Couleur",
    purple: "Violet",
    black: "Noir",
    transparentBg: "Fond transparent",
    saveThisVariant: "Enregistrer cette variante",
    previewBeforeSave: "Aperçu avant enregistrement",
    saved: "Enregistrées :",
    removePage: "Supprimer la page",
    move: "Déplacer",
    delete: "Supprimer",
    page: "Page",
  },
  it: {
    title: "BRINO — editor moduli",
    addFiles: "Aggiungi file",
    addTextField: "Aggiungi campo testo",
    clearDocs: "Cancella",
    grid: "Griglia",
    gridCells: "Quadretti",
    gridLines: "Righe",
    rowStep: "Passo righe",
    layerOffset: "Sposta livello",
    docSize: "Dimensione documento",
    zoomView: "Vista",
    rotation: "Rotazione",
    guide: "Guida",
    languageTitle: "Lingua dell’interfaccia",
    helpTitle: "Aiuto",
    helpHowTitle: "Come usare",
    helpButtonsTitle: "Guida ai pulsanti",
    helpStep1: "Fai clic su Aggiungi file o scegli un documento nella pagina principale. Puoi aggiungere PDF, DOCX e immagini.",
    helpStep2: "Seleziona la pagina necessaria a sinistra. Elimina le pagine inutili con la croce sulla miniatura.",
    helpStep3: "Raddrizza la scansione con la rotazione e, se serve, regola la dimensione generale del documento.",
    helpStep4: "Fai clic su Aggiungi campo testo o sul documento. Il campo può essere trascinato e modificato.",
    helpStep5: "Crea o scegli una firma salvata, inseriscila nel documento e fai clic su Salva documento.",
    helpAddFiles: "Carica uno o più documenti nell’editor.",
    helpAddTextField: "Aggiunge un nuovo campo al centro dell’area visibile del documento. Puoi trascinarlo nel punto esatto.",
    helpClearDocs: "Rimuove tutte le pagine caricate e torna alla pagina principale.",
    helpGrid: "Attiva la griglia o le righe di aiuto. Non viene esportata nel documento salvato.",
    helpRowStep: "Cambia la distanza tra le righe orizzontali della griglia.",
    helpLayerOffset: "Sposta la griglia e il livello di inserimento in alto o in basso.",
    helpDocSize: "Ridimensiona il documento per modifica e salvataggio.",
    helpZoomView: "Cambia solo la vista sullo schermo. Non modifica la dimensione del documento salvato.",
    helpRotation: "Ruota leggermente un documento acquisito storto.",
    helpGuide: "Mostra una linea rossa per allineare la scansione.",
    helpCreateSignature: "Apre la finestra della firma: disegna, carica un file o incolla dagli appunti.",
    helpMySignatures: "Apre la pagina con i modelli di firma salvati.",
    helpSignatureStrip: "Mostra le firme salvate per inserirle rapidamente.",
    helpSave: "Salva l’intero documento caricato nel formato scelto.",
    createSignature: "Crea firma",
    mySignatures: "Le mie firme",
    saveDocument: "Salva documento",
    text: "Testo:",
    bold: "Grassetto",
    italic: "Corsivo",
    textColor: "Colore testo",
    lift: "Alza",
    spacing: "Interlinea",
    signatures: "Firme:",
    noSaved: "nessuna salvata",
    editorHint: "Aggiungi un campo testo con il pulsante in alto o facendo clic sul documento. Ogni campo può essere spostato separatamente.",
    homeTitle: "Pagina principale",
    homeText: "Scegli il documento da compilare, poi aggiungi testo e firma.",
    chooseDocument: "Scegli documento",
    signatureTitle: "Firma digitale",
    backToDocument: "Al documento",
    draw: "Disegna",
    fromFileOrClipboard: "Da file o appunti",
    thickness: "Spessore",
    clear: "Cancella",
    saveSignature: "Salva firma",
    chooseFile: "Scegli file",
    pasteClipboard: "Incolla dagli appunti",
    darker: "Più scuro",
    sharper: "Più nitido",
    thicker: "Più spesso",
    color: "Colore",
    purple: "Viola",
    black: "Nero",
    removePage: "Rimuovi pagina",
    page: "Pagina",
  },
  pt: {
    title: "BRINO — editor de formulários",
    addFiles: "Adicionar arquivos",
    addTextField: "Adicionar campo de texto",
    clearDocs: "Limpar",
    grid: "Grade",
    gridCells: "Células",
    gridLines: "Linhas",
    rowStep: "Passo das linhas",
    layerOffset: "Deslocar camada",
    docSize: "Tamanho do documento",
    zoomView: "Visualização",
    rotation: "Rotação",
    guide: "Guia",
    languageTitle: "Idioma da interface",
    helpTitle: "Ajuda",
    helpHowTitle: "Como usar",
    helpButtonsTitle: "Guia dos botões",
    helpStep1: "Clique em Adicionar arquivos ou escolha um documento na página inicial. Você pode adicionar PDF, DOCX e imagens.",
    helpStep2: "Selecione a página desejada à esquerda. Remova páginas desnecessárias com o X da miniatura.",
    helpStep3: "Endireite o escaneamento com a rotação e ajuste o tamanho geral do documento se necessário.",
    helpStep4: "Clique em Adicionar campo de texto ou no documento. O campo pode ser arrastado e editado.",
    helpStep5: "Crie ou escolha uma assinatura salva, insira no documento e clique em Salvar documento.",
    helpAddFiles: "Carrega um ou mais documentos no editor.",
    helpAddTextField: "Adiciona um novo campo no centro da parte visível do documento. Você pode arrastá-lo para o lugar certo.",
    helpClearDocs: "Remove todas as páginas carregadas e volta para a página inicial.",
    helpGrid: "Ativa a grade ou linhas auxiliares. Ela não é exportada no documento salvo.",
    helpRowStep: "Altera a distância entre as linhas horizontais da grade.",
    helpLayerOffset: "Move a grade e a camada de entrada para cima ou para baixo.",
    helpDocSize: "Redimensiona o documento para edição e salvamento.",
    helpZoomView: "Altera apenas a visualização na tela. Não afeta o tamanho do documento salvo.",
    helpRotation: "Gira levemente um documento escaneado torto.",
    helpGuide: "Mostra uma linha vermelha para alinhar o escaneamento.",
    helpCreateSignature: "Abre a janela de assinatura: desenhar, carregar arquivo ou colar da área de transferência.",
    helpMySignatures: "Abre a página com modelos de assinatura salvos.",
    helpSignatureStrip: "Mostra assinaturas salvas para inserção rápida.",
    helpSave: "Salva todo o documento carregado no formato escolhido.",
    createSignature: "Criar assinatura",
    mySignatures: "Minhas assinaturas",
    saveDocument: "Salvar documento",
    text: "Texto:",
    bold: "Negrito",
    italic: "Itálico",
    textColor: "Cor do texto",
    lift: "Elevar",
    spacing: "Espaçamento",
    signatures: "Assinaturas:",
    noSaved: "nenhuma salva",
    editorHint: "Adicione um campo de texto com o botão superior ou clicando no documento. Cada campo pode ser movido separadamente.",
    homeTitle: "Página inicial",
    homeText: "Escolha o documento que precisa preencher e depois adicione texto e assinatura.",
    chooseDocument: "Escolher documento",
    signatureTitle: "Assinatura digital",
    backToDocument: "Ao documento",
    draw: "Desenhar",
    fromFileOrClipboard: "De arquivo ou área de transferência",
    thickness: "Espessura",
    clear: "Limpar",
    saveSignature: "Salvar assinatura",
    chooseFile: "Escolher arquivo",
    pasteClipboard: "Colar da área de transferência",
    darker: "Mais escuro",
    sharper: "Mais nítido",
    thicker: "Mais grosso",
    color: "Cor",
    purple: "Roxo",
    black: "Preto",
    removePage: "Remover página",
    page: "Página",
  },
  pl: {
    title: "BRINO — edytor formularzy",
    addFiles: "Dodaj pliki",
    addTextField: "Dodaj pole tekstowe",
    clearDocs: "Wyczyść",
    grid: "Siatka",
    gridCells: "Kratka",
    gridLines: "Linie",
    rowStep: "Odstęp linii",
    layerOffset: "Przesunięcie warstwy",
    docSize: "Rozmiar dokumentu",
    zoomView: "Widok",
    rotation: "Obrót",
    guide: "Prowadnica",
    languageTitle: "Język interfejsu",
    helpTitle: "Pomoc",
    helpHowTitle: "Jak używać",
    helpButtonsTitle: "Opis przycisków",
    helpStep1: "Kliknij Dodaj pliki albo wybierz dokument na stronie głównej. Możesz dodać PDF, DOCX i obrazy.",
    helpStep2: "Wybierz potrzebną stronę po lewej. Niepotrzebne strony usuń krzyżykiem na miniaturze.",
    helpStep3: "Wyprostuj skan obrotem i w razie potrzeby ustaw ogólny rozmiar dokumentu.",
    helpStep4: "Kliknij Dodaj pole tekstowe albo kliknij dokument. Pole można przeciągać i edytować.",
    helpStep5: "Utwórz lub wybierz zapisaną podpis, wstaw go do dokumentu i kliknij Zapisz dokument.",
    helpAddFiles: "Wczytuje jeden lub kilka dokumentów do edytora.",
    helpAddTextField: "Dodaje nowe pole na środku widocznej części dokumentu. Można je przeciągnąć w dokładne miejsce.",
    helpClearDocs: "Usuwa wszystkie wczytane strony i wraca do strony głównej.",
    helpGrid: "Włącza pomocniczą siatkę lub linie. Nie trafia ona do zapisanego dokumentu.",
    helpRowStep: "Zmienia odległość między poziomymi liniami siatki.",
    helpLayerOffset: "Przesuwa siatkę i warstwę wpisywania w górę lub w dół.",
    helpDocSize: "Skaluje dokument do edycji i zapisu.",
    helpZoomView: "Zmienia tylko skalę widoku na ekranie. Nie wpływa na rozmiar zapisanego dokumentu.",
    helpRotation: "Lekko obraca krzywo zeskanowany dokument.",
    helpGuide: "Pokazuje czerwoną linię do wyrównania skanu.",
    helpCreateSignature: "Otwiera okno podpisu: rysowanie, plik lub wklejenie ze schowka.",
    helpMySignatures: "Otwiera stronę zapisanych szablonów podpisów.",
    helpSignatureStrip: "Pokazuje zapisane podpisy do szybkiego wstawienia.",
    helpSave: "Zapisuje cały wczytany dokument w wybranym formacie.",
    createSignature: "Utwórz podpis",
    mySignatures: "Moje podpisy",
    saveDocument: "Zapisz dokument",
    text: "Tekst:",
    bold: "Pogrubienie",
    italic: "Kursywa",
    textColor: "Kolor tekstu",
    lift: "Podnieś",
    spacing: "Interlinia",
    signatures: "Podpisy:",
    noSaved: "brak zapisanych",
    editorHint: "Dodaj pole tekstowe przyciskiem u góry albo kliknięciem dokumentu. Każde pole można przesuwać osobno.",
    homeTitle: "Strona główna",
    chooseDocument: "Wybierz dokument",
    signatureTitle: "Podpis cyfrowy",
    backToDocument: "Do dokumentu",
    draw: "Rysuj",
    fromFileOrClipboard: "Z pliku lub schowka",
    thickness: "Grubość",
    clear: "Wyczyść",
    saveSignature: "Zapisz podpis",
    chooseFile: "Wybierz plik",
    pasteClipboard: "Wklej ze schowka",
    darker: "Ciemniej",
    sharper: "Ostrzej",
    thicker: "Grubiej",
    color: "Kolor",
    purple: "Fioletowy",
    black: "Czarny",
    removePage: "Usuń stronę",
    page: "Strona",
  },
  uk: {
    title: "BRINO — редактор бланків",
    addFiles: "Додати файли",
    addTextField: "Додати текстове поле",
    clearDocs: "Очистити",
    grid: "Сітка",
    gridCells: "У клітинку",
    gridLines: "У лінійку",
    rowStep: "Крок рядків",
    layerOffset: "Зсув шару",
    docSize: "Розмір документа",
    zoomView: "Перегляд",
    rotation: "Поворот",
    guide: "Орієнтир",
    languageTitle: "Мова інтерфейсу",
    helpTitle: "Довідка",
    helpHowTitle: "Як користуватися",
    helpButtonsTitle: "Призначення кнопок",
    helpStep1: "Натисніть Додати файли або виберіть документ на головній сторінці. Можна додавати PDF, DOCX і зображення.",
    helpStep2: "Виберіть потрібний аркуш ліворуч. Непотрібні сторінки можна видалити хрестиком на мініатюрі.",
    helpStep3: "Вирівняйте скан поворотом і за потреби налаштуйте загальний розмір документа.",
    helpStep4: "Натисніть Додати текстове поле або клацніть по документу. Поле можна перетягувати й редагувати.",
    helpStep5: "Створіть або виберіть збережений підпис, вставте його в документ і натисніть Зберегти документ.",
    helpAddFiles: "Завантажує один або кілька документів у редактор.",
    helpAddTextField: "Додає нове поле в центр видимої частини документа. Його можна перетягнути в потрібне місце.",
    helpClearDocs: "Видаляє всі завантажені аркуші й повертає головну сторінку.",
    helpGrid: "Вмикає допоміжну сітку або лінії. У збережений документ вона не потрапляє.",
    helpRowStep: "Змінює відстань між горизонтальними лініями сітки.",
    helpLayerOffset: "Рухає сітку і шар введення вище або нижче.",
    helpDocSize: "Масштабує документ для редагування і збереження.",
    helpZoomView: "Змінює тільки масштаб перегляду на екрані. Не впливає на розмір збереженого документа.",
    helpRotation: "Злегка повертає криво відсканований документ.",
    helpGuide: "Показує червону лінію для вирівнювання скану.",
    helpCreateSignature: "Відкриває вікно підпису: намалювати, завантажити файл або вставити з буфера.",
    helpMySignatures: "Відкриває сторінку зі збереженими шаблонами підписів.",
    helpSignatureStrip: "Показує збережені підписи для швидкого вставлення.",
    helpSave: "Зберігає весь завантажений документ у вибраному форматі.",
    createSignature: "Створити підпис",
    mySignatures: "Мої підписи",
    saveDocument: "Зберегти документ",
    text: "Текст:",
    bold: "Жирний",
    italic: "Курсив",
    textColor: "Колір тексту",
    lift: "Підйом",
    spacing: "Інтервал",
    signatures: "Підписи:",
    noSaved: "немає збережених",
    editorHint: "Додайте текстове поле кнопкою зверху або клацанням по документу. Кожне поле можна рухати окремо.",
    homeTitle: "Головна сторінка",
    chooseDocument: "Вибрати документ",
    signatureTitle: "Цифровий підпис",
    backToDocument: "До документа",
    draw: "Намалювати",
    fromFileOrClipboard: "З файлу або буфера",
    thickness: "Товщина",
    clear: "Очистити",
    saveSignature: "Зберегти підпис",
    chooseFile: "Вибрати файл",
    pasteClipboard: "Вставити з буфера",
    darker: "Темніше",
    sharper: "Різкіше",
    thicker: "Товстіше",
    color: "Колір",
    purple: "Фіолетовий",
    black: "Чорний",
    removePage: "Видалити сторінку",
    page: "Сторінка",
  },
  tr: {
    title: "BRINO — form düzenleyici",
    addFiles: "Dosya ekle",
    addTextField: "Metin alanı ekle",
    clearDocs: "Temizle",
    grid: "Izgara",
    gridCells: "Kareli",
    gridLines: "Çizgili",
    rowStep: "Satır aralığı",
    layerOffset: "Katmanı kaydır",
    docSize: "Belge boyutu",
    zoomView: "Görünüm",
    rotation: "Döndürme",
    guide: "Kılavuz",
    languageTitle: "Arayüz dili",
    helpTitle: "Yardım",
    helpHowTitle: "Nasıl kullanılır",
    helpButtonsTitle: "Düğme rehberi",
    helpStep1: "Dosya ekle’ye tıklayın veya ana sayfadan belge seçin. PDF, DOCX ve resim ekleyebilirsiniz.",
    helpStep2: "Soldan gerekli sayfayı seçin. Gereksiz sayfaları küçük resimdeki çarpı ile kaldırın.",
    helpStep3: "Taramayı döndürme ile düzeltin ve gerekirse genel belge boyutunu ayarlayın.",
    helpStep4: "Metin alanı ekle düğmesine veya belgeye tıklayın. Alan sürüklenebilir ve düzenlenebilir.",
    helpStep5: "Kaydedilmiş bir imza oluşturun veya seçin, belgeye ekleyin ve Belgeyi kaydet’e tıklayın.",
    helpAddFiles: "Düzenleyiciye bir veya birkaç belge yükler.",
    helpAddTextField: "Belgenin görünen bölümünün ortasına yeni bir alan ekler. İstediğiniz yere sürükleyebilirsiniz.",
    helpClearDocs: "Yüklenen tüm sayfaları kaldırır ve ana sayfaya döner.",
    helpGrid: "Yardımcı ızgara veya çizgileri açar. Kaydedilen belgeye aktarılmaz.",
    helpRowStep: "Yatay ızgara çizgileri arasındaki mesafeyi değiştirir.",
    helpLayerOffset: "Izgarayı ve giriş katmanını yukarı veya aşağı taşır.",
    helpDocSize: "Düzenleme ve kaydetme için belgeyi ölçekler.",
    helpZoomView: "Yalnızca ekrandaki görünüm ölçeğini değiştirir. Kaydedilen belgenin boyutunu etkilemez.",
    helpRotation: "Eğri taranmış belgeyi hafifçe döndürür.",
    helpGuide: "Taramayı hizalamak için kırmızı çizgi gösterir.",
    helpCreateSignature: "İmza penceresini açar: çiz, dosya yükle veya panodan yapıştır.",
    helpMySignatures: "Kaydedilmiş imza şablonlarının sayfasını açar.",
    helpSignatureStrip: "Hızlı ekleme için kaydedilmiş imzaları gösterir.",
    helpSave: "Yüklenen tüm belgeyi seçili biçimde kaydeder.",
    createSignature: "İmza oluştur",
    mySignatures: "İmzalarım",
    saveDocument: "Belgeyi kaydet",
    text: "Metin:",
    bold: "Kalın",
    italic: "İtalik",
    textColor: "Metin rengi",
    lift: "Yükselt",
    spacing: "Aralık",
    signatures: "İmzalar:",
    noSaved: "kayıtlı yok",
    editorHint: "Üstteki düğmeyle veya belgeye tıklayarak metin alanı ekleyin. Her alan ayrı ayrı taşınabilir.",
    homeTitle: "Ana sayfa",
    chooseDocument: "Belge seç",
    signatureTitle: "Dijital imza",
    backToDocument: "Belgeye dön",
    draw: "Çiz",
    fromFileOrClipboard: "Dosyadan veya panodan",
    thickness: "Kalınlık",
    clear: "Temizle",
    saveSignature: "İmzayı kaydet",
    chooseFile: "Dosya seç",
    pasteClipboard: "Panodan yapıştır",
    darker: "Daha koyu",
    sharper: "Daha keskin",
    thicker: "Daha kalın",
    color: "Renk",
    purple: "Mor",
    black: "Siyah",
    removePage: "Sayfayı kaldır",
    page: "Sayfa",
  },
  ar: {
    title: "BRINO — محرر النماذج",
    addFiles: "إضافة ملفات",
    addTextField: "إضافة حقل نص",
    clearDocs: "مسح",
    grid: "الشبكة",
    gridCells: "مربعات",
    gridLines: "أسطر",
    rowStep: "تباعد الأسطر",
    layerOffset: "إزاحة الطبقة",
    docSize: "حجم المستند",
    zoomView: "العرض",
    rotation: "تدوير",
    guide: "دليل",
    languageTitle: "لغة الواجهة",
    helpTitle: "مساعدة",
    helpHowTitle: "طريقة الاستخدام",
    helpButtonsTitle: "دليل الأزرار",
    helpStep1: "اضغط إضافة ملفات أو اختر مستنداً من الصفحة الرئيسية. يمكنك إضافة PDF و DOCX والصور.",
    helpStep2: "اختر الصفحة المطلوبة من اليسار. احذف الصفحات غير المطلوبة بعلامة X على الصورة المصغرة.",
    helpStep3: "قم بتسوية المسح بالتدوير واضبط الحجم العام للمستند عند الحاجة.",
    helpStep4: "اضغط إضافة حقل نص أو اضغط على المستند. يمكن سحب الحقل وتعديل خطه ولونه وارتفاعه وتباعده.",
    helpStep5: "أنشئ توقيعاً أو اختر توقيعاً محفوظاً، أدخله في المستند ثم اضغط حفظ المستند.",
    helpAddFiles: "يحمّل مستنداً واحداً أو عدة مستندات في المحرر.",
    helpAddTextField: "يضيف حقلاً جديداً في وسط الجزء المرئي من المستند. يمكنك سحبه إلى المكان المطلوب.",
    helpClearDocs: "يزيل كل الصفحات المحملة ويعود إلى الصفحة الرئيسية.",
    helpGrid: "يشغّل شبكة أو خطوطاً مساعدة. لا تظهر في المستند المحفوظ.",
    helpRowStep: "يغيّر المسافة بين خطوط الشبكة الأفقية.",
    helpLayerOffset: "ينقل الشبكة وطبقة الإدخال إلى أعلى أو أسفل.",
    helpDocSize: "يكبّر أو يصغّر المستند للتحرير والحفظ.",
    helpZoomView: "يغيّر فقط مقياس العرض على الشاشة. لا يؤثر في حجم المستند المحفوظ.",
    helpRotation: "يدير المستند الممسوح بشكل مائل قليلاً.",
    helpGuide: "يعرض خطاً أحمر لمحاذاة المسح.",
    helpCreateSignature: "يفتح نافذة التوقيع: رسم أو تحميل ملف أو لصق من الحافظة.",
    helpMySignatures: "يفتح صفحة قوالب التوقيع المحفوظة.",
    helpSignatureStrip: "يعرض التوقيعات المحفوظة للإدراج السريع.",
    helpSave: "يحفظ المستند المحمل كاملاً بالتنسيق المحدد.",
    createSignature: "إنشاء توقيع",
    mySignatures: "توقيعاتي",
    saveDocument: "حفظ المستند",
    text: "النص:",
    bold: "عريض",
    italic: "مائل",
    textColor: "لون النص",
    lift: "رفع",
    spacing: "تباعد",
    signatures: "التوقيعات:",
    noSaved: "لا يوجد محفوظ",
    editorHint: "أضف حقل نص بالزر العلوي أو بالضغط على المستند. يمكن نقل كل حقل بشكل مستقل.",
    homeTitle: "الصفحة الرئيسية",
    chooseDocument: "اختيار مستند",
    signatureTitle: "توقيع رقمي",
    backToDocument: "إلى المستند",
    draw: "رسم",
    fromFileOrClipboard: "من ملف أو الحافظة",
    thickness: "السماكة",
    clear: "مسح",
    saveSignature: "حفظ التوقيع",
    chooseFile: "اختيار ملف",
    pasteClipboard: "لصق من الحافظة",
    darker: "أغمق",
    sharper: "أوضح",
    thicker: "أسمك",
    color: "اللون",
    purple: "بنفسجي",
    black: "أسود",
    removePage: "حذف الصفحة",
    page: "صفحة",
  },
  zh: {
    title: "BRINO — 表单编辑器",
    addFiles: "添加文件",
    addTextField: "添加文本框",
    clearDocs: "清空",
    grid: "网格",
    gridCells: "方格",
    gridLines: "横线",
    rowStep: "行距",
    layerOffset: "图层偏移",
    docSize: "文档大小",
    zoomView: "视图",
    rotation: "旋转",
    guide: "参考线",
    languageTitle: "界面语言",
    helpTitle: "帮助",
    helpHowTitle: "如何使用",
    helpButtonsTitle: "按钮说明",
    helpStep1: "点击“添加文件”或在主页选择文档。可以添加 PDF、DOCX 和图片。",
    helpStep2: "在左侧选择需要的页面。可用缩略图上的叉号删除不需要的页面。",
    helpStep3: "用旋转校正扫描件，需要时调整整个文档大小。",
    helpStep4: "点击添加文本框或点击文档。文本框可以拖动，并可修改字体、颜色、上移和间距。",
    helpStep5: "创建或选择已保存的签名，插入到文档中，然后点击“保存文档”。",
    helpAddFiles: "将一个或多个文档加载到编辑器。",
    helpAddTextField: "在文档可见区域中央添加一个新文本框。你可以把它拖到需要的位置。",
    helpClearDocs: "移除所有已加载页面并返回主页。",
    helpGrid: "开启辅助网格或横线。保存文档时不会导出它。",
    helpRowStep: "改变水平网格线之间的距离。",
    helpLayerOffset: "上下移动网格和输入图层。",
    helpDocSize: "缩放文档以便编辑和保存。",
    helpZoomView: "只改变屏幕上的查看比例，不影响保存后的文档大小。",
    helpRotation: "轻微旋转歪斜的扫描文档。",
    helpGuide: "显示红色线条用于对齐扫描件。",
    helpCreateSignature: "打开签名窗口：绘制、加载文件或从剪贴板粘贴。",
    helpMySignatures: "打开已保存签名模板页面。",
    helpSignatureStrip: "显示已保存签名，便于快速插入。",
    helpSave: "以所选格式保存整个已加载文档。",
    createSignature: "创建签名",
    mySignatures: "我的签名",
    saveDocument: "保存文档",
    text: "文字：",
    bold: "粗体",
    italic: "斜体",
    textColor: "文字颜色",
    lift: "上移",
    spacing: "间距",
    signatures: "签名：",
    noSaved: "没有已保存",
    editorHint: "用顶部按钮或点击文档添加文本框。每个文本框都可以单独移动。",
    homeTitle: "主页",
    chooseDocument: "选择文档",
    signatureTitle: "数字签名",
    backToDocument: "返回文档",
    draw: "绘制",
    fromFileOrClipboard: "来自文件或剪贴板",
    thickness: "粗细",
    clear: "清除",
    saveSignature: "保存签名",
    chooseFile: "选择文件",
    pasteClipboard: "从剪贴板粘贴",
    darker: "更深",
    sharper: "更清晰",
    thicker: "更粗",
    color: "颜色",
    purple: "紫色",
    black: "黑色",
    removePage: "删除页面",
    page: "页面",
  },
  ja: {
    title: "BRINO — フォーム編集",
    addFiles: "ファイル追加",
    addTextField: "テキスト欄を追加",
    clearDocs: "クリア",
    grid: "グリッド",
    gridCells: "方眼",
    gridLines: "罫線",
    rowStep: "行間",
    layerOffset: "レイヤー移動",
    docSize: "文書サイズ",
    zoomView: "表示",
    rotation: "回転",
    guide: "ガイド",
    languageTitle: "表示言語",
    helpTitle: "ヘルプ",
    helpHowTitle: "使い方",
    helpButtonsTitle: "ボタンの説明",
    helpStep1: "ファイル追加をクリックするか、ホーム画面で文書を選びます。PDF、DOCX、画像を追加できます。",
    helpStep2: "左側で必要なページを選びます。不要なページはサムネイルの×で削除できます。",
    helpStep3: "回転でスキャンを整え、必要に応じて文書全体のサイズを調整します。",
    helpStep4: "テキスト欄を追加をクリックするか、文書をクリックします。欄はドラッグして編集できます。",
    helpStep5: "署名を作成または保存済み署名を選び、文書に挿入して文書を保存します。",
    helpAddFiles: "1つまたは複数の文書を編集画面に読み込みます。",
    helpAddTextField: "文書の表示部分の中央に新しい欄を追加します。必要な場所へドラッグできます。",
    helpClearDocs: "読み込んだ全ページを削除し、ホーム画面に戻ります。",
    helpGrid: "補助グリッドまたは罫線を表示します。保存文書には出力されません。",
    helpRowStep: "横方向のグリッド線の間隔を変更します。",
    helpLayerOffset: "グリッドと入力レイヤーを上下に移動します。",
    helpDocSize: "編集と保存のために文書を拡大縮小します。",
    helpZoomView: "画面上の表示倍率だけを変更します。保存される文書サイズには影響しません。",
    helpRotation: "傾いたスキャン文書を少し回転します。",
    helpGuide: "スキャンの位置合わせ用に赤い線を表示します。",
    helpCreateSignature: "署名画面を開きます。描画、ファイル読み込み、クリップボード貼り付けができます。",
    helpMySignatures: "保存済み署名テンプレートのページを開きます。",
    helpSignatureStrip: "保存済み署名を表示し、すばやく挿入できます。",
    helpSave: "読み込んだ文書全体を選択した形式で保存します。",
    createSignature: "署名を作成",
    mySignatures: "マイ署名",
    saveDocument: "文書を保存",
    text: "テキスト:",
    bold: "太字",
    italic: "斜体",
    textColor: "文字色",
    lift: "上げる",
    spacing: "間隔",
    signatures: "署名:",
    noSaved: "保存なし",
    editorHint: "上のボタンまたは文書クリックでテキスト欄を追加します。各欄は個別に移動できます。",
    homeTitle: "ホーム",
    chooseDocument: "文書を選択",
    signatureTitle: "デジタル署名",
    backToDocument: "文書へ",
    draw: "描く",
    fromFileOrClipboard: "ファイルまたはクリップボード",
    thickness: "太さ",
    clear: "クリア",
    saveSignature: "署名を保存",
    chooseFile: "ファイル選択",
    pasteClipboard: "クリップボードから貼り付け",
    darker: "濃く",
    sharper: "鮮明",
    thicker: "太く",
    color: "色",
    purple: "紫",
    black: "黒",
    removePage: "ページ削除",
    page: "ページ",
  },
  ko: {
    title: "BRINO — 양식 편집기",
    addFiles: "파일 추가",
    addTextField: "텍스트 필드 추가",
    clearDocs: "비우기",
    grid: "격자",
    gridCells: "칸",
    gridLines: "줄",
    rowStep: "줄 간격",
    layerOffset: "레이어 이동",
    docSize: "문서 크기",
    zoomView: "보기",
    rotation: "회전",
    guide: "가이드",
    languageTitle: "인터페이스 언어",
    helpTitle: "도움말",
    helpHowTitle: "사용 방법",
    helpButtonsTitle: "버튼 안내",
    helpStep1: "파일 추가를 누르거나 홈 화면에서 문서를 선택하세요. PDF, DOCX, 이미지를 추가할 수 있습니다.",
    helpStep2: "왼쪽에서 필요한 페이지를 선택하세요. 필요 없는 페이지는 썸네일의 X로 삭제합니다.",
    helpStep3: "회전으로 스캔을 바로잡고 필요하면 전체 문서 크기를 조정하세요.",
    helpStep4: "텍스트 필드 추가를 누르거나 문서를 클릭하세요. 필드는 드래그하고 편집할 수 있습니다.",
    helpStep5: "서명을 만들거나 저장된 서명을 선택해 문서에 넣고 문서 저장을 누르세요.",
    helpAddFiles: "하나 이상의 문서를 편집기에 불러옵니다.",
    helpAddTextField: "문서의 보이는 영역 중앙에 새 필드를 추가합니다. 원하는 위치로 끌어 놓을 수 있습니다.",
    helpClearDocs: "불러온 모든 페이지를 제거하고 홈 화면으로 돌아갑니다.",
    helpGrid: "보조 격자 또는 줄을 켭니다. 저장된 문서에는 포함되지 않습니다.",
    helpRowStep: "가로 격자선 사이의 거리를 바꿉니다.",
    helpLayerOffset: "격자와 입력 레이어를 위아래로 이동합니다.",
    helpDocSize: "편집과 저장을 위해 문서 크기를 조절합니다.",
    helpZoomView: "화면 보기 배율만 바꿉니다. 저장된 문서 크기에는 영향을 주지 않습니다.",
    helpRotation: "기울어진 스캔 문서를 약간 회전합니다.",
    helpGuide: "스캔 정렬을 위한 빨간 선을 표시합니다.",
    helpCreateSignature: "서명 창을 엽니다: 그리기, 파일 불러오기, 클립보드 붙여넣기.",
    helpMySignatures: "저장된 서명 템플릿 페이지를 엽니다.",
    helpSignatureStrip: "빠른 삽입을 위해 저장된 서명을 보여줍니다.",
    helpSave: "불러온 전체 문서를 선택한 형식으로 저장합니다.",
    createSignature: "서명 만들기",
    mySignatures: "내 서명",
    saveDocument: "문서 저장",
    text: "텍스트:",
    bold: "굵게",
    italic: "기울임",
    textColor: "글자 색",
    lift: "올림",
    spacing: "간격",
    signatures: "서명:",
    noSaved: "저장 없음",
    editorHint: "위쪽 버튼이나 문서 클릭으로 텍스트 필드를 추가하세요. 각 필드는 따로 이동할 수 있습니다.",
    homeTitle: "홈",
    chooseDocument: "문서 선택",
    signatureTitle: "디지털 서명",
    backToDocument: "문서로",
    draw: "그리기",
    fromFileOrClipboard: "파일 또는 클립보드",
    thickness: "두께",
    clear: "지우기",
    saveSignature: "서명 저장",
    chooseFile: "파일 선택",
    pasteClipboard: "클립보드에서 붙여넣기",
    darker: "더 진하게",
    sharper: "더 선명하게",
    thicker: "더 두껍게",
    color: "색상",
    purple: "보라색",
    black: "검정",
    removePage: "페이지 삭제",
    page: "페이지",
  },
  hi: {
    title: "BRINO — फ़ॉर्म संपादक",
    addFiles: "फ़ाइलें जोड़ें",
    addTextField: "टेक्स्ट फ़ील्ड जोड़ें",
    clearDocs: "साफ़ करें",
    grid: "ग्रिड",
    gridCells: "खाने",
    gridLines: "लाइनें",
    rowStep: "लाइन अंतर",
    layerOffset: "लेयर खिसकाएँ",
    docSize: "दस्तावेज़ आकार",
    zoomView: "देखें",
    rotation: "घुमाएँ",
    guide: "गाइड",
    languageTitle: "इंटरफ़ेस भाषा",
    helpTitle: "सहायता",
    helpHowTitle: "कैसे उपयोग करें",
    helpButtonsTitle: "बटन गाइड",
    helpStep1: "फ़ाइलें जोड़ें पर क्लिक करें या मुख्य पेज से दस्तावेज़ चुनें। PDF, DOCX और चित्र जोड़े जा सकते हैं।",
    helpStep2: "बाईं ओर से ज़रूरी पेज चुनें। अनचाहे पेज थंबनेल के X से हटाएँ।",
    helpStep3: "रोटेशन से स्कैन सीधा करें और ज़रूरत हो तो पूरे दस्तावेज़ का आकार सेट करें।",
    helpStep4: "टेक्स्ट फ़ील्ड जोड़ें पर क्लिक करें या दस्तावेज़ पर क्लिक करें। फ़ील्ड को खींचकर रखा और संपादित किया जा सकता है।",
    helpStep5: "हस्ताक्षर बनाएँ या सहेजा हुआ हस्ताक्षर चुनें, उसे दस्तावेज़ में डालें और दस्तावेज़ सहेजें दबाएँ।",
    helpAddFiles: "एक या अधिक दस्तावेज़ संपादक में लोड करता है।",
    helpAddTextField: "दस्तावेज़ के दिख रहे हिस्से के बीच में नया फ़ील्ड जोड़ता है। इसे सही जगह खींच सकते हैं।",
    helpClearDocs: "सभी लोड किए पेज हटाता है और मुख्य पेज पर लौटता है।",
    helpGrid: "सहायक ग्रिड या लाइनें चालू करता है। यह सहेजे गए दस्तावेज़ में नहीं जाती।",
    helpRowStep: "क्षैतिज ग्रिड लाइनों के बीच की दूरी बदलता है।",
    helpLayerOffset: "ग्रिड और इनपुट लेयर को ऊपर या नीचे ले जाता है।",
    helpDocSize: "संपादन और सहेजने के लिए दस्तावेज़ को स्केल करता है।",
    helpZoomView: "सिर्फ़ स्क्रीन पर देखने का पैमाना बदलता है। सहेजे गए दस्तावेज़ के आकार पर असर नहीं डालता।",
    helpRotation: "टेढ़े स्कैन दस्तावेज़ को थोड़ा घुमाता है।",
    helpGuide: "स्कैन मिलाने के लिए लाल लाइन दिखाता है।",
    helpCreateSignature: "हस्ताक्षर विंडो खोलता है: बनाएँ, फ़ाइल लोड करें या क्लिपबोर्ड से चिपकाएँ।",
    helpMySignatures: "सहेजे हुए हस्ताक्षर टेम्पलेट वाला पेज खोलता है।",
    helpSignatureStrip: "त्वरित डालने के लिए सहेजे हस्ताक्षर दिखाता है।",
    helpSave: "पूरे लोड किए दस्तावेज़ को चुने हुए फ़ॉर्मैट में सहेजता है।",
    createSignature: "हस्ताक्षर बनाएँ",
    mySignatures: "मेरे हस्ताक्षर",
    saveDocument: "दस्तावेज़ सहेजें",
    text: "टेक्स्ट:",
    bold: "बोल्ड",
    italic: "इटैलिक",
    textColor: "टेक्स्ट रंग",
    lift: "ऊपर करें",
    spacing: "अंतर",
    signatures: "हस्ताक्षर:",
    noSaved: "कोई सहेजा नहीं",
    editorHint: "ऊपर के बटन से या दस्तावेज़ पर क्लिक करके टेक्स्ट फ़ील्ड जोड़ें। हर फ़ील्ड को अलग से हिलाया जा सकता है।",
    homeTitle: "मुख्य पेज",
    chooseDocument: "दस्तावेज़ चुनें",
    signatureTitle: "डिजिटल हस्ताक्षर",
    backToDocument: "दस्तावेज़ पर",
    draw: "बनाएँ",
    fromFileOrClipboard: "फ़ाइल या क्लिपबोर्ड से",
    thickness: "मोटाई",
    clear: "साफ़ करें",
    saveSignature: "हस्ताक्षर सहेजें",
    chooseFile: "फ़ाइल चुनें",
    pasteClipboard: "क्लिपबोर्ड से चिपकाएँ",
    darker: "गहरा",
    sharper: "तेज़",
    thicker: "मोटा",
    color: "रंग",
    purple: "बैंगनी",
    black: "काला",
    removePage: "पेज हटाएँ",
    page: "पेज",
  },
};

Object.entries(extraLocales).forEach(([lang, pack]) => {
  i18n[lang] = { ...i18n.en, ...pack };
});

const RTL_LANGS = new Set(["ar"]);

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
  document.documentElement.dir = RTL_LANGS.has(currentLang) ? "rtl" : "ltr";
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
  textOffsetY: 0,
  annots: {}, // { [pageNumber]: Array<annotation> }
};

let activeAnnotId = null;
let docScaleTimer = null;
let draftSaveTimer = null;
let restoringDraft = false;

function annotsForPage() {
  return (state.annots[state.page] ||= []);
}

function openDraftDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DRAFT_DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(DRAFT_STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function draftDbAction(mode, action) {
  const db = await openDraftDb();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(DRAFT_STORE, mode);
      const store = tx.objectStore(DRAFT_STORE);
      const req = action(store);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
      tx.onerror = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}

function canvasToDataUrl(canvas) {
  return canvas.toDataURL("image/png");
}

async function sourceToDraftSource(source) {
  if (source.draftDataUrl) {
    return { type: "image", label: source.label || t("page"), dataUrl: source.draftDataUrl };
  }
  let canvas;
  if (source.type === "pdf") {
    const page = await source.pdf.getPage(source.pageNumber);
    const viewport = page.getViewport({ scale: RENDER_SCALE });
    canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
  } else {
    canvas = document.createElement("canvas");
    canvas.width = source.image.naturalWidth;
    canvas.height = source.image.naturalHeight;
    canvas.getContext("2d").drawImage(source.image, 0, 0);
  }
  source.draftDataUrl = canvasToDataUrl(canvas);
  return { type: "image", label: source.label || t("page"), dataUrl: source.draftDataUrl };
}

async function serializeDraft() {
  const pageSources = [];
  for (const source of state.pageSources) {
    pageSources.push(await sourceToDraftSource(source));
  }
  return {
    savedAt: Date.now(),
    state: {
      page: state.page,
      zoom: 1,
      docScale: state.docScale,
      rotation: state.rotation,
      layerOffsetY: 0,
      gridStepY: state.gridStepY,
      guideY: state.guideY,
      textOffsetY: state.textOffsetY,
      annots: state.annots,
    },
    controls: {
      gridOn: false,
      gridMode: $("gridMode").value,
      gridSize: $("gridSize").value,
      guideOn: $("guideToggle").checked,
    },
    pageSources,
  };
}

function scheduleDraftSave() {
  if (restoringDraft || !state.kind) return;
  clearTimeout(draftSaveTimer);
  draftSaveTimer = setTimeout(() => {
    saveDraftNow().catch((err) => console.warn("Draft save failed", err));
  }, 650);
}

async function saveDraftNow() {
  if (restoringDraft || !state.kind) return;
  const draft = await serializeDraft();
  await draftDbAction("readwrite", (store) => store.put(draft, DRAFT_KEY));
}

async function clearDraft() {
  clearTimeout(draftSaveTimer);
  try {
    await draftDbAction("readwrite", (store) => store.delete(DRAFT_KEY));
  } catch (err) {
    console.warn("Draft clear failed", err);
  }
}

async function restoreDraft() {
  const draft = await draftDbAction("readonly", (store) => store.get(DRAFT_KEY));
  if (!draft?.pageSources?.length) return false;
  restoringDraft = true;
  try {
    resetDocumentState();
    const sources = [];
    for (const source of draft.pageSources) {
      const img = await loadImageElement(source.dataUrl);
      sources.push({ type: "image", image: img, label: source.label || t("page") });
    }
    state.pageSources = sources;
    state.kind = "document";
    state.pages = sources.length;
    Object.assign(state, draft.state || {});
    state.zoom = 1;
    state.page = Math.max(1, Math.min(Number(state.page) || 1, state.pages));
    state.annots = draft.state?.annots || {};
    $("gridToggle").checked = false;
    $("gridMode").value = draft.controls?.gridMode || $("gridMode").value;
    $("gridSize").value = draft.controls?.gridSize || $("gridSize").value;
    $("guideToggle").checked = draft.controls?.guideOn ?? true;
    $("rotateAngle").value = String(state.rotation);
    state.layerOffsetY = 0;
    $("layerOffsetY").value = "0";
    $("gridStepY").value = String(state.gridStepY);
    $("guideY").value = String(state.guideY);
    $("textOffsetY").value = String(state.textOffsetY);
    $("docScale").value = String(Math.round(state.docScale * 100));
    $("pageNav").hidden = state.pages < 2;
    $("pageCount").textContent = String(state.pages);
    updateRotationLabel();
    updateLayerOffsetLabel();
    updateGridStepYLabel();
    updateDocScaleLabel();
    await renderPage();
    await renderThumbnails();
    return true;
  } finally {
    restoringDraft = false;
  }
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
    scheduleDraftSave();
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
  scheduleDraftSave();
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
  scheduleDraftSave();
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
  state.zoom = 1;
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
  state.textOffsetY = 0;
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
    clearDraft();
    resetDocumentState();
    state.rotation = 0;
    state.layerOffsetY = 0;
    state.gridStepY = 20;
    state.guideY = 45;
    state.textOffsetY = 0;
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
    scheduleDraftSave();
  }
};
$("nextPage").onclick = async () => {
  if (state.page < state.pages) {
    state.page++;
    await renderPage();
    scheduleDraftSave();
  }
};

function updateRotationLabel() {
  $("rotateLabel").textContent = `${Number(state.rotation).toFixed(1).replace(".0", "")}°`;
}

async function rerenderCurrentDocument() {
  if (state.kind) await renderPage();
  else updateRotationLabel();
  scheduleDraftSave();
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
  scheduleDraftSave();
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
  scheduleDraftSave();
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
  scheduleDraftSave();
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
  scheduleDraftSave();
};
$("zoomOut").onclick = () => {
  state.zoom = Math.max(0.2, state.zoom - 0.1);
  applyZoom();
  scheduleDraftSave();
};

/* ---------- сетка ---------- */
function applyGrid() {
  const on = $("gridToggle").checked;
  const sizeX = currentGridSize();
  const mode = $("gridMode").value;
  state.gridStepY = Math.max(8, Math.min(120, Number($("gridStepY").value) || sizeX));
  const stepY = mode === "grid" ? sizeX : state.gridStepY;
  gridEl.className = "grid" + (on ? (mode === "grid" ? " grid-cells" : " grid-lines") : "");
  gridEl.style.backgroundSize = `${sizeX}px ${stepY}px`;
  $("gridStepY").disabled = mode === "grid";
  updateGridSizeLabel();
  updateGridStepYLabel();
  scheduleDraftSave();
}

function currentGridSize() {
  return Number($("gridSize").value) || 24;
}

function currentGridStepY() {
  return $("gridMode").value === "grid" ? currentGridSize() : state.gridStepY;
}

function updateGridSizeLabel() {
  $("gridSizeLabel").textContent = `${currentGridSize()} px`;
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
  offsetY: 0,
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
  scheduleDraftSave();
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
    scheduleDraftSave();
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

function createTextAnnotation(x, y) {
  const size = textStyle.size * RENDER_SCALE;
  const a = {
    id: crypto.randomUUID(),
    type: "text",
    x: Math.max(0, Math.min(docCanvas.width - 40, x)),
    y: Math.max(0, Math.min(docCanvas.height - 24, y)),
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
  scheduleDraftSave();
  const node = overlay.querySelector(`[data-id="${a.id}"] textarea`);
  node?.focus();
  return a;
}

function visibleDocumentCenter() {
  const rect = overlay.getBoundingClientRect();
  const viewport = $("canvasArea").getBoundingClientRect();
  const left = Math.max(rect.left, viewport.left);
  const right = Math.min(rect.right, viewport.right);
  const top = Math.max(rect.top, viewport.top);
  const bottom = Math.min(rect.bottom, viewport.bottom);
  const centerX = right > left ? (left + right) / 2 : rect.left + rect.width / 2;
  const centerY = bottom > top ? (top + bottom) / 2 : rect.top + rect.height / 2;
  return {
    x: (centerX - rect.left) / state.zoom,
    y: (centerY - rect.top) / state.zoom,
  };
}

function addTextFieldAtVisibleCenter() {
  if (!state.kind) {
    alert(t("openDocumentFirst"));
    return;
  }
  const { x, y } = visibleDocumentCenter();
  createTextAnnotation(x, y);
}

$("addTextFieldBtn").onclick = addTextFieldAtVisibleCenter;

// клик по документу -> новое текстовое поле в координатах документа
overlay.addEventListener("mousedown", (e) => {
  if (e.target !== overlay) return;
  const rect = overlay.getBoundingClientRect();
  const x = (e.clientX - rect.left) / state.zoom;
  const y = (e.clientY - rect.top) / state.zoom;
  createTextAnnotation(x, y);
});

function snap(v) {
  return v;
}

function snapY(v) {
  return v;
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
    scheduleDraftSave();
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
  ta.style.transform = `translateY(${a.offsetY ?? state.textOffsetY}px)`;
  const autosize = () => {
    ta.style.width = "10px";
    ta.style.height = "10px";
    ta.style.width = ta.scrollWidth + 6 + "px";
    ta.style.height = ta.scrollHeight + "px";
  };
  ta.addEventListener("input", () => {
    a.text = ta.value;
    autosize();
    scheduleDraftSave();
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
      scheduleDraftSave();
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
    scheduleDraftSave();
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
    if (list.some((item) => item.dataUrl === dataUrl)) {
      renderSigStrips();
      return false;
    }
    list.unshift({ name: `${t("savedSignatureName")} ${list.length + 1}`, dataUrl, at: Date.now() });
    localStorage.setItem(SIG_KEY, JSON.stringify(list.slice(0, 12)));
    renderSigStrips();
    return true;
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

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getSignatureInsertPoint(w, h) {
  const selected = activeAnnot();
  if (selected) {
    return {
      x: clamp(selected.x, 0, Math.max(0, docCanvas.width - w)),
      y: clamp(selected.y, 0, Math.max(0, docCanvas.height - h)),
    };
  }

  const areaRect = $("canvasArea").getBoundingClientRect();
  const overlayRect = overlay.getBoundingClientRect();
  const visibleLeft = Math.max(areaRect.left, overlayRect.left);
  const visibleRight = Math.min(areaRect.right, overlayRect.right);
  const visibleTop = Math.max(areaRect.top, overlayRect.top);
  const visibleBottom = Math.min(areaRect.bottom, overlayRect.bottom);
  const centerX = visibleRight > visibleLeft ? (visibleLeft + visibleRight) / 2 : areaRect.left + areaRect.width / 2;
  const centerY = visibleBottom > visibleTop ? (visibleTop + visibleBottom) / 2 : areaRect.top + areaRect.height / 2;

  return {
    x: clamp((centerX - overlayRect.left) / state.zoom - w / 2, 0, Math.max(0, docCanvas.width - w)),
    y: clamp((centerY - overlayRect.top) / state.zoom - h / 2, 0, Math.max(0, docCanvas.height - h)),
  };
}

function insertSignature(dataUrl) {
  if (!state.kind) return alert(t("openDocumentFirst"));
  const probe = new Image();
  probe.onload = () => {
    const w = Math.min(360, probe.naturalWidth, Math.max(60, docCanvas.width * 0.7));
    const h = (w * probe.naturalHeight) / probe.naturalWidth;
    const point = getSignatureInsertPoint(w, h);
    annotsForPage().push({
      id: crypto.randomUUID(),
      type: "sig",
      dataUrl,
      x: point.x,
      y: point.y,
      w,
      h,
    });
    renderAnnots();
    scheduleDraftSave();
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

function openHelpModal() {
  $("helpModal").hidden = false;
}

function closeHelpModal() {
  $("helpModal").hidden = true;
}

function closeRateModal() {
  $("rateModal").hidden = true;
}

function openRatePage() {
  localStorage.setItem(RATE_DISMISSED_KEY, "1");
  closeRateModal();
  const extensionId = typeof chrome !== "undefined" && chrome.runtime?.id ? chrome.runtime.id : "";
  const url = extensionId
    ? `https://microsoftedge.microsoft.com/addons/detail/${extensionId}`
    : "https://microsoftedge.microsoft.com/addons";
  if (typeof chrome !== "undefined" && chrome.tabs?.create) chrome.tabs.create({ url });
  else window.open(url, "_blank", "noopener");
}

function postponeRatePrompt() {
  localStorage.setItem(RATE_LAST_PROMPT_KEY, localStorage.getItem(RATE_LAUNCH_COUNT_KEY) || "0");
  closeRateModal();
}

function dismissRatePrompt() {
  localStorage.setItem(RATE_DISMISSED_KEY, "1");
  closeRateModal();
}

function maybeShowRatePrompt() {
  if (localStorage.getItem(RATE_DISMISSED_KEY) === "1") return;
  const launchCount = Number(localStorage.getItem(RATE_LAUNCH_COUNT_KEY) || "0") + 1;
  const lastPrompt = Number(localStorage.getItem(RATE_LAST_PROMPT_KEY) || "0");
  localStorage.setItem(RATE_LAUNCH_COUNT_KEY, String(launchCount));
  if (launchCount < RATE_FIRST_PROMPT_AT) return;
  if (lastPrompt && launchCount - lastPrompt < RATE_REPEAT_EVERY) return;
  $("rateModal").hidden = false;
  localStorage.setItem(RATE_LAST_PROMPT_KEY, String(launchCount));
}

$("helpBtn").onclick = openHelpModal;
$("helpClose").onclick = closeHelpModal;
$("helpModal").addEventListener("pointerdown", (e) => {
  if (e.target === $("helpModal")) closeHelpModal();
});
$("rateClose").onclick = postponeRatePrompt;
$("rateLater").onclick = postponeRatePrompt;
$("rateNever").onclick = dismissRatePrompt;
$("rateNow").onclick = openRatePage;
$("rateModal").addEventListener("pointerdown", (e) => {
  if (e.target === $("rateModal")) postponeRatePrompt();
});
$("signBtn").onclick = () => openSignatureModal();
$("sigClose").onclick = closeSignatureModal;
$("sigBack").onclick = closeSignatureModal;
$("sigModal").addEventListener("pointerdown", (e) => {
  if (e.target === $("sigModal")) closeSignatureModal();
});
window.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (!$("rateModal").hidden) postponeRatePrompt();
  else if (!$("helpModal").hidden) closeHelpModal();
  else if (!$("sigModal").hidden) closeSignatureModal();
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
  setPadSaveEnabled(true);
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

function setPadSaveEnabled(enabled) {
  $("padSave").disabled = !enabled;
}

$("padClear").onclick = () => {
  padCtx.clearRect(0, 0, pad.width, pad.height);
  padDirty = false;
  setPadSaveEnabled(false);
};

$("padSave").onclick = () => {
  if (!padDirty) return alert(t("drawSignatureFirst"));
  const trimmed = trimTransparent(pad);
  sigStore.add(trimmed.toDataURL("image/png"));
  $("padClear").click();
  setPadSaveEnabled(false);
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
let pasteFallbackResolve = null;

function setSignatureSaveEnabled(enabled) {
  $("cropSave").disabled = !enabled;
}

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
  setSignatureSaveEnabled(false);
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
    setSignatureSaveEnabled(true);
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

async function tryReadSignatureFromClipboardApi() {
  if (navigator.clipboard?.read) {
    const items = await navigator.clipboard.read();
    for (const item of items) {
      const type = item.types.find((t) => t.startsWith("image/") || t === "application/pdf" || t === "text/html" || t === "text/plain");
      if (type) {
        const blob = await item.getType(type);
        if (type.startsWith("image/") || type === "application/pdf") {
          await loadSignatureFile(new File([blob], `clipboard.${type.includes("pdf") ? "pdf" : "png"}`, { type }));
          return true;
        }
        const text = await blob.text();
        if (await loadSignatureFromTextPayload(text)) return true;
      }
    }
  }
  if (navigator.clipboard?.readText) {
    const text = await navigator.clipboard.readText();
    if (await loadSignatureFromTextPayload(text)) return true;
  }
  return false;
}

function resolvePasteFallback(value) {
  if (!pasteFallbackResolve) return;
  pasteFallbackResolve(value);
  pasteFallbackResolve = null;
}

function requestPasteEventFallback() {
  $("sigPreviewHint").textContent = t("clipboardPressCtrlV");
  $("sigModal").tabIndex = -1;
  $("sigModal").focus();
  return new Promise((resolve) => {
    pasteFallbackResolve = resolve;
    try {
      document.execCommand?.("paste");
    } catch (err) {
      console.warn("Programmatic paste failed", err);
    }
    setTimeout(() => {
      if (pasteFallbackResolve === resolve) resolvePasteFallback(false);
    }, 450);
  });
}

async function pasteSignatureFromClipboard() {
  try {
    if (await tryReadSignatureFromClipboardApi()) return;
  } catch (err) {
    console.warn("Clipboard API read failed", err);
  }
  if (await requestPasteEventFallback()) return;
  $("sigPreviewHint").textContent = t("clipboardPressCtrlV");
}

$("pasteSig").onclick = pasteSignatureFromClipboard;

const handledPasteEvents = new WeakSet();

async function loadSignatureFromPasteEvent(e) {
  if (handledPasteEvents.has(e)) return;
  handledPasteEvents.add(e);
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
    resolvePasteFallback(true);
    return;
  }
  const html = e.clipboardData?.getData("text/html") || "";
  const text = e.clipboardData?.getData("text/plain") || "";
  if (await loadSignatureFromTextPayload(html || text)) {
    e.preventDefault();
    resolvePasteFallback(true);
  }
}

async function loadSignatureFromTextPayload(text) {
  const src = extractImageSource(text);
  if (!src) return false;
  if (src.startsWith("data:image/") || src.startsWith("blob:")) {
    setCropImageSource(src);
    return true;
  }
  if (/^https?:\/\//i.test(src)) {
    try {
      const res = await fetch(src);
      if (!res.ok) return false;
      const blob = await res.blob();
      if (!blob.type.startsWith("image/")) return false;
      await loadSignatureFile(new File([blob], "clipboard-image.png", { type: blob.type }));
      return true;
    } catch (err) {
      console.warn("Clipboard image URL failed", err);
    }
  }
  return false;
}

function extractImageSource(text = "") {
  const trimmed = text.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("data:image/") || trimmed.startsWith("blob:") || /^https?:\/\/\S+\.(png|jpe?g|webp|gif|bmp)(\?\S*)?$/i.test(trimmed)) {
    return trimmed;
  }
  const doc = new DOMParser().parseFromString(trimmed, "text/html");
  const img = doc.querySelector("img[src]");
  return img?.getAttribute("src") || "";
}

window.addEventListener("paste", loadSignatureFromPasteEvent);
document.addEventListener("paste", loadSignatureFromPasteEvent);

function cropCanvasPoint(e) {
  const r = cropCanvas.getBoundingClientRect();
  return {
    x: (e.clientX - r.left) * (cropCanvas.width / r.width),
    y: (e.clientY - r.top) * (cropCanvas.height / r.height),
  };
}

function normalizeCrop(nextCrop) {
  const x1 = clamp(nextCrop.x, 0, cropCanvas.width);
  const y1 = clamp(nextCrop.y, 0, cropCanvas.height);
  const x2 = clamp(nextCrop.x + nextCrop.w, 0, cropCanvas.width);
  const y2 = clamp(nextCrop.y + nextCrop.h, 0, cropCanvas.height);
  return {
    x: Math.min(x1, x2),
    y: Math.min(y1, y2),
    w: Math.abs(x2 - x1),
    h: Math.abs(y2 - y1),
  };
}

function syncCropBox() {
  if (!crop || crop.w <= 0 || crop.h <= 0) {
    cropBox.hidden = true;
    return;
  }
  const r = cropCanvas.getBoundingClientRect();
  const kx = cropCanvas.width / r.width;
  const ky = cropCanvas.height / r.height;
  cropBox.hidden = false;
  cropBox.style.left = crop.x / kx + "px";
  cropBox.style.top = crop.y / ky + "px";
  cropBox.style.width = crop.w / kx + "px";
  cropBox.style.height = crop.h / ky + "px";
}

cropCanvas.addEventListener("pointerdown", (e) => {
  if (!cropImg) return;
  const { x: sx, y: sy } = cropCanvasPoint(e);
  crop = { x: sx, y: sy, w: 0, h: 0 };
  setSignatureSaveEnabled(true);
  syncCropBox();

  const move = (m) => {
    const { x: cx, y: cy } = cropCanvasPoint(m);
    crop = { x: Math.min(sx, cx), y: Math.min(sy, cy), w: Math.abs(cx - sx), h: Math.abs(cy - sy) };
    syncCropBox();
  };
  const up = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
    if (crop && crop.w > 8 && crop.h > 8) previewCrop();
  };
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
});

cropBox.querySelectorAll("[data-crop-handle]").forEach((handle) => {
  handle.addEventListener("pointerdown", (e) => {
    if (!cropImg || !crop) return;
    e.preventDefault();
    e.stopPropagation();
    const corner = handle.dataset.cropHandle;
    const start = { ...crop };
    const right = start.x + start.w;
    const bottom = start.y + start.h;

    const move = (m) => {
      const p = cropCanvasPoint(m);
      const next = { ...start };
      if (corner.includes("n")) {
        next.y = p.y;
        next.h = bottom - p.y;
      }
      if (corner.includes("s")) {
        next.h = p.y - start.y;
      }
      if (corner.includes("w")) {
        next.x = p.x;
        next.w = right - p.x;
      }
      if (corner.includes("e")) {
        next.w = p.x - start.x;
      }
      crop = normalizeCrop(next);
      setSignatureSaveEnabled(true);
      syncCropBox();
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      if (crop && crop.w > 8 && crop.h > 8) previewCrop();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  });
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
  setSignatureSaveEnabled(false);
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

function stampHiddenCanvasMark(canvas) {
  const ctx = canvas.getContext("2d");
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const payload = new TextEncoder().encode(`PDFSIGNER:${HIDDEN_MARK}`);
  const bytes = new Uint8Array(4 + payload.length);
  new DataView(bytes.buffer).setUint32(0, payload.length, false);
  bytes.set(payload, 4);
  const availablePixels = Math.floor(image.data.length / 4);
  if (bytes.length * 8 > availablePixels) return canvas;

  let pixel = 0;
  for (const byte of bytes) {
    for (let bit = 7; bit >= 0; bit--) {
      const dataIndex = pixel * 4 + 2;
      image.data[dataIndex] = (image.data[dataIndex] & 0xfe) | ((byte >> bit) & 1);
      pixel++;
    }
  }
  ctx.putImageData(image, 0, 0);
  return canvas;
}

function applyPdfHiddenMark(pdf) {
  pdf.setProperties({
    title: "BRINO document",
    subject: HIDDEN_MARK,
    author: "BRINO",
    creator: HIDDEN_MARK,
    keywords: HIDDEN_MARK_KEYWORDS,
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
      stampHiddenCanvasMark(canvas);
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
      applyPdfHiddenMark(pdf);
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

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") saveDraftNow().catch(() => {});
});
window.addEventListener("beforeunload", () => {
  saveDraftNow().catch(() => {});
});

/* ================= bootstrap ================= */
(async function init() {
  closeHelpModal();
  closeSignatureModal();
  showApp();
  showHome(false);
  updateGridStepYLabel();
  updateDocScaleLabel();
  updateLineHeightLabel();
  updateSignatureEnhancementLabels();
  setPadSaveEnabled(false);
  setSignatureSaveEnabled(false);
  $("languageSelect").onchange = (e) => applyLanguage(e.target.value);
  applyLanguage(currentLang);
  const srcParam = new URLSearchParams(location.search).get("src");
  if (srcParam) {
    await openUrl(srcParam).catch((e) => alert(t("openFileFailed") + e.message));
  } else {
    await restoreDraft().catch((err) => console.warn("Draft restore failed", err));
  }
  maybeShowRatePrompt();
})();

