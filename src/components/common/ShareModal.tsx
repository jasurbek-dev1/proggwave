import React, { useState } from 'react';
import { X, Link2, MessageCircle, Send, Check, Facebook, Twitter } from 'lucide-react';
import { Post, ChatRoom } from '@/types';
import { Avatar } from './Avatar';
import { cn } from '@/lib/utils';
import { useChat } from '@/hooks/useChat';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface ShareModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  post,
  isOpen,
  onClose,
}) => {
  const { chatRooms } = useChat();
  const [copied, setCopied] = useState(false);
  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const isMobile = useIsMobile();

  const postUrl = `${window.location.origin}/post/${post.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post by ${post.user.username}`,
          text: post.caption,
          url: postUrl,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      handleCopyLink();
    }
  };

  const toggleChatSelection = (chatId: string) => {
    setSelectedChats(prev => 
      prev.includes(chatId) 
        ? prev.filter(id => id !== chatId)
        : [...prev, chatId]
    );
  };

  const handleShareToChats = async () => {
    if (selectedChats.length === 0) return;
    
    setSending(true);
    // Mock sending - in real app would use chat service
    await new Promise(resolve => setTimeout(resolve, 500));
    setSending(false);
    toast.success(`Shared to ${selectedChats.length} chat${selectedChats.length > 1 ? 's' : ''}`);
    onClose();
  };

  const handleExternalShare = (platform: string) => {
    let url = '';
    const text = encodeURIComponent(post.caption || 'Check out this post!');
    const shareUrl = encodeURIComponent(postUrl);

    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
        break;
      case 'telegram':
        url = `https://t.me/share/url?url=${shareUrl}&text=${text}`;
        break;
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  if (!isOpen) return null;

  const content = (
    <>
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Share</h3>
        <button onClick={onClose} className="p-1 hover:bg-muted rounded-full">
          <X size={20} className="text-foreground" />
        </button>
      </div>

      {/* Quick actions */}
      <div className="p-4 border-b border-border">
        <div className="flex justify-around">
          <button
            onClick={handleCopyLink}
            className="flex flex-col items-center gap-2"
          >
            <div className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center transition-colors",
              copied ? "bg-green-500/20 text-green-500" : "bg-muted text-foreground"
            )}>
              {copied ? <Check size={24} /> : <Link2 size={24} />}
            </div>
            <span className="text-xs text-muted-foreground">
              {copied ? 'Copied!' : 'Copy link'}
            </span>
          </button>

          {navigator.share && (
            <button
              onClick={handleNativeShare}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-foreground">
                <Send size={24} />
              </div>
              <span className="text-xs text-muted-foreground">Share</span>
            </button>
          )}

          <button
            onClick={() => handleExternalShare('twitter')}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-14 h-14 rounded-full bg-[#1DA1F2]/20 flex items-center justify-center text-[#1DA1F2]">
              <Twitter size={24} />
            </div>
            <span className="text-xs text-muted-foreground">Twitter</span>
          </button>

          <button
            onClick={() => handleExternalShare('telegram')}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-14 h-14 rounded-full bg-[#0088cc]/20 flex items-center justify-center text-[#0088cc]">
              <Send size={24} />
            </div>
            <span className="text-xs text-muted-foreground">Telegram</span>
          </button>
        </div>
      </div>

      {/* Share to chats */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-3">
          <h4 className="text-sm font-semibold text-muted-foreground mb-3">Send in chat</h4>
          <div className="space-y-2">
            {chatRooms.map(room => (
              <button
                key={room.id}
                onClick={() => toggleChatSelection(room.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-colors",
                  selectedChats.includes(room.id) 
                    ? "bg-primary/10" 
                    : "hover:bg-muted"
                )}
              >
                <Avatar src={room.participant.avatar} size="md" />
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">{room.participant.displayName}</p>
                  <p className="text-sm text-muted-foreground">@{room.participant.username}</p>
                </div>
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                  selectedChats.includes(room.id)
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted-foreground"
                )}>
                  {selectedChats.includes(room.id) && <Check size={14} />}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Send button */}
      {selectedChats.length > 0 && (
        <div className="p-4 border-t border-border safe-area-bottom">
          <button
            onClick={handleShareToChats}
            disabled={sending}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            {sending ? 'Sending...' : `Send to ${selectedChats.length} chat${selectedChats.length > 1 ? 's' : ''}`}
          </button>
        </div>
      )}
    </>
  );

  // Mobile bottom sheet
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
          <div className="flex justify-center py-3">
            <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
          </div>
          {content}
        </div>
      </div>
    );
  }

  // Desktop modal
  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-background rounded-xl max-w-md w-full max-h-[80vh] flex flex-col overflow-hidden animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {content}
      </div>
    </div>
  );
};

export default ShareModal;
