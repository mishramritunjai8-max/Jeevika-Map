import { useState, useEffect, useRef, useCallback } from 'react';

export type SpeechRecognitionStatus =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'captured'
  | 'unsupported';

interface SpeechRecognitionHookOptions {
  onResult?: (transcript: string) => void;
  lang?: string;
}

// Browser Web Speech API type definitions for TypeScript
interface IWindowWithSpeech extends Window {
  SpeechRecognition?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  webkitSpeechRecognition?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const useSpeechRecognition = (options: SpeechRecognitionHookOptions = {}) => {
  const isSupported = typeof window !== 'undefined' && (
    'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
  );

  const [status, setStatus] = useState<SpeechRecognitionStatus>(() =>
    isSupported ? 'idle' : 'unsupported'
  );
  const [transcript, setTranscript] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const onResultRef = useRef(options.onResult);

  useEffect(() => {
    onResultRef.current = options.onResult;
  }, [options.onResult]);

  useEffect(() => {
    if (!isSupported) {
      return;
    }

    const win = window as unknown as IWindowWithSpeech;
    const SpeechRecognitionConstructor = win.SpeechRecognition || win.webkitSpeechRecognition;

    try {
      const recognition = new SpeechRecognitionConstructor();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
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
        const text = event.results?.[0]?.[0]?.transcript || '';
        if (text) {
          setTranscript(text);
          setStatus('captured');
          if (onResultRef.current) {
            onResultRef.current(text);
          }
        } else {
          setStatus('idle');
        }
      };

      recognition.onerror = (event: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        console.warn('Speech recognition event error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access was denied. Please allow microphone permissions or use keyboard entry.');
        } else if (event.error === 'no-speech') {
          setErrorMessage('No speech was detected. Please try speaking again.');
        } else {
          setErrorMessage(`Speech recognition error: ${event.error}`);
        }
        setStatus('idle');
      };

      recognition.onend = () => {
        // Return to idle after a moment if captured
        setTimeout(() => {
          setStatus((prev) => (prev === 'captured' || prev === 'processing' ? 'idle' : prev));
        }, 1500);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Could not initialize SpeechRecognition:', e);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore abort exceptions on teardown
        }
      }
    };
  }, [isSupported]);

  const startListening = useCallback((langCode: string = 'hi-IN') => {
    if (!isSupported || !recognitionRef.current) {
      setStatus('unsupported');
      return;
    }

    setTranscript('');
    setErrorMessage(null);

    try {
      recognitionRef.current.lang = langCode;
      recognitionRef.current.start();
    } catch (e) {
      console.warn('SpeechRecognition start error:', e);
      setStatus('idle');
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn('SpeechRecognition stop error:', e);
      }
    }
  }, []);

  const reset = useCallback(() => {
    setTranscript('');
    setErrorMessage(null);
    setStatus(isSupported ? 'idle' : 'unsupported');
  }, [isSupported]);

  return {
    status,
    transcript,
    errorMessage,
    isSupported,
    startListening,
    stopListening,
    reset,
  };
};
