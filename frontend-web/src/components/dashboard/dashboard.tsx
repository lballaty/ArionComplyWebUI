// File path: arioncomply-v1/frontend-web/src/components/dashboard/Dashboard.tsx

'use client';

import React, { useState } from 'react';
import { useChatStore } from '@/stores/chatStore';

// Risk data structure - exact replica of vanilla JS data
const RISK_HEATMAP_DATA = {
  // Risk distribution by likelihood vs impact
  'very-low-very-low': { count: 2, risks: ['R-030', 'R-031'] },
  'low-very-low': { count: 3, risks: ['R-032', 'R-033', 'R-034'] },
  'medium-very-low': { count: 2, risks: ['R-035', 'R-036'] },
  'high-very-low': { count: 1, risks: ['R-037'] },
  'very-high-very-low': { count: 0, risks: [] },
  
  'very-low-low': { count: 3, risks: ['R-027', 'R-028', 'R-029'] },
  'low-low': { count: 4, risks: ['R-024', 'R-025', 'R-026', 'R-038'] },
  'medium-low': { count: 2, risks: ['R-022', 'R-023'] },
  'high-low': { count: 2, risks: ['R-012', 'R-018'] },
  'very-high-low': { count: 1, risks: ['R-020'] },
  
  'very-low-medium': { count: 2, risks: ['R-017', 'R-019'] },
  'low-medium': { count: 1, risks: ['R-016'] },
  'medium-medium': { count: 1, risks: ['R-014'] },
  'high-medium': { count: 2, risks: ['R-002', 'R-011'] },
  'very-high-medium': { count: 3, risks: ['R-003', 'R-009', 'R-021'] },
  
  'very-low-high': { count: 1, risks: ['R-013'] },
  'low-high': { count: 2, risks: ['R-010', 'R-008'] },
  'medium-high': { count: 1, risks: ['R-006'] },
  'high-high': { count: 2, risks: ['R-004', 'R-005'] },
  'very-high-high': { count: 1, risks: ['R-007'] },
  
  'very-low-very-high': { count: 0, risks: [] },
  'low-very-high': { count: 0, risks: [] },
  'medium-very-high': { count: 1, risks: ['R-015'] },
  'high-very-high': { count: 0, risks: [] },
  'very-high-very-high': { count: 1, risks: ['R-001'] }
};

// Risk details for tooltips and modals
const RISK_DETAILS: { [key: string]: { title: string; description: string; severity: string } } = {
  'R-001': { title: 'AI Hiring Discrimination', description: 'AI recruitment system shows bias against protected groups', severity: 'Critical' },
  'R-002': { title: 'Cloud Infrastructure Risk', description: 'Cloud service dependency creates availability risk', severity: 'High' },
  'R-003': { title: 'GDPR Violation Risk', description: 'Data processing activities may violate GDPR requirements', severity: 'Very High' },
  'R-007': { title: 'Ransomware Attack Risk', description: 'Critical systems vulnerable to ransomware attacks', severity: 'Very High' },
  'R-012': { title: 'Major Data Center Outage', description: 'Primary data center has single point of failure', severity: 'High' },
  'R-015': { title: 'CEO Email Compromise', description: 'Executive email accounts lack multi-factor authentication', severity: 'Medium' },
  // Add more risk details as needed...
};

export const Dashboard: React.FC = () => {
  const { openChat } = useChatStore();
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);

  // Handle risk cell click - exact replica of vanilla JS behavior
  const showRiskDetails = (riskId: string) => {
    setSelectedRisk(riskId);
    console.log(`Showing details for risk: ${riskId}`);
    // TODO: Show risk details modal
  };

  // Handle navigation to AI classification wizard
  const handleClassifyAI = () => {
    window.location.href = '/assessments/ai-act';
  };

  // Handle navigation to risk management
  const handleCreateRisk = () => {
    window.location.href = '/risk-management';
  };

  // Get risk cell styling based on severity
  const getRiskCellClass = (likelihood: string, impact: string) => {
    const key = `${likelihood}-${impact}`;
    const data = RISK_HEATMAP_DATA[key as keyof typeof RISK_HEATMAP_DATA];
    
    if (!data || data.count === 0) return 'risk-cell very-low';
    if (data.count === 1) return 'risk-cell low';
    if (data.count <= 2) return 'risk-cell medium';
    if (data.count <= 3) return 'risk-cell high';
    if (data.count <= 4) return 'risk-cell very-high';
    return 'risk-cell critical';
  };

  // Get tooltip content for risk cells
  const getTooltipContent = (likelihood: string, impact: string) => {
    const key = `${likelihood}-${impact}`;
    const data = RISK_HEATMAP_DATA[key as keyof typeof RISK_HEATMAP_DATA];
    
    if (!data || data.count === 0) return '';
    
    if (data.count === 1) {
      const risk = RISK_DETAILS[data.risks[0]];
      return `${data.risks[0]}: ${risk?.title || 'Risk details'}`;
    }
    
    return data.risks.map(id => {
      const risk = RISK_DETAILS[id];
      return `${id}: ${risk?.title || 'Risk details'}`;
    }).join('<br />');
  };

  // Render risk heatmap grid
  const renderRiskHeatmap = () => {
    const impacts = ['very-high', 'high', 'medium', 'low', 'very-low'];
    const likelihoods = ['very-low', 'low', 'medium', 'high', 'very-high'];
    const impactLabels = ['Very High', 'High', 'Medium', 'Low', 'Very Low'];
    const likelihoodLabels = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];

    return (
      <div className="risk-heatmap">
        {/* Headers */}
        <div></div>
        {likelihoodLabels.map(label => (
          <div key={label} className="risk-axis-label">{label}</div>
        ))}

        {/* Risk cells by impact level */}
        {impacts.map((impact, impactIndex) => (
          <React.Fragment key={impact}>
            <div className="risk-axis-label" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
              {impactLabels[impactIndex]}
            </div>
            {likelihoods.map(likelihood => {
              const key = `${likelihood}-${impact}`;
              const data = RISK_HEATMAP_DATA[key as keyof typeof RISK_HEATMAP_DATA];
              const cellClass = getRiskCellClass(likelihood, impact);
              const tooltipContent = getTooltipContent(likelihood, impact);
              
              return (
                <div
                  key={key}
                  className={cellClass}
                  onClick={() => data && data.count > 0 && showRiskDetails(data.risks[0])}
                  title={tooltipContent.replace(/<br \/>/g, '\n')}
                  style={{ cursor: data && data.count > 0 ? 'pointer' : 'default' }}
                >
                  {data?.count || 0}
                  {tooltipContent && (
                    <div className="tooltip" dangerouslySetInnerHTML={{ __html: tooltipContent }} />
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Compliance Dashboard</h1>
          <p className="page-subtitle">
            AI Accountability & Multi-Framework Compliance Overview
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-ai" onClick={handleClassifyAI}>
            <i className="fas fa-robot"></i>
            Classify AI System
          </button>
          <button className="btn btn-primary" onClick={handleCreateRisk}>
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
        {renderRiskHeatmap()}
        <div className="risk-legend" style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-gray)' }}>
          <p>
            <strong>Instructions:</strong> Click on cells with numbers to view risk details. 
            Colors indicate risk concentration: lighter = fewer risks, darker = more risks.
          </p>
        </div>
      </div>

      {/* Charts and Activity Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Compliance Trends Chart */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Compliance Trends</h3>
          <div className="chart-placeholder">
            <p style={{ textAlign: 'center', color: 'var(--text-gray)', padding: '3rem' }}>
              Compliance Score Trend Chart - Last 12 Months
              <br />
              <small>Chart implementation coming soon</small>
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Recent Activity</h3>
          <div className="activity-feed">
            <div className="activity-item">
              <div className="activity-title">AI System Classified</div>
              <div className="activity-detail">Customer Analytics AI - High Risk</div>
              <div className="activity-time">2 hours ago</div>
            </div>
            <div className="activity-item">
              <div className="activity-title">Risk Assessment Completed</div>
              <div className="activity-detail">Cloud Infrastructure Risk</div>
              <div className="activity-time">4 hours ago</div>
            </div>
            <div className="activity-item">
              <div className="activity-title">Policy Updated</div>
              <div className="activity-detail">AI Governance Policy v2.1</div>
              <div className="activity-time">6 hours ago</div>
            </div>
            <div className="activity-item">
              <div className="activity-title">Control Review</div>
              <div className="activity-detail">Access Control A.9.1.1 - Passed</div>
              <div className="activity-time">1 day ago</div>
            </div>
            <div className="activity-item">
              <div className="activity-title">Audit Scheduled</div>
              <div className="activity-detail">Q4 ISO 27001 Internal Audit</div>
              <div className="activity-time">2 days ago</div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Integration Button */}
      <button
        className="chat-trigger"
        onClick={openChat}
        title="Open AI Assistant"
        aria-label="Open AI Assistant"
      >
        <i className="fas fa-robot"></i>
      </button>

      {/* Risk Details Modal - placeholder for future implementation */}
      {selectedRisk && (
        <div className="modal-backdrop" onClick={() => setSelectedRisk(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Risk Details: {selectedRisk}</h3>
              <button className="close-btn" onClick={() => setSelectedRisk(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <p>Risk details for {selectedRisk} would be displayed here.</p>
              <p>This modal will be implemented in a future iteration.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};