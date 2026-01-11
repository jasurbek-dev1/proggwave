import { User } from '@/types';
import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'https://proggwave.uz/api';

// API Client
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - har bir so'rovga token qo'shish
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - token expired bo'lsa refresh qilish
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token');

        // POST /api/auth/refresh
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { accessToken } = response.data;
        localStorage.setItem('auth_token', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ===========================
// TYPES
// ===========================

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
  firstName?: string;
  lastName?: string;
  email: string;
  address?: string;
  phone?: string;
  nickname: string;
  password: string;
  position?: string;
  
  // Frontend qo'shimcha
  role?: 'job_seeker' | 'employer';
  avatar_url?: string;
  bio?: string;
  location?: string;
  skills?: string[];
  joined_group?: boolean;
  added_friends?: boolean;
}

export interface AuthResponse {
  user: AuthUser;
  appUser: User;
  token: string;
}

interface LoginApiResponse {
  accessToken: string;
  refreshToken: string;
  token_type?: string;
  user?: {
    id: string;
    firstName?: string;
    lastName?: string;
    nickname?: string;
    username?: string;
    email?: string;
    phone?: string;
    address?: string;
    avatar_url?: string;
    bio?: string;
    skills?: string[];
    createdAt?: string;
    isActive?: boolean;
    isVerify?: boolean;
    position?: string | null;
    password?: string;
  };
}

interface ApiErrorResponse {
  message: string;
  error: string;
  statusCode: number;
}

// ===========================
// HELPERS
// ===========================

export const validateUsername = (username: string): boolean => {
  return username.endsWith('.dev') || username.endsWith('_dev');
};

const toAppUser = (authUser: AuthUser): User => {
  return {
    id: authUser.id,
    username: authUser.username,
    displayName: authUser.username.replace(/[._]dev$/, ''),
    avatar: authUser.avatar_url || `https://ui-avatars.com/api/?name=${authUser.username}&size=150`,
    bio: authUser.bio || '',
    skills: authUser.skills || [],
    role: authUser.role === 'employer' ? 'Employer' : 'Job Seeker',
    postsCount: 0,
    followersCount: 0,
    followingCount: 0,
    isFollowing: false,
    isOnline: true,
    socialLinks: {},
  };
};

const handleApiError = (error: any): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    
    if (axiosError.response?.data?.message) {
      const msg = axiosError.response.data.message;
      
      if (msg === 'Invalid login.') return 'Username yoki parol noto\'g\'ri';
      if (msg.includes('already exists')) return 'Bu username yoki email band';
      if (msg.includes('required')) return 'Barcha maydonlarni to\'ldiring';
      if (msg.includes('Internal server error')) return 'Server xatosi';
      
      return msg;
    }
    
    if (axiosError.response?.status === 401) return 'Username yoki parol noto\'g\'ri';
    if (axiosError.response?.status === 400) return 'Noto\'g\'ri ma\'lumotlar';
    if (axiosError.response?.status === 403) return 'Ruxsat yo\'q';
    if (axiosError.response?.status === 500) return 'Server xatosi';
  }
  
  return 'Kutilmagan xato';
};

// ===========================
// AUTH SERVICE
// ===========================

export const authService = {
  /**
   * POST /api/auth/login
   * Request: { "login": "admin", "password": "123456" }
   * Response (204): { access_token, refresh_token, token_type }
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      if (!validateUsername(credentials.username)) {
        throw new Error('Username .dev yoki _dev bilan tugashi kerak');
      }

      if (!credentials.password || credentials.password.length < 6) {
        throw new Error('Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
      }

      const response = await apiClient.post<LoginApiResponse>('/auth/login', {
        login: credentials.username,
        password: credentials.password,
      });

      const { accessToken, refreshToken, user: apiUser } = response.data;

      localStorage.setItem('auth_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);

      // API user'ni to'g'ridan AuthUser sifatida ishlatish
      const authUser: AuthUser = {
        id: apiUser.id,
        username: apiUser.nickname || apiUser.username || credentials.username,
        role: 'job_seeker',
        email: apiUser.email,
        phone: apiUser.phone || undefined,
        avatar_url: apiUser.avatar_url || undefined,
        bio: apiUser.bio || undefined,
        location: apiUser.address || undefined,
        skills: apiUser.skills || [],
        joined_group: true,
        added_friends: false,
        created_at: apiUser.createdAt || new Date().toISOString(),
      };

      localStorage.setItem('auth_user', JSON.stringify(authUser));

      return {
        user: authUser,
        appUser: toAppUser(authUser),
        token: accessToken,
      };
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * POST /api/auth/register
   * Request: { firstName, lastName, email, phone, nickname, password, address }
   * Response (201): Success
   */
  register: async (data: RegisterData): Promise<{ username: string; password: string }> => {
    try {
      if (!validateUsername(data.nickname)) {
        throw new Error('Username .dev yoki _dev bilan tugashi kerak');
      }

      if (!data.password || data.password.length < 6) {
        throw new Error('Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
      }

      if (!data.email) {
        throw new Error('Email manzili kerak');
      }

      const registerPayload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        address: data.address || data.location,
        phone: data.phone,
        nickname: data.nickname,
        password: data.password,
        // position: data.position || crypto.randomUUID(), // Olib tashlandi
      };

      await apiClient.post('/auth/register', registerPayload);

      // Register muvaffaqiyatli - credentials qaytarish
      return {
        username: data.nickname,
        password: data.password,
      };
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * POST /api/auth/send-code?email=...
   * Response (201)
   */
  sendVerificationCode: async (email: string): Promise<void> => {
    try {
      await apiClient.post(`/auth/send-code?email=${encodeURIComponent(email)}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * POST /api/auth/verify-code?email=...&code=...
   * Response (201)
   */
  verifyCode: async (email: string, code: string): Promise<void> => {
    try {
      const response = await apiClient.post(
        `/auth/verify-code?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`
      );

      if (response.data?.access_token) {
        localStorage.setItem('auth_token', response.data.access_token);
        if (response.data.refresh_token) {
          localStorage.setItem('refresh_token', response.data.refresh_token);
        }
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * POST /api/auth/logout
   * Response (204): The user was logged out successfully
   */
  logout: async (token: string): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.clear();
    }
  },

  /**
   * POST /api/auth/refresh
   * Response (204): New access, refresh tokens have been saved
   */
  refreshToken: async (): Promise<string> => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) throw new Error('No refresh token');

      const response = await apiClient.post('/auth/refresh', {
        refresh_token: refreshToken,
      });

      const { accessToken } = response.data;
      localStorage.setItem('auth_token', accessToken);

      return accessToken;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * GET /api/profiles/me
   * Current user ma'lumotlarini olish
   */
  getCurrentUser: async (token: string): Promise<User | null> => {
    try {
      const response = await apiClient.get<AuthUser>('/profiles/me');
      return toAppUser(response.data);
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  /**
   * PATCH /api/profiles/{id}
   * Profile yangilash
   */
  updateProfile: async (userId: string, updates: Partial<User>): Promise<User> => {
    try {
      const response = await apiClient.patch(`/profiles/${userId}`, updates);
      return toAppUser(response.data);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * GET /api/auth/test
   * Test endpoint (200)
   */
  testAuth: async (): Promise<any> => {
    try {
      const response = await apiClient.get('/auth/test');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Token valid ekanligini tekshirish
   */
  isTokenValid: (token: string): boolean => {
    return !!token && token.length > 0;
  },
};

export { apiClient };