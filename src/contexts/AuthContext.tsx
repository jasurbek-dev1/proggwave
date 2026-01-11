import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from '@/types';
import { authService, AuthUser, LoginCredentials, RegisterData } from '@/services/auth.service';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  authUser: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<{ username: string; password: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Sessiyani tiklash
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        const savedUser = localStorage.getItem(AUTH_USER_KEY);
        
        if (token && savedUser) {
          const parsedAuthUser = JSON.parse(savedUser) as AuthUser;
          
          setAuthUser(parsedAuthUser);
          setUser({
            id: parsedAuthUser.id,
            username: parsedAuthUser.username,
            displayName: parsedAuthUser.username.replace(/[._]dev$/, ''),
            avatar: parsedAuthUser.avatar_url || `https://ui-avatars.com/api/?name=${parsedAuthUser.username}&size=150`,
            bio: parsedAuthUser.bio || '',
            skills: parsedAuthUser.skills || [],
            role: parsedAuthUser.role === 'employer' ? 'Employer' : 'Job Seeker',
            postsCount: 0,
            followersCount: 0,
            followingCount: 0,
            isFollowing: false,
            isOnline: true,
            socialLinks: {},
          });
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
        localStorage.clear();
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const result = await authService.login(credentials);
      
      setAuthUser(result.user);
      setUser(result.appUser);
      setIsAuthenticated(true);
      
      toast.success(`Xush kelibsiz, ${result.user.username}!`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login muvaffaqiyatsiz';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    try {
      await authService.register(data);
      
      // Register muvaffaqiyatli, login qilish uchun credentials qaytarish
      toast.success('Ro\'yxatdan o\'tish muvaffaqiyatli! Iltimos login qiling.');
      
      return { 
        username: data.nickname, 
        password: data.password 
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ro\'yxatdan o\'tish muvaffaqiyatsiz';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      authService.logout(token).catch(console.error);
    }
    
    setUser(null);
    setAuthUser(null);
    setIsAuthenticated(false);
    toast.success('Chiqish muvaffaqiyatli');
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const updatedUser = await authService.updateProfile(user.id, updates);
      setUser(updatedUser);
      toast.success('Profil yangilandi');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Yangilash muvaffaqiyatsiz';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        authUser,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};