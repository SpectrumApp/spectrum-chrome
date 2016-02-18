var injectScript = function(func, args) {
  return '(' + func + ')(' + JSON.stringify(args) + ');'
};

var appendScript = function(fileName, cb) {
  var s = document.createElement('script');
  s.src = chrome.extension.getURL(fileName);

  (document.head||document.documentElement).appendChild(s);
  if (cb !== undefined) {
    s.onload = cb;    
  }
  /*
  s.onload = function() {
    s.parentNode.removeChild(s);
  };
  */
}

var i = document.createElement('input');
i.id = 'spectrumExtensionId';
i.type = 'hidden';
i.value = chrome.runtime.id;
console.log(chrome.runtime);
document.body.appendChild(i);

appendScript('bundles/common.bundle.js', function() {
  appendScript('bundles/console.bundle.js');  
});

chrome.runtime.onMessage.addListener(function(message, sender) {
  console.log(message.payload);
})

var updateOptions = function() {
  chrome.storage.local.get({
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

