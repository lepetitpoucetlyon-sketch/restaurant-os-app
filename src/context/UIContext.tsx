"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';

export interface RestaurantSettings {
    name: string;
    address: string;
    phone: string;
    email: string;
    siret: string;
    tvaRate: number;
    currency: string;
    theme: 'light' | 'dark' | 'auto';
    notificationsEnabled: boolean;
    lowStockThreshold: number;
    autoLogoutMinutes: number;
    pmsEnabled: boolean;
}

const DEFAULT_SETTINGS: RestaurantSettings = {
    name: "Restaurant Executive",
    address: "123 Avenue des Champs-Élysées, 75008 Paris",
    phone: "+33 1 23 45 67 89",
    email: "contact@restaurant-executive.fr",
    siret: "123 456 789 00012",
    tvaRate: 10,
    currency: "EUR",
    theme: 'light',
    notificationsEnabled: true,
    lowStockThreshold: 20,
    autoLogoutMinutes: 30,
    pmsEnabled: false
};

interface UIContextType {
    isSidebarCollapsed: boolean;
    toggleSidebar: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
    isMobileMenuOpen: boolean;
    toggleMobileMenu: () => void;
    closeMobileMenu: () => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    isDocumentationOpen: boolean;
    documentationCategory: string | null;
    openDocumentation: (category?: string) => void;
    closeDocumentation: () => void;
    settings: RestaurantSettings;
    saveSettings: (newSettings: RestaurantSettings) => void;
    isLaunchpadOpen: boolean;
    setIsLaunchpadOpen: (open: boolean) => void;
    toggleLaunchpad: () => void;
    isCommandOpen: boolean;
    openCommandPalette: () => void;
    closeCommandPalette: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [isDocumentationOpen, setIsDocumentationOpen] = useState(false);
    const [documentationCategory, setDocumentationCategory] = useState<string | null>(null);
    const [settings, setSettings] = useState<RestaurantSettings>(DEFAULT_SETTINGS);
    const [isLaunchpadOpen, setIsLaunchpadOpen] = useState(false);
    const [isCommandOpen, setIsCommandOpen] = useState(false);

    // Stable callbacks with useCallback
    const toggleSidebar = useCallback(() => setIsSidebarCollapsed(prev => !prev), []);
    const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen(prev => !prev), []);
    const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);
    // Forced Light Mode toggle (disabled)
    const toggleTheme = useCallback(() => setTheme('light'), []);
    const toggleLaunchpad = useCallback(() => setIsLaunchpadOpen(prev => !prev), []);
    const openCommandPalette = useCallback(() => setIsCommandOpen(true), []);
    const closeCommandPalette = useCallback(() => setIsCommandOpen(false), []);

    const openDocumentation = useCallback((category?: string) => {
        if (category) setDocumentationCategory(category);
        setIsDocumentationOpen(true);
    }, []);

    const closeDocumentation = useCallback(() => {
        setIsDocumentationOpen(false);
        setDocumentationCategory(null);
    }, []);

    const saveSettings = useCallback((newSettings: RestaurantSettings) => {
        setSettings({ ...newSettings, theme: 'light' });
        localStorage.setItem('restaurant-os-ui-prefs', JSON.stringify({ ...newSettings, theme: 'light' }));
    }, []);

    useEffect(() => {
        const savedSettings = localStorage.getItem('restaurant-os-ui-prefs');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                setSettings({ ...DEFAULT_SETTINGS, ...parsed, theme: 'light' });
                // FORCED LIGHT MODE: Ignore stored theme
                setTheme('light');
            } catch (e) {
                console.error("Failed to parse settings", e);
            }
        } else {
            setTheme('light');
        }
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('dark');
        root.classList.add('light');
    }, []);

    // Memoize context value
    const contextValue = useMemo(() => ({
        isSidebarCollapsed,
        toggleSidebar,
        setSidebarCollapsed: setIsSidebarCollapsed,
        isMobileMenuOpen,
        toggleMobileMenu,
        closeMobileMenu,
        theme,
        toggleTheme,
        isDocumentationOpen,
        documentationCategory,
        openDocumentation,
        closeDocumentation,
        settings,
        saveSettings,
        isLaunchpadOpen,
        setIsLaunchpadOpen,
        toggleLaunchpad,
        isCommandOpen,
        openCommandPalette,
        closeCommandPalette
    }), [
        isSidebarCollapsed,
        toggleSidebar,
        setIsSidebarCollapsed,
        isMobileMenuOpen,
        toggleMobileMenu,
        closeMobileMenu,
        theme,
        toggleTheme,
        isDocumentationOpen,
        documentationCategory,
        openDocumentation,
        closeDocumentation,
        settings,
        saveSettings,
        isLaunchpadOpen,
        setIsLaunchpadOpen,
        toggleLaunchpad,
        isCommandOpen,
        openCommandPalette,
        closeCommandPalette
    ]);

    return (
        <UIContext.Provider value={contextValue}>
            {children}
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (!context) throw new Error('useUI must be used within UIProvider');
    return context;
}
