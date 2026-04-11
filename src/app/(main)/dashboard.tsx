import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '@/auth/hooks/useAuth';
import { useTheme } from '@/theme/hooks/useTheme';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/layout/Header';

export default function DashboardScreen(): React.ReactElement {
    const { user, isAdmin, isSuperAdmin } = useAuth();
    const { colors } = useTheme();
    const { t } = useTranslation();

    const roleLabel = isSuperAdmin ? 'Super Admin' : (isAdmin ? 'Admin' : 'User');

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <Header title={t('dashboard.title')} />
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <Text style={[styles.welcome, { color: colors.textSecondary }]}>{t('dashboard.welcome')}</Text>
                    <Text style={[styles.roleLabel, { color: colors.primary[500] }]}>{roleLabel}</Text>
                </View>

                <View style={styles.content}>
                    {/* Stats for Everyone */}
                    <View style={styles.statsRow}>
                        <Card style={styles.statCard}>
                            <Ionicons name="stats-chart" size={24} color={colors.primary[500]} />
                            <Text style={[styles.statValue, { color: colors.text }]}>128</Text>
                            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Points</Text>
                        </Card>
                        <Card style={styles.statCard}>
                            <Ionicons name="time" size={24} color={colors.warning[500]} />
                            <Text style={[styles.statValue, { color: colors.text }]}>12</Text>
                            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Hours</Text>
                        </Card>
                    </View>

                    {/* Role-Specific Section */}
                    {isAdmin || isSuperAdmin ? (
                        <View style={styles.adminSection}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Administrative Control</Text>
                            <Card style={styles.adminCard}>
                                <View style={styles.adminRow}>
                                    <Ionicons name="people" size={20} color={colors.text} />
                                    <Text style={[styles.adminLabel, { color: colors.text }]}>User Management</Text>
                                    <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
                                </View>
                                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                                <View style={styles.adminRow}>
                                    <Ionicons name="settings" size={20} color={colors.text} />
                                    <Text style={[styles.adminLabel, { color: colors.text }]}>System Config</Text>
                                    <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
                                </View>
                                {isSuperAdmin && (
                                    <>
                                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                                        <View style={styles.adminRow}>
                                            <Ionicons name="shield-checkmark" size={20} color={colors.error[500]} />
                                            <Text style={[styles.adminLabel, { color: colors.error[500] }]}>Security Audit</Text>
                                            <Ionicons name="chevron-forward" size={16} color={colors.error[500]} />
                                        </View>
                                    </>
                                )}
                            </Card>
                        </View>
                    ) : (
                        <View style={styles.userSection}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
                            <Card>
                                <Text style={{ color: colors.textSecondary, textAlign: 'center', padding: 20 }}>
                                    No recent activity yet. Explore the marketplace!
                                </Text>
                            </Card>
                        </View>
                    )}

                    {/* Common Actions */}
                    <View style={styles.actionsGrid}>
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.surface[100] }]}>
                            <Ionicons name="help-circle" size={24} color={colors.text} />
                            <Text style={[styles.actionText, { color: colors.text }]}>Support</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.surface[100] }]}>
                            <Ionicons name="book" size={24} color={colors.text} />
                            <Text style={[styles.actionText, { color: colors.text }]}>Guide</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { padding: 20, paddingTop: 40 },
    welcome: { fontSize: 16, fontWeight: '500' },
    roleLabel: { fontSize: 32, fontWeight: '800', marginTop: 4 },
    content: { padding: 20 },
    statsRow: { flexDirection: 'row', gap: 15, marginBottom: 25 },
    statCard: { flex: 1, alignItems: 'center', paddingVertical: 20 },
    statValue: { fontSize: 22, fontWeight: '700', marginTop: 10 },
    statLabel: { fontSize: 12, fontWeight: '500' },
    sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15 },
    adminCard: { padding: 0, overflow: 'hidden' },
    adminRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
    adminLabel: { flex: 1, fontSize: 16, fontWeight: '500' },
    divider: { height: 1, width: '100%' },
    adminSection: { marginBottom: 25 },
    userSection: { marginBottom: 25 },
    actionsGrid: { flexDirection: 'row', gap: 15 },
    actionBtn: { flex: 1, padding: 16, borderRadius: 20, alignItems: 'center', gap: 8 },
    actionText: { fontSize: 14, fontWeight: '600' }
});
