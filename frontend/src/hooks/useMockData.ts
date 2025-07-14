import { useState, useEffect } from 'react';
import { Track } from '../types';
import { mockData, mockUtils } from '../data/mock';
import { testScenarios } from '../data/mock/test-scenarios';

// Hook for managing mock data with realistic loading states
export function useMockData() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Simulate API loading with delay
  const simulateLoading = async <T>(data: T, delay: number = 800): Promise<T> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate potential failure (5% chance)
      if (Math.random() < 0.05) {
        throw new Error('Simulated network error');
      }
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Data
    tracks: mockData.tracks,
    playlists: mockData.playlists,
    currentUser: mockData.currentUser,
    
    // Loading states
    isLoading,
    error,
    
    // Utility functions with loading simulation
    getTracks: () => simulateLoading(mockData.tracks),
    getPlaylists: () => simulateLoading(mockData.playlists),
    getTrackById: (id: string) => simulateLoading(mockUtils.getTrackById(id)),
    getPlaylistById: (id: string) => simulateLoading(mockUtils.getPlaylistById(id)),
    searchTracks: (query: string) => simulateLoading(mockUtils.searchTracks(query)),
    getRecommendedTracks: (trackId: string, count?: number) => 
      simulateLoading(mockUtils.getRecommendedTracks(trackId, count)),
    
    // Reset states
    clearError: () => setError(null),
  };
}

// Hook for testing different UI states
export function useTestScenarios() {
  const [currentScenario, setCurrentScenario] = useState<keyof typeof testScenarios>('normal');
  
  const scenario = testScenarios[currentScenario];
  
  return {
    ...scenario,
    currentScenario,
    setScenario: setCurrentScenario,
    availableScenarios: Object.keys(testScenarios) as Array<keyof typeof testScenarios>,
  };
}

// Hook for music player state
export function useMockPlayer() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(75);
  const [currentTime, setCurrentTime] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');

  // Simulate playback progress
  useEffect(() => {
    if (isPlaying && currentTrack) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= currentTrack.duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, currentTrack]);

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const skipToNext = () => {
    // Find next track in mock data
    if (currentTrack) {
      const currentIndex = mockData.tracks.findIndex(t => t.id === currentTrack.id);
      const nextIndex = (currentIndex + 1) % mockData.tracks.length;
      playTrack(mockData.tracks[nextIndex]);
    }
  };

  const skipToPrevious = () => {
    // Find previous track in mock data
    if (currentTrack) {
      const currentIndex = mockData.tracks.findIndex(t => t.id === currentTrack.id);
      const prevIndex = currentIndex === 0 ? mockData.tracks.length - 1 : currentIndex - 1;
      playTrack(mockData.tracks[prevIndex]);
    }
  };

  const seekTo = (time: number) => {
    setCurrentTime(time);
  };

  return {
    // State
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    isShuffled,
    repeatMode,
    
    // Actions
    playTrack,
    togglePlay,
    skipToNext,
    skipToPrevious,
    seekTo,
    setVolume,
    setIsShuffled,
    setRepeatMode,
    
    // Computed
    progress: currentTrack ? (currentTime / currentTrack.duration) * 100 : 0,
    formattedCurrentTime: mockUtils.formatDuration(currentTime),
    formattedDuration: currentTrack ? mockUtils.formatDuration(currentTrack.duration) : '0:00',
  };
}

// Hook for search functionality
export function useMockSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const search = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const searchResults = mockUtils.searchTracks(searchQuery);
    setResults(searchResults);
    setIsSearching(false);
    
    // Add to recent searches
    if (!recentSearches.includes(searchQuery)) {
      setRecentSearches(prev => [searchQuery, ...prev.slice(0, 4)]);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  return {
    query,
    setQuery,
    results,
    isSearching,
    recentSearches,
    search,
    clearSearch,
    clearRecentSearches,
    suggestions: mockData.searchSuggestions,
  };
}
