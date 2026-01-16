import React from 'react';
import { useGame } from '@/contexts/GameContext';
import GlobalNavbar from '@/components/GlobalNavbar';
import { Trophy, Crown, Medal, Star, Flame, Award } from 'lucide-react';

// Sample leaderboard data (in a real app, this would come from a backend)
const SAMPLE_PLAYERS = [
  { id: 1, name: 'DragonSlayer99', xp: 1250, badges: 11, streak: 15, level: 4 },
  { id: 2, name: 'CodeWizard', xp: 980, badges: 9, streak: 12, level: 3 },
  { id: 3, name: 'PyMaster', xp: 850, badges: 8, streak: 8, level: 3 },
  { id: 4, name: 'LoopLegend', xp: 720, badges: 7, streak: 5, level: 3 },
  { id: 5, name: 'BugHunter42', xp: 650, badges: 6, streak: 7, level: 3 },
  { id: 6, name: 'SyntaxHero', xp: 520, badges: 5, streak: 3, level: 2 },
  { id: 7, name: 'VariableMaster', xp: 430, badges: 4, streak: 4, level: 2 },
  { id: 8, name: 'NewCoder', xp: 280, badges: 3, streak: 2, level: 1 },
  { id: 9, name: 'PythonRookie', xp: 150, badges: 2, streak: 1, level: 1 },
  { id: 10, name: 'FirstTimer', xp: 50, badges: 1, streak: 0, level: 0 },
];

const LEVEL_NAMES = ['Python Explorer', 'Logic Builder', 'Code Adventurer', 'Syntax Sorcerer', 'Python Hero'];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-6 h-6 text-yellow-500" />;
    case 2:
      return <Medal className="w-6 h-6 text-gray-400" />;
    case 3:
      return <Medal className="w-6 h-6 text-amber-600" />;
    default:
      return <span className="w-6 h-6 flex items-center justify-center font-bold text-muted-foreground">{rank}</span>;
  }
};

const getRankBg = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
    case 2:
      return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30';
    case 3:
      return 'bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-600/30';
    default:
      return 'bg-card border-border';
  }
};

const Leaderboard: React.FC = () => {
  const { state, getLevelName } = useGame();
  
  // Insert current player into leaderboard
  const currentPlayer = {
    id: 'current',
    name: state.playerName || 'You',
    xp: state.xp,
    badges: state.badges.filter(b => b.earned).length,
    streak: state.streak,
    level: state.level,
  };
  
  // Combine and sort all players
  const allPlayers = [...SAMPLE_PLAYERS, currentPlayer].sort((a, b) => b.xp - a.xp);
  const currentPlayerRank = allPlayers.findIndex(p => p.id === 'current') + 1;
  
  // Top 10 for display
  const topPlayers = allPlayers.slice(0, 10);
  
  return (
    <div className="min-h-screen bg-background">
      <GlobalNavbar />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Player's current rank */}
        <div className="bg-primary/10 rounded-2xl p-6 mb-8 border border-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-3xl">
                🎮
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Your Ranking</h2>
                <p className="text-muted-foreground">{getLevelName()}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-primary">#{currentPlayerRank}</div>
              <p className="text-sm text-muted-foreground">{state.xp} XP</p>
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* 2nd Place */}
          <div className="flex flex-col items-center justify-end">
            {topPlayers[1] && (
              <div className={`w-full p-4 rounded-xl text-center ${topPlayers[1].id === 'current' ? 'ring-2 ring-primary' : ''} bg-gradient-to-b from-gray-400/20 to-gray-500/10 border border-gray-400/30`}>
                <Medal className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <div className="text-2xl mb-1">🥈</div>
                <p className="font-bold text-foreground text-sm truncate">{topPlayers[1].name}</p>
                <p className="text-primary font-bold">{topPlayers[1].xp} XP</p>
              </div>
            )}
          </div>
          
          {/* 1st Place */}
          <div className="flex flex-col items-center justify-end -mt-4">
            {topPlayers[0] && (
              <div className={`w-full p-4 rounded-xl text-center ${topPlayers[0].id === 'current' ? 'ring-2 ring-primary' : ''} bg-gradient-to-b from-yellow-500/20 to-amber-500/10 border border-yellow-500/30`}>
                <Crown className="w-10 h-10 text-yellow-500 mx-auto mb-2" />
                <div className="text-3xl mb-1">🥇</div>
                <p className="font-bold text-foreground truncate">{topPlayers[0].name}</p>
                <p className="text-primary font-bold text-lg">{topPlayers[0].xp} XP</p>
              </div>
            )}
          </div>
          
          {/* 3rd Place */}
          <div className="flex flex-col items-center justify-end">
            {topPlayers[2] && (
              <div className={`w-full p-4 rounded-xl text-center ${topPlayers[2].id === 'current' ? 'ring-2 ring-primary' : ''} bg-gradient-to-b from-amber-600/20 to-orange-600/10 border border-amber-600/30`}>
                <Medal className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <div className="text-2xl mb-1">🥉</div>
                <p className="font-bold text-foreground text-sm truncate">{topPlayers[2].name}</p>
                <p className="text-primary font-bold">{topPlayers[2].xp} XP</p>
              </div>
            )}
          </div>
        </div>

        {/* Full Leaderboard */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Top Players
          </h3>
          
          {topPlayers.map((player, index) => (
            <div
              key={player.id}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                getRankBg(index + 1)
              } ${player.id === 'current' ? 'ring-2 ring-primary' : ''}`}
            >
              <div className="w-8 flex justify-center">
                {getRankIcon(index + 1)}
              </div>
              
              <div className="w-12 h-12 rounded-full bg-background/50 flex items-center justify-center text-2xl">
                {index === 0 ? '👑' : index === 1 ? '⚔️' : index === 2 ? '🛡️' : '🎮'}
              </div>
              
              <div className="flex-1">
                <p className="font-bold text-foreground flex items-center gap-2">
                  {player.name}
                  {player.id === 'current' && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">You</span>
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  {LEVEL_NAMES[player.level]} • {player.badges} badges
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {player.streak > 0 && (
                  <div className="flex items-center gap-1 text-orange-500">
                    <Flame className="w-4 h-4" />
                    <span className="text-sm font-medium">{player.streak}</span>
                  </div>
                )}
                <div className="text-right">
                  <p className="font-bold text-primary">{player.xp} XP</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Summary */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-card rounded-xl p-4 text-center border border-border">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{state.xp}</p>
            <p className="text-sm text-muted-foreground">Total XP</p>
          </div>
          <div className="bg-card rounded-xl p-4 text-center border border-border">
            <Award className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{state.badges.filter(b => b.earned).length}</p>
            <p className="text-sm text-muted-foreground">Badges</p>
          </div>
          <div className="bg-card rounded-xl p-4 text-center border border-border">
            <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{state.streak}</p>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
