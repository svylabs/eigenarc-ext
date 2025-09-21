// Handle predefined prompt buttons
document.querySelectorAll('.prompt-button[data-prompt]').forEach(button => {
  button.addEventListener('click', async () => {
    const prompt = button.getAttribute('data-prompt');
    await injectPrompt(prompt);
  });
});

// Handle custom prompt button
document.getElementById('customButton').addEventListener('click', async () => {
  const customPrompt = document.getElementById('customPrompt').value.trim();
  if (customPrompt) {
    await injectPrompt(customPrompt);
  } else {
    alert('Please enter a custom prompt first.');
  }
});

// Function to inject prompt into ChatGPT
async function injectPrompt(prompt) {
  try {
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Check if we're on ChatGPT
    if (!tab?.url || (!tab.url.includes('chat.openai.com') && !tab.url.includes('chatgpt.com'))) {
      alert('Please navigate to ChatGPT first!');
      return;
    }
    console.log('Injecting prompt into tab:', tab.id, 'URL:', tab.url, prompt);
    
    // Send message to content script
    await chrome.tabs.sendMessage(tab.id, {
      action: 'injectPrompt',
      prompt: prompt
    });
    
    // Close popup after successful injection
    window.close();
    
  } catch (error) {
    console.error('Error injecting prompt:', error);
    alert('Error injecting prompt. Make sure you are on the ChatGPT website.');
  }
}