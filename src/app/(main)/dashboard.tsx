/**
 * User Dashboard Screen (Personal Hub)
 * 
 * High-performance personal dashboard providing metrics, quick actions,
 * and real-time activity tracking for the authenticated user.
 * 
 * @module app/(main)/dashboard
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useAuth } from '@/auth/hooks/useAuth';
import { useTheme } from '@/theme/hooks/useTheme';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui';
import { userService } from '@/lib/services/userService';
import { LinearGradient } from 'expo-linear-gradient';

export default function DashboardScreen(): React.ReactElement {
    const { user, isAdmin, isSuperAdmin } = useAuth();
    const { colors, isDark } = useTheme();
    const { t } = useTranslation();
    const router = useRouter();

    const [loading, setLoading] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);
    const [metrics, setMetrics] = React.useState<any>(null);

    const fetchData = React.useCallback(async () => {
        if (!user?.id) return;
        try {
            const data = await userService.getUserMetrics(user.id);
            setMetrics(data);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user?.id]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading && !refreshing) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
            </View>
        );
    }

    return (
        <ScrollView 
            style={[styles.container, { backgroundColor: colors.background }]}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={colors.primary[500]} />}
        >
            {/* Premium Header */}
            <LinearGradient
                colors={isDark ? [colors.primary[900], colors.surface[50]] : [colors.primary[600], colors.primary[400]]}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.welcomeText}>{t('dashboard.welcome')},</Text>
                        <Text style={styles.userName}>{user?.profiles?.[0]?.display_name || user?.email?.split('@')[0]}</Text>
                    </View>
                    <TouchableOpacity style={styles.avatarCircle} onPress={() => router.push('/(main)/profile')}>
                        <Ionicons name="person-circle" size={50} color="#fff" />
                        <View style={[styles.statusDot, { backgroundColor: colors.success[500] }]} />
                    </TouchableOpacity>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statCapsule}>
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text style={styles.statValue}>{metrics?.points || 0}</Text>
                        <Text style={styles.statLabel}>{t('common.points')}</Text>
                    </View>
                    <View style={styles.statCapsule}>
                        <Ionicons name="shield-checkmark" size={16} color="#fff" />
                        <Text style={styles.statValue}>{metrics?.status || 'Active'}</Text>
                    </View>
                </View>
            </LinearGradient>

            <View style={styles.content}>
                {/* Admin Quick Entry - Only for privileged users */}
                {(isAdmin || isSuperAdmin) && (
                    <TouchableOpacity 
                        style={[styles.adminBanner, { backgroundColor: colors.error[50] }]}
                        onPress={() => router.push('/(main)/admin')}
                    >
                        <Ionicons name="shield-half" size={24} color={colors.error[600]} />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={[styles.adminBannerTitle, { color: colors.error[800] }]}>Command Center Accessible</Text>
                            <Text style={[styles.adminBannerSub, { color: colors.error[600] }]}>Manage system users and services</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.error[400]} />
                    </TouchableOpacity>
                )}

                {/* Main Action Grid */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
                <View style={styles.actionGrid}>
                    <ActionCard 
                        title="Profile" 
                        icon="person" 
                        color={colors.primary[500]} 
                        onPress={() => router.push('/(main)/profile')}
                        colorBg={colors.primary[50]}
                    />
                    <ActionCard 
                        title="Addresses" 
                        icon="location" 
                        color={colors.success[500]} 
                        onPress={() => router.push('/(main)/profile/addresses')}
                        colorBg={colors.success[50]}
                    />
                    <ActionCard 
                        title="Payments" 
                        icon="card" 
                        color={colors.info[500]} 
                        onPress={() => router.push('/(main)/profile/payments')}
                        colorBg={colors.info[50]}
                    />
                    <ActionCard 
                        title="Settings" 
                        icon="settings" 
                        color={colors.textTertiary} 
                        onPress={() => router.push('/(main)/settings')}
                        colorBg={colors.surface[100]}
                    />
                </View>

                {/* Latest Activity Feed */}
                <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 30 }]}>Recent Activity</Text>
                <Card style={styles.activityCard}>
                    <ActivityItem 
                        icon="at-circle" 
                        title="Profile Updated" 
                        time="2 mins ago" 
                        color={colors.info[500]} 
                    />
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    <ActivityItem 
                        icon="lock-open" 
                        title="Logged in from new device" 
                        time="1 hour ago" 
                        color={colors.warning[500]} 
                    />
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    <ActivityItem 
                        icon="mail-unread" 
                        title="Welcome email received" 
                        time="Yesterday" 
                        color={colors.success[500]} 
                    />
                </Card>
            </View>
        </ScrollView>
    );
}

function ActionCard({ title, icon, color, colorBg, onPress }: any) {
    const { colors } = useTheme();
    return (
        <TouchableOpacity style={[styles.actionCard, { backgroundColor: colorBg }]} onPress={onPress}>
            <Ionicons name={icon} size={28} color={color} />
            <Text style={[styles.actionTitle, { color: colors.text }]}>{title}</Text>
        </TouchableOpacity>
    );
}

function ActivityItem({ icon, title, time, color }: any) {
    const { colors } = useTheme();
    return (
        <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: colors.background, borderColor: color }]}>
                <Ionicons name={icon} size={18} color={color} />
            </View>
            <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={[styles.activityTitle, { color: colors.text }]}>{title}</Text>
                <Text style={[styles.activityTime, { color: colors.textTertiary }]}>{time}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { padding: 25, paddingTop: 60, paddingBottom: 40, borderBottomLeftRadius: 35, borderBottomRightRadius: 35 },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    welcomeText: { color: 'rgba(255,255,255,0.8)', fontSize: 16, fontWeight: '500' },
    userName: { color: '#fff', fontSize: 26, fontWeight: '800', marginTop: 4 },
    avatarCircle: { position: 'relative' },
    statusDot: { position: 'absolute', bottom: 5, right: 2, width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: '#fff' },
    statsContainer: { flexDirection: 'row', gap: 15, marginTop: 30 },
    statCapsule: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, gap: 8 },
    statValue: { color: '#fff', fontWeight: '800', fontSize: 16 },
    statLabel: { color: '#fff', fontSize: 12, fontWeight: '500' },
    content: { padding: 20, marginTop: 10 },
    adminBanner: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 20, marginBottom: 25 },
    adminBannerTitle: { fontSize: 15, fontWeight: '700' },
    adminBannerSub: { fontSize: 12, marginTop: 2 },
    sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 20 },
    actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    actionCard: { width: '48%', padding: 20, borderRadius: 25, alignItems: 'center', gap: 12 },
    actionTitle: { fontSize: 14, fontWeight: '700' },
    activityCard: { padding: 10 },
    activityItem: { flexDirection: 'row', alignItems: 'center', padding: 12 },
    activityIcon: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
    activityTitle: { fontSize: 14, fontWeight: '600' },
    activityTime: { fontSize: 11, marginTop: 2 },
    divider: { height: 1, marginLeft: 50, marginVertical: 4 }
});
