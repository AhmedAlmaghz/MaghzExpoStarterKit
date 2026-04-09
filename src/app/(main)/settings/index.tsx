/**
 * Settings Screen
 *
 * Main settings screen with navigation to sub-settings.
 *
 * @module app/(main)/settings/index
 */
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/auth/hooks/useAuth';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useTheme } from '@/theme/hooks/useTheme';
import { Card } from '@/components/ui/Card';

interface SettingsItem {
    title: string;
    subtitle: string;
    icon: string;
    route: string;
}

export default function SettingsScreen(): React.ReactElement {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { logout } = useAuth();
    const router = useRouter();

    const settingsGroups: { title: string; items: SettingsItem[] }[] = [
        {
            title: t('settings.appearance'),
            items: [
                { title: t('settings.theme'), subtitle: t('settings.lightMode'), icon: '🎨', route: '/(main)/settings' },
                { title: t('settings.language'), subtitle: 'English', icon: '🌐', route: '/(main)/settings' },
            ],
        },
        {
            title: t('settings.notifications'),
            items: [
                { title: t('settings.pushNotifications'), subtitle: '', icon: '🔔', route: '/(main)/settings/notifications' },
                { title: t('settings.emailNotifications'), subtitle: '', icon: '📧', route: '/(main)/settings/notifications' },
            ],
        },
        {
            title: t('settings.privacy'),
            items: [
                { title: t('settings.privacySettings'), subtitle: '', icon: '🔒', route: '/(main)/settings/privacy' },
            ],
        },
        {
            title: t('settings.advanced'),
            items: [
                { title: t('settings.clearCache'), subtitle: '', icon: '🗑️', route: '/(main)/settings/advanced' },
                { title: t('settings.resetSettings'), subtitle: '', icon: '🔄', route: '/(main)/settings/advanced' },
            ],
        },
        {
            title: t('common.appName'),
            items: [
                { title: t('nav.about'), subtitle: '', icon: 'ℹ️', route: '/(main)/about' },
                { title: t('nav.help'), subtitle: '', icon: '❓', route: '/(main)/help' },
            ],
        },
    ];

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
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
                                onPress={() => router.push(item.route as never)}
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
                                <Text style={[styles.chevron, { color: colors.textTertiary }]}>›</Text>
                            </TouchableOpacity>
                        ))}
                    </Card>
                </View>
            ))}

            <View style={styles.footer}>
                <TouchableOpacity onPress={logout}>
                    <Text style={[styles.logoutText, { color: colors.error[500] }]}>{t('settings.logout')}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    group: { paddingHorizontal: 20, marginTop: 20 },
    groupTitle: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', marginBottom: 8, marginLeft: 4 },
    settingItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1 },
    lastItem: { borderBottomWidth: 0 },
    settingIcon: { fontSize: 22, marginRight: 12 },
    settingContent: { flex: 1 },
    settingTitle: { fontSize: 16 },
    settingSubtitle: { fontSize: 13, marginTop: 2 },
    chevron: { fontSize: 24, fontWeight: '300' },
    footer: { alignItems: 'center', paddingVertical: 32 },
    logoutText: { fontSize: 16, fontWeight: '600' },
});