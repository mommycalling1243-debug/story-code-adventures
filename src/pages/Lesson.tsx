import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { worlds } from '@/data/worlds';
import CodeBlock from '@/components/CodeBlock';
import StoryPanel from '@/components/StoryPanel';
import InteractiveCodeEditor from '@/components/InteractiveCodeEditor';
import XpPopup from '@/components/XpPopup';
import CelebrationOverlay from '@/components/CelebrationOverlay';
import useSoundEffects from '@/hooks/useSoundEffects';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

// Lesson content database
const lessonContent: Record<string, {
  storyTitle: string;
  story: string[];
  explanationTitle: string;
  explanation: string[];
  codeExample: string;
  questTitle: string;
  questDescription: string;
  initialCode: string;
  expectedOutput: string;
  hint: string;
}> = {
  'var-1': {
    storyTitle: 'The Magic Bags',
    story: [
      "Welcome to the Village of Variables! 🏘️",
      "In this magical village, every traveler carries special bags. These aren't ordinary bags—they're magic bags that can hold anything: numbers, words, even entire stories!",
      "Each magic bag has a name tag on it. When you want to use what's inside, you just call out the bag's name, and the treasure appears!",
      "The village elder, Sage Python, hands you your first bag. \"Here,\" she says with a warm smile. \"Name it whatever you like, and put something inside. This is how we store our treasures here.\""
    ],
    explanationTitle: 'What Just Happened?',
    explanation: [
      "A **variable** is like a magic bag with a name tag!",
      "• The **name tag** is called the variable name",
      "• The **treasure inside** is called the value",
      "• You create a variable by giving it a name and putting something in it with the `=` sign"
    ],
    codeExample: `# Creating magic bags (variables)
name = "Sage Python"
coins = 42

# Looking inside the bags
print(name)
print(coins)`,
    questTitle: 'Your First Magic Bag',
    questDescription: "Create a magic bag called `hero` and put your name inside it. Then use `print(hero)` to reveal what's inside!",
    initialCode: `# Create your magic bag here
hero = "Your Name"

# Reveal what's inside
print(hero)`,
    expectedOutput: '',
    hint: "Replace 'Your Name' with your actual name, keeping the quotes!"
  },
  'var-2': {
    storyTitle: 'Naming Your Treasures',
    story: [
      "The next morning, you meet a young wizard named Echo at the village market. 🧙",
      "\"I once named a bag '123start',\" Echo laughs. \"But the magic didn't work! The village has rules for naming bags.\"",
      "Echo pulls out a scroll with the naming rules: Names can have letters, numbers, and underscores, but they must start with a letter or underscore. No spaces allowed!",
      "\"Also,\" Echo whispers, \"the magic is case-sensitive. 'Bag' and 'bag' are completely different bags!\""
    ],
    explanationTitle: 'Variable Naming Rules',
    explanation: [
      "✅ **Good names:** `my_bag`, `player1`, `_secret`, `userName`",
      "❌ **Bad names:** `123bag` (starts with number), `my bag` (has space), `my-bag` (has dash)",
      "Python is **case-sensitive**: `Name` and `name` are different variables!",
      "Tip: Use descriptive names like `player_score` instead of just `x`"
    ],
    codeExample: `# Good variable names
player_name = "Echo"
player_age = 15
favorite_spell = "Lumos"

# These are different variables!
Magic = "powerful"
magic = "mysterious"

print(player_name)
print(Magic)
print(magic)`,
    questTitle: 'Name Your Treasures',
    questDescription: "Create two variables with good names: one for your favorite color and one for your lucky number. Print them both!",
    initialCode: `# Create your variables
favorite_color = "blue"
lucky_number = 7

# Show your treasures
print(favorite_color)
print(lucky_number)`,
    expectedOutput: '',
    hint: "Make sure your variable names don't have spaces or start with numbers!"
  },
  'var-3': {
    storyTitle: 'Numbers and Words',
    story: [
      "At the village library, the librarian shows you different types of magic containers. 📚",
      "\"Some bags hold words—we call them strings,\" she explains. \"They're wrapped in quotes like precious scrolls.\"",
      "\"Other bags hold numbers. Numbers don't need quotes because they're already pure magic!\"",
      "She demonstrates by creating bags with both types. \"You can even do math with number bags!\""
    ],
    explanationTitle: 'Types of Values',
    explanation: [
      "**Strings** (text): Words wrapped in quotes → `\"Hello\"` or `'Hello'`",
      "**Integers** (whole numbers): Numbers without decimals → `42`, `100`, `-5`",
      "**Floats** (decimal numbers): Numbers with decimals → `3.14`, `2.5`",
      "You can do math with numbers: `+`, `-`, `*`, `/`"
    ],
    codeExample: `# Strings (text in quotes)
greeting = "Hello, adventurer!"

# Integers (whole numbers)
gold_coins = 100

# Floats (decimal numbers)
temperature = 23.5

# Math with numbers!
total = gold_coins + 50
print(total)`,
    questTitle: 'Mix Your Treasures',
    questDescription: "Create a string for a spell name, a number for its power level, and print both. Then calculate power x 2!",
    initialCode: `# Your spell details
spell_name = "Fireball"
power = 25

# Show the spell
print(spell_name)
print(power)

# Double the power!
double_power = power * 2
print(double_power)`,
    expectedOutput: '',
    hint: "Remember: strings need quotes, numbers don't!"
  },
};

const Lesson: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { completeLesson, earnBadge, unlockWorld, isLessonCompleted } = useGame();
  const { playLessonCompleteSound } = useSoundEffects();
  
  const [step, setStep] = useState(0);
  const [showXp, setShowXp] = useState(false);
  const [questCompleted, setQuestCompleted] = useState(false);
  const [showBadge, setShowBadge] = useState<{ name: string; icon: string } | null>(null);
  const [showWorldUnlock, setShowWorldUnlock] = useState<string | null>(null);

  // Find the lesson and world
  let world = null;
  let lesson = null;
  let lessonIndex = -1;
  
  for (const w of worlds) {
    const idx = w.lessons.findIndex(l => l.id === lessonId);
    if (idx !== -1) {
      world = w;
      lesson = w.lessons[idx];
      lessonIndex = idx;
      break;
    }
  }

  if (!lesson || !world) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground">Lesson not found</p>
          <Link to="/worlds">
            <Button className="mt-4">Back to World Map</Button>
          </Link>
        </div>
      </div>
    );
  }

  const content = lessonContent[lessonId || ''];
  const alreadyCompleted = isLessonCompleted(lesson.id);

  const handleQuestSuccess = () => {
    if (!questCompleted && !alreadyCompleted) {
      setQuestCompleted(true);
      setShowXp(true);
      playLessonCompleteSound();
      completeLesson(lesson.id, world.slug, lesson.xp);
      
      // Check if this was the first lesson - earn badge
      if (lessonId === 'var-1') {
        earnBadge('variable-starter');
        setTimeout(() => {
          setShowBadge({ name: 'Variable Starter', icon: '📦' });
        }, 2600);
      }
      
      // Check if this completes the world
      const worldLessons = world.lessons;
      const completedCount = worldLessons.filter((l, i) => 
        i < lessonIndex || l.id === lesson.id
      ).length;
      
      if (completedCount === worldLessons.length) {
        unlockWorld(world.id + 1);
        const nextW = worlds.find(w => w.id === world.id + 1);
        if (nextW) {
          setTimeout(() => {
            setShowWorldUnlock(nextW.name);
          }, 3000);
        }
      }
    }
  };

  const nextLesson = world.lessons[lessonIndex + 1];
  const nextWorld = worlds.find(w => w.id === world.id + 1);

  const steps = ['story', 'explanation', 'code', 'quest'];

  if (!content) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="text-6xl mb-4">🚧</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Coming Soon!</h1>
          <p className="text-muted-foreground mb-6">
            This lesson is still being written. Check back soon!
          </p>
          <Link to={`/world/${world.slug}`}>
            <Button>Back to {world.name}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <XpPopup amount={lesson.xp} show={showXp} onComplete={() => setShowXp(false)} />
      
      {showBadge && (
        <CelebrationOverlay
          show={true}
          type="badge"
          title="Badge Earned!"
          subtitle={showBadge.name}
          icon={showBadge.icon}
          onComplete={() => setShowBadge(null)}
        />
      )}
      
      {showWorldUnlock && (
        <CelebrationOverlay
          show={true}
          type="world"
          title="New World Unlocked!"
          subtitle={showWorldUnlock}
          icon="🌍"
          onComplete={() => setShowWorldUnlock(null)}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to={`/world/${world.slug}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {world.name}
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xl">{world.icon}</span>
              <span className="font-medium text-foreground">{lesson.title}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              +{lesson.xp} XP
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="flex gap-2 mt-4">
            {steps.map((s, i) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  i <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Story Step */}
        {step === 0 && (
          <div className="space-y-6">
            <StoryPanel title={content.storyTitle} variant="story">
              {content.story.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </StoryPanel>
          </div>
        )}

        {/* Explanation Step */}
        {step === 1 && (
          <div className="space-y-6">
            <StoryPanel title={content.explanationTitle} variant="explanation">
              {content.explanation.map((point, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: point.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`(.*?)`/g, '<code class="bg-muted px-1 rounded text-primary font-mono text-sm">$1</code>') }} />
              ))}
            </StoryPanel>
          </div>
        )}

        {/* Code Example Step */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-foreground">
              ✨ Python Magic in Action
            </h2>
            <p className="text-muted-foreground">
              Here's how we write this magic in Python:
            </p>
            <CodeBlock code={content.codeExample} />
          </div>
        )}

        {/* Quest Step */}
        {step === 3 && (
          <div className="space-y-6">
            <StoryPanel title={content.questTitle} variant="quest">
              <p>{content.questDescription}</p>
            </StoryPanel>
            
            <InteractiveCodeEditor
              initialCode={content.initialCode}
              expectedOutput={content.expectedOutput}
              onSuccess={handleQuestSuccess}
              hint={content.hint}
            />

            {(questCompleted || alreadyCompleted) && (
              <div className="bg-primary/10 rounded-xl p-6 text-center border border-primary/30">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Quest Complete!
                </h3>
                <p className="text-muted-foreground mb-4">
                  You've mastered this lesson. Ready for the next adventure?
                </p>
                
                <div className="flex flex-wrap justify-center gap-3">
                  {nextLesson ? (
                    <Link to={`/lesson/${nextLesson.id}`}>
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        Next Lesson
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  ) : nextWorld ? (
                    <Link to={`/world/${nextWorld.slug}`}>
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Enter {nextWorld.name}
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" disabled>
                      More worlds coming soon!
                    </Button>
                  )}
                  <Link to={`/world/${world.slug}`}>
                    <Button variant="outline">
                      Back to {world.name}
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          {step < 3 && (
            <Button
              onClick={() => setStep(s => s + 1)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Lesson;
