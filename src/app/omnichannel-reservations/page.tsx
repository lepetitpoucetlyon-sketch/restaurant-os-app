"use client";

import { useState } from "react";
import {
    Calendar,
    Plus,
    Search,
    Filter,
    Users,
    Clock,
    MapPin,
    Phone,
    Mail,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ExternalLink,
    Instagram,
    Facebook,
    Globe,
    RefreshCw,
    Settings,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    MessageSquare,
    Star,
    Smartphone,
    Link2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

// Mock reservation sources
const RESERVATION_SOURCES = {
    website: { name: 'Site Web', icon: Globe, color: '#1A1A1A' },
    google: { name: 'Google', icon: Globe, color: '#4285F4' },
    instagram: { name: 'Instagram', icon: Instagram, color: '#E4405F' },
    facebook: { name: 'Facebook', icon: Facebook, color: '#1877F2' },
    phone: { name: 'Téléphone', icon: Phone, color: '#00D764' },
    thefork: { name: 'TheFork', icon: ExternalLink, color: '#00A86B' },
    tripadvisor: { name: 'TripAdvisor', icon: ExternalLink, color: '#34E0A1' },
};

const STATUS_CONFIG = {
    confirmed: { label: 'Confirmé', color: '#00D764', bg: '#E6F9EF' },
    pending: { label: 'En attente', color: '#FF9900', bg: '#FFF7E6' },
    cancelled: { label: 'Annulé', color: '#FF4D4D', bg: '#FEECEC' },
    noshow: { label: 'No-show', color: '#6C757D', bg: '#F8F9FA' },
    seated: { label: 'Installé', color: '#8B5CF6', bg: '#F3E8FF' },
    completed: { label: 'Terminé', color: '#1A1A1A', bg: '#F8F9FA' },
};

// Mock reservations from multiple sources
const MOCK_RESERVATIONS = [
    { id: 'RES001', source: 'website', name: 'Marie Dupont', email: 'marie@email.com', phone: '06 12 34 56 78', guests: 4, date: '2026-01-05', time: '19:30', table: 'T12', status: 'confirmed', notes: 'Anniversaire', crmId: 'CRM001' },
    { id: 'RES002', source: 'google', name: 'Jean Martin', email: 'jean.martin@gmail.com', phone: '06 98 76 54 32', guests: 2, date: '2026-01-05', time: '20:00', table: 'T05', status: 'confirmed', notes: '', crmId: 'CRM002' },
    { id: 'RES003', source: 'instagram', name: 'Sophie Bernard', email: 'sophie.b@email.com', phone: '06 11 22 33 44', guests: 6, date: '2026-01-05', time: '19:00', table: 'T08', status: 'pending', notes: 'Demande terrasse', crmId: 'CRM003' },
    { id: 'RES004', source: 'thefork', name: 'Pierre Leroy', email: 'p.leroy@email.com', phone: '06 55 66 77 88', guests: 3, date: '2026-01-05', time: '20:30', table: 'T03', status: 'confirmed', notes: '', crmId: 'CRM004' },
    { id: 'RES005', source: 'facebook', name: 'Claire Moreau', email: 'claire.m@outlook.com', phone: '06 99 88 77 66', guests: 2, date: '2026-01-05', time: '21:00', table: 'T15', status: 'pending', notes: 'Premier rendez-vous', crmId: null },
    { id: 'RES006', source: 'phone', name: 'Luc Petit', email: '', phone: '06 44 33 22 11', guests: 8, date: '2026-01-05', time: '19:00', table: 'T20', status: 'confirmed', notes: 'Menu dégustation', crmId: 'CRM005' },
    { id: 'RES007', source: 'tripadvisor', name: 'Anna Schmidt', email: 'anna.s@gmail.com', phone: '+49 123 456 789', guests: 2, date: '2026-01-05', time: '20:00', table: 'T07', status: 'confirmed', notes: 'Touristes allemands', crmId: null },
];

// Platform connection status
const PLATFORM_CONNECTIONS = [
    { id: 'google', name: 'Google Reserve', connected: true, reservations: 156, icon: Globe },
    { id: 'thefork', name: 'TheFork', connected: true, reservations: 89, icon: ExternalLink },
    { id: 'instagram', name: 'Instagram', connected: true, reservations: 34, icon: Instagram },
    { id: 'facebook', name: 'Facebook', connected: false, reservations: 0, icon: Facebook },
    { id: 'tripadvisor', name: 'TripAdvisor', connected: true, reservations: 23, icon: ExternalLink },
];

export default function OmnichannelReservationsPage() {
    const { showToast } = useToast();
    const [activeView, setActiveView] = useState<'list' | 'calendar'>('list');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [filterSource, setFilterSource] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedReservation, setSelectedReservation] = useState<any>(null);
    const [showNewReservation, setShowNewReservation] = useState(false);

    const filteredReservations = MOCK_RESERVATIONS.filter(r => {
        if (filterSource && r.source !== filterSource) return false;
        if (filterStatus && r.status !== filterStatus) return false;
        if (searchQuery && !r.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const stats = {
        total: MOCK_RESERVATIONS.length,
        confirmed: MOCK_RESERVATIONS.filter(r => r.status === 'confirmed').length,
        pending: MOCK_RESERVATIONS.filter(r => r.status === 'pending').length,
        guests: MOCK_RESERVATIONS.reduce((sum, r) => sum + r.guests, 0),
    };

    const handleConfirm = (id: string) => {
        showToast("Réservation confirmée et SMS envoyé au client", "success");
    };

    const handleCancel = (id: string) => {
        showToast("Réservation annulée", "info");
    };

    const handleLinkToCRM = (reservation: any) => {
        showToast(`Client ${reservation.name} ajouté au CRM`, "success");
    };

    return (
        <div className="flex h-[calc(100vh-70px)] -m-6 flex-col bg-[#F8F9FA] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between bg-white border-b border-neutral-100 px-8 py-4">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <h1 className="text-xl font-black text-[#1A1A1A] tracking-tight">Réservations Omnicanal</h1>
                        <p className="text-[11px] font-bold text-[#ADB5BD] uppercase tracking-wider mt-0.5">
                            Toutes vos plateformes • Synchronisé en temps réel
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex items-center gap-4 ml-6 pl-6 border-l border-neutral-100">
                        <div className="text-center">
                            <p className="text-xl font-black text-[#1A1A1A]">{stats.total}</p>
                            <p className="text-[10px] font-bold text-[#ADB5BD] uppercase">Total</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-black text-[#00D764]">{stats.confirmed}</p>
                            <p className="text-[10px] font-bold text-[#ADB5BD] uppercase">Confirmées</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-black text-[#FF9900]">{stats.pending}</p>
                            <p className="text-[10px] font-bold text-[#ADB5BD] uppercase">En attente</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-black text-[#6C757D]">{stats.guests}</p>
                            <p className="text-[10px] font-bold text-[#ADB5BD] uppercase">Couverts</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => setShowNewReservation(true)}
                        className="h-10 bg-[#1A1A1A] hover:bg-black rounded-xl font-bold"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Nouvelle Réservation
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - Platform Connections */}
                <div className="w-72 bg-white border-r border-neutral-100 p-6 flex flex-col">
                    <h3 className="text-sm font-black text-[#1A1A1A] uppercase tracking-wider mb-4">Plateformes</h3>
                    <div className="space-y-2 flex-1">
                        <button
                            onClick={() => setFilterSource(null)}
                            className={cn(
                                "w-full flex items-center justify-between p-3 rounded-xl transition-all",
                                !filterSource ? "bg-[#1A1A1A] text-white" : "hover:bg-[#F8F9FA]"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5" />
                                <span className="font-bold">Toutes</span>
                            </div>
                            <span className="text-sm font-black">{MOCK_RESERVATIONS.length}</span>
                        </button>

                        {Object.entries(RESERVATION_SOURCES).map(([key, source]) => {
                            const Icon = source.icon;
                            const count = MOCK_RESERVATIONS.filter(r => r.source === key).length;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setFilterSource(filterSource === key ? null : key)}
                                    className={cn(
                                        "w-full flex items-center justify-between p-3 rounded-xl transition-all",
                                        filterSource === key ? "bg-[#F8F9FA] border-2 border-[#1A1A1A]" : "hover:bg-[#F8F9FA]"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                                            style={{ backgroundColor: `${source.color}15` }}
                                        >
                                            <Icon className="w-4 h-4" style={{ color: source.color }} />
                                        </div>
                                        <span className="font-bold text-sm">{source.name}</span>
                                    </div>
                                    <span className="text-sm font-bold text-[#ADB5BD]">{count}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Connection Status */}
                    <div className="pt-4 border-t border-neutral-100 mt-4">
                        <h4 className="text-[10px] font-black text-[#ADB5BD] uppercase mb-3">État des connexions</h4>
                        <div className="space-y-2">
                            {PLATFORM_CONNECTIONS.map((platform) => {
                                const Icon = platform.icon;
                                return (
                                    <div key={platform.id} className="flex items-center justify-between p-2 rounded-lg bg-[#F8F9FA]">
                                        <div className="flex items-center gap-2">
                                            <Icon className="w-4 h-4 text-[#6C757D]" />
                                            <span className="text-xs font-bold">{platform.name}</span>
                                        </div>
                                        {platform.connected ? (
                                            <CheckCircle2 className="w-4 h-4 text-[#00D764]" />
                                        ) : (
                                            <button
                                                onClick={() => showToast(`Connexion à ${platform.name}...`, "info")}
                                                className="text-[10px] font-bold text-[#4285F4] hover:underline"
                                            >
                                                Connecter
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-auto p-6">
                    {/* Search & Filters */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ADB5BD]" />
                            <input
                                type="text"
                                placeholder="Rechercher par nom, téléphone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-11 pl-11 pr-4 bg-white border border-neutral-100 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            {Object.entries(STATUS_CONFIG).slice(0, 4).map(([key, config]) => (
                                <button
                                    key={key}
                                    onClick={() => setFilterStatus(filterStatus === key ? null : key)}
                                    className={cn(
                                        "px-3 py-2 rounded-lg text-[11px] font-bold transition-all border-2",
                                        filterStatus === key
                                            ? "border-[#1A1A1A]"
                                            : "border-transparent hover:bg-[#F8F9FA]"
                                    )}
                                    style={{
                                        backgroundColor: filterStatus === key ? config.bg : undefined,
                                        color: filterStatus === key ? config.color : '#6C757D'
                                    }}
                                >
                                    {config.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Reservations List */}
                    <div className="space-y-3">
                        {filteredReservations.map((reservation) => {
                            const source = RESERVATION_SOURCES[reservation.source as keyof typeof RESERVATION_SOURCES];
                            const status = STATUS_CONFIG[reservation.status as keyof typeof STATUS_CONFIG];
                            const SourceIcon = source.icon;

                            return (
                                <div
                                    key={reservation.id}
                                    className="bg-white rounded-2xl p-5 border border-neutral-100 hover:shadow-lg transition-all cursor-pointer"
                                    onClick={() => setSelectedReservation(reservation)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-5">
                                            {/* Source Badge */}
                                            <div
                                                className="w-12 h-12 rounded-xl flex items-center justify-center"
                                                style={{ backgroundColor: `${source.color}15` }}
                                            >
                                                <SourceIcon className="w-6 h-6" style={{ color: source.color }} />
                                            </div>

                                            {/* Customer Info */}
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h4 className="font-black text-lg text-[#1A1A1A]">{reservation.name}</h4>
                                                    {reservation.crmId ? (
                                                        <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[10px] font-bold rounded-md flex items-center gap-1">
                                                            <Star className="w-3 h-3" />
                                                            Client fidèle
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleLinkToCRM(reservation); }}
                                                            className="px-2 py-0.5 bg-[#F8F9FA] text-[#6C757D] text-[10px] font-bold rounded-md hover:bg-[#E9ECEF] flex items-center gap-1"
                                                        >
                                                            <Link2 className="w-3 h-3" />
                                                            Ajouter au CRM
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 mt-1 text-[12px] text-[#6C757D]">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {reservation.time}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Users className="w-3.5 h-3.5" />
                                                        {reservation.guests} pers.
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        {reservation.table}
                                                    </span>
                                                    {reservation.phone && (
                                                        <span className="flex items-center gap-1">
                                                            <Phone className="w-3.5 h-3.5" />
                                                            {reservation.phone}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {reservation.notes && (
                                                <div className="px-3 py-1.5 bg-amber-50 text-amber-700 text-[11px] font-bold rounded-lg flex items-center gap-1">
                                                    <MessageSquare className="w-3 h-3" />
                                                    {reservation.notes}
                                                </div>
                                            )}

                                            {/* Status Badge */}
                                            <span
                                                className="px-4 py-2 rounded-xl text-[11px] font-black uppercase"
                                                style={{ backgroundColor: status.bg, color: status.color }}
                                            >
                                                {status.label}
                                            </span>

                                            {/* Actions */}
                                            {reservation.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={(e) => { e.stopPropagation(); handleConfirm(reservation.id); }}
                                                        className="h-9 bg-[#00D764] hover:bg-[#00B956] rounded-lg"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4 mr-1" />
                                                        Confirmer
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={(e) => { e.stopPropagation(); handleCancel(reservation.id); }}
                                                        className="h-9 border-[#FF4D4D] text-[#FF4D4D] hover:bg-[#FF4D4D]/10 rounded-lg"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* New Reservation Modal */}
            {showNewReservation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="p-6 border-b border-neutral-100">
                            <h2 className="text-xl font-black text-[#1A1A1A]">Nouvelle Réservation</h2>
                        </div>
                        <form className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[11px] font-black text-[#ADB5BD] uppercase">Nom</label>
                                    <input
                                        type="text"
                                        className="w-full h-11 px-4 mt-1 bg-[#F8F9FA] rounded-xl border-2 border-transparent focus:border-[#1A1A1A] font-bold outline-none"
                                        placeholder="Nom du client"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-black text-[#ADB5BD] uppercase">Téléphone</label>
                                    <input
                                        type="tel"
                                        className="w-full h-11 px-4 mt-1 bg-[#F8F9FA] rounded-xl border-2 border-transparent focus:border-[#1A1A1A] font-bold outline-none"
                                        placeholder="06 12 34 56 78"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[11px] font-black text-[#ADB5BD] uppercase">Email</label>
                                <input
                                    type="email"
                                    className="w-full h-11 px-4 mt-1 bg-[#F8F9FA] rounded-xl border-2 border-transparent focus:border-[#1A1A1A] font-bold outline-none"
                                    placeholder="email@exemple.com"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="text-[11px] font-black text-[#ADB5BD] uppercase">Date</label>
                                    <input
                                        type="date"
                                        className="w-full h-11 px-4 mt-1 bg-[#F8F9FA] rounded-xl border-2 border-transparent focus:border-[#1A1A1A] font-bold outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-black text-[#ADB5BD] uppercase">Heure</label>
                                    <input
                                        type="time"
                                        className="w-full h-11 px-4 mt-1 bg-[#F8F9FA] rounded-xl border-2 border-transparent focus:border-[#1A1A1A] font-bold outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-black text-[#ADB5BD] uppercase">Couverts</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="w-full h-11 px-4 mt-1 bg-[#F8F9FA] rounded-xl border-2 border-transparent focus:border-[#1A1A1A] font-bold outline-none"
                                        placeholder="2"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[11px] font-black text-[#ADB5BD] uppercase">Notes</label>
                                <textarea
                                    className="w-full h-20 px-4 py-3 mt-1 bg-[#F8F9FA] rounded-xl border-2 border-transparent focus:border-[#1A1A1A] font-bold outline-none resize-none"
                                    placeholder="Allergies, occasion spéciale..."
                                />
                            </div>
                        </form>
                        <div className="p-6 bg-[#F8F9FA] flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1 h-12 rounded-xl"
                                onClick={() => setShowNewReservation(false)}
                            >
                                Annuler
                            </Button>
                            <Button
                                className="flex-1 h-12 bg-[#00D764] hover:bg-[#00B956] rounded-xl font-bold"
                                onClick={() => {
                                    showToast("Réservation créée et client ajouté au CRM", "success");
                                    setShowNewReservation(false);
                                }}
                            >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Confirmer
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
