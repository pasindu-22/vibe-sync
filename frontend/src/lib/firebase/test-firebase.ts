// Firebase test file
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

// Test function to check if Firebase auth is working
export async function testFirebaseAuth(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Firebase auth is working:", userCredential.user);
    return userCredential.user;
  } catch (error: any) {
    console.error("Firebase auth error:", error.message);
    throw error;
  }
}

// Check if auth is initialized
console.log("Firebase auth initialized:", auth !== null);
