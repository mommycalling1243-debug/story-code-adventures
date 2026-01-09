import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Star, Flame, Award } from 'lucide-react';

const PlayerStats: React.FC = () => {
  const { state, getLevelName, getLevelProgress, getXpToNextLevel } = useGame();

  const earnedBadges = state.badges.filter(b => b.earned).length;

  return (
    <div className="bg-card rounded-xl p-4 shadow-md border border-border">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
          <Star className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">Level {state.level + 1}</p>
          <p className="font-bold text-foreground">{getLevelName()}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">XP Progress</span>
            <span className="font-medium text-foreground">{state.xp} XP</span>
          </div>
          <Progress value={getLevelProgress()} className="h-3" />
          <p className="text-xs text-muted-foreground mt-1">
            {getXpToNextLevel() > 0 ? `${getXpToNextLevel()} XP to next level` : 'Max level reached!'}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{state.streak} day streak</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-accent-foreground" />
            <span className="text-sm font-medium">{earnedBadges}/{state.badges.length} badges</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;
