import React from 'react';
import type { LivelihoodInterestsState } from '../../types/mapping';

interface Step4Props {
  data: LivelihoodInterestsState;
  onChange: (data: LivelihoodInterestsState) => void;
  isHighContrast?: boolean;
  errors?: Record<string, string>;
}

export const Step4LivelihoodInterests: React.FC<Step4Props> = ({
  data,
  onChange,
  isHighContrast = false,
  errors = {},
}) => {
  const sectors = [
    {
      id: 'solar_green',
      labelHi: 'सौर एवं हरित ऊर्जा',
      labelEn: 'Solar & Renewable Tech (सूर्यमित्र / पंप रख-रखाव)',
      tag: 'उच्च मांग / High Growth',
      icon: '☀️',
    },
    {
      id: 'textile_handloom',
      labelHi: 'हथकरघा एवं आधुनिक वस्त्र',
      labelEn: 'Handloom, Jacquard & Apparel Design',
      tag: 'क्लस्टर समर्थित / ODOP',
      icon: '🧵',
    },
    {
      id: 'food_processing',
      labelHi: 'खाद्य प्रसंस्करण एवं कृषि मूल्यवर्धन',
      labelEn: 'Micro Food Processing, Packaging & Sorting',
      tag: 'SHG समूह अनुकूल / Self-Help',
      icon: '🌾',
    },
    {
      id: 'engineering_welding',
      labelHi: 'सटीक इंजीनियरिंग एवं वेल्डिंग',
      labelEn: 'Precision Fabrication & Mechanical Repair',
      tag: 'MSME मांग / Industry',
      icon: '⚙️',
    },
    {
      id: 'electrician_wireman',
      labelHi: 'विद्युत वायरिंग एवं मोटर वाइंडिंग',
      labelEn: 'Domestic Electrical & Motor Servicing',
      tag: 'स्थानीय रोजगार / Local',
      icon: '⚡',
    },
    {
      id: 'digital_services',
      labelHi: 'डिजिटल एवं ई-मित्र सेवाएं',
      labelEn: 'Common Service Centre & Data Operations',
      tag: 'ग्रामीण सेवा / Rural Hub',
      icon: '💻',
    },
  ];

  const updateField = <K extends keyof LivelihoodInterestsState>(field: K, value: LivelihoodInterestsState[K]) => {
    onChange({ ...data, [field]: value });
  };

  const toggleSector = (sectorId: string) => {
    const current = data.targetSectors;
    if (current.includes(sectorId)) {
      updateField('targetSectors', current.filter((s) => s !== sectorId));
    } else {
      updateField('targetSectors', [...current, sectorId]);
    }
  };

  return (
    <div>
      {/* Question 1: Target Sectors */}
      <div style={{ marginBottom: '28px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '15px',
            fontWeight: 700,
            color: isHighContrast ? '#ffffff' : '#0c2340',
            marginBottom: '6px',
          }}
        >
          आप भविष्य में किस क्षेत्र में कार्य या प्रशिक्षण करना चाहते हैं? / Livelihood Sectors of Interest <span style={{ color: '#dc2626' }}>*</span>
        </label>
        <p style={{ fontSize: '12.5px', color: isHighContrast ? '#d1d5db' : '#64748b', marginBottom: '14px' }}>
          एक या एक से अधिक क्षेत्र चुन सकते हैं (Select one or more sectors)
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          {sectors.map((sec) => {
            const isSelected = data.targetSectors.includes(sec.id);
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => toggleSector(sec.id)}
                style={{
                  minHeight: '64px',
                  padding: '14px',
                  borderRadius: '6px',
                  textAlign: 'left',
                  border: isSelected
                    ? `2px solid ${isHighContrast ? '#ff9933' : '#0c2340'}`
                    : `1px solid ${isHighContrast ? '#4b5563' : '#cbd5e1'}`,
                  backgroundColor: isSelected
                    ? (isHighContrast ? '#1f2937' : '#eff6ff')
                    : (isHighContrast ? '#111827' : '#ffffff'),
                  color: isSelected
                    ? (isHighContrast ? '#ff9933' : '#0c2340')
                    : (isHighContrast ? '#ffffff' : '#1e293b'),
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: isSelected && !isHighContrast ? '0 2px 6px rgba(12, 35, 64, 0.06)' : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <span style={{ fontSize: '20px' }}>{sec.icon}</span>
                  <span
                    style={{
                      fontSize: '10.5px',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      backgroundColor: isSelected ? (isHighContrast ? '#374151' : '#bfdbfe') : (isHighContrast ? '#1f2937' : '#f1f5f9'),
                      color: isSelected ? '#1e3a8a' : '#64748b',
                      fontWeight: 600,
                    }}
                  >
                    {sec.tag}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '2px' }}>{sec.labelHi}</div>
                  <div style={{ fontSize: '11.5px', opacity: 0.8 }}>{sec.labelEn}</div>
                </div>
              </button>
            );
          })}
        </div>

        {errors.targetSectors && (
          <div role="alert" style={{ color: '#dc2626', fontSize: '12px', marginTop: '6px', fontWeight: 600 }}>
            {errors.targetSectors}
          </div>
        )}
      </div>

      {/* Question 2: Training Willingness */}
      <div
        style={{
          padding: '16px',
          backgroundColor: isHighContrast ? '#1f2937' : '#f0fdf4',
          border: `1.5px solid ${isHighContrast ? '#22c55e' : '#bbf7d0'}`,
          borderRadius: '6px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <input
            id="trainingInterest"
            type="checkbox"
            checked={data.trainingInterest}
            onChange={(e) => updateField('trainingInterest', e.target.checked)}
            style={{ width: '20px', height: '20px', marginTop: '2px', cursor: 'pointer' }}
          />
          <label htmlFor="trainingInterest" style={{ cursor: 'pointer' }}>
            <strong style={{ fontSize: '14px', color: isHighContrast ? '#ffffff' : '#166534', display: 'block' }}>
              हाँ, मैं निःशुल्क NSQF प्रमाणित प्रशिक्षण एवं टूलकिट सहायता प्राप्त करना चाहता हूँ।
            </strong>
            <span style={{ fontSize: '12px', color: isHighContrast ? '#d1d5db' : '#334155' }}>
              (Yes, I am interested in government-sponsored NSQF skill training and PM-AJAY toolkit subsidies).
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};
