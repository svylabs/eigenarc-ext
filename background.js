// Background service worker for managing offscreen document and authentication

let offscreenReady = false;

// Create offscreen document when needed
async function ensureOffscreenDocument() {
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
    documentUrls: [chrome.runtime.getURL('offscreen.html')]
  });

  if (existingContexts.length > 0) {
    return true;
  }

  try {
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['DOM_SCRAPING'],
      justification: 'Firebase authentication'
    });
    
    // Wait for offscreen document to signal it's ready
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        console.error('Offscreen document ready timeout');
        resolve(false);
      }, 5000);
      
      const checkReady = () => {
        if (offscreenReady) {
          clearTimeout(timeout);
          resolve(true);
        } else {
          setTimeout(checkReady, 100);
        }
      };
      checkReady();
    });
  } catch (error) {
    console.error('Failed to create offscreen document:', error);
    return false;
  }
}

// Listen for messages from popup and offscreen document
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'signInWithGoogle') {
    handleAuthRequest(sendResponse);
    return true; // Keep message channel open for async response
  }
  
  if (message.action === 'offscreenReady') {
    console.log('Offscreen document is ready');
    offscreenReady = true;
    sendResponse({ success: true });
  }
  
  if (message.action === 'firebaseAuth') {
    // Forward authentication result back to popup
    if (globalThis.authResponseCallback) {
      globalThis.authResponseCallback(message.result);
      globalThis.authResponseCallback = null;
    }
    sendResponse({ success: true });
  }
});

async function handleAuthRequest(sendResponse) {
  try {
    // Ensure offscreen document exists and is ready
    const ready = await ensureOffscreenDocument();
    
    if (!ready) {
      throw new Error('Offscreen document failed to initialize');
    }
    
    // Send auth request to offscreen document
    // The offscreen document will handle the auth and send result back
    chrome.runtime.sendMessage({
      action: 'doFirebaseAuth',
      target: 'offscreen'
    });
    
    // Store the response callback for when auth completes
    globalThis.authResponseCallback = sendResponse;
    
  } catch (error) {
    console.error('Background auth error:', error);
    sendResponse({
      success: false,
      error: error.message
    });
  }
}