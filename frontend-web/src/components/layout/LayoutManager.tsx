// File path: arioncomply-v1/frontend-web/src/components/layout/LayoutManager.tsx

'use client';

import React, { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useUserStore } from '@/stores/userStore';
import { useLayoutStore } from '@/stores/layoutStore';
import { useChatStore } from '@/stores/chatStore';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

// Layout types - exact replica of vanilla JS constants
export enum LAYOUT_TYPES {
  FULL_APP = "full-app",
  HEADER_ONLY = "header-only", 
  STANDALONE = "standalone",
  EMBEDDED = "embedded"
}

// Page layout mappings - exact replica of vanilla JS configuration
const PAGE_LAYOUTS: { [key: string]: LAYOUT_TYPES } = {
  // Main application pages - full app layout with sidebar and header
  "/": LAYOUT_TYPES.FULL_APP,
  "/dashboard": LAYOUT_TYPES.FULL_APP,
  "/risk-management": LAYOUT_TYPES.FULL_APP,
  "/controls": LAYOUT_TYPES.FULL_APP,
  "/policies": LAYOUT_TYPES.FULL_APP,
  "/workflows": LAYOUT_TYPES.FULL_APP,
  "/reports": LAYOUT_TYPES.FULL_APP,
  "/calendar": LAYOUT_TYPES.FULL_APP,
  "/settings": LAYOUT_TYPES.FULL_APP,

  // Assessment and wizard pages - full app layout
  "/assessments": LAYOUT_TYPES.FULL_APP,
  "/assessments/ai-act": LAYOUT_TYPES.FULL_APP,
  "/assessments/gdpr": LAYOUT_TYPES.FULL_APP,
  "/assessments/iso27001": LAYOUT_TYPES.FULL_APP,

  // Chat interface - can be full app or embedded depending on context
  "/chat": LAYOUT_TYPES.FULL_APP,

  // Help and documentation pages - header only for clean reading
  "/help": LAYOUT_TYPES.HEADER_ONLY,
  "/privacy": LAYOUT_TYPES.HEADER_ONLY,
  "/terms": LAYOUT_TYPES.HEADER_ONLY,

  // Authentication and landing pages - standalone layout
  "/login": LAYOUT_TYPES.STANDALONE,
  "/register": LAYOUT_TYPES.STANDALONE,
  "/forgot-password": LAYOUT_TYPES.STANDALONE
};

interface LayoutManagerProps {
  children: React.ReactNode;
}

export const LayoutManager: React.FC<LayoutManagerProps> = ({ children }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, initializeSession } = useUserStore();
  const { setLayoutType, closeSidebar, setupResponsive } = useLayoutStore();
  const { updateChatContext } = useChatStore();

  // Determine layout type based on page, URL parameters, and context
  const getLayoutType = (): LAYOUT_TYPES => {
    try {
      // Check URL parameters first (highest priority)
      if (searchParams.get('embed') === '1') {
        return LAYOUT_TYPES.EMBEDDED;
      }
      
      if (searchParams.get('standalone') === '1') {
        return LAYOUT_TYPES.STANDALONE;
      }
      
      if (searchParams.get('header-only') === '1') {
        return LAYOUT_TYPES.HEADER_ONLY;
      }

      // Auto-detect based on context
      if (typeof window !== 'undefined' && window !== window.top) {
        return LAYOUT_TYPES.EMBEDDED; // We're in an iframe
      }

      // Check authentication status
      if (!isAuthenticated) {
        // Allow certain pages to be viewed without login
        const publicPages = ["/help", "/privacy", "/terms"];
        if (publicPages.includes(pathname)) {
          return LAYOUT_TYPES.STANDALONE;
        }
        
        // Redirect to login for protected pages
        if (pathname !== '/login' && pathname !== '/register') {
          return LAYOUT_TYPES.STANDALONE; // Will redirect in useEffect
        }
      }

      // Use configured default for this page
      return PAGE_LAYOUTS[pathname] || LAYOUT_TYPES.FULL_APP;
    } catch (error) {
      console.error('Error determining layout type:', error);
      return LAYOUT_TYPES.FULL_APP; // Safe fallback
    }
  };

  // Initialize layout and session management
  useEffect(() => {
    // Initialize user session if not already done
    initializeSession();
    
    // Determine and set layout type
    const layoutType = getLayoutType();
    setLayoutType(layoutType);

    // Setup responsive handling
    setupResponsive();

    // Update chat context based on current page
    const contextMap: { [key: string]: string } = {
      '/': 'Application Center',
      '/dashboard': 'Dashboard Overview',
      '/risk-management': 'Risk Management',
      '/controls': 'Security Controls',
      '/policies': 'Policy Management',
      '/workflows': 'Compliance Workflows',
      '/reports': 'Reporting & Analytics',
      '/assessments': 'Compliance Assessments',
      '/assessments/ai-act': 'EU AI Act Assessment',
      '/assessments/gdpr': 'GDPR Assessment',
      '/assessments/iso27001': 'ISO 27001 Assessment'
    };
    
    const context = contextMap[pathname] || 'General Assistance';
    updateChatContext(context);

    // Apply layout-specific body classes
    if (typeof document !== 'undefined') {
      document.body.className = document.body.className
        .replace(/layout-\w+/g, '') // Remove existing layout classes
        .trim();
      document.body.classList.add(`layout-${layoutType}`);
      
      if (layoutType === LAYOUT_TYPES.EMBEDDED) {
        document.body.classList.add('embedded-mode');
      }
    }
  }, [pathname, searchParams, initializeSession, setLayoutType, setupResponsive, updateChatContext, isAuthenticated]);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined' && window.innerWidth <= 768) {
        closeSidebar(); // Auto-close sidebar on mobile
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [closeSidebar]);

  // Redirect to login if not authenticated and trying to access protected page
  useEffect(() => {
    if (!isAuthenticated && 
        !PAGE_LAYOUTS[pathname]?.includes('standalone') &&
        pathname !== '/login' && 
        pathname !== '/register' &&
        pathname !== '/help' &&
        pathname !== '/privacy' &&
        pathname !== '/terms') {
      window.location.href = '/auth';
    }
  }, [isAuthenticated, pathname]);

  const layoutType = getLayoutType();

  // Render based on layout type
  const renderLayout = () => {
    switch (layoutType) {
      case LAYOUT_TYPES.STANDALONE:
        return (
          <div className="app-container">
            <main className="main-content">
              <div className="content">
                {children}
              </div>
            </main>
          </div>
        );

      case LAYOUT_TYPES.HEADER_ONLY:
        return (
          <div className="app-container">
            <Header currentPage={pathname} />
            <main className="main-content">
              <div className="content">
                {children}
              </div>
            </main>
          </div>
        );

      case LAYOUT_TYPES.EMBEDDED:
        return (
          <div className="app-container embedded-container">
            <div className="embedded-content">
              {children}
            </div>
          </div>
        );

      case LAYOUT_TYPES.FULL_APP:
      default:
        return (
          <div className="app-container">
            <Sidebar currentPage={pathname} />
            <Header currentPage={pathname} />
            <main className="main-content">
              <div className="content">
                {children}
              </div>
            </main>
          </div>
        );
    }
  };

  return renderLayout();
};

// Layout information API - for external components that need layout state
export const getLayoutInfo = () => {
  const { layoutType, sidebarOpen } = useLayoutStore.getState();
  
  return {
    currentLayout: layoutType,
    currentPage: window?.location?.pathname || '/',
    hasHeader: layoutType !== LAYOUT_TYPES.STANDALONE,
    hasSidebar: layoutType === LAYOUT_TYPES.FULL_APP,
    sidebarOpen: sidebarOpen,
    isEmbedded: layoutType === LAYOUT_TYPES.EMBEDDED,
    isStandalone: layoutType === LAYOUT_TYPES.STANDALONE
  };
};