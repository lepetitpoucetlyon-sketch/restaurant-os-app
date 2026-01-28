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
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { ProductFormModal } from "@/components/modals/ProductFormModal";

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
            {
                name: 'Signature Martini',
                qty: 2,
                status: 'preparing',
                image: "https://images.unsplash.com/photo-1575023782549-62ca0d244b39?auto=format&fit=crop&w=800&q=80",
                station: "COCKTAIL",
                modifiers: ["Gin Bombay Sapphire", "Extra Dry", "Zeste Citron"],
                details: { glass: "Coupette", method: "Stirred" }
            },
            {
                name: 'Espresso Martini',
                qty: 1,
                status: 'pending',
                image: "https://images.unsplash.com/photo-1629249726332-9cb57b68623b?auto=format&fit=crop&w=800&q=80",
                station: "COCKTAIL",
                notes: "Sans sucre ajouté svp",
                details: { glass: "Coupette", method: "Shaken" }
            },
        ],
        priority: 'normal',
        serverName: "Thomas A."
    },
    {
        id: 'BAR002',
        table: 'T12',
        time: '20:18',
        elapsed: 1,
        items: [
            {
                name: 'Dom Pérignon 2012',
                qty: 1,
                status: 'pending',
                image: "https://images.unsplash.com/photo-1598155523122-38423bb4d6c1?auto=format&fit=crop&w=800&q=80",
                station: "CAVE",
                modifiers: ["Seau à glace", "6 Flûtes"],
                details: { glass: "Flûte", method: "Service" }
            },
        ],
        priority: 'vip',
        serverName: "Alexandre D."
    },
    {
        id: 'BAR003',
        table: 'Bar',
        time: '20:10',
        elapsed: 8,
        items: [
            {
                name: 'French 75',
                qty: 3,
                status: 'preparing',
                image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
                station: "COCKTAIL",
                modifiers: ["Bien frais"],
                details: { glass: "Flûte", method: "Built" }
            },
            {
                name: 'Negroni Sbagliato',
                qty: 2,
                status: 'done',
                image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",
                station: "COCKTAIL",
                details: { glass: "Rocks", method: "Built" }
            },
        ],
        priority: 'rush',
        serverName: "Sarah M."
    },
];

export default function BarPage() {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<BarTab>('kds');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedWine, setSelectedWine] = useState<any>(null);
    const [filterRegion, setFilterRegion] = useState<string | null>(null);
    const [showCocktailModal, setShowCocktailModal] = useState(false);
    const [editingCocktail, setEditingCocktail] = useState<any>(null);

    const filteredWines = WINE_CELLAR.filter(w => {
        if (filterRegion && w.region !== filterRegion) return false;
        if (searchQuery && !w.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const totalCellarValue = WINE_CELLAR.reduce((sum, w) => sum + (w.price * w.stock), 0);
    const lowStockWines = WINE_CELLAR.filter(w => w.stock <= w.minStock).length;

    return (
        <div className="flex h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] -m-4 md:-m-8 bg-bg-primary overflow-hidden pb-20 md:pb-0">
            {/* Left Sidebar */}
            <div className="w-72 bg-bg-secondary border-r border-border flex flex-col p-6">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-black text-text-primary tracking-tight">Bar & Sommellerie</h1>
                        <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mt-1">
                            Cave • Cocktails • Service
                        </p>
                    </div>
                </div>

                <nav className="space-y-2 flex-1">
                    <button
                        onClick={() => setActiveTab('kds')}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all",
                            activeTab === 'kds' ? "bg-accent text-white shadow-lg" : "text-text-muted hover:bg-bg-tertiary"
                        )}
                    >
                        <Clock className="w-5 h-5" />
                        KDS Bar
                    </button>
                    <button
                        onClick={() => setActiveTab('wines')}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all",
                            activeTab === 'wines' ? "bg-accent text-white shadow-lg" : "text-text-muted hover:bg-bg-tertiary"
                        )}
                    >
                        <Wine className="w-5 h-5" />
                        Cave à Vins
                    </button>
                    <button
                        onClick={() => setActiveTab('sommelier')}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all",
                            activeTab === 'sommelier' ? "bg-accent text-white shadow-lg" : "text-text-muted hover:bg-bg-tertiary"
                        )}
                    >
                        <Award className="w-5 h-5" />
                        Sommellerie
                    </button>
                    <button
                        onClick={() => setActiveTab('cocktails')}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all",
                            activeTab === 'cocktails' ? "bg-accent text-white shadow-lg" : "text-text-muted hover:bg-bg-tertiary"
                        )}
                    >
                        <Martini className="w-5 h-5" />
                        Cocktails
                    </button>
                    <button
                        onClick={() => setActiveTab('stocks')}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all",
                            activeTab === 'stocks' ? "bg-accent text-white shadow-lg" : "text-text-muted hover:bg-bg-tertiary"
                        )}
                    >
                        <Package className="w-5 h-5" />
                        Stocks Bar
                    </button>
                </nav>

                {/* Quick Stats */}
                <div className="p-4 bg-gradient-to-br from-accent to-bg-tertiary/20 dark:to-accent/50 rounded-2xl text-white">
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
                                <h2 className="text-2xl font-black text-text-primary">Cave à Vins</h2>
                                <p className="text-text-muted text-sm mt-1">Gérez votre cave et vos références</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-64 h-11 pl-11 pr-4 bg-bg-secondary dark:bg-bg-tertiary border border-border rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                    />
                                </div>
                                <Button className="h-11 bg-accent hover:bg-accent/90 rounded-xl">
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
                                    !filterRegion ? "bg-accent text-white" : "bg-bg-secondary dark:bg-bg-tertiary hover:bg-bg-tertiary text-text-primary"
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
                                        filterRegion === region.id ? "bg-accent text-white" : "bg-bg-secondary dark:bg-bg-tertiary hover:bg-bg-tertiary text-text-primary"
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
                                        className="bg-bg-secondary rounded-2xl p-6 border border-border shadow-sm hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
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
                                                    <h3 className="font-black text-lg text-text-primary">{wine.name}</h3>
                                                    <p className="text-sm text-text-muted">{wine.type} • {region?.name}</p>
                                                </div>
                                                <div className="flex items-center gap-1 px-2 py-1 bg-warning-soft dark:bg-warning/10 rounded-lg">
                                                    <Star className="w-4 h-4 text-warning fill-warning" />
                                                    <span className="font-black text-warning">{wine.rating}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 mb-4 text-sm text-text-muted">
                                                <span className="flex items-center gap-1">
                                                    <Grape className="w-4 h-4" />
                                                    {wine.vintage}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <ThermometerSun className="w-4 h-4" />
                                                    {wine.servingTemp}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-border">
                                                <div>
                                                    <p className="text-2xl font-black text-accent dark:text-text-primary">{wine.price} €</p>
                                                    <p className="text-[10px] text-text-muted">Marge: {(((wine.price - wine.costPrice) / wine.price) * 100).toFixed(0)}%</p>
                                                </div>
                                                <div className={cn(
                                                    "px-3 py-1.5 rounded-lg text-sm font-bold",
                                                    isLowStock ? "bg-error-soft text-error" : "bg-success-soft text-success"
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
                                <h2 className="text-2xl font-black text-text-primary">Sommellerie</h2>
                                <p className="text-text-muted text-sm mt-1">Accords mets-vins et recommandations</p>
                            </div>
                        </div>

                        {/* Pairing Suggestions */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            <div className="bg-bg-secondary rounded-2xl p-6 border border-border shadow-sm">
                                <h3 className="text-lg font-black text-text-primary mb-6 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-accent" />
                                    Accords du Jour
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { dish: 'Filet de Boeuf Rossini', wine: 'Château Margaux 2015', reason: 'La puissance du vin sublime le foie gras' },
                                        { dish: 'Homard Thermidor', wine: 'Dom Pérignon 2012', reason: 'Bulles fines et richesse du homard' },
                                        { dish: 'Pigeon aux Cerises', wine: 'Romanée-Conti 2018', reason: 'Pinot Noir et fruits rouges en harmonie' },
                                    ].map((pairing, i) => (
                                        <div key={i} className="p-4 rounded-xl bg-bg-primary dark:bg-bg-tertiary border border-border">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-bold text-text-primary">{pairing.dish}</span>
                                                <ChevronRight className="w-4 h-4 text-text-muted" />
                                            </div>
                                            <p className="text-accent font-bold text-sm">{pairing.wine}</p>
                                            <p className="text-[12px] text-text-muted mt-1">{pairing.reason}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Wine Knowledge Base */}
                            <div className="bg-bg-secondary rounded-2xl p-6 border border-border shadow-sm">
                                <h3 className="text-lg font-black text-text-primary mb-6 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-accent" />
                                    Fiches Région
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {WINE_REGIONS.slice(0, 4).map((region) => (
                                        <div
                                            key={region.id}
                                            className="p-4 rounded-xl border border-border hover:shadow-md transition-all cursor-pointer"
                                        >
                                            <div
                                                className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center"
                                                style={{ backgroundColor: `${region.color}20` }}
                                            >
                                                <MapPin className="w-5 h-5" style={{ color: region.color }} />
                                            </div>
                                            <h4 className="font-bold text-text-primary">{region.name}</h4>
                                            <p className="text-sm text-text-muted">{region.country}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Temperature Guide */}
                        <div className="bg-gradient-to-br from-accent to-bg-tertiary/20 dark:to-accent/50 rounded-2xl p-6 text-white">
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
                                <h2 className="text-2xl font-black text-text-primary">Carte des Cocktails</h2>
                                <p className="text-text-muted text-sm mt-1">Recettes et fiches techniques bar</p>
                            </div>
                            <Button
                                onClick={() => {
                                    setEditingCocktail(null);
                                    setShowCocktailModal(true);
                                }}
                                className="h-11 bg-accent hover:bg-accent/90 rounded-xl"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Nouveau Cocktail
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {COCKTAILS.map((cocktail) => (
                                <div
                                    key={cocktail.id}
                                    className="bg-bg-secondary rounded-2xl p-6 border border-border shadow-sm hover:shadow-lg transition-all relative"
                                >
                                    {cocktail.isSignature && (
                                        <div className="absolute top-4 right-4 px-2 py-1 bg-warning-soft dark:bg-warning/10 text-warning text-[10px] font-black rounded-md flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-warning" />
                                            SIGNATURE
                                        </div>
                                    )}

                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center mb-4">
                                        <Martini className="w-8 h-8 text-white" />
                                    </div>

                                    <h3 className="font-black text-xl text-text-primary">{cocktail.name}</h3>
                                    <p className="text-sm text-text-muted mb-4">{cocktail.category}</p>

                                    <div className="space-y-2 mb-4">
                                        <p className="text-[11px] font-black text-text-muted uppercase">Ingrédients</p>
                                        <div className="flex flex-wrap gap-1">
                                            {cocktail.ingredients.map((ing, i) => (
                                                <span key={i} className="px-2 py-1 bg-bg-primary dark:bg-bg-tertiary rounded-md text-[11px] font-bold text-text-muted">
                                                    {ing}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-border/30">
                                        <div>
                                            <p className="text-2xl font-black text-[#722F37] dark:text-text-primary">{cocktail.price} €</p>
                                            <p className="text-[10px] text-success font-bold">
                                                Marge: {(((cocktail.price - cocktail.costPrice) / cocktail.price) * 100).toFixed(0)}%
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm">
                                            <TrendingUp className="w-4 h-4 text-success" />
                                            <span className="font-bold text-text-muted">{cocktail.popularity}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* KDS Bar Tab - Redesigned */}
                {activeTab === 'kds' && (
                    <div className="animate-in fade-in duration-500 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-text-primary">KDS Bar</h2>
                                <p className="text-text-muted text-sm mt-1">File de production boissons</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-xl">
                                    <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
                                    <span className="font-bold text-accent uppercase tracking-wider text-xs">Service en cours</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pb-20 pr-2">
                            {BAR_ORDERS.map((ticket) => {
                                const isUrgent = ticket.priority === 'rush';
                                const isVip = ticket.priority === 'vip';

                                return (
                                    <motion.div
                                        key={ticket.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "flex flex-col rounded-[2rem] overflow-hidden border transition-all duration-300 relative group",
                                            "bg-bg-secondary border-border shadow-2xl"
                                        )}
                                    >
                                        {/* Ticket Header */}
                                        <div className={cn(
                                            "flex flex-col gap-4 p-6 border-b border-border transition-colors duration-500 relative bg-bg-tertiary",
                                            isUrgent ? "bg-error-soft" : isVip ? "bg-purple-900/10" : ""
                                        )}>
                                            <div className="flex justify-between items-start">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="font-serif font-black tracking-tighter italic text-text-primary leading-none text-3xl">
                                                            {ticket.table}
                                                        </h3>
                                                        {isUrgent && <span className="relative flex h-3 w-3">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4D4D] opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF4D4D]"></span>
                                                        </span>}
                                                    </div>
                                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mt-2 flex items-center gap-2">
                                                        <Users className="w-3 h-3" />
                                                        {ticket.serverName}
                                                    </span>
                                                </div>

                                                <div className={cn(
                                                    "px-3 py-1.5 rounded-lg font-mono text-sm font-black border transition-all flex items-center gap-2",
                                                    isUrgent ? "bg-error text-white border-error shadow-lg shadow-error/20 animate-pulse" :
                                                        isVip ? "bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-lg shadow-[#8B5CF6]/20" :
                                                            "bg-bg-secondary text-text-primary border-border"
                                                )}>
                                                    <Clock className={cn("w-3.5 h-3.5", isUrgent && "animate-spin-slow")} />
                                                    {ticket.elapsed}'
                                                </div>
                                            </div>
                                        </div>

                                        {/* Ticket Items */}
                                        <div className="flex-1 flex flex-col gap-6 p-6">
                                            {ticket.items.map((item, i) => (
                                                <div key={i} className="group/item relative flex flex-col overflow-hidden rounded-[20px] bg-bg-primary border border-border hover:border-accent/50 shadow-lg transition-all duration-300">
                                                    {/* Top Image Section */}
                                                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                                                        {item.image ? (
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-105 opacity-90 group-hover/item:opacity-100"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-bg-tertiary">
                                                                <Martini className="w-10 h-10 opacity-30 text-text-muted" />
                                                            </div>
                                                        )}

                                                        {/* Quantity Badge */}
                                                        <div className="absolute top-3 right-3 w-10 h-10 rounded-xl bg-accent-gold text-bg-primary flex items-center justify-center font-mono font-black text-lg shadow-lg z-10">
                                                            {item.qty}
                                                        </div>

                                                        {/* Station Tag */}
                                                        <div className={cn(
                                                            "absolute top-3 left-3 px-2 py-1 rounded-lg backdrop-blur-md border border-white/10 font-bold uppercase text-[9px] tracking-widest text-white shadow-lg",
                                                            item.station === 'COCKTAIL' ? "bg-purple-500/80" : "bg-accent/90"
                                                        )}>
                                                            {item.station}
                                                        </div>
                                                    </div>

                                                    {/* Bottom Content */}
                                                    <div className="p-4 flex flex-col gap-2 relative bg-bg-primary dark:bg-bg-tertiary">
                                                        <h4 className="font-serif font-medium tracking-tight text-text-primary leading-none text-xl">
                                                            {item.name}
                                                        </h4>

                                                        {/* Modifiers & Details */}
                                                        {item.modifiers && item.modifiers.length > 0 && (
                                                            <div className="mt-3 flex flex-col gap-1.5 pl-1.5 border-l-2 border-border/20">
                                                                {item.modifiers.map((mod, m) => (
                                                                    <span key={m} className="text-[13px] font-medium text-text-primary/90">{mod}</span>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {/* Notes */}
                                                        {(item as any).notes && (
                                                            <div className="mt-2 p-2 rounded-lg bg-error-soft border border-error/20 flex items-start gap-2">
                                                                <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
                                                                <span className="text-xs font-bold text-error">{(item as any).notes}</span>
                                                            </div>
                                                        )}

                                                        {/* Tech Specs Footer */}
                                                        <div className="mt-3 pt-3 border-t border-border/20 flex items-center justify-between">
                                                            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                                                                {item.details && (
                                                                    <>
                                                                        <span className="flex items-center gap-1.5">
                                                                            <Wine className="w-3.5 h-3.5 text-text-muted" />
                                                                            {item.details.glass}
                                                                        </span>
                                                                        <span className="w-px h-3 bg-border" />
                                                                        <span className="flex items-center gap-1.5">
                                                                            <Sparkles className="w-3.5 h-3.5 text-text-muted" />
                                                                            {item.details.method}
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                            <span className={cn(
                                                                "text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded",
                                                                item.status === 'preparing' ? "bg-amber-500/10 text-amber-500" :
                                                                    item.status === 'done' ? "bg-accent/10 text-accent" :
                                                                        "bg-bg-tertiary text-text-muted"
                                                            )}>
                                                                {item.status === 'preparing' ? 'EN COURS' : item.status === 'done' ? 'TERMINÉ' : 'ATTENTE'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Action Footer */}
                                        <div className="p-6 pt-0 mt-auto">
                                            <div className="h-px w-full bg-border mb-4" />
                                            <button
                                                className="w-full h-14 rounded-xl font-black uppercase tracking-[0.2em] text-xs transition-all bg-bg-primary text-text-primary hover:bg-accent hover:text-white active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 border border-border"
                                                onClick={() => showToast(`Commande ${ticket.table} terminée`, "success")}
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                                Terminer
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Stocks Tab */}
                {activeTab === 'stocks' && (
                    <div className="animate-in fade-in duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-text-primary">Stocks Bar</h2>
                                <p className="text-text-muted text-sm mt-1">Spiritueux, softs et consommables</p>
                            </div>
                        </div>

                        {/* Stock Alerts */}
                        {lowStockWines > 0 && (
                            <div className="p-4 mb-6 bg-red-500/10 rounded-2xl border border-[#FF4D4D]/30 flex items-center gap-4">
                                <AlertCircle className="w-6 h-6 text-[#FF4D4D]" />
                                <div>
                                    <p className="font-bold text-[#FF4D4D]">{lowStockWines} références en stock critique</p>
                                    <p className="text-sm text-text-muted">Passez commande auprès de vos fournisseurs</p>
                                </div>
                                <Button variant="outline" className="ml-auto rounded-xl border-[#FF4D4D] text-[#FF4D4D] hover:bg-[#FF4D4D]/10 transition-colors">
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
                                    <div key={i} className="bg-white dark:bg-bg-secondary rounded-2xl p-6 border border-neutral-100 dark:border-border shadow-sm">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                                            style={{ backgroundColor: `${cat.color}15` }}
                                        >
                                            <Icon className="w-6 h-6" style={{ color: cat.color }} />
                                        </div>
                                        <h3 className="font-black text-lg text-text-primary">{cat.name}</h3>
                                        <p className="text-sm text-text-muted">{cat.count} références</p>
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
                <div className="w-96 bg-white dark:bg-bg-secondary border-l border-neutral-100 dark:border-border overflow-auto">
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
                                <p className="text-2xl font-black text-[#722F37] dark:text-text-primary">{selectedWine.price} €</p>
                                <p className="text-[11px] text-text-muted">Coût: {selectedWine.costPrice} €</p>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-4">
                            <div className="p-3 bg-bg-primary dark:bg-bg-tertiary rounded-xl">
                                <p className="text-[10px] font-black text-text-muted uppercase">Cépage</p>
                                <p className="font-bold text-text-primary">{selectedWine.grape}</p>
                            </div>
                            <div className="p-3 bg-bg-primary dark:bg-bg-tertiary rounded-xl">
                                <p className="text-[10px] font-black text-text-muted uppercase">Température de service</p>
                                <p className="font-bold text-text-primary">{selectedWine.servingTemp}</p>
                            </div>
                            <div className="p-3 bg-bg-primary dark:bg-bg-tertiary rounded-xl">
                                <p className="text-[10px] font-black text-text-muted uppercase">Emplacement</p>
                                <p className="font-bold text-text-primary">{selectedWine.location}</p>
                            </div>
                        </div>

                        {/* Pairings */}
                        <div>
                            <p className="text-[10px] font-black text-text-muted uppercase mb-3">Accords suggérés</p>
                            <div className="flex flex-wrap gap-2">
                                {selectedWine.pairings.map((pairing: string, i: number) => (
                                    <span key={i} className="px-3 py-1.5 bg-[#722F37]/10 text-[#722F37] rounded-lg text-sm font-bold">
                                        {pairing}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="p-4 bg-amber-50 dark:bg-amber-500/10 rounded-xl border border-amber-100 dark:border-amber-500/30">
                            <p className="text-sm text-text-primary">{selectedWine.notes}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4 border-t border-neutral-100 dark:border-border">
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

            {/* Cocktail Form Modal */}
            <ProductFormModal
                isOpen={showCocktailModal}
                onClose={() => {
                    setShowCocktailModal(false);
                    setEditingCocktail(null);
                }}
                productType="cocktail"
                editProduct={editingCocktail}
            />
        </div>
    );
}
