// Firebase configuration for offscreen document
const firebaseConfig = {
  apiKey: "AIzaSyAkXsTa7_j8ZlLe8rBY7gUdvR7s3z1P2vE",
  authDomain: "eigenarc-ai.firebaseapp.com", 
  projectId: "eigenarc-ai",
  storageBucket: "eigenarc-ai.firebasestorage.app",
  appId: "1:123456789:web:abcdef1234567890"
};

// Initialize Firebase
console.log('Offscreen: Initializing Firebase...');
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// Signal that offscreen document is ready
chrome.runtime.sendMessage({
  action: 'offscreenReady'
}).catch(error => {
  console.error('Failed to signal ready:', error);
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Offscreen received message:', message);
  
  if (message.action === 'doFirebaseAuth' && message.target === 'offscreen') {
    signInWithGoogle()
      .then(result => {
        // Send result back to background script
        chrome.runtime.sendMessage({
          action: 'firebaseAuth',
          result: result
        });
        sendResponse({ success: true });
      })
      .catch(error => {
        const errorResult = { success: false, error: error.message };
        chrome.runtime.sendMessage({
          action: 'firebaseAuth', 
          result: errorResult
        });
        sendResponse(errorResult);
      });
    return true; // Keep message channel open for async response
  }
});

async function signInWithGoogle() {
  try {
    const result = await auth.signInWithPopup(provider);
    const token = await result.user.getIdToken();
    
    // Call Eigenarc API to authenticate
    const response = await fetch('https://eigenarc.com/api/auth/firebase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firebaseToken: token
      })
    });
    
    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.status}`);
    }
    
    const userData = await response.json();
    return {
      success: true,
      user: userData.user,
      firebaseUser: {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName
      }
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}