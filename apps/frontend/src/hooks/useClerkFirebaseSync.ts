import { useSession } from '@clerk/clerk-expo';
import { authenticateWithClerkAndFirebase } from '../services/clerkFirebaseAuth';

/**
 * Hook to sync Clerk authentication with Firebase.
 * Call syncToFirebase() after successful Clerk sign-in to create a Firebase session.
 */
export function useClerkFirebaseSync() {
  const { session } = useSession();

  const syncToFirebase = async () => {
    if (!session) {
      console.warn('⚠️ No Clerk session available for Firebase sync');
      return;
    }

    try {
      await authenticateWithClerkAndFirebase(session);
    } catch (error) {
      console.error('Failed to sync Clerk session to Firebase:', error);
      throw error;
    }
  };

  return { syncToFirebase };
}
