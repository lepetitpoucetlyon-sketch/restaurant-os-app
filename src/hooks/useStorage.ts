"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseLocalStorageOptions<T> {
    serializer?: (value: T) => string;
    deserializer?: (value: string) => T;
}

/**
 * Hook pour persister des valeurs dans le localStorage.
 * 
 * @example
 * const [theme, setTheme] = useLocalStorage('theme', 'light');
 */
export function useLocalStorage<T>(
    key: string,
    initialValue: T,
    options: UseLocalStorageOptions<T> = {}
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
    const {
        serializer = JSON.stringify,
        deserializer = JSON.parse,
    } = options;

    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === "undefined") {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            return item ? deserializer(item) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = useCallback(
        (value: T | ((prev: T) => T)) => {
            try {
                const valueToStore = value instanceof Function ? value(storedValue) : value;
                setStoredValue(valueToStore);
                if (typeof window !== "undefined") {
                    window.localStorage.setItem(key, serializer(valueToStore));
                }
            } catch (error) {
                console.warn(`Error setting localStorage key "${key}":`, error);
            }
        },
        [key, storedValue, serializer]
    );

    const removeValue = useCallback(() => {
        try {
            setStoredValue(initialValue);
            if (typeof window !== "undefined") {
                window.localStorage.removeItem(key);
            }
        } catch (error) {
            console.warn(`Error removing localStorage key "${key}":`, error);
        }
    }, [key, initialValue]);

    return [storedValue, setValue, removeValue];
}

/**
 * Hook pour persister des valeurs dans sessionStorage.
 */
export function useSessionStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === "undefined") {
            return initialValue;
        }

        try {
            const item = window.sessionStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Error reading sessionStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = useCallback(
        (value: T | ((prev: T) => T)) => {
            try {
                const valueToStore = value instanceof Function ? value(storedValue) : value;
                setStoredValue(valueToStore);
                if (typeof window !== "undefined") {
                    window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
                }
            } catch (error) {
                console.warn(`Error setting sessionStorage key "${key}":`, error);
            }
        },
        [key, storedValue]
    );

    return [storedValue, setValue];
}
