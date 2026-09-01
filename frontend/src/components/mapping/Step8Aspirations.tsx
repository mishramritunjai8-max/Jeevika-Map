import React from 'react';
import { VoiceInputButton } from './VoiceInputButton';
import type { AspirationsState, EmploymentPreferenceType } from '../../types/mapping';

interface Step8Props {
  data: AspirationsState;
  onChange: (data: AspirationsState) => void;
  isHighContrast?: boolean;
}

export const Step8Aspirations: React.FC<Step8Props> = ({
  data,
  onChange,
  isHighContrast = false,
}) => {
  const updateField = <K extends keyof AspirationsState>(field: K, value: AspirationsState[K]) => {
    onChange({ ...data, [field]: value });
  };

  const workPreferences: { id: EmploymentPreferenceType; labelHi: string; labelEn: string; icon: string }[] = [
    { id: 'micro_enterprise', labelHi: 'स्वयं की स्वतंत्र दुकान / उद्यम', labelEn: 'Individual Micro-Enterprise / Workshop', icon: '🏪' },
    { id: 'shg_cooperative', labelHi: 'समूह / स्वयं सहायता समूह (SHG)', labelEn: 'Group Enterprise / Producer Cooperative', icon: '👥' },
    { id: 'wage_employment', labelHi: 'वेतनभोगी नौकरी (कंपनी/उद्योग)', labelEn: 'Salaried Wage Employment in Factory/Company', icon: '💼' },
    { id: 'home_based_production', labelHi: 'घर से उत्पादन एवं आपूर्ति', labelEn: 'Home-based Craft / Job-work', icon: '🏡' },
  ];

  const incomeGoals = [
    '₹12,000 – ₹16,000 / month',
    '₹18,000 – ₹24,000 / month',
    '₹25,000 – ₹35,000 / month',
    '₹35,000+ / month',
  ];

  return (
    <div>
      {/* Question 1: Work Model Preference */}
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
          आप किस प्रकार का आजीविका मॉडल पसंद करते हैं? / Employment Model Preference
        </label>
        <p style={{ fontSize: '12.5px', color: isHighContrast ? '#d1d5db' : '#64748b', marginBottom: '12px' }}>
          पीएम-अजय अंतर्गत व्यक्तिगत टूलकिट अथवा समूह सामान्य सुविधा केंद्र (CFC) से जुड़ाव हेतु
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
          {workPreferences.map((pref) => {
            const isSelected = data.employmentPreference === pref.id;
            return (
              <button
                key={pref.id}
                type="button"
                onClick={() => updateField('employmentPreference', pref.id)}
                style={{
                  minHeight: '56px',
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
                  gap: '10px',
                }}
              >
                <span style={{ fontSize: '20px' }}>{pref.icon}</span>
                <div style={{ flexGrow: 1 }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 700 }}>{pref.labelHi}</div>
                  <div style={{ fontSize: '11px', opacity: 0.75 }}>{pref.labelEn}</div>
                </div>
                {isSelected && <span style={{ color: '#15803d', fontWeight: 800 }}>✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question 2: Target Monthly Income Goal */}
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
          कौशल उन्नयन के पश्चात आपकी अपेक्षित मासिक आय / Target Monthly Earning Goal
        </label>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {incomeGoals.map((goal) => {
            const isSelected = data.targetMonthlyIncome === goal;
            return (
              <button
                key={goal}
                type="button"
                onClick={() => updateField('targetMonthlyIncome', goal)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '4px',
                  border: isSelected
                    ? `2px solid ${isHighContrast ? '#ff9933' : '#15803d'}`
                    : `1px solid ${isHighContrast ? '#4b5563' : '#cbd5e1'}`,
                  backgroundColor: isSelected
                    ? (isHighContrast ? '#1f2937' : '#f0fdf4')
                    : (isHighContrast ? '#111827' : '#ffffff'),
                  color: isSelected
                    ? (isHighContrast ? '#ff9933' : '#15803d')
                    : (isHighContrast ? '#ffffff' : '#334155'),
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                {goal}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question 3: PM-AJAY Toolkit Subsidy Checkbox */}
      <div
        style={{
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: isHighContrast ? '#1f2937' : '#fff7ed',
          border: `1.5px solid ${isHighContrast ? '#ff9933' : '#fed7aa'}`,
          borderRadius: '6px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <input
            id="toolkitCheck"
            type="checkbox"
            checked={data.needsToolkitFinancing}
            onChange={(e) => updateField('needsToolkitFinancing', e.target.checked)}
            style={{ width: '20px', height: '20px', marginTop: '2px', cursor: 'pointer' }}
          />
          <label htmlFor="toolkitCheck" style={{ cursor: 'pointer' }}>
            <strong style={{ fontSize: '14px', color: isHighContrast ? '#ffffff' : '#9a3412', display: 'block' }}>
              हाँ, मुझे आधुनिक टूलकिट एवं प्रारंभिक कार्यशील पूंजी (PM-AJAY Capital Subsidy) की आवश्यकता है।
            </strong>
            <span style={{ fontSize: '12px', color: isHighContrast ? '#d1d5db' : '#451a03' }}>
              (Yes, I seek government capital grant support under PM-AJAY for purchasing certified tools & machinery upon certification).
            </span>
          </label>
        </div>
      </div>

      {/* Question 4: Free-form voice/text note */}
      <div style={{ marginBottom: '16px' }}>
        <label
          htmlFor="voiceNote"
          style={{
            display: 'block',
            fontSize: '15px',
            fontWeight: 700,
            color: isHighContrast ? '#ffffff' : '#0c2340',
            marginBottom: '6px',
          }}
        >
          कोई अन्य विशेष आवश्यकता या आकांक्षा? / Any Additional Notes or Aspirations?
        </label>
        <p style={{ fontSize: '12.5px', color: isHighContrast ? '#d1d5db' : '#64748b', marginBottom: '8px' }}>
          बोलकर या लिखकर बताएं (उदा. किस मशीन पर काम सीखना चाहते हैं)
        </p>

        <textarea
          id="voiceNote"
          rows={3}
          value={data.additionalVoiceNote}
          onChange={(e) => updateField('additionalVoiceNote', e.target.value)}
          placeholder="उदा. मुझे सोलर इन्वर्टर रिपेयरिंग सीखनी है और दुकान खोलने हेतु ऋण चाहिए..."
          style={{
            width: '100%',
            maxWidth: '560px',
            padding: '10px 12px',
            fontSize: '14px',
            borderRadius: '4px',
            border: `1.5px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
            backgroundColor: isHighContrast ? '#111827' : '#ffffff',
            color: isHighContrast ? '#ffffff' : '#0f172a',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />

        <VoiceInputButton
          fieldLabel="Additional Aspirations"
          onTranscriptCaptured={(text) =>
            updateField(
              'additionalVoiceNote',
              data.additionalVoiceNote ? `${data.additionalVoiceNote} ${text}` : text
            )
          }
          isHighContrast={isHighContrast}
        />
      </div>
    </div>
  );
};
