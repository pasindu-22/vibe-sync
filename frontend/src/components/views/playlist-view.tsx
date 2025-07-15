"use client"

import { Play, MoreHorizontal, Grid3X3, List } from "lucide-react"
import Image from "next/image"
import { TrackCard } from "../music/track-card"
import { Track } from "@/types"
import { mockPlaylists } from "@/data/mock/playlists"
import { useState } from "react"

interface PlaylistViewProps {
  playlistId: string
  onTrackSelectAction: (track: Track) => void
}

export function PlaylistView({ playlistId, onTrackSelectAction }: PlaylistViewProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const playlist = mockPlaylists.find(p => p.id === playlistId)

  if (!playlist) {
    return (
      <div className="p-6">
        <p className="text-white/60">Playlist not found</p>
      </div>
    )
  }

  const handleTrackSelect = (track: Track) => {
    onTrackSelectAction(track)
  }

  const handlePlayAll = () => {
    // TODO: Implement actual play logic
    // after playing the first track, then start playing the second track
    // and so on
    if (playlist.tracks.length > 0) {
      onTrackSelectAction(playlist.tracks[0])
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-end gap-6">
        {playlist.tracks.length >= 4 ? (
          <div className="aspect-square rounded-lg overflow-hidden grid grid-cols-2 grid-rows-2 gap-[2px] bg-black">
            {playlist.tracks
              .slice(0, 4)
              .map((track, index) => (
                <Image
                  key={index}
                  src={track.cover || "/placeholder.svg"}
                  alt={track.title}
                  width={75}
                  height={75}
                  className="w-full h-full object-cover"
                />
              ))}
          </div>
        ) : (
          <Image
            src={playlist.cover || "/placeholder.svg"}
            alt={playlist.name}
            width={150}
            height={150}
            className="w-full aspect-square object-cover rounded-lg"
          />
        )}
        <div className="space-y-2">
          <p className="text-sm text-white/60 uppercase tracking-wide">Playlist</p>
          <h1 className="text-5xl font-bold">{playlist.name}</h1>
          <p className="text-white/60">{playlist.description ? playlist.description : "No description available."}</p>
          <div className="flex items-center gap-2 text-white/60">
            <span>{playlist.tracks.length} songs</span>
          </div>
        </div>
      </div>

      {/* Play Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={handlePlayAll}
          className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
        >
          <Play className="w-6 h-6 text-black ml-1" />
        </button>
        {/* View Toggle */}
        <button
          onClick={() => setViewMode('list')}
          className={`p-2 rounded-lg transition-colors ${viewMode === 'list'
              ? 'bg-white/10 text-white'
              : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
        >
          <List className="w-5 h-5" />
        </button>
        <button
          onClick={() => setViewMode('grid')}
          className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
              ? 'bg-white/10 text-white'
              : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
        >
          <Grid3X3 className="w-5 h-5" />
        </button>
        <button className="p-2 text-white/60 hover:text-white transition-colors">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>

      {/* Track List */}
      {viewMode === 'list' ? (
        <div className="space-y-2">
          {playlist.tracks.map((track, index) => (
            <div
              key={track.id}
              className="flex items-center gap-4 p-2 rounded-lg hover:bg-white/5 transition-colors group"
            >
              <span className="w-8 text-center text-white/60 text-sm">
                {index + 1}
              </span>
              <div className="flex items-center gap-3 flex-1">
                <Image
                  src={track.cover || "/placeholder.svg"}
                  alt={track.title}
                  width={48}
                  height={48}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white truncate">{track.title}</h3>
                  <p className="text-sm text-white/60 truncate">{track.artist}</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">{track.genre}</span>
                  <span className="px-2 py-1 bg-pink-500/20 text-pink-300 text-xs rounded-full">{track.mood}</span>
                </div>
                <button
                  onClick={() => handleTrackSelect(track)}
                  className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                >
                  <Play className="w-4 h-4 text-black ml-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {playlist.tracks.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              onPlayAction={() => handleTrackSelect(track)}
              className="w-full"
              size="small"
            />
          ))}
        </div>
      )}
    </div>
  )
}
