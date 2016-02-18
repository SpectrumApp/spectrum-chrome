var util = require('util');
var uuid = require('uuid4');


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

document.addEventListener('RW759_connectExtension', function(e) {
  // TODO: Add origin validation
  if (e.detail.action == 'SET_CONSOLE_OPTIONS') {
    var options = e.detail.payload;
    if (options.sublevelName) {
      window.spectrum.sublevel = options.sublevelName;
    }
    // Override console.log according to the user's preferences
    if (options.overrideConsole) {
      window.console = Object.assign({}, window._console, window.spectrum);
    } else {
      window.console = window._console;
    }
  }
});

setTimeout(function() {
  document.dispatchEvent(new CustomEvent('RW759_connectExtension', {
    detail: {
      action: 'GET_CONSOLE_OPTIONS'
    }
  }));
}, 0);
