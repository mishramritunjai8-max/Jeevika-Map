// ==============================================================================
// Hook: useSpeechRecognition
// Browser Web Speech API SpeechRecognition integration for Jeevika Saathi
// Supports English, Hindi, Marathi, Telugu, and Bengali
// ==============================================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { getSpeechLocale } from './useTextToSpeech';

export type SpeechRecognitionStatus =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'captured'
  | 'unsupported';

interface SpeechRecognitionHookOptions {
  onResult?: (transcript: string) => void;
  lang?: string;
  interimResults?: boolean;
}

interface IWindowWithSpeech extends Window {
  SpeechRecognition?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  webkitSpeechRecognition?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const useSpeechRecognition = (options: SpeechRecognitionHookOptions = {}) => {
  const isSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const [status, setStatus] = useState<SpeechRecognitionStatus>(() =>
    isSupported ? 'idle' : 'unsupported'
  );
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const onResultRef = useRef(options.onResult);
  const isListeningRef = useRef(false);

  useEffect(() => {
    onResultRef.current = options.onResult;
  }, [options.onResult]);

  useEffect(() => {
    if (!isSupported) return;

    const win = window as unknown as IWindowWithSpeech;
    const SpeechRecognitionConstructor = win.SpeechRecognition || win.webkitSpeechRecognition;

    try {
      const recognition = new SpeechRecognitionConstructor();
      recognition.continuous = false;
      recognition.interimResults = options.interimResults ?? true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        isListeningRef.current = true;
        setStatus('listening');
        setErrorMessage(null);
      };

      recognition.onspeechstart = () => {
        setStatus('listening');
      };

      recognition.onspeechend = () => {
        setStatus('processing');
      };

      recognition.onresult = (event: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        let finalChunk = '';
        let interimChunk = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          const text = res[0]?.transcript || '';
          if (res.isFinal) {
            finalChunk += text;
          } else {
            interimChunk += text;
          }
        }

        if (interimChunk) {
          setInterimTranscript(interimChunk);
        }

        if (finalChunk) {
          const trimmed = finalChunk.trim();
          setTranscript(trimmed);
          setInterimTranscript('');
          setStatus('captured');

          if (onResultRef.current) {
            onResultRef.current(trimmed);
          }
        }
      };

      recognition.onerror = (event: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        isListeningRef.current = false;
        const err = event.error;
        console.warn('[useSpeechRecognition] Error event:', err);

        if (err === 'not-allowed' || err === 'service-not-allowed') {
          setErrorMessage('माइक्रोफ़ोन अनुमति आवश्यक है / Microphone permission is required to use voice input.');
        } else if (err === 'no-speech') {
          setErrorMessage('कोई आवाज़ नहीं सुनी गई / No speech was detected. Please try speaking again.');
        } else if (err === 'network') {
          setErrorMessage('नेटवर्क समस्या / Network issue communicating with speech service.');
        } else if (err !== 'aborted') {
          setErrorMessage(`आवाज़ पहचान त्रुटि / Speech recognition error: ${err}`);
        }

        setStatus('idle');
        setInterimTranscript('');
      };

      recognition.onend = () => {
        isListeningRef.current = false;
        // Return smoothly to idle state
        setTimeout(() => {
          setStatus((prev) => (prev === 'captured' || prev === 'processing' ? 'idle' : prev));
        }, 1200);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('[useSpeechRecognition] Initialization error:', e);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore abort on cleanup
        }
      }
    };
  }, [isSupported, options.interimResults]);

  const startListening = useCallback(
    (langCode?: string) => {
      if (!isSupported) {
        setStatus('unsupported');
        setErrorMessage('इस ब्राउज़र में आवाज़ पहचान समर्थित नहीं है / Voice input is not supported in this browser.');
        return;
      }

      const recognition = recognitionRef.current;
      if (!recognition) return;

      const speechLocale = getSpeechLocale(langCode || options.lang);

      setTranscript('');
      setInterimTranscript('');
      setErrorMessage(null);

      try {
        // If already listening, stop first
        if (isListeningRef.current) {
          try {
            recognition.stop();
          } catch {
            // ignore
          }
        }

        recognition.lang = speechLocale;
        recognition.start();
      } catch (e: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        console.warn('[useSpeechRecognition] Start listening error:', e);
        // InvalidStateError means already started
        if (e.name !== 'InvalidStateError') {
          setStatus('idle');
        }
      }
    },
    [isSupported]
  );

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn('[useSpeechRecognition] Stop error:', e);
      }
    }
    isListeningRef.current = false;
  }, []);

  const reset = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setErrorMessage(null);
    setStatus(isSupported ? 'idle' : 'unsupported');
  }, [isSupported]);

  return {
    status,
    transcript,
    interimTranscript,
    errorMessage,
    isSupported,
    startListening,
    stopListening,
    reset,
  };
};
