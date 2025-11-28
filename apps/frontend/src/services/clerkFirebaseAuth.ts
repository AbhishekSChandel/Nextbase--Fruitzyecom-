import { signInWithCustomToken } from 'firebase/auth';
import { auth } from './firebase';

/**
 * Exchanges a Clerk session token for a Firebase custom token and signs the user into Firebase.
 * This enables the user to access Firestore with Firebase security rules.
 */
export async function authenticateWithClerkAndFirebase(
  clerkSession: any
): Promise<void> {
  try {
    // Get Firebase custom token from Clerk
    const firebaseToken = await clerkSession.getToken({
      template: 'firebase',
    });

    if (!firebaseToken) {
      throw new Error('Failed to get Firebase token from Clerk');
    }

    // Sign into Firebase with the custom token
    await signInWithCustomToken(auth, firebaseToken);
    
    console.log('✅ Firebase authentication successful via Clerk');
  } catch (error) {
    console.error('❌ Clerk-Firebase authentication error:', error);
    throw error;
  }
}
