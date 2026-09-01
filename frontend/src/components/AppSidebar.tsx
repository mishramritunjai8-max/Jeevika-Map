import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAccessibility } from '../context/useAccessibility';

interface AppSidebarProps {
  isOpen: boolean;
  onCloseMobile?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ isOpen, onCloseMobile }) => {
  const { isHighContrast } = useAccessibility();

  const navigationItems = [
    {
      to: '/mapping',
      step: '01',
      stage: 'Discover',
      label: 'Livelihood Mapping',
      sublabel: 'Cluster & Trade Survey',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
          <line x1="8" y1="2" x2="8" y2="18" />
          <line x1="16" y1="6" x2="16" y2="22" />
        </svg>
      ),
    },
    {
      to: '/profile',
      step: '02',
      stage: 'Understand',
      label: 'Beneficiary Profile',
      sublabel: 'Informal Skills & Baseline',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      to: '/opportunities',
      step: '03',
      stage: 'Demand',
      label: 'Local Opportunities',
      sublabel: 'District Value Chains',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
    },
    {
      to: '/recommendations',
      step: '04',
      stage: 'Recommend',
      label: 'Skill Recommendations',
      sublabel: 'NSQF QP-NOS Matching',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      ),
    },
    {
      to: '/action-plan',
      step: '05',
      stage: 'Act',
      label: 'Action Plan',
      sublabel: 'PM-AJAY Grant & Linkage',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
  ];

  return (
    <aside
      aria-label="Application Navigation Sidebar"
      style={{
        width: isOpen ? '280px' : '0px',
        minWidth: isOpen ? '280px' : '0px',
        transition: 'width 0.2s ease, min-width 0.2s ease',
        overflow: 'hidden',
        backgroundColor: isHighContrast ? '#0a0a0a' : '#f8fafc',
        borderRight: `1px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 102px)',
        position: 'sticky',
        top: '64px',
        zIndex: 80,
      }}
    >
      <div
        style={{
          width: '280px',
          padding: '20px 16px',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Workflow Progression Header */}
        <div style={{ marginBottom: '20px' }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: isHighContrast ? '#d1d5db' : '#64748b',
              marginBottom: '4px',
            }}
          >
            PM-AJAY Workflow Pipeline
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0c2340' }}>
            5-Stage Livelihood Framework
          </div>
        </div>

        {/* Navigation Link Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexGrow: 1 }}>
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '4px',
                textDecoration: 'none',
                backgroundColor: isActive
                  ? (isHighContrast ? '#1f2937' : '#ffffff')
                  : 'transparent',
                border: isActive
                  ? `1px solid ${isHighContrast ? '#ff9933' : '#cbd5e1'}`
                  : '1px solid transparent',
                boxShadow: isActive && !isHighContrast ? '0 2px 4px rgba(12, 35, 64, 0.04)' : 'none',
                color: isActive
                  ? (isHighContrast ? '#ff9933' : '#0c2340')
                  : (isHighContrast ? '#e5e7eb' : '#475569'),
                transition: 'all 0.15s ease',
              })}
            >
              {/* Step Pill */}
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '3px',
                  backgroundColor: isHighContrast ? '#111827' : '#e2e8f0',
                  color: isHighContrast ? '#ffffff' : '#0c2340',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {item.step}
              </div>

              {/* Label & Details */}
              <div style={{ flexGrow: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.3 }}>
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: isHighContrast ? '#9ca3af' : '#64748b',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.stage} • {item.sublabel}
                </div>
              </div>
            </NavLink>
          ))}
        </nav>

        {/* Technical Guidelines Card */}
        <div
          style={{
            padding: '14px',
            borderRadius: '4px',
            backgroundColor: isHighContrast ? '#1f2937' : '#ffffff',
            border: `1px solid ${isHighContrast ? '#4b5563' : '#e2e8f0'}`,
            fontSize: '11.5px',
            lineHeight: 1.5,
            color: isHighContrast ? '#d1d5db' : '#475569',
          }}
        >
          <div style={{ fontWeight: 700, color: isHighContrast ? '#ff9933' : '#0c2340', marginBottom: '4px' }}>
            NCVET-NSQF Protocol
          </div>
          All occupational records and skill gap matrices conform to Ministry of Skill Development
          and Entrepreneurship (MSDE) Level 1–8 qualification standards.
        </div>
      </div>
    </aside>
  );
};
