import { Story, StoryGroup } from '@/types';
import { mockUsers, currentUser, mockStoryGroups, addStoryPlaceholder } from '@/data/mockData';

const storyImages = [
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=900&fit=crop',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=900&fit=crop',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=900&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=900&fit=crop',
  'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&h=900&fit=crop',
];

let userStories: Story[] = [];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const storyService = {
  async getStories(): Promise<StoryGroup[]> {
    await delay(300);
    
    // Create story groups with multiple stories per user
    const groups: StoryGroup[] = mockUsers.slice(0, 5).map((user, idx) => ({
      user,
      stories: [
        {
          id: `s${idx + 1}-1`,
          userId: user.id,
          user,
          mediaUrl: storyImages[idx % storyImages.length],
          createdAt: new Date(Date.now() - idx * 3600000).toISOString(),
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
          viewed: idx > 2,
          duration: 5000,
        },
        {
          id: `s${idx + 1}-2`,
          userId: user.id,
          user,
          mediaUrl: storyImages[(idx + 1) % storyImages.length],
          createdAt: new Date(Date.now() - idx * 1800000).toISOString(),
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
          viewed: idx > 2,
          duration: 5000,
        },
      ],
      hasUnviewed: idx <= 2,
    }));

    // Add current user's stories if any
    if (userStories.length > 0) {
      groups.unshift({
        user: currentUser,
        stories: userStories,
        hasUnviewed: false,
      });
    }

    return groups;
  },

  async addStory(mediaUrl: string): Promise<Story> {
    await delay(300);
    const newStory: Story = {
      id: `us${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      mediaUrl,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      viewed: false,
      duration: 5000,
    };
    userStories.push(newStory);
    return newStory;
  },

  async markViewed(storyId: string): Promise<void> {
    await delay(100);
    // In real app, would update backend
  },

  async deleteStory(storyId: string): Promise<void> {
    await delay(200);
    userStories = userStories.filter(s => s.id !== storyId);
  },

  async getStoryViewers(storyId: string): Promise<{ userId: string; viewedAt: string }[]> {
    await delay(200);
    // Mock viewers
    return mockUsers.slice(0, 3).map(u => ({
      userId: u.id,
      viewedAt: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    }));
  },
};
