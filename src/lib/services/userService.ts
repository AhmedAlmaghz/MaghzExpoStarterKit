import { supabase, TABLES } from '../supabase';

/**
 * User Service
 * 
 * Handles user-specific data operations such as profile management,
 * fetching personal statistics, and account settings.
 */
export const userService = {
    /**
     * Get the full profile and user record for the current session
     */
    async getCurrentUserProfile(userId: string) {
        try {
            const { data, error } = await supabase
                .from(TABLES.USERS)
                .select(`
                    *,
                    profiles:profiles(*)
                `)
                .eq('id', userId)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('[UserService] Failed to fetch current user profile:', error);
            throw error;
        }
    },

    /**
     * Get user activity metrics (placeholder for real activity logic)
     */
    async getUserMetrics(userId: string) {
        // In a real app, this would query orders, posts, or points tables
        // For now, we'll return some info from the user record
        const profile = await this.getCurrentUserProfile(userId);
        
        return {
            points: profile?.points || 0,
            status: profile?.status || 'active',
            memberSince: profile?.created_at
        };
    }
};
