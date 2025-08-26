// File path: arioncomply-v1/frontend-web/src/app/dashboard/page.tsx

'use client';

import React from 'react';

export default function DashboardPage() {
  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Compliance Dashboard</h1>
          <p className="page-subtitle">
            AI Accountability & Multi-Framework Compliance Overview
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-ai">
            <i className="fas fa-robot"></i>
            Classify AI System
          </button>
          <button className="btn btn-primary">
            <i className="fas fa-plus"></i>
            Create Risk
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card success">
          <div className="kpi-value">95%</div>
          <div className="kpi-label">Compliance Score</div>
        </div>
        <div className="kpi-card warning">
          <div className="kpi-value">12</div>
          <div className="kpi-label">Open Risks</div>
        </div>
        <div className="kpi-card primary">
          <div className="kpi-value">8</div>
          <div className="kpi-label">AI Systems</div>
        </div>
        <div className="kpi-card danger">
          <div className="kpi-value">3</div>
          <div className="kpi-label">Overdue Actions</div>
        </div>
      </div>

      {/* Risk Heat Map */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>
          Risk Heat Map - Likelihood vs Impact
        </h3>
        <div className="risk-heatmap">
          {/* Headers */}
          <div></div>
          <div className="risk-axis-label">Very Low</div>
          <div className="risk-axis-label">Low</div>
          <div className="risk-axis-label">Medium</div>
          <div className="risk-axis-label">High</div>
          <div className="risk-axis-label">Very High</div>

          {/* Very High Impact Row */}
          <div className="risk-axis-label" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
            Very High
          </div>
          <div className="risk-cell medium">1</div>
          <div className="risk-cell high">2</div>
          <div className="risk-cell very-high">3</div>
          <div className="risk-cell critical">1</div>
          <div className="risk-cell critical">0</div>

          {/* High Impact Row */}
          <div className="risk-axis-label" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
            High
          </div>
          <div className="risk-cell low">2</div>
          <div className="risk-cell medium">1</div>
          <div className="risk-cell high">2</div>
          <div className="risk-cell very-high">1</div>
          <div className="risk-cell critical">0</div>

          {/* Medium Impact Row */}
          <div className="risk-axis-label" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
            Medium
          </div>
          <div className="risk-cell very-low">1</div>
          <div className="risk-cell low">3</div>
          <div className="risk-cell medium">2</div>
          <div className="risk-cell high">1</div>
          <div className="risk-cell very-high">0</div>

          {/* Low Impact Row */}
          <div className="risk-axis-label" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
            Low
          </div>
          <div className="risk-cell very-low">2</div>
          <div className="risk-cell low">4</div>
          <div className="risk-cell medium">1</div>
          <div className="risk-cell high">0</div>
          <div className="risk-cell very-high">0</div>

          {/* Very Low Impact Row */}
          <div className="risk-axis-label" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
            Very Low
          </div>
          <div className="risk-cell very-low">1</div>
          <div className="risk-cell very-low">0</div>
          <div className="risk-cell very-low">0</div>
          <div className="risk-cell low">0</div>
          <div className="risk-cell medium">0</div>
        </div>
        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-gray)' }}>
          <strong>Legend:</strong> Numbers indicate count of risks in each category. Hover for risk details, click to view full risk assessment.
        </p>
      </div>

      {/* Charts and Activity Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Compliance Trends Chart */}
        <div className="card">
          <h3 style={{ margin: '0 0 1rem 0', padding: '1.5rem 1.5rem 0 1.5rem' }}>Compliance Trends</h3>
          <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
            <div style={{ 
              height: '300px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: 'var(--bg-light)',
              borderRadius: 'var(--border-radius-sm)',
              color: 'var(--text-gray)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <i className="fas fa-chart-line" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
                <p>Compliance Score Trend Chart - Last 12 Months</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 style={{ margin: '0 0 1rem 0', padding: '1.5rem 1.5rem 0 1.5rem' }}>Recent Activity</h3>
          <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
            <div className="activity-item">
              <div className="activity-icon success">
                <i className="fas fa-robot"></i>
              </div>
              <div className="activity-content">
                <div className="activity-title">AI System Classified</div>
                <div className="activity-detail">Customer Analytics AI - High Risk</div>
                <div className="activity-time">2 hours ago</div>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon warning">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <div className="activity-content">
                <div className="activity-title">Risk Assessment Completed</div>
                <div className="activity-detail">Cloud Infrastructure Risk</div>
                <div className="activity-time">4 hours ago</div>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon info">
                <i className="fas fa-file-alt"></i>
              </div>
              <div className="activity-content">
                <div className="activity-title">Policy Updated</div>
                <div className="activity-detail">AI Governance Policy v2.1</div>
                <div className="activity-time">6 hours ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Trigger Button */}
      <button 
        className="chat-trigger"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'var(--ai-purple)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-subtle)',
          fontSize: '1.5rem',
          zIndex: 1000
        }}
        title="Open AI Assistant"
      >
        <i className="fas fa-robot"></i>
      </button>
    </>
  );
}