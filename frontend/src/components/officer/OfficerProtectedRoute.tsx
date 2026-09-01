import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useOfficerAuth } from '../../context/useOfficerAuth';
import { useAccessibility } from '../../context/useAccessibility';

interface OfficerProtectedRouteProps {
  children?: React.ReactNode;
}

export const OfficerProtectedRoute: React.FC<OfficerProtectedRouteProps> = ({ children }) => {
  const { session, user, isOfficer, loading } = useOfficerAuth();
  const location = useLocation();
  const { isHighContrast } = useAccessibility();

  if (loading) {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: isHighContrast ? '#0a0a0a' : '#f8fafc',
          color: isHighContrast ? '#ffffff' : '#0c2340',
          padding: '24px',
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: `3px solid ${isHighContrast ? '#374151' : '#cbd5e1'}`,
            borderTopColor: isHighContrast ? '#ff9933' : '#c2410c',
            animation: 'spin 1s linear infinite',
            marginBottom: '16px',
          }}
        />
        <div style={{ fontSize: '13px', color: isHighContrast ? '#9ca3af' : '#64748b', fontWeight: 600 }}>
          सत्यापन प्रक्रिया / AUTHENTICATION VERIFICATION
        </div>
        <div style={{ fontSize: '16px', fontWeight: 800, marginTop: '4px' }}>
          Verifying Officer Credentials & Permissions...
        </div>
        <div style={{ fontSize: '12px', color: isHighContrast ? '#9ca3af' : '#64748b', marginTop: '6px' }}>
          Validating cryptographic claims under PM-AJAY statutory access rules.
        </div>
      </div>
    );
  }

  // Not authenticated: Redirect to Officer Login
  if (!session || !user) {
    return <Navigate to="/officer/login" state={{ from: location }} replace />;
  }

  // Authenticated but does not possess app_metadata.role === 'officer'
  if (!isOfficer) {
    return (
      <Navigate
        to="/officer/login"
        state={{
          from: location,
          error: 'Access Denied: Your account does not have the Welfare Officer role (app_metadata.role must be "officer").',
        }}
        replace
      />
    );
  }

  return children ? <>{children}</> : <Outlet />;
};
