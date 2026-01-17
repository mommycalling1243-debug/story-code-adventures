import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import owlMascot from '@/assets/owl-mascot.png';

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
  onClick?: () => void;
}

const defaultMessages: MascotMessage[] = [
  { text: "Welcome, young coder! I'm Sage, your guide! 🦉", mood: 'excited' },
  { text: "Click 'Cast Spell' to run your code!", mood: 'encouraging' },
  { text: "Don't be afraid to experiment!", mood: 'idle' },
  { text: "Every great wizard started as a beginner!", mood: 'encouraging' },
  { text: "Need help? Check the hint below! 💡", mood: 'thinking' },
];

const MascotGuide: React.FC<MascotGuideProps> = ({
  message,
  mood = 'idle',
  messages = defaultMessages,
  autoRotate = false,
  rotateInterval = 5000,
  className,
  size = 'md',
  showSpeechBubble = true,
  onClick,
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isBouncing, setIsBouncing] = useState(false);

  // Auto-rotate messages
  useEffect(() => {
    if (!autoRotate || message) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
        setIsVisible(true);
      }, 300);
    }, rotateInterval);

    return () => clearInterval(interval);
  }, [autoRotate, message, messages.length, rotateInterval]);

  // Bounce animation on message change
  useEffect(() => {
    setIsBouncing(true);
    const timeout = setTimeout(() => setIsBouncing(false), 500);
    return () => clearTimeout(timeout);
  }, [currentMessageIndex, message]);

  const currentMessage = message || messages[currentMessageIndex]?.text;
  const currentMood = message ? mood : messages[currentMessageIndex]?.mood || mood;

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const bubbleSizeClasses = {
    sm: 'max-w-[150px] text-xs',
    md: 'max-w-[200px] text-sm',
    lg: 'max-w-[250px] text-base',
  };

  const getMoodAnimation = () => {
    switch (currentMood) {
      case 'excited':
        return 'animate-bounce';
      case 'thinking':
        return 'animate-pulse';
      case 'celebrating':
        return 'animate-spin';
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

  return (
    <div 
      className={cn(
        "flex items-end gap-3 cursor-pointer transition-all duration-300",
        onClick && "hover:scale-105",
        className
      )}
      onClick={onClick}
    >
      {/* Mascot Image */}
      <div className="relative">
        <div
          className={cn(
            "relative transition-transform duration-300",
            getMoodAnimation(),
            sizeClasses[size]
          )}
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
      </div>

      {/* Speech Bubble */}
      {showSpeechBubble && currentMessage && (
        <div
          className={cn(
            "relative bg-card border border-border rounded-xl p-3 shadow-lg",
            "transition-all duration-300",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
            bubbleSizeClasses[size]
          )}
        >
          {/* Speech bubble pointer */}
          <div className="absolute left-0 bottom-4 w-3 h-3 bg-card border-l border-b border-border transform -translate-x-1/2 rotate-45" />
          
          <p className="text-foreground font-medium leading-relaxed">
            {currentMessage}
          </p>
        </div>
      )}
    </div>
  );
};

export default MascotGuide;
