/**
 * Home Screen
 *
 * Professional landing page with Hero, Categories, and Trending products.
 *
 * @module app/(main)/index
 */
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '@/auth/hooks/useAuth';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useTheme } from '@/theme/hooks/useTheme';
import { Loading } from '@/components/ui/Loading';
import { Header } from '@/components/layout/Header';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen(): React.ReactElement {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { user } = useAuth();
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setRefreshing(false);
    };

    if (isLoading) {
        return <Loading message={t('common.loading')} fullScreen />;
    }

    const categories = [
        { id: '1', name: t('home.categories.tech'), image: { uri: 'https://picsum.photos/seed/tech/400/300' } },
        { id: '2', name: t('home.categories.fashion'), image: { uri: 'https://picsum.photos/seed/fashion/400/300' } },
        { id: '3', name: t('home.categories.lifestyle'), image: null },
    ];

    const trendingItems = [
        {
            id: 't1',
            name: 'Elite Wireless Pro',
            price: '$299',
            category: 'Tech',
            image: { uri: 'https://picsum.photos/seed/product1/400/500' },
            rating: 4.8
        },
        {
            id: 't2',
            name: 'Smart Watch Series X',
            price: '$199',
            category: 'Tech',
            image: { uri: 'https://picsum.photos/seed/product2/400/500' },
            rating: 4.9
        }
    ];

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <Header />
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl 
                        refreshing={!!refreshing} 
                        onRefresh={onRefresh} 
                        tintColor={colors.primary[500]} 
                    />
                }
            >
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <View style={[styles.heroCard, { backgroundColor: colors.primary[500] }]}>
                        <View style={styles.heroContent}>
                            <Text style={styles.heroTitle}>{t('dashboard.welcome')}, {user?.displayName || 'Guest'}</Text>
                            <Text style={styles.heroSubtitle}>Explore the latest premium items curated just for you.</Text>
                            <TouchableOpacity style={styles.heroButton}>
                                <Text style={[styles.heroButtonText, { color: colors.primary[500] }]}>Explore Now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Categories */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('home.sections.categories')}</Text>
                    <TouchableOpacity><Text style={{ color: colors.primary[500] }}>{t('common.seeMore')}</Text></TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                    {categories.map((cat) => (
                        <TouchableOpacity key={cat.id} style={styles.categoryCard}>
                            {cat.image ? (
                                <Image source={cat.image} style={styles.categoryImage} />
                            ) : (
                                <View style={[styles.categoryPlaceholder, { backgroundColor: colors.surface[200] }]} />
                            )}
                            <View style={styles.categoryOverlay}>
                                <Text style={styles.categoryName}>{cat.name}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Trending Section */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('home.sections.trending')}</Text>
                    <TouchableOpacity><Text style={{ color: colors.primary[500] }}>{t('common.viewAll')}</Text></TouchableOpacity>
                </View>
                <View style={styles.trendingGrid}>
                    {trendingItems.map((item) => (
                        <TouchableOpacity key={item.id} style={[styles.productCard, { backgroundColor: colors.surface[50] }]}>
                            <Image source={item.image} style={styles.productImage} resizeMode="cover" />
                            <View style={styles.productInfo}>
                                <Text style={[styles.productCategory, { color: colors.textTertiary }]}>{item.category}</Text>
                                <Text style={[styles.productName, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
                                <View style={styles.productFooter}>
                                    <Text style={[styles.productPrice, { color: colors.primary[600] }]}>{item.price}</Text>
                                    <View style={styles.ratingBox}>
                                        <Ionicons name="star" size={12} color="#FFD700" />
                                        <Text style={styles.ratingText}>{item.rating}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    heroSection: { padding: 20 },
    heroCard: { borderRadius: 24, padding: 24, minHeight: 180, justifyContent: 'center' },
    heroContent: { maxWidth: '70%' },
    heroTitle: { color: 'white', fontSize: 24, fontWeight: '800', marginBottom: 8 },
    heroSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 16 },
    heroButton: { backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, alignSelf: 'flex-start' },
    heroButtonText: { fontWeight: '700', fontSize: 14 },

    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 10, marginBottom: 15 },
    sectionTitle: { fontSize: 20, fontWeight: '800' },
    
    horizontalScroll: { paddingHorizontal: 20, gap: 15 },
    categoryCard: { width: 140, height: 180, borderRadius: 20, overflow: 'hidden' },
    categoryImage: { width: '100%', height: '100%' },
    categoryPlaceholder: { width: '100%', height: '100%' },
    categoryOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12, backgroundColor: 'rgba(0,0,0,0.35)' },
    categoryName: { color: 'white', fontWeight: '700', fontSize: 16 },

    trendingGrid: { paddingHorizontal: 20, flexDirection: 'row', flexWrap: 'wrap', gap: 15, justifyContent: 'space-between' },
    productCard: { width: '47%', borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
    productImage: { width: '100%', height: 160 },
    productInfo: { padding: 12 },
    productCategory: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase', marginBottom: 4 },
    productName: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
    productFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    productPrice: { fontSize: 16, fontWeight: '800' },
    ratingBox: { flexDirection: 'row', alignItems: 'center', gap: 2 },
    ratingText: { fontSize: 12, fontWeight: '600' }
});