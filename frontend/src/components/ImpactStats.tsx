import React from 'react';

interface ImpactStatsProps {
  isHighContrast?: boolean;
}

export const ImpactStats: React.FC<ImpactStatsProps> = ({ isHighContrast = false }) => {
  const metrics = [
    {
      metric: '12+',
      labelHi: 'पायलट जिले मानचित्रित',
      labelEn: 'Pilot Districts Mapped',
      sublabel: 'यूपी, राजस्थान, एमपी, बिहार एवं तमिलनाडु के प्रमुख क्लस्टर क्षेत्र',
      tag: 'पायलट मॉडल (Pilot Model)',
    },
    {
      metric: '180+',
      labelHi: 'एनएसक्यूएफ जॉब रोल सूचीबद्ध',
      labelEn: 'NSQF Job Roles Indexed',
      sublabel: '14 सेक्टर स्किल काउंसिलों में मान्यता प्राप्त क्वालिफिकेशन पैक (QP-NOS)',
      tag: 'एनसीवीईटी मानक (NCVET)',
    },
    {
      metric: '3.1x',
      labelHi: 'औसत आय वृद्धि अनुमान',
      labelEn: 'Average Income Delta',
      sublabel: 'असंगठित मजदूरी की तुलना में प्रमाणित कारीगर उद्यम से अनुमानित पारिवारिक आय',
      tag: 'प्रक्षेपित मॉडल (Projected)',
    },
    {
      metric: '100%',
      labelHi: 'आवाज एवं मातृभाषा सुविधा',
      labelEn: 'Voice & Vernacular Target',
      sublabel: 'जमीनी प्रगणकों एवं नागरिकों हेतु सहज हिंदी एवं आवाज आधारित इनपुट',
      tag: 'समावेशन मानक (Inclusion)',
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
            <strong>प्रदर्शन एवं पायलट प्रक्षेपण सूचना (Pilot Modeling Notice):</strong> नीचे प्रस्तुत मूल्य
            प्रणाली सत्यापन हेतु मॉडल किए गए पायलट प्रक्षेपण हैं। इन्हें आधिकारिक जनगणना या सामाजिक न्याय एवं
            अधिकारिता मंत्रालय के अंतिम लेखापरीक्षित आंकड़े न माना जाए।
          </div>
        </div>

        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
          <span className="jm-badge jm-badge-navy" style={{ marginBottom: '10px' }}>
            पायलट दायरा एवं प्रभाव / Pilot Scope & Modeling
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
            पायलट क्लस्टर में संभावित प्रभाव
          </h2>
          <div style={{ fontSize: '15px', fontWeight: 600, color: isHighContrast ? '#ff9933' : '#c2410c', marginBottom: '10px' }}>
            Anticipated Impact in Pilot Clusters
          </div>
          <p style={{ fontSize: '14.5px', color: isHighContrast ? '#d1d5db' : '#475569', lineHeight: 1.6 }}>
            पीएम-अजय अंतर्गत अनुसूचित जाति (SC) समुदाय के हुनरमंद कारीगरों एवं युवाओं को
            औपचारिक औद्योगिक मांग से जोड़ने हेतु तैयार किया गया मॉडल।
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
                  marginBottom: '2px',
                }}
              >
                {item.labelHi}
              </h2>
              <div
                style={{
                  fontSize: '11.5px',
                  color: isHighContrast ? '#9ca3af' : '#64748b',
                  fontWeight: 600,
                  marginBottom: '6px',
                }}
              >
                {item.labelEn}
              </div>

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
