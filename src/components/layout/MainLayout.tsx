/**
 * Main Layout Component
 *
 * Wraps the main content area with header and optional footer.
 *
 * @module components/layout/MainLayout
 */
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/hooks/useTheme';
import { Header } from './Header';
import { Footer } from './Footer';
import { SideMenu } from './SideMenu';
import { useRouter } from 'expo-router';

interface MainLayoutProps {
    children: React.ReactNode;
    /** Whether to show the header */
    showHeader?: boolean;
    /** Whether to show the footer */
    showFooter?: boolean;
    /** Custom header title */
    title?: string;
}

/**
 * Main layout component
 */
export function MainLayout({
    children,
    showHeader = true,
    showFooter = false,
    title,
}: MainLayoutProps): React.ReactElement {
    const { colors } = useTheme();
    const router = useRouter();
    const [menuVisible, setMenuVisible] = useState(false);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {showHeader && (
                <Header
                    title={title}
                    onNotificationsPress={() => router.push('/(main)/notifications')}
                    onUserPress={() => router.push('/(main)/profile')}
                />
            )}

            <View style={styles.content}>
                {children}
            </View>

            {showFooter && <Footer />}

            <SideMenu
                isVisible={menuVisible}
                onItemPress={(route) => router.push(route as never)}
                onClose={() => setMenuVisible(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
});