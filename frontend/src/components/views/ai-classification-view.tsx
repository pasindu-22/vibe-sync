"use client"

import { useState } from "react"
import { Mic, Link, Upload, Sparkles, Music, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrackCard } from "../music/track-card"

interface AIClassificationViewProps {
  onTrackSelect: (track: any) => void
}

const mockAnalyzedTracks = [
  {
    id: "ai-1",
    title: "Analyzed Track 1",
    artist: "AI Artist",
    album: "AI Album",
    duration: "3:45",
    cover: "/placeholder.svg?height=300&width=300",
    genre: "Electronic",
    mood: "Energetic",
    confidence: { genre: 0.94, mood: 0.89 },
    features: { tempo: 128, energy: 0.87, valence: 0.76 },
  },
  {
    id: "ai-2",
    title: "Analyzed Track 2",
    artist: "AI Artist 2",
    album: "AI Album 2",
    duration: "4:12",
    cover: "/placeholder.svg?height=300&width=300",
    genre: "Jazz",
    mood: "Calm",
    confidence: { genre: 0.91, mood: 0.85 },
    features: { tempo: 95, energy: 0.45, valence: 0.62 },
  },
]

export function AIClassificationView({ onTrackSelect }: AIClassificationViewProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [url, setUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("mic")

  const handleMicRecord = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false)
        simulateAnalysis()
      }, 3000)
    }
  }

  const handleUrlSubmit = () => {
    if (url.trim()) {
      simulateAnalysis()
    }
  }

  const simulateAnalysis = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      setResults({
        genre: { label: "Rock", confidence: 0.92 },
        mood: { label: "Energetic", confidence: 0.87 },
        tempo: 120,
        energy: 0.85,
        valence: 0.73,
      })
    }, 2000)
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              AI Classification
            </h1>
            <p className="text-white/60">Analyze genre and mood with artificial intelligence</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Analyze Music</h2>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/10">
                <TabsTrigger value="mic" className="data-[state=active]:bg-white/20">
                  <Mic className="w-4 h-4 mr-2" />
                  Mic
                </TabsTrigger>
                <TabsTrigger value="url" className="data-[state=active]:bg-white/20">
                  <Link className="w-4 h-4 mr-2" />
                  URL
                </TabsTrigger>
                <TabsTrigger value="upload" className="data-[state=active]:bg-white/20">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </TabsTrigger>
              </TabsList>

              <TabsContent value="mic" className="space-y-6 mt-6">
                <div className="text-center space-y-4">
                  <div className="relative">
                    <button
                      onClick={handleMicRecord}
                      className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isRecording
                          ? "bg-red-500 animate-pulse"
                          : "bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105"
                      }`}
                    >
                      <Mic className="w-12 h-12" />
                    </button>
                    {isRecording && (
                      <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping" />
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-medium">{isRecording ? "Recording..." : "Tap to record"}</p>
                    <p className="text-sm text-white/60">
                      {isRecording ? "Listening to your music" : "Record up to 30 seconds"}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="url" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-white/80 mb-2 block">Music URL</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="https://example.com/song.mp3"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                      />
                      <Button
                        onClick={handleUrlSubmit}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        Analyze
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-white/60">Supported formats: MP3, WAV, FLAC, M4A</p>
                </div>
              </TabsContent>

              <TabsContent value="upload" className="space-y-6 mt-6">
                <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-white/40 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-white/60" />
                  <p className="text-lg font-medium mb-2">Drop your music file here</p>
                  <p className="text-sm text-white/60 mb-4">or click to browse</p>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Choose File
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Analysis Progress */}
          {isAnalyzing && (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-5 h-5 animate-pulse text-purple-400" />
                <span className="font-medium">Analyzing with AI...</span>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse w-3/4" />
                </div>
                <p className="text-sm text-white/60">Processing audio features...</p>
              </div>
            </div>
          )}

          {/* Results */}
          {results && (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Music className="w-5 h-5 text-green-400" />
                <span className="font-medium">Analysis Complete</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-purple-300">Genre</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{results.genre.label}</span>
                    <span className="text-sm text-white/60">{Math.round(results.genre.confidence * 100)}%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-pink-300">Mood</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{results.mood.label}</span>
                    <span className="text-sm text-white/60">{Math.round(results.mood.confidence * 100)}%</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div className="text-center">
                  <p className="text-sm text-white/60">Tempo</p>
                  <p className="text-lg font-medium">{results.tempo} BPM</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-white/60">Energy</p>
                  <p className="text-lg font-medium">{Math.round(results.energy * 100)}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-white/60">Positivity</p>
                  <p className="text-lg font-medium">{Math.round(results.valence * 100)}%</p>
                </div>
              </div>

              <Button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                Add to Library
              </Button>
            </div>
          )}
        </div>

        {/* Previously Analyzed */}
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Recently Analyzed</h2>
            <div className="space-y-4">
              {mockAnalyzedTracks.map((track) => (
                <div key={track.id} className="space-y-3">
                  <TrackCard track={track} onPlay={() => onTrackSelect(track)} className="bg-white/5" />
                  <div className="px-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Genre Confidence:</span>
                      <span className="text-purple-300">{Math.round(track.confidence.genre * 100)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Mood Confidence:</span>
                      <span className="text-pink-300">{Math.round(track.confidence.mood * 100)}%</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-white/50 pt-2 border-t border-white/10">
                      <div className="text-center">
                        <p>Tempo</p>
                        <p className="text-white/70">{track.features.tempo}</p>
                      </div>
                      <div className="text-center">
                        <p>Energy</p>
                        <p className="text-white/70">{Math.round(track.features.energy * 100)}%</p>
                      </div>
                      <div className="text-center">
                        <p>Valence</p>
                        <p className="text-white/70">{Math.round(track.features.valence * 100)}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
