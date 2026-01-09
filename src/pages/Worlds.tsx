import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import WorldCard from '@/components/WorldCard';
import PlayerStats from '@/components/PlayerStats';
import { useGame } from '@/contexts/GameContext';
import { worlds } from '@/data/worlds';
import { ArrowLeft, Map } from 'lucide-react';

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
              <div className="mt-6 bg-card rounded-xl p-4 border border-border">
                <h3 className="font-bold text-foreground mb-3">🏆 Your Badges</h3>
                <div className="flex flex-wrap gap-2">
                  {state.badges.map((badge) => (
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
                </div>
              </div>
            </div>
          </aside>

          {/* World Map */}
          <section className="lg:col-span-3">
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
