import React, { useState, useRef } from 'react';
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { StoryGroup } from '@/types';
import { Avatar } from './Avatar';
import { cn } from '@/lib/utils';

interface StoriesBarProps {
  stories: StoryGroup[];
  onAddStory: () => void;
  onViewStory: (group: StoryGroup, index: number) => void;
  currentUserId: string;
}

export const StoriesBar: React.FC<StoriesBarProps> = ({
  stories,
  onAddStory,
  onViewStory,
  currentUserId,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-card border-b border-border">
      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-background/90 rounded-full shadow-md flex items-center justify-center hover:bg-background transition-colors hidden md:flex"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Stories Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 p-4 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {stories.map((group, idx) => {
          const isCurrentUser = group.user.id === currentUserId;
          const isAddButton = isCurrentUser && group.stories.length === 0;

          return (
            <div
              key={group.user.id}
              className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer"
              onClick={() => isAddButton ? onAddStory() : onViewStory(group, idx)}
            >
              <div className="relative">
                {isAddButton ? (
                  <div className="w-16 h-16 rounded-full bg-muted border-2 border-dashed border-muted-foreground/50 flex items-center justify-center">
                    <Plus size={24} className="text-muted-foreground" />
                  </div>
                ) : (
                  <div className={cn(
                    'p-[2px] rounded-full',
                    group.hasUnviewed ? 'gradient-border' : 'bg-muted'
                  )}>
                    <img
                      src={group.user.avatar}
                      alt={group.user.displayName}
                      className="w-14 h-14 rounded-full object-cover border-2 border-background"
                    />
                  </div>
                )}
                {isCurrentUser && group.stories.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddStory();
                    }}
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-background"
                  >
                    <Plus size={14} className="text-primary-foreground" />
                  </button>
                )}
              </div>
              <span className="text-xs text-center truncate w-16">
                {isCurrentUser ? 'Your story' : group.user.username}
              </span>
            </div>
          );
        })}
      </div>

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-background/90 rounded-full shadow-md flex items-center justify-center hover:bg-background transition-colors hidden md:flex"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
};

// Story Viewer Modal
interface StoryViewerProps {
  group: StoryGroup;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  group,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentStory = group.stories[currentIndex];

  const handleNext = () => {
    if (currentIndex < group.stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (hasNext) {
      onNext();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (hasPrev) {
      onPrev();
    }
  };

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center animate-fade-in">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white"
      >
        <X size={24} />
      </button>

      {/* Progress bars */}
      <div className="absolute top-4 left-4 right-16 flex gap-1 z-10">
        {group.stories.map((_, idx) => (
          <div key={idx} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full bg-white transition-all duration-[5000ms]',
                idx < currentIndex ? 'w-full' : idx === currentIndex ? 'w-full' : 'w-0'
              )}
            />
          </div>
        ))}
      </div>

      {/* User info */}
      <div className="absolute top-10 left-4 flex items-center gap-3 z-10">
        <Avatar src={group.user.avatar} size="sm" />
        <div>
          <p className="text-white font-semibold text-sm">{group.user.username}</p>
          <p className="text-white/60 text-xs">
            {new Date(currentStory.createdAt).toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Navigation areas */}
      <div className="absolute inset-0 flex">
        <div className="w-1/3 h-full cursor-pointer" onClick={handlePrev} />
        <div className="w-1/3 h-full" />
        <div className="w-1/3 h-full cursor-pointer" onClick={handleNext} />
      </div>

      {/* Story content */}
      <img
        src={currentStory.mediaUrl || `https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=900&fit=crop`}
        alt="Story"
        className="max-h-[90vh] max-w-full object-contain"
      />

      {/* Navigation arrows for desktop */}
      {hasPrev && (
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hidden md:flex"
        >
          <ChevronLeft size={24} />
        </button>
      )}
      {hasNext && (
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hidden md:flex"
        >
          <ChevronRight size={24} />
        </button>
      )}
    </div>
  );
};

export default StoriesBar;
