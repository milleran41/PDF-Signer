// MV3 service worker: opens the editor and answers "open document" requests.

const EDITOR_URL = "editor.html";

function openEditor(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = chrome.runtime.getURL(EDITOR_URL) + (qs ? `?${qs}` : "");
  return chrome.tabs.create({ url });
}

chrome.runtime.onInstalled.addListener(() => {
  console.log("[BRINO] installed");
});

chrome.action.onClicked.addListener(() => {
  openEditor();
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === "OPEN_EDITOR") {
    openEditor(msg.params || {}).then((tab) => sendResponse({ ok: true, tabId: tab.id }));
    return true; // async response
  }
  if (msg?.type === "OPEN_EDITOR_WITH_URL" && msg.url) {
    openEditor({ src: msg.url }).then((tab) => sendResponse({ ok: true, tabId: tab.id }));
    return true;
  }
  return false;
});

