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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPABASE } from './constants';

/**
 * Supabase client instance
 * Configured with AsyncStorage for React Native persistence
 */
export const supabase = createClient(SUPABASE.URL, SUPABASE.KEY, {
    auth: {
        storage: AsyncStorage,
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
