/**
 * Forgot Password Screen
 *
 * Handles password reset request via email.
 *
 * @module app/(auth)/forgot-password
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/auth/hooks/useAuth';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useTheme } from '@/theme/hooks/useTheme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { forgotPasswordSchema } from '@/auth/schemas/authSchema';

export default function ForgotPasswordScreen(): React.ReactElement {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { resetPassword, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    try {
      clearError();
      setFormErrors({});

      const result = forgotPasswordSchema.safeParse({ email });

      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          const field = issue.path[0]?.toString();
          if (field) fieldErrors[field] = issue.message;
        });
        setFormErrors(fieldErrors);
        return;
      }

      await resetPassword(email);
      setSent(true);
    } catch {
      // Error handled by store
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{t('auth.resetPassword')}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {t('auth.forgotPassword')}
          </Text>
        </View>

        {sent ? (
          <View style={[styles.successBanner, { backgroundColor: colors.success[50], borderColor: colors.success[500] }]}>
            <Text style={[styles.successText, { color: colors.success[700] }]}>
              {t('auth.passwordResetSent')}
            </Text>
          </View>
        ) : (
          <>
            {error && (
              <View style={[styles.errorBanner, { backgroundColor: colors.error[50], borderColor: colors.error[500] }]}>
                <Text style={[styles.errorText, { color: colors.error[700] }]}>{error}</Text>
              </View>
            )}

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

            <Button
              title={t('auth.resetPassword')}
              onPress={handleReset}
              loading={isLoading}
              fullWidth
              size="lg"
            />
          </>
        )}

        <View style={styles.footer}>
          <Link href="/(auth)/login">
            <Text style={[styles.linkText, { color: colors.primary[500] }]}>{t('auth.login')}</Text>
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
  title: { fontSize: 32, fontWeight: '700' },
  subtitle: { fontSize: 16, marginTop: 4 },
  successBanner: { padding: 16, borderRadius: 8, borderWidth: 1, marginBottom: 16 },
  successText: { fontSize: 14, textAlign: 'center' },
  errorBanner: { padding: 12, borderRadius: 8, borderWidth: 1, marginBottom: 16 },
  errorText: { fontSize: 14, textAlign: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
  linkText: { fontSize: 14, fontWeight: '600' },
});