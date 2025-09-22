// Firebase Authentication for Chrome Extensions using REST API
console.log('Firebase auth loading...');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAu9FxC6G8fOpNaxK_9gR1XpJHFo_vyH68",
  authDomain: "eigenarc.firebaseapp.com", 
  projectId: "eigenarc",
  storageBucket: "eigenarc.firebasestorage.app",
  appId: "1:1028034416026:web:e7d6d41d22e6d14f02fe23"
};

// Helper to promisify Chrome Identity API
function chromeIdentityGetAuthToken(options) {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken(options, (token) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(token);
      }
    });
  });
}

function chromeIdentityRemoveCachedAuthToken(options) {
  return new Promise((resolve, reject) => {
    chrome.identity.removeCachedAuthToken(options, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve();
      }
    });
  });
}

// Current user state
let currentUser = null;

// Firebase REST API authentication
async function signInWithGoogleToken(googleAccessToken) {
  try {
    // Step 1: Exchange Google access token for Firebase custom token using Firebase Auth REST API
    const signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=${firebaseConfig.apiKey}`;
    
    const requestBody = {
      requestUri: 'http://localhost',  // Required by Firebase, can be dummy for extensions
      postBody: `access_token=${googleAccessToken}&providerId=google.com`,
      returnSecureToken: true,
      returnIdpCredential: true
    };
    
    console.log('Calling Firebase Auth REST API...');
    const response = await fetch(signInUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Firebase Auth API error: ${error.error?.message || response.status}`);
    }
    
    const authData = await response.json();
    console.log('Firebase authentication successful');
    
    // The idToken is the Firebase ID token you need for your API
    return {
      firebaseIdToken: authData.idToken,
      refreshToken: authData.refreshToken,
      expiresIn: authData.expiresIn,
      localId: authData.localId,
      email: authData.email,
      displayName: authData.displayName,
      photoUrl: authData.photoUrl
    };
    
  } catch (error) {
    console.error('Firebase REST API authentication error:', error);
    throw error;
  }
}

// Export auth functions for use in popup.js
window.firebaseAuth = {
  signInWithGoogle: async () => {
    try {
      console.log('Starting Firebase authentication...');
      
      // Step 1: Get Google OAuth token via Chrome Identity API
      const googleToken = await chromeIdentityGetAuthToken({
        interactive: true,
        scopes: [
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile'
        ]
      });
      
      if (!googleToken) {
        throw new Error('Failed to get Google access token');
      }
      
      console.log('Got Google token, signing into Firebase...');
      
      // Step 2: Sign in to Firebase using REST API with Google token
      const firebaseAuth = await signInWithGoogleToken(googleToken);
      
      console.log('Firebase sign-in successful:', firebaseAuth.email);
      
      // Step 3: Call your existing API with the Firebase ID token
      console.log('Calling Eigenarc API with Firebase ID token...');
      const response = await fetch('https://eigenarc.com/api/auth/firebase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebaseToken: firebaseAuth.firebaseIdToken
        })
      });
      
      let userData = null;
      if (response.ok) {
        userData = await response.json();
        console.log('API authentication successful');
      } else {
        console.log('API authentication failed, using local user data');
        // Use Firebase user data as fallback
        userData = {
          user: {
            uid: firebaseAuth.localId,
            email: firebaseAuth.email,
            displayName: firebaseAuth.displayName,
            photoURL: firebaseAuth.photoUrl
          }
        };
      }
      
      // Store user data locally with refresh token and expiry
      currentUser = {
        ...userData.user,
        firebaseToken: firebaseAuth.firebaseIdToken,
        refreshToken: firebaseAuth.refreshToken,
        tokenExpiry: Date.now() + (parseInt(firebaseAuth.expiresIn) * 1000)
      };
      
      await chrome.storage.local.set({ 
        currentUser: currentUser,
        firebaseAuth: {
          idToken: firebaseAuth.firebaseIdToken,
          refreshToken: firebaseAuth.refreshToken,
          expiresIn: firebaseAuth.expiresIn,
          tokenExpiry: currentUser.tokenExpiry
        }
      });
      
      return {
        success: true,
        user: userData.user,
        firebaseUser: {
          uid: firebaseAuth.localId,
          email: firebaseAuth.email,
          displayName: firebaseAuth.displayName,
          photoURL: firebaseAuth.photoUrl
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
      // Clear current user
      currentUser = null;
      
      // Remove Chrome identity token
      try {
        const token = await chromeIdentityGetAuthToken({ interactive: false });
        if (token) {
          await chromeIdentityRemoveCachedAuthToken({ token });
        }
      } catch (e) {
        console.log('No token to remove or already signed out');
      }
      
      // Clear stored user data and reset to examples tab
      await chrome.storage.local.remove(['currentUser', 'firebaseAuth']);
      await chrome.storage.local.set({ currentTab: 'examples' });
      
      return true;
    } catch (error) {
      console.error('Sign out error:', error);
      return false;
    }
  },
  
  refreshFirebaseToken: async () => {
    try {
      if (!currentUser || !currentUser.refreshToken) {
        throw new Error('No refresh token available');
      }
      
      console.log('Refreshing Firebase ID token...');
      
      const refreshUrl = `https://securetoken.googleapis.com/v1/token?key=${firebaseConfig.apiKey}`;
      const response = await fetch(refreshUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'refresh_token',
          refresh_token: currentUser.refreshToken
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error('Token refresh failed:', error);
        
        // If refresh token is expired, sign out
        if (error.error?.message?.includes('TOKEN_EXPIRED') || response.status === 400) {
          console.log('Refresh token expired, signing out user');
          await window.firebaseAuth.signOut();
          throw new Error('Refresh token expired - user signed out');
        }
        
        throw new Error(`Token refresh failed: ${error.error?.message || response.status}`);
      }
      
      const tokenData = await response.json();
      
      // Update current user with new token
      currentUser = {
        ...currentUser,
        firebaseToken: tokenData.id_token,
        refreshToken: tokenData.refresh_token,
        tokenExpiry: Date.now() + (parseInt(tokenData.expires_in) * 1000)
      };
      
      // Update storage
      await chrome.storage.local.set({ 
        currentUser: currentUser,
        firebaseAuth: {
          idToken: tokenData.id_token,
          refreshToken: tokenData.refresh_token,
          expiresIn: tokenData.expires_in,
          tokenExpiry: currentUser.tokenExpiry
        }
      });
      
      console.log('Firebase token refreshed successfully');
      return {
        success: true,
        token: tokenData.id_token
      };
      
    } catch (error) {
      console.error('Token refresh error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  getValidToken: async () => {
    try {
      if (!currentUser) {
        throw new Error('No user signed in');
      }
      
      if (!currentUser.firebaseToken) {
        console.log('Current user object:', currentUser);
        throw new Error('No Firebase token found for user');
      }
      
      // Check if token is expired or will expire in next 5 minutes
      const now = Date.now();
      const buffer = 5 * 60 * 1000; // 5 minutes buffer
      
      if (now + buffer >= currentUser.tokenExpiry) {
        console.log('Token expired or expiring soon, refreshing...');
        const refreshResult = await window.firebaseAuth.refreshFirebaseToken();
        
        if (!refreshResult.success) {
          throw new Error('Failed to refresh token: ' + refreshResult.error);
        }
        
        return currentUser.firebaseToken;
      }
      
      // Token is still valid
      return currentUser.firebaseToken;
      
    } catch (error) {
      console.error('Get valid token error:', error);
      throw error;
    }
  },
  
  getCurrentUser: () => currentUser,
  
  // Helper method to set current user (used when restoring from storage)
  setCurrentUser: (user) => {
    currentUser = user;
    console.log('Firebase currentUser updated:', user ? (user.email || user.displayName) : 'null');
  }
};

// Notify popup.js that Firebase is ready
console.log('Firebase REST API ready');
window.firebaseReady = true;
document.dispatchEvent(new Event('firebaseReady'));