// Make functions globally available for onclick handlers
window.showScreen = function(screenId) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  
  // Show target screen
  document.getElementById(screenId).classList.add('active');
  
  // Special handling for different screens
  if (screenId === 'homeScreen') {
    loadCurrentPlan();
  }
};

window.sendChatMessage = function() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  
  if (!message) return;
  
  // Add user message to chat
  addMessageToChat('user', message, 'chatMessages');
  input.value = '';
  
  // Store in chat history
  chatHistory.push({ role: 'user', content: message });
  
  // Simulate AI response
  setTimeout(() => {
    const aiResponse = generatePlanResponse(message);
    addMessageToChat('ai', aiResponse, 'chatMessages');
    
    // After AI response, show plan ready message
    setTimeout(() => {
      addMessageToChat('ai', "🎉 Perfect! I've created a personalized learning plan based on your goals. Let me show you what I've prepared...", 'chatMessages');
      
      setTimeout(() => {
        window.showScreen('signinScreen');
      }, 2000);
    }, 1500);
  }, 1000);
};

window.signInWithFirebase = function() {
  const signinBtn = document.querySelector('.signin-btn');
  signinBtn.textContent = 'Signing in...';
  signinBtn.disabled = true;
  
  setTimeout(() => {
    // Simulate successful login
    currentUser = {
      email: 'user@example.com',
      name: 'Demo User'
    };
    
    // Save user to storage for persistence
    chrome.storage.local.set({ currentUser });
    
    // Navigate to home screen
    window.showScreen('homeScreen');
  }, 2000);
};

window.switchTab = function(tabName, element) {
  // Update tab buttons
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
  });
  element.classList.add('active');
  
  // Show/hide tab content
  if (tabName === 'currentPlan') {
    document.getElementById('currentPlanTab').classList.remove('hidden');
    document.getElementById('createPlanTab').classList.add('hidden');
  } else if (tabName === 'createPlan') {
    document.getElementById('currentPlanTab').classList.add('hidden');
    document.getElementById('createPlanTab').classList.remove('hidden');
  }
};

window.loadSelectedPlan = function() {
  const dropdown = document.getElementById('planDropdown');
  const selectedPlan = dropdown.value;
  const plan = samplePlans[selectedPlan];
  
  if (!plan) return;
  
  currentPlan = plan;
  renderLessonsTable(plan.lessons);
};

window.sendCreatePlanMessage = function() {
  const input = document.getElementById('createPlanInput');
  const message = input.value.trim();
  
  if (!message) return;
  
  addMessageToChat('user', message, 'createPlanMessages');
  input.value = '';
  
  setTimeout(() => {
    addMessageToChat('ai', "Great! I'll create a new learning plan for you. This might take a moment...", 'createPlanMessages');
    
    setTimeout(() => {
      addMessageToChat('ai', "✅ Your new learning plan is ready! You can now find it in your plan selector.", 'createPlanMessages');
    }, 2000);
  }, 1000);
};

// Global state management
let currentUser = null;
let currentPlan = null;
let chatHistory = [];

// Sample learning plans data
const samplePlans = {
  fullstack: {
    title: "Full-Stack Web Development",
    description: "A comprehensive 12-week program covering HTML, CSS, JavaScript, React, Node.js, and databases.",
    lessons: [
      { id: 1, title: "HTML Fundamentals", duration: "2 hours", completed: true, prompt: "I'm learning HTML fundamentals. Please explain the basic structure of an HTML document and provide examples of common HTML elements." },
      { id: 2, title: "CSS Styling Basics", duration: "2.5 hours", completed: true, prompt: "I'm learning CSS styling. Please teach me about CSS selectors, properties, and how to style HTML elements effectively." },
      { id: 3, title: "JavaScript Introduction", duration: "3 hours", completed: false, prompt: "I'm starting to learn JavaScript. Please explain variables, data types, functions, and provide beginner-friendly examples." },
      { id: 4, title: "DOM Manipulation", duration: "2 hours", completed: false, prompt: "I want to learn DOM manipulation in JavaScript. Please explain how to select elements, modify content, and handle events." },
      { id: 5, title: "React Components", duration: "3 hours", completed: false, prompt: "I'm learning React. Please explain components, props, state, and show me how to create a simple React application." },
      { id: 6, title: "Node.js Backend", duration: "3 hours", completed: false, prompt: "I want to learn Node.js for backend development. Please explain server setup, routing, and how to create APIs." }
    ]
  },
  datascience: {
    title: "Data Science Fundamentals",
    description: "Learn Python, statistics, data analysis, and machine learning in 10 weeks.",
    lessons: [
      { id: 1, title: "Python Basics", duration: "2 hours", completed: false, prompt: "I'm starting data science with Python. Please teach me Python basics including variables, lists, dictionaries, and control structures." },
      { id: 2, title: "Pandas & Data Analysis", duration: "3 hours", completed: false, prompt: "I want to learn Pandas for data analysis. Please explain DataFrames, data cleaning, and basic data manipulation techniques." },
      { id: 3, title: "Data Visualization", duration: "2.5 hours", completed: false, prompt: "I'm learning data visualization. Please teach me how to create charts and graphs using matplotlib and seaborn in Python." }
    ]
  },
  mobile: {
    title: "Mobile App Development",
    description: "Build mobile apps with React Native in 8 weeks.",
    lessons: [
      { id: 1, title: "React Native Setup", duration: "1.5 hours", completed: false, prompt: "I want to learn React Native for mobile development. Please guide me through the setup process and explain the basic concepts." },
      { id: 2, title: "Mobile UI Components", duration: "3 hours", completed: false, prompt: "I'm learning React Native UI components. Please explain Views, Text, TouchableOpacity, and how to create mobile layouts." }
    ]
  }
};

function addMessageToChat(sender, message, containerId) {
  const container = document.getElementById(containerId);
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;
  messageDiv.innerHTML = message;
  container.appendChild(messageDiv);
  container.scrollTop = container.scrollHeight;
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

// Plan Management
function loadCurrentPlan() {
  const dropdown = document.getElementById('planDropdown');
  if (dropdown) {
    window.loadSelectedPlan();
  }
}

function renderLessonsTable(lessons) {
  const tbody = document.getElementById('lessonsTableBody');
  tbody.innerHTML = '';
  
  lessons.forEach(lesson => {
    const row = document.createElement('tr');
    row.className = `lesson-row ${lesson.completed ? 'completed' : ''}`;
    row.onclick = () => selectLesson(lesson);
    
    row.innerHTML = `
      <td class="lesson-cell status-icon">
        ${lesson.completed ? '✅' : '⭕'}
      </td>
      <td class="lesson-cell">
        <div class="lesson-title">${lesson.title}</div>
        <div class="lesson-duration">${lesson.duration}</div>
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
      alert('Please navigate to ChatGPT first to inject this lesson prompt!');
      return;
    }
    
    // Send message to content script to inject the lesson prompt
    await chrome.tabs.sendMessage(tab.id, {
      action: 'injectPrompt',
      prompt: lesson.prompt
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
document.addEventListener('DOMContentLoaded', () => {
  // Check if user is already logged in (from storage)
  chrome.storage.local.get(['currentUser'], (result) => {
    if (result.currentUser) {
      currentUser = result.currentUser;
      window.showScreen('homeScreen');
    }
  });
});