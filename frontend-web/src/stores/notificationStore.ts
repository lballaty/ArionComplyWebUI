// File path: arioncomply-v1/frontend-web/src/stores/notificationStore.ts

import { create } from 'zustand';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  icon?: string;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [
    // Demo notifications - exact replica of vanilla JS data
    {
      id: '1',
      title: 'High Risk Detected',
      message: 'AI system requires immediate review',
      type: 'warning',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      icon: 'fas fa-exclamation-triangle'
    },
    {
      id: '2', 
      title: 'Assessment Complete',
      message: 'GDPR assessment has been completed',
      type: 'success',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      read: false,
      icon: 'fas fa-check-circle'
    },
    {
      id: '3',
      title: 'System Update',
      message: 'New features available in AI Act module', 
      type: 'info',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      read: true,
      icon: 'fas fa-info-circle'
    }
  ],
  unreadCount: 2,

  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1
    }));
  },

  markAsRead: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      ),
      unreadCount: Math.max(0, state.unreadCount - 1)
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map(notification => ({
        ...notification,
        read: true
      })),
      unreadCount: 0
    }));
  },

  removeNotification: (id: string) => {
    set((state) => {
      const notification = state.notifications.find(n => n.id === id);
      const wasUnread = notification && !notification.read;
      
      return {
        notifications: state.notifications.filter(n => n.id !== id),
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
      };
    });
  },

  clearAllNotifications: () => {
    set({
      notifications: [],
      unreadCount: 0
    });
  },

  getUnreadCount: () => {
    return get().unreadCount;
  }
}));