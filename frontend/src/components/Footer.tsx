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
              प्रधानमंत्री अनुसूचित जाति अभ्युदय योजना (PM-AJAY) अंतर्गत आजीविका आसूचना, कौशल मानचित्रण एवं एनसीवीईटी-एनएसक्यूएफ त्वरित आजीविका फ्रेमवर्क।
            </p>
            <p style={{ fontSize: '11.5px', color: '#64748b', margin: 0 }}>
              सामाजिक न्याय एवं अधिकारिता मंत्रालय, भारत सरकार (Ministry of Social Justice & Empowerment, Govt. of India).
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
              पोर्टल अनुभाग / Portal Sections
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <a href="#hero" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                  मुख्य पृष्ठ / Platform Home
                </a>
              </li>
              <li>
                <a href="#how-it-works" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                  कार्यप्रणाली / How It Works
                </a>
              </li>
              <li>
                <a href="#skills" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                  आजीविका एवं कौशल मार्ग / Livelihood Pathways
                </a>
              </li>
              <li>
                <a href="#impact-stats" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                  पायलट प्रभाव आंकड़े / Pilot Metrics
                </a>
              </li>
              <li>
                <a href="/officer/login" style={{ color: '#ff9933', textDecoration: 'none', fontWeight: 600 }}>
                  अधिकारी लॉगिन / Officer Command Portal
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
              संबंधित राष्ट्रीय पोर्टल / Related Portals
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <span style={{ color: '#cbd5e1' }}>राष्ट्रीय कौशल विकास निगम (NSDC)</span>
              </li>
              <li>
                <span style={{ color: '#cbd5e1' }}>राष्ट्रीय व्यावसायिक शिक्षा एवं प्रशिक्षण परिषद (NCVET)</span>
              </li>
              <li>
                <span style={{ color: '#cbd5e1' }}>सामाजिक न्याय एवं अधिकारिता मंत्रालय (MoSJE)</span>
              </li>
              <li>
                <span style={{ color: '#cbd5e1' }}>स्किल इंडिया डिजिटल हब (SIDH)</span>
              </li>
              <li>
                <span style={{ color: '#cbd5e1' }}>राष्ट्रीय करियर सेवा (NCS)</span>
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
              सुगमता एवं सहायता / Grievance Desk
            </div>
            <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: 0, marginBottom: '10px' }}>
              भारत सरकार वेबसाइट दिशानिर्देश (GIGW 3.0) एवं WCAG 2.1 AA मानकों के अनुरूप।
            </p>
            <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
              <div>पीएम-अजय तकनीकी सहायता (PMU Support)</div>
              <div style={{ color: '#93c5fd', marginTop: '4px' }}>support.jeevikamap@gov.in (Demo)</div>
              <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '6px' }}>टोल फ्री हेल्पलाइन: 1800-XXX-XXXX</div>
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
          <strong>अस्वीकरण / Legal Disclaimer:</strong> जीविका मैप (Jeevika Map) पीएम-अजय योजना के तहत विकसित
          एक विशिष्ट आजीविका आसूचना एवं एनएसक्यूएफ अनुशंसा मंच है। सभी व्यावसायिक प्रोफाइल और कौशल योग्यता
          मानक आधिकारिक NCVET राष्ट्रीय व्यावसायिक मानकों (NOS) पर आधारित हैं।
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
            © {new Date().getFullYear()} जीविका मैप (Jeevika Map) • सामाजिक न्याय एवं अधिकारिता मंत्रालय, भारत सरकार।
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span style={{ color: '#94a3b8' }}>गोपनीयता नीति (Privacy)</span>
            <span style={{ color: '#94a3b8' }}>उपयोग की शर्तें (Terms)</span>
            <span style={{ color: '#94a3b8' }}>हाइपरलिंक नीति (Policy)</span>
            <span style={{ color: '#94a3b8' }}>सुरक्षा लेखापरीक्षा (Security)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
