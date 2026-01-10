import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: Date;
}

export interface LessonProgress {
  lessonId: string;
  worldId: string;
  completed: boolean;
  xpEarned: number;
  completedAt?: Date;
}

export interface GameState {
  playerName: string;
  xp: number;
  level: number;
  currentWorld: number;
  completedLessons: LessonProgress[];
  badges: Badge[];
  streak: number;
  lastPlayedAt?: Date;
  lastDailyChallengeDate?: string;
  dailyChallengeIndex: number;
}

const LEVELS = [
  { name: 'Python Explorer', minXp: 0 },
  { name: 'Logic Builder', minXp: 100 },
  { name: 'Code Adventurer', minXp: 300 },
  { name: 'Syntax Sorcerer', minXp: 600 },
  { name: 'Python Hero', minXp: 1000 },
];

const INITIAL_BADGES: Badge[] = [
  // First lesson badges
  { id: 'variable-starter', name: 'Variable Starter', description: 'Created your first magic box', icon: '📦', earned: false },
  { id: 'decision-maker', name: 'Decision Maker', description: 'Made your first choice', icon: '🔀', earned: false },
  { id: 'loop-apprentice', name: 'Loop Apprentice', description: 'Started climbing the mountains', icon: '🥾', earned: false },
  { id: 'spell-writer', name: 'Spell Writer', description: 'Wrote your first function', icon: '📜', earned: false },
  { id: 'bug-hunter', name: 'Bug Hunter', description: 'Found your first bug', icon: '🔍', earned: false },
  
  // World completion badges
  { id: 'village-master', name: 'Village Master', description: 'Mastered all variables in the village', icon: '🏘️', earned: false },
  { id: 'forest-explorer', name: 'Forest Explorer', description: 'Conquered all paths in the forest', icon: '🌲', earned: false },
  { id: 'loop-hero', name: 'Loop Hero', description: 'Reached the summit of Loop Mountains', icon: '⛰️', earned: false },
  { id: 'castle-knight', name: 'Castle Knight', description: 'Mastered all spells in the castle', icon: '🏰', earned: false },
  { id: 'dragon-slayer', name: 'Dragon Slayer', description: 'Defeated the Dragon of Debugging', icon: '🐉', earned: false },
  
  // Ultimate badge
  { id: 'python-hero', name: 'Python Hero', description: 'Completed the entire PyQuest adventure!', icon: '👑', earned: false },
];

const INITIAL_STATE: GameState = {
  playerName: '',
  xp: 0,
  level: 0,
  currentWorld: 1,
  completedLessons: [],
  badges: INITIAL_BADGES,
  streak: 0,
  dailyChallengeIndex: 0,
};

interface GameContextType {
  state: GameState;
  setPlayerName: (name: string) => void;
  addXp: (amount: number) => void;
  completeLesson: (lessonId: string, worldId: string, xp: number) => void;
  earnBadge: (badgeId: string) => void;
  unlockWorld: (worldId: number) => void;
  getLevelName: () => string;
  getXpToNextLevel: () => number;
  getLevelProgress: () => number;
  isLessonCompleted: (lessonId: string) => boolean;
  isWorldUnlocked: (worldId: number) => boolean;
  completeDailyChallenge: (xp: number) => void;
  getDailyChallengeStatus: () => { isCompleted: boolean; todayChallenge: number };
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem('pyquest-game-state');
    if (saved) {
      return JSON.parse(saved);
    }
    return INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem('pyquest-game-state', JSON.stringify(state));
  }, [state]);

  const calculateLevel = (xp: number): number => {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (xp >= LEVELS[i].minXp) return i;
    }
    return 0;
  };

  const setPlayerName = (name: string) => {
    setState(prev => ({ ...prev, playerName: name }));
  };

  const addXp = (amount: number) => {
    setState(prev => {
      const newXp = prev.xp + amount;
      const newLevel = calculateLevel(newXp);
      return { ...prev, xp: newXp, level: newLevel };
    });
  };

  const completeLesson = (lessonId: string, worldId: string, xp: number) => {
    setState(prev => {
      const alreadyCompleted = prev.completedLessons.some(l => l.lessonId === lessonId);
      if (alreadyCompleted) return prev;

      const newXp = prev.xp + xp;
      const newLevel = calculateLevel(newXp);
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        completedLessons: [
          ...prev.completedLessons,
          { lessonId, worldId, completed: true, xpEarned: xp, completedAt: new Date() }
        ],
        lastPlayedAt: new Date(),
      };
    });
  };

  const earnBadge = (badgeId: string) => {
    setState(prev => ({
      ...prev,
      badges: prev.badges.map(b =>
        b.id === badgeId ? { ...b, earned: true, earnedAt: new Date() } : b
      ),
    }));
  };

  const unlockWorld = (worldId: number) => {
    setState(prev => ({
      ...prev,
      currentWorld: Math.max(prev.currentWorld, worldId),
    }));
  };

  const getLevelName = () => LEVELS[state.level]?.name || 'Python Explorer';

  const getXpToNextLevel = () => {
    const nextLevel = LEVELS[state.level + 1];
    if (!nextLevel) return 0;
    return nextLevel.minXp - state.xp;
  };

  const getLevelProgress = () => {
    const currentLevelXp = LEVELS[state.level]?.minXp || 0;
    const nextLevelXp = LEVELS[state.level + 1]?.minXp || currentLevelXp + 100;
    const progress = ((state.xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  const isLessonCompleted = (lessonId: string) => {
    return state.completedLessons.some(l => l.lessonId === lessonId);
  };

  const isWorldUnlocked = (worldId: number) => {
    return worldId <= state.currentWorld;
  };

  const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getDailyChallengeStatus = () => {
    const today = getTodayDateString();
    const isCompleted = state.lastDailyChallengeDate === today;
    return { 
      isCompleted, 
      todayChallenge: state.dailyChallengeIndex ?? 0 
    };
  };

  const completeDailyChallenge = (xp: number) => {
    const today = getTodayDateString();
    if (state.lastDailyChallengeDate === today) return;

    setState(prev => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      const isConsecutiveDay = prev.lastDailyChallengeDate === yesterdayStr;
      const newStreak = isConsecutiveDay ? prev.streak + 1 : 1;
      
      const newXp = prev.xp + xp;
      const newLevel = calculateLevel(newXp);
      
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        streak: newStreak,
        lastDailyChallengeDate: today,
        dailyChallengeIndex: prev.dailyChallengeIndex + 1,
        lastPlayedAt: new Date(),
      };
    });
  };

  return (
    <GameContext.Provider
      value={{
        state,
        setPlayerName,
        addXp,
        completeLesson,
        earnBadge,
        unlockWorld,
        getLevelName,
        getXpToNextLevel,
        getLevelProgress,
        isLessonCompleted,
        isWorldUnlocked,
        completeDailyChallenge,
        getDailyChallengeStatus,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
