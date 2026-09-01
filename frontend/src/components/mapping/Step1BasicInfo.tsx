import React from 'react';
import { VoiceInputButton } from './VoiceInputButton';
import type { BasicInfoState, GenderType } from '../../types/mapping';

interface Step1Props {
  data: BasicInfoState;
  onChange: (data: BasicInfoState) => void;
  isHighContrast?: boolean;
  errors?: Record<string, string>;
}

export const Step1BasicInfo: React.FC<Step1Props> = ({
  data,
  onChange,
  isHighContrast = false,
  errors = {},
}) => {
  const updateField = <K extends keyof BasicInfoState>(field: K, value: BasicInfoState[K]) => {
    onChange({ ...data, [field]: value });
  };

  const genders: { value: GenderType; labelHi: string; labelEn: string }[] = [
    { value: 'female', labelHi: 'महिला', labelEn: 'Female' },
    { value: 'male', labelHi: 'पुरुष', labelEn: 'Male' },
    { value: 'transgender', labelHi: 'ट्रांसजेंडर', labelEn: 'Transgender' },
    { value: 'other', labelHi: 'अन्य', labelEn: 'Other' },
  ];

  return (
    <div>
      {/* Question 1: Full Name */}
      <div style={{ marginBottom: '24px' }}>
        <label
          htmlFor="fullName"
          style={{
            display: 'block',
            fontSize: '15px',
            fontWeight: 700,
            color: isHighContrast ? '#ffffff' : '#0c2340',
            marginBottom: '6px',
          }}
        >
          आपका पूरा नाम क्या है? / What is your Full Name? <span style={{ color: '#dc2626' }}>*</span>
        </label>
        <p style={{ fontSize: '12.5px', color: isHighContrast ? '#d1d5db' : '#64748b', marginBottom: '8px' }}>
          आधार कार्ड के अनुसार नाम दर्ज करें या बोलकर बताएं। (Enter as per Aadhaar or speak)
        </p>

        <input
          id="fullName"
          type="text"
          value={data.fullName}
          onChange={(e) => updateField('fullName', e.target.value)}
          placeholder="उदा. राजेश कुमार / e.g. Rajesh Kumar"
          style={{
            width: '100%',
            maxWidth: '480px',
            padding: '12px 14px',
            fontSize: '15px',
            borderRadius: '4px',
            border: errors.fullName ? '2px solid #dc2626' : `1.5px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
            backgroundColor: isHighContrast ? '#111827' : '#ffffff',
            color: isHighContrast ? '#ffffff' : '#0f172a',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />

        <VoiceInputButton
          fieldLabel="Full Name"
          onTranscriptCaptured={(text) => updateField('fullName', text)}
          isHighContrast={isHighContrast}
        />

        {errors.fullName && (
          <div role="alert" style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px', fontWeight: 600 }}>
            {errors.fullName}
          </div>
        )}
      </div>

      {/* Question 2: Age */}
      <div style={{ marginBottom: '24px' }}>
        <label
          htmlFor="age"
          style={{
            display: 'block',
            fontSize: '15px',
            fontWeight: 700,
            color: isHighContrast ? '#ffffff' : '#0c2340',
            marginBottom: '6px',
          }}
        >
          आपकी आयु कितनी है? / What is your Age? <span style={{ color: '#dc2626' }}>*</span>
        </label>
        <p style={{ fontSize: '12.5px', color: isHighContrast ? '#d1d5db' : '#64748b', marginBottom: '8px' }}>
          वर्षों में (In completed years)
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input
            id="age"
            type="number"
            min="16"
            max="75"
            value={data.age}
            onChange={(e) => updateField('age', e.target.value)}
            placeholder="उदा. 32"
            style={{
              width: '120px',
              padding: '12px 14px',
              fontSize: '16px',
              fontWeight: 700,
              borderRadius: '4px',
              border: errors.age ? '2px solid #dc2626' : `1.5px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
              backgroundColor: isHighContrast ? '#111827' : '#ffffff',
              color: isHighContrast ? '#ffffff' : '#0f172a',
              outline: 'none',
            }}
          />
          <span style={{ fontSize: '14px', fontWeight: 600, color: isHighContrast ? '#ffffff' : '#334155' }}>
            वर्ष / Years
          </span>
        </div>

        {errors.age && (
          <div role="alert" style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px', fontWeight: 600 }}>
            {errors.age}
          </div>
        )}
      </div>

      {/* Question 3: Gender */}
      <div style={{ marginBottom: '24px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '15px',
            fontWeight: 700,
            color: isHighContrast ? '#ffffff' : '#0c2340',
            marginBottom: '8px',
          }}
        >
          लिंग / Gender <span style={{ color: '#dc2626' }}>*</span>
        </label>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {genders.map((g) => {
            const isSelected = data.gender === g.value;
            return (
              <button
                key={g.value}
                type="button"
                onClick={() => updateField('gender', g.value)}
                style={{
                  minHeight: '48px',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  border: isSelected
                    ? `2px solid ${isHighContrast ? '#ff9933' : '#0c2340'}`
                    : `1px solid ${isHighContrast ? '#4b5563' : '#cbd5e1'}`,
                  backgroundColor: isSelected
                    ? (isHighContrast ? '#1f2937' : '#eff6ff')
                    : (isHighContrast ? '#111827' : '#ffffff'),
                  color: isSelected
                    ? (isHighContrast ? '#ff9933' : '#0c2340')
                    : (isHighContrast ? '#ffffff' : '#334155'),
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{g.labelHi}</span>
                <span style={{ fontSize: '12px', opacity: 0.8 }}>({g.labelEn})</span>
                {isSelected && <span style={{ marginLeft: '4px', color: '#15803d' }}>✓</span>}
              </button>
            );
          })}
        </div>

        {errors.gender && (
          <div role="alert" style={{ color: '#dc2626', fontSize: '12px', marginTop: '6px', fontWeight: 600 }}>
            {errors.gender}
          </div>
        )}
      </div>

      {/* Question 4: PM-AJAY Mandate Caste Confirmation */}
      <div
        style={{
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: isHighContrast ? '#1f2937' : '#fff7ed',
          border: `1.5px solid ${isHighContrast ? '#ff9933' : '#fed7aa'}`,
          borderRadius: '6px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="jm-badge jm-badge-saffron" style={{ fontSize: '10px' }}>
            PM-AJAY पात्रता / Eligibility
          </span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: isHighContrast ? '#ff9933' : '#9a3412' }}>
            अनुसूचित जाति वर्ग / Scheduled Caste Focus
          </span>
        </div>
        <p style={{ fontSize: '13px', lineHeight: 1.5, color: isHighContrast ? '#f3f4f6' : '#451a03', margin: 0 }}>
          यह योजना विशेष रूप से अनुसूचित जाति (SC) परिवारों के आजीविका संवर्धन हेतु लक्षित है।
          (This platform prioritizes Scheduled Caste beneficiaries for capital toolkits and training grants under PM-AJAY).
        </p>
      </div>

      {/* Question 5: Mobile Number for Updates */}
      <div style={{ marginBottom: '16px' }}>
        <label
          htmlFor="contactNumber"
          style={{
            display: 'block',
            fontSize: '15px',
            fontWeight: 700,
            color: isHighContrast ? '#ffffff' : '#0c2340',
            marginBottom: '6px',
          }}
        >
          मोबाइल नंबर / Mobile Number (वैकल्पिक / Optional)
        </label>
        <p style={{ fontSize: '12.5px', color: isHighContrast ? '#d1d5db' : '#64748b', marginBottom: '8px' }}>
          कौशल शिविर एवं योजना सूचना संदेश हेतु (For training camp alerts & scheme updates)
        </p>

        <input
          id="contactNumber"
          type="tel"
          maxLength={10}
          value={data.contactNumber}
          onChange={(e) => updateField('contactNumber', e.target.value.replace(/\D/g, ''))}
          placeholder="उदा. 9876543210"
          style={{
            width: '100%',
            maxWidth: '320px',
            padding: '12px 14px',
            fontSize: '15px',
            borderRadius: '4px',
            border: `1.5px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
            backgroundColor: isHighContrast ? '#111827' : '#ffffff',
            color: isHighContrast ? '#ffffff' : '#0f172a',
            outline: 'none',
          }}
        />
      </div>
    </div>
  );
};
