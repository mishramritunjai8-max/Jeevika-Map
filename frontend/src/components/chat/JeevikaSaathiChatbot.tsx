import React, { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '../../context/useAccessibility';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import { sendChatMessage } from '../../services/chatService';
import { ChatMessageItem } from './ChatMessageItem';
import { ChatInputBar } from './ChatInputBar';
import type { ChatMessage } from '../../types/chat';

const INITIAL_QUICK_ACTIONS = [
  '🎓 Skill सीखना',
  '💼 Job ढूँढना',
  '🏪 अपना काम शुरू करना',
  '📋 योजना ढूँढना',
  '📍 जिले में अवसर देखना',
];

const DEFAULT_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-msg',
  role: 'assistant',
  content:
    'नमस्ते! मैं जीविका साथी हूँ 🤝 (Jeevika Saathi).\n\nआप अपनी पसंद का हुनर, रोज़गार या स्वरोज़गार का लक्ष्य हिंदी, Hinglish या English में पूछ सकते हैं। मैं आपको सत्यापित सरकारी कौशल और PM-AJAY योजनाओं से जोड़ूँगा।',
  timestamp: new Date().toISOString(),
  quickActions: INITIAL_QUICK_ACTIONS,
};

export const JeevikaSaathiChatbot: React.FC = () => {
  const { isHighContrast } = useAccessibility();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([DEFAULT_WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastSpokenMsgIdRef = useRef<string | null>(null);

  const {
    isTtsSupported,
    isSpeaking,
    speakingId,
    speakMessage,
    stopSpeaking,
    autoSpeak,
    setAutoSpeak,
  } = useVoiceAssistant();

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // When chatbot closes, stop any active speech immediately
  const handleClose = () => {
    stopSpeaking();
    setIsOpen(false);
  };

  // Auto-speak new assistant responses when autoSpeak is enabled
  useEffect(() => {
    if (!isOpen || !autoSpeak || !isTtsSupported || messages.length === 0) return;

    const latestMessage = messages[messages.length - 1];
    // Do not auto-speak welcome message on initial mount, only new assistant replies
    if (
      latestMessage.role === 'assistant' &&
      latestMessage.id !== 'welcome-msg' &&
      latestMessage.id !== lastSpokenMsgIdRef.current
    ) {
      lastSpokenMsgIdRef.current = latestMessage.id;
      speakMessage(latestMessage.id, latestMessage.content);
    }
  }, [messages, isOpen, autoSpeak, isTtsSupported, speakMessage]);

  const handleSendMessage = async (text: string) => {
    // If speaking when user sends a new message, stop speech immediately
    stopSpeaking();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Build brief history context
      const history = messages.slice(-4).map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

      const assistantReply = await sendChatMessage({
        message: text,
        history,
      });

      setMessages((prev) => [...prev, assistantReply]);
    } catch (err) {
      console.error('[JeevikaSaathi] Error getting chat response:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content:
            'अभी Jeevika Saathi से connection नहीं हो पा रहा है। कृपया थोड़ी देर बाद फिर कोशिश करें।',
          timestamp: new Date().toISOString(),
          quickActions: INITIAL_QUICK_ACTIONS,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      aria-label="Jeevika Saathi AI Assistant Widget"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        fontFamily: 'inherit',
      }}
    >
      {/* 1. COLLAPSED STATE LAUNCHER BUTTON */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Jeevika Saathi Chatbot"
          title="जीविका साथी से पूछें (Ask Jeevika Saathi • Text & Voice)"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 20px',
            borderRadius: '30px',
            backgroundColor: isHighContrast ? '#ff9933' : '#0c2340',
            color: isHighContrast ? '#000000' : '#ffffff',
            border: `2px solid ${isHighContrast ? '#ffffff' : '#ff9933'}`,
            boxShadow: '0 8px 24px rgba(12, 35, 64, 0.22), 0 2px 6px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            fontWeight: 800,
            fontSize: '15px',
            letterSpacing: '0.01em',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
          }}
        >
          <span style={{ fontSize: '18px' }}>🤝</span>
          <span>Jeevika Saathi</span>
          <span
            title="Voice & Text Active"
            style={{
              fontSize: '13px',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            🎙️
          </span>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              display: 'inline-block',
            }}
          />
        </button>
      )}

      {/* 2. EXPANDED CHAT PANEL */}
      {isOpen && (
        <div
          role="dialog"
          aria-labelledby="jeevika-saathi-title"
          aria-modal="true"
          style={{
            width: '380px',
            maxWidth: 'calc(100vw - 32px)',
            height: '540px',
            maxHeight: 'calc(100vh - 100px)',
            borderRadius: '16px',
            backgroundColor: isHighContrast ? '#0a0a0a' : '#ffffff',
            border: `1.5px solid ${isHighContrast ? '#ff9933' : '#cbd5e1'}`,
            boxShadow: '0 16px 36px -4px rgba(12, 35, 64, 0.25), 0 4px 12px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'slideUpFade 0.25s ease-out',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: isHighContrast ? '#111827' : '#0c2340',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${isHighContrast ? '#374151' : '#1e3a8a'}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#ff9933',
                  color: '#0c2340',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                🤝
              </div>
              <div>
                <div
                  id="jeevika-saathi-title"
                  style={{
                    fontSize: '14px',
                    fontWeight: 800,
                    lineHeight: 1.2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>Jeevika Saathi</span>
                  <span
                    style={{
                      fontSize: '9px',
                      backgroundColor: '#15803d',
                      color: '#ffffff',
                      padding: '1px 5px',
                      borderRadius: '3px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    AI Grounded
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#93c5fd', marginTop: '1px' }}>
                  आपकी आजीविका यात्रा में सहायक (Voice & Text)
                </div>
              </div>
            </div>

            {/* Header Action Controls (Voice Mute/Unmute & Close) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {isTtsSupported && (
                <button
                  type="button"
                  onClick={() => {
                    if (isSpeaking) {
                      stopSpeaking();
                    }
                    setAutoSpeak((prev) => !prev);
                  }}
                  aria-label={autoSpeak ? 'Disable auto voice response' : 'Enable auto voice response'}
                  title={
                    autoSpeak
                      ? 'आवाज़ उत्तर सक्रिय है (Auto-voice ON) • बंद करने के लिए क्लिक करें'
                      : 'आवाज़ उत्तर बंद है (Auto-voice OFF) • चालू करने के लिए क्लिक करें'
                  }
                  style={{
                    background: 'none',
                    border: 'none',
                    color: autoSpeak ? '#86efac' : '#94a3b8',
                    cursor: 'pointer',
                    padding: '4px 6px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    opacity: 0.9,
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.9')}
                >
                  {autoSpeak ? '🔊' : '🔇'}
                </button>
              )}

              {/* Minimize/Close Button */}
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close Chat"
                title="बंद करें (Close)"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  padding: '4px 6px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.85,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Message List */}
          <div
            style={{
              flexGrow: 1,
              padding: '16px 14px',
              overflowY: 'auto',
              backgroundColor: isHighContrast ? '#000000' : '#f8fafc',
            }}
          >
            {messages.map((msg) => (
              <ChatMessageItem
                key={msg.id}
                message={msg}
                isHighContrast={isHighContrast}
                onSelectAction={handleSendMessage}
                isSpeaking={speakingId === msg.id}
                onToggleSpeak={speakMessage}
                isTtsSupported={isTtsSupported}
              />
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 14px',
                  backgroundColor: isHighContrast ? '#18181b' : '#ffffff',
                  borderRadius: '16px 16px 16px 4px',
                  border: `1px solid ${isHighContrast ? '#3f3f46' : '#e2e8f0'}`,
                  width: 'fit-content',
                  marginBottom: '10px',
                }}
              >
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                  जीविका साथी उत्तर तैयार कर रहा है...
                </div>
                <div style={{ display: 'flex', gap: '3px' }}>
                  <span className="typing-dot" style={{ animationDelay: '0s' }} />
                  <span className="typing-dot" style={{ animationDelay: '0.2s' }} />
                  <span className="typing-dot" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <ChatInputBar
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            isHighContrast={isHighContrast}
          />
        </div>
      )}

      {/* Embedded CSS for animations */}
      <style>{`
        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .typing-dot {
          width: 5px;
          height: 5px;
          background-color: #c2410c;
          border-radius: 50%;
          display: inline-block;
          animation: typingBounce 1.2s infinite ease-in-out;
        }

        @keyframes typingBounce {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
};
