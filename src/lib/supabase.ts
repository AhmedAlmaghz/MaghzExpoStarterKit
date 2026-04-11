/**
 * Supabase Client Configuration
 *
 * Initializes and exports the Supabase client for authentication,
 * database operations, and real-time subscriptions.
 *
 * @module lib/supabase
 * @see https://supabase.com/docs/reference/javascript/introduction
 */
import { createClient } from '@supabase/supabase-js';
import { SUPABASE } from './constants';

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Custom Supabase storage adapter using AsyncStorage
 *
 * Implements the Supabase SupportedStorage interface:
 * @see https://supabase.com/docs/reference/javascript/initializing#custom-storage-adapter
 */
const supabaseStorageAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    return AsyncStorage.getItem(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    return AsyncStorage.setItem(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    return AsyncStorage.removeItem(key);
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
