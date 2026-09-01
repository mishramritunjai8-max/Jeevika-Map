import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useOfficerAuth } from '../../context/useOfficerAuth';
import { useAccessibility } from '../../context/useAccessibility';
import { TopGovBar } from '../../components/TopGovBar';

export const OfficerLoginPage: React.FC = () => {
  const { session, isOfficer, signIn, authError, clearAuthError } = useOfficerAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    fontScale,
    setFontScale,
    isHighContrast,
    setIsHighContrast,
    currentLang,
    setCurrentLang,
  } = useAccessibility();

  const routeError = (location.state as { error?: string } | null)?.error;
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // If already logged in as officer, redirect immediately
  useEffect(() => {
    if (session && isOfficer) {
      const destination = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/officer';
      navigate(destination, { replace: true });
    }
  }, [session, isOfficer, navigate, location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearAuthError();

    if (!email.trim() || !password) {
      setLocalError('कृपया ईमेल एवं पासवर्ड दोनों दर्ज करें। / Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signIn(email.trim(), password);
      if (result.success) {
        const destination = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/officer';
        navigate(destination, { replace: true });
      } else {
        setLocalError(result.error || 'प्रमाणीकरण विफल रहा। कृपया विवरण जांचें। / Authentication failed. Please check credentials.');
      }
    } catch {
      setLocalError('अप्रत्याशित प्रमाणीकरण त्रुटि। / An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeError = localError || authError || routeError;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: isHighContrast ? '#0a0a0a' : '#f8fafc',
      }}
    >
      {/* 1. Government Information & Accessibility Ribbon */}
      <TopGovBar
        fontScale={fontScale}
        setFontScale={setFontScale}
        isHighContrast={isHighContrast}
        setIsHighContrast={setIsHighContrast}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
      />

      {/* 2. Main Login Card Container */}
      <div
        style={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 16px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '460px',
            backgroundColor: isHighContrast ? '#111827' : '#ffffff',
            borderRadius: '6px',
            border: `1px solid ${isHighContrast ? '#374151' : '#cbd5e1'}`,
            borderTop: `4px solid ${isHighContrast ? '#ff9933' : '#0c2340'}`,
            boxShadow: isHighContrast ? 'none' : '0 4px 14px rgba(12, 35, 64, 0.08)',
            overflow: 'hidden',
          }}
        >
          {/* Government Portal Header */}
          <div
            style={{
              padding: '24px 28px 18px',
              backgroundColor: isHighContrast ? '#1f2937' : '#0c2340',
              color: '#ffffff',
              borderBottom: `2px solid ${isHighContrast ? '#ffffff' : '#c2410c'}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '4px',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2.5px', backgroundColor: '#c2410c' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2.5px', backgroundColor: '#15803d' }} />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0c2340" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="12" r="2.5" />
                  <line x1="12" y1="3" x2="12" y2="9.5" />
                  <line x1="12" y1="14.5" x2="12" y2="21" />
                </svg>
              </div>

              <div>
                <span style={{ fontSize: '17px', fontWeight: 900, color: '#ffffff' }}>
                  Jeevika <span style={{ color: '#ff9933' }}>Map</span>
                </span>
                <span
                  style={{
                    marginLeft: '8px',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '2px',
                    backgroundColor: '#c2410c',
                    color: '#ffffff',
                  }}
                >
                  OFFICER
                </span>
              </div>
            </div>

            <div style={{ fontSize: '11px', color: '#93c5fd', fontWeight: 600 }}>
              अधिकारी प्रमाणीकरण पोर्टल / Officer Command Center
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>
              PM-AJAY Welfare Mission Directorate
            </div>
          </div>

          {/* Form Body */}
          <div style={{ padding: '24px 28px' }}>
            {/* Regulatory Notice Banner */}
            <div
              style={{
                padding: '10px 12px',
                borderRadius: '4px',
                backgroundColor: isHighContrast ? '#1e293b' : '#f1f5f9',
                borderLeft: `3px solid ${isHighContrast ? '#60a5fa' : '#1e40af'}`,
                fontSize: '11.5px',
                color: isHighContrast ? '#e2e8f0' : '#334155',
                lineHeight: 1.45,
                marginBottom: '20px',
              }}
            >
              <strong>प्रतिबंधित सरकारी प्रणाली / Restricted Government Portal:</strong> For authorized welfare officers and district mission managers only. Access is protected under NCVET NSQF and PM-AJAY statutory governance rules.
            </div>

            {/* Error Message */}
            {activeError && (
              <div
                role="alert"
                style={{
                  padding: '12px 14px',
                  borderRadius: '4px',
                  backgroundColor: isHighContrast ? '#450a0a' : '#fef2f2',
                  border: '1px solid #f87171',
                  color: isHighContrast ? '#fca5a5' : '#b91c1c',
                  fontSize: '12.5px',
                  marginBottom: '18px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                }}
              >
                <span style={{ fontSize: '14px', lineHeight: 1 }}>⚠️</span>
                <span style={{ flexGrow: 1 }}>{activeError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Email Input */}
              <div style={{ marginBottom: '16px' }}>
                <label
                  htmlFor="officer-email"
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: isHighContrast ? '#ffffff' : '#0c2340',
                    marginBottom: '6px',
                  }}
                >
                  आधिकारिक ईमेल / Official Email Address
                </label>
                <input
                  id="officer-email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={isSubmitting}
                  placeholder="officer@pmajay.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '13px',
                    borderRadius: '4px',
                    border: `1px solid ${isHighContrast ? '#4b5563' : '#cbd5e1'}`,
                    backgroundColor: isHighContrast ? '#1f2937' : '#ffffff',
                    color: isHighContrast ? '#ffffff' : '#0f172a',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Password Input */}
              <div style={{ marginBottom: '22px' }}>
                <label
                  htmlFor="officer-password"
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: isHighContrast ? '#ffffff' : '#0c2340',
                    marginBottom: '6px',
                  }}
                >
                  पासवर्ड / Password
                </label>
                <input
                  id="officer-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  disabled={isSubmitting}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '13px',
                    borderRadius: '4px',
                    border: `1px solid ${isHighContrast ? '#4b5563' : '#cbd5e1'}`,
                    backgroundColor: isHighContrast ? '#1f2937' : '#ffffff',
                    color: isHighContrast ? '#ffffff' : '#0f172a',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="jm-btn jm-btn-saffron"
                style={{
                  width: '100%',
                  padding: '11px',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.75 : 1,
                }}
              >
                {isSubmitting ? (
                  <>
                    <span
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        border: '2px solid #ffffff',
                        borderTopColor: 'transparent',
                        animation: 'spin 1s linear infinite',
                        display: 'inline-block',
                      }}
                    />
                    <span>प्रमाणीकरण जारी... / Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>प्रवेश करें / Sign In to Command Console</span>
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 10h10M11 6l4 4-4 4" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Switch to Citizen Portal Link */}
            <div
              style={{
                marginTop: '22px',
                paddingTop: '16px',
                borderTop: `1px solid ${isHighContrast ? '#374151' : '#e2e8f0'}`,
                textAlign: 'center',
              }}
            >
              <Link
                to="/mapping"
                style={{
                  fontSize: '12px',
                  color: isHighContrast ? '#93c5fd' : '#1e40af',
                  textDecoration: 'none',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>← नागरिक पोर्टल पर जाएं / Return to Citizen Livelihood Portal</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Footer Strip */}
      <div
        style={{
          padding: '12px 24px',
          borderTop: `1px solid ${isHighContrast ? '#374151' : '#cbd5e1'}`,
          backgroundColor: isHighContrast ? '#111827' : '#ffffff',
          fontSize: '11px',
          color: isHighContrast ? '#9ca3af' : '#64748b',
          textAlign: 'center',
        }}
      >
        Ministry of Social Justice & Empowerment • Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY) • Security Architecture v18.2
      </div>
    </div>
  );
};
