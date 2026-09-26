import React, { useState, useMemo, useCallback } from 'react';
import { useSpeechRecognition, type SpeechRecognitionStatus } from '../../hooks/useSpeechRecognition';
import { useAccessibility } from '../../context/useAccessibility';
import type { BeneficiaryFormData } from '../../types/mapping';

export interface VoiceAssistantPanelProps {
  formData: BeneficiaryFormData;
  setFormData: React.Dispatch<React.SetStateAction<BeneficiaryFormData>>;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

export interface ExtractedFormEntities {
  fullName?: string;
  yearsExperienceKey?: 'less_than_1' | '1_to_3_years' | '4_to_7_years' | '8_plus_years';
  yearsExperienceDisplay?: string;
  primarySkill?: string;
  district?: string;
  age?: string;
  gender?: 'male' | 'female' | 'other';
}

export const VoiceAssistantPanel: React.FC<VoiceAssistantPanelProps> = ({
  formData,
  setFormData,
  currentStep,
  setCurrentStep,
}) => {
  const { isHighContrast } = useAccessibility();
  const [selectedLang, setSelectedLang] = useState<'auto' | 'hi-IN' | 'en-IN'>('hi-IN');
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(true);
  const [capturedTranscript, setCapturedTranscript] = useState<string>('');
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  // Deterministic rule-based parser for obvious, high-confidence items
  const parseTranscript = useCallback((rawText: string): ExtractedFormEntities => {
    const text = rawText.trim();
    if (!text) return {};

    const entities: ExtractedFormEntities = {};
    const lowerText = text.toLowerCase();

    // 1. Name Parsing (High Confidence)
    // Matches: "मेरा नाम [नाम] है", "नाम: [नाम]", "my name is [Name]", "i am [Name]"
    const hiNameMatch = text.match(/(?:मेरा\s+नाम|नाम\s+है|नाम)\s+([^\s,।.]+)(?:\s+([^\s,।.]+))?/u);
    if (hiNameMatch) {
      const p1 = hiNameMatch[1];
      const p2 = hiNameMatch[2];
      const stopWords = ['है', 'हूँ', 'का', 'की', 'के', 'और', 'एक', 'में', 'से', 'hai', 'hu', 'aur'];
      if (p1 && !stopWords.includes(p1.toLowerCase())) {
        let name = p1;
        if (p2 && !stopWords.includes(p2.toLowerCase())) {
          name += ' ' + p2;
        }
        entities.fullName = name.trim();
      }
    } else {
      const enNameMatch = text.match(/(?:my\s+name\s+is|i\s+am|myself)\s+([a-zA-Z]+)(?:\s+([a-zA-Z]+))?/i);
      if (enNameMatch) {
        const p1 = enNameMatch[1];
        const p2 = enNameMatch[2];
        const stopWords = ['a', 'an', 'the', 'from', 'in', 'and', 'working', 'living', 'with'];
        if (p1 && !stopWords.includes(p1.toLowerCase())) {
          let name = p1;
          if (p2 && !stopWords.includes(p2.toLowerCase())) {
            name += ' ' + p2;
          }
          entities.fullName = name.trim();
        }
      }
    }

    // 2. Experience Parsing (High Confidence)
    // Numbers: 1 to 30, both digits and Hindi words
    const numMap: Record<string, number> = {
      'एक': 1, 'one': 1, 'दो': 2, 'two': 2, 'तीन': 3, 'three': 3,
      'चार': 4, 'four': 4, 'पांच': 5, 'पाँच': 5, 'five': 5, 'छह': 6, 'छः': 6, 'six': 6,
      'सात': 7, 'seven': 7, 'आठ': 8, 'eight': 8, 'नौ': 9, 'nine': 9, 'दस': 10, 'ten': 10,
      'बारह': 12, 'पंद्रह': 15, 'बीस': 20,
    };

    let detectedYears: number | null = null;
    const digitExpMatch = text.match(/(\d{1,2})\s*(?:साल|वर्ष|year|years)/i);
    if (digitExpMatch) {
      detectedYears = parseInt(digitExpMatch[1], 10);
    } else {
      const wordExpMatch = text.match(/(एक|दो|तीन|चार|पांच|पाँच|छह|छः|सात|आठ|नौ|दस|one|two|three|four|five|six|seven|eight|nine|ten)\s*(?:साल|वर्ष|year|years)/i);
      if (wordExpMatch) {
        const word = wordExpMatch[1].toLowerCase();
        detectedYears = numMap[word] ?? null;
      }
    }

    if (detectedYears !== null && detectedYears >= 0 && detectedYears <= 60) {
      if (detectedYears < 1) {
        entities.yearsExperienceKey = 'less_than_1';
        entities.yearsExperienceDisplay = `${detectedYears} वर्ष (1 वर्ष से कम)`;
      } else if (detectedYears <= 3) {
        entities.yearsExperienceKey = '1_to_3_years';
        entities.yearsExperienceDisplay = `${detectedYears} वर्ष (1 से 3 वर्ष)`;
      } else if (detectedYears <= 7) {
        entities.yearsExperienceKey = '4_to_7_years';
        entities.yearsExperienceDisplay = `${detectedYears} वर्ष (4 से 7 वर्ष)`;
      } else {
        entities.yearsExperienceKey = '8_plus_years';
        entities.yearsExperienceDisplay = `${detectedYears} वर्ष (8+ वर्ष)`;
      }
    }

    // 3. Primary Skill Parsing (High Confidence Mapping)
    if (
      lowerText.includes('बुनाई') ||
      lowerText.includes('करघा') ||
      lowerText.includes('हथकरघा') ||
      lowerText.includes('weaving') ||
      lowerText.includes('handloom') ||
      lowerText.includes('loom')
    ) {
      entities.primarySkill = 'हथकरघा बुनाई';
    } else if (
      lowerText.includes('सिलाई') ||
      lowerText.includes('कढ़ाई') ||
      lowerText.includes('दर्जी') ||
      lowerText.includes('tailor') ||
      lowerText.includes('tailoring') ||
      lowerText.includes('stitching')
    ) {
      entities.primarySkill = 'सिलाई एवं कढ़ाई';
    } else if (
      lowerText.includes('खेती') ||
      lowerText.includes('कृषि') ||
      lowerText.includes('किसान') ||
      lowerText.includes('फसल') ||
      lowerText.includes('farming') ||
      lowerText.includes('agriculture') ||
      lowerText.includes('organic')
    ) {
      entities.primarySkill = 'अनाज छंटाई व प्रसंस्करण';
    } else if (
      lowerText.includes('सोलर') ||
      lowerText.includes('सौर') ||
      lowerText.includes('solar')
    ) {
      entities.primarySkill = 'सोलर पीवी इंस्टालेशन';
    } else if (
      lowerText.includes('बिजली') ||
      lowerText.includes('विद्युत') ||
      lowerText.includes('electric') ||
      lowerText.includes('electrician') ||
      lowerText.includes('वायरिंग')
    ) {
      entities.primarySkill = 'विद्युत एवं पंप मरम्मत';
    } else if (
      lowerText.includes('बढ़ई') ||
      lowerText.includes('लकड़ी') ||
      lowerText.includes('carpenter') ||
      lowerText.includes('carpentry')
    ) {
      entities.primarySkill = 'बढ़ईगीरी / काष्ठ शिल्प';
    } else if (
      lowerText.includes('राजमिस्त्री') ||
      lowerText.includes('मिस्त्री') ||
      lowerText.includes('चिनाई') ||
      lowerText.includes('mason') ||
      lowerText.includes('masonry')
    ) {
      entities.primarySkill = 'राजमिस्त्री / निर्माण';
    } else if (
      lowerText.includes('चमड़ा') ||
      lowerText.includes('जूता') ||
      lowerText.includes('leather') ||
      lowerText.includes('footwear')
    ) {
      entities.primarySkill = 'चर्म शिल्प एवं जूता निर्माण';
    } else if (
      lowerText.includes('कुम्हार') ||
      lowerText.includes('मिट्टी') ||
      lowerText.includes('pottery') ||
      lowerText.includes('clay')
    ) {
      entities.primarySkill = 'कुम्हारी / मृदा शिल्प';
    } else if (
      lowerText.includes('लोहार') ||
      lowerText.includes('वेल्डिंग') ||
      lowerText.includes('blacksmith') ||
      lowerText.includes('welding')
    ) {
      entities.primarySkill = 'लोहार / वेल्डिंग';
    }

    // 4. District Location Parsing
    const knownDistricts: Record<string, string> = {
      'वाराणसी': 'Varanasi', 'varanasi': 'Varanasi', 'बनारस': 'Varanasi', 'banaras': 'Varanasi', 'kashi': 'Varanasi',
      'लखनऊ': 'Lucknow', 'lucknow': 'Lucknow',
      'प्रयागराज': 'Prayagraj', 'prayagraj': 'Prayagraj', 'इलाहाबाद': 'Prayagraj', 'allahabad': 'Prayagraj',
      'गोरखपुर': 'Gorakhpur', 'gorakhpur': 'Gorakhpur',
      'मिर्जापुर': 'Mirzapur', 'mirzapur': 'Mirzapur',
      'चंदौली': 'Chandauli', 'chandauli': 'Chandauli',
      'गाजीपुर': 'Ghazipur', 'ghazipur': 'Ghazipur',
      'जौनपुर': 'Jaunpur', 'jaunpur': 'Jaunpur',
      'आजमगढ़': 'Azamgarh', 'azamgarh': 'Azamgarh',
      'अयोध्या': 'Ayodhya', 'ayodhya': 'Ayodhya', 'फैजाबाद': 'Ayodhya', 'faizabad': 'Ayodhya',
      'सीतापुर': 'Sitapur', 'sitapur': 'Sitapur',
      'सोनभद्र': 'Sonbhadra', 'sonbhadra': 'Sonbhadra',
      'कानपुर': 'Kanpur', 'kanpur': 'Kanpur',
    };

    for (const [key, dist] of Object.entries(knownDistricts)) {
      if (lowerText.includes(key.toLowerCase())) {
        entities.district = dist;
        break;
      }
    }

    // 5. Age Parsing
    const ageMatch = text.match(/(?:मेरी\s+उम्र|आयु|उम्र|age\s+is|i\s+am)\s*(?:है\s*)?(\d{2})/i);
    if (ageMatch) {
      const parsedAge = parseInt(ageMatch[1], 10);
      if (parsedAge >= 15 && parsedAge <= 85) {
        entities.age = String(parsedAge);
      }
    }

    // 6. Gender Parsing
    if (lowerText.includes('महिला') || lowerText.includes('स्त्री') || lowerText.includes('female') || lowerText.includes('woman')) {
      entities.gender = 'female';
    } else if (lowerText.includes('पुरुष') || lowerText.includes('आदमी') || lowerText.includes('male') || lowerText.includes('man')) {
      entities.gender = 'male';
    }

    return entities;
  }, []);

  const { status, transcript, errorMessage, isSupported, startListening, stopListening } =
    useSpeechRecognition({
      onResult: (capturedText) => {
        setCapturedTranscript(capturedText);
        setAppliedNotice(null);
      },
    });

  const activeTranscript = capturedTranscript || transcript;
  const extractedEntities = useMemo(
    () => parseTranscript(activeTranscript),
    [activeTranscript, parseTranscript]
  );

  const handleToggleListening = () => {
    if (status === 'listening') {
      stopListening();
    } else {
      setAppliedNotice(null);
      startListening(selectedLang);
    }
  };

  const handleApplyInformation = () => {
    if (!extractedEntities) return;

    setFormData((prev) => {
      const updated: BeneficiaryFormData = {
        ...prev,
        basicInfo: {
          ...prev.basicInfo,
          fullName: extractedEntities.fullName || prev.basicInfo.fullName,
          age: extractedEntities.age || prev.basicInfo.age,
          gender: extractedEntities.gender || prev.basicInfo.gender,
        },
        existingSkills: {
          ...prev.existingSkills,
          primarySkill: extractedEntities.primarySkill || prev.existingSkills.primarySkill,
        },
        workExperience: {
          ...prev.workExperience,
          yearsExperience: extractedEntities.yearsExperienceKey || prev.workExperience.yearsExperience,
        },
        location: {
          ...prev.location,
          district: extractedEntities.district || prev.location.district,
        },
      };
      return updated;
    });

    const appliedFieldsCount = Object.keys(extractedEntities).length;
    setAppliedNotice(
      `✓ ${appliedFieldsCount} विवरण फॉर्म में सफलतापूर्वक भर दिए गए हैं! (Information applied to form)`
    );
  };

  const hasExtractedData =
    extractedEntities && Object.keys(extractedEntities).length > 0;

  const renderStatusBadge = (st: SpeechRecognitionStatus) => {
    switch (st) {
      case 'listening':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#dc2626', fontWeight: 700, fontSize: '12px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#dc2626', animation: 'pulseSlow 1s infinite' }} />
            सुन रहे हैं... (Listening...)
          </span>
        );
      case 'processing':
        return (
          <span style={{ color: '#c2410c', fontWeight: 600, fontSize: '12px' }}>
            ⏳ संसाधित हो रहा है... (Processing speech...)
          </span>
        );
      case 'captured':
      case 'idle':
        if (capturedTranscript) {
          return (
            <span style={{ color: '#15803d', fontWeight: 700, fontSize: '12px' }}>
              ✓ आवाज़ पहचानी गई (Speech Captured)
            </span>
          );
        }
        return (
          <span style={{ color: isHighContrast ? '#d1d5db' : '#64748b', fontSize: '12px' }}>
            तैयार (Ready)
          </span>
        );
      case 'unsupported':
      default:
        return (
          <span style={{ color: '#b91c1c', fontSize: '12px', fontWeight: 600 }}>
            असमर्थित ब्राउज़र (Unsupported)
          </span>
        );
    }
  };

  return (
    <aside
      aria-label="AI Voice Assistant Panel"
      style={{
        backgroundColor: isHighContrast ? '#111827' : '#ffffff',
        border: `1.5px solid ${isHighContrast ? '#ff9933' : '#cbd5e1'}`,
        borderTop: `4px solid ${isHighContrast ? '#ff9933' : '#c2410c'}`,
        borderRadius: '6px',
        padding: '16px 20px',
        marginBottom: '22px',
        boxShadow: isHighContrast ? 'none' : '0 2px 6px rgba(12, 35, 64, 0.05)',
      }}
    >
      {/* Header Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: isPanelOpen ? '12px' : '0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '4px',
              backgroundColor: isHighContrast ? '#374151' : '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              border: `1px solid ${isHighContrast ? '#ff9933' : '#cbd5e1'}`,
            }}
          >
            🎙️
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: isHighContrast ? '#ffffff' : '#0c2340', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>आवाज़ सहायक</span>
              <span style={{ color: '#c2410c', fontWeight: 600, fontSize: '13px' }}>• Voice Assistant</span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  backgroundColor: '#dbeafe',
                  color: '#1e40af',
                  padding: '1px 6px',
                  borderRadius: '3px',
                }}
              >
                GIGW ACCESSIBLE
              </span>
            </div>
            <div style={{ fontSize: '11.5px', color: isHighContrast ? '#9ca3af' : '#64748b' }}>
              अपनी आजीविका और काम के अनुभव के बारे में अपनी भाषा में बताएं।
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Status Indicator */}
          {renderStatusBadge(status)}

          {/* Toggle Panel Accordion */}
          <button
            type="button"
            onClick={() => setIsPanelOpen((prev) => !prev)}
            aria-expanded={isPanelOpen}
            style={{
              background: 'none',
              border: `1px solid ${isHighContrast ? '#4b5563' : '#cbd5e1'}`,
              borderRadius: '4px',
              padding: '4px 10px',
              fontSize: '11.5px',
              fontWeight: 600,
              color: isHighContrast ? '#ffffff' : '#0c2340',
              cursor: 'pointer',
            }}
          >
            {isPanelOpen ? 'छुपाएं (Hide) ▲' : 'खोलें (Open) ▼'}
          </button>
        </div>
      </div>

      {isPanelOpen && (
        <div style={{ borderTop: `1px solid ${isHighContrast ? '#374151' : '#f1f5f9'}`, paddingTop: '14px', marginTop: '4px' }}>
          {!isSupported ? (
            <div
              role="alert"
              style={{
                padding: '10px 14px',
                backgroundColor: isHighContrast ? '#1f2937' : '#fef2f2',
                border: '1px solid #fca5a5',
                borderRadius: '4px',
                fontSize: '12.5px',
                color: '#b91c1c',
              }}
            >
              ⚠️ Voice input is not supported in this browser. Please use the manual form below. (इस ब्राउज़र में आवाज़ पहचान समर्थित नहीं है। कृपया नीचे दिया गया फॉर्म भरें।)
            </div>
          ) : (
            <>
              {/* Controls & Action Row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Microphone Trigger Button */}
                  <button
                    type="button"
                    onClick={handleToggleListening}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      borderRadius: '4px',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      border: status === 'listening' ? '2px solid #dc2626' : '1px solid #c2410c',
                      backgroundColor: status === 'listening' ? '#dc2626' : '#c2410c',
                      color: '#ffffff',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {status === 'listening' ? (
                      <>
                        <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ffffff', animation: 'pulseSlow 1s infinite' }} />
                        <span>सुनना बंद करें (Stop Listening)</span>
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: '15px' }}>🎙️</span>
                        <span>बोलना शुरू करें (Start Speaking)</span>
                      </>
                    )}
                  </button>

                  {/* Language Selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: isHighContrast ? '#d1d5db' : '#475569' }}>
                    <span style={{ fontWeight: 600 }}>भाषा / Language:</span>
                    <button
                      type="button"
                      onClick={() => setSelectedLang('hi-IN')}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '3px',
                        fontSize: '11.5px',
                        fontWeight: selectedLang === 'hi-IN' ? 800 : 500,
                        border: selectedLang === 'hi-IN' ? '1.5px solid #0c2340' : '1px solid #cbd5e1',
                        backgroundColor: selectedLang === 'hi-IN' ? '#0c2340' : '#ffffff',
                        color: selectedLang === 'hi-IN' ? '#ffffff' : '#0c2340',
                        cursor: 'pointer',
                      }}
                    >
                      हिन्दी (hi-IN)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedLang('en-IN')}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '3px',
                        fontSize: '11.5px',
                        fontWeight: selectedLang === 'en-IN' ? 800 : 500,
                        border: selectedLang === 'en-IN' ? '1.5px solid #0c2340' : '1px solid #cbd5e1',
                        backgroundColor: selectedLang === 'en-IN' ? '#0c2340' : '#ffffff',
                        color: selectedLang === 'en-IN' ? '#ffffff' : '#0c2340',
                        cursor: 'pointer',
                      }}
                    >
                      English (en-IN)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedLang('auto')}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '3px',
                        fontSize: '11.5px',
                        fontWeight: selectedLang === 'auto' ? 800 : 500,
                        border: selectedLang === 'auto' ? '1.5px solid #0c2340' : '1px solid #cbd5e1',
                        backgroundColor: selectedLang === 'auto' ? '#0c2340' : '#ffffff',
                        color: selectedLang === 'auto' ? '#ffffff' : '#0c2340',
                        cursor: 'pointer',
                      }}
                    >
                      Auto (स्वतः)
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: '11.5px', color: isHighContrast ? '#9ca3af' : '#64748b' }}>
                  उदाहरण: <em>"मेरा नाम रमेश है, मुझे हथकरघा बुनाई का 5 साल का अनुभव है और मैं वाराणसी से हूँ"</em>
                </div>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div
                  role="alert"
                  style={{
                    padding: '8px 12px',
                    borderRadius: '4px',
                    backgroundColor: isHighContrast ? '#1f2937' : '#fee2e2',
                    border: '1px solid #fca5a5',
                    color: '#b91c1c',
                    fontSize: '12px',
                    marginBottom: '10px',
                  }}
                >
                  ⚠️ {errorMessage}
                </div>
              )}

              {/* Transcript Display Box */}
              {capturedTranscript && (
                <div
                  style={{
                    backgroundColor: isHighContrast ? '#1f2937' : '#f8fafc',
                    border: `1px solid ${isHighContrast ? '#374151' : '#e2e8f0'}`,
                    borderRadius: '4px',
                    padding: '12px 14px',
                    marginBottom: '14px',
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: 700, color: isHighContrast ? '#9ca3af' : '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                    ध्वनि प्रतिलेख (Captured Transcript):
                  </div>
                  <div style={{ fontSize: '13.5px', color: isHighContrast ? '#ffffff' : '#0f172a', lineHeight: 1.5, fontStyle: 'italic' }}>
                    "{capturedTranscript}"
                  </div>
                </div>
              )}

              {/* Detected Information & Confirmation Card */}
              {capturedTranscript && (
                <div
                  style={{
                    backgroundColor: isHighContrast ? '#1f2937' : (hasExtractedData ? '#f0fdf4' : '#fffbeb'),
                    border: `1px solid ${isHighContrast ? '#374151' : (hasExtractedData ? '#bbf7d0' : '#fde68a')}`,
                    borderRadius: '4px',
                    padding: '12px 16px',
                    marginBottom: '12px',
                  }}
                >
                  {hasExtractedData ? (
                    <div>
                      <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#15803d', marginBottom: '8px' }}>
                        हमने यह जानकारी समझी (Identified Form Information):
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px', marginBottom: '12px' }}>
                        {extractedEntities?.fullName && (
                          <div style={{ fontSize: '12px', color: isHighContrast ? '#ffffff' : '#0f172a' }}>
                            <strong style={{ color: '#15803d' }}>✓ नाम (Name):</strong> {extractedEntities.fullName}
                            {formData.basicInfo.fullName && (
                              <span style={{ fontSize: '11px', color: '#64748b' }}> (मौजूदा: {formData.basicInfo.fullName})</span>
                            )}
                          </div>
                        )}
                        {extractedEntities?.yearsExperienceDisplay && (
                          <div style={{ fontSize: '12px', color: isHighContrast ? '#ffffff' : '#0f172a' }}>
                            <strong style={{ color: '#15803d' }}>✓ अनुभव (Experience):</strong> {extractedEntities.yearsExperienceDisplay}
                          </div>
                        )}
                        {extractedEntities?.primarySkill && (
                          <div style={{ fontSize: '12px', color: isHighContrast ? '#ffffff' : '#0f172a' }}>
                            <strong style={{ color: '#15803d' }}>✓ मुख्य कौशल (Skill):</strong> {extractedEntities.primarySkill}
                            {formData.existingSkills.primarySkill && (
                              <span style={{ fontSize: '11px', color: '#64748b' }}> (मौजूदा: {formData.existingSkills.primarySkill})</span>
                            )}
                          </div>
                        )}
                        {extractedEntities?.district && (
                          <div style={{ fontSize: '12px', color: isHighContrast ? '#ffffff' : '#0f172a' }}>
                            <strong style={{ color: '#15803d' }}>✓ जिला (District):</strong> {extractedEntities.district}
                            {formData.location.district && (
                              <span style={{ fontSize: '11px', color: '#64748b' }}> (मौजूदा: {formData.location.district})</span>
                            )}
                          </div>
                        )}
                        {extractedEntities?.age && (
                          <div style={{ fontSize: '12px', color: isHighContrast ? '#ffffff' : '#0f172a' }}>
                            <strong style={{ color: '#15803d' }}>✓ आयु (Age):</strong> {extractedEntities.age} वर्ष
                          </div>
                        )}
                        {extractedEntities?.gender && (
                          <div style={{ fontSize: '12px', color: isHighContrast ? '#ffffff' : '#0f172a' }}>
                            <strong style={{ color: '#15803d' }}>✓ लिंग (Gender):</strong> {extractedEntities.gender === 'female' ? 'महिला (Female)' : 'पुरुष (Male)'}
                          </div>
                        )}
                      </div>

                      {/* Apply Button */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                          type="button"
                          onClick={handleApplyInformation}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#15803d',
                            color: '#ffffff',
                            borderRadius: '4px',
                            border: 'none',
                            fontSize: '12.5px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <span>✓</span>
                          <span>जानकारी इस्तेमाल करें (Apply Information to Form)</span>
                        </button>
                        <span style={{ fontSize: '11px', color: isHighContrast ? '#9ca3af' : '#64748b' }}>
                          यह जानकारी नीचे दिए गए फॉर्म में जोड़ दी जाएगी। आप इसे कभी भी बदल सकते हैं।
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '12px', color: isHighContrast ? '#fde68a' : '#b45309', lineHeight: 1.5 }}>
                      हम आपकी बात सुन पाए, लेकिन कोई स्पष्ट फॉर्म जानकारी नहीं मिली। कृपया स्पष्ट नाम, कौशल या अनुभव बोलें, या नीचे दिए गए फॉर्म में सीधे जानकारी भरें।
                      <div style={{ marginTop: '4px', fontSize: '11px', color: isHighContrast ? '#d1d5db' : '#78350f' }}>
                        (We heard speech, but could not confidently extract structured fields. Please repeat with details like "मेरा नाम..." or "मुझे ... का 5 साल का अनुभव है".)
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Success Notification Banner */}
              {appliedNotice && (
                <div
                  role="status"
                  aria-live="polite"
                  style={{
                    padding: '10px 14px',
                    borderRadius: '4px',
                    backgroundColor: '#dcfce7',
                    border: '1px solid #86efac',
                    color: '#15803d',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    marginBottom: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div>{appliedNotice}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: 600 }}>
                      <span style={{ color: '#166534' }}>समीक्षा हेतु चरण चुनें (View step):</span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        style={{
                          padding: '2px 8px',
                          borderRadius: '3px',
                          border: currentStep === 1 ? '1.5px solid #15803d' : '1px solid #86efac',
                          backgroundColor: currentStep === 1 ? '#bbf7d0' : '#ffffff',
                          color: '#166534',
                          cursor: 'pointer',
                        }}
                      >
                        चरण 1 (मूल जानकारी)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        style={{
                          padding: '2px 8px',
                          borderRadius: '3px',
                          border: currentStep === 2 ? '1.5px solid #15803d' : '1px solid #86efac',
                          backgroundColor: currentStep === 2 ? '#bbf7d0' : '#ffffff',
                          color: '#166534',
                          cursor: 'pointer',
                        }}
                      >
                        चरण 2 (कौशल)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        style={{
                          padding: '2px 8px',
                          borderRadius: '3px',
                          border: currentStep === 3 ? '1.5px solid #15803d' : '1px solid #86efac',
                          backgroundColor: currentStep === 3 ? '#bbf7d0' : '#ffffff',
                          color: '#166534',
                          cursor: 'pointer',
                        }}
                      >
                        चरण 3 (अनुभव)
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </aside>
  );
};
