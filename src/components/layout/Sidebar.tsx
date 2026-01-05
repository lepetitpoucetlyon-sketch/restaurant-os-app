"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Store,
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
    Utensils,
    TrendingUp,
    Briefcase,
    Shield,
} from "lucide-react";
import { useAuth, CategoryKey, ROLE_LABELS } from "@/context/AuthContext";
import { useUI } from "@/context/UIContext";
import { useToast } from "@/components/ui/Toast";

interface NavItem {
    label: string;
    href: string;
    icon: LucideIcon;
    category: CategoryKey;
}

interface NavSection {
    id: string;
    title: string;
    icon: LucideIcon;
    color: string;
    items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
    {
        id: 'main',
        title: 'Principal',
        icon: LayoutDashboard,
        color: 'var(--color-accent)',
        items: [
            { label: "Tableau de bord", href: "/", icon: LayoutDashboard, category: "dashboard" },
        ]
    },
    {
        id: 'intelligence',
        title: 'Intelligence IA',
        icon: Sparkles,
        color: '#00D764',
        items: [
            { label: "Executive Intelligence", href: "/intelligence", icon: Sparkles, category: "analytics" },
        ]
    },
    {
        id: 'operations',
        title: 'Opérations',
        icon: Utensils,
        color: 'var(--color-cat-ops)',
        items: [
            { label: "Point de vente", href: "/pos", icon: Store, category: "pos" },
            { label: "Plan de salle", href: "/floor-plan", icon: Map, category: "floor-plan" },
            { label: "Production (KDS)", href: "/kds", icon: ChefHat, category: "kds" },
        ]
    },
    {
        id: 'clients',
        title: 'Clients & Réservations',
        icon: Heart,
        color: 'var(--color-cat-clients)',
        items: [
            { label: "Réservations", href: "/reservations", icon: CalendarDays, category: "reservations" },
            { label: "Réservations Omnicanal", href: "/omnichannel-reservations", icon: Globe, category: "reservations" },
            { label: "CRM Clients", href: "/crm", icon: Heart, category: "reservations" },
        ]
    },
    {
        id: 'production',
        title: 'Cuisine & Production',
        icon: ChefHat,
        color: 'var(--color-cat-cuisine)',
        items: [
            { label: "Gestion Cuisine", href: "/kitchen", icon: ChefHat, category: "kitchen" },
            { label: "Bar & Sommellerie", href: "/bar", icon: Wine, category: "kitchen" },
            { label: "Stocks & Inventaire", href: "/inventory", icon: Package, category: "inventory" },
            { label: "HACCP & Qualité", href: "/haccp", icon: ClipboardCheck, category: "haccp" },
        ]
    },
    {
        id: 'team',
        title: 'Équipe & RH',
        icon: Users,
        color: 'var(--color-cat-rh)',
        items: [
            { label: "Prise de Poste", href: "/onboarding", icon: Briefcase, category: "onboarding" },
            { label: "Ressources Humaines", href: "/staff", icon: Users, category: "staff" },
            { label: "Planning", href: "/planning", icon: CalendarRange, category: "planning" },
        ]
    },
    {
        id: 'analytics',
        title: 'Analytics & Marketing',
        icon: TrendingUp,
        color: 'var(--color-success)',
        items: [
            { label: "Analytique BI", href: "/analytics", icon: BarChart3, category: "analytics" },
            { label: "Google Analytics", href: "/analytics-integration", icon: BarChart3, category: "analytics" },
            { label: "Marketing & Social", href: "/social-marketing", icon: Instagram, category: "analytics" },
            { label: "Référencement IA", href: "/ai-referencing", icon: Bot, category: "analytics" },
        ]
    },
    {
        id: 'finance',
        title: 'Finance',
        icon: Calculator,
        color: 'var(--color-cat-finance)',
        items: [
            { label: "Finance & Compta", href: "/accounting", icon: Calculator, category: "accounting" },
        ]
    },
    {
        id: 'admin',
        title: 'Administration',
        icon: Shield,
        color: 'var(--color-text-secondary)',
        items: [
            { label: "Paramètres", href: "/settings", icon: Settings, category: "settings" },
            { label: "Gestion des Accès", href: "/account-settings", icon: UserCog, category: "account-settings" },
        ]
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const { currentUser, logout, hasAccess } = useAuth();
    const { showToast } = useToast();
    const { isSidebarCollapsed, toggleSidebar } = useUI();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [expandedSections, setExpandedSections] = useState<string[]>(['main', 'operations', 'clients']);

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const accessibleSections = NAV_SECTIONS.map(section => ({
        ...section,
        items: section.items.filter(item => hasAccess(item.category))
    })).filter(section => section.items.length > 0);

    let globalIndex = 0;

    return (
        <aside
            className={cn(
                "h-screen bg-white border-r border-neutral-100 flex flex-col fixed left-0 top-0 z-50 transition-all duration-500",
                isSidebarCollapsed ? "w-[80px]" : "w-[260px]"
            )}
        >
            {/* Logo Area */}
            <button
                onClick={toggleSidebar}
                className={cn(
                    "p-8 pb-6 transition-all duration-500 flex items-center gap-3 w-full hover:bg-bg-tertiary group cursor-pointer text-left",
                    isSidebarCollapsed ? "px-5 justify-center" : "p-8"
                )}
            >
                {isSidebarCollapsed ? (
                    <div className="w-10 h-10 rounded-lg bg-accent text-white flex items-center justify-center transition-all group-hover:scale-105">
                        <Store strokeWidth={1.5} className="w-5 h-5" />
                    </div>
                ) : (
                    <>
                        <div className="w-10 h-10 rounded-lg bg-accent text-white flex items-center justify-center shadow-sm shrink-0 transition-transform group-hover:scale-105">
                            <Store strokeWidth={1.5} className="w-6 h-6" />
                        </div>
                        <div className="animate-in fade-in slide-in-from-left-2 duration-500 overflow-hidden flex-1">
                            <h1 className="font-serif font-semibold text-xl text-text-primary tracking-tight leading-none whitespace-nowrap">
                                Restaurant OS
                            </h1>
                            <p className="text-[9px] uppercase tracking-[0.2em] text-text-secondary font-medium mt-1.5 whitespace-nowrap">
                                Executive Intelligence
                            </p>
                        </div>
                        <div className="w-8 h-8 rounded-lg text-text-muted flex items-center justify-center transition-all group-hover:text-text-primary ml-auto">
                            <Menu strokeWidth={1.5} className="w-4 h-4" />
                        </div>
                    </>
                )}
            </button>

            {/* Navigation */}
            <nav
                className="flex-1 px-4 py-4 space-y-1 relative elegant-scrollbar overflow-y-auto"
                onMouseLeave={() => setHoveredIndex(null)}
            >
                {accessibleSections.map((section) => {
                    const isExpanded = expandedSections.includes(section.id) || isSidebarCollapsed;
                    const SectionIcon = section.icon;
                    const hasActiveItem = section.items.some(item => pathname === item.href);

                    return (
                        <div key={section.id} className="mb-4">
                            {/* Section Header */}
                            {!isSidebarCollapsed && (
                                <button
                                    onClick={() => toggleSection(section.id)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-2 py-1.5 rounded-lg transition-all group",
                                        hasActiveItem ? "text-text-primary" : "text-text-muted hover:text-text-secondary"
                                    )}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.1em]">
                                            {section.title}
                                        </span>
                                    </div>
                                    <ChevronDown
                                        strokeWidth={1.5}
                                        className={cn(
                                            "w-3.5 h-3.5 transition-transform",
                                            isExpanded ? "rotate-0" : "-rotate-90"
                                        )}
                                    />
                                </button>
                            )}

                            {/* Section Items */}
                            <div className={cn(
                                "space-y-0.5 overflow-hidden transition-all duration-300",
                                !isSidebarCollapsed && !isExpanded ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100",
                                !isSidebarCollapsed && "mt-1.5"
                            )}>
                                {section.items.map((item) => {
                                    const currentIndex = globalIndex++;
                                    const isActive = pathname === item.href;
                                    const Icon = item.icon;

                                    return (
                                        <div key={item.href} className="relative group">
                                            <Link
                                                href={item.href}
                                                onMouseEnter={() => setHoveredIndex(currentIndex)}
                                                className={cn(
                                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-300",
                                                    isActive
                                                        ? "bg-bg-tertiary text-text-primary"
                                                        : "text-text-secondary hover:bg-bg-tertiary/50 hover:text-text-primary",
                                                    isSidebarCollapsed && "justify-center px-0 h-11 mx-1.5"
                                                )}
                                            >
                                                <Icon strokeWidth={1.5} className={cn(
                                                    "w-[18px] h-[18px] transition-transform duration-300 group-hover:scale-105 shrink-0",
                                                    isActive ? "text-text-primary" : "text-text-muted group-hover:text-text-secondary"
                                                )} />

                                                {!isSidebarCollapsed && (
                                                    <span className="animate-in fade-in slide-in-from-left-1 duration-300 truncate">
                                                        {item.label}
                                                    </span>
                                                )}
                                            </Link>

                                            {/* Hover Bubble (Collapsed Mode) */}
                                            {isSidebarCollapsed && hoveredIndex === currentIndex && (
                                                <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-text-primary text-bg-secondary text-[11px] font-medium rounded-md whitespace-nowrap z-[100] shadow-xl animate-in fade-in zoom-in-95 duration-200">
                                                    {item.label}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </nav>

            {/* Footer User Profile */}
            <div className={cn("p-4 border-t border-neutral-100 bg-bg-primary/30", isSidebarCollapsed ? "px-2" : "p-6")}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 w-full">
                        <div className="w-9 h-9 rounded-lg bg-bg-tertiary border border-border flex items-center justify-center text-text-primary text-xs font-semibold shrink-0">
                            {currentUser?.name.charAt(0)}
                        </div>
                        {!isSidebarCollapsed && (
                            <div className="flex flex-col animate-in fade-in duration-500 overflow-hidden flex-1">
                                <span className="text-xs font-semibold text-text-primary truncate">{currentUser?.name}</span>
                                <span className="text-[10px] text-text-muted truncate">
                                    {currentUser?.role ? ROLE_LABELS[currentUser.role] : ''}
                                </span>
                            </div>
                        )}
                        {!isSidebarCollapsed && (
                            <button
                                onClick={logout}
                                className="p-2 text-text-muted hover:text-error transition-colors"
                                title="Déconnexion"
                            >
                                <LogOut strokeWidth={1.5} className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
}
