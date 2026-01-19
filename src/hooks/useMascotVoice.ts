import { useState, useCallback, useRef } from 'react';
import type { MascotMood } from '@/components/MascotGuide';

interface UseMascotVoiceOptions {
  enabled?: boolean;
  onSpeakStart?: () => void;
  onSpeakEnd?: () => void;
  onError?: (error: Error) => void;
}

export function useMascotVoice(options: UseMascotVoiceOptions = {}) {
  const { enabled = true, onSpeakStart, onSpeakEnd, onError } = options;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const speak = useCallback(async (text: string, mood: MascotMood = 'idle') => {
    if (!enabled || !text) return;

    // Cancel any ongoing speech
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setIsLoading(true);
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mascot-tts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text, mood }),
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`TTS request failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        setIsSpeaking(true);
        onSpeakStart?.();
      };

      audio.onended = () => {
        setIsSpeaking(false);
        onSpeakEnd?.();
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        setIsLoading(false);
        onError?.(new Error('Audio playback failed'));
        URL.revokeObjectURL(audioUrl);
      };

      setIsLoading(false);
      await audio.play();
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        return; // Intentionally aborted
      }
      console.error('TTS error:', error);
      setIsLoading(false);
      setIsSpeaking(false);
      onError?.(error instanceof Error ? error : new Error('TTS failed'));
    }
  }, [enabled, onSpeakStart, onSpeakEnd, onError]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsSpeaking(false);
    setIsLoading(false);
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    isLoading,
  };
}
