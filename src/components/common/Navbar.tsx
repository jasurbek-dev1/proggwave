import React, { useState } from "react";
import { Users, Heart, Trophy, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  newFriendsCount?: number;
  likesCount?: number;
  onNewFriendsClick?: () => void;
  onLikesClick?: () => void;
  onTrophyClick?: () => void;
  onlineCount?: number;
}

const Navbar: React.FC<NavbarProps> = ({
  newFriendsCount = 0,
  likesCount = 0,
  onNewFriendsClick,
  onLikesClick,
  onTrophyClick,
  onlineCount = 1234,
}) => {
  const [openMenu, setOpenMenu] = useState(false);

  const hasNotifications = newFriendsCount > 0 || likesCount > 0;

  return (
    <nav className="w-full flex justify-between items-center px-6 py-3 border-b border-border bg-background/95 backdrop-blur-lg shadow-sm relative sticky top-0 z-40">
      {/* Left side — online users & trophy */}
      <div className="flex items-center gap-3">
        {/* 🏆 Trophy */}
        <button
          onClick={onTrophyClick}
          className="flex items-center gap-1 text-yellow-500 hover:text-yellow-600 transition"
        >
          <Trophy size={22} />
          <span className="text-sm font-semibold hidden sm:inline">Arena</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {onlineCount.toLocaleString()} <span className="text-primary">online</span>
          </span>
          <span className="w-2 h-2 bg-green-500 rounded-full ml-1 animate-pulse"></span>
        </div>
      </div>

      {/* Logo */}
      <h1 className="text-lg font-bold text-foreground tracking-wide gradient-text">
        ProggWave
      </h1>

      {/* Right side */}
      <div className="flex items-center gap-5 relative">
        {/* 🔔 Mobile bell button */}
        <div className="sm:hidden relative">
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="relative p-2 rounded-full hover:bg-muted transition"
          >
            <Bell size={26} className="text-foreground" />
            {hasNotifications && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></span>
            )}
          </button>

          {/* Dropdown menu */}
          {openMenu && (
            <div className="absolute right-0 top-10 bg-card border border-border rounded-xl shadow-lg w-36 z-50 py-2">
              <button
                onClick={() => {
                  setOpenMenu(false);
                  onNewFriendsClick?.();
                }}
                className="flex items-center gap-2 px-4 py-2 hover:bg-muted w-full text-left text-foreground"
              >
                <Users size={20} className="text-primary" />
                <span>Do'stlar</span>
                {newFriendsCount > 0 && (
                  <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 rounded-full">
                    {newFriendsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setOpenMenu(false);
                  onLikesClick?.();
                }}
                className="flex items-center gap-2 px-4 py-2 hover:bg-muted w-full text-left text-foreground"
              >
                <Heart size={20} className="text-destructive" />
                <span>Like'lar</span>
                {likesCount > 0 && (
                  <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-2 rounded-full">
                    {likesCount}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* 🖥️ Desktop icons */}
        <div className="hidden sm:flex items-center gap-5">
          {/* New friends */}
          <div
            className="relative cursor-pointer"
            onClick={onNewFriendsClick}
          >
            <Users size={28} className="text-primary" />
            {newFriendsCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {newFriendsCount}
              </span>
            )}
          </div>

          {/* Likes */}
          <div className="relative cursor-pointer" onClick={onLikesClick}>
            <Heart size={28} className="text-destructive" />
            {likesCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-destructive text-destructive-foreground text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {likesCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
