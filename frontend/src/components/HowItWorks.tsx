import React from 'react';

interface HowItWorksProps {
  isHighContrast?: boolean;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ isHighContrast = false }) => {
  const steps = [
    {
      num: '01',
      stageHi: 'खोजें',
      stageEn: 'Discover',
      taglineHi: 'परिवार एवं क्लस्टर सर्वेक्षण',
      taglineEn: 'Household & Cluster Profiling',
      description:
        'जमीनी प्रगणक एवं सामुदायिक मित्र सामाजिक-आर्थिक स्थिति, पारंपरिक हुनर, कार्य अनुभव और घरेलू आजीविका संसाधनों का प्रामाणिक विवरण एकत्र करते हैं।',
      meta: 'सामाजिक-आर्थिक आधार • क्लस्टर जियो-टैगिंग (Geo-Tagging)',
      badgeClass: 'jm-badge-neutral',
    },
    {
      num: '02',
      stageHi: 'समझें',
      stageEn: 'Understand',
      taglineHi: 'कौशल एवं बाजार मांग विश्लेषण',
      taglineEn: 'Competency & Demand Synthesis',
      description:
        'प्लेटफॉर्म व्यावहारिक कार्य अनुभव का औपचारिक कौशल मानकों से मिलान करता है और जिले के औद्योगिक क्लस्टर, कच्चे माल एवं स्थानीय रोजगार मांग का विश्लेषण करता है।',
      meta: 'पूर्व अनुभव की मान्यता (RPL) मूल्यांकन',
      badgeClass: 'jm-badge-navy',
    },
    {
      num: '03',
      stageHi: 'अनुशंसा',
      stageEn: 'Recommend',
      taglineHi: 'एनएसक्यूएफ कौशल मार्ग निर्धारण',
      taglineEn: 'NSQF-Aligned Trajectory',
      description:
        'व्यक्तिगत प्रोफाइल के आधार पर प्रमाणित एनएसक्यूएफ योग्यता पैक (QP-NOS) सुझाए जाते हैं, जिससे कम अवधि के ब्रिज-प्रशिक्षण द्वारा आय क्षमता में स्थायी वृद्धि हो सके।',
      meta: 'राष्ट्रीय कौशल मैट्रिक्स • QP-NOS मैचिंग',
      badgeClass: 'jm-badge-saffron',
    },
    {
      num: '04',
      stageHi: 'कार्य योजना',
      stageEn: 'Act',
      taglineHi: 'पीएम-अजय अनुदान एवं योजना जुड़ाव',
      taglineEn: 'Convergence & Scheme Linkage',
      description:
        'पीएम-अजय वित्तीय सहायता, आधुनिक टूलकिट हेतु पूंजीगत सब्सिडी, मान्यता प्राप्त प्रशिक्षण केंद्रों में निःशुल्क नामांकन एवं स्वयं सहायता समूह (SHG) उद्यम से सीधा जुड़ाव।',
      meta: 'पीएम-अजय पूंजीगत सब्सिडी • प्रमाणित नामांकन',
      badgeClass: 'jm-badge-green',
    },
  ];

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-title"
      style={{
        backgroundColor: isHighContrast ? '#000000' : '#ffffff',
        borderBottom: `1px solid ${isHighContrast ? '#ffffff' : '#e2e8f0'}`,
        padding: '72px 0',
      }}
    >
      <div className="jm-container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
          <span className="jm-badge jm-badge-saffron" style={{ marginBottom: '10px' }}>
            कार्यप्रणाली / Operational Methodology
          </span>
          <h2
            id="how-it-works-title"
            style={{
              fontSize: 'clamp(24px, 3.2vw, 32px)',
              fontWeight: 800,
              color: isHighContrast ? '#ffffff' : '#0c2340',
              marginBottom: '6px',
            }}
          >
            जीविका मैप कैसे काम करता है
          </h2>
          <div style={{ fontSize: '15px', fontWeight: 600, color: isHighContrast ? '#ff9933' : '#c2410c', marginBottom: '10px' }}>
            How Jeevika Map Operates (4-Stage Progression)
          </div>
          <p
            style={{
              fontSize: '15px',
              color: isHighContrast ? '#d1d5db' : '#475569',
              lineHeight: 1.6,
            }}
          >
            एक सरल चार-चरणीय प्रमाण-आधारित प्रक्रिया जो जमीनी कौशल को मान्यता प्राप्त प्रमाणन,
            स्थानीय उद्यम एवं पीएम-अजय प्रत्यक्ष सरकारी सहायता से जोड़ती है।
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            position: 'relative',
          }}
          className="steps-grid"
        >
          {steps.map((step, index) => (
            <div
              key={index}
              style={{
                backgroundColor: isHighContrast ? '#111827' : '#ffffff',
                border: `1px solid ${isHighContrast ? '#374151' : '#e2e8f0'}`,
                borderRadius: '6px',
                padding: '24px 20px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                boxShadow: isHighContrast ? 'none' : '0 2px 4px rgba(15, 23, 42, 0.03)',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!isHighContrast) {
                  e.currentTarget.style.borderColor = '#0c2340';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isHighContrast) {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {/* Step Number & Connector Indicator */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '4px',
                    backgroundColor: isHighContrast ? '#1e293b' : '#0c2340',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '14px',
                    letterSpacing: '0.02em',
                  }}
                >
                  {step.num}
                </div>
                <span className={`jm-badge ${step.badgeClass}`} style={{ fontSize: '10.5px' }}>
                  चरण {index + 1} (Stage {index + 1})
                </span>
              </div>

              {/* Stage Title */}
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: 800,
                  color: isHighContrast ? '#ffffff' : '#0c2340',
                  marginBottom: '2px',
                }}
              >
                {step.stageHi} <span style={{ fontSize: '14px', fontWeight: 600, color: isHighContrast ? '#9ca3af' : '#64748b' }}>({step.stageEn})</span>
              </h2>
              <div
                style={{
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: isHighContrast ? '#ff9933' : '#c2410c',
                  marginBottom: '12px',
                }}
              >
                {step.taglineHi}
                <div style={{ fontSize: '11px', color: isHighContrast ? '#d1d5db' : '#64748b', fontWeight: 500 }}>
                  {step.taglineEn}
                </div>
              </div>

              {/* Description */}
              <p
                style={{
                  fontSize: '13px',
                  lineHeight: 1.55,
                  color: isHighContrast ? '#e5e7eb' : '#475569',
                  marginBottom: '18px',
                  flexGrow: 1,
                }}
              >
                {step.description}
              </p>

              {/* Technical Meta Tag */}
              <div
                style={{
                  borderTop: `1px solid ${isHighContrast ? '#374151' : '#f1f5f9'}`,
                  paddingTop: '12px',
                  fontSize: '11px',
                  color: isHighContrast ? '#9ca3af' : '#64748b',
                  fontWeight: 500,
                }}
              >
                {step.meta}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
