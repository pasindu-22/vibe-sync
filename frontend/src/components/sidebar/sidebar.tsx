"use client"

import { Home, Music, Heart, Clock, Sparkles, User, List, X } from "lucide-react"
import { SidebarItem } from "./sidebar-item"
import { PlaylistSection } from "./playlist-section"
import { ProfilePopup } from "./profile-popup"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  currentView: string
  onViewChangeAction: (view: string) => void
  isExpanded: boolean
  onToggleExpandedAction: (expanded: boolean) => void
}

export function Sidebar({ currentView, onViewChangeAction, isExpanded, onToggleExpandedAction }: SidebarProps) {
  const [showPlaylists, setShowPlaylists] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const mainItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "library", icon: Music, label: "Your Library" },
    { id: "liked", icon: Heart, label: "Liked Songs" },
    { id: "recent", icon: Clock, label: "Recently Played" },
    { id: "ai-classification", icon: Sparkles, label: "AI Classification" },
  ]

  const handlePlaylistClick = () => {
    if (!isExpanded) {
      onToggleExpandedAction(true)
      setShowPlaylists(true)
    } else {
      setShowPlaylists(!showPlaylists)
    }
  }

  return (
    <div
      className={`${isExpanded ? "w-64" : "w-16"} bg-black/20 backdrop-blur-xl border-r border-white/10 flex flex-col transition-all duration-300`}
    >
      {/* Header with Logo and Collapse Button */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Music className="w-5 h-5" />
          </div>
          {isExpanded && <span className="font-bold text-xl">VibeSync</span>}
        </div>

        {isExpanded && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleExpandedAction(false)}
            className="text-white/60 hover:text-white hover:bg-white/10 w-8 h-8"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Main Navigation */}
      <div className="flex-1 p-2 space-y-1">
        {mainItems.map((item) => (
          <SidebarItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={currentView === item.id}
            onClick={() => onViewChangeAction(item.id)}
            showLabel={isExpanded}
            isAI={item.id === "ai-classification"}
          />
        ))}

        {/* Playlist Button */}
        <SidebarItem
          icon={List}
          label="Playlists"
          onClick={handlePlaylistClick}
          showLabel={isExpanded}
          hasChevron={isExpanded}
          isExpanded={showPlaylists}
        />

        {/* Playlists Section */}
        {isExpanded && showPlaylists && <PlaylistSection onPlaylistSelectAction={onViewChangeAction} />}
      </div>

      {/* User Profile */}
      {/* 
        When the sidebar is expanded, the profile popup appears over the main content area.
        This can cause conflicts with the main content component and the music player below.
        To avoid this, we can conditionally render the profile popup only when the sidebar is expanded.
        TODO: Consider using a portal or modal for the profile popup to avoid layout issues.
      */}
      {isExpanded && (
        <div className="p-2 border-t border-white/10 relative">
          <SidebarItem icon={User} label="Profile" onClick={() => setShowProfile(!showProfile)} showLabel={isExpanded} />
          {showProfile && <ProfilePopup isExpanded={isExpanded} onCloseAction={() => setShowProfile(false)} />}
        </div>
      )}

    </div>
  )
}
