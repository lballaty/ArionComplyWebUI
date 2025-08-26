# Chat Interface Screen Workflow

## Screen: `chatInterface.html`

### Overview
The Chat Interface provides an AI-powered conversational assistant for the ArionComply platform. It features a context-aware chat system that can be used standalone or embedded within other screens. The chat interface offers text interaction, voice input/output capabilities, and customizable avatar settings. This screen serves as the primary AI assistance component across the platform.

### User-Triggered Actions

#### 1. Message Interaction

- **Action**: Send text message
  - **Trigger**: Click send button or press Enter in message input
  - **Result**: Sends user message and generates AI response
  - **Process**:
    - Gets message text from input field
    - Adds user message to chat history
    - Calls AI response generation
    - Displays AI response with appropriate styling
    - May trigger text-to-speech if enabled
  - **State Changes**:
    - Adds messages to chat history
    - Saves conversation to localStorage
    - Updates UI with new messages

- **Action**: Use voice input
  - **Trigger**: Click microphone button
  - **Result**: Records user's voice and converts to text
  - **Process**:
    - Toggles recording state
    - Uses speech recognition API
    - Updates input field with transcribed text
    - May automatically send message when finished speaking
  - **State Changes**:
    - Updates recording state
    - Sets transcribed text in input field

- **Action**: Use quick suggestion
  - **Trigger**: Click on suggestion button/chip
  - **Result**: Sends the suggestion text as a user message
  - **Process**:
    - Gets suggestion text from clicked element
    - Automatically sends as user message
    - Triggers AI response
  - **State Changes**:
    - Adds messages to chat history
    - Updates UI with new messages

#### 2. Audio Controls

- **Action**: Toggle text-to-speech
  - **Trigger**: Click TTS toggle button
  - **Result**: Enables/disables voice output for AI responses
  - **Process**:
    - Updates audioContext.ttsEnabled state
    - May save preference to localStorage
  - **State Changes**:
    - Updates TTS enabled state
    - Updates button appearance

- **Action**: Play/pause spoken response
  - **Trigger**: Click play/pause button on message
  - **Result**: Controls audio playback of AI response
  - **Process**:
    - Starts or pauses speech synthesis
    - Updates playback controls
  - **State Changes**:
    - Updates audio playback state
    - Updates control button appearance

#### 3. Avatar Settings

- **Action**: Open avatar settings
  - **Trigger**: Click avatar settings button
  - **Result**: Opens avatar configuration modal
  - **Process**:
    - Shows avatar settings modal
    - Loads current avatar preferences
  - **State Changes**:
    - Shows avatar settings modal

- **Action**: Change avatar appearance
  - **Trigger**: Select avatar option in settings
  - **Result**: Updates AI assistant avatar appearance
  - **Process**:
    - Updates selected avatar option
    - Updates preview if available
  - **State Changes**:
    - Updates selected avatar option
    - Updates preview display

- **Action**: Enable/disable video avatar
  - **Trigger**: Toggle video avatar option
  - **Result**: Switches between static and video avatar
  - **Process**:
    - Updates videoAvatarEnabled setting
    - Updates avatar display accordingly
  - **State Changes**:
    - Updates avatar settings
    - Updates avatar display

- **Action**: Save avatar settings
  - **Trigger**: Click "Save Settings" button
  - **Result**: Persists avatar configuration
  - **Process**:
    - Saves avatar settings to localStorage
    - Closes settings modal
    - Updates avatar display
  - **State Changes**:
    - Saves settings to localStorage
    - Updates avatar appearance
    - Closes settings modal

#### 4. Chat Management

- **Action**: Clear chat history
  - **Trigger**: Click clear chat button
  - **Result**: Erases current conversation history
  - **Process**:
    - Confirms action with user
    - Clears messages from memory and localStorage
    - Resets chat display
  - **State Changes**:
    - Clears chat history
    - Updates UI to empty state

- **Action**: Start new chat
  - **Trigger**: Click new chat button
  - **Result**: Starts fresh conversation
  - **Process**:
    - Preserves old conversation in history
    - Creates new empty conversation
    - May add welcome message
  - **State Changes**:
    - Creates new conversation
    - Updates UI with empty chat and welcome message

### System-Triggered Actions

#### 1. Page Initialization
- **Trigger**: DOMContentLoaded event
- **Process**:
  - Checks for dependency availability
  - Initializes layout if not in embedded mode
  - Parses URL parameters for context and embedded mode
  - Sets up chat interface based on mode
  - Loads chat history for current context
  - Sets up speech recognition and synthesis if available
  - Sets up avatar system

#### 2. Context-Aware Initialization
- **Trigger**: URL parameter or context update
- **Process**:
  - Detects context from URL parameters or caller
  - Loads appropriate chat history and settings
  - Sets up context-specific suggestions
  - May display context-specific welcome message

#### 3. Message Processing
- **Trigger**: After sending user message
- **Process**:
  - Formats and displays user message
  - Generates appropriate AI response based on context
  - May use different response generation methods based on context
  - Formats and displays AI response
  - Adds message pair to history
  - Saves to localStorage

#### 4. Embedded Mode Handling
- **Trigger**: URL parameter "embed=1"
- **Process**:
  - Detects embedded mode
  - Adjusts UI for embedded display (no header/sidebar)
  - Sets up parent window communication if needed
  - Adapts responsiveness for smaller container

### Error Handling
- **Speech Recognition Unavailable**: Falls back to text-only input
- **Text-to-Speech Unavailable**: Disables TTS features
- **Context Not Found**: Creates new context if specified context doesn't exist
- **Storage Errors**: Catches and logs localStorage errors

### Data Persistence
- **Storage Mechanism**: LocalStorage
- **Chat History Key**: "chat_history_{context}"
- **Avatar Settings Key**: "chat_avatar_settings"
- **Audio Settings Key**: "chat_audio_settings"
- **Data Structure**:
  - Chat history: Array of message objects with:
    - id: Unique message identifier
    - text: Message content
    - sender: "user" or "assistant"
    - timestamp: Message creation time
    - audioEnabled: Whether TTS was enabled for message
    - suggestions: Array of follow-up suggestions if any
  - Avatar settings: Object with:
    - avatarType: Selected avatar type
    - videoEnabled: Whether video avatar is enabled
    - videoSource: Selected video source if applicable
  - Audio settings: Object with:
    - ttsEnabled: Text-to-speech enabled state
    - sttEnabled: Speech-to-text enabled state
    - volume: Audio volume level

### Integration Dependencies
- **Required files**:
  - navigation-config.js: Navigation structure (if not embedded)
  - sidebar-component.js: Sidebar implementation (if not embedded)
  - layout-manager.js: Page layout management (if not embedded)
  - scripts.js: Common utilities
  - chatLogic.js: Core chat functionality
  - seedData.js: Sample chat data
