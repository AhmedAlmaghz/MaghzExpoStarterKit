/**
 * User Addresses Screen
 * 
 * Allows users to manage multiple shipping/billing addresses.
 * Part of the professional user profile expansion.
 * 
 * @module app/(main)/profile/addresses
 */
import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useTheme } from '@/theme/hooks/useTheme';
import { Card, Modal, Button, Input } from '@/components/ui';
import { userService } from '@/lib/services/userService';
import { useAuth } from '@/auth/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';

export default function AddressesScreen(): React.ReactElement {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { user } = useAuth();

    const [addresses, setAddresses] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);

    // Form State
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [label, setLabel] = React.useState('');
    const [details, setDetails] = React.useState('');
    const [isDefault, setIsDefault] = React.useState(false);
    const [isSaving, setIsSaving] = React.useState(false);

    const fetchAddresses = React.useCallback(async () => {
        if (!user?.id) return;
        try {
            const data = await userService.getUserAddresses(user.id);
            setAddresses(data);
        } catch (error) {
            console.error('Failed to load addresses:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user?.id]);

    React.useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);

    const handleAddAddress = async () => {
        if (!label || !details || !user?.id) return;
        setIsSaving(true);
        try {
            await userService.addAddress(user.id, {
                label,
                details,
                is_default: isDefault
            });
            setIsModalVisible(false);
            setLabel('');
            setDetails('');
            setIsDefault(false);
            fetchAddresses();
        } catch (error) {
            Alert.alert('Error', 'Failed to save address.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = (id: string) => {
        Alert.alert('Delete Address', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: async () => {
                await userService.deleteAddress(id);
                fetchAddresses();
            }}
        ]);
    };

    if (loading && !refreshing) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView 
                style={styles.container}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchAddresses(); }} tintColor={colors.primary[500]} />}
            >
                <View style={styles.headerRow}>
                    <Text style={[styles.pageTitle, { color: colors.text }]}>{t('profile.addresses') || 'My Addresses'}</Text>
                    <TouchableOpacity 
                        style={[styles.addBtn, { backgroundColor: colors.primary[500] }]}
                        onPress={() => setIsModalVisible(true)}
                    >
                        <Ionicons name="add" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {addresses.length === 0 ? (
                    <Text style={[styles.empty, { color: colors.textTertiary }]}>No addresses saved yet.</Text>
                ) : (
                    addresses.map((item) => (
                        <Card key={item.id} style={styles.addressCard}>
                            <View style={styles.addressHeader}>
                                <View style={styles.labelRow}>
                                    <Ionicons name={item.label.toLowerCase() === 'home' ? 'home-outline' : 'business-outline'} size={18} color={colors.primary[500]} />
                                    <Text style={[styles.label, { color: colors.text }]}>{item.label}</Text>
                                    {item.is_default && (
                                        <View style={[styles.defaultBadge, { backgroundColor: colors.success[500] }]}>
                                            <Text style={styles.defaultText}>DEFAULT</Text>
                                        </View>
                                    )}
                                </View>
                                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                                    <Ionicons name="trash-outline" size={18} color={colors.error[500]} />
                                </TouchableOpacity>
                            </View>
                            <Text style={[styles.details, { color: colors.textSecondary }]}>{item.details}</Text>
                        </Card>
                    ))
                )}
            </ScrollView>

            <Modal 
                visible={isModalVisible} 
                onClose={() => setIsModalVisible(false)}
                title="Add New Address"
            >
                <View style={styles.modalBody}>
                    <Input 
                        label="Label"
                        placeholder="e.g. Home, Work"
                        value={label}
                        onChangeText={setLabel}
                    />
                    <Input 
                        label="Address Details"
                        placeholder="Street, Building, Apartment..."
                        value={details}
                        onChangeText={setDetails}
                        multiline
                    />
                    <TouchableOpacity 
                        style={styles.defaultRow}
                        onPress={() => setIsDefault(!isDefault)}
                    >
                        <Ionicons 
                            name={isDefault ? 'checkbox' : 'square-outline'} 
                            size={24} 
                            color={isDefault ? colors.primary[500] : colors.textTertiary} 
                        />
                        <Text style={[styles.defaultLabel, { color: colors.textSecondary }]}>Set as default address</Text>
                    </TouchableOpacity>
                    <Button 
                        title="Save Address"
                        onPress={handleAddAddress}
                        loading={isSaving}
                        fullWidth
                    />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 20 },
    pageTitle: { fontSize: 24, fontWeight: '700', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
    addBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
    addressCard: { marginHorizontal: 20, marginVertical: 8, padding: 18 },
    addressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    label: { fontSize: 16, fontWeight: '700' },
    defaultBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    defaultText: { fontSize: 8, color: '#fff', fontWeight: '900' },
    details: { fontSize: 14, lineHeight: 20 },
    empty: { textAlign: 'center', marginTop: 100, fontSize: 16 },
    modalBody: { paddingBottom: 10 },
    defaultRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 15 }
});
