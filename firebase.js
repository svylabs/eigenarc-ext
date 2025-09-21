// Firebase configuration and authentication - Chrome extension compatible version
console.log('Firebase script loading...');

// Wait for Firebase to load
document.addEventListener('DOMContentLoaded', () => {
  if (typeof firebase === 'undefined') {
    console.error('Firebase not loaded from CDN');
    return;
  }

  // Get environment variables from Chrome extension
  chrome.storage.local.get(['firebaseConfig'], (result) => {
    let config;
    
    if (result.firebaseConfig) {
      config = result.firebaseConfig;
    } else {
      // Use your actual Firebase credentials
      config = {
        apiKey: "AIzaSyAkXsTa7_j8ZlLe8rBY7gUdvR7s3z1P2vE", // Replace with your actual API key
        authDomain: "eigenarc-ai.firebaseapp.com", // Replace with your actual auth domain
        projectId: "eigenarc-ai", // Replace with your actual project ID
        storageBucket: "eigenarc-ai.firebasestorage.app", // Replace with your actual storage bucket
        appId: "1:123456789:web:abcdef1234567890" // Replace with your actual app ID
      };
      
      // Store config for future use
      chrome.storage.local.set({ firebaseConfig: config });
    }

    try {
      // Initialize Firebase
      firebase.initializeApp(config);
      const auth = firebase.auth();
      const provider = new firebase.auth.GoogleAuthProvider();

      console.log('Firebase initialized successfully');

      // Export auth functions for use in popup.js
      window.firebaseAuth = {
        signInWithGoogle: async () => {
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
          return auth.onAuthStateChanged(callback);
        },
        
        signOut: () => {
          return auth.signOut();
        }
      };

      // Notify popup.js that Firebase is ready
      window.firebaseReady = true;
      document.dispatchEvent(new Event('firebaseReady'));
      
    } catch (error) {
      console.error('Firebase initialization error:', error);
    }
  });
});