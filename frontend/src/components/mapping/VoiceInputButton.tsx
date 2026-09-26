import React, { useState } from 'react';
import { useSpeechRecognition, type SpeechRecognitionStatus } from '../../hooks/useSpeechRecognition';

interface VoiceInputButtonProps {
  onTranscriptCaptured: (text: string) => void;
  language?: string;
  isHighContrast?: boolean;
  fieldLabel?: string;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscriptCaptured,
  language = 'hi-IN',
  isHighContrast = false,
  fieldLabel,
}) => {
  const [selectedLang, setSelectedLang] = useState<string>(language);

  const { status, transcript, errorMessage, isSupported, startListening, stopListening } =
    useSpeechRecognition({
      onResult: (capturedText) => {
        onTranscriptCaptured(capturedText);
      },
    });

  const handleClick = () => {
    if (status === 'listening') {
      stopListening();
    } else if (status === 'idle') {
      startListening(selectedLang);
    }
  };

  const renderContent = (st: SpeechRecognitionStatus) => {
    switch (st) {
      case 'listening':
        return (
          <>
            <span
              style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#dc2626',
                animation: 'pulseSlow 1s infinite',
              }}
            />
            <span>सुन रहे हैं... (Listening... बोलें)</span>
          </>
        );
      case 'processing':
        return (
          <>
            <span style={{ fontSize: '13px' }}>⏳</span>
            <span>संसाधित हो रहा है... (Processing speech...)</span>
          </>
        );
      case 'captured':
        return (
          <>
            <span style={{ color: '#15803d', fontWeight: 800 }}>✓</span>
            <span>पहचाना गया! (Captured: "{transcript.slice(0, 24)}...")</span>
          </>
        );
      case 'unsupported':
        return (
          <>
            <span style={{ opacity: 0.6 }}>🎙️✕</span>
            <span>आवाज़ पहचान उपलब्ध नहीं (Use keyboard)</span>
          </>
        );
      case 'idle':
      default:
        return (
          <>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
            <span>बोलकर उत्तर दें / Speak Answer</span>
          </>
        );
    }
  };

  return (
    <div style={{ marginTop: '8px', marginBottom: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <button
          type="button"
          onClick={handleClick}
          disabled={!isSupported || status === 'processing'}
          aria-label={fieldLabel ? `Speak your answer for ${fieldLabel}` : 'Speak your answer'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            borderRadius: '4px',
            fontSize: '12.5px',
            fontWeight: 600,
            border: status === 'listening'
              ? '1.5px solid #dc2626'
              : `1px solid ${isHighContrast ? '#ff9933' : '#cbd5e1'}`,
            backgroundColor: status === 'listening'
              ? (isHighContrast ? '#450a0a' : '#fef2f2')
              : (isHighContrast ? '#1f2937' : '#ffffff'),
            color: status === 'listening'
              ? '#dc2626'
              : (isHighContrast ? '#ffffff' : '#0c2340'),
            cursor: isSupported ? 'pointer' : 'not-allowed',
            boxShadow: isHighContrast ? 'none' : '0 1px 2px rgba(0,0,0,0.04)',
            transition: 'all 0.15s ease',
          }}
        >
          {renderContent(status)}
        </button>

        {/* Compact Speech Language Selector */}
        {isSupported && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 4px',
              borderRadius: '4px',
              backgroundColor: isHighContrast ? '#1f2937' : '#f1f5f9',
              border: `1px solid ${isHighContrast ? '#374151' : '#e2e8f0'}`,
              fontSize: '11px',
            }}
          >
            <button
              type="button"
              onClick={() => setSelectedLang('hi-IN')}
              title="हिन्दी में बोलें (Hindi Devanagari speech recognition)"
              style={{
                background: selectedLang === 'hi-IN' || selectedLang === 'hi' ? (isHighContrast ? '#374151' : '#ffffff') : 'transparent',
                color: selectedLang === 'hi-IN' || selectedLang === 'hi' ? (isHighContrast ? '#ff9933' : '#0c2340') : (isHighContrast ? '#9ca3af' : '#64748b'),
                border: selectedLang === 'hi-IN' || selectedLang === 'hi' ? '1px solid #cbd5e1' : 'none',
                borderRadius: '3px',
                padding: '2px 6px',
                fontSize: '11px',
                fontWeight: selectedLang === 'hi-IN' || selectedLang === 'hi' ? 700 : 500,
                cursor: 'pointer',
              }}
            >
              हिन्दी
            </button>
            <button
              type="button"
              onClick={() => setSelectedLang('en-IN')}
              title="Speak in English"
              style={{
                background: selectedLang === 'en-IN' || selectedLang === 'en' ? (isHighContrast ? '#374151' : '#ffffff') : 'transparent',
                color: selectedLang === 'en-IN' || selectedLang === 'en' ? (isHighContrast ? '#ff9933' : '#0c2340') : (isHighContrast ? '#9ca3af' : '#64748b'),
                border: selectedLang === 'en-IN' || selectedLang === 'en' ? '1px solid #cbd5e1' : 'none',
                borderRadius: '3px',
                padding: '2px 6px',
                fontSize: '11px',
                fontWeight: selectedLang === 'en-IN' || selectedLang === 'en' ? 700 : 500,
                cursor: 'pointer',
              }}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setSelectedLang('auto')}
              title="Auto detect based on app language"
              style={{
                background: selectedLang === 'auto' ? (isHighContrast ? '#374151' : '#ffffff') : 'transparent',
                color: selectedLang === 'auto' ? (isHighContrast ? '#ff9933' : '#0c2340') : (isHighContrast ? '#9ca3af' : '#64748b'),
                border: selectedLang === 'auto' ? '1px solid #cbd5e1' : 'none',
                borderRadius: '3px',
                padding: '2px 6px',
                fontSize: '11px',
                fontWeight: selectedLang === 'auto' ? 700 : 500,
                cursor: 'pointer',
              }}
            >
              Auto
            </button>
          </div>
        )}
      </div>

      {/* Error or Speech Feedback Banner */}
      {errorMessage && (
        <div
          role="alert"
          style={{
            marginTop: '6px',
            fontSize: '11.5px',
            color: '#dc2626',
            lineHeight: 1.4,
          }}
        >
          {errorMessage}
        </div>
      )}

      {/* Voice Status Information Note */}
      <div
        style={{
          marginTop: '4px',
          fontSize: '11px',
          color: isHighContrast ? '#9ca3af' : '#64748b',
          lineHeight: 1.3,
        }}
      >
        <span>
          {isSupported
            ? '💡 हिंदी एवं भारतीय अंग्रेजी में बोलकर उत्तर दें (Browser Speech API • Keyboard entry always available)'
            : '⚠️ आपके ब्राउज़र में आवाज पहचान सुविधा उपलब्ध नहीं है। कृपया लिखकर उत्तर दें।'}
        </span>
      </div>

      <style>{`
        @keyframes pulseSlow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};
