import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { MessageCircle, Lightbulb, X, AlertTriangle, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import owlMascot from '@/assets/owl-mascot.png';
import owlExcited from '@/assets/owl-excited.png';
import owlThinking from '@/assets/owl-thinking.png';
import owlCelebrating from '@/assets/owl-celebrating.png';
import owlError from '@/assets/owl-error.png';
import owlEncouraging from '@/assets/owl-encouraging.png';
import owlConfused from '@/assets/owl-confused.png';
import owlSleeping from '@/assets/owl-sleeping.png';
import owlProud from '@/assets/owl-proud.png';
import useSoundEffects from '@/hooks/useSoundEffects';
import { useMascotVoice } from '@/hooks/useMascotVoice';

export type MascotMood = 'idle' | 'thinking' | 'excited' | 'encouraging' | 'celebrating' | 'error' | 'confused' | 'sleeping' | 'proud';

export interface CodeError {
  type: 'syntax' | 'runtime' | 'logic' | 'unknown';
  message: string;
  line?: number;
}

interface MascotMessage {
  text: string;
  mood: MascotMood;
}

interface MascotGuideProps {
  message?: string;
  mood?: MascotMood;
  messages?: MascotMessage[];
  autoRotate?: boolean;
  rotateInterval?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSpeechBubble?: boolean;
  hints?: string[];
  encouragements?: string[];
  enableSounds?: boolean;
  enableTyping?: boolean;
  typingSpeed?: number;
  codeError?: CodeError | null;
  onDismissError?: () => void;
  enableVoice?: boolean;
  enableIdleAnimations?: boolean;
  idleTimeout?: number;
  xpEarned?: number | null;
  lessonCompleted?: boolean;
  onCelebrationEnd?: () => void;
}

const defaultMessages: MascotMessage[] = [
  { text: "Welcome, young coder! I'm Sage, your guide!", mood: 'excited' },
  { text: "Click Cast Spell to run your code!", mood: 'encouraging' },
  { text: "Don't be afraid to experiment!", mood: 'idle' },
  { text: "Every great wizard started as a beginner!", mood: 'encouraging' },
  { text: "Need help? Check the hint below!", mood: 'thinking' },
];

const defaultHints: string[] = [
  "Try reading the code example again - the pattern is there!",
  "Remember: Python is case-sensitive. Check your spelling!",
  "Don't forget the colon at the end of if, for, while statements!",
  "Indentation matters in Python - use 4 spaces or a tab!",
  "Strings need quotes around them, numbers don't!",
];

const defaultEncouragements: string[] = [
  "You're doing amazing! Keep it up!",
  "Every line of code brings you closer to mastery!",
  "Mistakes are just learning opportunities in disguise!",
  "I believe in you! You've got this!",
  "Great coders aren't born, they're made through practice!",
];

const celebrationMessages: string[] = [
  "Hooray! You did it! That was absolutely magical!",
  "Incredible work! You're becoming a true coding wizard!",
  "Woohoo! Another lesson mastered! I'm so proud of you!",
  "Amazing! Your coding powers are growing stronger!",
  "Fantastic job! You're on fire today!",
  "Brilliant! You solved it like a true champion!",
];

const xpMessages: string[] = [
  "Wow! You just earned some experience points!",
  "Nice! More XP for your magical journey!",
  "Experience gained! You're leveling up!",
  "Sweet! Those XP are making you stronger!",
  "Excellent! Your magic power is increasing!",
];

const idleActions = ['blink', 'wiggle', 'lookAround', 'yawn'] as const;
type IdleAction = typeof idleActions[number];

const errorDebuggingTips: Record<string, string[]> = {
  syntax: ["Check for missing colons at the end of statements!", "Make sure all parentheses are closed!"],
  runtime: ["Make sure all variables are defined before use!", "Check variable name spelling!"],
  logic: ["Your code runs, but check your logic!", "Are you printing the right variable?"],
  unknown: ["Don't worry - let's look at your code together.", "Compare with the example above."],
};

const useTypingAnimation = (text: string, enabled: boolean, speed: number = 30) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!enabled) { setDisplayedText(text); setIsTyping(false); return; }
    setDisplayedText(''); setIsTyping(true);
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length) { setDisplayedText(text.slice(0, currentIndex + 1)); currentIndex++; }
      else { setIsTyping(false); clearInterval(interval); }
    }, speed);
    return () => clearInterval(interval);
  }, [text, enabled, speed]);

  return { displayedText, isTyping };
};

// Idle animation hook
const useIdleAnimation = (enabled: boolean, timeout: number = 5000) => {
  const [idleAction, setIdleAction] = useState<IdleAction | null>(null);
  const [isIdle, setIsIdle] = useState(false);
  const lastActivityRef = useRef(Date.now());
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetIdleTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    setIsIdle(false);
    setIdleAction(null);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const checkIdle = () => {
      const now = Date.now();
      if (now - lastActivityRef.current > timeout) {
        setIsIdle(true);
        // Randomly trigger idle actions
        if (Math.random() > 0.6) {
          const action = idleActions[Math.floor(Math.random() * idleActions.length)];
          setIdleAction(action);
          // Reset action after animation
          setTimeout(() => setIdleAction(null), 1500);
        }
      }
    };

    idleTimerRef.current = setInterval(checkIdle, 2000);

    // Listen for user activity
    const handleActivity = () => resetIdleTimer();
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);

    return () => {
      if (idleTimerRef.current) clearInterval(idleTimerRef.current);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [enabled, timeout, resetIdleTimer]);

  return { idleAction, isIdle, resetIdleTimer };
};

const getMascotImage = (mood: MascotMood) => {
  switch (mood) {
    case 'excited': return owlExcited;
    case 'thinking': return owlThinking;
    case 'celebrating': return owlCelebrating;
    case 'error': return owlError;
    case 'encouraging': return owlEncouraging;
    case 'confused': return owlConfused;
    case 'sleeping': return owlSleeping;
    case 'proud': return owlProud;
    default: return owlMascot;
  }
};

const MascotGuide: React.FC<MascotGuideProps> = ({
  message, mood = 'idle', messages = defaultMessages, autoRotate = false, rotateInterval = 5000,
  className, size = 'md', showSpeechBubble = true, hints = defaultHints, encouragements = defaultEncouragements,
  enableSounds = true, enableTyping = true, typingSpeed = 25, codeError = null, onDismissError, enableVoice = false,
  enableIdleAnimations = true, idleTimeout = 8000, xpEarned = null, lessonCompleted = false, onCelebrationEnd,
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isBouncing, setIsBouncing] = useState(false);
  const [showInteractionMenu, setShowInteractionMenu] = useState(false);
  const [extraMessage, setExtraMessage] = useState<string | null>(null);
  const [extraMood, setExtraMood] = useState<MascotMood>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(enableVoice);
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);
  const [xpMessage, setXpMessage] = useState<string | null>(null);
  
  const { playMascotSpeakSound, playMascotExcitedSound, playMascotThinkingSound, playMascotCelebrateSound, playMascotHintSound } = useSoundEffects();
  const { speak, stop, isSpeaking, isLoading } = useMascotVoice({ enabled: voiceEnabled });
  const { idleAction, isIdle, resetIdleTimer } = useIdleAnimation(enableIdleAnimations, idleTimeout);

  // Handle lesson completion celebration
  useEffect(() => {
    if (lessonCompleted) {
      const msg = celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)];
      setCelebrationMessage(msg);
      if (enableSounds) playMascotCelebrateSound();
      if (voiceEnabled) speak(msg, 'celebrating');
      
      const timer = setTimeout(() => {
        setCelebrationMessage(null);
        onCelebrationEnd?.();
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, [lessonCompleted, enableSounds, playMascotCelebrateSound, voiceEnabled, speak, onCelebrationEnd]);

  // Handle XP earned
  useEffect(() => {
    if (xpEarned && xpEarned > 0) {
      const msg = `${xpMessages[Math.floor(Math.random() * xpMessages.length)]} Plus ${xpEarned} XP!`;
      setXpMessage(msg);
      if (enableSounds) playMascotExcitedSound();
      if (voiceEnabled) speak(msg, 'excited');
      
      const timer = setTimeout(() => setXpMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [xpEarned, enableSounds, playMascotExcitedSound, voiceEnabled, speak]);

  // Handle code errors
  useEffect(() => {
    if (codeError) {
      const tips = errorDebuggingTips[codeError.type] || errorDebuggingTips.unknown;
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      const msg = codeError.line ? `Oops! Line ${codeError.line}: ${codeError.message}. ${randomTip}` : `Oops! ${codeError.message}. ${randomTip}`;
      setErrorMessage(msg);
      if (enableSounds) playMascotThinkingSound();
      if (voiceEnabled) speak(msg, 'error');
    } else { setErrorMessage(null); }
  }, [codeError, enableSounds, playMascotThinkingSound, voiceEnabled, speak]);

  // Determine display state with priority: celebration > xp > error > extra > message > default
  const displayMood: MascotMood = celebrationMessage ? 'celebrating' : xpMessage ? 'proud' : errorMessage ? 'error' : (extraMessage ? extraMood : (message ? mood : messages[currentMessageIndex]?.mood || mood));
  const currentMessage = celebrationMessage || xpMessage || errorMessage || extraMessage || message || messages[currentMessageIndex]?.text || '';
  const { displayedText, isTyping } = useTypingAnimation(currentMessage, enableTyping, typingSpeed);

  const playMoodSound = useCallback((newMood: MascotMood) => {
    if (!enableSounds) return;
    if (newMood === 'excited' || newMood === 'proud') playMascotExcitedSound();
    else if (newMood === 'thinking' || newMood === 'error' || newMood === 'confused') playMascotThinkingSound();
    else if (newMood === 'celebrating') playMascotCelebrateSound();
    else if (newMood === 'encouraging') playMascotSpeakSound();
  }, [enableSounds, playMascotExcitedSound, playMascotThinkingSound, playMascotCelebrateSound, playMascotSpeakSound]);

  useEffect(() => {
    if (!autoRotate || message || extraMessage || errorMessage || celebrationMessage || xpMessage) return;
    const interval = setInterval(() => { setIsVisible(false); setTimeout(() => { setCurrentMessageIndex((prev) => (prev + 1) % messages.length); setIsVisible(true); }, 300); }, rotateInterval);
    return () => clearInterval(interval);
  }, [autoRotate, message, extraMessage, errorMessage, celebrationMessage, xpMessage, messages.length, rotateInterval]);

  useEffect(() => { setIsBouncing(true); const timeout = setTimeout(() => setIsBouncing(false), 500); return () => clearTimeout(timeout); }, [currentMessageIndex, message, extraMessage, errorMessage, celebrationMessage, xpMessage]);
  useEffect(() => { playMoodSound(displayMood); }, [displayMood, playMoodSound]);

  const sizeClasses = { sm: 'w-16 h-16', md: 'w-24 h-24', lg: 'w-32 h-32' };
  const bubbleSizeClasses = { sm: 'max-w-[180px] text-xs', md: 'max-w-[280px] text-sm', lg: 'max-w-[350px] text-base' };

  const getIdleAnimationClass = () => {
    if (!isIdle || !idleAction) return '';
    switch (idleAction) {
      case 'blink': return 'animate-[blink_0.3s_ease-in-out]';
      case 'wiggle': return 'animate-[wiggle_0.5s_ease-in-out]';
      case 'lookAround': return 'animate-[lookAround_1.5s_ease-in-out]';
      case 'yawn': return 'animate-[yawn_1s_ease-in-out]';
      default: return '';
    }
  };

  const getMoodAnimation = () => {
    // Idle animations take precedence when idle
    const idleAnim = getIdleAnimationClass();
    if (idleAnim) return idleAnim;
    
    if (displayMood === 'excited' || displayMood === 'proud') return 'animate-bounce';
    if (displayMood === 'thinking' || displayMood === 'confused') return 'animate-pulse';
    if (displayMood === 'encouraging' && isBouncing) return 'animate-bounce';
    if (displayMood === 'sleeping') return 'animate-[breathe_3s_ease-in-out_infinite]';
    if (displayMood === 'celebrating') return 'animate-[celebrate_0.5s_ease-in-out_infinite]';
    
    // Subtle floating animation when truly idle
    if (isIdle && displayMood === 'idle') return 'animate-[float_3s_ease-in-out_infinite]';
    
    return '';
  };

  const getMoodEmoji = () => {
    const emojis: Record<MascotMood, string> = { 
      excited: '✨', thinking: '🤔', celebrating: '🎉', encouraging: '💪', 
      error: '⚠️', confused: '❓', sleeping: '💤', proud: '👑', idle: '' 
    };
    return emojis[displayMood];
  };

  const handleMascotClick = () => {
    resetIdleTimer();
    if (enableSounds) playMascotSpeakSound();
    if (celebrationMessage || xpMessage) return; // Don't interrupt celebrations
    if (errorMessage) { setErrorMessage(null); onDismissError?.(); stop(); return; }
    setShowInteractionMenu(!showInteractionMenu);
    if (extraMessage) setExtraMessage(null);
  };

  const handleAskHint = () => {
    if (enableSounds) playMascotHintSound();
    const hint = hints[Math.floor(Math.random() * hints.length)];
    setExtraMessage(hint);
    setExtraMood('thinking');
    setShowInteractionMenu(false);
    if (voiceEnabled) speak(hint, 'thinking');
    setTimeout(() => setExtraMessage(null), 8000);
  };

  const handleAskEncouragement = () => {
    if (enableSounds) playMascotExcitedSound();
    const enc = encouragements[Math.floor(Math.random() * encouragements.length)];
    setExtraMessage(enc);
    setExtraMood('encouraging');
    setShowInteractionMenu(false);
    if (voiceEnabled) speak(enc, 'encouraging');
    setTimeout(() => setExtraMessage(null), 6000);
  };

  const handleSpeakMessage = () => {
    if (isSpeaking) stop();
    else speak(currentMessage, displayMood);
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (voiceEnabled) stop();
  };

  return (
    <div className={cn("flex items-end gap-3 relative", className)}>
      {/* Custom keyframes for idle animations */}
      <style>{`
        @keyframes blink {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.1); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        @keyframes lookAround {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes yawn {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05) translateY(-2px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes celebrate {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.1) rotate(-3deg); }
          75% { transform: scale(1.1) rotate(3deg); }
        }
      `}</style>
      
      <div className="relative">
        <div className={cn("relative transition-all duration-300 cursor-pointer", getMoodAnimation(), sizeClasses[size], "hover:scale-110")} onClick={handleMascotClick} role="button">
          <img src={getMascotImage(displayMood)} alt={`Sage the Owl - ${displayMood}`} className="w-full h-full object-contain drop-shadow-lg transition-all duration-300 hover:drop-shadow-xl" />
          {displayMood !== 'idle' && <span className={cn("absolute -top-2 -right-2 text-lg", displayMood === 'error' ? 'animate-pulse' : 'animate-bounce')}>{getMoodEmoji()}</span>}
          <div className={cn("absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-md", 
            errorMessage ? "bg-destructive animate-pulse" : 
            celebrationMessage ? "bg-chart-2 animate-bounce" :
            isSpeaking ? "bg-chart-2 animate-pulse" : 
            "bg-primary animate-pulse"
          )}>
            {errorMessage ? <AlertTriangle className="w-3 h-3 text-destructive-foreground" /> : 
             celebrationMessage ? <span className="text-xs">🎉</span> :
             isSpeaking ? <Volume2 className="w-3 h-3 text-primary-foreground" /> : 
             <MessageCircle className="w-3 h-3 text-primary-foreground" />}
          </div>
        </div>
        
        {/* Celebration particles */}
        {displayMood === 'celebrating' && (
          <div className="absolute inset-0 pointer-events-none overflow-visible">
            {[...Array(8)].map((_, i) => (
              <span key={i} className="absolute text-lg animate-ping" style={{ 
                left: `${10 + i * 12}%`, 
                top: `${5 + (i % 4) * 15}%`, 
                animationDelay: `${i * 0.15}s`, 
                animationDuration: '1s' 
              }}>
                {['⭐', '🎊', '✨', '🌟', '💫', '🎉', '⚡', '💎'][i]}
              </span>
            ))}
          </div>
        )}
        
        {/* XP sparkles */}
        {xpMessage && (
          <div className="absolute inset-0 pointer-events-none overflow-visible">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="absolute text-sm animate-bounce" style={{ 
                left: `${20 + i * 15}%`, 
                top: `${-10 + (i % 3) * 10}%`, 
                animationDelay: `${i * 0.1}s`
              }}>
                ✨
              </span>
            ))}
          </div>
        )}
        
        {displayMood === 'sleeping' && <div className="absolute inset-0 pointer-events-none"><span className="absolute text-xl animate-bounce" style={{ right: '-10px', top: '-10px' }}>💤</span></div>}
        
        {showInteractionMenu && !errorMessage && !celebrationMessage && !xpMessage && (
          <div className="absolute bottom-full left-0 mb-2 bg-card border border-border rounded-lg shadow-lg p-2 z-20 animate-fade-in min-w-[160px]">
            <p className="text-xs text-muted-foreground mb-2 px-2">Ask Sage:</p>
            <Button variant="ghost" size="sm" className="w-full justify-start text-sm gap-2 hover:bg-accent" onClick={handleAskHint}><Lightbulb className="w-4 h-4 text-chart-2" />Give me a hint</Button>
            <Button variant="ghost" size="sm" className="w-full justify-start text-sm gap-2 hover:bg-accent" onClick={handleAskEncouragement}><span className="text-base">💪</span>Encourage me</Button>
            <div className="border-t border-border my-1" />
            <Button variant="ghost" size="sm" className="w-full justify-start text-sm gap-2 hover:bg-accent" onClick={toggleVoice}>
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              {voiceEnabled ? 'Voice On' : 'Voice Off'}
            </Button>
          </div>
        )}
      </div>
      
      {showSpeechBubble && currentMessage && (
        <div className={cn(
          "relative bg-card border rounded-xl p-3 shadow-lg transition-all duration-300", 
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2", 
          bubbleSizeClasses[size], 
          celebrationMessage ? "border-chart-2/50 bg-chart-2/5 ring-2 ring-chart-2/20" :
          xpMessage ? "border-primary/50 bg-primary/5 ring-2 ring-primary/20" :
          errorMessage ? "border-destructive/50 bg-destructive/5" : 
          extraMessage ? "border-primary/50 bg-primary/5" : 
          "border-border"
        )}>
          <div className={cn(
            "absolute left-0 bottom-4 w-3 h-3 transform -translate-x-1/2 rotate-45", 
            celebrationMessage ? "bg-chart-2/5 border-l border-b border-chart-2/50" :
            xpMessage ? "bg-primary/5 border-l border-b border-primary/50" :
            errorMessage ? "bg-destructive/5 border-l border-b border-destructive/50" : 
            extraMessage ? "bg-primary/5 border-l border-b border-primary/50" : 
            "bg-card border-l border-b border-border"
          )} />
          
          {/* Celebration header */}
          {celebrationMessage && (
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-chart-2/20">
              <span className="text-lg">🎉</span>
              <span className="text-xs font-semibold text-chart-2">Lesson Complete!</span>
            </div>
          )}
          
          {/* XP header */}
          {xpMessage && !celebrationMessage && (
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-primary/20">
              <span className="text-lg">⭐</span>
              <span className="text-xs font-semibold text-primary">XP Earned!</span>
            </div>
          )}
          
          {errorMessage && <div className="flex items-center gap-2 mb-2 pb-2 border-b border-destructive/20"><AlertTriangle className="w-4 h-4 text-destructive" /><span className="text-xs font-semibold text-destructive">Debugging Help</span></div>}
          
          <div className="flex items-start gap-2">
            <p className={cn("font-medium leading-relaxed flex-1 whitespace-pre-wrap", errorMessage ? "text-sm" : "text-foreground")}>{displayedText}{isTyping && <span className="inline-block w-1 h-4 bg-primary ml-0.5 animate-pulse" />}</p>
            <div className="flex flex-col gap-1 flex-shrink-0">
              {voiceEnabled && !isTyping && (
                <button onClick={handleSpeakMessage} className={cn("text-muted-foreground hover:text-foreground transition-colors p-1 rounded", isSpeaking && "text-primary")} disabled={isLoading} aria-label={isSpeaking ? "Stop speaking" : "Read aloud"}>
                  {isLoading ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              )}
              {(extraMessage || errorMessage) && !isTyping && !celebrationMessage && !xpMessage && (
                <button onClick={() => { setErrorMessage(null); setExtraMessage(null); onDismissError?.(); stop(); }} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          
          {extraMessage && !isTyping && !errorMessage && !celebrationMessage && !xpMessage && <p className="text-xs text-muted-foreground mt-2">Click me again for more! 🦉</p>}
          {errorMessage && !isTyping && <p className="text-xs text-muted-foreground mt-2">Click me to dismiss! 🔄</p>}
        </div>
      )}
      
      {showInteractionMenu && <div className="fixed inset-0 z-10" onClick={() => setShowInteractionMenu(false)} />}
    </div>
  );
};

export default MascotGuide;
