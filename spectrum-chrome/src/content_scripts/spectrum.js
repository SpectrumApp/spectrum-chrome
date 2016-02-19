var util = require('util');
var uuid = require('uuid4');


window._console = window.console;

window.spectrum = {
  endpoint: 'http://localhost:9000/',
  sublevel: 'browser',
  _console: window._console,
  _request: function(level, args) {
    postToSpectrum(window.spectrum.endpoint, {
      level: level,
      sublevel: window.spectrum.sublevel,
      args: args
    });
  },
  clear: function() {
    _console.clear.apply(window._console, arguments);
  },
  group: function() {
    _console.group.apply(window._console, arguments);
  },
  groupEnd: function() {
    _console.groupEnd.apply(window._console, arguments);
  },
  groupCollapsed: function() {
    _console.groupCollapsed.apply(window._console, arguments);
  },
  table: function() {
    _console.table.apply(window._console, arguments);
  },
  dir: function() {
    var args = Array.prototype.slice.call(arguments, 0);
    this._request('DEBUG', args);
    _console.dir.apply(window._console, arguments);
  },
  debug: function() {
    var args = Array.prototype.slice.call(arguments, 0);
    this._request('DEBUG', args);
    _console.debug.apply(window._console, arguments);
  },
  error: function() {
    var args = Array.prototype.slice.call(arguments, 0);
    this._request('ERROR', args);
    _console.error.apply(window._console, arguments);
  },
  info: function() {
    var args = Array.prototype.slice.call(arguments, 0);
    this._request('INFO', args);
    _console.info.apply(window._console, arguments);
  },
  log: function() {
    var args = Array.prototype.slice.call(arguments, 0);
    this._request('DEBUG', args);
    _console.log.apply(window._console, arguments);
  },
  warn: function() {
    var args = Array.prototype.slice.call(arguments, 0);
    this._request('WARNING', args);
    _console.warn.apply(window._console, arguments);
  }
};

function postToSpectrum(spectrumUrl, message) {
  uuid(function(err, id) {
    var level = message.level;
    var args = message.args;
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

document.addEventListener('spectrum:options:set', function(e) {
  var options = e.detail.payload;
  if (options.endpoint) {
    window.spectrum.endpoint = options.endpoint;
  }
  if (options.sublevelName) {
    window.spectrum.sublevel = options.sublevelName;
  }
  // Override console.log according to the user's preferences
  if (options.overrideConsole) {
    window.console = Object.assign({}, window._console, window.spectrum);
  } else {
    window.console = window._console;
  }
});

document.addEventListener('spectrum:cleanup', function(e) {
    window.console = _console;
    delete window._console;
    delete window.spectrum;
});

document.dispatchEvent(new CustomEvent('spectrum:options:get'));
