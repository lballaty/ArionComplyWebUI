// File path: arioncomply-v1/frontend-web/src/stores/layoutStore.ts

import { create } from 'zustand';

export interface LayoutState {
  sidebarOpen: boolean;
  layoutType: string;
  isMobile: boolean;
  
  // Actions
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  setLayoutType: (type: string) => void;
  setIsMobile: (mobile: boolean) => void;
  setupResponsive: () => void;
}

export const useLayoutStore = create<LayoutState>((set, get) => ({
  sidebarOpen: false,
  layoutType: 'full-app',
  isMobile: false,

  toggleSidebar: () => {
    const { sidebarOpen } = get();
    set({ sidebarOpen: !sidebarOpen });
    console.log(sidebarOpen ? 'Sidebar closed' : 'Sidebar opened');
  },

  openSidebar: () => {
    set({ sidebarOpen: true });
    console.log('Sidebar opened');
  },

  closeSidebar: () => {
    set({ sidebarOpen: false });
    console.log('Sidebar closed');
  },

  setLayoutType: (type: string) => {
    set({ layoutType: type });
  },

  setIsMobile: (mobile: boolean) => {
    set({ isMobile: mobile });
    
    // Auto-close sidebar on mobile
    if (mobile && get().sidebarOpen) {
      get().closeSidebar();
    }
  },

  setupResponsive: () => {
    if (typeof window === 'undefined') return;
    
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      get().setIsMobile(mobile);
    };
    
    // Initial check
    checkMobile();
    
    // Setup resize listener
    const handleResize = () => {
      checkMobile();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Return cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }
}));