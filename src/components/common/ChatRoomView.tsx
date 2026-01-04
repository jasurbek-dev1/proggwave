import React, { useState } from 'react';
import { ArrowLeft, Camera, Smile, Mic, Phone, Video, Send } from 'lucide-react';
import { ChatRoom, Message } from '@/types';
import { Avatar } from './Avatar';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface ChatRoomViewProps {
  chatRoom: ChatRoom;
  messages: Message[];
  currentUserId: string;
  onBack: () => void;
  onSendMessage: (content: string, type?: 'text' | 'image' | 'sticker' | 'voice') => void;
  onUserClick: (userId: string) => void;
  onStartCall?: (type: 'audio' | 'video') => void;
}

export const ChatRoomView: React.FC<ChatRoomViewProps> = ({
  chatRoom,
  messages,
  currentUserId,
  onBack,
  onSendMessage,
  onUserClick,
  onStartCall,
}) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (!newMessage.trim()) return;
    onSendMessage(newMessage.trim());
    setNewMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-primary font-medium flex items-center gap-1 hover:opacity-80"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onUserClick(chatRoom.participant.id)}
          >
            <Avatar
              src={chatRoom.participant.avatar}
              alt={chatRoom.participant.displayName}
              size="sm"
              isOnline={chatRoom.participant.isOnline}
            />
            <div>
              <p className="font-semibold text-sm">{chatRoom.participant.displayName}</p>
              <p className="text-xs text-muted-foreground">
                {chatRoom.participant.isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={() => onStartCall?.('audio')}
            className="p-2 text-success hover:bg-muted rounded-full transition-colors"
          >
            <Phone size={20} />
          </button>
          <button 
            onClick={() => onStartCall?.('video')}
            className="p-2 text-primary hover:bg-muted rounded-full transition-colors"
          >
            <Video size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            <p>No messages yet.</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={cn(
                  'flex',
                  isMe ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[75%] px-4 py-2 rounded-2xl',
                    isMe
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-muted text-foreground rounded-bl-sm'
                  )}
                >
                  {msg.type === 'image' && (
                    <span className="flex items-center gap-1">📷 Photo</span>
                  )}
                  {msg.type === 'sticker' && (
                    <span className="text-2xl">{msg.content}</span>
                  )}
                  {msg.type === 'voice' && (
                    <span className="flex items-center gap-1">🎤 Voice message</span>
                  )}
                  {msg.type === 'text' && (
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  )}
                  <p className={cn(
                    'text-xs mt-1',
                    isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  )}>
                    {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSendMessage('📷', 'image')}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Camera size={22} />
          </button>
          <button
            onClick={() => onSendMessage('😄', 'sticker')}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Smile size={22} />
          </button>
          <button
            onClick={() => onSendMessage('🎤 Voice', 'voice')}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Mic size={22} />
          </button>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-muted rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />

          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className={cn(
              'p-2 rounded-full transition-colors',
              newMessage.trim()
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            )}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomView;
