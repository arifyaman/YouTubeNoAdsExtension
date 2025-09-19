// Create right-click context menu
chrome.runtime.onInstalled.addListener(function() {
  // Get saved redirect URL or use default
  chrome.storage.sync.get(['redirectUrl'], function(result) {
    const redirectUrl = result.redirectUrl || 'https://www.youtube-nocookie.com/embed/{videoId}';
    
    chrome.contextMenus.create({
      id: "redirect-youtube",
      title: "Watch on No-Cookie (Without Ads)",
      contexts: ["link", "video", "page"],
      documentUrlPatterns: ["*://*.youtube.com/*"]
    });
  });
});

// Update context menu when storage changes
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (changes.redirectUrl) {
    chrome.contextMenus.update("redirect-youtube", {
      title: "Watch on No-Cookie (Without Ads)"
    });
  }
});

// Add listener for context menu clicks
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "redirect-youtube") {
    let videoId = null;
    
    // Extract video ID from various YouTube URL formats
    if (info.linkUrl && info.linkUrl.includes('youtube.com/watch?v=')) {
      videoId = info.linkUrl.split('v=')[1];
      const ampersandPosition = videoId.indexOf('&');
      if (ampersandPosition !== -1) {
        videoId = videoId.substring(0, ampersandPosition);
      }
    } else if (tab.url.includes('youtube.com/watch?v=')) {
      videoId = tab.url.split('v=')[1];
      const ampersandPosition = videoId.indexOf('&');
      if (ampersandPosition !== -1) {
        videoId = videoId.substring(0, ampersandPosition);
      }
    }
    
    if (videoId) {
      // Get the redirect URL from storage
      chrome.storage.sync.get(['redirectUrl'], function(result) {
        const redirectUrl = result.redirectUrl || 'https://www.youtube-nocookie.com/embed/{videoId}';
        const finalUrl = redirectUrl.replace('{videoId}', videoId);
        
        // Create new tab with the redirect URL
        chrome.tabs.create({ url: finalUrl });
      });
    } else {
      console.log('Could not extract YouTube video ID');
    }
  }
});