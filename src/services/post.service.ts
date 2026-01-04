import { Post, Comment, Story, StoryGroup } from '@/types';
import { mockPosts, mockStoryGroups, addStoryPlaceholder, currentUser, mockUsers } from '@/data/mockData';

// Local state
let posts: Post[] = [...mockPosts];
let storyGroups: StoryGroup[] = [...mockStoryGroups];
const likedPosts: Set<string> = new Set(mockPosts.filter((p) => p.isLiked).map((p) => p.id));

export const postService = {
  // Get feed posts
  getFeedPosts: async (): Promise<Post[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          posts.map((p) => ({
            ...p,
            isLiked: likedPosts.has(p.id),
            likesCount: p.likesCount + (likedPosts.has(p.id) && !p.isLiked ? 1 : 0),
          }))
        );
      }, 300);
    });
  },

  // Get user posts
  getUserPosts: async (userId: string): Promise<Post[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userPosts = posts.filter((p) => p.userId === userId);
        resolve(userPosts.map((p) => ({ ...p, isLiked: likedPosts.has(p.id) })));
      }, 200);
    });
  },

  // Get single post
  getPostById: async (postId: string): Promise<Post | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const post = posts.find((p) => p.id === postId);
        resolve(post ? { ...post, isLiked: likedPosts.has(postId) } : null);
      }, 100);
    });
  },

  // Create post
  createPost: async (data: { mediaUrl: string; caption: string; type: 'image' | 'video' }): Promise<Post> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPost: Post = {
          id: `p${Date.now()}`,
          userId: currentUser.id,
          user: currentUser,
          type: data.type,
          mediaUrl: data.mediaUrl,
          caption: data.caption,
          likesCount: 0,
          commentsCount: 0,
          isLiked: false,
          isSaved: false,
          createdAt: new Date().toISOString(),
          comments: [],
        };
        posts = [newPost, ...posts];
        resolve(newPost);
      }, 500);
    });
  },

  // Like post
  likePost: async (postId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        likedPosts.add(postId);
        resolve(true);
      }, 100);
    });
  },

  // Unlike post
  unlikePost: async (postId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        likedPosts.delete(postId);
        resolve(true);
      }, 100);
    });
  },

  // Add comment
  addComment: async (postId: string, content: string): Promise<Comment> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const comment: Comment = {
          id: `c${Date.now()}`,
          userId: currentUser.id,
          user: currentUser,
          content,
          createdAt: new Date().toISOString(),
          likesCount: 0,
          isLiked: false,
        };
        const postIndex = posts.findIndex((p) => p.id === postId);
        if (postIndex !== -1) {
          posts[postIndex].comments.push(comment);
          posts[postIndex].commentsCount++;
        }
        resolve(comment);
      }, 200);
    });
  },

  // Delete post
  deletePost: async (postId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        posts = posts.filter((p) => p.id !== postId);
        resolve(true);
      }, 200);
    });
  },

  // Get stories
  getStories: async (): Promise<StoryGroup[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([addStoryPlaceholder, ...storyGroups]);
      }, 200);
    });
  },

  // Add story
  addStory: async (mediaUrl: string): Promise<Story> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const story: Story = {
          id: `s${Date.now()}`,
          userId: currentUser.id,
          user: currentUser,
          mediaUrl,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
          viewed: false,
        };
        
        // Add to current user's stories
        const existingGroup = storyGroups.find((g) => g.user.id === currentUser.id);
        if (existingGroup) {
          existingGroup.stories.push(story);
          existingGroup.hasUnviewed = true;
        } else {
          storyGroups = [
            {
              user: currentUser,
              stories: [story],
              hasUnviewed: true,
            },
            ...storyGroups,
          ];
        }
        
        resolve(story);
      }, 500);
    });
  },

  // Mark story as viewed
  markStoryViewed: async (storyId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        storyGroups.forEach((group) => {
          group.stories.forEach((story) => {
            if (story.id === storyId) {
              story.viewed = true;
            }
          });
          group.hasUnviewed = group.stories.some((s) => !s.viewed);
        });
        resolve(true);
      }, 100);
    });
  },
};
