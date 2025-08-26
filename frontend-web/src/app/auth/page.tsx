// File path: src/app/auth/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/userStore';

// Exact replica of your vanilla JS authentication system
export default function AuthPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [currentTheme, setCurrentTheme] = useState('ocean');
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const { setUser } = useUserStore();  // Only destructure setUser

  // Splash screen themes - exact same as vanilla JS
  const themes = ['muted', 'ocean', 'sunset', 'forest', 'galaxy', 'corporate'];
  
  // Loading messages - exact same as vanilla JS
  const loadingMessages = [
    "Loading compliance frameworks...",
    "Initializing AI engine...", 
    "Preparing your dashboard...",
    "Almost ready...",
    "Welcome aboard!"
  ];

  // Splash screen timer - exact same as vanilla JS (3 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAuth(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Progress animation - exact same as vanilla JS
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + (100 / 30); // 30 intervals over 3 seconds
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, []);

  // Loading message rotation - exact same as vanilla JS (600ms intervals)
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setLoadingMessageIndex(prev => (prev + 1) % loadingMessages.length);
    }, 600);

    return () => clearInterval(messageInterval);
  }, [loadingMessages.length]);

  // Theme cycling - exact same as vanilla JS (4 seconds per theme)
  useEffect(() => {
    const themeInterval = setInterval(() => {
      setCurrentTheme(prev => {
        const currentIndex = themes.indexOf(prev);
        return themes[(currentIndex + 1) % themes.length];
      });
    }, 4000);

    return () => clearInterval(themeInterval);
  }, [themes]);

  // Handle authentication - updated to match User interface
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create user data with the correct structure for userStore
    const userData = {
      id: 'user_' + Date.now(), // Generate a simple ID
      name: 'Admin User',
      email: 'admin@arioncomply.com',
      role: 'admin' as const, // Type assertion since it's an enum-like type
      permissions: ['all'],
      company: 'ArionComply Demo' // This isn't in the User interface but can be stored in localStorage
    };

    // Store in localStorage for vanilla JS compatibility
    localStorage.setItem('arioncomply_user', JSON.stringify(userData));
    localStorage.setItem('arioncomply_session', 'active');
    
    // Only pass the properties that match the User interface to setUser
    setUser({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      permissions: userData.permissions
    });
    
    console.log("Auth successful, redirecting to home"); 
    router.push('/');
  };

  // Quick demo handler - updated to match User interface
  const handleQuickDemo = () => {
    const demoUser = {
      id: 'demo_' + Date.now(), // Generate a simple ID
      name: 'Demo User',
      email: 'demo@arioncomply.com',
      role: 'user' as const, // Type assertion since it's an enum-like type
      permissions: ['view'],
      company: 'Demo Company' // Not in User interface but stored in localStorage
    };

    localStorage.setItem('arioncomply_user', JSON.stringify(demoUser));
    localStorage.setItem('arioncomply_session', 'active');
    
    // Only pass the properties that match the User interface to setUser
    setUser({
      id: demoUser.id,
      name: demoUser.name,
      email: demoUser.email,
      role: demoUser.role,
      permissions: demoUser.permissions
    });
    
    router.push('/');
  };

  return (
    <div className="auth-container">
      {/* Splash Screen - exact same structure as vanilla JS */}
      <div className={`splash-screen ${currentTheme} ${showAuth ? 'fade-out' : ''}`}>
        
        {/* Floating Background Elements - exact same as vanilla JS */}
        <div className="floating-elements">
          <i className="fas fa-shield-alt floating-element"></i>
          <i className="fas fa-robot floating-element"></i>
          <i className="fas fa-lock floating-element"></i>
          <i className="fas fa-chart-line floating-element"></i>
          <i className="fas fa-cog floating-element"></i>
        </div>

        <div className="splash-content">
          {/* Logo - exact same structure as vanilla JS */}
          <div className="splash-logo">
            <i className="fas fa-shield-alt"></i>
            ArionComply
          </div>
          
          <div className="splash-tagline">
            AI Accountability & Multi-Framework Compliance Platform
          </div>

          {/* Loading Animation - exact same structure as vanilla JS */}
          <div className="splash-loading-container">
            <div className="splash-spinner"></div>
            <div className="loading-message">
              {loadingMessages[loadingMessageIndex]}
            </div>
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="progress-text">{Math.round(progress)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication Forms - exact same structure as vanilla JS */}
      <div className={`auth-content ${showAuth ? 'fade-in' : ''}`}>
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <i className="fas fa-shield-alt"></i>
              <span>ArionComply</span>
            </div>
          </div>

          {/* Tab System - exact same structure as vanilla JS */}
          <div className="auth-tabs">
            <button 
              className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Sign In
            </button>
            <button 
              className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              Sign Up
            </button>
          </div>

          {/* Login Form - exact same structure as vanilla JS */}
          <form 
            className={`auth-form ${activeTab === 'login' ? 'active' : ''}`}
            onSubmit={handleAuth}
          >
            <div className="form-group">
              <div className="input-group">
                <i className="fas fa-envelope input-icon"></i>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="Email address"
                  defaultValue="admin@arioncomply.com"
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <div className="input-group">
                <i className="fas fa-lock input-icon"></i>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="Password"
                  defaultValue="demo123"
                  required 
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-auth">
              Sign In to Dashboard
            </button>
          </form>

          {/* Register Form - exact same structure as vanilla JS */}
          <form 
            className={`auth-form ${activeTab === 'register' ? 'active' : ''}`}
            onSubmit={handleAuth}
          >
            <div className="form-group">
              <div className="input-group">
                <i className="fas fa-user input-icon"></i>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Full name"
                  defaultValue="Demo User"
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-group">
                <i className="fas fa-envelope input-icon"></i>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="Email address"
                  defaultValue="demo@arioncomply.com"
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <div className="input-group">
                <i className="fas fa-building input-icon"></i>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Company name"
                  defaultValue="Demo Company"
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-group">
                <i className="fas fa-lock input-icon"></i>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="Password"
                  defaultValue="demo123"
                  required 
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-auth">
              Create Account
            </button>
          </form>

          {/* Demo Section - exact same structure as vanilla JS */}
          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="demo-section">
            <h3>Quick Demo Access</h3>
            <p>Experience the full platform instantly with our demo environment.</p>
            <button 
              type="button" 
              className="btn btn-demo"
              onClick={handleQuickDemo}
            >
              <i className="fas fa-rocket"></i>
              Launch Demo Environment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}