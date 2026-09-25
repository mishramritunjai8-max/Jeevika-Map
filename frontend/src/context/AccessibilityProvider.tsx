import React, { useState, useEffect } from 'react';
import { AccessibilityContext } from './accessibilityContextDef';

const LANGUAGE_STORAGE_KEY = 'jeevika-language';

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontScale, setFontScale] = useState<number>(1);
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
  const [currentLang, setCurrentLangState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved && ['en', 'hi', 'mr', 'te', 'bn'].includes(saved)) {
        return saved;
      }
    } catch {
      // ignore storage access errors
    }
    return 'en';
  });

  const setCurrentLang = (lang: string | ((prev: string) => string)) => {
    setCurrentLangState((prev) => {
      const nextLang = typeof lang === 'function' ? lang(prev) : lang;
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLang);
      } catch {
        // ignore storage access errors
      }
      return nextLang;
    });
  };

  // Synchronize document root font scale
  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontScale.toString());
  }, [fontScale]);

  // Synchronize high-contrast mode class on body
  useEffect(() => {
    if (isHighContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [isHighContrast]);

  return (
    <AccessibilityContext.Provider
      value={{
        fontScale,
        setFontScale,
        isHighContrast,
        setIsHighContrast,
        currentLang,
        setCurrentLang,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};
