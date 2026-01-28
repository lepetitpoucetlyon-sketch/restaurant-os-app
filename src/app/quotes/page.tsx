'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
    FileText,
    Plus,
    Send,
    Eye,
    Download,
    Copy,
    MoreVertical,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Users,
    Calendar,
    Euro,
    TrendingUp,
    Filter,
    Search,
    ChevronDown,
    ChevronRight,
    Mail,
    Printer,
    Edit2,
    Trash2,
    X,
    Building2,
    User,
    FileSignature
} from 'lucide-react';
import { NewQuoteDialog } from "@/components/quotes/NewQuoteDialog";
import {
    Quote,
    QuoteStatus,
    QUOTE_STATUS_CONFIG
} from '@/types';

// ============================================
// MOCK DATA
// ============================================

const MOCK_QUOTES: Quote[] = [
    {
        id: '1',
        quoteNumber: 'DEV-2026-00042',
        establishmentId: 'est-1',
        customer: {
            type: 'company',
            name: 'Jean Martin',
            companyName: 'Société Example SAS',
            email: 'jean.martin@example.com',
            phone: '01 23 45 67 89',
            address: {
                street: '12 rue de la Paix',
                city: 'Paris',
                postalCode: '75002',
                country: 'France'
            }
        },
        issueDate: '2026-01-08',
        validUntil: '2026-02-08',
        subject: 'Privatisation salle - Anniversaire 50 personnes',
        sections: [],
        totals: {
            totalHT: 2850,
            totalDiscount: 150,
            totalVAT: 570,
            vatBreakdown: [{ rate: 20, base: 2850, amount: 570 }],
            totalTTC: 3420,
            optionalTotalHT: 450,
            optionalTotalTTC: 540
        },
        conditions: {
            paymentTerms: '30% à la commande, solde le jour de l\'événement',
            depositPercent: 30,
            depositAmount: 1026
        },
        status: 'sent',
        sentAt: '2026-01-09T10:30:00Z',
        reminders: [],
        createdAt: '2026-01-08T14:00:00Z',
        createdBy: 'user-1',
        updatedAt: '2026-01-09T10:30:00Z',
        version: 1
    },
    {
        id: '2',
        quoteNumber: 'DEV-2026-00041',
        establishmentId: 'est-1',
        customer: {
            type: 'company',
            name: 'Marie Dupont',
            companyName: 'Dupont & Associés',
            email: 'marie.dupont@da.fr',
            address: {
                street: '45 avenue des Champs-Élysées',
                city: 'Paris',
                postalCode: '75008',
                country: 'France'
            }
        },
        issueDate: '2026-01-05',
        validUntil: '2026-02-05',
        subject: 'Déjeuner d\'affaires - 20 couverts',
        sections: [],
        totals: {
            totalHT: 1200,
            totalDiscount: 0,
            totalVAT: 120,
            vatBreakdown: [{ rate: 10, base: 1200, amount: 120 }],
            totalTTC: 1320,
            optionalTotalHT: 0,
            optionalTotalTTC: 0
        },
        conditions: {
            paymentTerms: 'Paiement le jour du déjeuner'
        },
        status: 'accepted',
        sentAt: '2026-01-05T16:00:00Z',
        viewedAt: '2026-01-05T17:30:00Z',
        acceptedAt: '2026-01-06T09:15:00Z',
        reminders: [],
        createdAt: '2026-01-05T11:00:00Z',
        createdBy: 'user-1',
        updatedAt: '2026-01-06T09:15:00Z',
        version: 1
    },
    {
        id: '3',
        quoteNumber: 'DEV-2026-00040',
        establishmentId: 'est-1',
        customer: {
            type: 'individual',
            name: 'Pierre Lefebvre',
            email: 'pierre.lefebvre@gmail.com',
            phone: '06 12 34 56 78',
            address: {
                street: '8 rue du Commerce',
                city: 'Lyon',
                postalCode: '69002',
                country: 'France'
            }
        },
        issueDate: '2026-01-03',
        validUntil: '2026-02-03',
        subject: 'Mariage - Cocktail 80 personnes',
        sections: [],
        totals: {
            totalHT: 4500,
            totalDiscount: 450,
            totalVAT: 810,
            vatBreakdown: [{ rate: 20, base: 4050, amount: 810 }],
            totalTTC: 4860,
            optionalTotalHT: 800,
            optionalTotalTTC: 960
        },
        conditions: {
            paymentTerms: '50% à la signature, solde une semaine avant',
            depositPercent: 50,
            depositAmount: 2430
        },
        status: 'draft',
        reminders: [],
        createdAt: '2026-01-03T09:00:00Z',
        createdBy: 'user-1',
        updatedAt: '2026-01-03T09:00:00Z',
        version: 1
    },
    {
        id: '4',
        quoteNumber: 'DEV-2026-00039',
        establishmentId: 'est-1',
        customer: {
            type: 'company',
            name: 'Sophie Laurent',
            companyName: 'Tech Innovations',
            email: 'sophie@techinno.io',
            address: {
                street: '100 rue de la Tech',
                city: 'Paris',
                postalCode: '75011',
                country: 'France'
            }
        },
        issueDate: '2025-12-20',
        validUntil: '2026-01-20',
        subject: 'Séminaire entreprise - 2 jours',
        sections: [],
        totals: {
            totalHT: 8500,
            totalDiscount: 850,
            totalVAT: 1530,
            vatBreakdown: [{ rate: 20, base: 7650, amount: 1530 }],
            totalTTC: 9180,
            optionalTotalHT: 0,
            optionalTotalTTC: 0
        },
        conditions: {
            paymentTerms: '40% acompte, solde à réception facture',
            depositPercent: 40
        },
        status: 'expired',
        sentAt: '2025-12-20T14:00:00Z',
        reminders: [
            { sentAt: '2025-12-27T10:00:00Z', type: 'email', template: 'reminder_1' },
            { sentAt: '2026-01-10T10:00:00Z', type: 'email', template: 'reminder_2' }
        ],
        createdAt: '2025-12-20T10:00:00Z',
        createdBy: 'user-1',
        updatedAt: '2026-01-20T00:00:00Z',
        version: 1
    }
];

// ============================================
// COMPONENTS
// ============================================

function StatCard({
    label,
    value,
    subvalue,
    icon: Icon,
    color = 'text-white'
}: {
    label: string;
    value: string | number;
    subvalue?: string;
    icon: React.ElementType;
    color?: string;
}) {
    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-bg-tertiary/10 dark:bg-bg-tertiary/10 border border-border/30 rounded-[42px] p-10 shadow-premium relative overflow-hidden group backdrop-blur-3xl"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="flex items-start justify-between relative z-10">
                <div className="space-y-4">
                    <p className="text-accent-gold text-[10px] font-black uppercase tracking-[0.5em] mb-4 opacity-60 group-hover:opacity-100 transition-opacity">{label}</p>
                    <p className={cn("text-5xl font-mono font-black italic tracking-tighter leading-none", color === 'text-white' ? 'text-text-primary' : color)}>{value}</p>
                    {subvalue && (
                        <div className="flex items-center gap-2 mt-6">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                            <p className="text-text-muted/60 text-[10px] font-black tracking-[0.2em] uppercase">{subvalue}</p>
                        </div>
                    )}
                </div>
                <div className="w-16 h-16 rounded-[24px] bg-bg-tertiary/10 border border-border/30 flex items-center justify-center text-text-muted group-hover:text-accent-gold group-hover:scale-110 transition-all duration-700 shadow-glow-sm">
                    <Icon strokeWidth={1} className="w-8 h-8" />
                </div>
            </div>
        </motion.div>
    );
}

function QuoteCard({ quote, onView }: { quote: Quote; onView: () => void }) {
    const statusConfig = QUOTE_STATUS_CONFIG[quote.status];
    const [menuOpen, setMenuOpen] = useState(false);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.01 }}
            className="bg-bg-tertiary/10 dark:bg-bg-tertiary/10 border border-border/30 rounded-[48px] p-8 pr-16 hover:bg-white/[0.04] transition-all duration-700 group relative overflow-hidden flex items-center justify-between shadow-premium backdrop-blur-2xl"
        >
            {/* Status Neon Bar */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-20 rounded-r-full shadow-glow-sm" style={{ backgroundColor: statusConfig.color }} />
            <div className="absolute right-0 top-0 w-[30%] h-full bg-gradient-to-l from-white/[0.01] to-transparent pointer-events-none" />

            <div className="flex items-center gap-12 flex-1">
                {/* Visual Anchor */}
                <div className="relative">
                    <div className="absolute inset-0 bg-accent/10 blur-[30px] rounded-full scale-125 group-hover:bg-accent-gold/20 transition-all duration-700" />
                    <div className="w-24 h-24 rounded-[32px] bg-bg-tertiary border border-border/30 flex items-center justify-center relative z-10 shadow-premium transition-transform duration-700 group-hover:rotate-6">
                        {quote.customer.type === 'company' ? (
                            <Building2 strokeWidth={1} className="w-10 h-10 text-accent-gold" />
                        ) : (
                            <User strokeWidth={1} className="w-10 h-10 text-accent-gold" />
                        )}
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-6">
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.5em] opacity-40">{quote.quoteNumber}</span>
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                        <span
                            className="px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-border/30 shadow-inner"
                            style={{ backgroundColor: `${statusConfig.color}15`, color: statusConfig.color }}
                        >
                            {statusConfig.label}
                        </span>
                    </div>
                    <h3 className="text-4xl font-serif text-text-primary italic tracking-tight group-hover:text-accent-gold transition-colors duration-500">{quote.customer.companyName || quote.customer.name}</h3>
                    <p className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em] truncate max-w-xl opacity-40">{quote.subject}</p>
                </div>
            </div>

            <div className="flex items-center gap-24 relative z-10">
                <div className="text-center group-hover:scale-105 transition-transform duration-700">
                    <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] mb-3 opacity-40">Validité</p>
                    <p className="text-3xl font-serif font-black text-text-primary italic opacity-70 tracking-tighter">{formatDate(quote.validUntil)}</p>
                </div>

                <div className="text-right min-w-[200px] group-hover:scale-110 transition-transform duration-700">
                    <p className="text-[10px] font-black text-accent-gold uppercase tracking-[0.5em] mb-3">MONTANT TTC</p>
                    <p className="text-5xl font-mono font-black text-text-primary italic tracking-tighter leading-none">{formatCurrency(quote.totals.totalTTC)}</p>
                </div>

                <div className="flex gap-5">
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onView}
                        className="w-16 h-16 rounded-[24px] bg-accent text-white flex items-center justify-center shadow-glow group/btn overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-white translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                        <Eye strokeWidth={2} className="w-6 h-6 relative z-10 group-hover/btn:text-black transition-colors" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-16 h-16 rounded-[24px] bg-bg-tertiary/10 text-text-muted hover:text-text-primary flex items-center justify-center transition-all border border-border/30 shadow-premium"
                    >
                        <Download strokeWidth={1.5} className="w-6 h-6" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-16 h-16 rounded-[24px] bg-bg-tertiary/10 text-text-muted hover:text-text-primary flex items-center justify-center transition-all border border-border/30 shadow-premium"
                    >
                        <MoreVertical strokeWidth={1.5} className="w-6 h-6" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}

function QuoteStats({ quotes }: { quotes: Quote[] }) {
    const thisMonth = quotes.filter(q => {
        const date = new Date(q.createdAt);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });

    const pending = quotes.filter(q => ['draft', 'sent', 'viewed'].includes(q.status));
    const accepted = quotes.filter(q => q.status === 'accepted' || q.status === 'converted');
    const totalValue = accepted.reduce((sum, q) => sum + q.totals.totalTTC, 0);
    const conversionRate = quotes.length > 0
        ? (accepted.length / quotes.filter(q => q.status !== 'draft').length * 100).toFixed(0)
        : 0;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatCard
                label="Devis ce mois"
                value={thisMonth.length}
                subvalue={`${pending.length} en attente`}
                icon={FileText}
            />
            <StatCard
                label="Taux conversion"
                value={`${conversionRate}%`}
                icon={TrendingUp}
                color="text-success"
            />
            <StatCard
                label="CA Accepté"
                value={formatCurrency(totalValue)}
                icon={Euro}
                color="text-info"
            />
            <StatCard
                label="Valeur en attente"
                value={formatCurrency(pending.reduce((sum, q) => sum + q.totals.totalTTC, 0))}
                icon={Clock}
                color="text-warning"
            />
        </div>
    );
}

function StatusFilter({
    value,
    onChange
}: {
    value: QuoteStatus | 'all';
    onChange: (v: QuoteStatus | 'all') => void;
}) {
    const statuses: (QuoteStatus | 'all')[] = ['all', 'draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired'];

    return (
        <div className="flex items-center gap-3 flex-wrap bg-bg-tertiary/10 p-1.5 rounded-[28px] border border-border/30 backdrop-blur-xl shadow-inner">
            {statuses.map(status => {
                const config = status === 'all'
                    ? { label: 'Tous', color: '#FFFFFF' }
                    : QUOTE_STATUS_CONFIG[status];

                const isActive = value === status;

                return (
                    <button
                        key={status}
                        onClick={() => onChange(status)}
                        className={cn(
                            "px-8 py-3 rounded-[20px] text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-700 relative overflow-hidden group/filter",
                            isActive
                                ? "text-black shadow-glow-sm"
                                : "text-text-muted hover:text-text-primary"
                        )}
                        style={{ backgroundColor: isActive ? config.color : 'transparent' }}
                    >
                        <span className="relative z-10">{config.label}</span>
                        {!isActive && (
                            <div className="absolute inset-0 bg-bg-tertiary/10 translate-y-full group-hover/filter:translate-y-0 transition-transform duration-500" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}

// ============================================
// MAIN PAGE
// ============================================

export default function QuotesPage() {
    const [statusFilter, setStatusFilter] = useState<QuoteStatus | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isNewQuoteDialogOpen, setIsNewQuoteDialogOpen] = useState(false);

    const filteredQuotes = MOCK_QUOTES.filter(quote => {
        if (statusFilter !== 'all' && quote.status !== statusFilter) return false;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                quote.quoteNumber.toLowerCase().includes(query) ||
                quote.customer.name.toLowerCase().includes(query) ||
                quote.customer.companyName?.toLowerCase().includes(query) ||
                quote.subject.toLowerCase().includes(query)
            );
        }
        return true;
    });

    return (
        <div className="h-screen -m-4 md:-m-8 bg-bg-primary overflow-hidden flex flex-col relative">
            {/* Global Ambient Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-accent/5 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent-gold/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="flex-1 overflow-auto p-12 md:p-20 w-full elegant-scrollbar relative z-10">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-16">
                        <div>
                            <p className="text-[10px] font-black text-accent-gold uppercase tracking-[0.6em] mb-4">Architecture Exécutive</p>
                            <h1 className="text-7xl font-serif text-text-primary italic tracking-tighter mb-6 leading-none">Gestion des Devis</h1>
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-6 h-6 rounded-full border-2 border-bg-primary bg-bg-tertiary" />
                                    ))}
                                </div>
                                <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em]">98% Conversion Protocol • v4.2</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsNewQuoteDialogOpen(true)}
                                className="h-16 px-12 bg-accent text-white rounded-[24px] text-[11px] font-black uppercase tracking-[0.5em] shadow-glow flex items-center gap-5 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                                <Plus strokeWidth={2.5} className="w-4 h-4 relative z-10 group-hover:text-black transition-colors" />
                                <span className="relative z-10 group-hover:text-black transition-colors">Nouveau Devis</span>
                                <div className="w-8 h-px bg-white/20 group-hover:bg-black/20 group-hover:w-12 transition-all relative z-10" />
                            </motion.button>
                        </div>
                    </div>


                    {/* Stats */}
                    <QuoteStats quotes={MOCK_QUOTES} />

                    {/* Search & Filters Capsule */}
                    <div className="mt-20 flex items-center justify-between bg-bg-tertiary/10 dark:bg-bg-tertiary/10 backdrop-blur-2xl p-2 rounded-[32px] border border-border/30 mb-12 shadow-premium">
                        <StatusFilter value={statusFilter} onChange={setStatusFilter} />

                        <div className="relative flex-1 max-w-md mr-2 group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent-gold transition-colors" strokeWidth={2.5} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="RECHERCHER DANS L'ARCHIVE..."
                                className="w-full h-14 pl-16 pr-8 bg-bg-tertiary/40 border border-border rounded-[24px] text-[10px] text-text-primary font-black uppercase tracking-widest placeholder:text-text-muted/40 outline-none focus:border-accent-gold/50 focus:ring-4 focus:ring-accent-gold/5 transition-all"
                            />
                        </div>
                    </div>

                    {/* Quotes Grid */}
                    <div className="grid grid-cols-1 gap-8 pb-32">
                        <AnimatePresence mode="popLayout">
                            {filteredQuotes.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-52 bg-bg-tertiary/10 rounded-[64px] border border-dashed border-border/30 shadow-inner relative overflow-hidden group"
                                >
                                    <div className="absolute inset-0 bg-accent/5 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                    <FileText className="w-24 h-24 mx-auto mb-10 text-white/5 group-hover:text-accent-gold/20 transition-all duration-700 group-hover:scale-110 group-hover:rotate-6" strokeWidth={1} />
                                    <p className="text-3xl font-serif italic text-text-muted tracking-tight">Aucun protocole archivé dans cette dimension</p>
                                    <p className="text-[10px] font-black text-text-muted/30 uppercase tracking-[0.5em] mt-6">Protocol v4.2 • Intelligence Matrix</p>
                                </motion.div>
                            ) : (
                                filteredQuotes.map(quote => (
                                    <QuoteCard
                                        key={quote.id}
                                        quote={quote}
                                        onView={() => { }}
                                    />
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <NewQuoteDialog
                isOpen={isNewQuoteDialogOpen}
                onClose={() => setIsNewQuoteDialogOpen(false)}
            />
        </div>
    );
}
