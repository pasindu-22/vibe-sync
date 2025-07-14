"use client"

import { Playlist } from "@/types"
import { Play, Music } from "lucide-react"
import Image from "next/image"

interface PlaylistCardProps {
  playlist: Playlist
  onPlayAction: () => void
}

export function PlaylistCard({ playlist, onPlayAction }: PlaylistCardProps) {
  return (
    <div className="group relative bg-white/5 backdrop-blur-sm rounded-xl p-4 hover:bg-white/10 transition-all duration-300 cursor-pointer border border-white/10 hover:border-white/20">
      <div className="relative mb-4">
        <Image
          src={playlist.cover || "/placeholder.svg"}
          alt={playlist.name}
          width={200}
          height={200}
          className="w-full aspect-square object-cover rounded-lg"
        />
        <button
          onClick={onPlayAction}
          className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 cursor-pointer shadow-lg"
        >
          <Play className="w-5 h-5 text-black ml-0.5" />
        </button>
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold text-white truncate">{playlist.name}</h3>
        <p className="text-sm text-white/60 truncate">{playlist.description}</p>
        <div className="flex items-center gap-1 text-xs text-white/50 mt-2">
          <Music className="w-3 h-3" />
          <span>{playlist.tracks.length || 0} songs</span>
        </div>
      </div>
    </div>
  )
}
