// questionLoader.js - Enhanced Complete Version
// Dynamic question loading system integrated with the main wizard
// Handles question rendering, answer persistence, and validation

/* ==========================================================================
   CONSTANTS AND CONFIGURATION
   Storage keys and configuration options for the question system
   ========================================================================== */

// localStorage key for storing wizard answers across sessions
const STORAGE_KEY = "wizardAnswers";

// Configuration for different question input types and their rendering
const QUESTION_TYPES = {
  text: "text", // Single line text input
  textarea: "textarea", // Multi-line text input
  radio: "radio", // Single selection from options
  checkbox: "checkbox", // Multiple selection from options
  rating: "rating", // 1-5 rating scale
  select: "select", // Dropdown selection
};

// Default validation rules for different question types
const VALIDATION_RULES = {
  required: true, // Question must be answered
  minLength: 10, // Minimum character length for text answers
  maxLength: 1000, // Maximum character length for text answers
};

/* ==========================================================================
   ANSWER PERSISTENCE FUNCTIONS
   Functions for saving and retrieving user answers from localStorage
   ========================================================================== */

/**
 * Retrieves saved answers from localStorage
 * Handles parsing errors gracefully and returns empty object if data is corrupted
 * @returns {Object} Object containing saved answers keyed by question ID
 */
function getSavedAnswers() {
  try {
    // Attempt to retrieve and parse stored answers
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) {
      console.log("📋 No saved answers found");
      return {};
    }

    const parsedData = JSON.parse(storedData);
    console.log(
      "📋 Retrieved saved answers:",
      Object.keys(parsedData).length,
      "questions",
    );
    return parsedData;
  } catch (error) {
    console.error("❌ Failed to parse saved answers from localStorage:", error);
    // Clear corrupted data
    localStorage.removeItem(STORAGE_KEY);
    return {};
  }
}

/**
 * Saves a single answer to localStorage
 * Updates the existing answers object and persists to storage
 * @param {string} questionId - Unique identifier for the question
 * @param {string|Array} value - The answer value (string for most types, array for checkboxes)
 */
function saveAnswer(questionId, value) {
  try {
    // Get existing answers
    const existingAnswers = getSavedAnswers();

    // Update with new answer
    existingAnswers[questionId] = value;

    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingAnswers));

    console.log(`💾 Saved answer for ${questionId}:`, value);

    // Trigger progress update if function is available
    if (typeof updateProgress === "function") {
      updateProgress();
    }

    // Auto-save to main wizard system if available
    if (typeof window.saveAllAnswers === "function") {
      window.saveAllAnswers();
    }
  } catch (error) {
    console.error("❌ Failed to save answer:", error);

    // Show error notification if available
    if (typeof showNotification === "function") {
      showNotification("Error saving answer. Please try again.", "error");
    }
  }
}

/**
 * RENAMED FUNCTION: saveQuestionAnswers (was saveAllAnswers)
 * Saves all current answers from form inputs to localStorage
 * Scans the page for question inputs and saves their current values
 * Used as a comprehensive backup and for integration with main wizard
 */
function saveQuestionAnswers() {
  try {
    const answers = {};
    let savedCount = 0;

    // Collect answers from text inputs and textareas
    document.querySelectorAll(".question-input").forEach((element) => {
      const questionId = element.dataset.id || element.dataset.questionId;
      if (questionId && element.value) {
        answers[questionId] = element.value.trim();
        savedCount++;
      }
    });

    // Collect answers from radio buttons
    document
      .querySelectorAll('input[type="radio"]:checked')
      .forEach((radio) => {
        if (radio.name) {
          answers[radio.name] = radio.value;
          savedCount++;
        }
      });

    // Collect answers from checkboxes (multiple selections)
    const checkboxGroups = {};
    document
      .querySelectorAll('input[type="checkbox"]:checked')
      .forEach((checkbox) => {
        if (checkbox.name) {
          if (!checkboxGroups[checkbox.name]) {
            checkboxGroups[checkbox.name] = [];
          }
          checkboxGroups[checkbox.name].push(checkbox.value);
        }
      });

    // Add checkbox group answers
    Object.keys(checkboxGroups).forEach((groupName) => {
      answers[groupName] = checkboxGroups[groupName];
      savedCount++;
    });

    // Collect answers from rating scales
    document.querySelectorAll(".rating-option.selected").forEach((rating) => {
      const questionGroup = rating.closest(".question-group");
      if (questionGroup) {
        const questionId = questionGroup.dataset.questionId;
        const ratingValue =
          rating.dataset.value ||
          rating.querySelector(".rating-number")?.textContent;
        if (questionId && ratingValue) {
          answers[questionId] = ratingValue;
          savedCount++;
        }
      }
    });

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));

    console.log(`💾 Saved all question answers: ${savedCount} questions`);

    // Update global answers object if it exists
    if (typeof window !== "undefined" && window.userAnswers) {
      window.userAnswers = { ...window.userAnswers, ...answers };
    }

    return answers;
  } catch (error) {
    console.error("❌ Failed to save all question answers:", error);

    if (typeof showNotification === "function") {
      showNotification("Error saving answers. Please try again.", "error");
    }

    return {};
  }
}

/* ==========================================================================
   QUESTION LOADING AND RENDERING FUNCTIONS
   Functions for loading questions from JSON and rendering them in the UI
   ========================================================================== */

/**
 * Loads questions for a specific step from the JSON data
 * This function integrates with the main wizard's question loading system
 * @param {number} step - The step number to load questions for (1-based)
 * @param {string} frameworkKey - Optional framework key for targeted loading
 */
function loadQuestions(step = 1, frameworkKey = null) {
  console.log(`📋 Loading questions for step ${step}...`);

  // Show loading state
  showLoadingState(`Loading questions for step ${step}...`);

  fetch("onboarding_questions.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("📋 Question data loaded successfully");

      // Determine which framework to use
      let targetFramework = frameworkKey;
      if (!targetFramework) {
        // Try to get from global variables
        if (
          typeof window !== "undefined" &&
          window.selectedFramework &&
          window.FRAMEWORK_CONFIGS
        ) {
          const config = window.FRAMEWORK_CONFIGS[window.selectedFramework];
          targetFramework = config ? config.jsonKey : null;
        }
      }

      // If still no framework, use the first available
      if (!targetFramework) {
        targetFramework = Object.keys(data)[0];
        console.warn(
          "⚠️ No framework specified, using first available:",
          targetFramework,
        );
      }

      // Get questions for the framework
      const frameworkQuestions = data[targetFramework];
      if (!frameworkQuestions || !Array.isArray(frameworkQuestions)) {
        throw new Error(`No questions found for framework: ${targetFramework}`);
      }

      // Filter questions for the specified step
      const stepLabel = `Step ${step}`;
      const stepQuestions = frameworkQuestions.filter(
        (question) => question.step && question.step.startsWith(stepLabel),
      );

      console.log(
        `📋 Found ${stepQuestions.length} questions for ${stepLabel}`,
      );

      // Render questions in the appropriate container
      renderQuestionsForStep(stepQuestions, step);

      // Hide loading state
      hideLoadingState();

      // Show success notification
      if (typeof showNotification === "function" && stepQuestions.length > 0) {
        showNotification(
          `Loaded ${stepQuestions.length} questions for Step ${step}`,
          "success",
        );
      }
    })
    .catch((error) => {
      console.error("❌ Failed to load questions:", error);

      // Hide loading state and show error
      hideLoadingState();
      showErrorState(`Failed to load questions: ${error.message}`);

      if (typeof showNotification === "function") {
        showNotification(
          "Failed to load questions. Please refresh the page.",
          "error",
        );
      }
    });
}

/**
 * Renders questions for a specific step in the appropriate container
 * @param {Array} questions - Array of question objects to render
 * @param {number} step - The step number these questions belong to
 */
function renderQuestionsForStep(questions, step) {
  try {
    // Try to find step-specific container first
    let container = document.getElementById(`dynamic-questions-step${step}`);

    // If no step-specific container, try the main wizard body
    if (!container) {
      container = document.getElementById("wizardBody");
    }

    // If still no container, create error state
    if (!container) {
      console.error(`❌ No container found for step ${step} questions`);
      return;
    }

    // Clear existing content
    container.innerHTML = "";

    if (questions.length === 0) {
      container.innerHTML = `
        <div class="no-questions-message">
          <p style="color: var(--text-gray); font-style: italic; text-align: center; padding: 2rem;">
            No additional questions for this step.
          </p>
        </div>
      `;
      return;
    }

    // Get saved answers for restoration
    const savedAnswers = getSavedAnswers();

    // Render each question
    questions.forEach((question, index) => {
      const questionElement = createQuestionElement(
        question,
        index,
        step,
        savedAnswers,
      );
      container.appendChild(questionElement);
    });

    // Attach event handlers for interactive elements
    attachQuestionEventHandlers();

    // Restore any saved answers
    restoreAnswersForStep(step);

    console.log(`✅ Rendered ${questions.length} questions for step ${step}`);
  } catch (error) {
    console.error("❌ Error rendering questions:", error);
    showErrorInContainer(
      container,
      "Error rendering questions. Please refresh the page.",
    );
  }
}

/**
 * Creates a DOM element for a single question
 * @param {Object} question - Question data object from JSON
 * @param {number} index - Index of question in the step (0-based)
 * @param {number} step - Step number this question belongs to
 * @param {Object} savedAnswers - Previously saved answers object
 * @returns {HTMLElement} Fully configured question DOM element
 */
function createQuestionElement(question, index, step, savedAnswers) {
  // Generate unique question ID
  const questionId = `s${step}_q_${index}`;

  // Create main question container
  const questionDiv = document.createElement("div");
  questionDiv.className = "question-group";
  questionDiv.dataset.questionId = questionId;

  // Determine question type (default to textarea)
  const questionType = determineQuestionType(question);

  // Create question HTML structure
  questionDiv.innerHTML = `
    <!-- Question number and title -->
    <div class="question-title">
      <div class="question-number">${index + 1}</div>
      <span>${question.question}</span>
      ${
        question.info
          ? `
        <a href="#" class="info-link" data-info="${escapeHtml(question.info)}" title="Get more information">
          <i class="fas fa-info-circle"></i>
        </a>
      `
          : ""
      }
    </div>
    
    <!-- Question description if available -->
    ${
      question.description
        ? `
      <div class="question-description">${escapeHtml(question.description)}</div>
    `
        : ""
    }
    
    <!-- Question input area -->
    <div class="question-input-container">
      ${createQuestionInput(question, questionId, questionType, savedAnswers)}
    </div>
    
    <!-- Validation feedback area -->
    <div class="question-feedback" id="feedback-${questionId}"></div>
  `;

  return questionDiv;
}

/**
 * Determines the appropriate input type for a question based on its content
 * @param {Object} question - Question object from JSON
 * @returns {string} Question type (text, radio, rating, etc.)
 */
function determineQuestionType(question) {
  const questionText = question.question.toLowerCase();

  // Check for rating scale indicators
  if (
    questionText.includes("rate") ||
    questionText.includes("score") ||
    questionText.includes("scale") ||
    questionText.includes("level")
  ) {
    return QUESTION_TYPES.rating;
  }

  // Check for yes/no questions
  if (
    questionText.includes("do you") ||
    questionText.includes("have you") ||
    questionText.includes("are you") ||
    questionText.includes("is there")
  ) {
    return QUESTION_TYPES.radio;
  }

  // Check for multiple choice indicators
  if (
    questionText.includes("which") ||
    questionText.includes("select") ||
    questionText.includes("choose")
  ) {
    return QUESTION_TYPES.radio;
  }

  // Default to textarea for longer responses
  return QUESTION_TYPES.textarea;
}

/**
 * Creates the input HTML for a question based on its type
 * @param {Object} question - Question object from JSON
 * @param {string} questionId - Unique question identifier
 * @param {string} questionType - Type of input to create
 * @param {Object} savedAnswers - Previously saved answers for restoration
 * @returns {string} HTML string for the question input
 */
function createQuestionInput(question, questionId, questionType, savedAnswers) {
  const savedValue = savedAnswers[questionId] || "";
  const placeholder = question.sample || "Please provide your answer...";

  switch (questionType) {
    case QUESTION_TYPES.text:
      return `
        <input 
          type="text" 
          class="question-input" 
          data-id="${questionId}"
          data-question-id="${questionId}"
          placeholder="${escapeHtml(placeholder)}"
          value="${escapeHtml(savedValue)}"
          oninput="handleInputChange(this, '${questionId}')"
          onblur="validateQuestion('${questionId}')"
        />
      `;

    case QUESTION_TYPES.textarea:
      return `
        <textarea 
          class="question-input" 
          data-id="${questionId}"
          data-question-id="${questionId}"
          rows="4" 
          placeholder="${escapeHtml(placeholder)}"
          oninput="handleInputChange(this, '${questionId}')"
          onblur="validateQuestion('${questionId}')"
        >${escapeHtml(savedValue)}</textarea>
      `;

    case QUESTION_TYPES.radio:
      return createRadioInput(questionId, savedValue);

    case QUESTION_TYPES.rating:
      return createRatingInput(questionId, savedValue);

    default:
      return createTextareaInput(questionId, placeholder, savedValue);
  }
}

/**
 * Creates a radio button group for yes/no questions
 * @param {string} questionId - Unique question identifier
 * @param {string} savedValue - Previously saved value for this question
 * @returns {string} HTML for radio button group
 */
function createRadioInput(questionId, savedValue) {
  return `
    <div class="radio-group">
      <div class="radio-option ${savedValue === "yes" ? "selected" : ""}" onclick="selectRadioOption(this, '${questionId}', 'yes')">
        <input type="radio" name="${questionId}" value="yes" ${savedValue === "yes" ? "checked" : ""}>
        <div>
          <strong>Yes</strong>
          <div style="font-size: 0.875rem; color: var(--text-gray);">This applies to our organization</div>
        </div>
      </div>
      <div class="radio-option ${savedValue === "no" ? "selected" : ""}" onclick="selectRadioOption(this, '${questionId}', 'no')">
        <input type="radio" name="${questionId}" value="no" ${savedValue === "no" ? "checked" : ""}>
        <div>
          <strong>No</strong>
          <div style="font-size: 0.875rem; color: var(--text-gray);">This does not apply to our organization</div>
        </div>
      </div>
      <div class="radio-option ${savedValue === "partial" ? "selected" : ""}" onclick="selectRadioOption(this, '${questionId}', 'partial')">
        <input type="radio" name="${questionId}" value="partial" ${savedValue === "partial" ? "checked" : ""}>
        <div>
          <strong>Partially</strong>
          <div style="font-size: 0.875rem; color: var(--text-gray);">This partially applies or is in progress</div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Creates a 1-5 rating scale input
 * @param {string} questionId - Unique question identifier
 * @param {string} savedValue - Previously saved value for this question
 * @returns {string} HTML for rating scale
 */
function createRatingInput(questionId, savedValue) {
  const ratings = [
    { value: "1", label: "Poor" },
    { value: "2", label: "Fair" },
    { value: "3", label: "Good" },
    { value: "4", label: "Very Good" },
    { value: "5", label: "Excellent" },
  ];

  return `
    <div class="rating-scale">
      ${ratings
        .map(
          (rating) => `
        <div class="rating-option ${savedValue === rating.value ? "selected" : ""}" 
             onclick="selectRating(this, '${questionId}', '${rating.value}')"
             data-value="${rating.value}">
          <div class="rating-number">${rating.value}</div>
          <div class="rating-label">${rating.label}</div>
        </div>
      `,
        )
        .join("")}
    </div>
  `;
}

/**
 * Creates a textarea input (fallback for unknown types)
 * @param {string} questionId - Unique question identifier
 * @param {string} placeholder - Placeholder text
 * @param {string} savedValue - Previously saved value
 * @returns {string} HTML for textarea
 */
function createTextareaInput(questionId, placeholder, savedValue) {
  return `
    <textarea 
      class="question-input" 
      data-id="${questionId}"
      data-question-id="${questionId}"
      rows="4" 
      placeholder="${escapeHtml(placeholder)}"
      oninput="handleInputChange(this, '${questionId}')"
      onblur="validateQuestion('${questionId}')"
    >${escapeHtml(savedValue)}</textarea>
  `;
}

/* ==========================================================================
   EVENT HANDLING FUNCTIONS
   Functions for handling user interactions with questions
   ========================================================================== */

/**
 * Attaches event handlers to question elements
 * Sets up info links, form validation, and accessibility features
 */
function attachQuestionEventHandlers() {
  try {
    // Attach info link handlers
    document.querySelectorAll(".info-link").forEach((link) => {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        const infoText = this.dataset.info;
        openInfoModal("Question Information", infoText);
      });
    });

    // Attach validation handlers to inputs
    document.querySelectorAll(".question-input").forEach((input) => {
      // Real-time validation feedback
      input.addEventListener("input", function () {
        clearValidationFeedback(this.dataset.questionId);
      });

      // Full validation on blur
      input.addEventListener("blur", function () {
        validateQuestion(this.dataset.questionId);
      });
    });

    console.log("✅ Question event handlers attached");
  } catch (error) {
    console.error("❌ Error attaching event handlers:", error);
  }
}

/**
 * Handles input changes and saves answers automatically
 * @param {HTMLElement} input - The input element that changed
 * @param {string} questionId - The question identifier
 */
function handleInputChange(input, questionId) {
  try {
    const value = input.value.trim();

    // Save the answer immediately
    saveAnswer(questionId, value);

    // Clear any previous validation errors
    clearValidationFeedback(questionId);

    // Trigger progress update
    if (typeof updateProgress === "function") {
      updateProgress();
    }
  } catch (error) {
    console.error("❌ Error handling input change:", error);
  }
}

/**
 * Handles radio button selection
 * @param {HTMLElement} element - The radio option element that was clicked
 * @param {string} questionId - The question identifier
 * @param {string} value - The selected value
 */
function selectRadioOption(element, questionId, value) {
  try {
    // Update visual selection
    const radioGroup = element.closest(".radio-group");
    if (radioGroup) {
      // Remove selection from all options in this group
      radioGroup.querySelectorAll(".radio-option").forEach((option) => {
        option.classList.remove("selected");
      });

      // Add selection to clicked option
      element.classList.add("selected");
    }

    // Update the actual radio button
    const radioInput = element.querySelector('input[type="radio"]');
    if (radioInput) {
      radioInput.checked = true;
    }

    // Save the answer
    saveAnswer(questionId, value);

    // Clear validation feedback
    clearValidationFeedback(questionId);

    // Trigger progress update
    if (typeof updateProgress === "function") {
      updateProgress();
    }

    console.log(`✅ Radio selected: ${questionId} = ${value}`);
  } catch (error) {
    console.error("❌ Error selecting radio option:", error);
  }
}

/**
 * Handles rating selection
 * @param {HTMLElement} element - The rating option element that was clicked
 * @param {string} questionId - The question identifier
 * @param {string} value - The selected rating value
 */
function selectRating(element, questionId, value) {
  try {
    // Update visual selection
    const ratingScale = element.closest(".rating-scale");
    if (ratingScale) {
      // Remove selection from all ratings in this scale
      ratingScale.querySelectorAll(".rating-option").forEach((option) => {
        option.classList.remove("selected");
      });

      // Add selection to clicked rating
      element.classList.add("selected");
    }

    // Save the answer
    saveAnswer(questionId, value);

    // Clear validation feedback
    clearValidationFeedback(questionId);

    // Trigger progress update
    if (typeof updateProgress === "function") {
      updateProgress();
    }

    console.log(`✅ Rating selected: ${questionId} = ${value}`);
  } catch (error) {
    console.error("❌ Error selecting rating:", error);
  }
}

/* ==========================================================================
   VALIDATION FUNCTIONS
   Functions for validating question answers and providing feedback
   ========================================================================== */

/**
 * Validates a single question's answer
 * @param {string} questionId - The question identifier to validate
 * @returns {boolean} True if validation passes, false otherwise
 */
function validateQuestion(questionId) {
  try {
    const questionElement = document.querySelector(
      `[data-question-id="${questionId}"]`,
    );
    if (!questionElement) {
      console.warn(`Question element not found: ${questionId}`);
      return true;
    }

    const savedAnswers = getSavedAnswers();
    const answer = savedAnswers[questionId];

    // Check if answer exists and has content
    if (!answer || (typeof answer === "string" && answer.trim().length === 0)) {
      // For now, don't enforce required validation
      // showValidationFeedback(questionId, 'This question requires an answer', 'warning');
      return true;
    }

    // Validate text length for text answers
    if (typeof answer === "string") {
      if (answer.length < VALIDATION_RULES.minLength) {
        showValidationFeedback(
          questionId,
          `Please provide a more detailed answer (at least ${VALIDATION_RULES.minLength} characters)`,
          "info",
        );
        return false;
      }

      if (answer.length > VALIDATION_RULES.maxLength) {
        showValidationFeedback(
          questionId,
          `Answer is too long (maximum ${VALIDATION_RULES.maxLength} characters)`,
          "error",
        );
        return false;
      }
    }

    // Clear any existing feedback for valid answers
    clearValidationFeedback(questionId);
    return true;
  } catch (error) {
    console.error("❌ Error validating question:", error);
    return true; // Allow progression if validation fails
  }
}

/**
 * Shows validation feedback for a question
 * @param {string} questionId - The question identifier
 * @param {string} message - The feedback message
 * @param {string} type - The feedback type (error, warning, info, success)
 */
function showValidationFeedback(questionId, message, type = "error") {
  try {
    const feedbackElement = document.getElementById(`feedback-${questionId}`);
    if (!feedbackElement) return;

    // Clear existing feedback
    feedbackElement.innerHTML = "";

    // Create feedback message
    const feedbackDiv = document.createElement("div");
    feedbackDiv.className = `validation-feedback validation-${type}`;
    feedbackDiv.innerHTML = `
      <i class="fas fa-${getIconForType(type)}"></i>
      <span>${message}</span>
    `;

    feedbackElement.appendChild(feedbackDiv);

    // Add CSS styles dynamically if not defined
    if (!document.getElementById("validation-styles")) {
      addValidationStyles();
    }
  } catch (error) {
    console.error("❌ Error showing validation feedback:", error);
  }
}

/**
 * Clears validation feedback for a question
 * @param {string} questionId - The question identifier
 */
function clearValidationFeedback(questionId) {
  try {
    const feedbackElement = document.getElementById(`feedback-${questionId}`);
    if (feedbackElement) {
      feedbackElement.innerHTML = "";
    }
  } catch (error) {
    console.error("❌ Error clearing validation feedback:", error);
  }
}

/**
 * Gets the appropriate icon for a feedback type
 * @param {string} type - The feedback type
 * @returns {string} Font Awesome icon class
 */
function getIconForType(type) {
  const icons = {
    error: "exclamation-circle",
    warning: "exclamation-triangle",
    info: "info-circle",
    success: "check-circle",
  };
  return icons[type] || "info-circle";
}

/**
 * Adds validation CSS styles to the document
 */
function addValidationStyles() {
  const styleElement = document.createElement("style");
  styleElement.id = "validation-styles";
  styleElement.textContent = `
    .validation-feedback {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.5rem;
      padding: 0.5rem;
      border-radius: var(--border-radius-sm, 6px);
      font-size: 0.875rem;
    }
    
    .validation-error {
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid #fecaca;
    }
    
    .validation-warning {
      background: #fffbeb;
      color: #d97706;
      border: 1px solid #fed7aa;
    }
    
    .validation-info {
      background: #eff6ff;
      color: #2563eb;
      border: 1px solid #bfdbfe;
    }
    
    .validation-success {
      background: #f0fdf4;
      color: #16a34a;
      border: 1px solid #bbf7d0;
    }
  `;

  document.head.appendChild(styleElement);
}

/* ==========================================================================
   ANSWER RESTORATION FUNCTIONS
   Functions for restoring saved answers when questions are loaded
   ========================================================================== */

/**
 * Restores saved answers for a specific step
 * @param {number} step - The step number to restore answers for
 */
function restoreAnswersForStep(step) {
  try {
    const savedAnswers = getSavedAnswers();
    let restoredCount = 0;

    // Restore text inputs and textareas
    document.querySelectorAll(".question-input").forEach((input) => {
      const questionId = input.dataset.id || input.dataset.questionId;
      if (questionId && savedAnswers[questionId]) {
        input.value = savedAnswers[questionId];
        restoredCount++;
      }
    });

    // Restore radio button selections
    Object.keys(savedAnswers).forEach((questionId) => {
      const value = savedAnswers[questionId];
      const radioInput = document.querySelector(
        `input[name="${questionId}"][value="${value}"]`,
      );
      if (radioInput) {
        radioInput.checked = true;

        // Update visual selection
        const radioOption = radioInput.closest(".radio-option");
        if (radioOption) {
          // Clear other selections in this group
          const radioGroup = radioOption.closest(".radio-group");
          if (radioGroup) {
            radioGroup.querySelectorAll(".radio-option").forEach((option) => {
              option.classList.remove("selected");
            });
          }

          // Select this option
          radioOption.classList.add("selected");
          restoredCount++;
        }
      }
    });

    // Restore rating selections
    Object.keys(savedAnswers).forEach((questionId) => {
      const value = savedAnswers[questionId];
      const ratingOption = document.querySelector(`[data-value="${value}"]`);
      if (ratingOption && ratingOption.closest(".rating-scale")) {
        // Clear other selections in this scale
        const ratingScale = ratingOption.closest(".rating-scale");
        ratingScale.querySelectorAll(".rating-option").forEach((option) => {
          option.classList.remove("selected");
        });

        // Select this rating
        ratingOption.classList.add("selected");
        restoredCount++;
      }
    });

    if (restoredCount > 0) {
      console.log(`🔄 Restored ${restoredCount} answers for step ${step}`);
    }
  } catch (error) {
    console.error("❌ Error restoring answers:", error);
  }
}

/* ==========================================================================
   UI STATE MANAGEMENT FUNCTIONS
   Functions for managing loading states and user feedback
   ========================================================================== */

/**
 * Shows loading state while questions are being loaded
 * @param {string} message - Loading message to display
 */
function showLoadingState(message = "Loading questions...") {
  try {
    // Try to find existing loading state element
    let loadingElement = document.getElementById("questionLoadingState");

    if (!loadingElement) {
      // Create loading state element if it doesn't exist
      loadingElement = document.createElement("div");
      loadingElement.id = "questionLoadingState";
      loadingElement.className = "loading-state";
      loadingElement.innerHTML = `
        <div class="loading-spinner"></div>
        <div class="loading-message">${message}</div>
      `;

      // Add to the first available container
      const container =
        document.getElementById("wizardBody") ||
        document.querySelector(".wizard-body") ||
        document.querySelector(".content");

      if (container) {
        container.appendChild(loadingElement);
      }
    } else {
      // Update existing loading message
      const messageElement = loadingElement.querySelector(".loading-message");
      if (messageElement) {
        messageElement.textContent = message;
      }
      loadingElement.style.display = "block";
    }
  } catch (error) {
    console.error("❌ Error showing loading state:", error);
  }
}

/**
 * Hides the loading state
 */
function hideLoadingState() {
  try {
    const loadingElement = document.getElementById("questionLoadingState");
    if (loadingElement) {
      loadingElement.style.display = "none";
    }
  } catch (error) {
    console.error("❌ Error hiding loading state:", error);
  }
}

/**
 * Shows error state when question loading fails
 * @param {string} message - Error message to display
 */
function showErrorState(message) {
  try {
    hideLoadingState();

    const container =
      document.getElementById("wizardBody") ||
      document.querySelector(".wizard-body") ||
      document.querySelector(".content");

    if (container) {
      showErrorInContainer(container, message);
    }
  } catch (error) {
    console.error("❌ Error showing error state:", error);
  }
}

/**
 * Shows error message in a specific container
 * @param {HTMLElement} container - Container to show error in
 * @param {string} message - Error message to display
 */
function showErrorInContainer(container, message) {
  try {
    container.innerHTML = `
      <div class="error-state" style="
        text-align: center; 
        padding: 3rem; 
        color: var(--danger-red, #dc2626);
        background: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: var(--border-radius, 8px);
        margin: 1rem 0;
      ">
        <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
        <h3 style="margin-bottom: 0.5rem;">Error Loading Questions</h3>
        <p style="margin: 0;">${message}</p>
        <button onclick="window.location.reload()" style="
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: var(--danger-red, #dc2626);
          color: white;
          border: none;
          border-radius: var(--border-radius-sm, 6px);
          cursor: pointer;
        ">
          Refresh Page
        </button>
      </div>
    `;
  } catch (error) {
    console.error("❌ Error showing error in container:", error);
  }
}

/* ==========================================================================
   UTILITY FUNCTIONS
   Helper functions for common operations
   ========================================================================== */

/**
 * Escapes HTML characters to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped text safe for HTML insertion
 */
function escapeHtml(text) {
  if (typeof text !== "string") return "";

  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Opens the information modal with specified content
 * @param {string} title - Modal title
 * @param {string} content - Modal content
 */
function openInfoModal(title, content) {
  try {
    // Try to use existing modal function
    if (typeof window.openInfoModal === "function") {
      window.openInfoModal(title, content);
      return;
    }

    // Fallback to basic modal
    const modal = document.getElementById("infoModal");
    const titleElement = modal?.querySelector(".modal-header h3");
    const bodyElement = document.getElementById("infoModalBody");

    if (modal && bodyElement) {
      if (titleElement) titleElement.textContent = title;
      bodyElement.textContent = content;
      modal.classList.add("active");
      modal.style.display = "flex";
    } else {
      // Ultimate fallback to alert
      alert(`${title}\n\n${content}`);
    }

    // Add to chat if available
    if (
      typeof addChatMessage === "function" &&
      typeof window.chatContext === "string"
    ) {
      try {
        addChatMessage(window.chatContext, "ai", content);
      } catch (e) {
        console.warn("Chat message failed", e);
      }
    }
  } catch (error) {
    console.error("❌ Error opening info modal:", error);
    alert(`${title}\n\n${content}`);
  }
}

/**
 * Closes the information modal
 */
function closeInfoModal() {
  try {
    // Try to use existing modal function
    if (typeof window.closeInfoModal === "function") {
      window.closeInfoModal();
      return;
    }

    // Fallback modal closing
    const modal = document.getElementById("infoModal");
    if (modal) {
      modal.classList.remove("active");
      modal.style.display = "none";
    }
  } catch (error) {
    console.error("❌ Error closing info modal:", error);
  }
}

/* ==========================================================================
   GLOBAL EXPORTS AND INITIALIZATION
   Export functions and set up global access
   ========================================================================== */

// Export functions to global scope for onclick handlers and external access
if (typeof window !== "undefined") {
  // RENAMED EXPORT: Main save function is now saveQuestionAnswers
  window.saveQuestionAnswers = saveQuestionAnswers;

  // Other exports remain the same
  window.closeInfoModal = closeInfoModal;
  window.loadQuestions = loadQuestions;
  window.saveAnswer = saveAnswer;
  window.getSavedAnswers = getSavedAnswers;
  window.handleInputChange = handleInputChange;
  window.selectRadioOption = selectRadioOption;
  window.selectRating = selectRating;
  window.validateQuestion = validateQuestion;
  window.restoreAnswersForStep = restoreAnswersForStep;
  window.openInfoModal = openInfoModal;
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  console.log("📋 Enhanced Question Loader initialized");

  // Set up auto-save for questions every 30 seconds
  setInterval(() => {
    if (document.querySelectorAll(".question-input").length > 0) {
      saveQuestionAnswers();
    }
  }, 30000);
});

// Export for module use if in Node.js environment
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    loadQuestions,
    saveAnswer,
    saveQuestionAnswers, // RENAMED: was saveAllAnswers
    getSavedAnswers,
    validateQuestion,
    restoreAnswersForStep,
    handleInputChange,
    selectRadioOption,
    selectRating,
  };
}

console.log(
  "📋 Enhanced Question Loader loaded successfully with renamed functions",
);
