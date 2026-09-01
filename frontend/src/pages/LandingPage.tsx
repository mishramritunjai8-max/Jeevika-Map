import React from 'react';
import { TopGovBar } from '../components/TopGovBar';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { TrustStrip } from '../components/TrustStrip';
import { HowItWorks } from '../components/HowItWorks';
import { LivelihoodPathwayVisualizer } from '../components/LivelihoodPathwayVisualizer';
import { ImpactStats } from '../components/ImpactStats';
import { Footer } from '../components/Footer';
import { useAccessibility } from '../context/useAccessibility';

export const LandingPage: React.FC = () => {
  const {
    fontScale,
    setFontScale,
    isHighContrast,
    setIsHighContrast,
    currentLang,
    setCurrentLang,
  } = useAccessibility();

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
      {/* 1. Government-style top information bar */}
      <TopGovBar
        fontScale={fontScale}
        setFontScale={setFontScale}
        isHighContrast={isHighContrast}
        setIsHighContrast={setIsHighContrast}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
      />

      {/* 2. Main navigation */}
      <Navbar isHighContrast={isHighContrast} />

      {/* Main Content Area with Skip Target Landmark */}
      <main id="main-content" tabIndex={-1} style={{ flexGrow: 1, outline: 'none' }}>
        {/* 3. Hero section with 3D Depth, vector Indian Flag, & subtle Ashoka Chakra */}
        <HeroSection isHighContrast={isHighContrast} />

        {/* 4. Trust / impact strip */}
        <TrustStrip isHighContrast={isHighContrast} />

        {/* 5. "How Jeevika Map Works" (Discover → Understand → Recommend → Act) */}
        <HowItWorks isHighContrast={isHighContrast} />

        {/* 6. Interactive livelihood visualization */}
        <div id="skills">
          <LivelihoodPathwayVisualizer isHighContrast={isHighContrast} />
        </div>

        {/* 7. Impact statistics section (Marked with Pilot & Simulation disclaimer) */}
        <ImpactStats isHighContrast={isHighContrast} />
      </main>

      {/* 8. Public Service Footer */}
      <Footer isHighContrast={isHighContrast} />
    </div>
  );
};
