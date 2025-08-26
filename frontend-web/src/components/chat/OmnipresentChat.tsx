'use client';

import { useState, useEffect } from 'react';
import { useChat } from '@/components/providers/Providers';
import ChatInterface from './ChatInterface';

// Exact replica of your vanilla JS omnipresent chat system
export default function OmnipresentChat() {
  const { isChatOpen, setChatOpen, chatContext } = useChat();
  const [showPulse, setShowPulse] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Hide pulse animation after user first interacts - exact same as vanilla JS
  useEffect(() => {
    const hasUsedChat = localStorage.getItem('arioncomply_chat_used');
    if (hasUsedChat) {
      setShowPulse(false);
      setHasInteracted(true);
    }
  }, []);

  // Handle chat toggle - exact same logic as vanilla JS
  const toggleChat = () => {
    setChatOpen(!isChatOpen);
    
    // Mark chat as used - exact same as vanilla JS
    if (!hasInteracted) {
      localStorage.setItem('arioncomply_chat_used', 'true');
      setShowPulse(false);
      setHasInteracted(true);
    }
  };

  // Handle escape key to close chat - exact same as vanilla JS
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isChatOpen) {
        setChatOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isChatOpen, setChatOpen]);

  // Prevent body scroll when chat is open - exact same as vanilla JS
  useEffect(() => {
    if (isChatOpen) {
      document.body.classList.add('chat-open');
    } else {
      document.body.classList.remove('chat-open');
    }

    return () => {
      document.body.classList.remove('chat-open');
    };
  }, [isChatOpen]);

  // Handle click outside to close chat - exact same as vanilla JS
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setChatOpen(false);
    }
  };

  // Open in new window function - exact same as vanilla JS
  const openInNewWindow = () => {
    const chatUrl = `/chat?context=${encodeURIComponent(chatContext)}`;
    const windowFeatures = 'width=800,height=700,scrollbars=yes,resizable=yes,status=yes,menubar=no,toolbar=no';
    window.open(chatUrl, 'ArionComplyChat', windowFeatures);
    setChatOpen(false);
  };

  return (
    <>
      {/* Floating Chat Trigger Button - exact same structure as vanilla JS */}
      <button 
        className="chat-trigger"
        onClick={toggleChat}
        title="AI Assistant (Ctrl+K)"
        aria-label="Open AI Assistant"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 99999,
          width: '60px',
          height: '60px'
        }}
      >
        <i className="fas fa-robot"></i>
        <i className="fas fa-robot"></i>
        
        {/* Pulse animation for new users - exact same as vanilla JS */}
        {showPulse && !hasInteracted && (
          <div className="chat-trigger-pulse"></div>
        )}
      </button>

      {/* Chat Popup Overlay - exact same structure as vanilla JS */}
      {isChatOpen && (
        <div className="chat-popup-overlay" onClick={handleOverlayClick}>
          <div className="chat-popup">
            
            {/* Chat Header - exact same structure as vanilla JS */}
            <div className="chat-header">
              <div className="chat-title">
                <i className="fas fa-robot"></i>
                ArionComply AI Assistant
              </div>
              
              <div className="chat-actions">
                <button 
                  className="chat-action-btn"
                  onClick={openInNewWindow}
                  title="Open in new window"
                  aria-label="Open chat in new window"
                >
                  <i className="fas fa-external-link-alt"></i>
                </button>
                
                <button 
                  className="chat-close"
                  onClick={() => setChatOpen(false)}
                  title="Close chat"
                  aria-label="Close chat"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>

            {/* Chat Body - contains the actual chat interface */}
            <div className="chat-body">
              <ChatInterface context={chatContext} />
            </div>

            {/* Chat Footer - exact same structure as vanilla JS */}
            <div className="chat-footer">
              <div className="chat-status">
                <div className="status-dot online"></div>
                <span>AI Assistant Online</span>
              </div>
              
              <div className="chat-context">
                Context: {chatContext === 'authentication' 
                  ? 'Platform Help' 
                  : getContextDisplayName(chatContext)
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Helper function to get display name for context - exact same as vanilla JS
function getContextDisplayName(context: string): string {
  const contextMap: { [key: string]: string } = {
    'app-center': 'App Center',
    'dashboard': 'Dashboard',
    'risk-management': 'Risk Management',
    'ai-assessments': 'AI Assessments',
    'audit-center': 'Audit Center',
    'policy-hub': 'Policy Hub',
    'training-center': 'Training Center',
    'analytics-reports': 'Analytics & Reports',
    'task-management': 'Task Management',
    'document-center': 'Document Center',
    'system-settings': 'System Settings',
    'authentication': 'Authentication',
    'general': 'General'
  };
  
  return contextMap[context] || 'General';
}

// Save as: src/components/chat/OmnipresentChat.tsx