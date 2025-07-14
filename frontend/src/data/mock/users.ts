import { User } from '../../types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=6366f1&color=fff',
    preferences: {
      theme: 'dark',
      autoplay: true,
      volume: 75,
    },
  },
  {
    id: 'user-2',
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Williams&background=ec4899&color=fff',
    preferences: {
      theme: 'light',
      autoplay: false,
      volume: 60,
    },
  },
  {
    id: 'user-3',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=10b981&color=fff',
    preferences: {
      theme: 'dark',
      autoplay: true,
      volume: 85,
    },
  },
  {
    id: 'user-4',
    name: 'Emma Davis',
    email: 'emma.davis@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Emma+Davis&background=f59e0b&color=fff',
    preferences: {
      theme: 'light',
      autoplay: false,
      volume: 70,
    },
  },
];

export const currentUser = mockUsers[0];

export const userStats = {
  totalPlaylists: 7,
  totalLikedSongs: 142,
  totalListeningTime: '47h 23m',
  joinedDate: new Date('2023-08-15'),
  favoriteGenre: 'Pop',
  currentStreak: 12, // days
};
