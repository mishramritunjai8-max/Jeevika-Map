import React, { useState, useRef, useEffect } from 'react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

interface ChatInputBarProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  isHighContrast?: boolean;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  onSendMessage,
  isLoading,
  isHighContrast = false,
}) => {
  const [inputText, setInputText] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    status,
    transcript,
    isSupported: isSpeechSupported,
    startListening,
    stopListening,
  } = useSpeechRecognition();

  const isListening = status === 'listening';
  const prevTranscriptRef = useRef<string>('');

  // Sync speech transcript into input when new speech is recognized
  useEffect(() => {
    if (transcript && transcript !== prevTranscriptRef.current) {
      prevTranscriptRef.current = transcript;
      setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
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

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    // Auto grow up to max height
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening('hi-IN');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        padding: '12px 14px',
        borderTop: `1px solid ${isHighContrast ? '#374151' : '#e2e8f0'}`,
        backgroundColor: isHighContrast ? '#111827' : '#ffffff',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '8px',
      }}
    >
      {/* Speech-to-Text Mic Button */}
      {isSpeechSupported && (
        <button
          type="button"
          onClick={toggleVoiceInput}
          title={isListening ? 'आवाज सुनना बंद करें (Stop Listening)' : 'बोलकर पूछें (Voice Input)'}
          aria-label={isListening ? 'Stop Listening' : 'Voice Input'}
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
            color: isListening ? '#ffffff' : isHighContrast ? '#9ca3af' : '#475569',
            border: `1px solid ${
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
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="22" />
          </svg>
        </button>
      )}

      {/* Text Area Input */}
      <div style={{ flexGrow: 1, position: 'relative' }}>
        <textarea
          ref={textareaRef}
          rows={1}
          value={inputText}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? 'सुन रहे हैं... (Listening...)' : 'अपना प्रश्न या हुनर यहाँ लिखें... (Hindi, Hinglish, English)'}
          aria-label="Type your message for Jeevika Saathi"
          disabled={isLoading}
          style={{
            width: '100%',
            resize: 'none',
            padding: '8px 12px',
            borderRadius: '8px',
            border: `1.5px solid ${isListening ? '#ef4444' : isHighContrast ? '#4b5563' : '#cbd5e1'}`,
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
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </form>
  );
};
