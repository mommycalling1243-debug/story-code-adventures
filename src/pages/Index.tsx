import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGame } from '@/contexts/GameContext';
import TutorialWalkthrough from '@/components/TutorialWalkthrough';
import heroImage from '@/assets/hero-village.jpg';
import owlMascot from '@/assets/owl-mascot.png';
import { Sparkles, Star, BookOpen, Trophy, ChevronRight, Gamepad2, HelpCircle } from 'lucide-react';

const Index: React.FC = () => {
  const { state, setPlayerName, completeTutorial } = useGame();
  const [nameInput, setNameInput] = useState('');
  const [showNameInput, setShowNameInput] = useState(!state.playerName);
  const [showTutorial, setShowTutorial] = useState(false);

  const handleStartAdventure = () => {
    if (nameInput.trim()) {
      setPlayerName(nameInput.trim());
      setShowNameInput(false);
      // Show tutorial for first-time users
      if (!state.hasSeenTutorial) {
        setShowTutorial(true);
      }
    }
  };

  const handleTutorialComplete = () => {
    completeTutorial();
    setShowTutorial(false);
  };

  const handleTutorialSkip = () => {
    completeTutorial();
    setShowTutorial(false);
  };

  const handleShowTutorial = () => {
    setShowTutorial(true);
  };

  const features = [
    { icon: <BookOpen className="w-6 h-6" />, title: 'Story-Based Learning', description: 'Learn Python through magical adventures' },
    { icon: <Gamepad2 className="w-6 h-6" />, title: 'Game Mechanics', description: 'Earn XP, unlock badges, and level up' },
    { icon: <Star className="w-6 h-6" />, title: 'Interactive Coding', description: 'Write real Python code in your browser' },
    { icon: <Trophy className="w-6 h-6" />, title: 'Track Progress', description: 'See your growth across all worlds' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Tutorial Walkthrough */}
      {showTutorial && (
        <TutorialWalkthrough 
          onComplete={handleTutorialComplete} 
          onSkip={handleTutorialSkip} 
        />
      )}

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Magical village"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-12 text-center">
          <div className="flex justify-center mb-6">
            <img
              src={owlMascot}
              alt="Wise Owl Guide"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-card shadow-lg border-4 border-primary/30"
            />
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-6">
            <span className="text-primary">PyQuest</span> Adventures
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Enter a world where computers understand magic words called <strong className="text-primary">Python</strong>. 
            Learn to code through exciting stories, fun challenges, and epic quests!
          </p>

          {showNameInput ? (
            <div className="max-w-md mx-auto bg-card rounded-2xl p-6 shadow-lg border border-border">
              <p className="text-foreground mb-4 font-medium">
                ✨ What should we call you, brave adventurer?
              </p>
              <div className="flex gap-3">
                <Input
                  type="text"
                  placeholder="Enter your name..."
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleStartAdventure()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleStartAdventure}
                  disabled={!nameInput.trim()}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Begin
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-lg text-foreground">
                Welcome back, <strong className="text-primary">{state.playerName}</strong>! 
                <span className="ml-2">🌟</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Link to="/worlds">
                  <Button 
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-xl shadow-lg"
                  >
                    Continue Adventure
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleShowTutorial}
                  className="text-lg px-6 py-6 rounded-xl"
                >
                  <HelpCircle className="w-5 h-5 mr-2" />
                  View Tutorial
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-foreground mb-12">
            Why Learn with <span className="text-primary">PyQuest</span>?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 text-center border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Preview Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-card rounded-2xl p-8 md:p-12 border border-border shadow-lg">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">
                  How Does It Work?
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="flex items-start gap-3">
                    <span className="text-2xl">📖</span>
                    <span>Every lesson is a story chapter. You'll meet characters, solve mysteries, and learn Python along the way.</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-2xl">🎮</span>
                    <span>Complete quests to earn XP, unlock new worlds, and collect badges that show your mastery.</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <span>No scary errors! We use friendly guides and hints to help you learn from every attempt.</span>
                  </p>
                </div>
              </div>
              <div className="w-48 h-48 bg-primary/10 rounded-2xl flex items-center justify-center">
                <span className="text-8xl">🏘️</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
            Ready to Start Your Coding Journey?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of learners who discovered the magic of Python through stories.
          </p>
          <Link to="/worlds">
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-6 rounded-xl shadow-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Your Adventure
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>Made with 💖 for curious minds everywhere</p>
          <p className="mt-2">PyQuest Adventures © 2026 • 100% Free & Open Source</p>
          <p className="mt-1 text-xs">
            <a href="https://github.com" className="hover:text-primary transition-colors">
              View on GitHub
            </a>
            {' • '}
            <span>MIT License - Use it however you like!</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
