import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import WorldCard from '@/components/WorldCard';
import PlayerStats from '@/components/PlayerStats';
import DailyChallenge from '@/components/DailyChallenge';
import { useGame } from '@/contexts/GameContext';
import { worlds } from '@/data/worlds';
import { ArrowLeft, Map, Flame, Trophy, Crown } from 'lucide-react';

const Worlds: React.FC = () => {
  const { state } = useGame();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Map className="w-5 h-5 text-primary" />
            <h1 className="font-bold text-foreground">World Map</h1>
          </div>
          <div className="text-sm text-muted-foreground">
            {state.playerName && `Hi, ${state.playerName}!`}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar with player stats */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <PlayerStats />
              
              {/* Badges Preview */}
              <Link to="/badges" className="block mt-6 bg-card rounded-xl p-4 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-foreground flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-primary" />
                    Your Badges
                  </h3>
                  <span className="text-xs text-primary font-medium">
                    {state.badges.filter(b => b.earned).length}/{state.badges.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {state.badges.slice(0, 8).map((badge) => (
                    <div
                      key={badge.id}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                        badge.earned 
                          ? 'bg-primary/20' 
                          : 'bg-muted grayscale opacity-40'
                      }`}
                      title={badge.earned ? badge.name : `${badge.name} (Locked)`}
                    >
                      {badge.icon}
                    </div>
                  ))}
                  {state.badges.length > 8 && (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm bg-muted text-muted-foreground">
                      +{state.badges.length - 8}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Click to view all badges →
                </p>
              </Link>
              
              {/* Leaderboard Link */}
              <Link to="/leaderboard" className="block mt-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 border border-primary/30 hover:border-primary/50 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground">Leaderboard</h3>
                    <p className="text-xs text-muted-foreground">See top players</p>
                  </div>
                  <span className="text-xl">🏆</span>
                </div>
              </Link>
            </div>
          </aside>

          {/* Main content */}
          <section className="lg:col-span-3 space-y-8">
            {/* Daily Challenge */}
            <DailyChallenge />

            <div className="mb-8">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-2">
                Your Adventure Awaits
              </h2>
              <p className="text-muted-foreground">
                Explore each world to learn new Python magic. Complete lessons to unlock the next realm!
              </p>
            </div>

            {/* World path visualization */}
            <div className="relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/50 via-primary/30 to-muted -translate-x-1/2 z-0" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {worlds.map((world, index) => (
                  <div
                    key={world.id}
                    className={`${index % 2 === 1 ? 'md:mt-12' : ''}`}
                  >
                    <WorldCard
                      id={world.id}
                      name={world.name}
                      description={world.description}
                      icon={world.icon}
                      lessonsCount={world.lessons.length}
                      slug={world.slug}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Worlds;
