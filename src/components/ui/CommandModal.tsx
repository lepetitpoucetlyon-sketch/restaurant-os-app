"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    Search,
    Command,
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
    Sparkles,
    CalendarRange,
    X,
    ArrowRight,
    Zap,
    Plus,
    FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandItem {
    id: string;
    label: string;
    description?: string;
    icon: any;
    action?: () => void;
    href?: string;
    category: 'navigation' | 'actions' | 'search';
    shortcut?: string;
}

const NAV_ITEMS: CommandItem[] = [
    { id: 'dashboard', label: 'Tableau de bord', description: 'Vue d\'ensemble', icon: LayoutDashboard, href: '/', category: 'navigation', shortcut: '⌘1' },
    { id: 'pos', label: 'Point de vente', description: 'Caisse & commandes', icon: Store, href: '/pos', category: 'navigation', shortcut: '⌘2' },
    { id: 'floor', label: 'Plan de salle', description: 'Tables & placement', icon: Map, href: '/floor-plan', category: 'navigation', shortcut: '⌘3' },
    { id: 'reservations', label: 'Réservations', description: 'Carnet & CRM', icon: CalendarDays, href: '/reservations', category: 'navigation', shortcut: '⌘4' },
    { id: 'inventory', label: 'Stocks & Inventaire', description: 'Approvisionnement', icon: Package, href: '/inventory', category: 'navigation', shortcut: '⌘5' },
    { id: 'kds', label: 'Cuisine (KDS)', description: 'Production temps réel', icon: ChefHat, href: '/kds', category: 'navigation', shortcut: '⌘6' },
    { id: 'staff', label: 'Ressources Humaines', description: 'Équipe & paie', icon: Users, href: '/staff', category: 'navigation' },
    { id: 'planning', label: 'Planning', description: 'Shifts & horaires', icon: CalendarRange, href: '/planning', category: 'navigation' },
    { id: 'haccp', label: 'HACCP & Qualité', description: 'Conformité', icon: ClipboardCheck, href: '/haccp', category: 'navigation' },
    { id: 'accounting', label: 'Finance & Compta', description: 'Pilotage financier', icon: Calculator, href: '/accounting', category: 'navigation' },
    { id: 'analytics', label: 'Analyses', description: 'Rapports & KPIs', icon: BarChart3, href: '/analytics', category: 'navigation' },
    { id: 'system', label: 'Ecosystème IA', description: 'Cartographie système', icon: Sparkles, href: '/system-map', category: 'navigation' },
];

const ACTION_ITEMS: CommandItem[] = [
    { id: 'new-order', label: 'Nouvelle commande', description: 'Créer un ticket', icon: Plus, href: '/pos', category: 'actions' },
    { id: 'new-reservation', label: 'Nouvelle réservation', description: 'Ajouter au carnet', icon: CalendarDays, href: '/reservations', category: 'actions' },
    { id: 'export-report', label: 'Exporter rapport', description: 'Télécharger PDF', icon: FileText, category: 'actions' },
];

interface CommandModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CommandModal({ isOpen, onClose }: CommandModalProps) {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);

    const allItems = [...NAV_ITEMS, ...ACTION_ITEMS];

    const filteredItems = searchTerm
        ? allItems.filter(item =>
            item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : allItems;

    const navItems = filteredItems.filter(i => i.category === 'navigation');
    const actionItems = filteredItems.filter(i => i.category === 'actions');

    // Focus input on open
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            setSearchTerm('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => Math.min(prev + 1, filteredItems.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => Math.max(prev - 1, 0));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const item = filteredItems[selectedIndex];
                if (item?.href) {
                    router.push(item.href);
                    onClose();
                } else if (item?.action) {
                    item.action();
                    onClose();
                }
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, filteredItems, selectedIndex, router, onClose]);

    const handleItemClick = (item: CommandItem) => {
        if (item.href) {
            router.push(item.href);
        } else if (item.action) {
            item.action();
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Search Input */}
                <div className="flex items-center gap-4 p-6 border-b border-neutral-100">
                    <Search className="w-5 h-5 text-[#ADB5BD]" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Rechercher une action, un module..."
                        value={searchTerm}
                        onChange={e => {
                            setSearchTerm(e.target.value);
                            setSelectedIndex(0);
                        }}
                        className="flex-1 text-lg font-medium outline-none placeholder:text-[#CED4DA]"
                    />
                    <div className="flex items-center gap-1 px-2 py-1 bg-neutral-100 rounded-lg">
                        <span className="text-[10px] font-black text-[#ADB5BD]">ESC</span>
                    </div>
                </div>

                {/* Results */}
                <div className="max-h-[400px] overflow-y-auto">
                    {filteredItems.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-[#ADB5BD] font-bold">Aucun résultat pour "{searchTerm}"</p>
                        </div>
                    ) : (
                        <>
                            {/* Navigation Section */}
                            {navItems.length > 0 && (
                                <div className="p-4">
                                    <p className="text-[10px] font-black text-[#ADB5BD] uppercase tracking-widest px-3 mb-2">
                                        Navigation
                                    </p>
                                    {navItems.map((item, i) => {
                                        const globalIndex = filteredItems.indexOf(item);
                                        const Icon = item.icon;
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => handleItemClick(item)}
                                                onMouseEnter={() => setSelectedIndex(globalIndex)}
                                                className={cn(
                                                    "w-full flex items-center gap-4 p-3 rounded-xl transition-all",
                                                    selectedIndex === globalIndex
                                                        ? "bg-[#E6F9EF] text-[#1A1A1A]"
                                                        : "hover:bg-neutral-50"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center",
                                                    selectedIndex === globalIndex
                                                        ? "bg-[#00D764] text-white"
                                                        : "bg-neutral-100 text-[#495057]"
                                                )}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <p className="font-bold text-[#1A1A1A]">{item.label}</p>
                                                    {item.description && (
                                                        <p className="text-[11px] text-[#ADB5BD]">{item.description}</p>
                                                    )}
                                                </div>
                                                {item.shortcut && (
                                                    <span className="text-[10px] font-bold text-[#ADB5BD] bg-neutral-100 px-2 py-1 rounded">
                                                        {item.shortcut}
                                                    </span>
                                                )}
                                                <ArrowRight className={cn(
                                                    "w-4 h-4 transition-all",
                                                    selectedIndex === globalIndex
                                                        ? "text-[#00D764] translate-x-0 opacity-100"
                                                        : "opacity-0 -translate-x-2"
                                                )} />
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Actions Section */}
                            {actionItems.length > 0 && (
                                <div className="p-4 border-t border-neutral-100">
                                    <p className="text-[10px] font-black text-[#ADB5BD] uppercase tracking-widest px-3 mb-2">
                                        Actions Rapides
                                    </p>
                                    {actionItems.map((item) => {
                                        const globalIndex = filteredItems.indexOf(item);
                                        const Icon = item.icon;
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => handleItemClick(item)}
                                                onMouseEnter={() => setSelectedIndex(globalIndex)}
                                                className={cn(
                                                    "w-full flex items-center gap-4 p-3 rounded-xl transition-all",
                                                    selectedIndex === globalIndex
                                                        ? "bg-[#1A1A1A] text-white"
                                                        : "hover:bg-neutral-50"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center",
                                                    selectedIndex === globalIndex
                                                        ? "bg-[#00D764]"
                                                        : "bg-neutral-100"
                                                )}>
                                                    <Icon className={cn(
                                                        "w-5 h-5",
                                                        selectedIndex === globalIndex ? "text-white" : "text-[#495057]"
                                                    )} />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <p className={cn("font-bold", selectedIndex === globalIndex ? "text-white" : "text-[#1A1A1A]")}>
                                                        {item.label}
                                                    </p>
                                                    {item.description && (
                                                        <p className={cn("text-[11px]", selectedIndex === globalIndex ? "text-white/70" : "text-[#ADB5BD]")}>
                                                            {item.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <Zap className={cn(
                                                    "w-4 h-4",
                                                    selectedIndex === globalIndex ? "text-[#00D764]" : "text-[#ADB5BD]"
                                                )} />
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <span className="text-[9px] font-bold text-[#ADB5BD] bg-white border px-1.5 py-0.5 rounded">↑↓</span>
                            <span className="text-[10px] text-[#ADB5BD]">Naviguer</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-[9px] font-bold text-[#ADB5BD] bg-white border px-1.5 py-0.5 rounded">↵</span>
                            <span className="text-[10px] text-[#ADB5BD]">Sélectionner</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Command className="w-3 h-3 text-[#00D764]" />
                        <span className="text-[10px] font-black text-[#ADB5BD] uppercase tracking-wider">Command Center</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
