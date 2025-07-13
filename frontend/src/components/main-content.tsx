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
  onTrackSelectAction: (track: Track) => void
}

export function MainContent({ currentView, currentTrack, onTrackSelectAction }: MainContentProps) {
  const renderView = () => {
    switch (currentView) {
      case "home":
        return <HomeView currentTrack={currentTrack} onTrackSelectAction={onTrackSelectAction} />
      case "library":
        return <LibraryView onTrackSelectAction={onTrackSelectAction} />
      case "liked":
        return <LikedSongsView onTrackSelectAction={onTrackSelectAction} />
      case "recent":
        return <RecentlyPlayedView onTrackSelectAction={onTrackSelectAction} />
      case "ai-classification":
        return <AIClassificationView onTrackSelectAction={onTrackSelectAction} />
      case "playlist-1":
      case "playlist-2":
      case "playlist-3":
      case "playlist-4":
        return <PlaylistView playlistId={currentView} onTrackSelectAction={onTrackSelectAction} />
      default:
        return <HomeView currentTrack={currentTrack} onTrackSelectAction={onTrackSelectAction} />
    }
  }

  return <div className="flex-1 overflow-y-auto bg-gradient-to-b from-transparent to-black/20">{renderView()}</div>
}
