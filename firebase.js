// Firebase authentication bridge for Chrome extension popup
console.log('Firebase auth bridge loading...');

// Export auth functions for use in popup.js
window.firebaseAuth = {
  signInWithGoogle: async () => {
    try {
      // Send message to background script which handles offscreen document
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