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
  
  // Forest of If-Else lessons
  'if-1': {
    storyTitle: 'The Crossroads',
    story: [
      "You've ventured deep into the Forest of If-Else! 🌲",
      "At a clearing, you find a magical crossroads with two paths. An ancient talking signpost speaks: \"Traveler! The forest changes based on choices. If it's day, take the sunny path. Else, take the moonlit path.\"",
      "This is the core of the forest's magic—making decisions! Every creature here thinks in 'if this, then that' patterns.",
      "The signpost continues: \"In this forest, we check conditions. If something is true, one thing happens. If it's false, something else happens. This is how we navigate!\""
    ],
    explanationTitle: 'Understanding If-Else',
    explanation: [
      "**If statements** let your code make decisions!",
      "• `if` checks a condition (is something true?)",
      "• If true → run the indented code below",
      "• `else` → what happens if the condition is false",
      "Think of it like: \"IF it's raining, THEN take umbrella, ELSE wear sunglasses\""
    ],
    codeExample: `# The forest's decision magic
weather = "sunny"

if weather == "sunny":
    print("Take the bright path!")
else:
    print("Take the shadowy path!")

# Another decision
coins = 50
if coins >= 100:
    print("You can buy the magic sword!")
else:
    print("Keep collecting coins...")`,
    questTitle: 'Your First Decision',
    questDescription: "Create a variable `time` set to \"day\" or \"night\". Use if-else to print \"Walk confidently!\" if it's day, else print \"Light your torch!\"",
    initialCode: `# Set the time
time = "day"

# Make your decision
if time == "day":
    print("Walk confidently!")
else:
    print("Light your torch!")`,
    expectedOutput: '',
    hint: "Use == (double equals) to compare values, not = (single equals)!"
  },
  'if-2': {
    storyTitle: "The Guard's Question",
    story: [
      "Deeper in the forest, a stone guardian blocks your path! 🗿",
      "\"Answer my riddle,\" it rumbles. \"I will check if your answer is correct. But beware—I check EXACTLY. 'yes' is not the same as 'Yes'!\"",
      "The guardian explains comparison magic: You can check if things are equal, greater than, less than, or not equal!",
      "\"Many travelers fail because they forget: comparing uses ==, not =. One equals sign stores a value. Two equals signs ask a question!\""
    ],
    explanationTitle: 'Comparison Operators',
    explanation: [
      "**Comparison operators** return True or False:",
      "• `==` → equals (are they the same?)",
      "• `!=` → not equals (are they different?)",
      "• `>` → greater than",
      "• `<` → less than",
      "• `>=` → greater than or equal",
      "• `<=` → less than or equal"
    ],
    codeExample: `# The guardian's tests
player_level = 5
required_level = 3

# Check if player can pass
if player_level >= required_level:
    print("You may pass, brave one!")
else:
    print("Train more, young one.")

# Check exact answer
password = "magic"
if password == "magic":
    print("Correct! The door opens.")`,
    questTitle: 'Answer the Guardian',
    questDescription: "Create a variable `answer` with a number. Check if it's greater than 10. If yes, print \"Correct!\", else print \"Try again!\"",
    initialCode: `# Your answer to the riddle
answer = 15

# The guardian checks
if answer > 10:
    print("Correct!")
else:
    print("Try again!")`,
    expectedOutput: '',
    hint: "Use > to check if something is greater than another value!"
  },
  'if-3': {
    storyTitle: 'Multiple Paths',
    story: [
      "You reach the heart of the forest—a mystical clearing with THREE paths! 🌟",
      "A wise owl perches above: \"Sometimes life has more than two choices! The forest spirits use 'elif' for extra paths.\"",
      "\"First, check the main 'if'. If false, check 'elif' (short for else-if). You can have many elifs! Finally, 'else' catches everything remaining.\"",
      "The owl hoots wisely: \"Think of a treasure chest. Is it gold? Is it silver? Is it bronze? Or is it something else entirely?\""
    ],
    explanationTitle: 'Multiple Conditions with elif',
    explanation: [
      "**elif** means 'else if' — check another condition!",
      "• `if` → check first condition",
      "• `elif` → if first was false, check this condition",
      "• `elif` → can have many of these!",
      "• `else` → if ALL conditions were false, do this",
      "Python checks from top to bottom and stops at the first true condition!"
    ],
    codeExample: `# The three paths
treasure_type = "gold"

if treasure_type == "gold":
    print("Incredible! +100 coins!")
elif treasure_type == "silver":
    print("Great find! +50 coins!")
elif treasure_type == "bronze":
    print("Not bad! +20 coins!")
else:
    print("Just an empty chest...")

# Grade checker
score = 85
if score >= 90:
    print("Grade: A")
elif score >= 80:
    print("Grade: B")
elif score >= 70:
    print("Grade: C")
else:
    print("Keep studying!")`,
    questTitle: 'The Three Treasures',
    questDescription: "Create a score variable. Use if-elif-else to print \"Champion!\" for 100, \"Great!\" for 50 or more, else \"Keep going!\"",
    initialCode: `# Your score
score = 75

# Check your rank
if score == 100:
    print("Champion!")
elif score >= 50:
    print("Great!")
else:
    print("Keep going!")`,
    expectedOutput: '',
    hint: "Check for exact 100 first with ==, then use >= for 50 or more!"
  },

  // Loop Mountains lessons
  'loop-1': {
    storyTitle: 'The Training Grounds',
    story: [
      "Welcome to Loop Mountains! ⛰️ The air is thin but magical here.",
      "At the training grounds, Master Loop demonstrates her power: She waves her staff and creates 10 identical training dummies instantly!",
      "\"In the old days,\" she says, \"wizards wrote the same spell 10 times. How tedious! With loops, we write once and repeat as many times as we want!\"",
      "She shows you the 'for loop'—a spell that repeats automatically. \"Tell it how many times, and it does the work. This is the secret of Loop Mountains!\""
    ],
    explanationTitle: 'The Power of For Loops',
    explanation: [
      "**For loops** repeat code a specific number of times!",
      "• `for` starts the loop",
      "• `range(n)` creates numbers from 0 to n-1",
      "• The indented code runs for each number",
      "`for i in range(5):` → runs 5 times (i = 0, 1, 2, 3, 4)",
      "Think: \"FOR each number in this RANGE, do this action\""
    ],
    codeExample: `# Master Loop's demonstration
print("Creating training dummies:")
for i in range(5):
    print("Dummy", i + 1, "appears!")

# Practice swings
print("Practice time:")
for swing in range(3):
    print("Swing!")

print("Training complete!")`,
    questTitle: 'Your Training Begins',
    questDescription: "Use a for loop to print \"Training!\" exactly 4 times. The mountain spirits are watching!",
    initialCode: `# Begin your training
for i in range(4):
    print("Training!")

print("Well done, apprentice!")`,
    expectedOutput: '',
    hint: "range(4) will make the loop run 4 times: 0, 1, 2, 3"
  },
  'loop-2': {
    storyTitle: 'Counting Steps',
    story: [
      "You begin climbing the mountain path. Each step must be counted! 🥾",
      "An old mountain guide appears: \"The 'range' spell is more powerful than you know! You can start from any number, end at any number, and even skip steps!\"",
      "He demonstrates: \"range(1, 6) counts from 1 to 5. range(0, 10, 2) counts 0, 2, 4, 6, 8—jumping by 2 each time!\"",
      "\"Master the range, master the mountain!\" he declares, his voice echoing across the peaks."
    ],
    explanationTitle: 'Advanced Range Magic',
    explanation: [
      "**range()** has three forms:",
      "• `range(stop)` → 0 to stop-1",
      "• `range(start, stop)` → start to stop-1",
      "• `range(start, stop, step)` → start to stop-1, jumping by step",
      "Examples:",
      "`range(5)` → 0, 1, 2, 3, 4",
      "`range(1, 6)` → 1, 2, 3, 4, 5",
      "`range(0, 10, 2)` → 0, 2, 4, 6, 8"
    ],
    codeExample: `# Counting your steps up the mountain
print("Climbing steps 1 to 5:")
for step in range(1, 6):
    print("Step", step)

# Counting by twos
print("Even numbered steps:")
for even in range(2, 11, 2):
    print("Step", even)

# Countdown!
print("Countdown:")
for num in range(5, 0, -1):
    print(num)
print("Blast off!")`,
    questTitle: 'Count the Steps',
    questDescription: "Use range with a start and stop to count from 1 to 5, printing each step number!",
    initialCode: `# Count steps 1 to 5
for step in range(1, 6):
    print("Step", step)

print("Reached the checkpoint!")`,
    expectedOutput: '',
    hint: "range(1, 6) gives you 1, 2, 3, 4, 5 — the stop value is not included!"
  },
  'loop-3': {
    storyTitle: 'Breaking Free',
    story: [
      "At the summit, you find a mysterious while loop cave! 🌙",
      "A crystal golem guards the entrance: \"The 'while' loop is different. It repeats WHILE a condition is true. It could run forever... unless you know when to break!\"",
      "\"Some loops must be escaped,\" the golem warns. \"The 'break' command shatters any loop instantly. 'continue' skips to the next round. Use them wisely!\"",
      "You step into the cave, ready to master the most powerful loop magic of all."
    ],
    explanationTitle: 'While Loops and Control',
    explanation: [
      "**While loops** repeat while a condition is True!",
      "• `while condition:` → keeps running while condition is True",
      "• Be careful! If condition never becomes False, loop runs forever!",
      "**Loop controls:**",
      "• `break` → exit the loop immediately",
      "• `continue` → skip to next iteration",
      "Always make sure your while loop can eventually stop!"
    ],
    codeExample: `# The while loop cave
energy = 5

while energy > 0:
    print("Exploring... Energy:", energy)
    energy = energy - 1

print("Need to rest!")

# Finding treasure with break
for chest in range(1, 10):
    print("Opening chest", chest)
    if chest == 3:
        print("Found the treasure!")
        break

print("Adventure complete!")`,
    questTitle: 'Escape the Cave',
    questDescription: "Create a while loop that counts down from 3 to 1, printing each number. Make sure it stops!",
    initialCode: `# Countdown to escape
countdown = 3

while countdown > 0:
    print(countdown)
    countdown = countdown - 1

print("Escaped!")`,
    expectedOutput: '',
    hint: "Make sure to decrease the countdown inside the loop, or it will run forever!"
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
