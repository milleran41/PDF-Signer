document.getElementById("open").addEventListener("click", () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("editor.html") });
  window.close();
});

document.getElementById("signatures").addEventListener("click", () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
  window.close();
});
