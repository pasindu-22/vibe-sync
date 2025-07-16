import { Track, Playlist, User } from '../../types';
import { mockTracks, recentlyPlayedTracks, likedTracks, trendingTracks } from './tracks';
import { mockPlaylists, userPlaylists, featuredPlaylists, recentPlaylists, aiRecommendations } from './playlists';
import { 
  musicGenres, 
  musicMoods, 
  aiClassificationSuggestions, 
  listeningStats, 
  searchSuggestions 
} from './metadata';

// Main mock data export
export const mockData = {
  // Tracks
  tracks: mockTracks,
  recentlyPlayed: recentlyPlayedTracks,
  likedTracks: likedTracks,
  trendingTracks: trendingTracks,

  // Playlists
  playlists: mockPlaylists,
  userPlaylists: userPlaylists,
  featuredPlaylists: featuredPlaylists,
  recentPlaylists: recentPlaylists,
  aiRecommendations: aiRecommendations,

  // Users
  users: mockUsers,
  currentUser: currentUser,
  userStats: userStats,

  // Metadata
  genres: musicGenres,
  moods: musicMoods,
  aiSuggestions: aiClassificationSuggestions,
  stats: listeningStats,
  searchSuggestions: searchSuggestions,
};

// Utility functions for mock data
export const mockUtils = {
  // Get track by ID
  getTrackById: (id: string): Track | undefined => {
    return mockTracks.find(track => track.id === id);
  },

  // Get playlist by ID
  getPlaylistById: (id: string): Playlist | undefined => {
    return mockPlaylists.find(playlist => playlist.id === id);
  },

  // Get user by ID
  getUserById: (id: string): User | undefined => {
    return mockUsers.find(user => user.id === id);
  },

  // Search tracks by title, artist, or album
  searchTracks: (query: string): Track[] => {
    const lowercaseQuery = query.toLowerCase();
    return mockTracks.filter(track =>
      track.title.toLowerCase().includes(lowercaseQuery) ||
      track.artist.toLowerCase().includes(lowercaseQuery) ||
      track.album.toLowerCase().includes(lowercaseQuery)
    );
  },

  // Filter tracks by genre
  getTracksByGenre: (genre: string): Track[] => {
    return mockTracks.filter(track => track.genre === genre);
  },

  // Filter tracks by mood
  getTracksByMood: (mood: string): Track[] => {
    return mockTracks.filter(track => track.mood === mood);
  },

  // Get random tracks
  getRandomTracks: (count: number): Track[] => {
    const shuffled = [...mockTracks].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  },

  // Get recommended tracks based on a track
  getRecommendedTracks: (trackId: string, count: number = 5): Track[] => {
    const track = mockUtils.getTrackById(trackId);
    if (!track) return [];

    // Simple recommendation: same genre or mood
    const recommended = mockTracks.filter(t => 
      t.id !== trackId && (t.genre === track.genre || t.mood === track.mood)
    );
    
    return recommended.slice(0, count);
  },

  // Toggle track playing state
  toggleTrackPlaying: (trackId: string): Track[] => {
    return mockTracks.map(track => ({
      ...track,
      isPlaying: track.id === trackId ? !track.isPlaying : false
    }));
  },

  // Format duration from seconds to mm:ss
  formatDuration: (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  },

  // Get tracks added in the last N days
  getRecentTracks: (): Track[] => {
    // Since we don't have dateAdded in our interface, return recent tracks
    return recentlyPlayedTracks;
  },

  // Simulate loading states for testing
  createLoadingState: <T>(data: T, delay: number = 1000): Promise<T> => {
    return new Promise(resolve => {
      setTimeout(() => resolve(data), delay);
    });
  },

  // Generate mock error for testing error states
  createMockError: (message: string = 'Something went wrong'): Error => {
    return new Error(message);
  },
};

// Export individual collections for convenience
export {
  mockTracks,
  mockPlaylists,
  musicGenres,
  musicMoods,
  listeningStats,
};
