import React from "react";
import { Home, Search, Plus, MessageCircle, User, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export type TabId = "home" | "search" | "create" | "chat" | "profile" | "elonlar";

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onRepostClick?: () => void;
  unreadMessages?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ 
  activeTab, 
  onTabChange, 
  onRepostClick,
  unreadMessages = 0,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border safe-bottom">
      <div className="flex justify-between items-center mx-auto h-16 px-6 w-full max-w-md md:max-w-3xl md:px-16 transition-all relative">
        <button
          onClick={() => onTabChange("home")}
          className={cn(
            "flex flex-col items-center justify-center gap-1 transition",
            activeTab === "home" ? "text-primary" : "text-muted-foreground hover:text-primary"
          )}
        >
          <Home size={26} />
        </button>

        <button
          onClick={() => onTabChange("search")}
          className={cn(
            "flex flex-col items-center justify-center gap-1 transition",
            activeTab === "search" ? "text-primary" : "text-muted-foreground hover:text-primary"
          )}
        >
          <Search size={26} />
        </button>

        {/* + Button */}
        <div className="absolute inset-x-0 -top-7 flex justify-center pointer-events-none">
          <div className="relative pointer-events-auto">
            <button
              onClick={() => onTabChange("create")}
              className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center shadow-xl hover:scale-110 transition"
            >
              <Plus size={32} />
            </button>

            {/* Repost / Elonlar button */}
            <div
              className="absolute -bottom-3 -right-3 bg-gradient-to-br from-primary to-primary/80 rounded-full p-1.5 shadow-md flex items-center justify-center border-2 border-background cursor-pointer hover:scale-110 transition"
              onClick={onRepostClick}
            >
              <RefreshCcw size={20} className="text-primary-foreground" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        <button
          onClick={() => onTabChange("chat")}
          className={cn(
            "flex flex-col items-center justify-center gap-1 transition relative",
            activeTab === "chat" ? "text-primary" : "text-muted-foreground hover:text-primary"
          )}
        >
          <MessageCircle size={26} />
          {unreadMessages > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center px-1">
              {unreadMessages > 99 ? "99+" : unreadMessages}
            </span>
          )}
        </button>

        <button
          onClick={() => onTabChange("profile")}
          className={cn(
            "flex flex-col items-center justify-center gap-1 transition",
            activeTab === "profile" ? "text-primary" : "text-muted-foreground hover:text-primary"
          )}
        >
          <User size={26} />
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
