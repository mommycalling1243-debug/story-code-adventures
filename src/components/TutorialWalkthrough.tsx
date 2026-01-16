import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, ChevronRight, ChevronLeft, Sparkles, BookOpen, Code, Trophy, Map, Target, Zap } from 'lucide-react';

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  tip?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "Welcome to PyQuest Adventures! 🎮",
    description: "You're about to embark on an exciting journey to learn Python programming through magical stories and quests. Let me show you how everything works!",
    icon: <Sparkles className="w-12 h-12 text-primary" />,
    tip: "Take your time with each lesson - there's no rush!"
  },
  {
    id: 2,
    title: "Explore Different Worlds 🗺️",
    description: "Your adventure is divided into 5 magical worlds, each teaching different Python concepts. Start with the Village of Variables and unlock new worlds as you progress!",
    icon: <Map className="w-12 h-12 text-primary" />,
    tip: "Complete all lessons in a world to unlock the next one."
  },
  {
    id: 3,
    title: "Learn Through Stories 📖",
    description: "Each lesson begins with an engaging story featuring magical characters and adventures. The story introduces Python concepts in a fun, memorable way!",
    icon: <BookOpen className="w-12 h-12 text-primary" />,
    tip: "Pay attention to the story - it explains the concept you're learning!"
  },
  {
    id: 4,
    title: "Complete Coding Quests 💻",
    description: "After each story, you'll face a coding quest! Write real Python code in the interactive editor. When your code is correct, click 'Submit' to earn XP and complete the lesson.",
    icon: <Code className="w-12 h-12 text-primary" />,
    tip: "Don't worry about mistakes - use the hint button if you get stuck!"
  },
  {
    id: 5,
    title: "Earn XP & Level Up ⚡",
    description: "Every completed quest earns you XP (experience points). Collect enough XP to level up from Python Explorer all the way to Python Hero!",
    icon: <Zap className="w-12 h-12 text-primary" />,
    tip: "Complete daily challenges for bonus XP and streak rewards!"
  },
  {
    id: 6,
    title: "Collect Badges 🏆",
    description: "Achievements unlock special badges! Complete your first lesson, master entire worlds, or maintain daily streaks to earn them all.",
    icon: <Trophy className="w-12 h-12 text-primary" />,
    tip: "Check the Badges page to see all available achievements!"
  },
  {
    id: 7,
    title: "You're Ready! 🚀",
    description: "That's everything you need to know! Start your adventure by selecting a world, pick a lesson, and begin your journey to becoming a Python Hero!",
    icon: <Target className="w-12 h-12 text-primary" />,
    tip: "Have fun and remember - every coder started exactly where you are now!"
  }
];

interface TutorialWalkthroughProps {
  onComplete: () => void;
  onSkip: () => void;
}

const TutorialWalkthrough: React.FC<TutorialWalkthroughProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const step = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4">
        {/* Skip button */}
        <button
          onClick={onSkip}
          className="absolute -top-12 right-0 text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 text-sm"
        >
          Skip tutorial
          <X className="w-4 h-4" />
        </button>

        {/* Main card */}
        <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
          {/* Progress bar */}
          <div className="h-2 bg-muted">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
            />
          </div>

          {/* Content */}
          <div className="p-8 text-center">
            {/* Step indicator */}
            <div className="flex justify-center gap-2 mb-6">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep 
                      ? 'bg-primary w-6' 
                      : index < currentStep 
                        ? 'bg-primary/50' 
                        : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                {step.icon}
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">
              {step.title}
            </h2>

            {/* Description */}
            <p className="text-muted-foreground text-lg leading-relaxed max-w-lg mx-auto mb-6">
              {step.description}
            </p>

            {/* Tip */}
            {step.tip && (
              <div className="bg-primary/10 rounded-xl p-4 mb-8 max-w-md mx-auto">
                <p className="text-sm text-primary font-medium flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Pro Tip: {step.tip}
                </p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={isFirstStep}
                className="text-muted-foreground"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>

              <span className="text-sm text-muted-foreground">
                {currentStep + 1} of {tutorialSteps.length}
              </span>

              <Button
                onClick={handleNext}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isLastStep ? (
                  <>
                    Start Adventure
                    <Sparkles className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default TutorialWalkthrough;
