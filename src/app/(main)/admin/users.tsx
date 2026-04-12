/**
 * User Management Screen (Pro Console)
 * 
 * Professional administrative interface for managing system users
 * with a dark 'Command Center' aesthetic and high-contrast control panels.
 * 
 * @module app/(main)/admin/users
 */
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, Alert } from 'react-native';
import { Loading } from '@/components/ui/Loading';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useTheme } from '@/theme/hooks/useTheme';
import { Card, Modal, Button } from '@/components/ui';
import { adminService } from '@/lib/services/adminService';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function UserManagementScreen(): React.ReactElement {
    const { t } = useTranslation();
    const { colors } = useTheme();

    const [users, setUsers] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);
    
    // Management State
    const [selectedUser, setSelectedUser] = React.useState<any>(null);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [actionLoading, setActionLoading] = React.useState(false);

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

    const handleAction = async (action: 'status' | 'role' | 'delete', value?: string) => {
        if (!selectedUser) return;
        setActionLoading(true);
        try {
            if (action === 'status') {
                const newStatus = selectedUser.status === 'active' ? 'suspended' : 'active';
                await adminService.updateUser(selectedUser.id, { status: newStatus });
            } else if (action === 'role') {
                await adminService.updateUser(selectedUser.id, { role: value });
            } else if (action === 'delete') {
                await adminService.deleteUser(selectedUser.id);
                setIsModalVisible(false);
            }
            fetchUsers();
            if (action !== 'delete') {
                setIsModalVisible(false);
            }
        } catch (error) {
            Alert.alert('Error', 'Action failed.');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading && !refreshing) {
        return <Loading fullScreen />;
    }

    return (
        <View style={[styles.container, { backgroundColor: '#0f172a' }]}>
            <ScrollView 
                style={styles.scrollView}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchUsers(); }} tintColor="#38bdf8" />}
            >
                <View style={styles.header}>
                    <Text style={styles.pageTitle}>{t('admin.userManagement')}</Text>
                    <Text style={styles.pageSubtitle}>Total: {users.length} active records</Text>
                </View>

                {users.map((user) => (
                    <TouchableOpacity 
                        key={user.id} 
                        style={styles.userCard}
                        onPress={() => { setSelectedUser(user); setIsModalVisible(true); }}
                    >
                        <LinearGradient colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']} style={styles.cardInner}>
                            <View style={styles.userHeader}>
                                <View style={[styles.avatarBox, { backgroundColor: '#334155' }]}>
                                    <Text style={styles.avatarText}>{(user.profiles?.[0]?.display_name || user.email || 'U').charAt(0).toUpperCase()}</Text>
                                </View>
                                <View style={styles.userInfo}>
                                    <Text style={styles.userName}>{user.profiles?.[0]?.display_name || 'System User'}</Text>
                                    <Text style={styles.userEmail}>{user.email}</Text>
                                </View>
                                <View style={[styles.statusBadge, { backgroundColor: user.status === 'active' ? '#22c55e20' : '#f43f5e20' }]}>
                                    <Text style={[styles.statusText, { color: user.status === 'active' ? '#22c55e' : '#f43f5e' }]}>{user.status}</Text>
                                </View>
                            </View>
                            <View style={styles.cardFooter}>
                                <View style={styles.roleTag}>
                                    <Ionicons name="shield-half" size={14} color="#94a3b8" />
                                    <Text style={styles.roleText}>{user.role}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={16} color="#475569" />
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Modal visible={isModalVisible} onClose={() => setIsModalVisible(false)} title="Operational Controll">
                <View style={[styles.modalContent, { backgroundColor: '#1e293b' }]}>
                    <Text style={styles.modalSub}>{selectedUser?.email}</Text>
                    
                    <Text style={styles.modalLabel}>Life-cycle Control</Text>
                    <Button 
                        title={selectedUser?.status === 'active' ? 'Suspend Account' : 'Activate Account'}
                        variant={selectedUser?.status === 'active' ? 'outline' : 'primary'}
                        onPress={() => handleAction('status')}
                        loading={actionLoading}
                        fullWidth
                        style={{ marginBottom: 15 }}
                    />

                    <Text style={styles.modalLabel}>Authority Elevation</Text>
                    <View style={styles.roleGrid}>
                        {['user', 'admin', 'superadmin'].map((role) => (
                            <TouchableOpacity 
                                key={role}
                                style={[styles.roleBox, { borderColor: selectedUser?.role === role ? '#38bdf8' : '#334155' }]}
                                onPress={() => handleAction('role', role)}
                            >
                                <Text style={[styles.roleBoxText, { color: selectedUser?.role === role ? '#38bdf8' : '#94a3b8' }]}>{role}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Button 
                        title="Delete Permanently"
                        variant="outline"
                        onPress={() => Alert.alert('Confirm Delete', 'This will erase all user data.', [{ text: 'Cancel' }, { text: 'Delete', onPress: () => handleAction('delete') }])}
                        style={{ marginTop: 20, borderColor: '#f43f5e' }}
                        textStyle={{ color: '#f43f5e' }}
                        fullWidth
                    />
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
    pageTitle: { color: '#fff', fontSize: 28, fontWeight: '800' },
    pageSubtitle: { color: '#94a3b8', fontSize: 13, marginTop: 4 },
    userCard: { marginHorizontal: 20, marginVertical: 8, borderRadius: 25, overflow: 'hidden' },
    cardInner: { padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    userHeader: { flexDirection: 'row', alignItems: 'center' },
    avatarBox: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    avatarText: { color: '#fff', fontWeight: '800', fontSize: 18 },
    userInfo: { flex: 1 },
    userName: { color: '#fff', fontSize: 16, fontWeight: '700' },
    userEmail: { color: '#64748b', fontSize: 12, marginTop: 2 },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    statusText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
    roleTag: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    roleText: { color: '#94a3b8', fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
    modalContent: { padding: 20, borderRadius: 30 },
    modalSub: { color: '#94a3b8', fontSize: 13, textAlign: 'center', marginBottom: 25 },
    modalLabel: { color: '#fff', fontSize: 14, fontWeight: '700', marginBottom: 15 },
    roleGrid: { flexDirection: 'row', gap: 10 },
    roleBox: { flex: 1, height: 45, borderRadius: 12, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
    roleBoxText: { fontSize: 12, fontWeight: '700', textTransform: 'capitalize' }
});