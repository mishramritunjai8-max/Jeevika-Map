import React from 'react';
import { useTranslation } from '../i18n/useTranslation';

interface ImpactStatsProps {
  isHighContrast?: boolean;
}

export const ImpactStats: React.FC<ImpactStatsProps> = ({ isHighContrast = false }) => {
  const { t } = useTranslation();

  const metrics = [
    {
      metric: t.stat1Num,
      label: t.stat1Label,
      sublabel: t.stat1Sub,
      tag: t.stat1Tag,
    },
    {
      metric: t.stat2Num,
      label: t.stat2Label,
      sublabel: t.stat2Sub,
      tag: t.stat2Tag,
    },
    {
      metric: t.stat3Num,
      label: t.stat3Label,
      sublabel: t.stat3Sub,
      tag: t.stat3Tag,
    },
    {
      metric: t.stat4Num,
      label: t.stat4Label,
      sublabel: t.stat4Sub,
      tag: t.stat4Tag,
    },
  ];

  return (
    <section
      id="impact-stats"
      aria-labelledby="impact-stats-title"
      style={{
        backgroundColor: isHighContrast ? '#000000' : '#ffffff',
        borderBottom: `1px solid ${isHighContrast ? '#ffffff' : '#e2e8f0'}`,
        padding: '64px 0',
      }}
    >
      <div className="jm-container">
        {/* Sample Metrics Disclaimer Alert Banner */}
        <div
          role="note"
          aria-label={t.statNoticeTitle}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '4px',
            backgroundColor: isHighContrast ? '#1f2937' : '#fff7ed',
            border: `1px solid ${isHighContrast ? '#ff9933' : '#fed7aa'}`,
            marginBottom: '36px',
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#c2410c"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0, marginTop: '2px' }}
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div style={{ fontSize: '12.5px', color: isHighContrast ? '#ffedd5' : '#9a3412', lineHeight: 1.5 }}>
            <strong>{t.statNoticeTitle}:</strong> {t.statNoticeDesc}
          </div>
        </div>

        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
          <span className="jm-badge jm-badge-navy" style={{ marginBottom: '10px' }}>
            {t.statBadge}
          </span>
          <h2
            id="impact-stats-title"
            style={{
              fontSize: 'clamp(24px, 3.2vw, 32px)',
              fontWeight: 800,
              color: isHighContrast ? '#ffffff' : '#0c2340',
              marginBottom: '6px',
            }}
          >
            {t.statTitle}
          </h2>
          <div style={{ fontSize: '15px', fontWeight: 600, color: isHighContrast ? '#ff9933' : '#c2410c', marginBottom: '10px' }}>
            {t.statSubtitle}
          </div>
          <p style={{ fontSize: '14.5px', color: isHighContrast ? '#d1d5db' : '#475569', lineHeight: 1.6 }}>
            {t.statDesc}
          </p>
        </div>

        {/* Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
          }}
        >
          {metrics.map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: isHighContrast ? '#111827' : '#f8fafc',
                border: `1px solid ${isHighContrast ? '#374151' : '#e2e8f0'}`,
                borderRadius: '6px',
                padding: '24px 20px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: isHighContrast ? 'none' : '0 1px 3px rgba(0,0,0,0.03)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: '8px',
                }}
              >
                <span
                  style={{
                    fontSize: '34px',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    color: isHighContrast ? '#ff9933' : '#0c2340',
                    lineHeight: 1,
                  }}
                >
                  {item.metric}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    color: isHighContrast ? '#9ca3af' : '#64748b',
                    letterSpacing: '0.04em',
                  }}
                >
                  {item.tag}
                </span>
              </div>

              <h2
                style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: isHighContrast ? '#ffffff' : '#1e293b',
                  marginBottom: '6px',
                }}
              >
                {item.label}
              </h2>

              <p
                style={{
                  fontSize: '12.5px',
                  lineHeight: 1.5,
                  color: isHighContrast ? '#d1d5db' : '#64748b',
                  margin: 0,
                }}
              >
                {item.sublabel}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
