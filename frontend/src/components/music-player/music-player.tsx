"use client"

import { useState } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Heart } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface MusicPlayerProps {
  track: {
    id: string
    title: string
    artist: string
    album: string
    duration: string
    cover: string
    genre: string
    mood: string
    isPlaying?: boolean
  }
  onTrackChange: (track: any) => void
}

export function MusicPlayer({ track, onTrackChange }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(75)
  const [isLiked, setIsLiked] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    onTrackChange({ ...track, isPlaying: !isPlaying })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="h-24 bg-black/40 backdrop-blur-xl border-t border-white/10 px-4 flex items-center justify-between">
      {/* Track Info */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <img src={track.cover || "/placeholder.svg"} alt={track.title} className="w-14 h-14 rounded-lg object-cover" />
        <div className="min-w-0">
          <h4 className="font-medium text-white truncate">{track.title}</h4>
          <p className="text-sm text-white/60 truncate">{track.artist}</p>
          <div className="flex gap-2 mt-1">
            <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded">{track.genre}</span>
            <span className="px-1.5 py-0.5 bg-pink-500/20 text-pink-300 text-xs rounded">{track.mood}</span>
          </div>
        </div>
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={cn(
            "p-2 rounded-full transition-colors",
            isLiked ? "text-red-500 hover:text-red-400" : "text-white/60 hover:text-white",
          )}
        >
          <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
        </button>
      </div>

      {/* Player Controls */}
      <div className="flex flex-col items-center gap-2 flex-1 max-w-md">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            className={cn(
              "p-2 rounded-full transition-colors",
              isShuffle ? "text-green-500" : "text-white/60 hover:text-white",
            )}
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button className="p-2 text-white/60 hover:text-white transition-colors">
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={togglePlay}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause className="w-5 h-5 text-black" /> : <Play className="w-5 h-5 text-black ml-0.5" />}
          </button>

          <button className="p-2 text-white/60 hover:text-white transition-colors">
            <SkipForward className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsRepeat(!isRepeat)}
            className={cn(
              "p-2 rounded-full transition-colors",
              isRepeat ? "text-green-500" : "text-white/60 hover:text-white",
            )}
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-white/60 w-10 text-right">{formatTime(currentTime)}</span>
          <Slider
            value={[currentTime]}
            onValueChange={(value) => setCurrentTime(value[0])}
            max={335} // 5:35 in seconds
            step={1}
            className="flex-1"
          />
          <span className="text-xs text-white/60 w-10">{track.duration}</span>
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-2 flex-1 justify-end">
        <Volume2 className="w-5 h-5 text-white/60" />
        <Slider value={[volume]} onValueChange={(value) => setVolume(value[0])} max={100} step={1} className="w-24" />
      </div>
    </div>
  )
}
