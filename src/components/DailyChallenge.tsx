import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import InteractiveCodeEditor from './InteractiveCodeEditor';
import useSoundEffects from '@/hooks/useSoundEffects';
import Confetti from './Confetti';
import { Flame, Gift, CheckCircle2, Sparkles, Zap, Target } from 'lucide-react';

// Difficulty levels: 1 = Easy, 2 = Medium, 3 = Hard
const DAILY_CHALLENGES = [
  // Easy - Variables (25 XP)
  {
    id: 1,
    title: 'Magic Number',
    description: 'Create a variable called `magic` and set it to the number 42, then print it!',
    initialCode: '# Create magic variable\nmagic = ___\nprint(magic)',
    hint: 'Replace ___ with the number 42',
    xpReward: 25,
    difficulty: 1,
    topic: 'Variables',
  },
  {
    id: 2,
    title: 'Greeting Spell',
    description: 'Create a greeting that says "Hello, World!" and print it.',
    initialCode: '# Create your greeting\ngreeting = "___"\nprint(greeting)',
    hint: 'Replace ___ with Hello, World!',
    xpReward: 25,
    difficulty: 1,
    topic: 'Strings',
  },
  {
    id: 3,
    title: 'Double Trouble',
    description: 'Create a number variable and multiply it by 2!',
    initialCode: '# Pick a number\nnumber = 5\ndouble = number * ___\nprint(double)',
    hint: 'Replace ___ with 2 to double the number',
    xpReward: 25,
    difficulty: 1,
    topic: 'Math',
  },
  {
    id: 4,
    title: 'Name Tag',
    description: 'Create two variables: your name and age, then print both!',
    initialCode: '# Your info\nname = "___"\nage = ___\nprint(name)\nprint(age)',
    hint: 'Fill in your name in quotes and age as a number',
    xpReward: 25,
    difficulty: 1,
    topic: 'Variables',
  },
  
  // Medium - Conditionals (35 XP)
  {
    id: 5,
    title: 'Weather Check',
    description: 'Use an if-else to print "Take umbrella!" if raining is True, else print "Enjoy the sun!"',
    initialCode: '# Check the weather\nraining = True\n\nif raining == ___:\n    print("Take umbrella!")\nelse:\n    print("Enjoy the sun!")',
    hint: 'Replace ___ with True to check if it\'s raining',
    xpReward: 35,
    difficulty: 2,
    topic: 'Conditionals',
  },
  {
    id: 6,
    title: 'Age Gate',
    description: 'Check if age is 18 or more. Print "Welcome!" if yes, else "Too young!"',
    initialCode: '# Age check\nage = 20\n\nif age ___ 18:\n    print("Welcome!")\nelse:\n    print("Too young!")',
    hint: 'Replace ___ with >= to check if age is 18 or more',
    xpReward: 35,
    difficulty: 2,
    topic: 'Conditionals',
  },
  {
    id: 7,
    title: 'Grade Calculator',
    description: 'Use if-elif-else: 90+ is "A", 80+ is "B", else "Keep trying!"',
    initialCode: '# Calculate grade\nscore = 85\n\nif score >= 90:\n    print("A")\nelif score >= ___:\n    print("B")\nelse:\n    print("Keep trying!")',
    hint: 'Replace ___ with 80 to check for B grade',
    xpReward: 35,
    difficulty: 2,
    topic: 'Conditionals',
  },
  {
    id: 8,
    title: 'Password Check',
    description: 'Check if password equals "secret123". Print "Access granted!" or "Wrong password!"',
    initialCode: '# Security check\npassword = "secret123"\n\nif password ___ "secret123":\n    print("Access granted!")\nelse:\n    print("Wrong password!")',
    hint: 'Replace ___ with == to check equality',
    xpReward: 35,
    difficulty: 2,
    topic: 'Conditionals',
  },
  
  // Medium - Loops (40 XP)
  {
    id: 9,
    title: 'Countdown',
    description: 'Use a for loop with range to count from 5 down to 1, then print "Blast off!"',
    initialCode: '# Countdown sequence\nfor i in range(5, 0, ___):\n    print(i)\nprint("Blast off!")',
    hint: 'Replace ___ with -1 to count backwards',
    xpReward: 40,
    difficulty: 2,
    topic: 'Loops',
  },
  {
    id: 10,
    title: 'Star Pattern',
    description: 'Print 5 stars using a for loop!',
    initialCode: '# Draw stars\nfor i in range(___):\n    print("⭐")',
    hint: 'Replace ___ with 5 to print 5 stars',
    xpReward: 40,
    difficulty: 2,
    topic: 'Loops',
  },
  {
    id: 11,
    title: 'Sum Calculator',
    description: 'Use a loop to add numbers 1 to 5 and print the total!',
    initialCode: '# Add numbers\ntotal = 0\nfor i in range(1, ___):\n    total = total + i\nprint(total)',
    hint: 'Replace ___ with 6 (range stops before this number)',
    xpReward: 40,
    difficulty: 2,
    topic: 'Loops',
  },
  
  // Hard - Functions (50 XP)
  {
    id: 12,
    title: 'Spell Creator',
    description: 'Create a function called `cast_spell` that prints "✨ Magic!" when called.',
    initialCode: '# Create your spell\ndef ___():\n    print("✨ Magic!")\n\n# Cast it!\ncast_spell()',
    hint: 'Replace ___ with cast_spell to name the function',
    xpReward: 50,
    difficulty: 3,
    topic: 'Functions',
  },
  {
    id: 13,
    title: 'Greeting Function',
    description: 'Create a function that takes a name and prints "Hello, [name]!"',
    initialCode: '# Greeting function\ndef greet(___):\n    print("Hello, " + name + "!")\n\ngreet("Hero")',
    hint: 'Replace ___ with name as the parameter',
    xpReward: 50,
    difficulty: 3,
    topic: 'Functions',
  },
  {
    id: 14,
    title: 'Double Function',
    description: 'Create a function that returns a number multiplied by 2!',
    initialCode: '# Double function\ndef double(num):\n    return num * ___\n\nresult = double(5)\nprint(result)',
    hint: 'Replace ___ with 2 to double the number',
    xpReward: 50,
    difficulty: 3,
    topic: 'Functions',
  },
  
  // Hard - Debugging (50 XP)
  {
    id: 15,
    title: 'Fix the Bug',
    description: 'This code has a syntax error. Find and fix it!',
    initialCode: '# Fix the error\nmessage = "Hello World\nprint(message)',
    hint: 'The string is missing a closing quote!',
    xpReward: 50,
    difficulty: 3,
    topic: 'Debugging',
  },
  {
    id: 16,
    title: 'Logic Fix',
    description: 'Fix the loop so it prints 1, 2, 3 (not 0, 1, 2)!',
    initialCode: '# Fix the range\nfor i in range(___, 4):\n    print(i)',
    hint: 'Replace ___ with 1 to start from 1',
    xpReward: 50,
    difficulty: 3,
    topic: 'Debugging',
  },
  
  // Bonus challenges
  {
    id: 17,
    title: 'Even Numbers',
    description: 'Print only even numbers from 2 to 10 using a loop!',
    initialCode: '# Even numbers only\nfor i in range(2, 11, ___):\n    print(i)',
    hint: 'Replace ___ with 2 to step by 2',
    xpReward: 45,
    difficulty: 2,
    topic: 'Loops',
  },
  {
    id: 18,
    title: 'Temperature Converter',
    description: 'Convert 100 Celsius to Fahrenheit (F = C * 9/5 + 32)!',
    initialCode: '# Temperature conversion\ncelsius = 100\nfahrenheit = celsius * 9/5 + ___\nprint(fahrenheit)',
    hint: 'Replace ___ with 32 to complete the formula',
    xpReward: 35,
    difficulty: 2,
    topic: 'Math',
  },
  {
    id: 19,
    title: 'Power Calculator',
    description: 'Calculate 2 to the power of 8 using **!',
    initialCode: '# Power up!\nbase = 2\npower = 8\nresult = base ___ power\nprint(result)',
    hint: 'Replace ___ with ** for exponentiation',
    xpReward: 35,
    difficulty: 2,
    topic: 'Math',
  },
  {
    id: 20,
    title: 'List Master',
    description: 'Create a list of 3 fruits and print the first one!',
    initialCode: '# Fruit list\nfruits = ["apple", "banana", "___"]\nprint(fruits[0])',
    hint: 'Replace ___ with any fruit name',
    xpReward: 30,
    difficulty: 1,
    topic: 'Lists',
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
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              {isComplete ? (
                <CheckCircle2 className="w-5 h-5 text-primary" />
              ) : (
                <Gift className="w-5 h-5 text-primary" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-foreground flex items-center gap-2">
                Daily Challenge
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  challenge.difficulty === 1 ? 'bg-green-500/20 text-green-600' :
                  challenge.difficulty === 2 ? 'bg-yellow-500/20 text-yellow-600' :
                  'bg-red-500/20 text-red-600'
                }`}>
                  {challenge.difficulty === 1 ? 'Easy' : challenge.difficulty === 2 ? 'Medium' : 'Hard'}
                </span>
              </h3>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                {challenge.title}
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  {challenge.topic}
                </span>
              </p>
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
