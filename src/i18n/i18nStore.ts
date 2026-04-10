/**
 * i18n Store
 *
 * Zustand state management for internationalization.
 * Manages locale selection and provides translation functions.
 *
 * @module i18n/i18nStore
 */
import { create } from 'zustand';
import { storage } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';
import en from './locales/en.json';
import ar from './locales/ar.json';

/**
 * Supported locale codes
 */
export type LocaleCode = 'en' | 'ar';

/**
 * Locale configuration
 */
export interface LocaleConfig {
    code: LocaleCode;
    name: string;
    nativeName: string;
    direction: 'ltr' | 'rtl';
}

/**
 * Available locales configuration
 */
export const LOCALES: Record<LocaleCode, LocaleConfig> = {
    en: {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        direction: 'ltr',
    },
    ar: {
        code: 'ar',
        name: 'Arabic',
        nativeName: 'العربية',
        direction: 'rtl',
    },
};

/**
 * Translation resources
 */
const resources: Record<LocaleCode, typeof en> = { en, ar };

/**
 * Get nested value from object using dot notation path
 * @param obj - Object to search
 * @param path - Dot notation path (e.g., 'auth.login')
 */
function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
    const keys = path.split('.');
    let current: unknown = obj;

    for (const key of keys) {
        if (current === null || current === undefined || typeof current !== 'object') {
            return undefined;
        }
        current = (current as Record<string, unknown>)[key];
    }

    return typeof current === 'string' ? current : undefined;
}

/**
 * i18n state interface
 */
interface I18nState {
    /** Current locale code */
    locale: LocaleCode;
    /** Current locale configuration */
    localeConfig: LocaleConfig;
    /** Whether the current locale is RTL */
    isRTL: boolean;
}

/**
 * i18n actions interface
 */
interface I18nActions {
    /** Set locale */
    setLocale: (locale: LocaleCode) => void;
    /** Translate a key */
    t: (key: string, params?: Record<string, string | number>) => string;
    /** Initialize locale from storage */
    initialize: () => Promise<void>;
}

/**
 * i18n store with Zustand
 */
export const useI18nStore = create<I18nState & I18nActions>((set, get) => ({
    locale: 'en',
    localeConfig: LOCALES.en,
    isRTL: false,

    setLocale: (locale: LocaleCode) => {
        const localeConfig = LOCALES[locale];
        set({
            locale,
            localeConfig,
            isRTL: !!(localeConfig.direction === 'rtl'),
        });
        storage.setItem(STORAGE_KEYS.LOCALE, locale);
    },

    t: (key: string, params?: Record<string, string | number>): string => {
        const { locale } = get();
        const translations = resources[locale];

        let value = getNestedValue(translations as unknown as Record<string, unknown>, key);

        // Fallback to English if translation not found
        if (value === undefined) {
            value = getNestedValue(resources.en as unknown as Record<string, unknown>, key);
        }

        // Return key if no translation found
        if (value === undefined) {
            return key;
        }

        // Replace parameters in translation string
        if (params) {
            return Object.entries(params).reduce(
                (str, [paramKey, paramValue]) => str.replace(`{{${paramKey}}}`, String(paramValue)),
                value
            );
        }

        return String(value);
    },

    initialize: async () => {
        const savedLocale = await storage.getItem<LocaleCode>(STORAGE_KEYS.LOCALE);
        if (savedLocale && LOCALES[savedLocale]) {
            const localeConfig = LOCALES[savedLocale];
            set({
                locale: savedLocale,
                localeConfig,
                isRTL: !!(localeConfig.direction === 'rtl'),
            });
        }
    },
}));