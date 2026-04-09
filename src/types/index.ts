/**
 * Shared TypeScript Types and Interfaces
 *
 * Central type definitions used across the application.
 * Domain-specific types are defined in their respective modules.
 *
 * @module types
 */

/** User role enum for authorization */
export type UserRole = 'user' | 'admin' | 'superadmin';

/** Theme mode options */
export type ThemeMode = 'light' | 'dark' | 'system';

/** Supported locale codes */
export type LocaleCode = 'en' | 'ar';

/** Direction for RTL/LTR layout */
export type LayoutDirection = 'ltr' | 'rtl';

/** Generic API response wrapper */
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
    error?: string;
}

/** Paginated API response */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
}

/** User profile interface */
export interface UserProfile {
    id: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
    role: UserRole;
    locale: LocaleCode;
    themeMode: ThemeMode;
    createdAt: string;
    updatedAt: string;
}

/** Navigation route params */
export interface RouteParams {
    id?: string;
    mode?: 'view' | 'edit' | 'create';
}

/** Generic key-value pair */
export interface KeyValue<T = string> {
    key: string;
    value: T;
}

/** Async state wrapper for loading states */
export interface AsyncState<T> {
    data: T | null;
    isLoading: boolean;
    error: string | null;
}