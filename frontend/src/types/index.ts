export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  cover: string;
  genre: string;
  mood: string;
  isPlaying: boolean;
  // Add other properties as needed
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  tracks: Track[];
  cover: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences?: {
    theme: 'light' | 'dark';
    autoplay: boolean;
    volume: number;
  };
}

export interface AnalysisResults {
    genre: { label: string; confidence: number }
    mood: { label: string; confidence: number }
    tempo: number
    energy: number
    valence: number
  }
