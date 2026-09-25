// ==============================================================================
// Hook: useTranslation
// Provides reactive translations based on the selected language
// ==============================================================================

import { useAccessibility } from '../context/useAccessibility';
import { getTranslation, type Translations, type SupportedLanguage } from './translations';

export interface UseTranslationReturn {
  currentLang: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: Translations;
}

export const useTranslation = (): UseTranslationReturn => {
  const { currentLang, setCurrentLang } = useAccessibility();

  const langCode = (['en', 'hi', 'mr', 'te', 'bn'].includes(currentLang)
    ? currentLang
    : 'en') as SupportedLanguage;

  const t = getTranslation(langCode);

  const setLanguage = (lang: SupportedLanguage) => {
    setCurrentLang(lang);
  };

  return {
    currentLang: langCode,
    setLanguage,
    t,
  };
};
