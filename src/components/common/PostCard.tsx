import React from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { Post } from '@/types';
import { Avatar } from './Avatar';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onUserClick: (userId: string) => void;
  onImageClick: (post: Post) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onComment,
  onUserClick,
  onImageClick,
}) => {
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  return (
    <article className="bg-card border-b border-border animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => onUserClick(post.user.id)}
        >
          <Avatar
            src={post.user.avatar}
            alt={post.user.displayName}
            size="sm"
            isOnline={post.user.isOnline}
          />
          <div>
            <p className="font-semibold text-sm text-foreground">{post.user.username}</p>
            <p className="text-xs text-muted-foreground">{post.user.role}</p>
          </div>
        </div>
        <button className="p-2 hover:bg-muted rounded-full transition-colors">
          <MoreHorizontal size={20} className="text-muted-foreground" />
        </button>
      </div>

      {/* Media */}
      <div
        className="relative aspect-square bg-muted cursor-pointer"
        onClick={() => onImageClick(post)}
      >
        {post.type === 'image' ? (
          <img
            src={post.mediaUrl}
            alt={post.caption}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <video
            src={post.mediaUrl}
            className="w-full h-full object-cover"
            controls
          />
        )}
      </div>

      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onLike(post.id)}
              className={cn(
                'transition-transform active:scale-125',
                post.isLiked && 'animate-heartbeat'
              )}
            >
              <Heart
                size={24}
                className={cn(
                  'transition-colors',
                  post.isLiked ? 'fill-destructive text-destructive' : 'text-foreground hover:text-muted-foreground'
                )}
              />
            </button>
            <button onClick={() => onComment(post.id)}>
              <MessageCircle size={24} className="text-foreground hover:text-muted-foreground transition-colors" />
            </button>
            <button>
              <Send size={22} className="text-foreground hover:text-muted-foreground transition-colors" />
            </button>
          </div>
          <button>
            <Bookmark size={24} className="text-foreground hover:text-muted-foreground transition-colors" />
          </button>
        </div>

        {/* Likes count */}
        <p className="font-semibold text-sm mb-1">
          {post.likesCount.toLocaleString()} likes
        </p>

        {/* Caption */}
        {post.caption && (
          <p className="text-sm">
            <span
              className="font-semibold cursor-pointer hover:underline"
              onClick={() => onUserClick(post.user.id)}
            >
              {post.user.username}
            </span>{' '}
            <span className="text-foreground">{post.caption}</span>
          </p>
        )}

        {/* Comments preview */}
        {post.commentsCount > 0 && (
          <button
            className="text-muted-foreground text-sm mt-1"
            onClick={() => onComment(post.id)}
          >
            View all {post.commentsCount} comments
          </button>
        )}

        {/* Timestamp */}
        <p className="text-xs text-muted-foreground mt-1 uppercase">{timeAgo}</p>
      </div>
    </article>
  );
};

export default PostCard;
