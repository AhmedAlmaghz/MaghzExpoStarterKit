import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from './useAuth';

/**
 * Hook to protect routes that require authentication.
 * Redirects to the login screen if the user is not authenticated.
 * 
 * @param redirectTo - The path to redirect to if not authenticated (default: '/(auth)/login')
 */
export function useRequireAuth(redirectTo: string = '/(auth)/login') {
    const { status } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.replace(redirectTo as any);
        }
    }, [status, router, redirectTo]);

    return { status };
}
