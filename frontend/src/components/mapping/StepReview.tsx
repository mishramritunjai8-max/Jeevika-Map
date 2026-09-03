import React from 'react';
import type { BeneficiaryFormData } from '../../types/mapping';

interface StepReviewProps {
  data: BeneficiaryFormData;
  onEditStep: (stepNumber: number) => void;
  onGenerateProfile: () => void;
  isHighContrast?: boolean;
  isSubmitting?: boolean;
  submissionError?: string | null;
}

export const StepReview: React.FC<StepReviewProps> = ({
  data,
  onEditStep,
  onGenerateProfile,
  isHighContrast = false,
  isSubmitting = false,
  submissionError = null,
}) => {
  const sections = [
    {
      step: 1,
      titleHi: '1. मूलभूत जानकारी',
      titleEn: 'Basic Information',
      items: [
        { label: 'पूरा नाम / Name', value: data.basicInfo.fullName || '—' },
        { label: 'आयु / Age', value: data.basicInfo.age ? `${data.basicInfo.age} वर्ष (Years)` : '—' },
        { label: 'लिंग / Gender', value: data.basicInfo.gender ? data.basicInfo.gender.toUpperCase() : '—' },
        { label: 'वर्ग / Category', value: 'अनुसूचित जाति (Scheduled Caste - PM-AJAY)' },
        { label: 'मोबाइल / Contact', value: data.basicInfo.contactNumber || 'Not provided' },
      ],
    },
    {
      step: 2,
      titleHi: '2. वर्तमान कौशल',
      titleEn: 'Existing Skills',
      items: [
        { label: 'मुख्य कौशल / Primary Trade', value: data.existingSkills.primarySkill || '—' },
        { label: 'औजार प्रवीणता / Tool Proficiency', value: data.existingSkills.toolProficiency.replace('_', ' ') },
        { label: 'RPL प्रमाणीकरण / RPL Certification', value: data.existingSkills.rplInterest ? 'हाँ (Yes, Opted)' : 'नहीं (No)' },
      ],
    },
    {
      step: 3,
      titleHi: '3. कार्य अनुभव',
      titleEn: 'Work Experience',
      items: [
        { label: 'कुल अनुभव / Experience', value: data.workExperience.yearsExperience ? data.workExperience.yearsExperience.replace(/_/g, ' ') : '—' },
        { label: 'वर्तमान कार्य / Occupation', value: data.workExperience.currentTrade || '—' },
        { label: 'मासिक आय / Current Income', value: data.workExperience.monthlyIncomeRange || '—' },
        { label: 'प्रकृति / Seasonality', value: data.workExperience.isSeasonal ? 'मौसमी कार्य (Seasonal)' : 'नियमित (Continuous)' },
      ],
    },
    {
      step: 4,
      titleHi: '4. आजीविका रुचि',
      titleEn: 'Livelihood Interests',
      items: [
        {
          label: 'लक्षित क्षेत्र / Target Sectors',
          value: data.livelihoodInterests.targetSectors.length > 0
            ? data.livelihoodInterests.targetSectors.join(', ')
            : 'None selected',
        },
        { label: 'प्रशिक्षण इच्छा / Training Enrolment', value: data.livelihoodInterests.trainingInterest ? 'हाँ (Interested)' : 'नहीं (No)' },
      ],
    },
    {
      step: 5,
      titleHi: '5. शिक्षा एवं साक्षरता',
      titleEn: 'Education & Literacy',
      items: [
        { label: 'औपचारिक शिक्षा / Formal Level', value: data.education.formalLevel ? data.education.formalLevel.replace(/_/g, ' ') : '—' },
        { label: 'मातृभाषा साक्षरता / Regional Literacy', value: data.education.canReadWriteVernacular ? 'हाँ (Yes)' : 'नहीं (No)' },
        { label: 'स्मार्टफोन उपयोग / Smartphone Usage', value: data.education.smartphoneUsage === 'regular' ? 'नियमित (Regular UPI/Apps)' : 'केवल कॉल (Basic calls)' },
      ],
    },
    {
      step: 6,
      titleHi: '6. स्थान एवं क्षेत्र',
      titleEn: 'Location & Geography',
      items: [
        { label: 'राज्य / State', value: data.location.state },
        { label: 'जिला / District', value: data.location.district || '—' },
        { label: 'ब्लॉक / पंचायत (Block / GP)', value: data.location.block || '—' },
        { label: 'क्षेत्र / Area Type', value: data.location.areaType === 'rural' ? 'ग्रामीण (Rural)' : 'शहरी/कस्बा' },
      ],
    },
    {
      step: 7,
      titleHi: '7. सीमाएं एवं उपलब्धता',
      titleEn: 'Constraints & Mobility',
      items: [
        { label: 'आवागमन दूरी / Mobility', value: data.constraints.mobilityRange.replace(/_/g, ' ') },
        { label: 'पारिवारिक देखभाल / Caregiver', value: data.constraints.caregiverResponsibilities ? 'हाँ (Has caregiver duties)' : 'नहीं (No)' },
        { label: 'प्रशिक्षण सहायता / Stipend Need', value: data.constraints.financialConstraint.replace(/_/g, ' ') },
      ],
    },
    {
      step: 8,
      titleHi: '8. भविष्य की आकांक्षाएं',
      titleEn: 'Future Aspirations',
      items: [
        { label: 'पसंदीदा मॉडल / Model Preference', value: data.aspirations.employmentPreference ? data.aspirations.employmentPreference.replace(/_/g, ' ') : '—' },
        { label: 'लक्षित आय / Target Income', value: data.aspirations.targetMonthlyIncome },
        { label: 'टूलकिट अनुदान / Toolkit Subsidy', value: data.aspirations.needsToolkitFinancing ? 'हाँ, PM-AJAY सहायता चाहिए' : 'नहीं' },
        { label: 'विशेष टिप्पणी / Voice Note', value: data.aspirations.additionalVoiceNote || 'None' },
      ],
    },
  ];

  return (
    <div>
      {/* Review Header Banner */}
      <div
        style={{
          backgroundColor: isHighContrast ? '#111827' : '#f0fdf4',
          border: `1.5px solid ${isHighContrast ? '#22c55e' : '#bbf7d0'}`,
          borderRadius: '6px',
          padding: '20px',
          marginBottom: '28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span className="jm-badge jm-badge-green">समीक्षा एवं पुष्टि / Review & Verification</span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#15803d' }}>
            सभी 8 चरण पूर्ण / All 8 Steps Completed
          </span>
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: isHighContrast ? '#ffffff' : '#0c2340', marginBottom: '4px' }}>
          कृपया अपनी आजीविका जानकारी की पुष्टि करें (Verify Details)
        </h2>
        <p style={{ fontSize: '13.5px', color: isHighContrast ? '#d1d5db' : '#334155', margin: 0 }}>
          यदि किसी जानकारी में बदलाव करना हो, तो संबंधित कार्ड के "सुधारें / Edit" बटन पर क्लिक करें।
          (Click "Edit" on any section below if you wish to amend answers before generating your profile).
        </p>
      </div>

      {/* Grid of 8 Review Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '18px',
          marginBottom: '36px',
        }}
      >
        {sections.map((sec) => (
          <div
            key={sec.step}
            style={{
              backgroundColor: isHighContrast ? '#111827' : '#ffffff',
              border: `1px solid ${isHighContrast ? '#4b5563' : '#cbd5e1'}`,
              borderRadius: '6px',
              padding: '18px',
              boxShadow: isHighContrast ? 'none' : '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: `1px solid ${isHighContrast ? '#374151' : '#f1f5f9'}`,
                paddingBottom: '10px',
                marginBottom: '12px',
              }}
            >
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0c2340' }}>
                  {sec.titleHi}
                </div>
                <div style={{ fontSize: '11px', color: isHighContrast ? '#9ca3af' : '#64748b' }}>
                  {sec.titleEn}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onEditStep(sec.step)}
                style={{
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: isHighContrast ? '#ff9933' : '#c2410c',
                  padding: '4px 8px',
                  borderRadius: '3px',
                  border: `1px solid ${isHighContrast ? '#ff9933' : '#fed7aa'}`,
                  backgroundColor: isHighContrast ? '#374151' : '#fff7ed',
                  cursor: 'pointer',
                }}
              >
                सुधारें / Edit
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sec.items.map((it, idx) => (
                <div key={idx} style={{ fontSize: '12px', lineHeight: 1.4 }}>
                  <span style={{ color: isHighContrast ? '#9ca3af' : '#64748b', display: 'block', fontSize: '11px' }}>
                    {it.label}
                  </span>
                  <strong style={{ color: isHighContrast ? '#ffffff' : '#1e293b' }}>
                    {it.value}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Primary Action: Generate My Livelihood Profile */}
      <div
        style={{
          padding: '24px',
          backgroundColor: isHighContrast ? '#111827' : '#ffffff',
          borderRadius: '6px',
          border: `2px solid ${isHighContrast ? '#22c55e' : '#15803d'}`,
          textAlign: 'center',
          boxShadow: isHighContrast ? 'none' : '0 4px 12px rgba(21, 128, 61, 0.12)',
        }}
      >
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: isHighContrast ? '#ffffff' : '#0c2340', marginBottom: '8px' }}>
          मेरी आजीविका प्रोफाइल बनाएं / Generate My Livelihood Profile
        </h3>
        <p style={{ fontSize: '13.5px', color: isHighContrast ? '#d1d5db' : '#475569', maxWidth: '620px', margin: '0 auto 20px' }}>
          इस जानकारी के आधार पर पीएम-अजय एनएसक्यूएफ कौशल योग्यता पैक, स्थानीय औद्योगिक मांग एवं सरकारी सहायता पैकेज का मिलान किया जाएगा।
        </p>

        {submissionError && (
          <div
            role="alert"
            style={{
              maxWidth: '620px',
              margin: '0 auto 18px',
              padding: '12px 16px',
              borderRadius: '4px',
              backgroundColor: isHighContrast ? '#7f1d1d' : '#fef2f2',
              border: `1px solid ${isHighContrast ? '#ef4444' : '#fca5a5'}`,
              color: isHighContrast ? '#ffffff' : '#991b1b',
              fontSize: '13px',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span>⚠️</span>
            <div>
              <strong>त्रुटि (Submission Issue):</strong> {submissionError}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onGenerateProfile}
          disabled={isSubmitting}
          className="jm-btn jm-btn-saffron"
          style={{
            padding: '14px 32px',
            fontSize: '16px',
            fontWeight: 800,
            borderRadius: '4px',
            letterSpacing: '0.01em',
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? 'wait' : 'pointer',
          }}
        >
          {isSubmitting ? (
            <>
              <span
                style={{
                  display: 'inline-block',
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255,255,255,0.4)',
                  borderTopColor: '#ffffff',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              />
              <span>डेटाबेस में सुरक्षित किया जा रहा है... (Registering in Supabase...)</span>
            </>
          ) : (
            <>
              <span>मेरी आजीविका प्रोफाइल बनाएं / Generate My Profile</span>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 10h10M11 6l4 4-4 4" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
