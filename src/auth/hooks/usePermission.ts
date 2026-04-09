/**
 * usePermission Hook
 *
 * Custom hook for checking user permissions and roles.
 * Provides reactive permission checking for components.
 *
 * @module auth/hooks/usePermission
 */
import { useState, useCallback, useEffect } from 'react';
import { useAuthStore } from '../authStore';
import { permissionService } from '../services/permissionService';
import type { UserRole, Permission } from '../types/auth.types';

/**
 * Hook for permission and role checking
 * @returns Permission checking functions
 */
export function usePermission() {
    const user = useAuthStore((state) => state.user);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Load user permissions
     */
    useEffect(() => {
        const loadPermissions = async () => {
            if (user?.id) {
                setIsLoading(true);
                try {
                    const userPermissions = await permissionService.getUserPermissions(user.id);
                    setPermissions(userPermissions);
                } catch {
                    setPermissions([]);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setPermissions([]);
            }
        };

        loadPermissions();
    }, [user?.id]);

    /**
     * Check if current user has a specific permission
     */
    const hasPermission = useCallback(
        (permission: string): boolean => {
            return permissions.some((p) => p.name === permission);
        },
        [permissions]
    );

    /**
     * Check if current user has any of the specified permissions
     */
    const hasAnyPermission = useCallback(
        (permissionList: string[]): boolean => {
            return permissionList.some((p) => permissions.some((up) => up.name === p));
        },
        [permissions]
    );

    /**
     * Check if current user has all of the specified permissions
     */
    const hasAllPermissions = useCallback(
        (permissionList: string[]): boolean => {
            return permissionList.every((p) => permissions.some((up) => up.name === p));
        },
        [permissions]
    );

    /**
     * Check if current user has a specific role
     */
    const hasRole = useCallback(
        (role: UserRole): boolean => {
            if (!user) return false;
            if (role === 'user') return true;
            if (role === 'admin') return user.role === 'admin' || user.role === 'superadmin';
            if (role === 'superadmin') return user.role === 'superadmin';
            return false;
        },
        [user]
    );

    /**
     * Check if current user can perform action on resource
     */
    const can = useCallback(
        (resource: string, action: 'create' | 'read' | 'update' | 'delete' | 'manage'): boolean => {
            return permissions.some(
                (p) => p.resource === resource && (p.action === action || p.action === 'manage')
            );
        },
        [permissions]
    );

    /**
     * Refresh permissions from server
     */
    const refreshPermissions = useCallback(async () => {
        if (user?.id) {
            setIsLoading(true);
            try {
                permissionService.clearCache(user.id);
                const userPermissions = await permissionService.getUserPermissions(user.id);
                setPermissions(userPermissions);
            } catch {
                setPermissions([]);
            } finally {
                setIsLoading(false);
            }
        }
    }, [user?.id]);

    return {
        permissions,
        isLoading,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        can,
        refreshPermissions,
    };
}