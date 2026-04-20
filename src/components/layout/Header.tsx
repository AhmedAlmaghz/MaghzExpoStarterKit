import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Modal, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/hooks/useTheme';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useI18nStore, LOCALES } from '@/i18n/i18nStore';
import { useThemeStore, THEME_MODES } from '@/theme/themeStore';
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
    const { colors, mode, setMode } = useTheme();
    const { t } = useTranslation();
    const { locale, setLocale, localeConfig } = useI18nStore();
    const { user, status, logout } = useAuth();
    const router = useRouter();
    const [menuVisible, setMenuVisible] = useState(false);
    const [settingsExpanded, setSettingsExpanded] = useState(false);

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

    const handleThemeChange = (newMode: 'light' | 'dark' | 'system') => {
        setMode(newMode);
    };

    const handleLanguageChange = (newLocale: 'en' | 'ar') => {
        setLocale(newLocale);
    };

    return (
        <SafeAreaView
            edges={['top']}
            style={{ backgroundColor: colors.headerBackground }}
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
                                <View style={[styles.statusDot, { backgroundColor: colors.success[500] }]} />
                                <Text style={[styles.statusText, { color: colors.textSecondary }]}>{t('common.online')}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Right: Actions */}
                <View style={styles.rightSection}>
                    {showSearch && (
                        <TouchableOpacity
                            onPress={onSearchPress || (() => router.push('/(main)/search'))}
                            style={styles.actionIcon}
                        >
                            <Ionicons name="search-outline" size={22} color={colors.textSecondary} />
                        </TouchableOpacity>
                    )}

                    {showNotifications && (
                        <TouchableOpacity
                            onPress={onNotificationsPress || (() => router.push('/(main)/notifications'))}
                            style={styles.actionIcon}
                        >
                            <Ionicons name="notifications-outline" size={22} color={colors.textSecondary} />
                            <View style={[styles.badge, { backgroundColor: colors.error[500] }]} />
                        </TouchableOpacity>
                    )}

                    {showUser && (
                        <TouchableOpacity onPress={toggleMenu} style={styles.profileButton}>
                            <View style={[styles.avatar, {
                                backgroundColor: isAuthenticated ? colors.primary[100] : colors.surfaceVariant,
                                borderColor: isAuthenticated ? colors.primary[500] : colors.border
                            }]}>
                                {isAuthenticated ? (
                                    <Text style={[styles.avatarText, { color: colors.primary[700] }]}>
                                        {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                                    </Text>
                                ) : (
                                    <Ionicons name="person" size={20} color={colors.textSecondary} />
                                )}
                            </View>
                        </TouchableOpacity>
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
                        <View style={[styles.menuContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            {isAuthenticated ? (
                                <View style={styles.menuHeader}>
                                    <Text style={[styles.menuUser, { color: colors.text }]}>{user?.displayName}</Text>
                                    <Text style={[styles.menuEmail, { color: colors.textSecondary }]}>{user?.email}</Text>
                                </View>
                            ) : (
                                <View style={styles.menuHeader}>
                                    <Text style={[styles.menuUser, { color: colors.text }]}>{t('common.welcome') || 'Welcome, Guest'}</Text>
                                    <TouchableOpacity
                                        onPress={() => { setMenuVisible(false); router.push('/(auth)/login'); }}
                                        style={[styles.smallLoginBtn, { backgroundColor: colors.primary[500] }]}
                                    >
                                        <Text style={styles.smallLoginBtnText}>{t('auth.login')}</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            <View style={[styles.menuDivider, { backgroundColor: colors.divider }]} />

                            {/* Settings Section */}
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => setSettingsExpanded(!settingsExpanded)}
                            >
                                <Ionicons name="settings-outline" size={18} color={colors.text} />
                                <Text style={[styles.menuItemText, { color: colors.text, flex: 1 }]}>{t('nav.settings')}</Text>
                                <Ionicons
                                    name={settingsExpanded ? 'chevron-up' : 'chevron-down'}
                                    size={16}
                                    color={colors.textSecondary}
                                />
                            </TouchableOpacity>

                            {/* Expanded Settings */}
                            {settingsExpanded && (
                                <View style={[styles.settingsPanel, { backgroundColor: colors.surfaceVariant }]}>
                                    {/* Theme Selection */}
                                    <View style={styles.settingRow}>
                                        <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>
                                            {t('settings.theme')}
                                        </Text>
                                        <View style={styles.themeButtons}>
                                            {THEME_MODES.map((theme) => (
                                                <TouchableOpacity
                                                    key={theme.mode}
                                                    style={[
                                                        styles.themeButton,
                                                        mode === theme.mode && { backgroundColor: colors.primary[500] }
                                                    ]}
                                                    onPress={() => handleThemeChange(theme.mode)}
                                                >
                                                    <Ionicons
                                                        name={theme.icon as any}
                                                        size={16}
                                                        color={mode === theme.mode ? colors.textInverse : colors.textSecondary}
                                                    />
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>

                                    {/* Language Selection */}
                                    <View style={styles.settingRow}>
                                        <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>
                                            {t('settings.language')}
                                        </Text>
                                        <View style={styles.languageButtons}>
                                            {Object.values(LOCALES).map((lang) => (
                                                <TouchableOpacity
                                                    key={lang.code}
                                                    style={[
                                                        styles.languageButton,
                                                        locale === lang.code && { backgroundColor: colors.primary[500] }
                                                    ]}
                                                    onPress={() => handleLanguageChange(lang.code)}
                                                >
                                                    <Text style={styles.languageFlag}>{lang.flag}</Text>
                                                    <Text style={[
                                                        styles.languageText,
                                                        { color: locale === lang.code ? colors.textInverse : colors.textSecondary }
                                                    ]}>
                                                        {lang.nativeName}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                </View>
                            )}

                            <View style={[styles.menuDivider, { backgroundColor: colors.divider }]} />

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => { setMenuVisible(false); router.push('/(main)/profile'); }}
                            >
                                <Ionicons name="person-outline" size={18} color={colors.text} />
                                <Text style={[styles.menuItemText, { color: colors.text }]}>{t('nav.profile')}</Text>
                            </TouchableOpacity>

                            {isAuthenticated && (
                                <>
                                    <TouchableOpacity
                                        style={styles.menuItem}
                                        onPress={() => { setMenuVisible(false); router.push('/(main)/dashboard'); }}
                                    >
                                        <Ionicons name="grid-outline" size={18} color={colors.text} />
                                        <Text style={[styles.menuItemText, { color: colors.text }]}>{t('nav.dashboard')}</Text>
                                    </TouchableOpacity>

                                    <View style={[styles.menuDivider, { backgroundColor: colors.divider }]} />

                                    <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                                        <Ionicons name="log-out-outline" size={18} color={colors.error[500]} />
                                        <Text style={[styles.menuItemText, { color: colors.error[500] }]}>{t('auth.logout')}</Text>
                                    </TouchableOpacity>
                                </>
                            )}
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
        paddingBottom: 12,
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
    },
    avatarText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    smallLoginBtn: {
        marginTop: 8,
        paddingHorizontal: 15,
        paddingVertical: 6,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    smallLoginBtnText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '700',
    },
    menuContainer: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 100 : 70,
        right: 20,
        width: 260,
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
    settingsPanel: {
        marginHorizontal: 8,
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
    },
    settingRow: {
        marginBottom: 12,
    },
    settingLabel: {
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    themeButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    themeButton: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    languageButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    languageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: 'rgba(0,0,0,0.05)',
        gap: 6,
    },
    languageFlag: {
        fontSize: 16,
    },
    languageText: {
        fontSize: 12,
        fontWeight: '600',
    },
});
