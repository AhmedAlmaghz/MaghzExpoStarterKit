/**
 * Persistent Storage Utility
 *
 * Provides persistent storage for the application using AsyncStorage
 * and expo-secure-store for sensitive data.
 *
 * @module lib/storage
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

/**
 * Storage type options
 */
type StorageType = 'secure' | 'async';

/**
 * Storage utility class for managing persistent data
 */
class StorageService {
  /**
   * Store a value
   */
  async setItem<T>(
    key: string,
    value: T,
    type: StorageType = 'async',
  ): Promise<void> {
    try {
        const serialized = JSON.stringify(value);
        if (type === 'secure') {
            await SecureStore.setItemAsync(key, serialized);
        } else {
            await AsyncStorage.setItem(key, serialized);
        }
    } catch (error) {
        console.error(`[Storage] Error setting item ${key}:`, error);
    }
  }

  /**
   * Retrieve a value from storage
   */
  async getItem<T>(
    key: string,
    type: StorageType = 'async',
  ): Promise<T | null> {
    try {
        let serialized: string | null = null;
        if (type === 'secure') {
            serialized = await SecureStore.getItemAsync(key);
        } else {
            serialized = await AsyncStorage.getItem(key);
        }

        if (!serialized) return null;
        return JSON.parse(serialized) as T;
    } catch (error) {
        console.error(`[Storage] Error getting item ${key}:`, error);
        return null;
    }
  }

  /**
   * Remove a value from storage
   */
  async removeItem(key: string, type: StorageType = 'async'): Promise<void> {
    try {
        if (type === 'secure') {
            await SecureStore.deleteItemAsync(key);
        } else {
            await AsyncStorage.removeItem(key);
        }
    } catch (error) {
        console.error(`[Storage] Error removing item ${key}:`, error);
    }
  }

  /**
   * Clear all async storage (does not clear secure storage for safety)
   */
  async clearAsync(): Promise<void> {
    try {
        await AsyncStorage.clear();
    } catch (error) {
        console.error('[Storage] Error clearing AsyncStorage:', error);
    }
  }

  /**
   * Get all keys from AsyncStorage
   */
  async getAllKeys(): Promise<readonly string[]> {
    try {
        return await AsyncStorage.getAllKeys();
    } catch (error) {
        console.error('[Storage] Error getting all keys:', error);
        return [];
    }
  }

  /**
   * Multi-get values from AsyncStorage
   */
  async multiGet<T>(keys: string[]): Promise<(T | null)[]> {
    try {
        const pairs = await AsyncStorage.multiGet(keys);
        return pairs.map(([_, value]) => {
            if (!value) return null;
            try {
                return JSON.parse(value) as T;
            } catch {
                return null;
            }
        });
    } catch (error) {
        console.error('[Storage] Error multi-getting items:', error);
        return keys.map(() => null);
    }
  }

  /**
   * Multi-set values to AsyncStorage
   */
  async multiSet<T>(pairs: [string, T][]): Promise<void> {
    try {
        const serializedPairs: [string, string][] = pairs.map(([key, value]) => [
            key,
            JSON.stringify(value),
        ]);
        await AsyncStorage.multiSet(serializedPairs);
    } catch (error) {
        console.error('[Storage] Error multi-setting items:', error);
    }
  }
}

export const storage = new StorageService();
