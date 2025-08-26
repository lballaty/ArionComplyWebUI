# ✅ scripts.js – Core Foundation File Inventory

**Purpose**: Central utility library providing shared functions across all ArionComply pages  
**Dependencies**: Used by most/all HTML pages in the application  
**Critical Functions**: Authentication, storage, notifications, chat, wizard integration

---

## 🔁 Automated Behaviors (on load or initialization)

```yaml
- DOMContentLoaded_initialization:
    triggers:
      - initializeDefaultData() → creates admin user if none exists
      - makeChatDraggable() → enables chat popup dragging
      - loadAvatarSettings() → restores saved avatar preferences
      - initializeWizardFeatures() → sets up wizard auto-save and state restoration
    event_listeners:
      - click outside → closes filter panels and modals
      - keydown Escape → closes modals and chat
      - keydown Ctrl+S → saves wizard progress (if in wizard)
      - keydown Ctrl+/ → toggles chat popup
      - window resize → repositions chat popup within viewport
      - visibilitychange → auto-saves wizard when tab hidden
      - beforeunload → saves wizard progress and warns of unsaved changes

- wizard_auto_save:
    interval: 30 seconds
    condition: if window.selectedFramework exists AND questions visible
    action: calls saveAllAnswers()

- filter_state_restoration:
    trigger: page load
    action: restores saved filter panel states from localStorage
```

---

## 🧑‍💻 User-Triggered Actions

### 💬 Chat System Functions

```yaml
- toggleChat():
    trigger: onclick from various chat buttons
    behavior:
      - toggles #chatPopup .active class
      - calls updateChatContextFromWizard() when opening
      - focuses chat input field
      - logs open/close events

- updateChatContextFromWizard():
    purpose: provides context-aware AI assistance during assessments
    dependencies: window.selectedFramework, window.currentStep
    integrates_with: COMPLIANCE_FRAMEWORKS config

- makeChatDraggable():
    enables: drag-and-drop repositioning of chat popup
    features: boundary checking, position saving to localStorage
    handles: mouse and touch events
```

### 🤖 Avatar & Voice Functions

```yaml
- toggleAvatarMode():
    trigger: onclick from avatar toggle buttons
    behavior:
      - toggles 'avatar-mode' class on document.body
      - announces current wizard state via voice if enabled
      - shows notification of mode change

- openAvatarModal() / closeAvatarModal():
    trigger: onclick from avatar config buttons
    manages: #avatarModal display and .active state

- saveAvatarSettings():
    trigger: form submission in avatar modal
    fields:
      - avatar selection (radio buttons)
      - tone setting (#avatarTone)
      - speed setting (#avatarSpeed)
    storage: localStorage['avatarSettings']
    applies: settings immediately via applyAvatarSettings()
```

### 📊 Wizard Integration Functions

```yaml
- saveAllAnswers():
    trigger:
      - onclick from save buttons
      - auto-save timer (30s intervals)
      - Ctrl+S keyboard shortcut
      - page visibility change
      - beforeunload event
    behavior:
      - calls window.saveQuestionAnswers() if available
      - falls back to saveBasicWizardAnswers()
      - saves to localStorage['compliance_assessment_complete']
      - includes session metadata (framework, step, progress)

- restoreSavedWizardState():
    trigger: page load (if on wizard page)
    sources:
      - localStorage['compliance_assessment_complete'] (complete session)
      - localStorage['ai_risk_assessment_draft'] (basic fallback)
    restores:
      - framework selection
      - current step
      - form field values (text inputs, radio buttons, ratings)

- updateProgress():
    purpose: updates wizard progress indicators and percentage display
    targets:
      -  #confidenceFill (progress bar width)
      -  #confidenceText (percentage display)
    calculates: progress based on current step and completion rate
```

### ⚠️ Risk Management Functions

```yaml
- showRiskDetails(riskId):
    trigger: onclick from risk heat map cells or list items
    risk_data:
      - "R-001": AI Hiring Discrimination
      - "R-002": Cloud Infrastructure Security
      - "R-003": GDPR Data Processing Violation
    behavior:
      - creates risk details modal
      - provides assessment link for each risk
      - calls openInfoModal() or falls back to alert()
```

### 🔽 UI Interaction Functions

```yaml
- toggleFilter(filterId):
    trigger: onclick from filter toggle buttons
    behavior:
      - closes other active filter panels
      - toggles target panel .active class
      - saves state to localStorage['filterStates']

- showNotification(message, type, duration, options):
    trigger: called by other functions for user feedback
    types: success, warning, error, info
    features:
      - animated slide-in from right
      - auto-dismiss after duration
      - dismissible with close button
      - sound effects for important notifications
      - adds to notification history

- openInfoModal(title, content, options) / closeInfoModal():
    trigger: various functions for displaying information
    features:
      - body scroll lock when open
      - focus management for accessibility
      - size options (large, etc.)
      - escape key dismissal
```

---

## 🗂️ Storage Operations

### 👤 User & Authentication

```yaml
- Core Functions:
    - generateId(prefix): creates incremental IDs like "U-001", "C-003"
    - getUserByEmail(email): lookup user by email address
    - getUserById(id): lookup user by unique ID
    - saveUser(user): add/update user in localStorage['arioncomply_users']
    - getCurrentUser(): get current logged-in user with full data
    - isUserLoggedIn(): check session validity
    - logout(): clear session and redirect to index.html

- Company Management:
    - getCompanyById(id): lookup company record
    - saveCompany(company): add/update in localStorage['arioncomply_companies']
    - deleteUser(id) / deleteCompany(id): remove records

- Demo Mode:
    - isDemoMode(): check localStorage['arioncomply_demo_mode']
    - createDemoSampleData(): creates sample assessments and notifications
    - initializeDefaultData(): creates default admin user if none exists
```

### 💾 Core Storage Utilities

```yaml
- getStoredData(key):
    purpose: safely retrieve and parse JSON from localStorage
    fallback: returns empty array [] if key missing or parse fails

- saveStoredData(key, data):
    purpose: safely stringify and store data to localStorage
    error_handling: logs failures but doesn't crash application

- Key Storage Keys:
    - 'arioncomply_users': array of user objects
    - 'arioncomply_companies': array of company objects
    - 'arioncomply_session': 'active' when logged in
    - 'arioncomply_user': current user session data
    - 'arioncomply_demo_mode': 'true' for demo sessions
    - 'avatarSettings': avatar configuration object
    - 'chatPopupPosition': saved chat window position
    - 'filterStates': saved filter panel states
    - 'notificationHistory': array of past notifications
    - 'compliance_assessment_complete': complete wizard session data
    - 'ai_risk_assessment_draft': basic wizard progress backup
```

---

## 🔗 Cross-Page Dependencies

### 📤 Functions Exported to Window Object

```yaml
# Chat Functions
- window.toggleChat
- window.updateChatContext
- window.makeChatDraggable

# Avatar Functions
- window.toggleAvatarMode
- window.openAvatarModal
- window.closeAvatarModal
- window.saveAvatarSettings
- window.loadAvatarSettings

# Wizard Functions
- window.saveAllAnswers ⭐ CRITICAL
- window.updateProgress ⭐ CRITICAL
- window.restoreSavedWizardState

# UI Functions
- window.showNotification ⭐ CRITICAL
- window.openInfoModal
- window.closeInfoModal
- window.showRiskDetails
- window.toggleFilter
- window.updateBreadcrumb

# Storage Functions ⭐ CRITICAL FOUNDATION
- window.getStoredData
- window.saveStoredData
- window.generateId
- window.getUserByEmail
- window.saveUser
- window.getCurrentUser
- window.isUserLoggedIn
- window.logout

# Validation Functions
- window.validateForm
- window.validateEmail
- window.validateAuthForm
```

### 🔄 Integration Points

```yaml
- Wizard System:
    depends_on:
      - window.selectedFramework (from wizard-engine.js)
      - window.currentStep (from wizard-engine.js)
      - window.COMPLIANCE_FRAMEWORKS (from navigation-config.js)
      - window.saveQuestionAnswers() (from questionLoader.js)

- Layout System:
    calls: LayoutManager.initializePage() if available
    fallback: basic initialization if LayoutManager not loaded

- Voice System:
    integrates_with: voice-guidance.js functions like speakText()
```

---

## 🧪 Critical Functions for Testing

### 🎯 High Priority (Core Functionality)

```yaml
1. User Authentication Flow:
  - saveUser() + getUserByEmail() + isUserLoggedIn()
  - localStorage session management

2. Storage Operations:
  - getStoredData() + saveStoredData()
  - Data persistence across page refreshes

3. Wizard State Management:
  - saveAllAnswers() + restoreSavedWizardState()
  - Progress calculation and auto-save

4. Notification System:
  - showNotification() display and dismissal
  - Notification history and count tracking
```

### ⚠️ Integration Dependencies

```yaml
- Must test WITH wizard-engine.js loaded (for wizard functions)
- Must test WITH navigation-config.js loaded (for framework configs)
- Must test localStorage availability and error handling
- Must test keyboard shortcuts (Ctrl+S, Escape, Ctrl+/)
- Must test responsive behavior (window resize, visibility change)
```

---

## 🏷️ Form Validation Functions

### 📝 Validation Utilities

```yaml
- validateForm(formId):
    purpose: validates all required fields in a form
    provides: visual feedback (red borders, error messages)
    returns: boolean success status

- validateEmail(email): regex validation for email format
- validatePassword(password): minimum 6 character requirement
- validateAuthForm(type):
    types: 'login' or 'register'
    handles: email validation, password strength, terms agreement
    displays: error notifications for failed validation
```

---

## 📋 Status: **FOUNDATION FILE**

✅ **Critical**: Required by most other pages  
⚠️ **Dependencies**: Works with wizard-engine.js, navigation-config.js, questionLoader.js  
🔄 **Testing Priority**: HIGH - Core functionality that can break entire app

---
