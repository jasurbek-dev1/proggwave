import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Play,
  Clock,
  Trophy,
  Code,
  Users,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Loader2,
  Zap,
  Target,
  Medal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ArenaProblem, Player, User } from '@/types';
import { arenaService } from '@/services/arena.service';
import { Avatar } from './Avatar';

interface CodeArenaProps {
  currentUser?: User;
  onBack: () => void;
  onUserClick?: (userId: string) => void;
}

type ArenaView = 'list' | 'challenge' | 'result';

interface ChallengeResult {
  passed: boolean;
  score: number;
  timeSpent: number;
}

export const CodeArena: React.FC<CodeArenaProps> = ({
  currentUser,
  onBack,
  onUserClick,
}) => {
  const [view, setView] = useState<ArenaView>('list');
  const [challenges, setChallenges] = useState<ArenaProblem[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<ArenaProblem | null>(null);
  const [result, setResult] = useState<ChallengeResult | null>(null);
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [activeTab, setActiveTab] = useState<'challenges' | 'leaderboard'>('challenges');

  useEffect(() => {
    loadChallenges();
    loadLeaderboard();
  }, []);

  const loadChallenges = async () => {
    setIsLoading(true);
    const data = await arenaService.getProblems();
    setChallenges(data);
    setIsLoading(false);
  };

  const loadLeaderboard = async () => {
    const data = await arenaService.getLeaderboard();
    setLeaderboard(data);
  };

  const handleStartChallenge = async (challenge: ArenaProblem) => {
    setSelectedChallenge(challenge);
    setCode(challenge.starterCode || '// Write your solution here\n\nfunction solution() {\n  \n}');
    // timeLimit is in ms, convert to seconds (e.g., 1000ms = 1s, multiply by some factor for game time)
    setTimeLeft(Math.max(challenge.timeLimit, 300)); // Minimum 5 minutes
    setResult(null);
    setView('challenge');
  };

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (view === 'challenge' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [view, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (timeout = false) => {
    if (!selectedChallenge) return;
    
    setIsSubmitting(true);
    
    // Mock evaluation
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Random result for mock
    const passed = !timeout && Math.random() > 0.4;
    const score = passed ? Math.floor(Math.random() * 50) + 50 : 0;
    const timeSpent = (selectedChallenge.timeLimit > 300 ? selectedChallenge.timeLimit : 300) - timeLeft;
    
    setResult({ passed, score, timeSpent });
    setIsSubmitting(false);
    setView('result');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedChallenge(null);
    setResult(null);
    setCode('');
    setTimeLeft(0);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-500 bg-green-500/10';
      case 'medium':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'hard':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const renderChallengeList = () => (
    <div className="pb-24">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 p-4">
        <div className="bg-card rounded-xl p-4 text-center">
          <Trophy className="mx-auto text-yellow-500 mb-1" size={24} />
          <p className="text-lg font-bold text-foreground">12</p>
          <p className="text-xs text-muted-foreground">Solved</p>
        </div>
        <div className="bg-card rounded-xl p-4 text-center">
          <Zap className="mx-auto text-primary mb-1" size={24} />
          <p className="text-lg font-bold text-foreground">850</p>
          <p className="text-xs text-muted-foreground">Points</p>
        </div>
        <div className="bg-card rounded-xl p-4 text-center">
          <Target className="mx-auto text-green-500 mb-1" size={24} />
          <p className="text-lg font-bold text-foreground">#42</p>
          <p className="text-xs text-muted-foreground">Rank</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mx-4">
        <button
          onClick={() => setActiveTab('challenges')}
          className={cn(
            'flex-1 py-3 text-sm font-medium transition-colors border-b-2',
            activeTab === 'challenges'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground'
          )}
        >
          Challenges
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={cn(
            'flex-1 py-3 text-sm font-medium transition-colors border-b-2',
            activeTab === 'leaderboard'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground'
          )}
        >
          Leaderboard
        </button>
      </div>

      {activeTab === 'challenges' ? (
        <div className="p-4 space-y-3">
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
            ))
          ) : (
            challenges.map((challenge) => (
              <button
                key={challenge.id}
                onClick={() => handleStartChallenge(challenge)}
                className="w-full bg-card hover:bg-muted rounded-xl p-4 text-left transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Code size={16} className="text-primary" />
                      <h3 className="font-semibold text-foreground truncate">
                        {challenge.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {challenge.description}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn(
                        'px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                        getDifficultyColor(challenge.difficulty)
                      )}>
                        {challenge.difficulty}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock size={12} />
                        {Math.max(Math.floor(challenge.timeLimit / 60), 5)} min
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users size={12} />
                        {challenge.testCases.length} test cases
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-muted-foreground flex-shrink-0" />
                </div>
              </button>
            ))
          )}
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {leaderboard.map((player, index) => (
            <div
              key={player.id}
              onClick={() => onUserClick(player.id)}
              className="flex items-center gap-3 bg-card rounded-xl p-4 cursor-pointer hover:bg-muted transition-colors"
            >
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                index === 1 ? 'bg-gray-400/20 text-gray-400' :
                index === 2 ? 'bg-orange-500/20 text-orange-500' :
                'bg-muted text-muted-foreground'
              )}>
                {index < 3 ? <Medal size={16} /> : index + 1}
              </div>
              <Avatar src={player.avatar} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">@{player.username}</p>
                <p className="text-xs text-muted-foreground">
                  {player.wins}W - {player.losses}L
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{player.rating}</p>
                <p className="text-xs text-muted-foreground">rating</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderChallenge = () => {
    if (!selectedChallenge) return null;

    return (
      <div className="flex flex-col h-full">
        {/* Challenge header */}
        <div className="p-4 border-b border-border bg-card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-foreground">{selectedChallenge.title}</h2>
            <div className={cn(
              'flex items-center gap-2 px-3 py-1 rounded-full font-mono text-sm',
              timeLeft <= 60 ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-muted text-foreground'
            )}>
              <Clock size={16} />
              {formatTime(timeLeft)}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{selectedChallenge.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={cn(
              'px-2 py-0.5 rounded-full text-xs font-medium capitalize',
              getDifficultyColor(selectedChallenge.difficulty)
            )}>
              {selectedChallenge.difficulty}
            </span>
          </div>
        </div>

        {/* Examples */}
        <div className="p-4 border-b border-border bg-muted/30">
          <h3 className="text-sm font-medium text-foreground mb-2">Examples:</h3>
          {selectedChallenge.examples.map((example, i) => (
            <div key={i} className="mb-2 text-xs font-mono">
              <p className="text-muted-foreground">Input: <span className="text-foreground">{example.input}</span></p>
              <p className="text-muted-foreground">Output: <span className="text-foreground">{example.output}</span></p>
            </div>
          ))}
        </div>

        {/* Code editor */}
        <div className="flex-1 p-4 overflow-auto">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full min-h-[300px] p-4 bg-card border border-border rounded-xl font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
            placeholder="Write your code here..."
            spellCheck={false}
          />
        </div>

        {/* Submit button */}
        <div className="p-4 border-t border-border bg-card">
          <button
            onClick={() => handleSubmit()}
            disabled={isSubmitting || !code.trim()}
            className={cn(
              'w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all',
              isSubmitting
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:opacity-90'
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Evaluating...
              </>
            ) : (
              <>
                <Play size={20} />
                Submit Solution
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  const renderResult = () => {
    if (!result || !selectedChallenge) return null;

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className={cn(
          'w-24 h-24 rounded-full flex items-center justify-center mb-6',
          result.passed ? 'bg-green-500/20' : 'bg-red-500/20'
        )}>
          {result.passed ? (
            <CheckCircle2 size={48} className="text-green-500" />
          ) : (
            <XCircle size={48} className="text-red-500" />
          )}
        </div>

        <h2 className={cn(
          'text-2xl font-bold mb-2',
          result.passed ? 'text-green-500' : 'text-red-500'
        )}>
          {result.passed ? 'Challenge Completed!' : 'Challenge Failed'}
        </h2>

        <p className="text-muted-foreground mb-6">
          {result.passed
            ? `Great job! You solved "${selectedChallenge.title}"`
            : `Don't give up! Try "${selectedChallenge.title}" again`}
        </p>

        {result.passed && (
          <div className="flex items-center gap-6 mb-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{result.score}</p>
              <p className="text-sm text-muted-foreground">Points Earned</p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">
                {formatTime(result.timeSpent)}
              </p>
              <p className="text-sm text-muted-foreground">Time Used</p>
            </div>
          </div>
        )}

        <div className="flex gap-3 w-full max-w-xs">
          <button
            onClick={handleBackToList}
            className="flex-1 py-3 bg-muted text-foreground rounded-xl font-medium hover:bg-muted/80 transition-all"
          >
            Back to List
          </button>
          {!result.passed && (
            <button
              onClick={() => handleStartChallenge(selectedChallenge)}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-all"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button
            onClick={view === 'list' ? onBack : handleBackToList}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-yellow-500" />
            <h1 className="text-xl font-bold text-foreground">Code Arena</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 max-w-lg mx-auto w-full animate-fade-in">
        {view === 'list' && renderChallengeList()}
        {view === 'challenge' && renderChallenge()}
        {view === 'result' && renderResult()}
      </div>
    </div>
  );
};

export default CodeArena;
