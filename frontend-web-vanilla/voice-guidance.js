// voice-guidance.js - Enhanced AI Avatar Integration and Voice Features
// Comprehensive voice guidance system with avatar animations, TTS/STT, and wizard integration
// Integrates with WizardEngine, chatLogic.js, and existing avatar systems

/* ==========================================================================
   VOICE GUIDANCE CONFIGURATION
   Settings and configurations for voice features and avatar behavior
   ========================================================================== */

/**
 * Voice guidance configuration with comprehensive settings
 */
const VOICE_GUIDANCE_CONFIG = {
  // Voice synthesis settings
  tts: {
    enabled: true,
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    voice: null, // Will be set based on user preference
    lang: "en-US",
  },

  // Speech recognition settings
  stt: {
    enabled: false,
    continuous: false,
    interimResults: false,
    lang: "en-US",
    confidence: 0.8,
  },

  // Avatar behavior settings
  avatar: {
    enabled: false,
    type: "static", // 'static' or 'video'
    animations: true,
    lipSync: false,
    emotionalResponses: true,
  },

  // Guidance behavior
  guidance: {
    autoPlay: true,
    announceSteps: true,
    contextualHelp: true,
    encouragement: true,
    warningsAndErrors: true,
  },

  // Audio settings
  audio: {
    masterVolume: 1.0,
    fadeInDuration: 500,
    fadeOutDuration: 300,
    backgroundAudio: false,
  },
};

/**
 * Avatar state definitions for different interaction modes
 */
const AVATAR_STATES = {
  IDLE: "idle",
  SPEAKING: "speaking",
  LISTENING: "listening",
  THINKING: "thinking",
  CELEBRATING: "celebrating",
  CONCERNED: "concerned",
  ENCOURAGING: "encouraging",
};

/**
 * Voice prompts and guidance text for different scenarios
 */
const VOICE_PROMPTS = {
  // Framework selection prompts
  frameworkSelection: {
    welcome:
      "Welcome to ArionComply! I'm your AI compliance assistant. Please select a compliance framework to begin your assessment.",
    selected: (framework) =>
      `Excellent choice! You've selected the ${framework} assessment. This will take approximately {estimatedTime} to complete and involves {stepCount} steps.`,
    ready: "I'm here to guide you through each step. Shall we begin?",
  },

  // Step navigation prompts
  stepNavigation: {
    stepAnnouncement: (step, title) =>
      `Step ${step}: ${title}. Let me guide you through this section.`,
    stepComplete: "Great work on that step! You're making excellent progress.",
    stepProgress: (current, total) =>
      `You're now on step ${current} of ${total}. You're ${Math.round((current / total) * 100)}% through the assessment.`,
    finalStep:
      "This is the final step of your assessment. Let's complete this together!",
  },

  // Question guidance prompts
  questionGuidance: {
    questionIntro: "Let me help you understand this question.",
    questionExplanation: (question) => `This question asks: ${question}`,
    helpAvailable:
      "If you need more information about this question, just ask me for help.",
    validationError:
      "It looks like this field needs some attention. Please make sure to provide a complete answer.",
    answerSaved: "Perfect! Your answer has been saved.",
  },

  // Progress and encouragement prompts
  encouragement: {
    quarterComplete: "Fantastic! You're 25% complete. Keep up the great work!",
    halfComplete: "Amazing progress! You're halfway through the assessment.",
    threeQuarterComplete: "Excellent! You're 75% complete. You're almost done!",
    almostComplete:
      "You're almost there! Just a few more questions to complete your assessment.",
    completed:
      "Congratulations! You've successfully completed your compliance assessment. Well done!",
  },

  // Error and help prompts
  assistance: {
    helpRequest:
      "I'm here to help! What specific question or topic would you like assistance with?",
    technicalError:
      "I encountered a technical issue, but don't worry - your progress is saved. Please try again.",
    connectionError:
      "There seems to be a connection issue. Your answers are saved locally, so you won't lose any progress.",
    generalHelp:
      "I can help explain questions, provide context about compliance requirements, or assist with navigation. What would you like to know?",
  },

  // Framework-specific prompts
  frameworkSpecific: {
    eu_ai_act: {
      welcome:
        "Welcome to the EU AI Act compliance assessment. I'll help you classify your AI system and understand your obligations under European AI regulations.",
      riskClassification:
        "We'll work together to determine if your AI system is prohibited, high-risk, limited-risk, or minimal-risk.",
      completion:
        "You've completed your EU AI Act assessment. Based on your answers, I can provide specific guidance on your compliance obligations.",
    },
    iso_27001: {
      welcome:
        "Welcome to the ISO 27001 Information Security Management System assessment. I'll guide you through evaluating your security controls.",
      scopeDefinition:
        "Let's start by defining the scope of your Information Security Management System.",
      completion:
        "Excellent! You've completed your ISO 27001 assessment. This gives us a comprehensive view of your security posture.",
    },
    iso_42001: {
      welcome:
        "Welcome to the ISO 42001 AI Management System assessment. We'll evaluate your AI governance practices together.",
      aiGovernance:
        "Let's explore how your organization manages AI systems throughout their lifecycle.",
      completion:
        "Well done! Your ISO 42001 assessment is complete. You now have a clear picture of your AI management capabilities.",
    },
    gdpr: {
      welcome:
        "Welcome to the GDPR privacy compliance assessment. I'll help you evaluate your data protection practices.",
      dataProcessing:
        "Let's examine how your organization processes personal data and protects individual rights.",
      completion:
        "Congratulations! You've completed your GDPR assessment. This provides valuable insights into your privacy compliance.",
    },
  },
};

/* ==========================================================================
   VOICE GUIDANCE CLASS
   Main class for managing AI avatar and voice interactions
   ========================================================================== */

/**
 * VoiceGuidance - Comprehensive voice and avatar guidance system
 * Handles TTS, STT, avatar animations, and contextual guidance
 */
class VoiceGuidance {
  constructor() {
    this.config = { ...VOICE_GUIDANCE_CONFIG };
    this.currentState = AVATAR_STATES.IDLE;
    this.isInitialized = false;
    this.isSpeaking = false;
    this.isListening = false;
    this.currentUtterance = null;
    this.recognition = null;
    this.avatarElement = null;
    this.statusElement = null;

    // Integration references
    this.wizardEngine = null;
    this.chatIntegration = null;

    // Event handlers
    this.onStateChanged = null;
    this.onSpeechStart = null;
    this.onSpeechEnd = null;
    this.onListeningStart = null;
    this.onListeningEnd = null;
    this.onError = null;

    console.log("🎤 VoiceGuidance initialized");
  }

  /* ========================================================================
     INITIALIZATION AND SETUP
     ======================================================================== */

  /**
   * Initializes the voice guidance system
   * @param {Object} options - Configuration options
   * @returns {Promise<boolean>} Success status
   */
  async initialize(options = {}) {
    try {
      // Merge configuration options
      this.config = { ...this.config, ...options };

      // Initialize speech synthesis
      await this.initializeTTS();

      // Initialize speech recognition if enabled
      if (this.config.stt.enabled) {
        await this.initializeSTT();
      }

      // Find and setup avatar elements
      this.setupAvatarElements();

      // Load saved settings
      this.loadSettings();

      this.isInitialized = true;
      console.log("✅ VoiceGuidance initialized successfully");

      return true;
    } catch (error) {
      console.error("❌ Error initializing VoiceGuidance:", error);
      return false;
    }
  }

  /**
   * Initializes Text-to-Speech functionality
   */
  async initializeTTS() {
    try {
      if (!("speechSynthesis" in window)) {
        console.warn("Speech synthesis not supported");
        this.config.tts.enabled = false;
        return;
      }

      // Wait for voices to load
      if (speechSynthesis.getVoices().length === 0) {
        await new Promise((resolve) => {
          speechSynthesis.addEventListener("voiceschanged", resolve, {
            once: true,
          });
          setTimeout(resolve, 1000); // Fallback timeout
        });
      }

      // Select best voice
      this.selectBestVoice();

      console.log("✅ TTS initialized");
    } catch (error) {
      console.error("❌ Error initializing TTS:", error);
      this.config.tts.enabled = false;
    }
  }

  /**
   * Initializes Speech-to-Text functionality
   */
  async initializeSTT() {
    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        console.warn("Speech recognition not supported");
        this.config.stt.enabled = false;
        return;
      }

      this.recognition = new SpeechRecognition();
      this.recognition.continuous = this.config.stt.continuous;
      this.recognition.interimResults = this.config.stt.interimResults;
      this.recognition.lang = this.config.stt.lang;

      // Setup event handlers
      this.recognition.onstart = () => {
        this.isListening = true;
        this.setState(AVATAR_STATES.LISTENING);
        if (this.onListeningStart) this.onListeningStart();
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.setState(AVATAR_STATES.IDLE);
        if (this.onListeningEnd) this.onListeningEnd();
      };

      this.recognition.onresult = (event) => {
        this.handleSpeechResult(event);
      };

      this.recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        this.handleError("Speech recognition error: " + event.error);
      };

      console.log("✅ STT initialized");
    } catch (error) {
      console.error("❌ Error initializing STT:", error);
      this.config.stt.enabled = false;
    }
  }

  /**
   * Sets up avatar elements and references
   */
  setupAvatarElements() {
    try {
      // Find avatar elements
      this.avatarElement =
        document.getElementById("avatarImage") ||
        document.getElementById("avatarVideo");
      this.statusElement = document.getElementById("avatarStatus");

      // Setup avatar container if it exists
      const avatarContainer = document.querySelector(".avatar-container");
      if (avatarContainer) {
        this.setupAvatarAnimations(avatarContainer);
      }

      console.log("✅ Avatar elements setup complete");
    } catch (error) {
      console.error("❌ Error setting up avatar elements:", error);
    }
  }

  /**
   * Sets up avatar animations and state changes
   * @param {HTMLElement} container - Avatar container element
   */
  setupAvatarAnimations(container) {
    try {
      // Add CSS classes for different states if not already present
      const style = document.createElement("style");
      style.textContent = `
        .avatar-state-speaking .avatar-image,
        .avatar-state-speaking .avatar-video {
          border-color: var(--success-green, #10b981);
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
        }
        
        .avatar-state-listening .avatar-image,
        .avatar-state-listening .avatar-video {
          border-color: var(--warning-amber, #f59e0b);
          animation: avatar-pulse 1.5s infinite;
        }
        
        .avatar-state-thinking .avatar-image,
        .avatar-state-thinking .avatar-video {
          border-color: var(--primary-blue, #3b82f6);
          animation: avatar-rotate 2s linear infinite;
        }
        
        .avatar-state-celebrating .avatar-image,
        .avatar-state-celebrating .avatar-video {
          border-color: var(--success-green, #10b981);
          animation: avatar-bounce 0.6s ease-in-out 3;
        }
        
        @keyframes avatar-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.02); opacity: 0.8; }
        }
        
        @keyframes avatar-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes avatar-bounce {
          0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
          40%, 43% { transform: translateY(-8px); }
          70% { transform: translateY(-4px); }
        }
      `;

      if (!document.getElementById("avatar-animations-style")) {
        style.id = "avatar-animations-style";
        document.head.appendChild(style);
      }
    } catch (error) {
      console.error("❌ Error setting up avatar animations:", error);
    }
  }

  /* ========================================================================
     VOICE SYNTHESIS AND SPEECH
     ======================================================================== */

  /**
   * Speaks the given text with avatar animation
   * @param {string} text - Text to speak
   * @param {Object} options - Speech options
   * @returns {Promise<boolean>} Success status
   */
  async speak(text, options = {}) {
    try {
      if (!this.config.tts.enabled || !text) {
        return false;
      }

      // Stop any current speech
      this.stopSpeaking();

      // Create utterance
      this.currentUtterance = new SpeechSynthesisUtterance(text);

      // Apply settings
      this.currentUtterance.rate = options.rate || this.config.tts.rate;
      this.currentUtterance.pitch = options.pitch || this.config.tts.pitch;
      this.currentUtterance.volume = options.volume || this.config.tts.volume;
      this.currentUtterance.lang = options.lang || this.config.tts.lang;

      if (this.config.tts.voice) {
        this.currentUtterance.voice = this.config.tts.voice;
      }

      // Setup event handlers
      return new Promise((resolve) => {
        this.currentUtterance.onstart = () => {
          this.isSpeaking = true;
          this.setState(AVATAR_STATES.SPEAKING);
          this.updateStatus("Speaking...");
          if (this.onSpeechStart) this.onSpeechStart();
        };

        this.currentUtterance.onend = () => {
          this.isSpeaking = false;
          this.setState(AVATAR_STATES.IDLE);
          this.updateStatus("Ready to assist");
          if (this.onSpeechEnd) this.onSpeechEnd();
          resolve(true);
        };

        this.currentUtterance.onerror = (event) => {
          console.error("Speech synthesis error:", event.error);
          this.handleError("Speech error: " + event.error);
          resolve(false);
        };

        // Start speaking
        speechSynthesis.speak(this.currentUtterance);
      });
    } catch (error) {
      console.error("❌ Error speaking:", error);
      return false;
    }
  }

  /**
   * Stops current speech
   */
  stopSpeaking() {
    try {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }

      this.isSpeaking = false;
      this.currentUtterance = null;

      if (this.currentState === AVATAR_STATES.SPEAKING) {
        this.setState(AVATAR_STATES.IDLE);
      }
    } catch (error) {
      console.error("❌ Error stopping speech:", error);
    }
  }

  /**
   * Selects the best available voice for TTS
   */
  selectBestVoice() {
    try {
      const voices = speechSynthesis.getVoices();

      // Preferred voice characteristics
      const preferences = [
        (voice) => voice.lang.startsWith("en") && voice.name.includes("Neural"),
        (voice) =>
          voice.lang.startsWith("en") && voice.name.includes("Premium"),
        (voice) => voice.lang.startsWith("en") && voice.localService,
        (voice) => voice.lang.startsWith("en"),
        (voice) => voice.default,
      ];

      for (const preference of preferences) {
        const voice = voices.find(preference);
        if (voice) {
          this.config.tts.voice = voice;
          console.log("🎵 Selected voice:", voice.name);
          return;
        }
      }

      // Fallback to first available voice
      if (voices.length > 0) {
        this.config.tts.voice = voices[0];
        console.log("🎵 Using fallback voice:", voices[0].name);
      }
    } catch (error) {
      console.error("❌ Error selecting voice:", error);
    }
  }

  /* ========================================================================
     SPEECH RECOGNITION AND LISTENING
     ======================================================================== */

  /**
   * Starts listening for voice input
   * @returns {Promise<string>} Recognized text or null
   */
  async startListening() {
    try {
      if (!this.config.stt.enabled || !this.recognition) {
        throw new Error("Speech recognition not available");
      }

      if (this.isListening) {
        return null;
      }

      return new Promise((resolve, reject) => {
        let resolved = false;

        const cleanup = () => {
          if (!resolved) {
            resolved = true;
            this.recognition.onresult = null;
            this.recognition.onerror = null;
          }
        };

        this.recognition.onresult = (event) => {
          cleanup();
          const transcript = event.results[0][0].transcript;
          const confidence = event.results[0][0].confidence;

          if (confidence >= this.config.stt.confidence) {
            resolve(transcript);
          } else {
            resolve(null);
          }
        };

        this.recognition.onerror = (event) => {
          cleanup();
          reject(new Error(event.error));
        };

        // Start recognition
        this.recognition.start();

        // Timeout after 10 seconds
        setTimeout(() => {
          if (!resolved) {
            cleanup();
            this.stopListening();
            resolve(null);
          }
        }, 10000);
      });
    } catch (error) {
      console.error("❌ Error starting listening:", error);
      throw error;
    }
  }

  /**
   * Stops listening for voice input
   */
  stopListening() {
    try {
      if (this.recognition && this.isListening) {
        this.recognition.stop();
      }
    } catch (error) {
      console.error("❌ Error stopping listening:", error);
    }
  }

  /**
   * Handles speech recognition results
   * @param {Event} event - Speech recognition event
   */
  handleSpeechResult(event) {
    try {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      const confidence = result[0].confidence;

      console.log(
        "🎤 Speech recognized:",
        transcript,
        "Confidence:",
        confidence,
      );

      // Process the recognized speech
      this.processSpeechInput(transcript, confidence);
    } catch (error) {
      console.error("❌ Error handling speech result:", error);
    }
  }

  /**
   * Processes recognized speech input
   * @param {string} transcript - Recognized text
   * @param {number} confidence - Recognition confidence
   */
  processSpeechInput(transcript, confidence) {
    try {
      if (confidence < this.config.stt.confidence) {
        this.speak("I didn't quite catch that. Could you please repeat?");
        return;
      }

      // Simple command processing
      const lowerTranscript = transcript.toLowerCase();

      if (lowerTranscript.includes("help")) {
        this.provideContextualHelp();
      } else if (lowerTranscript.includes("next")) {
        this.announceStepNavigation("next");
      } else if (
        lowerTranscript.includes("previous") ||
        lowerTranscript.includes("back")
      ) {
        this.announceStepNavigation("previous");
      } else if (lowerTranscript.includes("repeat")) {
        this.repeatLastGuidance();
      } else {
        // Pass to chat integration for processing
        if (this.chatIntegration) {
          this.chatIntegration.processVoiceInput(transcript);
        }
      }
    } catch (error) {
      console.error("❌ Error processing speech input:", error);
    }
  }

  /* ========================================================================
     AVATAR STATE AND ANIMATION MANAGEMENT
     ======================================================================== */

  /**
   * Sets the avatar state and triggers animations
   * @param {string} state - Avatar state from AVATAR_STATES
   */
  setState(state) {
    try {
      if (this.currentState === state) return;

      const previousState = this.currentState;
      this.currentState = state;

      // Update avatar container classes
      const avatarContainer = document.querySelector(".avatar-container");
      if (avatarContainer) {
        // Remove all state classes
        Object.values(AVATAR_STATES).forEach((s) => {
          avatarContainer.classList.remove(`avatar-state-${s}`);
        });

        // Add new state class
        avatarContainer.classList.add(`avatar-state-${state}`);
      }

      // Handle video avatar if present
      this.handleVideoAvatarState(state);

      // Trigger state change event
      if (this.onStateChanged) {
        this.onStateChanged(state, previousState);
      }

      console.log(`🤖 Avatar state changed: ${previousState} → ${state}`);
    } catch (error) {
      console.error("❌ Error setting avatar state:", error);
    }
  }

  /**
   * Handles video avatar state changes
   * @param {string} state - Avatar state
   */
  handleVideoAvatarState(state) {
    try {
      const videoElement = document.getElementById("avatarVideo");
      if (!videoElement || videoElement.style.display === "none") return;

      switch (state) {
        case AVATAR_STATES.SPEAKING:
          videoElement.play().catch(console.warn);
          break;
        case AVATAR_STATES.IDLE:
        case AVATAR_STATES.LISTENING:
        case AVATAR_STATES.THINKING:
          videoElement.pause();
          videoElement.currentTime = 0;
          break;
      }
    } catch (error) {
      console.error("❌ Error handling video avatar state:", error);
    }
  }

  /**
   * Updates the avatar status text
   * @param {string} status - Status message
   */
  updateStatus(status) {
    try {
      if (this.statusElement) {
        this.statusElement.textContent = status;
      }
    } catch (error) {
      console.error("❌ Error updating status:", error);
    }
  }

  /* ========================================================================
     WIZARD INTEGRATION AND GUIDANCE
     ======================================================================== */

  /**
   * Sets up integration with wizard engine
   * @param {Object} wizardEngine - WizardEngine instance
   */
  setWizardEngine(wizardEngine) {
    this.wizardEngine = wizardEngine;

    // Setup event handlers
    if (wizardEngine) {
      wizardEngine.onFrameworkSelected = (config) =>
        this.handleFrameworkSelected(config);
      wizardEngine.onStepChanged = (step, stepInfo) =>
        this.handleStepChanged(step, stepInfo);
      wizardEngine.onProgressUpdated = (progress) =>
        this.handleProgressUpdated(progress);
      wizardEngine.onAssessmentComplete = (results) =>
        this.handleAssessmentComplete(results);
    }
  }

  /**
   * Handles framework selection events
   * @param {Object} frameworkConfig - Selected framework configuration
   */
  async handleFrameworkSelected(frameworkConfig) {
    try {
      if (!this.config.guidance.announceSteps) return;

      const welcomePrompt =
        VOICE_PROMPTS.frameworkSpecific[frameworkConfig.id]?.welcome ||
        frameworkConfig.voiceWelcome ||
        VOICE_PROMPTS.frameworkSelection.selected(frameworkConfig.name);

      await this.speak(welcomePrompt);

      // Brief pause before asking if ready
      setTimeout(async () => {
        await this.speak(VOICE_PROMPTS.frameworkSelection.ready);
      }, 1000);
    } catch (error) {
      console.error("❌ Error handling framework selection:", error);
    }
  }

  /**
   * Handles step change events
   * @param {number} step - Current step number
   * @param {Object} stepInfo - Step information object
   */
  async handleStepChanged(step, stepInfo) {
    try {
      if (!this.config.guidance.announceSteps || !stepInfo) return;

      const announcement = VOICE_PROMPTS.stepNavigation.stepAnnouncement(
        step,
        stepInfo.title,
      );
      await this.speak(announcement);
    } catch (error) {
      console.error("❌ Error handling step change:", error);
    }
  }

  /**
   * Handles progress update events
   * @param {number} progress - Progress percentage
   */
  async handleProgressUpdated(progress) {
    try {
      if (!this.config.guidance.encouragement) return;

      // Provide encouragement at key milestones
      if (progress >= 25 && progress < 30 && !this.hasGiven("quarter")) {
        await this.speak(VOICE_PROMPTS.encouragement.quarterComplete);
        this.markGiven("quarter");
      } else if (progress >= 50 && progress < 55 && !this.hasGiven("half")) {
        await this.speak(VOICE_PROMPTS.encouragement.halfComplete);
        this.markGiven("half");
      } else if (
        progress >= 75 &&
        progress < 80 &&
        !this.hasGiven("threeQuarter")
      ) {
        await this.speak(VOICE_PROMPTS.encouragement.threeQuarterComplete);
        this.markGiven("threeQuarter");
      } else if (progress >= 90 && progress < 95 && !this.hasGiven("almost")) {
        await this.speak(VOICE_PROMPTS.encouragement.almostComplete);
        this.markGiven("almost");
      }
    } catch (error) {
      console.error("❌ Error handling progress update:", error);
    }
  }

  /**
   * Handles assessment completion events
   * @param {Object} results - Assessment results
   */
  async handleAssessmentComplete(results) {
    try {
      this.setState(AVATAR_STATES.CELEBRATING);

      const completionPrompt =
        VOICE_PROMPTS.frameworkSpecific[results.frameworkId]?.completion ||
        VOICE_PROMPTS.encouragement.completed;

      await this.speak(completionPrompt);

      // Reset encouragement flags for next assessment
      this.resetEncouragementFlags();
    } catch (error) {
      console.error("❌ Error handling assessment completion:", error);
    }
  }

  /**
   * Announces step navigation
   * @param {string} direction - 'next' or 'previous'
   */
  async announceStepNavigation(direction) {
    try {
      if (!this.wizardEngine) return;

      const currentState = this.wizardEngine.getCurrentState();

      if (direction === "next") {
        if (this.wizardEngine.nextStep()) {
          await this.speak(VOICE_PROMPTS.stepNavigation.stepComplete);
        }
      } else if (direction === "previous") {
        if (this.wizardEngine.previousStep()) {
          await this.speak(
            `Going back to step ${currentState.currentStep - 1}.`,
          );
        }
      }
    } catch (error) {
      console.error("❌ Error announcing step navigation:", error);
    }
  }

  /* ========================================================================
     CONTEXTUAL HELP AND ASSISTANCE
     ======================================================================== */

  /**
   * Provides contextual help based on current wizard state
   */
  async provideContextualHelp() {
    try {
      if (!this.wizardEngine) {
        await this.speak(VOICE_PROMPTS.assistance.generalHelp);
        return;
      }

      const currentState = this.wizardEngine.getCurrentState();
      const stepInfo = this.wizardEngine.getCurrentStepInfo();

      if (stepInfo) {
        const helpText = `You're currently on ${stepInfo.title}. ${stepInfo.description}. ${VOICE_PROMPTS.questionGuidance.helpAvailable}`;
        await this.speak(helpText);
      } else {
        await this.speak(VOICE_PROMPTS.assistance.helpRequest);
      }
    } catch (error) {
      console.error("❌ Error providing contextual help:", error);
    }
  }

  /**
   * Explains a specific question
   * @param {Object} question - Question object
   */
  async explainQuestion(question) {
    try {
      if (!question) return;

      const explanation = VOICE_PROMPTS.questionGuidance.questionExplanation(
        question.question,
      );
      await this.speak(explanation);

      // Provide additional context if available
      if (question.info || question.description) {
        const context = question.info || question.description;
        await this.speak(context);
      }
    } catch (error) {
      console.error("❌ Error explaining question:", error);
    }
  }

  /**
   * Confirms answer submission
   * @param {string} questionId - Question identifier
   * @param {any} value - Answer value
   */
  async confirmAnswer(questionId, value) {
    try {
      if (!this.config.guidance.contextualHelp) return;

      await this.speak(VOICE_PROMPTS.questionGuidance.answerSaved);
    } catch (error) {
      console.error("❌ Error confirming answer:", error);
    }
  }

  /**
   * Announces validation errors
   * @param {string} error - Error message
   */
  async announceValidationError(error) {
    try {
      if (!this.config.guidance.warningsAndErrors) return;

      this.setState(AVATAR_STATES.CONCERNED);
      await this.speak(VOICE_PROMPTS.questionGuidance.validationError);

      setTimeout(() => {
        if (this.currentState === AVATAR_STATES.CONCERNED) {
          this.setState(AVATAR_STATES.IDLE);
        }
      }, 2000);
    } catch (error) {
      console.error("❌ Error announcing validation error:", error);
    }
  }

  /* ========================================================================
     SETTINGS AND CONFIGURATION
     ======================================================================== */

  /**
   * Updates voice guidance configuration
   * @param {Object} newConfig - New configuration options
   */
  updateConfig(newConfig) {
    try {
      this.config = { ...this.config, ...newConfig };
      this.saveSettings();
      console.log("⚙️ Voice guidance configuration updated");
    } catch (error) {
      console.error("❌ Error updating configuration:", error);
    }
  }

  /**
   * Saves current settings to localStorage
   */
  saveSettings() {
    try {
      const settings = {
        config: this.config,
        version: "2.1.0",
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem("voiceGuidanceSettings", JSON.stringify(settings));
    } catch (error) {
      console.error("❌ Error saving settings:", error);
    }
  }

  /**
   * Loads settings from localStorage
   */
  loadSettings() {
    try {
      const saved = localStorage.getItem("voiceGuidanceSettings");
      if (!saved) return;

      const settings = JSON.parse(saved);
      if (settings.config) {
        this.config = { ...this.config, ...settings.config };
        console.log("⚙️ Voice guidance settings loaded");
      }
    } catch (error) {
      console.error("❌ Error loading settings:", error);
    }
  }

  /* ========================================================================
     UTILITY AND HELPER METHODS
     ======================================================================== */

  /**
   * Handles errors and provides user feedback
   * @param {string} error - Error message
   */
  handleError(error) {
    try {
      console.error("VoiceGuidance error:", error);

      this.setState(AVATAR_STATES.CONCERNED);

      if (this.config.guidance.warningsAndErrors) {
        this.speak(VOICE_PROMPTS.assistance.technicalError);
      }

      if (this.onError) {
        this.onError(error);
      }

      // Reset state after error
      setTimeout(() => {
        if (this.currentState === AVATAR_STATES.CONCERNED) {
          this.setState(AVATAR_STATES.IDLE);
        }
      }, 3000);
    } catch (err) {
      console.error("❌ Error in error handler:", err);
    }
  }

  /**
   * Tracks whether encouragement has been given
   * @param {string} type - Encouragement type
   * @returns {boolean} Whether it has been given
   */
  hasGiven(type) {
    const key = `encouragement_${type}_${this.wizardEngine?.sessionId || "unknown"}`;
    return localStorage.getItem(key) === "true";
  }

  /**
   * Marks encouragement as given
   * @param {string} type - Encouragement type
   */
  markGiven(type) {
    const key = `encouragement_${type}_${this.wizardEngine?.sessionId || "unknown"}`;
    localStorage.setItem(key, "true");
  }

  /**
   * Resets encouragement flags
   */
  resetEncouragementFlags() {
    const sessionId = this.wizardEngine?.sessionId || "unknown";
    ["quarter", "half", "threeQuarter", "almost"].forEach((type) => {
      const key = `encouragement_${type}_${sessionId}`;
      localStorage.removeItem(key);
    });
  }

  /**
   * Repeats the last guidance message
   */
  async repeatLastGuidance() {
    try {
      // This would require storing the last message
      await this.speak("Let me repeat the current guidance for you.");
    } catch (error) {
      console.error("❌ Error repeating guidance:", error);
    }
  }

  /**
   * Gets current voice guidance state
   * @returns {Object} Current state information
   */
  getCurrentState() {
    return {
      isInitialized: this.isInitialized,
      isSpeaking: this.isSpeaking,
      isListening: this.isListening,
      currentState: this.currentState,
      config: { ...this.config },
      ttsAvailable: "speechSynthesis" in window,
      sttAvailable:
        "webkitSpeechRecognition" in window || "SpeechRecognition" in window,
    };
  }

  /**
   * Enables or disables voice guidance
   * @param {boolean} enabled - Whether to enable voice guidance
   */
  setEnabled(enabled) {
    this.config.tts.enabled = enabled;
    this.config.guidance.autoPlay = enabled;

    if (!enabled) {
      this.stopSpeaking();
      this.stopListening();
      this.setState(AVATAR_STATES.IDLE);
    }

    this.saveSettings();
  }
}

/* ==========================================================================
   GLOBAL EXPORTS AND INTEGRATION
   Export functions and setup for global access
   ========================================================================== */

// Create global instance
let globalVoiceGuidance = null;

/**
 * Gets or creates the global voice guidance instance
 * @returns {VoiceGuidance} Global voice guidance instance
 */
function getVoiceGuidance() {
  if (!globalVoiceGuidance) {
    globalVoiceGuidance = new VoiceGuidance();
  }
  return globalVoiceGuidance;
}

/**
 * Initializes voice guidance with configuration
 * @param {Object} config - Configuration options
 * @returns {Promise<boolean>} Success status
 */
async function initializeVoiceGuidance(config = {}) {
  const guidance = getVoiceGuidance();
  return await guidance.initialize(config);
}

/**
 * Quick integration with wizard engine
 * @param {Object} wizardEngine - WizardEngine instance
 */
function connectVoiceGuidanceToWizard(wizardEngine) {
  const guidance = getVoiceGuidance();
  guidance.setWizardEngine(wizardEngine);
  wizardEngine.setVoiceGuidance(guidance);
}

// Export to global scope
if (typeof window !== "undefined") {
  window.VoiceGuidance = VoiceGuidance;
  window.getVoiceGuidance = getVoiceGuidance;
  window.initializeVoiceGuidance = initializeVoiceGuidance;
  window.connectVoiceGuidanceToWizard = connectVoiceGuidanceToWizard;
  window.VOICE_PROMPTS = VOICE_PROMPTS;
  window.AVATAR_STATES = AVATAR_STATES;
}

// Export for module use
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    VoiceGuidance,
    getVoiceGuidance,
    initializeVoiceGuidance,
    connectVoiceGuidanceToWizard,
    VOICE_PROMPTS,
    AVATAR_STATES,
  };
}

console.log("✅ VoiceGuidance module loaded successfully");
