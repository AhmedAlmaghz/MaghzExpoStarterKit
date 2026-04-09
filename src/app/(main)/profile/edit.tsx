/**
 * Edit Profile Screen
 *
 * Form for editing user profile information.
 *
 * @module app/(main)/profile/edit
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/auth/hooks/useAuth';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useTheme } from '@/theme/hooks/useTheme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function EditProfileScreen(): React.ReactElement {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { user } = useAuth();
    const router = useRouter();

    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [bio, setBio] = useState('');
    const [phone, setPhone] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        // TODO: Implement profile update via profileService
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsSaving(false);
        router.back();
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.form}>
                <Input
                    label={t('auth.displayName')}
                    value={displayName}
                    onChangeText={setDisplayName}
                    placeholder="John Doe"
                    autoCapitalize="words"
                />
                <Input
                    label={t('auth.email')}
                    value={user?.email || ''}
                    onChangeText={() => { }}
                    placeholder="email@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    disabled
                />
                <Input
                    label={t('auth.phone')}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="+1234567890"
                    keyboardType="phone-pad"
                />
                <Input
                    label={t('profile.bio')}
                    value={bio}
                    onChangeText={setBio}
                    placeholder={t('profile.bio')}
                    multiline
                    numberOfLines={4}
                />
                <View style={styles.spacer} />
                <Button
                    title={t('common.save')}
                    onPress={handleSave}
                    loading={isSaving}
                    fullWidth
                    size="lg"
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    form: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 32 },
    spacer: { height: 16 },
});