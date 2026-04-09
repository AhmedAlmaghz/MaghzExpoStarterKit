/**
 * Footer Component
 *
 * Application footer with links, contact info, and copyright.
 *
 * @module components/layout/Footer
 */
import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/hooks/useTheme';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { APP } from '@/lib/constants';

interface FooterProps {
    /** Whether to show social links */
    showSocialLinks?: boolean;
    /** Whether to show legal links */
    showLegalLinks?: boolean;
}

/**
 * Footer component
 */
export function Footer({
    showSocialLinks = true,
    showLegalLinks = true,
}: FooterProps): React.ReactElement {
    const { colors } = useTheme();
    const { t } = useTranslation();

    const openLink = (url: string) => {
        Linking.openURL(url).catch(() => { });
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
            {showLegalLinks && (
                <View style={styles.linksRow}>
                    <TouchableOpacity onPress={() => openLink('#')}>
                        <Text style={[styles.link, { color: colors.primary[500] }]}>
                            {t('about.termsOfService')}
                        </Text>
                    </TouchableOpacity>
                    <Text style={[styles.separator, { color: colors.textTertiary }]}>•</Text>
                    <TouchableOpacity onPress={() => openLink('#')}>
                        <Text style={[styles.link, { color: colors.primary[500] }]}>
                            {t('about.privacyPolicy')}
                        </Text>
                    </TouchableOpacity>
                    <Text style={[styles.separator, { color: colors.textTertiary }]}>•</Text>
                    <TouchableOpacity onPress={() => openLink('#')}>
                        <Text style={[styles.link, { color: colors.primary[500] }]}>
                            {t('about.contactUs')}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {showSocialLinks && (
                <View style={styles.socialRow}>
                    <TouchableOpacity style={styles.socialButton} onPress={() => openLink('#')}>
                        <Text style={styles.socialIcon}>𝕏</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton} onPress={() => openLink('#')}>
                        <Text style={styles.socialIcon}>in</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton} onPress={() => openLink('#')}>
                        <Text style={styles.socialIcon}>📧</Text>
                    </TouchableOpacity>
                </View>
            )}

            <Text style={[styles.copyright, { color: colors.textTertiary }]}>
                © {new Date().getFullYear()} {APP.NAME} v{APP.VERSION}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        alignItems: 'center',
        gap: 12,
    },
    linksRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
    },
    link: {
        fontSize: 13,
        fontWeight: '500',
    },
    separator: {
        fontSize: 12,
    },
    socialRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    socialButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    socialIcon: {
        fontSize: 18,
    },
    copyright: {
        fontSize: 12,
        textAlign: 'center',
    },
});