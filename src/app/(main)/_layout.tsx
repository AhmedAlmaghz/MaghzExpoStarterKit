/**
 * Main Layout
 *
 * Defines the main application navigation structure with bottom tabs.
 *
 * @module app/(main)/_layout
 */
import React from 'react';
import { Tabs } from 'expo-router';
import { useTheme } from '@/theme/hooks/useTheme';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import { View, Platform, StyleSheet } from 'react-native';

/**
 * Tab icon component
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
    const { colors } = useTheme();
    const { t } = useTranslation();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary[500],
                tabBarInactiveTintColor: colors.textTertiary,
                tabBarStyle: [
                    styles.tabBar,
                    {
                        backgroundColor: colors.surface[50],
                        borderTopColor: 'rgba(0,0,0,0.05)',
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
                name="pages"
                options={{
                    title: t('nav.pages'),
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon name="planet" color={color} focused={focused} />
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
            <Tabs.Screen name="about" options={{ href: null }} />
            <Tabs.Screen name="help" options={{ href: null }} />
            <Tabs.Screen name="admin/index" options={{ href: null }} />
            <Tabs.Screen name="settings/index" options={{ href: null }} />
            <Tabs.Screen name="notifications/index" options={{ href: null }} />
            
            {/* Hide all other possible sub-routes if they show up */}
            <Tabs.Screen name="admin/analytics" options={{ href: null }} />
            <Tabs.Screen name="admin/audit-logs" options={{ href: null }} />
            <Tabs.Screen name="admin/content" options={{ href: null }} />
            <Tabs.Screen name="admin/users" options={{ href: null }} />
            <Tabs.Screen name="settings/advanced" options={{ href: null }} />
            <Tabs.Screen name="settings/notifications" options={{ href: null }} />
            <Tabs.Screen name="settings/privacy" options={{ href: null }} />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        height: Platform.OS === 'ios' ? 88 : 68,
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 28 : 12,
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