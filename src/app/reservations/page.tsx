"use client";

import { useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Search,
    Users,
    Filter,
    LayoutGrid,
    MoreHorizontal,
    UserCheck,
    Clock,
    Star,
    Phone,
    Mail,
    Calendar,
    ArrowDown,
    Info,
    PanelLeft,
    PanelLeftClose,
    Timer,
    CheckCircle2,
    AlertCircle,
    UtensilsCrossed,
    Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useReservations } from "@/context/ReservationsContext";
import { Customer, Reservation } from "@/types";
import { useToast } from "@/components/ui/Toast";
import { useUI } from "@/context/UIContext";
import { format, addDays, subDays, startOfWeek, endOfWeek } from "date-fns";
import { fr } from "date-fns/locale";
import { NewCustomerDialog } from "@/components/reservations/NewCustomerDialog";
import { NewReservationDialog } from "@/components/reservations/NewReservationDialog";
import { useRouter } from "next/navigation";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { staggerContainer, staggerItem, fadeInUp, cardHover, easing } from "@/lib/motion";
import { TableInsightPanel } from "@/components/floor-plan/TableInsightPanel";
import { useLanguage } from "@/context/LanguageContext";

const cinematicContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const cinematicItem: Variants = {
    hidden: { opacity: 0, scale: 0.98, y: 10 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.5, ease: easing.easeOutExpo }
    }
};

const CustomerDetailPanel = ({
    customer,
    getCustomerHistory,
    setSelectedCustomer,
    setIsNewReservationModalOpen
}: {
    customer: Customer;
    getCustomerHistory: (id: string) => any;
    setSelectedCustomer: (val: Customer | null) => void;
    setIsNewReservationModalOpen: (val: boolean) => void;
}) => {
    const { t } = useLanguage();
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-[100] p-4 md:p-8 animate-in fade-in duration-500" onClick={() => setSelectedCustomer(null)}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-bg-primary rounded-[3rem] shadow-[0_32px_128px_rgba(0,0,0,0.6)] w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-white/10"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-text-primary dark:bg-bg-tertiary p-6 md:p-10 relative overflow-hidden text-white border-b border-white/5">
                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 relative z-10">
                        <div className="w-16 h-16 md:w-24 md:h-24 rounded-[2rem] bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-2xl md:text-4xl font-serif font-light italic shadow-2xl text-accent">
                            {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">{t('reservations.customer.executive_intelligence')}</p>
                            <h2 className="text-2xl md:text-4xl font-serif font-light tracking-tight italic">{customer.firstName} {customer.lastName}</h2>
                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 md:gap-3 mt-4 md:mt-6">
                                {customer.tags.map(tag => (
                                    <span key={tag} className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-accent text-bg-primary shadow-lg shadow-amber-500/20">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <ScrollArea className="flex-1 elegant-scrollbar">
                    <div className="p-10 space-y-12">
                        {/* Stats Hub */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5">
                                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">{t('reservations.customer.total_spent')}</p>
                                <p className="text-2xl font-mono font-light text-accent italic">{customer.totalSpent.toFixed(2)}€</p>
                            </div>
                            <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5">
                                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">{t('reservations.customer.visits')}</p>
                                <p className="text-2xl font-mono font-light text-accent italic">{customer.visitCount}</p>
                            </div>
                            <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5">
                                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">{t('reservations.customer.last_visit')}</p>
                                <p className="text-sm font-mono font-bold text-accent">{customer.lastVisit}</p>
                            </div>
                        </div>

                        {/* Contact & Preferences Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-6 flex items-center gap-4">
                                    <Info className="w-4 h-4 text-accent" />
                                    {t('reservations.customer.contact')}
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-accent group-hover:bg-accent/10 transition-all">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-mono font-bold text-white/60">{customer.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-accent group-hover:bg-accent/10 transition-all">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-mono font-bold text-white/60">{customer.email}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-6 flex items-center gap-4">
                                    <Star className="w-4 h-4 text-accent" />
                                    {t('reservations.customer.preferences')}
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {customer.preferences.map((pref, i) => (
                                        <span key={i} className="px-6 py-3 bg-white/5 rounded-2xl text-[12px] font-bold text-white border border-white/10 shadow-sm italic group-hover:border-accent/40 transition-all">
                                            {pref}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <div className="p-10 border-t border-border/20 bg-bg-primary dark:bg-bg-secondary flex gap-6">
                    <Button variant="ghost" onClick={() => setSelectedCustomer(null)} className="h-16 px-10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white border border-white/10 transition-all">
                        {t('reservations.customer.close')}
                    </Button>
                    <Button
                        onClick={() => {
                            setIsNewReservationModalOpen(true);
                            setSelectedCustomer(null);
                        }}
                        className="flex-1 h-16 bg-accent hover:bg-white text-bg-primary rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-amber-500/10 transition-all flex items-center justify-center gap-4"
                    >
                        <Calendar strokeWidth={1.5} className="w-5 h-5" />
                        {t('reservations.customer.new_table')}
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default function ReservationsPage() {
    const router = useRouter();
    const { t, language } = useLanguage();
    const { showToast } = useToast();
    const { openDocumentation } = useUI();
    const [view, setView] = useState<"day" | "week">("day");
    const [activeSection, setActiveSection] = useState<"reservations" | "customers">("reservations");
    const [currentDate, setCurrentDate] = useState(new Date('2025-12-29'));
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
    const [isNewReservationModalOpen, setIsNewReservationModalOpen] = useState(false);
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [selectedTable, setSelectedTable] = useState<any | null>(null);

    const { reservations, getReservationsForDate, customers, addCustomer, getCustomerHistory } = useReservations();

    const handlePrev = () => {
        setCurrentDate(prev => view === 'day' ? subDays(prev, 1) : subDays(prev, 7));
    };

    const handleNext = () => {
        setCurrentDate(prev => view === 'day' ? addDays(prev, 1) : addDays(prev, 7));
    };

    const displayDate = format(currentDate, "EEEE d MMMM", { locale: language === 'fr' ? fr : undefined });
    const currentReservations = view === 'day'
        ? getReservationsForDate(format(currentDate, 'yyyy-MM-dd'))
        : reservations.filter(r => {
            const rDate = new Date(r.date);
            const start = startOfWeek(currentDate, { weekStartsOn: 1 });
            const end = endOfWeek(currentDate, { weekStartsOn: 1 });
            return rDate >= start && rDate <= end;
        });

    const tables = {
        "VIP": [
            { id: "V1", seats: 4, type: 'vip', status: 'occupied', number: "V1" },
            { id: "V2", seats: 2, type: 'vip', status: 'reserved', number: "V2" },
            { id: "V3", seats: 6, type: 'vip', status: 'available', number: "V3" },
        ],
        "TERRACE": [
            { id: "T1", seats: 2, type: 'terrace', status: 'available', number: "T1" },
            { id: "T2", seats: 4, type: 'terrace', status: 'occupied', number: "T2" },
            { id: "T3", seats: 4, type: 'terrace', status: 'available', number: "T3" },
            { id: "T4", seats: 2, type: 'terrace', status: 'available', number: "T4" },
        ],
        "STANDARD": [
            { id: "1", seats: 2, type: 'standard', status: 'reserved', number: "1" },
            { id: "2", seats: 4, type: 'standard', status: 'occupied', number: "2" },
            { id: "3", seats: 4, type: 'standard', status: 'available', number: "3" },
            { id: "4", seats: 6, type: 'standard', status: 'available', number: "4" },
            { id: "5", seats: 8, type: 'standard', status: 'available', number: "5" },
            { id: "6", seats: 4, type: 'standard', status: 'reserved', number: "6" },
        ]
    };

    return (
        <div className="flex h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] -m-4 md:-m-8 flex-row bg-bg-primary transition-colors duration-500 overflow-hidden font-sans pb-20 md:pb-0 text-text-primary">

            {/* Sidebar Manifeste */}
            <AnimatePresence mode="wait">
                {isSidebarVisible && activeSection === 'reservations' && (
                    <motion.div
                        initial={{ width: 0, opacity: 0, x: -50 }}
                        animate={{
                            width: 400,
                            opacity: 1,
                            x: 0
                        }}
                        exit={{ width: 0, opacity: 0, x: -50 }}
                        transition={{ duration: 0.4, ease: easing.easeOutExpo }}
                        className="hidden lg:flex border-r border-border bg-bg-secondary flex-col relative z-20 overflow-hidden shrink-0 h-full"
                    >
                        <div className="p-8 space-y-6 bg-bg-secondary border-b border-border">
                            <div className="flex items-center gap-4">
                                <motion.button
                                    layoutId="sidebar-toggle"
                                    onClick={() => setIsSidebarVisible(false)}
                                    className="w-10 h-10 bg-white dark:bg-white/10 rounded-xl shadow-lg border border-black/5 flex items-center justify-center text-text-primary hover:scale-105 active:scale-95 transition-transform"
                                >
                                    <PanelLeftClose className="w-5 h-5" />
                                </motion.button>
                                <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">{t('reservations.sidebar.manifest')}</span>
                            </div>
                            <div className="relative group">
                                <Search strokeWidth={1.5} className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted group-focus-within:text-accent transition-colors" />
                                <input
                                    type="text"
                                    placeholder={t('reservations.sidebar.search_placeholder')}
                                    className="w-full bg-bg-primary dark:bg-bg-tertiary border border-border rounded-full pl-14 pr-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/40 transition-all font-mono"
                                />
                            </div>
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                    <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em]">
                                        {t('reservations.sidebar.manifest_count')} <span className="text-accent">{currentReservations.length}</span>
                                    </span>
                                </div>
                                <button className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-2 hover:text-accent transition-colors">
                                    <Filter strokeWidth={1.5} className="w-3.5 h-3.5" />
                                    {t('reservations.sidebar.sort')}
                                </button>
                            </div>
                        </div>

                        <ScrollArea className="flex-1 elegant-scrollbar">
                            <motion.div
                                variants={cinematicContainer}
                                initial="hidden"
                                animate="visible"
                                className="p-8 space-y-6"
                            >
                                {currentReservations.length === 0 ? (
                                    <motion.div variants={fadeInUp} className="flex flex-col items-center justify-center py-24 text-center">
                                        <div className="w-16 h-16 rounded-[2rem] bg-bg-tertiary flex items-center justify-center mb-6 border border-border">
                                            <Clock strokeWidth={1} className="w-8 h-8 text-text-muted/50" />
                                        </div>
                                        <p className="text-[9px] font-black text-text-muted/50 uppercase tracking-[0.3em] italic">{t('reservations.sidebar.empty')}</p>
                                    </motion.div>
                                ) : (
                                    <AnimatePresence mode="popLayout">
                                        {currentReservations.map(res => (
                                            <motion.div
                                                key={res.id}
                                                variants={cinematicItem}
                                                whileHover={{ y: -5, transition: { duration: 0.3 } }}
                                                className="bg-bg-tertiary rounded-[2.5rem] p-6 border border-border hover:border-accent/40 hover:shadow-2xl hover:shadow-black/10 transition-all duration-500 cursor-pointer group relative overflow-hidden"
                                            >
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-14 h-14 rounded-2xl bg-accent flex flex-col items-center justify-center shadow-lg shadow-amber-500/10 group-hover:bg-white transition-all">
                                                            <span className="text-[14px] font-mono font-light text-bg-primary italic tracking-tighter group-hover:text-bg-primary transition-colors">{res.time}</span>
                                                        </div>
                                                        <div>
                                                            <h3 className="font-serif font-light text-xl text-text-primary italic leading-tight group-hover:text-accent transition-colors">{res.customerName}</h3>
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <div className={cn("w-1.5 h-1.5 rounded-full", res.status === 'seated' ? "bg-emerald-500" : "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.3)]")} />
                                                                <span className="text-[8px] font-black text-text-muted uppercase tracking-[0.2em]">{res.status === 'seated' ? t('reservations.sidebar.seated') : t('reservations.sidebar.expected')}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button className="p-2 text-neutral-400 hover:text-accent transition-all">
                                                        <MoreHorizontal strokeWidth={1.5} className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <div className="flex justify-between items-center pt-5 border-t border-white/5">
                                                    <div className="flex items-center gap-6">
                                                        <div className="flex items-center gap-2">
                                                            <Users strokeWidth={1.5} className="h-4 w-4 text-accent" />
                                                            <span className="text-[13px] font-mono font-light italic text-text-muted">{res.covers}p</span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-xl bg-bg-primary flex items-center justify-center text-[10px] font-mono font-bold text-text-primary border border-border">
                                                                {res.tableId.replace(/^t/, '')}
                                                            </div>
                                                            <span className="text-[9px] font-black uppercase tracking-widest text-text-muted/50 italic">{t('reservations.sidebar.unit')}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                )}
                            </motion.div>
                        </ScrollArea>

                        <div className="p-8 bg-bg-secondary border-t border-border mt-auto">
                            <div className="flex items-center justify-between bg-bg-tertiary border border-border p-6 rounded-[2.5rem] shadow-2xl group hover:border-accent/40 transition-all cursor-pointer">
                                <div>
                                    <span className="text-[8px] font-black text-text-muted uppercase tracking-[0.3em]">{t('reservations.sidebar.total_covers')}</span>
                                    <p className="text-3xl font-mono font-light text-accent italic leading-none mt-2">
                                        {currentReservations.reduce((acc, r) => acc + r.covers, 0)}
                                    </p>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center text-bg-primary shadow-lg shadow-amber-500/10 group-hover:scale-110 transition-transform">
                                    <UserCheck strokeWidth={1.5} className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Reopen Trigger Removed as requested - Button moves to Toolbar */}

            {/* Main Content Area */}
            <div className="flex-1 h-full overflow-y-auto overflow-x-hidden bg-bg-primary elegant-scrollbar relative flex flex-col">
                {/* Professional Toolbar */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: easing.easeOutExpo }}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-bg-secondary/50 backdrop-blur-md border-b border-border px-8 py-4 z-40 shrink-0 sticky top-0"
                >
                    <div className="flex items-center gap-6 md:gap-10">
                        {/* Sidebar Toggle Button - Now Morphing */}
                        {!isSidebarVisible && (
                            <motion.button
                                layoutId="sidebar-toggle"
                                onClick={() => setIsSidebarVisible(true)}
                                className="w-10 h-10 bg-white dark:bg-white/10 rounded-xl shadow-lg border border-black/5 flex items-center justify-center text-text-primary hover:scale-105 active:scale-95 transition-transform"
                            >
                                <PanelLeft className="w-5 h-5" />
                            </motion.button>
                        )}

                        {/* Tab Switcher */}
                        <div className="flex items-center bg-bg-tertiary p-1 rounded-full border border-border shadow-sm">
                            <button
                                onClick={() => setActiveSection('reservations')}
                                className={cn(
                                    "h-10 px-6 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2.5",
                                    activeSection === 'reservations'
                                        ? "bg-bg-primary text-text-primary shadow-sm ring-1 ring-black/5 dark:ring-white/5"
                                        : "text-text-muted hover:text-text-primary hover:bg-bg-primary/50"
                                )}
                            >
                                <LayoutGrid strokeWidth={2} className="w-3.5 h-3.5" />
                                {t('reservations.tabs.plan')}
                            </button>
                            <button
                                onClick={() => setActiveSection('customers')}
                                className={cn(
                                    "h-10 px-6 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2.5",
                                    activeSection === 'customers'
                                        ? "bg-bg-primary text-text-primary shadow-sm ring-1 ring-black/5 dark:ring-white/5"
                                        : "text-text-muted hover:text-text-primary hover:bg-bg-primary/50"
                                )}
                            >
                                <Users strokeWidth={2} className="w-3.5 h-3.5" />
                                {t('reservations.tabs.list')}
                            </button>
                        </div>

                        {/* Date Navigator */}
                        <div className="flex items-center gap-4 bg-bg-tertiary/50 px-4 py-2 rounded-full border border-border/50">
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={handlePrev}
                                className="p-2 hover:bg-bg-primary rounded-full text-text-muted hover:text-accent transition-all"
                            >
                                <ChevronLeft strokeWidth={2.5} className="h-3.5 w-3.5" />
                            </motion.button>
                            <span className="text-[12px] font-serif font-medium italic text-text-primary capitalize min-w-[140px] text-center">
                                {displayDate}
                            </span>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={handleNext}
                                className="p-2 hover:bg-bg-primary rounded-full text-text-muted hover:text-accent transition-all"
                            >
                                <ChevronRight strokeWidth={2.5} className="h-3.5 w-3.5" />
                            </motion.button>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center bg-bg-tertiary p-1 rounded-full border border-border">
                            {(['day', 'week'] as const).map((v) => (
                                <button
                                    key={v}
                                    onClick={() => setView(v)}
                                    className={cn(
                                        "px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all",
                                        view === v
                                            ? "bg-bg-primary text-text-primary shadow-sm"
                                            : "text-text-muted hover:text-text-primary"
                                    )}
                                >
                                    {v === 'day' ? t('reservations.tabs.day') : t('reservations.tabs.week')}
                                </button>
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsNewReservationModalOpen(true)}
                            className="h-12 px-8 bg-accent text-bg-primary rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-amber-500/10 hover:shadow-amber-500/20 flex items-center gap-3 border border-amber-300/20"
                        >
                            <Plus strokeWidth={2.5} className="w-3.5 h-3.5" />
                            {t('reservations.actions.reserve')}
                        </motion.button>
                    </div>
                </motion.div>

                {/* Main Content Body */}
                <div className="flex-1 w-full relative">
                    {activeSection === 'reservations' ? (
                        <div className="p-4 md:p-8 pb-32">
                            <div className="max-w-[1800px] mx-auto space-y-12">
                                {Object.entries(tables).map(([zone, tableList]) => (
                                    <div key={zone}>
                                        <div className="flex items-center gap-4 mb-6">
                                            {zone === 'VIP' && <div className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_15px_rgba(197,160,89,0.4)]" />}
                                            {zone === 'TERRACE' && <div className="w-2.5 h-2.5 rounded-full bg-[#00D9A6] shadow-[0_0_15px_rgba(0,217,166,0.3)]" />}
                                            {zone === 'STANDARD' && <div className="w-2.5 h-2.5 rounded-full bg-text-muted/20" />}
                                            <span className={cn(
                                                "text-[10px] font-black uppercase tracking-[0.3em]",
                                                zone === 'VIP' ? "text-accent" : zone === 'TERRACE' ? "text-emerald-500" : "text-text-muted/60"
                                            )}>{t('reservations.zones.zone')} {zone}</span>
                                            <div className="h-px flex-1 bg-border/40" />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                                            {tableList.map((table: any) => {
                                                // Status Mapping for Style Consistency
                                                const effectiveStatus =
                                                    table.status === 'available' ? 'free' :
                                                        table.status === 'occupied' ? 'seated' :
                                                            table.status;

                                                const getStatusStyles = () => {
                                                    switch (effectiveStatus) {
                                                        case 'free':
                                                            return {
                                                                container: "bg-white/80 dark:bg-white/[0.03] border-white/20 dark:border-white/5 hover:border-accent/50 hover:-translate-y-2 backdrop-blur-xl",
                                                                circle: "bg-bg-primary text-text-primary border-accent/20 group-hover:bg-accent group-hover:text-white",
                                                                icon: "text-accent",
                                                                indicator: "bg-accent",
                                                                bar: "bg-accent",
                                                                spotlight: "bg-gradient-to-br from-accent/10 to-transparent"
                                                            };
                                                        case 'seated':
                                                            return {
                                                                container: "bg-accent/5 border-accent shadow-inner",
                                                                circle: "bg-accent/20 text-accent border-accent/30",
                                                                icon: "text-accent",
                                                                indicator: "bg-accent",
                                                                bar: "bg-accent",
                                                                spotlight: "bg-gradient-to-br from-accent/10 to-transparent"
                                                            };
                                                        case 'reserved':
                                                            return {
                                                                container: "bg-purple-500/5 border-purple-500 shadow-inner",
                                                                circle: "bg-purple-500/20 text-purple-500 border-purple-500/30",
                                                                icon: "text-purple-500",
                                                                indicator: "bg-purple-500",
                                                                bar: "bg-purple-500",
                                                                spotlight: "bg-gradient-to-br from-purple-500/10 to-transparent"
                                                            };
                                                        default:
                                                            return {
                                                                container: "bg-neutral-100 dark:bg-white/[0.01] border-border opacity-60 grayscale cursor-not-allowed",
                                                                circle: "bg-neutral-200 text-neutral-400 border-neutral-300",
                                                                icon: "text-neutral-400",
                                                                indicator: "bg-neutral-400",
                                                                bar: "bg-neutral-400",
                                                                spotlight: "bg-transparent"
                                                            };
                                                    }
                                                };

                                                const styles = getStatusStyles();

                                                return (
                                                    <motion.div
                                                        key={table.id}
                                                        variants={cinematicItem}
                                                        onClick={() => setSelectedTable(table)}
                                                        className={cn(
                                                            "group relative flex flex-col items-center justify-center min-h-[160px] md:min-h-[180px] rounded-[48px] border transition-all duration-700 overflow-hidden shadow-sm hover:shadow-2xl cursor-pointer",
                                                            styles.container
                                                        )}
                                                    >
                                                        {/* Museum Spotlight Effect */}
                                                        <div className={cn(
                                                            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none",
                                                            styles.spotlight
                                                        )} />

                                                        {/* Background subtle number - Museum Style */}
                                                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700 pointer-events-none">
                                                            <span className="text-9xl font-serif font-black text-text-primary italic">{table.number}</span>
                                                        </div>

                                                        <div className="relative z-10 flex flex-col items-center gap-4">
                                                            <div className={cn(
                                                                "w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center font-serif font-bold text-3xl md:text-4xl transition-all duration-700 border",
                                                                styles.circle
                                                            )}>
                                                                {table.number}
                                                            </div>

                                                            <div className="flex flex-col items-center">
                                                                <span className="text-[10px] md:text-[12px] font-black text-text-muted uppercase tracking-[0.3em] group-hover:text-text-primary transition-colors">Table</span>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <Users className={cn("w-3 md:w-3.5 h-3 md:h-3.5", styles.icon)} />
                                                                    <span className="text-[11px] md:text-[13px] font-bold text-text-primary font-serif italic">{table.seats} Pers.</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Premium Indicator */}
                                                        {['seated', 'ordered', 'eating', 'paying'].includes(effectiveStatus) && (
                                                            <div className="absolute top-6 right-6">
                                                                <div className={cn(
                                                                    "w-2.5 h-2.5 rounded-full animate-pulse shadow-glow",
                                                                    styles.indicator
                                                                )} />
                                                            </div>
                                                        )}

                                                        <div className={cn(
                                                            "absolute bottom-0 left-0 right-0 h-1.5 transition-all duration-700 opacity-10 md:opacity-0 group-hover:opacity-100",
                                                            styles.bar
                                                        )} />
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="p-12 pb-32">
                            <div className="max-w-7xl mx-auto space-y-16">
                                <div className="bg-bg-secondary p-8 rounded-full border border-border flex items-center justify-between gap-12 max-w-5xl mx-auto shadow-2xl">
                                    <div className="relative flex-1">
                                        <Search strokeWidth={1.5} className="absolute left-8 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                                        <input type="text" placeholder={t('reservations.list.search_placeholder')} className="w-full bg-bg-primary border border-border rounded-full pl-16 pr-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/40" />
                                    </div>
                                    <div className="pr-4 border-l border-white/5 pl-10">
                                        <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] mb-1 italic">{t('reservations.list.registry')}</p>
                                        <span className="text-sm font-mono font-bold text-accent">{customers.length} {t('reservations.list.profiles')}</span>
                                    </div>
                                </div>
                                <motion.div variants={cinematicContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
                                    {customers.map(customer => (
                                        <motion.div key={customer.id} variants={cinematicItem} onClick={() => setSelectedCustomer(customer)} whileHover={{ y: -10 }} className="bg-bg-secondary rounded-[3.5rem] p-12 group border border-border shadow-2xl hover:border-accent/40 cursor-pointer relative overflow-hidden">
                                            <div className="flex items-start gap-10 relative z-10">
                                                <div className="w-20 h-20 rounded-[2rem] bg-accent flex items-center justify-center text-3xl font-serif font-light text-bg-primary italic shadow-xl">{customer.firstName.charAt(0)}{customer.lastName.charAt(0)}</div>
                                                <div className="flex-1">
                                                    <h3 className="text-3xl font-serif font-light text-text-primary italic truncate">{customer.firstName} {customer.lastName}</h3>
                                                    <p className="text-[12px] font-mono font-bold text-text-muted/50 mt-3">{customer.phone}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between mt-12 pt-10 border-t border-border relative z-10">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border"><Star strokeWidth={2} className="w-4 h-4 text-accent" /></div>
                                                    <div><p className="text-[12px] font-mono font-bold text-text-primary">{customer.visitCount}</p><p className="text-[8px] font-black uppercase tracking-[0.3em] text-text-muted/50 mt-1 italic">{t('reservations.list.services')}</p></div>
                                                </div>
                                                <div className="text-right"><p className="text-2xl font-mono font-light text-accent italic">{customer.totalSpent.toFixed(0)}€</p><p className="text-[8px] font-black uppercase tracking-[0.3em] text-text-muted/50 mt-1 italic">{t('reservations.list.value')}</p></div>
                                            </div>
                                            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-accent/5 blur-[80px] rounded-full group-hover:bg-accent/10 transition-colors" />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Global Overlays */}
            <AnimatePresence>
                {selectedTable && (
                    <TableInsightPanel
                        selectedTable={selectedTable}
                        onClose={() => setSelectedTable(null)}
                    />
                )}

                {selectedCustomer && (
                    <CustomerDetailPanel
                        customer={selectedCustomer}
                        getCustomerHistory={getCustomerHistory}
                        setSelectedCustomer={setSelectedCustomer}
                        setIsNewReservationModalOpen={setIsNewReservationModalOpen}
                    />
                )}
            </AnimatePresence>

            <NewCustomerDialog
                isOpen={isNewCustomerModalOpen}
                onClose={() => setIsNewCustomerModalOpen(false)}
                onSave={(customer) => {
                    addCustomer(customer);
                    showToast(t('reservations.customer.add_success'), "success");
                }}
            />

            <NewReservationDialog
                isOpen={isNewReservationModalOpen}
                onClose={() => setIsNewReservationModalOpen(false)}
                onSave={(res) => {
                    // Logic to save reservation would go here
                    showToast(t('reservations.customer.reserve_success'), "success");
                }}
                customers={customers}
            />
        </div>
    );
}
