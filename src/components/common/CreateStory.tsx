import React, { useState } from "react";
import { X, Image as ImageIcon } from "lucide-react";
import { DevStory } from "./DevStories";
import { cn } from "@/lib/utils";

interface Props {
  onClose: () => void;
  onSubmit: (story: DevStory) => void;
}

const CreateStory: React.FC<Props> = ({ onClose, onSubmit }) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    const newStory: DevStory = {
      id: Date.now(),
      name: "You",
      image: image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&h=200&fit=crop",
      code: text || undefined,
    };
    onSubmit(newStory);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 animate-fade-in">
      <div className="bg-card rounded-2xl w-[90%] max-w-md p-5 relative border border-border shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-4 text-center text-foreground">Create Story</h2>

        <div className="flex flex-col items-center gap-4">
          {image ? (
            <img
              src={image}
              alt="preview"
              className="w-full h-48 object-cover rounded-lg"
            />
          ) : (
            <label className="w-full h-48 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition">
              <ImageIcon size={40} className="text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">Click to upload image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}

          {image && (
            <label className="text-sm text-primary cursor-pointer hover:underline">
              Change image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}

          <textarea
            placeholder="Write your code or note..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-muted text-foreground border border-border rounded-lg p-3 text-sm min-h-[100px] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          
          <button
            onClick={handleSubmit}
            disabled={!image && !text}
            className={cn(
              "w-full py-3 rounded-lg font-medium transition",
              image || text
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            Add Story
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateStory;
