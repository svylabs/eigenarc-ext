// Firebase Authentication for Chrome Extensions - CSP-compliant approach
console.log('Firebase auth loading...');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkXsTa7_j8ZlLe8rBY7gUdvR7s3z1P2vE",
  authDomain: "eigenarc-ai.firebaseapp.com", 
  projectId: "eigenarc-ai",
  storageBucket: "eigenarc-ai.firebasestorage.app",
  appId: "1:123456789:web:abcdef1234567890"
};

// Load Firebase dynamically to bypass CSP
let firebaseApp, auth;
const loadFirebase = async () => {
  if (firebaseApp) return { firebaseApp, auth };
  
  try {
    // Create script elements for Firebase
    const appScript = document.createElement('script');
    appScript.src = 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js';
    
    const authScript = document.createElement('script');
    authScript.src = 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js';
    
    // Load Firebase App first
    await new Promise((resolve, reject) => {
      appScript.onload = resolve;
      appScript.onerror = reject;
      document.head.appendChild(appScript);
    });
    
    // Then load Firebase Auth
    await new Promise((resolve, reject) => {
      authScript.onload = resolve;
      authScript.onerror = reject;
      document.head.appendChild(authScript);
    });
    
    // Initialize Firebase
    firebaseApp = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    
    console.log('Firebase initialized successfully');
    return { firebaseApp, auth };
    
  } catch (error) {
    console.error('Firebase loading error:', error);
    throw error;
  }
};

// Export auth functions for use in popup.js
window.firebaseAuth = {
  signInWithGoogle: async () => {
    try {
      console.log('Starting Chrome Identity authentication...');
      
      // Step 1: Load Firebase if not already loaded
      const { auth } = await loadFirebase();
      
      // Step 2: Get Google OAuth token via Chrome Identity API
      const token = await chrome.identity.getAuthToken({
        interactive: true,
        scopes: [
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile'
        ]
      });
      
      if (!token) {
        throw new Error('Failed to get Google access token');
      }
      
      console.log('Got Google token, signing into Firebase...');
      
      // Step 3: Create Firebase credential with the Google token
      const credential = firebase.auth.GoogleAuthProvider.credential(null, token);
      
      // Step 4: Sign in to Firebase with the credential
      const userCredential = await auth.signInWithCredential(credential);
      const user = userCredential.user;
      
      console.log('Firebase sign-in successful:', user.email);
      
      // Step 5: Get Firebase ID token
      const firebaseToken = await user.getIdToken();
      
      // Step 6: Call your API with the Firebase token
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
  },
  
  signOut: async () => {
    try {
      // Sign out from Firebase if loaded
      if (auth) {
        await auth.signOut();
      }
      
      // Remove Chrome identity token
      const token = await chrome.identity.getAuthToken({ interactive: false });
      if (token) {
        await chrome.identity.removeCachedAuthToken({ token });
      }
      
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