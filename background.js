// Background service worker for Chrome extension
console.log('Background script loaded');

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// Relay messages between popup and offscreen document
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Just let messages pass through
  return false;
});