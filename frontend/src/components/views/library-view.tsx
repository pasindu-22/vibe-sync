"use client"

import { Search, Filter, Grid, List } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TrackCard } from "../music/track-card"

interface LibraryViewProps {
  onTrackSelect: (track: any) => void
}

const mockLibrary = [
  {
    id: "1",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    duration: "5:55",
    cover: "/placeholder.svg?height=300&width=300",
    genre: "Rock",
    mood: "Epic",
  },
  {
    id: "2",
    title: "Billie Jean",
    artist: "Michael Jackson",
    album: "Thriller",
    duration: "4:54",
    cover: "/placeholder.svg?height=300&width=300",
    genre: "Pop",
    mood: "Energetic",
  },
  {
    id: "3",
    title: "Hotel California",
    artist: "Eagles",
    album: "Hotel California",
    duration: "6:30",
    cover: "/placeholder.svg?height=300&width=300",
    genre: "Rock",
    mood: "Mysterious",
  },
  {
    id: "4",
    title: "Shape of You",
    artist: "Ed Sheeran",
    album: "÷ (Divide)",
    duration: "3:53",
    cover: "/placeholder.svg?height=300&width=300",
    genre: "Pop",
    mood: "Happy",
  },
  {
    id: "5",
    title: "Stairway to Heaven",
    artist: "Led Zeppelin",
    album: "Led Zeppelin IV",
    duration: "8:02",
    cover: "/placeholder.svg?height=300&width=300",
    genre: "Rock",
    mood: "Epic",
  },
  {
    id: "6",
    title: "Thriller",
    artist: "Michael Jackson",
    album: "Thriller",
    duration: "5:57",
    cover: "/placeholder.svg?height=300&width=300",
    genre: "Pop",
    mood: "Dark",
  },
]

export function LibraryView({ onTrackSelect }: LibraryViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredTracks = mockLibrary.filter(
    (track) =>
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.mood.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Your Library</h1>
        <p className="text-white/60">{mockLibrary.length} songs in your collection</p>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            placeholder="Search your music..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
          />
        </div>

        <Button
          variant="outline"
          size="icon"
          className="border-white/20 text-white/60 hover:text-white hover:bg-white/10 bg-transparent"
        >
          <Filter className="w-4 h-4" />
        </Button>

        <div className="flex border border-white/20 rounded-lg overflow-hidden">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
            className="rounded-none border-0"
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
            className="rounded-none border-0"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Music Grid */}
      <div
        className={`grid gap-4 ${
          viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
        }`}
      >
        {filteredTracks.map((track) => (
          <TrackCard
            key={track.id}
            track={track}
            onPlay={() => onTrackSelect(track)}
            className={viewMode === "list" ? "flex-row items-center" : ""}
          />
        ))}
      </div>

      {filteredTracks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/60">No tracks found matching your search.</p>
        </div>
      )}
    </div>
  )
}
