"use client"

import { Filter } from "lucide-react"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { PlaylistCard } from "../music/playlist-card"
import { Track, Playlist } from "@/types"
import { mockPlaylists } from "@/data/mock/playlists"

interface LibraryViewProps {
  onTrackSelectAction: (track: Track) => void
  onViewChangeAction: (view: string) => void
}

export function LibraryView({ onTrackSelectAction, onViewChangeAction }: LibraryViewProps) {
  const [genreFilter, setGenreFilter] = useState<string>("all")
  const [moodFilter, setMoodFilter] = useState<string>("all")

  const genres = ["all", "disco", "metal", "reggae", "blues", "rock", "classical", "jazz", "hiphop", "country", "pop", "soul", "alternative", "grunge"]
  const moods = ["all", "energetic", "happy", "melancholic", "epic", "groovy", "chill", "dark", "romantic", "powerful", "rebellious", "peaceful", "nostalgic", "intense", "soulful", "sophisticated", "motivational", "uplifting", "elegant"]

  // Filter playlists based on their tracks' genres and moods
  const filteredPlaylists = useMemo(() => {
    return mockPlaylists.filter((playlist: Playlist) => {
      if (genreFilter === "all" && moodFilter === "all") return true
      
      return playlist.tracks.some(track => {
        const genreMatch = genreFilter === "all" || track.genre.toLowerCase() === genreFilter.toLowerCase()
        const moodMatch = moodFilter === "all" || track.mood.toLowerCase() === moodFilter.toLowerCase()
        return genreMatch && moodMatch
      })
    })
  }, [genreFilter, moodFilter])

  // Handle playlist play
  const handlePlaylistPlay = (playlist: Playlist) => {
    // TODO: Implement actual play logic
    // after playing the first track, then start playing the second track
    // and so on
    if (playlist.tracks.length > 0) {
      onTrackSelectAction(playlist.tracks[0])
    }
  }

  // Handle playlist card click - navigate to playlist view
  const handlePlaylistClick = (playlistId: string) => {
    onViewChangeAction(playlistId)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Your Library</h1>
        <p className="text-white/60">{filteredPlaylists.length} playlists in your collection</p>
      </div>

      {/* Genre and Mood Filters */}
      <div className="flex gap-4 items-center flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/80">Genre:</span>
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {genres.map((genre) => (
                <option key={genre} value={genre} className="bg-white/10 text-black">
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-white/80">Mood:</span>
          <select
            value={moodFilter}
            onChange={(e) => setMoodFilter(e.target.value)}
            className="bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {moods.map((mood) => (
              <option key={mood} value={mood} className="bg-white/10 text-black">
                {mood.charAt(0).toUpperCase() + mood.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setGenreFilter("all")
            setMoodFilter("all")
          }}
          className="border-white/20 text-white/60 hover:text-white hover:bg-white/10 bg-transparent"
        >
          <Filter className="w-4 h-4 mr-2" />
          Clear Filters
        </Button>
      </div>

      {/* Playlists Grid */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {filteredPlaylists.map((playlist) => (
          <div key={playlist.id} onClick={() => handlePlaylistClick(playlist.id)}>
            <PlaylistCard
              playlist={playlist}
              onPlayAction={() => handlePlaylistPlay(playlist)}
            />
          </div>
        ))}
      </div>

      {filteredPlaylists.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/60">No playlists found matching your filters.</p>
        </div>
      )}
    </div>
  )
}
