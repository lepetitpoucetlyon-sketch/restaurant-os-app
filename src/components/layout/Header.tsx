"use client";
// Force re-compile: Header fixed

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Bell, Search, Wifi, Settings, HelpCircle, ChevronRight, Globe, Command, Sparkles, Menu, BookOpen } from "lucide-react";
import { useUI } from "@/context/UIContext";
import { useAuth, ROLE_LABELS } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationsContext";
import { motion, AnimatePresence } from "framer-motion";
import { CommandModal } from "@/components/ui/CommandModal";
import { NotificationPanel } from "@/components/ui/NotificationPanel";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useContextualSettings } from "@/components/settings/ContextualSettings";
import { PageKey } from "@/types/permissions.types";
import { LANGUAGES } from "@/config/languages";
import { cn } from "@/lib/utils";

export function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const { currentUser } = useAuth();
    const { unreadCount } = useNotifications();
    const { theme, toggleTheme, toggleMobileMenu, openDocumentation, isCommandOpen, openCommandPalette, closeCommandPalette, toggleLaunchpad } = useUI();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    const { openSettings, getPageSettings, canAccessSetting } = useContextualSettings();

    // Map pathname to PageKey for contextual settings
    const getPageKeyFromPath = (path: string): PageKey | null => {
        const segment = path.split('/').filter(Boolean)[0] || 'dashboard';
        const pathToPageKey: Record<string, PageKey> = {
            '': 'dashboard',
            'dashboard': 'dashboard',
            'floor-plan': 'floor_plan',
            'reservations': 'reservations',
            'omnichannel-reservations': 'reservations',
            'quotes': 'reservations',
            'pms': 'reservations',
            'pos': 'pos',
            'kitchen': 'kitchen',
            'kds': 'kds',
            'inventory': 'inventory',
            'storage-map': 'storage_map',
            'crm': 'crm',
            'staff': 'staff',
            'planning': 'planning',
            'leaves': 'leaves',
            'finance': 'finance',
            'accounting': 'finance',
            'analytics': 'analytics',
            'analytics-integration': 'analytics',
            'intelligence': 'analytics',
            'haccp': 'haccp',
            'quality': 'haccp',
            'groups': 'groups',
            'seo': 'seo',
            'ai-referencing': 'seo',
            'social-marketing': 'seo',
            'bar': 'bar',
            'settings': 'settings',
            'account-settings': 'settings',
            'onboarding': 'staff',
        };
        return pathToPageKey[segment] || null;
    };

    const currentPageKey = getPageKeyFromPath(pathname);
    const pageSettings = currentPageKey ? getPageSettings(currentPageKey) : null;
    const hasAccessToSettings = pageSettings ? pageSettings.settings.some(canAccessSetting) : false;

    const pathSegments = pathname.split("/").filter(Boolean);
    const title = pathSegments.length > 0
        ? (pathSegments[0] || '').charAt(0).toUpperCase() + pathSegments[0].slice(1).replace("-", " ")
        : "Tableau de Bord";

    // Global keyboard shortcut for Cmd+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                isCommandOpen ? closeCommandPalette() : openCommandPalette();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isCommandOpen, openCommandPalette, closeCommandPalette]);


    const { t, language, setLanguage } = useLanguage();
    const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES.find(l => l.code === language) || LANGUAGES[0]);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

    // Sync local state with context
    useEffect(() => {
        const lang = LANGUAGES.find(l => l.code === language);
        if (lang) setSelectedLanguage(lang);
    }, [language]);

    // Close lang menu on click outside
    useEffect(() => {
        const handleClickOutside = () => setIsLangMenuOpen(false);
        if (isLangMenuOpen) document.addEventListener('click', handleClickOutside);
        else document.removeEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isLangMenuOpen]);

    return (
        <>
            <header className="hidden md:flex h-[100px] bg-white/70 dark:bg-black/70 backdrop-blur-3xl border-b border-border/50 sticky top-0 z-[40] px-16 items-center justify-between transition-all duration-700">
                {/* Visual Architecture Background */}
                <div className="absolute top-0 right-1/4 w-[40%] h-full bg-accent-gold/5 blur-[100px] pointer-events-none opacity-50" />
                <div className="absolute top-0 left-1/4 w-[30%] h-full bg-accent/5 blur-[80px] pointer-events-none opacity-30" />

                <div className="flex items-center gap-10 relative z-10">
                    <button
                        onClick={toggleMobileMenu}
                        className="hidden lg:hidden p-3 text-text-primary hover:bg-bg-tertiary rounded-2xl transition-all border border-transparent hover:border-border/50 shadow-soft"
                    >
                        <Menu strokeWidth={1.5} className="w-6 h-6" />
                    </button>

                    <div className="hidden md:flex flex-col">
                        <nav className="flex items-center gap-4 mb-3 opacity-40 hover:opacity-100 transition-all cursor-default hidden">
                        </nav>
                        <div className="flex items-center gap-8">
                            <h1 className="text-3xl md:text-4xl font-serif font-black text-text-primary tracking-tighter leading-none italic group cursor-default">
                                {title}<span className="text-accent-gold not-italic">.</span>
                                <div className="h-0.5 w-0 group-hover:w-full bg-accent-gold transition-all duration-700 mt-1 shadow-glow" />
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Unified Status Hub Gallery */}
                <div className="flex items-center gap-2 md:gap-4 relative z-10">
                    {/* Status Hub Gallery */}
                    <div className="hidden md:flex items-center gap-3 bg-white/80 dark:bg-black/80 backdrop-blur-2xl p-2 rounded-full border border-white/20 dark:border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] ring-1 ring-black/5 dark:ring-white/5">

                        {/* 1. Search Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={openCommandPalette}
                            className="relative w-11 h-11 flex items-center justify-center group"
                        >
                            <div className="absolute inset-0 rounded-full bg-neutral-100/50 dark:bg-neutral-800/50 border border-transparent group-hover:border-accent-gold/30 transition-all duration-500 group-hover:shadow-[0_0_15px_rgba(197,160,89,0.15)]" />
                            <div className="absolute inset-[3px] rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 shadow-sm" />
                            <Search strokeWidth={1.5} className="relative z-10 w-5 h-5 text-neutral-500 dark:text-neutral-400 group-hover:text-accent-gold transition-colors duration-300" />
                        </motion.button>

                        <div className="w-px h-6 bg-neutral-200 dark:bg-white/10 mx-1" />

                        {/* 2. Language Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                            className="relative w-11 h-11 flex items-center justify-center group"
                        >
                            <div className="absolute inset-0 rounded-full bg-neutral-100/50 dark:bg-neutral-800/50 border border-transparent group-hover:border-accent-gold/30 transition-all duration-500 group-hover:shadow-[0_0_15px_rgba(197,160,89,0.15)]" />
                            <div className="absolute inset-[3px] rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 shadow-sm flex items-center justify-center overflow-hidden">
                                <span className="text-lg relative z-10 grayscale group-hover:grayscale-0 transition-all duration-300 transform scale-110">{selectedLanguage?.flag}</span>
                            </div>
                        </motion.button>

                        {/* 4. Notifications Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsNotificationsOpen(true)}
                            className="relative w-11 h-11 flex items-center justify-center group"
                        >
                            <div className="absolute inset-0 rounded-full bg-neutral-100/50 dark:bg-neutral-800/50 border border-transparent group-hover:border-accent-gold/30 transition-all duration-500 group-hover:shadow-[0_0_15px_rgba(197,160,89,0.15)]" />
                            <div className="absolute inset-[3px] rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 shadow-sm" />
                            <Bell strokeWidth={1.5} className="relative z-10 w-5 h-5 text-neutral-500 dark:text-neutral-400 group-hover:text-accent-gold group-hover:rotate-12 transition-all duration-300" />
                            {unreadCount > 0 && (
                                <div className="absolute top-0 right-0 translate-x-1 -translate-y-1 px-1.5 py-0.5 min-w-[20px] bg-red-600 text-white flex items-center justify-center text-[9px] font-black rounded-full border-2 border-white dark:border-bg-primary shadow-sm z-20">
                                    {unreadCount > 99 ? '99' : unreadCount}
                                </div>
                            )}
                        </motion.button>

                        <div className="w-px h-6 bg-neutral-200 dark:bg-white/10 mx-1" />


                        {/* 6. Launchpad Button - Desktop Only */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleLaunchpad}
                            className="relative w-11 h-11 flex items-center justify-center group"
                        >
                            <div className="absolute inset-0 rounded-full bg-neutral-100/50 dark:bg-neutral-800/50 border border-transparent group-hover:border-accent-gold/30 transition-all duration-500 group-hover:shadow-[0_0_15px_rgba(197,160,89,0.15)]" />
                            <div className="absolute inset-[3px] rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 shadow-sm" />
                            <div className="relative z-10 flex flex-wrap gap-0.5 w-4 h-4 items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                                <div className="w-1.5 h-1.5 rounded-[1px] bg-current" />
                                <div className="w-1.5 h-1.5 rounded-[1px] bg-current" />
                                <div className="w-1.5 h-1.5 rounded-[1px] bg-current" />
                                <div className="w-1.5 h-1.5 rounded-[1px] bg-current" />
                            </div>
                        </motion.button>

                        <div className="w-px h-6 bg-neutral-200 dark:bg-white/10 mx-1" />


                        {/* 8. Settings Button */}
                        {currentPageKey && (
                            <motion.button
                                whileHover={hasAccessToSettings ? { scale: 1.05, rotate: 90 } : {}}
                                onClick={() => hasAccessToSettings && currentPageKey && openSettings(currentPageKey)}
                                className={cn(
                                    "relative w-11 h-11 flex items-center justify-center group",
                                    !hasAccessToSettings && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                <div className="absolute inset-0 rounded-full bg-neutral-100/50 dark:bg-neutral-800/50 border border-transparent group-hover:border-accent-gold/30 transition-all duration-500 group-hover:shadow-[0_0_15px_rgba(197,160,89,0.15)]" />
                                <div className="absolute inset-[3px] rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 shadow-sm" />
                                <Settings strokeWidth={1.5} className="relative z-10 w-5 h-5 text-neutral-500 dark:text-neutral-400 group-hover:text-accent-gold transition-colors duration-300" />
                            </motion.button>
                        )}
                    </div>
                </div>
            </header>

            {/* Command Modal */}
            <CommandModal isOpen={isCommandOpen} onClose={closeCommandPalette} />

            {/* Notifications Panel */}
            <NotificationPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
        </>
    );
}

