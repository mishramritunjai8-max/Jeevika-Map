import React from 'react';

interface RlsNoticeBannerProps {
  isHighContrast?: boolean;
  message?: string;
  subtext?: string;
}

export const RlsNoticeBanner: React.FC<RlsNoticeBannerProps> = ({
  isHighContrast = false,
  message = 'Officer authentication/authorization is required before protected beneficiary SELECT queries can be enabled.',
  subtext = 'Citizen identity and livelihood profiles are protected under PostgreSQL Row Level Security (RLS) default-deny policies. The public anon role cannot enumerate database records without officer role credentials.',
}) => {
  return (
    <div
      role="status"
      style={{
        padding: '14px 18px',
        borderRadius: '6px',
        backgroundColor: isHighContrast ? '#1f2937' : '#eff6ff',
        border: `1.5px solid ${isHighContrast ? '#3b82f6' : '#93c5fd'}`,
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: isHighContrast ? '#1e3a8a' : '#dbeafe',
          color: isHighContrast ? '#93c5fd' : '#1e40af',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: '2px',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>

      <div style={{ flexGrow: 1 }}>
        <div
          style={{
            fontSize: '13.5px',
            fontWeight: 700,
            color: isHighContrast ? '#ffffff' : '#1e3a8a',
            marginBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>{message}</span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              padding: '2px 6px',
              borderRadius: '3px',
              backgroundColor: '#15803d',
              color: '#ffffff',
            }}
          >
            RLS PROTECTED
          </span>
        </div>
        <p
          style={{
            fontSize: '12.5px',
            lineHeight: 1.5,
            color: isHighContrast ? '#d1d5db' : '#334155',
            margin: 0,
          }}
        >
          {subtext}
        </p>
      </div>
    </div>
  );
};
