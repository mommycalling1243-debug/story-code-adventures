import React from 'react';
import { cn } from '@/lib/utils';
import owlMascot from '@/assets/owl-mascot.png';

interface StoryPanelProps {
  title: string;
  children: React.ReactNode;
  variant?: 'story' | 'explanation' | 'quest';
  className?: string;
}

const StoryPanel: React.FC<StoryPanelProps> = ({ 
  title, 
  children, 
  variant = 'story',
  className 
}) => {
  const variants = {
    story: 'border-l-primary bg-primary/5',
    explanation: 'border-l-chart-2 bg-chart-2/5',
    quest: 'border-l-chart-4 bg-chart-4/5',
  };

  const icons = {
    story: '📖',
    explanation: '💡',
    quest: '⚔️',
  };

  return (
    <div className={cn(
      "rounded-xl border border-border p-6 border-l-4",
      variants[variant],
      className
    )}>
      <div className="flex items-start gap-4">
        <div className="hidden md:block">
          <img 
            src={owlMascot} 
            alt="Guide" 
            className="w-16 h-16 rounded-full object-cover bg-card"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{icons[variant]}</span>
            <h3 className="text-lg font-bold text-foreground">{title}</h3>
          </div>
          <div className="text-foreground/90 leading-relaxed space-y-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryPanel;
