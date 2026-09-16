import React, { useState } from 'react';
import type { ChatMessage } from '../../types/chat';

interface ChatMessageItemProps {
  message: ChatMessage;
  isHighContrast?: boolean;
  onSelectAction?: (actionText: string) => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  isHighContrast = false,
  onSelectAction,
}) => {
  const [showWhy, setShowWhy] = useState<boolean>(false);
  const isUser = message.role === 'user';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '14px',
        maxWidth: '100%',
      }}
    >
      {/* Speaker Label & Timestamp */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          fontWeight: 600,
          color: isHighContrast ? '#9ca3af' : '#64748b',
          marginBottom: '4px',
          padding: '0 4px',
        }}
      >
        <span>{isUser ? 'आप (You)' : '🤝 Jeevika Saathi'}</span>
        {message.isFallback && (
          <span
            style={{
              fontSize: '10px',
              padding: '1px 5px',
              borderRadius: '4px',
              backgroundColor: isHighContrast ? '#374151' : '#f1f5f9',
              color: isHighContrast ? '#e5e7eb' : '#475569',
            }}
          >
            सत्यापित डेटा (Verified Data)
          </span>
        )}
      </div>

      {/* Message Bubble */}
      <div
        style={{
          maxWidth: '90%',
          padding: '12px 16px',
          borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          backgroundColor: isUser
            ? isHighContrast
              ? '#1e3a8a'
              : '#0c2340'
            : isHighContrast
            ? '#18181b'
            : '#ffffff',
          color: isUser
            ? '#ffffff'
            : isHighContrast
            ? '#ffffff'
            : '#0f172a',
          border: `1px solid ${
            isUser
              ? isHighContrast
                ? '#3b82f6'
                : '#0c2340'
              : isHighContrast
              ? '#3f3f46'
              : '#e2e8f0'
          }`,
          boxShadow: isHighContrast
            ? 'none'
            : '0 2px 8px rgba(12, 35, 64, 0.05)',
          fontSize: '13.5px',
          lineHeight: 1.55,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {message.content}
      </div>

      {/* Livelihood Pathway Card if available */}
      {message.pathway && (
        <div
          style={{
            marginTop: '10px',
            width: '100%',
            maxWidth: '92%',
            backgroundColor: isHighContrast ? '#111827' : '#f8fafc',
            border: `1.5px solid ${isHighContrast ? '#ff9933' : '#fed7aa'}`,
            borderRadius: '10px',
            padding: '12px 14px',
            boxShadow: '0 4px 12px rgba(194, 65, 12, 0.08)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 800,
              color: isHighContrast ? '#ff9933' : '#c2410c',
              marginBottom: '8px',
              borderBottom: `1px solid ${isHighContrast ? '#374151' : '#ffedd5'}`,
              paddingBottom: '6px',
            }}
          >
            <span>🧭 अनुशंसित आजीविका मार्ग (Livelihood Pathway)</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
            {message.pathway.nsqfJobRole && (
              <div>
                <span style={{ color: '#64748b', fontWeight: 600 }}>जॉब रोल: </span>
                <strong style={{ color: isHighContrast ? '#ffffff' : '#0c2340' }}>
                  {message.pathway.nsqfJobRole}
                </strong>
                {message.pathway.nsqfLevel && (
                  <span
                    style={{
                      marginLeft: '6px',
                      fontSize: '10px',
                      backgroundColor: '#dcfce7',
                      color: '#15803d',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: 700,
                    }}
                  >
                    Level {message.pathway.nsqfLevel}
                  </span>
                )}
              </div>
            )}

            {message.pathway.schemeSupport && (
              <div>
                <span style={{ color: '#64748b', fontWeight: 600 }}>योजना सहायता: </span>
                <strong style={{ color: isHighContrast ? '#fdba74' : '#c2410c' }}>
                  {message.pathway.schemeSupport}
                </strong>
              </div>
            )}

            {message.pathway.opportunity && (
              <div>
                <span style={{ color: '#64748b', fontWeight: 600 }}>अवसर / लिंकेज: </span>
                <span style={{ color: isHighContrast ? '#e2e8f0' : '#334155' }}>
                  {message.pathway.opportunity}
                </span>
              </div>
            )}

            {message.pathway.nextStep && (
              <div
                style={{
                  marginTop: '4px',
                  paddingTop: '6px',
                  borderTop: `1px dashed ${isHighContrast ? '#374151' : '#e2e8f0'}`,
                  color: isHighContrast ? '#86efac' : '#15803d',
                  fontWeight: 600,
                }}
              >
                👉 <strong>अगला कदम: </strong>{message.pathway.nextStep}
              </div>
            )}
          </div>

          {/* Explainability toggle: Why this option? */}
          {message.whyExplanation && (
            <div style={{ marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => setShowWhy((prev) => !prev)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isHighContrast ? '#60a5fa' : '#1e40af',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>{showWhy ? '▼ छुपाएं' : '▶ यह विकल्प क्यों? (Why this option?)'}</span>
              </button>
              {showWhy && (
                <div
                  style={{
                    marginTop: '6px',
                    fontSize: '11.5px',
                    color: isHighContrast ? '#d1d5db' : '#475569',
                    backgroundColor: isHighContrast ? '#1f2937' : '#f1f5f9',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    lineHeight: 1.4,
                  }}
                >
                  {message.whyExplanation}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Suggestion Chips */}
      {message.quickActions && message.quickActions.length > 0 && onSelectAction && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            marginTop: '8px',
            maxWidth: '92%',
          }}
        >
          {message.quickActions.map((action, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSelectAction(action)}
              style={{
                fontSize: '11.5px',
                fontWeight: 600,
                padding: '5px 10px',
                borderRadius: '16px',
                backgroundColor: isHighContrast ? '#1f2937' : '#ffffff',
                border: `1px solid ${isHighContrast ? '#60a5fa' : '#cbd5e1'}`,
                color: isHighContrast ? '#93c5fd' : '#0c2340',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isHighContrast ? '#374151' : '#eff6ff';
                e.currentTarget.style.borderColor = isHighContrast ? '#93c5fd' : '#3b82f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isHighContrast ? '#1f2937' : '#ffffff';
                e.currentTarget.style.borderColor = isHighContrast ? '#60a5fa' : '#cbd5e1';
              }}
            >
              {action}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
