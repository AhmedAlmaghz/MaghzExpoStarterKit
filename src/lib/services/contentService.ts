/**
 * Content Service
 * 
 * Manages public pages like About, Help, Privacy Policy, etc.
 * Supports bilingual content and publishing states.
 * 
 * @module lib/services/contentService
 */
import { supabase } from '@/lib/supabase';
import { TABLES } from '@/lib/supabase';

export const contentService = {
    /**
     * Get all public pages
     */
    async getAllPages() {
        const { data, error } = await supabase
            .from(TABLES.PUBLIC_PAGES)
            .select('*')
            .order('title_en', { ascending: true });

        if (error) throw error;
        return data;
    },

    /**
     * Get a specific page by its slug
     */
    async getPageBySlug(slug: string) {
        const { data, error } = await supabase
            .from(TABLES.PUBLIC_PAGES)
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Update/Create a public page
     */
    async savePage(slug: string, updates: any) {
        const { data, error } = await supabase
            .from(TABLES.PUBLIC_PAGES)
            .upsert({ ...updates, slug, updated_at: new Date().toISOString() })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Delete a public page
     */
    async deletePage(slug: string) {
        const { error } = await supabase
            .from(TABLES.PUBLIC_PAGES)
            .delete()
            .eq('slug', slug);

        if (error) throw error;
    }
};
