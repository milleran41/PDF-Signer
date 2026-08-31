# BRINO

BRINO is a browser extension for filling forms and adding signatures without printing the document first.

Important: BRINO is not a full PDF editor. It does not change the original text, images, structure, or fields inside the source document. The app renders the selected document as a background and lets you place a new editable layer on top of it: text notes, filled-in lines, and a saved signature. The result is exported as a new PDF or PNG file.

## Why It Exists

Many official forms still have to be filled by hand, printed, signed, scanned, and sent back. BRINO helps avoid that cycle:

- fill PDF, DOCX, PNG, JPG, and scanned documents directly in the browser;
- add text precisely over lines or cells with a helper grid;
- create a reusable signature template from a drawing, file, screenshot, or clipboard image;
- save the finished document without using paper or printer ink;
- keep document processing local in the browser.

## Main Features

- Local document editor for PDF, DOCX, and image files.
- Multiple pages with thumbnails in the left panel.
- Page removal and full document clearing.
- Helper grid with cell mode and ruled-line mode.
- Row step, layer offset, text lift, line spacing, document scale, zoom, and slight scan rotation.
- Red alignment guide for straightening scanned pages.
- Text fields placed by clicking on the document.
- Reusable saved signatures.
- Signature extraction from files, PDFs, images, screenshots, and clipboard paste.
- Signature cleanup: background removal, darkness, sharpness, thickness, and color.
- Local draft restore after page refresh.
- Multilingual interface.
- Export to PDF or PNG.

## Supported Formats

Input:

- PDF
- DOCX
- PNG, JPG, JPEG, WEBP, GIF, BMP

Legacy `.doc` files are not reliably rendered directly in the browser. Save old Word files as `.docx`, PDF, or an image before adding them.

Output:

- PDF
- PNG

## Supported Platforms

BRINO is intended for desktop and laptop computers.

Tested target:

- Windows 10 and Windows 11
- Google Chrome
- Microsoft Edge

Expected but not yet fully verified:

- macOS 13+ with a Chromium-based browser
- Linux with a Chromium-based browser

If you install BRINO on macOS or Linux, feedback about installation, PDF rendering, clipboard paste, saving files, and signature handling is welcome.

## Privacy

BRINO is designed to work locally in the browser. Documents are processed on the user's device and are not intentionally uploaded to external servers by the extension.

The extension stores saved signatures and the current draft locally in the browser so work can be reused or restored after a refresh. Exported documents may contain a small technical origin mark identifying the app.

See [PRIVACY.md](PRIVACY.md) for details.

## How To Use

1. Open BRINO from the browser extension icon.
2. Click **Add files** or choose a document on the home page.
3. Select a page from the thumbnails on the left.
4. Use rotation, document size, grid, row step, layer offset, and guide controls to align the document.
5. Click the document to add a text field.
6. Select a text field to change its font, size, color, lift, and line spacing.
7. Open **Create signature** to draw a signature or extract one from a file, screenshot, or clipboard image.
8. Insert a saved signature into the document.
9. Choose PDF or PNG and click **Save document**.

## Local Installation For Testing

1. Open `chrome://extensions` or `edge://extensions`.
2. Enable developer mode.
3. Choose **Load unpacked**.
4. Select this project folder.
5. After each code update, click **Reload** on the extension page.

## Microsoft Edge Add-ons Preparation

Before submitting to Microsoft Edge Add-ons, prepare:

- a production ZIP package of the extension files;
- final extension name, short description, and long description;
- icon and required store images;
- clear screenshots showing the editor, signature workflow, and saved result;
- privacy information and a public privacy policy URL;
- permission justifications for `storage`, `downloads`, `clipboardRead`, `activeTab`, and page matching used by the content script;
- certification testing notes explaining how reviewers can open the editor, load a sample document, add text/signature, and export the result.

The listing should clearly say that this is a form filling and signing tool, not an editor for changing the original PDF content.

After publication, the in-app rating prompt should open the Microsoft Edge Add-ons listing page, where users can leave a rating and written review.

## Current Status

The project is usable as a local unpacked extension and is close to store preparation, but it still needs final store assets, privacy-policy hosting, package review, and manual testing before public submission.

