# ✅ wizzard.html – Complete Wizard Interface Inventory

**Purpose**: Sophisticated dual-interface system for compliance framework selection and step-by-step assessment  
**Type**: Complex interactive web application with embedded business logic  
**Architecture**: Dual-screen interface (selection → wizard) with comprehensive state management  
**Dependencies**: ALL foundation files + external APIs and embedded systems

---

## 🎭 Dual Interface Architecture

### 🎯 Interface 1: Framework Selection Screen

```yaml
purpose: Professional framework selection with card-based UI
display: Full-screen gradient interface with centered content
features:
  - 6 framework cards (EU AI Act, ISO 27001, ISO 42001, GDPR, ISO 27701, Cloud Security)
  - Gradient text effects and hover animations
  - Real-time statistics (question counts, estimated time, steps)
  - Professional gradient background with card shadows
  - Responsive grid layout (auto-fit, minmax 350px)
  - Smooth selection feedback with visual state changes

transition_to_wizard:
  trigger: "Start Assessment" button click
  process: startAssessment() → hide selection screen → show wizard interface
  includes: loading states, question data loading, wizard initialization
```

### 🧙 Interface 2: Wizard Assessment Interface

```yaml
purpose: Step-by-step compliance assessment with progress tracking
display: Multi-section layout with header, progress, questions, footer
features:
  - Enhanced progress indicator (visual step tracking with animations)
  - Dynamic question loading based on framework and step
  - Real-time progress percentage calculation
  - Answer persistence and auto-save functionality
  - Navigation controls (previous/next with validation)
  - Embedded AI chat integration
  - Responsive design with mobile breakpoints
```

---

## 🔁 Automated Behaviors (on load and state changes)

### 📊 Initialization Sequence

```yaml
- DOMContentLoaded_initialization:
    process:
      1. LayoutManager.initializePage('wizzard.html') → applies full-app layout
      2. loadQuestionData() → fetch onboarding_questions.json
      3. initializeWizardEngine() → setup wizard engine with question data
      4. initializeFrameworkSelection() → setup framework cards with real statistics
      5. checkForExistingSession() → look for saved progress
      6. initializeChatIntegration() → setup AI chat context
      7. setupKeyboardShortcuts() → enable navigation shortcuts
      8. setupAutoSave() → 30-second auto-save interval

- framework_statistics_update:
    trigger: after question data loading
    action: updateFrameworkStatistics() → updates cards with actual question counts
    data_source: FRAMEWORK_CONFIGS from navigation-config.js + question data
```

### 🎨 Visual Animation System

```yaml
- entrance_animations:
    framework_selection: slideInUp 0.8s ease-out on .framework-selector
    wizard_container: fadeIn 0.6s ease-out when .active class added
    questions: slideInLeft 0.5s ease-out, staggered 100ms per question

- hover_animations:
    framework_cards: translateY(-5px) + shadow + accent border reveal
    buttons: translateY(-2px) + enhanced shadows
    questions: translateY(-2px) + blue border + shadow

- progress_animations:
    active_step: pulse animation with 2s infinite cycle
    step_indicators: scale(1.1) for completed, scale(1.15) for active
    connecting_lines: gradient color changes for completion states
```

### 💾 Auto-Save & Persistence System

```yaml
- auto_save_triggers:
    interval: every 30 seconds (setupAutoSave)
    user_input: onchange events on question inputs
    navigation: before step changes via nextStep/previousStep
    visibility: when user switches tabs or minimizes window

- storage_keys:
    "compliance_assessment_draft": current progress with answers
    "assessment_session": session metadata and timing
    "wizard_progress": wizard engine state
    "wizard_progress_{frameworkId}": framework-specific progress
```

---

## 🧑‍💻 User-Triggered Actions

### 🎯 Framework Selection Actions

```yaml
- selectFramework(frameworkId):
    trigger: onclick on .framework-card elements
    visual_feedback:
      - removes .selected from all cards
      - adds .selected to clicked card
      - scrolls selected card into view
      - enables continue button with framework-specific text
    state_updates:
      - selectedFramework = frameworkId
      - frameworkConfig = FRAMEWORK_CONFIGS[frameworkId]
      - updateChatContext(frameworkConfig.chatContext)
      - shows success notification

- startAssessment():
    trigger: onclick on "Start Assessment" button (enabled after framework selection)
    process: 1. validates framework selection
      2. creates new assessmentSession with sessionId
      3. shows loading state with "Preparing your assessment..."
      4. calls loadFrameworkQuestions(selectedFramework)
      5. hides framework selection screen
      6. shows wizard interface with .active class
      7. calls initializeWizard() to setup first step
      8. announces start via voice guidance
```

### 🚶 Wizard Navigation Actions

```yaml
- nextStep():
    trigger: onclick on "Continue" button (becomes "Complete Assessment" on final step)
    validation: calls validateCurrentStep() before advancing
    behavior:
      - if not final step: increment currentStep, load next questions
      - if final step: calls completeAssessment()
      - updates progress indicators and navigation buttons
      - sends progress message to AI chat
      - auto-saves progress via saveAssessmentProgress()

- previousStep():
    trigger: onclick on "Previous" button (hidden on step 1)
    behavior:
      - decrement currentStep (minimum 1)
      - loads previous step questions
      - updates all UI elements and progress
      - sends navigation message to AI chat

- saveDraft():
    trigger: onclick on "Save Progress" button
    behavior:
      - calls saveAllAnswers() from scripts.js
      - updates localStorage with current state
      - shows success notification
      - updates lastSaved timestamp
```

### 📝 Question Interaction Actions

```yaml
- question_input_handlers:
    onchange: saveAnswer(questionId, value) → immediate answer persistence
    oninput: updateProgress() → real-time progress calculation
    validation: handled by questionLoader.js validation system

- answer_restoration:
    trigger: step navigation or page reload
    process: restoreStepAnswers(stepNumber) → fills inputs from localStorage
    scope: step-specific answer restoration from saved data
```

### ⌨️ Keyboard Shortcuts

```yaml
- Ctrl+Right: nextStep() (when not in input fields)
- Ctrl+Left: previousStep() (when not in input fields)
- Ctrl+S: saveDraft() (global save shortcut)
- Escape: handled by scripts.js (close modals, chat)
```

---

## 🏗️ CSS Architecture & Responsive Design

### 🎨 Professional Design System

```yaml
color_scheme:
  - Primary Blue: var(--primary-blue, #3b82f6)
  - AI Purple: var(--ai-purple, #8b5cf6)
  - Success Green: var(--success-green, #10b981)
  - Gradient Backgrounds: linear-gradient(135deg, blue → purple)
  - Text Hierarchy: --text-dark, --text-gray for readability

visual_effects:
  - Professional shadows: 0 20px 60px rgba(0,0,0,0.15)
  - Gradient text: background-clip: text for titles
  - Smooth transitions: all 0.3s ease on interactive elements
  - Accent borders: 4px gradient lines on cards and containers
  - Loading spinners: rotating border animation
```

### 📱 Responsive Breakpoint System

```yaml
desktop (>1024px):
  - Full layout with all visual effects
  - Multi-column framework grid
  - Complete progress indicator layout
  - Full spacing and padding

tablet (≤1024px):
  - Reduced padding and spacing
  - Smaller title fonts
  - Adjusted framework grid (300px minimum)
  - Maintains full functionality

mobile (≤768px):
  - Single column layout for frameworks
  - Vertical stacked progress indicators
  - Reduced question padding
  - Touch-optimized button sizes
  - Hidden connecting lines in progress

small_mobile (≤480px):
  - Minimal padding throughout
  - Full-width buttons
  - Compact framework cards
  - Essential functionality only
```

### 🎯 Component-Based CSS Architecture

```yaml
framework_selection_styles:
  - .framework-selection: full-screen container with gradient
  - .framework-selector: central card with shadow and animation
  - .framework-card: individual framework cards with hover effects
  - .frameworks-grid: responsive grid layout system

wizard_interface_styles:
  - .wizard-container: main container with fade-in animation
  - .wizard-progress: enhanced progress bar with step indicators
  - .wizard-content: main content area with header/body/footer
  - .question-group: individual question containers with animations

input_system_styles:
  - .question-input: standardized input styling with focus states
  - .radio-group/.rating-scale: specialized input type layouts
  - .validation-feedback: dynamic validation message styling
  - .loading-state: loading spinner and message containers
```

---

## 📊 Question Management System

### 🔄 Dynamic Question Loading

```yaml
- loadStepQuestions(stepNumber):
    process: 1. calls getQuestionsForStep(stepNumber) from wizard-engine.js
      2. calls renderQuestions(questions) to create DOM elements
      3. calls restoreStepAnswers(stepNumber) to restore saved data
      4. updates progress and UI elements

    question_rendering:
      - creates .question-group containers with animations
      - generates unique questionIds: step{N}_q{index}
      - determines input type: textarea, radio, rating based on content
      - attaches event handlers for saving and validation
      - applies entrance animations with stagger timing

- question_types_supported:
    textarea: multi-line text input (default)
    radio: yes/no/partial options for boolean questions
    rating: 1-5 scale for rating-based questions
    text: single-line input for short answers
    determined by: question text analysis in questionLoader.js
```

### 💾 Answer Persistence Architecture

```yaml
- saveAnswer(questionId, value):
    immediate_storage: userAnswers[questionId] = value
    localStorage_backup: updates 'compliance_assessment_draft'
    progress_update: triggers updateProgressDisplay()
    integration: works with wizard engine and questionLoader systems

- answer_restoration_system:
    framework_specific: saved answers filtered by framework
    step_specific: restores only relevant step answers
    input_population: fills form fields with saved values
    validation_state: maintains validation feedback state
```

---

## 🎮 Core JavaScript Architecture

### 🌐 Global State Management

```yaml
critical_variables:
  - selectedFramework: currently selected compliance framework
  - currentStep: current step number (1-based)
  - totalSteps: total steps for selected framework
  - frameworkConfig: configuration object for selected framework
  - userAnswers: object storing all user responses
  - assessmentSession: session metadata and tracking

state_synchronization:
  - wizard engine state via getWizardEngine()
  - localStorage persistence for recovery
  - progress tracking across all components
  - chat context updates for AI integration
```

### 🔧 50+ JavaScript Functions

```yaml
framework_selection:
  - selectFramework(frameworkId): handle framework card selection
  - updateFrameworkSelection(selectedId): visual state management
  - startAssessment(): transition to wizard interface
  - loadFrameworkQuestions(frameworkId): question data loading

wizard_navigation:
  - nextStep(): advance through assessment steps
  - previousStep(): return to previous step
  - showStep(step): display specific step
  - validateCurrentStep(): validation before progression

question_management:
  - loadStepQuestions(stepNumber): load questions for step
  - renderQuestions(questions): create question DOM elements
  - createQuestionElement(question, number): individual question rendering
  - createQuestionInput(question, id): input field generation

progress_tracking:
  - updateProgressDisplay(): progress percentage calculation
  - updateStepDisplay(): visual progress indicator updates
  - generateProgressIndicators(): create step progress UI
  - getCurrentStepCompletion(): calculate step completion

answer_management:
  - saveAnswer(questionId, value): save individual answers
  - restoreStepAnswers(stepNumber): restore saved answers
  - saveDraft(): save all current progress
  - saveAssessmentProgress(): session state persistence

ui_management:
  - updateWizardHeader(): step title and description updates
  - updateNavigationButtons(): button state and text management
  - showLoading(message): loading state display
  - hideLoading(): loading state removal

initialization:
  - initializeWizard(): setup wizard interface
  - initializeFrameworkSelection(): setup selection screen
  - loadQuestionData(): fetch and process question data
  - checkForExistingSession(): look for saved progress

utility_functions:
  - generateSessionId(): unique session identifier creation
  - generateQuestionId(question, number): question ID generation
  - showError(message): error display to user
  - calculateAssessmentResults(): completion metrics calculation
```

---

## 🔗 Critical Integration Dependencies

### 📥 Required Foundation Files

```yaml
essential_dependencies:
  - navigation-config.js: COMPLIANCE_FRAMEWORKS, LAYOUT_TYPES
  - layout-manager.js: LayoutManager.initializePage()
  - scripts.js: saveAllAnswers(), showNotification(), error handling
  - wizard-engine.js: getWizardEngine(), framework management
  - questionLoader.js: question rendering and validation system
  - onboarding_questions.json: actual question content (326 questions)

optional_integrations:
  - sidebar-component.js: sidebar rendering for full-app layout
  - chatLogic.js: AI chat functionality and context management
  - voice-guidance.js: voice announcements and guidance
  - seedData.js: demo data for development
```

### 🎯 Framework Data Flow

```yaml
1. Framework Selection: navigation-config.js → framework configs → wizzard.html cards

2. Question Loading: onboarding_questions.json → wizard-engine.js → questionLoader.js → wizzard.html display

3. Answer Management: wizzard.html input → saveAnswer() → localStorage → scripts.js integration

4. Progress Tracking: wizard-engine.js calculations → wizzard.html progress display → UI updates
```

### 📤 Global Function Exports

```yaml
onclick_handlers: # Required for HTML onclick attributes
  - window.selectFramework: framework card selection
  - window.startAssessment: assessment initiation
  - window.nextStep: step navigation forward
  - window.previousStep: step navigation backward
  - window.saveDraft: progress saving

utility_exports:
  - window.saveAnswer: answer persistence
  - window.updateProgress: progress updates
  - window.loadFrameworkQuestions: question loading
  - window.getFrameworkSteps: step information
  - window.getQuestionsForStep: step-specific questions
```

---

## 💬 AI Chat Integration System

### 🤖 Embedded Chat Interface

```yaml
chat_implementation:
  - iframe: chatInterface.html?context=Compliance%20Assessment&embed=1
  - trigger: floating .chat-trigger button with robot icon
  - container: .chat-popup with draggable functionality
  - context_awareness: updates based on framework and step

chat_integration_points:
  - framework_selection: announces framework choice and capabilities
  - step_navigation: provides step context and guidance
  - progress_updates: celebrates progress and offers assistance
  - completion: congratulates and summarizes results

chat_context_management:
  - updateChatContext(frameworkConfig.chatContext)
  - notifyChatFrameworkSelection(config)
  - addChatMessage() calls for progress updates
  - integration with scripts.js chat functions
```

---

## 🧪 Critical Testing Scenarios

### 🎯 High Priority Test Cases

```yaml
1. Complete User Journey:
  - Framework selection → assessment start → step navigation → completion
  - Answer persistence across page reloads
  - Progress calculation accuracy throughout assessment
  - AI chat integration and context updates

2. Framework Integration:
  - All 6 frameworks load correctly with proper question counts
  - Framework switching and state management
  - Question loading for each framework's steps
  - Progress indicators match framework step counts

3. Responsive Design:
  - Mobile functionality (768px, 480px breakpoints)
  - Touch interactions on mobile devices
  - Responsive layout adaptations
  - Button and input accessibility on small screens

4. Error Handling:
  - Network failures during question loading
  - Corrupted localStorage data recovery
  - Missing dependency graceful degradation
  - Invalid user input handling

5. Performance:
  - Large question sets (GDPR: 89 questions)
  - Animation performance on lower-end devices
  - Memory usage with extended sessions
  - Auto-save performance impact
```

### ⚠️ Integration Dependencies to Test

```yaml
critical_dependencies:
  - Must test WITH all foundation files loaded (7 dependencies)
  - Must test WITH onboarding_questions.json available
  - Must test localStorage functionality and quotas
  - Must test iframe embedding for chat interface
  - Must test responsive breakpoints and touch events

edge_cases:
  - Multiple browser tabs with same assessment
  - Browser back/forward button behavior
  - Page refresh during assessment
  - Network connectivity loss and recovery
  - Concurrent user sessions
```

### 🔍 Framework-Specific Tests

```yaml
per_framework_validation:
  eu_ai_act: 42 questions, 10 steps, sequential progression (no skipping)
  iso_27001: 78 questions, 14 steps, allows step skipping
  iso_42001: 36 questions, 10 steps, sequential progression
  gdpr: 89 questions, 8 steps, allows step skipping
  iso_27701: 52 questions, 13 steps, allows step skipping
  cloud_security: 29 questions, 7 steps, allows step skipping

framework_features:
  - Question loading and rendering per framework
  - Step navigation rules (sequential vs skippable)
  - Progress calculation accuracy
  - Framework-specific chat contexts
  - Answer persistence and restoration
```

---

## 📋 Status: **COMPLETE WIZARD SYSTEM**

✅ **Sophisticated**: Dual-interface system with professional design  
⭐ **Enterprise-Grade**: Production-ready with comprehensive error handling  
🔄 **Testing Priority**: CRITICAL - Core user-facing assessment interface  
🏗️ **Architecture**: Complex integration of all foundation components  
📱 **Responsive**: Complete mobile-first responsive design  
🎨 **Professional**: Gradient animations, smooth transitions, modern UI  
💾 **Persistent**: Comprehensive auto-save and session management  
🤖 **AI-Integrated**: Embedded chat with contextual guidance

---
