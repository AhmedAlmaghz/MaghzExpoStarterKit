/**
 * User Management Screen
 *
 * Admin screen for managing users.
 *
 * @module app/(main)/admin/users
 */
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useTheme } from '@/theme/hooks/useTheme';
import { Card } from '@/components/ui/Card';
import { adminService } from '@/lib/services/adminService';
import { ActivityIndicator, RefreshControl } from 'react-native';

export default function UserManagementScreen(): React.ReactElement {
    const { t } = useTranslation();
    const { colors } = useTheme();

    const [users, setUsers] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);

    const fetchUsers = React.useCallback(async () => {
        try {
            const data = await adminService.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    React.useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

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
                <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchUsers(); }} tintColor={colors.primary[500]} />
            }
        >
            <Text style={[styles.pageTitle, { color: colors.text }]}>{t('admin.userManagement')}</Text>

            {users.map((user) => (
                <Card key={user.id} style={styles.userCard}>
                    <View style={styles.userHeader}>
                        <View style={[styles.userAvatar, { backgroundColor: colors.primary[500] }]}>
                            <Text style={styles.avatarText}>
                                {(user.profiles?.[0]?.display_name || user.email || 'U').charAt(0).toUpperCase()}
                            </Text>
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={[styles.userName, { color: colors.text }]}>
                                {user.profiles?.[0]?.display_name || 'Anonymous User'}
                            </Text>
                            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user.email}</Text>
                        </View>
                    </View>
                    <View style={styles.userMeta}>
                        <View style={[styles.badge, { backgroundColor: colors.primary[100] }]}>
                            <Text style={[styles.badgeText, { color: colors.primary[700] }]}>{user.role}</Text>
                        </View>
                        <View style={[styles.badge, { backgroundColor: user.status === 'active' ? colors.success[100] : colors.error[100] }]}>
                            <Text style={[styles.badgeText, { color: user.status === 'active' ? colors.success[700] : colors.error[700] }]}>{user.status}</Text>
                        </View>
                    </View>
                </Card>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    pageTitle: { fontSize: 24, fontWeight: '700', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
    userCard: { marginHorizontal: 20, marginVertical: 6 },
    userHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    userAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    avatarText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    userInfo: { flex: 1 },
    userName: { fontSize: 16, fontWeight: '600' },
    userEmail: { fontSize: 13, marginTop: 2 },
    userMeta: { flexDirection: 'row', gap: 8 },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    badgeText: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
});