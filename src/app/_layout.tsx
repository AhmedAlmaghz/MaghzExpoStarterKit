/**
 * Root Layout
 *
 * The root layout component for the Expo Router application.
 * Wraps the app with necessary providers (Theme, i18n, Auth).
 *
 * IMPORTANT: We do NOT call SplashScreen.preventAutoHideAsync() here.
 * The splash screen will auto-hide when the first screen renders.
 * This prevents the app from getting stuck on the splash screen
 * if initialization fails or takes too long.
 *
 * @see https://docs.expo.dev/router/create-layouts/
 */
// import '../global.css'; // Enable when NativeWind metro config is set up
import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemeProvider, useThemeStore } from '@/theme';
import { useTheme } from '@/theme/hooks/useTheme';
import { I18nManager } from 'react-native';
import { useI18nStore } from '@/i18n/i18nStore';
import { useAuthStore } from '@/auth/authStore';
import { sessionService } from '@/auth/services/sessionService';
import { FloatingHomeButton } from '@/components/ui/FloatingHomeButton';
import { WhatsAppFAB } from '@/components/ui/WhatsAppFAB';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

function RootLayoutNav(): React.ReactElement {
    const { isDarkMode, colors } = useTheme();
    const { locale, isRTL } = useI18nStore();

    return (
        <View style={{ flex: 1 }} key={`${locale}-${isRTL}`}>
            <StatusBar
                style={isDarkMode ? 'light' : 'dark'}
                translucent={true}
            />
            <Stack
                screenOptions={{
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: colors.headerBackground,
                    },
                    headerTintColor: colors.text,
                    headerShadowVisible: false,
                    headerTitleStyle: {
                        fontWeight: '600',
                    },
                    contentStyle: {
                        backgroundColor: colors.background,
                    },
                    animation: 'fade',
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
 * Handles theme, i18n, and auth initialization in the background.
 * Does NOT block rendering - the app shows immediately.
 */
function AppInitializer(): React.ReactElement | null {
    const initializeI18n = useI18nStore((state) => state.initialize);
    const initializeTheme = useThemeStore((state) => state.initialize);
    const initializeAuth = useAuthStore((state) => state.refreshSession);
    const status = useAuthStore((state) => state.status);

    const [isReady, setIsReady] = useState(false);

    const segments = useSegments();
    const router = useRouter();

    // Initialize app data in background - each step has its own error handling
    useEffect(() => {
        let isMounted = true;

        const initialize = async () => {
            console.log('[Init] Starting background initialization...');

            // Initialize stores with individual error handling
            try {
                await initializeI18n();
                console.log('[Init] i18n done');
            } catch (e) {
                console.warn('[Init] i18n failed:', e);
            }

            try {
                await initializeTheme();
                console.log('[Init] Theme done');
            } catch (e) {
                console.warn('[Init] Theme failed:', e);
            }

            try {
                await sessionService.initialize();
                console.log('[Init] Session done');
            } catch (e) {
                console.warn('[Init] Session failed:', e);
            }

            // Set RTL/LTR native setting
            try {
                const isRTL = useI18nStore.getState().isRTL;
                if (I18nManager.isRTL !== isRTL) {
                    I18nManager.allowRTL(isRTL);
                    I18nManager.forceRTL(isRTL);
                }
            } catch (e) {
                console.warn('[Init] RTL setup failed:', e);
            }

            // Try to restore auth session
            try {
                await initializeAuth();
                console.log('[Init] Auth done');
            } catch (e) {
                console.warn('[Init] Auth failed:', e);
            }

            if (isMounted) {
                setIsReady(true);
                console.log('[Init] Initialization complete');
            }
        };

        // Start initialization after a small delay to let the UI render first
        const timer = setTimeout(initialize, 50);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [initializeI18n, initializeTheme, initializeAuth]);

    // Handle navigation after initialization
    useEffect(() => {
        if (!isReady) return;

        console.log('[Auth Guard] Status:', status);

        if (status === 'loading') {
            return;
        }

        const inAuthGroup = segments[0] === '(auth)';
        const segmentsLen: number = segments.length;

        if (status === 'authenticated') {
            if (inAuthGroup || segmentsLen === 0 || (segmentsLen === 1 && segments[0] === 'index')) {
                console.log('[Auth Guard] Redirecting authenticated user...');
                setTimeout(() => {
                    router.replace('/(main)');
                }, 100);
            }
        } else if (status === 'unauthenticated') {
            const atRoot = segmentsLen === 0 || (segmentsLen === 1 && segments[0] === 'index');
            if (atRoot) {
                console.log('[Auth Guard] Redirecting guest user...');
                setTimeout(() => {
                    router.replace('/(main)');
                }, 100);
            }
        }
    }, [status, segments, isReady, router]);

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
