import { User } from '@/types';
import { mockUsers, currentUser } from '@/data/mockData';

interface OnlineUser {
  userId: string;
  username: string;
  avatar: string;
  lastSeen: string;
  status: 'online' | 'away' | 'busy' | 'offline';
}

// Simulated online users state
let onlineUsers: Map<string, OnlineUser> = new Map();

// Initialize with some mock online users
mockUsers.filter((u) => u.isOnline).forEach((user) => {
  onlineUsers.set(user.id, {
    userId: user.id,
    username: user.username,
    avatar: user.avatar,
    lastSeen: new Date().toISOString(),
    status: 'online',
  });
});

// Add current user
onlineUsers.set(currentUser.id, {
  userId: currentUser.id,
  username: currentUser.username,
  avatar: currentUser.avatar,
  lastSeen: new Date().toISOString(),
  status: 'online',
});

// Simulated presence callbacks
type PresenceCallback = (count: number, users: OnlineUser[]) => void;
const presenceCallbacks: Set<PresenceCallback> = new Set();

// Simulate random user presence changes
let simulationInterval: ReturnType<typeof setInterval> | null = null;

const startPresenceSimulation = () => {
  if (simulationInterval) return;
  
  simulationInterval = setInterval(() => {
    // Randomly add or remove users
    const shouldAdd = Math.random() > 0.5;
    
    if (shouldAdd && mockUsers.length > onlineUsers.size) {
      const offlineUsers = mockUsers.filter((u) => !onlineUsers.has(u.id));
      if (offlineUsers.length > 0) {
        const randomUser = offlineUsers[Math.floor(Math.random() * offlineUsers.length)];
        onlineUsers.set(randomUser.id, {
          userId: randomUser.id,
          username: randomUser.username,
          avatar: randomUser.avatar,
          lastSeen: new Date().toISOString(),
          status: 'online',
        });
      }
    } else if (onlineUsers.size > 2) {
      const onlineArray = Array.from(onlineUsers.values());
      const randomIndex = Math.floor(Math.random() * onlineArray.length);
      const userToRemove = onlineArray[randomIndex];
      // Don't remove current user
      if (userToRemove.userId !== currentUser.id) {
        onlineUsers.delete(userToRemove.userId);
      }
    }
    
    // Notify all subscribers
    const usersArray = Array.from(onlineUsers.values());
    presenceCallbacks.forEach((callback) => callback(onlineUsers.size, usersArray));
  }, 5000); // Update every 5 seconds
};

const stopPresenceSimulation = () => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
};

export const presenceService = {
  // Get current online count
  getOnlineCount: async (): Promise<number> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(onlineUsers.size);
      }, 100);
    });
  },

  // Get online users list
  getOnlineUsers: async (): Promise<OnlineUser[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Array.from(onlineUsers.values()));
      }, 100);
    });
  },

  // Check if specific user is online
  isUserOnline: async (userId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(onlineUsers.has(userId));
      }, 50);
    });
  },

  // Get user's last seen time
  getLastSeen: async (userId: string): Promise<string | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = onlineUsers.get(userId);
        resolve(user?.lastSeen || null);
      }, 50);
    });
  },

  // Subscribe to presence changes
  subscribeToPresence: (callback: PresenceCallback): (() => void) => {
    presenceCallbacks.add(callback);
    startPresenceSimulation();
    
    // Immediately call with current state
    const usersArray = Array.from(onlineUsers.values());
    callback(onlineUsers.size, usersArray);
    
    // Return unsubscribe function
    return () => {
      presenceCallbacks.delete(callback);
      if (presenceCallbacks.size === 0) {
        stopPresenceSimulation();
      }
    };
  },

  // Update current user's status
  updateStatus: async (status: OnlineUser['status']): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentOnlineUser = onlineUsers.get(currentUser.id);
        if (currentOnlineUser) {
          currentOnlineUser.status = status;
          currentOnlineUser.lastSeen = new Date().toISOString();
          onlineUsers.set(currentUser.id, currentOnlineUser);
        }
        resolve(true);
      }, 100);
    });
  },

  // Go offline (when user leaves)
  goOffline: async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        onlineUsers.delete(currentUser.id);
        const usersArray = Array.from(onlineUsers.values());
        presenceCallbacks.forEach((callback) => callback(onlineUsers.size, usersArray));
        resolve();
      }, 100);
    });
  },

  // Go online (when user returns)
  goOnline: async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        onlineUsers.set(currentUser.id, {
          userId: currentUser.id,
          username: currentUser.username,
          avatar: currentUser.avatar,
          lastSeen: new Date().toISOString(),
          status: 'online',
        });
        const usersArray = Array.from(onlineUsers.values());
        presenceCallbacks.forEach((callback) => callback(onlineUsers.size, usersArray));
        resolve();
      }, 100);
    });
  },
};
