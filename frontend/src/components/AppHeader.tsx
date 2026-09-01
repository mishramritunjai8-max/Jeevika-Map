import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAccessibility } from '../context/useAccessibility';

interface AppHeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onToggleSidebar,
  isSidebarOpen,
}) => {
  const { isHighContrast } = useAccessibility();
  const location = useLocation();

  const getRouteTitle = () => {
    switch (location.pathname) {
      case '/mapping':
        return 'District Livelihood Mapping';
      case '/profile':
        return 'Beneficiary Profile Assessment';
      case '/opportunities':
        return 'Local District Opportunities';
      case '/recommendations':
        return 'NSQF Skilling Recommendations';
      case '/action-plan':
        return 'PM-AJAY Convergence Action Plan';
      default:
        return 'Application Workspace';
    }
  };

  return (
    <header
      role="banner"
      style={{
        backgroundColor: isHighContrast ? '#111827' : '#ffffff',
        borderBottom: `1px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 90,
        boxShadow: isHighContrast ? 'none' : '0 1px 3px rgba(12, 35, 64, 0.04)',
      }}
    >
      {/* Left: Sidebar Toggle & Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '4px',
            border: `1px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
            backgroundColor: isHighContrast ? '#1f2937' : '#f8fafc',
            color: isHighContrast ? '#ffffff' : '#0c2340',
            cursor: 'pointer',
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
          }}
          title="Return to Public Portal Home"
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '4px',
              border: `1px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
              backgroundColor: isHighContrast ? '#1f2937' : '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2.5px', backgroundColor: '#c2410c' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2.5px', backgroundColor: '#15803d' }} />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isHighContrast ? '#60a5fa' : '#0c2340'} strokeWidth="1.7">
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="2.5" />
              <line x1="12" y1="3" x2="12" y2="9.5" />
              <line x1="12" y1="14.5" x2="12" y2="21" />
              <line x1="3" y1="12" x2="9.5" y2="12" />
              <line x1="14.5" y1="12" x2="21" y2="12" />
            </svg>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '16px', fontWeight: 800, color: isHighContrast ? '#ffffff' : '#0c2340', letterSpacing: '-0.02em' }}>
                जीविका <span style={{ color: isHighContrast ? '#ff9933' : '#c2410c' }}>MAP</span>
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '1px 5px',
                  borderRadius: '2px',
                  backgroundColor: isHighContrast ? '#1e3a8a' : '#eff6ff',
                  color: isHighContrast ? '#bfdbfe' : '#1e3a8a',
                  border: `1px solid ${isHighContrast ? '#60a5fa' : '#bfdbfe'}`,
                }}
              >
                APP
              </span>
            </div>
          </div>
        </Link>

        {/* Separator */}
        <span style={{ color: isHighContrast ? '#4b5563' : '#cbd5e1', fontSize: '14px' }}>/</span>

        {/* Active Module Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13.5px', fontWeight: 600, color: isHighContrast ? '#ffffff' : '#334155' }}>
            {getRouteTitle()}
          </span>
          <span
            className="jm-badge jm-badge-neutral"
            style={{ fontSize: '10px', padding: '1px 6px', display: 'none' }}
            id="desktop-badge"
          >
            PM-AJAY Core
          </span>
        </div>
      </div>

      {/* Right: Operational Status & Back to Portal */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* District Pilot Session Tag */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 10px',
            borderRadius: '4px',
            backgroundColor: isHighContrast ? '#1f2937' : '#f8fafc',
            border: `1px solid ${isHighContrast ? '#374151' : '#e2e8f0'}`,
            fontSize: '11.5px',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#15803d',
              boxShadow: '0 0 0 2px rgba(21, 128, 61, 0.2)',
            }}
          />
          <span style={{ color: isHighContrast ? '#d1d5db' : '#64748b' }}>
            Pilot Desk: <strong>Model Cluster (SC)</strong>
          </span>
        </div>

        {/* Return to Public Landing Page */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12.5px',
            fontWeight: 600,
            color: isHighContrast ? '#ff9933' : '#0c2340',
            textDecoration: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            border: `1px solid ${isHighContrast ? '#ff9933' : '#cbd5e1'}`,
            backgroundColor: isHighContrast ? 'transparent' : '#ffffff',
            transition: 'all 0.15s ease',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Portal Home</span>
        </Link>
      </div>
    </header>
  );
};
