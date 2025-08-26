// scripts.js - Enhanced Complete Version with Wizard Integration
// Core utility functions for ArionComply with enhanced wizard support
// Builds on existing functionality and adds complete wizard integration

/* 


   =======================================================================
   CHAT FUNCTIONS
   Enhanced functions for managing the AI chat popup interface
   ========================================================================== */

/**
 * Toggles the visibility of the AI chat popup
 * Enhanced with wizard context awareness and state management
 */
function toggleChat() {
  try {
    const chatPopup = document.getElementById("chatPopup");
    if (!chatPopup) {
      console.warn("Chat popup element not found");
      return;
    }

    // Toggle the 'active' class which controls visibility via CSS
    const isCurrentlyActive = chatPopup.classList.contains("active");

    if (isCurrentlyActive) {
      chatPopup.classList.remove("active");
      console.log("💬 Chat closed");
    } else {
      chatPopup.classList.add("active");

      // Update chat context based on current wizard state
      updateChatContextFromWizard();

      // Focus on input field for better UX
      setTimeout(() => {
        const chatInput = chatPopup.querySelector(".chat-input");
        if (chatInput) {
          chatInput.focus();
        }
      }, 100);

      console.log("💬 Chat opened");
    }
  } catch (error) {
    console.error("❌ Error toggling chat:", error);
  }
}

/**
 * Updates chat context based on current wizard state
 * Provides context-aware AI assistance during assessments
 */
function updateChatContextFromWizard() {
  try {
    // Check if we're in a wizard session
    if (
      typeof window !== "undefined" &&
      window.selectedFramework &&
      window.currentStep
    ) {
      // FIXED: Get framework config from navigation config or local config
      let frameworkConfig = null;

      // Try to get from navigation config first
      if (
        typeof window.COMPLIANCE_FRAMEWORKS !== "undefined" &&
        window.COMPLIANCE_FRAMEWORKS[window.selectedFramework]
      ) {
        frameworkConfig =
          window.COMPLIANCE_FRAMEWORKS[window.selectedFramework];
      }
      // Fallback to local FRAMEWORK_CONFIGS if it exists
      else if (
        typeof window.FRAMEWORK_CONFIGS !== "undefined" &&
        window.FRAMEWORK_CONFIGS[window.selectedFramework]
      ) {
        frameworkConfig = window.FRAMEWORK_CONFIGS[window.selectedFramework];
      }

      if (frameworkConfig) {
        const stepInfo = getStepInfoForChat(window.currentStep);
        const contextMessage = `You are currently on ${stepInfo} of the ${frameworkConfig.name} assessment. I can help you understand the questions and provide guidance.`;

        // Update chat context
        if (typeof updateChatContext === "function") {
          updateChatContext(frameworkConfig.chatContext);
        }

        // Add helpful context message
        if (typeof addChatMessage === "function") {
          addChatMessage(frameworkConfig.chatContext, "ai", contextMessage);
        }
      }
    }
  } catch (error) {
    console.error("❌ Error updating chat context from wizard:", error);
  }
}

/**
 * Gets step information for chat context
 * @param {number} stepNumber - Current step number
 * @returns {string} Human-readable step information
 */
function getStepInfoForChat(stepNumber) {
  try {
    if (typeof getFrameworkSteps === "function") {
      const steps = getFrameworkSteps();
      const stepInfo = steps[stepNumber - 1];
      return stepInfo
        ? `Step ${stepNumber}: ${stepInfo.title}`
        : `Step ${stepNumber}`;
    }
    return `Step ${stepNumber}`;
  } catch (error) {
    console.error("❌ Error getting step info:", error);
    return `Step ${stepNumber}`;
  }
}

/**
 * Makes the chat popup draggable across the screen
 * Enhanced with boundary checking and smooth animations
 */
function makeChatDraggable() {
  const chatPopup = document.getElementById("chatPopup");
  if (!chatPopup) return;

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;
  let startX = 0;
  let startY = 0;

  // Use the header as the drag handle
  const handle = chatPopup.querySelector(".chat-header") || chatPopup;

  /**
   * Starts the drag operation when user clicks and holds
   * @param {Event} e - Mouse or touch event
   */
  function startDrag(e) {
    isDragging = true;
    const rect = chatPopup.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    // Store starting positions
    startX = clientX;
    startY = clientY;

    // Calculate offset from click point to element origin
    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;

    // Switch from fixed positioning to absolute for dragging
    chatPopup.style.bottom = "auto";
    chatPopup.style.right = "auto";
    chatPopup.style.left = rect.left + "px";
    chatPopup.style.top = rect.top + "px";
    chatPopup.style.transition = "none"; // Disable transitions during drag

    // Add event listeners for drag and end events
    document.addEventListener("mousemove", drag, { passive: false });
    document.addEventListener("touchmove", drag, { passive: false });
    document.addEventListener("mouseup", endDrag);
    document.addEventListener("touchend", endDrag);

    // Prevent text selection during drag
    document.body.style.userSelect = "none";
    handle.style.cursor = "grabbing";
  }

  /**
   * Handles the dragging motion with boundary checking
   * @param {Event} e - Mouse or touch move event
   */
  function drag(e) {
    if (!isDragging) return;

    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    // Calculate new position
    let newX = clientX - offsetX;
    let newY = clientY - offsetY;

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const popupRect = chatPopup.getBoundingClientRect();

    // Boundary checking - keep popup within viewport
    newX = Math.max(0, Math.min(newX, viewportWidth - popupRect.width));
    newY = Math.max(0, Math.min(newY, viewportHeight - popupRect.height));

    // Update position
    chatPopup.style.left = newX + "px";
    chatPopup.style.top = newY + "px";
  }

  /**
   * Ends the drag operation and cleans up event listeners
   */
  function endDrag() {
    if (!isDragging) return;

    isDragging = false;

    // Clean up event listeners
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("touchmove", drag);
    document.removeEventListener("mouseup", endDrag);
    document.removeEventListener("touchend", endDrag);

    // Restore styles
    document.body.style.userSelect = "";
    handle.style.cursor = "grab";
    chatPopup.style.transition = ""; // Re-enable transitions

    // Save position preference
    saveChatPosition();
  }

  // Attach drag event listeners to the handle
  handle.addEventListener("mousedown", startDrag);
  handle.addEventListener("touchstart", startDrag);
  handle.style.cursor = "grab";

  // Load saved position
  loadChatPosition();
}

/**
 * Saves chat popup position to localStorage
 */
function saveChatPosition() {
  try {
    const chatPopup = document.getElementById("chatPopup");
    if (!chatPopup) return;

    const rect = chatPopup.getBoundingClientRect();
    const position = {
      left: rect.left,
      top: rect.top,
      timestamp: Date.now(),
    };

    localStorage.setItem("chatPopupPosition", JSON.stringify(position));
  } catch (error) {
    console.error("❌ Error saving chat position:", error);
  }
}

/**
 * Loads saved chat popup position from localStorage
 */
function loadChatPosition() {
  try {
    const chatPopup = document.getElementById("chatPopup");
    if (!chatPopup) return;

    const savedPosition = localStorage.getItem("chatPopupPosition");
    if (!savedPosition) return;

    const position = JSON.parse(savedPosition);

    // Check if position is still valid (viewport might have changed)
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (
      position.left >= 0 &&
      position.top >= 0 &&
      position.left < viewportWidth - 200 &&
      position.top < viewportHeight - 200
    ) {
      chatPopup.style.left = position.left + "px";
      chatPopup.style.top = position.top + "px";
      chatPopup.style.bottom = "auto";
      chatPopup.style.right = "auto";
    }
  } catch (error) {
    console.error("❌ Error loading chat position:", error);
  }
}

/* ==========================================================================
   AVATAR AND VOICE FUNCTIONS
   Enhanced functions for managing AI avatar and voice interactions
   ========================================================================== */

/**
 * Toggles avatar mode on/off with wizard integration
 */
function toggleAvatarMode() {
  try {
    document.body.classList.toggle("avatar-mode");
    const isEnabled = document.body.classList.contains("avatar-mode");

    if (isEnabled) {
      showNotification(
        "Avatar mode enabled - voice guidance active",
        "success",
      );

      // Announce current wizard state if in assessment
      if (window.selectedFramework && window.currentStep) {
        const frameworkConfig =
          window.FRAMEWORK_CONFIGS[window.selectedFramework];
        if (frameworkConfig && typeof speakText === "function") {
          speakText(
            `Avatar mode enabled. You are currently on step ${window.currentStep} of the ${frameworkConfig.name} assessment.`,
          );
        }
      }
    } else {
      showNotification("Avatar mode disabled", "info");
    }
  } catch (error) {
    console.error("❌ Error toggling avatar mode:", error);
  }
}

/**
 * Opens the avatar configuration modal
 */
function openAvatarModal() {
  try {
    const modal = document.getElementById("avatarModal");
    if (modal) {
      modal.classList.add("active");
      modal.style.display = "flex";
    } else {
      console.warn("Avatar modal not found");
    }
  } catch (error) {
    console.error("❌ Error opening avatar modal:", error);
  }
}

/**
 * Closes the avatar configuration modal
 */
function closeAvatarModal() {
  try {
    const modal = document.getElementById("avatarModal");
    if (modal) {
      modal.classList.remove("active");
      modal.style.display = "none";
    }
  } catch (error) {
    console.error("❌ Error closing avatar modal:", error);
  }
}

/**
 * Saves avatar settings to localStorage with enhanced validation
 */
function saveAvatarSettings() {
  try {
    const selected = document.querySelector('input[name="avatar"]:checked');
    const tone = document.getElementById("avatarTone");
    const speed = document.getElementById("avatarSpeed");

    if (selected && tone && speed) {
      const settings = {
        avatar: selected.value,
        tone: tone.value,
        speed: parseFloat(speed.value),
        timestamp: new Date().toISOString(),
        version: "2.1.0",
      };

      localStorage.setItem("avatarSettings", JSON.stringify(settings));

      // Apply settings immediately
      applyAvatarSettings(settings);

      showNotification("Avatar settings saved successfully", "success");
    } else {
      showNotification("Please configure all avatar settings", "warning");
    }

    closeAvatarModal();

    // Enable avatar mode if not already enabled
    if (!document.body.classList.contains("avatar-mode")) {
      toggleAvatarMode();
    }
  } catch (error) {
    console.error("❌ Error saving avatar settings:", error);
    showNotification("Error saving avatar settings", "error");
  }
}

/**
 * Loads avatar settings from localStorage with version checking
 */
function loadAvatarSettings() {
  try {
    const settings = localStorage.getItem("avatarSettings");
    if (!settings) return;

    const parsed = JSON.parse(settings);

    // Apply settings to UI
    const avatarInput = document.querySelector(
      `input[name="avatar"][value="${parsed.avatar}"]`,
    );
    const tone = document.getElementById("avatarTone");
    const speed = document.getElementById("avatarSpeed");

    if (avatarInput) avatarInput.checked = true;
    if (tone) tone.value = parsed.tone || "friendly";
    if (speed) speed.value = parsed.speed || 1;

    // Apply settings to system
    applyAvatarSettings(parsed);

    console.log("✅ Avatar settings loaded successfully");
  } catch (error) {
    console.error("❌ Error loading avatar settings:", error);
  }
}

/**
 * Applies avatar settings to the system
 * @param {Object} settings - Avatar settings object
 */
function applyAvatarSettings(settings) {
  try {
    // Apply voice settings
    if ("speechSynthesis" in window && settings.speed) {
      window.avatarVoiceSpeed = settings.speed;
    }

    // Apply avatar appearance
    if (settings.avatar) {
      document.body.setAttribute("data-avatar", settings.avatar);
    }

    // Apply tone settings (for future AI response customization)
    if (settings.tone) {
      window.avatarTone = settings.tone;
    }
  } catch (error) {
    console.error("❌ Error applying avatar settings:", error);
  }
}

/* ==========================================================================
   ENHANCED WIZARD INTEGRATION FUNCTIONS
   Functions specifically for wizard integration and support
   ========================================================================== */

/**
 * Enhanced save function that integrates with wizard state
 * Saves all wizard answers and session information
 */
function saveAllAnswers() {
  try {
    console.log("💾 Starting enhanced save process...");

    // FIXED: Call the renamed function from questionLoader.js if available
    if (typeof window.saveQuestionAnswers === "function") {
      console.log("📋 Using enhanced question loader save function");
      const answers = window.saveQuestionAnswers();

      // Add wizard session metadata
      const sessionData = {
        answers: answers,
        framework: window.selectedFramework || null,
        currentStep: window.currentStep || 1,
        totalSteps: window.totalSteps || 0,
        progress: getCurrentWizardProgress(),
        timestamp: new Date().toISOString(),
        version: "2.1.0",
      };

      localStorage.setItem(
        "compliance_assessment_complete",
        JSON.stringify(sessionData),
      );

      console.log("✅ Complete wizard state saved");
      return true;
    } else {
      // Fallback to basic saving
      return saveBasicWizardAnswers();
    }
  } catch (error) {
    console.error("❌ Error saving all answers:", error);
    return false;
  }
}

/**
 * Basic wizard answer saving fallback
 * @returns {boolean} Success status
 */
function saveBasicWizardAnswers() {
  try {
    const formData = {
      step: window.currentStep || 1,
      framework: window.selectedFramework || null,
      timestamp: new Date().toISOString(),
      answers: {},
    };

    // Collect text inputs
    document.querySelectorAll(".question-input").forEach((input) => {
      const id =
        input.getAttribute("data-id") || input.getAttribute("data-question-id");
      if (id && input.value) {
        formData.answers[id] = input.value;
      }
    });

    // Collect radio selections
    document
      .querySelectorAll('input[type="radio"]:checked')
      .forEach((radio) => {
        if (radio.name && radio.value) {
          formData.answers[radio.name] = radio.value;
        }
      });

    // Collect rating selections
    document.querySelectorAll(".rating-option.selected").forEach((rating) => {
      const questionGroup = rating.closest(".question-group");
      const questionId = questionGroup?.dataset.questionId;
      const ratingValue =
        rating.dataset.value ||
        rating.querySelector(".rating-number")?.textContent;

      if (questionId && ratingValue) {
        formData.answers[questionId] = ratingValue;
      }
    });

    localStorage.setItem("ai_risk_assessment_draft", JSON.stringify(formData));

    console.log("✅ Basic wizard answers saved");
    return true;
  } catch (error) {
    console.error("❌ Error saving basic answers:", error);
    return false;
  }
}

/**
 * Gets current wizard progress percentage
 * @returns {number} Progress percentage (0-100)
 */
function getCurrentWizardProgress() {
  try {
    if (!window.currentStep || !window.totalSteps) return 0;

    const stepProgress = (window.currentStep - 1) / window.totalSteps;
    const currentStepCompletion = getCurrentStepCompletion();

    return Math.min(
      95,
      Math.max(
        0,
        (stepProgress + currentStepCompletion / window.totalSteps) * 100,
      ),
    );
  } catch (error) {
    console.error("❌ Error calculating progress:", error);
    return 0;
  }
}

/**
 * Gets completion percentage for current step
 * @returns {number} Completion percentage (0-1)
 */
function getCurrentStepCompletion() {
  try {
    const inputs = document.querySelectorAll(".question-input");
    if (inputs.length === 0) return 1;

    const completedInputs = Array.from(inputs).filter(
      (input) => input.value && input.value.trim() !== "",
    ).length;

    return completedInputs / inputs.length;
  } catch (error) {
    console.error("❌ Error calculating step completion:", error);
    return 0;
  }
}

/**
 * ADDED: Missing updateProgress() function that was called but not defined
 * Updates wizard progress indicators and percentage display
 */
function updateProgress() {
  try {
    console.log("📊 Updating progress display...");

    // Calculate current progress
    const progress = getCurrentWizardProgress();

    // Update progress display elements
    const confidenceFill = document.getElementById("confidenceFill");
    const confidenceText = document.getElementById("confidenceText");

    if (confidenceFill) {
      confidenceFill.style.width = progress + "%";
    }

    if (confidenceText) {
      confidenceText.textContent = Math.round(progress) + "%";
    }

    // Update progress indicators if wizard is active
    if (window.selectedFramework && typeof updateStepDisplay === "function") {
      updateStepDisplay();
    }

    // Update session progress
    if (window.assessmentSession) {
      window.assessmentSession.progress = progress;
      window.assessmentSession.lastSaved = new Date().toISOString();
    }

    console.log(`📊 Progress updated to ${Math.round(progress)}%`);
  } catch (error) {
    console.error("❌ Error updating progress:", error);
  }
}

/**
 * Restores saved wizard state and answers
 */
function restoreSavedWizardState() {
  try {
    // Try to restore complete session first
    const completeSession = localStorage.getItem(
      "compliance_assessment_complete",
    );
    if (completeSession) {
      const sessionData = JSON.parse(completeSession);

      if (sessionData.framework && sessionData.answers) {
        console.log("🔄 Restoring complete wizard session");

        // Restore framework selection
        if (typeof selectFramework === "function") {
          selectFramework(sessionData.framework);
        }

        // Restore answers using enhanced loader if available
        if (typeof window.restoreAnswersForStep === "function") {
          window.restoreAnswersForStep(sessionData.currentStep || 1);
        }

        return true;
      }
    }

    // Fallback to basic restoration
    return restoreBasicWizardAnswers();
  } catch (error) {
    console.error("❌ Error restoring wizard state:", error);
    return false;
  }
}

/**
 * Basic wizard answer restoration fallback
 * @returns {boolean} Success status
 */
function restoreBasicWizardAnswers() {
  try {
    const savedData = localStorage.getItem("ai_risk_assessment_draft");
    if (!savedData) return false;

    const parsed = JSON.parse(savedData);
    const answers = parsed.answers || {};

    // Restore text inputs
    Object.keys(answers).forEach((key) => {
      const input = document.querySelector(
        `[data-id="${key}"], [data-question-id="${key}"]`,
      );
      if (input && typeof answers[key] === "string") {
        input.value = answers[key];
      }
    });

    // Restore radio buttons
    Object.keys(answers).forEach((key) => {
      const radio = document.querySelector(
        `input[name="${key}"][value="${answers[key]}"]`,
      );
      if (radio) {
        radio.checked = true;
        const radioOption = radio.closest(".radio-option");
        if (radioOption) {
          radioOption.classList.add("selected");
        }
      }
    });

    console.log("🔄 Basic wizard answers restored");
    return true;
  } catch (error) {
    console.error("❌ Error restoring basic answers:", error);
    return false;
  }
}

/* ==========================================================================
   RISK MANAGEMENT FUNCTIONS
   Enhanced functions for risk assessment and heat map interactions
   ========================================================================== */

/**
 * Shows detailed information for a specific risk with wizard integration
 * @param {string} riskId - The unique identifier for the risk
 */
function showRiskDetails(riskId) {
  try {
    // Enhanced risk details with framework context
    const riskDetails = {
      "R-001": {
        title: "AI Hiring Discrimination",
        description: "High-risk AI system showing bias in candidate selection",
        framework: "EU AI Act",
        riskLevel: "High",
        mitigation: "Implement bias testing and human oversight",
        assessmentUrl: "wizard.html?framework=eu_ai_act",
      },
      "R-002": {
        title: "Cloud Infrastructure Security",
        description: "Potential vulnerabilities in cloud configuration",
        framework: "ISO 27001",
        riskLevel: "Medium",
        mitigation: "Conduct security assessment and implement controls",
        assessmentUrl: "wizard.html?framework=cloud_security",
      },
      "R-003": {
        title: "GDPR Data Processing Violation",
        description: "Unauthorized personal data processing detected",
        framework: "GDPR",
        riskLevel: "High",
        mitigation:
          "Review data processing activities and update consent mechanisms",
        assessmentUrl: "wizard.html?framework=gdpr",
      },
    };

    const risk = riskDetails[riskId];
    if (risk) {
      // Create enhanced risk modal
      const modalContent = `
                <div class="risk-details-modal">
                    <h3>${risk.title}</h3>
                    <p><strong>Description:</strong> ${risk.description}</p>
                    <p><strong>Framework:</strong> ${risk.framework}</p>
                    <p><strong>Risk Level:</strong> <span class="badge badge-${risk.riskLevel.toLowerCase()}">${risk.riskLevel}</span></p>
                    <p><strong>Mitigation:</strong> ${risk.mitigation}</p>
                    <div class="risk-actions">
                        <a href="${risk.assessmentUrl}" class="btn btn-primary">
                            <i class="fas fa-clipboard-check"></i>
                            Start Assessment
                        </a>
                    </div>
                </div>
            `;

      if (typeof openInfoModal === "function") {
        openInfoModal("Risk Details", modalContent);
      } else {
        alert(
          `${risk.title}\n\n${risk.description}\n\nFramework: ${risk.framework}\nRisk Level: ${risk.riskLevel}`,
        );
      }
    } else {
      showNotification(`Risk ${riskId} not found`, "warning");
    }
  } catch (error) {
    console.error("❌ Error showing risk details:", error);
    showNotification("Error loading risk details", "error");
  }
}

/* ==========================================================================
   CONTEXT AWARENESS FUNCTIONS
   Enhanced functions for managing application context and navigation
   ========================================================================== */

/**
 * Updates the chat context with enhanced wizard awareness
 * @param {string} context - Description of current page/section
 */
function updateChatContext(context) {
  try {
    // Store context globally for other functions to access
    window.currentChatContext = context;

    // Update UI elements that display the current context
    const chatContext = document.getElementById("chat-context");
    if (chatContext) {
      chatContext.textContent = context;
    }

    // Update chat window title with framework information
    const chatTitle = document.querySelector(".chat-title");
    if (chatTitle) {
      let titleText = "ArionComply AI Assistant";

      if (context) {
        titleText += ` - ${context}`;
      }

      // Add step information if in wizard
      if (window.currentStep && window.totalSteps) {
        titleText += ` (Step ${window.currentStep}/${window.totalSteps})`;
      }

      chatTitle.textContent = titleText;
    }

    // Update iframe context if chat is embedded
    const chatIframe = document.getElementById("chatIframe");
    if (chatIframe) {
      const currentSrc = chatIframe.src;
      const url = new URL(currentSrc);
      url.searchParams.set("context", encodeURIComponent(context));
      chatIframe.src = url.toString();
    }

    console.log("💬 Chat context updated to:", context);
  } catch (error) {
    console.error("❌ Error updating chat context:", error);
  }
}

/**
 * Updates the breadcrumb navigation text with wizard awareness
 * @param {string} breadcrumbText - The new breadcrumb text to display
 */
function updateBreadcrumb(breadcrumbText) {
  try {
    const breadcrumb = document.getElementById("breadcrumb-text");
    if (breadcrumb) {
      // Enhance breadcrumb with wizard progress if applicable
      let enhancedText = breadcrumbText;

      if (window.selectedFramework && window.currentStep) {
        const frameworkConfig = window.FRAMEWORK_CONFIGS
          ? window.FRAMEWORK_CONFIGS[window.selectedFramework]
          : null;
        if (frameworkConfig) {
          enhancedText += ` > ${frameworkConfig.shortName} (Step ${window.currentStep}/${window.totalSteps || "?"})`;
        }
      }

      breadcrumb.textContent = enhancedText;
    }
  } catch (error) {
    console.error("❌ Error updating breadcrumb:", error);
  }
}

/* ==========================================================================
   UI INTERACTION FUNCTIONS
   Enhanced functions for managing UI components and user interactions
   ========================================================================== */

/**
 * Toggles the visibility of filter panels with enhanced state management
 * @param {string} filterId - The ID of the filter panel to toggle
 */
function toggleFilter(filterId) {
  try {
    const filterPanel = document.getElementById(filterId);
    if (filterPanel) {
      const isCurrentlyActive = filterPanel.classList.contains("active");

      // Close all other filter panels first
      document.querySelectorAll(".filter-panel.active").forEach((panel) => {
        if (panel.id !== filterId) {
          panel.classList.remove("active");
        }
      });

      // Toggle the requested panel
      filterPanel.classList.toggle("active");

      // Save filter state
      const filterStates = JSON.parse(
        localStorage.getItem("filterStates") || "{}",
      );
      filterStates[filterId] = !isCurrentlyActive;
      localStorage.setItem("filterStates", JSON.stringify(filterStates));

      console.log(
        `🔽 Filter ${filterId} ${!isCurrentlyActive ? "opened" : "closed"}`,
      );
    }
  } catch (error) {
    console.error("❌ Error toggling filter:", error);
  }
}

/* ==========================================================================
   CORE STORAGE UTILITY FUNCTIONS
   Essential functions for localStorage management - CRITICAL MISSING FUNCTIONS
   ========================================================================== */

/* ==========================================================================
   USER AND COMPANY MANAGEMENT FUNCTIONS
   Complete implementations for user authentication and data management
   ========================================================================== */

// -----------------------------------------------------------------------------
// generateId(prefix)
// -----------------------------------------------------------------------------
// Creates a simple incremental ID like "U-001" or "C-003" using localStorage to
// persist the counter between page loads. If localStorage is not available the
// current timestamp is used as a fallback so the function never blocks the app.
// -----------------------------------------------------------------------------
function generateId(prefix) {
  try {
    let count =
      parseInt(localStorage.getItem(prefix + "_count") || "0", 10) + 1;
    localStorage.setItem(prefix + "_count", count);
    return prefix + "-" + String(count).padStart(3, "0");
  } catch (e) {
    console.warn("generateId failed, falling back to timestamp", e);
    return prefix + "-" + Date.now();
  }
}

// -----------------------------------------------------------------------------
// getUserByEmail(email)
// -----------------------------------------------------------------------------
// Looks up a stored user record by email address. Returns undefined if the user
// is not found or localStorage retrieval fails.
// -----------------------------------------------------------------------------
function getUserByEmail(email) {
  try {
    const users = getStoredData("arioncomply_users");
    return users.find((u) => u.email === email);
  } catch (e) {
    console.error("Unable to lookup user by email", e);
    return undefined;
  }
}

// -----------------------------------------------------------------------------
// getUserById(id)
// -----------------------------------------------------------------------------
// Retrieves a user record by unique ID. Returns undefined if not found or on
// storage failure so the caller can handle the missing record gracefully.
// -----------------------------------------------------------------------------
function getUserById(id) {
  try {
    const users = getStoredData("arioncomply_users");
    return users.find((u) => u.id === id);
  } catch (e) {
    console.error("Unable to lookup user by id", e);
    return undefined;
  }
}

// -----------------------------------------------------------------------------
// saveUser(user)
// -----------------------------------------------------------------------------
// Adds or updates a user record in localStorage. Any errors are logged so that
// a broken storage API does not prevent the UI from functioning.
// -----------------------------------------------------------------------------
function saveUser(user) {
  try {
    const users = getStoredData("arioncomply_users");
    const existing = users.findIndex((u) => u.email === user.email);
    if (existing !== -1) {
      users[existing] = user;
    } else {
      users.push(user);
    }
    saveStoredData("arioncomply_users", users);
    console.log("✅ User saved successfully:", user.email);
    return user;
  } catch (e) {
    console.error("Failed to save user", e);
    return user; // Return user anyway so UI doesn't break
  }
}

// -----------------------------------------------------------------------------
// getCompanyById(id)
// -----------------------------------------------------------------------------
// Finds a company record by ID in localStorage. Returns undefined if the record
// cannot be found or storage retrieval fails so the calling code can recover.
// -----------------------------------------------------------------------------
function getCompanyById(id) {
  try {
    const companies = getStoredData("arioncomply_companies");
    return companies.find((c) => c.id === id);
  } catch (e) {
    console.error("Unable to lookup company by id", e);
    return undefined;
  }
}

// -----------------------------------------------------------------------------
// saveCompany(company)
// -----------------------------------------------------------------------------
// Adds or updates a company record in localStorage. Errors are logged so they do
// not halt the UI.
// -----------------------------------------------------------------------------
function saveCompany(company) {
  try {
    const companies = getStoredData("arioncomply_companies");
    const existing = companies.findIndex((c) => c.id === company.id);
    if (existing !== -1) {
      companies[existing] = company;
    } else {
      companies.push(company);
    }
    saveStoredData("arioncomply_companies", companies);
    return company;
  } catch (e) {
    console.error("Failed to save company", e);
    return company;
  }
}

// -----------------------------------------------------------------------------
// deleteUser(id)
// -----------------------------------------------------------------------------
// Removes a user record by ID from localStorage. Any failures are logged.
// -----------------------------------------------------------------------------
function deleteUser(id) {
  try {
    const users = getStoredData("arioncomply_users");
    const filtered = users.filter((u) => u.id !== id);
    saveStoredData("arioncomply_users", filtered);
    console.log("✅ User deleted:", id);
  } catch (e) {
    console.error("Failed to delete user", e);
  }
}

// -----------------------------------------------------------------------------
// deleteCompany(id)
// -----------------------------------------------------------------------------
// Removes a company record by ID from localStorage. Any failures are logged.
// -----------------------------------------------------------------------------
function deleteCompany(id) {
  try {
    const companies = getStoredData("arioncomply_companies");
    const filtered = companies.filter((c) => c.id !== id);
    saveStoredData("arioncomply_companies", filtered);
    console.log("✅ Company deleted:", id);
  } catch (e) {
    console.error("Failed to delete company", e);
  }
}

/* ==========================================================================
   FORM VALIDATION UTILITIES
   Functions for validating forms and user input
   ========================================================================== */

// -----------------------------------------------------------------------------
// validateForm(formId)
// -----------------------------------------------------------------------------
// Validates all required fields in a form and provides visual feedback.
// Returns true if all required fields are filled, false otherwise.
// -----------------------------------------------------------------------------
function validateForm(formId) {
  try {
    const form = document.getElementById(formId);
    if (!form) {
      console.warn(`Form with ID '${formId}' not found`);
      return false;
    }

    const requiredFields = form.querySelectorAll("[required]");
    let isValid = true;

    requiredFields.forEach((field) => {
      const value = field.value ? field.value.trim() : "";

      if (!value) {
        field.style.borderColor = "var(--danger-red, #ef4444)";
        field.style.backgroundColor = "#fef2f2";
        isValid = false;

        // Add error message if it doesn't exist
        let errorMsg = field.parentNode.querySelector(".error-message");
        if (!errorMsg) {
          errorMsg = document.createElement("div");
          errorMsg.className = "error-message";
          errorMsg.style.color = "var(--danger-red, #ef4444)";
          errorMsg.style.fontSize = "0.75rem";
          errorMsg.style.marginTop = "0.25rem";
          field.parentNode.appendChild(errorMsg);
        }
        errorMsg.textContent = `${field.name || "This field"} is required`;
      } else {
        field.style.borderColor = "var(--border-light, #e2e8f0)";
        field.style.backgroundColor = "";

        // Remove error message if it exists
        const errorMsg = field.parentNode.querySelector(".error-message");
        if (errorMsg) {
          errorMsg.remove();
        }
      }
    });

    return isValid;
  } catch (error) {
    console.error("❌ Error validating form:", error);
    return false;
  }
}

// -----------------------------------------------------------------------------
// validateEmail(email)
// -----------------------------------------------------------------------------
// Validates email format using a simple but effective regex pattern
// -----------------------------------------------------------------------------
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// -----------------------------------------------------------------------------
// validatePassword(password)
// -----------------------------------------------------------------------------
// Basic password validation - at least 6 characters
// -----------------------------------------------------------------------------
function validatePassword(password) {
  return password && password.length >= 6;
}

// -----------------------------------------------------------------------------
// validateAuthForm(type)
// -----------------------------------------------------------------------------
// Validates login/registration forms with specific business rules
// -----------------------------------------------------------------------------
function validateAuthForm(type) {
  try {
    let isValid = true;
    const errors = [];

    if (type === "login") {
      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;

      if (!email) {
        errors.push("Email is required");
        isValid = false;
      } else if (!validateEmail(email)) {
        errors.push("Please enter a valid email address");
        isValid = false;
      }

      if (!password) {
        errors.push("Password is required");
        isValid = false;
      }
    } else if (type === "register") {
      const name = document.getElementById("registerName").value.trim();
      const email = document.getElementById("registerEmail").value.trim();
      const company = document.getElementById("registerCompany").value.trim();
      const password = document.getElementById("registerPassword").value;
      const agreeTerms = document.getElementById("agreeTerms").checked;

      if (!name) {
        errors.push("Full name is required");
        isValid = false;
      }

      if (!email) {
        errors.push("Email is required");
        isValid = false;
      } else if (!validateEmail(email)) {
        errors.push("Please enter a valid email address");
        isValid = false;
      }

      if (!company) {
        errors.push("Company name is required");
        isValid = false;
      }

      if (!password) {
        errors.push("Password is required");
        isValid = false;
      } else if (!validatePassword(password)) {
        errors.push("Password must be at least 6 characters long");
        isValid = false;
      }

      if (!agreeTerms) {
        errors.push("You must agree to the Terms of Service");
        isValid = false;
      }
    }

    // Show errors if any
    if (!isValid) {
      showNotification(errors.join(". "), "error", 6000);
    }

    return isValid;
  } catch (error) {
    console.error("❌ Error validating auth form:", error);
    return false;
  }
}

/* ==========================================================================
   DEMO MODE MANAGEMENT FUNCTIONS
   Functions for managing demo mode and demo data
   ========================================================================== */

// -----------------------------------------------------------------------------
// createDemoSampleData()
// -----------------------------------------------------------------------------
// Creates realistic sample data for demonstration purposes
// -----------------------------------------------------------------------------
function createDemoSampleData() {
  try {
    // Sample risk assessments
    const sampleAssessments = [
      {
        id: "DEMO-ASSESS-001",
        title: "AI Hiring System Assessment",
        framework: "EU AI Act",
        status: "in_progress",
        progress: 65,
        lastModified: new Date(
          Date.now() - 2 * 24 * 60 * 60 * 1000,
        ).toISOString(), // 2 days ago
        riskLevel: "high",
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        isDemoData: true,
      },
      {
        id: "DEMO-ASSESS-002",
        title: "Data Privacy Compliance Review",
        framework: "GDPR",
        status: "completed",
        progress: 100,
        lastModified: new Date(
          Date.now() - 7 * 24 * 60 * 60 * 1000,
        ).toISOString(), // 7 days ago
        riskLevel: "medium",
        completedDate: new Date(
          Date.now() - 3 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        isDemoData: true,
      },
      {
        id: "DEMO-ASSESS-003",
        title: "Cloud Security Baseline",
        framework: "ISO 27001",
        status: "draft",
        progress: 25,
        lastModified: new Date().toISOString(),
        riskLevel: "low",
        isDemoData: true,
      },
    ];

    localStorage.setItem(
      "arioncomply_demo_assessments",
      JSON.stringify(sampleAssessments),
    );

    // Sample notifications
    const sampleNotifications = [
      {
        id: "DEMO-NOTIF-001",
        title: "AI Assessment Due Soon",
        message: "Your AI Hiring System assessment is due in 30 days",
        type: "warning",
        timestamp: new Date().toISOString(),
        read: false,
        isDemoData: true,
      },
      {
        id: "DEMO-NOTIF-002",
        title: "GDPR Assessment Complete",
        message:
          "Data Privacy Compliance Review has been successfully completed",
        type: "success",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        read: true,
        isDemoData: true,
      },
    ];

    localStorage.setItem(
      "arioncomply_demo_notifications",
      JSON.stringify(sampleNotifications),
    );

    console.log("✅ Demo sample data created");
  } catch (error) {
    console.error("❌ Error creating demo sample data:", error);
  }
}

// -----------------------------------------------------------------------------
// initializeDefaultData()
// -----------------------------------------------------------------------------
// Sets up default admin user and initial data if none exists
// -----------------------------------------------------------------------------
function initializeDefaultData() {
  try {
    const users = getStoredData("arioncomply_users");

    // If no users exist, create default admin
    if (users.length === 0) {
      const adminUser = {
        id: generateId("U"),
        name: "System Administrator",
        email: "admin@arioncomply.com",
        company: "ArionComply",
        password: "demo123",
        role: "admin",
        createdAt: new Date().toISOString(),
        loginTime: new Date().toISOString(),
        isDefaultAdmin: true,
      };

      saveUser(adminUser);
      console.log("✅ Default admin user created");
    }

    // Initialize other default data
    const companies = getStoredData("arioncomply_companies");
    if (companies.length === 0) {
      const defaultCompany = {
        id: generateId("C"),
        name: "ArionComply",
        domain: "arioncomply.com",
        industry: "Technology",
        createdAt: new Date().toISOString(),
      };
      saveCompany(defaultCompany);
    }
  } catch (error) {
    console.error("❌ Error initializing default data:", error);
  }
}

// -----------------------------------------------------------------------------
// showDemoInfo()
// -----------------------------------------------------------------------------
// Shows information about the demo experience
// -----------------------------------------------------------------------------
function showDemoInfo() {
  const demoInfoContent = `
        <div class="demo-info-content">
            <div class="demo-info-section">
                <h4><i class="fas fa-rocket"></i> What's Included in the Demo</h4>
                <ul>
                    <li><strong>AI Risk Assessments:</strong> Pre-configured assessments for EU AI Act, GDPR, and ISO 27001</li>
                    <li><strong>Interactive Dashboard:</strong> Real-time compliance metrics and risk heat maps</li>
                    <li><strong>AI Assistant:</strong> Context-aware compliance guidance and recommendations</li>
                    <li><strong>Multi-Framework Support:</strong> Experience assessments across different compliance standards</li>
                    <li><strong>Sample Data:</strong> Realistic scenarios and assessment results</li>
                </ul>
            </div>
            
            <div class="demo-info-section">
                <h4><i class="fas fa-clock"></i> Demo Session Details</h4>
                <ul>
                    <li><strong>Duration:</strong> 24 hours of full access</li>
                    <li><strong>Data:</strong> Sample compliance data pre-loaded</li>
                    <li><strong>Features:</strong> All platform features unlocked</li>
                    <li><strong>Privacy:</strong> Demo data is stored locally and automatically cleared</li>
                </ul>
            </div>
            
            <div class="demo-info-section">
                <h4><i class="fas fa-shield-alt"></i> Perfect For</h4>
                <ul>
                    <li>Compliance officers evaluating AI governance tools</li>
                    <li>Risk managers exploring automated assessment workflows</li>
                    <li>IT teams understanding multi-framework compliance</li>
                    <li>Anyone curious about AI-powered compliance management</li>
                </ul>
            </div>
            
            <div class="demo-cta">
                <button class="btn btn-primary" onclick="closeInfoModal(); quickDemo();">
                    <i class="fas fa-play"></i> Start Demo Now
                </button>
            </div>
        </div>
        
        <style>
            .demo-info-content { padding: 0.5rem 0; }
            .demo-info-section { margin-bottom: 1.5rem; }
            .demo-info-section h4 { 
                color: var(--primary-blue); 
                margin-bottom: 0.75rem; 
                display: flex; 
                align-items: center; 
                gap: 0.5rem; 
            }
            .demo-info-section ul { 
                list-style: none; 
                padding-left: 0; 
            }
            .demo-info-section li { 
                padding: 0.25rem 0; 
                color: var(--text-gray);
                line-height: 1.5;
            }
            .demo-info-section li strong { 
                color: var(--text-dark); 
            }
            .demo-cta { 
                text-align: center; 
                padding-top: 1rem; 
                border-top: 1px solid var(--border-light); 
            }
        </style>
    `;

  openInfoModal("ArionComply Demo Experience", demoInfoContent, {
    size: "large",
  });
}

// -----------------------------------------------------------------------------
// isDemoMode()
// -----------------------------------------------------------------------------
// Checks if the current session is in demo mode
// -----------------------------------------------------------------------------
function isDemoMode() {
  try {
    return localStorage.getItem("arioncomply_demo_mode") === "true";
  } catch (error) {
    return false;
  }
}

// -----------------------------------------------------------------------------
// getCurrentUser()
// -----------------------------------------------------------------------------
// Gets the currently logged in user with full data from storage
// -----------------------------------------------------------------------------
function getCurrentUser() {
  try {
    const sessionUser = localStorage.getItem("arioncomply_user");
    if (!sessionUser) return null;

    const user = JSON.parse(sessionUser);

    // Get full user data from storage (session data excludes password)
    return getUserByEmail(user.email);
  } catch (error) {
    console.error("❌ Error getting current user:", error);
    return null;
  }
}

// -----------------------------------------------------------------------------
// isUserLoggedIn()
// -----------------------------------------------------------------------------
// Checks if user has valid session
// -----------------------------------------------------------------------------
function isUserLoggedIn() {
  try {
    const session = localStorage.getItem("arioncomply_session");
    const user = localStorage.getItem("arioncomply_user");
    return session === "active" && user !== null;
  } catch (error) {
    return false;
  }
}

// -----------------------------------------------------------------------------
// logout()
// -----------------------------------------------------------------------------
// Properly clears user session
// -----------------------------------------------------------------------------
function logout() {
  try {
    localStorage.removeItem("arioncomply_session");
    localStorage.removeItem("arioncomply_user");
    localStorage.removeItem("arioncomply_demo_mode");

    console.log("✅ User logged out");
    window.location.href = "index.html";
  } catch (error) {
    console.error("❌ Error during logout:", error);
  }
}

/* ==========================================================================
   CORE STORAGE UTILITY FUNCTIONS
   Essential functions for localStorage management - CRITICAL MISSING FUNCTIONS
   ========================================================================== */

// -----------------------------------------------------------------------------
// getStoredData(key)
// -----------------------------------------------------------------------------
// Safely retrieves and parses data from localStorage. Returns an empty array
// if the key doesn't exist or if parsing fails, ensuring dependent code
// never crashes due to storage issues.
// -----------------------------------------------------------------------------
function getStoredData(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.warn(`Failed to retrieve stored data for key: ${key}`, e);
    return [];
  }
}

// -----------------------------------------------------------------------------
// saveStoredData(key, data)
// -----------------------------------------------------------------------------
// Safely stores data to localStorage after JSON serialization. Any storage
// failures are logged but don't prevent the application from continuing.
// -----------------------------------------------------------------------------
function saveStoredData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error(`Failed to save data for key: ${key}`, e);
    return false;
  }
} /**
 * Restores saved filter states
 */
function restoreFilterStates() {
  try {
    const filterStates = JSON.parse(
      localStorage.getItem("filterStates") || "{}",
    );

    Object.keys(filterStates).forEach((filterId) => {
      if (filterStates[filterId]) {
        const filterPanel = document.getElementById(filterId);
        if (filterPanel) {
          filterPanel.classList.add("active");
        }
      }
    });

    console.log("🔽 Filter states restored");
  } catch (error) {
    console.error("❌ Error restoring filter states:", error);
  }
}

/* ==========================================================================
   ENHANCED NOTIFICATION SYSTEM
   Improved notification functions with better UX and wizard integration
   ========================================================================== */

/**
 * Shows a notification message to the user with enhanced features
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, warning, error, info)
 * @param {number} duration - How long to show the notification (milliseconds)
 * @param {Object} options - Additional options for the notification
 */
function showNotification(
  message,
  type = "info",
  duration = 4000,
  options = {},
) {
  try {
    // Create notification element with enhanced styling
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;

    // Add icon based on type
    const icons = {
      success: "fas fa-check-circle",
      warning: "fas fa-exclamation-triangle",
      error: "fas fa-exclamation-circle",
      info: "fas fa-info-circle",
    };

    notification.innerHTML = `
            <i class="${icons[type] || icons.info}"></i>
            <span class="notification-text">${message}</span>
            ${options.dismissible !== false ? '<button class="notification-close"><i class="fas fa-times"></i></button>' : ""}
        `;

    // Apply enhanced styling
    notification.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius, 8px);
            color: white;
            font-weight: 500;
            z-index: 2000;
            transition: all 0.3s ease;
            transform: translateX(100%);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            max-width: 400px;
            word-wrap: break-word;
        `;

    // Set background color based on notification type
    const colors = {
      success: "var(--success-green, #10b981)",
      warning: "var(--warning-amber, #f59e0b)",
      error: "var(--danger-red, #ef4444)",
      info: "var(--primary-blue, #3b82f6)",
    };
    notification.style.backgroundColor = colors[type] || colors.info;

    // Add close button functionality
    const closeButton = notification.querySelector(".notification-close");
    if (closeButton) {
      closeButton.style.cssText = `
                background: none;
                border: none;
                color: inherit;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 50%;
                opacity: 0.8;
                transition: opacity 0.2s ease;
            `;

      closeButton.addEventListener("click", () => {
        dismissNotification(notification);
      });

      closeButton.addEventListener("mouseenter", () => {
        closeButton.style.opacity = "1";
      });

      closeButton.addEventListener("mouseleave", () => {
        closeButton.style.opacity = "0.8";
      });
    }

    // Add to DOM
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 10);

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        dismissNotification(notification);
      }, duration);
    }

    // Add to notification history
    addToNotificationHistory(message, type);

    // Play sound for important notifications
    if (type === "error" || (type === "success" && options.playSound)) {
      playNotificationSound(type);
    }

    console.log(`🔔 Notification shown: ${type} - ${message}`);
  } catch (error) {
    console.error("❌ Error showing notification:", error);
    // Fallback to alert
    alert(`${type.toUpperCase()}: ${message}`);
  }
}

/**
 * Dismisses a notification with animation
 * @param {HTMLElement} notification - The notification element to dismiss
 */
function dismissNotification(notification) {
  try {
    if (notification && notification.parentNode) {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  } catch (error) {
    console.error("❌ Error dismissing notification:", error);
  }
}

/**
 * Adds notification to history for later viewing
 * @param {string} message - The notification message
 * @param {string} type - The notification type
 */
function addToNotificationHistory(message, type) {
  try {
    const history = JSON.parse(
      localStorage.getItem("notificationHistory") || "[]",
    );

    history.unshift({
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false,
    });

    // Keep only last 50 notifications
    if (history.length > 50) {
      history.splice(50);
    }

    localStorage.setItem("notificationHistory", JSON.stringify(history));

    // Update notification count in UI
    updateNotificationCount();
  } catch (error) {
    console.error("❌ Error adding to notification history:", error);
  }
}

/**
 * Updates notification count badge in UI
 */
function updateNotificationCount() {
  try {
    const history = JSON.parse(
      localStorage.getItem("notificationHistory") || "[]",
    );
    const unreadCount = history.filter((n) => !n.read).length;

    const badge = document.getElementById("notificationCount");
    if (badge) {
      badge.textContent = unreadCount;
      badge.style.display = unreadCount > 0 ? "block" : "none";
    }
  } catch (error) {
    console.error("❌ Error updating notification count:", error);
  }
}

/**
 * Plays notification sound based on type
 * @param {string} type - The notification type
 */
function playNotificationSound(type) {
  try {
    // Only play sounds if user hasn't disabled them
    const soundEnabled = localStorage.getItem("notificationSounds") !== "false";
    if (!soundEnabled) return;

    // Create audio context for notification sounds
    if ("AudioContext" in window || "webkitAudioContext" in window) {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Different frequencies for different types
      const frequencies = {
        success: 800,
        warning: 600,
        error: 400,
        info: 500,
      };

      oscillator.frequency.value = frequencies[type] || frequencies.info;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3,
      );

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  } catch (error) {
    // Silently fail - audio is not critical
    console.warn("⚠️ Could not play notification sound:", error);
  }
}

/* ==========================================================================
   MODAL DIALOG FUNCTIONS
   Enhanced functions for managing modal dialogs and overlays
   ========================================================================== */

/**
 * Closes the information modal dialog with enhanced cleanup
 */
function closeInfoModal() {
  try {
    const modal = document.getElementById("infoModal");
    if (modal) {
      modal.classList.remove("active");
      modal.style.display = "none";

      // Clear modal content to prevent memory leaks
      const bodyElement = document.getElementById("infoModalBody");
      if (bodyElement) {
        bodyElement.innerHTML = "";
      }
    }

    // Remove body scroll lock if it was applied
    document.body.style.overflow = "";
  } catch (error) {
    console.error("❌ Error closing info modal:", error);
  }
}

/**
 * Opens the information modal with enhanced content and accessibility
 * @param {string} title - The title for the modal header
 * @param {string} content - The HTML content to display in the modal body
 * @param {Object} options - Additional modal options
 */
function openInfoModal(title, content, options = {}) {
  try {
    const modal = document.getElementById("infoModal");
    const titleElement = modal?.querySelector(".modal-header h3");
    const bodyElement = document.getElementById("infoModalBody");

    if (!modal || !bodyElement) {
      console.warn("Info modal elements not found");
      // Fallback to alert
      alert(`${title}\n\n${content}`);
      return;
    }

    // Set the title if provided and title element exists
    if (title && titleElement) {
      titleElement.textContent = title;
    }

    // Set the content with sanitization
    if (typeof content === "string") {
      bodyElement.innerHTML = content;
    } else {
      bodyElement.textContent = String(content);
    }

    // Apply modal options
    if (options.size) {
      modal.classList.add(`modal-${options.size}`);
    }

    if (options.closable !== false) {
      // Ensure close button is visible
      const closeButton = modal.querySelector(".modal-close");
      if (closeButton) {
        closeButton.style.display = "block";
      }
    }

    // Show the modal
    modal.classList.add("active");
    modal.style.display = "flex";

    // Lock body scroll to prevent background scrolling
    document.body.style.overflow = "hidden";

    // Focus management for accessibility
    setTimeout(() => {
      const firstFocusable = modal.querySelector(
        "button, input, textarea, select, a[href]",
      );
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }, 100);

    console.log("📋 Info modal opened:", title);
  } catch (error) {
    console.error("❌ Error opening info modal:", error);
    // Fallback to alert
    alert(`${title}\n\n${content}`);
  }
}

/* ==========================================================================
   INITIALIZATION AND SETUP FUNCTIONS
   Enhanced initialization code that runs on page load
   ========================================================================== */

/**
 * Enhanced initialization function for backward compatibility
 * @param {string} pageName - The name of the current page
 * @param {Object} options - Optional configuration parameters
 */
function initializePageLayout(pageName, options = {}) {
  try {
    if (typeof LayoutManager !== "undefined") {
      LayoutManager.initializePage(pageName, options);
    } else {
      console.warn(
        "LayoutManager not loaded, falling back to basic initialization",
      );
      // Fallback for pages that haven't loaded the new system yet
      makeChatDraggable();
    }

    // Initialize wizard-specific features
    initializeWizardFeatures();
  } catch (error) {
    console.error("❌ Error initializing page layout:", error);
  }
}

/**
 * Initializes wizard-specific features and enhancements
 */
function initializeWizardFeatures() {
  try {
    // Restore saved wizard state if on wizard page
    if (window.location.pathname.includes("wizard")) {
      setTimeout(() => {
        restoreSavedWizardState();
      }, 1000);
    }

    // Restore filter states
    restoreFilterStates();

    // Update notification count
    updateNotificationCount();

    // Initialize auto-save for wizard
    setupWizardAutoSave();

    console.log("✅ Wizard features initialized");
  } catch (error) {
    console.error("❌ Error initializing wizard features:", error);
  }
}

/**
 * Sets up auto-save functionality for wizard
 */
function setupWizardAutoSave() {
  try {
    // Auto-save every 30 seconds if in wizard
    setInterval(() => {
      if (
        window.selectedFramework &&
        document.querySelectorAll(".question-input").length > 0
      ) {
        saveAllAnswers();
        console.log("💾 Auto-save completed");
      }
    }, 30000);
  } catch (error) {
    console.error("❌ Error setting up auto-save:", error);
  }
}

/* ==========================================================================
   EVENT LISTENERS AND PAGE SETUP
   Enhanced event handlers and initialization code
   ========================================================================== */

// Enhanced Event Listeners - Updated to work with new wizard system
document.addEventListener("DOMContentLoaded", function () {
  try {
    console.log("🚀 Enhanced scripts.js initializing...");

    // Initialize default data (creates admin user if none exist)
    initializeDefaultData();

    // Initialize demo mode if active
    if (isDemoMode()) {
      console.log("🎭 Demo mode detected, initializing demo features");
    }

    // Enable dragging for the chat popup
    makeChatDraggable();

    // Load avatar settings if they exist
    loadAvatarSettings();

    // Initialize wizard features
    initializeWizardFeatures();

    // Close menus when clicking outside
    document.addEventListener("click", function (event) {
      const target = event.target;

      // Close filter panels when clicking outside
      const filterPanels = document.querySelectorAll(".filter-panel.active");
      filterPanels.forEach((panel) => {
        if (!panel.contains(target) && !target.closest(".btn")) {
          panel.classList.remove("active");
        }
      });

      // Close modals when clicking on backdrop
      const activeModals = document.querySelectorAll(".modal.active");
      activeModals.forEach((modal) => {
        if (event.target === modal) {
          closeInfoModal();
        }
      });
    });

    // Enhanced keyboard shortcuts
    document.addEventListener("keydown", function (event) {
      // Escape key handling
      if (event.key === "Escape") {
        // Close modals
        const activeModals = document.querySelectorAll(".modal.active");
        activeModals.forEach(() => {
          closeInfoModal();
        });

        // Close chat if open
        const chatPopup = document.getElementById("chatPopup");
        if (chatPopup && chatPopup.classList.contains("active")) {
          toggleChat();
        }
      }

      // Ctrl/Cmd + S for save (in wizard)
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        if (window.selectedFramework) {
          event.preventDefault();
          saveAllAnswers();
          showNotification("Progress saved", "success");
        }
      }

      // Ctrl/Cmd + / for help
      if ((event.ctrlKey || event.metaKey) && event.key === "/") {
        event.preventDefault();
        if (typeof toggleChat === "function") {
          toggleChat();
        }
      }
    });

    // Window resize handler for responsive behavior
    window.addEventListener("resize", function () {
      // Ensure chat popup stays within viewport
      const chatPopup = document.getElementById("chatPopup");
      if (chatPopup) {
        const rect = chatPopup.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (rect.right > viewportWidth || rect.bottom > viewportHeight) {
          chatPopup.style.left =
            Math.min(rect.left, viewportWidth - rect.width) + "px";
          chatPopup.style.top =
            Math.min(rect.top, viewportHeight - rect.height) + "px";
        }
      }
    });

    console.log("✅ Enhanced scripts.js initialization complete");
  } catch (error) {
    console.error("❌ Error during enhanced scripts initialization:", error);
  }
});

// Visibility change handler for auto-save
document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "hidden" && window.selectedFramework) {
    // Save when user switches tabs or minimizes window
    saveAllAnswers();
  }
});

// Before unload handler for unsaved changes
window.addEventListener("beforeunload", function (event) {
  if (
    window.selectedFramework &&
    document.querySelectorAll(".question-input").length > 0
  ) {
    // Save before leaving
    saveAllAnswers();

    // Optionally warn about unsaved changes
    const unsavedChanges = Array.from(
      document.querySelectorAll(".question-input"),
    ).some(
      (input) =>
        input.value.trim() !== "" &&
        !localStorage.getItem("ai_risk_assessment_draft"),
    );

    if (unsavedChanges) {
      event.preventDefault();
      event.returnValue =
        "You have unsaved changes. Are you sure you want to leave?";
    }
  }
});

/* ==========================================================================
   GLOBAL EXPORTS AND COMPATIBILITY
   Export functions for module use and global access
   ========================================================================== */

// Export functions to global scope for onclick handlers and external access
if (typeof window !== "undefined") {
  // Enhanced function exports
  window.saveAllAnswers = saveAllAnswers;
  window.updateProgress = updateProgress; // ADDED: Missing function export
  window.closeInfoModal = closeInfoModal;
  window.openInfoModal = openInfoModal;
  window.restoreSavedWizardState = restoreSavedWizardState;
  window.showNotification = showNotification;
  window.updateChatContext = updateChatContext;
  window.toggleChat = toggleChat;
  window.makeChatDraggable = makeChatDraggable;
  window.toggleAvatarMode = toggleAvatarMode;
  window.openAvatarModal = openAvatarModal;
  window.closeAvatarModal = closeAvatarModal;
  window.saveAvatarSettings = saveAvatarSettings;
  window.loadAvatarSettings = loadAvatarSettings;
  window.showRiskDetails = showRiskDetails;
  window.updateBreadcrumb = updateBreadcrumb;
  window.toggleFilter = toggleFilter;
  window.initializePageLayout = initializePageLayout;

  // Core storage and user functions:
  window.getStoredData = getStoredData;
  window.saveStoredData = saveStoredData;
  window.generateId = generateId;
  window.getUserByEmail = getUserByEmail;
  window.getUserById = getUserById;
  window.saveUser = saveUser;
  window.getCompanyById = getCompanyById;
  window.saveCompany = saveCompany;
  window.deleteUser = deleteUser;
  window.deleteCompany = deleteCompany;

  // Validation functions:
  window.validateForm = validateForm;
  window.validateEmail = validateEmail;
  window.validatePassword = validatePassword;
  window.validateAuthForm = validateAuthForm;

  // Demo and user management functions:
  window.createDemoSampleData = createDemoSampleData;
  window.initializeDefaultData = initializeDefaultData;
  window.showDemoInfo = showDemoInfo;
  window.isDemoMode = isDemoMode;
  window.getCurrentUser = getCurrentUser;
  window.isUserLoggedIn = isUserLoggedIn;
  window.logout = logout;
}

// Export for module use if in Node.js environment
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    saveAllAnswers,
    closeInfoModal,
    openInfoModal,
    restoreSavedWizardState,
    showNotification,
    updateChatContext,
    toggleChat,
    makeChatDraggable,
    toggleAvatarMode,
    openAvatarModal,
    closeAvatarModal,
    saveAvatarSettings,
    loadAvatarSettings,
    showRiskDetails,
    updateBreadcrumb,
    toggleFilter,
    loadWidgetConfig,
    applyWidgetConfig,
    generateMockListData,
    generateId,
    getUserByEmail,
    getUserById,
    saveUser,
    getCompanyById,
    saveCompany,
    deleteUser,
    deleteCompany,
    validateForm,
    showNotification,
    getNotifications,
    saveNotifications,
    addStoredNotification,
    renderNotificationList,
    getDefaultScreen,
    setDefaultScreen,
    initializePageLayout,
  };
}

console.log(
  "✅ Enhanced scripts.js loaded successfully with complete wizard integration",
);
