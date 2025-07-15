"use client"

import { Play, Pause } from "lucide-react"
import { cn } from "@/lib/utils"
import { Track } from "@/types"
import Image from "next/image"

interface TrackCardProps {
  track: Track
  isPlaying?: boolean
  onPlayAction: () => void
  className?: string
  size?: 'default' | 'small'
}

export function TrackCard({ track, isPlaying, onPlayAction, className, size = 'default' }: TrackCardProps) {
  const isSmall = size === 'small'
  
  return (
    <div
      className={cn(
        "group relative bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer border border-white/10 hover:border-white/20",
        isSmall ? "p-3" : "p-4",
        className,
      )}
    >
      <div className={cn("relative", isSmall ? "mb-3" : "mb-4")}>
        <Image
          src={track.cover || "/placeholder.svg"}
          alt={track.title}
          width={isSmall ? 120 : 200}
          height={isSmall ? 120 : 200}
          className="w-full aspect-square object-cover rounded-lg"
        />
        <button
          onClick={onPlayAction}
          className={cn(
            "absolute bottom-2 right-2 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg cursor-pointer",
            isSmall ? "w-8 h-8" : "w-10 h-10"
          )}
        >
          {isPlaying ? (
            <Pause className={cn("text-black", isSmall ? "w-4 h-4" : "w-5 h-5")} />
          ) : (
            <Play className={cn("text-black ml-0.5", isSmall ? "w-4 h-4" : "w-5 h-5")} />
          )}
        </button>
      </div>

      <div className="space-y-1">
        <h3 className={cn("font-semibold text-white truncate", isSmall ? "text-sm" : "")}>{track.title}</h3>
        <p className={cn("text-white/60 truncate", isSmall ? "text-xs" : "text-sm")}>{track.artist}</p>
        <div className={cn("flex gap-2", isSmall ? "mt-1" : "mt-2")}>
          <span className={cn("bg-purple-500/20 text-purple-300 rounded-full", isSmall ? "px-2 py-0.5 text-xs" : "px-2 py-1 text-xs")}>{track.genre}</span>
          <span className={cn("bg-pink-500/20 text-pink-300 rounded-full", isSmall ? "px-2 py-0.5 text-xs" : "px-2 py-1 text-xs")}>{track.mood}</span>
        </div>
      </div>
    </div>
  )
}
