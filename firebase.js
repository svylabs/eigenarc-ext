// Firebase Authentication for Chrome Extensions - v9+ modular web-extension
console.log('Firebase auth loading...');

// Import Firebase modules using web-extension compatible patterns
import { initializeApp } from './firebase-app.mjs';
import { 
  initializeAuth, 
  indexedDBLocalPersistence,
  signInWithCredential, 
  GoogleAuthProvider, 
  signOut 
} from './firebase-auth.mjs';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAu9FxC6G8fOpNaxK_9gR1XpJHFo_vyH68",
  authDomain: "eigenarc.firebaseapp.com", 
  projectId: "eigenarc",
  storageBucket: "eigenarc.firebasestorage.app",
  appId: "1:1028034416026:web:e7d6d41d22e6d14f02fe23"
};

// Initialize Firebase with web-extension compatible auth
const firebaseApp = initializeApp(firebaseConfig);
const auth = initializeAuth(firebaseApp, {
  persistence: indexedDBLocalPersistence
});

// Export auth functions for use in popup.js
window.firebaseAuth = {
  signInWithGoogle: async () => {
    try {
      console.log('Starting Chrome Identity authentication...');
      
      // Step 1: Firebase is already loaded from local files
      
      // Step 2: Get Google OAuth token via Chrome Identity API with openid scope
      const token = await chrome.identity.getAuthToken({
        interactive: true,
        scopes: [
          'openid',
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile'
        ]
      });
      
      if (!token) {
        throw new Error('Failed to get Google access token');
      }
      
      console.log('Got Google token, signing into Firebase...');
      
      // Step 3: Create Firebase credential with the Google token
      const credential = GoogleAuthProvider.credential(null, token);
      
      // Step 4: Sign in to Firebase with the credential using modular API
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;
      
      console.log('Firebase sign-in successful:', user.email);
      
      // Step 5: Get Firebase ID token
      const firebaseToken = await user.getIdToken();
      
      // Step 6: Call your existing API with the Firebase token
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
      // Sign out from Firebase using modular API
      await signOut(auth);
      
      // Remove Chrome identity token
      const token = await chrome.identity.getAuthToken({ interactive: false });
      if (token) {
        await chrome.identity.removeCachedAuthToken({ token });
      }
      
      // Clear stored user data and reset to examples tab
      await chrome.storage.local.remove(['currentUser']);
      await chrome.storage.local.set({ currentTab: 'examples' });
      
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