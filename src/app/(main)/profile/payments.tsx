/**
 * Payment Methods Screen
 * 
 * Allows users to manage their saved payment cards and wallets.
 * Part of the professional user profile expansion.
 * 
 * @module app/(main)/profile/payments
 */
import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useTheme } from '@/theme/hooks/useTheme';
import { Card, Modal, Button, Input } from '@/components/ui';
import { userService } from '@/lib/services/userService';
import { useAuth } from '@/auth/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentsScreen(): React.ReactElement {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { user } = useAuth();

    const [methods, setMethods] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);

    // Form State
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [provider, setProvider] = React.useState('');
    const [lastFour, setLastFour] = React.useState('');
    const [type, setType] = React.useState<'card' | 'wallet'>('card');
    const [isSaving, setIsSaving] = React.useState(false);

    const fetchMethods = React.useCallback(async () => {
        if (!user?.id) return;
        try {
            const data = await userService.getUserPaymentMethods(user.id);
            setMethods(data);
        } catch (error) {
            console.error('Failed to load payment methods:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user?.id]);

    React.useEffect(() => {
        fetchMethods();
    }, [fetchMethods]);

    const handleAddMethod = async () => {
        if (!provider || !lastFour || !user?.id) return;
        setIsSaving(true);
        try {
            await userService.addPaymentMethod(user.id, {
                provider,
                last_four: lastFour,
                type,
                is_default: methods.length === 0
            });
            setIsModalVisible(false);
            setProvider('');
            setLastFour('');
            fetchMethods();
        } catch (error) {
            Alert.alert('Error', 'Failed to save payment method.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = (id: string) => {
        Alert.alert('Remove Card', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Remove', style: 'destructive', onPress: async () => {
                await userService.deletePaymentMethod(id);
                fetchMethods();
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
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchMethods(); }} tintColor={colors.primary[500]} />}
            >
                <View style={styles.headerRow}>
                    <Text style={[styles.pageTitle, { color: colors.text }]}>{t('profile.payments') || 'Payment Methods'}</Text>
                    <TouchableOpacity 
                        style={[styles.addBtn, { backgroundColor: colors.primary[500] }]}
                        onPress={() => setIsModalVisible(true)}
                    >
                        <Ionicons name="add" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {methods.length === 0 ? (
                    <Text style={[styles.empty, { color: colors.textTertiary }]}>No payment methods saved yet.</Text>
                ) : (
                    methods.map((item) => (
                        <Card key={item.id} style={styles.cardItem}>
                            <View style={styles.cardHeader}>
                                <View style={styles.cardInfo}>
                                    <View style={[styles.iconContainer, { backgroundColor: colors.surface[100] }]}>
                                        <Ionicons name={item.type === 'card' ? 'card-outline' : 'wallet-outline'} size={24} color={colors.primary[500]} />
                                    </View>
                                    <View>
                                        <Text style={[styles.cardTitle, { color: colors.text }]}>{item.provider} **** {item.last_four}</Text>
                                        <Text style={[styles.cardSub, { color: colors.textTertiary }]}>{item.type.toUpperCase()}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                                    <Ionicons name="trash-outline" size={20} color={colors.error[500]} />
                                </TouchableOpacity>
                            </View>
                        </Card>
                    ))
                )}
            </ScrollView>

            <Modal 
                visible={isModalVisible} 
                onClose={() => setIsModalVisible(false)}
                title="Add Payment Method"
            >
                <View style={styles.modalBody}>
                    <Input 
                        label="Card Provider"
                        placeholder="e.g. Visa, MasterCard"
                        value={provider}
                        onChangeText={setProvider}
                    />
                    <Input 
                        label="Last 4 Digits"
                        placeholder="1234"
                        value={lastFour}
                        onChangeText={setLastFour}
                        keyboardType="numeric"
                        maxLength={4}
                    />
                    <View style={styles.typeRow}>
                        <TouchableOpacity 
                            style={[styles.typeBtn, { borderColor: type === 'card' ? colors.primary[500] : colors.border }]}
                            onPress={() => setType('card')}
                        >
                            <Text style={{ color: type === 'card' ? colors.primary[700] : colors.textSecondary }}>Card</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.typeBtn, { borderColor: type === 'wallet' ? colors.primary[500] : colors.border }]}
                            onPress={() => setType('wallet')}
                        >
                            <Text style={{ color: type === 'wallet' ? colors.primary[700] : colors.textSecondary }}>Wallet</Text>
                        </TouchableOpacity>
                    </View>
                    <Button 
                        title="Link Method"
                        onPress={handleAddMethod}
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
    cardItem: { marginHorizontal: 20, marginVertical: 8, padding: 15 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardInfo: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    iconContainer: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    cardTitle: { fontSize: 16, fontWeight: '700' },
    cardSub: { fontSize: 10, fontWeight: '800', marginTop: 2 },
    empty: { textAlign: 'center', marginTop: 100, fontSize: 16 },
    modalBody: { paddingBottom: 10 },
    typeRow: { flexDirection: 'row', gap: 10, marginVertical: 15 },
    typeBtn: { flex: 1, padding: 12, borderRadius: 10, borderWidth: 1.5, alignItems: 'center' }
});
