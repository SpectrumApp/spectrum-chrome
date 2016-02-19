window.enabled = window.enabled || {};

var setIconForTab = function(tabId) {
  if (window.enabled[tabId]) {
    var icons = {
        "19": "icons/19.png",
        "38": "icons/38.png"
    };
    var title = "Logging to Spectum is enabled";
  } else {
    var icons = {
        "19": "icons/19-gray.png",
        "38": "icons/38-gray.png"
    };
    var title = "Logging to Spectum is not enabled";
  }
  chrome.browserAction.setIcon({
      path: icons,
      tabId: tabId
  });
  chrome.browserAction.setTitle({
      title: title,
      tabId: tabId
  });
};

var toggleExtension = function(tab) {
  window.enabled[tab.id] = window.enabled[tab.id] !== undefined ? !window.enabled[tab.id] : true;

  setIconForTab(tab.id);

  if (!window.enabled[tab.id]) {
    chrome.tabs.sendMessage(tab.id, {
      detail: {
        action: 'CLEANUP'
      }
    });
    return;
  }

  chrome.tabs.executeScript(tab.id, {
    file: 'bundles/common.bundle.js'
  });
  chrome.tabs.executeScript(tab.id, {
    file: 'bundles/content-script.bundle.js'
  });
};

chrome.browserAction.onClicked.addListener(toggleExtension);
