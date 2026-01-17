import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { MessageCircle, Lightbulb, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import owlMascot from '@/assets/owl-mascot.png';
import useSoundEffects from '@/hooks/useSoundEffects';

type MascotMood = 'idle' | 'thinking' | 'excited' | 'encouraging' | 'celebrating';

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
}

const defaultMessages: MascotMessage[] = [
  { text: "Welcome, young coder! I'm Sage, your guide! 🦉", mood: 'excited' },
  { text: "Click 'Cast Spell' to run your code!", mood: 'encouraging' },
  { text: "Don't be afraid to experiment!", mood: 'idle' },
  { text: "Every great wizard started as a beginner!", mood: 'encouraging' },
  { text: "Need help? Check the hint below! 💡", mood: 'thinking' },
];

const defaultHints: string[] = [
  "Try reading the code example again - the pattern is there! 🔍",
  "Remember: Python is case-sensitive. Check your spelling! ✨",
  "Don't forget the colon (:) at the end of if/for/while statements!",
  "Indentation matters in Python - use 4 spaces or a tab! 📐",
  "Strings need quotes around them, numbers don't! 💬",
  "Check the hint button below the code editor for specific help! 💡",
];

const defaultEncouragements: string[] = [
  "You're doing amazing! Keep it up! 🌟",
  "Every line of code brings you closer to mastery! 💪",
  "Mistakes are just learning opportunities in disguise! 🎭",
  "I believe in you! You've got this! 🦉✨",
  "Great coders aren't born, they're made through practice! 🔥",
  "Take your time - there's no rush in learning! 🌈",
  "You're braver than you believe and smarter than you think! 💫",
];

// Typing animation hook
const useTypingAnimation = (text: string, enabled: boolean, speed: number = 30) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setDisplayedText(text);
      setIsTyping(false);
      return;
    }

    setDisplayedText('');
    setIsTyping(true);
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, enabled, speed]);

  return { displayedText, isTyping };
};

const MascotGuide: React.FC<MascotGuideProps> = ({
  message,
  mood = 'idle',
  messages = defaultMessages,
  autoRotate = false,
  rotateInterval = 5000,
  className,
  size = 'md',
  showSpeechBubble = true,
  hints = defaultHints,
  encouragements = defaultEncouragements,
  enableSounds = true,
  enableTyping = true,
  typingSpeed = 25,
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isBouncing, setIsBouncing] = useState(false);
  const [showInteractionMenu, setShowInteractionMenu] = useState(false);
  const [extraMessage, setExtraMessage] = useState<string | null>(null);
  const [extraMood, setExtraMood] = useState<MascotMood>('idle');
  
  const {
    playMascotSpeakSound,
    playMascotExcitedSound,
    playMascotThinkingSound,
    playMascotCelebrateSound,
    playMascotHintSound,
  } = useSoundEffects();

  const currentMessage = extraMessage || message || messages[currentMessageIndex]?.text || '';
  const currentMood = extraMessage ? extraMood : (message ? mood : messages[currentMessageIndex]?.mood || mood);

  // Typing animation
  const { displayedText, isTyping } = useTypingAnimation(currentMessage, enableTyping, typingSpeed);

  // Play sound based on mood
  const playMoodSound = useCallback((newMood: MascotMood) => {
    if (!enableSounds) return;
    
    switch (newMood) {
      case 'excited':
        playMascotExcitedSound();
        break;
      case 'thinking':
        playMascotThinkingSound();
        break;
      case 'celebrating':
        playMascotCelebrateSound();
        break;
      case 'encouraging':
        playMascotSpeakSound();
        break;
      default:
        break;
    }
  }, [enableSounds, playMascotExcitedSound, playMascotThinkingSound, playMascotCelebrateSound, playMascotSpeakSound]);

  // Auto-rotate messages
  useEffect(() => {
    if (!autoRotate || message || extraMessage) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
        setIsVisible(true);
      }, 300);
    }, rotateInterval);

    return () => clearInterval(interval);
  }, [autoRotate, message, extraMessage, messages.length, rotateInterval]);

  // Bounce animation on message change
  useEffect(() => {
    setIsBouncing(true);
    const timeout = setTimeout(() => setIsBouncing(false), 500);
    return () => clearTimeout(timeout);
  }, [currentMessageIndex, message, extraMessage]);

  // Play sound when mood changes
  useEffect(() => {
    playMoodSound(currentMood);
  }, [currentMood, playMoodSound]);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const bubbleSizeClasses = {
    sm: 'max-w-[180px] text-xs',
    md: 'max-w-[220px] text-sm',
    lg: 'max-w-[280px] text-base',
  };

  const getMoodAnimation = () => {
    switch (currentMood) {
      case 'excited':
        return 'animate-bounce';
      case 'thinking':
        return 'animate-pulse';
      case 'celebrating':
        return '';
      case 'encouraging':
        return isBouncing ? 'animate-bounce' : '';
      default:
        return '';
    }
  };

  const getMoodEmoji = () => {
    switch (currentMood) {
      case 'excited':
        return '✨';
      case 'thinking':
        return '🤔';
      case 'celebrating':
        return '🎉';
      case 'encouraging':
        return '💪';
      default:
        return '';
    }
  };

  const handleMascotClick = () => {
    if (enableSounds) playMascotSpeakSound();
    setShowInteractionMenu(!showInteractionMenu);
    if (extraMessage) {
      setExtraMessage(null);
    }
  };

  const handleAskHint = () => {
    if (enableSounds) playMascotHintSound();
    const randomHint = hints[Math.floor(Math.random() * hints.length)];
    setExtraMessage(randomHint);
    setExtraMood('thinking');
    setShowInteractionMenu(false);
    
    setTimeout(() => {
      setExtraMessage(null);
    }, 8000);
  };

  const handleAskEncouragement = () => {
    if (enableSounds) playMascotExcitedSound();
    const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
    setExtraMessage(randomEncouragement);
    setExtraMood('encouraging');
    setShowInteractionMenu(false);
    
    setTimeout(() => {
      setExtraMessage(null);
    }, 6000);
  };

  const handleDismissExtra = () => {
    setExtraMessage(null);
  };

  return (
    <div 
      className={cn(
        "flex items-end gap-3 relative",
        className
      )}
    >
      {/* Mascot Image */}
      <div className="relative">
        <div
          className={cn(
            "relative transition-transform duration-300 cursor-pointer",
            getMoodAnimation(),
            sizeClasses[size],
            "hover:scale-110"
          )}
          onClick={handleMascotClick}
          role="button"
          aria-label="Click Sage the Owl for hints or encouragement"
        >
          <img
            src={owlMascot}
            alt="Sage the Owl Guide"
            className={cn(
              "w-full h-full object-contain drop-shadow-lg",
              "hover:drop-shadow-xl transition-all duration-300"
            )}
          />
          
          {/* Mood indicator */}
          {currentMood !== 'idle' && (
            <span className="absolute -top-2 -right-2 text-lg animate-bounce">
              {getMoodEmoji()}
            </span>
          )}

          {/* Click indicator */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md animate-pulse">
            <MessageCircle className="w-3 h-3 text-primary-foreground" />
          </div>
        </div>

        {/* Floating particles for celebration */}
        {currentMood === 'celebrating' && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className="absolute text-lg animate-ping"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${10 + (i % 3) * 20}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s',
                }}
              >
                ⭐
              </span>
            ))}
          </div>
        )}

        {/* Interaction Menu */}
        {showInteractionMenu && (
          <div className="absolute bottom-full left-0 mb-2 bg-card border border-border rounded-lg shadow-lg p-2 z-20 animate-fade-in">
            <p className="text-xs text-muted-foreground mb-2 px-2">Ask Sage:</p>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm gap-2 hover:bg-accent"
              onClick={handleAskHint}
            >
              <Lightbulb className="w-4 h-4 text-chart-2" />
              Give me a hint
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm gap-2 hover:bg-accent"
              onClick={handleAskEncouragement}
            >
              <span className="text-base">💪</span>
              Encourage me
            </Button>
          </div>
        )}
      </div>

      {/* Speech Bubble with Typing Animation */}
      {showSpeechBubble && currentMessage && (
        <div
          className={cn(
            "relative bg-card border border-border rounded-xl p-3 shadow-lg",
            "transition-all duration-300",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
            bubbleSizeClasses[size],
            extraMessage && "border-primary/50 bg-primary/5"
          )}
        >
          {/* Speech bubble pointer */}
          <div className={cn(
            "absolute left-0 bottom-4 w-3 h-3 bg-card border-l border-b border-border transform -translate-x-1/2 rotate-45",
            extraMessage && "border-primary/50 bg-primary/5"
          )} />
          
          <div className="flex items-start gap-2">
            <p className="text-foreground font-medium leading-relaxed flex-1">
              {displayedText}
              {isTyping && (
                <span className="inline-block w-1 h-4 bg-primary ml-0.5 animate-pulse" />
              )}
            </p>
            {extraMessage && !isTyping && (
              <button
                onClick={handleDismissExtra}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Dismiss message"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {extraMessage && !isTyping && (
            <p className="text-xs text-muted-foreground mt-2">
              Click me again for more! 🦉
            </p>
          )}
        </div>
      )}

      {/* Click outside to close menu */}
      {showInteractionMenu && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowInteractionMenu(false)}
        />
      )}
    </div>
  );
};

export default MascotGuide;
