"use client"

import { HomeView } from "./views/home-view"
import { LibraryView } from "./views/library-view"
import { LikedSongsView } from "./views/liked-songs-view"
import { RecentlyPlayedView } from "./views/recently-played-view"
import { PlaylistView } from "./views/playlist-view"
import { AIClassificationView } from "./views/ai-classification-view"

interface MainContentProps {
  currentView: string
  currentTrack: any
  onTrackSelect: (track: any) => void
}

export function MainContent({ currentView, currentTrack, onTrackSelect }: MainContentProps) {
  const renderView = () => {
    switch (currentView) {
      case "home":
        return <HomeView currentTrack={currentTrack} onTrackSelect={onTrackSelect} />
      case "library":
        return <LibraryView onTrackSelect={onTrackSelect} />
      case "liked":
        return <LikedSongsView onTrackSelect={onTrackSelect} />
      case "recent":
        return <RecentlyPlayedView onTrackSelect={onTrackSelect} />
      case "ai-classification":
        return <AIClassificationView onTrackSelect={onTrackSelect} />
      case "playlist-1":
      case "playlist-2":
      case "playlist-3":
      case "playlist-4":
        return <PlaylistView playlistId={currentView} onTrackSelect={onTrackSelect} />
      default:
        return <HomeView currentTrack={currentTrack} onTrackSelect={onTrackSelect} />
    }
  }

  return <div className="flex-1 overflow-y-auto bg-gradient-to-b from-transparent to-black/20">{renderView()}</div>
}
