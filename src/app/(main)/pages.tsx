/**
 * Pages (Discovery) Screen
 *
 * A central hub for basic application pages.
 *
 * @module app/(main)/pages
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/theme/hooks/useTheme';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { Header } from '@/components/layout/Header';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { useRouter } from 'expo-router';

export default function PagesScreen(): React.ReactElement {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const router = useRouter();

    const sections = [
        {
            title: t('pages.infoTitle'),
            items: [
                { id: 'about', label: t('pages.about'), icon: 'information-circle-outline', route: '/about' },
                { id: 'help', label: t('pages.help'), icon: 'help-buoy-outline', route: '/help' },
            ]
        },
        {
            title: t('pages.legalTitle'),
            items: [
                { id: 'terms', label: 'Terms of Service', icon: 'document-text-outline', route: '/help' },
                { id: 'privacy', label: 'Privacy Policy', icon: 'lock-closed-outline', route: '/help' },
            ]
        }
    ];

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <Header />
            <ScrollView style={styles.container}>
                <View style={styles.content}>
                    <Text style={[styles.title, { color: colors.text }]}>{t('pages.title')}</Text>
                    
                    {sections.map((section, sIdx) => (
                        <View key={sIdx} style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>{section.title}</Text>
                            <Card style={styles.card}>
                                {section.items.map((item, iIdx) => (
                                    <React.Fragment key={item.id}>
                                        <TouchableOpacity 
                                            style={styles.itemRow}
                                            onPress={() => router.push(item.route as any)}
                                        >
                                            <View style={[styles.iconContainer, { backgroundColor: colors.surface[100] }]}>
                                                <Ionicons name={item.icon as any} size={20} color={colors.primary[500]} />
                                            </View>
                                            <Text style={[styles.itemLabel, { color: colors.text }]}>{item.label}</Text>
                                            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
                                        </TouchableOpacity>
                                        {iIdx < section.items.length - 1 && (
                                            <View style={[styles.divider, { backgroundColor: colors.border }]} />
                                        )}
                                    </React.Fragment>
                                ))}
                            </Card>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 20 },
    title: { fontSize: 28, fontWeight: '800', marginBottom: 25 },
    section: { marginBottom: 25 },
    sectionTitle: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', marginBottom: 10, marginLeft: 4, letterSpacing: 1 },
    card: { padding: 0, overflow: 'hidden' },
    itemRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
    iconContainer: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    itemLabel: { flex: 1, fontSize: 16, fontWeight: '500' },
    divider: { height: 1, marginLeft: 64 }
});
