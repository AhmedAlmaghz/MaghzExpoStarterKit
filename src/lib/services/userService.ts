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
    },

    /**
     * Get all addresses for a user
     */
    async getUserAddresses(userId: string) {
        const { data, error } = await supabase
            .from(TABLES.USER_ADDRESSES)
            .select('*')
            .eq('user_id', userId)
            .order('is_default', { ascending: false });

        if (error) throw error;
        return data;
    },

    /**
     * Add a new address
     */
    async addAddress(userId: string, address: any) {
        // If this is the default, unset other defaults
        if (address.is_default) {
            await supabase
                .from(TABLES.USER_ADDRESSES)
                .update({ is_default: false })
                .eq('user_id', userId);
        }

        const { data, error } = await supabase
            .from(TABLES.USER_ADDRESSES)
            .insert([{ ...address, user_id: userId }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Delete an address
     */
    async deleteAddress(addressId: string) {
        const { error } = await supabase
            .from(TABLES.USER_ADDRESSES)
            .delete()
            .eq('id', addressId);

        if (error) throw error;
    },

    /**
     * Get all payment methods for a user
     */
    async getUserPaymentMethods(userId: string) {
        const { data, error } = await supabase
            .from(TABLES.USER_PAYMENT_METHODS)
            .select('*')
            .eq('user_id', userId)
            .order('is_default', { ascending: false });

        if (error) throw error;
        return data;
    },

    /**
     * Add a payment method
     */
    async addPaymentMethod(userId: string, method: any) {
        const { data, error } = await supabase
            .from(TABLES.USER_PAYMENT_METHODS)
            .insert([{ ...method, user_id: userId }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Delete a payment method
     */
    async deletePaymentMethod(methodId: string) {
        const { error } = await supabase
            .from(TABLES.USER_PAYMENT_METHODS)
            .delete()
            .eq('id', methodId);

        if (error) throw error;
    },

    /**
     * Update profile details
     */
    async updateProfile(userId: string, data: any) {
        const { error } = await supabase
            .from(TABLES.PROFILES)
            .update({ ...data, updated_at: new Date().toISOString() })
            .eq('user_id', userId);

        if (error) throw error;
        return true;
    },

    /**
     * Update user phone number
     */
    async updateUserPhone(userId: string, phone: string) {
        const { error } = await supabase
            .from(TABLES.USERS)
            .update({ phone, updated_at: new Date().toISOString() })
            .eq('id', userId);

        if (error) throw error;
        return true;
    }
};
