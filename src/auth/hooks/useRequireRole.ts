import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from './useAuth';
import type { UserRole } from '../types/auth.types';

/**
 * useRequireRole
 * 
 * A security hook that ensures the user is authenticated and has the required role.
 * If the user doesn't meet the requirements, they are redirected to appropriate screens.
 * 
 * @param requiredRole - The minimum role required ('user', 'admin', 'superadmin')
 */
export function useRequireRole(requiredRole: UserRole = 'user') {
    const { status, user, isAdmin, isSuperAdmin } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        // 1. Wait until auth state is determined
        if (status === 'loading') return;

        // 2. If unauthenticated, send to login
        if (status === 'unauthenticated') {
            router.replace('/(auth)/login');
            return;
        }

        // 3. Role-based checks
        if (requiredRole === 'superadmin' && !isSuperAdmin) {
            console.warn('[Security] Unauthorized access attempt to superadmin area by:', user?.email);
            router.replace('/(main)'); // Kick back to public home
            return;
        }

        if (requiredRole === 'admin' && !isAdmin && !isSuperAdmin) {
            console.warn('[Security] Unauthorized access attempt to admin area by:', user?.email);
            router.replace('/(main)'); // Kick back to public home
            return;
        }

    }, [status, user, requiredRole, segments, router]);

    return { status, user, isAuthorized: true };
}
