import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { TopGovBar } from '../components/TopGovBar';
import { AppHeader } from '../components/AppHeader';
import { AppSidebar } from '../components/AppSidebar';
import { useAccessibility } from '../context/useAccessibility';

export const AppLayout: React.FC = () => {
  const {
    fontScale,
    setFontScale,
    isHighContrast,
    setIsHighContrast,
    currentLang,
    setCurrentLang,
  } = useAccessibility();

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: isHighContrast ? '#000000' : '#ffffff',
      }}
    >
      {/* 1. Top Government Information & Accessibility Ribbon */}
      <TopGovBar
        fontScale={fontScale}
        setFontScale={setFontScale}
        isHighContrast={isHighContrast}
        setIsHighContrast={setIsHighContrast}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
      />

      {/* 2. Consistent Government-Style Application Header */}
      <AppHeader
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen}
      />

      {/* 3. Internal Application Workspace with Sidebar and Content Area */}
      <div style={{ display: 'flex', flexGrow: 1, position: 'relative' }}>
        <AppSidebar
          isOpen={isSidebarOpen}
          onCloseMobile={() => {
            // Collapse on mobile viewports
            if (window.innerWidth < 768) {
              setIsSidebarOpen(false);
            }
          }}
        />

        <main
          id="main-content"
          tabIndex={-1}
          style={{
            flexGrow: 1,
            minWidth: 0,
            backgroundColor: isHighContrast ? '#0a0a0a' : '#f8fafc',
            outline: 'none',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Main Route Content */}
          <div style={{ flexGrow: 1, padding: '32px 24px' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
              <Outlet />
            </div>
          </div>

          {/* Internal Application System Status Strip */}
          <div
            style={{
              padding: '12px 24px',
              borderTop: `1px solid ${isHighContrast ? '#ffffff' : '#cbd5e1'}`,
              backgroundColor: isHighContrast ? '#111827' : '#ffffff',
              fontSize: '11.5px',
              color: isHighContrast ? '#9ca3af' : '#64748b',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div>
              <strong>PM-AJAY Livelihood Intelligence Portal</strong> • Module Diagnostic Mode
            </div>
            <div>
              Standards Alignment: <strong>NCVET NSQF v2.0</strong> • Data Governance: <strong>GIGW 3.0 Protected</strong>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
