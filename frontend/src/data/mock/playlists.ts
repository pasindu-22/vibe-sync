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
  {
    id: 'playlist-8',
    name: 'Disco Fever',
    description: 'Get your groove on with classic disco hits',
    tracks: [
      mockTracks[15], // Stayin' Alive
      mockTracks[4], // Billie Jean
      mockTracks[0], // Blinding Lights
    ],
    cover: '/TODO-Delete/Music-Cover-1.jpg',
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2024-07-12'),
  },
  {
    id: 'playlist-9',
    name: 'Metal Mayhem',
    description: 'Heavy metal tracks that will blow your mind',
    tracks: [
      mockTracks[16], // Master of Puppets
      mockTracks[8], // Thunderstruck
      mockTracks[11], // Smells Like Teen Spirit
    ],
    cover: '/TODO-Delete/Music-Cover-2.jpg',
    createdAt: new Date('2024-06-20'),
    updatedAt: new Date('2024-07-13'),
  },
  {
    id: 'playlist-10',
    name: 'Reggae Vibes',
    description: 'Chill reggae music for relaxing moments',
    tracks: [
      mockTracks[17], // No Woman No Cry
      mockTracks[5], // Hotel California
      mockTracks[12], // Imagine
    ],
    cover: '/TODO-Delete/Music-Cover-3.jpg',
    createdAt: new Date('2024-06-25'),
    updatedAt: new Date('2024-07-14'),
  },
  {
    id: 'playlist-11',
    name: 'Blues Legends',
    description: 'Soulful blues from the masters',
    tracks: [
      mockTracks[18], // The Thrill Is Gone
      mockTracks[2], // Someone Like You
      mockTracks[10], // Rolling in the Deep
    ],
    cover: '/TODO-Delete/Music-Cover-4.jpg',
    createdAt: new Date('2024-07-01'),
    updatedAt: new Date('2024-07-14'),
  },
  {
    id: 'playlist-12',
    name: 'Jazz Classics',
    description: 'Sophisticated jazz for the refined listener',
    tracks: [
      mockTracks[19], // Take Five
      mockTracks[12], // Imagine
    ],
    cover: '/TODO-Delete/Music-Cover-5.jpg',
    createdAt: new Date('2024-07-05'),
    updatedAt: new Date('2024-07-14'),
  },
  {
    id: 'playlist-13',
    name: 'Hip-Hop Hits',
    description: 'The best in hip-hop and rap music',
    tracks: [
      mockTracks[20], // Lose Yourself
      mockTracks[7], // Bad Guy
    ],
    cover: '/TODO-Delete/Music-Cover-6.jpg',
    createdAt: new Date('2024-07-08'),
    updatedAt: new Date('2024-07-14'),
  },
  {
    id: 'playlist-14',
    name: 'Country Roads',
    description: 'Country music for the soul',
    tracks: [
      mockTracks[21], // Sweet Caroline
      mockTracks[9], // Perfect
    ],
    cover: '/TODO-Delete/Music-Cover-7.jpg',
    createdAt: new Date('2024-07-10'),
    updatedAt: new Date('2024-07-14'),
  },
  {
    id: 'playlist-15',
    name: 'Classical Elegance',
    description: 'Timeless classical compositions',
    tracks: [
      mockTracks[22], // Canon in D
      mockTracks[12], // Imagine
    ],
    cover: '/TODO-Delete/Music-Cover-1.jpg',
    createdAt: new Date('2024-07-12'),
    updatedAt: new Date('2024-07-14'),
  },
];

export const userPlaylists = mockPlaylists.slice(0, 6);
export const featuredPlaylists = mockPlaylists.slice(6);
export const recentPlaylists = mockPlaylists.slice(0, 3);
export const aiRecommendations = mockPlaylists.slice(3, 6);
