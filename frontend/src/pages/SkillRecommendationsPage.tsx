import React from 'react';
import { Link } from 'react-router-dom';
import { useAccessibility } from '../context/useAccessibility';

export const SkillRecommendationsPage: React.FC = () => {
  const { isHighContrast } = useAccessibility();

  return (
    <div>
      {/* Module Header Banner */}
      <div
        style={{
          backgroundColor: isHighContrast ? '#111827' : '#ffffff',
          border: `1px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
          borderRadius: '6px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: isHighContrast ? 'none' : '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="jm-badge jm-badge-saffron">चरण 04 • अनुशंसा (Step 04 • Recommend)</span>
            <span style={{ fontSize: '11px', color: isHighContrast ? '#9ca3af' : '#64748b', fontWeight: 600 }}>
              शासनादेश कोड: PMAJAY-REC-MOD-04
            </span>
          </div>
          <span
            style={{
              fontSize: '11.5px',
              fontWeight: 600,
              color: '#c2410c',
              backgroundColor: isHighContrast ? '#374151' : '#fff7ed',
              padding: '3px 8px',
              borderRadius: '3px',
              border: '1px solid #fed7aa',
            }}
          >
            आर्किटेक्चर विशिष्टता
          </span>
        </div>

        <h1
          style={{
            fontSize: '24px',
            fontWeight: 800,
            color: isHighContrast ? '#ffffff' : '#0c2340',
            marginBottom: '4px',
          }}
        >
          एनएसक्यूएफ कौशल अनुशंसाएं एवं योग्यता पैक
        </h1>
        <div style={{ fontSize: '13.5px', color: isHighContrast ? '#ff9933' : '#c2410c', fontWeight: 600, marginBottom: '12px' }}>
          NSQF Skilling Recommendations & Qualification Packs
        </div>

        <p style={{ fontSize: '14px', lineHeight: 1.6, color: isHighContrast ? '#e5e7eb' : '#475569', margin: 0 }}>
          लाभार्थी के कौशल और स्थानीय मांग को राष्ट्रीय व्यावसायिक शिक्षा एवं प्रशिक्षण परिषद (NCVET) के राष्ट्रीय योग्यता रजिस्टर (NQR)
          के साथ मिलाता है। आधिकारिक एनएसक्यूएफ-प्रमाणित अपस्किलिंग और प्रमाणन मार्ग तैयार करता है।
        </p>
      </div>

      {/* Purpose & Architecture Matrix */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '28px',
        }}
      >
        {/* Card 1 */}
        <div
          style={{
            backgroundColor: isHighContrast ? '#111827' : '#ffffff',
            border: `1px solid ${isHighContrast ? '#4b5563' : '#e2e8f0'}`,
            borderRadius: '6px',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ color: '#15803d' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="7" />
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
              </svg>
            </span>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0c2340' }}>
              1. QP-NOS योग्यता मिलान (Matching)
            </h2>
          </div>
          <p style={{ fontSize: '13px', lineHeight: 1.55, color: isHighContrast ? '#d1d5db' : '#475569', marginBottom: '12px' }}>
            पारंपरिक हुनर को राष्ट्रीय व्यावसायिक मानकों (NOS) से जोड़ने की प्रक्रिया:
          </p>
          <ul style={{ fontSize: '12px', color: isHighContrast ? '#9ca3af' : '#64748b', paddingLeft: '18px', margin: 0, lineHeight: 1.6 }}>
            <li>लेवल 3 से लेवल 5 क्वालिफिकेशन पैक (QP) से सीधा मिलान</li>
            <li>मौसमी उतार-चढ़ाव से सुरक्षा हेतु बहु-कौशल अनुशंसाएं</li>
            <li>14 प्राथमिकता वाले सेक्टर स्किल काउंसिलों (SSCs) के साथ संरेखण</li>
          </ul>
        </div>

        {/* Card 2 */}
        <div
          style={{
            backgroundColor: isHighContrast ? '#111827' : '#ffffff',
            border: `1px solid ${isHighContrast ? '#4b5563' : '#e2e8f0'}`,
            borderRadius: '6px',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ color: '#0c2340' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </span>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0c2340' }}>
              2. ब्रिज पाठ्यक्रम निर्माण (Bridge Curriculum)
            </h2>
          </div>
          <p style={{ fontSize: '13px', lineHeight: 1.55, color: isHighContrast ? '#d1d5db' : '#475569', marginBottom: '12px' }}>
            काम के नुकसान को न्यूनतम करते हुए छोटे, केंद्रित मॉड्यूल तैयार करना:
          </p>
          <ul style={{ fontSize: '12px', color: isHighContrast ? '#9ca3af' : '#64748b', paddingLeft: '18px', margin: 0, lineHeight: 1.6 }}>
            <li>80 से 160 घंटे का आरपीएल ओरिएंटेशन एवं कौशल अंतराल प्रशिक्षण</li>
            <li>डिजिटल साक्षरता, यूपीआई एवं डिजिटल बिलिंग एकीकरण</li>
            <li>कार्यस्थल सुरक्षा, गुणवत्ता मानकीकरण एवं पैकेजिंग</li>
          </ul>
        </div>

        {/* Card 3 */}
        <div
          style={{
            backgroundColor: isHighContrast ? '#111827' : '#ffffff',
            border: `1px solid ${isHighContrast ? '#4b5563' : '#e2e8f0'}`,
            borderRadius: '6px',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ color: '#c2410c' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0c2340' }}>
              3. मान्यता प्राप्त प्रशिक्षण केंद्र (Training Hubs)
            </h2>
          </div>
          <p style={{ fontSize: '13px', lineHeight: 1.55, color: isHighContrast ? '#d1d5db' : '#475569', marginBottom: '12px' }}>
            पीएम-अजय फंडिंग सहायता प्राप्त नजदीकी सत्यापित प्रशिक्षण केंद्रों की पहचान:
          </p>
          <ul style={{ fontSize: '12px', color: isHighContrast ? '#9ca3af' : '#64748b', paddingLeft: '18px', margin: 0, lineHeight: 1.6 }}>
            <li>सरकारी औद्योगिक प्रशिक्षण संस्थान (ITI)</li>
            <li>प्रधानमंत्री कौशल केंद्र (PMKK)</li>
            <li>क्लस्टर बुनकर / कारीगर सेवा केंद्र</li>
          </ul>
        </div>
      </div>

      {/* Action Strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '16px 20px',
          backgroundColor: isHighContrast ? '#111827' : '#ffffff',
          borderRadius: '6px',
          border: `1px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
        }}
      >
        <Link to="/opportunities" className="jm-btn jm-btn-secondary">
          <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 10H5M9 14l-4-4 4-4" />
          </svg>
          <span>स्थानीय अवसर पर वापस जाएँ (Back to Opportunities)</span>
        </Link>
        <Link to="/action-plan" className="jm-btn jm-btn-primary">
          <span>कार्य योजना देखें (Proceed to Action Plan)</span>
          <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 10h10M11 6l4 4-4 4" />
          </svg>
        </Link>
      </div>
    </div>
  );
};
