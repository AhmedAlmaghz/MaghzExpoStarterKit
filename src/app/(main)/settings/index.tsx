/**
 * Settings Screen
 *
 * Main settings screen with navigation to sub-settings.
 * Supports theme and language switching with real-time preview.
 *
 * @module app/(main)/settings/index
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/auth/hooks/useAuth';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useTheme } from '@/theme/hooks/useTheme';
import { useI18nStore, LOCALES } from '@/i18n/i18nStore';
import { useThemeStore, THEME_MODES, ThemeMode } from '@/theme/themeStore';
import { Card } from '@/components/ui/Card';
import { Ionicons } from '@expo/vector-icons';

interface SettingsItem {
    title: string;
    subtitle?: string;
    icon: string;
    route?: string;
    onPress?: () => void;
}

export default function SettingsScreen(): React.ReactElement {
    const { t } = useTranslation();
    const { colors, mode, setMode } = useTheme();
    const { locale, setLocale } = useI18nStore();
    const { logout } = useAuth();
    const router = useRouter();

    const handleThemeChange = (newMode: ThemeMode) => {
        setMode(newMode);
    };

    const handleLanguageChange = (newLocale: 'en' | 'ar') => {
        setLocale(newLocale);
    };

    const settingsGroups: { title: string; items: SettingsItem[] }[] = [
        {
            title: t('settings.appearance'),
            items: [
                {
                    title: t('settings.theme'),
                    subtitle: t(`settings.${mode}Mode`),
                    icon: '🎨',
                },
                {
                    title: t('settings.language'),
                    subtitle: LOCALES[locale].nativeName,
                    icon: '🌐',
                },
            ],
        },
        {
            title: t('settings.notifications'),
            items: [
                {
                    title: t('settings.pushNotifications'),
                    subtitle: '',
                    icon: '🔔',
                    route: '/(main)/settings/notifications'
                },
                {
                    title: t('settings.emailNotifications'),
                    subtitle: '',
                    icon: '📧',
                    route: '/(main)/settings/notifications'
                },
            ],
        },
        {
            title: t('settings.privacy'),
            items: [
                {
                    title: t('settings.privacySettings'),
                    subtitle: '',
                    icon: '🔒',
                    route: '/(main)/settings/privacy'
                },
            ],
        },
        {
            title: t('settings.advanced'),
            items: [
                {
                    title: t('settings.clearCache'),
                    subtitle: '',
                    icon: '🗑️',
                    route: '/(main)/settings/advanced'
                },
                {
                    title: t('settings.resetSettings'),
                    subtitle: '',
                    icon: '🔄',
                    route: '/(main)/settings/advanced'
                },
            ],
        },
        {
            title: t('common.appName'),
            items: [
                {
                    title: t('nav.about'),
                    subtitle: '',
                    icon: 'ℹ️',
                    route: '/(main)/about'
                },
                {
                    title: t('nav.help'),
                    subtitle: '',
                    icon: '❓',
                    route: '/(main)/help'
                },
            ],
        },
    ];

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Theme & Language Quick Settings */}
            <Card style={styles.quickSettings} elevated>
                <View style={styles.quickSettingRow}>
                    <Text style={[styles.quickSettingLabel, { color: colors.textSecondary }]}>
                        {t('settings.theme')}
                    </Text>
                    <View style={styles.themeSelector}>
                        {THEME_MODES.map((theme) => (
                            <TouchableOpacity
                                key={theme.mode}
                                style={[
                                    styles.themeOption,
                                    mode === theme.mode && {
                                        backgroundColor: colors.primary[500],
                                        borderColor: colors.primary[500],
                                    }
                                ]}
                                onPress={() => handleThemeChange(theme.mode)}
                            >
                                <Ionicons
                                    name={theme.icon as any}
                                    size={18}
                                    color={mode === theme.mode ? colors.textInverse : colors.textSecondary}
                                />
                                <Text style={[
                                    styles.themeOptionText,
                                    { color: mode === theme.mode ? colors.textInverse : colors.textSecondary }
                                ]}>
                                    {t(theme.label)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={[styles.divider, { backgroundColor: colors.divider }]} />

                <View style={styles.quickSettingRow}>
                    <Text style={[styles.quickSettingLabel, { color: colors.textSecondary }]}>
                        {t('settings.language')}
                    </Text>
                    <View style={styles.languageSelector}>
                        {Object.values(LOCALES).map((lang) => (
                            <TouchableOpacity
                                key={lang.code}
                                style={[
                                    styles.languageOption,
                                    locale === lang.code && {
                                        backgroundColor: colors.primary[500],
                                        borderColor: colors.primary[500],
                                    }
                                ]}
                                onPress={() => handleLanguageChange(lang.code)}
                            >
                                <Text style={styles.languageFlag}>{lang.flag}</Text>
                                <Text style={[
                                    styles.languageOptionText,
                                    { color: locale === lang.code ? colors.textInverse : colors.textSecondary }
                                ]}>
                                    {lang.nativeName}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Card>

            {settingsGroups.map((group) => (
                <View key={group.title} style={styles.group}>
                    <Text style={[styles.groupTitle, { color: colors.textSecondary }]}>{group.title}</Text>
                    <Card padding={0}>
                        {group.items.map((item, index) => (
                            <TouchableOpacity
                                key={item.title}
                                style={[
                                    styles.settingItem,
                                    { borderBottomColor: colors.borderLight },
                                    index === group.items.length - 1 && styles.lastItem,
                                ]}
                                onPress={() => item.route && router.push(item.route as never)}
                            >
                                <Text style={styles.settingIcon}>{item.icon}</Text>
                                <View style={styles.settingContent}>
                                    <Text style={[styles.settingTitle, { color: colors.text }]}>{item.title}</Text>
                                    {item.subtitle ? (
                                        <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                                            {item.subtitle}
                                        </Text>
                                    ) : null}
                                </View>
                                <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
                            </TouchableOpacity>
                        ))}
                    </Card>
                </View>
            ))}

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.logoutButton, { backgroundColor: colors.error[50] }]}
                    onPress={logout}
                >
                    <Ionicons name="log-out-outline" size={20} color={colors.error[500]} />
                    <Text style={[styles.logoutText, { color: colors.error[500] }]}>{t('settings.logout')}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    quickSettings: {
        marginHorizontal: 20,
        marginTop: 20,
        padding: 16,
        borderRadius: 16,
    },
    quickSettingRow: {
        paddingVertical: 8,
    },
    quickSettingLabel: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 12,
    },
    themeSelector: {
        flexDirection: 'row',
        gap: 8,
    },
    themeOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        gap: 6,
    },
    themeOptionText: {
        fontSize: 12,
        fontWeight: '600',
    },
    languageSelector: {
        flexDirection: 'row',
        gap: 8,
    },
    languageOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        gap: 6,
    },
    languageFlag: {
        fontSize: 16,
    },
    languageOptionText: {
        fontSize: 12,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        marginVertical: 12,
    },
    group: { paddingHorizontal: 20, marginTop: 20 },
    groupTitle: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', marginBottom: 8, marginLeft: 4 },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1
    },
    lastItem: { borderBottomWidth: 0 },
    settingIcon: { fontSize: 22, marginRight: 12 },
    settingContent: { flex: 1 },
    settingTitle: { fontSize: 16 },
    settingSubtitle: { fontSize: 13, marginTop: 2 },
    footer: { alignItems: 'center', paddingVertical: 32 },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        gap: 8,
    },
    logoutText: { fontSize: 16, fontWeight: '600' },
});
