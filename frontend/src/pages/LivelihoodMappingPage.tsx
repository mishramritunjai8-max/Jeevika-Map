import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../context/useAccessibility';
import { Step1BasicInfo } from '../components/mapping/Step1BasicInfo';
import { Step2ExistingSkills } from '../components/mapping/Step2ExistingSkills';
import { Step3WorkExperience } from '../components/mapping/Step3WorkExperience';
import { Step4LivelihoodInterests } from '../components/mapping/Step4LivelihoodInterests';
import { Step5Education } from '../components/mapping/Step5Education';
import { Step6Location } from '../components/mapping/Step6Location';
import { Step7Constraints } from '../components/mapping/Step7Constraints';
import { Step8Aspirations } from '../components/mapping/Step8Aspirations';
import { StepReview } from '../components/mapping/StepReview';
import { VoiceAssistantPanel } from '../components/mapping/VoiceAssistantPanel';
import {
  INITIAL_BENEFICIARY_DATA,
  type BeneficiaryFormData,
} from '../types/mapping';
import { submitLivelihoodMapping } from '../services/beneficiaryService';

const LOCAL_STORAGE_DRAFT_KEY = 'jeevika_mapping_draft';
const LOCAL_STORAGE_PROFILE_KEY = 'jeevika_beneficiary_profile';

const STEP_TITLES = [
  { step: 1, titleHi: '1. मूलभूत जानकारी', titleEn: 'Basic Information' },
  { step: 2, titleHi: '2. वर्तमान कौशल एवं औजार', titleEn: 'Existing Skills & Tools' },
  { step: 3, titleHi: '3. कार्य अनुभव एवं आय', titleEn: 'Work Experience & Current Income' },
  { step: 4, titleHi: '4. आजीविका रुचि एवं क्षेत्र', titleEn: 'Livelihood Sectors of Interest' },
  { step: 5, titleHi: '5. शिक्षा एवं डिजिटल साक्षरता', titleEn: 'Education & Digital Literacy' },
  { step: 6, titleHi: '6. स्थान एवं क्षेत्र विवरण', titleEn: 'Location & Geography' },
  { step: 7, titleHi: '7. सीमाएं एवं आवागमन दूरी', titleEn: 'Constraints & Mobility Range' },
  { step: 8, titleHi: '8. भविष्य की आकांक्षाएं एवं टूलकिट', titleEn: 'Future Aspirations & Toolkits' },
  { step: 9, titleHi: '9. समीक्षा एवं अंतिम पुष्टि', titleEn: 'Review & Verification' },
];

export const LivelihoodMappingPage: React.FC = () => {
  const { isHighContrast } = useAccessibility();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [formData, setFormData] = useState<BeneficiaryFormData>(() => {
    try {
      const savedDraft = localStorage.getItem(LOCAL_STORAGE_DRAFT_KEY);
      return savedDraft ? JSON.parse(savedDraft) : INITIAL_BENEFICIARY_DATA;
    } catch (e) {
      console.warn('Could not read draft from localStorage', e);
      return INITIAL_BENEFICIARY_DATA;
    }
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasRestoredDraft, setHasRestoredDraft] = useState<boolean>(() => {
    try {
      return Boolean(localStorage.getItem(LOCAL_STORAGE_DRAFT_KEY));
    } catch {
      return false;
    }
  });

  // Autosave to localStorage on formData change (pure external side-effect)
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_DRAFT_KEY, JSON.stringify(formData));
    } catch (e) {
      console.warn('Could not autosave draft', e);
    }
  }, [formData]);

  const handleResetDraft = () => {
    if (window.confirm('क्या आप फॉर्म रीसेट करना चाहते हैं? (Are you sure you want to clear all entered data?)')) {
      localStorage.removeItem(LOCAL_STORAGE_DRAFT_KEY);
      setFormData(INITIAL_BENEFICIARY_DATA);
      setCurrentStep(1);
      setErrors({});
      setHasRestoredDraft(false);
    }
  };

  // Step Validation Logic
  const validateCurrentStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!formData.basicInfo.fullName.trim()) {
        errs.fullName = 'कृपया अपना नाम दर्ज करें (Full Name is required)';
      }
      const ageNum = parseInt(formData.basicInfo.age, 10);
      if (!formData.basicInfo.age || isNaN(ageNum) || ageNum < 15 || ageNum > 85) {
        errs.age = 'कृपया वैध आयु (15 से 85 वर्ष) दर्ज करें (Valid Age is required)';
      }
      if (!formData.basicInfo.gender) {
        errs.gender = 'कृपया लिंग का चयन करें (Gender selection is required)';
      }
    } else if (step === 2) {
      if (!formData.existingSkills.primarySkill.trim()) {
        errs.primarySkill = 'कृपया मुख्य कौशल चुनें या लिखें (Primary Skill is required)';
      }
    } else if (step === 3) {
      if (!formData.workExperience.yearsExperience) {
        errs.yearsExperience = 'कृपया अनुभव अवधि का चयन करें (Work experience duration is required)';
      }
    } else if (step === 4) {
      if (formData.livelihoodInterests.targetSectors.length === 0) {
        errs.targetSectors = 'कम से कम एक क्षेत्र का चयन करें (Select at least one sector of interest)';
      }
    } else if (step === 5) {
      if (!formData.education.formalLevel) {
        errs.formalLevel = 'कृपया शिक्षा स्तर का चयन करें (Education level is required)';
      }
    } else if (step === 6) {
      if (!formData.location.district.trim()) {
        errs.district = 'कृपया जिले का नाम दर्ज करें (District is required)';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep(currentStep)) {
      setErrors({});
      setCurrentStep((prev) => Math.min(prev + 1, 9));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditStep = (stepNumber: number) => {
    setCurrentStep(stepNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerateProfile = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const result = await submitLivelihoodMapping(formData);

      if (!result.success) {
        setSubmissionError(
          result.error || 'डेटाबेस में सुरक्षित करने में समस्या आई। कृपया पुनः प्रयास करें। (Submission failed).'
        );
        setIsSubmitting(false);
        return;
      }

      // Store completed profile along with generated DB IDs and recommendations
      const profileWithMetadata = {
        ...formData,
        meta: {
          beneficiaryId: result.beneficiaryId,
          livelihoodProfileId: result.livelihoodProfileId,
          recommendations: result.recommendations,
          actionPlan: result.actionPlan,
          submittedAt: new Date().toISOString(),
        },
      };

      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(profileWithMetadata));
      // Clear ongoing draft
      localStorage.removeItem(LOCAL_STORAGE_DRAFT_KEY);

      // Navigate to /profile without sensitive query parameters
      console.log('[Submission] Navigation to /profile initiated with Beneficiary ID:', result.beneficiaryId);
      navigate('/profile');
    } catch (e) {
      console.error('Error saving beneficiary profile:', e);
      setSubmissionError('नेटवर्क त्रुटि: सर्वर से संपर्क नहीं हो सका। कृपया पुनः प्रयास करें।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStepMeta = STEP_TITLES.find((s) => s.step === currentStep) || STEP_TITLES[0];
  const progressPercent = Math.round(((currentStep - 1) / 8) * 100);

  return (
    <div style={{ paddingBottom: '48px' }}>
      {/* Draft Notification Banner */}
      {hasRestoredDraft && (
        <div
          role="status"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            padding: '10px 16px',
            borderRadius: '4px',
            backgroundColor: isHighContrast ? '#1f2937' : '#eff6ff',
            border: `1px solid ${isHighContrast ? '#60a5fa' : '#bfdbfe'}`,
            marginBottom: '18px',
            fontSize: '12.5px',
            color: isHighContrast ? '#ffffff' : '#1e3a8a',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>💾</span>
            <span>
              <strong>प्रारूप बहाल किया गया (Draft Restored):</strong> आपके द्वारा पहले भरा गया विवरण स्थानीय रूप से सुरक्षित था।
            </span>
          </div>
          <button
            type="button"
            onClick={handleResetDraft}
            style={{
              padding: '2px 8px',
              fontSize: '11.5px',
              fontWeight: 600,
              borderRadius: '3px',
              border: `1px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
              backgroundColor: isHighContrast ? '#374151' : '#ffffff',
              color: isHighContrast ? '#ffffff' : '#b91c1c',
              cursor: 'pointer',
            }}
          >
            नया फॉर्म शुरू करें (Clear)
          </button>
        </div>
      )}

      {/* Main Guided Header Card */}
      <div
        style={{
          backgroundColor: isHighContrast ? '#111827' : '#ffffff',
          border: `1px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
          borderRadius: '6px',
          padding: '22px',
          marginBottom: '20px',
          boxShadow: isHighContrast ? 'none' : '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
          <div>
            <span className="jm-badge jm-badge-saffron" style={{ marginBottom: '6px' }}>
              {currentStep <= 8 ? `चरण ${currentStep} / 8 • Step ${currentStep} of 8` : 'चरण 9 / 9 • Final Review'}
            </span>
            <h1
              style={{
                fontSize: '22px',
                fontWeight: 800,
                color: isHighContrast ? '#ffffff' : '#0c2340',
                margin: '4px 0 2px',
              }}
            >
              {currentStepMeta.titleHi}
            </h1>
            <div style={{ fontSize: '13px', color: isHighContrast ? '#ff9933' : '#c2410c', fontWeight: 600 }}>
              {currentStepMeta.titleEn}
            </div>
          </div>

          {/* Autosave Status */}
          <div style={{ textAlign: 'right', fontSize: '11.5px', color: isHighContrast ? '#9ca3af' : '#64748b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#15803d' }} />
              <span>स्थानीय रूप से सुरक्षित (Autosaved to device)</span>
            </div>
            <span style={{ opacity: 0.8 }}>ब्राउज़र स्टोरेज में सुरक्षित</span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Mapping progress"
          style={{
            height: '8px',
            backgroundColor: isHighContrast ? '#374151' : '#e2e8f0',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${currentStep === 9 ? 100 : progressPercent}%`,
              backgroundColor: currentStep === 9 ? '#15803d' : '#c2410c',
              transition: 'width 0.3s ease-in-out',
            }}
          />
        </div>
      </div>

      {/* Voice Assistant Panel */}
      <VoiceAssistantPanel
        formData={formData}
        setFormData={setFormData}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />

      {/* Step Content Container */}
      <div
        style={{
          backgroundColor: isHighContrast ? '#111827' : '#ffffff',
          border: `1.5px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
          borderRadius: '6px',
          padding: '28px 24px',
          marginBottom: '24px',
          boxShadow: isHighContrast ? 'none' : '0 2px 5px rgba(0,0,0,0.02)',
        }}
      >
        {currentStep === 1 && (
          <Step1BasicInfo
            data={formData.basicInfo}
            onChange={(basicInfo) => setFormData((prev) => ({ ...prev, basicInfo }))}
            isHighContrast={isHighContrast}
            errors={errors}
          />
        )}

        {currentStep === 2 && (
          <Step2ExistingSkills
            data={formData.existingSkills}
            onChange={(existingSkills) => setFormData((prev) => ({ ...prev, existingSkills }))}
            isHighContrast={isHighContrast}
            errors={errors}
          />
        )}

        {currentStep === 3 && (
          <Step3WorkExperience
            data={formData.workExperience}
            onChange={(workExperience) => setFormData((prev) => ({ ...prev, workExperience }))}
            isHighContrast={isHighContrast}
            errors={errors}
          />
        )}

        {currentStep === 4 && (
          <Step4LivelihoodInterests
            data={formData.livelihoodInterests}
            onChange={(livelihoodInterests) => setFormData((prev) => ({ ...prev, livelihoodInterests }))}
            isHighContrast={isHighContrast}
            errors={errors}
          />
        )}

        {currentStep === 5 && (
          <Step5Education
            data={formData.education}
            onChange={(education) => setFormData((prev) => ({ ...prev, education }))}
            isHighContrast={isHighContrast}
            errors={errors}
          />
        )}

        {currentStep === 6 && (
          <Step6Location
            data={formData.location}
            onChange={(location) => setFormData((prev) => ({ ...prev, location }))}
            isHighContrast={isHighContrast}
            errors={errors}
          />
        )}

        {currentStep === 7 && (
          <Step7Constraints
            data={formData.constraints}
            onChange={(constraints) => setFormData((prev) => ({ ...prev, constraints }))}
            isHighContrast={isHighContrast}
          />
        )}

        {currentStep === 8 && (
          <Step8Aspirations
            data={formData.aspirations}
            onChange={(aspirations) => setFormData((prev) => ({ ...prev, aspirations }))}
            isHighContrast={isHighContrast}
          />
        )}

        {currentStep === 9 && (
          <StepReview
            data={formData}
            onEditStep={handleEditStep}
            onGenerateProfile={handleGenerateProfile}
            isHighContrast={isHighContrast}
            isSubmitting={isSubmitting}
            submissionError={submissionError}
          />
        )}
      </div>

      {/* Guided Step Navigation Bar (Steps 1-8) */}
      {currentStep <= 8 && (
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
          {/* Back Button */}
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 600,
              borderRadius: '4px',
              border: `1px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
              backgroundColor: isHighContrast ? '#1f2937' : '#ffffff',
              color: currentStep === 1 ? '#94a3b8' : (isHighContrast ? '#ffffff' : '#0c2340'),
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              opacity: currentStep === 1 ? 0.5 : 1,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 10H5M9 14l-4-4 4-4" />
            </svg>
            <span>पीछे जाएँ / Previous Step</span>
          </button>

          {/* Step Indicator text */}
          <span style={{ fontSize: '13px', fontWeight: 600, color: isHighContrast ? '#d1d5db' : '#64748b' }}>
            चरण {currentStep} / 8 • Step {currentStep} of 8
          </span>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            className="jm-btn jm-btn-primary"
            style={{
              padding: '10px 24px',
              fontSize: '14.5px',
              fontWeight: 700,
              minHeight: '44px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>{currentStep === 8 ? 'समीक्षा करें एवं पुष्टि करें / Review (Step 9)' : 'आगे बढ़ें / Next Step'}</span>
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 10h10M11 6l4 4-4 4" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};
