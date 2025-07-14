// Music genres and moods for filtering and AI classification
export const musicGenres = [
  'Pop',
  'Rock',
  'Hip Hop',
  'Electronic',
  'Jazz',
  'Classical',
  'R&B',
  'Country',
  'Reggae',
  'Blues',
  'Folk',
  'Indie',
  'Metal',
  'Punk',
  'Soul',
  'Funk',
  'Disco',
  'Alternative',
  'Grunge',
  'House',
  'Techno',
  'Ambient',
];

export const musicMoods = [
  'Happy',
  'Sad',
  'Energetic',
  'Chill',
  'Romantic',
  'Angry',
  'Peaceful',
  'Nostalgic',
  'Uplifting',
  'Melancholic',
  'Dark',
  'Groovy',
  'Epic',
  'Dreamy',
  'Intense',
  'Playful',
  'Mysterious',
  'Powerful',
  'Relaxing',
  'Rebellious',
];

// Mock data for AI classification suggestions
export const aiClassificationSuggestions = [
  {
    trackId: '1',
    suggestedGenre: 'Synthpop',
    suggestedMood: 'Euphoric',
    confidence: 0.92,
    reason: 'Strong synthesizer presence and uplifting melody patterns',
  },
  {
    trackId: '2',
    suggestedGenre: 'Pop Folk',
    suggestedMood: 'Joyful',
    confidence: 0.88,
    reason: 'Acoustic guitar elements with pop sensibilities',
  },
  {
    trackId: '3',
    suggestedGenre: 'Pop Ballad',
    suggestedMood: 'Emotional',
    confidence: 0.95,
    reason: 'Piano-driven ballad with powerful vocal delivery',
  },
];

// Mock listening statistics
export const listeningStats = {
  totalTracksPlayed: 1247,
  totalHoursListened: 47.5,
  averageSessionLength: 23, // minutes
  topGenres: [
    { genre: 'Pop', percentage: 35 },
    { genre: 'Rock', percentage: 28 },
    { genre: 'Alternative', percentage: 15 },
    { genre: 'Soul', percentage: 12 },
    { genre: 'Electronic', percentage: 10 },
  ],
  topMoods: [
    { mood: 'Happy', percentage: 25 },
    { mood: 'Energetic', percentage: 22 },
    { mood: 'Chill', percentage: 18 },
    { mood: 'Romantic', percentage: 15 },
    { mood: 'Nostalgic', percentage: 20 },
  ],
  listeningByTime: [
    { hour: 6, plays: 5 },
    { hour: 7, plays: 12 },
    { hour: 8, plays: 25 },
    { hour: 9, plays: 18 },
    { hour: 10, plays: 15 },
    { hour: 11, plays: 22 },
    { hour: 12, plays: 30 },
    { hour: 13, plays: 28 },
    { hour: 14, plays: 35 },
    { hour: 15, plays: 32 },
    { hour: 16, plays: 40 },
    { hour: 17, plays: 45 },
    { hour: 18, plays: 38 },
    { hour: 19, plays: 42 },
    { hour: 20, plays: 48 },
    { hour: 21, plays: 35 },
    { hour: 22, plays: 25 },
    { hour: 23, plays: 15 },
  ],
};

// Search suggestions
export const searchSuggestions = [
  'The Weeknd',
  'Blinding Lights',
  'Pop music',
  'Happy songs',
  'Rock classics',
  'Adele',
  'My Favorites playlist',
  'Energetic mood',
  '90s hits',
  'Chill vibes',
];
