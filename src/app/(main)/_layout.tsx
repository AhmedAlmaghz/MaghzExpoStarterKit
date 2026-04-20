/**
 * Main Layout
 *
 * Defines the main application navigation structure with bottom tabs.
 * Features dynamic, role-based visibility for administrative panels.
 * Supports RTL layouts and theme-aware styling.
 *
 * @module app/(main)/_layout
 */
import React from 'react';
import { Tabs } from 'expo-router';
import { useTheme } from '@/theme/hooks/useTheme';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useAuth } from '@/auth/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Tab icon component with active indicator
 */
function TabIcon({ name, color, focused }: { name: keyof typeof Ionicons.glyphMap; color: string; focused: boolean }) {
    return (
        <View style={styles.tabIconContainer}>
            <Ionicons
                name={focused ? name : (`${name}-outline` as any)}
                size={24}
                color={color}
            />
            {focused && <View style={[styles.activeIndicator, { backgroundColor: color }]} />}
        </View>
    );
}

export default function MainLayout(): React.ReactElement {
    const { colors, isDarkMode } = useTheme();
    const { t } = useTranslation();
    const { isAdmin } = useAuth();
    const insets = useSafeAreaInsets();

    const tabBarHeight = 65 + (insets.bottom > 0 ? insets.bottom - 5 : 15);

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary[500],
                tabBarInactiveTintColor: colors.tabInactive,
                tabBarStyle: [
                    styles.tabBar,
                    {
                        backgroundColor: colors.tabBackground,
                        borderTopColor: colors.border,
                        height: tabBarHeight,
                        paddingBottom: Math.max(insets.bottom, 12),
                    },
                ],
                tabBarLabelStyle: styles.tabBarLabel,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: t('nav.home'),
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon name="home" color={color} focused={focused} />
                    ),
                }}
            />

            <Tabs.Screen
                name="dashboard"
                options={{
                    title: t('nav.dashboard'),
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon name="grid" color={color} focused={focused} />
                    ),
                }}
            />

            {/* Admin Tab - Dynamic Visibility */}
            <Tabs.Screen
                name="admin"
                options={{
                    title: t('nav.admin'),
                    href: isAdmin ? '/admin' : null,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon name="shield-checkmark" color={color} focused={focused} />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile/index"
                options={{
                    title: t('nav.profile'),
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon name="person" color={color} focused={focused} />
                    ),
                }}
            />

            {/* Hidden screens from the bottom bar */}
            <Tabs.Screen name="pages" options={{ href: null }} />
            <Tabs.Screen name="about" options={{ href: null }} />
            <Tabs.Screen name="help" options={{ href: null }} />
            <Tabs.Screen name="settings/index" options={{ href: null }} />
            <Tabs.Screen name="notifications/index" options={{ href: null }} />
            <Tabs.Screen name="settings/advanced" options={{ href: null }} />
            <Tabs.Screen name="settings/notifications" options={{ href: null }} />
            <Tabs.Screen name="settings/privacy" options={{ href: null }} />
            <Tabs.Screen name="search" options={{ href: null }} />
            <Tabs.Screen name="profile/edit" options={{ href: null }} />
            <Tabs.Screen name="profile/addresses" options={{ href: null }} />
            <Tabs.Screen name="profile/payments" options={{ href: null }} />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        paddingTop: 12,
        borderTopWidth: 1,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    tabBarLabel: {
        fontSize: 10,
        fontWeight: '600',
    },
    tabIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeIndicator: {
        width: 4,
        height: 4,
        borderRadius: 2,
        marginTop: 4,
    }
});
