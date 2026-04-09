/**
 * Help Screen
 *
 * FAQ, documentation, and support options.
 *
 * @module app/(main)/help
 */
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useTheme } from '@/theme/hooks/useTheme';
import { Card } from '@/components/ui/Card';

interface FAQItem {
    question: string;
    answer: string;
}

export default function HelpScreen(): React.ReactElement {
    const { t } = useTranslation();
    const { colors } = useTheme();

    const faqs: FAQItem[] = [
        { question: 'How do I reset my password?', answer: 'Go to Settings > Account > Change Password, or use the "Forgot Password" link on the login screen.' },
        { question: 'How do I change the app language?', answer: 'Go to Settings > Appearance > Language to select your preferred language.' },
        { question: 'How do I enable dark mode?', answer: 'Go to Settings > Appearance > Theme and select Dark mode or System default.' },
        { question: 'How do I manage notifications?', answer: 'Go to Settings > Notifications to customize your notification preferences.' },
        { question: 'How do I contact support?', answer: 'Use the "Contact Support" button below to send us an email.' },
    ];

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.pageTitle, { color: colors.text }]}>{t('help.title')}</Text>

            <Card title={t('help.faq')}>
                {faqs.map((faq, index) => (
                    <View key={index} style={[styles.faqItem, index < faqs.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider }]}>
                        <Text style={[styles.faqQuestion, { color: colors.text }]}>{faq.question}</Text>
                        <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>{faq.answer}</Text>
                    </View>
                ))}
            </Card>

            <View style={styles.actions}>
                <Card>
                    <TouchableOpacity style={styles.actionItem} onPress={() => Linking.openURL('#')}>
                        <Text style={styles.actionIcon}>📖</Text>
                        <Text style={[styles.actionTitle, { color: colors.text }]}>{t('help.documentation')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionItem} onPress={() => Linking.openURL('#')}>
                        <Text style={styles.actionIcon}>🎓</Text>
                        <Text style={[styles.actionTitle, { color: colors.text }]}>{t('help.tutorials')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionItem} onPress={() => Linking.openURL('mailto:support@example.com')}>
                        <Text style={styles.actionIcon}>📧</Text>
                        <Text style={[styles.actionTitle, { color: colors.text }]}>{t('help.contactSupport')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionItem} onPress={() => Linking.openURL('#')}>
                        <Text style={styles.actionIcon}>🐛</Text>
                        <Text style={[styles.actionTitle, { color: colors.text }]}>{t('help.reportBug')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionItem} onPress={() => Linking.openURL('#')}>
                        <Text style={styles.actionIcon}>💡</Text>
                        <Text style={[styles.actionTitle, { color: colors.text }]}>{t('help.featureRequest')}</Text>
                    </TouchableOpacity>
                </Card>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    pageTitle: { fontSize: 24, fontWeight: '700', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
    faqItem: { paddingVertical: 12 },
    faqQuestion: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
    faqAnswer: { fontSize: 14, lineHeight: 20 },
    actions: { paddingHorizontal: 20, marginTop: 20 },
    actionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
    actionIcon: { fontSize: 22, marginRight: 12 },
    actionTitle: { fontSize: 16 },
});