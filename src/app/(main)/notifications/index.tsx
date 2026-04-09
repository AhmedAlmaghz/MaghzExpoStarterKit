/**
 * Notifications Screen
 *
 * Notification center with list of notifications.
 *
 * @module app/(main)/notifications/index
 */
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useTheme } from '@/theme/hooks/useTheme';
import { useNotifications } from '@/notifications/hooks/useNotifications';
import { useAuth } from '@/auth/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';

export default function NotificationsScreen(): React.ReactElement {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { user } = useAuth();
    const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications(user?.id);

    if (isLoading) {
        return <Loading message={t('common.loading')} />;
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            {unreadCount > 0 && (
                <View style={styles.header}>
                    <Text style={[styles.unreadCount, { color: colors.primary[500] }]}>
                        {unreadCount} {t('notifications.unread')}
                    </Text>
                    <TouchableOpacity onPress={() => user && markAllAsRead(user.id)}>
                        <Text style={[styles.markAllText, { color: colors.primary[500] }]}>
                            {t('notifications.markAllRead')}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {notifications.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>🔔</Text>
                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                        {t('notifications.noNotifications')}
                    </Text>
                </View>
            ) : (
                notifications.map((notification) => (
                    <Card key={notification.id} style={styles.notificationCard}>
                        <TouchableOpacity
                            onPress={() => !notification.read && markAsRead(notification.id)}
                            style={styles.notificationContent}
                        >
                            <View style={styles.notificationHeader}>
                                <Text style={styles.notificationIcon}>
                                    {notification.type === 'info' ? 'ℹ️' : notification.type === 'warning' ? '⚠️' : notification.type === 'error' ? '❌' : '✅'}
                                </Text>
                                <View style={styles.notificationInfo}>
                                    <Text style={[styles.notificationTitle, { color: colors.text }]}>
                                        {notification.title}
                                    </Text>
                                    <Text style={[styles.notificationMessage, { color: colors.textSecondary }]}>
                                        {notification.message}
                                    </Text>
                                </View>
                                {!notification.read && <View style={[styles.unreadDot, { backgroundColor: colors.primary[500] }]} />}
                            </View>
                            <Text style={[styles.notificationTime, { color: colors.textTertiary }]}>
                                {new Date(notification.createdAt).toLocaleDateString()}
                            </Text>
                        </TouchableOpacity>
                    </Card>
                ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16 },
    unreadCount: { fontSize: 14, fontWeight: '600' },
    markAllText: { fontSize: 14, fontWeight: '500' },
    emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
    emptyIcon: { fontSize: 48, marginBottom: 16 },
    emptyText: { fontSize: 16 },
    notificationCard: { marginHorizontal: 20, marginVertical: 4 },
    notificationContent: { padding: 4 },
    notificationHeader: { flexDirection: 'row', alignItems: 'flex-start' },
    notificationIcon: { fontSize: 20, marginRight: 10 },
    notificationInfo: { flex: 1 },
    notificationTitle: { fontSize: 15, fontWeight: '600' },
    notificationMessage: { fontSize: 13, marginTop: 2 },
    unreadDot: { width: 8, height: 8, borderRadius: 4, marginLeft: 8, marginTop: 4 },
    notificationTime: { fontSize: 12, marginTop: 4, marginLeft: 30 },
});