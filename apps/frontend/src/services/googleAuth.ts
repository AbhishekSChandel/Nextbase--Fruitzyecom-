import { GoogleAuthProvider, signInWithCredential, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase';
import { Platform } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';

const GOOGLE_AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';

WebBrowser.maybeCompleteAuthSession();

const getExpoExtra = (): Record<string, string | undefined> => {
  return (
    (Constants.expoConfig?.extra as Record<string, string | undefined>) ||
    (Constants.manifest?.extra as Record<string, string | undefined>) ||
    {}
  );
};

const getClientIdForPlatform = (): string | undefined => {
  const extra = getExpoExtra();

  const isExpoGo = Constants.appOwnership === 'expo';
  if (isExpoGo) {
    return extra.googleWebClientId;
  }

  if (Platform.OS === 'android') {
    return extra.googleAndroidClientId || extra.googleWebClientId;
  }

  if (Platform.OS === 'ios') {
    return extra.googleIosClientId || extra.googleWebClientId;
  }

  return extra.googleWebClientId;
};

export const signInWithGoogle = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    if (Platform.OS !== 'web') {
      const clientId = getClientIdForPlatform();

      if (!clientId) {
        return {
          success: false,
          error: 'Google Sign-In is not configured for this platform yet.',
        };
      }

      const useProxy = Constants.appOwnership === 'expo';
      const redirectUri = AuthSession.makeRedirectUri({
        native: Constants.appOwnership === 'expo' ? 'https://auth.expo.io' : undefined,
      });

      const request = new AuthSession.AuthRequest({
        clientId,
        redirectUri,
        responseType: AuthSession.ResponseType.IdToken,
        scopes: ['openid', 'profile', 'email'],
        usePKCE: false,
        extraParams: { prompt: 'consent' },
      });

      const discovery = {
        authorizationEndpoint: GOOGLE_AUTH_ENDPOINT,
      };
      await request.makeAuthUrlAsync(discovery);

      const result = (await request.promptAsync(
        discovery,
        {}
      )) as AuthSession.AuthSessionResult & {
        params?: Record<string, string>;
      };

      if (result.type !== 'success' || !result.params?.id_token) {
        const errorMessage =
          result.type === 'dismiss'
            ? 'Sign-in cancelled'
            : result.params?.error_description ||
              result.params?.error ||
              'Failed to sign in with Google';

        return { success: false, error: errorMessage };
      }

      const credential = GoogleAuthProvider.credential(result.params.id_token);
      await signInWithCredential(auth, credential);

      return { success: true };
    }

    const provider = new GoogleAuthProvider();

    // Use Firebase's built-in popup (works without any OAuth configuration!)
    const result = await signInWithPopup(auth, provider);

    return { success: true };
  } catch (error: any) {
    console.error('❌ Google Sign-In error:', error);

    // Handle specific error codes
    if (error.code === 'auth/popup-closed-by-user') {
      return { success: false, error: 'Sign-in cancelled' };
    }
    if (error.code === 'auth/cancelled-popup-request') {
      return { success: false, error: 'Another sign-in in progress' };
    }
    if (error.code === 'auth/account-exists-with-different-credential') {
      return {
        success: false,
        error:
          'An account with this email already exists using a different sign-in method',
      };
    }

    return { success: false, error: error.message || 'Failed to sign in with Google' };
  }
};
