"use client"

import { TrackCard } from "../music/track-card"
import { PlaylistCard } from "../music/playlist-card"
import { Track } from "@/types"

interface HomeViewProps {
  currentTrack: Track
  onTrackSelectAction: (track: Track) => void
}

const mockRecentTracks = [
  {
    id: "1",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    duration: 355,
    cover: "/placeholder.svg?height=300&width=300",
    genre: "Rock",
    mood: "Epic",
    isPlaying: false,
  },
  {
    id: "2",
    title: "Billie Jean",
    artist: "Michael Jackson",
    album: "Thriller",
    duration: 294,
    cover: "/placeholder.svg?height=300&width=300",
    genre: "Pop",
    mood: "Energetic",
    isPlaying: false,
  },
  {
    id: "3",
    title: "Hotel California",
    artist: "Eagles",
    album: "Hotel California",
    duration: 390,
    cover: "/placeholder.svg?height=300&width=300",
    genre: "Rock",
    mood: "Mysterious",
    isPlaying: false,
  },
  {
    id: "4",
    title: "Shape of You",
    artist: "Ed Sheeran",
    album: "÷ (Divide)",
    duration: 233,
    cover: "/placeholder.svg?height=300&width=300",
    genre: "Pop",
    mood: "Happy",
    isPlaying: false,
  },
]

const mockPlaylists = [
  {
    id: "discover-1",
    name: "AI Discovered",
    description: "Songs our AI thinks you'll love",
    cover: "/placeholder.svg?height=300&width=300",
    trackCount: 25,
  },
  {
    id: "mood-1",
    name: "Chill Mood Mix",
    description: "Perfect for relaxing",
    cover: "/placeholder.svg?height=300&width=300",
    trackCount: 18,
  },
  {
    id: "genre-1",
    name: "Rock Essentials",
    description: "Classic rock hits",
    cover: "/placeholder.svg?height=300&width=300",
    trackCount: 32,
  },
]

export function HomeView({ currentTrack, onTrackSelectAction }: HomeViewProps) {
  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
          Welcome back
        </h1>
        <p className="text-white/60">Discover new music with AI-powered recommendations</p>
      </div>

      {/* Recently Played */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Recently Played</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockRecentTracks.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              isPlaying={currentTrack?.id === track.id}
              onPlayAction={() => onTrackSelectAction(track)}
            />
          ))}
        </div>
      </section>

      {/* AI Recommendations */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">AI Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockPlaylists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} onPlay={() => {}} />
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-6 hover:from-purple-600/30 hover:to-pink-600/30 transition-all cursor-pointer">
            <h3 className="text-xl font-semibold mb-2">Analyze New Music</h3>
            <p className="text-white/60 mb-4">Upload or record music to get AI-powered genre and mood analysis</p>
            <div className="text-purple-300 text-sm font-medium">Try AI Classification →</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer">
            <h3 className="text-xl font-semibold mb-2">Create Playlist</h3>
            <p className="text-white/60 mb-4">Build custom playlists based on your favorite genres and moods</p>
            <div className="text-white/70 text-sm font-medium">Get Started →</div>
          </div>
        </div>
      </section>
    </div>
  )
}
