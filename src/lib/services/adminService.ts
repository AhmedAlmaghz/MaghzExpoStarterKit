import { supabase, TABLES } from '../supabase';

/**
 * Admin Service
 * 
 * Handles administrative data operations such as fetching system metrics,
 * managing user roles, and monitoring system activity.
 */
export const adminService = {
    /**
     * Get system-wide metrics for the Admin Dashboard
     */
    async getDashboardMetrics() {
        try {
            // Fetch total users count
            const { count: totalUsers, error: usersError } = await supabase
                .from(TABLES.USERS)
                .select('*', { count: 'exact', head: true });

            if (usersError) throw usersError;

            // Fetch active users (e.g., users who signed in in the last 24h)
            // Note: This is a placeholder logic based on 'updated_at' 
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
            const { count: activeUsers, error: activeError } = await supabase
                .from(TABLES.USERS)
                .select('*', { count: 'exact', head: true })
                .gt('updated_at', oneDayAgo);

            if (activeError) throw activeError;

            // Fetch recent registrations (last 7 days)
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
            const { count: newUsers, error: newError } = await supabase
                .from(TABLES.USERS)
                .select('*', { count: 'exact', head: true })
                .gt('created_at', weekAgo);

            if (newError) throw newError;

            // Fetch suspended users
            const { count: suspendedUsers, error: suspendedError } = await supabase
                .from(TABLES.USERS)
                .select('*', { count: 'exact', head: true })
                .eq('status', 'suspended');

            if (suspendedError) throw suspendedError;

            return {
                totalUsers: totalUsers || 0,
                activeUsers: activeUsers || 0,
                newUsers: newUsers || 0,
                suspendedUsers: suspendedUsers || 0
            };
        } catch (error) {
            console.error('[AdminService] Failed to fetch metrics:', error);
            throw error;
        }
    },

    /**
     * Get system-wide audit logs
     */
    async getAuditLogs(limit = 20) {
        try {
            const { data, error } = await supabase
                .from(TABLES.AUDIT_LOGS)
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('[AdminService] Failed to fetch audit logs:', error);
            throw error;
        }
    },

    /**
     * Get user growth stats for the last 7 days
     */
    async getGrowthStats() {
        try {
            const { data, error } = await supabase
                .from(TABLES.USERS)
                .select('created_at');

            if (error) throw error;
            
            // Basic grouping by day for simulation/display
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const growthData = days.map(day => ({ day, count: 0 }));
            
            // In a real app, this would be a sophisticated aggregation
            // Here we just simulate grouping for UI demonstration
            data?.forEach(u => {
                const dayIndex = new Date(u.created_at).getDay();
                growthData[dayIndex].count++;
            });
            
            return growthData;
        } catch (error) {
            console.error('[AdminService] Failed to fetch growth stats:', error);
            throw error;
        }
    },

    /**
     * Get list of all users with their profiles
     */
    async getAllUsers() {
        try {
            const { data, error } = await supabase
                .from(TABLES.USERS)
                .select(`
                    *,
                    profiles:profiles(*)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('[AdminService] Failed to fetch users:', error);
            throw error;
        }
    },

    /**
     * Update user role or status
     */
    async updateUser(userId: string, updates: { role?: string; status?: string }) {
        try {
            const { data, error } = await supabase
                .from(TABLES.USERS)
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', userId)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('[AdminService] Failed to update user:', error);
            throw error;
        }
    },

    /**
     * Delete a user record
     */
    async deleteUser(userId: string) {
        try {
            const { error } = await supabase
                .from(TABLES.USERS)
                .delete()
                .eq('id', userId);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('[AdminService] Failed to delete user:', error);
            throw error;
        }
    }
};
