"use client"

import { HomeView } from "./views/home-view"
import { LibraryView } from "./views/library-view"
import { LikedSongsView } from "./views/liked-songs-view"
import { RecentlyPlayedView } from "./views/recently-played-view"
import { PlaylistView } from "./views/playlist-view"
import { AIClassificationView } from "./views/ai-classification-view"
import { Track } from "@/types"

interface MainContentProps {
  currentView: string
  currentTrack: Track
  onViewChangeAction: (view: string) => void
  onTrackSelectAction: (track: Track) => void
}

export function MainContent({ currentView, currentTrack, onViewChangeAction, onTrackSelectAction }: MainContentProps) {

  const renderView = () => {
    switch (currentView) {
      case "home":
        return <HomeView currentTrack={currentTrack} onViewChangeAction={onViewChangeAction} onTrackSelectAction={onTrackSelectAction} />
      case "library":
        return <LibraryView onTrackSelectAction={onTrackSelectAction} onViewChangeAction={onViewChangeAction} />
      case "liked":
        return <LikedSongsView onTrackSelect={onTrackSelectAction} />
      case "recent":
        return <RecentlyPlayedView onTrackSelect={onTrackSelectAction} />
      case "ai-classification":
        return <AIClassificationView onTrackSelect={onTrackSelectAction} />
      default:
        // Check if it's a playlist view (starts with "playlist-")
        if (currentView.startsWith("playlist-")) {
          return <PlaylistView playlistId={currentView} onTrackSelectAction={onTrackSelectAction} />
        }
        // Default to home view
        return <HomeView currentTrack={currentTrack} onViewChangeAction={onViewChangeAction} onTrackSelectAction={onTrackSelectAction} />
    }
  }

  return <div className="flex-1 overflow-y-auto bg-gradient-to-b from-transparent to-black/20 scrollbar-hidden">{renderView()}</div>
}
