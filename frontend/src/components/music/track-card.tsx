"use client"

import { Play, Pause } from "lucide-react"
import { cn } from "@/lib/utils"

interface TrackCardProps {
  track: {
    id: string
    title: string
    artist: string
    album: string
    duration: string
    cover: string
    genre: string
    mood: string
  }
  isPlaying?: boolean
  onPlay: () => void
  className?: string
}

export function TrackCard({ track, isPlaying, onPlay, className }: TrackCardProps) {
  return (
    <div
      className={cn(
        "group relative bg-white/5 backdrop-blur-sm rounded-xl p-4 hover:bg-white/10 transition-all duration-300 cursor-pointer border border-white/10 hover:border-white/20",
        className,
      )}
    >
      <div className="relative mb-4">
        <img
          src={track.cover || "/placeholder.svg"}
          alt={track.title}
          className="w-full aspect-square object-cover rounded-lg"
        />
        <button
          onClick={onPlay}
          className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
        >
          {isPlaying ? <Pause className="w-5 h-5 text-black" /> : <Play className="w-5 h-5 text-black ml-0.5" />}
        </button>
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold text-white truncate">{track.title}</h3>
        <p className="text-sm text-white/60 truncate">{track.artist}</p>
        <div className="flex gap-2 mt-2">
          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">{track.genre}</span>
          <span className="px-2 py-1 bg-pink-500/20 text-pink-300 text-xs rounded-full">{track.mood}</span>
        </div>
      </div>
    </div>
  )
}
