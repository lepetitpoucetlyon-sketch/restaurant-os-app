"use client";

import { useState } from "react";
import {
    Wine,
    Beer,
    Coffee,
    GlassWater,
    Martini,
    Grape,
    MapPin,
    Calendar,
    Star,
    ThermometerSun,
    Clock,
    Plus,
    Search,
    Filter,
    Edit3,
    Trash2,
    Eye,
    Award,
    TrendingUp,
    Package,
    DollarSign,
    ChevronRight,
    AlertCircle,
    CheckCircle2,
    Sparkles,
    BookOpen,
    Users,
    Settings,
    BarChart3,
    Leaf
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

type BarTab = 'cocktails' | 'wines' | 'sommelier' | 'stocks' | 'kds';

// Wine Regions
const WINE_REGIONS = [
    { id: 'bordeaux', name: 'Bordeaux', country: 'France', color: '#722F37' },
    { id: 'bourgogne', name: 'Bourgogne', country: 'France', color: '#8B0000' },
    { id: 'champagne', name: 'Champagne', country: 'France', color: '#F7E7CE' },
    { id: 'rhone', name: 'Vallée du Rhône', country: 'France', color: '#4A0E0E' },
    { id: 'tuscany', name: 'Toscane', country: 'Italie', color: '#6B2D2D' },
    { id: 'rioja', name: 'Rioja', country: 'Espagne', color: '#5C1A1A' },
];

// Wine Cellar
const WINE_CELLAR = [
    {
        id: 'W001',
        name: 'Château Margaux 2015',
        region: 'bordeaux',
        type: 'Rouge',
        grape: 'Cabernet Sauvignon, Merlot',
        vintage: 2015,
        price: 450,
        costPrice: 250,
        stock: 6,
        minStock: 2,
        rating: 98,
        servingTemp: '16-18°C',
        pairings: ['Boeuf Wellington', 'Agneau rôti', 'Fromages affinés'],
        notes: 'Grand cru classé, notes de cassis et cèdre',
        location: 'Cave A - Étagère 3',
    },
    {
        id: 'W002',
        name: 'Dom Pérignon 2012',
        region: 'champagne',
        type: 'Champagne',
        grape: 'Chardonnay, Pinot Noir',
        vintage: 2012,
        price: 280,
        costPrice: 160,
        stock: 12,
        minStock: 4,
        rating: 96,
        servingTemp: '8-10°C',
        pairings: ['Huîtres', 'Caviar', 'Homard'],
        notes: 'Finesse exceptionnelle, bulles fines',
        location: 'Cave B - Étagère 1',
    },
    {
        id: 'W003',
        name: 'Romanée-Conti 2018',
        region: 'bourgogne',
        type: 'Rouge',
        grape: 'Pinot Noir',
        vintage: 2018,
        price: 1850,
        costPrice: 1200,
        stock: 2,
        minStock: 1,
        rating: 100,
        servingTemp: '15-17°C',
        pairings: ['Pigeon rôti', 'Truffe', 'Époisses'],
        notes: 'Le graal des vins, complexité infinie',
        location: 'Cave Premium - Coffre',
    },
    {
        id: 'W004',
        name: 'Château d\'Yquem 2016',
        region: 'bordeaux',
        type: 'Liquoreux',
        grape: 'Sémillon, Sauvignon Blanc',
        vintage: 2016,
        price: 380,
        costPrice: 220,
        stock: 4,
        minStock: 2,
        rating: 97,
        servingTemp: '8-10°C',
        pairings: ['Foie gras', 'Roquefort', 'Tarte Tatin'],
        notes: 'Notes de miel et abricot confit',
        location: 'Cave A - Étagère 5',
    },
];

// Cocktails
const COCKTAILS = [
    {
        id: 'C001',
        name: 'Signature Martini',
        category: 'Classique revisité',
        price: 16,
        costPrice: 4.50,
        ingredients: ['Gin premium', 'Vermouth dry', 'Twist citron'],
        garnish: 'Zeste de citron',
        glassware: 'Coupette',
        technique: 'Stirred',
        popularity: 92,
        isSignature: true,
    },
    {
        id: 'C002',
        name: 'Espresso Martini',
        category: 'After dinner',
        price: 14,
        costPrice: 3.80,
        ingredients: ['Vodka', 'Kahlúa', 'Espresso', 'Sirop sucre'],
        garnish: '3 grains de café',
        glassware: 'Coupette',
        technique: 'Shaken',
        popularity: 88,
        isSignature: false,
    },
    {
        id: 'C003',
        name: 'French 75',
        category: 'Champagne cocktail',
        price: 18,
        costPrice: 5.20,
        ingredients: ['Gin', 'Citron', 'Sirop', 'Champagne'],
        garnish: 'Twist citron',
        glassware: 'Flûte',
        technique: 'Shaken & topped',
        popularity: 85,
        isSignature: false,
    },
    {
        id: 'C004',
        name: 'Negroni Sbagliato',
        category: 'Apéritif',
        price: 14,
        costPrice: 4.00,
        ingredients: ['Campari', 'Vermouth rouge', 'Prosecco'],
        garnish: 'Tranche orange',
        glassware: 'Tumbler',
        technique: 'Built',
        popularity: 78,
        isSignature: false,
    },
];

// Bar KDS Orders
const BAR_ORDERS = [
    {
        id: 'BAR001',
        table: 'T05',
        time: '20:15',
        elapsed: 3,
        items: [
            { name: 'Signature Martini', qty: 2, status: 'preparing' },
            { name: 'Espresso Martini', qty: 1, status: 'pending' },
        ],
        priority: 'normal',
    },
    {
        id: 'BAR002',
        table: 'T12',
        time: '20:18',
        elapsed: 1,
        items: [
            { name: 'Dom Pérignon 2012', qty: 1, status: 'pending' },
        ],
        priority: 'vip',
    },
    {
        id: 'BAR003',
        table: 'Bar',
        time: '20:10',
        elapsed: 8,
        items: [
            { name: 'French 75', qty: 3, status: 'preparing' },
            { name: 'Negroni Sbagliato', qty: 2, status: 'done' },
        ],
        priority: 'rush',
    },
];

export default function BarPage() {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<BarTab>('wines');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedWine, setSelectedWine] = useState<any>(null);
    const [filterRegion, setFilterRegion] = useState<string | null>(null);

    const filteredWines = WINE_CELLAR.filter(w => {
        if (filterRegion && w.region !== filterRegion) return false;
        if (searchQuery && !w.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const totalCellarValue = WINE_CELLAR.reduce((sum, w) => sum + (w.price * w.stock), 0);
    const lowStockWines = WINE_CELLAR.filter(w => w.stock <= w.minStock).length;

    return (
        <div className="flex h-[calc(100vh-70px)] -m-6 bg-[#F8F9FA] overflow-hidden">
            {/* Left Sidebar */}
            <div className="w-72 bg-white border-r border-[#E9ECEF] flex flex-col p-6">
                <div className="mb-8">
                    <h1 className="text-xl font-black text-[#1A1A1A] tracking-tight">Bar & Sommellerie</h1>
                    <p className="text-[11px] font-bold text-[#ADB5BD] uppercase tracking-wider mt-1">
                        Cave • Cocktails • Service
                    </p>
                </div>

                <nav className="space-y-2 flex-1">
                    <button
                        onClick={() => setActiveTab('wines')}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all",
                            activeTab === 'wines' ? "bg-[#722F37] text-white shadow-lg" : "text-[#6C757D] hover:bg-[#F8F9FA]"
                        )}
                    >
                        <Wine className="w-5 h-5" />
                        Cave à Vins
                    </button>
                    <button
                        onClick={() => setActiveTab('sommelier')}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all",
                            activeTab === 'sommelier' ? "bg-[#722F37] text-white shadow-lg" : "text-[#6C757D] hover:bg-[#F8F9FA]"
                        )}
                    >
                        <Award className="w-5 h-5" />
                        Sommellerie
                    </button>
                    <button
                        onClick={() => setActiveTab('cocktails')}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all",
                            activeTab === 'cocktails' ? "bg-[#722F37] text-white shadow-lg" : "text-[#6C757D] hover:bg-[#F8F9FA]"
                        )}
                    >
                        <Martini className="w-5 h-5" />
                        Cocktails
                    </button>
                    <button
                        onClick={() => setActiveTab('kds')}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all",
                            activeTab === 'kds' ? "bg-[#722F37] text-white shadow-lg" : "text-[#6C757D] hover:bg-[#F8F9FA]"
                        )}
                    >
                        <Clock className="w-5 h-5" />
                        KDS Bar
                    </button>
                    <button
                        onClick={() => setActiveTab('stocks')}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all",
                            activeTab === 'stocks' ? "bg-[#722F37] text-white shadow-lg" : "text-[#6C757D] hover:bg-[#F8F9FA]"
                        )}
                    >
                        <Package className="w-5 h-5" />
                        Stocks Bar
                    </button>
                </nav>

                {/* Quick Stats */}
                <div className="p-4 bg-gradient-to-br from-[#722F37] to-[#4A0E0E] rounded-2xl text-white">
                    <div className="flex items-center gap-3 mb-3">
                        <Wine className="w-5 h-5 text-white/60" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Valeur Cave</span>
                    </div>
                    <p className="text-2xl font-black">{totalCellarValue.toLocaleString('fr-FR')} €</p>
                    <p className="text-[11px] text-white/60 mt-1">{WINE_CELLAR.length} références</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-8">
                {/* Wines Tab */}
                {activeTab === 'wines' && (
                    <div className="animate-in fade-in duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-[#1A1A1A]">Cave à Vins</h2>
                                <p className="text-[#6C757D] text-sm mt-1">Gérez votre cave et vos références</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ADB5BD]" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-64 h-11 pl-11 pr-4 bg-white border border-neutral-100 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]"
                                    />
                                </div>
                                <Button className="h-11 bg-[#722F37] hover:bg-[#5A252C] rounded-xl">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Ajouter Vin
                                </Button>
                            </div>
                        </div>

                        {/* Region Filters */}
                        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                            <button
                                onClick={() => setFilterRegion(null)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                                    !filterRegion ? "bg-[#722F37] text-white" : "bg-white hover:bg-[#F8F9FA]"
                                )}
                            >
                                Toutes régions
                            </button>
                            {WINE_REGIONS.map((region) => (
                                <button
                                    key={region.id}
                                    onClick={() => setFilterRegion(filterRegion === region.id ? null : region.id)}
                                    className={cn(
                                        "px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2",
                                        filterRegion === region.id ? "bg-[#722F37] text-white" : "bg-white hover:bg-[#F8F9FA]"
                                    )}
                                >
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: region.color }} />
                                    {region.name}
                                </button>
                            ))}
                        </div>

                        {/* Wine Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredWines.map((wine) => {
                                const region = WINE_REGIONS.find(r => r.id === wine.region);
                                const isLowStock = wine.stock <= wine.minStock;
                                return (
                                    <div
                                        key={wine.id}
                                        className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
                                        onClick={() => setSelectedWine(wine)}
                                    >
                                        {/* Region Color Strip */}
                                        <div
                                            className="absolute top-0 left-0 w-2 h-full"
                                            style={{ backgroundColor: region?.color }}
                                        />

                                        <div className="pl-4">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="font-black text-lg text-[#1A1A1A]">{wine.name}</h3>
                                                    <p className="text-sm text-[#6C757D]">{wine.type} • {region?.name}</p>
                                                </div>
                                                <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 rounded-lg">
                                                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                                    <span className="font-black text-amber-600">{wine.rating}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 mb-4 text-sm text-[#6C757D]">
                                                <span className="flex items-center gap-1">
                                                    <Grape className="w-4 h-4" />
                                                    {wine.vintage}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <ThermometerSun className="w-4 h-4" />
                                                    {wine.servingTemp}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-neutral-50">
                                                <div>
                                                    <p className="text-2xl font-black text-[#722F37]">{wine.price} €</p>
                                                    <p className="text-[10px] text-[#ADB5BD]">Marge: {(((wine.price - wine.costPrice) / wine.price) * 100).toFixed(0)}%</p>
                                                </div>
                                                <div className={cn(
                                                    "px-3 py-1.5 rounded-lg text-sm font-bold",
                                                    isLowStock ? "bg-[#FEECEC] text-[#FF4D4D]" : "bg-[#E6F9EF] text-[#00D764]"
                                                )}>
                                                    {wine.stock} en stock
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Sommelier Tab */}
                {activeTab === 'sommelier' && (
                    <div className="animate-in fade-in duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-[#1A1A1A]">Sommellerie</h2>
                                <p className="text-[#6C757D] text-sm mt-1">Accords mets-vins et recommandations</p>
                            </div>
                        </div>

                        {/* Pairing Suggestions */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
                                <h3 className="text-lg font-black text-[#1A1A1A] mb-6 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-[#722F37]" />
                                    Accords du Jour
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { dish: 'Filet de Boeuf Rossini', wine: 'Château Margaux 2015', reason: 'La puissance du vin sublime le foie gras' },
                                        { dish: 'Homard Thermidor', wine: 'Dom Pérignon 2012', reason: 'Bulles fines et richesse du homard' },
                                        { dish: 'Pigeon aux Cerises', wine: 'Romanée-Conti 2018', reason: 'Pinot Noir et fruits rouges en harmonie' },
                                    ].map((pairing, i) => (
                                        <div key={i} className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-bold text-[#1A1A1A]">{pairing.dish}</span>
                                                <ChevronRight className="w-4 h-4 text-[#ADB5BD]" />
                                            </div>
                                            <p className="text-[#722F37] font-bold text-sm">{pairing.wine}</p>
                                            <p className="text-[12px] text-[#6C757D] mt-1">{pairing.reason}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Wine Knowledge Base */}
                            <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
                                <h3 className="text-lg font-black text-[#1A1A1A] mb-6 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-[#722F37]" />
                                    Fiches Région
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {WINE_REGIONS.slice(0, 4).map((region) => (
                                        <div
                                            key={region.id}
                                            className="p-4 rounded-xl border border-neutral-100 hover:shadow-md transition-all cursor-pointer"
                                        >
                                            <div
                                                className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center"
                                                style={{ backgroundColor: `${region.color}20` }}
                                            >
                                                <MapPin className="w-5 h-5" style={{ color: region.color }} />
                                            </div>
                                            <h4 className="font-bold text-[#1A1A1A]">{region.name}</h4>
                                            <p className="text-sm text-[#6C757D]">{region.country}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Temperature Guide */}
                        <div className="bg-gradient-to-br from-[#722F37] to-[#4A0E0E] rounded-2xl p-6 text-white">
                            <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                                <ThermometerSun className="w-5 h-5" />
                                Guide des Températures de Service
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { type: 'Champagne', temp: '6-8°C', icon: '🍾' },
                                    { type: 'Blanc sec', temp: '8-10°C', icon: '🥂' },
                                    { type: 'Rouge léger', temp: '12-14°C', icon: '🍷' },
                                    { type: 'Rouge corsé', temp: '16-18°C', icon: '🍷' },
                                ].map((item, i) => (
                                    <div key={i} className="p-4 bg-white/10 rounded-xl text-center">
                                        <span className="text-2xl">{item.icon}</span>
                                        <p className="font-bold mt-2">{item.type}</p>
                                        <p className="text-2xl font-black mt-1">{item.temp}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Cocktails Tab */}
                {activeTab === 'cocktails' && (
                    <div className="animate-in fade-in duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-[#1A1A1A]">Carte des Cocktails</h2>
                                <p className="text-[#6C757D] text-sm mt-1">Recettes et fiches techniques bar</p>
                            </div>
                            <Button className="h-11 bg-[#722F37] hover:bg-[#5A252C] rounded-xl">
                                <Plus className="w-4 h-4 mr-2" />
                                Nouveau Cocktail
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {COCKTAILS.map((cocktail) => (
                                <div
                                    key={cocktail.id}
                                    className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm hover:shadow-lg transition-all relative"
                                >
                                    {cocktail.isSignature && (
                                        <div className="absolute top-4 right-4 px-2 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-md flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-amber-500" />
                                            SIGNATURE
                                        </div>
                                    )}

                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#722F37] to-[#4A0E0E] flex items-center justify-center mb-4">
                                        <Martini className="w-8 h-8 text-white" />
                                    </div>

                                    <h3 className="font-black text-xl text-[#1A1A1A]">{cocktail.name}</h3>
                                    <p className="text-sm text-[#6C757D] mb-4">{cocktail.category}</p>

                                    <div className="space-y-2 mb-4">
                                        <p className="text-[11px] font-black text-[#ADB5BD] uppercase">Ingrédients</p>
                                        <div className="flex flex-wrap gap-1">
                                            {cocktail.ingredients.map((ing, i) => (
                                                <span key={i} className="px-2 py-1 bg-[#F8F9FA] rounded-md text-[11px] font-bold text-[#6C757D]">
                                                    {ing}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-neutral-50">
                                        <div>
                                            <p className="text-2xl font-black text-[#722F37]">{cocktail.price} €</p>
                                            <p className="text-[10px] text-[#00D764] font-bold">
                                                Marge: {(((cocktail.price - cocktail.costPrice) / cocktail.price) * 100).toFixed(0)}%
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm">
                                            <TrendingUp className="w-4 h-4 text-[#00D764]" />
                                            <span className="font-bold text-[#6C757D]">{cocktail.popularity}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* KDS Bar Tab */}
                {activeTab === 'kds' && (
                    <div className="animate-in fade-in duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-[#1A1A1A]">KDS Bar</h2>
                                <p className="text-[#6C757D] text-sm mt-1">Commandes boissons en temps réel</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-[#E6F9EF] rounded-xl">
                                    <div className="w-3 h-3 rounded-full bg-[#00D764] animate-pulse" />
                                    <span className="font-bold text-[#00D764]">En service</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {BAR_ORDERS.map((order) => (
                                <div
                                    key={order.id}
                                    className={cn(
                                        "bg-white rounded-2xl border-2 overflow-hidden transition-all",
                                        order.priority === 'rush' ? "border-[#FF4D4D] shadow-lg shadow-[#FF4D4D]/20" :
                                            order.priority === 'vip' ? "border-[#8B5CF6] shadow-lg shadow-[#8B5CF6]/20" :
                                                "border-neutral-100"
                                    )}
                                >
                                    {/* Header */}
                                    <div className={cn(
                                        "p-4 flex items-center justify-between",
                                        order.priority === 'rush' ? "bg-[#FF4D4D]" :
                                            order.priority === 'vip' ? "bg-[#8B5CF6]" :
                                                "bg-[#1A1A1A]"
                                    )}>
                                        <div className="flex items-center gap-3">
                                            <span className="text-white font-black text-lg">{order.table}</span>
                                            {order.priority === 'vip' && (
                                                <span className="px-2 py-0.5 bg-white/20 rounded text-[10px] font-bold text-white">VIP</span>
                                            )}
                                            {order.priority === 'rush' && (
                                                <span className="px-2 py-0.5 bg-white/20 rounded text-[10px] font-bold text-white animate-pulse">RUSH</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-white/80 text-sm">
                                            <Clock className="w-4 h-4" />
                                            {order.elapsed} min
                                        </div>
                                    </div>

                                    {/* Items */}
                                    <div className="p-4 space-y-3">
                                        {order.items.map((item, i) => (
                                            <div
                                                key={i}
                                                className={cn(
                                                    "flex items-center justify-between p-3 rounded-xl",
                                                    item.status === 'done' ? "bg-[#E6F9EF]" :
                                                        item.status === 'preparing' ? "bg-amber-50" :
                                                            "bg-[#F8F9FA]"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-black text-sm">
                                                        {item.qty}x
                                                    </span>
                                                    <span className="font-bold text-[#1A1A1A]">{item.name}</span>
                                                </div>
                                                {item.status === 'done' && (
                                                    <CheckCircle2 className="w-5 h-5 text-[#00D764]" />
                                                )}
                                                {item.status === 'preparing' && (
                                                    <div className="w-5 h-5 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="p-4 border-t border-neutral-100 flex gap-2">
                                        <Button
                                            className="flex-1 h-10 bg-[#00D764] hover:bg-[#00B956] rounded-xl"
                                            onClick={() => showToast(`Commande ${order.id} prête!`, "success")}
                                        >
                                            <CheckCircle2 className="w-4 h-4 mr-2" />
                                            Terminé
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Stocks Tab */}
                {activeTab === 'stocks' && (
                    <div className="animate-in fade-in duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-[#1A1A1A]">Stocks Bar</h2>
                                <p className="text-[#6C757D] text-sm mt-1">Spiritueux, softs et consommables</p>
                            </div>
                        </div>

                        {/* Stock Alerts */}
                        {lowStockWines > 0 && (
                            <div className="p-4 mb-6 bg-[#FEECEC] rounded-2xl border border-[#FF4D4D]/30 flex items-center gap-4">
                                <AlertCircle className="w-6 h-6 text-[#FF4D4D]" />
                                <div>
                                    <p className="font-bold text-[#FF4D4D]">{lowStockWines} références en stock critique</p>
                                    <p className="text-sm text-[#6C757D]">Passez commande auprès de vos fournisseurs</p>
                                </div>
                                <Button variant="outline" className="ml-auto rounded-xl border-[#FF4D4D] text-[#FF4D4D]">
                                    Voir les alertes
                                </Button>
                            </div>
                        )}

                        {/* Stock Categories */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { name: 'Spiritueux', count: 45, value: 8500, icon: Wine, color: '#722F37' },
                                { name: 'Vins', count: WINE_CELLAR.length, value: totalCellarValue, icon: Grape, color: '#8B0000' },
                                { name: 'Bières', count: 12, value: 450, icon: Beer, color: '#D4A574' },
                                { name: 'Softs', count: 28, value: 320, icon: GlassWater, color: '#4285F4' },
                            ].map((cat, i) => {
                                const Icon = cat.icon;
                                return (
                                    <div key={i} className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                                            style={{ backgroundColor: `${cat.color}15` }}
                                        >
                                            <Icon className="w-6 h-6" style={{ color: cat.color }} />
                                        </div>
                                        <h3 className="font-black text-lg text-[#1A1A1A]">{cat.name}</h3>
                                        <p className="text-sm text-[#6C757D]">{cat.count} références</p>
                                        <p className="text-xl font-black mt-2" style={{ color: cat.color }}>
                                            {cat.value.toLocaleString('fr-FR')} €
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Wine Detail Panel */}
            {selectedWine && (
                <div className="w-96 bg-white border-l border-neutral-100 overflow-auto">
                    <div
                        className="p-6 text-white relative"
                        style={{ backgroundColor: WINE_REGIONS.find(r => r.id === selectedWine.region)?.color || '#722F37' }}
                    >
                        <button
                            onClick={() => setSelectedWine(null)}
                            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg text-white"
                        >
                            ×
                        </button>
                        <Wine className="w-12 h-12 mb-4 text-white/60" />
                        <h3 className="text-xl font-black">{selectedWine.name}</h3>
                        <p className="text-white/60 mt-1">{selectedWine.vintage} • {selectedWine.type}</p>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Rating & Price */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                                <span className="text-2xl font-black">{selectedWine.rating}/100</span>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black text-[#722F37]">{selectedWine.price} €</p>
                                <p className="text-[11px] text-[#ADB5BD]">Coût: {selectedWine.costPrice} €</p>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-4">
                            <div className="p-3 bg-[#F8F9FA] rounded-xl">
                                <p className="text-[10px] font-black text-[#ADB5BD] uppercase">Cépage</p>
                                <p className="font-bold text-[#1A1A1A]">{selectedWine.grape}</p>
                            </div>
                            <div className="p-3 bg-[#F8F9FA] rounded-xl">
                                <p className="text-[10px] font-black text-[#ADB5BD] uppercase">Température de service</p>
                                <p className="font-bold text-[#1A1A1A]">{selectedWine.servingTemp}</p>
                            </div>
                            <div className="p-3 bg-[#F8F9FA] rounded-xl">
                                <p className="text-[10px] font-black text-[#ADB5BD] uppercase">Emplacement</p>
                                <p className="font-bold text-[#1A1A1A]">{selectedWine.location}</p>
                            </div>
                        </div>

                        {/* Pairings */}
                        <div>
                            <p className="text-[10px] font-black text-[#ADB5BD] uppercase mb-3">Accords suggérés</p>
                            <div className="flex flex-wrap gap-2">
                                {selectedWine.pairings.map((pairing: string, i: number) => (
                                    <span key={i} className="px-3 py-1.5 bg-[#722F37]/10 text-[#722F37] rounded-lg text-sm font-bold">
                                        {pairing}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                            <p className="text-sm text-[#1A1A1A]">{selectedWine.notes}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4 border-t border-neutral-100">
                            <Button variant="outline" className="flex-1 h-11 rounded-xl">
                                <Edit3 className="w-4 h-4 mr-2" />
                                Modifier
                            </Button>
                            <Button className="flex-1 h-11 bg-[#722F37] hover:bg-[#5A252C] rounded-xl">
                                <Plus className="w-4 h-4 mr-2" />
                                Commander
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
