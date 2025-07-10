"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar/sidebar"
import { MainContent } from "@/components/main-content"
import { MusicPlayer } from "@/components/music-player/music-player"
import { LandingPage } from "@/components/landing/landing-page"

export function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentView, setCurrentView] = useState("home")
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)
  const [currentTrack, setCurrentTrack] = useState({
    id: "1",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    duration: "5:55",
    cover: "/placeholder.svg?height=300&width=300",
    genre: "Rock",
    mood: "Epic",
    isPlaying: false,
  })

  if (!isAuthenticated) {
    return <LandingPage onAuthenticatedAction={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        isExpanded={isSidebarExpanded}
        onToggleExpanded={setIsSidebarExpanded}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <MainContent currentView={currentView} currentTrack={currentTrack} onTrackSelect={setCurrentTrack} />
        <MusicPlayer track={currentTrack} onTrackChange={setCurrentTrack} />
      </div>
    </div>
  )
}
