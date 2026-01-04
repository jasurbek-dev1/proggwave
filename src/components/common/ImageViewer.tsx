import React from 'react';
import { X } from 'lucide-react';
import { Post } from '@/types';
import { Avatar } from './Avatar';
import { cn } from '@/lib/utils';

interface ImageViewerProps {
  post: Post;
  onClose: () => void;
  onLike: (postId: string) => void;
  onUserClick: (userId: string) => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  post,
  onClose,
  onLike,
  onUserClick,
}) => {
  return (
    <div
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
      >
        <X size={24} />
      </button>

      {/* Content container */}
      <div
        className="flex flex-col md:flex-row max-w-6xl max-h-[90vh] w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="flex-1 flex items-center justify-center bg-black">
          <img
            src={post.mediaUrl}
            alt={post.caption}
            className="max-h-[70vh] md:max-h-[90vh] max-w-full object-contain"
          />
        </div>

        {/* Sidebar with details - hidden on mobile */}
        <div className="hidden md:flex flex-col w-80 bg-card">
          {/* User header */}
          <div
            className="flex items-center gap-3 p-4 border-b border-border cursor-pointer"
            onClick={() => onUserClick(post.user.id)}
          >
            <Avatar src={post.user.avatar} size="sm" />
            <div>
              <p className="font-semibold text-sm">{post.user.username}</p>
              <p className="text-xs text-muted-foreground">{post.user.role}</p>
            </div>
          </div>

          {/* Caption */}
          {post.caption && (
            <div className="p-4 border-b border-border">
              <p className="text-sm">
                <span className="font-semibold">{post.user.username}</span>{' '}
                {post.caption}
              </p>
            </div>
          )}

          {/* Stats */}
          <div className="p-4">
            <p className="font-semibold text-sm">{post.likesCount.toLocaleString()} likes</p>
            <p className="text-muted-foreground text-sm">{post.commentsCount} comments</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
