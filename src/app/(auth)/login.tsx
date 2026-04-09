/**
 * Login Screen
 *
 * Handles user authentication with email/password and social login options.
 * Uses Zod for form validation and the auth store for state management.
 *
 * @module app/(auth)/login
 */
import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
} from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/auth/hooks/useAuth';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useTheme } from '@/theme/hooks/useTheme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { loginSchema, type LoginFormData } from '@/auth/schemas/authSchema';

export default function LoginScreen(): React.ReactElement {
    const { t } = useTranslation();
    const { colors, isDarkMode } = useTheme();
    const { login, loginWithGoogle, loginWithApple, isLoading, error, clearError } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const handleLogin = async () => {
      try {
        clearError();
        setFormErrors({});
  
        const data = { email, password, rememberMe: false };
        const result = loginSchema.safeParse(data);
  
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.issues.forEach((issue) => {
            const field = issue.path[0]?.toString();
            if (field) fieldErrors[field] = issue.message;
          });
          setFormErrors(fieldErrors);
          return;
        }
  
        await login({ email, password });
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
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>
                        {t('common.appName')}
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        {t('auth.login')}
                    </Text>
                </View>

                {/* Error message */}
                {error && (
                    <View style={[styles.errorBanner, { backgroundColor: colors.error[50], borderColor: colors.error[500] }]}>
                        <Text style={[styles.errorText, { color: colors.error[700] }]}>{error}</Text>
                    </View>
                )}

                {/* Form */}
                <View style={styles.form}>
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

                    <Link href="/forgot-password" style={[styles.forgotLink, { color: colors.primary[500] }]}>
                        <Text>{t('auth.forgotPassword')}</Text>
                    </Link>

                    <Button
                        title={t('auth.login')}
                        onPress={handleLogin}
                        loading={isLoading}
                        fullWidth
                        size="lg"
                    />
                </View>

                {/* Social Login */}
                <View style={styles.socialSection}>
                    <View style={[styles.divider, { backgroundColor: colors.divider }]} />
                    <Text style={[styles.orText, { color: colors.textTertiary }]}>{t('common.or')}</Text>
                    <View style={[styles.divider, { backgroundColor: colors.divider }]} />
                </View>

                <View style={styles.socialButtons}>
                    <Button
                        title={t('auth.loginWithGoogle')}
                        onPress={loginWithGoogle}
                        variant="outline"
                        fullWidth
                    />
                    <View style={styles.spacer} />
                    <Button
                        title={t('auth.loginWithApple')}
                        onPress={loginWithApple}
                        variant="outline"
                        fullWidth
                    />
                </View>

                {/* Register link */}
                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                        {t('auth.noAccount')}{' '}
                    </Text>
                    <Link href="/register" style={{ color: colors.primary[500] }}>
                        <Text style={[styles.linkText, { color: colors.primary[500] }]}>
                            {t('auth.register')}
                        </Text>
                    </Link>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 24,
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
    },
    subtitle: {
        fontSize: 16,
        marginTop: 4,
    },
    errorBanner: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 16,
    },
    errorText: {
        fontSize: 14,
        textAlign: 'center',
    },
    form: {
        gap: 4,
    },
    forgotLink: {
        alignSelf: 'flex-end',
        marginBottom: 16,
        fontSize: 14,
    },
    socialSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
        gap: 12,
    },
    divider: {
        flex: 1,
        height: 1,
    },
    orText: {
        fontSize: 14,
    },
    socialButtons: {
        gap: 8,
    },
    spacer: {
        height: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
    },
    footerText: {
        fontSize: 14,
    },
    linkText: {
        fontSize: 14,
        fontWeight: '600',
    },
});