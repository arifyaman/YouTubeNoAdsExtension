// Saves options to chrome.storage
function saveOptions() {
  const redirectUrl = document.getElementById('redirectUrl').value;
  
  // Validate URL contains {videoId} placeholder
  if (!redirectUrl.includes('{videoId}')) {
    const status = document.getElementById('status');
    status.textContent = 'Error: URL must contain {videoId} placeholder';
    setTimeout(function() {
      status.textContent = '';
    }, 2000);
    return;
  }
  
  chrome.storage.sync.set({
    redirectUrl: redirectUrl
  }, function() {
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 2000);
  });
}

function restoreOptions() {
  chrome.storage.sync.get({
    redirectUrl: 'https://xlipdev.com/ytnc/{videoId}'
  }, function(items) {
    document.getElementById('redirectUrl').value = items.redirectUrl;
  });
}

document.addEventListener('DOMContentLoaded', function() {
  restoreOptions();
  document.getElementById('save').addEventListener('click', saveOptions);
});