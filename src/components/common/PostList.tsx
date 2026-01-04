import React, { useState } from "react";
import { Heart, MessageCircle, Share, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DevPost {
  id: number;
  username: string;
  role: string;
  time: string;
  content: string;
  codeSnippet?: string;
  likes: number;
  comments: number;
  shares: number;
  avatar: string;
  image?: string;
}

interface PostListProps {
  posts?: DevPost[];
  onUserClick?: (username: string) => void;
  onPostClick?: (post: DevPost) => void;
}

const defaultPosts: DevPost[] = [
  {
    id: 1,
    username: "alex_frontend",
    role: "Frontend Dev",
    time: "2h ago",
    content: "Just integrated my new API — everything works perfectly 😎",
    likes: 256,
    comments: 18,
    shares: 12,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: 2,
    username: "sarah_ui",
    role: "UI/UX Designer",
    time: "4h ago",
    content: "Learning Tailwind CSS is a game changer for UI speed 💻",
    codeSnippet: `<div className="flex items-center gap-4">
  <Button>Click me</Button>
</div>`,
    likes: 342,
    comments: 45,
    shares: 23,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    username: "mike_backend",
    role: "Backend Dev",
    time: "1h ago",
    content: "Optimized the server queries — response time decreased by 30%",
    likes: 198,
    comments: 12,
    shares: 8,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: 4,
    username: "emma_fullstack",
    role: "Fullstack Dev",
    time: "3h ago",
    content: "Deployed my first fullstack project using Vercel!",
    likes: 420,
    comments: 37,
    shares: 15,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop",
  },
  {
    id: 5,
    username: "john_backend",
    role: "Backend Dev",
    time: "5h ago",
    content: "Database migration completed successfully 🚀",
    likes: 310,
    comments: 29,
    shares: 18,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
  },
];

const PostList: React.FC<PostListProps> = ({ 
  posts = defaultPosts,
  onUserClick,
  onPostClick,
}) => {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<number>>(new Set());
  const [postLikes, setPostLikes] = useState<Record<number, number>>({});

  const handleLike = (postId: number, originalLikes: number) => {
    const newLiked = new Set(likedPosts);
    const currentLikes = postLikes[postId] ?? originalLikes;
    
    if (newLiked.has(postId)) {
      newLiked.delete(postId);
      setPostLikes({ ...postLikes, [postId]: currentLikes - 1 });
    } else {
      newLiked.add(postId);
      setPostLikes({ ...postLikes, [postId]: currentLikes + 1 });
    }
    setLikedPosts(newLiked);
  };

  const handleSave = (postId: number) => {
    const newSaved = new Set(savedPosts);
    if (newSaved.has(postId)) {
      newSaved.delete(postId);
    } else {
      newSaved.add(postId);
    }
    setSavedPosts(newSaved);
  };

  return (
    <div className="flex flex-col divide-y divide-border">
      {posts.map((post) => {
        const isLiked = likedPosts.has(post.id);
        const isSaved = savedPosts.has(post.id);
        const currentLikes = postLikes[post.id] ?? post.likes;

        return (
          <div key={post.id} className="p-4 bg-card">
            {/* Header */}
            <div className="flex items-start gap-3">
              <img 
                src={post.avatar} 
                alt={post.username} 
                className="w-10 h-10 rounded-full object-cover cursor-pointer hover:opacity-80 transition"
                onClick={() => onUserClick?.(post.username)}
              />
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p 
                    className="font-semibold text-foreground cursor-pointer hover:text-primary transition"
                    onClick={() => onUserClick?.(post.username)}
                  >
                    {post.username}
                  </p>
                  <span className="text-xs text-muted-foreground">• {post.time}</span>
                </div>
                <p className="text-xs text-muted-foreground">{post.role}</p>
              </div>
            </div>

            {/* Content */}
            <div className="mt-3">
              <p className="text-foreground">{post.content}</p>
              
              {post.codeSnippet && (
                <pre className="bg-muted p-3 rounded-lg overflow-x-auto text-xs text-foreground mt-3 font-mono border border-border">
                  {post.codeSnippet}
                </pre>
              )}

              {post.image && (
                <img 
                  src={post.image}
                  alt="Post"
                  className="w-full rounded-lg mt-3 cursor-pointer hover:opacity-95 transition"
                  onClick={() => onPostClick?.(post)}
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => handleLike(post.id, post.likes)}
                  className={cn(
                    "flex items-center gap-1.5 transition-colors",
                    isLiked ? "text-destructive" : "text-muted-foreground hover:text-destructive"
                  )}
                >
                  <Heart 
                    size={20} 
                    fill={isLiked ? "currentColor" : "none"}
                    className="transition-transform active:scale-125"
                  />
                  <span className="text-sm font-medium">{currentLikes}</span>
                </button>

                <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                  <MessageCircle size={20} />
                  <span className="text-sm font-medium">{post.comments}</span>
                </button>

                <button className="flex items-center gap-1.5 text-muted-foreground hover:text-green-500 transition-colors">
                  <Share size={20} />
                  <span className="text-sm font-medium">{post.shares}</span>
                </button>
              </div>

              <button
                onClick={() => handleSave(post.id)}
                className={cn(
                  "transition-colors",
                  isSaved ? "text-primary" : "text-muted-foreground hover:text-primary"
                )}
              >
                <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PostList;
