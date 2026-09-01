import React from 'react';
import { VoiceInputButton } from './VoiceInputButton';
import type { WorkExperienceState } from '../../types/mapping';

interface Step3Props {
  data: WorkExperienceState;
  onChange: (data: WorkExperienceState) => void;
  isHighContrast?: boolean;
  errors?: Record<string, string>;
}

export const Step3WorkExperience: React.FC<Step3Props> = ({
  data,
  onChange,
  isHighContrast = false,
  errors = {},
}) => {
  const updateField = <K extends keyof WorkExperienceState>(field: K, value: WorkExperienceState[K]) => {
    onChange({ ...data, [field]: value });
  };

  const experienceOptions = [
    { value: 'less_than_1', labelHi: '1 वर्ष से कम / नया सीख रहे हैं', labelEn: 'Under 1 Year / Beginner' },
    { value: '1_to_3_years', labelHi: '1 से 3 वर्ष', labelEn: '1 to 3 Years' },
    { value: '4_to_7_years', labelHi: '4 से 7 वर्ष', labelEn: '4 to 7 Years' },
    { value: '8_plus_years', labelHi: '8 वर्ष या अधिक (अनुभवी कारीगर)', labelEn: '8+ Years (Experienced)' },
  ];

  const incomeOptions = [
    { value: 'under_5k', label: '₹5,000 से कम / Under ₹5,000' },
    { value: '5k_to_10k', label: '₹5,000 – ₹10,000' },
    { value: '10k_to_15k', label: '₹10,000 – ₹15,000' },
    { value: 'above_15k', label: '₹15,000 से अधिक / Above ₹15,000' },
  ];

  return (
    <div>
      {/* Question 1: Years of Experience */}
      <div style={{ marginBottom: '24px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '15px',
            fontWeight: 700,
            color: isHighContrast ? '#ffffff' : '#0c2340',
            marginBottom: '6px',
          }}
        >
          आपको इस कार्य का कुल कितना अनुभव है? / Total Work Experience <span style={{ color: '#dc2626' }}>*</span>
        </label>
        <p style={{ fontSize: '12.5px', color: isHighContrast ? '#d1d5db' : '#64748b', marginBottom: '10px' }}>
          औपचारिक या अनौपचारिक (Including informal and family trade experience)
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
          {experienceOptions.map((opt) => {
            const isSelected = data.yearsExperience === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateField('yearsExperience', opt.value)}
                style={{
                  minHeight: '48px',
                  padding: '10px 14px',
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
                  <div style={{ fontSize: '13px' }}>{opt.labelHi}</div>
                  <div style={{ fontSize: '11px', opacity: 0.75 }}>{opt.labelEn}</div>
                </div>
                {isSelected && <span style={{ color: '#15803d', fontWeight: 800 }}>✓</span>}
              </button>
            );
          })}
        </div>

        {errors.yearsExperience && (
          <div role="alert" style={{ color: '#dc2626', fontSize: '12px', marginTop: '6px', fontWeight: 600 }}>
            {errors.yearsExperience}
          </div>
        )}
      </div>

      {/* Question 2: Current Trade / Occupation Title */}
      <div style={{ marginBottom: '24px' }}>
        <label
          htmlFor="currentTrade"
          style={{
            display: 'block',
            fontSize: '15px',
            fontWeight: 700,
            color: isHighContrast ? '#ffffff' : '#0c2340',
            marginBottom: '6px',
          }}
        >
          वर्तमान में आप क्या काम करते हैं? / Current Occupation / Daily Wage Trade
        </label>

        <input
          id="currentTrade"
          type="text"
          value={data.currentTrade}
          onChange={(e) => updateField('currentTrade', e.target.value)}
          placeholder="उदा. दिहाड़ी बुनाई सहायक, सोलर पंप मिस्त्री / e.g. Loom assistant, Solar mechanic"
          style={{
            width: '100%',
            maxWidth: '480px',
            padding: '12px 14px',
            fontSize: '14.5px',
            borderRadius: '4px',
            border: `1.5px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
            backgroundColor: isHighContrast ? '#111827' : '#ffffff',
            color: isHighContrast ? '#ffffff' : '#0f172a',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />

        <VoiceInputButton
          fieldLabel="Current Occupation"
          onTranscriptCaptured={(text) => updateField('currentTrade', text)}
          isHighContrast={isHighContrast}
        />
      </div>

      {/* Question 3: Current Monthly Income */}
      <div style={{ marginBottom: '24px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '15px',
            fontWeight: 700,
            color: isHighContrast ? '#ffffff' : '#0c2340',
            marginBottom: '6px',
          }}
        >
          वर्तमान अनुमानित मासिक आय / Approximate Monthly Income Range
        </label>
        <p style={{ fontSize: '12.5px', color: isHighContrast ? '#d1d5db' : '#64748b', marginBottom: '10px' }}>
          यह जानकारी पीएम-अजय आर्थिक सहायता का निर्धारण करने में सहायक होगी। (Used to assess subsidy eligibility under PM-AJAY).
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          {incomeOptions.map((opt) => {
            const isSelected = data.monthlyIncomeRange === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateField('monthlyIncomeRange', opt.value)}
                style={{
                  minHeight: '44px',
                  padding: '10px 14px',
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
                  fontSize: '13px',
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question 4: Seasonality */}
      <div
        style={{
          padding: '16px',
          backgroundColor: isHighContrast ? '#1f2937' : '#f8fafc',
          border: `1px solid ${isHighContrast ? '#4b5563' : '#e2e8f0'}`,
          borderRadius: '6px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <input
            id="isSeasonal"
            type="checkbox"
            checked={data.isSeasonal}
            onChange={(e) => updateField('isSeasonal', e.target.checked)}
            style={{ width: '20px', height: '20px', marginTop: '2px', cursor: 'pointer' }}
          />
          <label htmlFor="isSeasonal" style={{ cursor: 'pointer' }}>
            <strong style={{ fontSize: '14px', color: isHighContrast ? '#ffffff' : '#0c2340', display: 'block' }}>
              क्या आपका कार्य मौसमी (Seasonal) है?
            </strong>
            <span style={{ fontSize: '12px', color: isHighContrast ? '#d1d5db' : '#64748b' }}>
              (जैसे केवल कटाई के समय या कुछ महीनों में ही काम मिलता है / Work stops during certain seasons)
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};
