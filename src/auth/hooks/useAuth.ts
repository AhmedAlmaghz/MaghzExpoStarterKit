/**
 * useAuth Hook
 *
 * Custom hook for accessing authentication state and actions.
 * Provides a convenient interface for components to interact with auth.
 *
 * @module auth/hooks/useAuth
 */
import { useCallback, useEffect } from 'react';
import { useAuthStore } from '../authStore';
import { authService } from '../services/authService';
import { sessionService } from '../services/sessionService';
import type { EmailCredentials, PhoneCredentials, RegistrationData } from '../types/auth.types';

/**
 * Hook for authentication state and actions
 * @returns Auth state and action functions
 */
export function useAuth() {
    const {
        status,
        user,
        session,
        isLoading,
        error,
        login,
        loginWithGoogle,
        loginWithApple,
        register,
        logout,
        refreshSession,
        resetPassword,
        updatePassword,
        verifyEmail,
        verifyPhone,
        clearError,
    } = useAuthStore();

    /**
     * Initialize auth state on mount
     */
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const isValid = await sessionService.isSessionValid();
                if (isValid) {
                    const currentUser = await authService.getCurrentUser();
                    const currentSession = await sessionService.getStoredSession();
                    if (currentUser && currentSession) {
                        useAuthStore.getState().setUser(currentUser);
                        useAuthStore.getState().setSession(currentSession);
                    }
                } else {
                    // Try to refresh the session
                    const newSession = await sessionService.refreshSession();
                    if (newSession) {
                        const currentUser = await authService.getCurrentUser();
                        if (currentUser) {
                            useAuthStore.getState().setUser(currentUser);
                            useAuthStore.getState().setSession(newSession);
                        }
                    }
                }
            } catch {
                // Session is invalid, user needs to login again
            }
        };

        initializeAuth();

        // Subscribe to auth state changes
        const unsubscribe = authService.onAuthStateChange((event, newSession) => {
            if (event === 'SIGNED_IN' && newSession) {
                useAuthStore.getState().setSession(newSession);
            } else if (event === 'SIGNED_OUT') {
                useAuthStore.getState().setUser(null);
                useAuthStore.getState().setSession(null);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    /**
     * Check if user is authenticated
     */
    const isAuthenticated = status === 'authenticated';

    /**
     * Check if user is an admin
     */
    const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

    /**
     * Check if user is a super admin
     */
    const isSuperAdmin = user?.role === 'superadmin';

    /**
     * Handle email login with error clearing
     */
    const handleLogin = useCallback(
        async (credentials: EmailCredentials | PhoneCredentials) => {
            clearError();
            await login(credentials);
        },
        [login, clearError]
    );

    /**
     * Handle registration with error clearing
     */
    const handleRegister = useCallback(
        async (data: RegistrationData) => {
            clearError();
            await register(data);
        },
        [register, clearError]
    );

    /**
     * Handle logout with error clearing
     */
    const handleLogout = useCallback(async () => {
        clearError();
        await logout();
    }, [logout, clearError]);

    return {
        // State
        status,
        user,
        session,
        isLoading,
        error,
        isAuthenticated,
        isAdmin,
        isSuperAdmin,

        // Actions
        login: handleLogin,
        loginWithGoogle,
        loginWithApple,
        register: handleRegister,
        logout: handleLogout,
        refreshSession,
        resetPassword,
        updatePassword,
        verifyEmail,
        verifyPhone,
        clearError,
    };
}