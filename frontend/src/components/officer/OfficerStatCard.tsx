import React from 'react';

interface OfficerStatCardProps {
  title: string;
  hindiTitle: string;
  count: number;
  icon: React.ReactNode;
  accentColor?: string;
  isHighContrast?: boolean;
  sublabel?: string;
}

export const OfficerStatCard: React.FC<OfficerStatCardProps> = ({
  title,
  hindiTitle,
  count,
  icon,
  accentColor = '#1e3a8a',
  isHighContrast = false,
  sublabel,
}) => {
  return (
    <div
      style={{
        backgroundColor: isHighContrast ? '#111827' : '#ffffff',
        border: `1px solid ${isHighContrast ? '#374151' : '#cbd5e1'}`,
        borderTop: `3px solid ${accentColor}`,
        borderRadius: '6px',
        padding: '20px',
        boxShadow: isHighContrast ? 'none' : '0 1px 3px rgba(12, 35, 64, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
        <div>
          <span style={{ fontSize: '11px', color: isHighContrast ? '#9ca3af' : '#64748b', display: 'block', fontWeight: 600 }}>
            {hindiTitle}
          </span>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: isHighContrast ? '#ffffff' : '#0c2340', margin: '2px 0 0' }}>
            {title}
          </h2>
        </div>

        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '6px',
            backgroundColor: isHighContrast ? '#1f2937' : '#f1f5f9',
            color: accentColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span
          style={{
            fontSize: '32px',
            fontWeight: 800,
            color: isHighContrast ? '#ffffff' : '#0c2340',
            lineHeight: 1,
            fontFeatureSettings: '"tnum"',
          }}
        >
          {count.toLocaleString('en-IN')}
        </span>
        {sublabel && (
          <span style={{ fontSize: '11.5px', color: isHighContrast ? '#9ca3af' : '#64748b' }}>
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};
