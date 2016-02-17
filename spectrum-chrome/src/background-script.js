// Only available is `browser_action` does not have a popup
//
// 
// 

// TODO: replace with actual uuid4 npm module

var util = require('util');
var uuid = require('uuid4');


function postToSpectrum(message) {
  uuid(function(err, id) {
    var level = message.level;
    var args = message.args;
    var spectrumUrl = 'http://localhost:9000';
    var x = new XMLHttpRequest();
    x.open('POST', spectrumUrl);
    x.responseType = 'json';
    x.setRequestHeader('Content-Type', 'application/json');
    x.send(JSON.stringify({
      id: id,
      timestamp: new Date().toISOString(),
      level: level,
      sublevel: message.sublevel,
      message: util.format(...args),
      args: args
    }));
  })
}

//window.enabled = window.enabled !== undefined ? !window.enabled : true;
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
    // * update #toggleBtn text
    // * browserAction.setTitle

    if (process.env.NODE_ENV === 'production') {
      var content_script = "bundles/console.bundle.min.js";
    } else {
      var content_script = "bundles/console.bundle.js";
    }
    chrome.tabs.executeScript(tab.id, {
      file: content_script
    });
};

window._console = window.console;

window.spectrum = {
  sublevel: 'browser',
  log: function() {
    var args = Array.prototype.slice.call(arguments, 0);
    postToSpectrum({
      level: 'DEBUG',
      sublevel: window.spectrum.sublevel,
      args: args
    });
    _console.log(...args);
    //    _console.log.apply(console, arguments);
  }
};


console.log(chrome.storage);

var updateOptions = function() {
  chrome.storage.local.get({
    sublevelName: 'browser',
    overrideConsole: true
  }, function(items) {
      if (items.sublevelName) {
        window.spectrum.sublevel = items.sublevelName;
      }
      // Override console.log according to the user's preferences
      if (items.overrideConsole) {
        window.console = Object.assign({}, window._console, window.spectrum);
      } else {
        window.console = window._console;
      }
  });
}

updateOptions();

chrome.storage.onChanged.addListener(function(items) {
  updateOptions();
});

//chrome.browserAction.onClicked.addListener(toggleExtension);
