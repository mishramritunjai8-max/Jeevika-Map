import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AccessibilityProvider } from './context/AccessibilityProvider';
import { OfficerAuthProvider } from './context/OfficerAuthContext';
import { LandingPage } from './pages/LandingPage';
import { AppLayout } from './layouts/AppLayout';
import { OfficerLayout } from './layouts/OfficerLayout';
import { OfficerProtectedRoute } from './components/officer/OfficerProtectedRoute';
import { LivelihoodMappingPage } from './pages/LivelihoodMappingPage';
import { BeneficiaryProfilePage } from './pages/BeneficiaryProfilePage';
import { LocalOpportunitiesPage } from './pages/LocalOpportunitiesPage';
import { SkillRecommendationsPage } from './pages/SkillRecommendationsPage';
import { ActionPlanPage } from './pages/ActionPlanPage';
import { OfficerDashboardPage } from './pages/officer/OfficerDashboardPage';
import { OfficerRegistryPage } from './pages/officer/OfficerRegistryPage';
import { OfficerBeneficiaryDetailPage } from './pages/officer/OfficerBeneficiaryDetailPage';
import { OfficerLoginPage } from './pages/officer/OfficerLoginPage';
import { JeevikaSaathiChatbot } from './components/chat/JeevikaSaathiChatbot';
import { OfflineStatusBar } from './components/OfflineStatusBar';

export const App: React.FC = () => {
  return (
    <AccessibilityProvider>
      <OfficerAuthProvider>
        <OfflineStatusBar />
        <BrowserRouter>
          <Routes>
            {/* Public Landing Page Route */}
            <Route path="/" element={<LandingPage />} />

            {/* Citizen Beneficiary Journey Wrapped by Reusable AppLayout */}
            <Route element={<AppLayout />}>
              <Route path="/mapping" element={<LivelihoodMappingPage />} />
              <Route path="/profile" element={<BeneficiaryProfilePage />} />
              <Route path="/opportunities" element={<LocalOpportunitiesPage />} />
              <Route path="/recommendations" element={<SkillRecommendationsPage />} />
              <Route path="/action-plan" element={<ActionPlanPage />} />
            </Route>

            {/* Dedicated Officer Authentication Portal */}
            <Route path="/officer/login" element={<OfficerLoginPage />} />

            {/* Government Officer Command Center & Monitoring Console (Protected) */}
            <Route
              path="/officer"
              element={
                <OfficerProtectedRoute>
                  <OfficerLayout />
                </OfficerProtectedRoute>
              }
            >
              <Route index element={<OfficerDashboardPage />} />
              <Route path="beneficiaries" element={<OfficerRegistryPage />} />
              <Route path="beneficiaries/:id" element={<OfficerBeneficiaryDetailPage />} />
            </Route>

            {/* Fallback to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Floating AI Livelihood Assistant */}
          <JeevikaSaathiChatbot />
        </BrowserRouter>
      </OfficerAuthProvider>
    </AccessibilityProvider>
  );
};

export default App;


