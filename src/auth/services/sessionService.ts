/**
 * Session Service
 *
 * Manages user sessions, token refresh, and session persistence.
 *
 * @module auth/services/sessionService
 */
import { supabase } from '@/lib/supabase';
import { storage } from '@/lib/storage';
import { STORAGE_KEYS, AUTH } from '@/lib/constants';
import type { AuthSession } from '../types/auth.types';

/**
 * Session service class
 */
class SessionService {
    private refreshTimer: ReturnType<typeof setTimeout> | null = null;

    /**
     * Initialize session management
     * Sets up automatic token refresh and session monitoring
     */
    async initialize(): Promise<void> {
        const session = await this.getStoredSession();

        if (session) {
            const expiresAt = new Date(session.expiresAt).getTime();
            const now = Date.now();
            const threshold = AUTH.REFRESH_THRESHOLD_MINUTES * 60 * 1000;

            // If session is about to expire, refresh it
            if (expiresAt - now < threshold) {
                await this.refreshSession();
            } else {
                // Schedule refresh before expiry
                this.scheduleRefresh(expiresAt - now - threshold);
            }
        }

        // Listen for auth state changes
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'TOKEN_REFRESHED' && session) {
                await this.storeSession({
                    userId: session.user.id,
                    email: session.user.email || '',
                    accessToken: session.access_token,
                    refreshToken: session.refresh_token,
                    expiresAt: session.expires_at
                        ? new Date(session.expires_at * 1000).toISOString()
                        : new Date(Date.now() + 3600000).toISOString(),
                    role: (session.user.user_metadata?.role as AuthSession['role']) || 'user',
                });
            }

            if (event === 'SIGNED_OUT') {
                await this.clearSession();
            }
        });
    }

    /**
     * Get stored session from secure storage
     * @returns Stored session or null
     */
    async getStoredSession(): Promise<AuthSession | null> {
        return await storage.getItem<AuthSession>(STORAGE_KEYS.AUTH_SESSION, 'secure');
    }

    /**
     * Store session in secure storage
     * @param session - Session to store
     */
    async storeSession(session: AuthSession): Promise<void> {
        await storage.setItem(STORAGE_KEYS.AUTH_SESSION, session, 'secure');
    }

    /**
     * Clear stored session
     */
    async clearSession(): Promise<void> {
        await storage.removeItem(STORAGE_KEYS.AUTH_SESSION, 'secure');
        this.cancelRefresh();
    }

    /**
     * Refresh the current session
     * @returns New session or null
     */
    async refreshSession(): Promise<AuthSession | null> {
        try {
            const { data: { session }, error } = await supabase.auth.refreshSession();

            if (error) {
                await this.clearSession();
                return null;
            }

            if (!session) {
                return null;
            }

            const authSession: AuthSession = {
                userId: session.user.id,
                email: session.user.email || '',
                accessToken: session.access_token,
                refreshToken: session.refresh_token,
                expiresAt: session.expires_at
                    ? new Date(session.expires_at * 1000).toISOString()
                    : new Date(Date.now() + 3600000).toISOString(),
                role: (session.user.user_metadata?.role as AuthSession['role']) || 'user',
            };

            await this.storeSession(authSession);

            // Schedule next refresh
            const expiresAt = new Date(authSession.expiresAt).getTime();
            const now = Date.now();
            const threshold = AUTH.REFRESH_THRESHOLD_MINUTES * 60 * 1000;
            this.scheduleRefresh(expiresAt - now - threshold);

            return authSession;
        } catch {
            await this.clearSession();
            return null;
        }
    }

    /**
     * Check if session is valid
     * @returns True if session is valid and not expired
     */
    async isSessionValid(): Promise<boolean> {
        const session = await this.getStoredSession();

        if (!session) {
            return false;
        }

        const expiresAt = new Date(session.expiresAt).getTime();
        return expiresAt > Date.now();
    }

    /**
     * Schedule automatic session refresh
     * @param delay - Delay in milliseconds before refresh
     */
    private scheduleRefresh(delay: number): void {
        this.cancelRefresh();

        if (delay > 0) {
            this.refreshTimer = setTimeout(async () => {
                await this.refreshSession();
            }, Math.min(delay, 2147483647)); // Max setTimeout value
        }
    }

    /**
     * Cancel scheduled refresh
     */
    private cancelRefresh(): void {
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
            this.refreshTimer = null;
        }
    }

    /**
     * Get device fingerprint for session tracking
     * @returns Device fingerprint string
     */
    async getDeviceFingerprint(): Promise<string> {
        const Device = require('expo-device');
        const parts = [
            Device.brand || 'unknown',
            Device.modelName || 'unknown',
            Device.osName || 'unknown',
            Device.osVersion || 'unknown',
        ];
        return parts.join('|');
    }
}

export const sessionService = new SessionService();