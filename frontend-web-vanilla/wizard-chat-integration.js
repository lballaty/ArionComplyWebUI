// wizard-chat-integration.js - Enhanced Deep Chat Integration Layer
// Comprehensive integration between wizard system and AI chat interface
// Handles context synchronization, guidance delivery, and cross-system communication

/* ==========================================================================
   CHAT INTEGRATION CONFIGURATION
   Configuration and settings for chat-wizard integration
   ========================================================================== */

/**
 * Chat integration configuration with comprehensive settings
 */
const CHAT_INTEGRATION_CONFIG = {
  // Context synchronization settings
  contextSync: {
    enabled: true,
    autoUpdate: true,
    syncInterval: 5000, // milliseconds
    includeProgress: true,
    includeAnswers: false, // For privacy
  },

  // Message handling settings
  messaging: {
    autoRespond: true,
    contextualHelp: true,
    proactiveGuidance: true,
    suggestionGeneration: true,
  },

  // Communication methods
  communication: {
    postMessage: true, // For iframe communication
    localStorage: true, // For cross-tab communication
    eventDispatch: true, // For same-page communication
  },

  // Guidance delivery settings
  guidance: {
    stepAnnouncements: true,
    progressMilestones: true,
    errorHandling: true,
    completionCelebration: true,
  },
};

/**
 * Message types for cross-system communication
 */
const MESSAGE_TYPES = {
  // Wizard to Chat messages
  WIZARD_CONTEXT_UPDATE: "wizard_context_update",
  WIZARD_STEP_CHANGED: "wizard_step_changed",
  WIZARD_PROGRESS_UPDATE: "wizard_progress_update",
  WIZARD_FRAMEWORK_SELECTED: "wizard_framework_selected",
  WIZARD_QUESTION_FOCUSED: "wizard_question_focused",
  WIZARD_ANSWER_SAVED: "wizard_answer_saved",
  WIZARD_VALIDATION_ERROR: "wizard_validation_error",
  WIZARD_ASSESSMENT_COMPLETE: "wizard_assessment_complete",

  // Chat to Wizard messages
  CHAT_HELP_REQUEST: "chat_help_request",
  CHAT_NAVIGATION_REQUEST: "chat_navigation_request",
  CHAT_EXPLANATION_REQUEST: "chat_explanation_request",
  CHAT_VOICE_INPUT: "chat_voice_input",
  CHAT_SUGGESTION_SELECTED: "chat_suggestion_selected",

  // Bidirectional messages
  CONTEXT_SYNC: "context_sync",
  ERROR_NOTIFICATION: "error_notification",
  STATUS_UPDATE: "status_update",
};

/**
 * Contextual guidance templates based on framework and step
 */
const GUIDANCE_TEMPLATES = {
  // EU AI Act specific guidance
  eu_ai_act: {
    welcome:
      "I'm here to help you navigate the EU AI Act assessment. This evaluation will help classify your AI system and determine compliance requirements.",
    steps: {
      1: "Let's start by understanding your organization and AI use cases. I can help explain any terminology or requirements.",
      2: "Now we'll examine high-risk AI governance. Feel free to ask about specific EU AI Act obligations or requirements.",
      3: "Risk management is crucial for AI compliance. I can explain testing procedures, monitoring requirements, or documentation standards.",
      4: "Transparency and human oversight are key EU AI Act principles. Ask me about documentation requirements or oversight mechanisms.",
      5: "Data protection and ethics are fundamental. I can help with GDPR integration, bias prevention, or ethical AI practices.",
    },
    completion:
      "Excellent! Based on your EU AI Act assessment, I can now provide specific compliance recommendations and next steps.",
  },

  // ISO 27001 specific guidance
  iso_27001: {
    welcome:
      "Welcome to your ISO 27001 assessment! I'll help you evaluate your Information Security Management System and identify improvement opportunities.",
    steps: {
      1: "Let's define your ISMS scope and organizational context. I can explain ISO 27001 requirements or help with scope definition.",
      2: "Stakeholder analysis and role definition are critical. Ask me about ISMS roles, responsibilities, or management commitment.",
      3: "Risk assessment is the foundation of ISO 27001. I can explain risk methodologies, impact assessment, or treatment options.",
      4: "Asset management and infrastructure security are vital. Let me help with asset classification, inventory, or security controls.",
    },
    completion:
      "Your ISO 27001 assessment is complete! I can now help prioritize findings and develop an implementation roadmap.",
  },

  // Generic guidance for other frameworks
  generic: {
    welcome:
      "I'm your AI compliance assistant, ready to help you through this assessment. Feel free to ask questions about any compliance topic.",
    stepTransition:
      "You're making great progress! I'm here to help explain questions, provide context, or clarify requirements.",
    completion:
      "Congratulations on completing your assessment! I can help you understand results and plan next steps.",
  },
};

/**
 * Common help topics and responses
 */
const HELP_RESPONSES = {
  // Navigation help
  navigation: {
    next: "To move to the next step, click the 'Continue' button at the bottom of the page. Make sure you've answered the current questions.",
    previous:
      "You can go back to the previous step using the 'Previous' button. Your answers are automatically saved.",
    save: "Your progress is automatically saved as you answer questions. You can also manually save using the 'Save Progress' button.",
    skip: "Some assessments allow step skipping, while others require completing steps in order. Check your framework's requirements.",
  },

  // Question help
  questions: {
    understanding:
      "If you need help understanding a question, I can explain the terminology, provide examples, or clarify the intent.",
    examples:
      "I can provide practical examples relevant to your industry or organization size to help illustrate concepts.",
    requirements:
      "I can explain the underlying compliance requirements and why specific information is needed.",
    optional:
      "Some questions are optional while others are required. Required questions are typically marked with an asterisk (*).",
  },

  // Framework-specific help
  frameworks: {
    eu_ai_act:
      "The EU AI Act classifies AI systems by risk level. I can help determine if your system is prohibited, high-risk, limited-risk, or minimal-risk.",
    iso_27001:
      "ISO 27001 focuses on information security management. I can explain the Plan-Do-Check-Act cycle and Annex A controls.",
    gdpr: "GDPR protects personal data and privacy rights. I can help with lawful basis, data subject rights, and privacy by design.",
    iso_42001:
      "ISO 42001 covers AI management systems. I can explain AI governance, lifecycle management, and risk controls.",
  },
};

/* ==========================================================================
   WIZARD CHAT INTEGRATION CLASS
   Main class for managing deep integration between wizard and chat systems
   ========================================================================== */

/**
 * WizardChatIntegration - Comprehensive integration layer
 * Handles all communication and coordination between wizard and chat systems
 */
class WizardChatIntegration {
  constructor() {
    this.config = { ...CHAT_INTEGRATION_CONFIG };
    this.isInitialized = false;
    this.wizardEngine = null;
    this.voiceGuidance = null;
    this.chatContext = null;
    this.currentFramework = null;
    this.currentStep = null;
    this.lastSyncTime = null;

    // Communication channels
    this.messageHandlers = new Map();
    this.eventListeners = [];
    this.syncInterval = null;

    // State tracking
    this.contextHistory = [];
    this.pendingMessages = [];
    this.isEmbedded = false;

    // Event handlers
    this.onMessageReceived = null;
    this.onContextUpdated = null;
    this.onGuidanceDelivered = null;
    this.onError = null;

    console.log("💬 WizardChatIntegration initialized");
  }

  /* ========================================================================
     INITIALIZATION AND SETUP
     ======================================================================== */

  /**
   * Initializes the chat integration system
   * @param {Object} options - Configuration options
   * @returns {Promise<boolean>} Success status
   */
  async initialize(options = {}) {
    try {
      // Merge configuration
      this.config = { ...this.config, ...options };

      // Detect integration mode
      this.detectIntegrationMode();

      // Setup communication channels
      this.setupCommunicationChannels();

      // Setup message handlers
      this.setupMessageHandlers();

      // Start context synchronization if enabled
      if (
        this.config.contextSync.enabled &&
        this.config.contextSync.autoUpdate
      ) {
        this.startContextSync();
      }

      this.isInitialized = true;
      console.log("✅ WizardChatIntegration initialized successfully");

      return true;
    } catch (error) {
      console.error("❌ Error initializing WizardChatIntegration:", error);
      return false;
    }
  }

  /**
   * Detects the integration mode (embedded, standalone, etc.)
   */
  detectIntegrationMode() {
    try {
      // Check if we're in an iframe
      this.isEmbedded = window !== window.top;

      // Check URL parameters
      const params = new URLSearchParams(window.location.search);
      this.isEmbedded = this.isEmbedded || params.get("embed") === "1";

      console.log(
        "🔍 Integration mode detected:",
        this.isEmbedded ? "embedded" : "standalone",
      );
    } catch (error) {
      console.error("❌ Error detecting integration mode:", error);
      this.isEmbedded = false;
    }
  }

  /**
   * Sets up communication channels based on integration mode
   */
  setupCommunicationChannels() {
    try {
      // PostMessage for iframe communication
      if (this.config.communication.postMessage) {
        window.addEventListener("message", (event) => {
          this.handlePostMessage(event);
        });
      }

      // LocalStorage for cross-tab communication
      if (this.config.communication.localStorage) {
        window.addEventListener("storage", (event) => {
          this.handleStorageEvent(event);
        });
      }

      // Custom events for same-page communication
      if (this.config.communication.eventDispatch) {
        window.addEventListener("wizardChatMessage", (event) => {
          this.handleCustomEvent(event);
        });
      }

      console.log("✅ Communication channels setup complete");
    } catch (error) {
      console.error("❌ Error setting up communication channels:", error);
    }
  }

  /**
   * Sets up message handlers for different message types
   */
  setupMessageHandlers() {
    try {
      // Wizard event handlers
      this.registerMessageHandler(
        MESSAGE_TYPES.WIZARD_CONTEXT_UPDATE,
        this.handleWizardContextUpdate.bind(this),
      );
      this.registerMessageHandler(
        MESSAGE_TYPES.WIZARD_STEP_CHANGED,
        this.handleWizardStepChanged.bind(this),
      );
      this.registerMessageHandler(
        MESSAGE_TYPES.WIZARD_PROGRESS_UPDATE,
        this.handleWizardProgressUpdate.bind(this),
      );
      this.registerMessageHandler(
        MESSAGE_TYPES.WIZARD_FRAMEWORK_SELECTED,
        this.handleWizardFrameworkSelected.bind(this),
      );
      this.registerMessageHandler(
        MESSAGE_TYPES.WIZARD_QUESTION_FOCUSED,
        this.handleWizardQuestionFocused.bind(this),
      );
      this.registerMessageHandler(
        MESSAGE_TYPES.WIZARD_ANSWER_SAVED,
        this.handleWizardAnswerSaved.bind(this),
      );
      this.registerMessageHandler(
        MESSAGE_TYPES.WIZARD_VALIDATION_ERROR,
        this.handleWizardValidationError.bind(this),
      );
      this.registerMessageHandler(
        MESSAGE_TYPES.WIZARD_ASSESSMENT_COMPLETE,
        this.handleWizardAssessmentComplete.bind(this),
      );

      // Chat event handlers
      this.registerMessageHandler(
        MESSAGE_TYPES.CHAT_HELP_REQUEST,
        this.handleChatHelpRequest.bind(this),
      );
      this.registerMessageHandler(
        MESSAGE_TYPES.CHAT_NAVIGATION_REQUEST,
        this.handleChatNavigationRequest.bind(this),
      );
      this.registerMessageHandler(
        MESSAGE_TYPES.CHAT_EXPLANATION_REQUEST,
        this.handleChatExplanationRequest.bind(this),
      );
      this.registerMessageHandler(
        MESSAGE_TYPES.CHAT_VOICE_INPUT,
        this.handleChatVoiceInput.bind(this),
      );
      this.registerMessageHandler(
        MESSAGE_TYPES.CHAT_SUGGESTION_SELECTED,
        this.handleChatSuggestionSelected.bind(this),
      );

      console.log("✅ Message handlers setup complete");
    } catch (error) {
      console.error("❌ Error setting up message handlers:", error);
    }
  }

  /* ========================================================================
     INTEGRATION WITH WIZARD ENGINE AND VOICE GUIDANCE
     ======================================================================== */

  /**
   * Sets up integration with wizard engine
   * @param {Object} wizardEngine - WizardEngine instance
   */
  setWizardEngine(wizardEngine) {
    try {
      this.wizardEngine = wizardEngine;

      if (wizardEngine) {
        // Setup event handlers
        wizardEngine.onFrameworkSelected = (config) =>
          this.notifyFrameworkSelected(config);
        wizardEngine.onStepChanged = (step, stepInfo) =>
          this.notifyStepChanged(step, stepInfo);
        wizardEngine.onProgressUpdated = (progress) =>
          this.notifyProgressUpdated(progress);
        wizardEngine.onAssessmentComplete = (results) =>
          this.notifyAssessmentComplete(results);

        // Initial context sync
        this.syncContextFromWizard();
      }

      console.log("✅ WizardEngine integration setup complete");
    } catch (error) {
      console.error("❌ Error setting up WizardEngine integration:", error);
    }
  }

  /**
   * Sets up integration with voice guidance
   * @param {Object} voiceGuidance - VoiceGuidance instance
   */
  setVoiceGuidance(voiceGuidance) {
    try {
      this.voiceGuidance = voiceGuidance;

      if (voiceGuidance) {
        // Setup integration for voice input processing
        voiceGuidance.chatIntegration = this;
      }

      console.log("✅ VoiceGuidance integration setup complete");
    } catch (error) {
      console.error("❌ Error setting up VoiceGuidance integration:", error);
    }
  }

  /* ========================================================================
     COMMUNICATION AND MESSAGE HANDLING
     ======================================================================== */

  /**
   * Registers a message handler for a specific message type
   * @param {string} messageType - Message type from MESSAGE_TYPES
   * @param {Function} handler - Handler function
   */
  registerMessageHandler(messageType, handler) {
    this.messageHandlers.set(messageType, handler);
  }

  /**
   * Sends a message through all available communication channels
   * @param {string} type - Message type
   * @param {Object} data - Message data
   * @param {Object} options - Send options
   */
  sendMessage(type, data = {}, options = {}) {
    try {
      const message = {
        type,
        data,
        timestamp: new Date().toISOString(),
        source: "wizardChatIntegration",
        ...options,
      };

      // PostMessage (for iframe communication)
      if (this.config.communication.postMessage) {
        if (this.isEmbedded && window.parent !== window) {
          window.parent.postMessage(message, "*");
        } else if (!this.isEmbedded) {
          // Send to chat iframe if it exists
          const chatIframe = document.getElementById("chatIframe");
          if (chatIframe && chatIframe.contentWindow) {
            chatIframe.contentWindow.postMessage(message, "*");
          }
        }
      }

      // LocalStorage (for cross-tab communication)
      if (
        this.config.communication.localStorage &&
        options.persistent !== false
      ) {
        const storageKey = `wizardChatMessage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem(storageKey, JSON.stringify(message));

        // Clean up old messages
        setTimeout(() => {
          localStorage.removeItem(storageKey);
        }, 60000); // Remove after 1 minute
      }

      // Custom events (for same-page communication)
      if (this.config.communication.eventDispatch) {
        const customEvent = new CustomEvent("wizardChatMessage", {
          detail: message,
        });
        window.dispatchEvent(customEvent);
      }

      console.log("📤 Message sent:", type, data);
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  }

  /**
   * Handles incoming PostMessage events
   * @param {MessageEvent} event - Message event
   */
  handlePostMessage(event) {
    try {
      if (!event.data || typeof event.data !== "object") return;

      this.processMessage(event.data);
    } catch (error) {
      console.error("❌ Error handling PostMessage:", error);
    }
  }

  /**
   * Handles localStorage events for cross-tab communication
   * @param {StorageEvent} event - Storage event
   */
  handleStorageEvent(event) {
    try {
      if (!event.key || !event.key.startsWith("wizardChatMessage_")) return;

      const message = JSON.parse(event.newValue);
      this.processMessage(message);
    } catch (error) {
      console.error("❌ Error handling storage event:", error);
    }
  }

  /**
   * Handles custom events for same-page communication
   * @param {CustomEvent} event - Custom event
   */
  handleCustomEvent(event) {
    try {
      if (!event.detail) return;

      this.processMessage(event.detail);
    } catch (error) {
      console.error("❌ Error handling custom event:", error);
    }
  }

  /**
   * Processes incoming messages
   * @param {Object} message - Message object
   */
  processMessage(message) {
    try {
      if (!message.type || message.source === "wizardChatIntegration") {
        return; // Ignore our own messages
      }

      const handler = this.messageHandlers.get(message.type);
      if (handler) {
        handler(message.data, message);
      } else {
        console.warn("🤷 No handler for message type:", message.type);
      }

      // Trigger general message received event
      if (this.onMessageReceived) {
        this.onMessageReceived(message);
      }
    } catch (error) {
      console.error("❌ Error processing message:", error);
    }
  }

  /* ========================================================================
     WIZARD EVENT HANDLERS
     ======================================================================== */

  /**
   * Notifies chat about framework selection
   * @param {Object} frameworkConfig - Selected framework configuration
   */
  notifyFrameworkSelected(frameworkConfig) {
    try {
      this.currentFramework = frameworkConfig;

      const message = {
        framework: frameworkConfig,
        chatContext: frameworkConfig.chatContext,
        guidance: this.getFrameworkGuidance(frameworkConfig.id),
      };

      this.sendMessage(MESSAGE_TYPES.WIZARD_FRAMEWORK_SELECTED, message);

      // Deliver proactive guidance
      if (this.config.messaging.proactiveGuidance) {
        this.deliverFrameworkGuidance(frameworkConfig);
      }
    } catch (error) {
      console.error("❌ Error notifying framework selection:", error);
    }
  }

  /**
   * Notifies chat about step changes
   * @param {number} step - Current step number
   * @param {Object} stepInfo - Step information
   */
  notifyStepChanged(step, stepInfo) {
    try {
      this.currentStep = step;

      const message = {
        step,
        stepInfo,
        progress: this.wizardEngine
          ? this.wizardEngine.getProgressPercentage()
          : 0,
        guidance: this.getStepGuidance(step, stepInfo),
      };

      this.sendMessage(MESSAGE_TYPES.WIZARD_STEP_CHANGED, message);

      // Deliver step-specific guidance
      if (this.config.guidance.stepAnnouncements) {
        this.deliverStepGuidance(step, stepInfo);
      }
    } catch (error) {
      console.error("❌ Error notifying step change:", error);
    }
  }

  /**
   * Notifies chat about progress updates
   * @param {number} progress - Progress percentage
   */
  notifyProgressUpdated(progress) {
    try {
      const message = {
        progress,
        step: this.currentStep,
        framework: this.currentFramework?.id,
        milestone: this.getProgressMilestone(progress),
      };

      this.sendMessage(MESSAGE_TYPES.WIZARD_PROGRESS_UPDATE, message);

      // Deliver milestone guidance
      if (this.config.guidance.progressMilestones && message.milestone) {
        this.deliverMilestoneGuidance(progress, message.milestone);
      }
    } catch (error) {
      console.error("❌ Error notifying progress update:", error);
    }
  }

  /**
   * Notifies chat about assessment completion
   * @param {Object} results - Assessment results
   */
  notifyAssessmentComplete(results) {
    try {
      const message = {
        results,
        recommendations: this.generateRecommendations(results),
        nextSteps: this.generateNextSteps(results),
      };

      this.sendMessage(MESSAGE_TYPES.WIZARD_ASSESSMENT_COMPLETE, message);

      // Deliver completion guidance
      if (this.config.guidance.completionCelebration) {
        this.deliverCompletionGuidance(results);
      }
    } catch (error) {
      console.error("❌ Error notifying assessment completion:", error);
    }
  }

  /* ========================================================================
     CHAT EVENT HANDLERS
     ======================================================================== */

  /**
   * Handles help requests from chat
   * @param {Object} data - Help request data
   */
  async handleChatHelpRequest(data) {
    try {
      const { topic, context, questionId } = data;

      let response = "";

      if (topic && HELP_RESPONSES[topic]) {
        // Specific topic help
        response = this.getTopicHelp(topic, context);
      } else if (questionId && this.wizardEngine) {
        // Question-specific help
        response = await this.getQuestionHelp(questionId);
      } else {
        // General contextual help
        response = this.getContextualHelp();
      }

      // Send response back to chat
      this.sendChatResponse(response, "help");
    } catch (error) {
      console.error("❌ Error handling help request:", error);
    }
  }

  /**
   * Handles navigation requests from chat
   * @param {Object} data - Navigation request data
   */
  async handleChatNavigationRequest(data) {
    try {
      const { action, target } = data;

      if (!this.wizardEngine) {
        this.sendChatResponse(
          "I can't control navigation right now. Please use the wizard interface directly.",
          "error",
        );
        return;
      }

      let success = false;
      let response = "";

      switch (action) {
        case "next":
          success = this.wizardEngine.nextStep();
          response = success
            ? "Moving to the next step!"
            : "Can't move forward. Please complete the current step.";
          break;

        case "previous":
          success = this.wizardEngine.previousStep();
          response = success
            ? "Going back to the previous step."
            : "Already at the first step.";
          break;

        case "goto":
          success = this.wizardEngine.goToStep(target, true);
          response = success
            ? `Jumping to step ${target}.`
            : `Can't navigate to step ${target}.`;
          break;

        default:
          response = "I didn't understand that navigation request.";
      }

      this.sendChatResponse(response, success ? "success" : "warning");
    } catch (error) {
      console.error("❌ Error handling navigation request:", error);
    }
  }

  /**
   * Handles explanation requests from chat
   * @param {Object} data - Explanation request data
   */
  async handleChatExplanationRequest(data) {
    try {
      const { questionId, concept, framework } = data;

      let explanation = "";

      if (questionId && this.wizardEngine) {
        explanation = await this.getQuestionExplanation(questionId);
      } else if (concept && framework) {
        explanation = this.getConceptExplanation(concept, framework);
      } else {
        explanation =
          "I'd be happy to explain! Could you be more specific about what you'd like to understand?";
      }

      this.sendChatResponse(explanation, "explanation");
    } catch (error) {
      console.error("❌ Error handling explanation request:", error);
    }
  }

  /**
   * Handles voice input from chat
   * @param {Object} data - Voice input data
   */
  processVoiceInput(transcript) {
    try {
      // Analyze the voice input for commands or questions
      const intent = this.analyzeVoiceIntent(transcript);

      switch (intent.type) {
        case "navigation":
          this.handleChatNavigationRequest({
            action: intent.action,
            target: intent.target,
          });
          break;

        case "help":
          this.handleChatHelpRequest({
            topic: intent.topic,
            context: intent.context,
          });
          break;

        case "explanation":
          this.handleChatExplanationRequest({
            concept: intent.concept,
            framework: this.currentFramework?.id,
          });
          break;

        default:
          this.sendChatResponse(
            `I heard: "${transcript}". How can I help you with your assessment?`,
            "voice",
          );
      }
    } catch (error) {
      console.error("❌ Error processing voice input:", error);
    }
  }

  /* ========================================================================
     GUIDANCE DELIVERY SYSTEM
     ======================================================================== */

  /**
   * Delivers framework-specific guidance
   * @param {Object} frameworkConfig - Framework configuration
   */
  async deliverFrameworkGuidance(frameworkConfig) {
    try {
      const guidance =
        GUIDANCE_TEMPLATES[frameworkConfig.id] || GUIDANCE_TEMPLATES.generic;
      const message = guidance.welcome;

      await this.sendChatResponse(message, "guidance");

      // Add framework-specific suggestions
      const suggestions = this.generateFrameworkSuggestions(frameworkConfig.id);
      if (suggestions.length > 0) {
        await this.sendChatSuggestions(suggestions);
      }
    } catch (error) {
      console.error("❌ Error delivering framework guidance:", error);
    }
  }

  /**
   * Delivers step-specific guidance
   * @param {number} step - Step number
   * @param {Object} stepInfo - Step information
   */
  async deliverStepGuidance(step, stepInfo) {
    try {
      const frameworkId = this.currentFramework?.id;
      const guidance = GUIDANCE_TEMPLATES[frameworkId];

      let message = "";

      if (guidance && guidance.steps && guidance.steps[step]) {
        message = guidance.steps[step];
      } else {
        message = `${GUIDANCE_TEMPLATES.generic.stepTransition} You're now on: ${stepInfo?.title || `Step ${step}`}.`;
      }

      await this.sendChatResponse(message, "step-guidance");
    } catch (error) {
      console.error("❌ Error delivering step guidance:", error);
    }
  }

  /**
   * Delivers milestone guidance at progress checkpoints
   * @param {number} progress - Progress percentage
   * @param {string} milestone - Milestone type
   */
  async deliverMilestoneGuidance(progress, milestone) {
    try {
      const messages = {
        quarter: `Great progress! You're 25% complete. Keep going - you're doing excellent work on this assessment.`,
        half: `Fantastic! You've reached the halfway point at ${Math.round(progress)}% complete. You're making excellent progress.`,
        threeQuarter: `Amazing! You're 75% through the assessment. You're almost done - just a few more steps to go.`,
        near_complete: `You're so close! At ${Math.round(progress)}% complete, you're nearly finished with your assessment.`,
      };

      const message = messages[milestone];
      if (message) {
        await this.sendChatResponse(message, "milestone");
      }
    } catch (error) {
      console.error("❌ Error delivering milestone guidance:", error);
    }
  }

  /**
   * Delivers completion guidance and recommendations
   * @param {Object} results - Assessment results
   */
  async deliverCompletionGuidance(results) {
    try {
      const frameworkId = results.frameworkId;
      const guidance = GUIDANCE_TEMPLATES[frameworkId];

      let message =
        guidance?.completion || GUIDANCE_TEMPLATES.generic.completion;

      await this.sendChatResponse(message, "completion");

      // Provide specific recommendations
      const recommendations = this.generateRecommendations(results);
      if (recommendations.length > 0) {
        const recMessage =
          "Based on your assessment, here are my key recommendations:\n\n" +
          recommendations
            .map(
              (rec, index) => `${index + 1}. ${rec.title}: ${rec.description}`,
            )
            .join("\n\n");

        await this.sendChatResponse(recMessage, "recommendations");
      }
    } catch (error) {
      console.error("❌ Error delivering completion guidance:", error);
    }
  }

  /* ========================================================================
     HELPER AND UTILITY METHODS
     ======================================================================== */

  /**
   * Sends a response message to the chat system
   * @param {string} message - Message text
   * @param {string} type - Message type for styling/handling
   */
  async sendChatResponse(message, type = "ai") {
    try {
      // Add to chat using existing chat system
      if (typeof addChatMessage === "function" && this.currentFramework) {
        addChatMessage(this.currentFramework.chatContext, "ai", message);
      }

      // Also send through integration channels
      this.sendMessage("CHAT_RESPONSE", {
        message,
        type,
        context: this.currentFramework?.chatContext,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("❌ Error sending chat response:", error);
    }
  }

  /**
   * Sends suggestion options to the chat
   * @param {Array} suggestions - Array of suggestion objects
   */
  async sendChatSuggestions(suggestions) {
    try {
      this.sendMessage("CHAT_SUGGESTIONS", {
        suggestions,
        context: this.currentFramework?.chatContext,
      });
    } catch (error) {
      console.error("❌ Error sending chat suggestions:", error);
    }
  }

  /**
   * Gets contextual help based on current wizard state
   * @returns {string} Help message
   */
  getContextualHelp() {
    try {
      if (!this.wizardEngine) {
        return (
          HELP_RESPONSES.frameworks.generic ||
          "I'm here to help with your compliance assessment!"
        );
      }

      const state = this.wizardEngine.getCurrentState();
      const frameworkId = state.selectedFramework;

      if (frameworkId && HELP_RESPONSES.frameworks[frameworkId]) {
        return HELP_RESPONSES.frameworks[frameworkId];
      }

      return `I can help you with your ${this.currentFramework?.name || "compliance"} assessment. Feel free to ask about any questions or requirements.`;
    } catch (error) {
      console.error("❌ Error getting contextual help:", error);
      return "I'm here to help! What would you like to know?";
    }
  }

  /**
   * Generates framework-specific suggestions
   * @param {string} frameworkId - Framework identifier
   * @returns {Array} Array of suggestion objects
   */
  generateFrameworkSuggestions(frameworkId) {
    const suggestions = {
      eu_ai_act: [
        {
          text: "What are the EU AI Act risk categories?",
          action: "explain_risk_categories",
        },
        {
          text: "How do I classify my AI system?",
          action: "help_classification",
        },
        {
          text: "What documentation is required?",
          action: "explain_documentation",
        },
      ],
      iso_27001: [
        { text: "What is an ISMS?", action: "explain_isms" },
        {
          text: "How do I conduct a risk assessment?",
          action: "help_risk_assessment",
        },
        { text: "What are Annex A controls?", action: "explain_controls" },
      ],
      gdpr: [
        {
          text: "What are the lawful bases for processing?",
          action: "explain_lawful_basis",
        },
        { text: "How do I handle data subject rights?", action: "help_dsar" },
        { text: "What is a DPIA?", action: "explain_dpia" },
      ],
    };

    return suggestions[frameworkId] || [];
  }

  /**
   * Generates recommendations based on assessment results
   * @param {Object} results - Assessment results
   * @returns {Array} Array of recommendation objects
   */
  generateRecommendations(results) {
    // This would be enhanced with AI-powered analysis
    return [
      {
        title: "Priority Documentation Review",
        description:
          "Focus on completing any missing documentation identified during the assessment.",
        priority: "high",
      },
      {
        title: "Staff Training Enhancement",
        description:
          "Consider expanding compliance training programs based on gaps identified.",
        priority: "medium",
      },
      {
        title: "Regular Assessment Schedule",
        description:
          "Establish periodic reviews to maintain compliance posture.",
        priority: "low",
      },
    ];
  }

  /**
   * Analyzes voice input to determine intent
   * @param {string} transcript - Voice transcript
   * @returns {Object} Intent object
   */
  analyzeVoiceIntent(transcript) {
    const lower = transcript.toLowerCase();

    // Navigation intents
    if (lower.includes("next") || lower.includes("continue")) {
      return { type: "navigation", action: "next" };
    }
    if (lower.includes("back") || lower.includes("previous")) {
      return { type: "navigation", action: "previous" };
    }

    // Help intents
    if (lower.includes("help") || lower.includes("explain")) {
      return { type: "help", topic: "general" };
    }

    // Default to general conversation
    return { type: "general", content: transcript };
  }

  /**
   * Gets progress milestone for a given percentage
   * @param {number} progress - Progress percentage
   * @returns {string|null} Milestone identifier
   */
  getProgressMilestone(progress) {
    if (progress >= 25 && progress < 30) return "quarter";
    if (progress >= 50 && progress < 55) return "half";
    if (progress >= 75 && progress < 80) return "threeQuarter";
    if (progress >= 90 && progress < 95) return "near_complete";
    return null;
  }

  /**
   * Starts context synchronization
   */
  startContextSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      this.syncContextFromWizard();
    }, this.config.contextSync.syncInterval);
  }

  /**
   * Synchronizes context from wizard to chat
   */
  syncContextFromWizard() {
    try {
      if (!this.wizardEngine) return;

      const context = {
        framework: this.currentFramework,
        step: this.currentStep,
        progress: this.wizardEngine.getProgressPercentage(),
        state: this.wizardEngine.getCurrentState(),
        timestamp: new Date().toISOString(),
      };

      this.sendMessage(MESSAGE_TYPES.CONTEXT_SYNC, context, {
        persistent: false,
      });
      this.lastSyncTime = context.timestamp;
    } catch (error) {
      console.error("❌ Error syncing context:", error);
    }
  }

  /**
   * Gets framework-specific guidance
   * @param {string} frameworkId - Framework identifier
   * @returns {Object} Guidance object
   */
  getFrameworkGuidance(frameworkId) {
    return GUIDANCE_TEMPLATES[frameworkId] || GUIDANCE_TEMPLATES.generic;
  }

  /**
   * Gets step-specific guidance
   * @param {number} step - Step number
   * @param {Object} stepInfo - Step information
   * @returns {string} Guidance message
   */
  getStepGuidance(step, stepInfo) {
    const frameworkId = this.currentFramework?.id;
    const guidance = GUIDANCE_TEMPLATES[frameworkId];

    return (
      guidance?.steps?.[step] ||
      `You're now on ${stepInfo?.title || `Step ${step}`}.`
    );
  }

  /**
   * Cleanup method
   */
  cleanup() {
    try {
      if (this.syncInterval) {
        clearInterval(this.syncInterval);
        this.syncInterval = null;
      }

      // Remove event listeners
      this.eventListeners.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
      });
      this.eventListeners = [];

      console.log("🧹 WizardChatIntegration cleanup complete");
    } catch (error) {
      console.error("❌ Error during cleanup:", error);
    }
  }
}

/* ==========================================================================
   GLOBAL EXPORTS AND INTEGRATION
   Export functions and setup for global access
   ========================================================================== */

// Create global instance
let globalWizardChatIntegration = null;

/**
 * Gets or creates the global wizard chat integration instance
 * @returns {WizardChatIntegration} Global integration instance
 */
function getWizardChatIntegration() {
  if (!globalWizardChatIntegration) {
    globalWizardChatIntegration = new WizardChatIntegration();
  }
  return globalWizardChatIntegration;
}

/**
 * Initializes wizard chat integration
 * @param {Object} config - Configuration options
 * @returns {Promise<boolean>} Success status
 */
async function initializeWizardChatIntegration(config = {}) {
  const integration = getWizardChatIntegration();
  return await integration.initialize(config);
}

/**
 * Connects all systems together
 * @param {Object} wizardEngine - WizardEngine instance
 * @param {Object} voiceGuidance - VoiceGuidance instance
 */
function connectAllSystems(wizardEngine, voiceGuidance) {
  const integration = getWizardChatIntegration();

  // Connect wizard engine
  if (wizardEngine) {
    integration.setWizardEngine(wizardEngine);
    wizardEngine.setChatIntegration(integration);
  }

  // Connect voice guidance
  if (voiceGuidance) {
    integration.setVoiceGuidance(voiceGuidance);
    voiceGuidance.chatIntegration = integration;
  }

  console.log("🔗 All systems connected successfully");
}

// Export to global scope
if (typeof window !== "undefined") {
  window.WizardChatIntegration = WizardChatIntegration;
  window.getWizardChatIntegration = getWizardChatIntegration;
  window.initializeWizardChatIntegration = initializeWizardChatIntegration;
  window.connectAllSystems = connectAllSystems;
  window.MESSAGE_TYPES = MESSAGE_TYPES;
  window.GUIDANCE_TEMPLATES = GUIDANCE_TEMPLATES;
}

// Export for module use
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    WizardChatIntegration,
    getWizardChatIntegration,
    initializeWizardChatIntegration,
    connectAllSystems,
    MESSAGE_TYPES,
    GUIDANCE_TEMPLATES,
  };
}

console.log("✅ WizardChatIntegration module loaded successfully");
