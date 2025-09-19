// This content script runs on YouTube pages
console.log("YouTube Redirect Extension loaded");

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "getVideoId") {
    // Try to extract video ID from the page
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('v');
    sendResponse({videoId: videoId});
  }
});