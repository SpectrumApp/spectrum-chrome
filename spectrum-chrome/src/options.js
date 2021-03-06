// Saves options to chrome.storage.local.
function save_options() {
  var overrideConsole = document.getElementById('overrideConsole').checked;
  var endpoint = document.getElementById('endpoint').value;
  var sublevelName = document.getElementById('sublevelName').value;

  chrome.storage.local.set({
    endpoint: endpoint,
    sublevelName: sublevelName,
    overrideConsole: overrideConsole
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.local.get({
    endpoint: 'http://localhost:9000/',
    sublevelName: 'browser',
    overrideConsole: true,
  }, function(items) {
    document.getElementById('endpoint').value = items.endpoint;
    document.getElementById('sublevelName').value = items.sublevelName;
    document.getElementById('overrideConsole').checked = items.overrideConsole;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
