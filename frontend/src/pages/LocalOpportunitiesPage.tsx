import React from 'react';
import { Link } from 'react-router-dom';
import { useAccessibility } from '../context/useAccessibility';

export const LocalOpportunitiesPage: React.FC = () => {
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
            <span className="jm-badge jm-badge-neutral">Step 03 • Demand Analysis</span>
            <span style={{ fontSize: '11px', color: isHighContrast ? '#9ca3af' : '#64748b', fontWeight: 600 }}>
              MANDATE CODE: PMAJAY-OPP-MOD-03
            </span>
          </div>
          <span
            style={{
              fontSize: '11.5px',
              fontWeight: 600,
              color: '#0c2340',
              backgroundColor: isHighContrast ? '#374151' : '#f1f5f9',
              padding: '3px 8px',
              borderRadius: '3px',
              border: '1px solid #cbd5e1',
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
          Local District Opportunities & Value Chain Analysis
        </h1>
        <div style={{ fontSize: '13.5px', color: isHighContrast ? '#ff9933' : '#c2410c', fontWeight: 600, marginBottom: '12px' }}>
          स्थानीय जिला अवसर एवं मूल्य श्रृंखला विश्लेषण
        </div>

        <p style={{ fontSize: '14px', lineHeight: 1.6, color: isHighContrast ? '#e5e7eb' : '#475569', margin: 0 }}>
          Synthesizes demand from District Industries Centres (DIC), MSME industrial parks, One District One
          Product (ODOP) hubs, and agro-climatic trade channels to ensure that livelihood training maps
          directly to real, paying local economic opportunities.
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
            <span style={{ color: '#0c2340' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </span>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0c2340' }}>
              1. Industrial Cluster Absorption
            </h2>
          </div>
          <p style={{ fontSize: '13px', lineHeight: 1.55, color: isHighContrast ? '#d1d5db' : '#475569', marginBottom: '12px' }}>
            Indexes local hiring capacity across major industrial nodes within 25–50 km radii of target SC habitations:
          </p>
          <ul style={{ fontSize: '12px', color: isHighContrast ? '#9ca3af' : '#64748b', paddingLeft: '18px', margin: 0, lineHeight: 1.6 }}>
            <li>Aggregated hiring projections from District Employment Exchanges</li>
            <li>ODOP specialized cluster linkages (textiles, food processing, pottery)</li>
            <li>Green jobs & renewable energy expansion (PM-KUSUM, rooftop solar)</li>
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
            <span style={{ color: '#c2410c' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </span>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0c2340' }}>
              2. Raw Material & Supply Chains
            </h2>
          </div>
          <p style={{ fontSize: '13px', lineHeight: 1.55, color: isHighContrast ? '#d1d5db' : '#475569', marginBottom: '12px' }}>
            Eliminates exploitative middlemen by mapping institutional raw material depots and Common Facility Centers (CFC):
          </p>
          <ul style={{ fontSize: '12px', color: isHighContrast ? '#9ca3af' : '#64748b', paddingLeft: '18px', margin: 0, lineHeight: 1.6 }}>
            <li>National Handloom Development Corporation (NHDC) yarn depots</li>
            <li>KVIC & state khadi board material distribution</li>
            <li>Agricultural APMC cold storage & post-harvest processing hubs</li>
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
            <span style={{ color: '#15803d' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </span>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0c2340' }}>
              3. Forward Buyer Networks
            </h2>
          </div>
          <p style={{ fontSize: '13px', lineHeight: 1.55, color: isHighContrast ? '#d1d5db' : '#475569', marginBottom: '12px' }}>
            Links trained artisans directly with institutional procurement quotas and e-commerce platforms:
          </p>
          <ul style={{ fontSize: '12px', color: isHighContrast ? '#9ca3af' : '#64748b', paddingLeft: '18px', margin: 0, lineHeight: 1.6 }}>
            <li>Government e-Marketplace (GeM) public procurement for SC enterprises</li>
            <li>TRIFED & state tribal/social welfare emporiums</li>
            <li>Direct consumer e-commerce onboarding assistance</li>
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
        <Link to="/profile" className="jm-btn jm-btn-secondary">
          <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 10H5M9 14l-4-4 4-4" />
          </svg>
          <span>Back to Beneficiary Profile</span>
        </Link>
        <Link to="/recommendations" className="jm-btn jm-btn-primary">
          <span>Proceed to Skill Recommendations</span>
          <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 10h10M11 6l4 4-4 4" />
          </svg>
        </Link>
      </div>
    </div>
  );
};
