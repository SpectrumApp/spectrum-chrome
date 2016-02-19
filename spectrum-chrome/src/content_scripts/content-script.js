var injectScript = function(func, args) {
  return '(' + func + ')(' + JSON.stringify(args) + ');'
};

var appendScript = function(fileName) {
  var promise = new Promise(function(resolve, reject) {
    var s = document.createElement('script');
    s.className = 'spectrumJs';
    s.src = chrome.extension.getURL(fileName);

    (document.head||document.documentElement).appendChild(s);
    s.onload = resolve;    
    return s;
  });
  return promise;
}

var i = document.createElement('input');
i.id = 'spectrumExtensionId';
i.className = 'spectrumJs';
i.type = 'hidden';
i.value = chrome.runtime.id;
console.log(chrome.runtime);
document.body.appendChild(i);

appendScript('bundles/common.bundle.js')
.then(function() {
  appendScript('bundles/spectrum.bundle.js');  
});

var updateOptions = function() {
  chrome.storage.local.get({
    endpoint: 'http://localhost:9000/',
    sublevelName: 'browser',
    overrideConsole: true
  }, function(items) {
    document.dispatchEvent(new CustomEvent('spectrum:options:set', {
      detail: {
        payload: items
      }
    }));
  });
}

document.addEventListener('spectrum:options:get', function(e) {
  updateOptions();
});

// Note: 'RW759_connectExtension' is the event name used for `.sendMessage()`,
// in case you need to hijack it.

chrome.runtime.onMessage.addListener(function(message) {
  if (message.detail.action == 'CLEANUP') {
    document.dispatchEvent(new CustomEvent('spectrum:cleanup'));

    Array.from(document.getElementsByClassName('spectrumJs')).forEach(function(node) {
      node.remove();
    });

  }  
});

chrome.storage.onChanged.addListener(function(items) {
  updateOptions();
});

