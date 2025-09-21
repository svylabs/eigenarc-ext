// Firebase authentication for Chrome extension - proper approach
console.log('Firebase auth loading...');

// Initialize Firebase with proper configuration
const initFirebase = async () => {
  // Import Firebase modules (these work in Chrome extensions)
  const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
  const { getAuth, GoogleAuthProvider, signInWithCredential } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
  
  const firebaseConfig = {
    apiKey: "AIzaSyAkXsTa7_j8ZlLe8rBY7gUdvR7s3z1P2vE",
    authDomain: "eigenarc-ai.firebaseapp.com", 
    projectId: "eigenarc-ai",
    storageBucket: "eigenarc-ai.firebasestorage.app",
    appId: "1:123456789:web:abcdef1234567890"
  };
  
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  
  return { auth, GoogleAuthProvider, signInWithCredential };
};

// Export auth functions for use in popup.js
window.firebaseAuth = {
  signInWithGoogle: async () => {
    try {
      // Step 1: Get Google OAuth token via Chrome Identity API
      const accessToken = await chrome.identity.getAuthToken({
        interactive: true,
        scopes: ['openid', 'email', 'profile']
      });
      
      if (!accessToken) {
        throw new Error('Failed to get Google access token');
      }
      
      // Step 2: Initialize Firebase and sign in with credential
      const { auth, GoogleAuthProvider, signInWithCredential } = await initFirebase();
      
      // Create Google credential for Firebase
      const credential = GoogleAuthProvider.credential(null, accessToken);
      
      // Sign in to Firebase with the Google credential
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;
      
      // Step 3: Get Firebase ID token
      const firebaseToken = await user.getIdToken();
      
      // Step 4: Send Firebase token to your API
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