/**
 * Permission Service
 *
 * Handles role-based access control (RBAC) and permission checking.
 *
 * @module auth/services/permissionService
 */
import { supabase } from '@/lib/supabase';
import type { Permission, RoleWithPermissions, UserRole } from '../types/auth.types';

/**
 * Permission service class
 */
class PermissionService {
    private permissionsCache: Map<string, Permission[]> = new Map();
    private rolesCache: Map<string, RoleWithPermissions[]> = new Map();

    /**
     * Check if user has a specific permission
     * @param userId - User ID
     * @param permission - Permission name to check
     * @returns True if user has permission
     */
    async hasPermission(userId: string, permission: string): Promise<boolean> {
        const permissions = await this.getUserPermissions(userId);
        return permissions.some((p) => p.name === permission);
    }

    /**
     * Check if user has any of the specified permissions
     * @param userId - User ID
     * @param permissions - Array of permission names to check
     * @returns True if user has any of the permissions
     */
    async hasAnyPermission(userId: string, permissions: string[]): Promise<boolean> {
        const userPermissions = await this.getUserPermissions(userId);
        return permissions.some((p) => userPermissions.some((up) => up.name === p));
    }

    /**
     * Check if user has all of the specified permissions
     * @param userId - User ID
     * @param permissions - Array of permission names to check
     * @returns True if user has all permissions
     */
    async hasAllPermissions(userId: string, permissions: string[]): Promise<boolean> {
        const userPermissions = await this.getUserPermissions(userId);
        return permissions.every((p) => userPermissions.some((up) => up.name === p));
    }

    /**
     * Check if user has a specific role
     * @param userId - User ID
     * @param role - Role to check
     * @returns True if user has role
     */
    async hasRole(userId: string, role: UserRole): Promise<boolean> {
        const userRoles = await this.getUserRoles(userId);
        return userRoles.some((r) => r.name === role);
    }

    /**
     * Get all permissions for a user
     * @param userId - User ID
     * @returns Array of permissions
     */
    async getUserPermissions(userId: string): Promise<Permission[]> {
        // Check cache first
        if (this.permissionsCache.has(userId)) {
            return this.permissionsCache.get(userId) || [];
        }

        const { data, error } = await supabase
            .from('user_roles')
            .select(`
        role:roles (
          id,
          name,
          display_name,
          permissions:role_permissions (
            permission:permissions (*)
          )
        )
      `)
            .eq('user_id', userId);

        if (error || !data) {
            return [];
        }

        // Flatten permissions from all roles
        const permissions: Permission[] = [];
        for (const userRole of data) {
            const roleData = userRole.role as unknown as {
                permissions: { permission: Permission }[];
            };
            for (const perm of roleData.permissions) {
                if (!permissions.some((p) => p.id === perm.permission.id)) {
                    permissions.push(perm.permission);
                }
            }
        }

        // Cache the result
        this.permissionsCache.set(userId, permissions);

        return permissions;
    }

    /**
     * Get all roles for a user
     * @param userId - User ID
     * @returns Array of roles with permissions
     */
    async getUserRoles(userId: string): Promise<RoleWithPermissions[]> {
        // Check cache first
        if (this.rolesCache.has(userId)) {
            return this.rolesCache.get(userId) || [];
        }

        const { data, error } = await supabase
            .from('user_roles')
            .select(`
        role:roles (
          id,
          name,
          display_name,
          description,
          permissions:role_permissions (
            permission:permissions (*)
          )
        )
      `)
            .eq('user_id', userId);

        if (error || !data) {
            return [];
        }

        const roles: RoleWithPermissions[] = data.map((item) => {
            const roleData = item.role as unknown as {
                id: string;
                name: string;
                display_name: string;
                description?: string;
                permissions: { permission: Permission }[];
            };

            return {
                id: roleData.id,
                name: roleData.name,
                displayName: roleData.display_name,
                permissions: roleData.permissions.map((p) => p.permission),
            };
        });

        // Cache the result
        this.rolesCache.set(userId, roles);

        return roles;
    }

    /**
     * Check if user can perform action on resource
     * @param userId - User ID
     * @param resource - Resource name
     * @param action - Action to perform
     * @returns True if user can perform action
     */
    async can(userId: string, resource: string, action: 'create' | 'read' | 'update' | 'delete' | 'manage'): Promise<boolean> {
        const permissions = await this.getUserPermissions(userId);
        return permissions.some(
            (p) => p.resource === resource && (p.action === action || p.action === 'manage')
        );
    }

    /**
     * Clear permission cache for a user
     * @param userId - User ID
     */
    clearCache(userId: string): void {
        this.permissionsCache.delete(userId);
        this.rolesCache.delete(userId);
    }

    /**
     * Clear all caches
     */
    clearAllCaches(): void {
        this.permissionsCache.clear();
        this.rolesCache.clear();
    }

    /**
     * Get default permissions for a role
     * @param role - Role name
     * @returns Array of default permissions
     */
    getDefaultPermissions(role: UserRole): Permission[] {
        const defaultPermissions: Record<UserRole, Permission[]> = {
            user: [
                { id: '1', name: 'read_own_profile', displayName: 'Read Own Profile', resource: 'profile', action: 'read' },
                { id: '2', name: 'update_own_profile', displayName: 'Update Own Profile', resource: 'profile', action: 'update' },
                { id: '3', name: 'read_own_settings', displayName: 'Read Own Settings', resource: 'settings', action: 'read' },
                { id: '4', name: 'update_own_settings', displayName: 'Update Own Settings', resource: 'settings', action: 'update' },
            ],
            admin: [
                { id: '1', name: 'read_own_profile', displayName: 'Read Own Profile', resource: 'profile', action: 'read' },
                { id: '2', name: 'update_own_profile', displayName: 'Update Own Profile', resource: 'profile', action: 'update' },
                { id: '3', name: 'read_own_settings', displayName: 'Read Own Settings', resource: 'settings', action: 'read' },
                { id: '4', name: 'update_own_settings', displayName: 'Update Own Settings', resource: 'settings', action: 'update' },
                { id: '5', name: 'read_users', displayName: 'Read Users', resource: 'users', action: 'read' },
                { id: '6', name: 'update_users', displayName: 'Update Users', resource: 'users', action: 'update' },
                { id: '7', name: 'read_analytics', displayName: 'Read Analytics', resource: 'analytics', action: 'read' },
                { id: '8', name: 'manage_content', displayName: 'Manage Content', resource: 'content', action: 'manage' },
            ],
            superadmin: [
                { id: '1', name: 'manage_all', displayName: 'Manage All', resource: 'all', action: 'manage' },
            ],
        };

        return defaultPermissions[role] || defaultPermissions.user;
    }
}

export const permissionService = new PermissionService();
