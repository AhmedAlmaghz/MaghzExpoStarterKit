import { useEffect } from 'react';
import { useRouter } from 'expo-router';

/**
 * Root Index
 * 
 * Redirects the root path (/) to the main application group.
 * Using a useEffect for more reliable redirection during app startup.
 */
export default function RootIndex() {
    const router = useRouter();

    useEffect(() => {
        // Short delay to ensure the router is mounted and ready
        const timer = setTimeout(() => {
            router.replace('/(main)');
        }, 10);
        return () => clearTimeout(timer);
    }, []);

    return null;
}
