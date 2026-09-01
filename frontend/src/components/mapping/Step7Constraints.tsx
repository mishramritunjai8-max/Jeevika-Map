import React from 'react';
import type { ConstraintsState, MobilityRangeType } from '../../types/mapping';

interface Step7Props {
  data: ConstraintsState;
  onChange: (data: ConstraintsState) => void;
  isHighContrast?: boolean;
}

export const Step7Constraints: React.FC<Step7Props> = ({
  data,
  onChange,
  isHighContrast = false,
}) => {
  const updateField = <K extends keyof ConstraintsState>(field: K, value: ConstraintsState[K]) => {
    onChange({ ...data, [field]: value });
  };

  const mobilityOptions: { id: MobilityRangeType; labelHi: string; labelEn: string }[] = [
    { id: 'within_village', labelHi: 'केवल गांव या घर के समीप', labelEn: 'Within Village / Home Vicinity' },
    { id: 'within_block', labelHi: 'ब्लॉक स्तर तक (10–15 किमी)', labelEn: 'Within Block (10–15 km daily commute)' },
    { id: 'within_district', labelHi: 'जिला मुख्यालय / औद्योगिक केंद्र', labelEn: 'Within District Center / Industrial Hub' },
    { id: 'nearby_districts', labelHi: 'पड़ोसी जिलों या राज्य में कहीं भी', labelEn: 'Nearby Districts / Ready to Relocate' },
  ];

  return (
    <div>
      {/* Question 1: Mobility Range */}
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
          कार्य या प्रशिक्षण हेतु आप कितनी दूर तक आवागमन कर सकते हैं? / Geographic Mobility Range
        </label>
        <p style={{ fontSize: '12.5px', color: isHighContrast ? '#d1d5db' : '#64748b', marginBottom: '12px' }}>
          यह नजदीकी प्रशिक्षण केंद्र और स्थानीय रोजगार चयन में सहायक होगा (Helps map closest training partner)
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
          {mobilityOptions.map((opt) => {
            const isSelected = data.mobilityRange === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => updateField('mobilityRange', opt.id)}
                style={{
                  minHeight: '52px',
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
                  <div style={{ fontSize: '13.5px' }}>{opt.labelHi}</div>
                  <div style={{ fontSize: '11px', opacity: 0.75 }}>{opt.labelEn}</div>
                </div>
                {isSelected && <span style={{ color: '#15803d', fontWeight: 800 }}>✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question 2: Caregiver Responsibilities */}
      <div style={{ marginBottom: '24px' }}>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px',
            borderRadius: '4px',
            backgroundColor: isHighContrast ? '#1f2937' : '#f8fafc',
            border: `1px solid ${isHighContrast ? '#4b5563' : '#e2e8f0'}`,
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={data.caregiverResponsibilities}
            onChange={(e) => updateField('caregiverResponsibilities', e.target.checked)}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          <div>
            <strong style={{ fontSize: '13.5px', color: isHighContrast ? '#ffffff' : '#0c2340', display: 'block' }}>
              परिवार में छोटे बच्चों या बुजुर्गों की नियमित देखभाल की जिम्मेदारी है
            </strong>
            <span style={{ fontSize: '12px', color: isHighContrast ? '#d1d5db' : '#64748b' }}>
              (Primary caregiver at home — prefer flexible timings or home-based micro-enterprise)
            </span>
          </div>
        </label>
      </div>

      {/* Question 3: Financial situation during training */}
      <div style={{ marginBottom: '16px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '15px',
            fontWeight: 700,
            color: isHighContrast ? '#ffffff' : '#0c2340',
            marginBottom: '6px',
          }}
        >
          प्रशिक्षण के दौरान आर्थिक स्थिति / Training Period Financial Need
        </label>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            {
              id: 'needs_immediate_daily_wage',
              labelHi: 'प्रतिदिन दिहाड़ी आवश्यक है (कम अवधि या ऑन-द-जॉब प्रशिक्षण चाहिए)',
              labelEn: 'Needs immediate daily earning (short-term / earn-and-learn)',
            },
            {
              id: 'can_attend_stipended_training',
              labelHi: 'सरकारी मानदेय/छात्रवृत्ति के साथ 1 से 3 माह प्रशिक्षण ले सकते हैं',
              labelEn: 'Can attend 1–3 month course if stipend/hostel is supported under PM-AJAY',
            },
          ].map((fin) => {
            const isSelected = data.financialConstraint === fin.id;
            return (
              <button
                key={fin.id}
                type="button"
                onClick={() => updateField('financialConstraint', fin.id as any)} // eslint-disable-line @typescript-eslint/no-explicit-any
                style={{
                  minHeight: '44px',
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
                  fontSize: '13px',
                }}
              >
                <div>{fin.labelHi}</div>
                <div style={{ fontSize: '11px', opacity: 0.75 }}>{fin.labelEn}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
