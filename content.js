// Content script: adds a small "Заполнить в BRINO" button when the page is a PDF.
(function () {
  const isPdf =
    location.pathname.toLowerCase().endsWith(".pdf") ||
    document.contentType === "application/pdf";
  if (!isPdf || window.__pdfSignerInjected) return;
  window.__pdfSignerInjected = true;

  const btn = document.createElement("button");
  btn.textContent = "✍ Заполнить в BRINO";
  Object.assign(btn.style, {
    position: "fixed",
    zIndex: "2147483647",
    right: "16px",
    bottom: "16px",
    padding: "10px 14px",
    borderRadius: "999px",
    border: "0",
    background: "#2f7cf6",
    color: "#fff",
    font: "600 13px system-ui, sans-serif",
    boxShadow: "0 6px 20px rgba(0,0,0,.35)",
    cursor: "pointer",
  });
  btn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "OPEN_EDITOR_WITH_URL", url: location.href });
  });
  document.documentElement.appendChild(btn);
})();

