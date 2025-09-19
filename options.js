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
    // Update status to let user know options were saved
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 2000);
    
    // Update context menu title
    chrome.runtime.sendMessage({action: "updateContextMenu"});
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage
function restoreOptions() {
  chrome.storage.sync.get({
    redirectUrl: 'https://www.youtube-nocookie.com/embed/{videoId}'
  }, function(items) {
    document.getElementById('redirectUrl').value = items.redirectUrl;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);