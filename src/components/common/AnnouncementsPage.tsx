import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Plus,
  Search,
  MapPin,
  Clock,
  Eye,
  Briefcase,
  Wrench,
  Calendar,
  MoreHorizontal,
  X,
  Send,
} from 'lucide-react';
import { Announcement, announcementService } from '@/services/announcement.service';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface AnnouncementsPageProps {
  onBack: () => void;
  onUserClick: (userId: string) => void;
}

type Category = 'all' | Announcement['category'];

const categoryIcons: Record<Announcement['category'], React.ReactNode> = {
  job: <Briefcase size={16} />,
  service: <Wrench size={16} />,
  event: <Calendar size={16} />,
  other: <MoreHorizontal size={16} />,
};

const categoryLabels: Record<Announcement['category'], string> = {
  job: 'Ish',
  service: 'Xizmat',
  event: 'Tadbir',
  other: 'Boshqa',
};

export const AnnouncementsPage: React.FC<AnnouncementsPageProps> = ({ onBack, onUserClick }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'job' as Announcement['category'],
    contactInfo: '',
    price: '',
    location: '',
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    setIsLoading(true);
    try {
      const data = await announcementService.getAnnouncements();
      setAnnouncements(data);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAnnouncements = announcements.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || a.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateAnnouncement = async () => {
    if (!formData.title.trim() || !formData.content.trim() || !formData.contactInfo.trim()) {
      toast({
        title: 'Xatolik',
        description: 'Barcha majburiy maydonlarni to\'ldiring',
        variant: 'destructive',
      });
      return;
    }

    try {
      await announcementService.createAnnouncement({
        title: formData.title,
        content: formData.content,
        category: formData.category,
        contactInfo: formData.contactInfo,
        price: formData.price || undefined,
        location: formData.location || undefined,
      });

      toast({
        title: 'Muvaffaqiyat!',
        description: 'E\'lon yaratildi',
      });

      setShowCreateModal(false);
      setFormData({
        title: '',
        content: '',
        category: 'job',
        contactInfo: '',
        price: '',
        location: '',
      });
      loadAnnouncements();
    } catch {
      toast({
        title: 'Xatolik',
        description: 'E\'lon yaratishda xatolik yuz berdi',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold">E'lonlar</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="p-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="mt-3 flex items-center bg-muted rounded-lg px-3 py-2">
          <Search size={18} className="text-muted-foreground mr-2" />
          <input
            type="text"
            placeholder="Qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent flex-1 outline-none text-foreground placeholder:text-muted-foreground text-sm"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveCategory('all')}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
              activeCategory === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            )}
          >
            Hammasi
          </button>
          {(['job', 'service', 'event', 'other'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-1.5 transition-colors',
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              {categoryIcons[cat]}
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
      </header>

      {/* Announcements list */}
      <div className="p-4 space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 animate-pulse">
                <div className="h-5 bg-muted rounded w-3/4 mb-3" />
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>E'lonlar topilmadi</p>
          </div>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              onClick={() => setSelectedAnnouncement(announcement)}
              className="bg-card border border-border rounded-xl p-4 cursor-pointer hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1',
                    announcement.category === 'job' && 'bg-blue-500/20 text-blue-500',
                    announcement.category === 'service' && 'bg-green-500/20 text-green-500',
                    announcement.category === 'event' && 'bg-purple-500/20 text-purple-500',
                    announcement.category === 'other' && 'bg-gray-500/20 text-gray-500'
                  )}
                >
                  {categoryIcons[announcement.category]}
                  {categoryLabels[announcement.category]}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Eye size={12} /> {announcement.views}
                </span>
              </div>

              <h3 className="font-semibold text-foreground mb-1">{announcement.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{announcement.content}</p>

              <div className="flex items-center justify-between mt-3">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUserClick(announcement.author.id);
                  }}
                >
                  <img
                    src={announcement.author.avatar}
                    alt={announcement.author.displayName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-xs text-muted-foreground">@{announcement.author.username}</span>
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock size={12} />
                  {formatDistanceToNow(new Date(announcement.createdAt), { addSuffix: true })}
                </span>
              </div>

              {(announcement.price || announcement.location) && (
                <div className="flex gap-3 mt-2 pt-2 border-t border-border">
                  {announcement.price && (
                    <span className="text-sm font-medium text-primary">{announcement.price}</span>
                  )}
                  {announcement.location && (
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin size={12} /> {announcement.location}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-end sm:items-center z-50 p-4">
          <div className="bg-card w-full max-w-md rounded-2xl p-5 shadow-xl animate-slide-up sm:animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Yangi e'lon</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">
                  Kategoriya
                </label>
                <div className="flex gap-2 flex-wrap">
                  {(['job', 'service', 'event', 'other'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFormData({ ...formData, category: cat })}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 transition-colors',
                        formData.category === cat
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {categoryIcons[cat]}
                      {categoryLabels[cat]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">
                  Sarlavha *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="E'lon sarlavhasi"
                  className="w-full border border-border bg-background rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">
                  Tavsif *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="E'lon matni..."
                  rows={4}
                  className="w-full border border-border bg-background rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">
                  Aloqa *
                </label>
                <input
                  type="text"
                  value={formData.contactInfo}
                  onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                  placeholder="@username yoki telefon"
                  className="w-full border border-border bg-background rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    Narx
                  </label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="$1000"
                    className="w-full border border-border bg-background rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    Joylashuv
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Tashkent"
                    className="w-full border border-border bg-background rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <button
                onClick={handleCreateAnnouncement}
                className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Send size={18} /> E'lon joylash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Announcement Detail Modal */}
      {selectedAnnouncement && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-end sm:items-center z-50 p-4"
          onClick={() => setSelectedAnnouncement(null)}
        >
          <div
            className="bg-card w-full max-w-md rounded-2xl p-5 shadow-xl animate-slide-up sm:animate-scale-in max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1',
                  selectedAnnouncement.category === 'job' && 'bg-blue-500/20 text-blue-500',
                  selectedAnnouncement.category === 'service' && 'bg-green-500/20 text-green-500',
                  selectedAnnouncement.category === 'event' && 'bg-purple-500/20 text-purple-500',
                  selectedAnnouncement.category === 'other' && 'bg-gray-500/20 text-gray-500'
                )}
              >
                {categoryIcons[selectedAnnouncement.category]}
                {categoryLabels[selectedAnnouncement.category]}
              </span>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <h2 className="text-xl font-bold mb-3">{selectedAnnouncement.title}</h2>
            <p className="text-foreground whitespace-pre-wrap">{selectedAnnouncement.content}</p>

            {(selectedAnnouncement.price || selectedAnnouncement.location) && (
              <div className="flex gap-4 mt-4 pt-4 border-t border-border">
                {selectedAnnouncement.price && (
                  <div>
                    <p className="text-xs text-muted-foreground">Narx</p>
                    <p className="font-semibold text-primary">{selectedAnnouncement.price}</p>
                  </div>
                )}
                {selectedAnnouncement.location && (
                  <div>
                    <p className="text-xs text-muted-foreground">Joylashuv</p>
                    <p className="font-medium flex items-center gap-1">
                      <MapPin size={14} /> {selectedAnnouncement.location}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">Muallif</p>
              <div
                className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-lg -mx-2 transition-colors"
                onClick={() => {
                  onUserClick(selectedAnnouncement.author.id);
                  setSelectedAnnouncement(null);
                }}
              >
                <img
                  src={selectedAnnouncement.author.avatar}
                  alt={selectedAnnouncement.author.displayName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{selectedAnnouncement.author.displayName}</p>
                  <p className="text-sm text-muted-foreground">@{selectedAnnouncement.author.username}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">Bog'lanish</p>
              <p className="font-medium text-primary">{selectedAnnouncement.contactInfo}</p>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye size={14} /> {selectedAnnouncement.views} ko'rildi
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {formatDistanceToNow(new Date(selectedAnnouncement.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsPage;
