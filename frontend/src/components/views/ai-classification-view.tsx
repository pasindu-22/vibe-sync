"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, Upload, Sparkles, Music, Brain, Plus, RefreshCw, Library, Play, Trash, Square, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Track, AnalysisResults } from "@/types"
import { mockTracks } from "@/data/mock/tracks"
import { musicClassificationService } from "@/services/music-classification-service"
import { ClassificationResult } from "@/types"
import { useAudioRecorder } from "@/hooks/useAudioRecorder"
import { useAuth } from "@/lib/firebase/auth-context"
import Image from "next/image"
import toast from "react-hot-toast"

interface AIClassificationViewProps {
  onTrackSelectAction: (track: Track) => void
}

export function AIClassificationView({ onTrackSelectAction }: AIClassificationViewProps) {
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<AnalysisResults | null>(null)
  const [backendResults, setBackendResults] = useState<ClassificationResult | null>(null)
  const [activeTab, setActiveTab] = useState("mic")
  const [suggestedTracks, setSuggestedTracks] = useState<Track[]>([])
  const [isGeneratingPlaylist, setIsGeneratingPlaylist] = useState(false)
  const [playlistName, setPlaylistName] = useState("")
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null)

  // Audio recorder hook
  const {
    isRecording,
    isProcessing,
    recordingTime,
    audioLevel,
    error: recordingError,
    startRecording,
    stopRecording,
    canStopRecording,
    clearError
  } = useAudioRecorder({
    onRecordingComplete: (audioBlob) => {
      setRecordedAudioBlob(audioBlob)
      toast.success('Recording completed! Click "Analyze" to classify.')
    },
    onRecordingError: (error) => {
      toast.error(`Recording failed: ${error.message}`)
    }
  })

  // Clear errors when user switches tabs
  useEffect(() => {
    setUploadError(null)
    clearError()
  }, [activeTab, clearError])

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    if (!user) {
      toast.error('Please sign in to use this feature')
      return
    }

    setUploadError(null)
    setIsAnalyzing(true)

    try {
      const result = await musicClassificationService.classifyUploadedFile(file)
      setBackendResults(result)
      
      // Convert backend results to frontend format
      const analysisResults: AnalysisResults = {
        genre: {
          label: result.overall_prediction.predicted_genre,
          confidence: result.overall_prediction.confidence
        },
        mood: {
          label: getMoodFromGenre(result.overall_prediction.predicted_genre), // Helper function
          confidence: 0.8 // Mock mood confidence
        },
        tempo: Math.floor(Math.random() * 60) + 100, // Mock tempo
        energy: Math.random(), // Mock energy
        valence: Math.random() // Mock valence
      }
      
      setResults(analysisResults)
      generateSuggestedPlaylist(analysisResults.genre.label, analysisResults.mood.label)
      
      toast.success(`Genre classified as: ${result.overall_prediction.predicted_genre} (${Math.round(result.overall_prediction.confidence * 100)}% confidence)`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to classify audio'
      setUploadError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Handle recorded audio analysis
  const analyzeRecordedAudio = async () => {
    if (!recordedAudioBlob || !user) {
      toast.error('No recorded audio available or user not signed in')
      return
    }

    const audioFile = musicClassificationService.createAudioFile(recordedAudioBlob, 'recorded-audio.wav')
    await handleFileUpload(audioFile)
  }

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  // Helper function to map genre to mood (since backend only returns genre)
  const getMoodFromGenre = (genre: string): string => {
    const genreToMoodMap: Record<string, string> = {
      'rock': 'energetic',
      'pop': 'happy',
      'jazz': 'relaxed',
      'classical': 'calm',
      'electronic': 'energetic',
      'hip-hop': 'confident',
      'country': 'nostalgic',
      'blues': 'melancholic',
      'reggae': 'chill',
      'metal': 'intense'
    }
    return genreToMoodMap[genre.toLowerCase()] || 'neutral'
  }

  // Generate suggested tracks based on analysis results
  const generateSuggestedPlaylist = (genre: string, mood: string) => {
    setIsGeneratingPlaylist(true)

    // Filter tracks that match the genre or mood
    const matchingTracks = mockTracks.filter(track =>
      track.genre === genre || track.mood === mood
    ).slice(0, 8) // Get 8 suggested tracks

    // If not enough matching tracks, add some random ones
    const additionalTracks = mockTracks
      .filter(track => !matchingTracks.includes(track))
      .slice(0, Math.max(0, 8 - matchingTracks.length))

    const playlist = [...matchingTracks, ...additionalTracks]

    setTimeout(() => {
      setSuggestedTracks(playlist)
      setPlaylistName(`${mood} ${genre} Mix`)
      setIsGeneratingPlaylist(false)
    }, 1500)
  }

  const addMoreTracks = () => {
    if (!results) return

    setIsGeneratingPlaylist(true)

    // Get additional tracks not already in the playlist
    const availableTracks = mockTracks.filter(track =>
      !suggestedTracks.some(existing => existing.id === track.id)
    )

    // First try to get tracks that match the analysis results
    const matchingTracks = availableTracks.filter(track =>
      track.genre === results.genre.label || track.mood === results.mood.label
    ).slice(0, 4)

    // If we don't have enough matching tracks, fill with any remaining tracks
    const additionalTracks = matchingTracks.length < 4
      ? availableTracks.filter(track =>
        !matchingTracks.includes(track)
      ).slice(0, 4 - matchingTracks.length)
      : []

    const newTracks = [...matchingTracks, ...additionalTracks]

    setTimeout(() => {
      // Add new tracks to existing playlist (keeping all previous tracks)
      setSuggestedTracks(prev => [...prev, ...newTracks])
      setIsGeneratingPlaylist(false)
    }, 1000)
  }

  const removeTrack = (trackId: string) => {
    setSuggestedTracks(prev => prev.filter(track => track.id !== trackId))
  }

  const regeneratePlaylist = () => {
    if (!results) return
    generateSuggestedPlaylist(results.genre.label, results.mood.label)
  }

  const addToLibrary = () => {
    // TODO: Implement actual library addition logic
    alert(`Playlist "${playlistName}" added to your library!`)
  }

  const handleMicRecord = async () => {
  console.log('handleMicRecord called');
  console.log('isRecording:', isRecording);
  console.log('canStopRecording():', canStopRecording());
  console.log('isProcessing:', isProcessing);
  
  if (isRecording) {
    // Check if minimum recording time has been met
    if (!canStopRecording()) {
      toast.error('Please record for at least 30 seconds before stopping')
      return
    }
    console.log('Calling stopRecording...');
    stopRecording()
  } else {
    if (!user) {
      toast.error('Please sign in to use this feature')
      return
    }
    console.log('Calling startRecording...');
    await startRecording()
  }
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
              <TabsList className="grid w-full grid-cols-2 bg-white/10">
                <TabsTrigger value="mic" className="data-[state=active]:bg-white/20">
                  <Mic className="w-4 h-4 mr-2" />
                  Mic
                </TabsTrigger>
                <TabsTrigger value="upload" className="data-[state=active]:bg-white/20">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </TabsTrigger>
              </TabsList>

                <TabsContent value="mic" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Recording Button Column */}
                  <div className="text-center space-y-4">
                  <div className="relative">
                    <button
                      onClick={handleMicRecord}
                      disabled={isProcessing || (isRecording && !canStopRecording())}
                      className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 ${
                        isRecording
                          ? canStopRecording()
                            ? "bg-red-500 hover:bg-red-600 hover:cursor-pointer"
                            : "bg-red-500/70 cursor-not-allowed"
                          : "bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 hover:from-purple-600 hover:to-pink-600 cursor-pointer"
                      }`}
                    >
                      {isRecording ? <Square className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                    </button>
                    {isRecording && (
                    <div className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-75" />
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-medium">
                      {isProcessing ? "Processing..." : isRecording ? "Recording..." : "Tap to record"}
                    </p>
                    <p className="text-sm text-white/60">
                      {isRecording 
                        ? canStopRecording() 
                          ? `Recording for ${recordingTime}s - Click to stop` 
                          : `Recording for ${recordingTime}s - Minimum 30s required`
                        : "Record your audio (minimum 30 seconds)"
                      }
                    </p>
                  </div>
                  
                  {/* Show analyze button if we have recorded audio */}
                  {recordedAudioBlob && !isRecording && (
                    <Button
                      onClick={analyzeRecordedAudio}
                      disabled={isAnalyzing}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    >
                      {isAnalyzing ? (
                        <>
                          <Brain className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4 mr-2" />
                          Analyze Recording
                        </>
                      )}
                    </Button>
                  )}
                  </div>

                  {/* Recording Progress Column */}
                  <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Recording Progress</span>
                    <span className="text-sm text-white/60">
                      {recordingTime}s / 30s minimum
                    </span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-100 ${
                        canStopRecording() 
                          ? 'bg-gradient-to-r from-green-500 to-green-600' 
                          : 'bg-gradient-to-r from-red-500 to-red-600'
                      }`}
                      style={{ 
                        width: isRecording ? `${Math.min((recordingTime / 30) * 100, 100)}%` : '0%'
                      }}
                    />
                    </div>
                  </div>
                  
                  {/* Recording Visualization */}
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Audio Level</span>
                    <div className="flex items-center gap-1 h-8">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                      key={i}
                      className={`w-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full transition-all duration-150 ${
                        isRecording ? 'opacity-100' : 'opacity-30'
                      }`}
                      style={{
                        height: isRecording ? `${Math.min((audioLevel * 100) + Math.random() * 30, 100)}%` : '20%',
                        transform: isRecording ? 'scaleY(1)' : 'scaleY(0.5)'
                      }}
                      />
                    ))}
                    </div>
                  </div>

                  {/* Show recording status */}
                  {isRecording && recordingTime < 30 && (
                    <div className="flex items-center gap-2 text-yellow-400">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">Recording... {30 - recordingTime}s remaining to reach minimum</span>
                    </div>
                  )}

                  {isRecording && canStopRecording() && (
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Minimum recording time reached - you can stop now</span>
                    </div>
                  )}

                  {recordedAudioBlob && !isRecording && (
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Recording ready for analysis</span>
                    </div>
                  )}

                  {/* Show recording error */}
                  {recordingError && (
                    <div className="flex items-center gap-2 text-red-400">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{recordingError}</span>
                    </div>
                  )}
                  </div>
                </div>
                </TabsContent>

              <TabsContent value="upload" className="space-y-6 mt-6">
                <div 
                  className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-white/40 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={(e) => {
                    e.preventDefault()
                    const file = e.dataTransfer.files[0]
                    if (file) handleFileUpload(file)
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={(e) => e.preventDefault()}
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-white/60" />
                  <p className="text-lg font-medium mb-2">Drop your music file here</p>
                  <p className="text-sm text-white/60 mb-4">or click to browse</p>
                  <Button 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <Brain className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      'Choose File'
                    )}
                  </Button>
                  
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*,.mp3,.wav,.flac,.m4a,.ogg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* Show upload error */}
                {uploadError && (
                  <div className="flex items-center gap-2 text-red-400 bg-red-500/10 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{uploadError}</span>
                  </div>
                )}

                {/* Show supported formats info */}
                <div className="text-center text-sm text-white/60">
                  <p>Supported formats: MP3, WAV, FLAC, M4A, OGG</p>
                  <p>Maximum file size: 100MB</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Analysis Progress */}
          {isAnalyzing && (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-5 h-5 text-purple-400" />
                <span className="font-medium">Analyzing with AI...</span>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-3/4" />
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

              {/* Show additional backend results if available */}
              {backendResults && (
                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-medium text-blue-300 mb-3">Detailed Classification</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-white/60">File Size</p>
                      <p className="text-white">{(backendResults.file_info.file_size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                    <div>
                      <p className="text-white/60">Duration</p>
                      <p className="text-white">{backendResults.track_info.duration.toFixed(1)}s</p>
                    </div>
                    <div>
                      <p className="text-white/60">Segments Analyzed</p>
                      <p className="text-white">{backendResults.track_info.num_segments_analyzed}</p>
                    </div>
                    <div>
                      <p className="text-white/60">Segment Duration</p>
                      <p className="text-white">{backendResults.track_info.segment_duration}s each</p>
                    </div>
                  </div>
                  
                  {/* Show top 3 predictions from overall genre distribution */}
                  <div className="mt-4">
                    <p className="text-white/60 text-sm mb-2">Genre Distribution:</p>
                    <div className="space-y-1">
                      {Object.entries(backendResults.overall_prediction.genre_distribution)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 3)
                        .map(([genre, confidence]) => (
                          <div key={genre} className="flex justify-between text-sm">
                            <span className="text-white/80 capitalize">{genre}</span>
                            <span className="text-white/60">{Math.round(confidence * 100)}%</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Show segment analysis summary */}
                  <div className="mt-4">
                    <p className="text-white/60 text-sm mb-2">Segment Analysis:</p>
                    <div className="space-y-2">
                      {backendResults.segment_predictions.map((segment, index) => (
                        <div key={index} className="flex justify-between items-center text-xs bg-white/5 p-2 rounded">
                          <span className="text-white/70">
                            Segment {index + 1} ({segment.start_time}s-{segment.start_time + segment.duration}s)
                          </span>
                          <div className="flex gap-2">
                            <span className="text-purple-300 capitalize">{segment.predicted_genre}</span>
                            <span className="text-white/60">{Math.round(segment.confidence * 100)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Show genre votes summary */}
                  <div className="mt-4">
                    <p className="text-white/60 text-sm mb-2">Consensus Votes:</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(backendResults.genre_votes)
                        .filter(([, votes]) => votes > 0)
                        .map(([genre, votes]) => (
                          <span 
                            key={genre} 
                            className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full"
                          >
                            {genre}: {votes} votes
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              )}

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
            </div>
          )}
        </div>

        {/* Suggested Playlist */}
        <div className="space-y-6">
          {results && suggestedTracks.length > 0 ? (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Suggested Playlist</h2>
                  <p className="text-sm text-white/60">Based on {results.mood.label} {results.genre.label} analysis</p>
                </div>
                <Button
                  onClick={addToLibrary}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Library className="w-4 h-4 mr-2" />
                  Add to Library
                </Button>
              </div>

              {/* Playlist Name */}
              <div className="mb-4">
                <Input
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  placeholder="Playlist name"
                />
              </div>

              {/* Playlist Actions */}
              <div className="flex gap-2 mb-6">
                <Button
                  onClick={regeneratePlaylist}
                  variant="outline"
                  size="sm"
                  disabled={isGeneratingPlaylist}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isGeneratingPlaylist ? 'animate-spin' : ''}`} />
                  Regenerate
                </Button>
              </div>

              {/* Track List */}
              {isGeneratingPlaylist ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-3">
                    <Brain className="w-5 h-5 text-purple-400" />
                    <span className="text-white/60">Generating playlist...</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {suggestedTracks.map((track, index) => (
                    <div
                      key={track.id}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group"
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
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                            {track.genre}
                          </span>
                          <span className="px-2 py-1 bg-pink-500/20 text-pink-300 text-xs rounded-full">
                            {track.mood}
                          </span>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onTrackSelectAction(track)}
                            className="text-white/60 hover:text-white hover:bg-white/10 w-8 h-8"
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeTrack(track.id)}
                            className="text-white/60 hover:text-white hover:bg-white/10 w-8 h-8"
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add More Button at bottom */}
              {!isGeneratingPlaylist && suggestedTracks.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10 text-center">
                  <Button
                    onClick={addMoreTracks}
                    variant="outline"
                    size="sm"
                    disabled={suggestedTracks.length >= mockTracks.length}
                    className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {suggestedTracks.length >= mockTracks.length ? 'No More Tracks' : 'Add More Tracks'}
                  </Button>
                </div>
              )}
            </div>
          ) : results ? (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-center py-8">
                <Brain className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                <h3 className="text-lg font-medium mb-2">Ready to Generate Playlist</h3>
                <p className="text-white/60 mb-4">
                  Based on your {results.mood.label} {results.genre.label} analysis
                </p>
                <Button
                  onClick={() => generateSuggestedPlaylist(results.genre.label, results.mood.label)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Generate Playlist
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-center py-8">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-white/40" />
                <h3 className="text-lg font-medium mb-2">No Analysis Yet</h3>
                <p className="text-white/60">
                  Analyze some music to get personalized playlist suggestions
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
