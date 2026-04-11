/**
 * Roles & permissions Screen (Pro Console)
 * 
 * Administrative control over system hierarchy and access levels.
 * Features a dark 'Command Center' aesthetic and professional role management.
 * 
 * @module app/(main)/admin/roles
 */
import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useTheme } from '@/theme/hooks/useTheme';
import { Card, Modal, Button, Input } from '@/components/ui';
import { rbacService } from '@/lib/services/rbacService';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function RolesManagementScreen(): React.ReactElement {
    const { t } = useTranslation();
    const { colors } = useTheme();

    const [roles, setRoles] = React.useState<any[]>([]);
    const [permissions, setPermissions] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);

    const [isCreateModalVisible, setIsCreateModalVisible] = React.useState(false);
    const [newRoleName, setNewRoleName] = React.useState('');
    const [newRoleDisplay, setNewRoleDisplay] = React.useState('');
    const [isSaving, setIsSaving] = React.useState(false);

    const fetchData = React.useCallback(async () => {
        try {
            const [rolesData, permsData] = await Promise.all([
                rbacService.getAllRoles(),
                rbacService.getAllPermissions()
            ]);
            setRoles(rolesData);
            setPermissions(permsData);
        } catch (error) {
            console.error('Failed to load RBAC data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleCreate = async () => {
        if (!newRoleName || !newRoleDisplay) return;
        setIsSaving(true);
        try {
            await rbacService.createRole(newRoleName, newRoleDisplay);
            setIsCreateModalVisible(false);
            fetchData();
        } catch (error) {
            Alert.alert('Error', 'Failed to create role.');
        } finally {
            setIsSaving(false);
        }
    };

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
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor="#38bdf8" />}
            >
                <View style={styles.header}>
                    <View style={styles.headerRow}>
                        <View>
                            <Text style={styles.pageTitle}>Authority Center</Text>
                            <Text style={styles.pageSubtitle}>System roles & permission matrix</Text>
                        </View>
                        <TouchableOpacity style={styles.plusBtn} onPress={() => setIsCreateModalVisible(true)}>
                            <Ionicons name="add" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                {roles.map((role) => (
                    <Card key={role.id} style={styles.roleCard}>
                        <LinearGradient colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']} style={styles.roleInner}>
                            <View style={styles.roleHeader}>
                                <View style={[styles.iconBox, { backgroundColor: '#a855f720' }]}>
                                    <Ionicons name="shield-checkmark" size={18} color="#a855f7" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.roleTitle}>{role.display_name}</Text>
                                    <Text style={styles.roleTag}>SLUG: {role.name.toUpperCase()}</Text>
                                </View>
                                <TouchableOpacity onPress={() => Alert.alert('Confirm Delete', 'Remove this role?', [{ text: 'Cancel' }, { text: 'Delete', onPress: () => rbacService.deleteRole(role.id).then(fetchData) }])}>
                                    <Ionicons name="trash-outline" size={18} color="#f43f5e" />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.roleDesc}>{role.description || 'Global system authority role.'}</Text>
                            <View style={styles.statusRow}>
                                <View style={[styles.activeDot, { backgroundColor: '#22c55e' }]} />
                                <Text style={styles.statusText}>Active Policy</Text>
                            </View>
                        </LinearGradient>
                    </Card>
                ))}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Global Permissions Matrix ({permissions.length})</Text>
                    <View style={styles.permGrid}>
                        {permissions.map((perm) => (
                            <View key={perm.id} style={styles.permBadge}>
                                <Text style={styles.permText}>{perm.display_name}</Text>
                            </View>
                        ))}
                    </View>
                </View>
                <View style={{ height: 50 }} />
            </ScrollView>

            <Modal visible={isCreateModalVisible} onClose={() => setIsCreateModalVisible(false)} title="New Authority Role">
                <View style={[styles.modalContent, { backgroundColor: '#1e293b' }]}>
                    <Input label="Internal Slug" placeholder="moderator" value={newRoleName} onChangeText={setNewRoleName} autoCapitalize="none" dark />
                    <Input label="Display Name" placeholder="Content Moderator" value={newRoleDisplay} onChangeText={setNewRoleDisplay} dark />
                    <Button title="Register Role" onPress={handleCreate} loading={isSaving} fullWidth style={{ marginTop: 20 }} />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollView: { flex: 1 },
    header: { padding: 25, paddingTop: 40, marginBottom: 10 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    pageTitle: { color: '#fff', fontSize: 28, fontWeight: '800' },
    pageSubtitle: { color: '#94a3b8', fontSize: 13, marginTop: 4 },
    plusBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#38bdf8', justifyContent: 'center', alignItems: 'center' },
    roleCard: { marginHorizontal: 20, marginVertical: 8, padding: 0, borderRadius: 25, overflow: 'hidden' },
    roleInner: { padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    roleHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    roleTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
    roleTag: { color: '#64748b', fontSize: 10, fontWeight: '800', marginTop: 2 },
    roleDesc: { color: '#94a3b8', fontSize: 13, lineHeight: 18, marginBottom: 18 },
    statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    activeDot: { width: 6, height: 6, borderRadius: 3 },
    statusText: { color: '#22c55e', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
    section: { marginTop: 30, paddingHorizontal: 25 },
    sectionTitle: { color: '#f8fafc', fontSize: 16, fontWeight: '700', marginBottom: 15 },
    permGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    permBadge: { backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    permText: { color: '#cbd5e1', fontSize: 11, fontWeight: '600' },
    modalContent: { padding: 20, borderRadius: 30 }
});
