import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '@/auth/hooks/useAuth';
import { useTheme } from '@/theme/hooks/useTheme';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';

import { useRequireAuth } from '@/auth/hooks/useRequireAuth';

export default function ProfileScreen() {
    useRequireAuth();
    const { user, logout } = useAuth();
    const { colors } = useTheme();
    const { t } = useTranslation();

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <Header title={t('nav.profile')} />
            <ScrollView style={styles.container}>
                <View style={styles.profileHeader}>
                    <View style={[styles.avatarContainer, { backgroundColor: colors.primary[100] }]}>
                        <Text style={[styles.avatarText, { color: colors.primary[700] }]}>
                            {user?.displayName?.charAt(0) || 'U'}
                        </Text>
                    </View>
                    <Text style={[styles.userName, { color: colors.text }]}>{user?.displayName}</Text>
                    <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user?.email}</Text>
                    
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: colors.text }]}>12</Text>
                            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>{t('profile.orders') || 'Orders'}</Text>
                        </View>
                        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: colors.text }]}>8</Text>
                            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>{t('profile.reviews') || 'Reviews'}</Text>
                        </View>
                        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: colors.text }]}>240</Text>
                            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>{t('profile.points') || 'Points'}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.content}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('profile.settings') || 'Account Settings'}</Text>
                    
                    <Card style={styles.settingsCard}>
                        <TouchableOpacity style={styles.settingsRow}>
                            <Ionicons name="person-outline" size={22} color={colors.primary[500]} />
                            <Text style={[styles.settingsLabel, { color: colors.text }]}>{t('profile.personalInfo') || 'Personal Information'}</Text>
                            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
                        </TouchableOpacity>
                        
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />

                        <TouchableOpacity style={styles.settingsRow}>
                            <Ionicons name="location-outline" size={22} color={colors.primary[500]} />
                            <Text style={[styles.settingsLabel, { color: colors.text }]}>{t('profile.addresses') || 'My Addresses'}</Text>
                            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
                        </TouchableOpacity>

                        <View style={[styles.divider, { backgroundColor: colors.border }]} />

                        <TouchableOpacity style={styles.settingsRow}>
                            <Ionicons name="card-outline" size={22} color={colors.primary[500]} />
                            <Text style={[styles.settingsLabel, { color: colors.text }]}>{t('profile.payments') || 'Payment Methods'}</Text>
                            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
                        </TouchableOpacity>
                    </Card>

                    <TouchableOpacity 
                        style={[styles.logoutBtn, { borderColor: colors.error[500] }]}
                        onPress={logout}
                    >
                        <Ionicons name="log-out-outline" size={20} color={colors.error[500]} />
                        <Text style={[styles.logoutText, { color: colors.error[500] }]}>{t('auth.logout')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    profileHeader: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: 'transparent',
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 4,
        borderColor: 'white',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    avatarText: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    userName: {
        fontSize: 22,
        fontWeight: '800',
    },
    userEmail: {
        fontSize: 14,
        marginTop: 4,
    },
    statsContainer: {
        flexDirection: 'row',
        marginTop: 25,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 15,
        width: '85%',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
    },
    statLabel: {
        fontSize: 12,
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: '70%',
        alignSelf: 'center',
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 15,
        marginLeft: 5,
    },
    settingsCard: {
        padding: 0,
        overflow: 'hidden',
    },
    settingsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 15,
    },
    settingsLabel: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        width: '90%',
        alignSelf: 'flex-end',
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1.5,
        borderStyle: 'dashed',
        gap: 10,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '700',
    }
});