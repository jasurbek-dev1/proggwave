import React, { useState, useEffect } from 'react';
import {
  Settings,
  Share2,
  X,
  Upload,
  Moon,
  Sun,
  Check,
  Briefcase,
  Image as ImageIcon,
  Instagram,
  Facebook,
  Github,
  Linkedin,
  UserPlus,
  UserMinus,
} from 'lucide-react';
import { User, Post, PortfolioItem } from '@/types';
import { Avatar } from './Avatar';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

interface ProfileViewProps {
  user: User;
  posts: Post[];
  portfolioItems: PortfolioItem[];
  isOwnProfile: boolean;
  onFollow?: () => void;
  onUnfollow?: () => void;
  onEditProfile?: (updates: Partial<User>) => void;
  onPostClick: (post: Post) => void;
  onBack?: () => void;
  onSettingsClick?: () => void;
}

type TabId = 'posts' | 'portfolio';

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  posts,
  portfolioItems,
  isOwnProfile,
  onFollow,
  onUnfollow,
  onEditProfile,
  onPostClick,
  onBack,
  onSettingsClick,
}) => {
  const [activeTab, setActiveTab] = useState<TabId>('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { theme, isDark, toggleTheme } = useTheme();

  const [tempProfile, setTempProfile] = useState({
    displayName: user.displayName,
    username: user.username,
    bio: user.bio,
    skills: user.skills,
    avatar: user.avatar,
  });

  useEffect(() => {
    setTempProfile({
      displayName: user.displayName,
      username: user.username,
      bio: user.bio,
      skills: user.skills,
      avatar: user.avatar,
    });
  }, [user]);

  const handleSaveProfile = () => {
    if (onEditProfile) {
      onEditProfile(tempProfile);
    }
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setTempProfile({ ...tempProfile, avatar: url });
    }
  };

  const handleShare = async () => {
    const profileLink = `https://devhub.app/${user.username}`;
    if (navigator.share) {
      await navigator.share({
        title: `${user.displayName} on DevHub`,
        text: user.bio,
        url: profileLink,
      });
    } else {
      await navigator.clipboard.writeText(profileLink);
      alert('Profile link copied!');
    }
  };

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'posts', label: 'Posts', icon: <ImageIcon size={20} /> },
    { id: 'portfolio', label: 'Portfolio', icon: <Briefcase size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto py-6 px-4 relative">
        {/* Back button for other profiles */}
        {onBack && (
          <button
            onClick={onBack}
            className="absolute top-6 left-4 text-muted-foreground hover:text-foreground"
          >
            ← Back
          </button>
        )}

        {/* Settings button */}
        {isOwnProfile && (
          <button
            onClick={() => onSettingsClick ? onSettingsClick() : setIsSettingsOpen(true)}
            className="absolute top-6 right-4 text-muted-foreground hover:text-foreground"
          >
            <Settings size={22} />
          </button>
        )}

        {/* Profile Header */}
        <div className="flex items-center gap-4 mt-8">
          <div className="gradient-border rounded-lg p-[2px]">
            <img
              src={user.avatar}
              alt={user.displayName}
              className="w-24 h-24 object-cover rounded-lg border-2 border-background"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{user.displayName}</h2>
            <p className="text-muted-foreground text-sm">@{user.username}</p>
            <p className="text-sm mt-1">{user.bio}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {user.skills.slice(0, 4).map((skill, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-muted px-2 py-0.5 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-around text-center mt-6 py-4 border-y border-border">
          <div>
            <p className="font-semibold">{user.postsCount}</p>
            <p className="text-muted-foreground text-sm">Posts</p>
          </div>
          <div>
            <p className="font-semibold">{user.followersCount.toLocaleString()}</p>
            <p className="text-muted-foreground text-sm">Followers</p>
          </div>
          <div>
            <p className="font-semibold">{user.followingCount}</p>
            <p className="text-muted-foreground text-sm">Following</p>
          </div>
        </div>

        {/* Social Links */}
        {user.socialLinks && (
          <div className="flex justify-center gap-4 mt-4">
            {user.socialLinks.instagram && (
              <a
                href={user.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <Instagram size={20} className="text-pink-500" />
              </a>
            )}
            {user.socialLinks.facebook && (
              <a
                href={user.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <Facebook size={20} className="text-blue-600" />
              </a>
            )}
            {user.socialLinks.github && (
              <a
                href={user.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <Github size={20} />
              </a>
            )}
            {user.socialLinks.linkedin && (
              <a
                href={user.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <Linkedin size={20} className="text-blue-700" />
              </a>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-4">
          {isOwnProfile ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition"
              >
                Edit Profile
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-muted rounded-lg font-medium flex items-center gap-2 hover:bg-muted/80 transition"
              >
                <Share2 size={16} /> Share
              </button>
            </>
          ) : (
            <>
              <button
                onClick={user.isFollowing ? onUnfollow : onFollow}
                className={cn(
                  'px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition',
                  user.isFollowing
                    ? 'bg-muted hover:bg-destructive hover:text-destructive-foreground'
                    : 'bg-primary text-primary-foreground hover:opacity-90'
                )}
              >
                {user.isFollowing ? (
                  <>
                    <UserMinus size={16} /> Unfollow
                  </>
                ) : (
                  <>
                    <UserPlus size={16} /> Follow
                  </>
                )}
              </button>
            </>
          )}
        </div>

        {/* Tabs */}
        <div className="mt-6 border-t border-border pt-4">
          <div className="flex justify-around">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex flex-col items-center gap-1 px-4 py-2 transition-colors',
                  activeTab === tab.id
                    ? 'text-foreground border-b-2 border-primary'
                    : 'text-muted-foreground'
                )}
              >
                {tab.icon}
                <span className="text-xs">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Posts Grid */}
          {activeTab === 'posts' && (
            <div className="grid grid-cols-3 gap-1 mt-4">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div
                    key={post.id}
                    className="aspect-square bg-muted cursor-pointer hover:opacity-90 transition"
                    onClick={() => onPostClick(post)}
                  >
                    <img
                      src={post.mediaUrl}
                      alt={post.caption}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-10 text-muted-foreground">
                  No posts yet
                </div>
              )}
            </div>
          )}

          {/* Portfolio */}
          {activeTab === 'portfolio' && (
            <div className="mt-4 space-y-3">
              {portfolioItems.length > 0 ? (
                portfolioItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-card border border-border rounded-lg p-4 card-hover"
                  >
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-muted px-2 py-0.5 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-sm mt-2 inline-block hover:underline"
                      >
                        View Project →
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <p>No portfolio items yet</p>
                  {isOwnProfile && (
                    <button className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition">
                      + Add Project
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-card w-full max-w-sm rounded-2xl p-5 shadow-xl animate-scale-in">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
            >
              <X size={22} />
            </button>

            <h2 className="text-lg font-semibold text-center mb-5">Edit Profile</h2>

            <div className="flex flex-col items-center">
              <label className="relative cursor-pointer">
                <img
                  src={tempProfile.avatar}
                  alt="Profile"
                  className="w-24 h-24 rounded-lg object-cover border mb-2"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="absolute bottom-1 right-1 bg-primary text-primary-foreground p-1 rounded-full">
                  <Upload size={14} />
                </div>
              </label>

              <input
                type="text"
                placeholder="Display Name"
                value={tempProfile.displayName}
                onChange={(e) =>
                  setTempProfile({ ...tempProfile, displayName: e.target.value })
                }
                className="w-full border border-border bg-background rounded-lg px-3 py-2 text-sm mt-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />

              <input
                type="text"
                placeholder="Username"
                value={tempProfile.username}
                onChange={(e) =>
                  setTempProfile({ ...tempProfile, username: e.target.value })
                }
                className="w-full border border-border bg-background rounded-lg px-3 py-2 text-sm mt-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />

              <input
                type="text"
                placeholder="Bio"
                value={tempProfile.bio}
                onChange={(e) =>
                  setTempProfile({ ...tempProfile, bio: e.target.value })
                }
                className="w-full border border-border bg-background rounded-lg px-3 py-2 text-sm mt-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />

              <input
                type="text"
                placeholder="Skills (comma separated)"
                value={tempProfile.skills.join(', ')}
                onChange={(e) =>
                  setTempProfile({
                    ...tempProfile,
                    skills: e.target.value.split(',').map((s) => s.trim()),
                  })
                }
                className="w-full border border-border bg-background rounded-lg px-3 py-2 text-sm mt-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />

              <button
                onClick={handleSaveProfile}
                className="w-full mt-4 bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-card w-full max-w-sm rounded-2xl p-5 shadow-xl animate-scale-in relative">
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
            >
              <X size={22} />
            </button>

            <h2 className="text-lg font-semibold text-center mb-5">Settings ⚙️</h2>

            {/* Theme Toggle */}
            <div className="flex items-center justify-between mb-4 p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Theme</span>
              <button
                onClick={toggleTheme}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full transition',
                  isDark
                    ? 'bg-background text-foreground'
                    : 'bg-primary text-primary-foreground'
                )}
              >
                {isDark ? <Moon size={16} /> : <Sun size={16} />}
                <span className="text-sm">{isDark ? 'Dark' : 'Light'}</span>
              </button>
            </div>

            {/* Creators */}
            <div className="bg-muted p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-sm mb-1">About DevHub</h3>
              <p className="text-xs text-muted-foreground">
                A social platform for developers to connect, share, and grow together 🚀
              </p>
            </div>

            <button
              onClick={() => setIsSettingsOpen(false)}
              className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 transition flex items-center justify-center gap-1"
            >
              <Check size={16} /> Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
