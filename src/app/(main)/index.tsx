/**
 * Dashboard Screen
 *
 * User dashboard with quick stats, recent activity, and alerts.
 *
 * @module app/(main)/index
 */
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { useAuth } from '@/auth/hooks/useAuth';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useTheme } from '@/theme/hooks/useTheme';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';

interface QuickStat {
    label: string;
    value: string;
    icon: string;
    color: string;
}

export default function DashboardScreen(): React.ReactElement {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { user } = useAuth();
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setRefreshing(false);
    };

    if (isLoading) {
        return <Loading message={t('common.loading')} />;
    }

    const quickStats: QuickStat[] = [
        { label: t('dashboard.tasks'), value: '5', icon: '📋', color: colors.primary[500] },
        { label: t('dashboard.alerts'), value: '2', icon: '🔔', color: colors.warning[500] },
        { label: t('dashboard.recentActivity'), value: '12', icon: '📊', color: colors.success[500] },
    ];

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary[500]} />}
        >
            {/* Welcome */}
            <View style={styles.welcomeSection}>
                <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>
                    {t('dashboard.welcome')}
                </Text>
                <Text style={[styles.userName, { color: colors.text }]}>
                    {user?.displayName || 'User'}
                </Text>
            </View>

            {/* Quick Stats */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    {t('dashboard.quickStats')}
                </Text>
                <View style={styles.statsGrid}>
                    {quickStats.map((stat) => (
                        <Card key={stat.label} style={styles.statCard}>
                            <Text style={styles.statIcon}>{stat.icon}</Text>
                            <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
                        </Card>
                    ))}
                </View>
            </View>

            {/* Recent Activity */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    {t('dashboard.recentActivity')}
                </Text>
                <Card>
                    <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
                        {t('dashboard.noActivity')}
                    </Text>
                </Card>
            </View>

            {/* Alerts */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    {t('dashboard.alerts')}
                </Text>
                <Card>
                    <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
                        {t('dashboard.noAlerts')}
                    </Text>
                </Card>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    welcomeSection: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
    welcomeText: { fontSize: 14 },
    userName: { fontSize: 24, fontWeight: '700', marginTop: 2 },
    section: { paddingHorizontal: 20, marginTop: 20 },
    sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
    statsGrid: { flexDirection: 'row', gap: 12 },
    statCard: { flex: 1, alignItems: 'center', padding: 16 },
    statIcon: { fontSize: 28, marginBottom: 8 },
    statValue: { fontSize: 24, fontWeight: '700' },
    statLabel: { fontSize: 12, marginTop: 4, textAlign: 'center' },
    emptyText: { fontSize: 14, textAlign: 'center', paddingVertical: 20 },
});