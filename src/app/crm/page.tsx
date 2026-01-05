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
    Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

// Mock CRM Customers
const MOCK_CUSTOMERS = [
    {
        id: 'CRM001',
        name: 'Marie Dupont',
        email: 'marie.dupont@email.com',
        phone: '06 12 34 56 78',
        segment: 'vip',
        totalVisits: 24,
        totalSpent: 2840.00,
        avgSpend: 118.33,
        lastVisit: '2026-01-03',
        firstVisit: '2024-06-15',
        birthday: '1985-03-15',
        preferences: ['Vin blanc', 'Table terrasse', 'Allergique fruits de mer'],
        notes: 'Cliente fidèle, préfère être servie par Alexandre',
        tags: ['VIP', 'Entreprise', 'Anniversaire traité'],
        reservationHistory: [
            { date: '2026-01-03', time: '20:00', guests: 2, spent: 156.00 },
            { date: '2025-12-20', time: '19:30', guests: 4, spent: 312.00 },
            { date: '2025-11-15', time: '20:30', guests: 2, spent: 142.00 },
        ],
    },
    {
        id: 'CRM002',
        name: 'Jean Martin',
        email: 'jean.martin@gmail.com',
        phone: '06 98 76 54 32',
        segment: 'regular',
        totalVisits: 8,
        totalSpent: 720.00,
        avgSpend: 90.00,
        lastVisit: '2025-12-28',
        firstVisit: '2025-03-10',
        birthday: '1990-07-22',
        preferences: ['Vin rouge Bordeaux', 'Menu dégustation'],
        notes: '',
        tags: ['Couple', 'Gastronomie'],
        reservationHistory: [
            { date: '2025-12-28', time: '20:00', guests: 2, spent: 98.00 },
            { date: '2025-11-05', time: '19:00', guests: 2, spent: 112.00 },
        ],
    },
    {
        id: 'CRM003',
        name: 'Sophie Bernard',
        email: 'sophie.b@email.com',
        phone: '06 11 22 33 44',
        segment: 'new',
        totalVisits: 1,
        totalSpent: 86.00,
        avgSpend: 86.00,
        lastVisit: '2025-12-30',
        firstVisit: '2025-12-30',
        birthday: null,
        preferences: [],
        notes: 'Première visite suite à une recommandation Instagram',
        tags: ['Nouveau', 'Instagram'],
        reservationHistory: [
            { date: '2025-12-30', time: '20:30', guests: 2, spent: 86.00 },
        ],
    },
    {
        id: 'CRM004',
        name: 'Pierre Leroy',
        email: 'p.leroy@business.com',
        phone: '06 55 66 77 88',
        segment: 'vip',
        totalVisits: 32,
        totalSpent: 4560.00,
        avgSpend: 142.50,
        lastVisit: '2026-01-04',
        firstVisit: '2023-11-20',
        birthday: '1978-11-08',
        preferences: ['Champagne', 'Carré VIP', 'Repas affaires'],
        notes: 'CEO Tech company, réunions business fréquentes',
        tags: ['VIP', 'Business', 'High-spender'],
        reservationHistory: [],
    },
    {
        id: 'CRM005',
        name: 'Claire Moreau',
        email: 'claire.m@outlook.com',
        phone: '06 99 88 77 66',
        segment: 'lost',
        totalVisits: 5,
        totalSpent: 340.00,
        avgSpend: 68.00,
        lastVisit: '2025-06-15',
        firstVisit: '2024-12-10',
        birthday: '1995-01-20',
        preferences: ['Végétarienne'],
        notes: 'À réactiver - dernière visite il y a 6 mois',
        tags: ['À réactiver', 'Végétarienne'],
        reservationHistory: [],
    },
];

const SEGMENTS = {
    vip: { name: 'VIP', color: '#8B5CF6', icon: Star },
    regular: { name: 'Régulier', color: '#00D764', icon: Heart },
    new: { name: 'Nouveau', color: '#4285F4', icon: Plus },
    lost: { name: 'À réactiver', color: '#FF9900', icon: AlertCircle },
};

export default function CRMPage() {
    const { showToast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterSegment, setFilterSegment] = useState<string | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [showNewCustomer, setShowNewCustomer] = useState(false);

    const filteredCustomers = MOCK_CUSTOMERS.filter(c => {
        if (filterSegment && c.segment !== filterSegment) return false;
        if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !c.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !c.phone.includes(searchQuery)) return false;
        return true;
    });

    const stats = {
        total: MOCK_CUSTOMERS.length,
        vip: MOCK_CUSTOMERS.filter(c => c.segment === 'vip').length,
        totalRevenue: MOCK_CUSTOMERS.reduce((sum, c) => sum + c.totalSpent, 0),
        avgLifetimeValue: MOCK_CUSTOMERS.reduce((sum, c) => sum + c.totalSpent, 0) / MOCK_CUSTOMERS.length,
    };

    const handleSendEmail = (customer: any) => {
        showToast(`Email envoyé à ${customer.email}`, "success");
    };

    const handleSendSMS = (customer: any) => {
        showToast(`SMS envoyé au ${customer.phone}`, "success");
    };

    return (
        <div className="flex h-[calc(100vh-70px)] -m-6 bg-[#F8F9FA] overflow-hidden">
            {/* Sidebar - Filters */}
            <div className="w-72 bg-white border-r border-neutral-100 p-6 flex flex-col">
                <div className="mb-6">
                    <h1 className="text-xl font-black text-[#1A1A1A] tracking-tight">CRM Clients</h1>
                    <p className="text-[11px] font-bold text-[#ADB5BD] uppercase tracking-wider mt-1">
                        {MOCK_CUSTOMERS.length} clients
                    </p>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ADB5BD]" />
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 bg-[#F8F9FA] rounded-xl border-2 border-transparent focus:border-[#1A1A1A] font-bold text-sm outline-none"
                    />
                </div>

                {/* Segment Filters */}
                <div className="space-y-2 flex-1">
                    <button
                        onClick={() => setFilterSegment(null)}
                        className={cn(
                            "w-full flex items-center justify-between p-3 rounded-xl transition-all",
                            !filterSegment ? "bg-[#1A1A1A] text-white" : "hover:bg-[#F8F9FA]"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5" />
                            <span className="font-bold">Tous les clients</span>
                        </div>
                        <span className="text-sm font-black">{MOCK_CUSTOMERS.length}</span>
                    </button>

                    {Object.entries(SEGMENTS).map(([key, segment]) => {
                        const Icon = segment.icon;
                        const count = MOCK_CUSTOMERS.filter(c => c.segment === key).length;
                        return (
                            <button
                                key={key}
                                onClick={() => setFilterSegment(filterSegment === key ? null : key)}
                                className={cn(
                                    "w-full flex items-center justify-between p-3 rounded-xl transition-all",
                                    filterSegment === key ? "bg-[#F8F9FA] border-2 border-[#1A1A1A]" : "hover:bg-[#F8F9FA]"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: `${segment.color}15` }}
                                    >
                                        <Icon className="w-4 h-4" style={{ color: segment.color }} />
                                    </div>
                                    <span className="font-bold text-sm">{segment.name}</span>
                                </div>
                                <span className="text-sm font-bold text-[#ADB5BD]">{count}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Quick Stats */}
                <div className="pt-4 border-t border-neutral-100 space-y-3">
                    <div className="p-3 bg-[#F8F9FA] rounded-xl">
                        <p className="text-[10px] font-bold text-[#ADB5BD] uppercase">CA Total Clients</p>
                        <p className="text-lg font-black text-[#1A1A1A]">{stats.totalRevenue.toLocaleString('fr-FR')} €</p>
                    </div>
                    <div className="p-3 bg-[#F8F9FA] rounded-xl">
                        <p className="text-[10px] font-bold text-[#ADB5BD] uppercase">Valeur vie moyenne</p>
                        <p className="text-lg font-black text-[#00D764]">{stats.avgLifetimeValue.toFixed(0)} €</p>
                    </div>
                </div>
            </div>

            {/* Main Content - Customer List */}
            <div className="flex-1 overflow-auto p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-black text-[#1A1A1A]">
                        {filterSegment ? SEGMENTS[filterSegment as keyof typeof SEGMENTS].name : 'Tous les clients'}
                    </h2>
                    <div className="flex gap-3">
                        <Button variant="outline" className="h-10 rounded-xl">
                            <Download className="w-4 h-4 mr-2" />
                            Exporter
                        </Button>
                        <Button onClick={() => setShowNewCustomer(true)} className="h-10 bg-[#1A1A1A] rounded-xl">
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter Client
                        </Button>
                    </div>
                </div>

                <div className="space-y-3">
                    {filteredCustomers.map((customer) => {
                        const segment = SEGMENTS[customer.segment as keyof typeof SEGMENTS];
                        const SegmentIcon = segment.icon;
                        return (
                            <div
                                key={customer.id}
                                className="bg-white rounded-2xl p-5 border border-neutral-100 hover:shadow-lg transition-all cursor-pointer"
                                onClick={() => setSelectedCustomer(customer)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-5">
                                        {/* Avatar */}
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] flex items-center justify-center">
                                            <span className="text-white font-black text-lg">
                                                {customer.name.split(' ').map((n: string) => n[0]).join('')}
                                            </span>
                                        </div>

                                        {/* Info */}
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h4 className="font-black text-lg text-[#1A1A1A]">{customer.name}</h4>
                                                <span
                                                    className="px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1"
                                                    style={{ backgroundColor: `${segment.color}15`, color: segment.color }}
                                                >
                                                    <SegmentIcon className="w-3 h-3" />
                                                    {segment.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-1 text-[12px] text-[#6C757D]">
                                                <span className="flex items-center gap-1">
                                                    <Mail className="w-3.5 h-3.5" />
                                                    {customer.email}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Phone className="w-3.5 h-3.5" />
                                                    {customer.phone}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        {/* Stats */}
                                        <div className="text-center">
                                            <p className="font-black text-[#1A1A1A]">{customer.totalVisits}</p>
                                            <p className="text-[10px] text-[#ADB5BD]">Visites</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-black text-[#00D764]">{customer.totalSpent.toFixed(0)}€</p>
                                            <p className="text-[10px] text-[#ADB5BD]">Total dépensé</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-bold text-[#6C757D]">{customer.lastVisit}</p>
                                            <p className="text-[10px] text-[#ADB5BD]">Dernière visite</p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-9 w-9 p-0 rounded-lg"
                                                onClick={(e) => { e.stopPropagation(); handleSendEmail(customer); }}
                                            >
                                                <Mail className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-9 w-9 p-0 rounded-lg"
                                                onClick={(e) => { e.stopPropagation(); handleSendSMS(customer); }}
                                            >
                                                <MessageSquare className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-9 w-9 p-0 rounded-lg"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Tags */}
                                {customer.tags.length > 0 && (
                                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-neutral-50">
                                        <Tag className="w-3.5 h-3.5 text-[#ADB5BD]" />
                                        {customer.tags.map((tag: string, i: number) => (
                                            <span key={i} className="px-2 py-1 bg-[#F8F9FA] rounded-md text-[10px] font-bold text-[#6C757D]">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Customer Detail Panel */}
            {selectedCustomer && (
                <div className="w-96 bg-white border-l border-neutral-100 overflow-auto">
                    <div className="p-6 border-b border-neutral-100 bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] text-white">
                        <button
                            onClick={() => setSelectedCustomer(null)}
                            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg"
                        >
                            ×
                        </button>
                        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                            <span className="text-2xl font-black">
                                {selectedCustomer.name.split(' ').map((n: string) => n[0]).join('')}
                            </span>
                        </div>
                        <h3 className="text-xl font-black">{selectedCustomer.name}</h3>
                        <p className="text-white/60 text-sm mt-1">{selectedCustomer.email}</p>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 bg-[#F8F9FA] rounded-xl text-center">
                                <p className="text-xl font-black text-[#1A1A1A]">{selectedCustomer.totalVisits}</p>
                                <p className="text-[10px] font-bold text-[#ADB5BD]">Visites</p>
                            </div>
                            <div className="p-3 bg-[#F8F9FA] rounded-xl text-center">
                                <p className="text-xl font-black text-[#00D764]">{selectedCustomer.totalSpent.toFixed(0)}€</p>
                                <p className="text-[10px] font-bold text-[#ADB5BD]">Total</p>
                            </div>
                            <div className="p-3 bg-[#F8F9FA] rounded-xl text-center">
                                <p className="text-xl font-black text-[#1A1A1A]">{selectedCustomer.avgSpend.toFixed(0)}€</p>
                                <p className="text-[10px] font-bold text-[#ADB5BD]">Moy/visite</p>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h4 className="text-[11px] font-black text-[#ADB5BD] uppercase mb-3">Contact</h4>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F8F9FA]">
                                    <Phone className="w-4 h-4 text-[#6C757D]" />
                                    <span className="text-sm font-bold">{selectedCustomer.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F8F9FA]">
                                    <Mail className="w-4 h-4 text-[#6C757D]" />
                                    <span className="text-sm font-bold">{selectedCustomer.email}</span>
                                </div>
                                {selectedCustomer.birthday && (
                                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F8F9FA]">
                                        <Cake className="w-4 h-4 text-[#E4405F]" />
                                        <span className="text-sm font-bold">{selectedCustomer.birthday}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Preferences */}
                        {selectedCustomer.preferences.length > 0 && (
                            <div>
                                <h4 className="text-[11px] font-black text-[#ADB5BD] uppercase mb-3">Préférences</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedCustomer.preferences.map((pref: string, i: number) => (
                                        <span key={i} className="px-3 py-1.5 bg-[#F8F9FA] rounded-lg text-sm font-bold text-[#1A1A1A]">
                                            {pref}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Notes */}
                        {selectedCustomer.notes && (
                            <div>
                                <h4 className="text-[11px] font-black text-[#ADB5BD] uppercase mb-3">Notes</h4>
                                <p className="text-sm text-[#6C757D] p-3 bg-[#F8F9FA] rounded-xl">
                                    {selectedCustomer.notes}
                                </p>
                            </div>
                        )}

                        {/* Reservation History */}
                        {selectedCustomer.reservationHistory.length > 0 && (
                            <div>
                                <h4 className="text-[11px] font-black text-[#ADB5BD] uppercase mb-3">Historique</h4>
                                <div className="space-y-2">
                                    {selectedCustomer.reservationHistory.map((res: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-[#F8F9FA] rounded-xl">
                                            <div>
                                                <p className="font-bold text-sm">{res.date}</p>
                                                <p className="text-[11px] text-[#6C757D]">{res.time} • {res.guests} pers.</p>
                                            </div>
                                            <span className="font-black text-[#00D764]">{res.spent.toFixed(0)}€</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-4 border-t border-neutral-100">
                            <Button
                                className="flex-1 h-11 bg-[#1A1A1A] rounded-xl"
                                onClick={() => showToast("Nouvelle réservation pour " + selectedCustomer.name, "info")}
                            >
                                <Calendar className="w-4 h-4 mr-2" />
                                Réserver
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1 h-11 rounded-xl"
                                onClick={() => handleSendEmail(selectedCustomer)}
                            >
                                <Send className="w-4 h-4 mr-2" />
                                Contacter
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* New Customer Modal */}
            {showNewCustomer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="p-6 border-b border-neutral-100">
                            <h2 className="text-xl font-black text-[#1A1A1A]">Nouveau Client</h2>
                        </div>
                        <form className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[11px] font-black text-[#ADB5BD] uppercase">Nom</label>
                                    <input
                                        type="text"
                                        className="w-full h-11 px-4 mt-1 bg-[#F8F9FA] rounded-xl border-2 border-transparent focus:border-[#1A1A1A] font-bold outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-black text-[#ADB5BD] uppercase">Téléphone</label>
                                    <input
                                        type="tel"
                                        className="w-full h-11 px-4 mt-1 bg-[#F8F9FA] rounded-xl border-2 border-transparent focus:border-[#1A1A1A] font-bold outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[11px] font-black text-[#ADB5BD] uppercase">Email</label>
                                <input
                                    type="email"
                                    className="w-full h-11 px-4 mt-1 bg-[#F8F9FA] rounded-xl border-2 border-transparent focus:border-[#1A1A1A] font-bold outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-[11px] font-black text-[#ADB5BD] uppercase">Date d'anniversaire</label>
                                <input
                                    type="date"
                                    className="w-full h-11 px-4 mt-1 bg-[#F8F9FA] rounded-xl border-2 border-transparent focus:border-[#1A1A1A] font-bold outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-[11px] font-black text-[#ADB5BD] uppercase">Notes / Préférences</label>
                                <textarea
                                    className="w-full h-20 px-4 py-3 mt-1 bg-[#F8F9FA] rounded-xl border-2 border-transparent focus:border-[#1A1A1A] font-bold outline-none resize-none"
                                />
                            </div>
                        </form>
                        <div className="p-6 bg-[#F8F9FA] flex gap-3">
                            <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setShowNewCustomer(false)}>
                                Annuler
                            </Button>
                            <Button
                                className="flex-1 h-12 bg-[#00D764] hover:bg-[#00B956] rounded-xl"
                                onClick={() => {
                                    showToast("Client ajouté au CRM", "success");
                                    setShowNewCustomer(false);
                                }}
                            >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Créer le client
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
