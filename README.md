# ChatGPT Prompt Injector Chrome Extension

A simple Chrome extension that allows you to inject predefined or custom prompts into the ChatGPT website with a single click.

## Features

- **Predefined Prompts**: Quick access to common roles like Copywriter, Code Reviewer, Creative Writer, and Business Analyst
- **Custom Prompts**: Enter and inject your own custom prompts
- **One-Click Injection**: Simply click a button to inject prompts into ChatGPT's input field
- **Smart Detection**: Automatically finds and targets ChatGPT's input field across different website versions

## Installation Instructions

### 1. Download/Clone the Extension Files
Make sure you have all these files in a folder:
- `manifest.json`
- `popup.html`
- `popup.js`
- `content.js`

### 2. Load the Extension in Chrome

1. **Open Chrome** and navigate to `chrome://extensions/`

2. **Enable Developer Mode**:
   - Look for the "Developer mode" toggle in the top-right corner
   - Turn it ON

3. **Load the Extension**:
   - Click "Load unpacked" button
   - Select the folder containing all the extension files
   - The extension should now appear in your extensions list

4. **Pin the Extension** (Optional but recommended):
   - Click the extensions icon (puzzle piece) in the Chrome toolbar
   - Find "ChatGPT Prompt Injector" and click the pin icon

## How to Use

### 1. Navigate to ChatGPT
- Go to `https://chat.openai.com` or `https://chatgpt.com`
- Make sure you're logged in

### 2. Open the Extension
- Click on the ChatGPT Prompt Injector icon in your Chrome toolbar
- The popup will open showing predefined prompt buttons and a custom prompt area

### 3. Inject a Prompt
**Option A - Use Predefined Prompts:**
- Click any of the predefined prompt buttons (💼 Copywriter, 👨‍💻 Code Reviewer, etc.)
- The prompt will be automatically injected into ChatGPT's input field

**Option B - Use Custom Prompt:**
- Type your custom prompt in the text area
- Click "🎯 Inject Custom Prompt"
- Your custom prompt will be injected into ChatGPT's input field

### 4. Complete Your Interaction
- After injection, you can add additional context or send the prompt as-is
- Press Enter or click Send in ChatGPT to submit your prompt

## Predefined Prompts Included

1. **💼 Copywriter**: "Act as a professional copywriter. Please rewrite the following text to make it more engaging and persuasive:"

2. **👨‍💻 Code Reviewer**: "Act as a code reviewer. Please review the following code and provide suggestions for improvement:"

3. **✍️ Creative Writer**: "Act as a creative writing assistant. Help me brainstorm ideas for:"

4. **📊 Business Analyst**: "Act as a business analyst. Please analyze the following and provide insights:"

## Troubleshooting

### Extension Not Working?
- Make sure you're on the ChatGPT website (`chat.openai.com` or `chatgpt.com`)
- Refresh the ChatGPT page and try again
- Check that the extension is enabled in `chrome://extensions/`

### Prompt Not Injecting?
- The extension will show a confirmation message when successful
- If you see an error, try refreshing the ChatGPT page
- Make sure ChatGPT's input field is visible and active

### Permission Issues?
- The extension only works on ChatGPT websites for security
- If you see a "navigate to ChatGPT first" message, make sure you're on the correct website

## Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**: Requires access to ChatGPT websites and tab information to verify you're on the correct site
- **No Data Collection**: This extension does not collect or store any user data
- **Offline Capable**: Works entirely within your browser, no external connections

## Support

If you encounter any issues:
1. Try refreshing the ChatGPT page
2. Disable and re-enable the extension
3. Check Chrome's console for any error messages

## Privacy & Security

- This extension only accesses ChatGPT websites
- No data is sent to external servers
- All prompts and interactions remain local to your browser
- The extension cannot access other websites or your personal data