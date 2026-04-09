/**
 * Content Management Screen
 *
 * Admin content management.
 *
 * @module app/(main)/admin/content
 */
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useTheme } from '@/theme/hooks/useTheme';
import { Card } from '@/components/ui/Card';

export default function ContentManagementScreen(): React.ReactElement {
    const { t } = useTranslation();
    const { colors } = useTheme();

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.pageTitle, { color: colors.text }]}>{t('admin.contentManagement')}</Text>
            <Card>
                <Text style={[styles.placeholder, { color: colors.textSecondary }]}>
                    📝 Content management features will be available here.
                </Text>
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    pageTitle: { fontSize: 24, fontWeight: '700', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
    placeholder: { fontSize: 14, textAlign: 'center', paddingVertical: 40 },
});