import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { TopGovBar } from '../components/TopGovBar';
import { OfficerHeader } from '../components/officer/OfficerHeader';
import { OfficerSidebar } from '../components/officer/OfficerSidebar';
import { useAccessibility } from '../context/useAccessibility';

export const OfficerLayout: React.FC = () => {
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
        backgroundColor: isHighContrast ? '#000000' : '#f8fafc',
      }}
    >
      {/* 1. Accessibility Ribbon */}
      <TopGovBar
        fontScale={fontScale}
        setFontScale={setFontScale}
        isHighContrast={isHighContrast}
        setIsHighContrast={setIsHighContrast}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
      />

      {/* 2. Government Officer Header */}
      <OfficerHeader
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen}
      />

      {/* 3. Main Workspace Area */}
      <div style={{ display: 'flex', flexGrow: 1, position: 'relative' }}>
        <OfficerSidebar
          isOpen={isSidebarOpen}
          onCloseMobile={() => {
            if (window.innerWidth < 768) {
              setIsSidebarOpen(false);
            }
          }}
        />

        <main
          id="officer-main-content"
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
          <div style={{ flexGrow: 1, padding: '24px' }}>
            <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
              <Outlet />
            </div>
          </div>

          {/* Officer Dashboard Compliance Strip */}
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
              <strong>PM-AJAY Nodal Command Console</strong> • Ministry of Social Justice & Empowerment
            </div>
            <div>
              Controlled Reference: <strong>NCVET NSQF Catalog v2.0</strong> • Authorization: <strong>RLS Security Standard</strong>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
