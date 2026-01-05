"use client";

import { useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Search,
    Users,
    Filter,
    Calendar,
    LayoutGrid,
    MoreHorizontal,
    UserCheck,
    Clock,
    Star,
    Phone,
    Mail,
    CreditCard,
    History,
    Heart,
    Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useReservations } from "@/context/ReservationsContext";
import { Customer, Reservation } from "@/types";
import { useToast } from "@/components/ui/Toast";
import { format, addDays, subDays, startOfWeek, endOfWeek, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";

export default function ReservationsPage() {
    const { showToast } = useToast();
    const [view, setView] = useState<"day" | "week">("day");
    const [activeSection, setActiveSection] = useState<"reservations" | "customers">("reservations");
    const [currentDate, setCurrentDate] = useState(new Date('2025-12-29'));
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const { reservations, getReservationsForDate, customers, getCustomerHistory } = useReservations();

    const handlePrev = () => {
        setCurrentDate(prev => view === 'day' ? subDays(prev, 1) : subDays(prev, 7));
    };

    const handleNext = () => {
        setCurrentDate(prev => view === 'day' ? addDays(prev, 1) : addDays(prev, 7));
    };

    const displayDate = format(currentDate, "EEEE d MMMM", { locale: fr });
    const currentReservations = view === 'day'
        ? getReservationsForDate(format(currentDate, 'yyyy-MM-dd'))
        : reservations.filter(r => {
            const rDate = new Date(r.date);
            const start = startOfWeek(currentDate, { weekStartsOn: 1 });
            const end = endOfWeek(currentDate, { weekStartsOn: 1 });
            return rDate >= start && rDate <= end;
        });

    // Customer detail modal/panel
    const CustomerDetailPanel = ({ customer }: { customer: Customer }) => {
        const history = getCustomerHistory(customer.id);
        return (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-8" onClick={() => setSelectedCustomer(null)}>
                <div
                    className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-border"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-[#1a1a1a] text-white p-10">
                        <div className="flex items-center gap-8">
                            <div className="w-24 h-24 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl font-serif">
                                {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-3xl font-serif font-semibold tracking-tight">{customer.firstName} {customer.lastName}</h2>
                                <div className="flex flex-wrap items-center gap-3 mt-4">
                                    {customer.tags.map(tag => (
                                        <span key={tag} className="text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full bg-white/10 text-white/70 border border-white/10">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <ScrollArea className="max-h-[calc(90vh-280px)]">
                        {/* Stats */}
                        <div className="grid grid-cols-3 border-b border-border">
                            <div className="p-8 text-center border-r border-border bg-bg-tertiary/30">
                                <p className="text-3xl font-mono font-medium text-accent">{customer.visitCount}</p>
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mt-2">Visites</p>
                            </div>
                            <div className="p-8 text-center border-r border-border">
                                <p className="text-3xl font-mono font-medium text-text-primary">{customer.totalSpent.toFixed(0)} €</p>
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mt-2">Total Dépensé</p>
                            </div>
                            <div className="p-8 text-center bg-bg-tertiary/30">
                                <p className="text-3xl font-mono font-medium text-text-primary">{customer.averageSpend.toFixed(0)} €</p>
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mt-2">Moyenne</p>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="p-10 space-y-10">
                            <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                                <div className="flex items-center gap-4 border-b border-border pb-4">
                                    <Phone strokeWidth={1.5} className="w-4 h-4 text-text-muted" />
                                    <span className="text-[13px] font-medium text-text-primary">{customer.phone}</span>
                                </div>
                                {customer.email && (
                                    <div className="flex items-center gap-4 border-b border-border pb-4">
                                        <Mail strokeWidth={1.5} className="w-4 h-4 text-text-muted" />
                                        <span className="text-[13px] font-medium text-text-primary">{customer.email}</span>
                                    </div>
                                )}
                                {customer.birthDate && (
                                    <div className="flex items-center gap-4 border-b border-border pb-4">
                                        <Calendar strokeWidth={1.5} className="w-4 h-4 text-text-muted" />
                                        <span className="text-[13px] font-medium text-text-primary">Anniversaire: {customer.birthDate}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-4 border-b border-border pb-4">
                                    <History strokeWidth={1.5} className="w-4 h-4 text-text-muted" />
                                    <span className="text-[13px] font-medium text-text-primary">Dernière visite: {customer.lastVisit || 'N/A'}</span>
                                </div>
                            </div>

                            {/* Preferences */}
                            {customer.preferences.length > 0 && (
                                <div>
                                    <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                                        <Heart strokeWidth={1.5} className="w-3.5 h-3.5" />
                                        Profil Gastronomique
                                    </h3>
                                    <div className="flex flex-wrap gap-2.5">
                                        {customer.preferences.map((pref, i) => (
                                            <span key={i} className="text-[11px] font-semibold px-4 py-2 bg-white border border-border rounded-lg text-text-primary shadow-sm">
                                                {pref}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Reservation History */}
                            {history.length > 0 && (
                                <div>
                                    <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                                        <Clock strokeWidth={1.5} className="w-3.5 h-3.5" />
                                        Historique des Services
                                    </h3>
                                    <div className="space-y-3">
                                        {history.map(res => (
                                            <div key={res.id} className="flex items-center justify-between p-4 bg-bg-tertiary/50 border border-border/50 rounded-xl hover:bg-bg-tertiary transition-colors">
                                                <div className="flex items-center gap-5">
                                                    <span className="font-mono text-xs text-text-primary">{res.date}</span>
                                                    <span className="text-[11px] font-bold text-text-muted uppercase tracking-widest">{res.time}</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-[11px] font-bold text-text-primary uppercase tracking-[0.1em]">{res.covers} couverts</span>
                                                    <div className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center text-[10px] font-mono">
                                                        {res.tableId.replace(/^t/, '')}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    {/* Footer */}
                    <div className="p-8 border-t border-border bg-bg-tertiary/30 flex justify-end gap-4">
                        <Button variant="outline" onClick={() => setSelectedCustomer(null)} className="h-11 px-8 rounded-lg font-bold text-[11px] uppercase tracking-widest text-text-muted hover:text-text-primary">
                            Fermer
                        </Button>
                        <Button
                            onClick={() => {
                                showToast("Nouvelle réservation pour " + customer.firstName, "premium");
                                setSelectedCustomer(null);
                            }}
                            className="btn-elegant-primary h-11 px-10 shadow-lg shadow-accent/10"
                        >
                            <Plus strokeWidth={1.5} className="w-4 h-4 mr-2.5" />
                            Réserver
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-[calc(100vh-80px)] -m-8 flex-col bg-bg-primary">
            {/* Professional Header */}
            <div className="flex items-center justify-between bg-white border-b border-border px-10 py-5">
                <div className="flex items-center gap-10">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-serif font-semibold text-text-primary tracking-tight">
                            {activeSection === 'reservations' ? 'Registre des Réservations' : 'Base de Données Clients'}
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-success opacity-80" />
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] capitalize">
                                {activeSection === 'reservations'
                                    ? (view === 'day' ? 'Service du midi • ' : 'Semaine du • ') + displayDate
                                    : `${customers.length} clients enregistrés`
                                }
                            </p>
                        </div>
                    </div>

                    {/* Section Tabs */}
                    <div className="flex items-center gap-1.5 bg-bg-tertiary p-1 rounded-xl border border-border">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn("h-9 px-5 text-[11px] font-bold uppercase rounded-lg transition-all tracking-wider",
                                activeSection === "reservations" ? "bg-white shadow-sm text-accent" : "text-text-muted hover:text-text-primary"
                            )}
                            onClick={() => setActiveSection("reservations")}
                        >
                            <Calendar strokeWidth={1.5} className="w-3.5 h-3.5 mr-2.5" />
                            Réservations
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn("h-9 px-5 text-[11px] font-bold uppercase rounded-lg transition-all tracking-wider",
                                activeSection === "customers" ? "bg-white shadow-sm text-accent" : "text-text-muted hover:text-text-primary"
                            )}
                            onClick={() => setActiveSection("customers")}
                        >
                            <Users strokeWidth={1.5} className="w-3.5 h-3.5 mr-2.5" />
                            Clients CRM
                        </Button>
                    </div>

                    {activeSection === 'reservations' && (
                        <div className="flex items-center gap-1.5 bg-bg-tertiary p-1 rounded-xl border border-border">
                            <Button
                                variant="ghost"
                                size="sm"
                                className={cn("h-9 px-5 text-[11px] font-bold uppercase rounded-lg transition-all tracking-wider", view === "day" ? "bg-white shadow-sm text-accent" : "text-text-muted hover:text-text-primary")}
                                onClick={() => setView("day")}
                            >
                                <Calendar strokeWidth={1.5} className="w-3.5 h-3.5 mr-2.5" />
                                Jour
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className={cn("h-9 px-5 text-[11px] font-bold uppercase rounded-lg transition-all tracking-wider", view === "week" ? "bg-white shadow-sm text-accent" : "text-text-muted hover:text-text-primary")}
                                onClick={() => setView("week")}
                            >
                                <LayoutGrid strokeWidth={1.5} className="w-3.5 h-3.5 mr-2.5" />
                                Semaine
                            </Button>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-5">
                    {activeSection === 'reservations' && (
                        <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-4 py-2 text-sm shadow-sm">
                            <button onClick={handlePrev} className="p-1 hover:bg-bg-tertiary rounded-md text-text-muted hover:text-accent transition-colors">
                                <ChevronLeft strokeWidth={1.5} className="h-4 w-4" />
                            </button>
                            <span className="text-[12px] font-bold text-text-primary mx-4 uppercase tracking-[0.15em] min-w-[140px] text-center capitalize">
                                {view === 'day' ? "Aujourd'hui" : "Cette Semaine"}
                            </span>
                            <button onClick={handleNext} className="p-1 hover:bg-bg-tertiary rounded-md text-text-muted hover:text-accent transition-colors">
                                <ChevronRight strokeWidth={1.5} className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    <Button
                        onClick={() => showToast(activeSection === 'reservations' ? "Assistant de réservation ouvert" : "Ajout client", "premium")}
                        className="btn-elegant-primary h-11 px-8 shadow-xl shadow-accent/10"
                    >
                        <Plus strokeWidth={1.5} className="h-4 w-4 mr-2.5" />
                        {activeSection === 'reservations' ? 'Nouvelle Réservation' : 'Nouveau Client'}
                    </Button>
                </div>
            </div>

            {activeSection === 'reservations' ? (
                /* RESERVATIONS VIEW */
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar List */}
                    <div className="w-[400px] border-r border-border bg-white flex flex-col">
                        <div className="p-8 space-y-5 border-b border-border">
                            <div className="relative">
                                <Search strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                                <input
                                    type="text"
                                    placeholder="Rechercher un client..."
                                    className="input-elegant w-full pl-11 pr-4 py-3 text-[13px]"
                                />
                            </div>
                            <div className="flex items-center justify-between px-1">
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                                    {view === 'day' ? "Réservations" : "Total Semaine"} &bull; {currentReservations.length}
                                </span>
                                <button className="text-[10px] font-bold text-accent uppercase tracking-widest flex items-center gap-2 hover:opacity-70 transition-opacity">
                                    <Filter strokeWidth={1.5} className="w-3.5 h-3.5" />
                                    Trier
                                </button>
                            </div>
                        </div>

                        <ScrollArea className="flex-1 bg-bg-tertiary/20 elegant-scrollbar">
                            <div className="p-6 space-y-4">
                                {currentReservations.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
                                        <Clock strokeWidth={1} className="w-12 h-12 mb-4 text-text-muted" />
                                        <p className="text-sm font-serif italic text-text-muted">Aucune réservation</p>
                                    </div>
                                ) : (
                                    currentReservations.map(res => (
                                        <div key={res.id} className="p-6 bg-white rounded-xl border border-border/60 hover:border-accent/40 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-lg bg-bg-tertiary flex flex-col items-center justify-center border border-border/40 group-hover:bg-accent group-hover:text-white transition-colors">
                                                        <span className="text-[15px] font-mono font-medium">{res.time}</span>
                                                        {view === 'week' && (
                                                            <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">{format(new Date(res.date), 'dd/MM')}</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-serif text-[16px] font-semibold text-text-primary leading-tight">{res.customerName}</h3>
                                                        <div className="flex items-center gap-2 mt-1.5">
                                                            <div className={cn("w-1.5 h-1.5 rounded-full", res.status === 'seated' ? "bg-success" : "bg-warning")} />
                                                            <span className="text-[9px] font-bold text-text-muted uppercase tracking-[0.2em]">{res.status === 'seated' ? 'Installé' : 'En attente'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className="p-1.5 text-text-muted hover:text-accent transition-colors">
                                                    <MoreHorizontal strokeWidth={1.5} className="w-5 h-5" />
                                                </button>
                                            </div>

                                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-border/30">
                                                <div className="flex items-center gap-5">
                                                    <div className="flex items-center gap-2 text-text-primary">
                                                        <Users strokeWidth={1.5} className="h-3.5 w-3.5 text-text-muted" />
                                                        <span className="text-[12px] font-mono font-medium">{res.covers}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-text-primary">
                                                        <div className="w-5 h-5 rounded bg-bg-tertiary flex items-center justify-center text-[9px] font-mono border border-border/40">
                                                            {res.tableId.replace(/^t/, '')}
                                                        </div>
                                                        <span className="text-[12px] font-medium">Table {res.tableId.replace(/^t/, '')}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1.5">
                                                    {res.tags?.slice(0, 1).map(tag => (
                                                        <span key={tag} className="text-[8px] font-bold uppercase tracking-[0.2em] px-2 py-1 rounded bg-bg-tertiary text-text-muted border border-border/40">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </ScrollArea>

                        <div className="p-8 bg-white border-t border-border">
                            <div className="flex items-center justify-between bg-accent p-5 rounded-xl shadow-lg shadow-accent/10">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold text-white/50 uppercase tracking-[0.3em]">Couverts du jour</span>
                                    <span className="text-2xl font-mono font-medium text-white leading-none mt-1">
                                        {currentReservations.reduce((acc, r) => acc + r.covers, 0)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-white/10 text-white">
                                    <UserCheck strokeWidth={1.5} className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Area */}
                    <div className="flex-1 bg-white overflow-auto relative elegant-scrollbar">
                        <div className="min-w-[1200px] h-full flex flex-col p-10">
                            {view === 'day' ? (
                                <>
                                    <div className="flex mb-10 bg-bg-tertiary/40 rounded-xl p-2 border border-border/50">
                                        <div className="w-[200px]"></div>
                                        {Array.from({ length: 12 }).map((_, i) => {
                                            const hour = 11 + i;
                                            return (
                                                <div key={hour} className="flex-1 text-center py-4 border-l border-border/20 first:border-0">
                                                    <span className="text-[11px] font-mono text-text-muted tracking-widest">{hour}:00</span>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    <div className="space-y-8 relative">
                                        {/* Current Time Indicator */}
                                        <div className="absolute top-0 bottom-0 left-[32%] w-px bg-accent/40 z-20 pointer-events-none">
                                            <div className="absolute top-0 -translate-x-1/2 w-2 h-2 rounded-full bg-accent shadow-sm" />
                                        </div>

                                        {["VIP Table 1", "Table 2", "Table 3", "Executive 4", "Suite 5", "Main Hall 6"].map((table, idx) => {
                                            const tableId = `t${idx + 1}`;
                                            const tableRes = currentReservations.find(r => r.tableId === tableId);

                                            return (
                                                <div key={idx} className="flex h-24 items-center group">
                                                    <div className="w-[200px] pr-10 text-right">
                                                        <span className="text-[15px] font-serif font-semibold text-text-primary leading-tight block">{table}</span>
                                                        <span className="text-[9px] font-bold text-text-muted uppercase tracking-[0.2em] mt-1 block">Zone Principale</span>
                                                    </div>
                                                    <div className="flex-1 h-full relative bg-bg-tertiary/20 rounded-xl border border-border/30 hover:bg-bg-tertiary/40 transition-colors">
                                                        {tableRes && (
                                                            <div
                                                                className="absolute top-3 bottom-3 bg-white border border-accent/30 rounded-lg px-5 flex items-center shadow-xl shadow-accent/5 hover:translate-y-[-2px] transition-all cursor-pointer z-10"
                                                                style={{ left: '25%', width: '20%' }}
                                                            >
                                                                <div className="flex flex-col">
                                                                    <span className="text-[13px] font-serif font-semibold text-text-primary truncate">{tableRes.customerName}</span>
                                                                    <div className="flex items-center gap-3 mt-1">
                                                                        <span className="text-[10px] font-mono font-medium text-accent">{tableRes.time}</span>
                                                                        <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">{tableRes.covers} Pers</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex mb-10 bg-bg-tertiary/40 rounded-xl p-2 border border-border/50">
                                        <div className="w-[120px]"></div>
                                        {Array.from({ length: 7 }).map((_, i) => {
                                            const dayDate = addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), i);
                                            const isToday = isSameDay(dayDate, new Date());
                                            return (
                                                <div key={i} className={cn(
                                                    "flex-1 text-center py-4 rounded-lg transition-all",
                                                    isToday ? "bg-accent text-white shadow-xl" : "border-l border-border/20 first:border-0"
                                                )}>
                                                    <span className={cn("text-[11px] font-bold uppercase tracking-[0.2em]", isToday ? "text-white" : "text-text-muted")}>
                                                        {format(dayDate, 'EEE d', { locale: fr })}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    <div className="space-y-6">
                                        {["Service Midi", "Service Soir"].map((service, sIdx) => (
                                            <div key={sIdx}>
                                                <div className="flex items-center gap-6 mb-6">
                                                    <div className="w-[120px] text-right">
                                                        <span className="text-[11px] font-bold text-text-primary uppercase tracking-[0.3em]">{service}</span>
                                                    </div>
                                                    <div className="h-px flex-1 bg-border" />
                                                </div>
                                                <div className="flex h-36 mb-6">
                                                    <div className="w-[120px]"></div>
                                                    {Array.from({ length: 7 }).map((_, i) => (
                                                        <div key={i} className="flex-1 mx-1.5 rounded-xl bg-bg-tertiary/20 border border-border/40 hover:border-accent/30 hover:bg-bg-tertiary transition-all cursor-pointer relative group flex items-center justify-center">
                                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Plus strokeWidth={1.5} className="w-8 h-8 text-accent/40" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                /* CUSTOMER CRM VIEW */
                <div className="flex-1 overflow-auto p-10 bg-bg-tertiary/20 elegant-scrollbar">
                    <div className="max-w-7xl mx-auto space-y-10">
                        {/* Search & Filters */}
                        <div className="bg-white p-8 rounded-xl border border-border shadow-sm flex items-center justify-between gap-8">
                            <div className="relative flex-1 max-w-xl">
                                <Search strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                                <input
                                    type="text"
                                    placeholder="Rechercher un client par nom, téléphone..."
                                    className="input-elegant w-full pl-11 pr-4 py-3 text-[13px]"
                                />
                            </div>
                            <div className="flex items-center gap-6">
                                <Button variant="outline" size="icon" className="h-11 w-11 rounded-lg border-border hover:border-accent hover:text-accent transition-colors">
                                    <Filter strokeWidth={1.5} className="h-4 w-4" />
                                </Button>
                                <div className="h-8 w-px bg-border" />
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                                    {customers.length} profils client
                                </span>
                            </div>
                        </div>

                        {/* Customer Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {customers.map(customer => (
                                <div
                                    key={customer.id}
                                    onClick={() => setSelectedCustomer(customer)}
                                    className="p-8 bg-white rounded-xl border border-border hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500 cursor-pointer group"
                                >
                                    <div className="flex items-start gap-6">
                                        <div className="w-16 h-16 rounded-xl bg-bg-tertiary border border-border flex items-center justify-center text-xl font-serif text-text-primary group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-500">
                                            {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-[17px] font-serif font-semibold text-text-primary truncate">{customer.firstName} {customer.lastName}</h3>
                                            <p className="text-[11px] font-mono text-text-muted mt-1 tracking-tight">{customer.phone}</p>
                                            <div className="flex flex-wrap gap-2 mt-4">
                                                {customer.tags.slice(0, 2).map(tag => (
                                                    <span key={tag} className="text-[8px] font-bold uppercase tracking-[0.2em] px-2 py-1 rounded bg-bg-tertiary text-text-muted border border-border/40">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/30">
                                        <div className="flex items-center gap-2">
                                            <Star strokeWidth={1.5} className="w-3.5 h-3.5 text-warning" />
                                            <span className="text-[11px] font-bold text-text-primary uppercase tracking-[0.1em]">{customer.visitCount} Visites</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[12px] font-mono font-medium text-text-primary">{customer.totalSpent.toFixed(0)} €</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Customer Detail Modal */}
            {selectedCustomer && <CustomerDetailPanel customer={selectedCustomer} />}
        </div>
    );
}
