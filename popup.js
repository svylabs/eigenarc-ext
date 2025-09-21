
// Global state management
let currentUser = null;
let currentPlan = null;
let chatHistory = [];

// Sample learning plans data
const samplePlans = {
  fullstack: {
    title: "Full-Stack Web Development",
    description: "A comprehensive 12-week program covering HTML, CSS, JavaScript, React, Node.js, and databases.",
    tableOfContents: [
      { title: "HTML Fundamentals", timeline: "Week 1-2", completed: true },
      { title: "CSS Styling Basics", timeline: "Week 2-3", completed: true },
      { title: "JavaScript Introduction", timeline: "Week 3-4", completed: false },
      { title: "DOM Manipulation", timeline: "Week 4-5", completed: false },
      { title: "React Components", timeline: "Week 5-7", completed: false },
      { title: "Node.js Backend", timeline: "Week 8-10", completed: false },
      { title: "Database Integration", timeline: "Week 10-11", completed: false },
      { title: "Final Project", timeline: "Week 12", completed: false }
    ]
  },
  datascience: {
    title: "Data Science Fundamentals",
    description: "Learn Python, statistics, data analysis, and machine learning in 10 weeks.",
    tableOfContents: [
      { title: "Python Basics", timeline: "Week 1-2", completed: false },
      { title: "Pandas & Data Analysis", timeline: "Week 3-4", completed: false },
      { title: "Data Visualization", timeline: "Week 5-6", completed: false },
      { title: "Statistics & Probability", timeline: "Week 7", completed: false },
      { title: "Machine Learning Intro", timeline: "Week 8-9", completed: false },
      { title: "Final Data Project", timeline: "Week 10", completed: false }
    ]
  },
  mobile: {
    title: "Mobile App Development",
    description: "Build mobile apps with React Native in 8 weeks.",
    tableOfContents: [
      { title: "React Native Setup", timeline: "Week 1", completed: false },
      { title: "Mobile UI Components", timeline: "Week 2-3", completed: false },
      { title: "Navigation & Routing", timeline: "Week 4", completed: false },
      { title: "State Management", timeline: "Week 5-6", completed: false },
      { title: "API Integration", timeline: "Week 7", completed: false },
      { title: "App Store Deployment", timeline: "Week 8", completed: false }
    ]
  }
};

function sendChatMessage() {
  console.log('Send Chat Message called');
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
        showScreen('signinScreen');
      }, 2000);
    }, 1500);
  }, 1000);
}

function sendCreatePlanMessage() {
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
}

function addMessageToChat(sender, message, containerId) {
  const container = document.getElementById(containerId);
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;
  messageDiv.innerHTML = message;
  container.appendChild(messageDiv);
  container.scrollTop = container.scrollHeight;
}

function signInWithFirebase() {
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
    showScreen('homeScreen');
  }, 2000);
}

function switchTab(tabName, element) {
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
}

function loadSelectedPlan() {
  const dropdown = document.getElementById('planDropdown');
  const selectedPlan = dropdown.value;
  const plan = samplePlans[selectedPlan];
  
  if (!plan) return;
  
  currentPlan = plan;
  renderLessonsTable(plan.tableOfContents);
}

function constructPrompt(plan, contentItem) {
  return `Learning Plan: ${plan.title}
Description: ${plan.description}
Current Topic: ${contentItem.title}
Timeline: ${contentItem.timeline}

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

// Plan Management
function loadCurrentPlan() {
  const dropdown = document.getElementById('planDropdown');
  if (dropdown) {
    window.loadSelectedPlan();
  }
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
      alert('Please navigate to ChatGPT first to inject this lesson prompt!');
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
document.addEventListener('DOMContentLoaded', () => {
  console.log('Extension loaded');
  
  // Attach event listeners
  document.getElementById('getStartedBtn').addEventListener('click', () => {
    console.log('Get Started clicked');
    showScreen('chatScreen');
  });
  
  document.getElementById('sendChatBtn').addEventListener('click', sendChatMessage);
  document.getElementById('signinBtn').addEventListener('click', signInWithFirebase);
  document.getElementById('sendCreatePlanBtn').addEventListener('click', sendCreatePlanMessage);
  document.getElementById('planDropdown').addEventListener('change', loadSelectedPlan);
  
  // Tab switching
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const tabName = e.target.dataset.tab;
      switchTab(tabName, e.target);
    });
  });
  
  // Check if user is already logged in (from storage)
  chrome.storage.local.get(['currentUser'], (result) => {
    if (result.currentUser) {
      currentUser = result.currentUser;
      showScreen('homeScreen');
    }
  });
});

// Define functions normally (not on window object)
function showScreen(screenId) {
  console.log('Showing screen:', screenId);
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
  }
}