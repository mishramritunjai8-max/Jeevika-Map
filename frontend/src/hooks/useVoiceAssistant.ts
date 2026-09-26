// ==============================================================================
// Hook: useVoiceAssistant
// Unified Voice Assistant Hook for Jeevika Saathi (STT + TTS + Multilingual)
// ==============================================================================

import { useState, useCallback } from 'react';
import { useAccessibility } from '../context/useAccessibility';
import { useSpeechRecognition, type SpeechRecognitionStatus } from './useSpeechRecognition';
import { useTextToSpeech, getSpeechLocale } from './useTextToSpeech';

export interface UseVoiceAssistantOptions {
  onTranscriptCaptured?: (transcript: string) => void;
  autoSpeak?: boolean;
}

export interface UseVoiceAssistantReturn {
  // Speech Recognition (STT)
  isSpeechSupported: boolean;
  isListening: boolean;
  recognitionStatus: SpeechRecognitionStatus;
  transcript: string;
  interimTranscript: string;
  recognitionError: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetSpeech: () => void;

  // Text-To-Speech (TTS)
  isTtsSupported: boolean;
  isSpeaking: boolean;
  speakingId: string | null;
  speakMessage: (messageId: string, text: string) => void;
  stopSpeaking: () => void;

  // Configuration
  autoSpeak: boolean;
  setAutoSpeak: (val: boolean | ((prev: boolean) => boolean)) => void;
  currentLang: string;
  speechLocale: string;
}

export const useVoiceAssistant = (
  options: UseVoiceAssistantOptions = {}
): UseVoiceAssistantReturn => {
  const { currentLang } = useAccessibility();
  const [autoSpeak, setAutoSpeak] = useState<boolean>(options.autoSpeak ?? true);

  const speechLocale = getSpeechLocale(currentLang);

  const speechRecognition = useSpeechRecognition({
    onResult: options.onTranscriptCaptured,
    lang: currentLang,
    interimResults: true,
  });

  const textToSpeech = useTextToSpeech({
    defaultLang: currentLang,
  });

  const startListening = useCallback(() => {
    // If speaking when user clicks microphone, stop speech immediately
    if (textToSpeech.isSpeaking) {
      textToSpeech.stop();
    }
    speechRecognition.startListening(currentLang);
  }, [currentLang, speechRecognition, textToSpeech]);

  const speakMessage = useCallback(
    (messageId: string, text: string) => {
      // If listening when speech is triggered, stop listening
      if (speechRecognition.status === 'listening') {
        speechRecognition.stopListening();
      }

      if (textToSpeech.isSpeaking && textToSpeech.speakingId === messageId) {
        textToSpeech.stop();
      } else {
        textToSpeech.speak(text, currentLang, messageId);
      }
    },
    [currentLang, speechRecognition, textToSpeech]
  );

  return {
    isSpeechSupported: speechRecognition.isSupported,
    isListening: speechRecognition.status === 'listening',
    recognitionStatus: speechRecognition.status,
    transcript: speechRecognition.transcript,
    interimTranscript: speechRecognition.interimTranscript,
    recognitionError: speechRecognition.errorMessage,
    startListening,
    stopListening: speechRecognition.stopListening,
    resetSpeech: speechRecognition.reset,

    isTtsSupported: textToSpeech.isSupported,
    isSpeaking: textToSpeech.isSpeaking,
    speakingId: textToSpeech.speakingId,
    speakMessage,
    stopSpeaking: textToSpeech.stop,

    autoSpeak,
    setAutoSpeak,
    currentLang,
    speechLocale,
  };
};
