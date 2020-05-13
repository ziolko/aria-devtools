const executeScript = (tabId, options) =>
  new Promise(resolve => {
    chrome.tabs.executeScript(tabId, { ...options, runAt: "document_start" }, resolve);
  });

const tabsState = {};

chrome.browserAction.onClicked.addListener(async function(tab) {
  const [isLoaded] = await executeScript(tab.id, { code: "window.isLoaded" });

  if (!isLoaded) {
    await executeScript(tab.id, { file: "inject.js" });
    tabsState[tab.id] = false;
  }

  if (tabsState[tab.id]) {
    await executeScript(tab.id, { code: "window.disable()" });
    tabsState[tab.id] = false;
  } else {
    await executeScript(tab.id, { code: "window.enable()" });
    tabsState[tab.id] = true;
  }
});
// // this is the background code...
//
chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo) {
  const [isLoaded] = await executeScript(tabId, { code: "window.isLoaded" });

  if (tabsState[tabId] && !isLoaded) {
    await executeScript(tabId, { file: "inject.js" });
    await executeScript(tabId, { code: "window.enable()" });
  }
});
