/**
 * About Screen
 *
 * Application information, version, and credits.
 *
 * @module app/(main)/about
 */
import React from 'react';
import { View, Text, ScrollView, Linking, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useTheme } from '@/theme/hooks/useTheme';
import { Card } from '@/components/ui/Card';
import { APP } from '@/lib/constants';

export default function AboutScreen(): React.ReactElement {
    const { t } = useTranslation();
    const { colors } = useTheme();

    const techStack = [
        { name: 'React Native', version: '0.81+' },
        { name: 'Expo', version: '54+' },
        { name: 'TailwindCSS', version: '4.0+' },
        { name: 'Supabase', version: '2.x' },
        { name: 'Drizzle ORM', version: '0.30+' },
        { name: 'Zod', version: '3.22+' },
        { name: 'Zustand', version: '4.4+' },
    ];

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.appName, { color: colors.text }]}>{APP.NAME}</Text>
                <Text style={[styles.version, { color: colors.textSecondary }]}>
                    {t('about.version')} {APP.VERSION}
                </Text>
                <Text style={[styles.description, { color: colors.textSecondary }]}>
                    {t('about.description')}
                </Text>
            </View>

            <Card title={t('about.technologies')}>
                {techStack.map((tech) => (
                    <View key={tech.name} style={styles.techRow}>
                        <Text style={[styles.techName, { color: colors.text }]}>{tech.name}</Text>
                        <Text style={[styles.techVersion, { color: colors.textSecondary }]}>{tech.version}</Text>
                    </View>
                ))}
            </Card>

            <Card title={t('about.license')}>
                <Text style={[styles.licenseText, { color: colors.textSecondary }]}>
                    MIT License - Free to use and modify.
                </Text>
            </Card>

            <View style={styles.links}>
                <TouchableOpacity onPress={() => Linking.openURL('#')}>
                    <Text style={[styles.link, { color: colors.primary[500] }]}>{t('about.termsOfService')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL('#')}>
                    <Text style={[styles.link, { color: colors.primary[500] }]}>{t('about.privacyPolicy')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL('#')}>
                    <Text style={[styles.link, { color: colors.primary[500] }]}>{t('about.contactUs')}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { alignItems: 'center', paddingHorizontal: 20, paddingTop: 32, paddingBottom: 16 },
    appName: { fontSize: 28, fontWeight: '700' },
    version: { fontSize: 14, marginTop: 4 },
    description: { fontSize: 14, textAlign: 'center', marginTop: 12, lineHeight: 20 },
    techRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
    techName: { fontSize: 14 },
    techVersion: { fontSize: 14, fontWeight: '500' },
    licenseText: { fontSize: 14, lineHeight: 20 },
    links: { paddingHorizontal: 20, marginTop: 20, gap: 16, paddingBottom: 32 },
    link: { fontSize: 16, fontWeight: '500' },
});