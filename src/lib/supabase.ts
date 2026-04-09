/**
 * Supabase Client Configuration
 *
 * Initializes and exports the Supabase client for authentication,
 * database operations, and real-time subscriptions.
 *
 * Uses a custom storage adapter that wraps AsyncStorage with error
 * handling to avoid crashes when the native module is unavailable
 * (e.g. during Expo Go first launch or in environments without the
 * native module linked).
 *
 * @module lib/supabase
 * @see https://supabase.com/docs/reference/javascript/introduction
 */
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPABASE } from './constants';

/**
 * Custom Supabase storage adapter
 *
 * Wraps AsyncStorage with try/catch to prevent crashes when the
 * native module is null (common with @react-native-async-storage v3
 * on Expo Go or before native build).
 *
 * Implements the Supabase SupportedStorage interface:
 * @see https://supabase.com/docs/reference/javascript/initializing#custom-storage-adapter
 */
const supabaseStorageAdapter = {
    getItem: async (key: string): Promise<string | null> => {
        try {
            return await AsyncStorage.getItem(key);
        } catch (error) {
            console.warn('[SupabaseStorage] getItem failed:', error);
            return null;
        }
    },
    setItem: async (key: string, value: string): Promise<void> => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.warn('[SupabaseStorage] setItem failed:', error);
        }
    },
    removeItem: async (key: string): Promise<void> => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.warn('[SupabaseStorage] removeItem failed:', error);
        }
    },
};

/**
 * Supabase client instance
 * Configured with custom storage adapter for React Native persistence
 */
export const supabase = createClient(SUPABASE.URL, SUPABASE.KEY, {
    auth: {
        storage: supabaseStorageAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

/**
 * Database table names
 */
export const TABLES = {
    USERS: 'users',
    PROFILES: 'profiles',
    SESSIONS: 'sessions',
    NOTIFICATIONS: 'notifications',
    SETTINGS: 'settings',
    AUDIT_LOGS: 'audit_logs',
    ROLES: 'roles',
    PERMISSIONS: 'permissions',
    ROLE_PERMISSIONS: 'role_permissions',
    USER_ROLES: 'user_roles',
} as const;

/**
 * Storage bucket names
 */
export const BUCKETS = {
    AVATARS: 'avatars',
    DOCUMENTS: 'documents',
    ASSETS: 'assets',
} as const;
