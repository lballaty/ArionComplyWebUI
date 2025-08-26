# ✅ wizard-engine.js – Core Assessment Engine Inventory

**Purpose**: Sophisticated class-based engine managing the entire compliance assessment wizard system  
**Type**: Core business logic with class-based architecture and state management  
**Dependencies**: Requires onboarding_questions.json, integrates with navigation-config.js  
**Critical Role**: Powers the entire wizard/assessment experience with framework selection, step navigation, and progress tracking

---

## 🔁 Automated Behaviors (on initialization and state changes)

### 🏗️ Engine Initialization Process

```yaml
- WizardEngine.initialize(questionData):
    trigger: called by wizard pages after loading onboarding_questions.json
    process: 1. stores questionData reference for all frameworks
      2. calls processFrameworkConfigurations() to extract step structure
      3. generates unique sessionId and sets startTime
      4. populates ENHANCED_FRAMEWORK_CONFIGS with actual question data

    framework_processing:
      - extracts steps from questions using extractStepsFromQuestions()
      - validates question counts against navigation-config.js metadata
      - populates step titles, descriptions, and question mappings
      - logs processing results for each framework

- processFrameworkConfigurations():
    for_each_framework:
      1. gets questions array using config.jsonKey from onboarding_questions.json
      2. extracts step information and question groupings
      3. updates questionCount and stepCount with actual data
      4. populates steps array with titles and descriptions

    step_extraction_logic:
      - parses step text like "Step 1: Company Profile"
      - groups questions by step number
      - generates user-friendly step descriptions
      - creates step objects with questionCount and questionIds
```

### 📊 Auto-Save and Progress Tracking

```yaml
- saveProgress():
    triggers:
      - framework selection
      - step navigation (nextStep, previousStep, goToStep)
      - answer saving (if autoSave enabled in framework settings)
      - manual save operations

    persistence:
      - localStorage['wizard_progress']: general progress
      - localStorage['wizard_progress_{frameworkId}']: framework-specific progress
      - includes sessionId, answers, timestamps, version info

- progress_calculation:
    algorithm:
      - stepProgress: (currentStep - 1) / totalSteps
      - currentStepCompletion: answered questions / total questions in step
      - overall: (stepProgress + stepCompletion/totalSteps) * 100
      - capped at 95% until assessment complete
```

---

## 🧑‍💻 User-Triggered Actions

### 🎯 Framework Selection & Management

```yaml
- selectFramework(frameworkId):
    trigger: user selects framework from navigation or wizard interface
    process: 1. validates frameworkId exists in ENHANCED_FRAMEWORK_CONFIGS
      2. sets selectedFramework, frameworkConfig, totalSteps
      3. resets currentStep to 1 and clears userAnswers
      4. triggers onFrameworkSelected event handler
      5. updates session timestamp

    supported_frameworks:
      - eu_ai_act: EU AI Act Compliance (42 questions, 10 steps)
      - iso_27001: ISO 27001 Information Security (78 questions, 14 steps)
      - iso_42001: ISO 42001 AI Management (36 questions, 10 steps)
      - gdpr: GDPR & Privacy Compliance (89 questions, 8 steps)
      - iso_27701: ISO 27701 Privacy Management (52 questions, 13 steps)
      - cloud_security: Cloud Security ISO 27017/27018 (29 questions, 7 steps)
```

### 🚶 Step Navigation System

```yaml
- nextStep(skipValidation):
    behavior:
      - validates current step (unless skipValidation = true)
      - advances currentStep by 1 if not at end
      - calls completeAssessment() if at final step
      - auto-saves progress via saveProgress()
      - triggers onStepChanged and onProgressUpdated events

- previousStep():
    behavior:
      - decrements currentStep by 1 if not at step 1
      - triggers onStepChanged and onProgressUpdated events
      - no validation required for backward navigation

- goToStep(stepNumber, skipValidation):
    behavior:
      - validates stepNumber within range (1 to totalSteps)
      - checks framework allowStepSkipping setting
      - prevents jumping ahead if step skipping disabled
      - directly sets currentStep and triggers events

- step_validation:
    allowStepSkipping setting per framework:
      - eu_ai_act: false (sequential progression required)
      - iso_27001: true (can skip ahead)
      - iso_42001: false (sequential progression required)
      - gdpr: true (can skip ahead)
      - iso_27701: true (can skip ahead)
      - cloud_security: true (can skip ahead)
```

### 💾 Answer Management System

```yaml
- saveAnswer(questionId, value):
    process: 1. stores answer in userAnswers[questionId]
      2. updates lastSaved timestamp
      3. triggers auto-save if framework.wizardSettings.autoSave enabled
      4. calls onProgressUpdated event handler

- getAnswer(questionId):
    returns: stored answer value or null if not found

- getAllAnswers():
    returns: shallow copy of complete userAnswers object

- loadAnswers(answers):
    purpose: restores answers from saved state
    merges: provided answers into userAnswers object
```

### 🔄 Session Management & Persistence

```yaml
- loadProgress(frameworkId):
    sources:
      1. localStorage['wizard_progress_{frameworkId}'] (framework-specific)
      2. localStorage['wizard_progress'] (general progress)

    restoration_process:
      - validates framework exists in ENHANCED_FRAMEWORK_CONFIGS
      - restores sessionId, currentStep, totalSteps, userAnswers
      - restores startTime and lastSaved timestamps
      - sets frameworkConfig reference

- clearProgress(frameworkId):
    options:
      - specific framework: clears localStorage['wizard_progress_{frameworkId}']
      - all frameworks: clears general progress + all framework-specific

- generateSessionId():
    format: 'wizard_' + timestamp + '_' + random_string
    example: 'wizard_1704067200000_a1b2c3d4e'
```

---

## 🏗️ Core Engine Architecture

### 📋 ENHANCED_FRAMEWORK_CONFIGS Structure

```yaml
# Extends navigation-config.js with wizard-specific metadata
framework_object_structure:
  identification:
    - id: framework identifier
    - name: full framework name
    - shortName: abbreviated name
    - description: detailed description
    - icon: Font Awesome icon class
    - color: hex color code

  assessment_metadata:
    - estimatedTime: "30-45 minutes"
    - questionCount: actual count from question data
    - stepCount: actual count from question data
    - difficultyLevel: "Intermediate" | "Advanced"

  integration_keys:
    - jsonKey: exact key from onboarding_questions.json
    - chatContext: context string for AI chat integration
    - voiceWelcome: voice guidance welcome message

  compliance_data:
    - riskCategories: array of risk classification levels
    - complianceDate: effective compliance date
    - regulatoryBody: governing organization
    - tags: array of searchable tags

  wizard_settings:
    - showProgressPercentage: boolean
    - allowStepSkipping: boolean
    - autoSave: boolean
    - voiceGuidance: boolean
    - contextualHelp: boolean

  computed_data:
    - steps: array of step objects with titles, descriptions, questionIds
    - assessmentUrl: wizard.html?framework={id}
    - documentationUrl: help.html#{id}
```

### 🎯 Question and Step Management

```yaml
- getQuestionsForStep(stepNumber):
    process:
      1. gets framework questions using frameworkConfig.jsonKey
      2. filters questions by step label: "Step {stepNumber}:"
      3. returns array of matching question objects

- extractStepsFromQuestions(questions):
    algorithm:
      1. parses each question.step field using regex: /Step (\d+):\s*(.+)/
      2. groups questions by step number
      3. counts questions per step and stores questionIds
      4. generates user-friendly descriptions using generateStepDescription()
      5. returns sorted array of step objects

- generateQuestionId(question, index):
    strategies:
      1. step-based: "step{stepNum}_q{index}" (preferred)
      2. hash-based: "step{stepNum}_{hash}" (fallback)
    purpose: creates unique, consistent IDs for answer storage
```

### 📊 Progress Calculation Engine

```yaml
- getProgressPercentage():
    formula: stepProgress = (currentStep - 1) / totalSteps
      currentStepCompletion = answeredQuestions / questionsInCurrentStep
      overall = (stepProgress + currentStepCompletion/totalSteps) * 100
      return Math.min(95, Math.max(0, overall))

    design_notes:
      - capped at 95% until assessment complete
      - includes partial progress within current step
      - accounts for step completion in overall calculation

- getCurrentStepCompletion():
    calculation:
      - gets questions for current step
      - counts questions with non-empty answers
      - returns ratio: answeredQuestions / totalQuestionsInStep
```

---

## 🎯 Critical Integration Points

### 📥 Dependencies & Data Sources

```yaml
- onboarding_questions.json: ⭐ CRITICAL
    usage: provides all question content via jsonKey mappings
    structure: { "Framework Name": [question_objects] }
    integration: frameworkConfig.jsonKey → questions array

- navigation-config.js: ⭐ IMPORTANT
    usage: base framework configurations (duplicated in ENHANCED_FRAMEWORK_CONFIGS)
    note: wizard-engine.js could be refactored to extend rather than duplicate

- localStorage persistence:
    keys: 'wizard_progress', 'wizard_progress_{frameworkId}'
    format: JSON objects with session data, answers, timestamps
```

### 📤 Provides to Other Components

```yaml
- wizzard.html: ⭐ CRITICAL INTEGRATION
    functions: getWizardEngine(), getFrameworkSteps(), getQuestionsForStep()
    usage: wizard interface relies on these global functions

- questionLoader.js:
    integration: may use WizardEngine for question loading and answer management

- scripts.js:
    integration: scripts.js calls wizard functions for saving and state management

- voice-guidance.js & chatLogic.js:
    integration: setVoiceGuidance(), setChatIntegration() for enhanced UX
```

### 🔧 Global Function Exports

```yaml
# ⭐ CRITICAL FIX: safeWizardFunction() ensures global exports always work
guaranteed_global_functions:
  - window.getWizardEngine: gets/creates global instance
  - window.initializeWizardEngine: initializes with question data
  - window.getFrameworkSteps: returns steps for current framework
  - window.getQuestionsForStep: returns questions for specific step
  - window.WizardEngine: class constructor
  - window.ENHANCED_FRAMEWORK_CONFIGS: framework configurations

# These functions created unconditionally to prevent HTML errors
safeWizardFunction pattern:
  - wraps function creation in try/catch
  - ensures functions exist even if errors occur during loading
  - prevents "function not defined" errors in wizzard.html onclick handlers
```

---

## 🔄 Event Handler System

### 📡 Event Handler Registration

```yaml
wizard_engine_events:
  - onFrameworkSelected: called when framework is selected
  - onStepChanged: called when step navigation occurs
  - onProgressUpdated: called when progress percentage changes
  - onAssessmentComplete: called when assessment finishes

usage_pattern: const engine = getWizardEngine();
  engine.onStepChanged = function(stepNumber, stepInfo) {
  // Update UI with new step information
  };
```

### 🎤 Integration System Setup

```yaml
- setVoiceGuidance(voiceGuidance):
    purpose: integrates with voice guidance system
    features: triggerVoiceGuidance() announces current step

- setChatIntegration(chatIntegration):
    purpose: integrates with AI chat system
    features: updateChatContext() provides wizard state to chat

- integration_methods:
    - triggerVoiceGuidance(): announces current step via voice
    - updateChatContext(): updates chat with current wizard state
```

---

## 🎯 Assessment Completion & Results

### 🏁 Assessment Completion Process

```yaml
- completeAssessment():
    trigger: when nextStep() is called from final step
    process: 1. calls calculateResults() to generate assessment summary
      2. triggers onAssessmentComplete event handler
      3. logs completion to console

- calculateResults():
    generates:
      - framework: framework name and ID
      - sessionId: unique session identifier
      - startTime & endTime: assessment duration
      - totalSteps & totalQuestions: assessment scope
      - answeredQuestions & completionPercentage: completion metrics
      - answers: complete userAnswers object
      - recommendations: generated recommendations array

- generateRecommendations():
    current_implementation: basic placeholder recommendations
    future_enhancement: could analyze answers for specific recommendations
    returns: array of recommendation objects with type, priority, title, description
```

---

## 🛠️ Utility Functions & State Management

### 🔧 Core Utility Methods

```yaml
- getAvailableFrameworks():
    returns: array of all framework configurations from ENHANCED_FRAMEWORK_CONFIGS

- getFrameworkConfig(frameworkId):
    returns: specific framework configuration or null

- getCurrentState():
    returns: comprehensive state object including:
      - sessionId, selectedFramework, currentStep, totalSteps
      - progress percentage, frameworkConfig
      - timestamps, answer counts, total questions

- reset():
    purpose: resets wizard to initial state
    clears: all properties back to null/default values
    usage: when starting new assessment or switching users
```

### 🔒 Error Handling & Validation

```yaml
error_handling_patterns:
  - try/catch blocks in all major functions
  - graceful fallbacks when validation fails
  - console.error logging with descriptive messages
  - boolean return values for success/failure status

validation_systems:
  - framework ID validation against ENHANCED_FRAMEWORK_CONFIGS
  - step number range validation (1 to totalSteps)
  - question data existence validation
  - localStorage operation error handling
```

---

## 🧪 Critical Testing Scenarios

### 🎯 High Priority Tests

```yaml
1. Framework Selection & Initialization:
  - Initialize with valid onboarding_questions.json data
  - Select each supported framework and verify configuration loading
  - Test step extraction and question counting accuracy
  - Validate framework metadata matches navigation-config.js

2. Step Navigation & Validation:
  - Test nextStep(), previousStep(), goToStep() functionality
  - Verify allowStepSkipping setting enforcement
  - Test progress calculation accuracy across different steps
  - Validate step boundary conditions (step 1, final step)

3. Answer Management & Persistence:
  - Test saveAnswer() and getAnswer() functionality
  - Verify localStorage persistence and restoration
  - Test session management across page reloads
  - Validate answer data integrity and recovery

4. Integration Points:
  - Test global function exports (getWizardEngine, getFrameworkSteps, etc.)
  - Verify question loading integration with wizzard.html
  - Test event handler system and callback execution
  - Validate voice guidance and chat integration points
```

### ⚠️ Integration Dependencies to Test

```yaml
- Must test WITH onboarding_questions.json loaded (question data source)
- Must test WITH navigation-config.js (framework metadata consistency)
- Must test WITH wizzard.html (global function integration)
- Must test localStorage availability and error scenarios
- Must test framework switching and state persistence
- Must test progress calculation across all supported frameworks
```

### 🔍 Edge Cases & Error Scenarios

```yaml
- Missing or corrupted onboarding_questions.json data
- Invalid framework IDs or missing framework configurations
- localStorage quota exceeded or unavailable
- Page reload during assessment with saved progress
- Network interruption during question loading
- Invalid step numbers or question IDs
- Multiple wizard instances or conflicting global state
```

---

## 📊 Data Flow & Architecture Summary

### 🔄 Complete Data Flow

```yaml
1. Initialization: onboarding_questions.json → WizardEngine.initialize() → processFrameworkConfigurations()

2. Framework Selection: User Selection → selectFramework() → Load Config → Update Global State

3. Question Loading: Step Navigation → getQuestionsForStep() → Filter by Step Label → Return Questions

4. Answer Management: User Input → saveAnswer() → localStorage Persistence → Progress Update

5. Assessment Completion: Final Step → completeAssessment() → calculateResults() → Event Handlers
```

### 🏗️ Architecture Pattern

```yaml
design_pattern: Singleton + Event-Driven + State Machine
core_components:
  - WizardEngine class: central state management
  - ENHANCED_FRAMEWORK_CONFIGS: metadata storage
  - Global function exports: HTML integration layer
  - Event handler system: UI integration points
  - localStorage persistence: state recovery system
```

---

## 📋 Status: **CORE BUSINESS LOGIC ENGINE**

✅ **Critical**: Powers entire wizard/assessment system  
⭐ **Sophisticated**: Class-based architecture with comprehensive state management  
🔄 **Testing Priority**: HIGHEST - Core functionality that affects all assessments  
🏗️ **Architecture**: Singleton pattern with event-driven integration  
💾 **Persistent**: Comprehensive localStorage-based session management  
🎯 **Production-Ready**: Enterprise-grade error handling and validation

---
