import React from 'react';
import { VoiceInputButton } from './VoiceInputButton';
import type { ExistingSkillsState } from '../../types/mapping';

interface Step2Props {
  data: ExistingSkillsState;
  onChange: (data: ExistingSkillsState) => void;
  isHighContrast?: boolean;
  errors?: Record<string, string>;
}

export const Step2ExistingSkills: React.FC<Step2Props> = ({
  data,
  onChange,
  isHighContrast = false,
  errors = {},
}) => {
  const commonSkills = [
    { id: 'handloom', labelHi: 'हथकरघा बुनाई', labelEn: 'Handloom & Weaving' },
    { id: 'tailoring', labelHi: 'सिलाई एवं कढ़ाई', labelEn: 'Tailoring & Garments' },
    { id: 'carpentry', labelHi: 'बढ़ईगीरी / काष्ठ शिल्प', labelEn: 'Carpentry & Woodwork' },
    { id: 'masonry', labelHi: 'राजमिस्त्री / निर्माण', labelEn: 'Masonry & Construction' },
    { id: 'electrical', labelHi: 'विद्युत एवं पंप मरम्मत', labelEn: 'Electrical & Pump Repair' },
    { id: 'leather', labelHi: 'चर्म शिल्प एवं जूता निर्माण', labelEn: 'Leathercraft & Footwear' },
    { id: 'pottery', labelHi: 'कुम्हारी / मृदा शिल्प', labelEn: 'Pottery & Ceramics' },
    { id: 'agro', labelHi: 'अनाज छंटाई व प्रसंस्करण', labelEn: 'Agro & Seed Processing' },
    { id: 'metal', labelHi: 'लोहार / वेल्डिंग', labelEn: 'Blacksmithing & Welding' },
  ];

  const updateField = <K extends keyof ExistingSkillsState>(field: K, value: ExistingSkillsState[K]) => {
    onChange({ ...data, [field]: value });
  };

  const handleSelectSkill = (skillLabel: string) => {
    updateField('primarySkill', skillLabel);
  };

  return (
    <div>
      {/* Question 1: Primary Existing Skill */}
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
          आप वर्तमान में कौन सा मुख्य कार्य/कौशल जानते हैं? / What is your Primary Skill? <span style={{ color: '#dc2626' }}>*</span>
        </label>
        <p style={{ fontSize: '12.5px', color: isHighContrast ? '#d1d5db' : '#64748b', marginBottom: '12px' }}>
          नीचे दिए गए विकल्पों में से चुनें या बोलकर बताएं (Select from list or speak below)
        </p>

        {/* Large Touch Chips */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', marginBottom: '14px' }}>
          {commonSkills.map((skill) => {
            const isSelected = data.primarySkill.includes(skill.labelHi) || data.primarySkill === skill.labelHi;
            return (
              <button
                key={skill.id}
                type="button"
                onClick={() => handleSelectSkill(skill.labelHi)}
                style={{
                  minHeight: '52px',
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
                  gap: '8px',
                }}
              >
                <div>
                  <div style={{ fontSize: '13.5px' }}>{skill.labelHi}</div>
                  <div style={{ fontSize: '11px', opacity: 0.75 }}>{skill.labelEn}</div>
                </div>
                {isSelected && <span style={{ color: '#15803d', fontWeight: 800 }}>✓</span>}
              </button>
            );
          })}
        </div>

        {/* Custom Skill Input & Voice Input */}
        <div style={{ marginTop: '10px' }}>
          <span style={{ fontSize: '12.5px', fontWeight: 600, color: isHighContrast ? '#d1d5db' : '#475569' }}>
            या अपना कौशल लिखें / बोलें (Or enter/speak your skill):
          </span>
          <input
            type="text"
            value={data.primarySkill}
            onChange={(e) => updateField('primarySkill', e.target.value)}
            placeholder="उदा. बनारसी रेशमी साड़ी बुनाई / e.g. Silk saree jacquard weaving"
            style={{
              width: '100%',
              maxWidth: '520px',
              marginTop: '6px',
              padding: '12px 14px',
              fontSize: '14.5px',
              borderRadius: '4px',
              border: errors.primarySkill ? '2px solid #dc2626' : `1.5px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
              backgroundColor: isHighContrast ? '#111827' : '#ffffff',
              color: isHighContrast ? '#ffffff' : '#0f172a',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />

          <VoiceInputButton
            fieldLabel="Primary Skill"
            onTranscriptCaptured={(text) => updateField('primarySkill', text)}
            isHighContrast={isHighContrast}
          />
        </div>

        {errors.primarySkill && (
          <div role="alert" style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px', fontWeight: 600 }}>
            {errors.primarySkill}
          </div>
        )}
      </div>

      {/* Question 2: Tool Proficiency Level */}
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
          आप किन औजारों से कार्य करने में सहज हैं? / What tools are you familiar with?
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
          {[
            { id: 'manual_traditional', labelHi: 'पारंपरिक हाथ के औजार', labelEn: 'Traditional Manual Tools' },
            { id: 'power_tools', labelHi: 'विद्युत चालित औजार (Power Tools)', labelEn: 'Drills, Power Cutters, Grinders' },
            { id: 'basic_machinery', labelHi: 'मशीनरी एवं स्वचालित उपकरण', labelEn: 'Semi-Automatic / Motorized Machines' },
          ].map((tool) => {
            const isSelected = data.toolProficiency === tool.id;
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => updateField('toolProficiency', tool.id as any)} // eslint-disable-line @typescript-eslint/no-explicit-any
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
                }}
              >
                <div style={{ fontSize: '13px' }}>{tool.labelHi}</div>
                <div style={{ fontSize: '11px', opacity: 0.75 }}>{tool.labelEn}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Question 3: RPL Certification Interest */}
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
            id="rplInterest"
            type="checkbox"
            checked={data.rplInterest}
            onChange={(e) => updateField('rplInterest', e.target.checked)}
            style={{ width: '20px', height: '20px', marginTop: '2px', cursor: 'pointer' }}
          />
          <label htmlFor="rplInterest" style={{ cursor: 'pointer' }}>
            <strong style={{ fontSize: '14px', color: isHighContrast ? '#ffffff' : '#166534', display: 'block' }}>
              हाँ, मैं पूर्व कार्य अनुभव (RPL) के आधार पर सरकारी NSQF प्रमाणपत्र प्राप्त करना चाहता हूँ।
            </strong>
            <span style={{ fontSize: '12px', color: isHighContrast ? '#d1d5db' : '#334155' }}>
              Yes, I want government NSQF skill certification based on my existing practical work experience (Recognition of Prior Learning).
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};
