"use client"

import { Clock, Play } from "lucide-react"
import { TrackCard } from "../music/track-card"

interface RecentlyPlayedViewProps {
  onTrackSelect: (track: any) => void
}

const mockRecentlyPlayed = [
  {
    id: "1",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    duration: "5:55",
    cover: "/placeholder.svg?height=300&width=300",
    genre: "Rock",
    mood: "Epic",
    playedAt: "2 hours ago",
  },
  {
    id: "2",
    title: "Billie Jean",
    artist: "Michael Jackson",
    album: "Thriller",
    duration: "4:54",
    cover: "/placeholder.svg?height=300&width=300",
    genre: "Pop",
    mood: "Energetic",
    playedAt: "5 hours ago",
  },
  {
    id: "3",
    title: "Hotel California",
    artist: "Eagles",
    album: "Hotel California",
    duration: "6:30",
    cover: "/placeholder.svg?height=300&width=300",
    genre: "Rock",
    mood: "Mysterious",
    playedAt: "1 day ago",
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
    playedAt: "2 days ago",
  },
]

export function RecentlyPlayedView({ onTrackSelect }: RecentlyPlayedViewProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-end gap-6">
        <div className="w-48 h-48 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
          <Clock className="w-24 h-24 text-white" />
        </div>
        <div className="space-y-2">
          <p className="text-sm text-white/60 uppercase tracking-wide">Your History</p>
          <h1 className="text-5xl font-bold">Recently Played</h1>
          <div className="flex items-center gap-2 text-white/60">
            <span>{mockRecentlyPlayed.length} songs</span>
            <span>•</span>
            <span>Last 7 days</span>
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
          {mockRecentlyPlayed.map((track) => (
            <div key={track.id} className="space-y-2">
              <TrackCard track={track} onPlay={() => onTrackSelect(track)} />
              <div className="flex items-center gap-1 text-xs text-white/50 px-4">
                <Clock className="w-3 h-3" />
                <span>Played {track.playedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
