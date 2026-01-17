import { useCallback, useRef } from 'react';

// Using Web Audio API for sound generation - no external files needed
const useSoundEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.log('Audio not supported');
    }
  }, []);

  const playXpSound = useCallback(() => {
    // Cheerful ascending notes
    playTone(523, 0.15, 'sine', 0.2); // C5
    setTimeout(() => playTone(659, 0.15, 'sine', 0.2), 100); // E5
    setTimeout(() => playTone(784, 0.2, 'sine', 0.25), 200); // G5
  }, [playTone]);

  const playLessonCompleteSound = useCallback(() => {
    // Victory fanfare
    playTone(523, 0.15, 'square', 0.15); // C5
    setTimeout(() => playTone(659, 0.15, 'square', 0.15), 120);
    setTimeout(() => playTone(784, 0.15, 'square', 0.15), 240);
    setTimeout(() => playTone(1047, 0.3, 'square', 0.2), 360); // C6
  }, [playTone]);

  const playWorldUnlockSound = useCallback(() => {
    // Epic unlock sound
    playTone(392, 0.2, 'sine', 0.2); // G4
    setTimeout(() => playTone(523, 0.2, 'sine', 0.2), 150);
    setTimeout(() => playTone(659, 0.2, 'sine', 0.2), 300);
    setTimeout(() => playTone(784, 0.3, 'sine', 0.25), 450);
    setTimeout(() => playTone(1047, 0.4, 'sine', 0.3), 600); // C6 hold
  }, [playTone]);

  const playBadgeEarnedSound = useCallback(() => {
    // Magical shimmer sound
    playTone(880, 0.1, 'sine', 0.15);
    setTimeout(() => playTone(1109, 0.1, 'sine', 0.15), 80);
    setTimeout(() => playTone(1319, 0.15, 'sine', 0.2), 160);
    setTimeout(() => playTone(1760, 0.25, 'sine', 0.15), 260);
  }, [playTone]);

  const playClickSound = useCallback(() => {
    playTone(800, 0.05, 'sine', 0.1);
  }, [playTone]);

  const playSuccessSound = useCallback(() => {
    playTone(523, 0.1, 'sine', 0.15);
    setTimeout(() => playTone(659, 0.15, 'sine', 0.2), 100);
  }, [playTone]);

  const playStreakSound = useCallback(() => {
    // Fire/streak sound - rapid ascending
    playTone(440, 0.08, 'sawtooth', 0.1);
    setTimeout(() => playTone(554, 0.08, 'sawtooth', 0.12), 60);
    setTimeout(() => playTone(659, 0.08, 'sawtooth', 0.14), 120);
    setTimeout(() => playTone(880, 0.15, 'sawtooth', 0.15), 180);
  }, [playTone]);

  const playMascotSpeakSound = useCallback(() => {
    // Friendly owl hoot - soft melodic sound
    playTone(440, 0.12, 'sine', 0.15);
    setTimeout(() => playTone(523, 0.15, 'sine', 0.18), 100);
    setTimeout(() => playTone(392, 0.2, 'sine', 0.12), 200);
  }, [playTone]);

  const playMascotExcitedSound = useCallback(() => {
    // Excited chirpy sound
    playTone(659, 0.08, 'sine', 0.12);
    setTimeout(() => playTone(784, 0.08, 'sine', 0.15), 70);
    setTimeout(() => playTone(880, 0.1, 'sine', 0.18), 140);
    setTimeout(() => playTone(1047, 0.15, 'sine', 0.15), 220);
  }, [playTone]);

  const playMascotThinkingSound = useCallback(() => {
    // Contemplative humming sound
    playTone(330, 0.2, 'sine', 0.1);
    setTimeout(() => playTone(350, 0.25, 'sine', 0.12), 180);
  }, [playTone]);

  const playMascotCelebrateSound = useCallback(() => {
    // Celebration fanfare
    playTone(523, 0.1, 'sine', 0.15);
    setTimeout(() => playTone(659, 0.1, 'sine', 0.15), 80);
    setTimeout(() => playTone(784, 0.1, 'sine', 0.18), 160);
    setTimeout(() => playTone(1047, 0.2, 'sine', 0.2), 240);
    setTimeout(() => playTone(1319, 0.25, 'sine', 0.15), 340);
  }, [playTone]);

  const playMascotHintSound = useCallback(() => {
    // Helpful chime - like a light bulb moment
    playTone(698, 0.1, 'sine', 0.12);
    setTimeout(() => playTone(880, 0.12, 'sine', 0.15), 100);
    setTimeout(() => playTone(1047, 0.18, 'sine', 0.18), 200);
  }, [playTone]);

  return {
    playXpSound,
    playLessonCompleteSound,
    playWorldUnlockSound,
    playBadgeEarnedSound,
    playClickSound,
    playSuccessSound,
    playStreakSound,
    playMascotSpeakSound,
    playMascotExcitedSound,
    playMascotThinkingSound,
    playMascotCelebrateSound,
    playMascotHintSound,
  };
};

export default useSoundEffects;
