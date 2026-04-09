/**
 * Profile Screen
 *
 * Displays user profile information with edit option.
 *
 * @module app/(main)/profile/index
 */
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/auth/hooks/useAuth';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useTheme } from '@/theme/hooks/useTheme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ProfileScreen(): React.ReactElement {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { user, logout } = useAuth();
    const router = useRouter();

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Avatar & Name */}
            <View style={styles.header}>
                <View style={[styles.avatar, { backgroundColor: colors.primary[500] }]}>
                    <Text style={styles.avatarText}>
                        {user?.displayName?.charAt(0)?.toUpperCase() || '?'}
                    </Text>
                </View>
                <Text style={[styles.displayName, { color: colors.text }]}>
                    {user?.displayName || 'User'}
                </Text>
                <Text style={[styles.email, { color: colors.textSecondary }]}>
                    {user?.email || ''}
                </Text>
                <View style={[styles.badge, { backgroundColor: colors.primary[100] }]}>
                    <Text style={[styles.badgeText, { color: colors.primary[700] }]}>
                        {user?.role?.toUpperCase() || 'USER'}
                    </Text>
                </View>
            </View>

            {/* Info Cards */}
            <Card title={t('profile.verification')}>
                <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{t('auth.email')}</Text>
                    <View style={styles.verificationStatus}>
                        <Text style={{ color: user?.emailVerified ? colors.success[500] : colors.warning[500] }}>
                            {user?.emailVerified ? '✅' : '⏳'}
                        </Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>
                            {user?.emailVerified ? t('profile.verified') : t('profile.notVerified')}
                        </Text>
                    </View>
                </View>
                <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{t('auth.phone')}</Text>
                    <View style={styles.verificationStatus}>
                        <Text style={{ color: user?.phoneVerified ? colors.success[500] : colors.warning[500] }}>
                            {user?.phoneVerified ? '✅' : '⏳'}
                        </Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>
                            {user?.phoneVerified ? t('profile.verified') : t('profile.notVerified')}
                        </Text>
                    </View>
                </View>
            </Card>

            <View style={styles.actions}>
                <Button
                    title={t('profile.editProfile')}
                    onPress={() => router.push('/(main)/profile/edit')}
                    fullWidth
                    variant="outline"
                />
                <View style={styles.spacer} />
                <Button
                    title={t('auth.logout')}
                    onPress={logout}
                    fullWidth
                    variant="danger"
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { alignItems: 'center', paddingTop: 32, paddingBottom: 24, paddingHorizontal: 20 },
    avatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
    avatarText: { color: '#fff', fontSize: 32, fontWeight: '600' },
    displayName: { fontSize: 24, fontWeight: '700', marginTop: 12 },
    email: { fontSize: 14, marginTop: 4 },
    badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 8 },
    badgeText: { fontSize: 12, fontWeight: '600' },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
    infoLabel: { fontSize: 14 },
    infoValue: { fontSize: 14, fontWeight: '500' },
    verificationStatus: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    actions: { paddingHorizontal: 20, marginTop: 24, paddingBottom: 32 },
    spacer: { height: 12 },
});