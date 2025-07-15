import { auth } from "@/lib/firebase/firebase";

export interface UserProfile {
  uid: string;
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
}

export async function fetchUserProfile(): Promise<UserProfile | null> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return null;
    }

    const token = await user.getIdToken();
    
    const response = await fetch('/api/proxy/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    throw error;
  }
}

export async function updateUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No authenticated user found');
    }

    const token = await user.getIdToken();
    
    const response = await fetch('/api/proxy/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    throw error;
  }
}
