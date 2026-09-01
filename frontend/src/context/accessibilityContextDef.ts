import { createContext } from 'react';

export interface AccessibilityContextType {
  fontScale: number;
  setFontScale: React.Dispatch<React.SetStateAction<number>>;
  isHighContrast: boolean;
  setIsHighContrast: React.Dispatch<React.SetStateAction<boolean>>;
  currentLang: string;
  setCurrentLang: React.Dispatch<React.SetStateAction<string>>;
}

export const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);
