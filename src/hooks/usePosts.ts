import { useState, useEffect, useCallback } from 'react';
import { Post, StoryGroup } from '@/types';
import { postService } from '@/services/post.service';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await postService.getFeedPosts();
      setPosts(data);
    } catch (err) {
      setError('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const likePost = useCallback(async (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    // Optimistic update
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, isLiked: !p.isLiked, likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1 }
          : p
      )
    );

    try {
      if (post.isLiked) {
        await postService.unlikePost(postId);
      } else {
        await postService.likePost(postId);
      }
    } catch {
      // Revert on error
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, isLiked: post.isLiked, likesCount: post.likesCount }
            : p
        )
      );
    }
  }, [posts]);

  const createPost = useCallback(async (data: { mediaUrl: string; caption: string; type: 'image' | 'video' }) => {
    try {
      const newPost = await postService.createPost(data);
      setPosts((prev) => [newPost, ...prev]);
      return newPost;
    } catch (err) {
      setError('Failed to create post');
      throw err;
    }
  }, []);

  const addComment = useCallback(async (postId: string, content: string) => {
    try {
      const comment = await postService.addComment(postId, content);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, comments: [...p.comments, comment], commentsCount: p.commentsCount + 1 }
            : p
        )
      );
      return comment;
    } catch (err) {
      setError('Failed to add comment');
      throw err;
    }
  }, []);

  const deletePost = useCallback(async (postId: string) => {
    try {
      await postService.deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      setError('Failed to delete post');
      throw err;
    }
  }, []);

  return {
    posts,
    isLoading,
    error,
    loadPosts,
    likePost,
    createPost,
    addComment,
    deletePost,
  };
};

export const useStories = () => {
  const [stories, setStories] = useState<StoryGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadStories = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await postService.getStories();
      setStories(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStories();
  }, [loadStories]);

  const addStory = useCallback(async (mediaUrl: string) => {
    try {
      await postService.addStory(mediaUrl);
      await loadStories();
    } catch (err) {
      console.error('Failed to add story', err);
    }
  }, [loadStories]);

  const markViewed = useCallback(async (storyId: string) => {
    try {
      await postService.markStoryViewed(storyId);
      setStories((prev) =>
        prev.map((group) => ({
          ...group,
          stories: group.stories.map((s) =>
            s.id === storyId ? { ...s, viewed: true } : s
          ),
          hasUnviewed: group.stories.some((s) => s.id !== storyId && !s.viewed),
        }))
      );
    } catch (err) {
      console.error('Failed to mark story viewed', err);
    }
  }, []);

  return {
    stories,
    isLoading,
    loadStories,
    addStory,
    markViewed,
  };
};
