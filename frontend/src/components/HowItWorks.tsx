import React from 'react';

interface HowItWorksProps {
  isHighContrast?: boolean;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ isHighContrast = false }) => {
  const steps = [
    {
      num: '01',
      stage: 'Discover',
      tagline: 'Household & Cluster Profiling',
      description:
        'Grassroots field enumerators and community resource persons capture socio-economic baselines, traditional trade heritage, informal skill repertoires, and household assets.',
      meta: 'Socio-Economic Baseline • Cluster Geo-Tagging',
      badgeClass: 'jm-badge-neutral',
    },
    {
      num: '02',
      stage: 'Understand',
      tagline: 'Competency & Demand Synthesis',
      description:
        'The platform evaluates informal experience against formal skill matrices while analyzing district industrial corridors, local raw material value chains, and employer requirements.',
      meta: 'Recognition of Prior Learning (RPL) Assessment',
      badgeClass: 'jm-badge-navy',
    },
    {
      num: '03',
      stage: 'Recommend',
      tagline: 'NSQF-Aligned Trajectory Formulation',
      description:
        'Tailored recommendations identify certified NSQF Qualification Packs (QP-NOS), bridging short bridge-courses or advanced certifications to optimize viable income.',
      meta: 'National Skill Matrix Mapping • QP-NOS Matching',
      badgeClass: 'jm-badge-saffron',
    },
    {
      num: '04',
      stage: 'Act',
      tagline: 'Convergence & Scheme Linkage',
      description:
        'Seamless integration with PM-AJAY financial assistance, capital grants for toolkits, direct enrollment into accredited training partners, and SHG enterprise clusters.',
      meta: 'PM-AJAY Capital Subsidies • Certified Enrolment',
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
            Operational Methodology
          </span>
          <h2
            id="how-it-works-title"
            style={{
              fontSize: 'clamp(24px, 3.2vw, 32px)',
              fontWeight: 800,
              color: isHighContrast ? '#ffffff' : '#0c2340',
              marginBottom: '12px',
            }}
          >
            How Jeevika Map Operates
          </h2>
          <p
            style={{
              fontSize: '15px',
              color: isHighContrast ? '#d1d5db' : '#475569',
              lineHeight: 1.6,
            }}
          >
            A four-stage evidence-based progression translating latent community skills into
            accredited certifications, local enterprise readiness, and direct PM-AJAY capital
            support.
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
                  Stage {index + 1}
                </span>
              </div>

              {/* Stage Title */}
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: 800,
                  color: isHighContrast ? '#ffffff' : '#0c2340',
                  marginBottom: '4px',
                }}
              >
                {step.stage}
              </h2>
              <div
                style={{
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: isHighContrast ? '#ff9933' : '#c2410c',
                  marginBottom: '12px',
                }}
              >
                {step.tagline}
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
