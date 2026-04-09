/**
 * Auth Types
 *
 * TypeScript type definitions for authentication module.
 *
 * @module auth/types
 */

/**
 * User authentication status
 */
export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

/**
 * Login method options
 */
export type LoginMethod = 'email' | 'google' | 'apple' | 'phone';

/**
 * Authentication credentials for email login
 */
export interface EmailCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}

/**
 * Authentication credentials for phone login
 */
export interface PhoneCredentials {
    phone: string;
    otp: string;
}

/**
 * Registration data for new users
 */
export interface RegistrationData {
    email: string;
    password: string;
    displayName: string;
    phone?: string;
    acceptTerms: boolean;
}

/**
 * Password reset request
 */
export interface PasswordResetRequest {
    email: string;
}

/**
 * Password update data
 */
export interface PasswordUpdateData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

/**
 * Authenticated user session
 */
export interface AuthSession {
    userId: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    role: UserRole;
}

/**
 * User role type
 */
export type UserRole = 'user' | 'admin' | 'superadmin';

/**
 * Permission definition
 */
export interface Permission {
    id: string;
    name: string;
    displayName: string;
    resource: string;
    action: 'create' | 'read' | 'update' | 'delete' | 'manage';
}

/**
 * Role with permissions
 */
export interface RoleWithPermissions {
    id: string;
    name: string;
    displayName: string;
    permissions: Permission[];
}

/**
 * Auth state for Zustand store
 */
export interface AuthState {
    status: AuthStatus;
    user: AuthUser | null;
    session: AuthSession | null;
    isLoading: boolean;
    error: string | null;
}

/**
 * Authenticated user data
 */
export interface AuthUser {
    id: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
    role: UserRole;
    emailVerified: boolean;
    phoneVerified: boolean;
    createdAt: string;
    lastLoginAt?: string;
}

/**
 * Auth actions for Zustand store
 */
export interface AuthActions {
    login: (credentials: EmailCredentials | PhoneCredentials) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    loginWithApple: () => Promise<void>;
    register: (data: RegistrationData) => Promise<void>;
    logout: () => Promise<void>;
    refreshSession: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    updatePassword: (data: PasswordUpdateData) => Promise<void>;
    verifyEmail: (token: string) => Promise<void>;
    verifyPhone: (phone: string, otp: string) => Promise<void>;
    clearError: () => void;
    setUser: (user: AuthUser | null) => void;
    setSession: (session: AuthSession | null) => void;
}

/**
 * Auth store type
 */
export type AuthStore = AuthState & AuthActions;

/**
 * Login response from auth service
 */
export interface LoginResponse {
    user: AuthUser;
    session: AuthSession;
}

/**
 * OAuth provider configuration
 */
export interface OAuthProvider {
    name: 'google' | 'apple';
    clientId: string;
    redirectUrl: string;
    scopes?: string[];
}
