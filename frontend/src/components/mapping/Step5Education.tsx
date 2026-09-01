import React from 'react';
import type { EducationState, EducationLevelType } from '../../types/mapping';

interface Step5Props {
  data: EducationState;
  onChange: (data: EducationState) => void;
  isHighContrast?: boolean;
  errors?: Record<string, string>;
}

export const Step5Education: React.FC<Step5Props> = ({
  data,
  onChange,
  isHighContrast = false,
  errors = {},
}) => {
  const updateField = <K extends keyof EducationState>(field: K, value: EducationState[K]) => {
    onChange({ ...data, [field]: value });
  };

  const levels: { id: EducationLevelType; labelHi: string; labelEn: string }[] = [
    { id: 'no_formal_education', labelHi: 'कोई औपचारिक विद्यालयी शिक्षा नहीं', labelEn: 'No Formal Schooling (व्यावहारिक अनुभव)' },
    { id: 'primary_class_5', labelHi: 'प्राथमिक (कक्षा 5 तक)', labelEn: 'Primary (Up to Class 5)' },
    { id: 'middle_class_8', labelHi: 'पूर्व-माध्यमिक (कक्षा 8 तक)', labelEn: 'Middle (Up to Class 8)' },
    { id: 'secondary_class_10', labelHi: 'हाईस्कूल (कक्षा 10 उत्तीर्ण)', labelEn: 'Secondary (Class 10 Passed)' },
    { id: 'higher_secondary_class_12', labelHi: 'इंटरमीडिएट (कक्षा 12 उत्तीर्ण)', labelEn: 'Higher Secondary (Class 12)' },
    { id: 'diploma_iti', labelHi: 'आईटीआई / डिप्लोमा', labelEn: 'ITI Certificate / Polytechnic' },
    { id: 'graduate_above', labelHi: 'स्नातक या उच्चतर', labelEn: 'Graduate or Above' },
  ];

  return (
    <div>
      {/* Question 1: Formal Education Level */}
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
          आपकी औपचारिक शिक्षा का स्तर क्या है? / Formal Schooling Level <span style={{ color: '#dc2626' }}>*</span>
        </label>
        <p style={{ fontSize: '12.5px', color: isHighContrast ? '#d1d5db' : '#64748b', marginBottom: '12px' }}>
          एनएसक्यूएफ लेवल का सही निर्धारण करने हेतु (Used to match appropriate entry qualification level)
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
          {levels.map((lvl) => {
            const isSelected = data.formalLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => updateField('formalLevel', lvl.id)}
                style={{
                  minHeight: '50px',
                  padding: '12px 14px',
                  borderRadius: '4px',
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
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '13px' }}>{lvl.labelHi}</div>
                  <div style={{ fontSize: '11px', opacity: 0.75 }}>{lvl.labelEn}</div>
                </div>
                {isSelected && <span style={{ color: '#15803d', fontWeight: 800 }}>✓</span>}
              </button>
            );
          })}
        </div>

        {errors.formalLevel && (
          <div role="alert" style={{ color: '#dc2626', fontSize: '12px', marginTop: '6px', fontWeight: 600 }}>
            {errors.formalLevel}
          </div>
        )}
      </div>

      {/* Question 2: Functional Literacy Checklist */}
      <div style={{ marginBottom: '20px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '15px',
            fontWeight: 700,
            color: isHighContrast ? '#ffffff' : '#0c2340',
            marginBottom: '10px',
          }}
        >
          व्यावहारिक साक्षरता एवं डिजिटल सुविधा / Functional Literacy & Device Access
        </label>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              borderRadius: '4px',
              backgroundColor: isHighContrast ? '#1f2937' : '#f8fafc',
              border: `1px solid ${isHighContrast ? '#4b5563' : '#e2e8f0'}`,
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={data.canReadWriteVernacular}
              onChange={(e) => updateField('canReadWriteVernacular', e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <div>
              <strong style={{ fontSize: '13px', color: isHighContrast ? '#ffffff' : '#0c2340', display: 'block' }}>
                मातृभाषा / क्षेत्रीय भाषा में पढ़ना और लिखना (Can read & write in Hindi/Regional language)
              </strong>
              <span style={{ fontSize: '11.5px', color: isHighContrast ? '#d1d5db' : '#64748b' }}>
                साधारण बोर्ड, दर सूची या बिल पढ़ सकते हैं
              </span>
            </div>
          </label>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              borderRadius: '4px',
              backgroundColor: isHighContrast ? '#1f2937' : '#f8fafc',
              border: `1px solid ${isHighContrast ? '#4b5563' : '#e2e8f0'}`,
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={data.basicMathComfort}
              onChange={(e) => updateField('basicMathComfort', e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <div>
              <strong style={{ fontSize: '13px', color: isHighContrast ? '#ffffff' : '#0c2340', display: 'block' }}>
                दैनिक लेन-देन एवं हिसाब-किताब (Comfortable with basic monetary calculations)
              </strong>
              <span style={{ fontSize: '11.5px', color: isHighContrast ? '#d1d5db' : '#64748b' }}>
                बाज़ार में खरीदारी, बिक्री एवं नकदी प्रबंधन कर लेते हैं
              </span>
            </div>
          </label>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              borderRadius: '4px',
              backgroundColor: isHighContrast ? '#1f2937' : '#f8fafc',
              border: `1px solid ${isHighContrast ? '#4b5563' : '#e2e8f0'}`,
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={data.smartphoneUsage === 'regular'}
              onChange={(e) => updateField('smartphoneUsage', e.target.checked ? 'regular' : 'basic_calls')}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <div>
              <strong style={{ fontSize: '13px', color: isHighContrast ? '#ffffff' : '#0c2340', display: 'block' }}>
                स्मार्टफोन का उपयोग करते हैं (Use a Smartphone for WhatsApp / Voice calls)
              </strong>
              <span style={{ fontSize: '11.5px', color: isHighContrast ? '#d1d5db' : '#64748b' }}>
                डिजिटल भुगतान (UPI / QR) व जानकारी देखना जानते हैं
              </span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
