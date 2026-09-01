import React from 'react';
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
      startListening(language);
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
            ? '💡 Browser Speech API prototype: Hindi & Indian English supported. Keyboard entry is always available.'
            : '⚠️ Your browser does not support the Web Speech API. Please enter your response using the text box.'}
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
