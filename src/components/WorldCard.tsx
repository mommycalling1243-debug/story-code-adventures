import React from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Lock, CheckCircle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorldCardProps {
  id: number;
  name: string;
  description: string;
  icon: string;
  lessonsCount: number;
  slug: string;
}

const WorldCard: React.FC<WorldCardProps> = ({
  id,
  name,
  description,
  icon,
  lessonsCount,
  slug,
}) => {
  const { isWorldUnlocked, state } = useGame();
  const unlocked = isWorldUnlocked(id);
  
  const completedInWorld = state.completedLessons.filter(
    l => l.worldId === slug
  ).length;

  const isCompleted = completedInWorld >= lessonsCount;

  if (!unlocked) {
    return (
      <div className="relative bg-card/50 rounded-2xl p-6 border-2 border-dashed border-border opacity-60">
        <div className="absolute top-4 right-4">
          <Lock className="w-6 h-6 text-muted-foreground" />
        </div>
        <div className="text-5xl mb-4 grayscale">{icon}</div>
        <h3 className="text-xl font-bold text-muted-foreground mb-2">{name}</h3>
        <p className="text-sm text-muted-foreground">Complete the previous world to unlock</p>
      </div>
    );
  }

  return (
    <Link
      to={`/world/${slug}`}
      className={cn(
        "relative block bg-card rounded-2xl p-6 border-2 transition-all duration-300",
        "hover:shadow-lg hover:scale-[1.02] hover:border-primary",
        isCompleted ? "border-primary/50" : "border-border"
      )}
    >
      {isCompleted && (
        <div className="absolute top-4 right-4">
          <CheckCircle className="w-6 h-6 text-primary" />
        </div>
      )}
      
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-foreground mb-2">{name}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {completedInWorld}/{lessonsCount} lessons
        </div>
        <div className="flex items-center text-primary font-medium text-sm">
          Enter World
          <ChevronRight className="w-4 h-4 ml-1" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${(completedInWorld / lessonsCount) * 100}%` }}
        />
      </div>
    </Link>
  );
};

export default WorldCard;
