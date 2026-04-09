/**
 * Privacy Settings Screen
 *
 * Manage privacy and data collection preferences.
 *
 * @module app/(main)/settings/privacy
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, StyleSheet } from 'react-native';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useTheme } from '@/theme/hooks/useTheme';
import { Card } from '@/components/ui/Card';

export default function PrivacySettingsScreen(): React.ReactElement {
    const { t } = useTranslation();
    const { colors } = useTheme();

    const [dataCollection, setDataCollection] = useState(true);
    const [analyticsOptIn, setAnalyticsOptIn] = useState(false);
    const [crashReports, setCrashReports] = useState(true);

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <Card title={t('settings.privacy')}>
                <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                        <Text style={[styles.settingTitle, { color: colors.text }]}>{t('settings.dataCollection')}</Text>
                        <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>Allow collection of usage data to improve the app</Text>
                    </View>
                    <Switch value={dataCollection} onValueChange={setDataCollection} trackColor={{ false: colors.border, true: colors.primary[500] }} />
                </View>
                <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                        <Text style={[styles.settingTitle, { color: colors.text }]}>{t('settings.analyticsOptIn')}</Text>
                        <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>Share anonymous analytics data</Text>
                    </View>
                    <Switch value={analyticsOptIn} onValueChange={setAnalyticsOptIn} trackColor={{ false: colors.border, true: colors.primary[500] }} />
                </View>
                <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                        <Text style={[styles.settingTitle, { color: colors.text }]}>Crash Reports</Text>
                        <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>Automatically send crash reports</Text>
                    </View>
                    <Switch value={crashReports} onValueChange={setCrashReports} trackColor={{ false: colors.border, true: colors.primary[500] }} />
                </View>
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
    settingInfo: { flex: 1, marginRight: 12 },
    settingTitle: { fontSize: 16 },
    settingDesc: { fontSize: 13, marginTop: 2 },
});