/**
 * Root Layout
 *
 * The root layout component for the Expo Router application.
 * Wraps the app with necessary providers (Theme, i18n, Auth).
 *
 * @see https://docs.expo.dev/router/create-layouts/
 */
// import '../global.css'; // Enable when NativeWind metro config is set up
import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { useTheme } from '@/theme/hooks/useTheme';
import { useThemeStore } from '@/theme/themeStore';
import { I18nManager } from 'react-native';
import { useI18nStore } from '@/i18n/i18nStore';
import { useAuthStore } from '@/auth/authStore';
import { sessionService } from '@/auth/services/sessionService';
import { FloatingHomeButton } from '@/components/ui/FloatingHomeButton';
import { WhatsAppFAB } from '@/components/ui/WhatsAppFAB';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => { });

function RootLayoutNav(): React.ReactElement {
    const { isDarkMode } = useTheme();
    const { locale, isRTL } = useI18nStore();

    return (
        <View style={{ flex: 1 }} key={`${locale}-${isRTL}`}>
            <StatusBar style={isDarkMode ? 'light' : 'dark'} translucent={true} />
            <Stack
                screenOptions={{
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                    },
                    headerTintColor: isDarkMode ? '#f8fafc' : '#0f172a',
                    headerShadowVisible: false,
                    contentStyle: {
                        backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
                    },
                }}
            >
                <Stack.Screen name="(main)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="index" options={{ headerShown: false }} />
            </Stack>
            <FloatingHomeButton />
            <WhatsAppFAB />
        </View>
    );
}

/**
 * App initializer component
 * Handles theme, i18n, and auth initialization
 */
function AppInitializer(): null {
    const initializeI18n = useI18nStore((state) => state.initialize);
    const initializeTheme = useThemeStore((state) => state.initialize);
    const initializeAuth = useAuthStore((state) => state.refreshSession);
    const status = useAuthStore((state) => state.status);

    const [isInitialized, setIsInitialized] = useState(false);

    const segments = useSegments();
    const router = useRouter();

    // Hide splash screen immediately when component mounts
    useEffect(() => {
        const hideSplash = async () => {
            try {
                await SplashScreen.hideAsync();
                console.log('[Splash] Hidden successfully');
            } catch (e) {
                console.log('[Splash] Already hidden or error:', e);
            }
        };
        hideSplash();
    }, []);

    // Initialize app data in background
    useEffect(() => {
        let isMounted = true;

        const initialize = async () => {
            try {
                console.log('[Init] Starting background initialization...');

                // Initialize all stores with individual error handling
                try {
                    await initializeI18n();
                    console.log('[Init] i18n initialized');
                } catch (e) {
                    console.error('[Init] i18n failed:', e);
                }

                try {
                    await initializeTheme();
                    console.log('[Init] Theme initialized');
                } catch (e) {
                    console.error('[Init] Theme failed:', e);
                }

                try {
                    await sessionService.initialize();
                    console.log('[Init] Session initialized');
                } catch (e) {
                    console.error('[Init] Session failed:', e);
                }

                // Set RTL/LTR native setting
                try {
                    const isRTL = useI18nStore.getState().isRTL;
                    if (I18nManager.isRTL !== isRTL) {
                        I18nManager.allowRTL(isRTL);
                        I18nManager.forceRTL(isRTL);
                    }
                } catch (e) {
                    console.error('[Init] RTL setup failed:', e);
                }

                // Try to restore auth session
                try {
                    await initializeAuth();
                    console.log('[Init] Auth initialized');
                } catch (e) {
                    console.error('[Init] Auth failed:', e);
                }

            } catch (error) {
                console.error('[Init] Critical error:', error);
            } finally {
                if (isMounted) {
                    setIsInitialized(true);
                    console.log('[Init] Initialization complete');
                }
            }
        };

        // Start initialization after a short delay to ensure UI renders first
        const timer = setTimeout(initialize, 100);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [initializeI18n, initializeTheme, initializeAuth]);

    // Handle navigation after initialization
    useEffect(() => {
        if (!isInitialized) return;

        console.log('[Auth Guard] Status:', status);
        console.log('[Auth Guard] Segments:', segments);

        if (status === 'loading') {
            console.log('[Auth Guard] Still loading auth...');
            return;
        }

        const inAuthGroup = segments[0] === '(auth)';

        const segmentsLen: number = segments.length;

        if (status === 'authenticated') {
            if (inAuthGroup || segmentsLen === 0 || (segmentsLen === 1 && segments[0] === 'index')) {
                console.log('[Auth Guard] Redirecting authenticated user to main...');
                setTimeout(() => {
                    router.replace('/(main)');
                }, 100);
            }
        } else if (status === 'unauthenticated') {
            const atRoot = segmentsLen === 0 || (segmentsLen === 1 && segments[0] === 'index');

            if (atRoot) {
                console.log('[Auth Guard] Redirecting guest to main...');
                setTimeout(() => {
                    router.replace('/(main)');
                }, 100);
            }
        }
    }, [status, segments, isInitialized, router]);

    return null;
}

export default function RootLayout(): React.ReactElement {
    return (
        <ErrorBoundary>
            <ThemeProvider>
                <AppInitializer />
                <RootLayoutNav />
            </ThemeProvider>
        </ErrorBoundary>
    );
}
