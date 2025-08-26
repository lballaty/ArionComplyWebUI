// wizard-engine.js - Enhanced Complete Framework Selection and Step Management Engine
// Core wizard functionality with framework selection, step management, and progress tracking
// Integrates with existing questionLoader.js, chatLogic.js, and wizard UI components

/* ==========================================================================
   FRAMEWORK CONFIGURATION AND METADATA
   Enhanced framework definitions with complete metadata and integration points
   ========================================================================== */

/**
 * Enhanced framework configurations with comprehensive metadata
 * Extends the base configurations from navigation-config.js with wizard-specific data
 */
const ENHANCED_FRAMEWORK_CONFIGS = {
  eu_ai_act: {
    id: "eu_ai_act",
    name: "EU AI Act Compliance",
    shortName: "EU AI Act",
    description:
      "AI system risk assessment and classification according to the European Union AI Act",
    icon: "fas fa-robot",
    color: "#3b82f6",

    // Assessment metadata
    estimatedTime: "30-45 minutes",
    questionCount: 42,
    stepCount: 10,
    difficultyLevel: "Intermediate",

    // JSON integration
    jsonKey: "EU AI ACT Onboarding Questionaire",

    // Framework-specific configuration
    riskCategories: ["Prohibited", "High-Risk", "Limited-Risk", "Minimal-Risk"],
    complianceDate: "2026-08-01",
    regulatoryBody: "European Commission",

    // Chat and voice guidance
    chatContext: "EU AI Act Assessment",
    voiceWelcome:
      "Welcome to the EU AI Act compliance assessment. I'll guide you through classifying your AI system according to European regulations.",

    // Step definitions (populated from question data)
    steps: [],

    // Wizard-specific settings
    wizardSettings: {
      showProgressPercentage: true,
      allowStepSkipping: false,
      autoSave: true,
      voiceGuidance: true,
      contextualHelp: true,
    },

    // Tags for filtering and search
    tags: [
      "AI",
      "European Union",
      "Risk Assessment",
      "Machine Learning",
      "Automation",
    ],

    // URLs and navigation
    assessmentUrl: "wizard.html?framework=eu_ai_act",
    documentationUrl: "help.html#eu-ai-act",
  },

  iso_27001: {
    id: "iso_27001",
    name: "ISO 27001 Information Security",
    shortName: "ISO 27001",
    description:
      "Information Security Management System based on ISO/IEC 27001:2022",
    icon: "fas fa-shield-alt",
    color: "#10b981",

    estimatedTime: "45-60 minutes",
    questionCount: 78,
    stepCount: 14,
    difficultyLevel: "Advanced",

    jsonKey: "ISO 27001 Questionaire",

    riskCategories: ["Critical", "High", "Medium", "Low"],
    complianceDate: "Ongoing",
    regulatoryBody: "ISO/IEC",

    chatContext: "ISO 27001 Assessment",
    voiceWelcome:
      "Welcome to the ISO 27001 Information Security Management System assessment. Let's evaluate your security controls and governance.",

    steps: [],

    wizardSettings: {
      showProgressPercentage: true,
      allowStepSkipping: true,
      autoSave: true,
      voiceGuidance: true,
      contextualHelp: true,
    },

    tags: [
      "Information Security",
      "ISMS",
      "Risk Management",
      "Certification",
      "ISO",
    ],

    assessmentUrl: "wizard.html?framework=iso_27001",
    documentationUrl: "help.html#iso-27001",
  },

  iso_42001: {
    id: "iso_42001",
    name: "ISO 42001 AI Management",
    shortName: "ISO 42001",
    description:
      "Artificial Intelligence Management System based on ISO/IEC 42001:2023",
    icon: "fas fa-brain",
    color: "#8b5cf6",

    estimatedTime: "25-35 minutes",
    questionCount: 36,
    stepCount: 10,
    difficultyLevel: "Intermediate",

    jsonKey: "ISO 42001 2023 AI Management Onboarding Questionaire",

    riskCategories: ["Critical", "High", "Medium", "Low"],
    complianceDate: "Ongoing",
    regulatoryBody: "ISO/IEC",

    chatContext: "ISO 42001 AI Management Assessment",
    voiceWelcome:
      "Welcome to the ISO 42001 AI Management System assessment. We'll evaluate your AI governance and management practices.",

    steps: [],

    wizardSettings: {
      showProgressPercentage: true,
      allowStepSkipping: false,
      autoSave: true,
      voiceGuidance: true,
      contextualHelp: true,
    },

    tags: [
      "AI Management",
      "ISO",
      "Artificial Intelligence",
      "Governance",
      "Risk Management",
    ],

    assessmentUrl: "wizard.html?framework=iso_42001",
    documentationUrl: "help.html#iso-42001",
  },

  gdpr: {
    id: "gdpr",
    name: "GDPR & Privacy Compliance",
    shortName: "GDPR",
    description:
      "General Data Protection Regulation compliance with Microsoft DPR integration",
    icon: "fas fa-user-shield",
    color: "#f59e0b",

    estimatedTime: "50-70 minutes",
    questionCount: 89,
    stepCount: 8,
    difficultyLevel: "Advanced",

    jsonKey: "GDPR and MSFT DPR Onboarding Questionaire",

    riskCategories: ["Very High", "High", "Medium", "Low"],
    complianceDate: "2018-05-25",
    regulatoryBody: "European Data Protection Board",

    chatContext: "GDPR Privacy Assessment",
    voiceWelcome:
      "Welcome to the GDPR privacy compliance assessment. We'll review your data processing activities and privacy controls.",

    steps: [],

    wizardSettings: {
      showProgressPercentage: true,
      allowStepSkipping: true,
      autoSave: true,
      voiceGuidance: true,
      contextualHelp: true,
    },

    tags: [
      "GDPR",
      "Data Protection",
      "Privacy",
      "European Union",
      "Personal Data",
    ],

    assessmentUrl: "wizard.html?framework=gdpr",
    documentationUrl: "help.html#gdpr",
  },

  iso_27701: {
    id: "iso_27701",
    name: "ISO 27701 Privacy Management",
    shortName: "ISO 27701",
    description:
      "Privacy Information Management System based on ISO/IEC 27701:2019",
    icon: "fas fa-lock",
    color: "#06b6d4",

    estimatedTime: "35-45 minutes",
    questionCount: 52,
    stepCount: 13,
    difficultyLevel: "Advanced",

    jsonKey: "ISO 27701 Onboarding Questionaire",

    riskCategories: ["Critical", "High", "Medium", "Low"],
    complianceDate: "Ongoing",
    regulatoryBody: "ISO/IEC",

    chatContext: "ISO 27701 Privacy Assessment",
    voiceWelcome:
      "Welcome to the ISO 27701 Privacy Information Management System assessment. Let's evaluate your privacy controls.",

    steps: [],

    wizardSettings: {
      showProgressPercentage: true,
      allowStepSkipping: true,
      autoSave: true,
      voiceGuidance: true,
      contextualHelp: true,
    },

    tags: [
      "Privacy Management",
      "PIMS",
      "ISO",
      "Data Protection",
      "Information Security",
    ],

    assessmentUrl: "wizard.html?framework=iso_27701",
    documentationUrl: "help.html#iso-27701",
  },

  cloud_security: {
    id: "cloud_security",
    name: "Cloud Security (ISO 27017/27018)",
    shortName: "Cloud Security",
    description: "Cloud security and privacy based on ISO/IEC 27017 and 27018",
    icon: "fas fa-cloud",
    color: "#84cc16",

    estimatedTime: "20-30 minutes",
    questionCount: 29,
    stepCount: 7,
    difficultyLevel: "Intermediate",

    jsonKey: "ISO 27017 and 27018 Cloud Security and Privacy Questionaire",

    riskCategories: ["Critical", "High", "Medium", "Low"],
    complianceDate: "Ongoing",
    regulatoryBody: "ISO/IEC",

    chatContext: "Cloud Security Assessment",
    voiceWelcome:
      "Welcome to the Cloud Security assessment covering ISO 27017 and 27018 standards. Let's evaluate your cloud security posture.",

    steps: [],

    wizardSettings: {
      showProgressPercentage: true,
      allowStepSkipping: true,
      autoSave: true,
      voiceGuidance: true,
      contextualHelp: true,
    },

    tags: [
      "Cloud Security",
      "ISO 27017",
      "ISO 27018",
      "Cloud Computing",
      "Privacy",
    ],

    assessmentUrl: "wizzard.html?framework=cloud_security",
    documentationUrl: "help.html#cloud-security",
  },
};

/* ==========================================================================
   WIZARD ENGINE CLASS
   Main class for managing framework selection, step progression, and state
   ========================================================================== */

/**
 * WizardEngine - Core engine for managing the compliance assessment wizard
 * Handles framework selection, step management, progress tracking, and integration
 */
class WizardEngine {
  constructor() {
    this.selectedFramework = null;
    this.currentStep = 1;
    this.totalSteps = 0;
    this.frameworkConfig = null;
    this.questionData = null;
    this.userAnswers = {};
    this.sessionId = null;
    this.startTime = null;
    this.lastSaved = null;

    // Event handlers for integration
    this.onFrameworkSelected = null;
    this.onStepChanged = null;
    this.onProgressUpdated = null;
    this.onAssessmentComplete = null;

    // Integration points
    this.voiceGuidance = null;
    this.chatIntegration = null;

    console.log("🎮 WizardEngine initialized");
  }

  /* ========================================================================
     FRAMEWORK SELECTION AND INITIALIZATION
     ======================================================================== */

  /**
   * Initializes the wizard engine with question data
   * @param {Object} questionData - The loaded question data from JSON
   */
  async initialize(questionData) {
    try {
      this.questionData = questionData;

      // Process framework configurations with actual question data
      await this.processFrameworkConfigurations();

      // Initialize session
      this.sessionId = this.generateSessionId();
      this.startTime = new Date().toISOString();

      console.log("✅ WizardEngine initialized with question data");
      return true;
    } catch (error) {
      console.error("❌ Error initializing WizardEngine:", error);
      return false;
    }
  }

  /**
   * Processes framework configurations with actual question data
   * Populates step information and question counts
   */
  async processFrameworkConfigurations() {
    try {
      for (const frameworkId of Object.keys(ENHANCED_FRAMEWORK_CONFIGS)) {
        const config = ENHANCED_FRAMEWORK_CONFIGS[frameworkId];
        const questionsArray = this.questionData[config.jsonKey];

        if (questionsArray && Array.isArray(questionsArray)) {
          // Extract steps from questions
          const steps = this.extractStepsFromQuestions(questionsArray);
          config.steps = steps;
          config.questionCount = questionsArray.length;
          config.stepCount = steps.length;

          console.log(
            `✅ Processed ${config.name}: ${steps.length} steps, ${questionsArray.length} questions`,
          );
        } else {
          console.warn(`⚠️ No questions found for framework: ${config.name}`);
          config.steps = [];
          config.questionCount = 0;
          config.stepCount = 0;
        }
      }
    } catch (error) {
      console.error("❌ Error processing framework configurations:", error);
    }
  }

  /**
   * Extracts step information from questions array
   * @param {Array} questions - Array of question objects
   * @returns {Array} Array of step objects
   */
  extractStepsFromQuestions(questions) {
    const stepMap = new Map();

    questions.forEach((question, index) => {
      const stepText = question.step;
      if (stepText) {
        // Extract step number and title from text like "Step 1: Company Profile"
        const match = stepText.match(/Step (\d+):\s*(.+)/);
        if (match) {
          const stepNumber = parseInt(match[1]);
          const stepTitle = match[2].trim();

          if (!stepMap.has(stepNumber)) {
            stepMap.set(stepNumber, {
              number: stepNumber,
              title: stepTitle,
              description: this.generateStepDescription(stepTitle),
              questionCount: 0,
              questionIds: [],
            });
          }

          // Increment question count and add question ID
          const step = stepMap.get(stepNumber);
          step.questionCount++;
          step.questionIds.push(index);
        }
      }
    });

    // Convert map to sorted array
    return Array.from(stepMap.values()).sort((a, b) => a.number - b.number);
  }

  /**
   * Generates a user-friendly description for a step
   * @param {string} title - The step title
   * @returns {string} User-friendly description
   */
  generateStepDescription(title) {
    const descriptions = {
      "Company Profile": "Basic information about your organization",
      "Company & Use Case Profile": "Organization details and AI use cases",
      "Organizational Context": "Business context and objectives",
      "Organization & Data Processing Context":
        "Data processing activities and context",
      "Risk Analysis": "Risk identification and assessment",
      "Risk & Opportunity Management": "Risk and opportunity evaluation",
      "High-Risk AI Governance": "AI governance and compliance requirements",
      "Risk Management, Testing & Monitoring":
        "Testing and monitoring procedures",
      "Transparency, Human Oversight & Documentation":
        "Documentation and oversight requirements",
      "Data Protection & Ethical Safeguards": "Privacy and ethics compliance",
      "Vendor, Supply Chain, and Third-Party AI": "Third-party AI management",
      "Training, Awareness & Continuous Improvement":
        "Training and improvement processes",
      "Foundation Models and Advanced AI Systems":
        "Advanced AI system requirements",
      "Market Surveillance and Incident Reporting":
        "Monitoring and incident management",
      "CE Marking and Conformity Assessment":
        "Certification and marking requirements",

      // ISO 27001 steps
      "Company Profile & Scope":
        "Organization profile and ISMS scope definition",
      "Stakeholders & ISMS Roles":
        "Stakeholder identification and role assignment",
      "Risk & Incident Context": "Risk assessment and incident management",
      "Infrastructure & Assets": "Asset inventory and infrastructure security",
      "Access Control & Identity": "Identity and access management controls",
      "Development & Change Management":
        "Secure development and change processes",
      "Monitoring & Alerts": "Security monitoring and alerting systems",
      "Policies & Awareness": "Security policies and awareness programs",
      "Vendors & Third Parties": "Third-party risk management",
      "Audits & Management Review": "Internal audits and management oversight",
      "Physical and Environmental Security":
        "Physical and environmental controls",
      "Business Continuity Management":
        "Business continuity and disaster recovery",
      "Advanced Operations Security": "Advanced operational security controls",
      "Advanced Supplier Security": "Enhanced supplier security management",

      // Add more mappings as needed
    };

    return descriptions[title] || `Assessment of ${title.toLowerCase()}`;
  }

  /**
   * Selects a framework for the assessment
   * @param {string} frameworkId - The framework identifier
   * @returns {boolean} Success status
   */
  selectFramework(frameworkId) {
    try {
      if (!ENHANCED_FRAMEWORK_CONFIGS[frameworkId]) {
        throw new Error(`Unknown framework: ${frameworkId}`);
      }

      this.selectedFramework = frameworkId;
      this.frameworkConfig = ENHANCED_FRAMEWORK_CONFIGS[frameworkId];
      this.totalSteps = this.frameworkConfig.stepCount;
      this.currentStep = 1;
      this.userAnswers = {};

      // Update session data
      this.lastSaved = new Date().toISOString();

      console.log(`🎯 Framework selected: ${this.frameworkConfig.name}`);

      // Trigger event handlers
      if (this.onFrameworkSelected) {
        this.onFrameworkSelected(this.frameworkConfig);
      }

      return true;
    } catch (error) {
      console.error("❌ Error selecting framework:", error);
      return false;
    }
  }

  /* ========================================================================
     STEP MANAGEMENT AND NAVIGATION
     ======================================================================== */

  /**
   * Advances to the next step
   * @param {boolean} skipValidation - Whether to skip step validation
   * @returns {boolean} Success status
   */
  nextStep(skipValidation = false) {
    try {
      if (!this.selectedFramework) {
        throw new Error("No framework selected");
      }

      // Validate current step unless skipped
      if (!skipValidation && !this.validateCurrentStep()) {
        return false;
      }

      if (this.currentStep < this.totalSteps) {
        this.currentStep++;

        // Auto-save progress
        this.saveProgress();

        console.log(
          `▶️ Advanced to step ${this.currentStep}/${this.totalSteps}`,
        );

        // Trigger event handlers
        if (this.onStepChanged) {
          this.onStepChanged(this.currentStep, this.getCurrentStepInfo());
        }

        if (this.onProgressUpdated) {
          this.onProgressUpdated(this.getProgressPercentage());
        }

        return true;
      } else {
        // Assessment complete
        return this.completeAssessment();
      }
    } catch (error) {
      console.error("❌ Error advancing to next step:", error);
      return false;
    }
  }

  /**
   * Goes back to the previous step
   * @returns {boolean} Success status
   */
  previousStep() {
    try {
      if (!this.selectedFramework) {
        throw new Error("No framework selected");
      }

      if (this.currentStep > 1) {
        this.currentStep--;

        console.log(
          `◀️ Moved back to step ${this.currentStep}/${this.totalSteps}`,
        );

        // Trigger event handlers
        if (this.onStepChanged) {
          this.onStepChanged(this.currentStep, this.getCurrentStepInfo());
        }

        if (this.onProgressUpdated) {
          this.onProgressUpdated(this.getProgressPercentage());
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error("❌ Error going to previous step:", error);
      return false;
    }
  }

  /**
   * Jumps to a specific step
   * @param {number} stepNumber - The step number to jump to
   * @param {boolean} skipValidation - Whether to skip validation
   * @returns {boolean} Success status
   */
  goToStep(stepNumber, skipValidation = false) {
    try {
      if (!this.selectedFramework) {
        throw new Error("No framework selected");
      }

      if (stepNumber < 1 || stepNumber > this.totalSteps) {
        throw new Error(`Invalid step number: ${stepNumber}`);
      }

      // Check if step skipping is allowed for this framework
      if (
        !skipValidation &&
        !this.frameworkConfig.wizardSettings.allowStepSkipping &&
        stepNumber > this.currentStep + 1
      ) {
        console.warn("Step skipping not allowed for this framework");
        return false;
      }

      this.currentStep = stepNumber;

      console.log(`🔄 Jumped to step ${this.currentStep}/${this.totalSteps}`);

      // Trigger event handlers
      if (this.onStepChanged) {
        this.onStepChanged(this.currentStep, this.getCurrentStepInfo());
      }

      if (this.onProgressUpdated) {
        this.onProgressUpdated(this.getProgressPercentage());
      }

      return true;
    } catch (error) {
      console.error("❌ Error jumping to step:", error);
      return false;
    }
  }

  /* ========================================================================
     PROGRESS TRACKING AND VALIDATION
     ======================================================================== */

  /**
   * Gets the current progress percentage
   * @returns {number} Progress percentage (0-100)
   */
  getProgressPercentage() {
    if (!this.selectedFramework || this.totalSteps === 0) {
      return 0;
    }

    const stepProgress = (this.currentStep - 1) / this.totalSteps;
    const currentStepCompletion = this.getCurrentStepCompletion();

    return Math.min(
      95,
      Math.max(
        0,
        (stepProgress + currentStepCompletion / this.totalSteps) * 100,
      ),
    );
  }

  /**
   * Gets the completion percentage for the current step
   * @returns {number} Completion percentage (0-1)
   */
  getCurrentStepCompletion() {
    try {
      const stepQuestions = this.getQuestionsForCurrentStep();
      if (stepQuestions.length === 0) return 1;

      const answeredQuestions = stepQuestions.filter((q) => {
        const questionId = this.generateQuestionId(q);
        return (
          this.userAnswers[questionId] &&
          this.userAnswers[questionId].trim() !== ""
        );
      }).length;

      return answeredQuestions / stepQuestions.length;
    } catch (error) {
      console.error("❌ Error calculating step completion:", error);
      return 0;
    }
  }

  /**
   * Validates the current step
   * @returns {boolean} True if validation passes
   */
  validateCurrentStep() {
    try {
      const stepQuestions = this.getQuestionsForCurrentStep();
      const requiredQuestions = stepQuestions.filter(
        (q) => q.required !== false,
      );

      // For now, allow progression without strict validation
      // This can be enhanced with specific validation rules
      return true;
    } catch (error) {
      console.error("❌ Error validating step:", error);
      return true; // Allow progression if validation fails
    }
  }

  /**
   * Completes the assessment
   * @returns {boolean} Success status
   */
  completeAssessment() {
    try {
      const results = this.calculateResults();

      console.log("🎉 Assessment completed!", results);

      // Trigger completion event
      if (this.onAssessmentComplete) {
        this.onAssessmentComplete(results);
      }

      return true;
    } catch (error) {
      console.error("❌ Error completing assessment:", error);
      return false;
    }
  }

  /**
   * Calculates assessment results
   * @returns {Object} Results object
   */
  calculateResults() {
    const totalQuestions = this.getTotalQuestionCount();
    const answeredQuestions = Object.keys(this.userAnswers).length;
    const completionPercentage = Math.round(
      (answeredQuestions / totalQuestions) * 100,
    );

    return {
      framework: this.frameworkConfig.name,
      frameworkId: this.selectedFramework,
      sessionId: this.sessionId,
      startTime: this.startTime,
      endTime: new Date().toISOString(),
      totalSteps: this.totalSteps,
      totalQuestions,
      answeredQuestions,
      completionPercentage,
      answers: this.userAnswers,
      recommendations: this.generateRecommendations(),
    };
  }

  /**
   * Generates recommendations based on answers
   * @returns {Array} Array of recommendation objects
   */
  generateRecommendations() {
    // This would be enhanced with specific logic based on framework and answers
    return [
      {
        type: "action",
        priority: "high",
        title: "Complete Documentation Review",
        description:
          "Review and complete any missing documentation identified during the assessment.",
      },
      {
        type: "improvement",
        priority: "medium",
        title: "Enhance Training Programs",
        description:
          "Consider expanding compliance training programs for staff.",
      },
    ];
  }

  /* ========================================================================
     QUESTION MANAGEMENT AND DATA ACCESS
     ======================================================================== */

  /**
   * Gets questions for the current step
   * @returns {Array} Array of question objects
   */
  getQuestionsForCurrentStep() {
    return this.getQuestionsForStep(this.currentStep);
  }

  /**
   * Gets questions for a specific step
   * @param {number} stepNumber - The step number
   * @returns {Array} Array of question objects
   */
  getQuestionsForStep(stepNumber) {
    try {
      if (!this.selectedFramework || !this.questionData) {
        return [];
      }

      const frameworkQuestions =
        this.questionData[this.frameworkConfig.jsonKey];
      if (!frameworkQuestions) {
        return [];
      }

      const stepLabel = `Step ${stepNumber}`;
      return frameworkQuestions.filter(
        (question) => question.step && question.step.startsWith(stepLabel),
      );
    } catch (error) {
      console.error("❌ Error getting questions for step:", error);
      return [];
    }
  }

  /**
   * Gets information about the current step
   * @returns {Object} Step information object
   */
  getCurrentStepInfo() {
    if (!this.frameworkConfig || !this.frameworkConfig.steps) {
      return null;
    }

    return this.frameworkConfig.steps[this.currentStep - 1] || null;
  }

  /**
   * Gets total question count for the selected framework
   * @returns {number} Total number of questions
   */
  getTotalQuestionCount() {
    if (!this.selectedFramework || !this.questionData) {
      return 0;
    }

    const frameworkQuestions = this.questionData[this.frameworkConfig.jsonKey];
    return frameworkQuestions ? frameworkQuestions.length : 0;
  }

  /**
   * Generates a unique question ID
   * @param {Object} question - Question object
   * @param {number} index - Optional question index
   * @returns {string} Unique question ID
   */
  generateQuestionId(question, index = null) {
    // Create a consistent ID based on step and question content
    const stepMatch = question.step ? question.step.match(/Step (\d+):/) : null;
    const stepNum = stepMatch ? stepMatch[1] : "unknown";

    if (index !== null) {
      return `step${stepNum}_q${index}`;
    }

    // Fallback to hash of question text
    const questionHash = this.simpleHash(question.question || "");
    return `step${stepNum}_${questionHash}`;
  }

  /**
   * Simple hash function for generating IDs
   * @param {string} str - String to hash
   * @returns {string} Hash string
   */
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /* ========================================================================
     ANSWER MANAGEMENT
     ======================================================================== */

  /**
   * Saves an answer for a question
   * @param {string} questionId - Question identifier
   * @param {any} value - Answer value
   */
  saveAnswer(questionId, value) {
    try {
      this.userAnswers[questionId] = value;
      this.lastSaved = new Date().toISOString();

      // Auto-save if enabled
      if (this.frameworkConfig?.wizardSettings?.autoSave) {
        this.saveProgress();
      }

      // Trigger progress update
      if (this.onProgressUpdated) {
        this.onProgressUpdated(this.getProgressPercentage());
      }
    } catch (error) {
      console.error("❌ Error saving answer:", error);
    }
  }

  /**
   * Gets an answer for a question
   * @param {string} questionId - Question identifier
   * @returns {any} Answer value or null
   */
  getAnswer(questionId) {
    return this.userAnswers[questionId] || null;
  }

  /**
   * Gets all answers
   * @returns {Object} All answers object
   */
  getAllAnswers() {
    return { ...this.userAnswers };
  }

  /**
   * Loads answers from a saved state
   * @param {Object} answers - Answers object to load
   */
  loadAnswers(answers) {
    try {
      this.userAnswers = { ...answers };
      console.log("✅ Answers loaded successfully");
    } catch (error) {
      console.error("❌ Error loading answers:", error);
    }
  }

  /* ========================================================================
     SESSION MANAGEMENT AND PERSISTENCE
     ======================================================================== */

  /**
   * Saves the current progress to localStorage
   */
  saveProgress() {
    try {
      const progressData = {
        sessionId: this.sessionId,
        framework: this.selectedFramework,
        currentStep: this.currentStep,
        totalSteps: this.totalSteps,
        answers: this.userAnswers,
        startTime: this.startTime,
        lastSaved: new Date().toISOString(),
        version: "2.1.0",
      };

      localStorage.setItem("wizard_progress", JSON.stringify(progressData));
      localStorage.setItem(
        `wizard_progress_${this.selectedFramework}`,
        JSON.stringify(progressData),
      );

      console.log("💾 Progress saved successfully");
    } catch (error) {
      console.error("❌ Error saving progress:", error);
    }
  }

  /**
   * Loads progress from localStorage
   * @param {string} frameworkId - Optional specific framework to load
   * @returns {boolean} Success status
   */
  loadProgress(frameworkId = null) {
    try {
      const key = frameworkId
        ? `wizard_progress_${frameworkId}`
        : "wizard_progress";
      const savedData = localStorage.getItem(key);

      if (!savedData) {
        console.log("No saved progress found");
        return false;
      }

      const progressData = JSON.parse(savedData);

      // Validate the data
      if (
        !progressData.framework ||
        !ENHANCED_FRAMEWORK_CONFIGS[progressData.framework]
      ) {
        console.warn("Invalid saved progress data");
        return false;
      }

      // Restore state
      this.sessionId = progressData.sessionId;
      this.selectedFramework = progressData.framework;
      this.frameworkConfig = ENHANCED_FRAMEWORK_CONFIGS[this.selectedFramework];
      this.currentStep = progressData.currentStep || 1;
      this.totalSteps =
        progressData.totalSteps || this.frameworkConfig.stepCount;
      this.userAnswers = progressData.answers || {};
      this.startTime = progressData.startTime;
      this.lastSaved = progressData.lastSaved;

      console.log("🔄 Progress loaded successfully");
      return true;
    } catch (error) {
      console.error("❌ Error loading progress:", error);
      return false;
    }
  }

  /**
   * Clears saved progress
   * @param {string} frameworkId - Optional specific framework to clear
   */
  clearProgress(frameworkId = null) {
    try {
      if (frameworkId) {
        localStorage.removeItem(`wizard_progress_${frameworkId}`);
      } else {
        localStorage.removeItem("wizard_progress");
        // Clear all framework-specific progress
        Object.keys(ENHANCED_FRAMEWORK_CONFIGS).forEach((id) => {
          localStorage.removeItem(`wizard_progress_${id}`);
        });
      }

      console.log("🗑️ Progress cleared");
    } catch (error) {
      console.error("❌ Error clearing progress:", error);
    }
  }

  /**
   * Generates a unique session ID
   * @returns {string} Session ID
   */
  generateSessionId() {
    return (
      "wizard_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
    );
  }

  /* ========================================================================
     UTILITY AND HELPER METHODS
     ======================================================================== */

  /**
   * Gets the list of available frameworks
   * @returns {Array} Array of framework objects
   */
  getAvailableFrameworks() {
    return Object.values(ENHANCED_FRAMEWORK_CONFIGS);
  }

  /**
   * Gets framework configuration by ID
   * @param {string} frameworkId - Framework identifier
   * @returns {Object} Framework configuration or null
   */
  getFrameworkConfig(frameworkId) {
    return ENHANCED_FRAMEWORK_CONFIGS[frameworkId] || null;
  }

  /**
   * Gets the current wizard state
   * @returns {Object} Current state object
   */
  getCurrentState() {
    return {
      sessionId: this.sessionId,
      selectedFramework: this.selectedFramework,
      currentStep: this.currentStep,
      totalSteps: this.totalSteps,
      progress: this.getProgressPercentage(),
      frameworkConfig: this.frameworkConfig,
      startTime: this.startTime,
      lastSaved: this.lastSaved,
      answeredQuestions: Object.keys(this.userAnswers).length,
      totalQuestions: this.getTotalQuestionCount(),
    };
  }

  /**
   * Resets the wizard to initial state
   */
  reset() {
    this.selectedFramework = null;
    this.currentStep = 1;
    this.totalSteps = 0;
    this.frameworkConfig = null;
    this.userAnswers = {};
    this.sessionId = null;
    this.startTime = null;
    this.lastSaved = null;

    console.log("🔄 Wizard reset to initial state");
  }

  /* ========================================================================
     INTEGRATION POINTS
     ======================================================================== */

  /**
   * Sets up integration with voice guidance system
   * @param {Object} voiceGuidance - Voice guidance instance
   */
  setVoiceGuidance(voiceGuidance) {
    this.voiceGuidance = voiceGuidance;
  }

  /**
   * Sets up integration with chat system
   * @param {Object} chatIntegration - Chat integration instance
   */
  setChatIntegration(chatIntegration) {
    this.chatIntegration = chatIntegration;
  }

  /**
   * Triggers voice guidance for current step
   */
  triggerVoiceGuidance() {
    if (this.voiceGuidance && this.frameworkConfig) {
      const stepInfo = this.getCurrentStepInfo();
      this.voiceGuidance.announceStep(
        this.currentStep,
        stepInfo,
        this.frameworkConfig,
      );
    }
  }

  /**
   * Updates chat context with current wizard state
   */
  updateChatContext() {
    if (this.chatIntegration && this.frameworkConfig) {
      this.chatIntegration.updateContext(
        this.frameworkConfig.chatContext,
        this.getCurrentState(),
      );
    }
  }
}

/* ==========================================================================
   GLOBAL EXPORTS AND INTEGRATION
   Export the WizardEngine and utility functions for global access
   ========================================================================== */

// Create global instance
let globalWizardEngine = null;

/**
 * Gets or creates the global wizard engine instance
 * @returns {WizardEngine} Global wizard engine instance
 */
function getWizardEngine() {
  if (!globalWizardEngine) {
    globalWizardEngine = new WizardEngine();
  }
  return globalWizardEngine;
}

/**
 * Initializes the wizard engine with question data
 * @param {Object} questionData - Question data from JSON
 * @returns {Promise<boolean>} Success status
 */
async function initializeWizardEngine(questionData) {
  const engine = getWizardEngine();
  return await engine.initialize(questionData);
}

// CRITICAL FIX: UNCONDITIONAL GLOBAL EXPORTS
// These functions must always be available regardless of loading conditions

// Create fallback functions that always exist
function safeWizardFunction(name, fallbackFn) {
  try {
    if (typeof window !== "undefined") {
      window[name] = fallbackFn;
    }
    return fallbackFn;
  } catch (error) {
    console.error(`Error creating global function ${name}:`, error);
    return fallbackFn;
  }
}

// Export critical functions unconditionally
const getWizardEngineGlobal = safeWizardFunction(
  "getWizardEngine",
  getWizardEngine,
);
const initializeWizardEngineGlobal = safeWizardFunction(
  "initializeWizardEngine",
  initializeWizardEngine,
);

// Export framework step functions that are called by wizzard.html
const getFrameworkSteps = safeWizardFunction("getFrameworkSteps", function () {
  try {
    const engine = getWizardEngineGlobal();
    if (engine && engine.frameworkConfig && engine.frameworkConfig.steps) {
      return engine.frameworkConfig.steps;
    }
    console.warn("No framework steps available");
    return [];
  } catch (error) {
    console.error("Error getting framework steps:", error);
    return [];
  }
});

const getQuestionsForStep = safeWizardFunction(
  "getQuestionsForStep",
  function (stepNumber) {
    try {
      const engine = getWizardEngineGlobal();
      if (engine && engine.getQuestionsForStep) {
        return engine.getQuestionsForStep(stepNumber);
      }
      console.warn("Cannot get questions for step - wizard engine not ready");
      return [];
    } catch (error) {
      console.error("Error getting questions for step:", error);
      return [];
    }
  },
);

// Global wrappers for navigation methods used by HTML onclick handlers
const selectFrameworkGlobal = safeWizardFunction(
  "selectFramework",
  function (frameworkId) {
    try {
      const engine = getWizardEngineGlobal();
      return engine.selectFramework(frameworkId);
    } catch (error) {
      console.error("Error selecting framework:", error);
      return false;
    }
  },
);

const startAssessmentGlobal = safeWizardFunction(
  "startAssessment",
  function () {
    try {
      const engine = getWizardEngineGlobal();
      if (!engine.selectedFramework) {
        console.warn("No framework selected");
        return false;
      }
      engine.startTime = new Date().toISOString();
      engine.currentStep = 1;
      engine.saveProgress();
      return true;
    } catch (error) {
      console.error("Error starting assessment:", error);
      return false;
    }
  },
);

const nextStepGlobal = safeWizardFunction("nextStep", function (skip = false) {
  try {
    const engine = getWizardEngineGlobal();
    return engine.nextStep(skip);
  } catch (error) {
    console.error("Error moving to next step:", error);
    return false;
  }
});

const previousStepGlobal = safeWizardFunction("previousStep", function () {
  try {
    const engine = getWizardEngineGlobal();
    return engine.previousStep();
  } catch (error) {
    console.error("Error moving to previous step:", error);
    return false;
  }
});

const goToStepGlobal = safeWizardFunction(
  "goToStep",
  function (stepNumber, skip = false) {
    try {
      const engine = getWizardEngineGlobal();
      return engine.goToStep(stepNumber, skip);
    } catch (error) {
      console.error("Error jumping to step:", error);
      return false;
    }
  },
);

const saveProgressGlobal = safeWizardFunction("saveProgress", function() {
  try {
    const engine = getWizardEngineGlobal();
    if (!engine.selectedFramework) {
      console.warn("No assessment in progress to save");
      return false;
    }
    engine.saveProgress();
    // Show user feedback
    if (typeof showNotification === 'function') {
      showNotification("Progress saved successfully", "success");
    }
    return true;
  } catch (error) {
    console.error("Error saving progress:", error);
    return false;
  }
});

const resetWizardGlobal = safeWizardFunction("resetWizard", function() {
  try {
    const engine = getWizardEngineGlobal();
    engine.reset();
    engine.clearProgress();
    return true;
  } catch (error) {
    console.error("Error resetting wizard:", error);
    return false;
  }
});

// Export to global scope for compatibility with existing HTML
if (typeof window !== "undefined") {
  // Primary exports
  window.WizardEngine = WizardEngine;
  window.ENHANCED_FRAMEWORK_CONFIGS = ENHANCED_FRAMEWORK_CONFIGS;

  // Already handled by safeWizardFunction above
  // window.getWizardEngine = getWizardEngine;
  // window.initializeWizardEngine = initializeWizardEngine;
  // window.getFrameworkSteps = getFrameworkSteps;
  // window.getQuestionsForStep = getQuestionsForStep;
}

// Export for module use
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    WizardEngine,
    getWizardEngine,
    initializeWizardEngine,
    getFrameworkSteps,
    getQuestionsForStep,
    ENHANCED_FRAMEWORK_CONFIGS,
  };
}

console.log(
  "✅ WizardEngine module loaded successfully with guaranteed global exports",
);
