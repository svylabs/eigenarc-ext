# Overview

This Chrome extension project, named "Eigenarc," provides structured learning for native AI learners through personalized learning plans. The extension integrates with ChatGPT to inject prompts and offers a comprehensive learning management interface with authentication, progress tracking, and interactive chat functionality for educational purposes.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The extension uses a traditional Chrome Extension architecture with multiple UI screens:

**Popup Interface**: The main user interface is built with vanilla HTML/CSS/JavaScript, featuring a multi-screen layout including welcome screens, authentication flows, learning plan management, and chat interfaces. The UI uses a component-based approach with reusable header components and screen management.

**Content Script Integration**: A content script (`content.js`) handles injection of prompts into ChatGPT's interface by detecting various textarea selectors and input fields across different ChatGPT website versions.

## Backend Architecture
**Chrome Extension Manifest V3**: Uses the latest Chrome extension standard with service worker background scripts, content scripts, and popup actions.

**State Management**: Implements client-side state management for user sessions, learning plans, chat history, and UI navigation using JavaScript objects and local variables.

**Authentication Flow**: Implements Google OAuth2 authentication through Chrome Identity API, with fallback Firebase REST API integration for token exchange and user management.

## Data Storage Solutions
**Chrome Storage API**: Utilizes Chrome's built-in storage for extension preferences and cached data.

**Firebase Integration**: Connects to Firebase backend services for user authentication and learning plan storage, with configuration for multiple Firebase projects (eigenarc and eigenarc-ai).

**Local State**: Maintains conversation history, current user state, and learning progress in memory during extension sessions.

## Authentication and Authorization
**Google OAuth2**: Primary authentication method using Chrome Identity API with OAuth2 client configuration for Google sign-in.

**Firebase Authentication**: Secondary authentication layer using Firebase Auth REST API for token validation and user session management.

**Offscreen Document**: Uses Chrome extension offscreen documents to handle Firebase authentication in a separate context, bypassing content security policy restrictions.

## External Dependencies
**Chrome APIs**: Extensive use of Chrome extension APIs including identity, storage, tabs, and runtime for core functionality.

**Firebase Services**: Integration with Firebase Authentication and potentially Firestore for user data and learning plan storage.

**Google APIs**: OAuth2 integration for user authentication and profile access.

**ChatGPT Integration**: Content script injection targeting OpenAI's ChatGPT interface (chat.openai.com and chatgpt.com) for prompt injection functionality.