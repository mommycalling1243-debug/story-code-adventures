import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { worlds } from '@/data/worlds';
import { ArrowLeft, Play, CheckCircle } from 'lucide-react';

const World: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isLessonCompleted } = useGame();
  
  const world = worlds.find(w => w.slug === slug);
  
  if (!world) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground">World not found</p>
          <Link to="/worlds">
            <Button className="mt-4">Back to World Map</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/worlds">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              World Map
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{world.icon}</span>
            <h1 className="font-bold text-foreground">{world.name}</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* World intro */}
        <div className="bg-card rounded-2xl p-8 border border-border mb-8">
          <div className="flex items-center gap-6">
            <div className="text-7xl">{world.icon}</div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-foreground mb-2">
                {world.name}
              </h2>
              <p className="text-muted-foreground">{world.description}</p>
            </div>
          </div>
        </div>

        {/* Lessons list - ALL UNLOCKED */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-foreground mb-4">Story Chapters</h3>
          
          {world.lessons.map((lesson, index) => {
            const completed = isLessonCompleted(lesson.id);

            return (
              <div
                key={lesson.id}
                className={`bg-card rounded-xl p-6 border transition-all duration-300 ${
                  completed 
                    ? 'border-primary/50' 
                    : 'border-border hover:border-primary/50 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      completed 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-primary/20 text-primary'
                    }`}>
                      {completed ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <span className="font-bold">{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{lesson.title}</h4>
                      <p className="text-sm text-muted-foreground">{lesson.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      +{lesson.xp} XP
                    </span>
                    <Link to={`/lesson/${lesson.id}`}>
                      <Button 
                        size="sm"
                        variant={completed ? "outline" : "default"}
                        className={completed ? "" : "bg-primary hover:bg-primary/90 text-primary-foreground"}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        {completed ? 'Replay' : 'Start'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default World;
