
// Global state management
let currentUser = null;
let currentPlan = null;
let chatHistory = [];
let currentScreen = 'welcomeScreen';
let currentTab = 'currentPlan';

// Sample learning plans data
const samplePlans = {
  fullstack: {
    title: "Full-Stack Web Development",
    description: "A comprehensive program covering frontend and backend development technologies.",
    phases: [
      {
        title: "Frontend Fundamentals",
        lessons: [
          { id: "fs-1-1", title: "HTML Structure and Semantics" },
          { id: "fs-1-2", title: "CSS Styling and Layout" },
          { id: "fs-1-3", title: "JavaScript Basics and ES6" },
          { id: "fs-1-4", title: "DOM Manipulation" }
        ]
      },
      {
        title: "Frontend Frameworks",
        lessons: [
          { id: "fs-2-1", title: "React Components and JSX" },
          { id: "fs-2-2", title: "State Management with Hooks" },
          { id: "fs-2-3", title: "React Router and Navigation" },
          { id: "fs-2-4", title: "API Integration" }
        ]
      },
      {
        title: "Backend Development",
        lessons: [
          { id: "fs-3-1", title: "Node.js and Express Setup" },
          { id: "fs-3-2", title: "RESTful API Design" },
          { id: "fs-3-3", title: "Authentication and Security" },
          { id: "fs-3-4", title: "Database Integration" }
        ]
      },
      {
        title: "Full-Stack Integration",
        lessons: [
          { id: "fs-4-1", title: "Connecting Frontend to Backend" },
          { id: "fs-4-2", title: "Deployment and Hosting" },
          { id: "fs-4-3", title: "Testing and Debugging" },
          { id: "fs-4-4", title: "Final Project" }
        ]
      }
    ]
  },
  datascience: {
    title: "Data Science Fundamentals",
    description: "Learn Python, statistics, data analysis, and machine learning.",
    phases: [
      {
        title: "Python Programming",
        lessons: [
          { id: "ds-1-1", title: "Python Syntax and Data Types" },
          { id: "ds-1-2", title: "Control Flow and Functions" },
          { id: "ds-1-3", title: "Object-Oriented Programming" },
          { id: "ds-1-4", title: "File Handling and Modules" }
        ]
      },
      {
        title: "Data Analysis",
        lessons: [
          { id: "ds-2-1", title: "NumPy for Numerical Computing" },
          { id: "ds-2-2", title: "Pandas for Data Manipulation" },
          { id: "ds-2-3", title: "Data Cleaning Techniques" },
          { id: "ds-2-4", title: "Exploratory Data Analysis" }
        ]
      },
      {
        title: "Data Visualization",
        lessons: [
          { id: "ds-3-1", title: "Matplotlib Basics" },
          { id: "ds-3-2", title: "Seaborn for Statistical Plots" },
          { id: "ds-3-3", title: "Interactive Visualizations" },
          { id: "ds-3-4", title: "Dashboard Creation" }
        ]
      },
      {
        title: "Machine Learning",
        lessons: [
          { id: "ds-4-1", title: "ML Algorithms Overview" },
          { id: "ds-4-2", title: "Supervised Learning" },
          { id: "ds-4-3", title: "Unsupervised Learning" },
          { id: "ds-4-4", title: "Model Evaluation and Deployment" }
        ]
      }
    ]
  },
  mobile: {
    title: "Mobile App Development",
    description: "Build cross-platform mobile apps with React Native.",
    phases: [
      {
        title: "React Native Basics",
        lessons: [
          { id: "mb-1-1", title: "Development Environment Setup" },
          { id: "mb-1-2", title: "React Native Components" },
          { id: "mb-1-3", title: "Styling and Flexbox" },
          { id: "mb-1-4", title: "State and Props" }
        ]
      },
      {
        title: "Navigation and UX",
        lessons: [
          { id: "mb-2-1", title: "Stack Navigation" },
          { id: "mb-2-2", title: "Tab Navigation" },
          { id: "mb-2-3", title: "Drawer Navigation" },
          { id: "mb-2-4", title: "UI/UX Best Practices" }
        ]
      },
      {
        title: "Advanced Features",
        lessons: [
          { id: "mb-3-1", title: "API Integration" },
          { id: "mb-3-2", title: "Local Storage" },
          { id: "mb-3-3", title: "Push Notifications" },
          { id: "mb-3-4", title: "Camera and Media" }
        ]
      },
      {
        title: "Deployment",
        lessons: [
          { id: "mb-4-1", title: "App Store Guidelines" },
          { id: "mb-4-2", title: "Building for iOS" },
          { id: "mb-4-3", title: "Building for Android" },
          { id: "mb-4-4", title: "App Distribution" }
        ]
      }
    ]
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

function updateTabVisibility() {
  const examplesTabBtn = document.getElementById('examplesTabBtn');
  
  if (currentUser) {
    // Signed in: hide Examples tab
    if (examplesTabBtn) {
      examplesTabBtn.style.display = 'none';
    }
    // If current tab is examples, switch to My Pathways
    if (currentTab === 'examples') {
      currentTab = 'currentPlan';
    }
  } else {
    // Not signed in: show Examples tab
    if (examplesTabBtn) {
      examplesTabBtn.style.display = 'block';
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

// Make function globally available
window.renderExamplePathways = function() {
  const container = document.getElementById('examplePathwaysContainer');
  if (!container) return;
  
  const pathwaysHtml = Object.entries(samplePlans).map(([key, plan]) => `
    <div class="guest-plan-card" data-plan-key="${key}" style="border: 1px solid #e1e5e9; border-radius: 8px; padding: 20px; margin-bottom: 16px; background: white; cursor: pointer; transition: all 0.2s;">
      <div class="plan-card-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h4 style="margin: 0; color: hsl(142, 35%, 42%); font-size: 16px; font-weight: 600;">${plan.title}</h4>
        <span class="plan-duration" style="background: #f0f8f0; color: hsl(142, 35%, 42%); padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">${plan.phases.reduce((total, phase) => total + phase.lessons.length, 0)} lessons</span>
      </div>
      <p style="margin: 0 0 16px 0; color: #666; font-size: 14px; line-height: 1.4;">${plan.description}</p>
      <div class="pathway-topics" style="margin-bottom: 16px;">
        ${(() => {
          const allLessons = plan.phases.flatMap(p => p.lessons);
          return allLessons.slice(0, 3).map(lesson => 
            `<span style="display: inline-block; background: #f8f9fa; color: #666; padding: 2px 8px; border-radius: 10px; font-size: 12px; margin-right: 6px; margin-bottom: 4px;">${lesson.title}</span>`
          ).join('') + 
          (allLessons.length > 3 ? `<span style="color: #999; font-size: 12px;">+${allLessons.length - 3} more lessons...</span>` : '');
        })()}
      </div>
      <div style="color: #999; font-size: 12px; text-align: right; margin-top: 8px;">Click to explore pathway →</div>
    </div>
  `).join('');
  
  container.innerHTML = pathwaysHtml;
  
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
                <div style="font-size: 12px; color: #888;">${phase.lessons.length} lessons</div>
              </div>
            </div>
            <div class="lessons-container" data-phase-index="${phaseIndex}" style="margin-left: 52px;">
              ${phase.lessons.map((lesson, lessonIndex) => {
                const isCompleted = isLessonCompleted(lesson.id);
                return `
                <div class="lesson-item" style="display: flex; align-items: center; padding: 8px 0; cursor: pointer; border-radius: 4px; padding-left: 8px; transition: background 0.2s;" data-plan="${planKey}" data-phase="${phaseIndex}" data-lesson-index="${lessonIndex}">
                  <div class="lesson-badge" style="width: 20px; height: 20px; border-radius: 50%; background: #f0f8f0; color: hsl(142, 35%, 42%); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 500; margin-right: 10px;">
                    ${isCompleted ? '✓' : lessonIndex + 1}
                  </div>
                  <div style="flex: 1;">
                    <div class="lesson-title" style="font-weight: 500; color: #333; font-size: 14px; text-decoration: ${isCompleted ? 'line-through' : 'none'}; opacity: ${isCompleted ? '0.6' : '1'};">${lesson.title}</div>
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
        const lessonsContainer = container.querySelector(`.lessons-container[data-phase-index="${phaseIndex}"]`);
        const expandIcon = header.querySelector('.expand-icon');
        
        const isCollapsed = lessonsContainer.style.display === 'none';
        lessonsContainer.style.display = isCollapsed ? '' : 'none';
        expandIcon.textContent = isCollapsed ? '▼' : '▶';
      });
    });
    
    // Add lesson click functionality and hover effects using delegated events
    container.addEventListener('click', (e) => {
      const lessonItem = e.target.closest('.lesson-item');
      if (!lessonItem) return;
      
      const clickedPlanKey = lessonItem.getAttribute('data-plan');
      const phaseIndex = lessonItem.getAttribute('data-phase');
      const lessonIndex = lessonItem.getAttribute('data-lesson-index');
      
      const plan = samplePlans[clickedPlanKey];
      if (!plan) return;
      
      const phase = plan.phases[parseInt(phaseIndex)];
      const lesson = phase.lessons[parseInt(lessonIndex)];
      
      // Set currentPlan for the selectLesson function
      currentPlan = plan;
      
      // Toggle lesson completion
      const isCompleted = toggleLessonCompletion(lesson.id);
      
      // Update visual state
      const lessonTitle = lessonItem.querySelector('.lesson-title');
      const lessonBadge = lessonItem.querySelector('.lesson-badge');
      
      if (lessonTitle) {
        lessonTitle.style.textDecoration = isCompleted ? 'line-through' : 'none';
        lessonTitle.style.opacity = isCompleted ? '0.6' : '1';
      }
      
      if (lessonBadge) {
        lessonBadge.textContent = isCompleted ? '✓' : (parseInt(lessonIndex) + 1);
      }
      
      // Use existing selectLesson function to inject prompt into ChatGPT
      selectLesson({ title: lesson.title, timeline: '' });
    });
    
    // Add hover effects using delegated events
    container.addEventListener('mouseenter', (e) => {
      const lessonItem = e.target.closest('.lesson-item');
      if (lessonItem) {
        lessonItem.style.background = '#f8f9fa';
      }
    }, true);
    
    container.addEventListener('mouseleave', (e) => {
      const lessonItem = e.target.closest('.lesson-item');
      if (lessonItem) {
        lessonItem.style.background = 'transparent';
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
document.addEventListener('DOMContentLoaded', () => {
  console.log('Extension loaded');
  
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
  
  // Restore saved state (screen, tab, user)
  chrome.storage.local.get(['currentUser', 'currentScreen', 'currentTab'], (result) => {
    if (result.currentUser) {
      currentUser = result.currentUser;
    }
    
    // Set default tab based on authentication status
    if (currentUser) {
      // Signed in: default to My Pathways, no Examples tab
      currentTab = result.currentTab && result.currentTab !== 'examples' ? result.currentTab : 'currentPlan';
    } else {
      // Not signed in: default to Examples tab
      currentTab = result.currentTab || 'examples';
    }
    
    // Restore screen - default to homeScreen if user is logged in, otherwise welcomeScreen
    const savedScreen = result.currentScreen;
    if (savedScreen && (savedScreen !== 'welcomeScreen' || currentUser)) {
      currentScreen = savedScreen;
      showScreen(savedScreen);
    } else if (currentUser) {
      showScreen('homeScreen');
    } else {
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
  }
}