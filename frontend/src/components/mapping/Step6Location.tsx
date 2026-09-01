import React from 'react';
import { VoiceInputButton } from './VoiceInputButton';
import type { LocationState } from '../../types/mapping';

interface Step6Props {
  data: LocationState;
  onChange: (data: LocationState) => void;
  isHighContrast?: boolean;
  errors?: Record<string, string>;
}

export const Step6Location: React.FC<Step6Props> = ({
  data,
  onChange,
  isHighContrast = false,
  errors = {},
}) => {
  const updateField = <K extends keyof LocationState>(field: K, value: LocationState[K]) => {
    onChange({ ...data, [field]: value });
  };

  const priorityStates = [
    'Uttar Pradesh',
    'Rajasthan',
    'Madhya Pradesh',
    'Bihar',
    'Tamil Nadu',
    'Maharashtra',
    'Punjab',
    'West Bengal',
    'Andhra Pradesh',
    'Telangana',
    'Odisha',
    'Karnataka',
  ];

  return (
    <div>
      {/* Question 1: State Selection */}
      <div style={{ marginBottom: '24px' }}>
        <label
          htmlFor="stateSelect"
          style={{
            display: 'block',
            fontSize: '15px',
            fontWeight: 700,
            color: isHighContrast ? '#ffffff' : '#0c2340',
            marginBottom: '6px',
          }}
        >
          राज्य / State <span style={{ color: '#dc2626' }}>*</span>
        </label>

        <select
          id="stateSelect"
          value={data.state}
          onChange={(e) => updateField('state', e.target.value)}
          style={{
            width: '100%',
            maxWidth: '380px',
            padding: '12px 14px',
            fontSize: '15px',
            borderRadius: '4px',
            border: `1.5px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
            backgroundColor: isHighContrast ? '#111827' : '#ffffff',
            color: isHighContrast ? '#ffffff' : '#0f172a',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          {priorityStates.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* Question 2: District Name */}
      <div style={{ marginBottom: '24px' }}>
        <label
          htmlFor="districtName"
          style={{
            display: 'block',
            fontSize: '15px',
            fontWeight: 700,
            color: isHighContrast ? '#ffffff' : '#0c2340',
            marginBottom: '6px',
          }}
        >
          जिला / District <span style={{ color: '#dc2626' }}>*</span>
        </label>
        <p style={{ fontSize: '12.5px', color: isHighContrast ? '#d1d5db' : '#64748b', marginBottom: '8px' }}>
          अपने जिले का नाम लिखें या बोलकर बताएं (Enter or speak district name)
        </p>

        <input
          id="districtName"
          type="text"
          value={data.district}
          onChange={(e) => updateField('district', e.target.value)}
          placeholder="उदा. वाराणसी, नागौर, होशंगाबाद / e.g. Varanasi"
          style={{
            width: '100%',
            maxWidth: '480px',
            padding: '12px 14px',
            fontSize: '14.5px',
            borderRadius: '4px',
            border: errors.district ? '2px solid #dc2626' : `1.5px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
            backgroundColor: isHighContrast ? '#111827' : '#ffffff',
            color: isHighContrast ? '#ffffff' : '#0f172a',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />

        <VoiceInputButton
          fieldLabel="District"
          onTranscriptCaptured={(text) => updateField('district', text)}
          isHighContrast={isHighContrast}
        />

        {errors.district && (
          <div role="alert" style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px', fontWeight: 600 }}>
            {errors.district}
          </div>
        )}
      </div>

      {/* Question 3: Block / Gram Panchayat */}
      <div style={{ marginBottom: '24px' }}>
        <label
          htmlFor="blockName"
          style={{
            display: 'block',
            fontSize: '15px',
            fontWeight: 700,
            color: isHighContrast ? '#ffffff' : '#0c2340',
            marginBottom: '6px',
          }}
        >
          विकास खंड (ब्लॉक) या ग्राम पंचायत / Block or Gram Panchayat
        </label>

        <input
          id="blockName"
          type="text"
          value={data.block}
          onChange={(e) => updateField('block', e.target.value)}
          placeholder="उदा. पिंडरा, सेवापुरी / e.g. Sewapuri"
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
          fieldLabel="Block or Gram Panchayat"
          onTranscriptCaptured={(text) => updateField('block', text)}
          isHighContrast={isHighContrast}
        />
      </div>

      {/* Question 4: Area Type */}
      <div style={{ marginBottom: '16px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '15px',
            fontWeight: 700,
            color: isHighContrast ? '#ffffff' : '#0c2340',
            marginBottom: '8px',
          }}
        >
          क्षेत्र का प्रकार / Area Classification
        </label>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {[
            { id: 'rural', labelHi: 'ग्रामीण (गांव)', labelEn: 'Rural Village' },
            { id: 'semi_urban', labelHi: 'कस्बा / अर्ध-शहरी', labelEn: 'Semi-Urban / Peri-Urban' },
            { id: 'urban', labelHi: 'शहरी (नगर पालिका/निगम)', labelEn: 'Urban Municipality' },
          ].map((area) => {
            const isSelected = data.areaType === area.id;
            return (
              <button
                key={area.id}
                type="button"
                onClick={() => updateField('areaType', area.id as any)} // eslint-disable-line @typescript-eslint/no-explicit-any
                style={{
                  minHeight: '44px',
                  padding: '10px 18px',
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
                  fontSize: '13.5px',
                  cursor: 'pointer',
                }}
              >
                <span>{area.labelHi}</span>
                <span style={{ fontSize: '11px', opacity: 0.75, marginLeft: '6px' }}>({area.labelEn})</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
