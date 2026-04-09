/**
 * Analytics Screen
 *
 * Admin analytics dashboard.
 *
 * @module app/(main)/admin/analytics
 */
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useTheme } from '@/theme/hooks/useTheme';
import { Card } from '@/components/ui/Card';

export default function AnalyticsScreen(): React.ReactElement {
    const { t } = useTranslation();
    const { colors } = useTheme();

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.pageTitle, { color: colors.text }]}>{t('admin.analytics')}</Text>
            <Card title={t('admin.performance')}>
                <Text style={[styles.placeholder, { color: colors.textSecondary }]}>
                    📊 Analytics charts and metrics will be displayed here.
                </Text>
            </Card>
            <Card title={t('admin.systemHealth')}>
                <View style={styles.metricRow}>
                    <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>API Response Time</Text>
                    <Text style={[styles.metricValue, { color: colors.success[500] }]}>120ms</Text>
                </View>
                <View style={styles.metricRow}>
                    <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Uptime</Text>
                    <Text style={[styles.metricValue, { color: colors.success[500] }]}>99.9%</Text>
                </View>
                <View style={styles.metricRow}>
                    <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Error Rate</Text>
                    <Text style={[styles.metricValue, { color: colors.success[500] }]}>0.1%</Text>
                </View>
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    pageTitle: { fontSize: 24, fontWeight: '700', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
    placeholder: { fontSize: 14, textAlign: 'center', paddingVertical: 40 },
    metricRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
    metricLabel: { fontSize: 14 },
    metricValue: { fontSize: 14, fontWeight: '600' },
});