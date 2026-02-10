"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { CheckCircle2, Flame, ChefHat, Clock, AlertTriangle, ArrowRight, Snowflake, Beer, ThermometerSun, Volume2, VolumeX, Zap, LayoutGrid, List, Sparkles, Activity, Search, Filter, Bell, Utensils, ChevronDown, Table as TableIcon, MessageSquare, Book as BookIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useOrders } from "@/context/OrdersContext";
import { useUI } from "@/context/UIContext";
import { motion, AnimatePresence } from "framer-motion";
import { ModificationAlertsPanel } from "@/components/kds/ModificationAlerts";
import { usePageSetting } from "@/components/settings/ContextualSettings";
import { PRODUCTS } from "@/lib/mock-data";
import { RecipeDetailDialog } from "@/components/kitchen/RecipeDetailDialog";
import { useRecipes } from "@/context/RecipeContext"; // Import context if needed for real data

// Station types for Kitchen Display filtering
type KitchenStation = 'all' | 'cold' | 'hot' | 'bar';

// Item to Station mapping (in real app, this would be in product data)
const ITEM_STATION_MAP: Record<string, KitchenStation> = {
    'Tartare de Bœuf': 'cold',
    'Saumon Gravlax': 'cold',
    'Salade César': 'cold',
    'Huîtres': 'cold',
    'Carpaccio': 'cold',
    'Filet de Bœuf Wellington': 'hot',
    'Homard Thermidor': 'hot',
    'Risotto': 'hot',
    'Magret de Canard': 'hot',
    'Sole Meunière': 'hot',
    'Entrecôte Grillée': 'hot',
    'Cocktail Signature': 'bar',
    'Champagne': 'bar',
    'Vin Rouge': 'bar',
    'Café Gourmand': 'bar',
    'Espresso': 'bar',
};

const STATION_CONFIG = {
    all: { label: 'TOUS', icon: Utensils, activeBg: 'bg-text-primary', activeText: 'text-bg-primary', iconColor: 'text-text-primary' },
    cold: { label: 'FROID', icon: Snowflake, activeBg: 'bg-info', activeText: 'text-white', iconColor: 'text-info' },
    hot: { label: 'CHAUD', icon: Flame, activeBg: 'bg-error', activeText: 'text-white', iconColor: 'text-error' },
    bar: { label: 'BAR', icon: Beer, activeBg: 'bg-warning', activeText: 'text-white', iconColor: 'text-warning' },
};

export default function KDSPage() {
    const { orders, updateOrderStatus, getPendingModifications } = useOrders();
    const { theme } = useUI();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activeStation, setActiveStation] = useState<KitchenStation>('all');
    const [rushMode, setRushMode] = useState(false);
    const [viewMode, setViewMode] = useState<'tickets' | 'consolidated'>('tickets');
    const [searchQuery, setSearchQuery] = useState("");
    const [showModificationAlerts, setShowModificationAlerts] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState<any>(null); // State for Recipe Dialog

    // Read columns setting from context (defaults to 3)
    const columnsFromSettings = usePageSetting('kds', 'columns', 3);
    const [gridColumns, setGridColumns] = useState(columnsFromSettings);

    // Sync local state when settings change
    useEffect(() => {
        setGridColumns(columnsFromSettings);
    }, [columnsFromSettings]);

    // ... rest of the component


    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [isGridDropdownOpen, setIsGridDropdownOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const gridDropdownRef = useRef<HTMLDivElement>(null);

    const pendingModificationsCount = getPendingModifications().length;


    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchExpanded(false);
            }
            if (gridDropdownRef.current && !gridDropdownRef.current.contains(event.target as Node)) {
                setIsGridDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);



    const [lastOrderCount, setLastOrderCount] = useState(orders.length);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize audio with a base64 chime to ensure it works without external files
    useEffect(() => {
        // Simple "Glass Ping" sound
        const audioSrc = "data:audio/mp3;base64,SUQzBAAAAAABAFRYWFgAAAASAAADbWFqb3JfYnJhbmQAZGFzaABUWFhYAAAAEQAAA21pbm9yX3ZlcnNpb24AMABUWFhYAAAAHAAAA2NvbXBhdGlibGVfYnJhbmRzAGlzbzZtcDQxAFRTU0UAAAAPAAADTGF2ZjU5LjI3LjEwMAAAAAAAAAAAAAAA//uQZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWgAAAA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZAAABH5o1UAAADIEI6qQAAAGkCQNVAACAAEA0CgIEXFx8AAAMAAAAAAAABbAAAAAAAAA/wD+AAAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
        // Note: The above is a placeholder. For a real rich sound, we'd need a larger file. 
        // Let's use a hosted URL for the demo or a better base64 if possible.
        // Actually, let's use a high-quality hosted sound for the "Premium" feel if we can't reliably embed a large base64.
        // Fallback to a reliable fast CDN for a standard kitchen beep.
        audioRef.current = new Audio('https://cdn.freesound.org/previews/536/536108_1415754-lq.mp3');
        audioRef.current.volume = 0.5;
    }, []);

    // Play sound on new order
    useEffect(() => {
        if (orders.length > lastOrderCount) {
            // New order arrived - play notification sound
            // Audio may fail silently on some browsers (autoplay policy)
            audioRef.current?.play().catch(() => { /* Autoplay blocked - expected */ });
        }
        setLastOrderCount(orders.length);
    }, [orders.length, lastOrderCount]);

    // Filter orders based on station (check if any item matches the selected station)
    const filteredOrders = useMemo(() => {
        const activeOrders = orders.filter(o => o.status !== 'delivered');
        let result = activeOrders;

        if (activeStation !== 'all') {
            result = result.filter(order =>
                order.items.some(item => (ITEM_STATION_MAP[item.name] || 'hot') === activeStation)
            ).map(order => ({
                ...order,
                items: order.items.filter(item => (ITEM_STATION_MAP[item.name] || 'hot') === activeStation)
            }));
        }

        if (searchQuery) {
            result = result.filter(o =>
                o.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                o.serverName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Custom Sorting: 
        // 1. Status Priority: 'new' & 'preparing' (Active) go FIRST. 'ready' (Done/Waiting pickup) goes LAST.
        // 2. Time Priority: Oldest first within groups.
        return result.sort((a, b) => {
            const isAReady = a.status === 'ready';
            const isBReady = b.status === 'ready';

            if (isAReady && !isBReady) return 1; // A is ready -> go to end
            if (!isAReady && isBReady) return -1; // B is ready -> A stays first

            // Determine effective time: Use timestamp. 
            // If they have same status priority, sort by time (Ascending = Oldest First)
            return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        });
    }, [orders, activeStation, searchQuery]);

    const preparingOrders = orders.filter(o => o.status === 'preparing' || o.status === 'new');
    const readyOrders = orders.filter(o => o.status === 'ready');

    return (
        <div className={cn(
            "h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] -m-4 md:-m-8 flex flex-col overflow-hidden animate-fade-in transition-all duration-700",
            "bg-bg-primary text-text-primary",
            rushMode && "bg-error/5"
        )}>
            {/* Rush Mode Atmospheric Overlay */}
            <AnimatePresence>
                {rushMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-error/5 to-transparent animate-pulse"
                    />
                )}
            </AnimatePresence>
            <div className="relative z-20 w-full border-b border-border/50 bg-bg-primary/60 backdrop-blur-xl shrink-0">
                <div className="w-full overflow-x-auto md:overflow-visible no-scrollbar py-6 px-4 md:px-8">
                    <div className="min-w-max mx-auto flex items-center justify-center">
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="relative z-50 flex items-center gap-1.5 bg-white/80 backdrop-blur-2xl border border-white/20 rounded-full p-2 shadow-2xl ring-1 ring-black/5"
                        >

                            {/* 1. Station Filters Group */}
                            {/* 1. Station Filters Group (Motion Design) */}
                            <div className="flex items-center p-1.5 bg-neutral-100/50 rounded-full border border-black/5 shadow-inner relative group/filters">
                                {(Object.keys(STATION_CONFIG) as KitchenStation[]).map(station => {
                                    const config = STATION_CONFIG[station];
                                    const Icon = config.icon;
                                    const isActive = activeStation === station;

                                    return (
                                        <button
                                            key={station}
                                            onClick={() => setActiveStation(station)}
                                            className={cn(
                                                "relative flex items-center gap-2.5 px-6 h-11 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 z-10",
                                                isActive
                                                    ? config.activeText
                                                    : "text-neutral-500 hover:text-black"
                                            )}
                                        >
                                            {/* Active Moving Background Pill */}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeFilterPill"
                                                    className={cn(
                                                        "absolute inset-0 rounded-full z-[-1] shadow-lg",
                                                        config.activeBg
                                                    )}
                                                    initial={false}
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 300,
                                                        damping: 30
                                                    }}
                                                />
                                            )}

                                            <Icon className={cn("w-3.5 h-3.5 z-10", isActive ? "text-inherit" : config.iconColor)} strokeWidth={2.5} />
                                            <span className="relative z-10">{config.label}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="w-px h-8 bg-neutral-200 mx-2" />

                            {/* 2. Status Badge Group */}
                            <div className="flex items-center gap-3 px-6 h-12 rounded-full bg-neutral-100/50 border border-black/5">
                                <div className="w-2.5 h-2.5 rounded-full bg-accent-gold animate-pulse shadow-[0_0_12px_rgba(212,175,55,0.6)]" />
                                <div className="flex items-center gap-2.5">
                                    <span className="text-[12px] font-black text-accent-gold nums-proportional">
                                        {preparingOrders.length}<span className="text-neutral-300 mx-1">/</span>{orders.length}
                                    </span>
                                    <TableIcon className="w-4 h-4 text-neutral-400" strokeWidth={2} />
                                </div>
                            </div>

                            <div className="w-px h-8 bg-neutral-200 mx-2" />

                            {/* 3. Search Group */}
                            <div ref={searchRef} className="relative flex items-center">
                                <AnimatePresence mode="wait">
                                    {isSearchExpanded ? (
                                        <motion.div
                                            initial={{ width: 0, opacity: 0 }}
                                            animate={{ width: 260, opacity: 1 }}
                                            exit={{ width: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="relative mx-2">
                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-gold" strokeWidth={2.5} />
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    placeholder="RECHERCHER..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="w-full h-12 bg-neutral-100 border border-transparent focus:border-accent-gold/50 rounded-full pl-10 pr-4 text-[11px] font-bold uppercase tracking-wider focus:outline-none focus:ring-4 focus:ring-accent-gold/10 transition-all placeholder:text-neutral-400"
                                                />
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setIsSearchExpanded(true)}
                                            className="w-12 h-12 flex items-center justify-center rounded-full text-neutral-400 hover:text-accent-gold hover:bg-neutral-100 transition-colors"
                                        >
                                            <Search className="w-5 h-5" strokeWidth={2} />
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="w-px h-8 bg-neutral-200 mx-2" />

                            {/* 4. Grid Selector with fixed Z-Index */}
                            <div ref={gridDropdownRef} className="relative z-[100]">
                                <button
                                    onClick={() => setIsGridDropdownOpen(!isGridDropdownOpen)}
                                    className={cn(
                                        "flex items-center gap-2.5 px-5 h-12 rounded-full font-bold text-[12px] transition-all border",
                                        isGridDropdownOpen
                                            ? "bg-neutral-900 text-white border-transparent shadow-lg"
                                            : "bg-transparent border-transparent hover:bg-neutral-100 text-neutral-600"
                                    )}
                                >
                                    <LayoutGrid className="w-4 h-4" strokeWidth={2} />
                                    <span>{gridColumns}</span>
                                </button>

                                <AnimatePresence>
                                    {isGridDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 4, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 p-1.5 w-16 bg-white border border-neutral-200 rounded-2xl shadow-xl flex flex-col gap-1 items-center overflow-hidden z-[101]"
                                        >
                                            {[3, 4, 5, 6].map(num => (
                                                <button
                                                    key={num}
                                                    onClick={() => {
                                                        setGridColumns(num);
                                                        setIsGridDropdownOpen(false);
                                                    }}
                                                    className={cn(
                                                        "w-full h-8 rounded-xl flex items-center justify-center text-[11px] font-bold transition-all",
                                                        gridColumns === num
                                                            ? "bg-accent-gold text-white"
                                                            : "text-neutral-500 hover:bg-neutral-100"
                                                    )}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="w-px h-10 bg-neutral-200 mx-4" />

                            {/* 5. Production Info Group */}
                            <div className="flex items-center gap-4 pr-1 relative z-10">
                                {/* Time */}
                                <div className="flex flex-col items-center min-w-[80px]">
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-accent-gold mb-0.5">TIME</span>
                                    <span className="font-variant-numeric text-xl font-medium tracking-tight text-neutral-900 leading-none">
                                        {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>

                                {/* Rush Toggle */}
                                <button
                                    onClick={() => setRushMode(!rushMode)}
                                    className={cn(
                                        "flex items-center gap-3 px-6 h-12 rounded-full font-black text-[10px] uppercase tracking-[0.25em] transition-all border duration-300",
                                        rushMode
                                            ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20"
                                            : "bg-white border-neutral-200 text-neutral-400 hover:text-accent-gold hover:border-accent-gold/50"
                                    )}
                                >
                                    <Zap className={cn("w-3.5 h-3.5", rushMode ? "fill-white" : "text-current")} strokeWidth={2} />
                                    {rushMode ? 'RUSH' : 'NORMAL'}
                                </button>

                                {/* Notifications */}
                                <div className="relative pl-2 pr-1">
                                    <button
                                        onClick={() => setShowModificationAlerts(true)}
                                        className={cn(
                                            "relative w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 group hover:scale-110 active:scale-95",
                                            pendingModificationsCount > 0
                                                ? "bg-amber-100 text-amber-600 ring-2 ring-amber-500/20"
                                                : "bg-neutral-100 text-neutral-400 hover:bg-neutral-200"
                                        )}
                                    >
                                        <Bell className={cn("w-5 h-5 transition-transform group-hover:rotate-12", pendingModificationsCount > 0 && "animate-pulse")} strokeWidth={2} />
                                        {pendingModificationsCount > 0 && (
                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm transform group-hover:scale-110 transition-transform">
                                                {pendingModificationsCount}
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Production Display Area */}
            <div className="flex-1 p-4 md:p-10 overflow-auto relative custom-scrollbar transition-colors duration-500 bg-bg-primary">
                {/* Immersive Background Decor */}
                <div className="absolute top-[10%] left-[5%] w-[60%] h-[60%] blur-[250px] pointer-events-none rounded-full bg-success-soft/30 transition-colors" />
                <div className="absolute bottom-[10%] right-[5%] w-[50%] h-[50%] blur-[200px] pointer-events-none rounded-full bg-blue-500/5 transition-colors" />

                <AnimatePresence mode="popLayout">
                    {filteredOrders.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col items-center justify-center h-full relative z-10 py-20"
                        >
                            <div className="relative mb-12">
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border border-border bg-bg-tertiary/20 flex items-center justify-center shadow-inner relative z-10 backdrop-blur-sm transition-all duration-500">
                                    <ChefHat strokeWidth={0.5} className="w-16 h-16 md:w-20 md:h-20 text-text-muted/30" />
                                </div>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 border border-dashed rounded-full border-text-muted/10"
                                />
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                                    className="absolute -inset-6 border border-dotted rounded-full border-text-muted/5"
                                />
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="absolute -inset-12 bg-success-soft/50 blur-3xl rounded-full"
                                />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-serif italic tracking-tighter text-text-muted transition-colors">Cuisine en stase</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] mt-8 px-10 py-3 rounded-full border border-border bg-bg-tertiary text-text-muted/50 shadow-inner">
                                Le flux de production est actuellement vide
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            layout
                            className="grid gap-6 md:gap-10 relative z-10"
                            style={{
                                gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`
                            }}
                        >
                            {filteredOrders.map(ticket => {
                                const elapsedMinutes = Math.floor((new Date().getTime() - new Date(ticket.timestamp).getTime()) / 60000);
                                const isReady = ticket.status === 'ready';
                                const isUrgent = !isReady && elapsedMinutes >= 15;
                                const isWarning = !isReady && elapsedMinutes >= 8 && elapsedMinutes < 15;

                                return (
                                    <motion.div
                                        key={ticket.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.25 } }}
                                        className={cn(
                                            "group flex flex-col rounded-[24px] md:rounded-[32px] overflow-hidden border transition-all duration-700 h-fit",
                                            // Enhanced Card Background for Light Mode
                                            "bg-white",
                                            gridColumns >= 5 ? "scale-[0.98]" : "",
                                            isReady
                                                ? "border-neutral-200 bg-neutral-50/50 grayscale-[0.5]"
                                                : isUrgent
                                                    ? "border-error/40 shadow-[0_20px_60px_-15px_rgba(239,68,68,0.25)] ring-1 ring-error/20"
                                                    : isWarning
                                                        ? "border-warning/30 shadow-[0_20px_60px_-15px_rgba(245,158,11,0.20)]"
                                                        : "border border-black shadow-2xl shadow-neutral-200/50 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] hover:border-accent-gold/40"
                                        )}
                                    >
                                        <div className={cn(
                                            "flex flex-col gap-3 p-5 md:p-6 border-b transition-all duration-700 relative overflow-hidden",
                                            "bg-neutral-50 border-border/50"
                                        )}>
                                            {/* Luxury Gradient Accent */}
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-gold/40 to-transparent" />

                                            <div className="relative z-10 flex flex-col gap-3">
                                                {/* Row 1: Table Number (Full Width) */}
                                                <div className="flex items-center justify-between w-full min-h-[40px]">
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <h3 className={cn(
                                                            "font-serif font-medium tracking-tight italic text-black leading-none truncate drop-shadow-sm translate-y-0.5",
                                                            gridColumns >= 5 ? "text-2xl" : "text-3xl lg:text-4xl"
                                                        )} title={`Table ${ticket.tableNumber}`}>
                                                            Table <span className="text-accent-gold not-italic font-bold">{ticket.tableNumber}.</span>
                                                        </h3>
                                                        {(isUrgent || rushMode) && (
                                                            <div className="flex gap-1 shrink-0 self-center mt-1">
                                                                <span className="relative flex h-2.5 w-2.5">
                                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                                                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-error"></span>
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Row 2: Timer & Chef (Strict Alignment) */}
                                                <div className="flex items-center justify-between w-full gap-2 h-8">
                                                    {/* Timer Pill */}
                                                    <div className={cn(
                                                        "h-full px-3 rounded-lg font-mono border transition-all duration-500 flex items-center gap-2 shadow-sm shrink-0 whitespace-nowrap",
                                                        isUrgent || (rushMode && elapsedMinutes > 5)
                                                            ? "bg-error text-white border-error shadow-error/20"
                                                            : isWarning
                                                                ? "bg-warning text-white border-warning shadow-warning/20"
                                                                : "bg-white text-black border-neutral-200"
                                                    )}>
                                                        <Clock className={cn("w-3.5 h-3.5", (isUrgent || rushMode) && "animate-spin-slow")} strokeWidth={2.5} />
                                                        <span className="text-xs font-black pt-0.5">
                                                            {elapsedMinutes}<span className="text-[9px] opacity-70 ml-0.5 font-normal">MIN</span>
                                                        </span>
                                                    </div>

                                                    {/* Chef Info */}
                                                    <div className="flex items-center gap-3 min-w-0 justify-end h-full">
                                                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-neutral-600 truncate text-right leading-none pt-0.5">
                                                            {ticket.serverName}
                                                        </span>
                                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-neutral-200 shrink-0 shadow-sm">
                                                            <ChefHat className="w-4 h-4 text-neutral-700" strokeWidth={2} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Ticket Items */}
                                        <div className={cn(
                                            "flex-1 flex flex-col gap-6",
                                            gridColumns >= 5 ? "p-4 md:p-5" : "p-5 md:p-7"
                                        )}>
                                            {ticket.items.flatMap(item => {
                                                // SPLIT LOGIC: If item has modifiers or notes, split into individual cards to ensure critical attention
                                                if (((item.modifiers?.length ?? 0) > 0 || item.notes) && item.quantity > 1) {
                                                    return Array(item.quantity).fill(null).map(() => ({ ...item, quantity: 1 }));
                                                }
                                                return [item];
                                            }).map((item, i) => {
                                                const itemStation = ITEM_STATION_MAP[item.name] || 'hot';
                                                const product = PRODUCTS.find(p => p.name.includes(item.name) || item.name.includes(p.name));
                                                const imageUrl = product?.image;

                                                const isDrink = itemStation === 'bar';
                                                const isCold = itemStation === 'cold';
                                                const hasMods = (item.modifiers && item.modifiers.length > 0) || item.notes;

                                                const badgeColor = isDrink
                                                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                                                    : isCold
                                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                                        : "bg-red-600 text-white shadow-lg shadow-red-700/20";

                                                const stationLabel = isDrink ? "COCKTAIL" : isCold ? "FROID" : "CHAUD";

                                                return (
                                                    <div key={i} className={cn(
                                                        "group relative bg-white rounded-[20px] overflow-hidden border shadow-sm hover:shadow-md transition-all duration-500",
                                                        hasMods
                                                            ? "border-amber-500 ring-2 ring-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-pulse-slow"
                                                            : "border-neutral-200"
                                                    )}>
                                                        <div className="relative h-24 w-full overflow-hidden">
                                                            <div className="absolute inset-0 bg-neutral-100" />
                                                            {imageUrl && (
                                                                <img
                                                                    src={imageUrl}
                                                                    alt={item.name}
                                                                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                                                />
                                                            )}
                                                            {/* Darker gradient for text legibility if we were to put text over image, but we aren't. Keeping subtle gradient for gloss. */}
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-40" />

                                                            <div className={cn(
                                                                "absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 shadow-md",
                                                                badgeColor
                                                            )}>
                                                                {stationLabel}
                                                            </div>

                                                            {/* Recipe Card Button */}
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    const fullRecipe = product || {
                                                                        name: item.name,
                                                                        imageUrl: imageUrl,
                                                                        description: "Recette standard",
                                                                        ingredients: [],
                                                                        steps: []
                                                                    };
                                                                    setSelectedRecipe(fullRecipe);
                                                                }}
                                                                className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-all group-hover:scale-110 z-20 shadow-lg"
                                                                title="Fiche Technique"
                                                            >
                                                                <BookIcon className="w-4 h-4" />
                                                            </button>

                                                            {item.quantity > 1 && (
                                                                <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-lg border border-white/20">
                                                                    X {item.quantity}
                                                                </div>
                                                            )}

                                                            {/* Modification Warning for Quantity 1 (Split items) */}
                                                            {hasMods && item.quantity === 1 && (
                                                                <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-amber-500 text-white flex items-center justify-center gap-1 text-[10px] font-black shadow-lg border border-white/20 animate-bounce">
                                                                    <AlertTriangle className="w-3 h-3 fill-current text-white" />
                                                                    MODIF
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="p-4 relative">
                                                            <div className="flex justify-between items-start gap-2 mb-2">
                                                                <h4 className="font-serif text-lg font-bold text-black leading-tight">
                                                                    {item.name}
                                                                </h4>
                                                            </div>

                                                            {item.modifiers && item.modifiers.length > 0 ? (
                                                                <div className="flex flex-col gap-1.5 mt-2">
                                                                    {item.modifiers.map((m, mi) => (
                                                                        <span key={mi} className="text-xs font-bold text-amber-600 flex items-start gap-2">
                                                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0 animate-pulse" />
                                                                            {m}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mt-1">Recette standard</p>
                                                            )}

                                                            {item.notes && (
                                                                <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold leading-tight flex items-start gap-2 animate-pulse">
                                                                    <MessageSquare className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-70" />
                                                                    <span>"{item.notes}"</span>
                                                                </div>
                                                            )}

                                                            <div className="mt-4 pt-3 border-t border-dashed border-neutral-200 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-neutral-500">
                                                                <div className="flex items-center gap-1.5">
                                                                    <Clock className="w-3 h-3" />
                                                                    <span>15 MIN</span>
                                                                </div>
                                                                <span>{item.modifiers?.length || 0} OPT.</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Action Footer */}
                                        <div className="p-6 pt-0 mt-auto">
                                            <div className="h-px w-full bg-neutral-100 mb-6" />
                                            <AnimatePresence mode="wait">
                                                {ticket.status === "ready" ? (
                                                    <motion.button
                                                        key="delivered"
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="w-full h-16 rounded-[20px] font-black uppercase tracking-[0.3em] text-[11px] transition-all border border-neutral-200 bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:border-neutral-300 flex items-center justify-center gap-4 active:scale-[0.98] shadow-sm group"
                                                        onClick={() => updateOrderStatus(ticket.id, 'delivered')}
                                                    >
                                                        <CheckCircle2 className="w-5 h-5 group-hover:text-emerald-500 transition-colors" strokeWidth={2.5} />
                                                        TERMINER
                                                    </motion.button>
                                                ) : (
                                                    <motion.div key="progress" className="flex gap-4">
                                                        {ticket.status === "new" ? (
                                                            <button
                                                                className="w-full h-16 rounded-[20px] font-black uppercase tracking-[0.3em] text-[11px] transition-all bg-neutral-100 text-gray-900 hover:bg-neutral-200 active:scale-[0.98] shadow-premium flex items-center justify-center gap-3"
                                                                onClick={() => updateOrderStatus(ticket.id, 'preparing')}
                                                            >
                                                                <Flame className="w-5 h-5 text-orange-500" strokeWidth={2.5} />
                                                                LANCER
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="w-full h-16 rounded-[20px] font-black uppercase tracking-[0.3em] text-[11px] transition-all bg-emerald-500 text-white hover:bg-emerald-600 active:scale-[0.98] shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3"
                                                                onClick={() => updateOrderStatus(ticket.id, 'ready')}
                                                            >
                                                                <span className="flex items-center gap-3">PRÊT <ArrowRight className="w-5 h-5" strokeWidth={2.5} /></span>
                                                            </button>
                                                        )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <ModificationAlertsPanel
                isOpen={showModificationAlerts}
                onClose={() => setShowModificationAlerts(false)}
            />

            {/* Recipe Detail Modal */}
            <RecipeDetailDialog
                recipe={selectedRecipe}
                isOpen={!!selectedRecipe}
                onClose={() => setSelectedRecipe(null)}
            />
        </div>
    );
}
