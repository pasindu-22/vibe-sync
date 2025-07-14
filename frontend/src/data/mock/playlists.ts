import { Playlist } from '../../types';
import { mockTracks } from './tracks';

export const mockPlaylists: Playlist[] = [
  {
    id: 'playlist-1',
    name: 'My Favorites',
    description: 'All-time favorite songs that never get old',
    tracks: [
      mockTracks[0], // Blinding Lights
      mockTracks[2], // Someone Like You
      mockTracks[4], // Billie Jean
      mockTracks[9], // Perfect
      mockTracks[12], // Imagine
    ],
    cover: '/TODO-Delete/Music-Cover-1.jpg',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-07-10'),
  },
  {
    id: 'playlist-2',
    name: 'Workout Hits',
    description: 'High-energy tracks to power your workout',
    tracks: [
      mockTracks[0], // Blinding Lights
      mockTracks[7], // Bad Guy
      mockTracks[8], // Thunderstruck
      mockTracks[11], // Smells Like Teen Spirit
      mockTracks[13], // Sweet Child O' Mine
    ],
    cover: '/TODO-Delete/Music-Cover-2.jpg',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-07-05'),
  },
  {
    id: 'playlist-3',
    name: 'Chill Vibes',
    description: 'Relaxing songs for a peaceful evening',
    tracks: [
      mockTracks[5], // Hotel California
      mockTracks[6], // Watermelon Sugar
      mockTracks[9], // Perfect
      mockTracks[12], // Imagine
      mockTracks[14], // Yesterday
    ],
    cover: '/TODO-Delete/Music-Cover-3.jpg',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-06-30'),
  },
  {
    id: 'playlist-4',
    name: 'Rock Classics',
    description: 'Timeless rock anthems that defined generations',
    tracks: [
      mockTracks[3], // Bohemian Rhapsody
      mockTracks[5], // Hotel California
      mockTracks[8], // Thunderstruck
      mockTracks[11], // Smells Like Teen Spirit
      mockTracks[13], // Sweet Child O' Mine
      mockTracks[14], // Yesterday
    ],
    cover: '/TODO-Delete/Music-Cover-4.jpg',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-07-12'),
  },
  {
    id: 'playlist-5',
    name: 'Pop Hits 2024',
    description: 'Latest and greatest pop songs',
    tracks: [
      mockTracks[0], // Blinding Lights
      mockTracks[1], // Shape of You
      mockTracks[6], // Watermelon Sugar
      mockTracks[7], // Bad Guy
      mockTracks[9], // Perfect
    ],
    cover: '/TODO-Delete/Music-Cover-5.jpg',
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-07-08'),
  },
  {
    id: 'playlist-6',
    name: 'Late Night Mood',
    description: 'Perfect songs for those quiet late hours',
    tracks: [
      mockTracks[2], // Someone Like You
      mockTracks[7], // Bad Guy
      mockTracks[10], // Rolling in the Deep
      mockTracks[12], // Imagine
    ],
    cover: '/TODO-Delete/Music-Cover-6.jpg',
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2024-07-01'),
  },
  {
    id: 'playlist-7',
    name: 'Road Trip Songs',
    description: 'Epic songs for your next adventure',
    tracks: [
      mockTracks[5], // Hotel California
      mockTracks[8], // Thunderstruck
      mockTracks[13], // Sweet Child O' Mine
      mockTracks[1], // Shape of You
      mockTracks[6], // Watermelon Sugar
    ],
    cover: '/TODO-Delete/Music-Cover-7.jpg',
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-07-11'),
  },
];

export const userPlaylists = mockPlaylists.slice(0, 4);
export const featuredPlaylists = mockPlaylists.slice(4);
export const recentPlaylists = mockPlaylists.slice(0, 3);
export const aiRecommendations = mockPlaylists.slice(1, 4);
