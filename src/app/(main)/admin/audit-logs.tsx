/**
 * Audit Logs Screen
 *
 * Admin audit logs viewer.
 *
 * @module app/(main)/admin/audit-logs
 */
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useTheme } from '@/theme/hooks/useTheme';
import { Card } from '@/components/ui/Card';
import { adminService } from '@/lib/services/adminService';
import { ActivityIndicator, RefreshControl } from 'react-native';

export default function AuditLogsScreen(): React.ReactElement {
    const { t } = useTranslation();
    const { colors } = useTheme();

    const [logs, setLogs] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);

    const fetchLogs = React.useCallback(async () => {
        try {
            const data = await adminService.getAuditLogs();
            setLogs(data);
        } catch (error) {
            console.error('Failed to load audit logs:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    React.useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const getLogIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'warning': return '⚠️';
            case 'error': return '❌';
            case 'success': return '✅';
            default: return 'ℹ️';
        }
    };

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
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchLogs(); }} tintColor={colors.primary[500]} />}
        >
            <Text style={[styles.pageTitle, { color: colors.text }]}>{t('admin.auditLogs')}</Text>
            {logs.map((log) => (
                <Card key={log.id} style={styles.logCard}>
                    <View style={styles.logHeader}>
                        <Text style={styles.logIcon}>{getLogIcon(log.type || 'info')}</Text>
                        <Text style={[styles.logAction, { color: colors.text }]}>{log.action}</Text>
                    </View>
                    <Text style={[styles.logUser, { color: colors.textSecondary }]}>{log.user || 'System'}</Text>
                    <Text style={[styles.logTime, { color: colors.textTertiary }]}>{new Date(log.created_at).toLocaleString()}</Text>
                </Card>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    pageTitle: { fontSize: 24, fontWeight: '700', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
    logCard: { marginHorizontal: 20, marginVertical: 4 },
    logHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    logIcon: { fontSize: 16, marginRight: 8 },
    logAction: { fontSize: 15, fontWeight: '600' },
    logUser: { fontSize: 13, marginLeft: 24 },
    logTime: { fontSize: 12, marginLeft: 24, marginTop: 2 },
});