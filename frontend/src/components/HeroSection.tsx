import React, { useState } from 'react';

interface HeroSectionProps {
  isHighContrast?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ isHighContrast = false }) => {
  // Gentle interactive 3D tilt state
  const [tilt, setTilt] = useState({ rotateX: 6, rotateY: -8 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Restrained, subtle angles (max ±7 deg)
    const rotateY = parseFloat((x / 30).toFixed(2));
    const rotateX = parseFloat((-y / 30).toFixed(2));
    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 6, rotateY: -8 });
  };

  // Pre-calculated 24 spokes for the Ashoka Chakra (360 / 24 = 15 deg per spoke)
  const chakraSpokes = Array.from({ length: 24 }, (_, i) => i * 15);

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      style={{
        position: 'relative',
        backgroundColor: isHighContrast ? '#000000' : '#ffffff',
        borderBottom: `1px solid ${isHighContrast ? '#ffffff' : '#e2e8f0'}`,
        overflow: 'hidden',
        paddingTop: '48px',
        paddingBottom: '64px',
      }}
    >
      {/* Subtle Ashoka Chakra Geometric Vector Background */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          right: '-120px',
          transform: 'translateY(-50%)',
          width: '680px',
          height: '680px',
          pointerEvents: 'none',
          opacity: isHighContrast ? 0.08 : 0.038,
          zIndex: 0,
        }}
      >
        <svg
          viewBox="0 0 400 400"
          width="100%"
          height="100%"
          style={{
            animation: 'slowChakraRotate 120s linear infinite',
            transformOrigin: 'center center',
          }}
        >
          {/* Concentric rings */}
          <circle cx="200" cy="200" r="190" fill="none" stroke="#0c2340" strokeWidth="2.5" />
          <circle cx="200" cy="200" r="172" fill="none" stroke="#0c2340" strokeWidth="1.5" strokeDasharray="3, 5" />
          <circle cx="200" cy="200" r="120" fill="none" stroke="#0c2340" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="50" fill="none" stroke="#0c2340" strokeWidth="3" />
          <circle cx="200" cy="200" r="16" fill="#0c2340" />

          {/* 24 spokes */}
          {chakraSpokes.map((angle) => (
            <g key={angle} transform={`rotate(${angle} 200 200)`}>
              <line x1="200" y1="50" x2="200" y2="184" stroke="#0c2340" strokeWidth="2" />
              <circle cx="200" cy="54" r="3.5" fill="#0c2340" />
            </g>
          ))}
        </svg>
      </div>

      <div className="jm-container" style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.85fr)',
            gap: '48px',
            alignItems: 'center',
          }}
          className="hero-grid"
        >
          {/* Left Column: Narrative, Mandate & Primary CTAs */}
          <div>
            {/* Government Convergence Flag Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '5px 12px 5px 6px',
                borderRadius: '4px',
                border: `1px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
                backgroundColor: isHighContrast ? '#111827' : '#f8fafc',
                marginBottom: '20px',
              }}
            >
              {/* Official Indian Flag Vector (Accurate 3:2 Ratio with 24-spoke Ashoka Chakra) */}
              <div
                title="National Flag of India"
                aria-label="National Flag of India"
                role="img"
                style={{
                  width: '30px',
                  height: '20px',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
                  display: 'flex',
                  flexDirection: 'column',
                  flexShrink: 0,
                  border: '0.5px solid rgba(0,0,0,0.15)',
                }}
              >
                {/* Saffron Band */}
                <div style={{ flex: 1, backgroundColor: '#FF9933' }} />
                {/* White Band with Navy Chakra */}
                <div
                  style={{
                    flex: 1,
                    backgroundColor: '#FFFFFF',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg
                    viewBox="0 0 100 100"
                    width="6.2px"
                    height="6.2px"
                    style={{ display: 'block' }}
                  >
                    <circle cx="50" cy="50" r="46" fill="none" stroke="#000080" strokeWidth="7" />
                    <circle cx="50" cy="50" r="10" fill="#000080" />
                    {chakraSpokes.map((deg) => (
                      <line
                        key={deg}
                        x1="50"
                        y1="50"
                        x2="50"
                        y2="6"
                        stroke="#000080"
                        strokeWidth="3.5"
                        transform={`rotate(${deg} 50 50)`}
                      />
                    ))}
                  </svg>
                </div>
                {/* Green Band */}
                <div style={{ flex: 1, backgroundColor: '#138808' }} />
              </div>

              <span
                style={{
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: isHighContrast ? '#ff9933' : '#0c2340',
                  letterSpacing: '0.01em',
                }}
              >
                पीएम-अजय आजीविका अभिसरण एवं एनएसक्यूएफ कौशल • PM-AJAY Livelihood Intelligence
              </span>
            </div>

            {/* Main Official Headline */}
            <h1
              id="hero-title"
              style={{
                fontSize: 'clamp(28px, 4vw, 42px)',
                lineHeight: 1.2,
                fontWeight: 800,
                color: isHighContrast ? '#ffffff' : '#0c2340',
                marginBottom: '18px',
                letterSpacing: '-0.025em',
              }}
            >
              अपनी आजीविका का सही रास्ता खोजें। <br />
              <span style={{ color: isHighContrast ? '#ff9933' : '#c2410c' }}>
                एनएसक्यूएफ प्रमाणित कौशल से जुड़ें।
              </span>
              <span
                style={{
                  display: 'block',
                  fontSize: 'clamp(15px, 2vw, 19px)',
                  fontWeight: 600,
                  color: isHighContrast ? '#9ca3af' : '#64748b',
                  marginTop: '6px',
                  letterSpacing: '0',
                }}
              >
                Find the right livelihood pathway • NSQF Skilling Trajectories
              </span>
            </h1>

            {/* Clear, Respectful Public Sector Explanation */}
            <p
              style={{
                fontSize: '15.5px',
                lineHeight: 1.65,
                color: isHighContrast ? '#e2e8f0' : '#334155',
                marginBottom: '28px',
                maxWidth: '580px',
              }}
            >
              <strong>जीविका मैप (Jeevika Map)</strong> अनुसूचित जाति (SC) समुदाय के हुनरमंद कारीगरों,
              श्रमिकों एवं युवाओं हेतु <strong>पीएम-अजय (PM-AJAY)</strong> अंतर्गत एक बुद्धिमान आजीविका
              मार्गदर्शन मंच है। यह आपके पारंपरिक हुनर, स्थानीय जिले की औद्योगिक मांग एवं व्यावहारिक अनुभव का
              मूल्यांकन कर प्रमाणित आय के स्थायी अवसर तैयार करता है।
            </p>

            {/* Action Group */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '14px',
                marginBottom: '32px',
              }}
            >
              <a
                href="/mapping"
                className="jm-btn jm-btn-primary"
                style={{
                  padding: '12px 24px',
                  fontSize: '15px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>आजीविका मैपिंग शुरू करें (Start Mapping)</span>
                <svg
                  width="16"
                  height="16"
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

              <a
                href="#how-it-works"
                className="jm-btn jm-btn-secondary"
                style={{
                  padding: '12px 22px',
                  fontSize: '15px',
                }}
              >
                <span>यह कैसे काम करता है (How It Works)</span>
              </a>
            </div>

            {/* Micro Pillars Strip */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '18px',
                paddingTop: '16px',
                borderTop: `1px solid ${isHighContrast ? '#ffffff' : '#e2e8f0'}`,
                fontSize: '13px',
                color: isHighContrast ? '#d1d5db' : '#64748b',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={isHighContrast ? '#22c55e' : '#15803d'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>एनसीवीईटी / एनएसक्यूएफ मानक (NCVET NSQF)</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={isHighContrast ? '#22c55e' : '#15803d'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>जिला मांग आधारित (District Demand)</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={isHighContrast ? '#22c55e' : '#15803d'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>पीएम-अजय प्रत्यक्ष अनुदान (PM-AJAY Grant)</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Depth Isometric Representation (Mapping + Data + Human Livelihood) */}
          <div
            className="perspective-stage"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px 10px',
            }}
          >
            <div
              className="card-3d-deck"
              style={{
                width: '100%',
                maxWidth: '430px',
                position: 'relative',
                transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
                transformOrigin: 'center center',
              }}
            >
              {/* Layer 1 (Base/Back Layer): District Geospatial & Market Demand Grid */}
              <div
                style={{
                  backgroundColor: isHighContrast ? '#18181b' : '#f8fafc',
                  border: `1px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
                  borderRadius: '8px',
                  padding: '16px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.06)',
                  marginBottom: '-40px',
                  transform: 'translateZ(-30px) scale(0.93)',
                  opacity: 0.85,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em' }}>
                    स्तर 01 • जिला बाजार ग्रिड (District Market Grid)
                  </span>
                  <span style={{ fontSize: '11px', color: '#15803d', fontWeight: 600 }}>● सक्रिय क्लस्टर (Active)</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#334155' }}>
                  <div style={{ flex: 1, backgroundColor: isHighContrast ? '#27272a' : '#ffffff', padding: '8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>कच्चा माल / Raw Material</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>रेशम एवं कृषि केंद्र (Silk & Agro)</div>
                  </div>
                  <div style={{ flex: 1, backgroundColor: isHighContrast ? '#27272a' : '#ffffff', padding: '8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>स्थानीय मांग / Demand</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>उच्च खपत (High Absorption)</div>
                  </div>
                </div>
              </div>

              {/* Layer 2 (Middle Layer): Beneficiary Informal Profile & Skills */}
              <div
                style={{
                  backgroundColor: isHighContrast ? '#1f2937' : '#ffffff',
                  border: `1.5px solid ${isHighContrast ? '#ff9933' : '#fed7aa'}`,
                  borderRadius: '8px',
                  padding: '18px',
                  boxShadow: isHighContrast ? 'none' : '0 10px 18px -4px rgba(12, 35, 64, 0.08)',
                  marginBottom: '-32px',
                  transform: 'translateZ(10px) scale(0.97)',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    स्तर 02 • लाभार्थी आजीविका प्रोफाइल (Beneficiary Profile)
                  </span>
                  <span className="jm-badge jm-badge-saffron" style={{ fontSize: '10px', padding: '2px 6px' }}>
                    सत्यापित SC परिवार
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: isHighContrast ? '#374151' : '#eff6ff',
                      color: '#1e3a8a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '14px',
                      border: '1px solid #bfdbfe',
                    }}
                  >
                    RK
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13.5px', color: isHighContrast ? '#ffffff' : '#0f172a' }}>
                      राजेश कुमार (आयु 34 वर्ष) / Rajesh Kumar
                    </div>
                    <div style={{ fontSize: '12px', color: isHighContrast ? '#d1d5db' : '#64748b' }}>
                      पारंपरिक हथकरघा कारीगर • 9 वर्ष का अनुभव (9 Yrs Exp)
                    </div>
                  </div>
                </div>
              </div>

              {/* Layer 3 (Top / Elevated Layer): NSQF Aligned Recommendation & PM-AJAY Linkage */}
              <div
                style={{
                  backgroundColor: isHighContrast ? '#111827' : '#ffffff',
                  border: `2px solid ${isHighContrast ? '#ffffff' : '#0c2340'}`,
                  borderRadius: '8px',
                  padding: '20px',
                  boxShadow: isHighContrast
                    ? '0 0 0 2px #ffffff'
                    : '0 24px 38px -12px rgba(12, 35, 64, 0.16), 0 8px 16px -4px rgba(12, 35, 64, 0.08)',
                  transform: 'translateZ(45px)',
                  position: 'relative',
                  zIndex: 3,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <span className="jm-badge jm-badge-green" style={{ marginBottom: '6px' }}>
                      अनुशंसित आजीविका मार्ग / Recommended Pathway
                    </span>
                    <h2
                      style={{
                        fontSize: '16px',
                        fontWeight: 800,
                        color: isHighContrast ? '#ffffff' : '#0c2340',
                        marginTop: '4px',
                      }}
                    >
                      मास्टर जैकार्ड बुनकर एवं सीएडी डिजाइनर (Master Jacquard Weaver)
                    </h2>
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '10px',
                    margin: '14px 0',
                    padding: '12px',
                    backgroundColor: isHighContrast ? '#1f2937' : '#f8fafc',
                    borderRadius: '6px',
                    border: `1px solid ${isHighContrast ? '#374151' : '#e2e8f0'}`,
                    fontSize: '12px',
                  }}
                >
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '10.5px' }}>एनएसक्यूएफ लेवल / LEVEL</span>
                    <strong style={{ color: isHighContrast ? '#ffffff' : '#0f172a', fontSize: '13px' }}>
                      Level 4 (प्रमाणित)
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '10.5px' }}>योजना सहायता / SCHEME</span>
                    <strong style={{ color: '#c2410c', fontSize: '13px' }}>
                      PM-AJAY टूलकिट अनुदान
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '10.5px' }}>अनुमानित मासिक आय / INCOME</span>
                    <strong style={{ color: '#15803d', fontSize: '13px' }}>
                      ₹24,000 – ₹32,000 / माह
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '10.5px' }}>प्रशिक्षण केंद्र / TRAINING HUB</span>
                    <strong style={{ color: isHighContrast ? '#ffffff' : '#0f172a', fontSize: '13px' }}>
                      वाराणसी क्लस्टर सेंटर
                    </strong>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '11px',
                    color: isHighContrast ? '#9ca3af' : '#64748b',
                    paddingTop: '6px',
                  }}
                >
                  <span>QP-NOS कोड: TSC/Q7303</span>
                  <span style={{ color: '#15803d', fontWeight: 600 }}>98% अनुकूलता (Match)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded CSS for 3D and responsive grid */}
      <style>{`
        @keyframes slowChakraRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 960px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
};
