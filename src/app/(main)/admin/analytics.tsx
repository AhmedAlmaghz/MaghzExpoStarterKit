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
import { adminService } from '@/lib/services/adminService';
import { ActivityIndicator, RefreshControl } from 'react-native';

export default function AnalyticsScreen(): React.ReactElement {
    const { t } = useTranslation();
    const { colors } = useTheme();

    const [loading, setLoading] = React.useState(true);
    const [stats, setStats] = React.useState<any>(null);
    const [growth, setGrowth] = React.useState<any[]>([]);

    const fetchData = React.useCallback(async () => {
        try {
            const [metrics, growthData] = await Promise.all([
                adminService.getDashboardMetrics(),
                adminService.getGrowthStats()
            ]);
            setStats(metrics);
            setGrowth(growthData);
        } catch (error) {
            console.error('Failed to load analytics:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
            </View>
        );
    }

    return (
        <ScrollView 
            style={[styles.container, { backgroundColor: colors.background }]}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} tintColor={colors.primary[500]} />}
        >
            <Text style={[styles.pageTitle, { color: colors.text }]}>{t('admin.analytics')}</Text>
            
            <View style={styles.grid}>
                <Card style={styles.miniCard}>
                    <Text style={[styles.miniLabel, { color: colors.textTertiary }]}>Conversion</Text>
                    <Text style={[styles.miniValue, { color: colors.primary[500] }]}>3.2%</Text>
                </Card>
                <Card style={styles.miniCard}>
                    <Text style={[styles.miniLabel, { color: colors.textTertiary }]}>Retainment</Text>
                    <Text style={[styles.miniValue, { color: colors.success[500] }]}>85%</Text>
                </Card>
            </View>

            <Card style={styles.chartCard}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>User Growth (7 Days)</Text>
                <View style={styles.chartContainer}>
                    {growth.map((item, idx) => (
                        <View key={idx} style={styles.chartBarContainer}>
                            <View 
                                style={[
                                    styles.chartBar, 
                                    { 
                                        backgroundColor: colors.primary[400],
                                        height: Math.max(10, item.count * 15) // Scaling for demo
                                    }
                                ]} 
                            />
                            <Text style={[styles.chartDay, { color: colors.textTertiary }]}>{item.day}</Text>
                        </View>
                    ))}
                </View>
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
    grid: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 15 },
    miniCard: { flex: 1, padding: 15 },
    miniLabel: { fontSize: 12, fontWeight: '500', marginBottom: 4 },
    miniValue: { fontSize: 20, fontWeight: '800' },
    chartCard: { marginHorizontal: 20, marginBottom: 15, padding: 20 },
    sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 20 },
    chartContainer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 120 },
    chartBarContainer: { alignItems: 'center', gap: 8 },
    chartBar: { width: 30, borderRadius: 6 },
    chartDay: { fontSize: 10, fontWeight: '600' },
    metricRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
    metricLabel: { fontSize: 14 },
    metricValue: { fontSize: 14, fontWeight: '600' },
});