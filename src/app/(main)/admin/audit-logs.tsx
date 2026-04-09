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

export default function AuditLogsScreen(): React.ReactElement {
    const { t } = useTranslation();
    const { colors } = useTheme();

    const logs = [
        { id: '1', action: 'User Login', user: 'john@example.com', time: '2024-01-15 10:30 AM', type: 'info' },
        { id: '2', action: 'Profile Updated', user: 'jane@example.com', time: '2024-01-15 10:15 AM', type: 'info' },
        { id: '3', action: 'User Suspended', user: 'admin@example.com', time: '2024-01-15 09:45 AM', type: 'warning' },
    ];

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.pageTitle, { color: colors.text }]}>{t('admin.auditLogs')}</Text>
            {logs.map((log) => (
                <Card key={log.id} style={styles.logCard}>
                    <View style={styles.logHeader}>
                        <Text style={styles.logIcon}>{log.type === 'warning' ? '⚠️' : 'ℹ️'}</Text>
                        <Text style={[styles.logAction, { color: colors.text }]}>{log.action}</Text>
                    </View>
                    <Text style={[styles.logUser, { color: colors.textSecondary }]}>{log.user}</Text>
                    <Text style={[styles.logTime, { color: colors.textTertiary }]}>{log.time}</Text>
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