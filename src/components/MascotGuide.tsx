import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { MessageCircle, Lightbulb, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import owlMascot from '@/assets/owl-mascot.png';
import owlExcited from '@/assets/owl-excited.png';
import owlThinking from '@/assets/owl-thinking.png';
import owlCelebrating from '@/assets/owl-celebrating.png';
import owlError from '@/assets/owl-error.png';
import owlEncouraging from '@/assets/owl-encouraging.png';
import useSoundEffects from '@/hooks/useSoundEffects';

export type MascotMood = 'idle' | 'thinking' | 'excited' | 'encouraging' | 'celebrating' | 'error';

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
];

const defaultEncouragements: string[] = [
  "You're doing amazing! Keep it up! 🌟",
  "Every line of code brings you closer to mastery! 💪",
  "Mistakes are just learning opportunities in disguise! 🎭",
  "I believe in you! You've got this! 🦉✨",
  "Great coders aren't born, they're made through practice! 🔥",
];

const errorDebuggingTips: Record<string, string[]> = {
  syntax: ["Check for missing colons (:) at the end of statements!", "Make sure all parentheses are closed!"],
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

const getMascotImage = (mood: MascotMood) => {
  switch (mood) {
    case 'excited': return owlExcited;
    case 'thinking': return owlThinking;
    case 'celebrating': return owlCelebrating;
    case 'error': return owlError;
    case 'encouraging': return owlEncouraging;
    default: return owlMascot;
  }
};

const MascotGuide: React.FC<MascotGuideProps> = ({
  message, mood = 'idle', messages = defaultMessages, autoRotate = false, rotateInterval = 5000,
  className, size = 'md', showSpeechBubble = true, hints = defaultHints, encouragements = defaultEncouragements,
  enableSounds = true, enableTyping = true, typingSpeed = 25, codeError = null, onDismissError,
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isBouncing, setIsBouncing] = useState(false);
  const [showInteractionMenu, setShowInteractionMenu] = useState(false);
  const [extraMessage, setExtraMessage] = useState<string | null>(null);
  const [extraMood, setExtraMood] = useState<MascotMood>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { playMascotSpeakSound, playMascotExcitedSound, playMascotThinkingSound, playMascotCelebrateSound, playMascotHintSound } = useSoundEffects();

  useEffect(() => {
    if (codeError) {
      const tips = errorDebuggingTips[codeError.type] || errorDebuggingTips.unknown;
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      setErrorMessage(codeError.line ? `Oops! Line ${codeError.line}: ${codeError.message}\n\n💡 ${randomTip}` : `Oops! ${codeError.message}\n\n💡 ${randomTip}`);
      if (enableSounds) playMascotThinkingSound();
    } else { setErrorMessage(null); }
  }, [codeError, enableSounds, playMascotThinkingSound]);

  const displayMood: MascotMood = errorMessage ? 'error' : (extraMessage ? extraMood : (message ? mood : messages[currentMessageIndex]?.mood || mood));
  const currentMessage = errorMessage || extraMessage || message || messages[currentMessageIndex]?.text || '';
  const { displayedText, isTyping } = useTypingAnimation(currentMessage, enableTyping, typingSpeed);

  const playMoodSound = useCallback((newMood: MascotMood) => {
    if (!enableSounds) return;
    if (newMood === 'excited') playMascotExcitedSound();
    else if (newMood === 'thinking' || newMood === 'error') playMascotThinkingSound();
    else if (newMood === 'celebrating') playMascotCelebrateSound();
    else if (newMood === 'encouraging') playMascotSpeakSound();
  }, [enableSounds, playMascotExcitedSound, playMascotThinkingSound, playMascotCelebrateSound, playMascotSpeakSound]);

  useEffect(() => {
    if (!autoRotate || message || extraMessage || errorMessage) return;
    const interval = setInterval(() => { setIsVisible(false); setTimeout(() => { setCurrentMessageIndex((prev) => (prev + 1) % messages.length); setIsVisible(true); }, 300); }, rotateInterval);
    return () => clearInterval(interval);
  }, [autoRotate, message, extraMessage, errorMessage, messages.length, rotateInterval]);

  useEffect(() => { setIsBouncing(true); const timeout = setTimeout(() => setIsBouncing(false), 500); return () => clearTimeout(timeout); }, [currentMessageIndex, message, extraMessage, errorMessage]);
  useEffect(() => { playMoodSound(displayMood); }, [displayMood, playMoodSound]);

  const sizeClasses = { sm: 'w-16 h-16', md: 'w-24 h-24', lg: 'w-32 h-32' };
  const bubbleSizeClasses = { sm: 'max-w-[180px] text-xs', md: 'max-w-[280px] text-sm', lg: 'max-w-[350px] text-base' };

  const getMoodAnimation = () => {
    if (displayMood === 'excited') return 'animate-bounce';
    if (displayMood === 'thinking') return 'animate-pulse';
    if (displayMood === 'encouraging' && isBouncing) return 'animate-bounce';
    return '';
  };

  const getMoodEmoji = () => {
    const emojis: Record<MascotMood, string> = { excited: '✨', thinking: '🤔', celebrating: '🎉', encouraging: '💪', error: '⚠️', idle: '' };
    return emojis[displayMood];
  };

  const handleMascotClick = () => {
    if (enableSounds) playMascotSpeakSound();
    if (errorMessage) { setErrorMessage(null); onDismissError?.(); return; }
    setShowInteractionMenu(!showInteractionMenu);
    if (extraMessage) setExtraMessage(null);
  };

  const handleAskHint = () => {
    if (enableSounds) playMascotHintSound();
    setExtraMessage(hints[Math.floor(Math.random() * hints.length)]);
    setExtraMood('thinking'); setShowInteractionMenu(false);
    setTimeout(() => setExtraMessage(null), 8000);
  };

  const handleAskEncouragement = () => {
    if (enableSounds) playMascotExcitedSound();
    setExtraMessage(encouragements[Math.floor(Math.random() * encouragements.length)]);
    setExtraMood('encouraging'); setShowInteractionMenu(false);
    setTimeout(() => setExtraMessage(null), 6000);
  };

  return (
    <div className={cn("flex items-end gap-3 relative", className)}>
      <div className="relative">
        <div className={cn("relative transition-all duration-300 cursor-pointer", getMoodAnimation(), sizeClasses[size], "hover:scale-110")} onClick={handleMascotClick} role="button">
          <img src={getMascotImage(displayMood)} alt={`Sage the Owl - ${displayMood}`} className="w-full h-full object-contain drop-shadow-lg transition-all duration-300 hover:drop-shadow-xl" />
          {displayMood !== 'idle' && <span className={cn("absolute -top-2 -right-2 text-lg", displayMood === 'error' ? 'animate-pulse' : 'animate-bounce')}>{getMoodEmoji()}</span>}
          <div className={cn("absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-md", errorMessage ? "bg-destructive animate-pulse" : "bg-primary animate-pulse")}>
            {errorMessage ? <AlertTriangle className="w-3 h-3 text-destructive-foreground" /> : <MessageCircle className="w-3 h-3 text-primary-foreground" />}
          </div>
        </div>
        {displayMood === 'celebrating' && <div className="absolute inset-0 pointer-events-none">{[...Array(5)].map((_, i) => <span key={i} className="absolute text-lg animate-ping" style={{ left: `${20 + i * 15}%`, top: `${10 + (i % 3) * 20}%`, animationDelay: `${i * 0.2}s`, animationDuration: '1s' }}>⭐</span>)}</div>}
        {showInteractionMenu && !errorMessage && (
          <div className="absolute bottom-full left-0 mb-2 bg-card border border-border rounded-lg shadow-lg p-2 z-20 animate-fade-in">
            <p className="text-xs text-muted-foreground mb-2 px-2">Ask Sage:</p>
            <Button variant="ghost" size="sm" className="w-full justify-start text-sm gap-2 hover:bg-accent" onClick={handleAskHint}><Lightbulb className="w-4 h-4 text-chart-2" />Give me a hint</Button>
            <Button variant="ghost" size="sm" className="w-full justify-start text-sm gap-2 hover:bg-accent" onClick={handleAskEncouragement}><span className="text-base">💪</span>Encourage me</Button>
          </div>
        )}
      </div>
      {showSpeechBubble && currentMessage && (
        <div className={cn("relative bg-card border rounded-xl p-3 shadow-lg transition-all duration-300", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2", bubbleSizeClasses[size], errorMessage ? "border-destructive/50 bg-destructive/5" : extraMessage ? "border-primary/50 bg-primary/5" : "border-border")}>
          <div className={cn("absolute left-0 bottom-4 w-3 h-3 transform -translate-x-1/2 rotate-45", errorMessage ? "bg-destructive/5 border-l border-b border-destructive/50" : extraMessage ? "bg-primary/5 border-l border-b border-primary/50" : "bg-card border-l border-b border-border")} />
          {errorMessage && <div className="flex items-center gap-2 mb-2 pb-2 border-b border-destructive/20"><AlertTriangle className="w-4 h-4 text-destructive" /><span className="text-xs font-semibold text-destructive">Debugging Help</span></div>}
          <div className="flex items-start gap-2">
            <p className={cn("font-medium leading-relaxed flex-1 whitespace-pre-wrap", errorMessage ? "text-sm" : "text-foreground")}>{displayedText}{isTyping && <span className="inline-block w-1 h-4 bg-primary ml-0.5 animate-pulse" />}</p>
            {(extraMessage || errorMessage) && !isTyping && <button onClick={() => { setErrorMessage(null); setExtraMessage(null); onDismissError?.(); }} className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"><X className="w-4 h-4" /></button>}
          </div>
          {extraMessage && !isTyping && !errorMessage && <p className="text-xs text-muted-foreground mt-2">Click me again for more! 🦉</p>}
          {errorMessage && !isTyping && <p className="text-xs text-muted-foreground mt-2">Click me to dismiss! 🔄</p>}
        </div>
      )}
      {showInteractionMenu && <div className="fixed inset-0 z-10" onClick={() => setShowInteractionMenu(false)} />}
    </div>
  );
};

export default MascotGuide;
