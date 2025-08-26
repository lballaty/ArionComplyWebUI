// File path: arioncomply-v1/frontend-web/src/stores/chatStore.ts

import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatState {
  isOpen: boolean;
  context: string;
  messages: ChatMessage[];
  isLoading: boolean;
  
  // Actions
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  updateChatContext: (context: string) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  isOpen: false,
  context: 'General Assistance',
  messages: [],
  isLoading: false,

  toggleChat: () => {
    const { isOpen } = get();
    set({ isOpen: !isOpen });
    console.log(isOpen ? 'Chat closed' : 'Chat opened');
  },

  openChat: () => {
    set({ isOpen: true });
    console.log('Chat opened');
  },

  closeChat: () => {
    set({ isOpen: false });
    console.log('Chat closed');
  },

  updateChatContext: (context: string) => {
    set({ context });
    console.log('Chat context updated:', context);
  },

  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    
    set((state) => ({
      messages: [...state.messages, newMessage]
    }));
  },

  clearMessages: () => {
    set({ messages: [] });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  }
}));