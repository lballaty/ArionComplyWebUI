'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUserStore } from '@/stores/userStore';

// Module card data - exact same as vanilla JS routing.html
const moduleCards = [
  {
    href: '/dashboard',
    icon: 'fas fa-chart-line',
    title: 'Dashboard',
    description: 'Compliance overview, KPIs, and executive metrics with interactive risk heat map',
    status: 'active',
    shortcut: 'Alt+D',
    className: 'primary'
  },
  {
    href: '/assessments',
    icon: 'fas fa-robot',
    title: 'AI Assessments',
    description: 'Automated compliance assessments, gap analysis, and framework recommendations',
    status: 'active', 
    shortcut: 'Alt+A',
    className: ''
  },
  {
    href: '/risks',
    icon: 'fas fa-exclamation-triangle',
    title: 'Risk Management',
    description: 'Enterprise risk register, assessment workflows, and mitigation tracking',
    status: 'active',
    shortcut: 'Alt+R',
    className: 'warning'
  },
  {
    href: '/audits',
    icon: 'fas fa-search',
    title: 'Audit Center',
    description: 'Audit planning, execution, findings management, and compliance tracking',
    status: 'active',
    shortcut: 'Alt+U',
    className: ''
  },
  {
    href: '/policies',
    icon: 'fas fa-file-contract',
    title: 'Policy Hub',
    description: 'Policy management, version control, approval workflows, and distribution',
    status: 'active',
    shortcut: 'Alt+P',
    className: ''
  },
  {
    href: '/training',
    icon: 'fas fa-graduation-cap',
    title: 'Training Center',
    description: 'Compliance training programs, certifications, and awareness campaigns',
    status: 'beta',
    shortcut: 'Alt+T',
    className: ''
  },
  {
    href: '/reports',
    icon: 'fas fa-chart-bar',
    title: 'Analytics & Reports',
    description: 'Executive reporting, compliance metrics, and business intelligence dashboards',
    status: 'active',
    shortcut: 'Alt+E',
    className: ''
  },
  {
    href: '/kanban',
    icon: 'fas fa-tasks',
    title: 'Task Management',
    description: 'Kanban boards, project workflows, and task automation for compliance activities',
    status: 'beta',
    shortcut: 'Alt+B',
    className: 'primary'
  },
  {
    href: '/files',
    icon: 'fas fa-folder',
    title: 'Document Center',
    description: 'Centralized file management, version control, secure sharing, and document workflows',
    status: 'beta',
    shortcut: 'Alt+F',
    className: ''
  },
  {
    href: '/settings',
    icon: 'fas fa-cog',
    title: 'System Settings',
    description: 'User management, system configuration, integrations, and platform customization',
    status: 'active',
    shortcut: 'Alt+S',
    className: ''
  },
  {
    href: '/prototypes',
    icon: 'fas fa-flask',
    title: 'Prototypes & Labs',
    description: 'Experimental features, UI components showcase, and development testing environment',
    status: 'beta',
    shortcut: 'Alt+L',
    className: 'warning'
  }
];

// Exact replica of vanilla JS routing page
export default function HomePage() {
  const { user, logout } = useUserStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication - exact same logic as vanilla JS
  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }
    setIsLoading(false);
  }, [user, router]);

  // Handle module navigation - exact same logic as vanilla JS loadModule function
  const handleModuleClick = (href: string, title: string) => {
    // Store current module context for chat
    localStorage.setItem('current_module', title);
    // Navigate to module
    router.push(href);
  };

  // Keyboard shortcuts - exact same as vanilla JS
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.altKey) {
        const shortcuts: { [key: string]: string } = {
          'd': '/dashboard',
          'a': '/assessments', 
          'r': '/risks',
          'u': '/audits',
          'p': '/policies',
          't': '/training',
          'e': '/reports',
          'b': '/kanban',
          'f': '/files',
          's': '/settings',
          'l': '/prototypes'
        };

        const route = shortcuts[e.key.toLowerCase()];
        if (route) {
          e.preventDefault();
          router.push(route);
        }
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [router]);

  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="routing-container">
      <div className="main-content">
        
        {/* Header Section - exact same structure as vanilla JS */}
        <div className="routing-header">
          <div className="routing-logo">
            <i className="fas fa-shield-alt"></i>
            <span>ArionComply</span>
          </div>
          
          <div className="user-section">
            <div className="user-avatar">
              <i className="fas fa-user"></i>
            </div>
            <div className="user-details">
              <div className="user-name">{user?.name}</div>
              <div className="user-company">{user?.company}</div>
            </div>
            <button className="logout-btn" onClick={logout}>
              <i className="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Introduction Section - exact same structure as vanilla JS */}
        <div className="routing-intro">
          <h1 className="routing-title">Welcome to your Compliance Command Center</h1>
          <p className="routing-subtitle">
            Choose a module below to begin your compliance workflow
          </p>
        </div>

        {/* Module Grid - exact same structure as vanilla JS */}
        <div className="module-grid">
          {moduleCards.map((card, index) => (
            <Link
              key={card.href}
              href={card.href}
              className={`module-card ${card.className}`}
              onClick={(e) => {
                e.preventDefault();
                handleModuleClick(card.href, card.title);
              }}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="module-icon">
                <i className={card.icon}></i>
              </div>
              
              <h3 className="module-title">{card.title}</h3>
              
              <p className="module-description">
                {card.description}
              </p>
              
              <div className="module-meta">
                <div className="module-status">
                  <div className={`status-indicator ${card.status}`}></div>
                  <span>{card.status === 'beta' ? 'Beta' : 'Active'}</span>
                </div>
                <div className="module-shortcut">{card.shortcut}</div>
              </div>

              {/* Hover gradient overlay - exact same as vanilla JS */}
              <div className="module-gradient-overlay"></div>
            </Link>
          ))}
        </div>

        {/* Footer Info - exact same structure as vanilla JS */}
        <div className="routing-footer">
          <div className="footer-info">
            <p>
              <i className="fas fa-keyboard"></i>
              Use keyboard shortcuts (Alt + letter) for quick navigation
            </p>
            <p>
              <i className="fas fa-comments"></i>
              Press Ctrl+K to open the AI assistant
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Save as: src/app/page.tsx