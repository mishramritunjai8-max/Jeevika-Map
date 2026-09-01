import React from 'react';

interface ImpactStatsProps {
  isHighContrast?: boolean;
}

export const ImpactStats: React.FC<ImpactStatsProps> = ({ isHighContrast = false }) => {
  const metrics = [
    {
      metric: '12+',
      label: 'Pilot Districts Mapped',
      sublabel: 'Sample cluster zones across UP, Rajasthan, MP, Bihar & Tamil Nadu',
      tag: 'Simulation Prototype',
    },
    {
      metric: '180+',
      label: 'NSQF Job Roles Indexed',
      sublabel: 'Accredited Qualification Packs matched across 14 Sector Skill Councils',
      tag: 'NCVET NOS Matrix',
    },
    {
      metric: '3.1x',
      label: 'Average Income Delta',
      sublabel: 'Simulated household uplift comparing unorganized wages with certified enterprise',
      tag: 'Projected Model',
    },
    {
      metric: '100%',
      label: 'Voice & Dialect Target',
      sublabel: 'Grassroots interface designed for vernacular field enumerator voice interactions',
      tag: 'Inclusion Standard',
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
          aria-label="Simulation Notice"
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
            <strong>Demonstration & Pilot Projections Notice:</strong> The values presented below represent
            modeled demonstration and pilot projections for system architecture verification. They are clearly
            marked as sample targets and must <em>not</em> be cited as official census or audited Ministry of Social
            Justice & Empowerment statistics.
          </div>
        </div>

        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
          <span className="jm-badge jm-badge-navy" style={{ marginBottom: '10px' }}>
            Pilot Scope & Modeling
          </span>
          <h2
            id="impact-stats-title"
            style={{
              fontSize: 'clamp(24px, 3.2vw, 32px)',
              fontWeight: 800,
              color: isHighContrast ? '#ffffff' : '#0c2340',
              marginBottom: '10px',
            }}
          >
            Anticipated Impact in Pilot Clusters
          </h2>
          <p style={{ fontSize: '14.5px', color: isHighContrast ? '#d1d5db' : '#475569', lineHeight: 1.6 }}>
            Designed to bridge the structural gap between decentralized SC artisan talent and
            formal industrial demand under PM-AJAY.
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
                    textTransform: 'uppercase',
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
