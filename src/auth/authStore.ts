/**
 * Auth Store
 *
 * Zustand state management for authentication.
 * Manages user state, session, and auth actions.
 *
 * @module auth/authStore
 */
import { create } from 'zustand';
import { authService } from './services/authService';
import { sessionService } from './services/sessionService';
import type {
    AuthStore,
    AuthUser,
    AuthSession,
    EmailCredentials,
    PhoneCredentials,
    RegistrationData,
} from './types/auth.types';

/**
 * Initial auth state
 */
const initialState = {
    status: 'loading' as const,
    user: null as AuthUser | null,
    session: null as AuthSession | null,
    isLoading: false,
    error: null as string | null,
};

/**
 * Auth store with Zustand
 */
export const useAuthStore = create<AuthStore>((set, get) => ({
    ...initialState,

    /**
     * Login with credentials
     */
    login: async (credentials: EmailCredentials | PhoneCredentials) => {
        set({ isLoading: true, error: null });
        try {
            if ('email' in credentials) {
                const { user, session } = await authService.loginWithEmail(credentials);
                set({
                    status: 'authenticated',
                    user,
                    session,
                    isLoading: false,
                });
                await sessionService.storeSession(session);
            } else {
                const { user, session } = await authService.loginWithPhone(credentials);
                set({
                    status: 'authenticated',
                    user,
                    session,
                    isLoading: false,
                });
                await sessionService.storeSession(session);
            }
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Login failed',
            });
        }
    },

    /**
     * Login with Google OAuth
     */
    loginWithGoogle: async () => {
        set({ isLoading: true, error: null });
        try {
            await authService.loginWithGoogle();
            // OAuth flow will be handled by onAuthStateChange
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Google login failed',
            });
        }
    },

    /**
     * Login with Apple
     */
    loginWithApple: async () => {
        set({ isLoading: true, error: null });
        try {
            await authService.loginWithApple();
            // OAuth flow will be handled by onAuthStateChange
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Apple login failed',
            });
        }
    },

    /**
     * Register new user
     */
    register: async (data: RegistrationData) => {
        set({ isLoading: true, error: null });
        try {
            const { user, session } = await authService.register(data);
            set({
                status: 'authenticated',
                user,
                session,
                isLoading: false,
            });
            if (session) {
                await sessionService.storeSession(session);
            }
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Registration failed',
            });
        }
    },

    /**
     * Logout current user
     */
    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await authService.logout();
            await sessionService.clearSession();
            set({
                ...initialState,
            });
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Logout failed',
            });
        }
    },

    /**
     * Refresh current session
     */
    refreshSession: async () => {
        set({ isLoading: true, error: null });
        try {
            const session = await authService.refreshSession();
            const user = await authService.getCurrentUser();
            set({
                status: session ? 'authenticated' : 'unauthenticated',
                user,
                session,
                isLoading: false,
            });
        } catch (error) {
            set({
                status: 'unauthenticated',
                user: null,
                session: null,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Session refresh failed',
            });
        }
    },

    /**
     * Send password reset email
     */
    resetPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
            await authService.sendPasswordResetEmail(email);
            set({ isLoading: false });
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Password reset failed',
            });
        }
    },

    /**
     * Update user password
     */
    updatePassword: async (data) => {
        set({ isLoading: true, error: null });
        try {
            await authService.updatePassword(data.newPassword);
            set({ isLoading: false });
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Password update failed',
            });
        }
    },

    /**
     * Verify email address
     */
    verifyEmail: async (token: string) => {
        set({ isLoading: true, error: null });
        try {
            await authService.verifyEmail(token);
            const user = get().user;
            if (user) {
                set({ user: { ...user, emailVerified: true }, isLoading: false });
            } else {
                set({ isLoading: false });
            }
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Email verification failed',
            });
        }
    },

    /**
     * Verify phone number
     */
    verifyPhone: async (phone: string, otp: string) => {
        set({ isLoading: true, error: null });
        try {
            await authService.loginWithPhone({ phone, otp });
            const user = get().user;
            if (user) {
                set({ user: { ...user, phoneVerified: true }, isLoading: false });
            } else {
                set({ isLoading: false });
            }
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Phone verification failed',
            });
        }
    },

    /**
     * Clear error state
     */
    clearError: () => set({ error: null }),

    /**
     * Set user directly
     */
    setUser: (user: AuthUser | null) => set({ user }),

    /**
     * Set session directly
     */
    setSession: (session: AuthSession | null) => {
        set({
            session,
            status: session ? 'authenticated' : 'unauthenticated',
        });
    },
}));