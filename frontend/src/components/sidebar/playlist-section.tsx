"use client"

import { Music } from "lucide-react"

interface PlaylistSectionProps {
  onPlaylistSelectAction: (playlistId: string) => void
}

const mockPlaylists = [
  { id: "playlist-1", name: "Chill Vibes", trackCount: 24 },
  { id: "playlist-2", name: "Workout Mix", trackCount: 18 },
  { id: "playlist-3", name: "Study Focus", trackCount: 32 },
  { id: "playlist-4", name: "Road Trip", trackCount: 45 },
  { id: "playlist-5", name: "Party Hits", trackCount: 20 },
  { id: "playlist-6", name: "Indie Favorites", trackCount: 15 },
  { id: "playlist-7", name: "Classic Rock Anthems", trackCount: 30 },
  { id: "playlist-8", name: "Jazz Essentials", trackCount: 12 },
]

export function PlaylistSection({ onPlaylistSelectAction }: PlaylistSectionProps) {
  return (
    <div
      className="ml-4 mt-2 space-y-1 border-l border-white/10 pl-4 scrollbar-hidden"
      style={{
        maxHeight: `${4 * 48}px`,
        overflowY: mockPlaylists.length > 4 ? "auto" : "visible",
      }}
    >
      {mockPlaylists.map((playlist) => (
        <button
          key={playlist.id}
          onClick={() => onPlaylistSelectAction(playlist.id)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left group"
        >
          <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center flex-shrink-0">
            <Music className="w-3 h-3 text-white/70" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate">{playlist.name}</p>
            <p className="text-xs text-white/50">{playlist.trackCount} songs</p>
          </div>
        </button>
      ))}
    </div>
  )
}
