/**
 * MMKV Storage Adapter
 * 
 * High-performance key-value storage using MMKV
 * Much faster than AsyncStorage for React Native
 * 
 * @module lib/mmkv
 */

import { MMKV } from 'react-native-mmkv';

// Create MMKV instance
export const storage = new MMKV({
  id: 'maghz-expo-storage',
  encryptionKey: 'maghz-secure-key',
});

/**
 * Storage keys enum
 */
export const STORAGE_KEYS = {
  // Auth
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_SESSION: 'user_session',
  
  // Theme
  THEME_MODE: 'theme_mode',
  
  // Language
  LANGUAGE: 'language',
  
  // Settings
  ONBOARDING_COMPLETE: 'onboarding_complete',
  FIRST_LAUNCH: 'first_launch',
  
  // Cache
  CACHED_USER: 'cached_user',
  CACHED_SETTINGS: 'cached_settings',
} as const;

/**
 * Storage helper functions
 */
export const storageService = {
  // String operations
  setString: (key: string, value: string) => {
    storage.set(key, value);
  },
  
  getString: (key: string): string | undefined => {
    return storage.getString(key);
  },
  
  // Boolean operations
  setBoolean: (key: string, value: boolean) => {
    storage.set(key, value);
  },
  
  getBoolean: (key: string): boolean | undefined => {
    return storage.getBoolean(key);
  },
  
  // Number operations
  setNumber: (key: string, value: number) => {
    storage.set(key, value);
  },
  
  getNumber: (key: string): number | undefined => {
    return storage.getNumber(key);
  },
  
  // Object operations (JSON)
  setObject: <T>(key: string, value: T) => {
    storage.set(key, JSON.stringify(value));
  },
  
  getObject: <T>(key: string): T | undefined => {
    const value = storage.getString(key);
    if (value) {
      try {
        return JSON.parse(value) as T;
      } catch {
        return undefined;
      }
    }
    return undefined;
  },
  
  // Delete operations
  delete: (key: string) => {
    storage.delete(key);
  },
  
  // Check if key exists
  contains: (key: string): boolean => {
    return storage.contains(key);
  },
  
  // Clear all storage
  clearAll: () => {
    storage.clearAll();
  },
  
  // Get all keys
  getAllKeys: (): string[] => {
    return storage.getAllKeys();
  },
};

export default storageService;