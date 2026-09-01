import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAccessibility } from '../../context/useAccessibility';

interface OfficerSidebarProps {
  isOpen: boolean;
  onCloseMobile?: () => void;
}

export const OfficerSidebar: React.FC<OfficerSidebarProps> = ({ isOpen, onCloseMobile }) => {
  const { isHighContrast } = useAccessibility();

  const navItems = [
    {
      to: '/officer',
      end: true,
      label: 'Dashboard Overview',
      hindiLabel: 'डैशबोर्ड अवलोकन',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9" />
          <rect x="14" y="3" width="7" height="5" />
          <rect x="14" y="12" width="7" height="9" />
          <rect x="3" y="16" width="7" height="5" />
        </svg>
      ),
    },
    {
      to: '/officer/beneficiaries',
      end: false,
      label: 'Beneficiary Registry',
      hindiLabel: 'लाभार्थी पंजीयन सूची',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      to: '/officer/beneficiaries?filter=profiles',
      end: false,
      label: 'Livelihood Profiles',
      hindiLabel: 'आजीविका प्रोफाइल मूल्यांकन',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
          <line x1="8" y1="2" x2="8" y2="18" />
          <line x1="16" y1="6" x2="16" y2="22" />
        </svg>
      ),
    },
    {
      to: '/officer/beneficiaries?filter=recommendations',
      end: false,
      label: 'Recommendations',
      hindiLabel: 'कौशल अनुशंसाएं (NSQF)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      ),
    },
    {
      to: '/officer/beneficiaries?filter=action-plans',
      end: false,
      label: 'Action Plans',
      hindiLabel: 'अभिसरण कार्ययोजनाएं',
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
    {
      to: '/officer?view=reports',
      end: false,
      label: 'Reports & Analytics',
      hindiLabel: 'सांख्यिकी एवं रिपोर्ट',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
    {
      to: '/officer?view=settings',
      end: false,
      label: 'Governance & Settings',
      hindiLabel: 'प्रणाली सेटिंग्स एवं RLS',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
  ];

  return (
    <aside
      aria-label="Officer Workspace Navigation"
      style={{
        width: isOpen ? '260px' : '0px',
        minWidth: isOpen ? '260px' : '0px',
        transition: 'width 0.2s ease, min-width 0.2s ease',
        overflow: 'hidden',
        backgroundColor: isHighContrast ? '#0a0a0a' : '#f8fafc',
        borderRight: `1px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 70px)',
        position: 'sticky',
        top: '70px',
        zIndex: 80,
      }}
    >
      <div style={{ padding: '16px 14px', borderBottom: `1px solid ${isHighContrast ? '#374151' : '#e2e8f0'}` }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: isHighContrast ? '#9ca3af' : '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Operations & Verification
        </div>
        <div style={{ fontSize: '12.5px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0c2340', marginTop: '2px' }}>
          District Monitoring Module
        </div>
      </div>

      <nav style={{ flexGrow: 1, padding: '10px 8px', overflowY: 'auto' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                onClick={onCloseMobile}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 500,
                  backgroundColor: isActive
                    ? (isHighContrast ? '#1f2937' : '#e2e8f0')
                    : 'transparent',
                  color: isActive
                    ? (isHighContrast ? '#ff9933' : '#0c2340')
                    : (isHighContrast ? '#d1d5db' : '#334155'),
                  borderLeft: isActive
                    ? `4px solid ${isHighContrast ? '#ff9933' : '#c2410c'}`
                    : '4px solid transparent',
                  transition: 'background-color 0.15s ease',
                })}
              >
                <div style={{ flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <div style={{ lineHeight: 1.2 }}>{item.label}</div>
                  <div style={{ fontSize: '10.5px', opacity: 0.75, marginTop: '2px' }}>
                    {item.hindiLabel}
                  </div>
                </div>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Officer Security Status Strip */}
      <div
        style={{
          padding: '14px',
          borderTop: `1px solid ${isHighContrast ? '#374151' : '#e2e8f0'}`,
          backgroundColor: isHighContrast ? '#111827' : '#ffffff',
          fontSize: '11px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#15803d', fontWeight: 700, marginBottom: '2px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#15803d' }} />
          Database Active: Supabase v17
        </div>
        <div style={{ color: isHighContrast ? '#9ca3af' : '#64748b' }}>
          RLS Default-Deny Enforced
        </div>
      </div>
    </aside>
  );
};
