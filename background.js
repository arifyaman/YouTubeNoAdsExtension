// Create right-click context menu
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.get(['redirectUrl'], function(result) {
    const redirectUrl = result.redirectUrl || 'https://xlipdev.com/ytnc/{videoId}';
    
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
    let videoId = extractVideoId(info.linkUrl || tab.url);
    
    if (videoId) {
      // Get the redirect URL from storage
      chrome.storage.sync.get(['redirectUrl'], function(result) {
        const redirectUrl = result.redirectUrl || 'https://xlipdev.com/ytnc/{videoId}';
        const finalUrl = redirectUrl.replace('{videoId}', videoId);
        
        // Open directly to your domain
        chrome.tabs.create({ url: finalUrl });
      });
    }
  }
});

function extractVideoId(url) {
  if (!url) return null;
  
  // Handle youtu.be short URLs
  if (url.includes('youtu.be/')) {
    const match = url.match(/youtu\.be\/([^&?\/\s]+)/);
    return match ? match[1] : null;
  }
  
  // Handle standard YouTube URLs
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?\/\s]+)/);
  return match ? match[1] : null;
}