# Compliance Wizard Screen Workflow

## Screen: `wizzard.html`

### Overview
The Compliance Wizard provides a sophisticated dual-interface system for compliance framework selection and step-by-step assessment. It's designed to be framework-agnostic, supporting multiple compliance standards, regulations, and laws through a configurable architecture. The screen consists of two main interfaces: a framework selection screen and an assessment wizard interface.

### User-Triggered Actions

#### 1. Framework Selection Interface

- **Action**: Select compliance framework
  - **Trigger**: Click on framework card
  - **Result**: Highlights selected framework and enables Start Assessment button
  - **Process**:
    - Calls `selectFramework(frameworkId)`
    - Updates UI to highlight selected framework
    - Enables Start Assessment button
  - **State Changes**:
    - Sets selected framework in memory
    - Updates UI to reflect selection

- **Action**: Start assessment
  - **Trigger**: Click "Start Assessment" button
  - **Result**: Transitions from framework selection to assessment wizard interface
  - **Process**:
    - Calls `startAssessment()`
    - Hides framework selection screen
    - Shows wizard interface
    - Initializes assessment with selected framework
    - Loads questions for first step
  - **State Changes**:
    - Transitions interface
    - Initializes assessment state
    - Sets up step navigation and progress tracking

#### 2. Assessment Wizard Interface

- **Action**: Navigate to next step
  - **Trigger**: Click "Next" or "Continue" button
  - **Result**: Advances to next step in assessment
  - **Process**:
    - Validates current step answers if required
    - Calls `nextStep()`
    - Saves current step answers
    - Loads questions for next step
    - Updates progress indicators
  - **State Changes**:
    - Increments current step
    - Updates progress percentage
    - Saves answers to localStorage
    - Updates UI with new step content

- **Action**: Navigate to previous step
  - **Trigger**: Click "Previous" or "Back" button
  - **Result**: Returns to previous step in assessment
  - **Process**:
    - Calls `previousStep()`
    - Saves current step answers
    - Loads questions for previous step
    - Updates progress indicators
  - **State Changes**:
    - Decrements current step
    - Updates progress percentage
    - Saves answers to localStorage
    - Updates UI with previous step content

- **Action**: Answer question
  - **Trigger**: Input changes on question fields (various input types)
  - **Result**: Records answer for the question
  - **Process**:
    - Calls `saveAnswer(questionId, value)`
    - Updates answer in memory
    - Autosaves to localStorage
    - Updates progress calculation
  - **State Changes**:
    - Stores answer in memory
    - Persists to localStorage
    - Updates progress percentage

- **Action**: Save assessment draft
  - **Trigger**: Click "Save Draft" button
  - **Result**: Manually saves current assessment progress
  - **Process**:
    - Calls `saveDraft()`
    - Stores all current answers and state to localStorage
    - Shows confirmation notification
  - **State Changes**:
    - Persists complete assessment state to localStorage

- **Action**: Complete assessment
  - **Trigger**: Click "Complete" button on final step
  - **Result**: Finalizes assessment and shows results/next steps
  - **Process**:
    - Validates final step answers
    - Calls `completeAssessment()`
    - Calculates assessment results
    - Shows completion screen or redirects to results
  - **State Changes**:
    - Marks assessment as complete in localStorage
    - Updates progress to 100%
    - May transition to results screen

- **Action**: Open AI chat assistance
  - **Trigger**: Click chat trigger button
  - **Result**: Opens context-aware AI chat interface
  - **Process**:
    - Toggles chat popup visibility
    - Updates chat context with current framework and step information
  - **State Changes**:
    - Shows/hides chat interface
    - Sets context parameters for chat

### System-Triggered Actions

#### 1. Page Initialization
- **Trigger**: DOMContentLoaded event
- **Process**:
  - Initializes layout: `LayoutManager.initializePage('wizzard.html')`
  - Initializes framework selection screen: `initializeFrameworkSelection()`
  - Loads framework configurations from navigation-config.js
  - Checks for existing assessment session: `checkForExistingSession()`
  - Sets up wizard engine: `init