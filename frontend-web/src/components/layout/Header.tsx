// File path: arioncomply-v1/frontend-web/src/components/layout/Header.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useuserStore } from '@/stores/userStore';
import { useLayoutStore } from '@/stores/layoutStore';

interface HeaderProps {
  currentPage?: string;
}

export const Header: React.FC<HeaderProps> = ({ currentPage = "/" }) => {
  const { user } = useuserStore();
  const { toggleSidebar } = useLayoutStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Generate breadcrumb based on current page
  const generateBreadcrumb = (page: string): string => {
    // Page name mappings - exact replica of vanilla JS logic
    const pageNames: { [key: string]: string } = {
      "/": "AppCenter",
      "/dashboard": "Dashboard",
      "/assessments": "Assessments",
      "/assessments/ai-act": "EU AI Act Assessment",
      "/assessments/gdpr": "GDPR Assessment", 
      "/assessments/iso27001": "ISO 27001 Assessment",
      "/risk-management": "Risk Management",
      "/controls": "Controls",
      "/policies": "Policies",
      "/workflows": "Workflows",
      "/reports": "Reports",
      "/calendar": "Calendar",
      "/settings": "Settings"
    };

    const pageName = pageNames[page] || "ArionComply";
    return pageName === "ArionComply" ? "ArionComply" : `ArionComply > ${pageName}`;
  };

  // Handle global search
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 2) {
      console.log("Performing search for:", query);
      // TODO: Implement actual search functionality
    }
  };

  // Handle search keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('globalSearch') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }

      // Escape to clear search or close menus
      if (e.key === 'Escape') {
        setSearchQuery('');
        setShowNotifications(false);
        setShowUserMenu(false);
        
        const searchInput = document.getElementById('globalSearch') as HTMLInputElement;
        if (searchInput && document.activeElement === searchInput) {
          searchInput.blur();
        }
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, []);

  // Handle notifications
  const handleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowUserMenu(false); // Close user menu if open
    
    // TODO: Replace with actual notification system
    console.log("Notifications clicked");
  };

  // Handle user menu
  const handleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    setShowNotifications(false); // Close notifications if open
    
    // TODO: Replace with actual user menu
    console.log("User menu clicked");
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      
      if (!target.closest('.notification-btn')) {
        setShowNotifications(false);
      }
      
      if (!target.closest('.user-menu')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const breadcrumb = generateBreadcrumb(currentPage);

  return (
    <header className="header">
      <div className="header-left">
        <button
          className="menu-toggle"
          onClick={toggleSidebar}
          title="Toggle sidebar"
          aria-label="Toggle navigation menu"
        >
          <i className="fas fa-bars"></i>
        </button>
        <div className="breadcrumb">
          <span id="breadcrumb-text">{breadcrumb}</span>
        </div>
      </div>
      
      <div className="header-actions">
        {/* Global Search */}
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search..."
            id="globalSearch"
            value={searchQuery}
            onChange={handleSearchInput}
            autoComplete="off"
          />
        </div>

        {/* Notifications */}
        <div className="notification-container">
          <button
            className="notification-btn"
            onClick={handleNotifications}
            title="View notifications"
            aria-label="View notifications"
          >
            <i className="fas fa-bell"></i>
            <span className="notification-badge" id="notificationCount">3</span>
          </button>
          
          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h4>Notifications</h4>
                <button className="close-btn" onClick={() => setShowNotifications(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="notification-list">
                <div className="notification-item">
                  <div className="notification-icon">
                    <i className="fas fa-exclamation-triangle text-warning"></i>
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">High Risk Detected</div>
                    <div className="notification-text">AI system requires immediate review</div>
                    <div className="notification-time">2 hours ago</div>
                  </div>
                </div>
                <div className="notification-item">
                  <div className="notification-icon">
                    <i className="fas fa-check-circle text-success"></i>
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">Assessment Complete</div>
                    <div className="notification-text">GDPR assessment has been completed</div>
                    <div className="notification-time">4 hours ago</div>
                  </div>
                </div>
                <div className="notification-item">
                  <div className="notification-icon">
                    <i className="fas fa-info-circle text-primary"></i>
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">System Update</div>
                    <div className="notification-text">New features available in AI Act module</div>
                    <div className="notification-time">1 day ago</div>
                  </div>
                </div>
              </div>
              <div className="notification-footer">
                <a href="/notifications" className="view-all-btn">View All Notifications</a>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="user-menu-container">
          <button
            className="user-menu"
            onClick={handleUserMenu}
            title="User menu"
            aria-label="Open user menu"
          >
            <i className="fas fa-user-circle"></i>
          </button>
          
          {showUserMenu && (
            <div className="user-menu-dropdown">
              <div className="user-info">
                <div className="user-avatar">
                  <i className="fas fa-user-circle"></i>
                </div>
                <div className="user-details">
                  <div className="user-name">{user?.name || 'Demo User'}</div>
                  <div className="user-role">{user?.role || 'Admin'}</div>
                </div>
              </div>
              
              <div className="user-menu-divider"></div>
              
              <div className="user-menu-items">
                <a href="/profile" className="user-menu-item">
                  <i className="fas fa-user"></i>
                  <span>Profile</span>
                </a>
                <a href="/settings" className="user-menu-item">
                  <i className="fas fa-cog"></i>
                  <span>Settings</span>
                </a>
                <a href="/help" className="user-menu-item">
                  <i className="fas fa-question-circle"></i>
                  <span>Help & Support</span>
                </a>
                
                <div className="user-menu-divider"></div>
                
                <button className="user-menu-item logout-btn" onClick={() => {
                  // TODO: Implement actual logout
                  console.log("Logout clicked");
                  window.location.href = '/login';
                }}>
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};