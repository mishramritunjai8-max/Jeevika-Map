// ==============================================================================
// Hook: useTextToSpeech
// Browser Web Speech API SpeechSynthesis integration for Jeevika Saathi
// Supports English, Hindi, Marathi, Telugu, and Bengali
// ==============================================================================

import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseTextToSpeechOptions {
  defaultLang?: string;
  rate?: number;
  pitch?: number;
}

export interface UseTextToSpeechReturn {
  isSupported: boolean;
  isSpeaking: boolean;
  speakingId: string | null;
  speak: (text: string, langCode?: string, messageId?: string) => void;
  stop: () => void;
}

/**
 * Strips markdown symbols, URLs, and noisy formatting for clean speech synthesis
 */
export const cleanTextForSpeech = (rawText: string): string => {
  if (!rawText) return '';
  return rawText
    // Remove markdown links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove markdown headers #, ##, etc.
    .replace(/^#+\s+/gm, '')
    // Remove bold/italic markers **, *, __, _
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
    // Remove inline code ticks `code` -> code
    .replace(/`([^`]+)`/g, '$1')
    // Remove bullet points like •, -, * at start of lines
    .replace(/^\s*[•\-\*]\s+/gm, '')
    // Remove URLs
    .replace(/https?:\/\/\S+/g, '')
    // Normalize excessive whitespaces and newlines
    .replace(/\n+/g, '. ')
    .replace(/\s{2,}/g, ' ')
    .trim();
};

/**
 * Maps app language codes to preferred speech locales
 */
export const getSpeechLocale = (langCode?: string): string => {
  let code = langCode;
  if (!code || code === 'auto') {
    try {
      const saved = localStorage.getItem('jeevika-language');
      if (saved && saved !== 'auto') {
        code = saved;
      }
    } catch {
      // ignore storage access errors
    }
  }

  if (!code || code === 'auto') {
    return 'hi-IN';
  }

  const clean = code.trim().toLowerCase().replace('_', '-');
  if (clean.startsWith('hi')) return 'hi-IN';
  if (clean.startsWith('mr')) return 'mr-IN';
  if (clean.startsWith('te')) return 'te-IN';
  if (clean.startsWith('bn')) return 'bn-IN';
  if (clean.startsWith('en')) return 'en-IN';
  return 'hi-IN';
};

export const useTextToSpeech = (
  options: UseTextToSpeechOptions = {}
): UseTextToSpeechReturn => {
  const isSupported =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window;

  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load available browser voices
  useEffect(() => {
    if (!isSupported) return;

    const updateVoices = () => {
      try {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      } catch (e) {
        console.warn('[useTextToSpeech] Could not load speech voices:', e);
      }
    };

    updateVoices();

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [isSupported]);

  // Cancel speech on unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        try {
          window.speechSynthesis.cancel();
        } catch {
          // Ignore teardown cancellation errors
        }
      }
    };
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      console.warn('[useTextToSpeech] Stop error:', e);
    }
    setIsSpeaking(false);
    setSpeakingId(null);
    currentUtteranceRef.current = null;
  }, [isSupported]);

  const speak = useCallback(
    (text: string, langCode: string = 'en', messageId: string = '') => {
      if (!isSupported) {
        console.warn('[useTextToSpeech] SpeechSynthesis is not supported in this browser.');
        return;
      }

      const cleaned = cleanTextForSpeech(text);
      if (!cleaned) return;

      // Stop any ongoing speech before starting a new one
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        console.warn('[useTextToSpeech] Cancel prior speech error:', e);
      }

      const targetLocale = getSpeechLocale(langCode);
      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.lang = targetLocale;
      utterance.rate = options.rate ?? 1.0;
      utterance.pitch = options.pitch ?? 1.0;

      // Select best voice if available
      if (voices.length > 0) {
        const langLower = targetLocale.toLowerCase().replace('_', '-');
        const baseLang = langLower.split('-')[0];

        const matchingVoice =
          // 1. Exact locale match (e.g., hi-IN)
          voices.find((v) => v.lang.toLowerCase().replace('_', '-') === langLower) ||
          // 2. Base language match (e.g., hi)
          voices.find((v) => v.lang.toLowerCase().startsWith(baseLang)) ||
          // 3. Indian English fallback (natural for Indian accents & English/Hinglish)
          voices.find((v) => v.lang.toLowerCase().replace('_', '-') === 'en-in') ||
          // 4. Any English voice fallback
          voices.find((v) => v.lang.toLowerCase().startsWith('en'));

        if (matchingVoice) {
          utterance.voice = matchingVoice;
        }
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setSpeakingId(messageId || 'active');
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setSpeakingId(null);
        currentUtteranceRef.current = null;
      };

      utterance.onerror = (e) => {
        // 'interrupted' / 'canceled' are normal when stop() or a new message starts
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn('[useTextToSpeech] Speech error:', e.error);
        }
        setIsSpeaking(false);
        setSpeakingId(null);
        currentUtteranceRef.current = null;
      };

      currentUtteranceRef.current = utterance;

      try {
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn('[useTextToSpeech] Speak invocation error:', e);
        setIsSpeaking(false);
        setSpeakingId(null);
      }
    },
    [isSupported, voices, options.rate, options.pitch]
  );

  return {
    isSupported,
    isSpeaking,
    speakingId,
    speak,
    stop,
  };
};
