# BRINO — Document Processor & Overlay Engine

**BRINO** (by **Codewerk Studio**) is a lightweight, 100% local browser extension designed to eliminate paper-and-scanner bureaucratic hassle. It transforms incoming paperwork, forms, and multi-format documents into clean, professional, filled-in, and signed PDFs.

BRINO is a flexible **Document Processor and Overlay Engine**. It allows you to combine, edit, anonymize, and sign multi-page documents directly in your browser without sacrificing document integrity or sending data to external servers.

---

## 🌟 Why It Exists

Many official forms (Jobcenter, housing cooperatives/SWG, banks, insurance) still require filling, signing, and returning. BRINO bypasses the "print-sign-scan" cycle:

- **Unified Format Support:** Process PDF, DOCX, PNG, JPG, and scanned documents in a single workspace.
- **No Printer Needed:** Fill out forms and place transparent handwritten signatures electronically.
- **Smart Text Replacement:** Replace text or fix errors seamlessly directly on top of the document canvas.
- **Complete Data Privacy:** All processing, rendering, and flattening happens 100% locally on your machine.

---

## 🚀 Key Features

### 1. Multi-Format Input & Drag-and-Drop Management
- **Combine Multiple Files:** Load PDF, DOCX, and image files simultaneously into a unified multi-page document.
- **Thumbnail Sidebar with Drag & Drop:** Easily reorder pages, mix DOCX pages with PDF scans, or remove unnecessary pages using intuitive drag-and-drop.

### 2. Precision Text & Overlay Editing
- **Smart Alignment Grid:** Overlay canvas with a subtle alignment grid (notebook-style) to precisely place text over form lines.
- **Rich Font Selection:** Complete support for standard European/German document fonts, including **Times New Roman**, **Arial**, **Calibri**, **Helvetica**, and **Aptos**.
- **Movable Text Fields:** Full control over font style, size, color, bold, and italic formatting.
- **Smart Text Replacement (White Patch):** Select an incorrect word or phrase to cover it with an opaque background patch and immediately type replacement text over it.

### 3. Redaction & Anonymization
- **Visible Redaction Markers:** Apply **Blackout** (black bars) or **Whiteout** (white patches) to obscure sensitive data (IBANs, card numbers, addresses) prior to sharing or recording demonstrations.
- **Secure Flattening:** Redaction layers and replaced text are permanently rasterized/flattened into the document canvas upon export, preventing hidden underlying text extraction.

### 4. Advanced Session-Only Signatures
- **Background Removal:** Extract signatures from images, screenshots, or clipboard paste with auto-background cleanup (transparency, sharpness, and line thickness adjustment).
- **Session-Only Memory (Maximum Privacy):** For absolute security, imported signatures reside exclusively in volatile operating memory (In-Memory) during the active session. Once the tab or document is closed, the signature is permanently purged.

### 5. Multi-Page Export & Metadata
- **Export Formats:** Save consolidated documents as flattened multi-page **PDF** or high-resolution **PNG**.
- **Embedded Metadata:** Exported PDFs include non-intrusive internal technical metadata (`Creator: Codewerk Studio`) to ensure origin tracing without placing ugly visual watermarks on official forms.
- **Direct Printing:** Print the edited canvas directly using the native browser print dialog.

---

## 📑 Supported Formats

### Input Formats
- **PDF** (`.pdf`)
- **Word Documents** (`.docx` — rendered locally for overlay)
- **Images** (`.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.bmp`)

> *Note: Legacy `.doc` files (Word 97-2003) should be converted or saved as `.docx` or PDF prior to loading.*

### Output Formats
- **PDF** (Flattened, multi-page)
- **PNG** (High-resolution image)

---

## 🔒 Privacy & Security

BRINO is engineered around strict data minimization and client-side processing:

1. **Zero External Server Uploads:** Your files, forms, personal data, and images never leave your browser environment.
2. **No Persistent Signature Storage:** Signatures are held only in RAM during your session, eliminating risks of local browser storage compromise.
3. **GDPR / Privacy Compliant:** Ideal for handling sensitive correspondence (Jobcenter, Krankenkasse, leases) safely.

---

## 🛠️ How To Use

1. Open **BRINO** from your browser extension bar.
2. Click **Add Files** or drag documents into the app workspace.
3. Use the left **Thumbnail Sidebar** to arrange or reorder pages via **Drag & Drop**.
4. Click anywhere on the document or select **Add Text Field** to type data. Select your preferred font (**Arial**, **Times New Roman**, **Calibri**, etc.).
5. Use **Smart Text Replacement** or **Redact** (Blackout/Whiteout) to cover or replace specific areas.
6. Open **Signature**, upload or paste your handwritten signature image (background is removed automatically), and place it on the signature line.
7. Click **Save Document** to export your finalized multi-page **PDF** or **PNG**.

---

## 💻 Local Installation (Developer / Testing Mode)

1. Open `chrome://extensions` or `edge://extensions`.
2. Enable **Developer mode** (toggle in top right corner).
3. Click **Load unpacked**.
4. Select the project root folder.
5. After updating code in Visual Studio Code, click **Reload** on the extension card.

---

## 🏢 Brand & Publisher Information

- **Engine:** Codewerk Studio Document Overlay Engine
- **Developer:** Codewerk Studio
- **Target Platforms:** Windows 10/11, macOS, Linux (Chromium-based browsers: Microsoft Edge, Google Chrome).

*Codewerk Studio — Secure, Local, Serverless Document Tools.*