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
    /*
    s.onload = function() {
      s.parentNode.removeChild(s);
    };
    */
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

chrome.runtime.onMessage.addListener(function(message, sender) {
  console.log(message.payload);
})

var updateOptions = function() {
  chrome.storage.local.get({
    endpoint: 'http://localhost:9000/',
    sublevelName: 'browser',
    overrideConsole: true
  }, function(items) {
    document.dispatchEvent(new CustomEvent('RW759_connectExtension', {
      detail: {
        action: 'SET_CONSOLE_OPTIONS',
        payload: items
      }
    }));
  });
}

document.addEventListener('RW759_connectExtension', function(e) {
  if (e.detail.action == 'GET_CONSOLE_OPTIONS') {
    updateOptions();
  }
});

chrome.storage.onChanged.addListener(function(items) {
  updateOptions();
});

