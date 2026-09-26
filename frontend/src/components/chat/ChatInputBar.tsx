import React, { useState, useRef, useEffect } from 'react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useAccessibility } from '../../context/useAccessibility';

interface ChatInputBarProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  isHighContrast?: boolean;
}

const LANGUAGE_DISPLAY_NAMES: Record<string, string> = {
  en: 'English',
  hi: 'हिन्दी / Hindi',
  mr: 'मराठी / Marathi',
  te: 'తెలుగు / Telugu',
  bn: 'বাংলা / Bengali',
};

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  onSendMessage,
  isLoading,
  isHighContrast = false,
}) => {
  const { currentLang } = useAccessibility();
  const [inputText, setInputText] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const prevTranscriptRef = useRef<string>('');

  const {
    status,
    transcript,
    interimTranscript,
    errorMessage,
    isSupported: isSpeechSupported,
    startListening,
    stopListening,
    reset,
  } = useSpeechRecognition();

  const isListening = status === 'listening';

  // Sync speech transcript into input when speech is captured
  useEffect(() => {
    if (transcript && transcript !== prevTranscriptRef.current) {
      prevTranscriptRef.current = transcript;
      setInputText((prev) => (prev ? `${prev.trim()} ${transcript}` : transcript));
    }
  }, [transcript]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || isLoading) return;

    if (isListening) {
      stopListening();
    }

    onSendMessage(trimmed);
    setInputText('');
    prevTranscriptRef.current = '';
    reset();

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape' && isListening) {
      stopListening();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    // Auto grow textarea up to max height
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(currentLang || 'en');
    }
  };

  const langDisplayName = LANGUAGE_DISPLAY_NAMES[currentLang] || 'English';

  return (
    <div
      style={{
        borderTop: `1px solid ${isHighContrast ? '#374151' : '#e2e8f0'}`,
        backgroundColor: isHighContrast ? '#111827' : '#ffffff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 1. Real-time Listening Indicator Banner */}
      {isListening && (
        <div
          role="status"
          aria-live="polite"
          style={{
            padding: '6px 14px',
            backgroundColor: isHighContrast ? '#450a0a' : '#fef2f2',
            borderBottom: `1px solid ${isHighContrast ? '#ef4444' : '#fecaca'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11.5px',
            color: '#dc2626',
            fontWeight: 600,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#dc2626',
                display: 'inline-block',
                animation: 'pulseDot 1.2s infinite',
                flexShrink: 0,
              }}
            />
            <span style={{ whiteSpace: 'nowrap' }}>
              सुन रहे हैं ({langDisplayName})...
            </span>
            {interimTranscript && (
              <span
                style={{
                  fontStyle: 'italic',
                  color: isHighContrast ? '#fca5a5' : '#991b1b',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                "{interimTranscript}"
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={stopListening}
            aria-label="Stop Voice Input"
            style={{
              background: 'none',
              border: 'none',
              color: '#dc2626',
              fontWeight: 800,
              fontSize: '11px',
              cursor: 'pointer',
              padding: '2px 6px',
              borderRadius: '4px',
              textDecoration: 'underline',
              flexShrink: 0,
            }}
          >
            रोकें (Stop)
          </button>
        </div>
      )}

      {/* 2. Error Message Banner */}
      {errorMessage && (
        <div
          role="alert"
          style={{
            padding: '6px 14px',
            backgroundColor: isHighContrast ? '#374151' : '#fff1f2',
            borderBottom: '1px solid #fecaca',
            fontSize: '11px',
            color: '#dc2626',
            lineHeight: 1.3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={reset}
            aria-label="Dismiss speech error"
            style={{
              background: 'none',
              border: 'none',
              color: '#dc2626',
              cursor: 'pointer',
              fontWeight: 700,
              padding: '0 4px',
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* 3. Input Controls Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'flex-end',
          gap: '8px',
        }}
      >
        {/* Speech-to-Text Microphone Button */}
        {isSpeechSupported ? (
          <button
            type="button"
            onClick={toggleVoiceInput}
            title={
              isListening
                ? 'आवाज़ सुनना बंद करें (Stop Listening)'
                : `बोलकर पूछें (${langDisplayName}) / Voice Input`
            }
            aria-label={
              isListening
                ? 'Stop listening'
                : `Start voice input in ${langDisplayName}`
            }
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: isListening
                ? isHighContrast
                  ? '#ef4444'
                  : '#dc2626'
                : isHighContrast
                ? '#1f2937'
                : '#f1f5f9',
              color: isListening
                ? '#ffffff'
                : isHighContrast
                ? '#9ca3af'
                : '#475569',
              border: `1.5px solid ${
                isListening
                  ? '#dc2626'
                  : isHighContrast
                  ? '#374151'
                  : '#cbd5e1'
              }`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.15s ease',
              boxShadow: isListening ? '0 0 0 3px rgba(220, 38, 38, 0.2)' : 'none',
            }}
          >
            {isListening ? (
              <span
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '2px',
                  backgroundColor: '#ffffff',
                  display: 'inline-block',
                }}
              />
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="22" />
              </svg>
            )}
          </button>
        ) : (
          <div
            title="इस ब्राउज़र में आवाज़ पहचान समर्थित नहीं है (Voice input not supported in this browser)"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: isHighContrast ? '#1f2937' : '#f1f5f9',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              opacity: 0.6,
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="2" y1="2" x2="22" y2="22" />
              <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2" />
              <path d="M5 10v2a7 7 0 0 0 12 5" />
              <path d="M15 9.34V5a3 3 0 0 0-5.68-1.33" />
              <path d="M9 9v3a3 3 0 0 0 5.12 2.12" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
          </div>
        )}

        {/* Text Area Input */}
        <div style={{ flexGrow: 1, position: 'relative' }}>
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening
                ? `सुन रहे हैं (${langDisplayName})... बोलें`
                : 'Type or speak your question... (हिन्दी, English)'
            }
            aria-label="Type or speak your question for Jeevika Saathi"
            disabled={isLoading}
            style={{
              width: '100%',
              resize: 'none',
              padding: '8px 12px',
              borderRadius: '8px',
              border: `1.5px solid ${
                isListening
                  ? '#ef4444'
                  : isHighContrast
                  ? '#4b5563'
                  : '#cbd5e1'
              }`,
              backgroundColor: isHighContrast ? '#1f2937' : '#f8fafc',
              color: isHighContrast ? '#ffffff' : '#0f172a',
              fontSize: '13px',
              lineHeight: 1.4,
              outline: 'none',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Send Action Button */}
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          aria-label="Send message"
          title="संदेश भेजें (Send)"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: isHighContrast ? '#ff9933' : '#0c2340',
            color: isHighContrast ? '#000000' : '#ffffff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: !inputText.trim() || isLoading ? 'not-allowed' : 'pointer',
            opacity: !inputText.trim() || isLoading ? 0.45 : 1,
            flexShrink: 0,
            transition: 'all 0.15s ease',
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>

      <style>{`
        @keyframes pulseDot {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.3);
          }
        }
      `}</style>
    </div>
  );
};
