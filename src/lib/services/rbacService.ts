/**
 * RBAC Service
 * 
 * Manages Roles, Permissions, and their associations.
 * Provides functions for advanced user role management.
 * 
 * @module lib/services/rbacService
 */
import { supabase } from '@/lib/supabase';
import { TABLES } from '@/lib/supabase';

export const rbacService = {
    /**
     * Get all available roles
     */
    async getAllRoles() {
        const { data, error } = await supabase
            .from(TABLES.ROLES)
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;
        return data;
    },

    /**
     * Get all available permissions
     */
    async getAllPermissions() {
        const { data, error } = await supabase
            .from(TABLES.PERMISSIONS)
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;
        return data;
    },

    /**
     * Get permissions for a specific role
     */
    async getRolePermissions(roleId: string) {
        const { data, error } = await supabase
            .from(TABLES.ROLE_PERMISSIONS)
            .select('permissions (*)')
            .eq('role_id', roleId);

        if (error) throw error;
        return data.map(item => item.permissions);
    },

    /**
     * Assign a role to a user
     */
    async assignUserRole(userId: string, roleId: string) {
        const { error } = await supabase
            .from(TABLES.USER_ROLES)
            .upsert({ user_id: userId, role_id: roleId });

        if (error) throw error;
        
        // Also update the role string in users table for redundancy/quick check
        const { data: roleData } = await supabase
            .from(TABLES.ROLES)
            .select('name')
            .eq('id', roleId)
            .single();
            
        if (roleData) {
            await supabase
                .from(TABLES.USERS)
                .update({ role: roleData.name })
                .eq('id', userId);
        }
    },

    /**
     * Remove a role from a user
     */
    async removeUserRole(userId: string, roleId: string) {
        const { error } = await supabase
            .from(TABLES.USER_ROLES)
            .delete()
            .match({ user_id: userId, role_id: roleId });

        if (error) throw error;
    },

    /**
     * Create a new role
     */
    async createRole(name: string, displayName: string, description?: string) {
        const { data, error } = await supabase
            .from(TABLES.ROLES)
            .insert([{ name, display_name: displayName, description }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Delete a role
     */
    async deleteRole(roleId: string) {
        const { error } = await supabase
            .from(TABLES.ROLES)
            .delete()
            .eq('id', roleId);

        if (error) throw error;
    }
};
