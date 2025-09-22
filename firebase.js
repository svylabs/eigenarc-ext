// Firebase Authentication for Chrome Extensions - Using offscreen document approach
console.log('Firebase auth loading...');

// Create and manage offscreen document for Firebase auth
async function setupOffscreenDocument() {
  const offscreenUrl = chrome.runtime.getURL('offscreen.html');
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
    documentUrls: [offscreenUrl]
  });

  if (existingContexts.length > 0) {
    return;
  }

  // Create offscreen document
  await chrome.offscreen.createDocument({
    url: 'offscreen.html',
    reasons: ['DOM_SCRAPING'],
    justification: 'Firebase Authentication'
  });
}

// Export auth functions for use in popup.js
window.firebaseAuth = {
  signInWithGoogle: async () => {
    try {
      // Setup offscreen document
      await setupOffscreenDocument();
      
      // Send authentication request to offscreen document
      const response = await new Promise((resolve, reject) => {
        const messageId = Date.now().toString();
        
        const messageListener = (message, sender, sendResponse) => {
          if (message.type === 'FIREBASE_AUTH_RESPONSE' && message.messageId === messageId) {
            chrome.runtime.onMessage.removeListener(messageListener);
            resolve(message.data);
          }
        };
        
        chrome.runtime.onMessage.addListener(messageListener);
        
        // Send request to offscreen document
        chrome.runtime.sendMessage({
          type: 'FIREBASE_AUTH_REQUEST',
          messageId: messageId
        });
        
        // Timeout after 30 seconds
        setTimeout(() => {
          chrome.runtime.onMessage.removeListener(messageListener);
          reject(new Error('Authentication timeout'));
        }, 30000);
      });
      
      if (response.success) {
        return response;
      } else {
        throw new Error(response.error);
      }
      
    } catch (error) {
      console.error('Firebase authentication error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  signOut: async () => {
    try {
      // Remove Chrome identity token
      await chrome.identity.removeCachedAuthToken({
        token: await chrome.identity.getAuthToken({ interactive: false })
      });
      
      // Clear stored user data
      await chrome.storage.local.remove(['currentUser']);
      
      return true;
    } catch (error) {
      console.error('Sign out error:', error);
      return false;
    }
  }
};

// Notify popup.js that Firebase is ready
window.firebaseReady = true;
document.dispatchEvent(new Event('firebaseReady'));