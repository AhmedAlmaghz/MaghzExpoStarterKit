/**
 * Side Menu Component
 *
 * Navigation drawer with hierarchical menu items.
 * Supports RTL/LTR and role-based menu visibility.
 * Theme-aware colors.
 *
 * @module components/layout/SideMenu
 */
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/hooks/useTheme';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useAuth } from '@/auth/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';

interface MenuItem {
    key: string;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    route: string;
    requiredRole?: 'admin' | 'superadmin';
    children?: MenuItem[];
}

/**
 * Menu items configuration
 */
const getMenuItems = (t: (key: string) => string): MenuItem[] => [
    { key: 'home', label: t('nav.home'), icon: 'home', route: '/' },
    { key: 'dashboard', label: t('nav.dashboard'), icon: 'grid', route: '/dashboard' },
    { key: 'profile', label: t('nav.profile'), icon: 'person', route: '/profile' },
    { key: 'settings', label: t('nav.settings'), icon: 'settings', route: '/settings' },
    { key: 'notifications', label: t('nav.notifications'), icon: 'notifications', route: '/notifications' },
    {
        key: 'admin',
        label: t('nav.admin'),
        icon: 'shield-checkmark',
        route: '/admin',
        requiredRole: 'admin',
        children: [
            { key: 'admin-users', label: t('admin.userManagement') || 'Users', icon: 'people', route: '/admin/users' },
            { key: 'admin-analytics', label: t('admin.analytics'), icon: 'analytics', route: '/admin/analytics' },
            { key: 'admin-content', label: t('admin.contentManagement') || 'Content', icon: 'document-text', route: '/admin/content' },
            { key: 'admin-audit', label: t('admin.auditLogs'), icon: 'list', route: '/admin/audit-logs' },
        ],
    },
    { key: 'about', label: t('nav.about'), icon: 'information-circle', route: '/about' },
    { key: 'help', label: t('nav.help'), icon: 'help-circle', route: '/help' },
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

    const handleLogout = async () => {
        onClose();
        await logout();
    };

    return (
        <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
            <TouchableOpacity style={styles.overlayTouchable} onPress={onClose} activeOpacity={1} />
            <View style={[styles.menu, { backgroundColor: colors.surface }]}>
                {/* User info header */}
                <View style={[styles.header, { backgroundColor: colors.primary[500] }]}>
                    <View style={styles.avatarContainer}>
                        <View style={[styles.avatar, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
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
                                <Ionicons name={item.icon} size={20} color={colors.text} style={styles.menuIcon} />
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
                                    <Ionicons name={child.icon} size={18} color={colors.textSecondary} style={styles.subMenuIcon} />
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
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out" size={20} color={colors.error[500]} style={styles.menuIcon} />
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
        flexDirection: 'row',
    },
    overlayTouchable: {
        flex: 1,
    },
    menu: {
        width: '80%',
        maxWidth: 320,
        height: '100%',
        borderRightWidth: 1,
    },
    header: {
        padding: 20,
        paddingTop: 60,
    },
    avatarContainer: {
        marginBottom: 12,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
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
        marginRight: 12,
    },
    subMenuIcon: {
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
