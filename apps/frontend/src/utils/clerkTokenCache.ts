import * as SecureStore from 'expo-secure-store';

/**
 * Token cache interface matching Clerk's TokenCache type
 */
interface TokenCache {
  getToken(key: string): Promise<string | null>;
  saveToken(key: string, value: string): Promise<void>;
}

/**
 * Token cache implementation using expo-secure-store.
 * This securely stores Clerk tokens on the device.
 */
export const tokenCache: TokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Error getting token from secure store:', error);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Error saving token to secure store:', error);
    }
  },
};
