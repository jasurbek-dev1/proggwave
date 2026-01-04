import React from 'react';
import { ArrowLeft, Trophy, Medal, Crown } from 'lucide-react';
import { mockPlayers } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface LeaderboardProps {
  onBack?: () => void;
  onUserClick?: (userId: string) => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onBack, onUserClick }) => {
  const players = mockPlayers.sort((a, b) => b.rating - a.rating);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 text-center font-bold text-muted-foreground">#{index + 1}</span>;
    }
  };

  const getRankBg = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border-yellow-500/30';
      case 1:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-500/10 border-gray-400/30';
      case 2:
        return 'bg-gradient-to-r from-amber-600/20 to-amber-700/10 border-amber-600/30';
      default:
        return 'bg-card border-border';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft size={20} /> Orqaga
        </button>
      )}

      <div className="flex items-center justify-center gap-3 mb-8">
        <Trophy className="w-8 h-8 text-yellow-500" />
        <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          Reytinglar
        </h2>
      </div>

      <div className="space-y-3">
        {players.map((player, index) => (
          <div
            key={player.id}
            onClick={() => onUserClick?.(player.id)}
            className={cn(
              'flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg',
              getRankBg(index)
            )}
          >
            {/* Rank */}
            <div className="flex-shrink-0 w-8 flex justify-center">
              {getRankIcon(index)}
            </div>

            {/* Avatar */}
            <div className="relative">
              <img
                src={player.avatar}
                alt={player.username}
                className="w-12 h-12 rounded-full object-cover border-2 border-background"
              />
              {index < 3 && (
                <div className={cn(
                  'absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold',
                  index === 0 ? 'bg-yellow-500 text-black' :
                  index === 1 ? 'bg-gray-400 text-black' :
                  'bg-amber-600 text-white'
                )}>
                  {index + 1}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">
                {player.username}
              </p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="text-green-500">{player.wins}W</span>
                <span className="text-red-500">{player.losses}L</span>
                <span className="text-muted-foreground">
                  {Math.round((player.wins / (player.wins + player.losses)) * 100)}%
                </span>
              </div>
            </div>

            {/* Rating */}
            <div className="text-right">
              <p className={cn(
                'text-lg font-bold',
                index === 0 ? 'text-yellow-400' :
                index === 1 ? 'text-gray-400' :
                index === 2 ? 'text-amber-600' :
                'text-foreground'
              )}>
                {player.rating}
              </p>
              <p className="text-xs text-muted-foreground">rating</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
