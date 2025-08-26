// chatLogic.js - Enhanced Complete Version
// AI chat functionality with wizard integration support
// Builds on existing chat system and adds missing wizard requirements

/* ==========================================================================
   CORE CHAT STORAGE FUNCTIONS
   Functions for managing chat history persistence in localStorage
   ========================================================================== */

/**
 * Generates a unique localStorage key for chat history based on context
 * @param {string} ctx - The chat context identifier (e.g., "AI Risk Assessment")
 * @returns {string} Formatted localStorage key
 */
function getHistoryKey(ctx) {
  return `chatHistory-${ctx}`;
}

/**
 * Loads chat history for a specific context from localStorage
 * @param {string} ctx - The chat context identifier
 * @returns {Array} Array of chat message objects or empty array if none found
 */
function loadChatHistory(ctx) {
  const raw = localStorage.getItem(getHistoryKey(ctx));
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    // Ensure the parsed data is an array
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error parsing chat history:", error);
    return [];
  }
}

/**
 * Saves chat messages array to localStorage for a specific context
 * @param {string} ctx - The chat context identifier
 * @param {Array} msgs - Array of message objects to save
 */
function saveChatHistory(ctx, msgs) {
  try {
    localStorage.setItem(getHistoryKey(ctx), JSON.stringify(msgs));
  } catch (error) {
    console.error("Error saving chat history:", error);
  }
}

/* ==========================================================================
   CHAT DISPLAY AND RENDERING FUNCTIONS
   Functions for updating the chat interface with messages
   ========================================================================== */

/**
 * Renders chat messages in the chat interface
 * @param {Array} msgs - Array of message objects to display
 */
function renderChatMessages(msgs) {
  const container = document.querySelector(".chat-messages");
  if (!container) {
    console.warn("Chat messages container not found");
    return;
  }

  // Clear existing messages
  container.innerHTML = "";

  // Render each message
  msgs.forEach((m) => {
    const row = document.createElement("div");
    row.className = `chat-message ${m.sender}`;

    const bubble = document.createElement("div");
    bubble.className = "message-bubble";
    bubble.textContent = m.text;

    // Add timestamp if available
    if (m.time) {
      const timestamp = document.createElement("div");
      timestamp.className = "message-timestamp";
      timestamp.textContent = new Date(m.time).toLocaleTimeString();
      bubble.appendChild(timestamp);
    }

    row.appendChild(bubble);
    container.appendChild(row);
  });

  // Auto-scroll to bottom to show latest message
  container.scrollTop = container.scrollHeight;
}

/**
 * Adds a new message to the chat and updates the display
 * @param {string} ctx - The chat context identifier
 * @param {string} sender - Either 'user' or 'ai'
 * @param {string} text - The message content
 */
function addChatMessage(ctx, sender, text) {
  try {
    // Load existing chat history
    const msgs = loadChatHistory(ctx);

    // Create new message object
    const newMessage = {
      sender: sender,
      text: text,
      time: Date.now(),
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    // Add to history
    msgs.push(newMessage);

    // Keep only last 100 messages to prevent localStorage bloat
    if (msgs.length > 100) {
      msgs.splice(0, msgs.length - 100);
    }

    // Save updated history
    saveChatHistory(ctx, msgs);

    // Update display
    renderChatMessages(msgs);

    // Log for debugging
    console.log(`Chat message added to ${ctx}:`, newMessage);
  } catch (error) {
    console.error("Error adding chat message:", error);
  }
}

/* ==========================================================================
   CHAT INITIALIZATION AND SETUP
   Functions for setting up the chat interface and event handlers
   ========================================================================== */

/**
 * Sets up the chat interface for a specific context
 * @param {string} ctx - The chat context identifier
 */
function setupChat(ctx) {
  try {
    // Load existing chat history or create welcome message
    let history = loadChatHistory(ctx);
    if (history.length === 0) {
      // Create a contextual welcome message
      const welcomeMessage = {
        sender: "ai",
        text: `Welcome to the ${ctx} screen. How can I assist you?`,
        time: Date.now(),
        id: `welcome_${Date.now()}`,
      };
      history.push(welcomeMessage);
      saveChatHistory(ctx, history);
    }

    // Render existing messages
    renderChatMessages(history);

    // Set up send button event listener
    const sendBtn = document.querySelector(".btn-ai");
    const input = document.querySelector(".chat-input");

    if (sendBtn && input) {
      // Remove existing event listeners to prevent duplicates
      sendBtn.replaceWith(sendBtn.cloneNode(true));
      const newSendBtn = document.querySelector(".btn-ai");

      newSendBtn.addEventListener("click", function () {
        handleMessageSend(ctx, input);
      });

      // Add Enter key support for message input
      input.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          handleMessageSend(ctx, input);
        }
      });
    }

    // Set up search functionality if search input exists
    const search = document.getElementById("chatSearch");
    if (search) {
      search.addEventListener("input", function () {
        filterChatMessages(search.value);
      });
    }

    console.log(`Chat setup completed for context: ${ctx}`);
  } catch (error) {
    console.error("Error setting up chat:", error);
  }
}

/**
 * Handles sending a new message from the user
 * @param {string} ctx - The chat context identifier
 * @param {HTMLElement} input - The input element containing the message
 */
function handleMessageSend(ctx, input) {
  try {
    const val = input.value.trim();
    if (!val) return;

    // Add user message
    addChatMessage(ctx, "user", val);

    // Clear input
    input.value = "";

    // Generate AI response (placeholder for now)
    setTimeout(() => {
      generateAIResponse(ctx, val);
    }, 500);
  } catch (error) {
    console.error("Error handling message send:", error);
  }
}

/**
 * Generates an AI response based on user input and context
 * @param {string} ctx - The chat context identifier
 * @param {string} userMessage - The user's message
 */
function generateAIResponse(ctx, userMessage) {
  try {
    let response = "";

    // Context-aware responses based on current page/section
    if (ctx.toLowerCase().includes("risk assessment")) {
      response = generateRiskAssessmentResponse(userMessage);
    } else if (ctx.toLowerCase().includes("ai governance")) {
      response = generateAIGovernanceResponse(userMessage);
    } else if (ctx.toLowerCase().includes("risk management")) {
      response = generateRiskManagementResponse(userMessage);
    } else {
      response = generateGenericResponse(userMessage);
    }

    // Add AI response to chat
    addChatMessage(ctx, "ai", response);
  } catch (error) {
    console.error("Error generating AI response:", error);
    addChatMessage(
      ctx,
      "ai",
      "I apologize, but I encountered an error processing your request. Please try again.",
    );
  }
}

/* ==========================================================================
   AI RESPONSE GENERATION FUNCTIONS
   Context-specific response generators for different application areas
   ========================================================================== */

/**
 * Generates AI responses for risk assessment context
 * @param {string} userMessage - The user's message
 * @returns {string} AI response text
 */
function generateRiskAssessmentResponse(userMessage) {
  const message = userMessage.toLowerCase();

  if (message.includes("help") || message.includes("how")) {
    return "I can help you complete the AI risk assessment. This wizard will guide you through determining your AI system's EU AI Act classification. Would you like help with a specific step?";
  } else if (message.includes("step") || message.includes("next")) {
    return 'Each step builds on the previous one. Make sure to answer all questions completely for the most accurate classification. You can save your progress at any time using the "Save Draft" button.';
  } else if (
    message.includes("classification") ||
    message.includes("category")
  ) {
    return "The EU AI Act classifies AI systems into four categories: Minimal Risk, Limited Risk, High Risk, and Prohibited. Your answers will help determine which category applies to your system.";
  } else if (message.includes("save") || message.includes("draft")) {
    return 'Your progress is automatically saved as you complete each question. You can also manually save using the "Save Draft" button. Your answers are stored locally and will be available when you return.';
  } else {
    return "I'm here to help with your AI risk assessment. You can ask me about EU AI Act categories, specific questions, or how to navigate the wizard.";
  }
}

/**
 * Generates AI responses for AI governance context
 * @param {string} userMessage - The user's message
 * @returns {string} AI response text
 */
function generateAIGovernanceResponse(userMessage) {
  const message = userMessage.toLowerCase();

  if (message.includes("compliance") || message.includes("eu ai act")) {
    return "The EU AI Act requires different compliance measures based on your AI system's risk classification. High-risk systems need conformity assessments, CE marking, and ongoing monitoring.";
  } else if (message.includes("inventory") || message.includes("systems")) {
    return "Your AI system inventory should include all AI applications in your organization. Each system needs proper documentation, risk assessment, and compliance tracking.";
  } else {
    return "I can help with AI governance questions, EU AI Act compliance requirements, and managing your AI system inventory.";
  }
}

/**
 * Generates AI responses for risk management context
 * @param {string} userMessage - The user's message
 * @returns {string} AI response text
 */
function generateRiskManagementResponse(userMessage) {
  const message = userMessage.toLowerCase();

  if (message.includes("risk") || message.includes("assessment")) {
    return "Risk assessments should consider likelihood, impact, and existing controls. Regular reviews ensure your risk register stays current with changing threats and business conditions.";
  } else if (message.includes("mitigation") || message.includes("control")) {
    return "Risk mitigation strategies include prevention, detection, response, and recovery controls. The effectiveness of controls should be regularly monitored and tested.";
  } else {
    return "I can help with risk identification, assessment methodologies, mitigation strategies, and compliance frameworks like ISO 27001.";
  }
}

/**
 * Generates generic AI responses for general context
 * @param {string} userMessage - The user's message
 * @returns {string} AI response text
 */
function generateGenericResponse(userMessage) {
  const message = userMessage.toLowerCase();

  if (message.includes("hello") || message.includes("hi")) {
    return "Hello! I'm your ArionComply AI assistant. I can help with compliance questions, risk management, and navigating the platform.";
  } else if (message.includes("help")) {
    return "I'm here to help! You can ask me about compliance frameworks, risk assessments, AI governance, or how to use any features in ArionComply.";
  } else if (message.includes("thank")) {
    return "You're welcome! Feel free to ask if you need any other assistance with your compliance and risk management tasks.";
  } else {
    return "I understand you're asking about compliance and risk management. Could you provide more specific details so I can give you the most helpful response?";
  }
}

/* ==========================================================================
   CHAT SEARCH AND FILTERING
   Functions for searching through chat history
   ========================================================================== */

/**
 * Filters displayed chat messages based on search term
 * @param {string} term - The search term to filter by
 */
function filterChatMessages(term) {
  const msgs = document.querySelectorAll(".chat-message");
  const searchTerm = term.toLowerCase();

  msgs.forEach((m) => {
    const messageText = m.textContent.toLowerCase();
    const shouldShow = searchTerm === "" || messageText.includes(searchTerm);
    m.style.display = shouldShow ? "" : "none";
  });
}

/* ==========================================================================
   CHAT CONTEXT AND STATE MANAGEMENT
   Functions for managing chat context and application state
   ========================================================================== */

/**
 * Updates the chat context for the AI assistant
 * This helps the AI understand what page/section the user is currently on
 * @param {string} context - The new context string (e.g., "AI Risk Assessment")
 */
function updateChatContext(context) {
  try {
    // Store the context globally so other functions can access it
    window.currentChatContext = context;

    // Update any UI elements that display the current context
    const chatContextElement = document.getElementById("chat-context");
    if (chatContextElement) {
      chatContextElement.textContent = context;
    }

    // Update the chat title if it exists
    const chatTitle = document.querySelector(".chat-title");
    if (chatTitle && context) {
      chatTitle.textContent = `ArionComply AI Assistant - ${context}`;
    }

    console.log("Chat context updated to:", context);
  } catch (error) {
    console.error("Error updating chat context:", error);
  }
}

/**
 * Toggles the chat popup window visibility
 * This function shows/hides the AI chat interface
 */
function toggleChat() {
  try {
    const chatPopup = document.getElementById("chatPopup");
    if (!chatPopup) {
      console.warn("Chat popup element not found");
      return;
    }

    // Toggle the 'active' class which controls visibility
    const isCurrentlyActive = chatPopup.classList.contains("active");

    if (isCurrentlyActive) {
      chatPopup.classList.remove("active");
    } else {
      chatPopup.classList.add("active");

      // Focus on chat input when opening
      setTimeout(() => {
        const chatInput = chatPopup.querySelector(".chat-input");
        if (chatInput) {
          chatInput.focus();
        }
      }, 100);
    }

    console.log(
      "Chat popup toggled:",
      !isCurrentlyActive ? "opened" : "closed",
    );
  } catch (error) {
    console.error("Error toggling chat:", error);
  }
}

/* ==========================================================================
   ADVANCED CHAT MANAGEMENT FUNCTIONS
   Functions for enhanced chat features and management
   ========================================================================== */

/**
 * Initializes the chat system for a specific context
 * @param {string} context - The chat context identifier
 * @param {Object} options - Optional configuration
 */
function initializeChat(context, options = {}) {
  try {
    console.log("Initializing chat for context:", context);

    // Set up the chat context
    updateChatContext(context);

    // Set up the chat interface
    setupChat(context);

    // Add welcome message if this is a new context
    let history = loadChatHistory(context);
    if (history.length === 0 && !options.skipWelcome) {
      const welcomeMessage =
        options.welcomeMessage ||
        `Welcome! I'm here to help you with ${context}. How can I assist you today?`;

      addChatMessage(context, "ai", welcomeMessage);
    }

    // Update the chat display
    renderChatMessages(history);
  } catch (error) {
    console.error("Error initializing chat:", error);
  }
}

/**
 * Clears the chat history for a specific context
 * @param {string} context - The chat context to clear
 */
function clearChatHistory(context) {
  try {
    localStorage.removeItem(getHistoryKey(context));

    // Clear the display
    renderChatMessages([]);

    console.log("Chat history cleared for context:", context);

    // Show notification if available
    if (typeof showNotification === "function") {
      showNotification("Chat history cleared", "info");
    }
  } catch (error) {
    console.error("Error clearing chat history:", error);
  }
}

/**
 * Exports chat history for a specific context
 * @param {string} context - The chat context to export
 * @returns {string} JSON string of chat history
 */
function exportChatHistory(context) {
  try {
    const history = loadChatHistory(context);
    const exportData = {
      context: context,
      exported: new Date().toISOString(),
      messageCount: history.length,
      messages: history,
    };

    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error("Error exporting chat history:", error);
    return null;
  }
}

/**
 * Enhanced setup function that includes better error handling
 * @param {string} ctx - Chat context
 */
function setupChatEnhanced(ctx) {
  try {
    setupChat(ctx); // Call the original function

    // Add additional setup for enhanced features
    const chatInput = document.querySelector(".chat-input");
    if (chatInput) {
      // Add Enter key support for sending messages (if not already added)
      const existingListeners = chatInput.getAttribute("data-listeners-added");
      if (!existingListeners) {
        chatInput.addEventListener("keydown", function (event) {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();

            const sendBtn = document.querySelector(".btn-ai");
            if (sendBtn) {
              sendBtn.click();
            }
          }
        });
        chatInput.setAttribute("data-listeners-added", "true");
      }
    }
  } catch (error) {
    console.error("Error in enhanced chat setup:", error);
  }
}

/**
 * Gets chat statistics for a specific context
 * @param {string} context - The chat context to analyze
 * @returns {Object} Chat statistics object
 */
function getChatStatistics(context) {
  try {
    const history = loadChatHistory(context);
    const userMessages = history.filter((msg) => msg.sender === "user");
    const aiMessages = history.filter((msg) => msg.sender === "ai");

    return {
      totalMessages: history.length,
      userMessages: userMessages.length,
      aiMessages: aiMessages.length,
      firstMessage: history.length > 0 ? new Date(history[0].time) : null,
      lastMessage:
        history.length > 0 ? new Date(history[history.length - 1].time) : null,
    };
  } catch (error) {
    console.error("Error getting chat statistics:", error);
    return null;
  }
}

/* ==========================================================================
   GLOBAL EXPORTS AND INITIALIZATION
   Export functions and set up global access
   ========================================================================== */

// Export functions to global scope for compatibility with existing code
if (typeof window !== "undefined") {
  window.updateChatContext = updateChatContext;
  window.toggleChat = toggleChat;
  window.initializeChat = initializeChat;
  window.clearChatHistory = clearChatHistory;
  window.exportChatHistory = exportChatHistory;
  window.setupChatEnhanced = setupChatEnhanced;
  window.getChatStatistics = getChatStatistics;
  window.addChatMessage = addChatMessage;
  window.loadChatHistory = loadChatHistory;
  window.saveChatHistory = saveChatHistory;
  window.renderChatMessages = renderChatMessages;
  window.setupChat = setupChat;
  window.filterChatMessages = filterChatMessages;
}

// Export for module use if in Node.js environment
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    getHistoryKey,
    loadChatHistory,
    saveChatHistory,
    renderChatMessages,
    addChatMessage,
    setupChat,
    filterChatMessages,
    updateChatContext,
    toggleChat,
    initializeChat,
    clearChatHistory,
    exportChatHistory,
    setupChatEnhanced,
    getChatStatistics,
  };
}
