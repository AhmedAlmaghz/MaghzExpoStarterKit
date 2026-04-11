/**
 * Content Management Screen (Pro Console)
 * 
 * Administrative CMS for managing platform-wide legal and help documents.
 * Features a dark 'Command Center' aesthetic and professional bilingual editing tools.
 * 
 * @module app/(main)/admin/content
 */
import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useTheme } from '@/theme/hooks/useTheme';
import { Card, Modal, Button, Input } from '@/components/ui';
import { contentService } from '@/lib/services/contentService';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ContentManagementScreen(): React.ReactElement {
    const { t } = useTranslation();
    const { colors } = useTheme();

    const [pages, setPages] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);

    // Editor State
    const [selectedPage, setSelectedPage] = React.useState<any>(null);
    const [isEditModalVisible, setIsEditModalVisible] = React.useState(false);
    const [editMode, setEditMode] = React.useState<'ar' | 'en'>('ar');
    const [isSaving, setIsSaving] = React.useState(false);
    
    // Form State
    const [tempTitle, setTempTitle] = React.useState('');
    const [tempContent, setTempContent] = React.useState('');

    const fetchPages = React.useCallback(async () => {
        try {
            const data = await contentService.getAllPages();
            setPages(data);
        } catch (error) {
            console.error('Failed to load content pages:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    React.useEffect(() => {
        fetchPages();
    }, [fetchPages]);

    const openEditor = (page: any, mode: 'ar' | 'en') => {
        setSelectedPage(page);
        setEditMode(mode);
        setTempTitle(mode === 'ar' ? page.title_ar : page.title_en);
        setTempContent(mode === 'ar' ? page.content_ar : page.content_en);
        setIsEditModalVisible(true);
    };

    const handleSave = async () => {
        if (!selectedPage) return;
        setIsSaving(true);
        try {
            const updates = editMode === 'ar' 
                ? { title_ar: tempTitle, content_ar: tempContent }
                : { title_en: tempTitle, content_en: tempContent };
            
            await contentService.savePage(selectedPage.slug, updates);
            setIsEditModalVisible(false);
            fetchPages();
        } catch (error) {
            Alert.alert('Error', 'Failed to save changes.');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading && !refreshing) {
        return (
            <View style={[styles.loading, { backgroundColor: '#0f172a' }]}>
                <ActivityIndicator size="large" color="#38bdf8" />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: '#0f172a' }]}>
            <ScrollView 
                style={styles.scrollView}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchPages(); }} tintColor="#38bdf8" />}
            >
                <View style={styles.header}>
                    <Text style={styles.pageTitle}>{t('admin.contentManagement')}</Text>
                    <Text style={styles.pageSubtitle}>Dynamic system page distribution</Text>
                </View>

                {pages.map((page) => (
                    <Card key={page.id} style={styles.pageCard}>
                        <LinearGradient colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']} style={styles.cardInner}>
                            <View style={styles.cardHeader}>
                                <View style={[styles.iconBox, { backgroundColor: '#06b6d420' }]}>
                                    <Ionicons name="document-text" size={18} color="#06b6d4" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.cardTitle}>{page.title_en} / {page.title_ar}</Text>
                                    <Text style={styles.slugText}>SLUG: {page.slug.toUpperCase()}</Text>
                                </View>
                                <View style={[styles.statusIndicator, { backgroundColor: page.is_published ? '#22c55e' : '#f43f5e' }]} />
                            </View>

                            <View style={styles.buttonRow}>
                                <TouchableOpacity style={[styles.editBtn, { borderLeftColor: '#38bdf8' }]} onPress={() => openEditor(page, 'ar')}>
                                    <Text style={styles.editBtnText}>Edit Arabic</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.editBtn, { borderLeftColor: '#06b6d4' }]} onPress={() => openEditor(page, 'en')}>
                                    <Text style={styles.editBtnText}>Edit English</Text>
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                    </Card>
                ))}
            </ScrollView>

            <Modal visible={isEditModalVisible} onClose={() => setIsEditModalVisible(false)} title="CMS Professional Editor">
                <View style={[styles.modalContent, { backgroundColor: '#1e293b' }]}>
                    <Text style={styles.modalSub}>Editing buffer for {selectedPage?.slug} [{editMode.toUpperCase()}]</Text>
                    
                    <Input label="External Page Title" value={tempTitle} onChangeText={setTempTitle} dark />
                    <Input label="Page Payload (Markdown)" value={tempContent} onChangeText={setTempContent} multiline numberOfLines={10} dark />
                    
                    <Button title="Sync & Publish" onPress={handleSave} loading={isSaving} fullWidth style={{ marginTop: 20 }} />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollView: { flex: 1 },
    header: { padding: 25, paddingTop: 40, marginBottom: 10 },
    pageTitle: { color: '#fff', fontSize: 28, fontWeight: '800' },
    pageSubtitle: { color: '#94a3b8', fontSize: 13, marginTop: 4 },
    pageCard: { marginHorizontal: 20, marginVertical: 8, padding: 0, borderRadius: 25, overflow: 'hidden' },
    cardInner: { padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    cardTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
    slugText: { color: '#64748b', fontSize: 10, fontWeight: '800', marginTop: 2 },
    statusIndicator: { width: 8, height: 8, borderRadius: 4 },
    buttonRow: { flexDirection: 'row', gap: 12 },
    editBtn: { flex: 1, backgroundColor: 'rgba(255,255,255,0.02)', paddingVertical: 12, alignItems: 'center', borderRadius: 12, borderLeftWidth: 3 },
    editBtnText: { color: '#94a3b8', fontSize: 12, fontWeight: '700' },
    modalContent: { padding: 20, borderRadius: 30 },
    modalSub: { color: '#94a3b8', fontSize: 12, textAlign: 'center', marginBottom: 25 }
});