import React, { useState } from 'react';
import { Trophy, Users, ArrowLeft, Swords } from 'lucide-react';
import Leaderboard from './Leaderboard';
import CodeBattle from './CodeBattle';

interface ArenaHubProps {
  onBack?: () => void;
  onUserClick?: (userId: string) => void;
}

const ArenaHub: React.FC<ArenaHubProps> = ({ onBack, onUserClick }) => {
  const [tab, setTab] = useState<'menu' | 'leaderboard' | 'match'>('menu');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6 flex flex-col items-center">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-4xl mb-6">
        <button
          onClick={tab === 'menu' ? onBack : () => setTab('menu')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={22} /> Orqaga
        </button>
        <h1 className="text-2xl font-bold text-yellow-500 flex items-center gap-2">
          <Trophy /> Code Arena
        </h1>
        <div className="w-24" /> {/* Spacer for centering */}
      </div>

      {/* Main Menu */}
      {tab === 'menu' && (
        <div className="flex flex-col items-center gap-6 mt-20 w-full max-w-xs">
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Code Arena</h2>
            <p className="text-muted-foreground text-sm mt-2">
              Kod yozish bo'yicha raqobatlashing va reytingingizni oshiring!
            </p>
          </div>

          <button
            onClick={() => setTab('leaderboard')}
            className="w-full bg-card hover:bg-muted border border-border py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02]"
          >
            <Users className="text-primary" /> Reytinglar
          </button>
          
          <button
            onClick={() => setTab('match')}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-black py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-lg"
          >
            <Swords /> Match boshlash ⚔️
          </button>

          {/* Stats preview */}
          <div className="w-full mt-8 p-4 bg-card border border-border rounded-xl">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Sizning statistikangiz</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-foreground">1350</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-500">12</p>
                <p className="text-xs text-muted-foreground">G'alabalar</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-500">5</p>
                <p className="text-xs text-muted-foreground">Yutqazish</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      {tab === 'leaderboard' && (
        <Leaderboard onBack={() => setTab('menu')} onUserClick={onUserClick} />
      )}

      {/* Code Battle */}
      {tab === 'match' && (
        <CodeBattle onBack={() => setTab('menu')} onUserClick={onUserClick} />
      )}
    </div>
  );
};

export default ArenaHub;
