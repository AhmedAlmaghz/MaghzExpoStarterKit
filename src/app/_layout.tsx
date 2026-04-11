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
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { activateKeepAwake } from 'expo-keep-awake';
import { View } from 'react-native';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { useTheme } from '@/theme/hooks/useTheme';
import { I18nManager } from 'react-native';
import { useI18nStore } from '@/i18n/i18nStore';
import { useAuthStore } from '@/auth/authStore';
import { sessionService } from '@/auth/services/sessionService';
import { FloatingHomeButton } from '@/components/ui/FloatingHomeButton';
import { WhatsAppFAB } from '@/components/ui/WhatsAppFAB';
import { useTranslation } from '@/i18n/hooks/useTranslation';

function RootLayoutNav(): React.ReactElement {
    const { isDarkMode, colors } = useTheme();
    const { locale, isRTL } = useI18nStore();
    const { t } = useTranslation();

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
    const initializeAuth = useAuthStore((state) => state.refreshSession);
    const status = useAuthStore((state) => state.status);
    
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        const initialize = async () => {
            // Suppress "Unable to activate keep awake" warning in some dev environments
            try {
                if (__DEV__) {
                    await activateKeepAwake();
                }
            } catch (e) {
                console.log('[Dev] KeepAlive not supported in this environment');
            }

            // Initialize i18n
            await initializeI18n();

            // Set RTL/LTR native setting
            const isRTL = useI18nStore.getState().isRTL;
            if (I18nManager.isRTL !== isRTL) {
                I18nManager.allowRTL(isRTL ? true : false);
                I18nManager.forceRTL(isRTL ? true : false);
            }

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

    useEffect(() => {
        // Debugging logs to see state changes in terminal
        console.log('[Auth Guard] Status:', status);
        console.log('[Auth Guard] Segments:', segments);

        // Don't redirect while still initializing
        if (status === 'loading') {
            console.log('[Auth Guard] Still loading, waiting...');
            return;
        }

        const inAuthGroup = segments[0] === '(auth)';

        if (status === 'authenticated') {
            // Redirect to (main) if we are in auth group OR at the root path
            if (inAuthGroup || segments.length === 0 || (segments.length === 1 && segments[0] === 'index')) {
                console.log('[Auth Guard] User authenticated. Redirecting to home...');
                setTimeout(() => {
                  router.replace('/(main)');
                }, 10);
            }
        } else if (status === 'unauthenticated') {
            // If the user lands on "/" or "index", force them to the home screen
            // Since (main) is the default for apps, we handle this here
            const atRoot = segments.length === 0 || (segments.length === 1 && segments[0] === 'index');
            
            if (atRoot) {
                console.log('[Auth Guard] Guest user landed at root. Redirecting to home...');
                setTimeout(() => {
                  router.replace('/(main)');
                }, 10);
            }
        }
    }, [status, segments]);

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