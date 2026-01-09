export interface Lesson {
  id: string;
  title: string;
  description: string;
  xp: number;
}

export interface World {
  id: number;
  slug: string;
  name: string;
  description: string;
  icon: string;
  lessons: Lesson[];
}

export const worlds: World[] = [
  {
    id: 1,
    slug: 'village-of-variables',
    name: 'Village of Variables',
    description: 'Learn about magic boxes that store your treasures',
    icon: '🏘️',
    lessons: [
      { id: 'var-1', title: 'The Magic Bags', description: 'Discover what variables are', xp: 20 },
      { id: 'var-2', title: 'Naming Your Treasures', description: 'Learn to name variables properly', xp: 20 },
      { id: 'var-3', title: 'Numbers and Words', description: 'Store different types of items', xp: 25 },
    ],
  },
  {
    id: 2,
    slug: 'forest-of-if-else',
    name: 'Forest of If-Else',
    description: 'Navigate the paths of decisions and choices',
    icon: '🌲',
    lessons: [
      { id: 'if-1', title: 'The Crossroads', description: 'Make your first decision', xp: 25 },
      { id: 'if-2', title: 'The Guard\'s Question', description: 'Learn conditional logic', xp: 30 },
      { id: 'if-3', title: 'Multiple Paths', description: 'Handle many possibilities', xp: 30 },
    ],
  },
  {
    id: 3,
    slug: 'loop-mountains',
    name: 'Loop Mountains',
    description: 'Master the power of repetition',
    icon: '⛰️',
    lessons: [
      { id: 'loop-1', title: 'The Training Grounds', description: 'Repeat actions with loops', xp: 30 },
      { id: 'loop-2', title: 'Counting Steps', description: 'Control how many times to repeat', xp: 35 },
      { id: 'loop-3', title: 'Breaking Free', description: 'Learn to stop a loop', xp: 35 },
    ],
  },
  {
    id: 4,
    slug: 'function-castle',
    name: 'Function Castle',
    description: 'Create powerful spell books that can be reused',
    icon: '🏰',
    lessons: [
      { id: 'func-1', title: 'Writing Spell Books', description: 'Create your first function', xp: 35 },
      { id: 'func-2', title: 'Spell Ingredients', description: 'Pass values to functions', xp: 40 },
      { id: 'func-3', title: 'Returning Gifts', description: 'Get values back from functions', xp: 40 },
    ],
  },
  {
    id: 5,
    slug: 'dragon-of-debugging',
    name: 'Dragon of Debugging',
    description: 'Face the final boss and fix broken spells',
    icon: '🐉',
    lessons: [
      { id: 'debug-1', title: 'Finding Mistakes', description: 'Learn to spot errors', xp: 40 },
      { id: 'debug-2', title: 'The Dragon\'s Riddles', description: 'Solve complex bugs', xp: 50 },
      { id: 'debug-3', title: 'Becoming a Hero', description: 'Master all your skills', xp: 60 },
    ],
  },
];
