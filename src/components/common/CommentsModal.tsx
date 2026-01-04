import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, Send, MoreHorizontal, ArrowLeft } from 'lucide-react';
import { Comment, Post } from '@/types';
import { Avatar } from './Avatar';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { commentService } from '@/services/comment.service';
import { useIsMobile } from '@/hooks/use-mobile';

interface CommentsModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  onUserClick?: (userId: string) => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
  post,
  isOpen,
  onClose,
  onUserClick,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isOpen) {
      loadComments();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, post.id]);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const data = await commentService.getComments(post.id);
      setComments(data);
      // Set initially liked comments
      const liked = new Set<string>();
      data.forEach(c => {
        if (c.isLiked) liked.add(c.id);
        c.replies?.forEach(r => {
          if (r.isLiked) liked.add(r.id);
        });
      });
      setLikedComments(liked);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = await commentService.addComment(post.id, newComment, replyingTo?.id);
    
    if (replyingTo) {
      setComments(prev => prev.map(c => 
        c.id === replyingTo.id 
          ? { ...c, replies: [...(c.replies || []), comment] }
          : c
      ));
    } else {
      setComments(prev => [comment, ...prev]);
    }
    
    setNewComment('');
    setReplyingTo(null);
  };

  const handleLikeComment = async (commentId: string) => {
    const isLiked = likedComments.has(commentId);
    
    setLikedComments(prev => {
      const next = new Set(prev);
      if (isLiked) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });

    try {
      if (isLiked) {
        await commentService.unlikeComment(commentId);
      } else {
        await commentService.likeComment(commentId);
      }
    } catch {
      // Revert on error
      setLikedComments(prev => {
        const next = new Set(prev);
        if (isLiked) {
          next.add(commentId);
        } else {
          next.delete(commentId);
        }
        return next;
      });
    }
  };

  const handleReply = (comment: Comment) => {
    setReplyingTo(comment);
    inputRef.current?.focus();
  };

  const renderComment = (comment: Comment, isReply = false) => {
    const isLiked = likedComments.has(comment.id);
    const timeAgo = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });

    return (
      <div key={comment.id} className={cn("flex gap-3", isReply && "ml-12 mt-3")}>
        <div 
          className="cursor-pointer flex-shrink-0"
          onClick={() => onUserClick?.(comment.user.id)}
        >
          <Avatar src={comment.user.avatar} size="sm" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span 
                className="font-semibold text-sm cursor-pointer hover:underline text-foreground"
                onClick={() => onUserClick?.(comment.user.id)}
              >
                {comment.user.username}
              </span>
              <span className="text-sm ml-2 text-foreground">{comment.content}</span>
            </div>
            <button
              onClick={() => handleLikeComment(comment.id)}
              className="p-1 flex-shrink-0"
            >
              <Heart
                size={14}
                className={cn(
                  "transition-colors",
                  isLiked ? "fill-destructive text-destructive" : "text-muted-foreground"
                )}
              />
            </button>
          </div>
          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
            <span>{timeAgo}</span>
            <span>{comment.likesCount + (isLiked && !comment.isLiked ? 1 : 0)} likes</span>
            {!isReply && (
              <button 
                className="font-semibold hover:text-foreground"
                onClick={() => handleReply(comment)}
              >
                Reply
              </button>
            )}
          </div>
          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
              {comment.replies.map(reply => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  // Mobile bottom sheet style
  if (isMobile) {
    return (
      <div 
        className="fixed inset-0 bg-black/60 z-50 animate-fade-in"
        onClick={onClose}
      >
        <div 
          className="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl max-h-[85vh] flex flex-col animate-slide-up"
          onClick={e => e.stopPropagation()}
        >
          {/* Handle bar */}
          <div className="flex justify-center py-3">
            <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-4 pb-3 border-b border-border">
            <h3 className="text-center font-semibold text-foreground">Comments</h3>
          </div>

          {/* Comments list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No comments yet</p>
                <p className="text-sm mt-1">Start the conversation.</p>
              </div>
            ) : (
              comments.map(comment => renderComment(comment))
            )}
          </div>

          {/* Reply indicator */}
          {replyingTo && (
            <div className="px-4 py-2 bg-muted/50 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Replying to <span className="font-semibold">@{replyingTo.user.username}</span>
              </span>
              <button onClick={() => setReplyingTo(null)}>
                <X size={16} className="text-muted-foreground" />
              </button>
            </div>
          )}

          {/* Input */}
          <form 
            onSubmit={handleSubmit}
            className="p-4 border-t border-border flex items-center gap-3 bg-background safe-area-bottom"
          >
            <input
              ref={inputRef}
              type="text"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder={replyingTo ? `Reply to @${replyingTo.user.username}...` : "Add a comment..."}
              className="flex-1 bg-muted rounded-full px-4 py-2.5 text-sm outline-none text-foreground placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="p-2 text-primary disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Desktop modal style
  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-background rounded-xl max-w-lg w-full max-h-[80vh] flex flex-col overflow-hidden animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Comments</h3>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-full">
            <X size={20} className="text-foreground" />
          </button>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No comments yet</p>
              <p className="text-sm mt-1">Start the conversation.</p>
            </div>
          ) : (
            comments.map(comment => renderComment(comment))
          )}
        </div>

        {/* Reply indicator */}
        {replyingTo && (
          <div className="px-4 py-2 bg-muted/50 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Replying to <span className="font-semibold">@{replyingTo.user.username}</span>
            </span>
            <button onClick={() => setReplyingTo(null)}>
              <X size={16} className="text-muted-foreground" />
            </button>
          </div>
        )}

        {/* Input */}
        <form 
          onSubmit={handleSubmit}
          className="p-4 border-t border-border flex items-center gap-3"
        >
          <input
            ref={inputRef}
            type="text"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder={replyingTo ? `Reply to @${replyingTo.user.username}...` : "Add a comment..."}
            className="flex-1 bg-muted rounded-full px-4 py-2.5 text-sm outline-none text-foreground placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="p-2 text-primary disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentsModal;
