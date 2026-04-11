/**
 * Edit Profile Screen
 * 
 * Comprehensive form for editing user profile information, synced with the database.
 * Supports Bio, Gender, Location, and Contact details.
 * 
 * @module app/(main)/profile/edit
 */
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/auth/hooks/useAuth';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useTheme } from '@/theme/hooks/useTheme';
import { Button, Input, Card } from '@/components/ui';
import { userService } from '@/lib/services/userService';
import { Ionicons } from '@expo/vector-icons';

export default function EditProfileScreen(): React.ReactElement {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { user } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [displayName, setDisplayName] = useState('');
    const [bio, setBio] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');

    const loadProfileData = useCallback(async () => {
        if (!user?.id) return;
        try {
            const data = await userService.getCurrentUserProfile(user.id);
            if (data) {
                setDisplayName(data.profiles?.[0]?.display_name || '');
                setBio(data.profiles?.[0]?.bio || '');
                setPhone(data.phone || '');
                setGender(data.profiles?.[0]?.gender || '');
                setDob(data.profiles?.[0]?.date_of_birth || '');
                setAddress(data.profiles?.[0]?.address || '');
                setCity(data.profiles?.[0]?.city || '');
                setCountry(data.profiles?.[0]?.country || '');
            }
        } catch (error) {
            console.error('Failed to load profile:', error);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        loadProfileData();
    }, [loadProfileData]);

    const handleSave = async () => {
        if (!user?.id) return;
        setIsSaving(true);
        try {
            // Update Profile Table
            await userService.updateProfile(user.id, {
                display_name: displayName,
                bio,
                gender: gender || null,
                date_of_birth: dob || null,
                address,
                city,
                country
            });

            // Update User Table (Phone)
            if (phone !== user.phone) {
                await userService.updateUserPhone(user.id, phone);
            }

            Alert.alert(t('common.done'), t('profile.saveSuccess'));
            router.back();
        } catch (error) {
            Alert.alert(t('common.error'), 'Failed to update profile.');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <View style={[styles.avatar, { backgroundColor: colors.primary[100] }]}>
                        <Ionicons name="person" size={60} color={colors.primary[500]} />
                    </View>
                    <TouchableOpacity style={[styles.editAvatarBtn, { backgroundColor: colors.primary[500] }]}>
                        <Ionicons name="camera" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.form}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('profile.personalInfo')}</Text>
                
                <Input
                    label={t('auth.displayName')}
                    value={displayName}
                    onChangeText={setDisplayName}
                    placeholder="Enter your name"
                />

                <Input
                    label={t('auth.phone')}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="+1234567890"
                    keyboardType="phone-pad"
                />

                <Text style={[styles.label, { color: colors.textSecondary }]}>{t('profile.gender')}</Text>
                <View style={styles.genderRow}>
                    {['male', 'female', 'other'].map((g) => (
                        <TouchableOpacity 
                            key={g}
                            style={[
                                styles.genderBtn, 
                                { 
                                    borderColor: gender === g ? colors.primary[500] : colors.border,
                                    backgroundColor: gender === g ? colors.primary[50] : 'transparent'
                                }
                            ]}
                            onPress={() => setGender(g)}
                        >
                            <Text style={[styles.genderText, { color: gender === g ? colors.primary[700] : colors.textSecondary }]}>
                                {t(`profile.${g}`)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Input
                    label={t('profile.dateOfBirth')}
                    value={dob}
                    onChangeText={setDob}
                    placeholder="YYYY-MM-DD"
                />

                <Input
                    label={t('profile.bio')}
                    value={bio}
                    onChangeText={setBio}
                    placeholder="Tell us about yourself..."
                    multiline
                    numberOfLines={4}
                />

                <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 25 }]}>{t('profile.address')}</Text>
                
                <Input
                    label={t('profile.address')}
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Street/Building"
                />

                <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                        <Input
                            label={t('profile.city')}
                            value={city}
                            onChangeText={setCity}
                            placeholder="City"
                        />
                    </View>
                    <View style={{ width: 15 }} />
                    <View style={{ flex: 1 }}>
                        <Input
                            label={t('profile.country')}
                            value={country}
                            onChangeText={setCountry}
                            placeholder="Country"
                        />
                    </View>
                </View>

                <View style={styles.footer}>
                    <Button
                        title={t('common.save')}
                        onPress={handleSave}
                        loading={isSaving}
                        fullWidth
                        size="lg"
                    />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { alignItems: 'center', paddingVertical: 30 },
    avatarContainer: { position: 'relative' },
    avatar: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
    editAvatarBtn: { position: 'absolute', bottom: 0, right: 0, width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderSize: 3, borderColor: '#fff' },
    form: { paddingHorizontal: 20, paddingBottom: 50 },
    sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', marginBottom: 10, marginTop: 15 },
    genderRow: { flexDirection: 'row', gap: 10, marginBottom: 15 },
    genderBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, alignItems: 'center' },
    genderText: { fontSize: 14, fontWeight: '700', textTransform: 'capitalize' },
    row: { flexDirection: 'row' },
    footer: { marginTop: 30 },
});