import React, { useState, useEffect } from 'react';
import { Post, User } from '@/types';
import { usePosts, useStories } from '@/hooks/usePosts';
import { useAuth } from '@/hooks/useAuth';
import { userService } from '@/services/user.service';
import { mockPortfolioItems } from '@/data/mockData';
import { BottomNav, TabId } from '@/components/common/BottomNav';
import Navbar from '@/components/common/Navbar';
import DevStories from '@/components/common/DevStories';
import PostList from '@/components/common/PostList';
import { ImageViewer } from '@/components/common/ImageViewer';
import { CreatePostModal, AddStoryModal } from '@/components/common/CreatePostModal';
import { ProfileView } from '@/components/common/ProfileView';
import { ChatSection } from '@/components/common/ChatSection';
import { SettingsPage } from '@/components/common/SettingsPage';
import ArenaHub from '@/components/common/ArenaHub';
import AnnouncementsPage from '@/components/common/AnnouncementsPage';
import { useChat } from '@/hooks/useChat';
import { Search, X, ArrowLeft } from 'lucide-react';
import { Avatar } from '@/components/common/Avatar';
import { useTheme } from '@/hooks/useTheme';
import { presenceService } from '@/services/presence.service';

// New Friends/Likes modal types
interface Friend {
  id: number;
  name: string;
  time: string;
  avatar: string;
}

interface LikeNotification {
  id: number;
  user: string;
  action: 'like' | 'comment';
  content?: string;
  time: string;
  image: string;
}

const Index: React.FC = () => {
  const { user, logout } = useAuth();
  const { posts, likePost, createPost } = usePosts();
  const { stories, addStory } = useStories();
  const { chatRooms } = useChat();

  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showAddStory, setShowAddStory] = useState(false);
  const [viewingProfile, setViewingProfile] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  
  // Settings and Arena states
  const [showSettings, setShowSettings] = useState(false);
  const [showArena, setShowArena] = useState(false);
  
  // Notification states
  const [newFriendsCount, setNewFriendsCount] = useState(3);
  const [likesCount, setLikesCount] = useState(5);
  const [openTab, setOpenTab] = useState<'friends' | 'likes' | null>(null);
  const [showElonlar, setShowElonlar] = useState(false);

  // Mock data for notifications
  const friends: Friend[] = [
    { id: 1, name: "Bekhruz", time: "2 daqiqa", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" },
    { id: 2, name: "Shahzod", time: "5 daqiqa", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face" },
    { id: 3, name: "Alisher", time: "10 daqiqa", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" },
  ];

  const likes: LikeNotification[] = [
    { id: 1, user: "Jamshid", action: 'like', time: "1 daqiqa", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=40&h=40&fit=crop" },
    { id: 2, user: "Lay", action: 'comment', content: "Zo'r video!", time: "3 daqiqa", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face" },
    { id: 3, user: "Mike", action: 'like', time: "5 daqiqa", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" },
  ];

  // Search users
  useEffect(() => {
    if (searchQuery.trim() && activeTab === 'search') {
      userService.searchUsers(searchQuery).then(setSearchResults);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, activeTab]);

  const handleTabChange = (tab: TabId) => {
    if (tab === 'create') {
      setShowCreatePost(true);
    } else {
      setActiveTab(tab);
      setViewingProfile(null);
      setShowSettings(false);
      setShowArena(false);
    }
  };

  const handleUserClick = async (userId: string) => {
    const profile = await userService.getUserById(userId);
    if (profile) {
      setViewingProfile(profile);
      setActiveTab('profile');
    }
  };

  const handleFollow = async () => {
    if (viewingProfile) {
      await userService.followUser(viewingProfile.id);
      setViewingProfile({ ...viewingProfile, isFollowing: true, followersCount: viewingProfile.followersCount + 1 });
    }
  };

  const handleUnfollow = async () => {
    if (viewingProfile) {
      await userService.unfollowUser(viewingProfile.id);
      setViewingProfile({ ...viewingProfile, isFollowing: false, followersCount: viewingProfile.followersCount - 1 });
    }
  };

  const handleNewFriendsClick = () => {
    setOpenTab('friends');
    setNewFriendsCount(0);
  };

  const handleLikesClick = () => {
    setOpenTab('likes');
    setLikesCount(0);
  };

  const closeTab = () => setOpenTab(null);

  const handleLogout = async () => {
    await logout();
  };

  const handleArenaClick = () => {
    setShowArena(true);
    setActiveTab('home');
  };

  // Settings page
  if (showSettings) {
    return (
      <div className="min-h-screen bg-background">
        <SettingsPage 
          onBack={() => setShowSettings(false)} 
          onLogout={handleLogout}
        />
      </div>
    );
  }

  // Code Arena page
  if (showArena) {
    return (
      <div className="min-h-screen bg-background">
        <ArenaHub onBack={() => setShowArena(false)} onUserClick={handleUserClick} />
      </div>
    );
  }

  // Announcements page
  if (showElonlar) {
    return (
      <div className="min-h-screen bg-background">
        <AnnouncementsPage onBack={() => setShowElonlar(false)} onUserClick={handleUserClick} />
      </div>
    );
  }

  // Render content based on active tab
  const renderContent = () => {
    // Elonlar page
    if (showElonlar) {
      return (
        <div className="pb-20">
          <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border px-4 py-3 flex items-center gap-3">
            <button onClick={() => setShowElonlar(false)} className="p-2 hover:bg-muted rounded-full">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">Elonlar</h1>
          </header>
          <div className="p-4 text-center text-muted-foreground">
            <p>Elonlar sahifasi tez orada...</p>
          </div>
        </div>
      );
    }

    // Viewing another user's profile
    if (viewingProfile && viewingProfile.id !== user?.id) {
      return (
        <ProfileView
          user={viewingProfile}
          posts={posts.filter(p => p.userId === viewingProfile.id)}
          portfolioItems={[]}
          isOwnProfile={false}
          onFollow={handleFollow}
          onUnfollow={handleUnfollow}
          onPostClick={setSelectedPost}
          onBack={() => { setViewingProfile(null); setActiveTab('home'); }}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <div className="pb-20">
            <Navbar
              newFriendsCount={newFriendsCount}
              likesCount={likesCount}
              onNewFriendsClick={handleNewFriendsClick}
              onLikesClick={handleLikesClick}
              onTrophyClick={handleArenaClick}
            />
            <DevStories />
            <PostList 
              onUserClick={(username) => handleUserClick(username)}
            />

            {/* New Friends Modal */}
            {openTab === 'friends' && (
              <div className="fixed inset-0 bg-black/40 flex justify-center items-start pt-24 z-50 animate-fade-in" onClick={closeTab}>
                <div className="bg-card rounded-xl shadow-xl p-4 w-[90%] max-w-sm animate-slide-up" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg text-foreground">Yangi do'stlar</h3>
                    <button onClick={closeTab} className="text-muted-foreground hover:text-foreground">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {friends.map((friend) => (
                      <div key={friend.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
                        <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{friend.name}</p>
                          <p className="text-xs text-muted-foreground">{friend.time} oldin</p>
                        </div>
                        <button className="bg-primary text-primary-foreground px-3 py-1 rounded-lg text-sm">
                          Follow
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Likes Modal */}
            {openTab === 'likes' && (
              <div className="fixed inset-0 bg-black/40 flex justify-center items-start pt-24 z-50 animate-fade-in" onClick={closeTab}>
                <div className="bg-card rounded-xl shadow-xl p-4 w-[90%] max-w-sm animate-slide-up" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg text-foreground">Faollik</h3>
                    <button onClick={closeTab} className="text-muted-foreground hover:text-foreground">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {likes.map((like) => (
                      <div key={like.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted">
                        <img src={like.image} alt={like.user} className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1">
                          <p className="text-foreground">
                            <span className="font-medium">{like.user}</span>
                            {like.action === 'like' ? ' postingizni yoqtirdi ❤️' : ` izoh qoldirdi: "${like.content}"`}
                          </p>
                          <p className="text-xs text-muted-foreground">{like.time} oldin</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'search':
        return (
          <div className="p-4 pb-20">
            <div className="flex items-center bg-muted rounded-lg px-4 py-3 mb-4">
              <Search size={20} className="text-muted-foreground mr-2" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent flex-1 outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
            {searchResults.map((u) => (
              <div key={u.id} onClick={() => handleUserClick(u.id)} className="flex items-center gap-3 p-3 hover:bg-muted rounded-lg cursor-pointer">
                <Avatar src={u.avatar} size="md" isOnline={u.isOnline} />
                <div>
                  <p className="font-semibold text-foreground">{u.displayName}</p>
                  <p className="text-sm text-muted-foreground">@{u.username}</p>
                </div>
              </div>
            ))}
          </div>
        );

      case 'chat':
        return (
          <ChatSection 
            currentUserId={user?.id || '0'} 
            onUserClick={handleUserClick} 
          />
        );

      case 'profile':
        return user ? (
          <ProfileView
            user={user}
            posts={posts.filter(p => p.userId === user.id)}
            portfolioItems={mockPortfolioItems}
            isOwnProfile={true}
            onPostClick={setSelectedPost}
            onSettingsClick={() => setShowSettings(true)}
          />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderContent()}
      <BottomNav 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        onRepostClick={() => setShowElonlar(true)}
        unreadMessages={chatRooms.reduce((acc, r) => acc + r.unreadCount, 0)} 
      />

      {/* Modals */}
      {selectedPost && <ImageViewer post={selectedPost} onClose={() => setSelectedPost(null)} onLike={likePost} onUserClick={handleUserClick} />}
      <CreatePostModal isOpen={showCreatePost} onClose={() => setShowCreatePost(false)} onSubmit={createPost} />
      <AddStoryModal isOpen={showAddStory} onClose={() => setShowAddStory(false)} onSubmit={addStory} />
    </div>
  );
};

export default Index;
