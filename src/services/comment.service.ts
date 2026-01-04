import { Comment } from '@/types';
import { mockUsers, currentUser } from '@/data/mockData';

// Mock comments data
const mockComments: Record<string, Comment[]> = {
  p1: [
    { id: 'c1', userId: '3', user: mockUsers[2], content: 'This looks amazing! 🔥', createdAt: new Date(Date.now() - 1800000).toISOString(), likesCount: 12, isLiked: false, replies: [] },
    { id: 'c2', userId: '4', user: mockUsers[3], content: 'Great work on the component library!', createdAt: new Date(Date.now() - 3600000).toISOString(), likesCount: 8, isLiked: true, replies: [
      { id: 'c2-r1', userId: '2', user: mockUsers[1], content: 'Thank you! 🙏', createdAt: new Date(Date.now() - 1200000).toISOString(), likesCount: 3, isLiked: false, parentId: 'c2' }
    ]},
  ],
  p2: [
    { id: 'c3', userId: '1', user: mockUsers[0], content: 'Microservices are the way to go!', createdAt: new Date(Date.now() - 7200000).toISOString(), likesCount: 15, isLiked: false, replies: [] },
  ],
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const commentService = {
  async getComments(postId: string): Promise<Comment[]> {
    await delay(300);
    return mockComments[postId] || [];
  },

  async addComment(postId: string, content: string, parentId?: string): Promise<Comment> {
    await delay(200);
    const newComment: Comment = {
      id: `c${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      content,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      isLiked: false,
      parentId,
      replies: [],
    };

    if (!mockComments[postId]) {
      mockComments[postId] = [];
    }

    if (parentId) {
      // Add as reply to parent comment
      const parentComment = mockComments[postId].find(c => c.id === parentId);
      if (parentComment) {
        if (!parentComment.replies) parentComment.replies = [];
        parentComment.replies.push(newComment);
      }
    } else {
      mockComments[postId].unshift(newComment);
    }

    return newComment;
  },

  async likeComment(commentId: string): Promise<void> {
    await delay(100);
    // Mock implementation - in real app would update backend
  },

  async unlikeComment(commentId: string): Promise<void> {
    await delay(100);
  },

  async deleteComment(postId: string, commentId: string): Promise<void> {
    await delay(200);
    if (mockComments[postId]) {
      mockComments[postId] = mockComments[postId].filter(c => c.id !== commentId);
    }
  },
};
