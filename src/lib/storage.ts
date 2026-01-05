/**
 * STORAGE UTILITY - Restaurant OS
 * Namespaced localStorage wrapper to avoid conflicts with other apps
 */

const NAMESPACE = 'executive_os_';

export const storage = {
    /**
     * Get a value from localStorage with namespace prefix
     */
    get: (key: string): string | null => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(NAMESPACE + key);
    },

    /**
     * Set a value in localStorage with namespace prefix
     */
    set: (key: string, value: string): void => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(NAMESPACE + key, value);
    },

    /**
     * Remove a value from localStorage
     */
    remove: (key: string): void => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(NAMESPACE + key);
    },

    /**
     * Get and parse JSON from localStorage
     */
    getJSON: <T>(key: string): T | null => {
        const value = storage.get(key);
        if (!value) return null;
        try {
            return JSON.parse(value) as T;
        } catch {
            return null;
        }
    },

    /**
     * Stringify and set JSON in localStorage
     */
    setJSON: <T>(key: string, value: T): void => {
        storage.set(key, JSON.stringify(value));
    },

    /**
     * Check if a key exists
     */
    has: (key: string): boolean => {
        return storage.get(key) !== null;
    },

    /**
     * Clear all namespaced keys
     */
    clearAll: (): void => {
        if (typeof window === 'undefined') return;
        const keys = Object.keys(localStorage).filter(k => k.startsWith(NAMESPACE));
        keys.forEach(k => localStorage.removeItem(k));
    }
};

// Keys used by the application
export const STORAGE_KEYS = {
    USER_SESSION: 'user_session',
    RESERVATIONS: 'reservations',
    CUSTOMERS: 'customers',
    INVENTORY: 'inventory',
    SUPPLIER_ORDERS: 'supplier_orders',
    SHIFTS: 'shifts',
    FLOOR_PLAN: 'floor_plan',
    NOTIFICATIONS: 'notifications',
} as const;
