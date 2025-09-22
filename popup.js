
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
        }, 10000);
        
        document.addEventListener('firebaseReady', () => {
          clearTimeout(timeout);
          resolve();
        }, { once: true });
        
        // Check if already loaded
        if (window.firebaseReady) {
          clearTimeout(timeout);
          resolve();
        }
      });
    }
    
    const result = await window.firebaseAuth.signInWithGoogle();
    
    if (result.success) {
      // Store user data
      currentUser = result.user;
      
      // Save user to storage for persistence
      chrome.storage.local.set({ currentUser });
      
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
  } else if (tabName === 'examples') {
    document.getElementById('examplesTab').classList.remove('hidden');
    renderExamplePathways();
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

function updateMyPathwaysView() {
  const signinView = document.getElementById('pathwaysSignin');
  const emptyView = document.getElementById('pathwaysEmpty');
  
  if (currentUser) {
    // User is signed in - show empty pathways message
    if (signinView) signinView.style.display = 'none';
    if (emptyView) emptyView.style.display = 'block';
  } else {
    // User not signed in - show signin prompt
    if (signinView) signinView.style.display = 'block';
    if (emptyView) emptyView.style.display = 'none';
  }
}

// Make function globally available
window.renderExamplePathways = function() {
  const container = document.getElementById('examplePathwaysContainer');
  if (!container) return;
  
  const pathwaysHtml = Object.entries(samplePlans).map(([key, plan]) => `
    <div class="guest-plan-card" data-plan="${key}" style="border: 1px solid #e1e5e9; border-radius: 8px; padding: 20px; margin-bottom: 16px; background: white;">
      <div class="plan-card-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h4 style="margin: 0; color: hsl(142, 35%, 42%); font-size: 16px; font-weight: 600;">${plan.title}</h4>
        <span class="plan-duration" style="background: #f0f8f0; color: hsl(142, 35%, 42%); padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">${plan.tableOfContents.length} lessons</span>
      </div>
      <p style="margin: 0 0 16px 0; color: #666; font-size: 14px; line-height: 1.4;">${plan.description}</p>
      <div class="pathway-topics" style="margin-bottom: 16px;">
        ${plan.tableOfContents.slice(0, 3).map(item => 
          `<span style="display: inline-block; background: #f8f9fa; color: #666; padding: 2px 8px; border-radius: 10px; font-size: 12px; margin-right: 6px; margin-bottom: 4px;">${item.title}</span>`
        ).join('')}
        ${plan.tableOfContents.length > 3 ? '<span style="color: #999; font-size: 12px;">+' + (plan.tableOfContents.length - 3) + ' more...</span>' : ''}
      </div>
      <button class="guest-plan-btn" onclick="showPathwayDetails('${key}')" style="background: transparent; color: hsl(142, 35%, 42%); border: 1px solid hsl(142, 35%, 42%); padding: 8px 16px; border-radius: 16px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s;">
        View Full Pathway
      </button>
    </div>
  `).join('');
  
  container.innerHTML = pathwaysHtml;
}

// Make function globally available for onclick handlers
window.showPathwayDetails = function(planKey) {
  const plan = samplePlans[planKey];
  if (!plan) return;
  
  const detailsHtml = `
    <div style="padding: 20px; background: white; border-radius: 8px; border: 1px solid #e1e5e9;">
      <h3 style="color: hsl(142, 35%, 42%); margin-bottom: 16px;">${plan.title}</h3>
      <p style="color: #666; margin-bottom: 20px; line-height: 1.5;">${plan.description}</p>
      <div class="lessons-list">
        ${plan.tableOfContents.map((lesson, index) => `
          <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
            <div style="width: 24px; height: 24px; border-radius: 50%; background: #f0f8f0; color: hsl(142, 35%, 42%); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; margin-right: 12px;">
              ${index + 1}
            </div>
            <div style="flex: 1;">
              <div style="font-weight: 500; color: #333; margin-bottom: 2px;">${lesson.title}</div>
              <div style="font-size: 12px; color: #888;">${lesson.timeline}</div>
            </div>
          </div>
        `).join('')}
      </div>
      <button onclick="renderExamplePathways()" style="margin-top: 20px; background: transparent; color: hsl(142, 35%, 42%); border: 1px solid #ddd; padding: 8px 16px; border-radius: 16px; font-size: 13px; cursor: pointer;">
        ← Back to Examples
      </button>
    </div>
  `;
  
  const container = document.getElementById('examplePathwaysContainer');
  if (container) {
    container.innerHTML = detailsHtml;
  }
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
  document.getElementById('beginLearningBtn').addEventListener('click', () => {
    console.log('Begin Learning clicked');
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
  
  const sendCreatePlanBtn = document.getElementById('sendCreatePlanBtn');
  if (sendCreatePlanBtn) {
    sendCreatePlanBtn.addEventListener('click', sendCreatePlanMessage);
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

    const createPlanSigninBtn = document.getElementById('createPlanSigninBtn');
    if (createPlanSigninBtn) {
      createPlanSigninBtn.addEventListener('click', signInWithFirebase);
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