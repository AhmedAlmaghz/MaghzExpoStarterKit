/**
 * Root Layout
 *
 * The root layout component for the Expo Router application.
 * Wraps the app with necessary providers (Theme, i18n, Auth).
 *
 * @see https://docs.expo.dev/router/create-layouts/
 */
// import '../global.css'; // Enable when NativeWind metro config is set up
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { useTheme } from '@/theme/hooks/useTheme';
import { useI18nStore } from '@/i18n/i18nStore';
import { useAuthStore } from '@/auth/authStore';
import { sessionService } from '@/auth/services/sessionService';

function RootLayoutNav(): React.ReactElement {
    const { isDarkMode, colors } = useTheme();

    return (
        <>
            <StatusBar style={isDarkMode ? 'light' : 'dark'} />
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                    },
                    headerTintColor: isDarkMode ? '#f8fafc' : '#0f172a',
                    contentStyle: {
                        backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
                    },
                }}
            >
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(main)" options={{ headerShown: false }} />
            </Stack>
        </>
    );
}

/**
 * App initializer component
 * Handles theme, i18n, and auth initialization
 */
function AppInitializer(): null {
    const initializeI18n = useI18nStore((state) => state.initialize);
    const initializeAuth = useAuthStore((state) => state.refreshSession);

    useEffect(() => {
        const initialize = async () => {
            // Initialize i18n
            await initializeI18n();
            // Initialize session service
            await sessionService.initialize();
            // Try to restore auth session
            try {
                await initializeAuth();
            } catch {
                // Session restoration failed, user needs to login
            }
        };
        initialize();
    }, [initializeI18n, initializeAuth]);

    return null;
}

export default function RootLayout(): React.ReactElement {
    return (
        <ThemeProvider>
            <AppInitializer />
            <RootLayoutNav />
        </ThemeProvider>
    );
}