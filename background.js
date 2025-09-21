// Background service worker for managing offscreen document and authentication

// Create offscreen document when needed
async function ensureOffscreenDocument() {
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
    documentUrls: [chrome.runtime.getURL('offscreen.html')]
  });

  if (existingContexts.length > 0) {
    return;
  }

  await chrome.offscreen.createDocument({
    url: 'offscreen.html',
    reasons: ['DOM_SCRAPING'],
    justification: 'Firebase authentication'
  });
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'signInWithGoogle') {
    handleAuthRequest(sendResponse);
    return true; // Keep message channel open for async response
  }
});

async function handleAuthRequest(sendResponse) {
  try {
    // Ensure offscreen document exists
    await ensureOffscreenDocument();
    
    // Forward request to offscreen document
    const response = await chrome.runtime.sendMessage({
      action: 'signInWithGoogle',
      target: 'offscreen'
    });
    
    sendResponse(response);
  } catch (error) {
    console.error('Background auth error:', error);
    sendResponse({
      success: false,
      error: error.message
    });
  }
}