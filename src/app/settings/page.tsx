"use client";

import { useState, Suspense, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { useSettings } from "@/context/SettingsContext";
import { Sidebar } from "@/components/layout/Sidebar";

// Dynamic imports for settings components with SSR disabled for faster client hydration
const HoursSettings = dynamic(() => import("@/components/settings/HoursSettings"), { loading: () => <SettingsLoading />, ssr: false });
const POSSettings = dynamic(() => import("@/components/settings/POSSettings"), { loading: () => <SettingsLoading />, ssr: false });
const ReservationSettingsComponent = dynamic(() => import("@/components/settings/ReservationSettings"), { loading: () => <SettingsLoading />, ssr: false });
const AppearanceSettings = dynamic(() => import("@/components/settings/AppearanceSettings"), { loading: () => <SettingsLoading />, ssr: false });
const NotificationSettings = dynamic(() => import("@/components/settings/NotificationSettings"), { loading: () => <SettingsLoading />, ssr: false });
const GoalsSettings = dynamic(() => import("@/components/settings/GoalsSettings"), { loading: () => <SettingsLoading />, ssr: false });
const DeliverySettings = dynamic(() => import("@/components/settings/DeliverySettings"), { loading: () => <SettingsLoading />, ssr: false });
const SecuritySettings = dynamic(() => import("@/components/settings/SecuritySettings"), { loading: () => <SettingsLoading />, ssr: false });
const StaffSettings = dynamic(() => import("@/components/settings/StaffSettings"), { loading: () => <SettingsLoading />, ssr: false });
const CRMSettings = dynamic(() => import("@/components/settings/CRMSettings"), { loading: () => <SettingsLoading />, ssr: false });
const IntegrationSettings = dynamic(() => import("@/components/settings/IntegrationSettings"), { loading: () => <SettingsLoading />, ssr: false });
const ReviewsSettings = dynamic(() => import("@/components/settings/ReviewsSettings"), { loading: () => <SettingsLoading />, ssr: false });
const LegalSettings = dynamic(() => import("@/components/settings/LegalSettings"), { loading: () => <SettingsLoading />, ssr: false });
const MenuSettings = dynamic(() => import("@/components/settings/MenuSettings"), { loading: () => <SettingsLoading />, ssr: false });
const InventorySettings = dynamic(() => import("@/components/settings/InventorySettings"), { loading: () => <SettingsLoading />, ssr: false });
const PlanningSettings = dynamic(() => import("@/components/settings/PlanningSettings"), { loading: () => <SettingsLoading />, ssr: false });
const AccountingSettings = dynamic(() => import("@/components/settings/AccountingSettings"), { loading: () => <SettingsLoading />, ssr: false });
const RecipesSettings = dynamic(() => import("@/components/settings/RecipesSettings"), { loading: () => <SettingsLoading />, ssr: false });
const HACCPSettings = dynamic(() => import("@/components/settings/HACCPSettings"), { loading: () => <SettingsLoading />, ssr: false });
const ProfileSettings = dynamic(() => import("@/components/settings/ProfileSettings"), { loading: () => <SettingsLoading />, ssr: false });
const TablesSettings = dynamic(() => import("@/components/settings/TablesSettings"), { loading: () => <SettingsLoading />, ssr: false });
const VoiceAssistantSettings = dynamic(() => import("@/components/settings/VoiceAssistantSettings"), { loading: () => <SettingsLoading />, ssr: false });

// Prefetch commonly used modules
const prefetchModules = () => {
    import("@/components/settings/HoursSettings");
    import("@/components/settings/AppearanceSettings");
    import("@/components/settings/POSSettings");
    import("@/components/settings/NotificationSettings");
};

import {
    Building2, Clock, UtensilsCrossed, ChefHat, Package, Users, CalendarDays,
    BookOpen, Heart, CreditCard, Receipt, Truck, Star, Palette, Bell, Shield,
    Target, Plug, FileText, Save, RotateCcw, Download, Upload, Loader2,
    ChevronRight, UserCircle, LayoutGrid, Mic
} from "lucide-react";
import { cn } from "@/lib/utils";

// Settings categories
const SETTINGS_CATEGORIES = [
    { id: 'profile', label: 'Mon Profil', icon: UserCircle, color: '#C5A059' },
    { id: 'voice', label: 'Assistant Vocal', icon: Mic, color: '#F43F5E' },
    { id: 'identity', label: 'Identité & Restaurant', icon: Building2, color: '#3B82F6' },
    { id: 'hours', label: 'Horaires & Disponibilités', icon: Clock, color: '#10B981' },
    { id: 'menu', label: 'Menu & Carte', icon: UtensilsCrossed, color: '#F59E0B' },
    { id: 'recipes', label: 'Recettes & Fiches', icon: ChefHat, color: '#EF4444' },
    { id: 'inventory', label: 'Inventaire & Stocks', icon: Package, color: '#8B5CF6' },
    { id: 'staff', label: 'Équipe & RH', icon: Users, color: '#EC4899' },
    { id: 'planning', label: 'Planning & Shifts', icon: CalendarDays, color: '#06B6D4' },
    { id: 'reservations', label: 'Réservations', icon: BookOpen, color: '#F97316' },
    { id: 'crm', label: 'CRM Clients', icon: Heart, color: '#DC2626' },
    { id: 'pos', label: 'Point de Vente', icon: CreditCard, color: '#C5A059' },
    { id: 'accounting', label: 'Comptabilité', icon: Receipt, color: '#6366F1' },
    { id: 'delivery', label: 'Livraison & Click-Collect', icon: Truck, color: '#14B8A6' },
    { id: 'reviews', label: 'Avis & Réputation', icon: Star, color: '#FBBF24' },
    { id: 'appearance', label: 'Apparence & Thème', icon: Palette, color: '#A855F7' },
    { id: 'notifications', label: 'Notifications & Alertes', icon: Bell, color: '#F43F5E' },
    { id: 'security', label: 'Sécurité & Permissions', icon: Shield, color: '#64748B' },
    { id: 'goals', label: 'Objectifs & KPIs', icon: Target, color: '#22C55E' },
    { id: 'integrations', label: 'Intégrations & API', icon: Plug, color: '#0EA5E9' },
    { id: 'legal', label: 'Documents & Légal', icon: FileText, color: '#78716C' },
    { id: 'haccp', label: 'HACCP & Hygiène', icon: Shield, color: '#00BCD4' },
    { id: 'tables', label: 'Tables & Zones', icon: LayoutGrid, color: '#7C3AED' },
];

// --- Identity Form Component (Redesigned) ---
// ... identity form translations ...
// Since this is a large file, I will use multiple replace_file_content calls if needed or do it in chunks.
// Given constraints, I will do a large block replace for the IdentitySettings function first.

function IdentitySettings() {
    const { settings, updateIdentity, updateContact, updateSocial, isSaving } = useSettings();
    const [formData, setFormData] = useState({
        ...settings.identity,
        ...settings.contact,
        ...settings.social
    });

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        await updateIdentity({
            name: formData.name,
            slogan: formData.slogan,
            cuisineType: formData.cuisineType,
            category: formData.category as any,
            shortDescription: formData.shortDescription,
            headChef: formData.headChef,
        });
        await updateContact({
            address: formData.address,
            postalCode: formData.postalCode,
            city: formData.city,
            country: formData.country,
            phoneMain: formData.phoneMain,
            emailGeneral: formData.emailGeneral,
            website: formData.website,
        });
        await updateSocial({
            instagram: formData.instagram,
            facebook: formData.facebook,
        });
    };

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            {/* Enterprise Identity Card */}
            <motion.div variants={fadeInUp} className="relative overflow-hidden rounded-[2.5rem] bg-bg-secondary border border-border shadow-premium">
                {/* Background Effects */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent-gold/5 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <div className="relative p-10 z-10">
                    <div className="flex flex-col md:flex-row gap-12">
                        {/* Header Section */}
                        <div className="md:w-1/3 space-y-6">
                            <div className="w-20 h-20 rounded-[1.5rem] bg-accent text-white flex items-center justify-center shadow-lg shadow-accent/20">
                                <Building2 className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-serif text-text-primary leading-tight mb-2">
                                    IDENTITÉ <span className="text-accent-gold">&</span><br />RESTAURANT
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
                                        Propulsé par <span className="text-text-primary">Restaurant OS AI</span>
                                    </p>
                                </div>
                            </div>
                            <p className="text-text-muted text-sm leading-relaxed font-medium">
                                Définissez l'ADN de votre établissement. Ces données alimentent l'IA pour générer du contenu et des analyses pertinents.
                            </p>
                        </div>

                        {/* Form Section */}
                        <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="text-[10px] uppercase tracking-widest text-text-muted font-black mb-2 block">Raison Sociale</label>
                                <input
                                    type="text"
                                    value={formData.name || ''}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className="w-full bg-bg-tertiary/50 border border-border rounded-xl px-5 py-4 text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:bg-bg-secondary focus:border-accent font-serif font-bold text-lg transition-all"
                                    placeholder="Nom de l'entreprise..."
                                />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-text-muted font-black mb-2 block">Catégorie d'Établissement</label>
                                <div className="relative">
                                    <select
                                        value={formData.category || 'bistrot'}
                                        onChange={(e) => handleChange('category', e.target.value)}
                                        className="w-full bg-bg-tertiary/50 border border-border rounded-xl px-5 py-4 text-text-primary focus:outline-none focus:bg-bg-secondary focus:border-accent transition-all appearance-none cursor-pointer font-medium"
                                    >
                                        <option value="bistrot">Bistrot Moderne</option>
                                        <option value="gastronomique">Haute Gastronomie</option>
                                        <option value="brasserie">Brasserie de Luxe</option>
                                        <option value="fast_casual">Fast Casual Premium</option>
                                        <option value="cafe">Café Artisanal</option>
                                        <option value="bar">Bar à Cocktails</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <ChevronRight className="w-4 h-4 text-text-muted rotate-90" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-text-muted font-black mb-2 block">Type de Cuisine</label>
                                <input
                                    type="text"
                                    value={formData.cuisineType || ''}
                                    onChange={(e) => handleChange('cuisineType', e.target.value)}
                                    className="w-full bg-bg-tertiary/50 border border-border rounded-xl px-5 py-4 text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:bg-bg-secondary focus:border-accent transition-all font-medium"
                                    placeholder="ex: Cuisine Française Moderne"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="text-[10px] uppercase tracking-widest text-text-muted font-black mb-2 block">Slogan de Marque</label>
                                <input
                                    type="text"
                                    value={formData.slogan || ''}
                                    onChange={(e) => handleChange('slogan', e.target.value)}
                                    className="w-full bg-bg-tertiary/50 border border-border rounded-xl px-5 py-4 text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:bg-bg-secondary focus:border-accent transition-all font-serif italic text-lg"
                                    placeholder="ex: Le goût du futur"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Enterprise Identity Card */}
                <div className="rounded-[2.5rem] bg-bg-secondary border border-border shadow-premium p-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-[50px] rounded-full pointer-events-none" />
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border">
                            <Building2 className="w-6 h-6 text-accent" />
                        </div>
                        <h4 className="text-xl font-serif text-text-primary">IDENTITÉ<br /><span className="text-accent-gold italic">ENTREPRISE</span></h4>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-text-muted font-black mb-1.5 block">Chef de Cuisine</label>
                            <input
                                type="text"
                                value={formData.headChef || ''}
                                onChange={(e) => handleChange('headChef', e.target.value)}
                                className="w-full bg-bg-tertiary/50 border border-border rounded-xl px-5 py-3 text-text-primary text-sm focus:outline-none focus:bg-bg-secondary focus:border-accent transition-all font-bold"
                                placeholder="Nom du Chef"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-text-muted font-black mb-1.5 block">Description</label>
                            <textarea
                                rows={3}
                                value={formData.shortDescription || ''}
                                onChange={(e) => handleChange('shortDescription', e.target.value)}
                                className="w-full bg-bg-tertiary/50 border border-border rounded-xl px-5 py-3 text-text-primary text-sm focus:outline-none focus:bg-bg-secondary focus:border-accent transition-all resize-none font-medium"
                                placeholder="Brève description..."
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Card */}
                <div className="rounded-[2.5rem] bg-bg-secondary border border-border shadow-premium p-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-success/10 blur-[50px] rounded-full pointer-events-none" />
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border">
                            <Users className="w-6 h-6 text-success" />
                        </div>
                        <h4 className="text-xl font-serif text-text-primary">COORDONNÉES<br /><span className="text-accent-gold italic">CONTACT</span></h4>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-text-muted font-black mb-1.5 block">Ville</label>
                                <input
                                    type="text"
                                    value={formData.city || ''}
                                    onChange={(e) => handleChange('city', e.target.value)}
                                    className="w-full bg-bg-tertiary/50 border border-border rounded-xl px-5 py-3 text-text-primary text-sm focus:outline-none focus:bg-bg-secondary focus:border-accent transition-all font-bold"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-text-muted font-black mb-1.5 block">Téléphone</label>
                                <input
                                    type="text"
                                    value={formData.phoneMain || ''}
                                    onChange={(e) => handleChange('phoneMain', e.target.value)}
                                    className="w-full bg-bg-tertiary/50 border border-border rounded-xl px-5 py-3 text-text-primary text-sm focus:outline-none focus:bg-bg-secondary focus:border-accent transition-all font-bold"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-text-muted font-black mb-1.5 block">Email</label>
                            <input
                                type="text"
                                value={formData.emailGeneral || ''}
                                onChange={(e) => handleChange('emailGeneral', e.target.value)}
                                className="w-full bg-bg-tertiary/50 border border-border rounded-xl px-5 py-3 text-text-primary text-sm focus:outline-none focus:bg-bg-secondary focus:border-accent transition-all font-bold"
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Save Action */}
            <motion.div variants={fadeInUp} className="fixed bottom-8 right-8 z-50">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-3 px-8 py-4 bg-text-primary text-bg-primary rounded-full font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 border border-border"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>ENREGISTRER</span>
                </button>
            </motion.div>
        </motion.div>
    );
}

// --- Loading Component ---
function SettingsLoading() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="h-64 rounded-[2.5rem] bg-white/5" />
            <div className="grid grid-cols-2 gap-8">
                <div className="h-48 rounded-[2.5rem] bg-white/5" />
                <div className="h-48 rounded-[2.5rem] bg-white/5" />
            </div>
        </div>
    );
}

// --- Placeholder Component ---
function SettingsPlaceholder({ category }: { category: typeof SETTINGS_CATEGORIES[0] }) {
    const Icon = category.icon;
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-bg-secondary rounded-[2.5rem] border border-border h-[500px] shadow-premium">
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 bg-bg-tertiary border border-border">
                <Icon className="w-12 h-12 text-text-muted" />
            </div>
            <h3 className="text-2xl font-serif text-text-primary mb-2 italic">{category.label}</h3>
            <p className="text-text-muted text-center max-w-sm font-medium">
                Configuration du module bientôt disponible.<br />Implémentation en cours.
            </p>
        </div>
    );
}

// --- Main Page Component ---
export default function SettingsPage() {
    const [activeCategory, setActiveCategory] = useState('identity');
    const [isNavCollapsed, setIsNavCollapsed] = useState(true); // Start collapsed
    const [isMobile, setIsMobile] = useState(false);
    const { lastSaved } = useSettings();
    const activeConfig = SETTINGS_CATEGORIES.find(c => c.id === activeCategory)!;

    // Handle category selection - auto-collapse on mobile
    const handleCategorySelect = (categoryId: string) => {
        setActiveCategory(categoryId);
        if (isMobile) {
            setIsNavCollapsed(true);
        }
    };

    // Detect mobile and prefetch modules on mount
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Prefetch common modules after initial render
        const timer = setTimeout(prefetchModules, 1000);

        return () => {
            window.removeEventListener('resize', checkMobile);
            clearTimeout(timer);
        };
    }, []);

    // Memoize content to prevent unnecessary re-renders
    const settingsContent = useMemo(() => {
        switch (activeCategory) {
            case 'profile': return <ProfileSettings />;
            case 'voice': return <VoiceAssistantSettings />;
            case 'identity': return <IdentitySettings />;
            case 'hours': return <HoursSettings />;
            case 'pos': return <POSSettings />;
            case 'reservations': return <ReservationSettingsComponent />;
            case 'appearance': return <AppearanceSettings />;
            case 'notifications': return <NotificationSettings />;
            case 'goals': return <GoalsSettings />;
            case 'delivery': return <DeliverySettings />;
            case 'security': return <SecuritySettings />;
            case 'staff': return <StaffSettings />;
            case 'crm': return <CRMSettings />;
            case 'integrations': return <IntegrationSettings />;
            case 'reviews': return <ReviewsSettings />;
            case 'legal': return <LegalSettings />;
            case 'menu': return <MenuSettings />;
            case 'inventory': return <InventorySettings />;
            case 'planning': return <PlanningSettings />;
            case 'accounting': return <AccountingSettings />;
            case 'recipes': return <RecipesSettings />;
            case 'haccp': return <HACCPSettings />;
            case 'tables': return <TablesSettings />;
            default: return <SettingsPlaceholder category={activeConfig} />;
        }
    }, [activeCategory, activeConfig]);

    return (
        <div className="flex h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] -m-4 md:-m-8 bg-bg-primary overflow-hidden">
            {/* Mobile overlay backdrop */}
            {isMobile && !isNavCollapsed && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20"
                    onClick={() => setIsNavCollapsed(true)}
                />
            )}

            <main className="flex-1 flex overflow-hidden">
                {/* 1. Left Navigation Column (Collapsible) */}
                <motion.div
                    initial={false}
                    animate={{
                        width: isMobile
                            ? (isNavCollapsed ? 0 : '100%')
                            : (isNavCollapsed ? 80 : 320),
                        x: isMobile && isNavCollapsed ? -320 : 0
                    }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className={cn(
                        "bg-bg-secondary border-r border-border flex flex-col z-30 shrink-0 h-full",
                        isMobile ? "absolute" : "relative"
                    )}
                >
                    <div className={cn("p-6 flex items-center", isNavCollapsed ? "justify-center" : "justify-between")}>
                        <AnimatePresence mode="wait">
                            {!isNavCollapsed && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-3 overflow-hidden"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20 shrink-0">
                                        <LayoutGrid className="w-5 h-5 text-bg-primary" />
                                    </div>
                                    <h2 className="text-xl font-serif text-text-primary tracking-tight whitespace-nowrap italic">Paramètres</h2>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            onClick={() => setIsNavCollapsed(!isNavCollapsed)}
                            className="w-8 h-8 rounded-full bg-bg-tertiary hover:bg-bg-primary flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                        >
                            <ChevronRight className={cn("w-4 h-4 transition-transform duration-300", isNavCollapsed ? "" : "rotate-180")} />
                        </button>
                    </div>

                    <div className="h-px bg-border w-full mb-2" />

                    <div className="flex-1 overflow-y-auto px-3 pb-8 elegant-scrollbar space-y-1">
                        {SETTINGS_CATEGORIES.map((category) => {
                            const isActive = activeCategory === category.id;
                            const Icon = category.icon;
                            return (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategorySelect(category.id)}
                                    className={cn(
                                        "w-full flex items-center gap-4 py-4 rounded-xl transition-all duration-300 group relative",
                                        isNavCollapsed ? "justify-center px-0" : "px-5",
                                        isActive
                                            ? "bg-text-primary text-bg-primary shadow-xl"
                                            : "text-text-muted hover:bg-bg-tertiary hover:text-text-primary"
                                    )}
                                    title={isNavCollapsed ? category.label : undefined}
                                >
                                    <Icon
                                        className={cn(
                                            "w-5 h-5 transition-colors shrink-0",
                                            isActive ? "text-accent-gold" : "text-text-muted group-hover:text-text-primary"
                                        )}
                                        strokeWidth={isActive ? 2 : 1.5}
                                    />

                                    {!isNavCollapsed && (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className={cn(
                                                "text-xs font-black uppercase tracking-widest truncate",
                                                isActive ? "opacity-100" : "opacity-80"
                                            )}
                                        >
                                            {category.label}
                                        </motion.span>
                                    )}

                                    {isActive && !isNavCollapsed && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute right-4 w-1.5 h-1.5 rounded-full bg-accent-gold"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* 2. Right Content Column (Scrollable) */}
                <div className="flex-1 bg-bg-primary relative flex flex-col h-full overflow-hidden min-w-0">
                    {/* Mobile menu toggle */}
                    {isMobile && (
                        <button
                            onClick={() => setIsNavCollapsed(!isNavCollapsed)}
                            className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-bg-secondary hover:bg-bg-tertiary flex items-center justify-center text-text-primary transition-colors"
                        >
                            <ChevronRight className={cn("w-5 h-5 transition-transform", !isNavCollapsed && "rotate-180")} />
                        </button>
                    )}
                    {/* Header */}
                    <div className="p-6 md:p-10 pb-0 shrink-0 z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.3em] mb-2">Intelligence Système</p>
                            <h1 className="text-2xl md:text-4xl font-serif text-text-primary uppercase tracking-tight italic">
                                PARAMÈTRES <span className="text-border px-1 md:px-2">/</span>
                                <span className={cn("text-accent")}>
                                    {activeConfig.label.split('&')[0].toUpperCase()}
                                </span>
                            </h1>
                        </div>

                        {/* Status Bar */}
                        <div className="flex items-center gap-4">
                            {lastSaved && (
                                <div className="px-4 py-2 rounded-full bg-success/10 border border-success/20 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                                    <span className="text-[10px] font-bold text-success uppercase tracking-wider">
                                        Synchronisé {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            )}
                            <div className="flex gap-2">
                                <button className="w-10 h-10 rounded-full bg-bg-secondary hover:bg-bg-tertiary border border-border flex items-center justify-center text-text-muted hover:text-text-primary transition-colors">
                                    <Download className="w-4 h-4" />
                                </button>
                                <button className="w-10 h-10 rounded-full bg-bg-secondary hover:bg-bg-tertiary border border-border flex items-center justify-center text-text-muted hover:text-text-primary transition-colors">
                                    <Upload className="w-4 h-4" />
                                </button>
                                <button className="w-10 h-10 rounded-full bg-bg-secondary hover:bg-error/10 border border-border hover:border-error/30 flex items-center justify-center text-text-muted hover:text-error transition-colors">
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-10 elegant-scrollbar relative">
                        <AnimatePresence mode="popLayout">
                            <motion.div
                                key={activeCategory}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="max-w-7xl mx-auto pb-20"
                            >
                                <Suspense fallback={<SettingsLoading />}>
                                    {settingsContent}
                                </Suspense>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
}
