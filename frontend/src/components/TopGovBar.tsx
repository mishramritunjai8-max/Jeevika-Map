import React from 'react';

interface TopGovBarProps {
  fontScale: number;
  setFontScale: (scale: number | ((prev: number) => number)) => void;
  isHighContrast: boolean;
  setIsHighContrast: (val: boolean | ((prev: boolean) => boolean)) => void;
  currentLang: string;
  setCurrentLang: (lang: string) => void;
}

export const TopGovBar: React.FC<TopGovBarProps> = ({
  fontScale,
  setFontScale,
  isHighContrast,
  setIsHighContrast,
  currentLang,
  setCurrentLang,
}) => {
  const handleScaleDecrease = () => {
    setFontScale((prev) => Math.max(0.85, parseFloat((prev - 0.05).toFixed(2))));
  };

  const handleScaleReset = () => {
    setFontScale(1);
  };

  const handleScaleIncrease = () => {
    setFontScale((prev) => Math.min(1.25, parseFloat((prev + 0.05).toFixed(2))));
  };

  return (
    <div
      role="region"
      aria-label="Government Information and Accessibility Toolbar"
      style={{
        backgroundColor: isHighContrast ? '#000000' : '#f8fafc',
        borderBottom: `1px solid ${isHighContrast ? '#ffffff' : '#e2e8f0'}`,
        color: isHighContrast ? '#ffffff' : '#334155',
        fontSize: '12px',
        lineHeight: '1.4',
        padding: '6px 0',
      }}
    >
      <div
        className="jm-container"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        {/* Ministry & Initiative Identifier */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontWeight: 600,
              letterSpacing: '0.02em',
              color: isHighContrast ? '#ffffff' : '#0f172a',
            }}
          >
            भारत सरकार | Government of India
          </span>
          <span
            style={{
              color: isHighContrast ? '#94a3b8' : '#94a3b8',
              fontSize: '11px',
            }}
          >
            •
          </span>
          <span
            style={{
              color: isHighContrast ? '#e2e8f0' : '#475569',
              fontWeight: 500,
            }}
          >
            सामाजिक न्याय एवं अधिकारिता मंत्रालय (पीएम-अजय) • Ministry of Social Justice & Empowerment
          </span>
        </div>

        {/* Accessibility & Language Utilities */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Skip to Main Content */}
          <a
            href="#main-content"
            className="sr-skip-link"
            style={{ color: '#ffffff' }}
          >
            मुख्य सामग्री पर जाएँ (Skip to Main Content)
          </a>

          {/* Font Resizing Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              borderRight: `1px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
              paddingRight: '12px',
            }}
          >
            <span style={{ fontSize: '11px', color: isHighContrast ? '#d1d5db' : '#64748b', marginRight: '4px' }}>
              अक्षर आकार / Text Size:
            </span>
            <button
              type="button"
              onClick={handleScaleDecrease}
              aria-label="Decrease font size"
              title="Decrease font size"
              style={{
                padding: '2px 6px',
                borderRadius: '3px',
                border: `1px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
                background: fontScale < 1 ? (isHighContrast ? '#374151' : '#e2e8f0') : 'transparent',
                color: isHighContrast ? '#ffffff' : '#0f172a',
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              A-
            </button>
            <button
              type="button"
              onClick={handleScaleReset}
              aria-label="Reset default font size"
              title="Reset default font size"
              style={{
                padding: '2px 6px',
                borderRadius: '3px',
                border: `1px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
                background: fontScale === 1 ? (isHighContrast ? '#374151' : '#e2e8f0') : 'transparent',
                color: isHighContrast ? '#ffffff' : '#0f172a',
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              A
            </button>
            <button
              type="button"
              onClick={handleScaleIncrease}
              aria-label="Increase font size"
              title="Increase font size"
              style={{
                padding: '2px 6px',
                borderRadius: '3px',
                border: `1px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
                background: fontScale > 1 ? (isHighContrast ? '#374151' : '#e2e8f0') : 'transparent',
                color: isHighContrast ? '#ffffff' : '#0f172a',
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              A+
            </button>
          </div>

          {/* High Contrast Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsHighContrast((prev) => !prev)}
            aria-pressed={isHighContrast}
            aria-label="Toggle high contrast mode"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderRight: `1px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
              paddingRight: '12px',
              color: isHighContrast ? '#ff9933' : '#0c2340',
              fontWeight: 600,
              fontSize: '11.5px',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: isHighContrast ? '#ffffff' : '#0f172a',
                border: `1px solid ${isHighContrast ? '#ff9933' : '#cbd5e1'}`,
              }}
            />
            {isHighContrast ? 'सामान्य दृश्य (Standard)' : 'कंट्रास्ट दृश्य (Contrast)'}
          </button>

          {/* Language Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label
              htmlFor="gov-language-select"
              style={{ fontSize: '11px', color: isHighContrast ? '#d1d5db' : '#64748b' }}
            >
              भाषा / Lang:
            </label>
            <select
              id="gov-language-select"
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value)}
              style={{
                fontSize: '11.5px',
                padding: '2px 6px',
                borderRadius: '3px',
                border: `1px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
                background: isHighContrast ? '#111827' : '#ffffff',
                color: isHighContrast ? '#ffffff' : '#0f172a',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="bn">বাংলা (Bengali)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="ta">தமிழ் (Tamil)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
