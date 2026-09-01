import React from 'react';

interface TrustStripProps {
  isHighContrast?: boolean;
}

export const TrustStrip: React.FC<TrustStripProps> = ({ isHighContrast = false }) => {
  const pillars = [
    {
      badge: 'Mandate',
      title: 'PM-AJAY Convergence',
      description:
        'Targeted upliftment framework under the Ministry of Social Justice & Empowerment for SC household livelihood enhancement.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      accentColor: '#c2410c',
    },
    {
      badge: 'Intelligence',
      title: 'District Livelihood Mapping',
      description:
        'Granular mapping of localized resource clusters, raw materials, traditional skills, and real market absorption capacity.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
          <line x1="8" y1="2" x2="8" y2="18" />
          <line x1="16" y1="6" x2="16" y2="22" />
        </svg>
      ),
      accentColor: '#0c2340',
    },
    {
      badge: 'Standardization',
      title: 'NCVET / NSQF Alignment',
      description:
        'All job roles mapped directly to official National Skill Qualification Framework levels (Level 1 to Level 8) with recognized certifications.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
      accentColor: '#15803d',
    },
    {
      badge: 'Inclusion',
      title: 'Multilingual & Voice First',
      description:
        'Built for grassroots field enumerators and first-generation learners, supporting local dialects and voice-based data collection.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      ),
      accentColor: '#0c2340',
    },
  ];

  return (
    <section
      id="about"
      aria-label="Institutional Framework and Principles"
      style={{
        backgroundColor: isHighContrast ? '#111827' : '#f8fafc',
        borderBottom: `1px solid ${isHighContrast ? '#ffffff' : '#e2e8f0'}`,
        padding: '36px 0',
      }}
    >
      <div className="jm-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
          }}
        >
          {pillars.map((item, index) => (
            <div
              key={index}
              style={{
                backgroundColor: isHighContrast ? '#1f2937' : '#ffffff',
                border: `1px solid ${isHighContrast ? '#4b5563' : '#e2e8f0'}`,
                borderRadius: '6px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: isHighContrast ? 'none' : '0 1px 3px rgba(0,0,0,0.04)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '14px',
                }}
              >
                <span
                  style={{
                    color: isHighContrast ? '#ff9933' : item.accentColor,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {item.icon}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: isHighContrast ? '#d1d5db' : '#64748b',
                  }}
                >
                  {item.badge}
                </span>
              </div>

              <h2
                style={{
                  fontSize: '15.5px',
                  fontWeight: 700,
                  color: isHighContrast ? '#ffffff' : '#0c2340',
                  marginBottom: '8px',
                }}
              >
                {item.title}
              </h2>

              <p
                style={{
                  fontSize: '13px',
                  lineHeight: 1.5,
                  color: isHighContrast ? '#e5e7eb' : '#475569',
                  margin: 0,
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
