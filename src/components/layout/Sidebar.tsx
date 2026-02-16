"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AppLaunchpad } from "./AppLaunchpad";
import { NAV_SECTIONS } from "@/config/navigation";
import {
    LayoutDashboard,
    Map,
    CalendarDays,
    ChefHat,
    Package,
    Users,
    ClipboardCheck,
    BarChart3,
    Calculator,
    Settings,
    Sparkles,
    LogOut,
    CalendarRange,
    Menu,
    UserCog,
    LucideIcon,
    Globe,
    Instagram,
    Bot,
    Heart,
    Wine,
    ChevronDown,
    ChevronRight,
    ChevronLeft,
    Utensils,
    TrendingUp,
    Briefcase,
    Shield,
    X,
    Wallet,
    Book,
    BookOpen,
    FileText,
    Scale,
    Refrigerator,
    ReceiptEuro,
    Layers,
} from "lucide-react";
import { useAuth, CategoryKey, ROLE_LABELS } from "@/context/AuthContext";
import { useUI } from "@/context/UIContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/ui/Toast";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { accordionContent } from "@/lib/motion";
import { useEffect, useRef } from "react";
import { ExpenseClaimDialog } from "@/components/accounting/ExpenseClaimDialog";


const sidebarReveal: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1] as any,
            staggerChildren: 0.05,
            delayChildren: 0.1
        }
    }
};

const navItemReveal: Variants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any }
    }
};

export function Sidebar() {
    const pathname = usePathname();
    const { currentUser, logout, hasAccess } = useAuth();
    const { showToast } = useToast();
    const { t } = useLanguage();
    const { isSidebarCollapsed, toggleSidebar, setSidebarCollapsed, isMobileMenuOpen, closeMobileMenu, settings, openDocumentation } = useUI();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [expandedSections, setExpandedSections] = useState<string[]>(['main', 'intelligence', 'operations', 'clients', 'production', 'team', 'analytics', 'finance', 'accounting', 'admin']);

    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const { isLaunchpadOpen, setIsLaunchpadOpen } = useUI();
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);
    const isLongPress = useRef(false);

    const handleButtonPressStart = () => {
        isLongPress.current = false;
        longPressTimer.current = setTimeout(() => {
            isLongPress.current = true;
            setIsLaunchpadOpen(true);
        }, 500); // 500ms for long press
    };

    const handleButtonPressEnd = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };

    const handleLogoClick = () => {
        if (isLongPress.current) return;
        toggleSidebar();
    };


    // Close mobile menu and collapse sidebar on navigation
    useEffect(() => {
        closeMobileMenu();
        setSidebarCollapsed(true);
    }, [pathname, closeMobileMenu, setSidebarCollapsed]);

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    // Filter out PMS if not enabled
    const filteredNavSections = NAV_SECTIONS.map(section => ({
        ...section,
        items: section.items.filter(item => {
            if (item.href === '/pms' && !settings.pmsEnabled) return false;
            return hasAccess(item.category);
        })
    })).filter(section => section.items.length > 0);

    const accessibleSections = filteredNavSections;

    let globalIndex = 0;

    return (
        <>
            <motion.aside
                initial="hidden"
                animate="visible"
                variants={sidebarReveal}
                className={cn(
                    "h-screen bg-bg-secondary border-r border-border flex-col fixed left-0 top-0 z-50 transition-all duration-500 will-change-transform",
                    isMobileMenuOpen ? "flex shadow-2xl w-[280px]" : "hidden lg:flex",
                    !isMobileMenuOpen && (isSidebarCollapsed ? "w-[72px]" : "w-[240px]")
                )}
            >
                {/* Logo Area - Museum Branding */}
                <div className={cn(
                    "flex items-center transition-all duration-700",
                    isSidebarCollapsed && !isMobileMenuOpen ? "p-4 justify-center" : "p-8 justify-between"
                )}>
                    {isMobileMenuOpen && (
                        <button
                            onClick={closeMobileMenu}
                            className="lg:hidden p-2 -ml-2 text-text-muted hover:text-text-primary transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                    <motion.button
                        variants={navItemReveal}
                        onMouseDown={handleButtonPressStart}
                        onMouseUp={handleButtonPressEnd}
                        onMouseLeave={handleButtonPressEnd}
                        onTouchStart={handleButtonPressStart}
                        onTouchEnd={handleButtonPressEnd}
                        onClick={handleLogoClick}
                        className={cn(
                            "flex items-center gap-4 w-full group cursor-pointer text-left outline-none",
                            isSidebarCollapsed ? "justify-center p-0" : "p-0"
                        )}
                    >

                        {isSidebarCollapsed && !isMobileMenuOpen ? (
                            <motion.div
                                initial={{ scale: 0.8, rotate: 180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                whileHover={{ scale: 1.1, x: 2 }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="w-10 h-10 rounded-xl bg-text-primary dark:bg-accent-gold/10 text-accent-gold flex items-center justify-center transition-all border border-accent-gold/20 shadow-[0_0_20px_rgba(197,160,89,0.1)]"
                            >
                                <ChevronRight strokeWidth={2} className="w-5 h-5" />
                            </motion.div>
                        ) : (
                            <>
                                <motion.div
                                    layoutId="sidebar-logo"
                                    initial={{ rotate: 0 }}
                                    animate={{ rotate: 0 }}
                                    whileHover={{ scale: 1.05, x: -2 }}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className="w-10 h-10 rounded-xl bg-text-primary dark:bg-accent-gold/10 text-accent-gold flex items-center justify-center border border-accent-gold/20 shadow-premium shrink-0 transition-transform relative"
                                >
                                    <ChevronLeft strokeWidth={2} className="w-5 h-5" />
                                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-accent-gold border-2 border-bg-secondary shadow-glow" />
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="overflow-hidden flex-1 min-w-0"
                                >
                                    <h1 className="font-serif font-black text-lg text-text-primary tracking-tight leading-none italic">
                                        {t('sidebar.resto')} <span className="text-accent-gold not-italic">{t('sidebar.os')}</span>
                                    </h1>
                                    <p className="text-[7px] uppercase tracking-[0.4em] text-accent-gold font-black mt-1.5 whitespace-nowrap overflow-hidden text-ellipsis leading-none opacity-60">
                                        {t('nav.executive_intelligence')}
                                    </p>
                                </motion.div>
                            </>
                        )}
                    </motion.button>

                    {/* Mobile Close Button */}
                    {isMobileMenuOpen && (
                        <button
                            onClick={closeMobileMenu}
                            className="lg:hidden p-2 text-text-muted hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-all ml-4"
                        >
                            <X strokeWidth={1.5} className="w-5 h-5" />
                        </button>
                    )}
                </div>


                {/* Navigation */}
                <nav
                    className={cn(
                        "flex-1 py-4 space-y-1 relative elegant-scrollbar overflow-y-auto scrollbar-hide",
                        (isSidebarCollapsed && !isMobileMenuOpen) ? "px-0" : "px-4"
                    )}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    {accessibleSections.map((section) => {
                        const isExpanded = expandedSections.includes(section.id) || isSidebarCollapsed;
                        const SectionIcon = section.icon;
                        const hasActiveItem = section.items.some(item => pathname === item.href);

                        return (
                            <motion.div
                                key={section.id}
                                className="mb-6"
                                variants={navItemReveal}
                            >
                                {/* Section Header */}
                                {!(isSidebarCollapsed && !isMobileMenuOpen) && (
                                    <button
                                        onClick={() => toggleSection(section.id)}
                                        className={cn(
                                            "w-full flex items-center justify-between px-3 py-1.5 rounded-lg transition-all group outline-none mb-1",
                                            hasActiveItem ? "text-text-primary" : "text-text-muted hover:text-text-secondary"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: section.color }} />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted dark:text-text-primary/80 group-hover:text-text-primary dark:group-hover:text-text-primary transition-all">
                                                {t(`nav.${section.key}`)}
                                            </span>
                                        </div>
                                        <motion.div
                                            animate={{ rotate: isExpanded ? 0 : -90, opacity: isExpanded ? 1 : 0.4 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ChevronDown strokeWidth={2.5} className="w-3.5 h-3.5" />
                                        </motion.div>
                                    </button>
                                )}


                                {/* Section Items */}
                                <AnimatePresence initial={false}>
                                    {(isExpanded || (isSidebarCollapsed && !isMobileMenuOpen)) && (
                                        <motion.div
                                            initial={isSidebarCollapsed ? false : "hidden"}
                                            animate={isSidebarCollapsed ? false : "visible"}
                                            exit="hidden"
                                            variants={accordionContent}
                                            className={cn(
                                                "overflow-hidden",
                                                !(isSidebarCollapsed && !isMobileMenuOpen) && "mt-1"
                                            )}
                                        >
                                            <div className="space-y-1">
                                                {section.items.map((item) => {
                                                    const isReallyCollapsed = isSidebarCollapsed && !isMobileMenuOpen;
                                                    const currentIndex = globalIndex++;
                                                    const isActive = pathname === item.href;
                                                    const Icon = item.icon;

                                                    return (
                                                        <div key={item.href} className="relative group">
                                                            <Link
                                                                href={item.href}
                                                                data-tutorial={`nav-${item.key}`}
                                                                onMouseEnter={() => setHoveredIndex(currentIndex)}
                                                                className={cn(
                                                                    "flex items-center rounded-2xl text-[13px] font-medium transition-all duration-700 relative overflow-hidden outline-none",
                                                                    isActive
                                                                        ? "text-text-primary dark:text-text-primary font-bold bg-bg-secondary dark:bg-white/10 border border-border/50 dark:border-white/10 shadow-premium"
                                                                        : "text-text-secondary dark:text-text-primary/80 hover:text-text-primary dark:hover:text-text-primary hover:bg-bg-tertiary/50 dark:hover:bg-white/5",
                                                                    isReallyCollapsed
                                                                        ? "justify-center h-12 w-12 mx-auto"
                                                                        : "px-5 py-3.5 gap-4 mx-0"
                                                                )}
                                                            >
                                                                {isActive && !isReallyCollapsed && (
                                                                    <motion.div
                                                                        layoutId="active-nav-indicator"
                                                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent-gold rounded-r-full z-20"
                                                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                                                    />
                                                                )}

                                                                <div className={cn(
                                                                    "relative z-10 flex items-center",
                                                                    isReallyCollapsed ? "justify-center" : "gap-4 w-full"
                                                                )}>
                                                                    <div className={cn(
                                                                        "transition-all duration-700 p-2 rounded-xl",
                                                                        isActive
                                                                            ? "bg-accent-gold/10 text-accent-gold scale-110 shadow-inner"
                                                                            : "text-text-muted group-hover:text-text-primary group-hover:scale-110"
                                                                    )}>
                                                                        <Icon strokeWidth={isActive ? 2 : 1.5} className="w-[18px] h-[18px]" />
                                                                    </div>

                                                                    {!isReallyCollapsed && (
                                                                        <span className={cn(
                                                                            "tracking-tight transition-colors duration-700 font-serif italic text-lg font-bold leading-none py-1",
                                                                            isActive ? "text-text-primary" : "text-text-secondary dark:text-text-primary/90"
                                                                        )}>
                                                                            {t(`nav.${item.key}`)}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </Link>

                                                            {/* Hover Bubble (Collapsed Mode) */}
                                                            {isReallyCollapsed && hoveredIndex === currentIndex && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, x: 10, scale: 0.95, filter: "blur(4px)" }}
                                                                    animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
                                                                    exit={{ opacity: 0, x: 10, scale: 0.95, filter: "blur(4px)" }}
                                                                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                                                    className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-text-primary dark:bg-bg-secondary text-bg-primary dark:text-text-primary text-[11px] font-black uppercase tracking-widest rounded-xl z-[100] shadow-2xl border border-border/50 dark:border-border/50"
                                                                >
                                                                    {t(`nav.${item.key}`)}
                                                                </motion.div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </nav>

                {/* Quick Actions Footer - Archive Protocol */}
                <div className={cn("px-4 pb-4 border-b border-border/30", isSidebarCollapsed && "px-2")}>


                    <motion.button
                        variants={navItemReveal}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsExpenseModalOpen(true)}
                        className={cn(
                            "w-full flex items-center gap-3 p-4 rounded-2xl transition-all duration-500 group outline-none",
                            "bg-accent-gold/5 hover:bg-accent-gold text-accent-gold hover:text-white border border-accent-gold/20 hover:border-transparent shadow-premium",
                            isSidebarCollapsed && "justify-center"
                        )}
                    >
                        <ReceiptEuro strokeWidth={1.5} className="w-5 h-5 shrink-0 group-hover:rotate-12 transition-transform duration-500" />
                        {!isSidebarCollapsed && (
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] truncate">{t('sidebar.expense_claim')}</span>
                        )}
                    </motion.button>
                </div>

                {/* Footer User Profile - Museum Tier */}
                <motion.div
                    variants={navItemReveal}
                    className={cn(
                        "p-6 border-t border-border/40 bg-bg-tertiary/20 dark:bg-black/40 backdrop-blur-md",
                        isSidebarCollapsed ? "px-2" : "p-8"
                    )}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5 w-full relative group">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="w-12 h-12 rounded-[18px] bg-bg-secondary dark:bg-bg-tertiary/50 border border-border/40 flex items-center justify-center text-accent-gold text-sm font-black shrink-0 shadow-premium cursor-pointer relative overflow-hidden"
                            >
                                {currentUser?.avatar ? (
                                    <img src={currentUser.avatar} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                ) : (
                                    <span className="relative z-10 font-serif italic text-lg">{(currentUser?.name || ' ').trim().charAt(0)}</span>
                                )}
                                <div className="absolute inset-0 rounded-2xl bg-accent-gold/5 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.div>
                            {!isSidebarCollapsed && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col overflow-hidden flex-1"
                                >
                                    <span className="text-[13px] font-black text-text-primary truncate uppercase tracking-tight font-sans">{currentUser?.name}</span>
                                    <span className="text-[9px] text-accent-gold/60 truncate font-black uppercase tracking-[0.3em] mt-1 group-hover:text-accent-gold transition-colors">
                                        {currentUser?.role ? ROLE_LABELS[currentUser.role] : t('sidebar.admin_fallback')}
                                    </span>
                                </motion.div>
                            )}
                            {!isSidebarCollapsed && (
                                <motion.button
                                    whileHover={{ scale: 1.2, x: 2, color: "#EF4444" }}
                                    whileTap={{ scale: 0.8 }}
                                    onClick={logout}
                                    className="p-2 text-text-muted hover:text-error transition-all duration-500"
                                    title={t('sidebar.logout')}
                                >
                                    <LogOut strokeWidth={2.5} className="w-4 h-4" />
                                </motion.button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.aside>

            {/* Floating Sidebar Open Button - Appears when sidebar is collapsed */}
            <AnimatePresence>
                {isSidebarCollapsed && !isMobileMenuOpen && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8, x: -20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: -20 }}
                        whileHover={{ scale: 1.1, x: 4 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        onClick={toggleSidebar}
                        className="hidden lg:flex fixed top-8 left-[88px] z-40 w-10 h-10 rounded-xl bg-bg-secondary text-accent-gold items-center justify-center border border-accent-gold/20 shadow-premium cursor-pointer hover:shadow-glow transition-shadow"
                        title="Ouvrir le menu"
                    >
                        <ChevronRight strokeWidth={2} className="w-5 h-5" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Modals integrated into sidebar for global access but rendered outside aside to avoid layout constraints */}
            <ExpenseClaimDialog isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} />
            <AppLaunchpad isOpen={isLaunchpadOpen} onClose={() => setIsLaunchpadOpen(false)} sections={filteredNavSections} />
        </>
    );
}
