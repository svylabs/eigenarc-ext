// Firebase configuration for offscreen document
console.log('Offscreen document loaded');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkXsTa7_j8ZlLe8rBY7gUdvR7s3z1P2vE",
  authDomain: "eigenarc-ai.firebaseapp.com", 
  projectId: "eigenarc-ai",
  storageBucket: "eigenarc-ai.firebasestorage.app",
  appId: "1:123456789:web:abcdef1234567890"
};

// Initialize Firebase when scripts are loaded
let firebaseInitialized = false;
let auth, provider;

function initializeFirebase() {
  if (firebaseInitialized) return;
  
  try {
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    provider = new firebase.auth.GoogleAuthProvider();
    firebaseInitialized = true;
    console.log('Firebase initialized in offscreen document');
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFirebase);
} else {
  initializeFirebase();
}

// Listen for auth requests from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Offscreen received message:', message);
  
  if (message.type === 'FIREBASE_AUTH_REQUEST') {
    handleAuthRequest(message.messageId)
      .then(result => {
        // Send result back to popup
        chrome.runtime.sendMessage({
          type: 'FIREBASE_AUTH_RESPONSE',
          messageId: message.messageId,
          data: result
        });
      })
      .catch(error => {
        chrome.runtime.sendMessage({
          type: 'FIREBASE_AUTH_RESPONSE', 
          messageId: message.messageId,
          data: { success: false, error: error.message }
        });
      });
    
    sendResponse({ received: true });
    return true;
  }
});

async function handleAuthRequest(messageId) {
  try {
    if (!firebaseInitialized) {
      initializeFirebase();
      if (!firebaseInitialized) {
        throw new Error('Firebase failed to initialize');
      }
    }
    
    console.log('Starting Firebase Google sign-in...');
    
    // Sign in with Google popup
    const result = await auth.signInWithPopup(provider);
    const user = result.user;
    
    console.log('Firebase sign-in successful:', user.email);
    
    // Get Firebase ID token
    const firebaseToken = await user.getIdToken();
    
    // Call your API with Firebase token
    console.log('Calling Eigenarc API...');
    const response = await fetch('https://eigenarc.com/api/auth/firebase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firebaseToken: firebaseToken
      })
    });
    
    if (!response.ok) {
      throw new Error(`API authentication failed: ${response.status}`);
    }
    
    const userData = await response.json();
    console.log('API authentication successful');
    
    return {
      success: true,
      user: userData.user,
      firebaseUser: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }
    };
    
  } catch (error) {
    console.error('Firebase authentication error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}