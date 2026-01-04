import React, { useState } from "react";
import { Plus, Code2 } from "lucide-react";
import DevStoryViewer from "./DevStoryViewer";
import CreateStory from "./CreateStory";
import { cn } from "@/lib/utils";

export interface DevStory {
  id: number;
  name: string;
  image: string;
  code?: string;
  isAdd?: boolean;
}

interface DevStoriesProps {
  stories?: DevStory[];
  onAddStory?: (story: DevStory) => void;
}

const DevStories: React.FC<DevStoriesProps> = ({ 
  stories: externalStories,
  onAddStory: externalAddStory 
}) => {
  const [stories, setStories] = useState<DevStory[]>(externalStories || [
    { id: 1, name: "Your Update", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&h=200&fit=crop", isAdd: true },
    { id: 2, name: "alex_dev", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200&h=200&fit=crop", code: "function sum(a,b){return a+b;}" },
    { id: 3, name: "sarah_js", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&h=200&fit=crop", code: "const greet = () => console.log('Hello World!')" },
    { id: 4, name: "john_ai", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&h=200&fit=crop", code: "let model = trainAI(data);" },
    { id: 5, name: "emma_py", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&h=200&fit=crop", code: "def hello(): return 'World'" },
  ]);

  const [activeStory, setActiveStory] = useState<DevStory | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleAddStory = (newStory: DevStory) => {
    setStories([stories[0], newStory, ...stories.slice(1)]);
    setIsCreateOpen(false);
    externalAddStory?.(newStory);
  };

  return (
    <div
      className="flex items-center gap-5 overflow-x-auto px-5 py-4 bg-card border-b border-border scrollbar-hide"
    >
      {stories.map((story) => (
        <div
          key={story.id}
          className="flex flex-col items-center cursor-pointer transition-transform hover:scale-105 flex-shrink-0"
        >
          <div
            className={cn(
              "relative group p-[2px] rounded-lg",
              story.isAdd
                ? "bg-gradient-to-tr from-muted to-muted-foreground/30"
                : "bg-gradient-to-tr from-primary via-purple-500 to-pink-500"
            )}
            onClick={() =>
              story.isAdd ? setIsCreateOpen(true) : setActiveStory(story)
            }
          >
            {/* Story square image */}
            <div className="w-20 h-20 bg-card flex items-center justify-center overflow-hidden rounded-lg">
              <img
                src={story.image}
                alt={story.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute bottom-0 right-0 translate-x-1 translate-y-1">
              {story.isAdd ? (
                <div className="bg-primary rounded-md p-1 text-primary-foreground border-2 border-background">
                  <Plus size={13} />
                </div>
              ) : (
                <div className="bg-purple-600 rounded-md p-1 text-white border-2 border-background">
                  <Code2 size={13} />
                </div>
              )}
            </div>
          </div>

          <p className="text-[11px] mt-2 text-muted-foreground text-center w-20 truncate">
            {story.name}
          </p>
        </div>
      ))}

      {/* Story viewer modal */}
      {activeStory && (
        <DevStoryViewer story={activeStory} onClose={() => setActiveStory(null)} />
      )}

      {/* Create story modal */}
      {isCreateOpen && (
        <CreateStory
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleAddStory}
        />
      )}
    </div>
  );
};

export default DevStories;
