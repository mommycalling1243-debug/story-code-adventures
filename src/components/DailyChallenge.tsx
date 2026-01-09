import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import InteractiveCodeEditor from './InteractiveCodeEditor';
import useSoundEffects from '@/hooks/useSoundEffects';
import Confetti from './Confetti';
import { Flame, Gift, Clock, CheckCircle2, Sparkles } from 'lucide-react';

const DAILY_CHALLENGES = [
  {
    id: 1,
    title: 'Magic Number',
    description: 'Create a variable called `magic` and set it to the number 42, then print it!',
    initialCode: '# Create magic variable\nmagic = ___\nprint(magic)',
    hint: 'Replace ___ with the number 42',
    xpReward: 25,
  },
  {
    id: 2,
    title: 'Greeting Spell',
    description: 'Create a greeting that says "Hello, World!" and print it.',
    initialCode: '# Create your greeting\ngreeting = "___"\nprint(greeting)',
    hint: 'Replace ___ with Hello, World!',
    xpReward: 25,
  },
  {
    id: 3,
    title: 'Double Trouble',
    description: 'Create a number variable and multiply it by 2!',
    initialCode: '# Pick a number\nnumber = 5\ndouble = number * ___\nprint(double)',
    hint: 'Replace ___ with 2 to double the number',
    xpReward: 25,
  },
  {
    id: 4,
    title: 'Name Tag',
    description: 'Create two variables: your name and age, then print both!',
    initialCode: '# Your info\nname = "___"\nage = ___\nprint(name)\nprint(age)',
    hint: 'Fill in your name in quotes and age as a number',
    xpReward: 25,
  },
  {
    id: 5,
    title: 'Math Wizard',
    description: 'Calculate 10 + 5 and store it in a variable called total!',
    initialCode: '# Do the math\ntotal = ___ + ___\nprint(total)',
    hint: 'Replace the first ___ with 10 and second with 5',
    xpReward: 25,
  },
  {
    id: 6,
    title: 'Secret Code',
    description: 'Create a secret_code variable with any number and print it!',
    initialCode: '# Your secret\nsecret_code = ___\nprint(secret_code)',
    hint: 'Replace ___ with any number you like',
    xpReward: 25,
  },
  {
    id: 7,
    title: 'Shopping List',
    description: 'Create a variable for your favorite fruit and print it!',
    initialCode: '# Your favorite\nfruit = "___"\nprint(fruit)',
    hint: 'Replace ___ with any fruit name',
    xpReward: 25,
  },
];

const DailyChallenge: React.FC = () => {
  const { state, completeDailyChallenge, getDailyChallengeStatus } = useGame();
  const { playSuccessSound, playStreakSound } = useSoundEffects();
  const [showConfetti, setShowConfetti] = useState(false);
  const [completed, setCompleted] = useState(false);

  const { isCompleted, todayChallenge } = getDailyChallengeStatus();
  const challengeIndex = (todayChallenge || 0) % DAILY_CHALLENGES.length;
  const challenge = DAILY_CHALLENGES[challengeIndex];

  const streakBonus = Math.min((state.streak || 0) * 5, 50); // Max 50 bonus XP
  const totalXp = challenge.xpReward + streakBonus;

  const handleSuccess = () => {
    if (!isCompleted && !completed) {
      setCompleted(true);
      setShowConfetti(true);
      completeDailyChallenge(totalXp);
      playSuccessSound();
      if (state.streak >= 2) {
        setTimeout(() => playStreakSound(), 300);
      }
    }
  };

  const isComplete = isCompleted || completed;

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <Confetti show={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 to-accent/20 px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              {isComplete ? (
                <CheckCircle2 className="w-5 h-5 text-primary" />
              ) : (
                <Gift className="w-5 h-5 text-primary" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-foreground">Daily Challenge</h3>
              <p className="text-sm text-muted-foreground">{challenge.title}</p>
            </div>
          </div>
          
          {/* Streak display */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-background/50 px-3 py-1.5 rounded-full">
              <Flame className={`w-4 h-4 ${state.streak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
              <span className="font-bold text-foreground">{state.streak}</span>
              <span className="text-xs text-muted-foreground">day streak</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-primary flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                +{totalXp} XP
              </div>
              {streakBonus > 0 && (
                <div className="text-xs text-orange-500">+{streakBonus} streak bonus!</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Challenge content */}
      <div className="p-6">
        {isComplete ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h4 className="text-xl font-bold text-foreground mb-2">Challenge Complete!</h4>
            <p className="text-muted-foreground mb-4">
              Great work! Come back tomorrow for a new challenge.
            </p>
            <div className="flex items-center justify-center gap-2 text-primary">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="font-bold">
                {state.streak} day streak - Keep it going!
              </span>
            </div>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground mb-4">{challenge.description}</p>
            <InteractiveCodeEditor
              initialCode={challenge.initialCode}
              expectedOutput=""
              onSuccess={handleSuccess}
              hint={challenge.hint}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default DailyChallenge;
