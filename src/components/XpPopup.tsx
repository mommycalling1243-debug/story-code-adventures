import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface XpPopupProps {
  amount: number;
  show: boolean;
  onComplete?: () => void;
}

const XpPopup: React.FC<XpPopupProps> = ({ amount, show, onComplete }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
      <div
        className={cn(
          "bg-primary text-primary-foreground px-8 py-4 rounded-2xl",
          "text-3xl font-bold shadow-xl",
          "animate-bounce"
        )}
      >
        <span className="mr-2">✨</span>
        +{amount} XP
        <span className="ml-2">🎉</span>
      </div>
    </div>
  );
};

export default XpPopup;
