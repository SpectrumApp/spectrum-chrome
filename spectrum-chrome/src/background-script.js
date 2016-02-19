window.enabled = window.enabled || {};

var setIconForTab = function(tabId) {
  if (window.enabled[tabId]) {
    var icons = {
        "19": "icons/19.png",
        "38": "icons/38.png"
    };
  } else {
    var icons = {
        "19": "icons/19-gray.png",
        "38": "icons/38-gray.png"
    };
  }
  chrome.browserAction.setIcon({
      path: icons
  });
  // TODO:
  // * browserAction.setTitle
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

  if (process.env.NODE_ENV === 'production') {
    var content_script = "bundles/content-script.bundle.min.js";
  } else {
    var content_script = "bundles/content-script.bundle.js";
  }
  chrome.tabs.executeScript(tab.id, {
    file: 'bundles/common.bundle.js'
  });
  chrome.tabs.executeScript(tab.id, {
    file: content_script
  });
};

chrome.tabs.onActivated.addListener(function(e) {
  setIconForTab(e.tabId);
});
chrome.browserAction.onClicked.addListener(toggleExtension);
