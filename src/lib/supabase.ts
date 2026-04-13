/**
 * Supabase Client Configuration
 *
 * Initializes and exports the Supabase client for authentication,
 * database operations, and real-time subscriptions.
 *
 * IMPORTANT: Client is lazy-initialized to prevent crashes when
 * environment variables are missing. This allows the app to start
 * even without proper Supabase configuration.
 *
 * @module lib/supabase
 * @see https://supabase.com/docs/reference/javascript/introduction
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
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
 * Lazy-initialized Supabase client instance
 * Only created when first accessed, not at module import time.
 * This prevents crashes when environment variables are missing.
 */
let _supabaseClient: SupabaseClient | null = null;

/**
 * Get or create the Supabase client
 * Returns null if URL/KEY are not configured
 */
function getSupabaseClient(): SupabaseClient | null {
  // Check if already initialized
  if (_supabaseClient) {
    return _supabaseClient;
  }

  // Validate configuration
  if (!SUPABASE.URL || !SUPABASE.KEY) {
    console.warn(
      '[Supabase] Missing configuration: EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_KEY must be set'
    );
    return null;
  }

  // Create client with error handling
  try {
    _supabaseClient = createClient(SUPABASE.URL, SUPABASE.KEY, {
      auth: {
        storage: supabaseStorageAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
    return _supabaseClient;
  } catch (error) {
    console.error('[Supabase] Failed to create client:', error);
    return null;
  }
}

/**
 * Create a no-op auth object for when Supabase is not configured
 */
function createNoOpAuth() {
  const error = { message: 'Supabase not configured' };
  return {
    getSession: async () => ({ data: { session: null }, error }),
    getUser: async () => ({ data: { user: null }, error }),
    signInWithPassword: async () => ({ data: { session: null, user: null }, error }),
    signUp: async () => ({ data: { session: null, user: null }, error }),
    signOut: async () => ({ error }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
    refreshSession: async () => ({ data: { session: null }, error }),
    signInWithOAuth: async () => ({ data: { url: null, session: null }, error }),
    signInWithApple: async () => ({ data: { url: null, session: null }, error }),
    verifyOtp: async () => ({ data: { session: null, user: null }, error }),
    signInWithOtp: async () => ({ error }),
    resetPasswordForEmail: async () => ({ error }),
    updateUser: async () => ({ data: { user: null }, error }),
  };
}

/**
 * Create a no-op query builder for when Supabase is not configured
 */
function createNoOpQuery() {
  const error = { message: 'Supabase not configured' };
  const createErrorQuery = () => ({
    data: null,
    error,
    eq: () => createErrorQuery(),
    neq: () => createErrorQuery(),
    gt: () => createErrorQuery(),
    gte: () => createErrorQuery(),
    lt: () => createErrorQuery(),
    lte: () => createErrorQuery(),
    like: () => createErrorQuery(),
    ilike: () => createErrorQuery(),
    is: () => createErrorQuery(),
    in: () => createErrorQuery(),
    contains: () => createErrorQuery(),
    containedBy: () => createErrorQuery(),
    rangeGt: () => createErrorQuery(),
    rangeGte: () => createErrorQuery(),
    rangeLt: () => createErrorQuery(),
    rangeLte: () => createErrorQuery(),
    rangeAdjacent: () => createErrorQuery(),
    textSearch: () => createErrorQuery(),
    match: () => createErrorQuery(),
    not: () => createErrorQuery(),
    or: () => createErrorQuery(),
    and: () => createErrorQuery(),
    order: () => createErrorQuery(),
    limit: () => createErrorQuery(),
    range: () => createErrorQuery(),
    single: () => Promise.resolve({ data: null, error }),
    maybeSingle: () => Promise.resolve({ data: null, error }),
    select: () => createErrorQuery(),
    insert: () => createErrorQuery(),
    update: () => createErrorQuery(),
    upsert: () => createErrorQuery(),
    delete: () => createErrorQuery(),
    then: (cb: any) => cb({ data: null, error }),
  });
  return createErrorQuery();
}

/**
 * Supabase client export (lazy initialization)
 * Use this instead of the direct client for crash-safe access
 */
export const supabase = {
  get client(): SupabaseClient | null {
    return getSupabaseClient();
  },

  // Convenience getter for auth - returns no-op auth if not configured
  get auth() {
    const client = getSupabaseClient();
    if (!client) {
      return createNoOpAuth();
    }
    return client.auth;
  },

  // Convenience getter for from() - returns error query if not configured
  get from() {
    return (table: string) => {
      const client = getSupabaseClient();
      if (!client) {
        return createNoOpQuery();
      }
      return client.from(table);
    };
  },
};

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
  ANALYTICS_EVENTS: 'analytics_events',
  PUBLIC_PAGES: 'public_pages',
  SYSTEM_SETTINGS: 'system_settings',
  USER_ADDRESSES: 'user_addresses',
  USER_PAYMENT_METHODS: 'user_payment_methods',
} as const;

/**
 * Storage bucket names
 */
export const BUCKETS = {
  AVATARS: 'avatars',
  DOCUMENTS: 'documents',
  ASSETS: 'assets',
} as const;
