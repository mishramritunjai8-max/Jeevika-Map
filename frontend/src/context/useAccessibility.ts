import { useContext } from 'react';
import { AccessibilityContext, type AccessibilityContextType } from './accessibilityContextDef';

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
