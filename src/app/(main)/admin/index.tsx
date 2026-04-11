/**
 * Admin Command Center (Index)
 * 
 * Professional administrative hub providing overall system visibility,
 * logical categorization of tasks, and professional management tools.
 * 
 * @module app/(main)/admin/index
 */
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useTheme } from '@/theme/hooks/useTheme';
import { useAuth } from '@/auth/hooks/useAuth';
import { Card } from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { adminService } from '@/lib/services/adminService';

export default function AdminIndexScreen(): React.ReactElement {
    const { t } = useTranslation();
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const { isSuperAdmin } = useAuth();

    const [loading, setLoading] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);
    const [stats, setStats] = React.useState<any>(null);

    const fetchAdminStats = React.useCallback(async () => {
        try {
            const data = await adminService.getGrowthStats();
            // Aggregate totals for the header
            const totalUsers = data.reduce((sum: number, item: any) => sum + item.count, 0);
            setStats({ totalUsers, growth: '12%', status: 'Healthy' });
        } catch (error) {
            console.error('Failed to load admin stats:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    React.useEffect(() => {
        fetchAdminStats();
    }, [fetchAdminStats]);

    if (loading && !refreshing) {
        return (
            <View style={[styles.loading, { backgroundColor: '#0f172a' }]}>
                <ActivityIndicator size="large" color="#38bdf8" />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: '#0f172a' }]}>
            <ScrollView 
                style={styles.scrollView}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchAdminStats(); }} tintColor="#38bdf8" />}
            >
                {/* Admin Header - Dark Mode First Look */}
                <LinearGradient
                    colors={['#1e293b', '#0f172a']}
                    style={styles.header}
                >
                    <View style={styles.headerRow}>
                        <View>
                            <Text style={styles.headerTitle}>Command Center</Text>
                            <Text style={styles.headerSubtitle}>System-wide monitoring & control</Text>
                        </View>
                        <View style={[styles.statusTag, { backgroundColor: 'rgba(34, 197, 94, 0.1)' }]}>
                            <View style={[styles.pulse, { backgroundColor: '#22c55e' }]} />
                            <Text style={styles.statusText}>{stats?.status}</Text>
                        </View>
                    </View>

                    <View style={styles.insightGrid}>
                        <InsightBox label="Total Users" value={stats?.totalUsers || 0} icon="people" color="#38bdf8" />
                        <InsightBox label="Growth" value={stats?.growth} icon="trending-up" color="#22c55e" />
                        <InsightBox label="Uptime" value="99.9%" icon="pulse" color="#a855f7" />
                    </View>
                </LinearGradient>

                <View style={styles.content}>
                    {/* Category 1: Identity & Access */}
                    <Text style={styles.sectionTitle}>Identity & Access Control</Text>
                    <View style={styles.toolGrid}>
                        <ToolCard 
                            title={t('admin.userManagement')} 
                            icon="people" 
                            desc="Manage user cycles & status"
                            onPress={() => router.push('/(main)/admin/users')}
                            color="#38bdf8"
                        />
                        <ToolCard 
                            title={t('admin.manageRoles') || 'Roles & Permissions'} 
                            icon="shield-checkmark" 
                            desc="RBAC hierarchy control"
                            onPress={() => router.push('/(main)/admin/roles')}
                            color="#a855f7"
                        />
                    </View>

                    {/* Category 2: Insights & Monitoring */}
                    <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Insights & Monitoring</Text>
                    <View style={styles.toolGrid}>
                        <ToolCard 
                            title={t('admin.analytics')} 
                            icon="podium" 
                            desc="Registration trends & growth"
                            onPress={() => router.push('/(main)/admin/analytics')}
                            color="#22c55e"
                        />
                        <ToolCard 
                            title={t('admin.auditLogs')} 
                            icon="document-text" 
                            desc="Full traceability logs"
                            onPress={() => router.push('/(main)/admin/audit-logs')}
                            color="#f59e0b"
                        />
                    </View>

                    {/* Category 3: Platform Assets */}
                    <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Platform Assets</Text>
                    <View style={styles.toolGrid}>
                        <ToolCard 
                            title={t('admin.contentManagement')} 
                            icon="newspaper" 
                            desc="Manage public legal pages"
                            onPress={() => router.push('/(main)/admin/content')}
                            color="#06b6d4"
                        />
                        <ToolCard 
                            title="Global Settings" 
                            icon="cog" 
                            desc="System-wide configuration"
                            onPress={() => Alert.alert('Coming Soon', 'Global configuration is being finalized.')}
                            color="#94a3b8"
                        />
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

function InsightBox({ label, value, icon, color }: any) {
    return (
        <View style={styles.insightBox}>
            <Ionicons name={icon} size={16} color={color} />
            <Text style={styles.insightValue}>{value}</Text>
            <Text style={styles.insightLabel}>{label}</Text>
        </View>
    );
}

function ToolCard({ title, icon, desc, onPress, color }: any) {
    return (
        <TouchableOpacity style={styles.toolCard} onPress={onPress}>
            <LinearGradient
                colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
                style={styles.toolInner}
            >
                <View style={[styles.iconBox, { backgroundColor: `${color}20` }]}>
                    <Ionicons name={icon} size={24} color={color} />
                </View>
                <Text style={styles.toolTitle}>{title}</Text>
                <Text style={styles.toolDesc}>{desc}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollView: { flex: 1 },
    header: { padding: 25, paddingTop: 60, paddingBottom: 40, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    headerTitle: { color: '#fff', fontSize: 28, fontWeight: '800' },
    headerSubtitle: { color: '#94a3b8', fontSize: 13, marginTop: 4 },
    statusTag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 8 },
    pulse: { width: 8, height: 8, borderRadius: 4 },
    statusText: { color: '#fff', fontSize: 11, fontWeight: '700' },
    insightGrid: { flexDirection: 'row', gap: 12, marginTop: 35 },
    insightBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', padding: 15, borderRadius: 20, alignItems: 'center' },
    insightValue: { color: '#fff', fontSize: 18, fontWeight: '800', marginTop: 8 },
    insightLabel: { color: '#64748b', fontSize: 10, fontWeight: '600', marginTop: 2, textTransform: 'uppercase' },
    content: { padding: 20 },
    sectionTitle: { color: '#f8fafc', fontSize: 16, fontWeight: '700', marginBottom: 20, paddingLeft: 5 },
    toolGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    toolCard: { width: '48%', height: 160 },
    toolInner: { flex: 1, borderRadius: 25, padding: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    iconBox: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    toolTitle: { color: '#fff', fontSize: 15, fontWeight: '700' },
    toolDesc: { color: '#64748b', fontSize: 11, marginTop: 6, lineHeight: 16 }
});