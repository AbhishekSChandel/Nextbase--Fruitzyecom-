import { FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase';
import { Platform } from 'react-native';

export const signInWithFacebook = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    // Only works on web platform
    if (Platform.OS !== 'web') {
      return {
        success: false,
        error:
          'Facebook Sign-In is only available on web. Please use email sign-in on mobile.',
      };
    }

    const provider = new FacebookAuthProvider();

    // Use Firebase's built-in popup
    const result = await signInWithPopup(auth, provider);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Facebook Sign-In error:', error);

    // Handle specific error codes
    if (error.code === 'auth/popup-closed-by-user') {
      return { success: false, error: 'Sign-in cancelled' };
    }
    if (error.code === 'auth/account-exists-with-different-credential') {
      return {
        success: false,
        error:
          'An account with this email already exists using a different sign-in method',
      };
    }

    return { success: false, error: error.message || 'Failed to sign in with Facebook' };
  }
};
