"use client"

import { useState } from "react"
import { X, Mic, Link, Upload, Sparkles, Music, Brain } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AIClassificationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AIClassificationModal({ isOpen, onClose }: AIClassificationModalProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [url, setUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleMicRecord = () => {
    setIsRecording(!isRecording)
    // Simulate recording
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-900/95 backdrop-blur-xl border-white/20 text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI Music Classification</h2>
              <p className="text-sm text-white/60">Analyze genre and mood with AI</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <Tabs defaultValue="mic" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10">
            <TabsTrigger value="mic" className="data-[state=active]:bg-white/20">
              <Mic className="w-4 h-4 mr-2" />
              Microphone
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
                {isRecording && <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping" />}
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

        {/* Analysis Results */}
        {isAnalyzing && (
          <div className="mt-6 p-6 bg-white/5 rounded-lg border border-white/10">
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

        {results && (
          <div className="mt-6 p-6 bg-white/5 rounded-lg border border-white/10 space-y-4">
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
      </DialogContent>
    </Dialog>
  )
}
