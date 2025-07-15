"use client"

import { useRef } from "react"
import { TrackCard } from "../music/track-card"
import { PlaylistCard } from "../music/playlist-card"
import { Track } from "@/types"
import { recentlyPlayedTracks } from "@/data/mock/tracks"
import { aiRecommendations } from "@/data/mock/playlists"
import { Playlist } from "@/types"

interface HomeViewProps {
  currentTrack: Track
  onViewChangeAction: (view: string) => void
  onTrackSelectAction: (track: Track) => void
}

export function HomeView({ currentTrack, onViewChangeAction, onTrackSelectAction }: HomeViewProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const fetchAndPlayTrack = async (track: Track) => {
    try {
      const response = await fetch(
        `http://localhost:8000/get_song?title=${encodeURIComponent(track.title)}&artist=${encodeURIComponent(track.artist)}`
      )
      if (!response.ok) throw new Error("Failed to fetch track info")

      const spotifyData = await response.json()
      console.log("🎵 Spotify Data:", spotifyData)

      onTrackSelectAction(track)


      if (!spotifyData.preview_url) {
  const confirmOpen = confirm("No preview available. Open full song in Spotify?")
  if (confirmOpen) {
    window.open(spotifyData.spotify_url, "_blank")
  }
}

      // Update current track
    } catch (error) {
      console.error("❌ Error fetching or playing track:", error)
    }
  }

  const handlePlaylistPlay = (playlist: Playlist) => {
    if (playlist.tracks.length > 0) {
      fetchAndPlayTrack(playlist.tracks[0])
    }
  }

  const handlePlaylistClick = (playlistId: string) => {
    onViewChangeAction(playlistId)
  }

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
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recently Played</h2>
          {recentlyPlayedTracks.length > 10 && (
            <button
              className="text-sm text-white-400 hover:underline cursor-pointer focus:outline-none"
              onClick={() => onViewChangeAction("recent")}
            >
              Show all
            </button>
          )}
        </div>
        <div className="overflow-x-auto scrollbar-hidden">
          <div className="flex gap-4 min-w-[600px]">
            {recentlyPlayedTracks.concat(recentlyPlayedTracks).slice(0, 10).map((track) => (
              <div key={track.id} className="w-48 flex-shrink-0">
                <TrackCard
                  track={track}
                  isPlaying={currentTrack?.id === track.id}
                  onPlayAction={() => fetchAndPlayTrack(track)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">AI Recommendations</h2>
        <div className="overflow-x-auto scrollbar-hidden">
          <div className="flex gap-4 min-w-[600px]">
            {aiRecommendations.map((playlist) => (
              <div key={playlist.id} onClick={() => handlePlaylistClick(playlist.id)} className="w-64 flex-shrink-0">
                <PlaylistCard
                  playlist={playlist}
                  onPlayAction={() => handlePlaylistPlay(playlist)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-6 hover:from-purple-600/30 hover:to-pink-600/30 transition-all cursor-pointer"
            onClick={() => onViewChangeAction("ai-classification")}
          >
            <h3 className="text-xl font-semibold mb-2">Analyze New Music</h3>
            <p className="text-white/60 mb-4">Upload or record music to get AI-powered genre and mood analysis</p>
            <div className="text-purple-300 text-sm font-medium">Try AI Classification →</div>
          </div>
          <div
            className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer"
            onClick={() => onViewChangeAction("create-playlist")}
          >
            <h3 className="text-xl font-semibold mb-2">Create Playlist</h3>
            <p className="text-white/60 mb-4">Build custom playlists based on your favorite genres and moods</p>
            <div className="text-white/70 text-sm font-medium">Get Started →</div>
          </div>
        </div>
      </section>
    </div>
  )
}
