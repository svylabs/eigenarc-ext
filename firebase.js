// Firebase authentication via offscreen document - Chrome extension compatible
console.log('Firebase auth bridge loading...');

// Create offscreen document if needed
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
    reasons: ['DOM_SCRAPING'], // Required reason
    justification: 'Firebase authentication'
  });
}

// Export auth functions for use in popup.js
window.firebaseAuth = {
  signInWithGoogle: async () => {
    try {
      await ensureOffscreenDocument();
      
      // Send message to offscreen document to handle auth
      const response = await chrome.runtime.sendMessage({
        action: 'signInWithGoogle'
      });
      
      return response;
    } catch (error) {
      console.error('Authentication error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  signOut: async () => {
    // Clear stored user data
    await chrome.storage.local.remove(['currentUser']);
    return true;
  }
};

// Notify popup.js that Firebase is ready
window.firebaseReady = true;
document.dispatchEvent(new Event('firebaseReady'));