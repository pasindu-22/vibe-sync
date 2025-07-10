"use client"

import { Play, MoreHorizontal } from "lucide-react"
import { TrackCard } from "../music/track-card"

interface PlaylistViewProps {
  playlistId: string
  onTrackSelect: (track: any) => void
}

const mockPlaylistData = {
  "playlist-1": {
    name: "Chill Vibes",
    description: "Perfect for relaxing and unwinding",
    cover: "/placeholder.svg?height=300&width=300",
    tracks: [
      {
        id: "1",
        title: "Weightless",
        artist: "Marconi Union",
        album: "Ambient",
        duration: "8:10",
        cover: "/placeholder.svg?height=300&width=300",
        genre: "Ambient",
        mood: "Calm",
      },
      {
        id: "2",
        title: "Clair de Lune",
        artist: "Claude Debussy",
        album: "Classical",
        duration: "4:30",
        cover: "/placeholder.svg?height=300&width=300",
        genre: "Classical",
        mood: "Peaceful",
      },
    ],
  },
  "playlist-2": {
    name: "Workout Mix",
    description: "High energy tracks for your workout",
    cover: "/placeholder.svg?height=300&width=300",
    tracks: [
      {
        id: "3",
        title: "Eye of the Tiger",
        artist: "Survivor",
        album: "Eye of the Tiger",
        duration: "4:05",
        cover: "/placeholder.svg?height=300&width=300",
        genre: "Rock",
        mood: "Energetic",
      },
      {
        id: "4",
        title: "Stronger",
        artist: "Kanye West",
        album: "Graduation",
        duration: "5:12",
        cover: "/placeholder.svg?height=300&width=300",
        genre: "Hip Hop",
        mood: "Motivational",
      },
    ],
  },
}

export function PlaylistView({ playlistId, onTrackSelect }: PlaylistViewProps) {
  const playlist = mockPlaylistData[playlistId as keyof typeof mockPlaylistData]

  if (!playlist) {
    return (
      <div className="p-6">
        <p className="text-white/60">Playlist not found</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-end gap-6">
        <img
          src={playlist.cover || "/placeholder.svg"}
          alt={playlist.name}
          className="w-48 h-48 rounded-lg object-cover"
        />
        <div className="space-y-2">
          <p className="text-sm text-white/60 uppercase tracking-wide">Playlist</p>
          <h1 className="text-5xl font-bold">{playlist.name}</h1>
          <p className="text-white/60">{playlist.description}</p>
          <div className="flex items-center gap-2 text-white/60">
            <span>{playlist.tracks.length} songs</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform">
          <Play className="w-6 h-6 text-black ml-1" />
        </button>
        <button className="p-2 text-white/60 hover:text-white transition-colors">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>

      {/* Songs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {playlist.tracks.map((track) => (
          <TrackCard key={track.id} track={track} onPlay={() => onTrackSelect(track)} />
        ))}
      </div>
    </div>
  )
}
