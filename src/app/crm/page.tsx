"use client";

import { useState } from "react";
import {
    Users,
    Search,
    Filter,
    Plus,
    Star,
    Calendar,
    Clock,
    Phone,
    Mail,
    MapPin,
    ChevronRight,
    TrendingUp,
    Heart,
    Gift,
    AlertCircle,
    CheckCircle2,
    MessageSquare,
    Edit3,
    Trash2,
    Download,
    Upload,
    MoreVertical,
    Eye,
    History,
    DollarSign,
    Award,
    Cake,
    Wine,
    Utensils,
    Tag,
    Send,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { staggerContainer, fadeInUp, cardHover, easing } from "@/lib/motion";
import { useLanguage } from "@/context/LanguageContext";
import { PremiumSelect, SecurityPinModal } from "@/components/ui";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { useCRM } from "@/context/CRMContext";
import { useAuth } from "@/context/AuthContext";
import { Customer } from "@/types";
import { useIsMobile } from "@/hooks";

const SEGMENTS = {
    vip: { name: 'VIP', color: '#8B5CF6', icon: Star },
    regular: { name: 'Régulier', color: '#C5A059', icon: Heart },
    new: { name: 'Nouveau', color: '#4285F4', icon: Plus },
    lost: { name: 'À réactiver', color: '#FF9900', icon: AlertCircle },
};

export default function CRMPage() {
    const isMobile = useIsMobile();
    const { showToast } = useToast();
    const { t } = useLanguage();
    const { customers, updateCustomer, deleteCustomer, addCustomer, isLoading } = useCRM();
    const { canDo, logAction } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterSegment, setFilterSegment] = useState<string | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [showNewCustomer, setShowNewCustomer] = useState(false);
    const [showSecurityModal, setShowSecurityModal] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

    // New Customer Form State
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [birthday, setBirthday] = useState('');
    const [segment, setSegment] = useState('new');
    const [notes, setNotes] = useState('');

    const filteredCustomers = customers.filter(c => {
        const cName = (c as any).name || `${c.firstName} ${c.lastName}`;
        const cEmail = c.email || '';
        if (filterSegment && (c as any).segment !== filterSegment) return false;
        if (searchQuery && !cName.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !cEmail.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !c.phone.includes(searchQuery)) return false;
        return true;
    });

    const stats = {
        total: customers.length,
        vip: customers.filter(c => (c as any).segment === 'vip').length,
        totalRevenue: customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0),
    };

    const handleDeleteClick = (customer: Customer, e: React.MouseEvent) => {
        e.stopPropagation();
        setCustomerToDelete(customer);
        setShowSecurityModal(true);
    };

    const confirmDeleteCustomer = async () => {
        if (customerToDelete) {
            try {
                await deleteCustomer(customerToDelete.id);
                showToast(t('crm.customer_deleted'), "success");
                setShowSecurityModal(false);
                setCustomerToDelete(null);
                if (selectedCustomer?.id === customerToDelete.id) {
                    setSelectedCustomer(null);
                }
            } catch (error) {
                showToast(t('crm.delete_error'), "error");
            }
        }
    };

    const handleCRMAction = (action: string, customer: any) => {
        showToast(`${action} pour ${customer.firstName}`, "info");
    };

    return (
        <div className="flex h-screen -m-4 md:-m-8 bg-bg-primary overflow-hidden relative">
            {/* Desktop Sidebar */}
            {!isMobile && (
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-[380px] bg-bg-secondary border-r border-border p-10 flex flex-col z-20"
                >
                    <div className="mb-20">
                        <p className="text-[10px] font-black text-accent-gold uppercase tracking-[0.4em] mb-4">{t('crm.database_title')}</p>
                        <h1 className="text-5xl font-serif text-text-primary italic tracking-tight leading-tight">
                            {t('crm.concierge_title')} <br />
                            <span className="text-text-muted/20 font-light not-italic">{t('crm.clients_subtitle')}</span>
                        </h1>
                    </div>

                    <div className="relative mb-16">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/30" />
                        <input
                            type="text"
                            placeholder={t('crm.search_placeholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-16 pl-16 pr-8 bg-bg-tertiary/50 rounded-[2rem] border-none font-sans font-black text-[10px] text-text-primary outline-none tracking-widest focus:bg-bg-tertiary transition-all"
                        />
                    </div>

                    <div className="space-y-4 flex-1">
                        <button
                            onClick={() => setFilterSegment(null)}
                            className={cn(
                                "w-full flex items-center justify-between px-8 py-5 rounded-[2rem] transition-all relative group",
                                !filterSegment ? "bg-accent-gold/10 text-accent-gold" : "text-text-muted hover:bg-bg-tertiary"
                            )}
                        >
                            <div className="flex items-center gap-5 relative z-10">
                                <Users className={cn("w-5 h-5", !filterSegment ? "text-accent-gold" : "text-text-muted/30")} />
                                <span className="font-black text-[11px] tracking-[0.2em] uppercase">{t('crm.global_portfolio')}</span>
                            </div>
                            <span className="text-[10px] font-mono font-bold opacity-50">{customers.length}</span>
                        </button>

                        {Object.entries(SEGMENTS).map(([key, segment]) => {
                            const Icon = segment.icon;
                            const count = customers.filter(c => (c as any).segment === key).length;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setFilterSegment(filterSegment === key ? null : key)}
                                    className={cn("w-full flex items-center justify-between px-8 py-5 rounded-[2rem] transition-all", filterSegment === key ? "text-text-primary bg-bg-tertiary/50" : "text-text-muted hover:bg-bg-tertiary")}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center border border-border bg-bg-primary">
                                            <Icon className="w-5 h-5" style={{ color: segment.color }} />
                                        </div>
                                        <span className="font-black text-[11px] tracking-[0.2em] uppercase">{t(`crm.segments.${key}`)}</span>
                                    </div>
                                    <span className="text-[10px] font-mono font-bold opacity-50">{count}</span>
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {/* Main Content */}
            <div className="flex-1 overflow-auto bg-bg-primary p-6 md:p-12 md:pt-16 elegant-scrollbar flex flex-col pb-32 md:pb-0">
                <div className="max-w-7xl mx-auto w-full">
                    {/* Mobile Header & Search */}
                    {isMobile && (
                        <div className="mb-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <h1 className="text-4xl font-serif text-text-primary italic tracking-tight">{t('crm.concierge_title')}</h1>
                                <button onClick={() => setShowNewCustomer(true)} className="w-12 h-12 rounded-full bg-text-primary text-white flex items-center justify-center">
                                    <Plus className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/30" />
                                <input
                                    type="text"
                                    placeholder={t('crm.search_placeholder')}
                                    className="w-full h-14 pl-14 pr-6 bg-bg-tertiary/50 rounded-2xl border-none text-[10px] font-black uppercase tracking-widest outline-none"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            {/* Horizontal Segment Scroll */}
                            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 px-1">
                                <button
                                    onClick={() => setFilterSegment(null)}
                                    className={cn("whitespace-nowrap px-6 h-11 rounded-full text-[9px] font-black uppercase tracking-widest transition-all", !filterSegment ? "bg-accent-gold text-white" : "bg-bg-tertiary text-text-muted")}
                                >
                                    {t('crm.all_clients')}
                                </button>
                                {Object.entries(SEGMENTS).map(([key, segment]) => (
                                    <button
                                        key={key}
                                        onClick={() => setFilterSegment(key)}
                                        className={cn("whitespace-nowrap px-6 h-11 rounded-full text-[9px] font-black uppercase tracking-widest transition-all", filterSegment === key ? "bg-text-primary text-white" : "bg-bg-tertiary text-text-muted")}
                                    >
                                        {t(`crm.segments.${key}`)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Desktop Toolbar */}
                    {!isMobile && (
                        <div className="flex items-start justify-between mb-16 px-4">
                            <h2 className="text-4xl font-serif text-text-primary italic">{filterSegment ? t(`crm.segments.${filterSegment}`) : t('crm.all_clients')}</h2>
                            <div className="flex gap-4">
                                <Button onClick={() => setShowNewCustomer(true)} className="h-14 bg-text-primary dark:bg-white hover:bg-black dark:hover:bg-neutral-100 rounded-2xl text-bg-secondary dark:text-bg-primary text-[10px] font-black uppercase tracking-[0.2em] px-10 shadow-2xl">
                                    <Plus className="w-4 h-4 mr-3" strokeWidth={3} />
                                    {t('crm.new_profile')}
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
                        {filteredCustomers.map((customer, i) => (
                            <motion.div
                                key={customer.id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.03 }}
                                className="bg-white dark:bg-bg-secondary p-4 md:p-6 rounded-[2rem] md:rounded-[3rem] flex items-center justify-between group cursor-pointer hover:shadow-xl transition-all border border-neutral-100 dark:border-border/50 h-28 md:h-36"
                                onClick={() => setSelectedCustomer(customer)}
                            >
                                <div className="flex items-center gap-4 md:gap-8">
                                    <div className="relative shrink-0">
                                        <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-bg-tertiary flex items-center justify-center border border-border shadow-inner">
                                            <span className="text-text-primary font-serif italic text-xl md:text-3xl">
                                                {customer.firstName[0]}{customer.lastName[0]}
                                            </span>
                                        </div>
                                        <div className="absolute top-0 right-0 w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#3B82F6] border-[2px] md:border-[3px] border-white dark:border-bg-secondary" />
                                    </div>
                                    <div className="space-y-1 md:space-y-3">
                                        <h3 className="text-xl md:text-4xl font-serif text-text-primary italic tracking-tight leading-none">
                                            {customer.firstName[0]}. {customer.lastName}
                                        </h3>
                                        <span className="inline-flex px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest bg-bg-tertiary text-text-muted/60">
                                            {t(`crm.segments.${(customer as any).segment || 'new'}`)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-4 md:gap-12 mr-2 md:mr-8 text-right">
                                    <div className="hidden sm:block">
                                        <p className="text-[7px] md:text-[9px] font-black text-text-muted/40 uppercase tracking-widest">VISITES</p>
                                        <p className="text-lg md:text-3xl font-serif italic text-text-primary">{customer.visitCount}</p>
                                    </div>
                                    <div>
                                        <p className="text-[7px] md:text-[9px] font-black text-text-muted/40 uppercase tracking-widest">TOTAL</p>
                                        <p className="text-lg md:text-3xl font-serif italic text-accent-gold">{customer.totalSpent.toFixed(0)}€</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Customer Detail Sheet/Panel */}
            <AnimatePresence>
                {selectedCustomer && (
                    isMobile ? (
                        <BottomSheet
                            isOpen={true}
                            onClose={() => setSelectedCustomer(null)}
                            title={selectedCustomer.name}
                            subtitle={`Profil ${selectedCustomer.segment.toUpperCase()} • ID: ${selectedCustomer.id.slice(0, 8)}`}
                        >
                            <div className="space-y-10 py-6">
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { value: selectedCustomer.visitCount, label: 'Sessions', icon: Users },
                                        { value: `${selectedCustomer.totalSpent.toFixed(0)}€`, label: 'Revenue', icon: DollarSign, gold: true },
                                        { value: `${(selectedCustomer.totalSpent / (selectedCustomer.visitCount || 1)).toFixed(0)}€`, label: 'Panier', icon: TrendingUp }
                                    ].map((s, i) => (
                                        <div key={i} className="bg-bg-tertiary p-5 rounded-[2rem] text-center border border-border/50">
                                            <p className={cn("text-xl font-serif italic", s.gold ? "text-accent-gold" : "text-text-primary")}>{s.value}</p>
                                            <p className="text-[7px] font-black text-text-muted/50 uppercase tracking-widest mt-1">{t(s.label)}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-3">
                                    <h4 className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] px-2">{t('crm.contact_info')}</h4>
                                    <div className="p-5 bg-bg-tertiary rounded-3xl flex items-center gap-5">
                                        <Phone className="w-5 h-5 text-accent-gold/40" />
                                        <p className="text-sm font-bold tracking-[0.1em]">{selectedCustomer.phone}</p>
                                    </div>
                                    <div className="p-5 bg-bg-tertiary rounded-3xl flex items-center gap-5">
                                        <Mail className="w-5 h-5 text-accent-gold/40" />
                                        <p className="text-xs font-bold uppercase tracking-widest text-text-primary">{selectedCustomer.email}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-6">
                                    <Button className="h-16 rounded-2xl bg-text-primary text-white text-[10px] font-black uppercase tracking-widest">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Réserver
                                    </Button>
                                    <Button variant="outline" className="h-16 rounded-2xl border-border text-[10px] font-black uppercase tracking-widest">
                                        <Send className="w-4 h-4 mr-2" />
                                        Message
                                    </Button>
                                </div>
                            </div>
                        </BottomSheet>
                    ) : (
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            className="fixed right-0 top-[70px] h-[calc(100vh-70px)] w-[450px] bg-bg-secondary border-l border-border z-40 shadow-2xl overflow-auto elegant-scrollbar"
                        >
                            {/* Desktop Detail Content - Retaining existing high-end design */}
                            <div className="p-10 border-b border-border bg-text-primary text-white relative overflow-hidden">
                                <button onClick={() => setSelectedCustomer(null)} className="absolute top-6 right-6 w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-all z-20">
                                    <X className="w-6 h-6" />
                                </button>
                                <div className="relative z-10">
                                    <div className="w-24 h-24 rounded-[2.5rem] bg-white/10 flex items-center justify-center mb-8 border border-white/20">
                                        <span className="text-4xl font-serif italic">{selectedCustomer.firstName[0]}{selectedCustomer.lastName[0]}</span>
                                    </div>
                                    <h3 className="text-5xl font-serif italic mb-4 tracking-tight leading-none">{selectedCustomer.firstName} {selectedCustomer.lastName}</h3>
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full bg-accent-gold" />
                                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">VIP PRIVILÈGE • {selectedCustomer.id.slice(0, 8)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-10 space-y-10">
                                {/* Stats & Metrics */}
                                <div className="grid grid-cols-3 gap-4">
                                    {[{ v: selectedCustomer.visitCount, l: 'Visites' }, { v: `${selectedCustomer.totalSpent.toFixed(0)}€`, l: 'Total', g: true }, { v: '12%', l: 'Reward' }].map((st, i) => (
                                        <div key={i} className="bg-bg-tertiary p-6 rounded-[2rem] text-center border border-border/40">
                                            <p className={cn("text-2xl font-serif italic", st.g ? "text-accent-gold" : "text-text-primary")}>{st.v}</p>
                                            <p className="text-[7px] font-black text-text-muted/40 uppercase tracking-[0.2em] mt-1">{st.l}</p>
                                        </div>
                                    ))}
                                </div>
                                {/* Contact */}
                                <div className="space-y-4">
                                    <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em]">{t('crm.contact_info')}</p>
                                    <div className="flex items-center gap-6 p-6 rounded-[2rem] bg-bg-tertiary border border-border/40 hover:border-accent-gold/20 transition-all">
                                        <Phone className="w-4 h-4 text-accent-gold" />
                                        <p className="text-sm font-bold tracking-widest">{selectedCustomer.phone}</p>
                                    </div>
                                    <div className="flex items-center gap-6 p-6 rounded-[2rem] bg-bg-tertiary border border-border/40 hover:border-accent-gold/20 transition-all">
                                        <Mail className="w-4 h-4 text-accent-gold" />
                                        <p className="text-sm font-bold uppercase tracking-widest">{selectedCustomer.email}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )
                )}
            </AnimatePresence>

            {/* New Customer Sheet (Mobile) / Modal (Desktop) */}
            <BottomSheet
                isOpen={isMobile && showNewCustomer}
                onClose={() => setShowNewCustomer(false)}
                title={t('crm.new_profile')}
                size="full"
            >
                <div className="space-y-8 py-6">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-text-muted px-2">Nom Complet</label>
                        <input type="text" className="w-full h-14 bg-bg-tertiary rounded-2xl px-6 font-bold" placeholder="JEAN DUPONT" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-text-muted px-2">Téléphone</label>
                        <input type="tel" className="w-full h-14 bg-bg-tertiary rounded-2xl px-6 font-bold" placeholder="+33 6..." value={phone} onChange={e => setPhone(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-text-muted px-2">Commentaires</label>
                        <textarea className="w-full h-32 bg-bg-tertiary rounded-2xl p-6 font-bold resize-none" placeholder="Allergies, Préférences..." value={notes} onChange={e => setNotes(e.target.value)} />
                    </div>
                    <Button onClick={() => setShowNewCustomer(false)} className="w-full h-16 bg-success text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">
                        Homologuer Profil
                    </Button>
                </div>
            </BottomSheet>

            {!isMobile && (
                <SecurityPinModal
                    isOpen={showSecurityModal}
                    onClose={() => setShowSecurityModal(false)}
                    onSuccess={confirmDeleteCustomer}
                />
            )}
        </div>
    );
}
