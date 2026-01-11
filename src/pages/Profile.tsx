import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGame } from '@/contexts/GameContext';
import { worlds } from '@/data/worlds';
import { ArrowLeft, Edit2, Check, Trophy, Flame, Target, Star, BookOpen, Zap } from 'lucide-react';

const AVATAR_OPTIONS = [
  '🧙', '🧙‍♀️', '🦸', '🦸‍♀️', '🧝', '🧝‍♀️', '🧚', '🧚‍♀️', 
  '🦊', '🐉', '🦉', '🐱', '🐶', '🐼', '🦁', '🐸',
  '🚀', '⭐', '🌟', '💎', '🔮', '🎮', '🎯', '🏆'
];

const Profile: React.FC = () => {
  const { state, setPlayerName, setPlayerAvatar, getLevelName, getLevelProgress, getXpToNextLevel } = useGame();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(state.playerName);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const handleSaveName = () => {
    if (newName.trim()) {
      setPlayerName(newName.trim());
      setIsEditingName(false);
    }
  };

  const handleSelectAvatar = (avatar: string) => {
    setPlayerAvatar(avatar);
    setShowAvatarPicker(false);
  };

  // Calculate stats
  const totalLessons = worlds.reduce((sum, w) => sum + w.lessons.length, 0);
  const completedLessons = state.completedLessons.length;
  const completionPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  
  const worldStats = worlds.map(world => {
    const worldLessons = state.completedLessons.filter(l => l.worldId === String(world.id));
    return {
      ...world,
      completed: worldLessons.length,
      total: world.lessons.length,
      percentage: Math.round((worldLessons.length / world.lessons.length) * 100)
    };
  });

  const earnedBadges = state.badges.filter(b => b.earned);
  const recentBadges = earnedBadges
    .filter(b => b.earnedAt)
    .sort((a, b) => new Date(b.earnedAt!).getTime() - new Date(a.earnedAt!).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/worlds">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              World Map
            </Button>
          </Link>
          <h1 className="font-bold text-foreground">My Profile</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Card */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <button
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-5xl hover:bg-primary/30 transition-colors border-4 border-primary/50"
              >
                {state.playerAvatar || '🧙'}
              </button>
              <button
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground hover:bg-primary/90"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              
              {/* Avatar Picker */}
              {showAvatarPicker && (
                <div className="absolute top-full mt-2 left-0 bg-card border border-border rounded-xl p-4 shadow-lg z-10 w-64">
                  <p className="text-sm text-muted-foreground mb-3">Choose your avatar:</p>
                  <div className="grid grid-cols-6 gap-2">
                    {AVATAR_OPTIONS.map((avatar) => (
                      <button
                        key={avatar}
                        onClick={() => handleSelectAvatar(avatar)}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center text-xl hover:bg-primary/20 transition-colors ${
                          state.playerAvatar === avatar ? 'bg-primary/30 ring-2 ring-primary' : 'bg-muted'
                        }`}
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Name & Level */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-48"
                      placeholder="Your name"
                      autoFocus
                    />
                    <Button size="sm" onClick={handleSaveName}>
                      <Check className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-foreground">
                      {state.playerName || 'Young Wizard'}
                    </h2>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
              
              <div className="flex items-center justify-center md:justify-start gap-2 text-primary font-medium">
                <Star className="w-4 h-4" />
                Level {state.level + 1} · {getLevelName()}
              </div>
              
              {/* XP Progress */}
              <div className="mt-4 max-w-xs mx-auto md:mx-0">
                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                  <span>{state.xp} XP</span>
                  <span>{getXpToNextLevel()} XP to next level</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${getLevelProgress()}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">{state.xp}</div>
            <div className="text-sm text-muted-foreground">Total XP</div>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-chart-2/20 flex items-center justify-center">
              <Flame className="w-6 h-6 text-chart-2" />
            </div>
            <div className="text-2xl font-bold text-foreground">{state.streak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-chart-3/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-chart-3" />
            </div>
            <div className="text-2xl font-bold text-foreground">{completedLessons}</div>
            <div className="text-sm text-muted-foreground">Lessons Done</div>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-chart-4/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-chart-4" />
            </div>
            <div className="text-2xl font-bold text-foreground">{earnedBadges.length}</div>
            <div className="text-sm text-muted-foreground">Badges Earned</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* World Progress */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-foreground">World Progress</h3>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Overall Completion</span>
                <span className="font-medium text-foreground">{completionPercentage}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              {worldStats.map((world) => (
                <div key={world.id} className="flex items-center gap-3">
                  <span className="text-2xl">{world.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground">{world.name}</span>
                      <span className="text-muted-foreground">{world.completed}/{world.total}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary/70 rounded-full"
                        style={{ width: `${world.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Badges */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-foreground">Recent Badges</h3>
              </div>
              <Link to="/badges">
                <Button variant="ghost" size="sm" className="text-primary">
                  View All
                </Button>
              </Link>
            </div>
            
            {recentBadges.length > 0 ? (
              <div className="space-y-3">
                {recentBadges.map((badge) => (
                  <div key={badge.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xl">
                      {badge.icon}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{badge.name}</div>
                      <div className="text-xs text-muted-foreground">{badge.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Trophy className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>Complete lessons to earn badges!</p>
              </div>
            )}
          </div>
        </div>

        {/* Achievement Summary */}
        <div className="mt-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/30 p-6">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            Achievement Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">{state.totalDailyChallenges || 0}</div>
              <div className="text-sm text-muted-foreground">Daily Challenges</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">{worldStats.filter(w => w.completed === w.total).length}</div>
              <div className="text-sm text-muted-foreground">Worlds Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">{state.level + 1}</div>
              <div className="text-sm text-muted-foreground">Current Level</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">
                {state.completedLessons.length > 0 
                  ? Math.max(...state.completedLessons.map(l => l.xpEarned))
                  : 0}
              </div>
              <div className="text-sm text-muted-foreground">Best Lesson XP</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
