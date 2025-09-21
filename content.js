console.log('[ext] content loaded', { extId: chrome.runtime.id });

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[ext] content got message:', request);
  if (request.action === 'injectPrompt') {
    injectPromptIntoTextarea(request.prompt);
    sendResponse({ success: true });
  }
});

console.log('content.js loaded');

function injectPromptIntoTextarea(prompt) {
  // ChatGPT uses different selectors for the input area
  // Try multiple selectors to find the input field
  const selectors = [
    '[data-id="root"] textarea',
    '#prompt-textarea',
    'textarea[placeholder*="Message"]',
    'textarea[data-id]',
    '.ProseMirror',
    '[contenteditable="true"]',
    '[role="textbox"][contenteditable="true"]',
    'div[contenteditable="true"][data-testid*="composer"]'
  ];
  
  let inputElement = null;
  
  // Try to find the input element
  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector);
    for (const element of elements) {
      // Check if the element is visible and likely the main input
      if (element.offsetParent !== null && element.offsetHeight > 20) {
        inputElement = element;
        console.log('Found input element with selector:', selector, element);
        break;
      }
    }
    if (inputElement) break;
  }
  
  if (inputElement) {
    // Handle different types of input elements
    if (inputElement.tagName === 'TEXTAREA' || inputElement.tagName === 'INPUT') {
      // For regular textarea/input elements
      inputElement.value = prompt;
      inputElement.focus();
      
      // Trigger input events to notify React/Vue of the change
      inputElement.dispatchEvent(new Event('input', { bubbles: true }));
      inputElement.dispatchEvent(new Event('change', { bubbles: true }));
      console.log('Dispatched input and change events');
      document.querySelector('[id="composer-submit-button"]')?.click();
    } else if (inputElement.contentEditable === 'true') {
      // For contenteditable elements (like ProseMirror)
      inputElement.focus();
      
      // Try modern approach first
      try {
        // Select all existing content and replace with new prompt
        document.execCommand('selectAll', false, null);
        document.execCommand('insertText', false, prompt);
        console.log('Used execCommand to insert text');
        
        // Trigger input event for React/Vue
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));
        document.querySelector('[id="composer-submit-button"]')?.click();
      } catch (error) {
        console.error('Error using execCommand:', error);
        console.log('Falling back to textContent method.');
        // Fallback to textContent method
        inputElement.textContent = prompt;
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));
        inputElement.dispatchEvent(new Event('change', { bubbles: true }));
        document.querySelector('[id="composer-submit-button"]')?.click();
      }
    }
    
    // Show a brief confirmation
    showConfirmation('Prompt injected successfully!');
  } else {
    showConfirmation('Could not find ChatGPT input field. Please try again.', true);
  }
}

function showConfirmation(message, isError = false) {
  // Create a temporary notification
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${isError ? '#ef4444' : '#10a37f'};
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    z-index: 10000;
    font-family: Arial, sans-serif;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
}