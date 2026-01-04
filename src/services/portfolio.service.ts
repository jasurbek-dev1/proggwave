import { PortfolioItem } from '@/types';
import { mockPortfolioItems, currentUser } from '@/data/mockData';

let portfolioItems: PortfolioItem[] = [...mockPortfolioItems];

export const portfolioService = {
  // Get user portfolio items
  getPortfolioItems: async (userId: string): Promise<PortfolioItem[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(portfolioItems.filter((item) => item.userId === userId));
      }, 200);
    });
  },

  // Get single portfolio item
  getPortfolioItemById: async (itemId: string): Promise<PortfolioItem | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const item = portfolioItems.find((p) => p.id === itemId);
        resolve(item || null);
      }, 100);
    });
  },

  // Create portfolio item
  createPortfolioItem: async (data: {
    title: string;
    description: string;
    link: string;
    technologies: string[];
    imageUrl?: string;
  }): Promise<PortfolioItem> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newItem: PortfolioItem = {
          id: `pf${Date.now()}`,
          userId: currentUser.id,
          title: data.title,
          description: data.description,
          link: data.link,
          technologies: data.technologies,
          imageUrl: data.imageUrl,
          createdAt: new Date().toISOString(),
        };
        portfolioItems = [newItem, ...portfolioItems];
        resolve(newItem);
      }, 300);
    });
  },

  // Update portfolio item
  updatePortfolioItem: async (
    itemId: string,
    data: Partial<Omit<PortfolioItem, 'id' | 'userId' | 'createdAt'>>
  ): Promise<PortfolioItem | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = portfolioItems.findIndex((p) => p.id === itemId);
        if (index !== -1) {
          portfolioItems[index] = { ...portfolioItems[index], ...data };
          resolve(portfolioItems[index]);
        } else {
          resolve(null);
        }
      }, 200);
    });
  },

  // Delete portfolio item
  deletePortfolioItem: async (itemId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const prevLength = portfolioItems.length;
        portfolioItems = portfolioItems.filter((p) => p.id !== itemId);
        resolve(portfolioItems.length < prevLength);
      }, 200);
    });
  },
};
