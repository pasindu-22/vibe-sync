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
    <div className="group relative bg-white/5 backdrop-blur-sm rounded-xl p-3 hover:bg-white/10 transition-all duration-300 cursor-pointer border border-white/10 hover:border-white/20">
      <div className="relative mb-3">
        {playlist.tracks.length >= 4 ? (
          <div className="w-full aspect-square rounded-lg overflow-hidden grid grid-cols-2 grid-rows-2 gap-[2px] bg-black">
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
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPlayAction()
          }}
          className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 cursor-pointer shadow-lg"
        >
          <Play className="w-4 h-4 text-black ml-0.5" />
        </button>
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold text-white truncate text-sm">{playlist.name}</h3>
        <p className="text-xs text-white/60 truncate leading-tight">{playlist.description ? playlist.description : "No description available."}</p>
        <div className="flex items-center gap-1 text-xs text-white/50 mt-1">
          <Music className="w-3 h-3" />
          <span>{playlist.tracks.length || 0} songs</span>
        </div>
      </div>
    </div>
  )
}
