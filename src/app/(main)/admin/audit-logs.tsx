/**
 * Admin Audit Logs Screen (Pro Console)
 * 
 * High-traceability system logs with a dark 'Command Center' aesthetic.
 * Features real-time status tracking and professional event categorization.
 * 
 * @module app/(main)/admin/audit-logs
 */
import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useTheme } from '@/theme/hooks/useTheme';
import { adminService } from '@/lib/services/adminService';
import { Card } from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function AdminAuditLogsScreen(): React.ReactElement {
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

    if (loading && !refreshing) {
        return (
            <View style={[styles.loading, { backgroundColor: '#0f172a' }]}>
                <ActivityIndicator size="large" color="#38bdf8" />
            </View>
        );
    }

    const getLogIcon = (action: string) => {
        if (action.includes('login')) return 'log-in';
        if (action.includes('update')) return 'create';
        if (action.includes('delete')) return 'trash';
        return 'flash';
    };

    const getLogColor = (action: string) => {
        if (action.includes('delete')) return '#f43f5e';
        if (action.includes('create')) return '#22c55e';
        if (action.includes('update')) return '#38bdf8';
        return '#94a3b8';
    };

    return (
        <View style={[styles.container, { backgroundColor: '#0f172a' }]}>
            <ScrollView 
                style={styles.scrollView}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchLogs(); }} tintColor="#38bdf8" />}
            >
                <View style={styles.header}>
                    <Text style={styles.pageTitle}>{t('admin.auditLogs')}</Text>
                    <Text style={styles.pageSubtitle}>Real-time system traceability</Text>
                </View>

                {logs.length === 0 ? (
                    <Text style={styles.emptyText}>No logs found in the command buffer.</Text>
                ) : (
                    logs.map((log) => (
                        <Card key={log.id} style={styles.logCard}>
                            <LinearGradient colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']} style={styles.logInner}>
                                <View style={styles.logHeader}>
                                    <View style={[styles.iconBox, { backgroundColor: `${getLogColor(log.action)}20` }]}>
                                        <Ionicons name={getLogIcon(log.action)} size={16} color={getLogColor(log.action)} />
                                    </View>
                                    <View style={styles.logInfo}>
                                        <Text style={styles.logAction}>{log.action.replace(/_/g, ' ')}</Text>
                                        <Text style={styles.logEntity}>{log.entity_type} ID: {log.entity_id?.slice(0, 8)}...</Text>
                                    </View>
                                    <Text style={styles.logTime}>{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                                </View>
                                <View style={styles.logFooter}>
                                    <View style={styles.userTag}>
                                        <Ionicons name="person" size={12} color="#64748b" />
                                        <Text style={styles.userText}>{log.users?.email || 'System'}</Text>
                                    </View>
                                    <Text style={styles.logDate}>{new Date(log.created_at).toLocaleDateString()}</Text>
                                </View>
                            </LinearGradient>
                        </Card>
                    ))
                )}
                <View style={{ height: 50 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollView: { flex: 1 },
    header: { padding: 25, paddingTop: 40, marginBottom: 10 },
    pageTitle: { color: '#fff', fontSize: 28, fontWeight: '800' },
    pageSubtitle: { color: '#94a3b8', fontSize: 13, marginTop: 4 },
    logCard: { marginHorizontal: 20, marginVertical: 6, padding: 0, borderRadius: 20, overflow: 'hidden' },
    logInner: { padding: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    logHeader: { flexDirection: 'row', alignItems: 'center' },
    iconBox: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    logInfo: { flex: 1 },
    logAction: { color: '#fff', fontSize: 13, fontWeight: '700', textTransform: 'capitalize' },
    logEntity: { color: '#64748b', fontSize: 11, marginTop: 2 },
    logTime: { color: '#38bdf8', fontSize: 11, fontWeight: '700' },
    logFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
    userTag: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    userText: { color: '#cbd5e1', fontSize: 11, fontWeight: '500' },
    logDate: { color: '#475569', fontSize: 10, fontWeight: '600' },
    emptyText: { color: '#64748b', textAlign: 'center', marginTop: 100 }
});