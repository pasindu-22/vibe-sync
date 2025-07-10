"use client"

import { Heart, Play, Clock } from "lucide-react"
import { TrackCard } from "../music/track-card"

interface LikedSongsViewProps {
  onTrackSelect: (track: any) => void
}

const mockLikedSongs = [
  {
    id: "1",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    duration: "5:55",
    cover: "/placeholder.svg?height=300&width=300",
    genre: "Rock",
    mood: "Epic",
    likedAt: "2 days ago",
  },
  {
    id: "4",
    title: "Shape of You",
    artist: "Ed Sheeran",
    album: "÷ (Divide)",
    duration: "3:53",
    cover: "/placeholder.svg?height=300&width=300",
    genre: "Pop",
    mood: "Happy",
    likedAt: "1 week ago",
  },
  {
    id: "5",
    title: "Stairway to Heaven",
    artist: "Led Zeppelin",
    album: "Led Zeppelin IV",
    duration: "8:02",
    cover: "/placeholder.svg?height=300&width=300",
    genre: "Rock",
    mood: "Epic",
    likedAt: "2 weeks ago",
  },
]

export function LikedSongsView({ onTrackSelect }: LikedSongsViewProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-end gap-6">
        <div className="w-48 h-48 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Heart className="w-24 h-24 text-white fill-current" />
        </div>
        <div className="space-y-2">
          <p className="text-sm text-white/60 uppercase tracking-wide">Playlist</p>
          <h1 className="text-5xl font-bold">Liked Songs</h1>
          <div className="flex items-center gap-2 text-white/60">
            <span>{mockLikedSongs.length} songs</span>
            <span>•</span>
            <span>About 18 min</span>
          </div>
        </div>
      </div>

      {/* Play Button */}
      <div className="flex items-center gap-4">
        <button className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform">
          <Play className="w-6 h-6 text-black ml-1" />
        </button>
      </div>

      {/* Songs List */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockLikedSongs.map((track) => (
            <div key={track.id} className="space-y-2">
              <TrackCard track={track} onPlay={() => onTrackSelect(track)} />
              <div className="flex items-center gap-1 text-xs text-white/50 px-4">
                <Clock className="w-3 h-3" />
                <span>Liked {track.likedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
