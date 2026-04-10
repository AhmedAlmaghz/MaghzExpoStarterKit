/**
 * Environment Variable Type Declarations
 *
 * Provides type safety for environment variables accessed
 * via Constants.expoConfig.extra or process.env.
 *
 * @see https://docs.expo.dev/guides/environment-variables/
 */

declare namespace NodeJS {
    interface ProcessEnv {
        /** Supabase project URL */
        EXPO_PUBLIC_SUPABASE_URL: string;
        /** Supabase anonymous key */
        EXPO_PUBLIC_SUPABASE_KEY: string;
        /** Google Web OAuth client ID */
        EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: string;
        /** Google iOS OAuth client ID */
        EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?: string;
        /** Apple Team ID for Sign in with Apple */
        EXPO_PUBLIC_APPLE_TEAM_ID?: string;
        /** Application name */
        EXPO_PUBLIC_APP_NAME: string;
        /** Application version */
        EXPO_PUBLIC_APP_VERSION: string;
        /** API base URL */
        EXPO_PUBLIC_API_URL: string;
        /** Current environment (development, staging, production) */
        EXPO_PUBLIC_ENV: 'development' | 'staging' | 'production';
    }
}