import { GroupChat, Message, User } from '@/types';
import { mockUsers, currentUser } from '@/data/mockData';

const mockGroups: GroupChat[] = [
  {
    id: 'g1',
    name: 'React Developers UZ',
    avatar: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&h=100&fit=crop',
    members: [currentUser, ...mockUsers.slice(0, 4)],
    admins: [currentUser.id, mockUsers[0].id],
    createdBy: currentUser.id,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    lastMessage: {
      id: 'gm1',
      chatRoomId: 'g1',
      senderId: mockUsers[0].id,
      content: 'Anyone tried the new React 19 features?',
      type: 'text',
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      isRead: false,
    },
    unreadCount: 3,
  },
  {
    id: 'g2',
    name: 'Startup Founders',
    avatar: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=100&h=100&fit=crop',
    members: [currentUser, ...mockUsers.slice(1, 5)],
    admins: [mockUsers[1].id],
    createdBy: mockUsers[1].id,
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    lastMessage: {
      id: 'gm2',
      chatRoomId: 'g2',
      senderId: mockUsers[2].id,
      content: "Let's discuss funding strategies 💰",
      type: 'text',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      isRead: true,
    },
    unreadCount: 0,
  },
  {
    id: 'g3',
    name: 'Code Arena Champions',
    avatar: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=100&h=100&fit=crop',
    members: [currentUser, ...mockUsers.slice(0, 3)],
    admins: [currentUser.id],
    createdBy: currentUser.id,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    lastMessage: null,
    unreadCount: 0,
  },
];

const groupMessages: Record<string, Message[]> = {
  g1: [
    { id: 'gm1-1', chatRoomId: 'g1', senderId: mockUsers[0].id, content: 'Welcome to the group! 🎉', type: 'text', createdAt: new Date(Date.now() - 86400000).toISOString(), isRead: true },
    { id: 'gm1-2', chatRoomId: 'g1', senderId: mockUsers[1].id, content: 'Happy to be here!', type: 'text', createdAt: new Date(Date.now() - 82800000).toISOString(), isRead: true },
    { id: 'gm1-3', chatRoomId: 'g1', senderId: currentUser.id, content: "Let's build something cool", type: 'text', createdAt: new Date(Date.now() - 79200000).toISOString(), isRead: true },
    { id: 'gm1-4', chatRoomId: 'g1', senderId: mockUsers[0].id, content: 'Anyone tried the new React 19 features?', type: 'text', createdAt: new Date(Date.now() - 1800000).toISOString(), isRead: false },
  ],
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const groupService = {
  async getGroups(): Promise<GroupChat[]> {
    await delay(300);
    return mockGroups;
  },

  async getGroup(groupId: string): Promise<GroupChat | null> {
    await delay(200);
    return mockGroups.find(g => g.id === groupId) || null;
  },

  async createGroup(name: string, memberIds: string[]): Promise<GroupChat> {
    await delay(300);
    const members = [currentUser, ...mockUsers.filter(u => memberIds.includes(u.id))];
    const newGroup: GroupChat = {
      id: `g${Date.now()}`,
      name,
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop',
      members,
      admins: [currentUser.id],
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      lastMessage: null,
      unreadCount: 0,
    };
    mockGroups.push(newGroup);
    return newGroup;
  },

  async getGroupMessages(groupId: string): Promise<Message[]> {
    await delay(200);
    return groupMessages[groupId] || [];
  },

  async sendGroupMessage(groupId: string, content: string, type: Message['type'] = 'text'): Promise<Message> {
    await delay(150);
    const newMessage: Message = {
      id: `gm${Date.now()}`,
      chatRoomId: groupId,
      senderId: currentUser.id,
      content,
      type,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    
    if (!groupMessages[groupId]) {
      groupMessages[groupId] = [];
    }
    groupMessages[groupId].push(newMessage);

    // Update last message in group
    const group = mockGroups.find(g => g.id === groupId);
    if (group) {
      group.lastMessage = newMessage;
    }

    return newMessage;
  },

  async addMember(groupId: string, userId: string): Promise<void> {
    await delay(200);
    const group = mockGroups.find(g => g.id === groupId);
    const user = mockUsers.find(u => u.id === userId);
    if (group && user && !group.members.find(m => m.id === userId)) {
      group.members.push(user);
    }
  },

  async removeMember(groupId: string, userId: string): Promise<void> {
    await delay(200);
    const group = mockGroups.find(g => g.id === groupId);
    if (group) {
      group.members = group.members.filter(m => m.id !== userId);
    }
  },

  async makeAdmin(groupId: string, userId: string): Promise<void> {
    await delay(200);
    const group = mockGroups.find(g => g.id === groupId);
    if (group && !group.admins.includes(userId)) {
      group.admins.push(userId);
    }
  },

  async leaveGroup(groupId: string): Promise<void> {
    await delay(200);
    const idx = mockGroups.findIndex(g => g.id === groupId);
    if (idx > -1) {
      mockGroups.splice(idx, 1);
    }
  },
};
