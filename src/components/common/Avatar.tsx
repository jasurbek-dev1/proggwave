import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  hasStory?: boolean;
  isOnline?: boolean;
  onClick?: () => void;
  className?: string;
}

const sizeClasses = {
  xs: 'w-8 h-8',
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

const ringPadding = {
  xs: 'p-[1.5px]',
  sm: 'p-[2px]',
  md: 'p-[2px]',
  lg: 'p-[2.5px]',
  xl: 'p-[3px]',
};

const onlineSize = {
  xs: 'w-2 h-2',
  sm: 'w-2.5 h-2.5',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
  xl: 'w-5 h-5',
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  hasStory = false,
  isOnline = false,
  onClick,
  className,
}) => {
  return (
    <div
      className={cn(
        'relative flex-shrink-0',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {hasStory ? (
        <div className={cn('gradient-border rounded-full', ringPadding[size])}>
          <img
            src={src}
            alt={alt}
            className={cn(
              sizeClasses[size],
              'rounded-full object-cover border-2 border-background'
            )}
          />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={cn(sizeClasses[size], 'rounded-full object-cover')}
        />
      )}
      
      {isOnline && (
        <span
          className={cn(
            'absolute bottom-0 right-0 bg-online rounded-full border-2 border-background',
            onlineSize[size]
          )}
        />
      )}
    </div>
  );
};

export default Avatar;
