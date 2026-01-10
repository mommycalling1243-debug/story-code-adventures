import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import useSoundEffects from '@/hooks/useSoundEffects';
import { ArrowLeft, Lock, Trophy, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const Badges: React.FC = () => {
  const { state } = useGame();
  const { playBadgeEarnedSound } = useSoundEffects();
  
  const earnedCount = state.badges.filter(b => b.earned).length;
  const totalCount = state.badges.length;
  const progressPercent = (earnedCount / totalCount) * 100;

  // Group badges by category
  const firstLessonBadges = state.badges.filter(b => 
    ['variable-starter', 'decision-maker', 'loop-apprentice', 'spell-writer', 'bug-hunter'].includes(b.id)
  );
  
  const worldCompletionBadges = state.badges.filter(b => 
    ['village-master', 'forest-explorer', 'loop-hero', 'castle-knight', 'dragon-slayer'].includes(b.id)
  );
  
  const ultimateBadges = state.badges.filter(b => 
    ['python-hero'].includes(b.id)
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/worlds" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Worlds</span>
            </Link>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="font-bold text-foreground">{earnedCount}/{totalCount}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
            <span className="text-primary">Badge</span> Collection
          </h1>
          <p className="text-muted-foreground">
            Collect badges by completing lessons and conquering worlds!
          </p>
        </div>

        {/* Overall Progress */}
        <div className="max-w-md mx-auto mb-12 bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">Collection Progress</span>
            <span className="text-sm text-muted-foreground">{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-chart-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-center text-sm text-muted-foreground mt-3">
            {earnedCount === totalCount 
              ? "🎉 You've collected all badges! True Python Hero!" 
              : `${totalCount - earnedCount} badges remaining`}
          </p>
        </div>

        {/* Ultimate Badge Section */}
        {ultimateBadges.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-chart-4" />
              Ultimate Achievement
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {ultimateBadges.map(badge => (
                <BadgeCard key={badge.id} badge={badge} size="large" />
              ))}
            </div>
          </section>
        )}

        {/* First Lesson Badges */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            🌟 First Steps
            <span className="text-sm font-normal text-muted-foreground ml-2">
              (Earned by starting each world)
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {firstLessonBadges.map(badge => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </section>

        {/* World Completion Badges */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            🏆 World Masters
            <span className="text-sm font-normal text-muted-foreground ml-2">
              (Earned by completing all lessons in a world)
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {worldCompletionBadges.map(badge => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Link to="/worlds">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Continue Your Adventure
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

interface BadgeCardProps {
  badge: {
    id: string;
    name: string;
    description: string;
    icon: string;
    earned: boolean;
    earnedAt?: Date;
  };
  size?: 'normal' | 'large';
}

const BadgeCard: React.FC<BadgeCardProps> = ({ badge, size = 'normal' }) => {
  const isLarge = size === 'large';
  
  return (
    <div 
      className={cn(
        "relative rounded-xl border transition-all duration-300",
        badge.earned 
          ? "bg-card border-primary/50 hover:border-primary hover:shadow-lg" 
          : "bg-muted/30 border-border opacity-60",
        isLarge ? "p-8" : "p-5"
      )}
    >
      {!badge.earned && (
        <div className="absolute top-3 right-3">
          <Lock className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
      
      <div className="flex items-center gap-4">
        <div 
          className={cn(
            "flex items-center justify-center rounded-full",
            badge.earned 
              ? "bg-primary/10" 
              : "bg-muted grayscale",
            isLarge ? "w-20 h-20 text-5xl" : "w-14 h-14 text-3xl"
          )}
        >
          {badge.icon}
        </div>
        
        <div className="flex-1">
          <h3 className={cn(
            "font-bold text-foreground",
            isLarge ? "text-xl" : "text-base"
          )}>
            {badge.name}
          </h3>
          <p className={cn(
            "text-muted-foreground",
            isLarge ? "text-base" : "text-sm"
          )}>
            {badge.description}
          </p>
          {badge.earned && badge.earnedAt && (
            <p className="text-xs text-primary mt-1">
              ✓ Earned {new Date(badge.earnedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      
      {badge.earned && isLarge && (
        <div className="absolute -top-2 -right-2">
          <span className="text-2xl animate-pulse">✨</span>
        </div>
      )}
    </div>
  );
};

export default Badges;
