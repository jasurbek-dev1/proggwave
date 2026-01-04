import React, { useState } from "react";
import { X, Heart, Send } from "lucide-react";
import { DevStory } from "./DevStories";
import { cn } from "@/lib/utils";

interface Props {
  story: DevStory;
  onClose: () => void;
}

const DevStoryViewer: React.FC<Props> = ({ story, onClose }) => {
  const [likes, setLikes] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<string[]>([]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      setComments([...comments, comment]);
      setComment("");
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-black via-[#0f1115] to-black flex justify-center items-center z-50 text-white backdrop-blur-md animate-fade-in">
      <div className="relative w-[92%] max-w-sm bg-[#1b1d23]/80 rounded-2xl shadow-2xl overflow-hidden border border-white/10 flex flex-col backdrop-blur-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition z-10"
        >
          <X size={22} />
        </button>

        {/* Story image */}
        <div className="relative">
          <img
            src={story.image}
            alt={story.name}
            className="w-full h-72 object-cover rounded-t-2xl shadow-lg"
          />
          <div className="absolute bottom-2 left-3 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
            @{story.name}
          </div>
        </div>

        {/* Code snippet if available */}
        {story.code && (
          <div className="px-4 py-3 bg-[#14161a]/90">
            <pre className="text-xs text-green-400 font-mono overflow-x-auto p-2 bg-black/30 rounded-lg">
              {story.code}
            </pre>
          </div>
        )}

        {/* Like and Comment Section */}
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={handleLike}
            className={cn(
              "flex items-center gap-1 hover:scale-110 transition-transform",
              isLiked ? "text-red-500" : "text-gray-300"
            )}
          >
            <Heart
              size={22}
              fill={isLiked ? "red" : "none"}
              className="transition-transform duration-200 active:scale-125"
            />
            <span className="text-sm">{likes}</span>
          </button>
          <span className="text-xs text-gray-400">
            {comments.length} comments
          </span>
        </div>

        {/* Comment Input (Telegram style) */}
        <form
          onSubmit={handleCommentSubmit}
          className="px-3 py-2 flex items-center border-t border-white/10 bg-[#16181d]/60"
        >
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Send a message..."
            className="flex-1 bg-transparent text-sm px-3 py-2 text-white outline-none placeholder-gray-500"
          />
          <button
            type="submit"
            className="p-2 hover:bg-white/10 rounded-full transition"
          >
            <Send size={18} className="text-blue-400" />
          </button>
        </form>

        {/* Comment List */}
        {comments.length > 0 && (
          <div className="px-4 py-3 max-h-40 overflow-y-auto space-y-2 bg-[#14161a]/70 border-t border-white/5">
            {comments.map((c, index) => (
              <div
                key={index}
                className="bg-[#22242a] text-sm px-3 py-2 rounded-xl text-gray-200 shadow-sm"
              >
                <span className="text-blue-400 font-medium">you_dev:</span>{" "}
                {c}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DevStoryViewer;
