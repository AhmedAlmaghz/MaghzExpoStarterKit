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

    const stats: StatCard[] = [
        { title: t('admin.totalUsers'), value: '1,234', icon: '👥', color: colors.primary[500] },
        { title: t('admin.activeUsers'), value: '987', icon: '✅', color: colors.success[500] },
        { title: t('admin.newUsers'), value: '56', icon: '🆕', color: colors.info[500] },
        { title: t('admin.suspendedUsers'), value: '3', icon: '🚫', color: colors.error[500] },
    ];

    const quickActions = [
        { title: t('admin.userManagement'), icon: '👥', route: '/(main)/admin/users' },
        { title: t('admin.analytics'), icon: '📈', route: '/(main)/admin/analytics' },
        { title: t('admin.contentManagement'), icon: '📝', route: '/(main)/admin/content' },
        { title: t('admin.auditLogs'), icon: '📋', route: '/(main)/admin/audit-logs' },
    ];

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
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