# BRINO Scanner Bridge

BRINO is a browser extension, so it cannot call Windows scanner APIs directly from JavaScript. The scanner button uses Chrome/Edge Native Messaging to call this local Windows bridge.

The bridge opens the standard Windows WIA scan dialog and returns the scanned page to BRINO as a PNG image. It does not install scanner drivers and does not send documents to a server.

## Install

1. Load BRINO as an extension in Chrome or Edge.
2. Copy the extension ID from the browser extensions page.
3. Run PowerShell:

```powershell
powershell.exe -ExecutionPolicy Bypass -File .\install-scanner-host.ps1 -ExtensionId YOUR_EXTENSION_ID
```

After installation, press `Сканировать` in BRINO. If Windows, the scanner driver, or WIA reports an error, BRINO shows the error and keeps the editor open.
