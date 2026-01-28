'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language } from '@/i18n/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('fr');

    // Load saved language from localStorage on mount
    useEffect(() => {
        const savedLang = localStorage.getItem('restaurant-os-lang') as Language;
        if (savedLang && translations[savedLang]) {
            setLanguageState(savedLang);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('restaurant-os-lang', lang);

        // Update document lang attribute
        document.documentElement.lang = lang;
    };

    // Translation function
    const t = (path: string): string => {
        const keys = path.split('.');
        let current: any = translations[language];

        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            } else {
                // Fallback to French if key not found
                console.warn(`Translation missing for key: ${path} in language: ${language}`);

                // Try fallback to french
                let fallback: any = translations['fr'];
                for (const fbKey of keys) {
                    if (fallback && typeof fallback === 'object' && fbKey in fallback) {
                        fallback = fallback[fbKey];
                    } else {
                        return path; // Return key if not found in fallback either
                    }
                }
                return fallback as string;
            }
        }

        return current as string;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
