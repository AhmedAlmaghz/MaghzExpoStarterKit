/**
 * Secure Storage Utility
 *
 * Provides encrypted storage for sensitive data using Expo SecureStore
 * with fallback to AsyncStorage for non-sensitive data.
 *
 * @module lib/storage
 */
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage type options
 */
type StorageType = 'secure' | 'async';

/**
 * Storage utility class for managing persistent data
 */
class StorageService {
    /**
     * Store a value securely
     * @param key - Storage key
     * @param value - Value to store
     * @param type - Storage type (secure or async)
     */
    async setItem<T>(key: string, value: T, type: StorageType = 'async'): Promise<void> {
        const serialized = JSON.stringify(value);

        if (type === 'secure') {
            await SecureStore.setItemAsync(key, serialized);
        } else {
            await AsyncStorage.setItem(key, serialized);
        }
    }

    /**
     * Retrieve a value from storage
     * @param key - Storage key
     * @param type - Storage type (secure or async)
     * @returns The stored value or null if not found
     */
    async getItem<T>(key: string, type: StorageType = 'async'): Promise<T | null> {
        try {
            const serialized = type === 'secure'
                ? await SecureStore.getItemAsync(key)
                : await AsyncStorage.getItem(key);

            return serialized ? JSON.parse(serialized) : null;
        } catch {
            return null;
        }
    }

    /**
     * Remove a value from storage
     * @param key - Storage key
     * @param type - Storage type (secure or async)
     */
    async removeItem(key: string, type: StorageType = 'async'): Promise<void> {
        if (type === 'secure') {
            await SecureStore.deleteItemAsync(key);
        } else {
            await AsyncStorage.removeItem(key);
        }
    }

    /**
     * Clear all storage (async only - SecureStore doesn't support clear all)
     */
    async clearAsync(): Promise<void> {
        await AsyncStorage.clear();
    }

    /**
     * Get all keys from async storage
     */
    async getAllKeys(): Promise<readonly string[]> {
        return await AsyncStorage.getAllKeys();
    }

    /**
     * Multi-get values from async storage
     * @param keys - Array of keys to retrieve
     */
    async multiGet<T>(keys: string[]): Promise<(T | null)[]> {
        const results: (T | null)[] = [];
        for (const key of keys) {
            const value = await this.getItem<T>(key);
            results.push(value);
        }
        return results;
    }

    /**
     * Multi-set values in async storage
     * @param pairs - Array of key-value pairs
     */
    async multiSet<T>(pairs: [string, T][]): Promise<void> {
        for (const [key, value] of pairs) {
            await this.setItem(key, value);
        }
    }
}

export const storage = new StorageService();
