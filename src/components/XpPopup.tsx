import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import useSoundEffects from '@/hooks/useSoundEffects';
import Confetti from './Confetti';

interface XpPopupProps {
  amount: number;
  show: boolean;
  onComplete?: () => void;
  showConfetti?: boolean;
}

const XpPopup: React.FC<XpPopupProps> = ({ amount, show, onComplete, showConfetti = true }) => {
  const [visible, setVisible] = useState(false);
  const [showConfettiState, setShowConfettiState] = useState(false);
  const { playXpSound } = useSoundEffects();

  useEffect(() => {
    if (show) {
      setVisible(true);
      setShowConfettiState(showConfetti);
      playXpSound();
      
      const timer = setTimeout(() => {
        setVisible(false);
        setShowConfettiState(false);
        onComplete?.();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete, playXpSound, showConfetti]);

  if (!visible) return null;

  return (
    <>
      <Confetti show={showConfettiState} />
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
        <div
          className={cn(
            "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground px-10 py-6 rounded-3xl",
            "text-4xl font-bold shadow-2xl",
            "animate-celebrate-pop",
            "flex items-center gap-3"
          )}
        >
          <span className="text-5xl animate-sparkle">✨</span>
          <span>+{amount} XP</span>
          <span className="text-5xl animate-sparkle" style={{ animationDelay: '0.2s' }}>🎉</span>
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-float-up"
              style={{
                animationDelay: `${i * 0.1}s`,
                left: `calc(50% + ${(i - 4) * 30}px)`,
                top: '50%',
              }}
            >
              {['⭐', '💫', '✨', '🌟'][i % 4]}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default XpPopup;
