
// Global state management
let currentUser = null;
let currentPlan = null;
let chatHistory = [];
let currentScreen = 'welcomeScreen';
let currentViewState = {
  view: 'pathwaysList', // 'pathwaysList' or 'courseDetail'
  courseId: null,
  scrollPositions: {
    pathwaysList: 0,
    courseDetail: 0
  }
};
let currentTab = 'currentPlan';

// Chat and conversation state
let currentConversationId = null;
let currentCreatePlanConversationId = null;
let generatedPlanId = null;
let conversationHistory = {}; // Store conversation messages by conversationId

// Sample learning plans data - using real course structure
const samplePlans = {
  screenrecorder: {
    id: "example-screen-recorder",
    title: "Build a Browser-Based Screen Recorder in 2 Weeks",
    description: "This 2-week plan will guide you through building a fully functional browser-based screen recorder. Leveraging your existing React skills, you will master the necessary browser Media APIs to capture screen, camera, and microphone audio, culminating in a complete application perfect for creating tutorials.",
    duration: "2 weeks",
    dailyTime: "1 hour per day",
    skillLevel: "intermediate",
    phases: [
      {
        title: "Phase 1: Core Browser APIs & Project Setup",
        duration: "Week 1",
        description: "This week focuses on understanding the essential browser APIs for capturing media. You'll work with vanilla JavaScript first to learn these concepts before integrating them into a React project.",
        tasks: [
          "Day 1-2: Master Screen Capture: Study and implement `getDisplayMedia()` to capture the user's screen. Create a simple HTML page to test this.",
          "Day 3-4: Integrate Camera & Audio: Learn `getUserMedia()` to access the webcam and microphone, then explore how to combine these media streams.",
          "Day 5-6: Record & Save Data: Get hands-on with the `MediaRecorder` API to record the combined stream and handle the resulting data chunks.",
          "Day 7: Set Up Your React Environment: Initialize a new React project and create the basic component structure for your recorder UI."
        ]
      },
      {
        title: "Phase 2: React Integration & Feature Implementation",
        duration: "Week 2",
        description: "Now you'll apply your API knowledge to build the screen recorder application using React. You will create the user interface and wire up all the recording functionality.",
        tasks: [
          "Day 8-9: Build the UI: Create React components for the control buttons (Start, Stop), video preview area, and download link.",
          "Day 10-11: Implement Recording Logic: Use React hooks (`useState`, `useEffect`, `useRef`) to manage media streams, recording state, and the `MediaRecorder` instance.",
          "Day 12-13: Handle the Video Output: Implement the logic to stop the recording, create a downloadable video file from the recorded data, and present it to the user.",
          "Day 14: Final Polish & Review: Refine the user interface, add user-facing messages (e.g., 'Recording...'), and clean up your code for clarity."
        ]
      }
    ],
    enrolledAt: "2025-09-20T10:00:00.000Z",
    isCompleted: false,
    currentPhase: 0,
    progress: []
  },
  cryptography: {
    id: "example-cryptography",
    title: "Practical Cryptography: From Theory to Code",
    description: "This 5-month plan is designed for individuals with basic math and programming knowledge to progressively learn cryptographic concepts and apply them by implementing core algorithms. You will journey from classical ciphers to modern symmetric and asymmetric systems, culminating in a solid practical understanding of cryptographic primitives.",
    duration: "20 weeks",
    dailyTime: "1 hour per day",
    skillLevel: "beginner",
    phases: [
      {
        title: "Phase 1: Foundations and Classical Ciphers",
        duration: "Weeks 1-4",
        description: "Establish a strong foundation in the essential mathematics and historical context of cryptography. You will implement your first simple ciphers to understand the basic principles of encryption and cryptanalysis.",
        tasks: [
          "Study foundational concepts: confidentiality, integrity, and availability.",
          "Review essential math: modular arithmetic, prime numbers, and basic probability.",
          "Implement the Caesar Cipher and a frequency analysis tool to break it.",
          "Implement the Vigenère Cipher, a classic polyalphabetic cipher."
        ]
      },
      {
        title: "Phase 2: Symmetric Cryptography",
        duration: "Weeks 5-10",
        description: "Dive into modern secret-key cryptography, focusing on block ciphers and stream ciphers. You will understand the building blocks of systems like AES and implement a block cipher with a standard mode of operation.",
        tasks: [
          "Learn about stream ciphers and implement a simple one like RC4.",
          "Study the structure of block ciphers, including SPNs and Feistel Networks.",
          "Understand the Advanced Encryption Standard (AES) conceptually.",
          "Implement a block cipher mode of operation, such as Cipher Block Chaining (CBC), using a provided block cipher primitive."
        ]
      },
      {
        title: "Phase 3: Asymmetric Cryptography",
        duration: "Weeks 11-16",
        description: "Explore the world of public-key cryptography. This phase covers the mathematics behind key exchange and digital signatures, enabling you to implement two of the most influential algorithms in the field.",
        tasks: [
          "Learn the principles of public-key cryptography and one-way functions.",
          "Study the number theory behind RSA: Euler's totient theorem and prime factorization.",
          "Implement the RSA algorithm for encryption and decryption.",
          "Understand and implement the Diffie-Hellman Key Exchange protocol."
        ]
      }
    ],
    enrolledAt: "2025-09-19T03:53:24.521Z",
    isCompleted: false,
    currentPhase: 0,
    progress: []
  },
  quantummechanics: {
    id: "example-quantum-mechanics",
    title: "Mastering Quantum Mechanics Notation",
    description: "An 8-week action plan designed to take you from a high school math and physics background to confidently understanding the mathematical notations used in quantum mechanics scientific papers.",
    duration: "8 weeks",
    dailyTime: "1 hour",
    skillLevel: "beginner",
    phases: [
      {
        title: "Phase 1: Building the Mathematical Foundation",
        duration: "Weeks 1-2",
        description: "This phase focuses on the essential mathematics that underpins quantum mechanics, bridging the gap from high school math to the required concepts in linear algebra and complex numbers.",
        tasks: [
          "Review complex numbers: conjugates, modulus, and Euler's formula.",
          "Learn the fundamentals of linear algebra: vector spaces, basis vectors, and linear independence.",
          "Understand matrix operations: addition, multiplication, transpose, and the Hermitian conjugate.",
          "Study the concepts of eigenvalues and eigenvectors, which are crucial for describing quantum states."
        ]
      },
      {
        title: "Phase 2: Introduction to Bra-Ket Notation",
        duration: "Weeks 3-4",
        description: "Dive into the core language of quantum mechanics: Dirac's bra-ket notation. You will learn how to represent quantum states, measurements, and operators in this powerful formalism.",
        tasks: [
          "Learn to represent quantum states as 'kets' |ψ⟩ and their duals as 'bras' ⟨ψ|.",
          "Understand how the inner product ⟨φ|ψ⟩ represents the probability amplitude of transitioning from state ψ to state φ.",
          "Explore how 'operators' act on kets to represent physical observables.",
          "Practice translating simple quantum concepts into bra-ket notation."
        ]
      }
    ],
    enrolledAt: "2025-09-12T22:36:41.679Z",
    isCompleted: false,
    currentPhase: 0,
    progress: [
      {
        id: "progress-1",
        courseId: "example-quantum-mechanics",
        phaseIndex: 0,
        taskIndex: 0,
        isCompleted: true,
        completedAt: "2025-09-12T23:15:01.802Z"
      },
      {
        id: "progress-2",
        courseId: "example-quantum-mechanics",
        phaseIndex: 0,
        taskIndex: 1,
        isCompleted: true,
        completedAt: "2025-09-12T23:15:04.208Z"
      }
    ]
  },
  chromeextension: {
    id: "example-chrome-extension",
    title: "Chrome Extension with Google Auth & Storage",
    description: "This 2-week plan will guide you through building a functional Chrome extension from the ground up. You will learn to create the extension's structure, manage local data storage, and integrate secure Google Authentication for user sign-in.",
    duration: "2 weeks",
    dailyTime: "1 hour per day",
    skillLevel: "intermediate",
    phases: [
      {
        title: "Week 1: Core Extension & Local Data Storage",
        duration: "Week 1",
        description: "Build the fundamental structure of a Chrome extension, create a user interface, and learn how to store and retrieve data using Chrome's storage API.",
        tasks: [
          "Day 1: Set up your project with the essential `manifest.json` (v3), `popup.html`, and `popup.js` files.",
          "Day 2: Build the basic UI for your popup using HTML and CSS, including input fields and buttons.",
          "Day 3: Implement logic to save user input to `chrome.storage.local`.",
          "Day 4: Write code to retrieve and display the saved data when the popup is opened.",
          "Day 5: Understand and add a background script (`service_worker`) for tasks like handling extension installation events.",
          "Day 6 & 7: Solidify your knowledge by building a simple 'Quick Note' extension that saves and lists multiple notes."
        ]
      },
      {
        title: "Week 2: Google Authentication & Integration",
        duration: "Week 2", 
        description: "Integrate Google Sign-In using OAuth2, manage user sessions, and combine all features into a finished, personalized project.",
        tasks: [
          "Day 8: Set up a project in the Google Cloud Console and get your OAuth 2.0 Client ID.",
          "Day 9: Add the necessary permissions to your manifest and implement a 'Login' button that uses `chrome.identity.getAuthToken` to initiate the sign-in flow.",
          "Day 10: Use the retrieved auth token to fetch user profile information from the Google API.",
          "Day 11: Manage user state by saving profile info to storage and dynamically updating the UI to show a logged-in view.",
          "Day 12: Implement a 'Logout' button that revokes the token using `chrome.identity.removeCachedAuthToken` and clears user data.",
          "Day 13 & 14: Combine the notes functionality from Week 1 with the Google Auth. Tie saved data to the specific logged-in user and perform final testing and UI polishing."
        ]
      }
    ],
    enrolledAt: "2025-09-20T10:47:54.416Z",
    isCompleted: false,
    currentPhase: 0,
    progress: []
  }
};

// Lesson completion tracking functions
function getCompletedLessons() {
  const completed = localStorage.getItem('completedLessons');
  return completed ? JSON.parse(completed) : {};
}

function saveCompletedLessons(completedLessons) {
  localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
}

function isLessonCompleted(lessonId) {
  const completed = getCompletedLessons();
  return completed[lessonId] === true;
}

function toggleLessonCompletion(lessonId) {
  const completed = getCompletedLessons();
  completed[lessonId] = !completed[lessonId];
  saveCompletedLessons(completed);
  return completed[lessonId];
}

async function sendChatMessage() {
  console.log('Send Chat Message called');
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  
  if (!message) return;
  
  // Disable input during API call
  input.disabled = true;
  const sendBtn = document.getElementById('sendChatBtn');
  if (sendBtn) {
    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending...';
  }
  
  // Add user message to chat
  addMessageToChat('user', message, 'chatMessages');
  input.value = '';
  
  // Add typing indicator
  addMessageToChat('ai', '💭 AI is thinking...', 'chatMessages', 'typing-indicator');
  
  try {
    // Create conversation if not exists
    if (!currentConversationId) {
      await createConversation("Learning Discussion");
    }
    
    // Send message and get AI response
    const result = await sendMessage(message);
    
    // Remove typing indicator before adding AI response
    removeTypingIndicator('chatMessages');
    
    // Add AI response to chat
    if (result.aiMessage && result.aiMessage.content) {
      const aiContent = typeof result.aiMessage.content === 'string' 
        ? result.aiMessage.content 
        : result.aiMessage.content.conversationReply || 'I received your message.';
      
      addMessageToChat('ai', aiContent, 'chatMessages');
      
      // Debug logging removed for production
      
      // Check if AI can automatically generate a plan
      if (result.can_generate_plan && result.plan_parameters) {
        // Auto-generating plan with API-provided parameters
        setTimeout(async () => {
          await handleAutomaticPlanGeneration(result.plan_parameters, 'chatMessages');
        }, 1000);
      }
      // Only auto-generate when API explicitly indicates readiness with proper parameters
      else if (typeof result.aiMessage.content === 'object' && result.aiMessage.content.type === 'plan_suggestion' && result.plan_parameters) {
        // API suggests plan generation - triggering automatic generation
        setTimeout(async () => {
          await handleAutomaticPlanGeneration(result.plan_parameters, 'chatMessages');
        }, 1500);
      }
    }
    
  } catch (error) {
    console.error('Error in main chat:', error);
    // Remove typing indicator
    removeTypingIndicator('chatMessages');
    addMessageToChat('ai', 'Sorry, I encountered an error. Please try again.', 'chatMessages');
  } finally {
    // Re-enable input
    input.disabled = false;
    if (sendBtn) {
      sendBtn.disabled = false;
      sendBtn.textContent = 'Send';
    }
  }
}

async function handleFormPlanCreation(formData) {
  const generateBtn = document.getElementById('generatePlanBtn');
  const originalBtnText = generateBtn.textContent;
  
  try {
    // Disable form and show loading
    generateBtn.disabled = true;
    generateBtn.textContent = '⚡ Creating...';
    
    // Add initial message to chat
    addMessageToChat('ai', '🎯 Perfect! I\'m setting up your personalized learning conversation. Let me analyze your goals and preferences...', 'createPlanMessages');
    
    // Create conversation with form data
    const title = `Learning Plan: ${formData.subject}`;
    currentCreatePlanConversationId = null; // Reset conversation ID for create plan tab
    
    console.log('Creating conversation with form data:', formData);
    
    // Create the conversation with form data (mark as Create Plan conversation)
    const conversation = await createConversation(title, formData, true);
    currentCreatePlanConversationId = conversation.id;
    
    // Save the Create Plan conversation ID to storage
    await chrome.storage.local.set({ currentCreatePlanConversationId: currentCreatePlanConversationId });
    
    console.log('Create Plan conversation ID set to:', currentCreatePlanConversationId);
    
    // Add summary of submitted form data
    const formSummary = `✅ Perfect! I've received your learning preferences:

**Subject:** ${formData.subject}
**Skill Level:** ${formData.skillLevel.charAt(0).toUpperCase() + formData.skillLevel.slice(1)}
**Duration:** ${formData.duration}
**Daily Time:** ${formData.timeCommitment}
**Goals:** ${formData.goals}

I'm now setting up your personalized learning conversation. Feel free to chat with me below to further customize your plan, ask questions, or share additional preferences!`;
    
    addMessageToChat('ai', formSummary, 'createPlanMessages');
    
    // Add chat input for continued conversation
    enableCreatePlanChat();
    
    // Scroll to show the new content
    const chatContainer = document.getElementById('createPlanMessages');
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    console.log('Conversation created successfully:', conversation.id);
    
    // Save form data for future use
    await saveFormData(formData);
    
  } catch (error) {
    console.error('Error creating conversation from form:', error);
    addMessageToChat('ai', '❌ Sorry, I encountered an error while setting up your learning conversation. Please check your inputs and try again.', 'createPlanMessages');
  } finally {
    // Re-enable form
    generateBtn.disabled = false;
    generateBtn.textContent = originalBtnText;
  }
}

// Enable chat functionality in Create Plan tab
function enableCreatePlanChat() {
  const chatContainer = document.getElementById('createPlanMessages');
  
  // Check if chat input already exists
  if (chatContainer.parentElement.querySelector('.chat-input-container')) {
    return; // Already enabled
  }
  
  // Create chat input HTML
  const chatInputHtml = `
    <div class="chat-input-container" style="padding: 15px; border-top: 1px solid #e1e5e9; background: #f8f9fa;">
      <div style="display: flex; gap: 10px; align-items: flex-end;">
        <textarea 
          id="createPlanChatInput" 
          placeholder="Continue the conversation to personalize your plan..."
          style="flex: 1; min-height: 40px; max-height: 120px; padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; resize: none; font-family: inherit; outline: none;"
        ></textarea>
        <button 
          id="createPlanSendBtn"
          style="background: linear-gradient(135deg, hsl(142, 35%, 42%) 0%, hsl(142, 40%, 52%) 100%); color: white; border: none; padding: 10px 15px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; white-space: nowrap;"
        >
          Send
        </button>
      </div>
    </div>
  `;
  
  // Add chat input to the container
  chatContainer.parentElement.insertAdjacentHTML('beforeend', chatInputHtml);
  
  // Add event listeners
  const chatInput = document.getElementById('createPlanChatInput');
  const sendBtn = document.getElementById('createPlanSendBtn');
  
  // Send message on button click
  sendBtn.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message) {
      sendCreatePlanMessage(message);
      chatInput.value = '';
    }
  });
  
  // Send message on Enter (but allow Shift+Enter for new lines)
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const message = chatInput.value.trim();
      if (message) {
        sendCreatePlanMessage(message);
        chatInput.value = '';
      }
    }
  });
  
  // Auto-resize textarea
  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
  });
  
  // Focus the input
  setTimeout(() => chatInput.focus(), 100);
}

// Send message in Create Plan context
async function sendCreatePlanMessage(message) {
  if (!currentCreatePlanConversationId) {
    addMessageToChat('ai', '❌ No active conversation. Please create a new plan first.', 'createPlanMessages');
    return;
  }
  
  // Get references to input elements for loading state
  const chatInput = document.getElementById('createPlanChatInput');
  const sendBtn = document.getElementById('createPlanSendBtn');
  
  // Disable input during API call
  if (chatInput) chatInput.disabled = true;
  if (sendBtn) {
    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending...';
  }
  
  try {
    // Add user message to chat
    addMessageToChat('user', message, 'createPlanMessages');
    
    // Add typing indicator
    addMessageToChat('ai', '💭 AI is thinking...', 'createPlanMessages', 'typing-indicator');
    
    // Send message to API using the Create Plan conversation
    const result = await sendMessage(message, currentCreatePlanConversationId);
    
    // Add AI response to chat
    if (result.aiMessage && result.aiMessage.content) {
      const aiContent = typeof result.aiMessage.content === 'string' 
        ? result.aiMessage.content 
        : result.aiMessage.content.conversationReply || 'I received your message.';
      
      addMessageToChat('ai', aiContent, 'createPlanMessages');
      
      // Check if AI can automatically generate a plan
      if (result.can_generate_plan && result.plan_parameters) {
        // Auto-generating plan with API-provided parameters
        setTimeout(async () => {
          await handleAutomaticPlanGeneration(result.plan_parameters, 'createPlanMessages');
        }, 1000);
      }
      // Only auto-generate when API explicitly indicates readiness with proper parameters
      else if (typeof result.aiMessage.content === 'object' && result.aiMessage.content.type === 'plan_suggestion' && result.plan_parameters) {
        // API suggests plan generation - triggering automatic generation
        setTimeout(async () => {
          await handleAutomaticPlanGeneration(result.plan_parameters, 'createPlanMessages');
        }, 1500);
      }
    }
    
    // Remove typing indicator
    removeTypingIndicator('createPlanMessages');
    
    // Scroll to show new message
    const chatContainer = document.getElementById('createPlanMessages');
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
  } catch (error) {
    console.error('Error sending create plan message:', error);
    // Remove typing indicator
    removeTypingIndicator('createPlanMessages');
    addMessageToChat('ai', '❌ Sorry, I encountered an error. Please try again.', 'createPlanMessages');
  } finally {
    // Re-enable input elements
    if (chatInput) chatInput.disabled = false;
    if (sendBtn) {
      sendBtn.disabled = false;
      sendBtn.textContent = 'Send';
    }
  }
}


// Attach Create Plan form event listeners
function attachCreatePlanFormListeners() {
  const form = document.getElementById('createPlanForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = {
        subject: document.getElementById('planSubject').value,
        skillLevel: document.getElementById('planSkillLevel').value,
        duration: document.getElementById('planDuration').value,
        timeCommitment: document.getElementById('planTimeCommitment').value,
        goals: document.getElementById('planGoals').value
      };
      
      await handleFormPlanCreation(formData);
    });
  }
  
  const clearBtn = document.getElementById('clearFormBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', async () => {
      // Clear form fields
      document.getElementById('planSubject').value = '';
      document.getElementById('planSkillLevel').value = '';
      document.getElementById('planDuration').value = '';
      document.getElementById('planTimeCommitment').value = '';
      document.getElementById('planGoals').value = '';
      
      // Clear saved form data
      await clearSavedFormData();
    });
  }
}

// Form data persistence functions
async function saveFormData(formData) {
  try {
    await chrome.storage.local.set({ savedCreatePlanFormData: formData });
    console.log('Form data saved successfully');
  } catch (error) {
    console.error('Error saving form data:', error);
  }
}

async function loadFormData() {
  try {
    const result = await chrome.storage.local.get(['savedCreatePlanFormData']);
    return result.savedCreatePlanFormData || null;
  } catch (error) {
    console.error('Error loading form data:', error);
    return null;
  }
}

async function restoreFormData() {
  const savedData = await loadFormData();
  if (!savedData) return;
  
  // Restore form field values
  const subjectField = document.getElementById('planSubject');
  const skillLevelField = document.getElementById('planSkillLevel');
  const durationField = document.getElementById('planDuration');
  const timeCommitmentField = document.getElementById('planTimeCommitment');
  const goalsField = document.getElementById('planGoals');
  
  if (subjectField && savedData.subject) {
    subjectField.value = savedData.subject;
  }
  if (skillLevelField && savedData.skillLevel) {
    skillLevelField.value = savedData.skillLevel;
  }
  if (durationField && savedData.duration) {
    durationField.value = savedData.duration;
  }
  if (timeCommitmentField && savedData.timeCommitment) {
    timeCommitmentField.value = savedData.timeCommitment;
  }
  if (goalsField && savedData.goals) {
    goalsField.value = savedData.goals;
  }
  
  console.log('Form data restored successfully');
}

async function clearSavedFormData() {
  try {
    await chrome.storage.local.remove(['savedCreatePlanFormData']);
    console.log('Saved form data cleared');
  } catch (error) {
    console.error('Error clearing saved form data:', error);
  }
}

// Helper function to remove typing indicators
function removeTypingIndicator(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    const typingIndicator = container.querySelector('.typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }
}

function addMessageToChat(sender, message, containerId, extraClass = '') {
  const container = document.getElementById(containerId);
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}${extraClass ? ' ' + extraClass : ''}`;
  
  // Use textContent to prevent XSS attacks
  if (typeof message === 'string' && message.includes('<')) {
    // If message contains HTML tags, create elements safely
    messageDiv.textContent = message;
  } else {
    messageDiv.textContent = message;
  }
  
  container.appendChild(messageDiv);
  container.scrollTop = container.scrollHeight;
  
  // Save message to conversation history
  if ((currentConversationId || currentCreatePlanConversationId) && sender !== 'system') {
    // Determine which conversation to save to based on container
    const conversationId = containerId === 'createPlanMessages' ? currentCreatePlanConversationId : currentConversationId;
    saveMessageToHistory(sender, message, 'text', null, conversationId);
  }
}

// Save conversation messages to storage
async function saveMessageToHistory(sender, message, messageType = 'text', data = null, conversationId = null) {
  // Use provided conversationId or fall back to current main conversation
  const activeConversationId = conversationId || currentConversationId;
  
  if (!activeConversationId) return;
  
  try {
    // Initialize conversation history if not exists
    if (!conversationHistory[activeConversationId]) {
      conversationHistory[activeConversationId] = [];
    }
    
    // Add message with timestamp
    conversationHistory[activeConversationId].push({
      sender,
      message,
      messageType,
      data,
      timestamp: new Date().toISOString()
    });
    
    // Save to storage
    await chrome.storage.local.set({ 
      conversationHistory: conversationHistory,
      lastConversationId: activeConversationId,
      currentCreatePlanConversationId: currentCreatePlanConversationId
    });
    
    console.log('💾 Message saved to conversation history:', activeConversationId, messageType);
  } catch (error) {
    console.error('Error saving message to history:', error);
  }
}

// Save generated plan to conversation history
async function savePlanToHistory(plan, containerId, conversationId = null) {
  const message = '🎉 Generated Learning Plan';
  
  // Determine which conversation to save to
  const activeConversationId = conversationId || (containerId === 'createPlanMessages' ? currentCreatePlanConversationId : currentConversationId);
  
  await saveMessageToHistory('ai', message, 'generated_plan', { 
    planId: plan.id,
    planTitle: plan.title,
    planDescription: plan.description,
    containerId 
  }, activeConversationId);
  
  // Also update conversation metadata
  await saveConversationPlanState(plan.id, activeConversationId);
}

// Save conversation plan state
async function saveConversationPlanState(planId, conversationId = null) {
  // Use provided conversationId or fall back to current ones
  const activeConversationId = conversationId || currentCreatePlanConversationId || currentConversationId;
  
  if (!activeConversationId) return;
  
  try {
    const conversationMeta = await chrome.storage.local.get('conversationMeta') || {};
    if (!conversationMeta.conversationMeta) {
      conversationMeta.conversationMeta = {};
    }
    
    conversationMeta.conversationMeta[activeConversationId] = {
      hasGeneratedPlan: true,
      planId: planId,
      generatedAt: new Date().toISOString()
    };
    
    await chrome.storage.local.set(conversationMeta);
    console.log('💾 Saved plan state for conversation:', activeConversationId, 'Plan ID:', planId);
  } catch (error) {
    console.error('Error saving conversation plan state:', error);
  }
}

// Load conversation history from storage
async function loadConversationHistory() {
  try {
    const result = await chrome.storage.local.get(['conversationHistory', 'lastConversationId', 'currentCreatePlanConversationId']);
    
    if (result.conversationHistory) {
      conversationHistory = result.conversationHistory;
      console.log('📜 Loaded conversation history:', Object.keys(conversationHistory).length, 'conversations');
    }
    
    // Restore last conversation if no current conversation
    if (!currentConversationId && result.lastConversationId) {
      currentConversationId = result.lastConversationId;
      console.log('🔄 Restored last conversation ID:', currentConversationId);
    }
    
    // Restore Create Plan conversation ID
    if (result.currentCreatePlanConversationId) {
      currentCreatePlanConversationId = result.currentCreatePlanConversationId;
      console.log('🔄 Restored Create Plan conversation ID:', currentCreatePlanConversationId);
    }
    
    return conversationHistory;
  } catch (error) {
    console.error('Error loading conversation history:', error);
    return {};
  }
}

// Display conversation messages in chat container
async function displayConversationHistory(containerId) {
  // Determine which conversation ID to use based on container
  const conversationId = containerId === 'createPlanMessages' ? currentCreatePlanConversationId : currentConversationId;
  
  if (!conversationId || !conversationHistory[conversationId]) {
    console.log('📭 No conversation history to display for:', currentConversationId);
    return;
  }
  
  const container = document.getElementById(containerId);
  const messages = conversationHistory[conversationId];
  
  console.log('📖 Displaying', messages.length, 'messages for conversation:', conversationId);
  
  // Handle Create Plan tab differently - preserve form
  if (containerId === 'createPlanMessages') {
    // For Create Plan tab, preserve welcome message and form
    const welcomeMessage = container.querySelector('.message.ai:first-child');
    const formMessage = container.querySelector('#createPlanFormMessage');
    const welcomeHtml = welcomeMessage?.outerHTML || '';
    const formHtml = formMessage?.outerHTML || '';
    
    // Clear container and restore welcome + form
    container.innerHTML = '';
    if (welcomeHtml) container.innerHTML += welcomeHtml;
    if (formHtml) container.innerHTML += formHtml;
    
    // Re-attach form listeners if form was restored
    if (formHtml) {
      attachCreatePlanFormListeners();
      // Restore form data after recreation
      setTimeout(async () => {
        await restoreFormData();
      }, 50);
    }
  } else {
    // For main chat, only preserve welcome message
    const welcomeMessage = container.querySelector('.message.ai');
    const welcomeMessageHtml = welcomeMessage?.outerHTML;
    container.innerHTML = '';
    
    // Restore welcome message if it existed
    if (welcomeMessageHtml) {
      container.innerHTML = welcomeMessageHtml;
    }
  }
  
  // Add conversation history
  for (const msg of messages) {
    if (msg.messageType === 'generated_plan' && msg.data) {
      // Display generated plan UI
      await displayGeneratedPlanFromHistory(msg.data, container);
    } else {
      // Display regular message
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${msg.sender}`;
      messageDiv.textContent = msg.message;
      container.appendChild(messageDiv);
    }
  }
  
  // Scroll to bottom
  container.scrollTop = container.scrollHeight;
}

// Display generated plan from history
async function displayGeneratedPlanFromHistory(planData, container) {
  try {
    // Fetch the full plan details using the planId
    const token = await window.firebaseAuth.getValidToken();
    const response = await fetch(`${API_BASE_URL}/api/plans/${planData.planId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const plan = await response.json();
      
      // Display the plan using the appropriate display function
      if (planData.containerId === 'chatMessages') {
        // Create the plan preview element and append to container
        addMessageToChat('ai', '🎉 Perfect! I\'ve created your personalized learning plan based on our conversation:', planData.containerId);
        const planPreview = createPlanPreviewElement(plan, true);
        container.appendChild(planPreview);
      } else {
        // For createPlanMessages
        addMessageToChat('ai', '🎉 Great! I\'ve created your personalized learning plan. Here\'s what I\'ve prepared for you:', planData.containerId);
        const planPreview = createPlanPreviewElement(plan, false);
        container.appendChild(planPreview);
      }
    } else {
      // Plan no longer exists, show error message
      const errorDiv = document.createElement('div');
      errorDiv.className = 'message ai';
      errorDiv.textContent = '⚠️ Previously generated plan is no longer available.';
      container.appendChild(errorDiv);
    }
  } catch (error) {
    console.error('Error loading plan from history:', error);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'message ai';
    errorDiv.textContent = '⚠️ Error loading previously generated plan.';
    container.appendChild(errorDiv);
  }
}

// Start a new conversation
async function startNewConversation(containerId) {
  try {
    console.log('🆕 Starting new conversation');
    
    // Clear current conversation state
    currentConversationId = null;
    generatedPlanId = null;
    
    // Clear chat messages but preserve welcome message
    const container = document.getElementById(containerId);
    const welcomeMessage = container.querySelector('.message.ai');
    const welcomeMessageHtml = welcomeMessage?.outerHTML;
    container.innerHTML = '';
    
    // Restore welcome message if it existed
    if (welcomeMessageHtml) {
      container.innerHTML = welcomeMessageHtml;
    }
    
    // Clear conversation from storage
    await chrome.storage.local.set({ 
      lastConversationId: null
    });
    
    console.log('✅ New conversation ready');
    
    // Show confirmation message
    setTimeout(() => {
      addMessageToChat('ai', '💫 Started a new conversation! What would you like to learn today?', containerId);
    }, 500);
    
  } catch (error) {
    console.error('Error starting new conversation:', error);
  }
}

// Generate slug from plan title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim('-'); // Remove leading/trailing hyphens
}

// Create plan preview element (extracted from existing functions)
function createPlanPreviewElement(plan, isMainChat = false) {
  const planPreview = document.createElement('div');
  const className = isMainChat ? 'generated-plan-preview-main' : 'generated-plan-preview';
  const enrollBtnId = isMainChat ? 'mainEnrollInPlanBtn' : 'enrollInPlanBtn';
  const detailsBtnId = isMainChat ? 'mainViewPlanDetailsBtn' : 'viewPlanDetailsBtn';
  
  planPreview.className = className;
  planPreview.style.cssText = `
    background: white;
    border: 1px solid #e1e5e9;
    border-radius: 8px;
    padding: 20px;
    margin: 16px 0;
  `;
  
  planPreview.innerHTML = `
    <h4 style="margin: 0 0 12px 0; color: hsl(142, 35%, 42%);">${plan.title}</h4>
    <p style="margin: 0 0 16px 0; color: #666; font-size: 14px; line-height: 1.5;">${plan.description}</p>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; margin-bottom: 16px;">
      <div style="text-align: center; padding: 8px; background: #f8f9fa; border-radius: 6px;">
        <div style="font-size: 12px; color: #666; margin-bottom: 2px;">Duration</div>
        <div style="font-weight: 600; color: #333;">${plan.duration || plan.timeline || 'Not specified'}</div>
      </div>
      <div style="text-align: center; padding: 8px; background: #f8f9fa; border-radius: 6px;">
        <div style="font-size: 12px; color: #666; margin-bottom: 2px;">Level</div>
        <div style="font-weight: 600; color: #333;">${plan.skillLevel}</div>
      </div>
      <div style="text-align: center; padding: 8px; background: #f8f9fa; border-radius: 6px;">
        <div style="font-size: 12px; color: #666; margin-bottom: 2px;">Phases</div>
        <div style="font-weight: 600; color: #333;">${plan.phases.length}</div>
      </div>
    </div>
    
    <div style="margin-bottom: 16px;">
      <a href="https://eigenarc.com/plan/${generateSlug(plan.title)}-${plan.id}" target="_blank" style="color: hsl(142, 35%, 42%); text-decoration: none; font-size: 14px; font-weight: 600;">
        🔗 View Full Plan on Eigenarc.com
      </a>
    </div>
    
    <div style="display: flex; gap: 12px;">
      <button id="${enrollBtnId}" style="background: hsl(142, 35%, 42%); color: white; border: none; padding: 12px 20px; border-radius: 6px; font-weight: 600; cursor: pointer; flex: 1;">
        🚀 Start Learning with this Plan
      </button>
      <button id="${detailsBtnId}" style="background: transparent; color: hsl(142, 35%, 42%); border: 1px solid hsl(142, 35%, 42%); padding: 12px 20px; border-radius: 6px; font-weight: 600; cursor: pointer;">
        View Details
      </button>
    </div>
  `;
  
  // Add event listeners with unique IDs
  setTimeout(() => {
    const enrollBtn = document.getElementById(enrollBtnId);
    const detailsBtn = document.getElementById(detailsBtnId);
    
    if (enrollBtn) {
      enrollBtn.addEventListener('click', () => {
        if (isMainChat) {
          handleMainChatPlanEnrollment(plan.id);
        } else {
          handlePlanEnrollment(plan.id);
        }
      });
    }
    
    if (detailsBtn) {
      detailsBtn.addEventListener('click', () => {
        if (isMainChat) {
          showMainChatPlanDetails(plan);
        } else {
          showPlanDetails(plan);
        }
      });
    }
  }, 100);
  
  return planPreview;
}

// Automatic Plan Generation Handler
async function handleAutomaticPlanGeneration(planParameters, containerId) {
  try {
    // Starting automatic plan generation with API-provided parameters
    
    // Show loading message
    addMessageToChat('ai', '⚡ Generating your personalized learning plan...', containerId);
    
    // Prepare parameters with defaults
    const params = {
      subject: planParameters.subject || 'General learning goal',
      skillLevel: planParameters.skillLevel || 'beginner', 
      timeline: planParameters.timeline || '4 weeks',
      dailyTime: planParameters.dailyTime || '1 hour',
      goals: planParameters.goals || 'Build understanding and practical skills'
    };
    
    // Plan parameters prepared for API call
    
    // Generate the plan
    const plan = await generatePlan(params);
    
    // Show success message
    addMessageToChat('ai', '🎉 Perfect! I\'ve created your personalized learning plan based on our conversation:', containerId);
    
    // Show the generated plan using the appropriate display function
    if (containerId === 'chatMessages') {
      showGeneratedPlanInMainChat(plan);
    } else {
      showGeneratedPlan(plan);
    }
    
    // Save plan to conversation history
    const conversationId = containerId === 'createPlanMessages' ? currentCreatePlanConversationId : currentConversationId;
    await savePlanToHistory(plan, containerId, conversationId);
    
  } catch (error) {
    console.error('❌ Error in automatic plan generation:', error);
    const errorMessage = 'Sorry, I encountered an error while generating your plan. Please try again or use the manual plan creation option.';
    addMessageToChat('ai', errorMessage, containerId);
  }
}

// Plan Generation UI Functions removed - now purely conversation-driven

// Manual plan generation handlers removed - now purely conversation-driven

function showGeneratedPlan(plan) {
  const container = document.getElementById('createPlanMessages');
  
  // Add success message
  addMessageToChat('ai', '🎉 Great! I\'ve created your personalized learning plan. Here\'s what I\'ve prepared for you:', 'createPlanMessages');
  
  // Create plan preview
  const planPreview = document.createElement('div');
  planPreview.className = 'generated-plan-preview';
  planPreview.style.cssText = `
    background: white;
    border: 1px solid #e1e5e9;
    border-radius: 8px;
    padding: 20px;
    margin: 16px 0;
  `;
  
  planPreview.innerHTML = `
    <h4 style="margin: 0 0 12px 0; color: hsl(142, 35%, 42%);">${plan.title}</h4>
    <p style="margin: 0 0 16px 0; color: #666; font-size: 14px; line-height: 1.5;">${plan.description}</p>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; margin-bottom: 16px;">
      <div style="text-align: center; padding: 8px; background: #f8f9fa; border-radius: 6px;">
        <div style="font-size: 12px; color: #666; margin-bottom: 2px;">Duration</div>
        <div style="font-weight: 600; color: #333;">${plan.duration || plan.timeline || 'Not specified'}</div>
      </div>
      <div style="text-align: center; padding: 8px; background: #f8f9fa; border-radius: 6px;">
        <div style="font-size: 12px; color: #666; margin-bottom: 2px;">Level</div>
        <div style="font-weight: 600; color: #333;">${plan.skillLevel}</div>
      </div>
      <div style="text-align: center; padding: 8px; background: #f8f9fa; border-radius: 6px;">
        <div style="font-size: 12px; color: #666; margin-bottom: 2px;">Phases</div>
        <div style="font-weight: 600; color: #333;">${plan.phases.length}</div>
      </div>
    </div>
    
    <div style="display: flex; gap: 12px;">
      <button id="enrollInPlanBtn" style="background: hsl(142, 35%, 42%); color: white; border: none; padding: 12px 20px; border-radius: 6px; font-weight: 600; cursor: pointer; flex: 1;">
        🚀 Start Learning with this Plan
      </button>
      <button id="viewPlanDetailsBtn" style="background: transparent; color: hsl(142, 35%, 42%); border: 1px solid hsl(142, 35%, 42%); padding: 12px 20px; border-radius: 6px; font-weight: 600; cursor: pointer;">
        View Details
      </button>
    </div>
  `;
  
  container.appendChild(planPreview);
  container.scrollTop = container.scrollHeight;
  
  // Add event listeners
  document.getElementById('enrollInPlanBtn').addEventListener('click', () => handlePlanEnrollment(plan.id));
  document.getElementById('viewPlanDetailsBtn').addEventListener('click', () => showPlanDetails(plan));
}

async function handlePlanEnrollment(planId) {
  const enrollBtn = document.getElementById('enrollInPlanBtn');
  const originalText = enrollBtn.textContent;
  enrollBtn.disabled = true;
  enrollBtn.textContent = 'Starting...';
  
  try {
    await enrollInPlan(planId);
    
    // Show success message
    addMessageToChat('ai', '✅ Congratulations! You\'ve successfully enrolled in your learning plan. You can now find it in your "My Pathways" tab and start learning immediately!', 'createPlanMessages');
    
    // Update My Pathways view if visible
    if (currentTab === 'currentPlan') {
      updateMyPathwaysView();
    }
    
    // Remove the plan preview
    document.querySelector('.generated-plan-preview').remove();
    
  } catch (error) {
    console.error('Error enrolling in plan:', error);
    addMessageToChat('ai', 'Sorry, there was an error enrolling you in the plan. Please try again.', 'createPlanMessages');
    enrollBtn.disabled = false;
    enrollBtn.textContent = originalText;
  }
}

function showPlanDetails(plan) {
  const container = document.getElementById('createPlanMessages');
  const detailsDiv = document.createElement('div');
  detailsDiv.className = 'plan-details';
  detailsDiv.style.cssText = `
    background: #f8f9fa;
    border: 1px solid #e1e5e9;
    border-radius: 8px;
    padding: 20px;
    margin: 16px 0;
    max-height: 300px;
    overflow-y: auto;
  `;
  
  const phasesHtml = plan.phases.map((phase, index) => `
    <div style="margin-bottom: 16px; padding: 12px; background: white; border-radius: 6px;">
      <h5 style="margin: 0 0 8px 0; color: hsl(142, 35%, 42%);">Phase ${index + 1}: ${phase.title}</h5>
      <p style="margin: 0 0 8px 0; color: #666; font-size: 13px;">${phase.description || ''}</p>
      <div style="font-size: 12px; color: #888;">${phase.tasks ? phase.tasks.length : 0} tasks included</div>
    </div>
  `).join('');
  
  detailsDiv.innerHTML = `
    <h4 style="margin: 0 0 16px 0; color: #333;">📋 Plan Details</h4>
    ${phasesHtml}
    <button onclick="this.parentElement.remove()" style="background: #6c757d; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 13px;">Close Details</button>
  `;
  
  container.appendChild(detailsDiv);
  container.scrollTop = container.scrollHeight;
}

// Main chat plan generation UI removed - now purely conversation-driven

// Main chat manual plan generation handlers removed - now purely conversation-driven

function showGeneratedPlanInMainChat(plan) {
  // Add success message
  addMessageToChat('ai', '🎉 Great! I\'ve created your personalized learning plan. Here\'s what I\'ve prepared for you:', 'chatMessages');
  
  const container = document.getElementById('chatMessages');
  
  // Create plan preview
  const planPreview = document.createElement('div');
  planPreview.className = 'generated-plan-preview-main';
  planPreview.style.cssText = `
    background: white;
    border: 1px solid #e1e5e9;
    border-radius: 8px;
    padding: 20px;
    margin: 16px 0;
  `;
  
  planPreview.innerHTML = `
    <h4 style="margin: 0 0 12px 0; color: hsl(142, 35%, 42%);">${plan.title}</h4>
    <p style="margin: 0 0 16px 0; color: #666; font-size: 14px; line-height: 1.5;">${plan.description}</p>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; margin-bottom: 16px;">
      <div style="text-align: center; padding: 8px; background: #f8f9fa; border-radius: 6px;">
        <div style="font-size: 12px; color: #666; margin-bottom: 2px;">Duration</div>
        <div style="font-weight: 600; color: #333;">${plan.duration || plan.timeline || 'Not specified'}</div>
      </div>
      <div style="text-align: center; padding: 8px; background: #f8f9fa; border-radius: 6px;">
        <div style="font-size: 12px; color: #666; margin-bottom: 2px;">Level</div>
        <div style="font-weight: 600; color: #333;">${plan.skillLevel}</div>
      </div>
      <div style="text-align: center; padding: 8px; background: #f8f9fa; border-radius: 6px;">
        <div style="font-size: 12px; color: #666; margin-bottom: 2px;">Phases</div>
        <div style="font-weight: 600; color: #333;">${plan.phases.length}</div>
      </div>
    </div>
    
    <div style="display: flex; gap: 12px;">
      <button id="mainEnrollInPlanBtn" style="background: hsl(142, 35%, 42%); color: white; border: none; padding: 12px 20px; border-radius: 6px; font-weight: 600; cursor: pointer; flex: 1;">
        🚀 Start Learning with this Plan
      </button>
      <button id="mainViewPlanDetailsBtn" style="background: transparent; color: hsl(142, 35%, 42%); border: 1px solid hsl(142, 35%, 42%); padding: 12px 20px; border-radius: 6px; font-weight: 600; cursor: pointer;">
        View Details
      </button>
    </div>
  `;
  
  container.appendChild(planPreview);
  container.scrollTop = container.scrollHeight;
  
  // Add event listeners
  document.getElementById('mainEnrollInPlanBtn').addEventListener('click', () => handleMainChatPlanEnrollment(plan.id));
  document.getElementById('mainViewPlanDetailsBtn').addEventListener('click', () => showMainChatPlanDetails(plan));
}

async function handleMainChatPlanEnrollment(planId) {
  const enrollBtn = document.getElementById('mainEnrollInPlanBtn');
  const originalText = enrollBtn.textContent;
  enrollBtn.disabled = true;
  enrollBtn.textContent = 'Starting...';
  
  try {
    await enrollInPlan(planId);
    
    // Show success message
    addMessageToChat('ai', '✅ Congratulations! You\'ve successfully enrolled in your learning plan. You can now find it in your "My Pathways" tab and start learning immediately!', 'chatMessages');
    
    // Update My Pathways view if visible
    if (currentTab === 'currentPlan') {
      updateMyPathwaysView();
    }
    
    // Remove the plan preview
    document.querySelector('.generated-plan-preview-main').remove();
    
  } catch (error) {
    console.error('Error enrolling in plan:', error);
    addMessageToChat('ai', 'Sorry, there was an error enrolling you in the plan. Please try again.', 'chatMessages');
    enrollBtn.disabled = false;
    enrollBtn.textContent = originalText;
  }
}

function showMainChatPlanDetails(plan) {
  const container = document.getElementById('chatMessages');
  const detailsDiv = document.createElement('div');
  detailsDiv.className = 'main-chat-plan-details';
  detailsDiv.style.cssText = `
    background: #f8f9fa;
    border: 1px solid #e1e5e9;
    border-radius: 8px;
    padding: 20px;
    margin: 16px 0;
    max-height: 300px;
    overflow-y: auto;
  `;
  
  const phasesHtml = plan.phases.map((phase, index) => `
    <div style="margin-bottom: 16px; padding: 12px; background: white; border-radius: 6px;">
      <h5 style="margin: 0 0 8px 0; color: hsl(142, 35%, 42%);">Phase ${index + 1}: ${phase.title}</h5>
      <p style="margin: 0 0 8px 0; color: #666; font-size: 13px;">${phase.description || ''}</p>
      <div style="font-size: 12px; color: #888;">${phase.tasks ? phase.tasks.length : 0} tasks included</div>
    </div>
  `).join('');
  
  detailsDiv.innerHTML = `
    <h4 style="margin: 0 0 16px 0; color: #333;">📋 Plan Details</h4>
    ${phasesHtml}
    <button onclick="this.parentElement.remove()" style="background: #6c757d; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 13px;">Close Details</button>
  `;
  
  container.appendChild(detailsDiv);
  container.scrollTop = container.scrollHeight;
}

// API Configuration
const API_BASE_URL = 'https://eigenarc.com';

// API Functions for Chat and Plan Generation
async function createConversation(title = "New Conversation", formData = null, isCreatePlan = false) {
  try {
    const token = await window.firebaseAuth.getValidToken();
    
    // Prepare the body - include form data if provided
    const body = formData ? 
      {
        title,
        subject: formData.subject,
        skillLevel: formData.skillLevel,
        duration: formData.duration,
        dailyTime: formData.timeCommitment,
        goals: formData.goals
      } : 
      { title };
    
    const response = await fetch(`${API_BASE_URL}/api/conversations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const conversation = await response.json();
    
    // Only set currentConversationId for main chat, not Create Plan
    if (!isCreatePlan) {
      currentConversationId = conversation.id;
    }
    
    console.log('Conversation created:', conversation.id, isCreatePlan ? '(Create Plan)' : '(Main Chat)');
    return conversation;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
}

async function sendMessage(content, conversationId = null) {
  try {
    // Use provided conversationId or fall back to current main conversation
    const activeConversationId = conversationId || currentConversationId;
    
    if (!activeConversationId) {
      throw new Error('No active conversation');
    }

    const token = await window.firebaseAuth.getValidToken();
    const response = await fetch(`${API_BASE_URL}/api/conversations/${activeConversationId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Message sent and AI response received');
    return result;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

async function generatePlan(params, conversationId = null) {
  try {
    // Use provided conversationId or fall back to current ones
    const activeConversationId = conversationId || currentCreatePlanConversationId || currentConversationId;
    
    if (!activeConversationId) {
      throw new Error('No active conversation');
    }

    const token = await window.firebaseAuth.getValidToken();
    const response = await fetch(`${API_BASE_URL}/api/plans/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        conversationId: activeConversationId,
        ...params
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const plan = await response.json();
    generatedPlanId = plan.id;
    console.log('Plan generated:', plan.id);
    return plan;
  } catch (error) {
    console.error('Error generating plan:', error);
    throw error;
  }
}

async function generatePlanFromForm(params) {
  try {
    const token = await window.firebaseAuth.getValidToken();
    const response = await fetch(`${API_BASE_URL}/api/plans/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const plan = await response.json();
    generatedPlanId = plan.id;
    console.log('Plan generated from form:', plan.id);
    return plan;
  } catch (error) {
    console.error('Error generating plan from form:', error);
    throw error;
  }
}

async function enrollInPlan(learningPlanId) {
  try {
    const token = await window.firebaseAuth.getValidToken();
    const response = await fetch(`${API_BASE_URL}/api/courses/enroll`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ learningPlanId })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const enrollment = await response.json();
    console.log('Enrolled in plan:', learningPlanId);
    
    // Clear cache to refresh courses in My Pathways
    clearCoursesCache();
    
    return enrollment;
  } catch (error) {
    console.error('Error enrolling in plan:', error);
    throw error;
  }
}

async function signInWithFirebase() {
  const signinBtn = document.querySelector('.signin-btn');
  const originalText = signinBtn.textContent;
  signinBtn.textContent = 'Signing in...';
  signinBtn.disabled = true;
  
  try {
    // Wait for Firebase to be ready
    if (!window.firebaseAuth) {
      console.log('Waiting for Firebase to load...');
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Firebase load timeout'));
        }, 5000);
        
        const checkFirebase = () => {
          if (window.firebaseAuth) {
            clearTimeout(timeout);
            resolve();
          } else {
            setTimeout(checkFirebase, 100);
          }
        };
        
        document.addEventListener('firebaseReady', () => {
          clearTimeout(timeout);
          resolve();
        }, { once: true });
        
        // Check if already loaded
        if (window.firebaseReady || window.firebaseAuth) {
          clearTimeout(timeout);
          resolve();
        } else {
          checkFirebase();
        }
      });
    }
    
    const result = await window.firebaseAuth.signInWithGoogle();
    
    if (result.success) {
      // Store user data
      currentUser = result.user;
      
      // Save user to storage for persistence
      chrome.storage.local.set({ currentUser });
      
      // Update current tab for signed-in user (remove examples)
      currentTab = 'currentPlan';
      chrome.storage.local.set({ currentTab });
      
      // Navigate to home screen
      showScreen('homeScreen');
    } else {
      throw new Error(result.error || 'Authentication failed');
    }
  } catch (error) {
    console.error('Sign in error:', error);
    alert('Authentication failed. Please try again.');
    
    // Reset button
    signinBtn.textContent = originalText;
    signinBtn.disabled = false;
  }
}

function switchTab(tabName, element) {
  console.log('Switching to tab:', tabName);
  
  // Save current tab state
  currentTab = tabName;
  chrome.storage.local.set({ currentTab: tabName });
  
  // Update tab buttons
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
  });
  element.classList.add('active');
  
  // Hide all tab panels
  const panels = ['currentPlanTab', 'createPlanTab', 'examplesTab'];
  panels.forEach(panelId => {
    const panel = document.getElementById(panelId);
    if (panel) panel.classList.add('hidden');
  });
  
  // Show selected tab content
  if (tabName === 'currentPlan') {
    document.getElementById('currentPlanTab').classList.remove('hidden');
    updateMyPathwaysView();
  } else if (tabName === 'createPlan') {
    document.getElementById('createPlanTab').classList.remove('hidden');
    updateCreatePlanView();
    // Restore both form data and conversation history when switching to Create Plan tab
    setTimeout(async () => {
      await restoreFormData();
      // Display conversation history if there's an active Create Plan conversation
      if (currentCreatePlanConversationId && conversationHistory[currentCreatePlanConversationId] && conversationHistory[currentCreatePlanConversationId].length > 0) {
        displayConversationHistory('createPlanMessages');
        // Enable chat input since there's an active conversation
        enableCreatePlanChat();
      }
    }, 100);
  } else if (tabName === 'examples') {
    console.log('Switching to examples tab...');
    document.getElementById('examplesTab').classList.remove('hidden');
    renderExamplePathways();
    console.log('Examples tab shown and renderExamplePathways called');
  }
}

function loadSelectedPlan() {
  const dropdown = document.getElementById('planDropdown');
  const selectedPlan = dropdown.value;
  const plan = samplePlans[selectedPlan];
  
  if (!plan) return;
  
  currentPlan = plan;
  renderLessonsTable(plan.tableOfContents);
}

function updateCreatePlanView() {
  const signinView = document.getElementById('createPlanSignin');
  const signedInView = document.getElementById('createPlanSignedIn');
  
  if (currentUser) {
    // User is signed in - show chat interface
    if (signinView) signinView.style.display = 'none';
    if (signedInView) signedInView.style.display = 'block';
  } else {
    // User not signed in - show signin prompt
    if (signinView) signinView.style.display = 'block';
    if (signedInView) signedInView.style.display = 'none';
  }
}

async function updateMyPathwaysView() {
  const signinView = document.getElementById('pathwaysSignin');
  const loadingView = document.getElementById('pathwaysLoading');
  const pathwaysView = document.getElementById('pathwaysList');
  const emptyView = document.getElementById('pathwaysEmpty');
  
  console.log('updateMyPathwaysView called, currentUser:', currentUser ? 'signed in' : 'not signed in');
  
  // Hide all views initially
  [signinView, loadingView, pathwaysView, emptyView].forEach(view => {
    if (view) view.style.display = 'none';
  });
  
  // Check if user is actually signed in
  if (!currentUser || (!currentUser.uid && !currentUser.email)) {
    console.log('No user signed in, showing signin view');
    console.log('currentUser object:', currentUser);
    // Clear any stale cache when not signed in
    clearCoursesCache();
    if (signinView) signinView.style.display = 'block';
    return;
  }
  
  console.log('User signed in, loading courses...');
  
  // User is signed in, proceed with course loading
  try {
    // Check if we have cached courses to show immediately
    const cachedCourses = loadCoursesFromCache();
    const cacheAge = getCacheAge();
    const shouldRefresh = !cachedCourses || cacheAge > 5 * 60 * 1000; // Refresh if cache is older than 5 minutes
    
    // Show cached courses immediately if available
    if (cachedCourses && cachedCourses.length > 0) {
      if (pathwaysView) pathwaysView.style.display = 'block';
      renderUserCourses(cachedCourses, cacheAge > 60 * 1000); // Show staleness indicator if cache > 1 minute
    } else {
      // No cache, show loading
      if (loadingView) loadingView.style.display = 'block';
    }
    
    // Fetch fresh data if needed
    if (shouldRefresh) {
      try {
        console.log('Refreshing course data...');
        const courses = await fetchUserCourses();
        
        if (loadingView) loadingView.style.display = 'none';
        
        if (courses && courses.length > 0) {
          // Show fresh courses
          if (pathwaysView) pathwaysView.style.display = 'block';
          renderUserCourses(courses, false); // Fresh data, no staleness indicator
        } else {
          // No courses found
          if (pathwaysView) pathwaysView.style.display = 'none';
          if (emptyView) emptyView.style.display = 'block';
        }
      } catch (error) {
        console.error('Error refreshing courses:', error);
        if (loadingView) loadingView.style.display = 'none';
        
        // If we had cached data, keep showing it
        if (cachedCourses && cachedCourses.length > 0) {
          if (pathwaysView) pathwaysView.style.display = 'block';
          renderUserCourses(cachedCourses, true); // Show with staleness indicator
        } else {
          // No cached data and API failed
          if (emptyView) emptyView.style.display = 'block';
        }
      }
    }
  } catch (error) {
    console.error('Error in updateMyPathwaysView:', error);
    // Fallback to signin view if something goes wrong
    if (signinView) signinView.style.display = 'block';
  }
}

function updateTabVisibility() {
  const examplesTabBtn = document.getElementById('examplesTabBtn');
  const settingsDropdown = document.getElementById('settingsDropdown');
  
  if (currentUser) {
    // Signed in: hide Examples tab and show settings dropdown
    if (examplesTabBtn) {
      examplesTabBtn.style.display = 'none';
    }
    if (settingsDropdown) {
      settingsDropdown.style.display = 'block';
      updateProfileInfo();
    }
    // If current tab is examples, switch to My Pathways
    if (currentTab === 'examples') {
      currentTab = 'currentPlan';
    }
  } else {
    // Not signed in: show Examples tab and hide settings dropdown
    if (examplesTabBtn) {
      examplesTabBtn.style.display = 'block';
    }
    if (settingsDropdown) {
      settingsDropdown.style.display = 'none';
    }
    // Default to examples tab for non-signed in users
    if (currentTab !== 'examples') {
      currentTab = 'examples';
    }
  }
}

function restoreSavedTab() {
  // Restore the saved tab when homeScreen loads
  setTimeout(() => {
    const tabButtons = {
      'currentPlan': document.getElementById('currentPlanTabBtn'),
      'createPlan': document.getElementById('createPlanTabBtn'),
      'examples': document.getElementById('examplesTabBtn')
    };
    
    const targetButton = tabButtons[currentTab];
    if (targetButton && targetButton.style.display !== 'none') {
      switchTab(currentTab, targetButton);
    }
  }, 100);
}

async function fetchUserCourses(testToken = null) {
  let token = testToken;
  
  if (!token && currentUser) {
    try {
      // Get a valid token (automatically refreshes if needed)
      token = await window.firebaseAuth.getValidToken();
    } catch (error) {
      console.error('Failed to get valid token:', error);
      // Try to load from localStorage if token issues (offline mode)
      return loadCoursesFromCache();
    }
  }
  
  if (!token) {
    // Try to load from localStorage if no token (offline mode)
    return loadCoursesFromCache();
  }
  
  try {
    console.log('Fetching courses with token:', token.substring(0, 50) + '...');
    const response = await fetch('https://eigenarc.com/api/courses', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error response:', errorText);
      
      // If token is invalid/expired and we haven't already tried refresh
      if (response.status === 401 && !testToken && currentUser) {
        console.log('Token expired, attempting refresh and retry...');
        try {
          const refreshedToken = await window.firebaseAuth.getValidToken();
          // Retry with refreshed token
          return await fetchUserCourses(refreshedToken);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // Fall through to cache logic
        }
      }
      
      // If API fails, try to load from cache
      console.log('API failed, attempting to load from cache...');
      const cachedCourses = loadCoursesFromCache();
      if (cachedCourses && cachedCourses.length > 0) {
        console.log('Loaded courses from cache:', cachedCourses.length, 'courses');
        return cachedCourses;
      }
      
      throw new Error(`Failed to fetch courses: ${response.status} ${response.statusText}`);
    }
    
    const courses = await response.json();
    console.log('Fetched courses from API:', courses);
    
    // Store courses in localStorage for offline access
    saveCoursesToCache(courses);
    
    return courses;
  } catch (error) {
    console.error('Error fetching user courses:', error);
    
    // If network error, try to load from cache
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.log('Network error, attempting to load from cache...');
      const cachedCourses = loadCoursesFromCache();
      if (cachedCourses && cachedCourses.length > 0) {
        console.log('Loaded courses from cache (offline):', cachedCourses.length, 'courses');
        return cachedCourses;
      }
    }
    
    throw error;
  }
}

let isRefreshing = false;

function renderUserCourses(courses, isStale = false) {
  const container = document.getElementById('coursesContainer');
  const countEl = document.getElementById('pathwaysCount');
  
  if (!container) return;
  
  // Update header with course count
  if (countEl) {
    const countText = isRefreshing ? 
      `Refreshing pathways...` : 
      `Showing ${courses.length} pathways`;
    countEl.textContent = countText;
  }
  
  // No status indicator for stale data - just show refresh button
  const statusIndicator = '';
  
  const coursesHtml = courses.map(course => {
    const completionStatus = course.isCompleted ? 
      '<span style="background: #28a745; color: white; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;">✓ Completed</span>' :
      '<span style="background: #007bff; color: white; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;">In Progress</span>';
      
    const enrolledDate = new Date(course.enrolledAt).toLocaleDateString();
    
    // Fix phases count - ensure it's just the array length
    const phasesCount = course.phases && Array.isArray(course.phases) ? course.phases.length : 0;
    
    // Truncate description to 2 lines (approximately 120 characters)
    const description = course.description || '';
    const truncatedDescription = description.length > 120 ? 
      description.substring(0, 117) + '...' : description;
    
    return `
      <div class="course-card" data-course-id="${course.id}" style="
        border: 1px solid #e1e5e9; 
        border-radius: 6px; 
        padding: 12px; 
        margin-bottom: 10px; 
        background: white; 
        cursor: pointer; 
        transition: all 0.2s;
        box-shadow: 0 1px 2px rgba(0,0,0,0.08);
      ">
        <div class="course-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          <h4 style="margin: 0; color: hsl(142, 35%, 42%); font-size: 15px; font-weight: 600; line-height: 1.3; flex: 1; margin-right: 12px;">${course.title}</h4>
          ${completionStatus}
        </div>
        ${truncatedDescription ? `<p style="margin: 0 0 10px 0; color: #666; font-size: 13px; line-height: 1.4;">${truncatedDescription}</p>` : ''}
        <div class="course-meta" style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            ${course.duration ? `<span style="background: #f8f9fa; color: #666; padding: 2px 6px; border-radius: 8px; font-size: 11px;">${course.duration}</span>` : ''}
            ${course.skillLevel ? `<span style="background: #f8f9fa; color: #666; padding: 2px 6px; border-radius: 8px; font-size: 11px;">${course.skillLevel}</span>` : ''}
            ${phasesCount > 0 ? `<span style="background: #f8f9fa; color: #666; padding: 2px 6px; border-radius: 8px; font-size: 11px;">${phasesCount} phases</span>` : ''}
          </div>
          <div style="color: #888; font-size: 11px; text-align: right;">
            <div>Enrolled: ${enrolledDate}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  container.innerHTML = statusIndicator + coursesHtml;
  
  // Add click handlers for course cards
  container.querySelectorAll('.course-card').forEach(card => {
    card.addEventListener('click', () => {
      const courseId = card.dataset.courseId;
      const course = courses.find(c => c.id === courseId);
      if (course) {
        showCourseDetail(course, true);
      }
    });
    
    // Add hover effects
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-1px)';
      card.style.boxShadow = '0 2px 6px rgba(0,0,0,0.12)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = '0 1px 2px rgba(0,0,0,0.08)';
    });
  });
}

// Function to show course detail view
function showCourseDetail(course, save=true) {
  const pathwaysList = document.getElementById('pathwaysList');
  const courseDetailView = document.getElementById('courseDetailView');
  const courseDetailContent = document.getElementById('courseDetailContent');
  
  if (!courseDetailView || !courseDetailContent) return;
  
  // Save current scroll position before switching views
  if (save) {
    saveScrollPosition();
  }

  // Hide pathways list and show detail view
  if (pathwaysList) pathwaysList.style.display = 'none';
  courseDetailView.style.display = 'block';
  
  // Check if this is a different course before updating state
  const previousCourseId = currentViewState.courseId;
  const isDifferentCourse = previousCourseId !== course.id;
  
  // Update view state
  currentViewState.view = 'courseDetail';
  currentViewState.courseId = course.id;
  console.log('*** VIEW CHANGED TO courseDetail for course:', course.id);
  
  // Only reset scroll position if this is a genuine different course (not during initial restore)
  if (!previousCourseId || (previousCourseId && previousCourseId !== course.id)) {
    console.log('🔄 Opening different course, resetting scroll position. Previous:', previousCourseId, 'New:', course.id);
    currentViewState.scrollPositions.courseDetail = 0;
  } else {
    console.log('📍 Same course or initial load, preserving scroll position:', currentViewState.scrollPositions.courseDetail);
  }
  
  // Save state to storage
  saveViewState();
  
  // Parse phases from JSON string if needed
  let phases = [];
  try {
    if (typeof course.phases === 'string') {
      phases = JSON.parse(course.phases);
    } else if (Array.isArray(course.phases)) {
      phases = course.phases;
    }
  } catch (error) {
    console.error('Error parsing phases:', error);
    phases = [];
  }
  
  // Build progress map for easy lookup
  const progressMap = {};
  if (course.progress && Array.isArray(course.progress)) {
    course.progress.forEach(p => {
      const key = `${p.phaseIndex}-${p.taskIndex}`;
      progressMap[key] = p;
    });
  }
  
  // Generate course detail HTML
  const completionStatus = course.isCompleted ? 
    '<span style="background: #28a745; color: white; padding: 4px 12px; border-radius: 14px; font-size: 13px; font-weight: 500;">✓ Completed</span>' :
    '<span style="background: #007bff; color: white; padding: 4px 12px; border-radius: 14px; font-size: 13px; font-weight: 500;">In Progress</span>';
    
  const enrolledDate = new Date(course.enrolledAt).toLocaleDateString();
  const completedDate = course.completedAt ? new Date(course.completedAt).toLocaleDateString() : null;
  
  const phasesCount = phases.length;
  
  let phasesHtml = '';
  if (phases.length > 0) {
    phasesHtml = `
      <div style="margin-top: 24px;">
        <h4 style="color: hsl(142, 35%, 42%); margin: 0 0 16px 0; font-size: 16px;">Learning Phases (${phasesCount})</h4>
        <div style="display: flex; flex-direction: column; gap: 16px;">
          ${phases.map((phase, phaseIndex) => {
            // Calculate phase completion
            const phaseTasks = phase.tasks || [];
            const completedTasks = phaseTasks.filter((_, taskIndex) => {
              const key = `${phaseIndex}-${taskIndex}`;
              return progressMap[key] && progressMap[key].isCompleted;
            }).length;
            const phaseProgress = phaseTasks.length > 0 ? Math.round((completedTasks / phaseTasks.length) * 100) : 0;
            const phaseCompleted = phaseProgress === 100;
            
            return `
            <div style="
              border: 1px solid #e1e5e9;
              border-radius: 8px;
              padding: 16px;
              background: white;
            ">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                <div style="flex: 1;">
                  <h5 style="margin: 0 0 4px 0; color: #333; font-size: 15px; font-weight: 600;">${phase.title || `Phase ${phaseIndex + 1}`}</h5>
                  <div style="font-size: 12px; color: #888; margin-bottom: 8px;">${phase.duration || ''}</div>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 12px; color: #666;">${completedTasks}/${phaseTasks.length} tasks</span>
                  ${phaseCompleted ? 
                    '<span style="background: #28a745; color: white; padding: 2px 8px; border-radius: 10px; font-size: 11px;">✓ Completed</span>' : 
                    '<span style="background: #007bff; color: white; padding: 2px 8px; border-radius: 10px; font-size: 11px;">In Progress</span>'
                  }
                </div>
              </div>
              
              ${phase.description ? `<p style="margin: 0 0 16px 0; color: #666; font-size: 13px; line-height: 1.4;">${phase.description}</p>` : ''}
              
              ${phaseTasks.length > 0 ? `
                <div style="margin-top: 12px;">
                  <div style="font-size: 13px; font-weight: 500; color: #333; margin-bottom: 8px;">Tasks:</div>
                  <div style="display: flex; flex-direction: column; gap: 6px;">
                    ${phaseTasks.map((task, taskIndex) => {
                      const key = `${phaseIndex}-${taskIndex}`;
                      const taskProgress = progressMap[key];
                      const isCompleted = taskProgress && taskProgress.isCompleted;
                      const completedAt = taskProgress && taskProgress.completedAt ? new Date(taskProgress.completedAt).toLocaleDateString() : null;
                      
                      return `
                        <div class="clickable-task" style="
                          display: flex; 
                          align-items: flex-start; 
                          gap: 8px; 
                          padding: 8px 12px; 
                          background: ${isCompleted ? '#f8f9fa' : '#fff'}; 
                          border: 1px solid ${isCompleted ? '#28a745' : '#e9ecef'}; 
                          border-radius: 6px;
                          font-size: 12px;
                          cursor: pointer;
                          transition: all 0.2s ease;
                        " 
                        data-course-title="${course.title.replace(/"/g, '&quot;')}" 
                        data-course-description="${course.description?.replace(/"/g, '&quot;') || 'No description available'}" 
                        data-phase-title="${phase.title?.replace(/"/g, '&quot;') || `Phase ${phaseIndex + 1}`}" 
                        data-phase-description="${phase.description?.replace(/"/g, '&quot;') || ''}" 
                        data-task-title="${task.replace(/"/g, '&quot;')}" 
                        data-phase-duration="${phase.duration || ''}">
                          <span style="
                            width: 16px; 
                            height: 16px; 
                            border-radius: 50%; 
                            background: ${isCompleted ? '#28a745' : '#dee2e6'}; 
                            color: white; 
                            display: flex; 
                            align-items: center; 
                            justify-content: center; 
                            font-size: 10px;
                            flex-shrink: 0;
                            margin-top: 2px;
                          ">${isCompleted ? '✓' : taskIndex + 1}</span>
                          <div style="flex: 1; line-height: 1.4;">
                            <div style="color: ${isCompleted ? '#28a745' : '#333'};">${task}</div>
                            ${completedAt ? `<div style="font-size: 10px; color: #888; margin-top: 2px;">Completed: ${completedAt}</div>` : ''}
                            <div style="font-size: 10px; color: #007bff; margin-top: 2px; opacity: 0.8;">💡 Click to generate learning materials</div>
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              ` : ''}
            </div>
          `;
          }).join('')}
        </div>
      </div>
    `;
  }
  
  courseDetailContent.innerHTML = `
    <div style="margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
        <h2 style="margin: 0; color: hsl(142, 35%, 42%); font-size: 20px; font-weight: 600; line-height: 1.3;">${course.title}</h2>
        ${completionStatus}
      </div>
      
      <p style="margin: 0 0 16px 0; color: #666; font-size: 14px; line-height: 1.5;">${course.description || 'No description available'}</p>
      
      <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;">
        ${course.duration ? `<span style="background: #f8f9fa; color: #666; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 500;">Duration: ${course.duration}</span>` : ''}
        ${course.skillLevel ? `<span style="background: #f8f9fa; color: #666; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 500;">Level: ${course.skillLevel}</span>` : ''}
        ${phasesCount > 0 ? `<span style="background: #f8f9fa; color: #666; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 500;">${phasesCount} phases</span>` : ''}
      </div>
      
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-top: 1px solid #f0f0f0; font-size: 13px; color: #888;">
        <span>Enrolled: ${enrolledDate}</span>
        ${completedDate ? `<span>Completed: ${completedDate}</span>` : '<span>Continue learning →</span>'}
      </div>
    </div>
    ${phasesHtml}
  `;
  
  // Add event listeners for clickable tasks
  const clickableTasks = document.querySelectorAll('.clickable-task');
  clickableTasks.forEach(taskElement => {
    // Add click handler
    taskElement.addEventListener('click', () => {
      const courseTitle = taskElement.dataset.courseTitle;
      const courseDescription = taskElement.dataset.courseDescription;
      const phaseTitle = taskElement.dataset.phaseTitle;
      const phaseDescription = taskElement.dataset.phaseDescription;
      const taskTitle = taskElement.dataset.taskTitle;
      const phaseDuration = taskElement.dataset.phaseDuration;
      
      console.log('🎯 Task clicked:', taskTitle);
      injectTaskPrompt(courseTitle, courseDescription, phaseTitle, phaseDescription, taskTitle, phaseDuration);
    });
    
    // Add hover effects
    const originalBg = taskElement.style.background;
    const originalBorder = taskElement.style.borderColor;
    
    taskElement.addEventListener('mouseenter', () => {
      taskElement.style.background = '#f8f9fa';
      taskElement.style.borderColor = '#007bff';
    });
    
    taskElement.addEventListener('mouseleave', () => {
      taskElement.style.background = originalBg;
      taskElement.style.borderColor = originalBorder;
    });
  });

  // Restore scroll position when navigating to course details
  setTimeout(() => {
    const scrollableElement = getScrollableElement();
    const savedPosition = currentViewState.scrollPositions.courseDetail || 0;
    
    console.log('🔄 Restoring scroll in showCourseDetails to position:', savedPosition);
    
    // Always set the scroll position, even if it's 0, to ensure proper positioning
    scrollableElement.scrollTop = savedPosition;
    console.log('✅ Course detail scroll set to:', savedPosition);
  }, 100);
}

// Function to inject task-specific prompt into ChatGPT
function injectTaskPrompt(courseTitle, courseDescription, phaseTitle, phaseDescription, taskTitle, phaseDuration) {
  const prompt = `You are an educational content expert. Create detailed learning materials in for a specific lesson within a learning course.
Generate comprehensive content that includes:
1. A detailed overview explaining what this task teaches
2. Key learning points as a bulleted list
3. Detailed description with any algorithms / equations / illustrations / calculations etc.
4. Practice exercises as a numbered list
5. Estimated time to complete
IMPORTANT: 
- For technical subjects (mathematics, physics, chemistry, engineering, etc.), include relevant equations / calculations / code snippets / psuedocode
- For non-technical subjects (arts, music, literature, history, etc.), DO NOT include equations
- Make content educational, specific, and actionable

Create detailed learning content for this task:

Course: ${courseTitle}
Course Description: ${courseDescription}
Phase: ${phaseTitle}${phaseDescription ? ` (${phaseDescription})` : ''}
Task: ${taskTitle}
Phase Duration: ${phaseDuration}

Generate the learning materials following the system instructions.`;

  console.log('🎯 Injecting task prompt into ChatGPT:', prompt);
  
  // Query all ChatGPT tabs and inject the prompt
  chrome.tabs.query({ url: "*://chatgpt.com/*" }, (tabs) => {
    if (tabs.length > 0) {
      console.log(`Found ${tabs.length} ChatGPT tab(s), injecting prompt...`);
      let successfulInjections = 0;
      let failedTabs = [];
      
      tabs.forEach((tab, index) => {
        chrome.tabs.sendMessage(tab.id, {
          action: 'injectPrompt',
          prompt: prompt
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.log(`❌ Could not inject into tab ${tab.id}:`, chrome.runtime.lastError.message);
            failedTabs.push(tab);
            
            // If this was the last tab to try, handle failures
            if (index === tabs.length - 1) {
              if (successfulInjections === 0 && failedTabs.length > 0) {
                console.log('🔄 All tabs failed, trying to reload content script or creating new tab...');
                // Try reloading the first failed tab's content script
                chrome.tabs.reload(failedTabs[0].id, () => {
                  setTimeout(() => {
                    chrome.tabs.sendMessage(failedTabs[0].id, {
                      action: 'injectPrompt',
                      prompt: prompt
                    }, (response) => {
                      if (chrome.runtime.lastError) {
                        console.log('🆕 Reload failed, creating new ChatGPT tab...');
                        createNewChatGPTTab(prompt);
                      } else {
                        console.log('✅ Prompt injected after tab reload!');
                      }
                    });
                  }, 2000);
                });
              }
            }
          } else {
            successfulInjections++;
            console.log(`✅ Prompt injected successfully into ChatGPT tab ${tab.id}`);
          }
        });
      });
    } else {
      console.log('No ChatGPT tabs found, opening new tab...');
      createNewChatGPTTab(prompt);
    }
  });
}

function createNewChatGPTTab(prompt) {
  chrome.tabs.create({ url: 'https://chatgpt.com/' }, (newTab) => {
    console.log('Created new ChatGPT tab, waiting for load...');
    // Wait for tab to load before injecting
    setTimeout(() => {
      chrome.tabs.sendMessage(newTab.id, {
        action: 'injectPrompt',
        prompt: prompt
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.log('❌ Could not inject into new tab:', chrome.runtime.lastError.message);
          console.log('💡 Please refresh the ChatGPT tab and try again');
        } else {
          console.log('✅ Prompt injected successfully into new ChatGPT tab');
        }
      });
    }, 3000);
  });
}

// Function to go back to pathways list
function backToPathways() {
  const pathwaysList = document.getElementById('pathwaysList');
  const courseDetailView = document.getElementById('courseDetailView');
  
  // Save current scroll position before switching views
  saveScrollPosition();
  
  if (courseDetailView) courseDetailView.style.display = 'none';
  if (pathwaysList) pathwaysList.style.display = 'block';
  
  // Update view state
  currentViewState.view = 'pathwaysList';
  currentViewState.courseId = null;
  console.log('*** VIEW CHANGED TO pathwaysList');
  // Keep existing scroll positions - don't reset pathways list position
  
  // Save state and restore scroll position
  saveViewState();
  restoreScrollPosition();
}

// Function to refresh pathways
async function refreshPathways() {
  if (isRefreshing) return;
  
  const refreshBtn = document.getElementById('refreshPathwaysBtn');
  const countEl = document.getElementById('pathwaysCount');
  
  try {
    isRefreshing = true;
    
    // Update UI to show refreshing state
    if (refreshBtn) {
      refreshBtn.style.opacity = '0.5';
      refreshBtn.style.cursor = 'not-allowed';
    }
    if (countEl) {
      countEl.textContent = 'Refreshing pathways...';
    }
    
    // Force refresh by clearing cache and fetching fresh data
    if (currentUser) {
      clearCoursesCache();
      await fetchUserCourses();
      
      // Refresh the pathways view
      updateMyPathwaysView();
    }
  } catch (error) {
    console.error('Error refreshing pathways:', error);
    if (countEl) {
      countEl.textContent = 'Error refreshing pathways';
    }
  } finally {
    isRefreshing = false;
    
    // Reset button state
    if (refreshBtn) {
      refreshBtn.style.opacity = '1';
      refreshBtn.style.cursor = 'pointer';
    }
  }
}

// View state persistence functions
function saveViewState() {
  chrome.storage.local.set({ 
    currentViewState: currentViewState 
  });
}

function getScrollableElement() {
  // Always use the main tab-content container for scrolling
  const mainContainer = document.querySelector('.tab-content');
  console.log('Using main tab-content as scrollable element for view:', currentViewState.view);
  return mainContainer;
}

function saveScrollPosition() {
  const scrollableElement = getScrollableElement();
  const currentView = currentViewState.view;
  const scrollPosition = scrollableElement.scrollTop;
  
  // Save scroll position for the current view
  currentViewState.scrollPositions[currentView] = scrollPosition;
  console.log(`*** SAVING scroll position for ${currentView}:`, scrollPosition, 'on element:', scrollableElement.tagName, scrollableElement.id || scrollableElement.className);
  console.log('Current view state:', currentViewState.view, 'Course ID:', currentViewState.courseId);
  console.log('Updated scroll positions:', currentViewState.scrollPositions);
  saveViewState();
}

function restoreScrollPosition() {
  setTimeout(() => {
    const scrollableElement = getScrollableElement();
    const currentView = currentViewState.view;
    const scrollPosition = currentViewState.scrollPositions[currentView] || 0;
    
    console.log(`Restoring scroll position for ${currentView}:`, scrollPosition, 'on element:', scrollableElement.tagName, scrollableElement.id || scrollableElement.className);
    
    // Only restore if we have a meaningful position to restore
    if (scrollPosition > 0) {
      scrollableElement.scrollTop = scrollPosition;
    } else {
      // Reset to top for new views or when no position saved
      scrollableElement.scrollTop = 0;
    }
    
    // Verify the scroll was applied
    setTimeout(() => {
      console.log(`Actual scroll position after restore:`, scrollableElement.scrollTop);
    }, 100);
  }, 500);
}

async function restoreViewState() {
  try {
    console.log('💾 Loading persisted state from storage...');
    const result = await chrome.storage.local.get(['currentViewState']);
    
    if (result.currentViewState) {
      console.log('📥 Raw persisted state loaded:', result.currentViewState);
      console.log('📍 Raw scroll positions:', result.currentViewState.scrollPositions);
      
      // Merge with current state to ensure we have the scrollPositions structure
      console.log('🔧 Before merge - currentViewState:', currentViewState);
      console.log('🔧 Merging with result.currentViewState:', result.currentViewState);
      
      // Preserve the saved scroll positions completely
      const savedScrollPositions = result.currentViewState.scrollPositions || {};
      console.log('🔧 Saved scroll positions to preserve:', savedScrollPositions);
      console.log('🔧 courseDetail saved value:', savedScrollPositions.courseDetail);
      console.log('🔧 courseDetail is truthy?', !!savedScrollPositions.courseDetail);
      console.log('🔧 courseDetail type:', typeof savedScrollPositions.courseDetail);
      
      // Explicit assignment to avoid falsy issues
      const preservedCourseDetail = savedScrollPositions.courseDetail !== undefined ? savedScrollPositions.courseDetail : 0;
      const preservedPathwaysList = savedScrollPositions.pathwaysList !== undefined ? savedScrollPositions.pathwaysList : 0;
      
      console.log('🔧 Preserved courseDetail:', preservedCourseDetail);
      console.log('🔧 Preserved pathwaysList:', preservedPathwaysList);
      
      currentViewState = {
        ...currentViewState,
        ...result.currentViewState,
        scrollPositions: {
          pathwaysList: preservedPathwaysList,
          courseDetail: preservedCourseDetail
        }
      };
      
      console.log('🔧 After merge - scroll positions should be:', currentViewState.scrollPositions);
      
      // Safe logging of merged state
      try {
        console.log('✅ Merged view state (JSON):', JSON.stringify(currentViewState, null, 2));
      } catch (e) {
        console.log('✅ Merged view state (object has circular refs, showing properties):');
        console.log('   - view:', currentViewState.view);
        console.log('   - courseId:', currentViewState.courseId);
        console.log('   - scrollPosition:', currentViewState.scrollPosition);
        console.log('   - scrollPositions:', currentViewState.scrollPositions);
      }
      
      // DEBUG: Check if scroll positions are being modified
      console.log('🔍 Pre-final check scroll positions:', currentViewState.scrollPositions);
      console.log('🔍 courseDetail value specifically:', currentViewState.scrollPositions.courseDetail);
      console.log('🔍 Object keys:', Object.keys(currentViewState.scrollPositions));
      
      console.log('📍 Final scroll positions:', currentViewState.scrollPositions);
      console.log('🎯 Restored view:', currentViewState.view);
      console.log('📚 Restored course ID:', currentViewState.courseId);
      
      // Verify the merge worked correctly
      if (!currentViewState.view || !currentViewState.scrollPositions) {
        console.error('❌ MERGE FAILED - Missing critical properties!');
        console.log('Raw result.currentViewState was:', result.currentViewState);
      }
      
      // If we were in course detail view, restore it
      if (currentViewState.view === 'courseDetail' && currentViewState.courseId && currentUser) {
        // Fetch courses to find the specific course
        const courses = await fetchUserCourses();
        if (courses) {
          const course = courses.find(c => c.id === currentViewState.courseId);
          if (course) {
            // Small delay to ensure DOM is ready
            setTimeout(() => {
              showCourseDetail(course, false);
            }, 200);
          } else {
            // Course not found, switch to pathways list
            currentViewState.view = 'pathwaysList';
            currentViewState.courseId = null;
            restoreScrollPosition();
          }
        }
      } else {
        // Restore scroll position for pathways list
        currentViewState.view = 'pathwaysList';
        restoreScrollPosition();
      }
    }
  } catch (error) {
    console.error('Error restoring view state:', error);
  }
}

// Cache management functions
function saveCoursesToCache(courses) {
  try {
    const cacheData = {
      courses: courses,
      timestamp: Date.now(),
      userId: currentUser ? (currentUser.uid || currentUser.email) : 'unknown'
    };
    localStorage.setItem('eigenarc_courses_cache', JSON.stringify(cacheData));
    console.log('Courses cached successfully:', courses.length, 'courses');
  } catch (error) {
    console.error('Error saving courses to cache:', error);
  }
}

function loadCoursesFromCache() {
  try {
    const cacheData = localStorage.getItem('eigenarc_courses_cache');
    if (!cacheData) {
      console.log('No courses cache found');
      return null;
    }
    
    const parsed = JSON.parse(cacheData);
    const cacheAge = Date.now() - parsed.timestamp;
    
    // Don't use cache older than 24 hours
    if (cacheAge > 24 * 60 * 60 * 1000) {
      console.log('Courses cache expired, removing');
      localStorage.removeItem('eigenarc_courses_cache');
      return null;
    }
    
    // Check if cache is for current user (use uid or email as fallback)
    const currentUserId = currentUser ? (currentUser.uid || currentUser.email) : null;
    
    // If no user is signed in, clear any existing cache
    if (!currentUser) {
      console.log('No user signed in, clearing any existing cache');
      localStorage.removeItem('eigenarc_courses_cache');
      return null;
    }
    
    // If cache is for different user, remove it
    if (parsed.userId !== currentUserId) {
      console.log('Courses cache is for different user, removing');
      localStorage.removeItem('eigenarc_courses_cache');
      return null;
    }
    
    console.log('Loaded courses from cache:', parsed.courses.length, 'courses, age:', Math.round(cacheAge / 60000), 'minutes');
    return parsed.courses;
  } catch (error) {
    console.error('Error loading courses from cache:', error);
    localStorage.removeItem('eigenarc_courses_cache');
    return null;
  }
}

function getCacheAge() {
  try {
    const cacheData = localStorage.getItem('eigenarc_courses_cache');
    if (!cacheData) return Infinity;
    
    const parsed = JSON.parse(cacheData);
    return Date.now() - parsed.timestamp;
  } catch (error) {
    return Infinity;
  }
}

function clearCoursesCache() {
  localStorage.removeItem('eigenarc_courses_cache');
  console.log('Courses cache cleared');
}

// Function to handle user sign out (can be called from UI)
window.signOutUser = async function() {
  try {
    console.log('Signing out user...');
    const result = await window.firebaseAuth.signOut();
    
    if (result) {
      // Clear cached courses
      clearCoursesCache();
      
      // Reset current user
      currentUser = null;
      
      // Clear ALL localStorage data on signout
      await chrome.storage.local.clear();
      
      // Reset current view state
      currentViewState = {
        view: 'pathwaysList',
        courseId: null,
        scrollPosition: 0
      };
      
      // Reset conversation state
      currentConversationId = null;
      generatedPlanId = null;
      
      // Force tab to examples for guest experience
      currentTab = 'examples';
      
      // Refresh the UI to show signed out state (go to welcome screen)
      showScreen('welcomeScreen');
      
      console.log('User signed out successfully');
      return true;
    } else {
      throw new Error('Sign out failed');
    }
  } catch (error) {
    console.error('Sign out error:', error);
    return false;
  }
};

// Function to check token validity and refresh if needed
window.ensureValidToken = async function() {
  try {
    if (!currentUser) {
      throw new Error('No user signed in');
    }
    
    const token = await window.firebaseAuth.getValidToken();
    return token;
  } catch (error) {
    console.error('Token validation error:', error);
    
    // If token issues persist, sign out user
    if (error.message.includes('Refresh token expired') || error.message.includes('No user signed in')) {
      await window.signOutUser();
    }
    
    throw error;
  }
};

// Function to update profile information in the settings dropdown
function updateProfileInfo() {
  if (!currentUser) return;
  
  const profileName = currentUser.displayName || currentUser.email || 'User';
  const profileEmail = currentUser.email || '';
  const initials = getInitials(profileName);
  
  // Update header profile avatar only (no name displayed)
  const profileAvatarEl = document.getElementById('profileAvatar');
  if (profileAvatarEl) profileAvatarEl.textContent = initials;
  
  // Update dropdown profile elements
  const dropdownProfileNameEl = document.getElementById('dropdownProfileName');
  const dropdownProfileEmailEl = document.getElementById('dropdownProfileEmail');
  const profileAvatarLargeEl = document.getElementById('profileAvatarLarge');
  
  if (dropdownProfileNameEl) dropdownProfileNameEl.textContent = profileName;
  if (dropdownProfileEmailEl) dropdownProfileEmailEl.textContent = profileEmail;
  if (profileAvatarLargeEl) profileAvatarLargeEl.textContent = initials;
}

// Helper function to get user initials
function getInitials(name) {
  if (!name) return 'U';
  
  // If it's an email, use the first letter of the email username
  if (name.includes('@')) {
    return name.charAt(0).toUpperCase();
  }
  
  // For display names, get initials from first and last name
  const nameParts = name.trim().split(' ');
  if (nameParts.length >= 2) {
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  }
  
  return nameParts[0].charAt(0).toUpperCase();
}


// Make function globally available
window.renderExamplePathways = function() {
  const container = document.getElementById('examplePathwaysContainer');
  console.log('renderExamplePathways called, container found:', !!container);
  if (!container) {
    console.error('examplePathwaysContainer not found in DOM');
    return;
  }
  
  const pathwaysHtml = Object.entries(samplePlans).map(([key, plan]) => `
    <div class="guest-plan-card" data-plan-key="${key}" style="border: 1px solid #e1e5e9; border-radius: 8px; padding: 20px; margin-bottom: 16px; background: white; cursor: pointer; transition: all 0.2s;">
      <div class="plan-card-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h4 style="margin: 0; color: hsl(142, 35%, 42%); font-size: 16px; font-weight: 600;">${plan.title}</h4>
        <span class="plan-duration" style="background: #f0f8f0; color: hsl(142, 35%, 42%); padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">${plan.phases.reduce((total, phase) => total + phase.tasks.length, 0)} tasks</span>
      </div>
      <p style="margin: 0 0 16px 0; color: #666; font-size: 14px; line-height: 1.4;">${plan.description}</p>
      <div class="pathway-topics" style="margin-bottom: 16px;">
        ${(() => {
          const allTasks = plan.phases.flatMap(p => p.tasks);
          return allTasks.slice(0, 3).map(task => 
            `<span style="display: inline-block; background: #f8f9fa; color: #666; padding: 2px 8px; border-radius: 10px; font-size: 12px; margin-right: 6px; margin-bottom: 4px;">${task.length > 50 ? task.substring(0, 50) + '...' : task}</span>`
          ).join('') + 
          (allTasks.length > 3 ? `<span style="color: #999; font-size: 12px;">+${allTasks.length - 3} more tasks...</span>` : '');
        })()}
      </div>
      <div style="color: #999; font-size: 12px; text-align: right; margin-top: 8px;">Click to explore pathway →</div>
    </div>
  `).join('');
  
  container.innerHTML = pathwaysHtml;
  console.log('Examples HTML rendered, pathway count:', Object.keys(samplePlans).length);
  
  // Add event listeners for pathway cards
  container.querySelectorAll('.guest-plan-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const planKey = e.currentTarget.getAttribute('data-plan-key');
      if (planKey) {
        showPathwayDetails(planKey);
      }
    });
    
    // Add hover effects via JavaScript
    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = 'none';
    });
  });
}

// Make function globally available for onclick handlers
window.showPathwayDetails = function(planKey) {
  const plan = samplePlans[planKey];
  if (!plan) return;
  
  const detailsHtml = `
    <div style="padding: 20px; background: white; border-radius: 8px; border: 1px solid #e1e5e9;">
      <h3 style="color: hsl(142, 35%, 42%); margin-bottom: 16px;">${plan.title}</h3>
      <p style="color: #666; margin-bottom: 20px; line-height: 1.5;">${plan.description}</p>
      <div class="phases-tree">
        ${plan.phases.map((phase, phaseIndex) => `
          <div class="phase-section" style="margin-bottom: 24px;">
            <div class="phase-header" style="display: flex; align-items: center; margin-bottom: 12px; cursor: pointer;" data-phase-index="${phaseIndex}">
              <span class="expand-icon" style="margin-right: 8px; font-size: 12px; transition: transform 0.2s;">▼</span>
              <div style="width: 32px; height: 32px; border-radius: 6px; background: hsl(142, 35%, 42%); color: white; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; margin-right: 12px;">
                ${phaseIndex + 1}
              </div>
              <div>
                <div style="font-weight: 600; color: #333; font-size: 15px;">${phase.title}</div>
                <div style="font-size: 12px; color: #888;">${phase.tasks.length} tasks</div>
              </div>
            </div>
            <div class="tasks-container" data-phase-index="${phaseIndex}" style="margin-left: 52px;">
              ${phase.tasks.map((task, taskIndex) => {
                const taskId = `${planKey}-${phaseIndex}-${taskIndex}`;
                const isCompleted = isLessonCompleted(taskId);
                return `
                <div class="task-item" style="display: flex; align-items: center; padding: 8px 0; cursor: pointer; border-radius: 4px; padding-left: 8px; transition: background 0.2s;" data-plan="${planKey}" data-phase="${phaseIndex}" data-task-index="${taskIndex}">
                  <div class="task-badge" style="width: 20px; height: 20px; border-radius: 50%; background: #f0f8f0; color: hsl(142, 35%, 42%); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 500; margin-right: 10px;">
                    ${isCompleted ? '✓' : taskIndex + 1}
                  </div>
                  <div style="flex: 1;">
                    <div class="task-title" style="font-weight: 500; color: #333; font-size: 14px; text-decoration: ${isCompleted ? 'line-through' : 'none'}; opacity: ${isCompleted ? '0.6' : '1'};">${task}</div>
                  </div>
                  <div style="color: #999; font-size: 12px; margin-left: 8px;">→</div>
                </div>
              `;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>
      <button id="backToExamplesBtn" style="margin-top: 20px; background: transparent; color: hsl(142, 35%, 42%); border: 1px solid #ddd; padding: 8px 16px; border-radius: 16px; font-size: 13px; cursor: pointer;">
        ← Back to Examples
      </button>
    </div>
  `;
  
  const container = document.getElementById('examplePathwaysContainer');
  if (container) {
    container.innerHTML = detailsHtml;
    
    // Add back button event listener
    const backBtn = container.querySelector('#backToExamplesBtn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        renderExamplePathways();
      });
    }
    
    // Add collapse/expand functionality for phases
    container.querySelectorAll('.phase-header').forEach(header => {
      header.addEventListener('click', () => {
        const phaseIndex = header.getAttribute('data-phase-index');
        const tasksContainer = container.querySelector(`.tasks-container[data-phase-index="${phaseIndex}"]`);
        const expandIcon = header.querySelector('.expand-icon');
        
        const isCollapsed = tasksContainer.style.display === 'none';
        tasksContainer.style.display = isCollapsed ? '' : 'none';
        expandIcon.textContent = isCollapsed ? '▼' : '▶';
      });
    });
    
    // Add lesson click functionality and hover effects using delegated events
    container.addEventListener('click', (e) => {
      const taskItem = e.target.closest('.task-item');
      if (!taskItem) return;
      
      const clickedPlanKey = taskItem.getAttribute('data-plan');
      const phaseIndex = taskItem.getAttribute('data-phase');
      const taskIndex = taskItem.getAttribute('data-task-index');
      
      const plan = samplePlans[clickedPlanKey];
      if (!plan) return;
      
      const phase = plan.phases[parseInt(phaseIndex)];
      const task = phase.tasks[parseInt(taskIndex)];
      
      // Set currentPlan for the selectLesson function
      currentPlan = plan;
      
      // Create unique task ID
      const taskId = `${clickedPlanKey}-${phaseIndex}-${taskIndex}`;
      
      // Toggle task completion
      const isCompleted = toggleLessonCompletion(taskId);
      
      // Update visual state
      const taskTitle = taskItem.querySelector('.task-title');
      const taskBadge = taskItem.querySelector('.task-badge');
      
      if (taskTitle) {
        taskTitle.style.textDecoration = isCompleted ? 'line-through' : 'none';
        taskTitle.style.opacity = isCompleted ? '0.6' : '1';
      }
      
      if (taskBadge) {
        taskBadge.textContent = isCompleted ? '✓' : (parseInt(taskIndex) + 1);
      }
      
      // Use existing selectLesson function to inject prompt into ChatGPT
      selectLesson({ title: task, timeline: '' });
    });
    
    // Add hover effects using delegated events
    container.addEventListener('mouseenter', (e) => {
      const taskItem = e.target.closest('.task-item');
      if (taskItem) {
        taskItem.style.background = '#f8f9fa';
      }
    }, true);
    
    container.addEventListener('mouseleave', (e) => {
      const taskItem = e.target.closest('.task-item');
      if (taskItem) {
        taskItem.style.background = 'transparent';
      }
    }, true);
  }
}



function constructPrompt(plan, contentItem) {
  return `Learning Plan: ${plan.title}
Description: ${plan.description}
Current Topic: ${contentItem.title}
${contentItem.timeline ? `Timeline: ${contentItem.timeline}` : ''}

Please provide detailed learning materials and guidance for this topic based on the context above.`;
}

function generatePlanResponse(userMessage) {
  // Simple response generation based on user input
  if (userMessage.toLowerCase().includes('web') || userMessage.toLowerCase().includes('frontend')) {
    return "Excellent! I can see you're interested in web development. Based on your input, I'll create a comprehensive full-stack web development plan that covers HTML, CSS, JavaScript, React, and backend technologies.";
  } else if (userMessage.toLowerCase().includes('data') || userMessage.toLowerCase().includes('python')) {
    return "Great choice! Data science is an exciting field. I'll design a plan that covers Python programming, data analysis, statistics, and machine learning fundamentals.";
  } else if (userMessage.toLowerCase().includes('mobile') || userMessage.toLowerCase().includes('app')) {
    return "Mobile development is a fantastic skill! I'll create a plan focused on React Native development so you can build apps for both iOS and Android.";
  } else {
    return "Thank you for sharing your goals! I'm analyzing your requirements and will create a customized learning plan that matches your experience level and time commitment.";
  }
}

// Plan Management - Updated for new UI
function loadCurrentPlan() {
  console.log('Loading current plan - no specific plan to load for new UI');
  // The new "My Pathways" tab shows "No pathways yet" message
  // No need to load specific plan data since we removed the dropdown
}

function renderLessonsTable(tableOfContents) {
  const tbody = document.getElementById('lessonsTableBody');
  tbody.innerHTML = '';
  
  tableOfContents.forEach(content => {
    const row = document.createElement('tr');
    row.className = `lesson-row ${content.completed ? 'completed' : ''}`;
    row.onclick = () => selectLesson(content);
    
    row.innerHTML = `
      <td class="lesson-cell status-icon">
        ${content.completed ? '✅' : '⭕'}
      </td>
      <td class="lesson-cell">
        <div class="lesson-title">${content.title}</div>
        <div class="lesson-duration">${content.timeline}</div>
      </td>
    `;
    
    tbody.appendChild(row);
  });
}

// Lesson Selection and Prompt Injection
async function selectLesson(lesson) {
  try {
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Check if we're on ChatGPT
    if (!tab?.url || (!tab.url.includes('chat.openai.com') && !tab.url.includes('chatgpt.com'))) {
      showNotification('Please open ChatGPT to inject this lesson prompt!');
      // Optionally open ChatGPT in a new tab
      chrome.tabs.create({ url: 'https://chat.openai.com' });
      return;
    }
    
    // Construct prompt dynamically from plan data
    const prompt = constructPrompt(currentPlan, lesson);
    
    // Send message to content script to inject the lesson prompt
    await chrome.tabs.sendMessage(tab.id, {
      action: 'injectPrompt',
      prompt: prompt
    });
    
    // Show success message
    showNotification(`✅ Lesson "${lesson.title}" prompt injected into ChatGPT!`);
    
    // Close popup after successful injection
    setTimeout(() => {
      window.close();
    }, 1500);
    
  } catch (error) {
    console.error('Error injecting lesson prompt:', error);
    alert('Error injecting prompt. Make sure you are on the ChatGPT website.');
  }
}

function showNotification(message) {
  // Create temporary notification overlay
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: hsl(142, 35%, 42%);
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    z-index: 10000;
    font-weight: 600;
    text-align: center;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Remove after 2 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 2000);
}

// Initialize extension
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 === POPUP OPENED ===');
  console.log('📊 Current view state at startup:', currentViewState);
  console.log('📍 Scroll positions at startup:', currentViewState.scrollPositions);
  console.log('🎯 Current view:', currentViewState.view);
  console.log('📚 Current course ID:', currentViewState.courseId);
  console.log('========================');
  
  // Load conversation history on startup
  await loadConversationHistory();
  
  // Attach event listeners
  document.getElementById('beginLearningBtn').addEventListener('click', () => {
    console.log('Begin Learning clicked');
    if (!currentUser) {
      // Not signed in: set tab to examples before showing home screen
      currentTab = 'examples';
    }
    showScreen('homeScreen');
  });
  
  // Remove try without signin functionality - no longer needed
  
  // Add event listeners with null checks
  const sendChatBtn = document.getElementById('sendChatBtn');
  if (sendChatBtn) {
    sendChatBtn.addEventListener('click', sendChatMessage);
  }
  
  const signinBtn = document.getElementById('signinBtn');
  if (signinBtn) {
    signinBtn.addEventListener('click', signInWithFirebase);
  }
  
  // Form submission for Create Plan
  const createPlanForm = document.getElementById('createPlanForm');
  if (createPlanForm) {
    createPlanForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Collect form data
      const formData = {
        subject: document.getElementById('planSubject').value.trim(),
        skillLevel: document.getElementById('planSkillLevel').value,
        duration: document.getElementById('planDuration').value,
        timeCommitment: document.getElementById('planTimeCommitment').value,
        goals: document.getElementById('planGoals').value.trim()
      };
      
      // Validate form
      if (!formData.subject || !formData.skillLevel || !formData.duration || !formData.timeCommitment || !formData.goals) {
        alert('Please fill in all fields');
        return;
      }
      
      // Handle plan creation
      await handleFormPlanCreation(formData);
    });
    
    // Restore saved form data on form load
    setTimeout(async () => {
      await restoreFormData();
    }, 200);
  }
  
  // New conversation button (only for main chat)
  const newConversationBtn = document.getElementById('newConversationBtn');
  if (newConversationBtn) {
    newConversationBtn.addEventListener('click', () => {
      startNewConversation('chatMessages');
    });
  }
  
  // New Plan button for Create Plan tab
  const newCreatePlanConversationBtn = document.getElementById('newCreatePlanConversationBtn');
  if (newCreatePlanConversationBtn) {
    newCreatePlanConversationBtn.addEventListener('click', async () => {
      // Clear form fields
      document.getElementById('planSubject').value = '';
      document.getElementById('planSkillLevel').value = '';
      document.getElementById('planDuration').value = '';
      document.getElementById('planTimeCommitment').value = '';
      document.getElementById('planGoals').value = '';
      
      // Clear conversation history for the current Create Plan conversation before resetting ID
      if (currentCreatePlanConversationId && conversationHistory[currentCreatePlanConversationId]) {
        delete conversationHistory[currentCreatePlanConversationId];
      }
      
      // Clear conversation state
      currentCreatePlanConversationId = null;
      
      // Clear from storage
      await chrome.storage.local.set({ currentCreatePlanConversationId: null });
      
      // Clear saved form data
      await clearSavedFormData();
      
      // Reset chat to initial state
      const chatContainer = document.getElementById('createPlanMessages');
      
      // Remove chat input if it exists
      const chatInput = chatContainer.parentElement.querySelector('.chat-input-container');
      if (chatInput) {
        chatInput.remove();
      }
      if (chatContainer) {
        // Clear all messages and restore initial state
        chatContainer.innerHTML = `
          <div class="message ai">
            Let's create your personalized learning plan! Please fill out the form below with your goals and preferences.
            <br><br>
            <a href="#" id="chatPageLink" style="color: hsl(142, 35%, 42%); text-decoration: none;">Need inspiration? Check example learning plans →</a>
          </div>
          
          <!-- Inline Form Message -->
          <div class="message ai" id="createPlanFormMessage">
            <form id="createPlanForm" style="max-width: 100%;">
              <div style="margin-bottom: 15px;">
                <label for="planSubject" style="display: block; font-weight: 600; margin-bottom: 6px; color: #333; font-size: 13px;">
                  Subject / Topic of Study
                </label>
                <input 
                  type="text" 
                  id="planSubject" 
                  required
                  placeholder="e.g., Machine Learning, Web Development, Data Science"
                  style="width: 100%; padding: 8px 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; box-sizing: border-box;"
                >
              </div>

              <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                <div style="flex: 1;">
                  <label for="planSkillLevel" style="display: block; font-weight: 600; margin-bottom: 6px; color: #333; font-size: 13px;">
                    Skill Level
                  </label>
                  <select 
                    id="planSkillLevel" 
                    required
                    style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; background: white; box-sizing: border-box;"
                  >
                    <option value="">Select level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                
                <div style="flex: 1;">
                  <label for="planDuration" style="display: block; font-weight: 600; margin-bottom: 6px; color: #333; font-size: 13px;">
                    Duration
                  </label>
                  <select 
                    id="planDuration" 
                    required
                    style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; background: white; box-sizing: border-box;"
                  >
                    <option value="">Select duration</option>
                    <option value="1 week">1 Week</option>
                    <option value="2 weeks">2 Weeks</option>
                    <option value="4 weeks">1 Month</option>
                    <option value="8 weeks">2 Months</option>
                    <option value="12 weeks">3 Months</option>
                    <option value="6 months">6 Months</option>
                  </select>
                </div>
              </div>

              <div style="margin-bottom: 15px;">
                <label for="planTimeCommitment" style="display: block; font-weight: 600; margin-bottom: 6px; color: #333; font-size: 13px;">
                  Daily Time Commitment
                </label>
                <select 
                  id="planTimeCommitment" 
                  required
                  style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; background: white; box-sizing: border-box;"
                >
                  <option value="">Select daily time</option>
                  <option value="30 minutes">30 minutes</option>
                  <option value="1 hour">1 hour</option>
                  <option value="2 hours">2 hours</option>
                  <option value="3 hours">3 hours</option>
                  <option value="4+ hours">4+ hours</option>
                </select>
              </div>

              <div style="margin-bottom: 20px;">
                <label for="planGoals" style="display: block; font-weight: 600; margin-bottom: 6px; color: #333; font-size: 13px;">
                  Learning Goals
                </label>
                <textarea 
                  id="planGoals" 
                  required
                  rows="3"
                  placeholder="Describe what you want to achieve, specific skills to learn, projects to build, etc."
                  style="width: 100%; padding: 8px 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; resize: vertical; box-sizing: border-box; font-family: inherit;"
                ></textarea>
              </div>

              <div style="display: flex; gap: 8px;">
                <button 
                  type="submit" 
                  id="generatePlanBtn"
                  style="flex: 1; background: linear-gradient(135deg, hsl(142, 35%, 42%) 0%, hsl(142, 40%, 52%) 100%); color: white; border: none; padding: 10px 15px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;"
                >
                  ✨ Personalize
                </button>
                <button 
                  type="button" 
                  id="clearFormBtn"
                  style="background: transparent; color: hsl(142, 35%, 42%); border: 1px solid hsl(142, 35%, 42%); padding: 10px 15px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        `;
        
        // Re-attach form event listeners and restore form data
        attachCreatePlanFormListeners();
        
        // Restore form data after recreating the form
        setTimeout(async () => {
          await restoreFormData();
        }, 100);
      }
    });
  }
  
  // Add keyboard support for main chat input
  const chatInput = document.getElementById('chatInput');
  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendChatMessage();
      }
    });
  }
  
  // Add guest signin button handler
  const guestSigninBtn = document.getElementById('guestSigninBtn');
  if (guestSigninBtn) {
    guestSigninBtn.addEventListener('click', () => showScreen('signinScreen'));
  }
  
  // Tab switching with delay to ensure DOM is ready
  setTimeout(() => {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Tab clicked:', e.target.dataset.tab);
        const tabName = e.target.dataset.tab;
        if (tabName) {
          switchTab(tabName, e.target);
        }
      });
    });
  }, 100);

  // Add examples navigation links with delay
  setTimeout(() => {
    const checkExamplesLink = document.getElementById('checkExamplesLink');
    if (checkExamplesLink) {
      checkExamplesLink.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Check examples link clicked');
        const examplesTabBtn = document.getElementById('examplesTabBtn');
        if (examplesTabBtn) {
          switchTab('examples', examplesTabBtn);
        }
      });
    }

    const chatPageLink = document.getElementById('chatPageLink');
    if (chatPageLink) {
      chatPageLink.addEventListener('click', (e) => {
        e.preventDefault();
        const examplesTabBtn = document.getElementById('examplesTabBtn');
        if (examplesTabBtn) {
          switchTab('examples', examplesTabBtn);
        }
      });
    }

    const browseExamplesLink = document.getElementById('browseExamplesLink');
    if (browseExamplesLink) {
      browseExamplesLink.addEventListener('click', (e) => {
        e.preventDefault();
        const examplesTabBtn = document.getElementById('examplesTabBtn');
        if (examplesTabBtn) {
          switchTab('examples', examplesTabBtn);
        }
      });
    }

    const browseExamplesFromForm = document.getElementById('browseExamplesFromForm');
    if (browseExamplesFromForm) {
      browseExamplesFromForm.addEventListener('click', (e) => {
        e.preventDefault();
        const examplesTabBtn = document.getElementById('examplesTabBtn');
        if (examplesTabBtn) {
          switchTab('examples', examplesTabBtn);
        }
      });
    }

    const clearFormBtn = document.getElementById('clearFormBtn');
    if (clearFormBtn) {
      clearFormBtn.addEventListener('click', async () => {
        // Clear form fields
        document.getElementById('planSubject').value = '';
        document.getElementById('planSkillLevel').value = '';
        document.getElementById('planDuration').value = '';
        document.getElementById('planTimeCommitment').value = '';
        document.getElementById('planGoals').value = '';
        
        // Clear saved form data
        await clearSavedFormData();
        
        // Reset chat to initial state
        const chatContainer = document.getElementById('createPlanMessages');
        if (chatContainer) {
          // Keep only the first two messages (welcome and form)
          const messages = chatContainer.children;
          const messagesToKeep = 2; // Welcome message + form message
          while (messages.length > messagesToKeep) {
            chatContainer.removeChild(messages[messagesToKeep]);
          }
        }
      });
    }

    const createPlanSigninBtn = document.getElementById('createPlanSigninBtn');
    if (createPlanSigninBtn) {
      createPlanSigninBtn.addEventListener('click', signInWithFirebase);
    }
    
    // Refresh pathways button listener
    const refreshPathwaysBtn = document.getElementById('refreshPathwaysBtn');
    if (refreshPathwaysBtn) {
      refreshPathwaysBtn.addEventListener('click', refreshPathways);
      
      // Add hover effects
      refreshPathwaysBtn.addEventListener('mouseenter', () => {
        refreshPathwaysBtn.style.background = '#f8f9fa';
        refreshPathwaysBtn.style.borderColor = '#d0d7de';
      });
      
      refreshPathwaysBtn.addEventListener('mouseleave', () => {
        if (!isRefreshing) {
          refreshPathwaysBtn.style.background = 'none';
          refreshPathwaysBtn.style.borderColor = '#e1e5e9';
        }
      });
    }

    // Back to pathways button listener
    const backToPathwaysBtn = document.getElementById('backToPathwaysBtn');
    if (backToPathwaysBtn) {
      backToPathwaysBtn.addEventListener('click', backToPathways);
      
      // Add hover effects
      backToPathwaysBtn.addEventListener('mouseenter', () => {
        backToPathwaysBtn.style.background = '#f8f9fa';
      });
      
      backToPathwaysBtn.addEventListener('mouseleave', () => {
        backToPathwaysBtn.style.background = 'none';
      });
    }

    // Add scroll position tracking
    const trackScrollPosition = () => {
      saveScrollPosition();
    };
    
    // Track scroll position on multiple potential scroll containers
    let scrollTimeout;
    window.globalScrollTimeout = scrollTimeout; // Make globally accessible
    const addScrollTracking = (element) => {
      if (element) {
        console.log('Adding scroll tracking to:', element.tagName, element.id || element.className);
        element.addEventListener('scroll', () => {
          clearTimeout(window.globalScrollTimeout);
          window.globalScrollTimeout = setTimeout(trackScrollPosition, 250);
        });
      }
    };
    
    // Primary scroll tracking on the main scrollable container (.tab-content)
    const tabContent = document.querySelector('.tab-content');
    if (tabContent) {
      console.log('Adding scroll tracking to tab-content');
      addScrollTracking(tabContent);
    }
    
    // Add scroll tracking to other potential containers as backup
    addScrollTracking(document.body);
    addScrollTracking(document.documentElement);
    addScrollTracking(document.getElementById('homeScreen'));
    
    // Also add a universal scroll listener
    document.addEventListener('scroll', (e) => {
      clearTimeout(window.globalScrollTimeout);
      window.globalScrollTimeout = setTimeout(trackScrollPosition, 250);
    }, true); // Use capture to catch all scroll events
    
    // Save position when popup is about to close
    window.addEventListener('beforeunload', saveScrollPosition);

    // Settings dropdown event listeners
    const settingsBtn = document.getElementById('settingsBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const signOutMenuItem = document.getElementById('signOutMenuItem');
    
    if (settingsBtn && dropdownMenu) {
      // Toggle dropdown when settings button is clicked
      settingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = dropdownMenu.style.display === 'block';
        dropdownMenu.style.display = isVisible ? 'none' : 'block';
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!settingsBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
          dropdownMenu.style.display = 'none';
        }
      });
      
      // Add hover effects to settings button
      settingsBtn.addEventListener('mouseenter', () => {
        settingsBtn.style.backgroundColor = '#f8f9fa';
      });
      
      settingsBtn.addEventListener('mouseleave', () => {
        settingsBtn.style.backgroundColor = 'transparent';
      });
    }
    
    // Sign out menu item event listener
    if (signOutMenuItem) {
      signOutMenuItem.addEventListener('click', async (e) => {
        e.preventDefault();
        const success = await window.signOutUser();
        if (success) {
          console.log('User signed out from settings dropdown');
        } else {
          alert('Sign out failed. Please try again.');
        }
      });
      
      // Add hover effects to dropdown item
      signOutMenuItem.addEventListener('mouseenter', () => {
        signOutMenuItem.style.backgroundColor = '#f8f9fa';
      });
      
      signOutMenuItem.addEventListener('mouseleave', () => {
        signOutMenuItem.style.backgroundColor = 'transparent';
      });
    }

    const pathwaysSigninBtn = document.getElementById('pathwaysSigninBtn');
    if (pathwaysSigninBtn) {
      pathwaysSigninBtn.addEventListener('click', signInWithFirebase);
    }

    const pathwaysBrowseExamplesLink = document.getElementById('pathwaysBrowseExamplesLink');
    if (pathwaysBrowseExamplesLink) {
      pathwaysBrowseExamplesLink.addEventListener('click', (e) => {
        e.preventDefault();
        const examplesTabBtn = document.getElementById('examplesTabBtn');
        if (examplesTabBtn) {
          switchTab('examples', examplesTabBtn);
        }
      });
    }
  }, 100);
  
  // Restore saved state (screen, tab, user)
  chrome.storage.local.get(['currentUser', 'currentScreen', 'currentTab', 'firebaseAuth'], async (result) => {
    if (result.currentUser && result.firebaseAuth) {
      // Reconstruct the complete user object with Firebase token info
      currentUser = {
        ...result.currentUser,
        firebaseToken: result.firebaseAuth.idToken,
        refreshToken: result.firebaseAuth.refreshToken,
        tokenExpiry: result.firebaseAuth.tokenExpiry
      };
      
      // Also update the currentUser in firebase.js with complete object
      if (window.firebaseAuth && window.firebaseAuth.setCurrentUser) {
        window.firebaseAuth.setCurrentUser(currentUser);
      }
      
      console.log('Restored user state with token:', currentUser.email || currentUser.displayName);
      console.log('Token expiry:', new Date(currentUser.tokenExpiry));
      
      // Check if token needs refresh on startup
      if (result.firebaseAuth.tokenExpiry) {
        const now = Date.now();
        const tokenExpiry = result.firebaseAuth.tokenExpiry;
        
        // If token expired or expiring in next minute, try to refresh
        if (now >= tokenExpiry - 60000) {
          console.log('Stored token expired, attempting refresh on startup...');
          try {
            await window.firebaseAuth.getValidToken();
          } catch (error) {
            console.error('Startup token refresh failed:', error);
            // If refresh fails, clear the user state
            currentUser = null;
            if (window.firebaseAuth && window.firebaseAuth.setCurrentUser) {
              window.firebaseAuth.setCurrentUser(null);
            }
          }
        }
      }
    } else if (result.currentUser && !result.firebaseAuth) {
      console.log('User found but no Firebase auth data - user needs to sign in again');
      // Clear incomplete user state
      await chrome.storage.local.remove(['currentUser']);
    } else {
      console.log('No saved user state found');
    }
    
    // Restore view state after user is loaded
    if (currentUser) {
      await restoreViewState();
    }
    
    // Set default tab based on authentication status
    if (currentUser) {
      // Signed in: default to My Pathways, no Examples tab
      currentTab = result.currentTab && result.currentTab !== 'examples' ? result.currentTab : 'currentPlan';
      console.log('User signed in, currentTab set to:', currentTab);
    } else {
      // Not signed in: default to Examples tab
      currentTab = 'examples'; // Always force to examples for non-authenticated
      console.log('User not signed in, currentTab forced to examples');
    }
    
    // Restore screen - always show welcomeScreen for non-signed-in users
    if (currentUser) {
      // User is signed in: restore saved screen or default to homeScreen
      const savedScreen = result.currentScreen;
      if (savedScreen && savedScreen !== 'welcomeScreen') {
        currentScreen = savedScreen;
        showScreen(savedScreen);
      } else {
        showScreen('homeScreen');
      }
    } else {
      // User is not signed in: always show welcomeScreen first
      showScreen('welcomeScreen');
    }
  });
});

// Define functions normally (not on window object)
function showScreen(screenId) {
  console.log('Showing screen:', screenId);
  
  // Save current screen state
  currentScreen = screenId;
  chrome.storage.local.set({ currentScreen: screenId });
  
  // Hide all screens
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  
  // Show target screen
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.add('active');
    console.log('Screen changed to:', screenId);
  } else {
    console.error('Screen not found:', screenId);
  }
  
  // Special handling for different screens
  if (screenId === 'homeScreen') {
    loadCurrentPlan();
    // Update tab visibility based on authentication
    updateTabVisibility();
    // Restore saved tab if available
    restoreSavedTab();
  } else if (screenId === 'chatScreen') {
    // Display conversation history when entering chat screen
    setTimeout(() => displayConversationHistory('chatMessages'), 100);
  }
}