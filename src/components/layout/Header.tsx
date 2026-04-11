import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/hooks/useTheme';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useAuth } from '@/auth/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface HeaderProps {
    showSearch?: boolean;
    showNotifications?: boolean;
    showUser?: boolean;
    title?: string;
    onSearchPress?: () => void;
    onNotificationsPress?: () => void;
    onUserPress?: () => void;
}

export function Header({
    showSearch = true,
    showNotifications = true,
    showUser = true,
    title,
    onSearchPress,
    onNotificationsPress,
    onUserPress,
}: HeaderProps): React.ReactElement {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const { user, status, logout } = useAuth();
    const router = useRouter();
    const [menuVisible, setMenuVisible] = useState(false);

    const isAuthenticated = status === 'authenticated';

    const handleLogout = async () => {
        setMenuVisible(false);
        await logout();
        router.replace('/(auth)/login');
    };

    const toggleMenu = () => {
        if (onUserPress) {
            onUserPress();
        } else {
            setMenuVisible(!menuVisible);
        }
    };

    return (
        <SafeAreaView
            edges={['top']}
            style={{ backgroundColor: colors.surface[50] }}
        >
            <View style={styles.container}>
                {/* Left: Brand / Title */}
                <View style={styles.leftSection}>
                    <TouchableOpacity onPress={() => router.push('/(main)')} style={styles.logoContainer}>
                        <View style={[styles.brandIcon, { backgroundColor: colors.primary[500] }]}>
                            <Ionicons name="basket" size={20} color="white" />
                        </View>
                        <View>
                            <Text style={[styles.brandName, { color: colors.text }]}>
                                {title || 'SooqAlyemen'}
                            </Text>
                            <View style={styles.statusRow}>
                                <View style={styles.statusDot} />
                                <Text style={[styles.statusText, { color: colors.textSecondary }]}>{t('common.online')}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Right: Actions */}
                <View style={styles.rightSection}>
                    {showSearch && (
                        <TouchableOpacity onPress={onSearchPress} style={styles.actionIcon}>
                            <Ionicons name="search-outline" size={22} color={colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                    
                    {showNotifications && (
                        <TouchableOpacity onPress={onNotificationsPress} style={styles.actionIcon}>
                            <Ionicons name="notifications-outline" size={22} color={colors.textSecondary} />
                            <View style={styles.badge} />
                        </TouchableOpacity>
                    )}

                    {showUser && (
                        isAuthenticated ? (
                            <TouchableOpacity onPress={toggleMenu} style={styles.profileButton}>
                                <View style={[styles.avatar, { backgroundColor: colors.primary[100] }]}>
                                    <Text style={[styles.avatarText, { color: colors.primary[700] }]}>
                                        {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity 
                                style={[styles.loginBtn, { backgroundColor: colors.primary[500] }]}
                                onPress={() => router.push('/(auth)/login')}
                            >
                                <Text style={styles.loginBtnText}>{t('auth.login')}</Text>
                            </TouchableOpacity>
                        )
                    )}
                </View>

                {/* Profile Dropdown Menu */}
                <Modal
                    visible={menuVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setMenuVisible(false)}
                >
                    <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
                        <View style={[styles.menuContainer, { backgroundColor: colors.surface[50], borderColor: colors.border }]}>
                            <View style={styles.menuHeader}>
                                <Text style={[styles.menuUser, { color: colors.text }]}>{user?.displayName}</Text>
                                <Text style={[styles.menuEmail, { color: colors.textSecondary }]}>{user?.email}</Text>
                            </View>
                            <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
                            
                            <TouchableOpacity 
                                style={styles.menuItem} 
                                onPress={() => { setMenuVisible(false); router.push('/(main)/profile'); }}
                            >
                                <Ionicons name="person-outline" size={18} color={colors.text} />
                                <Text style={[styles.menuItemText, { color: colors.text }]}>{t('nav.profile')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.menuItem} 
                                onPress={() => { setMenuVisible(false); router.push('/(main)/dashboard'); }}
                            >
                                <Ionicons name="grid-outline" size={18} color={colors.text} />
                                <Text style={[styles.menuItemText, { color: colors.text }]}>{t('nav.dashboard')}</Text>
                            </TouchableOpacity>

                            <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
                            
                            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                                <Ionicons name="log-out-outline" size={18} color={colors.error[500]} />
                                <Text style={[styles.menuItemText, { color: colors.error[500] }]}>{t('auth.logout')}</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Modal>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 15,
        height: 60,
    },
    leftSection: {
        flex: 1,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    brandIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    brandName: {
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: -2,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#4ade80',
        marginRight: 6,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '600',
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    actionIcon: {
        position: 'relative',
        padding: 4,
    },
    badge: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ef4444',
        borderWidth: 1.5,
        borderColor: 'white',
    },
    profileButton: {
        marginLeft: 5,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    avatarText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginBtnText: {
        color: 'white',
        fontSize: 13,
        fontWeight: '700',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    menuContainer: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 100 : 70,
        right: 20,
        width: 220,
        borderRadius: 20,
        borderWidth: 1,
        padding: 8,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
    },
    menuHeader: {
        padding: 12,
    },
    menuUser: {
        fontSize: 16,
        fontWeight: '700',
    },
    menuEmail: {
        fontSize: 12,
        marginTop: 2,
    },
    menuDivider: {
        height: 1,
        marginVertical: 4,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        gap: 12,
    },
    menuItemText: {
        fontSize: 14,
        fontWeight: '600',
    },
});