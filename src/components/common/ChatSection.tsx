import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Users,
  Bookmark,
  EyeOff,
  Plus,
  Search,
  X,
  ArrowLeft,
  Phone,
  Video,
} from 'lucide-react';
import { ChatRoom, GroupChat, User, Call } from '@/types';
import { Avatar } from './Avatar';
import { ChatRoomView } from './ChatRoomView';
import { CallModal } from './CallModal';
import { useChat, useChatRoom, useCreateChat } from '@/hooks/useChat';
import { useCall } from '@/hooks/useCall';
import { groupService } from '@/services/group.service';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { toast } from '@/hooks/use-toast';

type ChatTab = 'chats' | 'groups' | 'saved' | 'hidden';

interface ChatSectionProps {
  currentUserId: string;
  onUserClick: (userId: string) => void;
}

export const ChatSection: React.FC<ChatSectionProps> = ({
  currentUserId,
  onUserClick,
}) => {
  const [activeTab, setActiveTab] = useState<ChatTab>('chats');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groups, setGroups] = useState<GroupChat[]>([]);
  const [savedMessages, setSavedMessages] = useState<ChatRoom[]>([]);
  const [hiddenChats, setHiddenChats] = useState<ChatRoom[]>([]);

  const { chatRooms, isLoading, searchChats } = useChat();
  const { messages, chatRoom, sendMessage } = useChatRoom(activeChatId);
  const { 
    activeCall, 
    callParticipant, 
    initiateCall, 
    acceptCall, 
    declineCall, 
    endCall 
  } = useCall();

  // Load groups
  useEffect(() => {
    groupService.getGroups().then(setGroups);
  }, []);

  // Filter chats based on search
  useEffect(() => {
    if (searchQuery.trim()) {
      searchChats(searchQuery);
    }
  }, [searchQuery, searchChats]);

  const handleChatClick = (roomId: string) => {
    setActiveChatId(roomId);
  };

  const handleStartCall = async (participant: User, type: 'audio' | 'video') => {
    await initiateCall(participant, type);
  };

  const tabs = [
    { id: 'chats' as const, icon: MessageCircle, label: 'Chats', count: chatRooms.filter(r => r.unreadCount > 0).length },
    { id: 'groups' as const, icon: Users, label: 'Groups', count: groups.length },
    { id: 'saved' as const, icon: Bookmark, label: 'Saved', count: 0 },
    { id: 'hidden' as const, icon: EyeOff, label: 'Hidden', count: hiddenChats.length },
  ];

  // Chat room view
  if (activeChatId && chatRoom) {
    return (
      <>
        <ChatRoomView
          chatRoom={chatRoom}
          messages={messages}
          currentUserId={currentUserId}
          onBack={() => setActiveChatId(null)}
          onSendMessage={sendMessage}
          onUserClick={onUserClick}
          onStartCall={(type) => handleStartCall(chatRoom.participant, type)}
        />
        {activeCall && callParticipant && (
          <CallModal
            call={activeCall}
            participant={callParticipant}
            isOutgoing={activeCall.callerId === currentUserId}
            onAccept={acceptCall}
            onDecline={declineCall}
            onEnd={endCall}
          />
        )}
      </>
    );
  }

  const renderChatsList = () => (
    <div className="space-y-1">
      {isLoading ? (
        // Skeleton loaders
        Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              <div className="h-3 w-48 bg-muted rounded animate-pulse" />
            </div>
          </div>
        ))
      ) : chatRooms.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <MessageCircle size={48} className="mx-auto mb-3 opacity-50" />
          <p>No conversations yet</p>
          <p className="text-sm">Start chatting with someone!</p>
        </div>
      ) : (
        chatRooms.map((room) => (
          <button
            key={room.id}
            onClick={() => handleChatClick(room.id)}
            className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-xl transition-colors text-left"
          >
            <Avatar
              src={room.participant.avatar}
              alt={room.participant.displayName}
              size="md"
              isOnline={room.participant.isOnline}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-foreground truncate">
                  {room.participant.displayName}
                </p>
                {room.lastMessage && (
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(room.lastMessage.createdAt), { addSuffix: false })}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground truncate">
                  {room.lastMessage?.content || 'No messages yet'}
                </p>
                {room.unreadCount > 0 && (
                  <span className="ml-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center flex-shrink-0">
                    {room.unreadCount > 9 ? '9+' : room.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))
      )}
    </div>
  );

  const renderGroupsList = () => (
    <div className="space-y-1">
      <button
        onClick={() => setShowCreateGroup(true)}
        className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-xl transition-colors text-left border border-dashed border-border"
      >
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Plus size={24} className="text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-foreground">Create Group</p>
          <p className="text-sm text-muted-foreground">Start a new group chat</p>
        </div>
      </button>

      {groups.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <Users size={48} className="mx-auto mb-3 opacity-50" />
          <p>No groups yet</p>
          <p className="text-sm">Create a group to get started!</p>
        </div>
      ) : (
        groups.map((group) => (
          <button
            key={group.id}
            onClick={() => setActiveGroupId(group.id)}
            className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-xl transition-colors text-left"
          >
            <Avatar
              src={group.avatar}
              alt={group.name}
              size="md"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-foreground truncate">{group.name}</p>
                {group.lastMessage && (
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(group.lastMessage.createdAt), { addSuffix: false })}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground truncate">
                  {group.members.length} members
                </p>
                {group.unreadCount > 0 && (
                  <span className="ml-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center flex-shrink-0">
                    {group.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))
      )}
    </div>
  );

  const renderSavedMessages = () => (
    <div className="text-center py-10 text-muted-foreground">
      <Bookmark size={48} className="mx-auto mb-3 opacity-50" />
      <p>Saved Messages</p>
      <p className="text-sm">Your saved messages will appear here</p>
    </div>
  );

  const renderHiddenChats = () => (
    <div className="text-center py-10 text-muted-foreground">
      <EyeOff size={48} className="mx-auto mb-3 opacity-50" />
      <p>Hidden Chats</p>
      <p className="text-sm">Chats you've hidden will appear here</p>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'chats':
        return renderChatsList();
      case 'groups':
        return renderGroupsList();
      case 'saved':
        return renderSavedMessages();
      case 'hidden':
        return renderHiddenChats();
      default:
        return null;
    }
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border px-4 py-3">
        <h1 className="text-xl font-bold text-foreground mb-3">Messages</h1>
        
        {/* Search */}
        <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-2.5">
          <Search size={18} className="text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-muted-foreground">
              <X size={16} />
            </button>
          )}
        </div>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-border px-2 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2',
              activeTab === tab.id
                ? 'text-primary border-primary'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            )}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className="w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                {tab.count > 9 ? '9+' : tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        {renderContent()}
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <CreateGroupModal
          onClose={() => setShowCreateGroup(false)}
          onCreate={(name, members) => {
            groupService.createGroup(name, members).then((group) => {
              setGroups((prev) => [group, ...prev]);
              setShowCreateGroup(false);
              toast({
                title: 'Group Created',
                description: `${name} has been created successfully.`,
              });
            });
          }}
        />
      )}

      {/* Call Modal */}
      {activeCall && callParticipant && (
        <CallModal
          call={activeCall}
          participant={callParticipant}
          isOutgoing={activeCall.callerId === currentUserId}
          onAccept={acceptCall}
          onDecline={declineCall}
          onEnd={endCall}
        />
      )}
    </div>
  );
};

// Create Group Modal Component
interface CreateGroupModalProps {
  onClose: () => void;
  onCreate: (name: string, members: string[]) => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ onClose, onCreate }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a group name.',
        variant: 'destructive',
      });
      return;
    }
    onCreate(groupName, selectedMembers);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-card rounded-2xl w-full max-w-md p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Create Group</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name..."
              className="w-full px-4 py-3 bg-muted rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Group Avatar (optional)
            </label>
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
              <Plus size={24} className="text-muted-foreground" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Add Members
            </label>
            <p className="text-sm text-muted-foreground">
              You can add members after creating the group.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            Create Group
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatSection;
