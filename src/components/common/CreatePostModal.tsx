import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Video, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { mediaUrl: string; caption: string; type: 'image' | 'video' }) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [mediaUrl, setMediaUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setMediaUrl(url);
      setMediaType(file.type.startsWith('video') ? 'video' : 'image');
    }
  };

  const handleSubmit = () => {
    if (!mediaUrl.trim()) return;
    onSubmit({ mediaUrl, caption, type: mediaType });
    setMediaUrl('');
    setCaption('');
    setPreviewUrl(null);
    onClose();
  };

  const handleClose = () => {
    setMediaUrl('');
    setCaption('');
    setPreviewUrl(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground">
            <X size={24} />
          </button>
          <h2 className="font-semibold">Create Post</h2>
          <button
            onClick={handleSubmit}
            disabled={!mediaUrl}
            className={cn(
              'font-semibold text-primary',
              !mediaUrl && 'opacity-50 cursor-not-allowed'
            )}
          >
            Share
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Media preview or upload */}
          {previewUrl ? (
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden mb-4">
              {mediaType === 'image' ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <video src={previewUrl} className="w-full h-full object-cover" controls />
              )}
              <button
                onClick={() => {
                  setPreviewUrl(null);
                  setMediaUrl('');
                }}
                className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square bg-muted rounded-lg flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-muted/80 transition-colors mb-4"
            >
              <div className="flex gap-4">
                <ImageIcon size={48} className="text-muted-foreground" />
                <Video size={48} className="text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Click to upload media</p>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* URL input as alternative */}
          <input
            type="text"
            placeholder="Or paste media URL..."
            value={mediaUrl.startsWith('blob:') ? '' : mediaUrl}
            onChange={(e) => {
              setMediaUrl(e.target.value);
              setPreviewUrl(e.target.value);
            }}
            className="w-full px-4 py-3 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 mb-4"
          />

          {/* Caption */}
          <textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full px-4 py-3 bg-muted rounded-lg text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>
    </div>
  );
};

// Add Story Modal
interface AddStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (mediaUrl: string) => void;
}

export const AddStoryModal: React.FC<AddStoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [mediaUrl, setMediaUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setMediaUrl(url);
    }
  };

  const handleSubmit = () => {
    if (!mediaUrl.trim()) return;
    onSubmit(mediaUrl);
    setMediaUrl('');
    setPreviewUrl(null);
    onClose();
  };

  const handleClose = () => {
    setMediaUrl('');
    setPreviewUrl(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card w-full max-w-sm rounded-2xl shadow-xl animate-scale-in">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground">
            <X size={24} />
          </button>
          <h2 className="font-semibold">Add Story</h2>
          <button
            onClick={handleSubmit}
            disabled={!mediaUrl}
            className={cn(
              'font-semibold text-primary',
              !mediaUrl && 'opacity-50 cursor-not-allowed'
            )}
          >
            Share
          </button>
        </div>

        <div className="p-4">
          {previewUrl ? (
            <div className="relative aspect-[9/16] bg-muted rounded-lg overflow-hidden mb-4 max-h-80">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              <button
                onClick={() => {
                  setPreviewUrl(null);
                  setMediaUrl('');
                }}
                className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="aspect-[9/16] bg-muted rounded-lg flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-muted/80 transition-colors mb-4 max-h-80"
            >
              <ImageIcon size={48} className="text-muted-foreground" />
              <p className="text-muted-foreground text-sm">Click to upload story</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <input
            type="text"
            placeholder="Or paste image URL..."
            value={mediaUrl.startsWith('blob:') ? '' : mediaUrl}
            onChange={(e) => {
              setMediaUrl(e.target.value);
              setPreviewUrl(e.target.value);
            }}
            className="w-full px-4 py-3 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
