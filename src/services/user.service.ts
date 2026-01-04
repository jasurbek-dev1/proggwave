import { User } from '@/types';
import { mockUsers, currentUser } from '@/data/mockData';

// Local state for follow status
const followState: Record<string, boolean> = {};
mockUsers.forEach((user) => {
  followState[user.id] = user.isFollowing;
});

export const userService = {
  // Get user by ID
  getUserById: async (userId: string): Promise<User | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (userId === currentUser.id || userId === '0') {
          resolve(currentUser);
        }
        const user = mockUsers.find((u) => u.id === userId);
        resolve(user ? { ...user, isFollowing: followState[user.id] ?? user.isFollowing } : null);
      }, 200);
    });
  },

  // Get user by username
  getUserByUsername: async (username: string): Promise<User | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (username === currentUser.username) {
          resolve(currentUser);
        }
        const user = mockUsers.find((u) => u.username === username);
        resolve(user ? { ...user, isFollowing: followState[user.id] ?? user.isFollowing } : null);
      }, 200);
    });
  },

  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockUsers.map((u) => ({ ...u, isFollowing: followState[u.id] ?? u.isFollowing })));
      }, 200);
    });
  },

  // Follow user
  followUser: async (userId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        followState[userId] = true;
        resolve(true);
      }, 300);
    });
  },

  // Unfollow user
  unfollowUser: async (userId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        followState[userId] = false;
        resolve(true);
      }, 300);
    });
  },

  // Search users
  searchUsers: async (query: string): Promise<User[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = mockUsers.filter(
          (u) =>
            u.username.toLowerCase().includes(query.toLowerCase()) ||
            u.displayName.toLowerCase().includes(query.toLowerCase())
        );
        resolve(results);
      }, 200);
    });
  },

  // Get suggested users
  getSuggestedUsers: async (): Promise<User[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const suggestions = mockUsers.filter((u) => !followState[u.id]).slice(0, 5);
        resolve(suggestions);
      }, 200);
    });
  },

  // Get followers
  getFollowers: async (userId: string): Promise<User[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return random subset as followers
        resolve(mockUsers.slice(0, 3));
      }, 200);
    });
  },

  // Get following
  getFollowing: async (userId: string): Promise<User[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockUsers.filter((u) => followState[u.id]));
      }, 200);
    });
  },
};
