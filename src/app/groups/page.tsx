"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Plus,
    Users,
    MapPin,
    Clock,
    Euro,
    Phone,
    Mail,
    Building2,
    User,
    ChevronRight,
    ChevronLeft,
    Filter,
    Search,
    LayoutList,
    CalendarDays,
    Eye,
    Edit2,
    FileText,
    CheckCircle2,
    AlertCircle,
    PartyPopper,
    Sparkles,
    X,
    ChefHat,
    Wine,
    Music
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    GroupEvent,
    GroupEventStatus,
    EVENT_TYPE_LABELS,
    EVENT_TYPE_ICONS,
    GROUP_EVENT_STATUS_CONFIG
} from '@/types';
import { NewGroupEventModal } from '@/components/groups/NewGroupEventModal';
import { useToast } from '@/components/ui/Toast';

// ============================================
// MOCK DATA (Preserved)
// ============================================

const MOCK_EVENTS: GroupEvent[] = [
    {
        id: '1',
        eventNumber: 'EVT-2026-00045',
        establishmentId: 'est-1',
        type: 'wedding',
        name: 'Mariage Martin-Dubois',
        organizer: {
            type: 'individual',
            name: 'Sophie Martin',
            email: 'sophie.martin@email.com',
            phone: '06 12 34 56 78'
        },
        spaceId: 'space-1',
        spaceName: 'Salon Napoléon',
        configuration: 'banquet',
        eventDate: '2026-03-15',
        startTime: '18:00',
        endTime: '02:00',
        guests: { initial: 80, confirmed: 75, final: 0, minimum: 60 },
        menu: { type: 'set_menu', name: 'Menu Prestige', pricePerPerson: 95 },
        extras: [
            { id: '1', name: 'Champagne de bienvenue', quantity: 1, unitPrice: 450, total: 450 },
            { id: '2', name: 'Pièce montée', quantity: 1, unitPrice: 350, total: 350 }
        ],
        financial: {
            quoteId: 'q-1',
            quoteNumber: 'DEV-2026-00038',
            quoteTotalTTC: 8950,
            depositRequired: 2685,
            depositPaid: 2685,
            depositPaidAt: '2026-01-10',
            extrasDuringEvent: 0
        },
        documents: [],
        status: 'deposit_paid',
        createdAt: '2026-01-08T10:00:00Z',
        createdBy: 'user-1',
        updatedAt: '2026-01-10T14:00:00Z'
    },
    {
        id: '2',
        eventNumber: 'EVT-2026-00046',
        establishmentId: 'est-1',
        type: 'corporate',
        name: 'Séminaire Tech Corp',
        organizer: {
            type: 'company',
            name: 'Jean Lefebvre',
            companyName: 'Tech Corp SAS',
            email: 'jean.lefebvre@techcorp.com',
            phone: '01 23 45 67 89'
        },
        spaceId: 'space-2',
        spaceName: 'Salle des Lumières',
        configuration: 'theater',
        eventDate: '2026-01-25',
        startTime: '09:00',
        endTime: '18:00',
        guests: { initial: 50, confirmed: 48, final: 0, minimum: 40 },
        menu: { type: 'buffet', name: 'Buffet Business', pricePerPerson: 45 },
        extras: [
            { id: '1', name: 'Vidéoprojecteur HD', quantity: 1, unitPrice: 150, total: 150 },
            { id: '2', name: 'Pauses café (x2)', quantity: 2, unitPrice: 8, total: 768 }
        ],
        financial: {
            quoteId: 'q-2',
            quoteNumber: 'DEV-2026-00040',
            quoteTotalTTC: 3500,
            depositRequired: 1400,
            depositPaid: 1400,
            depositPaidAt: '2026-01-12',
            extrasDuringEvent: 0
        },
        documents: [],
        status: 'preparation',
        createdAt: '2026-01-10T09:00:00Z',
        createdBy: 'user-1',
        updatedAt: '2026-01-12T11:00:00Z'
    },
    {
        id: '3',
        eventNumber: 'EVT-2026-00044',
        establishmentId: 'est-1',
        type: 'birthday',
        name: 'Anniversaire 50 ans - M. Dupont',
        organizer: {
            type: 'individual',
            name: 'Marie Dupont',
            email: 'marie.dupont@gmail.com',
            phone: '06 98 76 54 32'
        },
        spaceId: 'space-1',
        spaceName: 'Salon Napoléon',
        configuration: 'cocktail',
        eventDate: '2026-02-08',
        startTime: '19:00',
        endTime: '00:00',
        guests: { initial: 40, confirmed: 38, final: 0, minimum: 30 },
        financial: { depositRequired: 800, depositPaid: 0, extrasDuringEvent: 0 },
        extras: [],
        documents: [],
        status: 'quote_sent',
        createdAt: '2026-01-05T14:00:00Z',
        createdBy: 'user-1',
        updatedAt: '2026-01-06T09:00:00Z'
    },
    {
        id: '4',
        eventNumber: 'EVT-2026-00043',
        establishmentId: 'est-1',
        type: 'cocktail',
        name: 'Cocktail Lancement Produit',
        organizer: {
            type: 'company',
            name: 'Claire Bernard',
            companyName: 'StartUp Innovation',
            email: 'claire@startup.io',
            phone: '06 11 22 33 44'
        },
        spaceId: 'space-3',
        spaceName: 'Terrasse Panoramique',
        configuration: 'cocktail',
        eventDate: '2026-01-20',
        startTime: '18:30',
        endTime: '22:00',
        guests: { initial: 100, confirmed: 92, final: 0, minimum: 80 },
        financial: { depositRequired: 2000, depositPaid: 2000, depositPaidAt: '2026-01-08', extrasDuringEvent: 0 },
        extras: [],
        documents: [],
        status: 'confirmed',
        createdAt: '2026-01-02T10:00:00Z',
        createdBy: 'user-1',
        updatedAt: '2026-01-08T16:00:00Z'
    }
];

const MOCK_SPACES = [
    { id: 'space-1', name: 'Salon Napoléon', capacity: 100, icon: Building2 },
    { id: 'space-2', name: 'Salle des Lumières', capacity: 60, icon: Sparkles },
    { id: 'space-3', name: 'Terrasse Panoramique', capacity: 150, icon: Wine }
];

// ============================================
// UI COMPONENTS
// ============================================

function StatCard({ label, value, icon: Icon, subvalue, trend }: { label: string; value: string | number; icon: any; subvalue?: string; trend?: 'up' | 'down' | 'neutral' }) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-8 rounded-[2rem] bg-bg-secondary border border-border shadow-lg relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-bg-tertiary/50 to-transparent rounded-full translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-500" />

            <div className="flex items-start justify-between relative z-10">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-bg-tertiary flex items-center justify-center text-text-muted group-hover:text-text-primary transition-colors">
                            <Icon className="w-5 h-5" strokeWidth={1.5} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">{label}</p>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-4xl font-serif italic font-black text-text-primary">{value}</h3>
                    </div>
                    {subvalue && (
                        <p className="mt-2 text-[10px] uppercase tracking-widest text-[#00D9A6] font-bold">
                            {subvalue}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

function EventCard({ event, onClick }: { event: GroupEvent; onClick: () => void }) {
    const statusConfig = GROUP_EVENT_STATUS_CONFIG[event.status];
    const typeLabel = EVENT_TYPE_LABELS[event.type];
    const isToday = new Date(event.eventDate).toDateString() === new Date().toDateString();

    const formatPrice = (price?: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price || 0);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            onClick={onClick}
            className="group relative p-8 rounded-[2.5rem] bg-bg-secondary border border-border hover:border-[#00D9A6]/30 hover:shadow-[0_0_30px_rgba(0,217,166,0.1)] transition-all cursor-pointer overflow-hidden"
        >
            {/* Status Indicator Config */}
            <div className={cn(
                "absolute top-0 right-0 px-6 py-2 rounded-bl-[2rem] text-[9px] font-black uppercase tracking-[0.2em]",
                event.status === 'confirmed' || event.status === 'deposit_paid' ? "bg-[#00D9A6] text-white" :
                    event.status === 'preparation' ? "bg-amber-500 text-white" :
                        "bg-bg-tertiary text-text-muted"
            )}>
                {statusConfig.label}
            </div>

            <div className="flex items-start gap-8">
                {/* Date Box */}
                <div className="flex flex-col items-center justify-center w-20 h-24 rounded-[1.5rem] bg-bg-tertiary border border-border shrink-0 group-hover:bg-[#00D9A6] group-hover:text-white transition-colors duration-500">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                        {new Date(event.eventDate).toLocaleDateString('fr-FR', { month: 'short' })}
                    </span>
                    <span className="text-3xl font-serif italic font-black leading-none mt-1">
                        {new Date(event.eventDate).getDate()}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-1">
                        {new Date(event.eventDate).toLocaleDateString('fr-FR', { weekday: 'short' })}
                    </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 rounded-full bg-bg-tertiary border border-border text-[9px] font-bold uppercase tracking-widest text-text-muted">
                            {typeLabel}
                        </span>
                        <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-text-muted">
                            <Clock className="w-3 h-3" />
                            {event.startTime} - {event.endTime}
                        </span>
                    </div>

                    <h3 className="text-2xl font-serif italic font-black text-text-primary mb-2 truncate pr-20">
                        {event.name}
                    </h3>

                    <div className="flex items-center gap-6 mt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-bg-tertiary flex items-center justify-center">
                                <Users className="w-3 h-3 text-text-muted" />
                            </div>
                            <span className="text-[11px] font-bold text-text-muted">{event.guests.confirmed} / {event.guests.initial} pers.</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-bg-tertiary flex items-center justify-center">
                                <MapPin className="w-3 h-3 text-text-muted" />
                            </div>
                            <span className="text-[11px] font-bold text-text-muted">{event.spaceName}</span>
                        </div>
                        {event.organizer.companyName && (
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-bg-tertiary flex items-center justify-center">
                                    <Building2 className="w-3 h-3 text-text-muted" />
                                </div>
                                <span className="text-[11px] font-bold text-text-muted truncate max-w-[120px]">{event.organizer.companyName}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Price (Right aligned) */}
                <div className="hidden xl:flex flex-col items-end justify-center h-full pt-8">
                    {event.financial.quoteTotalTTC && (
                        <p className="text-2xl font-black text-text-primary tracking-tight">
                            {formatPrice(event.financial.quoteTotalTTC)}
                        </p>
                    )}
                    {event.financial.depositPaid > 0 && (
                        <span className="flex items-center gap-1.5 text-[9px] font-bold text-[#00D9A6] uppercase tracking-widest mt-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Acompte OK
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// ============================================
// MAIN PAGE
// ============================================

export default function GroupsPage() {
    const [activeView, setActiveView] = useState<'list' | 'calendar'>('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<GroupEventStatus | 'all'>('all');
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);
    const { showToast } = useToast();

    const handleNewEvent = (newEvent: any) => {
        // Event creation is handled by the modal - toast confirms success
        showToast(`Demande pour "${newEvent.name}" créée avec succès.`, 'premium');
    };

    const filteredEvents = MOCK_EVENTS.filter(event => {
        if (selectedStatus !== 'all' && event.status !== selectedStatus) return false;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                event.name.toLowerCase().includes(query) ||
                event.organizer.name.toLowerCase().includes(query) ||
                event.organizer.companyName?.toLowerCase().includes(query)
            );
        }
        return true;
    }).sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

    const totalRevenue = filteredEvents.reduce((acc, curr) => acc + (curr.financial.quoteTotalTTC || 0), 0);
    const confirmedCount = filteredEvents.filter(e => ['confirmed', 'deposit_paid'].includes(e.status)).length;

    return (
        <div className="flex h-screen -m-4 md:-m-8 flex-col bg-bg-primary overflow-hidden relative font-sans">
            {/* Cinematic Background (Warm Gold Theme) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#C5A572]/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-amber-500/5 blur-[100px] rounded-full" />
                <div className="absolute top-[30%] left-[20%] w-[20%] h-[20%] bg-[#C5A572]/5 blur-[80px] rounded-full" />
            </div>

            {/* Main Content Info */}
            <div className="flex-1 overflow-hidden flex flex-col p-12">
                <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] space-y-12 pb-32">

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <StatCard
                            label="Événements ce mois"
                            value={filteredEvents.length}
                            icon={CalendarDays}
                            subvalue="+12% vs N-1"
                        />
                        <StatCard
                            label="Confirmés"
                            value={confirmedCount}
                            icon={CheckCircle2}
                            subvalue="Tx conversion: 68%"
                        />
                        <StatCard
                            label="CA Prévisionnel"
                            value={new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(totalRevenue)}
                            icon={Euro}
                            subvalue="Objectif atteint à 85%"
                        />
                        <div className="p-8 rounded-[2rem] bg-[#C5A572] text-white shadow-[0_4px_20px_rgba(197,165,114,0.25)] relative overflow-hidden group cursor-pointer border border-[#BFA075]">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full translate-x-10 -translate-y-10" />
                            <div className="flex items-center gap-3 mb-4 relative z-10">
                                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">Prochaine étape</p>
                            </div>
                            <h3 className="text-2xl font-serif italic font-black mb-2">3 Devis à valider</h3>
                            <button
                                onClick={() => showToast("Chargement des devis à valider...", "info")}
                                className="text-[10px] font-black uppercase tracking-widest bg-white text-[#9F825B] px-4 py-2 rounded-xl mt-2 hover:bg-white/90 transition-colors shadow-sm"
                            >
                                Voir les actions
                            </button>
                        </div>
                    </div>

                    {/* View Switcher & Spaces */}
                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                        {/* Main Feed */}
                        <div className="xl:col-span-3 space-y-6">

                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#C5A572]/10 border border-[#C5A572]/20 flex items-center justify-center shrink-0">
                                        <PartyPopper className="w-5 h-5 text-[#9F825B]" />
                                    </div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                                        Groupes & Privatisation
                                    </h3>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex gap-2 mr-2">
                                        {['all', 'confirmed', 'preparation'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => setSelectedStatus(status as any)}
                                                className={cn(
                                                    "px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                                    selectedStatus === status
                                                        ? "bg-[#C5A572] text-white border-[#C5A572] shadow-md"
                                                        : "bg-transparent text-text-muted border-border hover:border-[#C5A572]/50 hover:bg-bg-tertiary"
                                                )}
                                            >
                                                {status === 'all' ? 'Tous' : status}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="w-px h-8 bg-border mx-2" />

                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                        <input
                                            type="text"
                                            placeholder="Rechercher..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="h-10 w-48 pl-10 pr-4 rounded-xl bg-bg-secondary border border-border text-[11px] text-text-primary placeholder:text-text-muted/70 focus:outline-none focus:border-[#C5A572] transition-all font-medium focus:shadow-[0_0_0_2px_rgba(197,165,114,0.1)]"
                                        />
                                    </div>
                                    <Button
                                        onClick={() => setIsNewModalOpen(true)}
                                        className="h-10 px-6 bg-[#C5A572] text-white hover:bg-[#B39360] rounded-xl font-black text-[9px] uppercase tracking-widest shadow-[0_4px_15px_rgba(197,165,114,0.25)] transition-all border border-[#BFA075]"
                                    >
                                        <Plus className="mr-2 h-3 w-3" />
                                        Nouveau
                                    </Button>
                                </div>
                            </div>

                            <AnimatePresence mode="popLayout">
                                {filteredEvents.map((event) => (
                                    <EventCard key={event.id} event={event} onClick={() => { }} />
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Right Sidebar - Spaces */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Nos Espaces</h3>
                            </div>
                            {MOCK_SPACES.map((space) => {
                                const Icon = space.icon;
                                return (
                                    <div key={space.id} className="p-6 rounded-[2rem] bg-bg-secondary border border-border group hover:border-[#C5A572]/30 hover:shadow-lg hover:shadow-[#C5A572]/5 transition-all cursor-pointer">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center text-text-primary group-hover:bg-[#C5A572]/10 group-hover:text-[#9F825B] transition-all">
                                                <Icon className="w-6 h-6" strokeWidth={1.5} />
                                            </div>
                                            <div>
                                                <h4 className="font-serif italic font-black text-lg text-text-primary">{space.name}</h4>
                                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Capacité: {space.capacity}</p>
                                            </div>
                                        </div>
                                        <div className="h-1 w-full bg-[#F0EEE6] rounded-full overflow-hidden">
                                            <div className="h-full bg-[#C5A572] w-2/3" />
                                        </div>
                                        <div className="mt-2 flex justify-between text-[9px] font-bold text-text-muted uppercase tracking-widest">
                                            <span>Occupation</span>
                                            <span>65%</span>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Calendar Mini-Widget Placeholder */}
                            <div className="p-6 rounded-[2rem] bg-bg-secondary border border-border text-text-primary shadow-sm relative overflow-hidden mt-8">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A572]/5 blur-3xl rounded-full" />
                                <Calendar className="w-8 h-8 mb-4 relative z-10 text-[#C5A572]" />
                                <h4 className="font-serif italic font-black text-xl relative z-10 mb-2">Planning Global</h4>
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest relative z-10 mb-4">
                                    Voir les disponibilités et la charge
                                </p>
                                <Button variant="secondary" className="w-full text-[10px] font-black uppercase tracking-widest bg-bg-tertiary text-[#9F825B] border border-border hover:bg-bg-tertiary/80">
                                    Ouvrir le calendrier
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Dock Action Bar */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40">
                <div className="px-10 py-4 rounded-[2.5rem] bg-bg-secondary/80 backdrop-blur-2xl border border-border shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex items-center gap-8">
                    <button
                        onClick={() => showToast("Ouverture de la liste des événements", "info")}
                        className="flex flex-col items-center gap-1 group"
                    >
                        <div className="w-10 h-10 rounded-2xl bg-[#C5A572] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-all">
                            <LayoutList className="w-5 h-5" />
                        </div>
                        <div className="w-1 h-1 rounded-full bg-[#C5A572] mt-1" />
                    </button>
                    <button
                        onClick={() => showToast("Chargement du calendrier global...", "info")}
                        className="flex flex-col items-center gap-1 group opacity-50 hover:opacity-100 transition-opacity"
                    >
                        <div className="w-10 h-10 rounded-2xl bg-bg-tertiary text-text-muted flex items-center justify-center border border-transparent group-hover:border-border group-hover:bg-bg-secondary transition-all">
                            <CalendarDays className="w-5 h-5" />
                        </div>
                    </button>
                    <div className="w-px h-8 bg-border" />
                    <button
                        onClick={() => showToast("Génération du rapport PDF...", "premium")}
                        className="flex flex-col items-center gap-1 group opacity-50 hover:opacity-100 transition-opacity"
                    >
                        <div className="w-10 h-10 rounded-2xl bg-bg-tertiary text-text-muted flex items-center justify-center border border-transparent group-hover:border-border group-hover:bg-bg-secondary transition-all">
                            <FileText className="w-5 h-5" />
                        </div>
                    </button>
                    <button
                        onClick={() => showToast("Accès au module Cuisine", "info")}
                        className="flex flex-col items-center gap-1 group opacity-50 hover:opacity-100 transition-opacity"
                    >
                        <div className="w-10 h-10 rounded-2xl bg-bg-tertiary text-text-muted flex items-center justify-center border border-transparent group-hover:border-border group-hover:bg-bg-secondary transition-all">
                            <ChefHat className="w-5 h-5" />
                        </div>
                    </button>
                </div>
            </div>
            {/* Modal Integration */}
            <NewGroupEventModal
                isOpen={isNewModalOpen}
                onClose={() => setIsNewModalOpen(false)}
                onSuccess={handleNewEvent}
            />
        </div>
    );
}
