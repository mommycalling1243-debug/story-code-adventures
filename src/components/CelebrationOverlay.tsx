import React, { useEffect, useState } from 'react';
import Confetti from './Confetti';
import useSoundEffects from '@/hooks/useSoundEffects';

interface CelebrationOverlayProps {
  show: boolean;
  type: 'badge' | 'world' | 'levelUp';
  title: string;
  subtitle?: string;
  icon?: string;
  onComplete?: () => void;
}

const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({
  show,
  type,
  title,
  subtitle,
  icon,
  onComplete,
}) => {
  const [visible, setVisible] = useState(false);
  const { playBadgeEarnedSound, playWorldUnlockSound } = useSoundEffects();

  useEffect(() => {
    if (show) {
      setVisible(true);
      
      // Play appropriate sound
      if (type === 'badge' || type === 'levelUp') {
        playBadgeEarnedSound();
      } else if (type === 'world') {
        playWorldUnlockSound();
      }

      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [show, type, playBadgeEarnedSound, playWorldUnlockSound, onComplete]);

  if (!visible) return null;

  const bgColors = {
    badge: 'from-amber-500/90 to-yellow-600/90',
    world: 'from-primary/90 to-accent/90',
    levelUp: 'from-purple-500/90 to-pink-600/90',
  };

  return (
    <>
      <Confetti show={true} duration={3500} />
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/50 backdrop-blur-sm">
        <div
          className={`
            bg-gradient-to-br ${bgColors[type]} text-primary-foreground
            px-12 py-10 rounded-3xl shadow-2xl
            animate-celebrate-pop
            text-center max-w-md
          `}
        >
          <div className="text-7xl mb-4 animate-sparkle">
            {icon || (type === 'badge' ? '🏆' : type === 'world' ? '🌍' : '⬆️')}
          </div>
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          {subtitle && (
            <p className="text-lg opacity-90">{subtitle}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default CelebrationOverlay;
