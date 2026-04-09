/**
 * Application Constants
 *
 * Central configuration constants used across the application.
 * Environment-specific values should be set in .env files.
 *
 * @module lib/constants
 */

/** Application metadata */
export const APP = {
    NAME: 'ExpoTemplate',
    VERSION: '1.0.0',
    SCHEME: 'expotemplate',
} as const;

/** API configuration */
export const API = {
    BASE_URL: process.env.EXPO_PUBLIC_API_URL ?? 'https://api.example.com',
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
} as const;

/** Supabase configuration */
export const SUPABASE = {
    URL: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
    KEY: process.env.EXPO_PUBLIC_SUPABASE_KEY ?? '',
} as const;

/** Authentication configuration */
export const AUTH = {
    SESSION_KEY: 'auth_session',
    REFRESH_THRESHOLD_MINUTES: 5,
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION_MINUTES: 15,
} as const;

/** Storage keys for persistent data */
export const STORAGE_KEYS = {
    AUTH_SESSION: 'auth_session',
    THEME_MODE: 'theme_mode',
    LOCALE: 'app_locale',
    ONBOARDING_COMPLETE: 'onboarding_complete',
    FCM_TOKEN: 'fcm_token',
    LAST_NOTIFICATION_READ: 'last_notification_read',
} as const;

/** Notification channels */
export const NOTIFICATION_CHANNELS = {
    DEFAULT: 'default',
    ALERTS: 'alerts',
    MESSAGES: 'messages',
} as const;

/** Pagination defaults */
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
} as const;

/** Date formats */
export const DATE_FORMATS = {
    DISPLAY: 'MMM d, yyyy',
    DISPLAY_TIME: 'MMM d, yyyy h:mm a',
    ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
    SHORT: 'dd/MM/yyyy',
    TIME: 'h:mm a',
} as const;