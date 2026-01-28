"use client";

import { useState, useMemo } from "react";
import {
    Package,
    ArrowDownLeft,
    AlertTriangle,
    Search,
    Filter,
    Plus,
    FileDown,
    MoreVertical,
    TrendingUp,
    ShieldCheck,
    Truck,
    CheckCircle2,
    Clock,
    ChefHat,
    ArrowRight,
    Calendar,
    Thermometer,
    MapPin,
    Trash2,
    Eye,
    RefreshCw,
    XCircle,
    PackageCheck,
    BookOpen,
    Layers,
    User,
    ChevronRight,
    SearchIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useInventory } from "@/context/InventoryContext";
import { SupplierOrder, SupplierOrderStatus } from "@/types";
import { useToast } from "@/components/ui/Toast";
import { useUI } from "@/context/UIContext";
import { StockReceptionModal, CreatePreparationModal, StockTransferModal } from "@/components/inventory";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { fadeInUp, easing } from "@/lib/motion";
import { useLanguage } from "@/context/LanguageContext";
import { useIsMobile } from "@/hooks";
import { BottomSheet } from "@/components/ui/BottomSheet";

const CATEGORY_LABELS: Record<string, string> = {
    produce: 'Fruits & Légumes',
    dairy: 'Produits Laitiers',
    meat: 'Viandes',
    poultry: 'Volailles',
    seafood: 'Poissons',
    charcuterie: 'Charcuterie',
    bakery: 'Boulangerie',
    dry: 'Épicerie',
    condiment: 'Condiments',
    spice: 'Épices',
    oil: 'Huiles',
    beverage: 'Boissons',
    wine: 'Vins',
    spirits: 'Spiritueux',
    frozen: 'Surgelés',
    other: 'Autre'
};

export default function InventoryPage() {
    const isMobile = useIsMobile();
    const { t } = useLanguage();
    const {
        ingredients,
        stockItems,
        preparations,
        lowStockItems,
        supplierOrders,
        receiveOrder,
        cancelOrder,
        storageLocations,
        getExpiringStock,
        getExpiringPreparations,
        discardPreparation
    } = useInventory();
    const { showToast } = useToast();

    const [activeTab, setActiveTab] = useState<'stock' | 'preparations' | 'orders'>('stock');
    const [isReceptionModalOpen, setIsReceptionModalOpen] = useState(false);
    const [isPreparationModalOpen, setIsPreparationModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState<string | null>(null);

    // Filter stock items
    const filteredStockItems = useMemo(() => {
        let items = stockItems.filter(s => s.status !== 'expired' && s.quantity > 0);
        if (searchQuery) items = items.filter(s => s.ingredientName.toLowerCase().includes(searchQuery.toLowerCase()));
        if (filterCategory) items = items.filter(s => s.category === filterCategory);
        return items.sort((a, b) => new Date(a.dlc).getTime() - new Date(b.dlc).getTime());
    }, [stockItems, searchQuery, filterCategory]);

    // Filter preparations
    const filteredPreparations = useMemo(() => {
        let preps = preparations.filter(p => p.status !== 'discarded' && p.status !== 'expired');
        if (searchQuery) preps = preps.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        return preps.sort((a, b) => new Date(a.dlc).getTime() - new Date(b.dlc).getTime());
    }, [preparations, searchQuery]);

    const categories = [...new Set(stockItems.map(s => s.category))];

    const getDlcColor = (dlc: string) => {
        const diff = new Date(dlc).getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        if (days <= 0) return "text-error";
        if (days <= 2) return "text-warning";
        return "text-success";
    };

    return (
        <div className="flex flex-1 flex-col bg-bg-primary h-[calc(100vh-80px)] lg:h-[calc(100vh-100px)] -m-4 lg:-m-8 overflow-hidden relative pb-24 lg:pb-0">
            {/* Header & Search */}
            <div className="bg-white/80 dark:bg-bg-primary/80 backdrop-blur-2xl px-6 py-6 border-b border-border/50 sticky top-0 z-40">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-4xl font-serif font-black italic text-text-primary tracking-tight">{t('inventory.tabs.archive')}</h1>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setIsTransferModalOpen(true)} className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                            <RefreshCw className="w-5 h-5" />
                        </button>
                        <button onClick={() => setIsReceptionModalOpen(true)} className="w-12 h-12 rounded-full bg-text-primary text-white flex items-center justify-center">
                            <Plus className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="relative mb-6">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/30" />
                    <input
                        type="text"
                        placeholder={t('inventory.search.archive')}
                        className="w-full h-14 pl-14 pr-6 bg-bg-tertiary/50 rounded-2xl border-none text-[10px] font-black uppercase tracking-widest outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Horizontal Navigation Tabs */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                    {[
                        { id: 'stock', label: t('inventory.tabs.archive'), icon: PackageCheck },
                        { id: 'preparations', label: t('inventory.tabs.kitchen'), icon: ChefHat },
                        { id: 'orders', label: t('inventory.tabs.logistics'), icon: Truck }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "flex items-center gap-2 h-11 px-6 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                                activeTab === tab.id ? "bg-accent-gold text-white" : "bg-bg-tertiary text-text-muted"
                            )}
                        >
                            <tab.icon className="w-3.5 h-3.5" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-auto p-4 space-y-4 elegant-scrollbar">
                {activeTab === 'stock' && (
                    <div className="space-y-4">
                        {/* Categories Scroll (Sub-categories) */}
                        <div className="flex gap-2 overflow-x-auto no-scrollbar px-1 py-1">
                            <button
                                onClick={() => setFilterCategory(null)}
                                className={cn("px-4 h-9 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all", !filterCategory ? "bg-text-primary text-white border-transparent" : "bg-white dark:bg-bg-secondary border-border text-text-muted")}
                            >
                                Tout
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilterCategory(cat)}
                                    className={cn("px-4 h-9 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all whitespace-nowrap", filterCategory === cat ? "bg-text-primary text-white border-transparent" : "bg-white dark:bg-bg-secondary border-border text-text-muted")}
                                >
                                    {CATEGORY_LABELS[cat] || cat}
                                </button>
                            ))}
                        </div>

                        {filteredStockItems.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.03 }}
                                className="bg-white dark:bg-bg-secondary p-4 rounded-[2rem] border border-border/50 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border">
                                        <Package className="w-6 h-6 text-text-muted/40" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-serif font-black italic text-text-primary tracking-tight leading-none">{item.ingredientName}</h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[8px] font-black text-accent-gold uppercase tracking-widest">{CATEGORY_LABELS[item.category] || item.category}</span>
                                            <div className="w-1 h-1 rounded-full bg-border" />
                                            <span className={cn("text-[8px] font-black uppercase tracking-widest", getDlcColor(item.dlc))}>
                                                DLC {new Date(item.dlc).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right pr-2">
                                    <p className="text-3xl font-serif font-black italic text-text-primary leading-none">{item.quantity}</p>
                                    <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mt-1">{item.unit}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {activeTab === 'preparations' && (
                    <div className="space-y-4">
                        {filteredPreparations.map((prep, idx) => (
                            <motion.div
                                key={prep.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-bg-secondary p-6 rounded-[2.5rem] border border-border/50"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="text-2xl font-serif font-black italic text-text-primary">{prep.name}</h4>
                                        <span className="text-[10px] font-black text-accent-gold uppercase tracking-widest mt-1 block opacity-60">{prep.type}</span>
                                    </div>
                                    <div className="bg-bg-tertiary px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest">
                                        DLC {new Date(prep.dlc).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-serif font-black italic text-text-primary">{prep.quantity}</span>
                                    <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] italic opacity-40">{prep.unit}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modals with Mobile Detection for BottomSheet behavior */}
            <StockReceptionModal isOpen={isReceptionModalOpen} onClose={() => setIsReceptionModalOpen(false)} />
            <CreatePreparationModal isOpen={isPreparationModalOpen} onClose={() => setIsPreparationModalOpen(false)} />
            <StockTransferModal isOpen={isTransferModalOpen} onClose={() => setIsTransferModalOpen(false)} />
        </div>
    );
}
