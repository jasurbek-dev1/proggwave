import { ChatRoom, Message } from '@/types';
import { mockChatRooms, mockMessages, currentUser, mockUsers } from '@/data/mockData';

// Local state
let chatRooms: ChatRoom[] = [...mockChatRooms];
const messages: Record<string, Message[]> = {
  chat1: [...mockMessages],
  chat2: [],
  chat3: [],
  chat4: [],
};

export const chatService = {
  // Get all chat rooms
  getChatRooms: async (): Promise<ChatRoom[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(chatRooms.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ));
      }, 200);
    });
  },

  // Get single chat room
  getChatRoom: async (chatId: string): Promise<ChatRoom | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const room = chatRooms.find((r) => r.id === chatId);
        resolve(room || null);
      }, 100);
    });
  },

  // Get chat room by participant
  getChatRoomByParticipant: async (userId: string): Promise<ChatRoom | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const room = chatRooms.find((r) => r.participant.id === userId);
        resolve(room || null);
      }, 100);
    });
  },

  // Get messages for a chat room
  getMessages: async (chatId: string): Promise<Message[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(messages[chatId] || []);
      }, 200);
    });
  },

  // Send message
  sendMessage: async (chatId: string, content: string, type: 'text' | 'image' | 'sticker' | 'voice' = 'text'): Promise<Message> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const message: Message = {
          id: `msg${Date.now()}`,
          chatRoomId: chatId,
          senderId: currentUser.id,
          content,
          type,
          createdAt: new Date().toISOString(),
          isRead: false,
        };

        if (!messages[chatId]) {
          messages[chatId] = [];
        }
        messages[chatId].push(message);

        // Update chat room
        const roomIndex = chatRooms.findIndex((r) => r.id === chatId);
        if (roomIndex !== -1) {
          chatRooms[roomIndex].lastMessage = message;
          chatRooms[roomIndex].updatedAt = message.createdAt;
        }

        resolve(message);
      }, 100);
    });
  },

  // Create or get chat room with user
  getOrCreateChatRoom: async (userId: string): Promise<ChatRoom> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let room = chatRooms.find((r) => r.participant.id === userId);
        
        if (!room) {
          const user = mockUsers.find((u) => u.id === userId);
          if (user) {
            room = {
              id: `chat${Date.now()}`,
              type: 'private',
              participant: user,
              lastMessage: null,
              unreadCount: 0,
              updatedAt: new Date().toISOString(),
            };
            chatRooms.push(room);
            messages[room.id] = [];
          }
        }
        
        resolve(room!);
      }, 200);
    });
  },

  // Mark messages as read
  markAsRead: async (chatId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const roomIndex = chatRooms.findIndex((r) => r.id === chatId);
        if (roomIndex !== -1) {
          chatRooms[roomIndex].unreadCount = 0;
        }
        if (messages[chatId]) {
          messages[chatId].forEach((m) => {
            m.isRead = true;
          });
        }
        resolve(true);
      }, 100);
    });
  },

  // Search chats
  searchChats: async (query: string): Promise<ChatRoom[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = chatRooms.filter((r) =>
          r.participant.username.toLowerCase().includes(query.toLowerCase()) ||
          r.participant.displayName.toLowerCase().includes(query.toLowerCase())
        );
        resolve(results);
      }, 100);
    });
  },
};
