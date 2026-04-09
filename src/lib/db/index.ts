/**
 * Database Client
 *
 * Database operations using Supabase client.
 * Provides typed database operations for queries and mutations.
 *
 * @module lib/db
 */
import { supabase } from '../supabase';
import * as schema from './schema';

/**
 * Re-export schema types
 */
export * from './schema';

/**
 * Database service for common operations
 */
export const database = {
    /**
     * Get the Supabase client
     */
    get client() {
        return supabase;
    },

    /**
     * Generate a unique ID
     */
    generateId: (): string => {
        return crypto.randomUUID();
    },

    /**
     * Get current timestamp in ISO format
     */
    timestamp: (): string => {
        return new Date().toISOString();
    },
};
