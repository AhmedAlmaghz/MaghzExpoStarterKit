/**
 * useTranslation Hook
 *
 * Custom hook for accessing translation function and locale info.
 *
 * @module i18n/hooks/useTranslation
 */
import { useI18nStore, type LocaleCode } from '../i18nStore';

/**
 * Hook return type
 */
interface UseTranslationReturn {
    /** Current locale code */
    locale: LocaleCode;
    /** Whether current locale is RTL */
    isRTL: boolean;
    /** Translate a key with optional parameters */
    t: (key: string, params?: Record<string, string | number>) => string;
    /** Set locale */
    setLocale: (locale: LocaleCode) => void;
}

/**
 * Hook for accessing translation function and locale info
 * @returns Translation utilities
 */
export function useTranslation(): UseTranslationReturn {
    const locale = useI18nStore((state) => state.locale);
    const isRTL = useI18nStore((state) => state.isRTL);
    const t = useI18nStore((state) => state.t);
    const setLocale = useI18nStore((state) => state.setLocale);

    return {
        locale,
        isRTL,
        t,
        setLocale,
    };
}