import React, { useState, useEffect, useRef, useCallback, TouchEvent } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Send, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { StoryGroup, Story } from '@/types';
import { Avatar } from './Avatar';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface StoryViewerProps {
  storyGroups: StoryGroup[];
  initialGroupIndex: number;
  onClose: () => void;
  onMarkViewed: (storyId: string) => void;
  onUserClick?: (userId: string) => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  storyGroups,
  initialGroupIndex,
  onClose,
  onMarkViewed,
  onUserClick,
}) => {
  const [currentGroupIndex, setCurrentGroupIndex] = useState(initialGroupIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [message, setMessage] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const holdTimeout = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentGroup = storyGroups[currentGroupIndex];
  const currentStory = currentGroup?.stories[currentStoryIndex];
  const storyDuration = currentStory?.duration || 5000;

  // Start progress timer
  const startProgress = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    const startTime = Date.now();
    const startProgress = progress;

    progressInterval.current = setInterval(() => {
      if (!isPaused) {
        const elapsed = Date.now() - startTime;
        const newProgress = startProgress + (elapsed / storyDuration) * 100;

        if (newProgress >= 100) {
          goToNextStory();
        } else {
          setProgress(newProgress);
        }
      }
    }, 50);
  }, [isPaused, progress, storyDuration]);

  // Go to next story
  const goToNextStory = useCallback(() => {
    if (currentStoryIndex < currentGroup.stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setProgress(0);
    } else if (currentGroupIndex < storyGroups.length - 1) {
      setCurrentGroupIndex(prev => prev + 1);
      setCurrentStoryIndex(0);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentStoryIndex, currentGroup?.stories.length, currentGroupIndex, storyGroups.length, onClose]);

  // Go to previous story
  const goToPreviousStory = useCallback(() => {
    if (progress > 10 || currentStoryIndex === 0) {
      setProgress(0);
    } else if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setProgress(0);
    } else if (currentGroupIndex > 0) {
      setCurrentGroupIndex(prev => prev - 1);
      const prevGroup = storyGroups[currentGroupIndex - 1];
      setCurrentStoryIndex(prevGroup.stories.length - 1);
      setProgress(0);
    }
  }, [progress, currentStoryIndex, currentGroupIndex, storyGroups]);

  // Mark story as viewed
  useEffect(() => {
    if (currentStory && !currentStory.viewed) {
      onMarkViewed(currentStory.id);
    }
  }, [currentStory, onMarkViewed]);

  // Reset progress on story change
  useEffect(() => {
    setProgress(0);
    setIsLiked(false);
    startProgress();

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentGroupIndex, currentStoryIndex]);

  // Pause/resume effect
  useEffect(() => {
    if (!isPaused) {
      startProgress();
    } else if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPaused, startProgress]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goToNextStory();
      if (e.key === 'ArrowLeft') goToPreviousStory();
      if (e.key === ' ') setIsPaused(prev => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, goToNextStory, goToPreviousStory]);

  // Touch handlers
  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    holdTimeout.current = setTimeout(() => setIsPaused(true), 200);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (holdTimeout.current) {
      clearTimeout(holdTimeout.current);
    }
    setIsPaused(false);

    if (!touchStart) return;

    const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = touchEnd.y - touchStart.y;

    // Swipe down to close
    if (deltaY > 100 && Math.abs(deltaX) < 50) {
      onClose();
      return;
    }

    // If it was a quick tap (not a hold)
    if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
      const screenWidth = window.innerWidth;
      const tapX = touchEnd.x;

      if (tapX < screenWidth / 3) {
        goToPreviousStory();
      } else if (tapX > (screenWidth * 2) / 3) {
        goToNextStory();
      }
    }

    setTouchStart(null);
  };

  const handleMouseDown = () => {
    holdTimeout.current = setTimeout(() => setIsPaused(true), 200);
  };

  const handleMouseUp = () => {
    if (holdTimeout.current) {
      clearTimeout(holdTimeout.current);
    }
    setIsPaused(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left;
    const width = rect.width;

    if (clickX < width / 3) {
      goToPreviousStory();
    } else if (clickX > (width * 2) / 3) {
      goToNextStory();
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Would send message to story owner
      setMessage('');
    }
  };

  if (!currentGroup || !currentStory) return null;

  const timeAgo = formatDistanceToNow(new Date(currentStory.createdAt), { addSuffix: true });

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Desktop navigation arrows */}
      <button
        onClick={goToPreviousStory}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10 hidden md:flex"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button
        onClick={goToNextStory}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10 hidden md:flex"
      >
        <ChevronRight size={24} />
      </button>

      {/* Story container */}
      <div
        ref={containerRef}
        className="relative w-full h-full md:w-[400px] md:h-[85vh] md:rounded-2xl overflow-hidden bg-black"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
      >
        {/* Story image */}
        <img
          src={currentStory.mediaUrl}
          alt="Story"
          className="w-full h-full object-cover"
          draggable={false}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 pointer-events-none" />

        {/* Progress bars */}
        <div className="absolute top-0 left-0 right-0 p-2 flex gap-1">
          {currentGroup.stories.map((_, idx) => (
            <div key={idx} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-75"
                style={{
                  width: `${idx < currentStoryIndex ? 100 : idx === currentStoryIndex ? progress : 0}%`,
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-6 left-0 right-0 px-4 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onUserClick?.(currentGroup.user.id);
              onClose();
            }}
          >
            <Avatar src={currentGroup.user.avatar} size="sm" hasStory={false} />
            <div>
              <p className="text-white font-semibold text-sm">{currentGroup.user.username}</p>
              <p className="text-white/70 text-xs">{timeAgo}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPaused(!isPaused);
              }}
              className="p-2 text-white"
            >
              {isPaused ? <Play size={20} /> : <Pause size={20} />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className="p-2 text-white"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-2 text-white"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Pause indicator */}
        {isPaused && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
              <Pause size={32} className="text-white" />
            </div>
          </div>
        )}

        {/* Bottom actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 safe-area-bottom">
          <form 
            onSubmit={handleSendMessage}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Send message..."
              className="flex-1 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/50 rounded-full px-4 py-2.5 text-sm outline-none border border-white/20"
              onFocus={() => setIsPaused(true)}
              onBlur={() => setIsPaused(false)}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
              className={cn(
                "p-2 transition-transform active:scale-125",
                isLiked ? "text-red-500" : "text-white"
              )}
            >
              <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
            </button>
            <button type="submit" className="p-2 text-white">
              <Send size={24} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
