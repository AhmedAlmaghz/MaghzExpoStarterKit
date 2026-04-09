/**
 * Advanced Settings Screen
 *
 * Cache management and reset options.
 *
 * @module app/(main)/settings/advanced
 */
import React from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useTheme } from '@/theme/hooks/useTheme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { APP } from '@/lib/constants';

export default function AdvancedSettingsScreen(): React.ReactElement {
    const { t } = useTranslation();
    const { colors } = useTheme();

    const handleClearCache = () => {
        Alert.alert(t('settings.clearCache'), 'Are you sure?', [
            { text: t('common.cancel'), style: 'cancel' },
            { text: t('common.confirm'), onPress: () => { } },
        ]);
    };

    const handleResetSettings = () => {
        Alert.alert(t('settings.resetSettings'), t('settings.resetConfirm'), [
            { text: t('common.cancel'), style: 'cancel' },
            { text: t('common.confirm'), style: 'destructive', onPress: () => { } },
        ]);
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <Card title={t('settings.advanced')}>
                <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{t('settings.appVersion')}</Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>{APP.VERSION}</Text>
                </View>
            </Card>
            <View style={styles.actions}>
                <Button title={t('settings.clearCache')} onPress={handleClearCache} variant="outline" fullWidth />
                <View style={styles.spacer} />
                <Button title={t('settings.resetSettings')} onPress={handleResetSettings} variant="danger" fullWidth />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
    infoLabel: { fontSize: 14 },
    infoValue: { fontSize: 14, fontWeight: '500' },
    actions: { paddingHorizontal: 20, marginTop: 24 },
    spacer: { height: 12 },
});