var toggleExtension = function(tab) {
    // TODO: set only for the current tab

    window.enabled = window.enabled !== undefined ? !window.enabled : true;

    if (window.enabled) {
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
    // * clean up DOM from scripts when disabled

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

chrome.browserAction.onClicked.addListener(toggleExtension);
