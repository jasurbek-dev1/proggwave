import React, { useEffect, useState } from 'react';
import { ArrowLeft, Code2, Timer, Trophy, Swords, Play, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBattleProps {
  onBack?: () => void;
  onUserClick?: (userId: string) => void;
}

const CodeBattle: React.FC<CodeBattleProps> = ({ onBack, onUserClick }) => {
  const [timeLeft, setTimeLeft] = useState(240);
  const [status, setStatus] = useState<'waiting' | 'playing' | 'finished'>('waiting');
  const [code, setCode] = useState('');
  const [result, setResult] = useState<'win' | 'lose' | null>(null);
  const [opponent, setOpponent] = useState<{ id: string; name: string; rating: number; avatar: string } | null>(null);

  // Find opponent
  useEffect(() => {
    if (status === 'waiting') {
      const t = setTimeout(() => {
        setOpponent({
          id: 'opp1',
          name: 'DevKnight',
          rating: 1680,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        });
        setStatus('playing');
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [status]);

  // Timer
  useEffect(() => {
    if (status === 'playing' && timeLeft > 0) {
      const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(t);
    }
    if (timeLeft === 0 && status === 'playing') {
      setStatus('finished');
      setResult('lose');
    }
  }, [timeLeft, status]);

  const handleSubmit = () => {
    const win = Math.random() > 0.4;
    setResult(win ? 'win' : 'lose');
    setStatus('finished');
  };

  const handlePlayAgain = () => {
    setStatus('waiting');
    setTimeLeft(240);
    setCode('');
    setResult(null);
    setOpponent(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft size={20} /> Orqaga
      </button>

      {/* Waiting state */}
      {status === 'waiting' && (
        <div className="text-center py-20">
          <div className="relative inline-block">
            <Swords className="w-16 h-16 text-yellow-500 animate-pulse" />
            <div className="absolute inset-0 animate-ping opacity-20">
              <Swords className="w-16 h-16 text-yellow-500" />
            </div>
          </div>
          <p className="text-xl text-muted-foreground mt-6 animate-pulse">
            Raqib qidirilmoqda...
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}

      {/* Playing state */}
      {status === 'playing' && opponent && (
        <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
          {/* Header with players */}
          <div className="bg-muted/50 p-4 flex justify-between items-center border-b border-border">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                alt="You"
                className="w-10 h-10 rounded-full object-cover border-2 border-primary"
              />
              <div>
                <p className="font-semibold text-foreground">Siz</p>
                <p className="text-xs text-muted-foreground">Rating: 1350</p>
              </div>
            </div>

            <div className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full font-bold',
              timeLeft <= 30 ? 'bg-red-500/20 text-red-500' : 'bg-primary/20 text-primary'
            )}>
              <Timer className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>

            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onUserClick?.(opponent.id)}
            >
              <div className="text-right">
                <p className="font-semibold text-foreground">{opponent.name}</p>
                <p className="text-xs text-muted-foreground">Rating: {opponent.rating}</p>
              </div>
              <img
                src={opponent.avatar}
                alt={opponent.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-yellow-500"
              />
            </div>
          </div>

          {/* Task */}
          <div className="p-5">
            <h3 className="text-lg font-semibold mb-3 text-yellow-500 flex items-center gap-2">
              <Code2 /> Vazifa:
            </h3>
            <div className="bg-muted/30 p-4 rounded-lg mb-4 border border-border">
              <p className="text-foreground">
                HTML, CSS va JavaScript yordamida oddiy <span className="text-primary font-semibold">"Login Form"</span> tuzing.
              </p>
              <ul className="mt-3 text-sm text-muted-foreground space-y-1">
                <li>• <code className="bg-muted px-1 rounded">username</code> input maydoni</li>
                <li>• <code className="bg-muted px-1 rounded">password</code> input maydoni</li>
                <li>• Submit button</li>
                <li>• Chiroyli dizayn (bonus ball)</li>
              </ul>
            </div>

            {/* Code editor */}
            <div className="relative">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-64 bg-background text-foreground font-mono text-sm border border-border rounded-lg p-4 focus:ring-2 focus:ring-primary/50 outline-none resize-none"
                placeholder="// HTML, CSS yoki JavaScript kod yozing..."
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <span className="px-2 py-1 bg-muted text-xs rounded text-muted-foreground">
                  {code.length} belgi
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setCode('')}
                className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <RotateCcw size={16} /> Tozalash
              </button>
              <button
                onClick={handleSubmit}
                disabled={!code.trim()}
                className={cn(
                  'flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all',
                  code.trim()
                    ? 'bg-primary text-primary-foreground hover:opacity-90'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                )}
              >
                <Play size={16} /> Yuborish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Finished state */}
      {status === 'finished' && result && (
        <div className="text-center py-10">
          {result === 'win' ? (
            <>
              <div className="relative inline-block mb-6">
                <Trophy className="w-24 h-24 text-yellow-400 animate-bounce" />
                <div className="absolute -top-2 -right-2 text-4xl">🎉</div>
              </div>
              <h2 className="text-3xl font-bold text-yellow-400 mb-2">G'alaba!</h2>
              <p className="text-muted-foreground">Tabriklaymiz! Reytingingiz oshdi</p>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-500 rounded-full font-semibold">
                +25 rating
              </div>
            </>
          ) : (
            <>
              <div className="relative inline-block mb-6">
                <Swords className="w-24 h-24 text-red-400" />
              </div>
              <h2 className="text-3xl font-bold text-red-400 mb-2">Yutqazdingiz</h2>
              <p className="text-muted-foreground">Keyingi safar omad!</p>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-500 rounded-full font-semibold">
                -15 rating
              </div>
            </>
          )}

          {opponent && (
            <div 
              className="mt-8 p-4 bg-card border border-border rounded-xl inline-block cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onUserClick?.(opponent.id)}
            >
              <p className="text-sm text-muted-foreground mb-2">Raqib:</p>
              <div className="flex items-center gap-3">
                <img
                  src={opponent.avatar}
                  alt={opponent.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="text-left">
                  <p className="font-semibold text-foreground">{opponent.name}</p>
                  <p className="text-xs text-muted-foreground">Rating: {opponent.rating}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8">
            <button
              onClick={handlePlayAgain}
              className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              Qayta o'ynash
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeBattle;
