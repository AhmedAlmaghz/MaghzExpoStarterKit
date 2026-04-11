import React from 'react';
import { Stack } from 'expo-router';
import { useRequireRole } from '@/auth/hooks/useRequireRole';
import { useTheme } from '@/theme/hooks/useTheme';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { View, ActivityIndicator } from 'react-native';

/**
 * Admin Layout
 * 
 * Protects all routes within the (main)/admin group.
 * Only users with 'admin' or 'superadmin' roles can access these pages.
 */
export default function AdminLayout() {
    const { status, user } = useRequireRole('admin');
    const { colors } = useTheme();
    const { t } = useTranslation();

    // While checking permissions or loading auth state
    if (status === 'loading') {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
            </View>
        );
    }

    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: colors.surface[50],
                },
                headerTintColor: colors.text,
                headerTitleStyle: {
                    fontWeight: '700',
                },
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen 
                name="index" 
                options={{ 
                    title: t('admin.title') || 'Admin Panel' 
                }} 
            />
            <Stack.Screen 
                name="users" 
                options={{ 
                    title: t('admin.userManagement') || 'Users' 
                }} 
            />
            <Stack.Screen 
                name="analytics" 
                options={{ 
                    title: t('admin.analytics') || 'Analytics' 
                }} 
            />
        </Stack>
    );
}
