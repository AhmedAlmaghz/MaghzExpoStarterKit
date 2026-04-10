/**
 * Main Layout
 *
 * Layout for the authenticated section of the app.
 * Uses bottom tabs navigation with screens for Dashboard,
 * Profile, Settings, Notifications, and more.
 *
 * @module app/(main)/_layout
 */
import { Tabs } from 'expo-router';
import { useTheme } from '@/theme/hooks/useTheme';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useAuth } from '@/auth/hooks/useAuth';

export default function MainLayout(): React.ReactElement {
    const { colors, isDarkMode } = useTheme();
    const { t } = useTranslation();
    const { isAdmin } = useAuth();

    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: colors.tabBackground,
                    borderTopColor: colors.border,
                },
                tabBarActiveTintColor: colors.tabActive,
                tabBarInactiveTintColor: colors.tabInactive,
                headerStyle: {
                    backgroundColor: colors.headerBackground,
                },
                headerTintColor: colors.text,
                headerShadowVisible: !!false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: t('nav.home'),
                    tabBarLabel: t('nav.home'),
                    tabBarIcon: ({ color }) => <TabIcon emoji="🏠" color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile/index"
                options={{
                    title: t('nav.profile'),
                    tabBarLabel: t('nav.profile'),
                    tabBarIcon: ({ color }) => <TabIcon emoji="👤" color={color} />,
                }}
            />
            <Tabs.Screen
                name="notifications/index"
                options={{
                    title: t('nav.notifications'),
                    tabBarLabel: t('nav.notifications'),
                    tabBarIcon: ({ color }) => <TabIcon emoji="🔔" color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings/index"
                options={{
                    title: t('nav.settings'),
                    tabBarLabel: t('nav.settings'),
                    tabBarIcon: ({ color }) => <TabIcon emoji="⚙️" color={color} />,
                }}
            />
            <Tabs.Screen
                name="admin"
                options={{
                    title: t('nav.admin'),
                    tabBarLabel: t('nav.admin'),
                    tabBarIcon: ({ color }) => <TabIcon emoji="🛡️" color={color} />,
                    href: isAdmin ? undefined : undefined,
                }}
            />
            <Tabs.Screen
                name="about"
                options={{
                    title: t('nav.about'),
                    tabBarLabel: t('nav.about'),
                    tabBarIcon: ({ color }) => <TabIcon emoji="ℹ️" color={color} />,
                    href: undefined,
                }}
            />
            <Tabs.Screen
                name="help"
                options={{
                    title: t('nav.help'),
                    tabBarLabel: t('nav.help'),
                    tabBarIcon: ({ color }) => <TabIcon emoji="❓" color={color} />,
                    href: undefined,
                }}
            />
        </Tabs>
    );
}

/**
 * Tab icon component using emoji
 */
function TabIcon({ emoji, color }: { emoji: string; color: string }) {
    return null; // NativeWind/Tailwind handles icons via tabBarIcon
}