import React, { useState } from 'react';

interface NavbarProps {
  isHighContrast?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isHighContrast = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { labelHi: 'होम', labelEn: 'Home', href: '#hero' },
    { labelHi: 'यह कैसे काम करता है', labelEn: 'How It Works', href: '#how-it-works' },
    { labelHi: 'आजीविका के अवसर', labelEn: 'Livelihood Pathways', href: '#skills' },
    { labelHi: 'पायलट प्रभाव', labelEn: 'Pilot Impact', href: '#impact-stats' },
    { labelHi: 'हमारे बारे में', labelEn: 'About PM-AJAY', href: '#about' },
    { labelHi: 'अधिकारी पोर्टल', labelEn: 'Officer Portal', href: '/officer/login' },
  ];

  return (
    <header
      role="banner"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: isHighContrast ? '#000000' : 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${isHighContrast ? '#ffffff' : '#e2e8f0'}`,
        boxShadow: isHighContrast ? 'none' : '0 2px 4px rgba(15, 23, 42, 0.04)',
      }}
    >
      <div
        className="jm-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px',
        }}
      >
        {/* Brand & Emblem Identity */}
        <a
          href="#hero"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
          }}
          aria-label="Jeevika Map Home"
        >
          {/* Subtle Ashok Chakra-inspired vector emblem badge */}
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '6px',
              border: `1.5px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
              backgroundColor: isHighContrast ? '#111827' : '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isHighContrast ? 'none' : '0 2px 5px rgba(12, 35, 64, 0.08)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Saffron & Green Accent Lines */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                backgroundColor: '#c2410c',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '3px',
                backgroundColor: '#15803d',
              }}
            />
            {/* SVG Ashoka Wheel Insignia */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isHighContrast ? '#60a5fa' : '#0c2340'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="2.5" />
              {/* 12 spokes for clean crisp vector rendering */}
              <line x1="12" y1="3" x2="12" y2="9.5" />
              <line x1="12" y1="14.5" x2="12" y2="21" />
              <line x1="3" y1="12" x2="9.5" y2="12" />
              <line x1="14.5" y1="12" x2="21" y2="12" />
              <line x1="5.64" y1="5.64" x2="10.23" y2="10.23" />
              <line x1="13.77" y1="13.77" x2="18.36" y2="18.36" />
              <line x1="5.64" y1="18.36" x2="10.23" y2="13.77" />
              <line x1="13.77" y1="10.23" x2="18.36" y2="5.64" />
            </svg>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: isHighContrast ? '#ffffff' : '#0c2340',
                }}
              >
                जीविका <span style={{ color: isHighContrast ? '#ff9933' : '#c2410c' }}>MAP</span>
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: '3px',
                  backgroundColor: isHighContrast ? '#1e3a8a' : '#eff6ff',
                  color: isHighContrast ? '#bfdbfe' : '#1e3a8a',
                  border: `1px solid ${isHighContrast ? '#60a5fa' : '#bfdbfe'}`,
                  letterSpacing: '0.04em',
                }}
              >
                PM-AJAY
              </span>
            </div>
            <p
              style={{
                fontSize: '11.5px',
                color: isHighContrast ? '#d1d5db' : '#64748b',
                margin: 0,
                letterSpacing: '0.01em',
                fontWeight: 500,
              }}
            >
              आजीविका एवं एनएसक्यूएफ कौशल पोर्टल / Livelihood Intelligence Portal
            </p>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav
          role="navigation"
          aria-label="Main Navigation"
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '20px',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                fontSize: '13.5px',
                fontWeight: 600,
                color: isHighContrast ? '#f3f4f6' : '#334155',
                padding: '6px 0',
                position: 'relative',
                transition: 'color 0.15s ease',
                textDecoration: 'none',
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                lineHeight: 1.2,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = isHighContrast ? '#ff9933' : '#c2410c';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isHighContrast ? '#f3f4f6' : '#334155';
              }}
            >
              <span>{link.labelHi}</span>
              <span style={{ fontSize: '10px', color: isHighContrast ? '#9ca3af' : '#64748b', fontWeight: 500 }}>
                {link.labelEn}
              </span>
            </a>
          ))}
        </nav>

        {/* Primary CTA & Mobile Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <a
            href="/mapping"
            className="jm-btn jm-btn-primary"
            style={{
              padding: '8px 16px',
              fontSize: '13.5px',
              letterSpacing: '0.01em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>आजीविका मैपिंग शुरू करें / Start Mapping</span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 10h10M11 6l4 4-4 4" />
            </svg>
          </a>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="mobile-menu-toggle"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '4px',
              border: `1px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
              color: isHighContrast ? '#ffffff' : '#0f172a',
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isMobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div
          style={{
            backgroundColor: isHighContrast ? '#121212' : '#ffffff',
            borderBottom: `2px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
            padding: '16px 24px 20px',
          }}
          className="mobile-drawer"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  fontSize: '14.5px',
                  fontWeight: 600,
                  color: isHighContrast ? '#ffffff' : '#1e293b',
                  padding: '8px 0',
                  borderBottom: `1px solid ${isHighContrast ? '#374151' : '#f1f5f9'}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  textDecoration: 'none',
                }}
              >
                <span>{link.labelHi}</span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>{link.labelEn}</span>
              </a>
            ))}
            <div style={{ paddingTop: '8px' }}>
              <a
                href="/mapping"
                onClick={() => setIsMobileMenuOpen(false)}
                className="jm-btn jm-btn-saffron"
                style={{ width: '100%', boxSizing: 'border-box', textAlign: 'center' }}
              >
                आजीविका मैपिंग शुरू करें / Start Livelihood Mapping
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Responsive styles for desktop vs mobile nav */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-toggle {
            display: none !important;
          }
          .mobile-drawer {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
