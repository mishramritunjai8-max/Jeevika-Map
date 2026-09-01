import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAccessibility } from '../../context/useAccessibility';
import { useOfficerAuth } from '../../context/useOfficerAuth';

interface OfficerHeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const OfficerHeader: React.FC<OfficerHeaderProps> = ({
  onToggleSidebar,
  isSidebarOpen,
}) => {
  const { isHighContrast } = useAccessibility();
  const { user, signOut } = useOfficerAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/officer/login', { replace: true });
  };


  return (
    <header
      role="banner"
      style={{
        backgroundColor: isHighContrast ? '#111827' : '#0c2340',
        color: '#ffffff',
        borderBottom: `2px solid ${isHighContrast ? '#ffffff' : '#c2410c'}`,
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 90,
        boxShadow: isHighContrast ? 'none' : '0 2px 8px rgba(12, 35, 64, 0.15)',
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
            border: `1px solid ${isHighContrast ? '#ffffff' : 'rgba(255, 255, 255, 0.2)'}`,
            backgroundColor: isHighContrast ? '#1f2937' : 'rgba(255, 255, 255, 0.08)',
            color: '#ffffff',
            cursor: 'pointer',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <Link
          to="/officer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            color: '#ffffff',
          }}
          title="Jeevika Map Officer Command Center"
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '4px',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: '#c2410c' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', backgroundColor: '#15803d' }} />
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0c2340" strokeWidth="1.8">
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="2.5" />
              <line x1="12" y1="3" x2="12" y2="9.5" />
              <line x1="12" y1="14.5" x2="12" y2="21" />
              <line x1="3" y1="12" x2="9.5" y2="12" />
              <line x1="14.5" y1="12" x2="21" y2="12" />
            </svg>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff' }}>
                Jeevika <span style={{ color: '#ff9933' }}>Map</span>
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: '2px',
                  backgroundColor: '#c2410c',
                  color: '#ffffff',
                  letterSpacing: '0.04em',
                }}
              >
                OFFICER
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#93c5fd', fontWeight: 500, letterSpacing: '0.01em' }}>
              AI-Driven Livelihood Mapping & Skilling Recommendation Platform • PM-AJAY / GIA
            </div>
          </div>
        </Link>
      </div>

      {/* Right: Officer Profile, Role Indicator & Citizen Portal Switch */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Officer Role Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '6px 12px',
            borderRadius: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#15803d',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '12px',
            }}
          >
            {user?.email ? user.email.slice(0, 2).toUpperCase() : 'NO'}
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff' }}>
              {user?.email ? user.email.split('@')[0] : 'District Nodal Officer'}
            </div>
            <div style={{ fontSize: '10px', color: '#93c5fd' }}>
              {user?.email || 'PM-AJAY Welfare Mission Directorate'}
            </div>
          </div>
        </div>

        {/* Switch to Beneficiary / Citizen Portal */}
        <Link
          to="/mapping"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '4px',
            backgroundColor: '#ffffff',
            color: '#0c2340',
            fontSize: '12px',
            fontWeight: 700,
            textDecoration: 'none',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
          title="Switch to citizen-facing mapping wizard"
        >
          <span>Citizen Portal</span>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 10h10M11 6l4 4-4 4" />
          </svg>
        </Link>

        {/* Logout Action */}
        <button
          type="button"
          onClick={handleSignOut}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '4px',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            color: '#fca5a5',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          title="Sign out of officer command console"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>लॉग आउट / Sign Out</span>
        </button>
      </div>
    </header>
  );
};
