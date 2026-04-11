/**
 * Register Screen
 *
 * Handles new user registration with form validation.
 *
 * @module app/(auth)/register
 */
import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    TouchableOpacity,
    Platform,
    StyleSheet,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/auth/hooks/useAuth';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useTheme } from '@/theme/hooks/useTheme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { simpleRegisterSchema } from '@/auth/schemas/authSchema';

export default function RegisterScreen(): React.ReactElement {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { register, isLoading, error, clearError } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const handleRegister = async () => {
        try {
            clearError();
            setFormErrors({});

            const data = { email, password, confirmPassword, displayName, acceptTerms: true };
            const result = simpleRegisterSchema.safeParse(data);

            if (!result.success) {
                const fieldErrors: Record<string, string> = {};
                result.error.issues.forEach((issue) => {
                    const field = issue.path[0]?.toString();
                    if (field) fieldErrors[field] = issue.message;
                });
                setFormErrors(fieldErrors);
                return;
            }

            await register({ email, password, displayName, acceptTerms: true });
        } catch {
            // Error is handled by auth store
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <Text style={[styles.title, { color: colors.text }]}>
                            {t('auth.register')}
                        </Text>
                        <TouchableOpacity 
                            onPress={() => router.push('/(main)')}
                            style={[styles.homeButton, { backgroundColor: colors.surface[100] }]}
                        >
                            <Ionicons name="home-outline" size={20} color={colors.primary[500]} />
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        {t('common.appName')}
                    </Text>
                </View>

                {error && (
                    <View style={[styles.errorBanner, { backgroundColor: colors.error[50], borderColor: colors.error[500] }]}>
                        <Text style={[styles.errorText, { color: colors.error[700] }]}>{error}</Text>
                    </View>
                )}

                <View style={styles.form}>
                    <Input
                        label={t('auth.displayName')}
                        value={displayName}
                        onChangeText={(text) => {
                            setDisplayName(text);
                            if (formErrors.displayName) setFormErrors((prev) => ({ ...prev, displayName: '' }));
                        }}
                        placeholder="John Doe"
                        autoCapitalize="words"
                        autoComplete="name"
                        error={formErrors.displayName}
                    />

                    <Input
                        label={t('auth.email')}
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            if (formErrors.email) setFormErrors((prev) => ({ ...prev, email: '' }));
                        }}
                        placeholder="email@example.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        error={formErrors.email}
                    />

                    <Input
                        label={t('auth.password')}
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            if (formErrors.password) setFormErrors((prev) => ({ ...prev, password: '' }));
                        }}
                        placeholder="••••••••"
                        secureTextEntry
                        autoCapitalize="none"
                        autoComplete="password"
                        error={formErrors.password}
                    />

                    <Input
                        label={t('auth.confirmPassword')}
                        value={confirmPassword}
                        onChangeText={(text) => {
                            setConfirmPassword(text);
                            if (formErrors.confirmPassword) setFormErrors((prev) => ({ ...prev, confirmPassword: '' }));
                        }}
                        placeholder="••••••••"
                        secureTextEntry
                        autoCapitalize="none"
                        autoComplete="password"
                        error={formErrors.confirmPassword}
                    />

                    <Button
                        title={t('auth.register')}
                        onPress={handleRegister}
                        loading={isLoading}
                        fullWidth
                        size="lg"
                    />
                </View>

                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                        {t('auth.hasAccount')}{' '}
                    </Text>
                    <Link href="/(auth)/login">
                        <Text style={[styles.linkText, { color: colors.primary[500] }]}>
                            {t('auth.login')}
                        </Text>
                    </Link>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 24 },
    header: { marginBottom: 32 },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    homeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: { fontSize: 32, fontWeight: '700' },
    subtitle: { fontSize: 16, marginTop: 4 },
    errorBanner: { padding: 12, borderRadius: 8, borderWidth: 1, marginBottom: 16 },
    errorText: { fontSize: 14, textAlign: 'center' },
    form: { gap: 4 },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
    footerText: { fontSize: 14 },
    linkText: { fontSize: 14, fontWeight: '600' },
});