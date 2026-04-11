/**
 * Auth Service
 *
 * Core authentication service handling login, registration, and session management.
 * Integrates with Supabase for backend authentication.
 *
 * @module auth/services/authService
 */
import { supabase } from '@/lib/supabase';
import { storage } from '@/lib/storage';
import { STORAGE_KEYS, AUTH } from '@/lib/constants';
import type {
    AuthUser,
    AuthSession,
    EmailCredentials,
    PhoneCredentials,
    RegistrationData,
    LoginResponse,
    UserRole,
} from '../types/auth.types';

/**
 * Authentication service class
 */
class AuthService {
    /**
     * Login with email and password
     * @param credentials - Email and password credentials
     * @returns Login response with user and session
     */
    async loginWithEmail(credentials: EmailCredentials): Promise<LoginResponse> {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
        });

        if (error) {
            throw new Error(this.translateError(error.message));
        }

        if (!data.user || !data.session) {
            throw new Error('Login failed - no user data returned');
        }

        const user = this.mapSupabaseUser(data.user);
        const session = this.mapSupabaseSession(data.session, user.role);

        // Store session for persistence
        if (credentials.rememberMe) {
            await storage.setItem(STORAGE_KEYS.AUTH_SESSION, session, 'secure');
        }

        return { user, session };
    }

    /**
     * Login with Google OAuth
     * @returns Login response with user and session
     */
    async loginWithGoogle(): Promise<LoginResponse> {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                skipBrowserRedirect: true,
            },
        });

        if (error) {
            throw new Error(this.translateError(error.message));
        }

        // For OAuth, we need to handle the redirect
        // This will be handled by the auth state listener
        return data as unknown as LoginResponse;
    }

    /**
     * Login with Apple
     * @returns Login response with user and session
     */
    async loginWithApple(): Promise<LoginResponse> {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'apple',
            options: {
                skipBrowserRedirect: true,
            },
        });

        if (error) {
            throw new Error(this.translateError(error.message));
        }

        return data as unknown as LoginResponse;
    }

    /**
     * Login with phone number
     * @param credentials - Phone and OTP credentials
     * @returns Login response with user and session
     */
    async loginWithPhone(credentials: PhoneCredentials): Promise<LoginResponse> {
        const { data, error } = await supabase.auth.verifyOtp({
            phone: credentials.phone,
            token: credentials.otp,
            type: 'sms',
        });

        if (error) {
            throw new Error(this.translateError(error.message));
        }

        if (!data.user || !data.session) {
            throw new Error('Login failed - no user data returned');
        }

        const user = this.mapSupabaseUser(data.user);
        const session = this.mapSupabaseSession(data.session, user.role);

        return { user, session };
    }

    /**
     * Send OTP to phone number
     * @param phone - Phone number to send OTP to
     */
    async sendPhoneOtp(phone: string): Promise<void> {
        const { error } = await supabase.auth.signInWithOtp({
            phone,
        });

        if (error) {
            throw new Error(this.translateError(error.message));
        }
    }

    /**
     * Register new user
     * @param data - Registration data
     * @returns Login response with user and session
     */
    async register(data: RegistrationData): Promise<LoginResponse> {
        const { data: authData, error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: {
                    display_name: data.displayName,
                    phone: data.phone,
                },
            },
        });

        if (error) {
            throw new Error(this.translateError(error.message));
        }

        if (!authData.user) {
            throw new Error('Registration failed - no user data returned');
        }

        // 1. First, insert into public.users table as per schema
        const { error: userTableError } = await supabase
            .from('users')
            .upsert({
                id: authData.user.id,
                email: data.email,
                phone: data.phone,
                role: 'user',
                status: 'active',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });

        if (userTableError) {
            console.error('Error creating record in users table:', userTableError);
        }

        // 2. Second, insert into profiles table
        const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
                user_id: authData.user.id,
                display_name: data.displayName,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });

        if (profileError) {
            console.error('Error creating profile:', profileError);
        }

        const user = this.mapSupabaseUser(authData.user);
        const session = authData.session
            ? this.mapSupabaseSession(authData.session, user.role)
            : null;

        return { user, session: session! };
    }

    /**
     * Logout current user
     */
    async logout(): Promise<void> {
        const { error } = await supabase.auth.signOut();

        if (error) {
            throw new Error(this.translateError(error.message));
        }

        // Clear stored session
        await storage.removeItem(STORAGE_KEYS.AUTH_SESSION, 'secure');
    }

    /**
     * Send password reset email
     * @param email - User email address
     */
    async sendPasswordResetEmail(email: string): Promise<void> {
        const { error } = await supabase.auth.resetPasswordForEmail(email);

        if (error) {
            throw new Error(this.translateError(error.message));
        }
    }

    /**
     * Update user password
     * @param newPassword - New password
     */
    async updatePassword(newPassword: string): Promise<void> {
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (error) {
            throw new Error(this.translateError(error.message));
        }
    }

    /**
     * Get current session
     * @returns Current session or null
     */
    async getSession(): Promise<AuthSession | null> {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return null;
        }

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return null;
        }

        const authUser = this.mapSupabaseUser(user);
        return this.mapSupabaseSession(session, authUser.role);
    }

    /**
     * Get current user
     * @returns Current user or null
     */
    async getCurrentUser(): Promise<AuthUser | null> {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return null;
        }

        return this.mapSupabaseUser(user);
    }

    /**
     * Refresh the current session
     * @returns New session or null
     */
    async refreshSession(): Promise<AuthSession | null> {
        const { data: { session }, error } = await supabase.auth.refreshSession();

        if (error) {
            throw new Error(this.translateError(error.message));
        }

        if (!session) {
            return null;
        }

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return null;
        }

        const authUser = this.mapSupabaseUser(user);
        const authSession = this.mapSupabaseSession(session, authUser.role);

        // Update stored session
        await storage.setItem(STORAGE_KEYS.AUTH_SESSION, authSession, 'secure');

        return authSession;
    }

    /**
     * Verify email address
     * @param token - Verification token
     */
    async verifyEmail(token: string): Promise<void> {
        const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'email',
        });

        if (error) {
            throw new Error(this.translateError(error.message));
        }
    }

    /**
     * Check if user has specific role
     * @param role - Role to check
     * @returns True if user has role
     */
    async hasRole(role: UserRole): Promise<boolean> {
        const user = await this.getCurrentUser();

        if (!user) {
            return false;
        }

        if (role === 'user') return true;
        if (role === 'admin') return user.role === 'admin' || user.role === 'superadmin';
        if (role === 'superadmin') return user.role === 'superadmin';

        return false;
    }

    /**
     * Subscribe to auth state changes
     * @param callback - Callback function for auth state changes
     * @returns Unsubscribe function
     */
    onAuthStateChange(
        callback: (event: string, session: AuthSession | null) => void
    ): () => void {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (session) {
                    const authSession = this.mapSupabaseSession(
                        session,
                        (session.user?.user_metadata?.role as UserRole) || 'user'
                    );
                    callback(event, authSession);
                } else {
                    callback(event, null);
                }
            }
        );

        return () => subscription.unsubscribe();
    }

    /**
     * Map Supabase user to AuthUser
     */
    private mapSupabaseUser(user: { id: string; email?: string; user_metadata?: Record<string, unknown>; created_at: string; last_sign_in_at?: string; email_confirmed_at?: string; phone_confirmed_at?: string }): AuthUser {
        return {
            id: user.id,
            email: user.email || '',
            displayName: (user.user_metadata?.display_name as string) || 'User',
            avatarUrl: user.user_metadata?.avatar_url as string | undefined,
            role: (user.user_metadata?.role as UserRole) || 'user',
            emailVerified: !!user.email_confirmed_at,
            phoneVerified: !!user.phone_confirmed_at,
            createdAt: user.created_at,
            lastLoginAt: user.last_sign_in_at,
        };
    }

    /**
     * Map Supabase session to AuthSession
     */
    private mapSupabaseSession(
        session: { access_token: string; refresh_token: string; expires_at?: number; user?: { id?: string; email?: string; user_metadata?: Record<string, unknown> } },
        role: UserRole
    ): AuthSession {
        return {
            userId: session.user?.id || '',
            email: session.user?.email || '',
            accessToken: session.access_token,
            refreshToken: session.refresh_token,
            expiresAt: session.expires_at
                ? new Date(session.expires_at * 1000).toISOString()
                : new Date(Date.now() + 3600000).toISOString(),
            role,
        };
    }

    /**
     * Translate error messages to user-friendly format
     */
    private translateError(error: string): string {
        const errorMap: Record<string, string> = {
            'Invalid login credentials': 'Invalid email or password',
            'Email not confirmed': 'Please verify your email address',
            'User already registered': 'An account with this email already exists',
            'Password should be at least 6 characters': 'Password must be at least 6 characters',
            'Unable to send email': 'Unable to send email. Please try again',
            'User not found': 'No account found with this email',
            'Token has expired or is invalid': 'This link has expired. Please request a new one',
        };

        return errorMap[error] || error;
    }
}

export const authService = new AuthService();
