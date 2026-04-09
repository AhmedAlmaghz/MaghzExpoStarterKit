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

export default function UserManagementScreen(): React.ReactElement {
    const { t } = useTranslation();
    const { colors } = useTheme();

    // Placeholder data
    const users = [
        { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'admin', status: 'active' },
        { id: '3', name: 'Bob Wilson', email: 'bob@example.com', role: 'user', status: 'suspended' },
    ];

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.pageTitle, { color: colors.text }]}>{t('admin.userManagement')}</Text>

            {users.map((user) => (
                <Card key={user.id} style={styles.userCard}>
                    <View style={styles.userHeader}>
                        <View style={[styles.userAvatar, { backgroundColor: colors.primary[500] }]}>
                            <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
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