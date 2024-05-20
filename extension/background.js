const executeScript = (tabId, options) => chrome.scripting.executeScript({ ...options, target: { tabId } });

chrome.action.onClicked.addListener(async function (tab) {
  if (!(await hasPermissionToTab(tab.id))) {
    console.log(`No permission to tab with ID ${tab.id}. Ignoring action onClicked.`);
    return;
  }

  const [{ result: isLoaded }] = await executeScript(tab.id, { func: () => window.isAriaDevToolsLoaded });

  if (!isLoaded) {
    await executeScript(tab.id, { files: ["inject.js"] });
    await setTabState(tab.id, false);
  }

  if (await getTabState(tab.id)) {
    await executeScript(tab.id, { func: () => window.disableAriaDevTools() });
    await setTabState(tab.id, false);
  } else {
    await executeScript(tab.id, { func: () => window.enableAriaDevTools() });
    await setTabState(tab.id, true);
  }
});

chrome.tabs.onUpdated.addListener(async function (tabId) {
  if (!(await hasPermissionToTab(tabId))) {
    console.log(`No permission to tab with ID ${tabId}. Ignoring tab onUpdated.`);
    return;
  }

  const { result: isLoaded } = await executeScript(tabId, { func: () => window.isAriaDevToolsLoaded });
  const tabState = await getTabState(tabId);

  if (tabState && !isLoaded) {
    await executeScript(tabId, { files: ["inject.js"] });
    await executeScript(tabId, { func: () => window.enableAriaDevTools() });
  }
});

const tabStateKey = (tabId) => `tab-state-${tabId}`;
const setTabState = (tabId, value) => chrome.storage.local.set({ [tabStateKey(tabId)]: value });
const getTabState = async (tabId) => {
  const key = tabStateKey(tabId);
  const value = await chrome.storage.local.get([key]);
  return value[key];
};

const hasPermissionToTab = (tabId) =>
  executeScript(tabId, { func: () => window.isAriaDevToolsLoaded }).then(
    () => true,
    () => false
  );
