import { User } from '@/types';
import { currentUser } from '@/data/mockData';

// Auth user type from registration
export interface AuthUser {
  id: string;
  username: string;
  role: 'job_seeker' | 'employer';
  email?: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  skills?: string[];
  joined_group: boolean;
  added_friends: boolean;
  created_at: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  role: 'job_seeker' | 'employer';
  email?: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  skills?: string[];
  joined_group: boolean;
  added_friends: boolean;
}

export interface AuthResponse {
  user: AuthUser;
  appUser: User;
  token: string;
}

// Simulated token storage (in real app, this would be JWT validation)
const validTokens = new Map<string, AuthUser>();

// Helper to validate username format
export const validateUsername = (username: string): boolean => {
  return username.endsWith('.dev') || username.endsWith('_dev');
};

// Helper to hash password (mock - in production use proper hashing on backend)
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Generate mock token
const generateToken = (): string => {
  return 'mock_token_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Convert AuthUser to App User
const toAppUser = (authUser: AuthUser): User => {
  return {
    id: authUser.id,
    username: authUser.username,
    displayName: authUser.username.replace(/[._]dev$/, ''),
    avatar: authUser.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    bio: authUser.bio || '',
    skills: authUser.skills || [],
    role: authUser.role,
    postsCount: 0,
    followersCount: 0,
    followingCount: 0,
    isFollowing: false,
    isOnline: true,
    socialLinks: {},
  };
};

// Simulated user database
let registeredUsers: (AuthUser & { password_hash: string })[] = [];

export const authService = {
  // Login with username and password
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return new Promise(async (resolve, reject) => {
      setTimeout(async () => {
        try {
          // Validate username format
          if (!validateUsername(credentials.username)) {
            reject(new Error('Username .dev yoki _dev bilan tugashi kerak'));
            return;
          }

          if (!credentials.password || credentials.password.length < 6) {
            reject(new Error('Parol kamida 6 ta belgidan iborat bo\'lishi kerak'));
            return;
          }

          const passwordHash = await hashPassword(credentials.password);
          
          // Check registered users first
          const registeredUser = registeredUsers.find(
            u => u.username === credentials.username && u.password_hash === passwordHash
          );

          if (registeredUser) {
            const token = generateToken();
            const { password_hash: _, ...authUser } = registeredUser;
            validTokens.set(token, authUser);
            
            resolve({
              user: authUser,
              appUser: toAppUser(authUser),
              token,
            });
            return;
          }

          // Mock login for demo (any .dev/_dev username with 6+ char password works)
          const mockAuthUser: AuthUser = {
            id: 'user_' + Math.random().toString(36).substring(2),
            username: credentials.username,
            role: 'job_seeker',
            email: `${credentials.username.replace(/[._]dev$/, '')}@example.com`,
            bio: 'Developer enthusiast',
            location: 'Tashkent, UZ',
            skills: ['React', 'TypeScript', 'Node.js'],
            joined_group: true,
            added_friends: false,
            created_at: new Date().toISOString(),
          };

          const token = generateToken();
          validTokens.set(token, mockAuthUser);

          resolve({
            user: mockAuthUser,
            appUser: toAppUser(mockAuthUser),
            token,
          });
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  },

  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    return new Promise(async (resolve, reject) => {
      setTimeout(async () => {
        try {
          // Validation
          if (!validateUsername(data.username)) {
            reject(new Error('Username .dev yoki _dev bilan tugashi kerak'));
            return;
          }

          if (!data.password || data.password.length < 6) {
            reject(new Error('Parol kamida 6 ta belgidan iborat bo\'lishi kerak'));
            return;
          }

          if (!data.email && !data.phone) {
            reject(new Error('Email yoki telefon raqami kerak'));
            return;
          }

          if (!data.joined_group) {
            reject(new Error('Jamoa guruhiga qo\'shilish majburiy'));
            return;
          }

          // Check if username exists
          if (registeredUsers.some(u => u.username === data.username)) {
            reject(new Error('Bu username allaqachon band'));
            return;
          }

          const passwordHash = await hashPassword(data.password);
          
          const newUser: AuthUser & { password_hash: string } = {
            id: 'user_' + Math.random().toString(36).substring(2),
            username: data.username,
            password_hash: passwordHash,
            role: data.role,
            email: data.email,
            phone: data.phone,
            avatar_url: data.avatar_url,
            bio: data.bio,
            location: data.location,
            skills: data.skills,
            joined_group: data.joined_group,
            added_friends: data.added_friends,
            created_at: new Date().toISOString(),
          };

          registeredUsers.push(newUser);
          
          const token = generateToken();
          const { password_hash: _, ...authUser } = newUser;
          validTokens.set(token, authUser);

          resolve({
            user: authUser,
            appUser: toAppUser(authUser),
            token,
          });
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  },

  // Get current user from token
  getCurrentUser: async (token: string): Promise<User | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const authUser = validTokens.get(token);
        if (authUser) {
          resolve(toAppUser(authUser));
        } else {
          resolve(null);
        }
      }, 100);
    });
  },

  // Logout (invalidate token)
  logout: async (token: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        validTokens.delete(token);
        resolve();
      }, 100);
    });
  },

  // Update profile
  updateProfile: async (userId: string, updates: Partial<User>): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // In real app, update database
        // For now, return merged user
        const mockUser: User = {
          ...currentUser,
          id: userId,
          ...updates,
        };
        resolve(mockUser);
      }, 300);
    });
  },

  // Check if token is valid
  isTokenValid: (token: string): boolean => {
    return validTokens.has(token);
  },
};
