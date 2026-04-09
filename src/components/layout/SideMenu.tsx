/**
 * Side Menu Component
 *
 * Navigation drawer with hierarchical menu items.
 * Supports RTL/LTR and role-based menu visibility.
 *
 * @module components/layout/SideMenu
 */
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/hooks/useTheme';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useAuth } from '@/auth/hooks/useAuth';

interface MenuItem {
    key: string;
    label: string;
    icon: string;
    route: string;
    requiredRole?: 'admin' | 'superadmin';
    children?: MenuItem[];
}

/**
 * Menu items configuration
 */
const getMenuItems = (t: (key: string) => string): MenuItem[] => [
    { key: 'home', label: t('nav.home'), icon: '🏠', route: '/' },
    { key: 'dashboard', label: t('nav.dashboard'), icon: '📊', route: '/' },
    { key: 'profile', label: t('nav.profile'), icon: '👤', route: '/profile' },
    { key: 'settings', label: t('nav.settings'), icon: '⚙️', route: '/settings' },
    { key: 'notifications', label: t('nav.notifications'), icon: '🔔', route: '/notifications' },
    {
        key: 'admin',
        label: t('nav.admin'),
        icon: '🛡️',
        route: '/admin',
        requiredRole: 'admin',
        children: [
            { key: 'admin-users', label: t('nav.users'), icon: '👥', route: '/admin/users' },
            { key: 'admin-analytics', label: t('nav.analytics'), icon: '📈', route: '/admin/analytics' },
            { key: 'admin-content', label: t('nav.content'), icon: '📝', route: '/admin/content' },
            { key: 'admin-audit', label: t('nav.auditLogs'), icon: '📋', route: '/admin/audit-logs' },
        ],
    },
    { key: 'about', label: t('nav.about'), icon: 'ℹ️', route: '/about' },
    { key: 'help', label: t('nav.help'), icon: '❓', route: '/help' },
];

interface SideMenuProps {
    /** Whether the menu is visible */
    isVisible: boolean;
    /** Callback when menu item is pressed */
    onItemPress: (route: string) => void;
    /** Callback to close menu */
    onClose: () => void;
}

/**
 * Side menu component
 */
export function SideMenu({ isVisible, onItemPress, onClose }: SideMenuProps): React.ReactElement | null {
    const { colors, isDarkMode } = useTheme();
    const { t } = useTranslation();
    const { user, isAdmin, logout } = useAuth();

    if (!isVisible) return null;

    const menuItems = getMenuItems(t);

    /**
     * Check if menu item should be visible based on role
     */
    const isItemVisible = (item: MenuItem): boolean => {
        if (!item.requiredRole) return true;
        if (item.requiredRole === 'admin') return isAdmin;
        return false;
    };

    return (
        <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
            <View style={[styles.menu, { backgroundColor: colors.background }]}>
                {/* User info header */}
                <View style={[styles.header, { backgroundColor: colors.primary[500] }]}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {user?.displayName?.charAt(0)?.toUpperCase() || '?'}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.userName}>{user?.displayName || 'Guest'}</Text>
                    <Text style={styles.userEmail}>{user?.email || ''}</Text>
                </View>

                {/* Menu items */}
                <ScrollView style={styles.menuList}>
                    {menuItems.filter(isItemVisible).map((item) => (
                        <View key={item.key}>
                            <TouchableOpacity
                                style={[styles.menuItem, { borderBottomColor: colors.borderLight }]}
                                onPress={() => {
                                    onItemPress(item.route);
                                    onClose();
                                }}
                            >
                                <Text style={styles.menuIcon}>{item.icon}</Text>
                                <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
                            </TouchableOpacity>

                            {/* Sub-menu items */}
                            {item.children?.filter(isItemVisible).map((child) => (
                                <TouchableOpacity
                                    key={child.key}
                                    style={[styles.subMenuItem, { borderBottomColor: colors.borderLight }]}
                                    onPress={() => {
                                        onItemPress(child.route);
                                        onClose();
                                    }}
                                >
                                    <Text style={styles.menuIcon}>{child.icon}</Text>
                                    <Text style={[styles.menuLabel, { color: colors.textSecondary }]}>
                                        {child.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
                </ScrollView>

                {/* Logout button */}
                <TouchableOpacity
                    style={[styles.logoutButton, { borderTopColor: colors.border }]}
                    onPress={logout}
                >
                    <Text style={styles.menuIcon}>🚪</Text>
                    <Text style={[styles.menuLabel, { color: colors.error[500] }]}>{t('auth.logout')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
    },
    menu: {
        width: '80%',
        maxWidth: 320,
        height: '100%',
        borderRightWidth: 1,
    },
    header: {
        padding: 20,
        paddingTop: 40,
    },
    avatarContainer: {
        marginBottom: 12,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: '600',
    },
    userName: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
    },
    userEmail: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginTop: 2,
    },
    menuList: {
        flex: 1,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
    },
    subMenuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 36,
        borderBottomWidth: 1,
    },
    menuIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    menuLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderTopWidth: 1,
    },
});