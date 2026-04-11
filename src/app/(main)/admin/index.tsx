/**
 * Admin Dashboard Screen
 *
 * Admin overview with key statistics and quick actions.
 *
 * @module app/(main)/admin/index
 */
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useTheme } from '@/theme/hooks/useTheme';
import { Card } from '@/components/ui/Card';
import { adminService } from '@/lib/services/adminService';
import { ActivityIndicator, RefreshControl } from 'react-native';

interface StatCard {
    title: string;
    value: string;
    icon: string;
    color: string;
}

export default function AdminDashboardScreen(): React.ReactElement {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const router = useRouter();

    const [loading, setLoading] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);
    const [metrics, setMetrics] = React.useState({
        totalUsers: 0,
        activeUsers: 0,
        newUsers: 0,
        suspendedUsers: 0
    });

    const fetchMetrics = React.useCallback(async () => {
        try {
            const data = await adminService.getDashboardMetrics();
            setMetrics(data);
        } catch (error) {
            console.error('Failed to load metrics:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    React.useEffect(() => {
        fetchMetrics();
    }, [fetchMetrics]);

    const stats: StatCard[] = [
        { title: t('admin.totalUsers'), value: metrics.totalUsers.toLocaleString(), icon: '👥', color: colors.primary[500] },
        { title: t('admin.activeUsers'), value: metrics.activeUsers.toLocaleString(), icon: '✅', color: colors.success[500] },
        { title: t('admin.newUsers'), value: metrics.newUsers.toLocaleString(), icon: '🆕', color: colors.info[500] },
        { title: t('admin.suspendedUsers'), value: metrics.suspendedUsers.toLocaleString(), icon: '🚫', color: colors.error[500] },
    ];

    const quickActions = [
        { title: t('admin.userManagement'), icon: '👥', route: '/(main)/admin/users' },
        { title: t('admin.analytics'), icon: '📈', route: '/(main)/admin/analytics' },
        { title: t('admin.contentManagement'), icon: '📝', route: '/(main)/admin/content' },
        { title: t('admin.auditLogs'), icon: '📋', route: '/(main)/admin/audit-logs' },
    ];

    if (loading && !refreshing) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
            </View>
        );
    }

    return (
        <ScrollView 
            style={[styles.container, { backgroundColor: colors.background }]}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchMetrics(); }} tintColor={colors.primary[500]} />
            }
        >
            <Text style={[styles.pageTitle, { color: colors.text }]}>{t('admin.title')}</Text>

            <View style={styles.statsGrid}>
                {stats.map((stat) => (
                    <Card key={stat.title} style={styles.statCard}>
                        <Text style={styles.statIcon}>{stat.icon}</Text>
                        <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.title}</Text>
                    </Card>
                ))}
            </View>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('dashboard.quickStats')}</Text>
            <View style={styles.actionsGrid}>
                {quickActions.map((action) => (
                    <Card key={action.title} style={styles.actionCard} onPress={() => router.push(action.route as never)}>
                        <Text style={styles.actionIcon}>{action.icon}</Text>
                        <Text style={[styles.actionTitle, { color: colors.text }]}>{action.title}</Text>
                    </Card>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    pageTitle: { fontSize: 24, fontWeight: '700', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 12 },
    statCard: { flex: 1, minWidth: '45%', alignItems: 'center', padding: 16 },
    statIcon: { fontSize: 28, marginBottom: 8 },
    statValue: { fontSize: 24, fontWeight: '700' },
    statLabel: { fontSize: 12, marginTop: 4, textAlign: 'center' },
    sectionTitle: { fontSize: 18, fontWeight: '600', paddingHorizontal: 20, marginTop: 24, marginBottom: 12 },
    actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 12 },
    actionCard: { flex: 1, minWidth: '45%', alignItems: 'center', padding: 20 },
    actionIcon: { fontSize: 32, marginBottom: 8 },
    actionTitle: { fontSize: 14, fontWeight: '500', textAlign: 'center' },
});