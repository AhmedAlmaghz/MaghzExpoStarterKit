/**
 * Secure Storage Utility
 *
 * Provides encrypted storage for sensitive data using Expo SecureStore
 * with fallback to AsyncStorage for non-sensitive data.
 *
 * All AsyncStorage calls are wrapped in try/catch to prevent crashes
 * when the native module is unavailable (e.g. Expo Go first launch,
 * environments without the native module linked).
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
            try {
                await AsyncStorage.setItem(key, serialized);
            } catch (error) {
                console.warn('[Storage] setItem failed:', error);
            }
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
        } catch (error) {
            console.warn('[Storage] getItem failed:', error);
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
            try {
                await AsyncStorage.removeItem(key);
            } catch (error) {
                console.warn('[Storage] removeItem failed:', error);
            }
        }
    }

    /**
     * Clear all storage (async only - SecureStore doesn't support clear all)
     */
    async clearAsync(): Promise<void> {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.warn('[Storage] clearAsync failed:', error);
        }
    }

    /**
     * Get all keys from async storage
     */
    async getAllKeys(): Promise<readonly string[]> {
        try {
            return await AsyncStorage.getAllKeys();
        } catch (error) {
            console.warn('[Storage] getAllKeys failed:', error);
            return [];
        }
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
