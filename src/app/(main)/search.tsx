import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/theme/hooks/useTheme';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { Header } from '@/components/layout/Header';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';

/**
 * Search Screen
 * 
 * Provides a dedicated interface for searching products, vendors, and pages.
 */
export default function SearchScreen() {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');

    const recentSearches = [
        t('search.recent1') || 'Honey',
        t('search.recent2') || 'Coffee',
        t('search.recent3') || 'Clothing'
    ];

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <Header title={t('search.title') || 'Search'} showSearch={false} />
            
            <View style={styles.searchContainer}>
                <View style={[styles.searchBar, { backgroundColor: colors.surface[100], borderColor: colors.border }]}>
                    <Ionicons name="search" size={20} color={colors.textTertiary} />
                    <TextInput
                        style={[styles.input, { color: colors.text }]}
                        placeholder={t('search.placeholder') || 'What are you looking for?'}
                        placeholderTextColor={colors.textTertiary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoFocus
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                        {t('search.recentSearches') || 'Recent Searches'}
                    </Text>
                    <Card style={styles.card}>
                        {recentSearches.map((item, index) => (
                            <TouchableOpacity key={index} style={styles.recentItem}>
                                <Ionicons name="time-outline" size={18} color={colors.textTertiary} />
                                <Text style={[styles.recentText, { color: colors.text }]}>{item}</Text>
                                <Ionicons name="arrow-forward-outline" size={16} color={colors.textTertiary} />
                            </TouchableOpacity>
                        ))}
                    </Card>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    searchContainer: {
        padding: 16,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        height: 50,
        borderRadius: 12,
        borderWidth: 1,
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    section: {
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: 12,
        marginLeft: 4,
    },
    card: {
        padding: 0,
        overflow: 'hidden',
    },
    recentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    recentText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 15,
    },
});
