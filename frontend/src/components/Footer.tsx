import React from 'react';

interface FooterProps {
  isHighContrast?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isHighContrast = false }) => {
  return (
    <footer
      role="contentinfo"
      style={{
        backgroundColor: isHighContrast ? '#050505' : '#0c2340',
        color: isHighContrast ? '#ffffff' : '#cbd5e1',
        borderTop: `1px solid ${isHighContrast ? '#ffffff' : '#1e3a8a'}`,
        fontSize: '13px',
        lineHeight: 1.6,
      }}
    >
      {/* Upper Footer: Information Links & Institutional Hierarchy */}
      <div
        className="jm-container"
        style={{
          paddingTop: '54px',
          paddingBottom: '42px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '36px',
            marginBottom: '40px',
          }}
        >
          {/* Col 1: Platform Overview */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                }}
              >
                जीविका <span style={{ color: '#ff9933' }}>MAP</span>
              </span>
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 700,
                  padding: '1px 6px',
                  backgroundColor: '#1e3a8a',
                  color: '#93c5fd',
                  borderRadius: '3px',
                }}
              >
                PM-AJAY
              </span>
            </div>
            <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: 0, marginBottom: '14px' }}>
              Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY) convergent livelihood
              intelligence, skill mapping, and NCVET-NSQF career acceleration framework.
            </p>
            <p style={{ fontSize: '11.5px', color: '#64748b', margin: 0 }}>
              Ministry of Social Justice & Empowerment, Government of India.
            </p>
          </div>

          {/* Col 2: Platform Navigation */}
          <div>
            <div
              style={{
                fontSize: '13.5px',
                fontWeight: 700,
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '14px',
              }}
            >
              Portal Sections
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <a href="#hero" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                  Platform Home
                </a>
              </li>
              <li>
                <a href="#how-it-works" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                  How It Works (4-Stage Flow)
                </a>
              </li>
              <li>
                <a href="#livelihood-mapping" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                  Livelihood Mapping Matrix
                </a>
              </li>
              <li>
                <a href="#skills" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                  NSQF Skill Recommendations
                </a>
              </li>
              <li>
                <a href="#impact-stats" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                  Pilot Demonstration Metrics
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Government Related Portals */}
          <div>
            <div
              style={{
                fontSize: '13.5px',
                fontWeight: 700,
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '14px',
              }}
            >
              Related National Portals
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <span style={{ color: '#cbd5e1' }}>National Skill Development Corporation (NSDC)</span>
              </li>
              <li>
                <span style={{ color: '#cbd5e1' }}>National Council for Vocational Education (NCVET)</span>
              </li>
              <li>
                <span style={{ color: '#cbd5e1' }}>Ministry of Social Justice & Empowerment</span>
              </li>
              <li>
                <span style={{ color: '#cbd5e1' }}>Skill India Digital Hub (SIDH)</span>
              </li>
              <li>
                <span style={{ color: '#cbd5e1' }}>National Career Service (NCS)</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Accessibility & Contact */}
          <div>
            <div
              style={{
                fontSize: '13.5px',
                fontWeight: 700,
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '14px',
              }}
            >
              Accessibility & Grievance
            </div>
            <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: 0, marginBottom: '10px' }}>
              Compliant with Guidelines for Indian Government Websites (GIGW 3.0) and WCAG 2.1 AA.
            </p>
            <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
              <div>PM-AJAY Technical PMU Support</div>
              <div style={{ color: '#93c5fd', marginTop: '4px' }}>support.jeevikamap@gov.in (Demo)</div>
              <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '6px' }}>Toll Free: 1800-XXX-XXXX</div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div
          style={{
            borderTop: `1px solid ${isHighContrast ? '#ffffff' : '#1e3a8a'}`,
            paddingTop: '20px',
            marginBottom: '24px',
            fontSize: '11.5px',
            color: '#94a3b8',
            lineHeight: 1.6,
          }}
        >
          <strong>Disclaimer:</strong> Jeevika Map is a specialized livelihood intelligence and NSQF
          recommendation tool conceptualized under the PM-AJAY framework. All occupational profiles,
          competency assessments, and qualification levels reference official NCVET National Occupational
          Standards (NOS). Data displayed on this demonstration instance is simulated for pilot validation.
        </div>

        {/* Bottom Strip: Copyright and Compliance */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            fontSize: '11.5px',
            color: '#64748b',
            borderTop: `1px solid ${isHighContrast ? '#374151' : 'rgba(255,255,255,0.08)'}`,
            paddingTop: '16px',
          }}
        >
          <div>
            © {new Date().getFullYear()} Jeevika Map • Ministry of Social Justice & Empowerment, Government of India.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span style={{ color: '#94a3b8' }}>Privacy Policy</span>
            <span style={{ color: '#94a3b8' }}>Terms of Service</span>
            <span style={{ color: '#94a3b8' }}>Hyperlinking Policy</span>
            <span style={{ color: '#94a3b8' }}>Security Audit</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
