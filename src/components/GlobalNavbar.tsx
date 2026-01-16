import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import TutorialWalkthrough from '@/components/TutorialWalkthrough';
import { Home, Map, Trophy, Crown, User, HelpCircle, Sparkles } from 'lucide-react';

interface GlobalNavbarProps {
  showBackButton?: boolean;
  backTo?: string;
  backLabel?: string;
  title?: string;
  titleIcon?: React.ReactNode;
  rightContent?: React.ReactNode;
}

const GlobalNavbar: React.FC<GlobalNavbarProps> = ({
  showBackButton = true,
  backTo = '/',
  backLabel = 'Home',
  title,
  titleIcon,
  rightContent,
}) => {
  const { state, completeTutorial } = useGame();
  const location = useLocation();
  const [showTutorial, setShowTutorial] = useState(false);

  const handleTutorialComplete = () => {
    completeTutorial();
    setShowTutorial(false);
  };

  const navItems = [
    { to: '/worlds', icon: <Map className="w-4 h-4" />, label: 'Worlds' },
    { to: '/badges', icon: <Trophy className="w-4 h-4" />, label: 'Badges' },
    { to: '/leaderboard', icon: <Crown className="w-4 h-4" />, label: 'Leaders' },
    { to: '/profile', icon: <User className="w-4 h-4" />, label: 'Profile' },
  ];

  return (
    <>
      {showTutorial && (
        <TutorialWalkthrough 
          onComplete={handleTutorialComplete} 
          onSkip={handleTutorialComplete} 
        />
      )}

      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left section */}
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <span className="font-serif font-bold text-foreground hidden sm:inline">
                  <span className="text-primary">Py</span>Quest
                </span>
              </Link>
            </div>

            {/* Center - Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link key={item.to} to={item.to}>
                  <Button
                    variant={location.pathname === item.to ? 'secondary' : 'ghost'}
                    size="sm"
                    className="gap-2"
                  >
                    {item.icon}
                    <span className="hidden lg:inline">{item.label}</span>
                  </Button>
                </Link>
              ))}
            </nav>

            {/* Right section */}
            <div className="flex items-center gap-2">
              {/* Help Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTutorial(true)}
                className="gap-2 text-muted-foreground hover:text-foreground"
                title="View Tutorial"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Help</span>
              </Button>

              {/* Player info */}
              {state.playerName && (
                <Link to="/profile">
                  <div className="flex items-center gap-2 bg-card rounded-full px-3 py-1.5 border border-border hover:border-primary/50 transition-colors">
                    <span className="text-lg">{state.playerAvatar || '🧙'}</span>
                    <span className="text-sm font-medium text-foreground hidden sm:inline">
                      {state.playerName}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-primary font-medium">
                      <Sparkles className="w-3 h-3" />
                      {state.xp}
                    </div>
                  </div>
                </Link>
              )}

              {rightContent}
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex md:hidden items-center justify-center gap-1 mt-2 pt-2 border-t border-border/50">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} className="flex-1">
                <Button
                  variant={location.pathname === item.to ? 'secondary' : 'ghost'}
                  size="sm"
                  className="w-full gap-1 text-xs"
                >
                  {item.icon}
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
};

export default GlobalNavbar;
