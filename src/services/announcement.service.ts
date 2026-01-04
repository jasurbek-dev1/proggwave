import { currentUser } from '@/data/mockData';

export interface Announcement {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: 'job' | 'service' | 'event' | 'other';
  imageUrl?: string;
  contactInfo: string;
  price?: string;
  location?: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
  views: number;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
  };
}

// Mock announcements
let announcements: Announcement[] = [
  {
    id: 'ann1',
    userId: '1',
    title: 'React Developer Izlanyapti',
    content: 'Startup uchun tajribali React developer kerak. Remote ishlash imkoniyati.',
    category: 'job',
    contactInfo: '@startup_dev',
    price: '$2000-4000',
    location: 'Remote',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
    isActive: true,
    views: 245,
    author: {
      id: '1',
      username: 'startup_dev',
      displayName: 'Startup Dev',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
    },
  },
  {
    id: 'ann2',
    userId: '2',
    title: 'Web Sayt Yasab Beraman',
    content: 'Zamonaviy dizayn, responsive, SEO optimizatsiya bilan web sayt tayyorlab beraman.',
    category: 'service',
    contactInfo: '@alice_frontend',
    price: '$300-1000',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * 14).toISOString(),
    isActive: true,
    views: 189,
    author: {
      id: '2',
      username: 'alice_frontend',
      displayName: 'Alice Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    },
  },
  {
    id: 'ann3',
    userId: '3',
    title: 'IT Meetup - Tashkent',
    content: 'Haftalik IT meetup. Mavzu: Microservices Architecture. Hammaga ochiq!',
    category: 'event',
    contactInfo: 'meetup.uz/it-tashkent',
    location: 'IT Park, Tashkent',
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * 3).toISOString(),
    isActive: true,
    views: 432,
    author: {
      id: '3',
      username: 'bob_backend',
      displayName: 'Bob Smith',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    },
  },
];

export const announcementService = {
  // Get all announcements
  getAnnouncements: async (): Promise<Announcement[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          announcements
            .filter((a) => a.isActive)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        );
      }, 200);
    });
  },

  // Get announcements by category
  getAnnouncementsByCategory: async (category: Announcement['category']): Promise<Announcement[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(announcements.filter((a) => a.category === category && a.isActive));
      }, 200);
    });
  },

  // Get user's announcements
  getUserAnnouncements: async (userId: string): Promise<Announcement[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(announcements.filter((a) => a.userId === userId));
      }, 200);
    });
  },

  // Get single announcement
  getAnnouncementById: async (id: string): Promise<Announcement | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const announcement = announcements.find((a) => a.id === id);
        if (announcement) {
          announcement.views++;
        }
        resolve(announcement || null);
      }, 100);
    });
  },

  // Create announcement
  createAnnouncement: async (data: {
    title: string;
    content: string;
    category: Announcement['category'];
    contactInfo: string;
    price?: string;
    location?: string;
    imageUrl?: string;
  }): Promise<Announcement> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAnnouncement: Announcement = {
          id: `ann${Date.now()}`,
          userId: currentUser.id,
          title: data.title,
          content: data.content,
          category: data.category,
          contactInfo: data.contactInfo,
          price: data.price,
          location: data.location,
          imageUrl: data.imageUrl,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
          isActive: true,
          views: 0,
          author: {
            id: currentUser.id,
            username: currentUser.username,
            displayName: currentUser.displayName,
            avatar: currentUser.avatar,
          },
        };
        announcements = [newAnnouncement, ...announcements];
        resolve(newAnnouncement);
      }, 300);
    });
  },

  // Update announcement
  updateAnnouncement: async (
    id: string,
    data: Partial<Omit<Announcement, 'id' | 'userId' | 'createdAt' | 'author'>>
  ): Promise<Announcement | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = announcements.findIndex((a) => a.id === id);
        if (index !== -1) {
          announcements[index] = { ...announcements[index], ...data };
          resolve(announcements[index]);
        } else {
          resolve(null);
        }
      }, 200);
    });
  },

  // Delete announcement
  deleteAnnouncement: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = announcements.findIndex((a) => a.id === id);
        if (index !== -1) {
          announcements[index].isActive = false;
          resolve(true);
        } else {
          resolve(false);
        }
      }, 200);
    });
  },

  // Search announcements
  searchAnnouncements: async (query: string): Promise<Announcement[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const lowercaseQuery = query.toLowerCase();
        resolve(
          announcements.filter(
            (a) =>
              a.isActive &&
              (a.title.toLowerCase().includes(lowercaseQuery) ||
                a.content.toLowerCase().includes(lowercaseQuery))
          )
        );
      }, 150);
    });
  },
};
