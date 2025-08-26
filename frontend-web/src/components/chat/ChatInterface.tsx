// File path: src/components/chat/ChatInterface.tsx

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useUserStore } from '@/stores/userStore'; // ✅ Updated import

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatInterfaceProps {
  context?: string;
}

// Exact replica of your vanilla JS chat interface
export default function ChatInterface({ context = 'General' }: ChatInterfaceProps) {
  const { user, isAuthenticated } = useUserStore(); // ✅ Updated to use Zustand store
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showAvatarSettings, setShowAvatarSettings] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState('robot');
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversation history from localStorage - exact same as vanilla JS
  useEffect(() => {
    const storageKey = isAuthenticated 
      ? `arioncomply_chat_${context}` 
      : `arioncomply_guest_chat_${context}`;
    
    const savedMessages = localStorage.getItem(storageKey);
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }
  }, [context, isAuthenticated]);

  // Save conversation history to localStorage
  useEffect(() => {
    if (messages.length === 0) return;
    
    const storageKey = isAuthenticated 
      ? `arioncomply_chat_${context}` 
      : `arioncomply_guest_chat_${context}`;
    
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, context, isAuthenticated]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response - replace with actual API call
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you're asking about "${inputValue.trim()}" in the context of ${context}. This is a demo response. In the full implementation, this would connect to your AI backend.`,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format timestamp
  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-interface">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-avatar" onClick={() => setShowAvatarSettings(!showAvatarSettings)}>
          <i className={`fas fa-${currentAvatar}`}></i>
        </div>
        <div className="chat-info">
          <h3>ArionComply AI Assistant</h3>
          <p className="chat-context">Context: {context}</p>
          {user && <p className="chat-user">Talking with {user.name} ({user.role})</p>}
        </div>
        <div className="chat-actions">
          <button className="btn-icon" title="Clear chat">
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>

      {/* Avatar Settings Dropdown */}
      {showAvatarSettings && (
        <div className="avatar-settings">
          <div className="avatar-options">
            {['robot', 'user-tie', 'brain', 'shield-alt'].map(avatar => (
              <button
                key={avatar}
                className={`avatar-option ${currentAvatar === avatar ? 'active' : ''}`}
                onClick={() => {
                  setCurrentAvatar(avatar);
                  setShowAvatarSettings(false);
                }}
              >
                <i className={`fas fa-${avatar}`}></i>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <div className="welcome-icon">
              <i className="fas fa-robot"></i>
            </div>
            <h4>Welcome to ArionComply AI Assistant</h4>
            <p>I can help you with compliance questions, risk assessments, and platform guidance.</p>
            <p className="context-note">Current context: <strong>{context}</strong></p>
          </div>
        ) : (
          messages.map(message => (
            <div key={message.id} className={`message ${message.role}`}>
              <div className="message-avatar">
                <i className={`fas fa-${message.role === 'user' ? 'user' : currentAvatar}`}></i>
              </div>
              <div className="message-content">
                <div className="message-text">{message.content}</div>
                <div className="message-time">{formatTime(message.timestamp)}</div>
              </div>
            </div>
          ))
        )}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="message assistant typing">
            <div className="message-avatar">
              <i className={`fas fa-${currentAvatar}`}></i>
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="chat-input">
        <div className="input-container">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about compliance, risks, or platform features..."
            disabled={isTyping}
          />
          <div className="input-actions">
            <button
              className={`btn-icon record-btn ${isRecording ? 'recording' : ''}`}
              title="Voice input"
              onClick={() => setIsRecording(!isRecording)}
            >
              <i className="fas fa-microphone"></i>
            </button>
            <button
              className="btn-icon send-btn"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              title="Send message"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}