document.getElementById("open").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "OPEN_EDITOR" }, () => window.close());
});

document.getElementById("signatures").addEventListener("click", () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
  window.close();
});
