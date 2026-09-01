import React from 'react';
import { Link } from 'react-router-dom';
import { useAccessibility } from '../context/useAccessibility';

export const ActionPlanPage: React.FC = () => {
  const { isHighContrast } = useAccessibility();

  return (
    <div>
      {/* Module Header Banner */}
      <div
        style={{
          backgroundColor: isHighContrast ? '#111827' : '#ffffff',
          border: `1px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
          borderRadius: '6px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: isHighContrast ? 'none' : '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="jm-badge jm-badge-green">Step 05 • Act</span>
            <span style={{ fontSize: '11px', color: isHighContrast ? '#9ca3af' : '#64748b', fontWeight: 600 }}>
              MANDATE CODE: PMAJAY-ACT-MOD-05
            </span>
          </div>
          <span
            style={{
              fontSize: '11.5px',
              fontWeight: 600,
              color: '#15803d',
              backgroundColor: isHighContrast ? '#374151' : '#f0fdf4',
              padding: '3px 8px',
              borderRadius: '3px',
              border: '1px solid #bbf7d0',
            }}
          >
            Phase 1: Architecture Specification
          </span>
        </div>

        <h1
          style={{
            fontSize: '24px',
            fontWeight: 800,
            color: isHighContrast ? '#ffffff' : '#0c2340',
            marginBottom: '4px',
          }}
        >
          PM-AJAY Convergence & Enterprise Action Plan
        </h1>
        <div style={{ fontSize: '13.5px', color: isHighContrast ? '#ff9933' : '#c2410c', fontWeight: 600, marginBottom: '12px' }}>
          पीएम-अजय अभिसरण एवं उद्यम कार्य योजना
        </div>

        <p style={{ fontSize: '14px', lineHeight: 1.6, color: isHighContrast ? '#e5e7eb' : '#475569', margin: 0 }}>
          Translates skills and market opportunities into tangible financial and administrative actions.
          Unlocks direct capital subsidies, modernized toolkit distributions, credit linkages via
          NSFDC/mudra, and post-certification placement tracking under PM-AJAY guidelines.
        </p>
      </div>

      {/* Purpose & Architecture Matrix */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '28px',
        }}
      >
        {/* Card 1 */}
        <div
          style={{
            backgroundColor: isHighContrast ? '#111827' : '#ffffff',
            border: `1px solid ${isHighContrast ? '#4b5563' : '#e2e8f0'}`,
            borderRadius: '6px',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ color: '#15803d' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </span>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0c2340' }}>
              1. PM-AJAY Capital & Toolkits
            </h2>
          </div>
          <p style={{ fontSize: '13px', lineHeight: 1.55, color: isHighContrast ? '#d1d5db' : '#475569', marginBottom: '12px' }}>
            Direct financial support for equipment acquisition and working capital:
          </p>
          <ul style={{ fontSize: '12px', color: isHighContrast ? '#9ca3af' : '#64748b', paddingLeft: '18px', margin: 0, lineHeight: 1.6 }}>
            <li>Up to ₹50,000 subsidy per beneficiary for standardized professional toolkits</li>
            <li>Direct Benefit Transfer (DBT) integration with Aadhaar-linked accounts</li>
            <li>Concessional credit linkage via National Scheduled Castes Finance & Development Corp (NSFDC)</li>
          </ul>
        </div>

        {/* Card 2 */}
        <div
          style={{
            backgroundColor: isHighContrast ? '#111827' : '#ffffff',
            border: `1px solid ${isHighContrast ? '#4b5563' : '#e2e8f0'}`,
            borderRadius: '6px',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ color: '#0c2340' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0c2340' }}>
              2. SHG & Enterprise Incubation
            </h2>
          </div>
          <p style={{ fontSize: '13px', lineHeight: 1.55, color: isHighContrast ? '#d1d5db' : '#475569', marginBottom: '12px' }}>
            Organizing individual beneficiaries into sustainable producer cooperatives:
          </p>
          <ul style={{ fontSize: '12px', color: isHighContrast ? '#9ca3af' : '#64748b', paddingLeft: '18px', margin: 0, lineHeight: 1.6 }}>
            <li>Access to PM-AJAY funded Common Facility Centres (CFC)</li>
            <li>Bulk procurement of quality raw materials to lower production costs</li>
            <li>Branding, packaging & regional cooperative formation</li>
          </ul>
        </div>

        {/* Card 3 */}
        <div
          style={{
            backgroundColor: isHighContrast ? '#111827' : '#ffffff',
            border: `1px solid ${isHighContrast ? '#4b5563' : '#e2e8f0'}`,
            borderRadius: '6px',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ color: '#c2410c' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </span>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0c2340' }}>
              3. Milestone Audit & Tracking
            </h2>
          </div>
          <p style={{ fontSize: '13px', lineHeight: 1.55, color: isHighContrast ? '#d1d5db' : '#475569', marginBottom: '12px' }}>
            Rigorous post-intervention livelihood delta tracking:
          </p>
          <ul style={{ fontSize: '12px', color: isHighContrast ? '#9ca3af' : '#64748b', paddingLeft: '18px', margin: 0, lineHeight: 1.6 }}>
            <li>3-month, 6-month, and 12-month post-skilling income verification</li>
            <li>Validation of continuous enterprise operations</li>
            <li>Grievance redressal & supplemental upskilling pathways</li>
          </ul>
        </div>
      </div>

      {/* Action Strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '16px 20px',
          backgroundColor: isHighContrast ? '#111827' : '#ffffff',
          borderRadius: '6px',
          border: `1px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
        }}
      >
        <Link to="/recommendations" className="jm-btn jm-btn-secondary">
          <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 10H5M9 14l-4-4 4-4" />
          </svg>
          <span>Back to Skill Recommendations</span>
        </Link>
        <Link to="/mapping" className="jm-btn jm-btn-primary">
          <span>Start New Livelihood Assessment</span>
          <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 10h10M11 6l4 4-4 4" />
          </svg>
        </Link>
      </div>
    </div>
  );
};
