import React, { useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { worlds } from '@/data/worlds';
import CodeBlock from '@/components/CodeBlock';
import StoryPanel from '@/components/StoryPanel';
import InteractiveCodeEditor from '@/components/InteractiveCodeEditor';
import XpPopup from '@/components/XpPopup';
import CelebrationOverlay from '@/components/CelebrationOverlay';
import GlobalNavbar from '@/components/GlobalNavbar';
import MascotGuide from '@/components/MascotGuide';
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

  // Function Castle lessons
  'func-1': {
    storyTitle: 'Writing Spell Books',
    story: [
      "Welcome to Function Castle! 🏰 The towers gleam with magical energy.",
      "The Court Wizard greets you: \"Here we write spell books—collections of instructions that can be used again and again! We call them 'functions'.\"",
      "\"Instead of writing the same spell repeatedly, you write it once in a spell book. Then you just say its name to cast it!\"",
      "She opens an ancient tome: \"To create a spell book, use 'def' (short for define), give it a name, add parentheses, and a colon. The spell instructions go indented below!\""
    ],
    explanationTitle: 'Creating Functions',
    explanation: [
      "**Functions** are reusable blocks of code!",
      "• `def` → keyword to define a function",
      "• Function name → what you call it",
      "• `()` → parentheses (can hold ingredients later)",
      "• `:` → starts the function body",
      "• Indented code → what the function does",
      "Call a function by writing its name with `()`"
    ],
    codeExample: `# Creating a spell book (function)
def greet_hero():
    print("Welcome, brave adventurer!")
    print("May your code be bug-free!")

# Casting the spell (calling the function)
greet_hero()
greet_hero()  # Can use it many times!

# Another spell book
def celebrate():
    print("🎉 Victory!")
    print("You did it!")

celebrate()`,
    questTitle: 'Your First Spell Book',
    questDescription: "Create a function called `battle_cry` that prints \"For glory!\" when called. Then call it!",
    initialCode: `# Write your spell book
def battle_cry():
    print("For glory!")

# Cast the spell
battle_cry()`,
    expectedOutput: '',
    hint: "Don't forget the colon after the function name, and indent the print statement!"
  },
  'func-2': {
    storyTitle: 'Spell Ingredients',
    story: [
      "In the castle's alchemy lab, you learn about spell ingredients! 🧪",
      "\"Some spells need ingredients to work,\" the alchemist explains. \"We call these 'parameters'. They go inside the parentheses!\"",
      "\"When you cast the spell, you provide the actual ingredients—we call those 'arguments'. The spell uses whatever you give it!\"",
      "She demonstrates: \"A greeting spell that takes a name can greet anyone—just give it a different name each time!\""
    ],
    explanationTitle: 'Parameters and Arguments',
    explanation: [
      "**Parameters** are variables that receive values when called!",
      "• Define with: `def greet(name):` ← 'name' is a parameter",
      "• Call with: `greet(\"Alice\")` ← 'Alice' is an argument",
      "• Multiple parameters: `def add(a, b):`",
      "• Call with multiple: `add(5, 3)`",
      "Parameters let functions work with different data each time!"
    ],
    codeExample: `# Spell with one ingredient
def greet(hero_name):
    print("Hello,", hero_name)

greet("Arthur")
greet("Merlin")

# Spell with two ingredients
def power_up(hero, boost):
    print(hero, "gains", boost, "power!")

power_up("Knight", 50)
power_up("Wizard", 100)`,
    questTitle: 'Add Ingredients',
    questDescription: "Create a function `welcome` that takes a `name` parameter and prints \"Welcome, \" followed by the name. Call it with your name!",
    initialCode: `# Spell with an ingredient
def welcome(name):
    print("Welcome,", name)

# Cast with your name
welcome("Hero")`,
    expectedOutput: '',
    hint: "The parameter goes inside the parentheses in the def line!"
  },
  'func-3': {
    storyTitle: 'Returning Gifts',
    story: [
      "In the castle treasury, you discover the secret of returning gifts! 🎁",
      "The Treasurer speaks: \"The most powerful spell books don't just do things—they give something back! We use 'return' to send a value back.\"",
      "\"Think of it like sending a messenger. The function does its work, then 'returns' with an answer you can use!\"",
      "\"You can store what comes back in a variable, or use it directly. This makes functions incredibly powerful!\""
    ],
    explanationTitle: 'The Return Statement',
    explanation: [
      "**return** sends a value back from a function!",
      "• `return value` → sends value back to caller",
      "• Store result: `result = my_function()`",
      "• Use directly: `print(my_function())`",
      "• After return, function stops immediately",
      "Functions can calculate and return answers!"
    ],
    codeExample: `# A function that returns a gift
def double(number):
    result = number * 2
    return result

# Catch the returned gift
answer = double(5)
print("Double of 5 is:", answer)

# Use directly
print("Double of 10 is:", double(10))

# Calculate total gold
def calculate_reward(monsters, gold_each):
    return monsters * gold_each

total = calculate_reward(3, 50)
print("You earned", total, "gold!")`,
    questTitle: 'Return the Treasure',
    questDescription: "Create a function `triple` that takes a number and returns it multiplied by 3. Print the result of triple(4)!",
    initialCode: `# Function that returns triple
def triple(number):
    return number * 3

# Get the answer
result = triple(4)
print(result)`,
    expectedOutput: '',
    hint: "Use 'return number * 3' to send back the tripled value!"
  },

  // Dragon of Debugging lessons
  'debug-1': {
    storyTitle: 'Finding Mistakes',
    story: [
      "You enter the Dragon's Domain! 🐉 But first, you must learn to spot errors.",
      "A young dragon named Bugsy greets you: \"Even the best wizards make mistakes! The key is learning to find and fix them.\"",
      "\"There are three types of bugs: Syntax errors (spelling mistakes in spells), Runtime errors (spells that explode mid-cast), and Logic errors (spells that work but do the wrong thing).\"",
      "\"Python tries to help! It shows error messages pointing to the problem. Learn to read them!\""
    ],
    explanationTitle: 'Types of Errors',
    explanation: [
      "**Syntax Errors** → Python can't understand your code",
      "• Missing colons, parentheses, quotes",
      "• Misspelled keywords (pritn instead of print)",
      "**Runtime Errors** → Code crashes while running",
      "• Dividing by zero, using undefined variables",
      "**Logic Errors** → Code runs but gives wrong answer",
      "• Using + instead of *, wrong variable names",
      "Read error messages carefully—they tell you the line number!"
    ],
    codeExample: `# Fixed syntax error (was missing colon)
if True:
    print("Spell works!")

# Fixed runtime error (was dividing by zero)
total = 100
parts = 4  # Changed from 0
result = total / parts
print(result)

# Fixed logic error (was using wrong operator)
price = 10
quantity = 5
total = price * quantity  # Was + instead of *
print("Total:", total)`,
    questTitle: 'Spot the Bug',
    questDescription: "The code below has a bug—'prnt' should be 'print'. Fix it so the spell works!",
    initialCode: `# Fix the bug!
message = "Dragon defeated!"
print(message)`,
    expectedOutput: '',
    hint: "Check the spelling of 'print' carefully!"
  },
  'debug-2': {
    storyTitle: "The Dragon's Riddles",
    story: [
      "The great dragon presents you with broken code riddles! 🔥",
      "\"Each riddle contains a bug,\" the dragon growls. \"Fix them to prove your worth!\"",
      "\"Remember: Check your indentation—Python is picky about spaces. Check your operators—== for comparing, = for assigning. Check your quotes—they must match!\"",
      "\"Use print statements to see what your variables contain. This is called 'debugging with print'—a powerful technique!\""
    ],
    explanationTitle: 'Debugging Techniques',
    explanation: [
      "**Common fixes:**",
      "• Indentation: Use consistent spaces (4 spaces recommended)",
      "• Quotes: Start and end with same type (' or \")",
      "• Parentheses: Every ( needs a )",
      "**Debug with print:**",
      "• Add `print(variable)` to see values",
      "• Print before and after operations",
      "• Remove debug prints when done!"
    ],
    codeExample: `# Debugging with print statements
def calculate_score(hits, misses):
    print("Hits:", hits)  # Debug: see the value
    print("Misses:", misses)  # Debug: see the value
    
    score = hits * 10 - misses * 5
    print("Score calculated:", score)  # Debug
    return score

result = calculate_score(5, 2)
print("Final score:", result)

# Fixed indentation
for i in range(3):
    print("Attempt", i + 1)
    print("Trying...")`,
    questTitle: 'Solve the Riddle',
    questDescription: "Fix the indentation error in this loop so it prints numbers 1, 2, 3!",
    initialCode: `# Fix the indentation
for i in range(1, 4):
    print(i)`,
    expectedOutput: '',
    hint: "The print statement needs to be indented inside the for loop!"
  },
  'debug-3': {
    storyTitle: 'Becoming a Hero',
    story: [
      "The final challenge! The dragon bows before you. 👑",
      "\"You have learned the ways of Python, young one. Variables, decisions, loops, functions, and debugging—you know them all!\"",
      "\"But a true hero combines everything. Write code that uses all your skills together!\"",
      "\"Go forth and create! Remember: every master was once a beginner. Keep coding, keep learning, and never fear the bugs!\""
    ],
    explanationTitle: 'Putting It All Together',
    explanation: [
      "You've learned so much! Let's combine everything:",
      "• **Variables** → Store your data",
      "• **If-Else** → Make decisions",
      "• **Loops** → Repeat actions",
      "• **Functions** → Organize and reuse code",
      "• **Debugging** → Find and fix problems",
      "Real programs use ALL of these together!"
    ],
    codeExample: `# A complete mini-program using everything!
def battle(hero_power, monster_power):
    if hero_power > monster_power:
        return "Victory!"
    elif hero_power == monster_power:
        return "Draw!"
    else:
        return "Retreat!"

# Variables
hero = "Brave Coder"
power = 50

# Loop through battles
for monster in range(1, 4):
    monster_power = monster * 15
    print("Battle", monster)
    result = battle(power, monster_power)
    print(result)

print("Adventure complete!")`,
    questTitle: 'The Final Challenge',
    questDescription: "You've mastered Python basics! Create a function that takes a number and returns \"Hero!\" if it's greater than 50, else \"Training...\"",
    initialCode: `# Your final spell!
def check_power(power):
    if power > 50:
        return "Hero!"
    else:
        return "Training..."

# Test your spell
result = check_power(75)
print(result)`,
    expectedOutput: '',
    hint: "Use an if-else inside your function with a return statement!"
  },
};

const Lesson: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { state, completeLesson, earnBadge, unlockWorld, isLessonCompleted } = useGame();
  const { playLessonCompleteSound, playBadgeEarnedSound, playWorldUnlockSound } = useSoundEffects();
  
  const [step, setStep] = useState(0);
  const [showXp, setShowXp] = useState(false);
  const [questCompleted, setQuestCompleted] = useState(false);
  const [showBadge, setShowBadge] = useState<{ name: string; icon: string } | null>(null);
  const [showWorldUnlock, setShowWorldUnlock] = useState<string | null>(null);
  const [codeRan, setCodeRan] = useState(false);

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

  // Get mascot message based on current state
  const mascotState = useMemo(() => {
    if (questCompleted || alreadyCompleted) {
      return { 
        message: "Fantastic work! You've mastered this lesson! 🎉", 
        mood: 'celebrating' as const 
      };
    }
    if (codeRan && step === 3) {
      return { 
        message: "Great try! Keep experimenting until the magic works! ✨", 
        mood: 'encouraging' as const 
      };
    }
    switch (step) {
      case 0:
        return { 
          message: "Welcome! Let me tell you a story about coding magic... 📖", 
          mood: 'excited' as const 
        };
      case 1:
        return { 
          message: "Here's the secret knowledge! Pay attention to the bold parts! 🧠", 
          mood: 'thinking' as const 
        };
      case 2:
        return { 
          message: "See how the code works? Try to understand each line! 💡", 
          mood: 'idle' as const 
        };
      case 3:
        return { 
          message: "Time to practice! Click 'Cast Spell' when you're ready! 🪄", 
          mood: 'encouraging' as const 
        };
      default:
        return { 
          message: "You're doing great! Keep going! 🦉", 
          mood: 'idle' as const 
        };
    }
  }, [step, questCompleted, alreadyCompleted, codeRan]);

  const handleQuestSuccess = () => {
    // Mark quest as solved (but don't award XP yet - that happens on submit)
    if (!questCompleted && !alreadyCompleted) {
      setQuestCompleted(true);
    }
  };

  const handleSubmit = () => {
    if (alreadyCompleted) return;
    
    setShowXp(true);
    playLessonCompleteSound();
    completeLesson(lesson.id, String(world.id), lesson.xp);
    
    // First lesson badges for each world
    const firstLessonBadges: Record<string, { id: string; name: string; icon: string }> = {
      'var-1': { id: 'variable-starter', name: 'Variable Starter', icon: '📦' },
      'if-1': { id: 'decision-maker', name: 'Decision Maker', icon: '🔀' },
      'loop-1': { id: 'loop-apprentice', name: 'Loop Apprentice', icon: '🥾' },
      'func-1': { id: 'spell-writer', name: 'Spell Writer', icon: '📜' },
      'debug-1': { id: 'bug-hunter', name: 'Bug Hunter', icon: '🔍' },
    };
    
    if (lessonId && firstLessonBadges[lessonId]) {
      const badge = firstLessonBadges[lessonId];
      earnBadge(badge.id);
      setTimeout(() => {
        playBadgeEarnedSound();
        setShowBadge({ name: badge.name, icon: badge.icon });
      }, 2600);
    }
    
    // World completion badges
    const worldCompletionBadges: Record<string, { id: string; name: string; icon: string }> = {
      'village-of-variables': { id: 'village-master', name: 'Village Master', icon: '🏘️' },
      'forest-of-if-else': { id: 'forest-explorer', name: 'Forest Explorer', icon: '🌲' },
      'loop-mountains': { id: 'loop-hero', name: 'Loop Hero', icon: '⛰️' },
      'function-castle': { id: 'castle-knight', name: 'Castle Knight', icon: '🏰' },
      'dragon-of-debugging': { id: 'dragon-slayer', name: 'Dragon Slayer', icon: '🐉' },
    };
    
    // Check if this completes the world (include current lesson + already completed ones)
    const completedLessonIds = new Set(
      state.completedLessons
        .filter(l => l.worldId === String(world.id))
        .map(l => l.lessonId)
    );
    completedLessonIds.add(lesson.id);
    
    if (completedLessonIds.size === world.lessons.length) {
      // Award world completion badge with sound
      const worldBadge = worldCompletionBadges[world.slug];
      if (worldBadge) {
        earnBadge(worldBadge.id);
        setTimeout(() => {
          playBadgeEarnedSound();
          setShowBadge({ name: worldBadge.name, icon: worldBadge.icon });
        }, 4000);
      }
      
      // Check if ALL worlds are complete for Python Hero badge
      if (world.slug === 'dragon-of-debugging') {
        earnBadge('python-hero');
        setTimeout(() => {
          playBadgeEarnedSound();
          setShowBadge({ name: 'Python Hero', icon: '👑' });
        }, 6000);
      }
      
      unlockWorld(world.id + 1);
      const nextW = worlds.find(w => w.id === world.id + 1);
      if (nextW) {
        setTimeout(() => {
          playWorldUnlockSound();
          setShowWorldUnlock(nextW.name);
        }, 5000);
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

      <GlobalNavbar />

      {/* Lesson Header */}
      <div className="bg-card border-b border-border">
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
      </div>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Animated Mascot Guide */}
        <div className="mb-6">
          <MascotGuide
            message={mascotState.message}
            mood={mascotState.mood}
            size="md"
          />
        </div>

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
              onSubmit={handleSubmit}
              onCodeRun={() => setCodeRan(true)}
              hint={content.hint}
              showSubmitOnSuccess={!alreadyCompleted}
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
