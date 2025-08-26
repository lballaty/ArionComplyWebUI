// File path: arioncomply-v1/frontend-web/src/components/layout/Sidebar.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useuserStore } from '@/stores/userStore';
import { useLayoutStore } from '@/stores/layoutStore';

// Navigation configuration - exact replica of vanilla JS structure
const NAVIGATION_ITEMS = [
  {
    id: "appcenter",
    name: "AppCenter",
    icon: "fas fa-th-large",
    url: "/",
    description: "Main application dashboard",
    shortcut: "h",
    roles: ["admin", "manager", "auditor", "user"]
  },
  {
    id: "assessments",
    name: "Assessments",
    icon: "fas fa-clipboard-check",
    url: "#",
    description: "Compliance framework assessments",
    shortcut: "a",
    roles: ["admin", "manager", "auditor"],
    subItems: [
      {
        id: "eu_ai_act",
        name: "EU AI Act Assessment",
        icon: "fas fa-robot",
        url: "/assessments/ai-act",
        description: "EU AI Act compliance assessment"
      },
      {
        id: "gdpr_assessment",
        name: "GDPR Assessment",
        icon: "fas fa-user-shield",
        url: "/assessments/gdpr",
        description: "GDPR compliance assessment"
      },
      {
        id: "iso27001",
        name: "ISO 27001 Assessment",
        icon: "fas fa-certificate",
        url: "/assessments/iso27001",
        description: "ISO 27001 information security assessment"
      }
    ]
  },
  {
    id: "dashboard",
    name: "Dashboard",
    icon: "fas fa-tachometer-alt",
    url: "/dashboard",
    description: "Executive compliance dashboard",
    shortcut: "d",
    roles: ["admin", "manager"]
  },
  {
    id: "risk_management",
    name: "Risk Management",
    icon: "fas fa-exclamation-triangle",
    url: "/risk-management",
    description: "Risk identification and management",
    shortcut: "r",
    roles: ["admin", "manager", "auditor"]
  },
  {
    id: "controls",
    name: "Controls",
    icon: "fas fa-shield-alt",
    url: "/controls",
    description: "Security controls management",
    shortcut: "c",
    roles: ["admin", "manager", "auditor"]
  },
  {
    id: "policies",
    name: "Policies",
    icon: "fas fa-file-contract",
    url: "/policies",
    description: "Policy management and documentation",
    shortcut: "p",
    roles: ["admin", "manager", "auditor"]
  },
  {
    id: "workflows",
    name: "Workflows",
    icon: "fas fa-project-diagram",
    url: "/workflows",
    description: "Compliance workflows and automation",
    shortcut: "w",
    roles: ["admin", "manager"]
  },
  {
    id: "reports",
    name: "Reports",
    icon: "fas fa-chart-line",
    url: "/reports",
    description: "Compliance reporting and analytics",
    shortcut: "t",
    roles: ["admin", "manager", "auditor"]
  },
  {
    id: "calendar",
    name: "Calendar",
    icon: "fas fa-calendar-alt",
    url: "/calendar",
    description: "Compliance calendar and deadlines",
    shortcut: "l",
    roles: ["admin", "manager", "auditor", "user"]
  },
  {
    id: "settings",
    name: "Settings",
    icon: "fas fa-cog",
    url: "/settings",
    description: "System configuration",
    shortcut: "s",
    roles: ["admin"]
  }
];

interface SidebarProps {
  currentPage?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage = "/" }) => {
  const { user } = useuserStore();
  const { sidebarOpen, closeSidebar } = useLayoutStore();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  // Filter navigation items based on user role
  const getFilteredNavItems = () => {
    if (!user) return [];
    
    return NAVIGATION_ITEMS.filter(item => 
      item.roles.includes(user.role as string)
    );
  };

  // Check if current page matches nav item
  const isCurrentPage = (url: string) => {
    if (url === "/" && currentPage === "/") return true;
    if (url !== "/" && currentPage.startsWith(url)) return true;
    return false;
  };

  // Toggle submenu expansion
  const toggleSubmenu = (itemId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setExpandedMenus(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Setup keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      // Alt + key shortcuts for navigation
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        const shortcuts: { [key: string]: string } = {};
        
        NAVIGATION_ITEMS.forEach(item => {
          if (item.shortcut && item.url !== "#") {
            shortcuts[item.shortcut] = item.url;
          }
        });

        const key = e.key.toLowerCase();
        if (shortcuts[key]) {
          e.preventDefault();
          window.location.href = shortcuts[key];
        }
      }

      // ESC to close sidebar
      if (e.key === "Escape") {
        closeSidebar();
      }
    };

    document.addEventListener("keydown", handleKeyboard);
    return () => document.removeEventListener("keydown", handleKeyboard);
  }, [closeSidebar]);

  // Render navigation item
  const renderNavItem = (item: any) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedMenus.includes(item.id);
    const isActive = isCurrentPage(item.url);

    return (
      <li key={item.id} className={`nav-item ${hasSubItems ? 'has-sub' : ''}`}>
        <a
          href={hasSubItems ? "#" : item.url}
          className={`nav-link ${isActive ? 'active' : ''}`}
          onClick={hasSubItems ? (e) => toggleSubmenu(item.id, e) : undefined}
          title={item.description}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              if (hasSubItems) {
                toggleSubmenu(item.id, e as any);
              } else {
                window.location.href = item.url;
              }
            }
          }}
        >
          <i className={item.icon}></i>
          <span>{item.name}</span>
        </a>
        
        {hasSubItems && (
          <ul className={`sub-menu ${isExpanded ? 'open' : ''}`}>
            {item.subItems.map((subItem: any) => (
              <li key={subItem.id} className="nav-item">
                <a
                  href={subItem.url}
                  className={`nav-link ${isCurrentPage(subItem.url) ? 'active' : ''}`}
                  title={subItem.description}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      window.location.href = subItem.url;
                    }
                  }}
                >
                  <i className={subItem.icon}></i>
                  <span>{subItem.name}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <>
      {/* Sidebar Backdrop */}
      <div
        className={`sidebar-backdrop ${sidebarOpen ? 'active' : ''}`}
        id="sidebarBackdrop"
        onClick={closeSidebar}
      />
      
      {/* Sidebar Navigation */}
      <nav
        className={`sidebar ${sidebarOpen ? 'open' : ''}`}
        id="sidebar"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="sidebar-header">
          <div className="logo">
            <i className="fas fa-shield-alt"></i>
            <span>ArionComply</span>
          </div>
        </div>
        
        <ul className="nav-menu">
          {getFilteredNavItems().map(renderNavItem)}
        </ul>
      </nav>
    </>
  );
};