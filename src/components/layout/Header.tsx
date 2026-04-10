/**
 * Header Component
 *
 * Application header with logo, user info, search, and quick actions.
 *
 * @module components/layout/Header
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/hooks/useTheme';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useAuth } from '@/auth/hooks/useAuth';

interface HeaderProps {
    /** Whether to show the search icon */
    showSearch?: boolean;
    /** Whether to show notification bell */
    showNotifications?: boolean;
    /** Whether to show user avatar */
    showUser?: boolean;
    /** Custom title override */
    title?: string;
    /** Right action component */
    rightAction?: React.ReactNode;
    /** Callback when search is pressed */
    onSearchPress?: () => void;
    /** Callback when notifications is pressed */
    onNotificationsPress?: () => void;
    /** Callback when user avatar is pressed */
    onUserPress?: () => void;
}

/**
 * Header component
 */
export function Header({
    showSearch = true,
    showNotifications = true,
    showUser = true,
    title,
    rightAction,
    onSearchPress,
    onNotificationsPress,
    onUserPress,
}: HeaderProps): React.ReactElement {
    const { colors, isDarkMode } = useTheme();
    const { t } = useTranslation();
    const { user } = useAuth();
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: colors.headerBackground,
                    paddingTop: insets.top,
                    borderBottomColor: colors.border,
                },
            ]}
        >
            <View style={styles.content}>
                {/* Left section - Logo/Title */}
                <View style={styles.leftSection}>
                    <Text style={[styles.title, { color: colors.text }]}>
                        {title || t('common.appName')}
                    </Text>
                </View>

                {/* Right section - Actions */}
                <View style={styles.rightSection}>
                    {!!showSearch && (
                        <TouchableOpacity
                            onPress={onSearchPress}
                            style={styles.iconButton}
                            accessibilityLabel={t('common.search')}
                        >
                            <Text style={[styles.icon, { color: colors.textSecondary }]}>🔍</Text>
                        </TouchableOpacity>
                    )}

                    {!!showNotifications && (
                        <TouchableOpacity
                            onPress={onNotificationsPress}
                            style={styles.iconButton}
                            accessibilityLabel={t('nav.notifications')}
                        >
                            <Text style={[styles.icon, { color: colors.textSecondary }]}>🔔</Text>
                        </TouchableOpacity>
                    )}

                    {!!showUser && user && (
                        <TouchableOpacity
                            onPress={onUserPress}
                            style={styles.avatarButton}
                            accessibilityLabel={t('nav.profile')}
                        >
                            <View style={[styles.avatar, { backgroundColor: colors.primary[500] }]}>
                                <Text style={styles.avatarText}>
                                    {user.displayName.charAt(0).toUpperCase()}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}

                    {rightAction}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 56,
        paddingHorizontal: 16,
    },
    leftSection: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        fontSize: 20,
    },
    avatarButton: {
        marginLeft: 4,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});