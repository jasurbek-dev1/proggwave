// User types
export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  skills: string[];
  role: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  isOnline: boolean;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    github?: string;
    linkedin?: string;
  };
  
}

// Post types
export interface Post {
  id: string;
  userId: string;
  user: User;
  type: 'image' | 'video';
  mediaUrl: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  user: User;
  content: string;
  createdAt: string;
  likesCount: number;
  isLiked: boolean;
  replies?: Comment[];
  parentId?: string;
}

// Story types
export interface Story {
  id: string;
  userId: string;
  user: User;
  mediaUrl: string;
  createdAt: string;
  expiresAt: string;
  viewed: boolean;
  duration?: number;
}

export interface StoryGroup {
  user: User;
  stories: Story[];
  hasUnviewed: boolean;
}

// Chat types
export interface ChatRoom {
  id: string;
  type: 'private' | 'group';
  participant: User;
  participants?: User[];
  name?: string;
  avatar?: string;
  lastMessage: Message | null;
  unreadCount: number;
  updatedAt: string;
  isAdmin?: boolean;
}

export interface GroupChat {
  id: string;
  name: string;
  avatar: string;
  members: User[];
  admins: string[];
  createdBy: string;
  createdAt: string;
  lastMessage: Message | null;
  unreadCount: number;
}

export interface Message {
  id: string;
  chatRoomId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'sticker' | 'voice' | 'call';
  createdAt: string;
  isRead: boolean;
  replyTo?: Message;
}

// Call types
export interface Call {
  id: string;
  type: 'audio' | 'video';
  callerId: string;
  receiverId: string;
  status: 'calling' | 'ringing' | 'in_call' | 'ended' | 'missed' | 'declined';
  startedAt?: string;
  endedAt?: string;
  duration?: number;
}

// Portfolio types
export interface PortfolioItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  imageUrl?: string;
  link: string;
  technologies: string[];
  createdAt: string;
}

// Notification types
export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  fromUser: User;
  postId?: string;
  content?: string;
  createdAt: string;
  isRead: boolean;
}

// Job/Announcement types
export interface JobPost {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'remote' | 'onsite' | 'hybrid';
  description: string;
  requirements: string[];
  salary?: string;
  createdAt: string;
}

// Arena/Battle types
export interface Player {
  id: string;
  username: string;
  rating: number;
  wins: number;
  losses: number;
  avatar: string;
}

export interface Battle {
  id: string;
  player1: Player;
  player2: Player;
  status: 'waiting' | 'playing' | 'finished';
  challenge: string;
  timeLimit: number;
  winner?: string;
}

// Code Arena types
export interface ArenaProblem {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  examples: { input: string; output: string }[];
  constraints: string[];
  starterCode: string;
  testCases: { input: string; expected: string }[];
  timeLimit: number;
  memoryLimit: number;
}

export interface ArenaSubmission {
  id: string;
  odudlemId: string;
  userId: string;
  code: string;
  language: string;
  status: 'pending' | 'running' | 'accepted' | 'wrong_answer' | 'time_limit' | 'runtime_error';
  executionTime?: number;
  memory?: number;
  submittedAt: string;
}

export interface ArenaMatch {
  id: string;
  problem: ArenaProblem;
  players: Player[];
  status: 'waiting' | 'countdown' | 'in_progress' | 'finished';
  startedAt?: string;
  endedAt?: string;
  winner?: string;
  timeLimit: number;
}

// Settings types
export interface UserSettings {
  notifications: {
    likes: boolean;
    comments: boolean;
    follows: boolean;
    messages: boolean;
    mentions: boolean;
  };
  privacy: {
    privateAccount: boolean;
    showOnlineStatus: boolean;
    allowMessages: 'everyone' | 'followers' | 'nobody';
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
  security: {
    twoFactorEnabled: boolean;
    loginAlerts: boolean;
  };
  connectedAccounts: {
    github?: string;
    google?: string;
    telegram?: string;
  };
}
