import React from 'react';
import { useTranslation } from '../i18n/useTranslation';

interface HeroSectionProps {
  isHighContrast?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ isHighContrast = false }) => {
  const { t } = useTranslation();
  // Pre-calculated 24 spokes for the Ashoka Chakra (360 / 24 = 15 deg per spoke)
  const chakraSpokes = Array.from({ length: 24 }, (_, i) => i * 15);

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      style={{
        position: 'relative',
        backgroundColor: isHighContrast ? '#000000' : '#f0f6ff',
        backgroundImage: isHighContrast ? 'none' : "url('/hero-flag-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center right',
        backgroundRepeat: 'no-repeat',
        borderBottom: `1px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
        overflow: 'hidden',
        paddingTop: '52px',
        paddingBottom: '68px',
      }}
    >
      {/* Soft Sky-Blue / Light Tint Gradient Overlay for Optimal Foreground Contrast */}
      {!isHighContrast && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(240, 246, 255, 0.96) 0%, rgba(240, 246, 255, 0.88) 45%, rgba(255, 255, 255, 0.35) 75%, rgba(255, 255, 255, 0.12) 100%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )}

      {/* Subtle Ashoka Chakra Geometric Vector Overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          right: '-100px',
          transform: 'translateY(-50%)',
          width: '640px',
          height: '640px',
          pointerEvents: 'none',
          opacity: isHighContrast ? 0.08 : 0.045,
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
                backgroundColor: isHighContrast ? '#111827' : 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                marginBottom: '20px',
                boxShadow: '0 1px 3px rgba(12, 35, 64, 0.05)',
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
                {t.heroBadge}
              </span>
            </div>

            {/* Main Official Headline */}
            <h1
              id="hero-title"
              style={{
                marginBottom: '16px',
              }}
            >
              <span
                style={{
                  display: 'block',
                  fontSize: 'clamp(18px, 2.2vw, 24px)',
                  lineHeight: 1.4,
                  fontWeight: 600,
                  fontStyle: 'italic',
                  fontFamily: "'Inter', 'Noto Sans Devanagari', 'Segoe UI', system-ui, -apple-system, sans-serif",
                  color: isHighContrast ? '#ffffff' : '#0c2340',
                  letterSpacing: '0.01em',
                }}
              >
                {t.heroHeadline1} <br />
                <span style={{ color: isHighContrast ? '#ff9933' : '#c2410c' }}>
                  {t.heroHeadline2}
                </span>
              </span>
              <span
                style={{
                  display: 'block',
                  fontSize: 'clamp(15px, 2vw, 19px)',
                  fontWeight: 600,
                  color: isHighContrast ? '#9ca3af' : '#475569',
                  marginTop: '6px',
                  letterSpacing: '0',
                  fontStyle: 'normal',
                }}
              >
                {t.heroSubtitle}
              </span>
            </h1>

            {/* Compact Livelihood Value Badge Row (SKILL • EMPLOYMENT • LIVELIHOOD) */}
            <div
              style={{
                display: 'inline-flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 16px',
                backgroundColor: isHighContrast ? '#111827' : 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                borderRadius: '8px',
                border: `1px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
                boxShadow: '0 2px 8px rgba(12, 35, 64, 0.05)',
                marginBottom: '28px',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: isHighContrast ? '#ffffff' : '#0c2340',
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={isHighContrast ? '#22c55e' : '#15803d'}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
                {t.heroPillSkill}
              </span>

              <span style={{ color: isHighContrast ? '#ff9933' : '#c2410c', fontWeight: 800 }}>•</span>

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: isHighContrast ? '#ffffff' : '#0c2340',
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={isHighContrast ? '#ff9933' : '#c2410c'}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                {t.heroPillJob}
              </span>

              <span style={{ color: isHighContrast ? '#ff9933' : '#c2410c', fontWeight: 800 }}>•</span>

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: isHighContrast ? '#ffffff' : '#0c2340',
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={isHighContrast ? '#60a5fa' : '#1e40af'}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                {t.heroPillSelf}
              </span>
            </div>

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
                <span>{t.heroPrimaryCta}</span>
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
                <span>{t.heroSecondaryCta}</span>
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
                <span>{t.pillar3Title}</span>
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
                <span>{t.pillar2Title}</span>
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
                <span>{t.pillar1Title}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Realistic Aspirational Hero Visual with Floating Concept Badges */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '10px 0',
              minHeight: '440px',
            }}
          >
            {/* Soft Ambient Radial Glow Behind the Visual */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: '100%',
                maxWidth: '480px',
                maxHeight: '480px',
                background: isHighContrast
                  ? 'radial-gradient(circle, rgba(30,58,138,0.25) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(194,65,12,0.06) 0%, rgba(12,35,64,0.04) 40%, transparent 70%)',
                filter: 'blur(32px)',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />

            {/* Visual Container with Seamless Edge Blending */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '520px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1,
              }}
            >
              {/* Main Realistic Hero Image */}
              <img
                src="/hero-visual.jpg"
                alt="Jeevika Map Livelihood Convergence Portal"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '460px',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  filter: isHighContrast
                    ? 'contrast(1.15) brightness(0.95)'
                    : 'drop-shadow(0 16px 36px rgba(12, 35, 64, 0.09))',
                  maskImage: 'radial-gradient(ellipse 96% 92% at 52% 50%, black 72%, transparent 100%)',
                  WebkitMaskImage: 'radial-gradient(ellipse 96% 92% at 52% 50%, black 72%, transparent 100%)',
                  transition: 'transform 0.3s ease',
                }}
              />

              {/* Floating Concept 1: कौशल प्रशिक्षण / Skill Training (Top Right) */}
              <div
                className="floating-chip-1"
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '-10px',
                  backgroundColor: isHighContrast ? '#111827' : 'rgba(255, 255, 255, 0.94)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: `1.5px solid ${isHighContrast ? '#22c55e' : '#bbf7d0'}`,
                  borderRadius: '8px',
                  padding: '8px 14px',
                  boxShadow: isHighContrast
                    ? '0 4px 12px rgba(0,0,0,0.5)'
                    : '0 10px 24px -4px rgba(12, 35, 64, 0.12), 0 2px 6px rgba(0,0,0,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    backgroundColor: isHighContrast ? '#14532d' : '#f0fdf4',
                    color: isHighContrast ? '#86efac' : '#15803d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: isHighContrast ? '#ffffff' : '#0c2340', lineHeight: 1.2 }}>
                    {t.heroPillSkill}
                  </div>
                  <div style={{ fontSize: '10.5px', fontWeight: 600, color: isHighContrast ? '#86efac' : '#15803d' }}>
                    NSQF Level 1–8 • NCVET
                  </div>
                </div>
              </div>

              {/* Floating Concept 2: रोज़गार अवसर / Employment (Middle Left) */}
              <div
                className="floating-chip-2"
                style={{
                  position: 'absolute',
                  top: '46%',
                  left: '-16px',
                  transform: 'translateY(-50%)',
                  backgroundColor: isHighContrast ? '#111827' : 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: `1.5px solid ${isHighContrast ? '#ff9933' : '#fed7aa'}`,
                  borderRadius: '8px',
                  padding: '8px 14px',
                  boxShadow: isHighContrast
                    ? '0 4px 12px rgba(0,0,0,0.5)'
                    : '0 12px 28px -6px rgba(194, 65, 12, 0.14), 0 2px 6px rgba(0,0,0,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    backgroundColor: isHighContrast ? '#451a03' : '#fff7ed',
                    color: isHighContrast ? '#fdba74' : '#c2410c',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: isHighContrast ? '#ffffff' : '#0c2340', lineHeight: 1.2 }}>
                    {t.heroPillJob}
                  </div>
                  <div style={{ fontSize: '10.5px', fontWeight: 600, color: isHighContrast ? '#fdba74' : '#c2410c' }}>
                    {t.pillar2Title}
                  </div>
                </div>
              </div>

              {/* Floating Concept 3: स्वरोज़गार / Self-Employment (Bottom Right) */}
              <div
                className="floating-chip-3"
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '-6px',
                  backgroundColor: isHighContrast ? '#111827' : 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: `1.5px solid ${isHighContrast ? '#60a5fa' : '#bfdbfe'}`,
                  borderRadius: '8px',
                  padding: '8px 14px',
                  boxShadow: isHighContrast
                    ? '0 4px 12px rgba(0,0,0,0.5)'
                    : '0 12px 28px -6px rgba(12, 35, 64, 0.14), 0 2px 6px rgba(0,0,0,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    backgroundColor: isHighContrast ? '#1e3a8a' : '#eff6ff',
                    color: isHighContrast ? '#93c5fd' : '#1e40af',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: isHighContrast ? '#ffffff' : '#0c2340', lineHeight: 1.2 }}>
                    {t.heroPillSelf}
                  </div>
                  <div style={{ fontSize: '10.5px', fontWeight: 600, color: isHighContrast ? '#93c5fd' : '#1e40af' }}>
                    {t.pillar1Title}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded CSS for Chakra and floating badges animation */}
      <style>{`
        @keyframes slowChakraRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes badgeFloat1 {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes badgeFloat2 {
          0%, 100% {
            transform: translateY(-50%) translateX(0px);
          }
          50% {
            transform: translateY(-50%) translateX(-4px);
          }
        }

        @keyframes badgeFloat3 {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(4px);
          }
        }

        .floating-chip-1 {
          animation: badgeFloat1 4s ease-in-out infinite;
        }

        .floating-chip-2 {
          animation: badgeFloat2 5s ease-in-out infinite 0.5s;
        }

        .floating-chip-3 {
          animation: badgeFloat3 4.5s ease-in-out infinite 1s;
        }

        @media (max-width: 960px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .floating-chip-1 {
            right: 0 !important;
          }
          .floating-chip-2 {
            left: 0 !important;
          }
          .floating-chip-3 {
            right: 0 !important;
          }
        }
      `}</style>
    </section>
  );
};
