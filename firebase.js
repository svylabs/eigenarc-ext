// Firebase configuration and authentication - from firebase_barebones_javascript integration
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Export auth functions for use in popup.js
window.firebaseAuth = {
  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
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
        firebaseUser: result.user
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  onAuthStateChanged: (callback) => {
    return onAuthStateChanged(auth, callback);
  },
  
  signOut: () => {
    return auth.signOut();
  }
};