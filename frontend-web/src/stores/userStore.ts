// File path: arioncomply-v1/frontend-web/src/stores/userStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'auditor' | 'user';
  permissions: string[];
  avatar?: string;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  session: string | null;
  
  // Actions
  setUser: (user: User) => void;
  login: (user: User) => void;  // Added for compatibility
  logout: () => void;
  initializeDemoUser: () => void;
  initializeSession: () => void;  // Added for compatibility
  updateUser: (userData: Partial<User>) => void;  // Added for compatibility
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      session: null,
      
      setUser: (user: User) => {
        set({ user, isAuthenticated: true, session: 'active' });
        
        // Sync with localStorage for vanilla JS compatibility
        if (typeof window !== 'undefined') {
          localStorage.setItem('arioncomply_session', 'active');
          localStorage.setItem('arioncomply_user', JSON.stringify(user));
        }
      },

      // Alias for setUser to maintain compatibility with layout components
      login: (user: User) => {
        get().setUser(user);
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false, session: null });
        
        // Clear localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('arioncomply_session');
          localStorage.removeItem('arioncomply_user');
        }
      },
      
      initializeDemoUser: () => {
        const demoUser: User = {
          id: 'demo_user',
          name: 'Demo User',
          email: 'demo@arioncomply.com',
          role: 'admin',
          permissions: ['all']
        };
        get().setUser(demoUser);
      },

      // Alias for initializeDemoUser to maintain compatibility
      initializeSession: () => {
        if (typeof window === 'undefined') return;
        
        const storedSession = localStorage.getItem('arioncomply_session');
        const storedUser = localStorage.getItem('arioncomply_user');
        
        if (storedSession === 'active' && storedUser) {
          try {
            const user = JSON.parse(storedUser);
            set({
              user,
              isAuthenticated: true,
              session: 'active'
            });
          } catch (error) {
            console.error('Error parsing stored user data:', error);
            get().initializeDemoUser();
          }
        } else if (!storedSession) {
          // Create demo session for development if no session exists
          get().initializeDemoUser();
        }
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData };
          get().setUser(updatedUser);
        }
      }
    }),
    {
      name: 'arioncomply-user-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        session: state.session
      })
    }
  )
);

// Export alias for layout components that expect useuserStore
export const useuserStore = useUserStore;