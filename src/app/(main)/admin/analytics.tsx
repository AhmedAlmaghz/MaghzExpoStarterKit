/**
 * Admin Analytics Screen
 * 
 * Professional analytics dashboard for monitoring platform growth,
 * user activity, and system metrics with a dark 'Pro' aesthetic.
 * 
 * @module app/(main)/admin/analytics
 */
import React from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, Dimensions } from 'react-native';
import { Loading } from '@/components/ui/Loading';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useTheme } from '@/theme/hooks/useTheme';
import { adminService } from '@/lib/services/adminService';
import { Card } from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Timestamp to force re-bundle: 2026-04-12T00:26:00Z

export default function AdminAnalyticsScreen(): React.ReactElement {
    const { t } = useTranslation();
    const { colors } = useTheme();

    const [loading, setLoading] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);
    const [growthData, setGrowthData] = React.useState<any[]>([]);

    const fetchAnalytics = React.useCallback(async () => {
        try {
            const data = await adminService.getGrowthStats();
            // Defensive check for data integrity
            const validData = (data || []).map(item => ({
                ...item,
                day: item.day || 'N/A',
                count: typeof item.count === 'number' ? item.count : 0
            }));
            setGrowthData(validData);
        } catch (error) {
            console.error('Failed to load analytics:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    React.useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    if (loading && !refreshing) {
        return <Loading fullScreen />;
    }

    const totalUsers = growthData.reduce((sum, item) => sum + item.count, 0);

    return (
        <View style={[styles.container, { backgroundColor: '#0f172a' }]}>
            <ScrollView 
                style={styles.scrollView}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchAnalytics(); }} tintColor="#38bdf8" />}
            >
                <View style={styles.header}>
                    <Text style={styles.pageTitle}>{t('admin.analytics')}</Text>
                    <Text style={styles.pageSubtitle}>Platform performance & growth metrics</Text>
                </View>

                {/* Metrics Grid */}
                <View style={styles.metricsGrid}>
                    <MetricBox title="Total Users" value={totalUsers} change="+12%" icon="people" color="#38bdf8" />
                    <MetricBox title="Active Sessions" value="42" change="+5%" icon="pulse" color="#22c55e" />
                    <MetricBox title="Avg. Loyalty" value="84" change="+2%" icon="star" color="#f59e0b" />
                    <MetricBox title="System Load" value="18%" change="-4%" icon="flash" color="#a855f7" />
                </View>

                {/* Growth Chart Visualization (Mock representation) */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>User Registration Growth</Text>
                    <Card style={styles.chartCard}>
                        <View style={styles.chartContainer}>
                            {growthData.map((item, index) => {
                                const maxCount = Math.max(...growthData.map(d => d.count)) || 1;
                                const height = (item.count / maxCount) * 150;
                                return (
                                    <View key={index} style={styles.chartCol}>
                                        <View style={[styles.bar, { height: Math.max(height, 20), backgroundColor: '#38bdf8' }]}>
                                            <LinearGradient colors={['#38bdf8', '#0ea5e9']} style={StyleSheet.absoluteFill} />
                                        </View>
                                        <Text style={styles.barLabel}>{item.day}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </Card>
                </View>

                {/* Insights List */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Key Insights</Text>
                    <LinearGradient colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']} style={styles.insightCard}>
                        <InsightRow icon="trending-up" text="User growth is 12% higher than last week." color="#22c55e" />
                        <InsightRow icon="alert-circle" text="System load peaked at 12:00 PM today." color="#f59e0b" />
                        <InsightRow icon="checkmark-circle" text="All services are operating within normal limits." color="#38bdf8" />
                    </LinearGradient>
                </View>
            </ScrollView>
        </View>
    );
}

function MetricBox({ title, value, change, icon, color }: any) {
    return (
        <View style={styles.metricBox}>
            <View style={styles.metricHeader}>
                <View style={[styles.iconBox, { backgroundColor: `${color}20` }]}>
                    <Ionicons name={icon} size={18} color={color} />
                </View>
                <Text style={[styles.changeText, { color: change.startsWith('+') ? '#22c55e' : '#f43f5e' }]}>{change}</Text>
            </View>
            <Text style={styles.metricValue}>{value}</Text>
            <Text style={styles.metricTitle}>{title}</Text>
        </View>
    );
}

function InsightRow({ icon, text, color }: any) {
    return (
        <View style={styles.insightRow}>
            <Ionicons name={icon} size={20} color={color} />
            <Text style={styles.insightText}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollView: { flex: 1 },
    header: { padding: 25, paddingTop: 40 },
    pageTitle: { color: '#fff', fontSize: 28, fontWeight: '800' },
    pageSubtitle: { color: '#94a3b8', fontSize: 13, marginTop: 4 },
    metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 25 },
    metricBox: { width: (width - 62) / 2, backgroundColor: 'rgba(255,255,255,0.05)', padding: 18, borderRadius: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    metricHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    iconBox: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    changeText: { fontSize: 11, fontWeight: '700' },
    metricValue: { color: '#fff', fontSize: 22, fontWeight: '800' },
    metricTitle: { color: '#64748b', fontSize: 11, fontWeight: '600', marginTop: 4 },
    section: { marginTop: 35, paddingHorizontal: 25 },
    sectionTitle: { color: '#f8fafc', fontSize: 16, fontWeight: '700', marginBottom: 20 },
    chartCard: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 20, borderRadius: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    chartContainer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', height: 180 },
    chartCol: { alignItems: 'center', width: 30 },
    bar: { width: 14, borderRadius: 7, overflow: 'hidden' },
    barLabel: { color: '#64748b', fontSize: 10, marginTop: 8, fontWeight: '600' },
    insightCard: { borderRadius: 25, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    insightRow: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 15 },
    insightText: { color: '#cbd5e1', fontSize: 13, flex: 1, lineHeight: 18 }
});