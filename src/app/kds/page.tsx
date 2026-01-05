"use client";

import { useState, useEffect, useMemo } from "react";
import { CheckCircle2, Flame, ChefHat, Clock, AlertTriangle, ArrowRight, Snowflake, Beer, ThermometerSun, Volume2, VolumeX, Zap, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useOrders } from "@/context/OrdersContext";

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

// Station configuration for visuals
const STATION_CONFIG = {
    all: { label: 'Tous', icon: ChefHat, color: '#00D764' },
    cold: { label: 'Froid', icon: Snowflake, color: '#3B82F6' },
    hot: { label: 'Chaud', icon: ThermometerSun, color: '#FF4D4D' },
    bar: { label: 'Bar', icon: Beer, color: '#FF9900' },
};

export default function KDSPage() {
    const { orders, updateOrderStatus } = useOrders();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activeStation, setActiveStation] = useState<KitchenStation>('all');

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Additional state for enhanced KDS
    const [rushMode, setRushMode] = useState(false);
    const [viewMode, setViewMode] = useState<'tickets' | 'consolidated'>('tickets');
    const [soundEnabled, setSoundEnabled] = useState(true);

    // Filter orders based on station (check if any item matches the selected station)
    const filteredOrders = useMemo(() => {
        const activeOrders = orders.filter(o => o.status !== 'delivered');

        if (activeStation === 'all') return activeOrders;

        return activeOrders.filter(order =>
            order.items.some(item => {
                const station = ITEM_STATION_MAP[item.name] || 'hot';
                return station === activeStation;
            })
        ).map(order => ({
            ...order,
            // Filter items to only show those for the selected station
            items: order.items.filter(item => {
                const station = ITEM_STATION_MAP[item.name] || 'hot';
                return station === activeStation;
            })
        }));
    }, [orders, activeStation]);

    const preparingOrders = orders.filter(o => o.status === 'preparing' || o.status === 'new');
    const readyOrders = orders.filter(o => o.status === 'ready');

    return (
        <div className="h-[calc(100vh-80px)] -m-8 flex flex-col bg-[#111111] text-white">
            {/* High-End KDS Header */}
            <div className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-[#111111]">
                <div className="flex items-center gap-10">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                            <ChefHat strokeWidth={1.5} className="text-white w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-serif font-semibold tracking-tight">Kitchen Intelligence</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                                <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold">Live Production Sync</span>
                            </div>
                        </div>
                    </div>

                    {/* Station Tabs */}
                    <div className="flex gap-1.5 bg-white/5 p-1 rounded-xl">
                        {(Object.keys(STATION_CONFIG) as KitchenStation[]).map(station => {
                            const config = STATION_CONFIG[station];
                            const Icon = config.icon;
                            const isActive = activeStation === station;
                            return (
                                <button
                                    key={station}
                                    onClick={() => setActiveStation(station)}
                                    className={cn(
                                        "flex items-center gap-2.5 px-5 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all",
                                        isActive
                                            ? "bg-white text-black shadow-lg"
                                            : "text-white/40 hover:text-white"
                                    )}
                                >
                                    <Icon strokeWidth={1.5} className="w-3.5 h-3.5" />
                                    {config.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {/* View Mode Toggle */}
                    <div className="flex gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
                        <button
                            onClick={() => setViewMode('tickets')}
                            className={cn(
                                "p-2 rounded-md transition-all",
                                viewMode === 'tickets' ? "bg-white/10 text-white" : "text-white/30 hover:text-white"
                            )}
                        >
                            <LayoutGrid strokeWidth={1.5} className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('consolidated')}
                            className={cn(
                                "p-2 rounded-md transition-all",
                                viewMode === 'consolidated' ? "bg-white/10 text-white" : "text-white/30 hover:text-white"
                            )}
                        >
                            <List strokeWidth={1.5} className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Rush Mode Toggle */}
                    <button
                        onClick={() => setRushMode(!rushMode)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all border",
                            rushMode
                                ? "bg-error border-error text-white animate-pulse"
                                : "bg-white/5 border-white/10 text-white/50 hover:text-white"
                        )}
                    >
                        <Zap strokeWidth={1.5} className="w-3.5 h-3.5" />
                        {rushMode ? 'RUSH' : 'Rush Mode'}
                    </button>

                    <div className="flex gap-4 border-l border-white/10 pl-6 ml-2">
                        <div className="text-right">
                            <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Preparing</div>
                            <div className="text-xl font-mono font-medium text-success leading-none mt-1">{preparingOrders.length}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Ready</div>
                            <div className="text-xl font-mono font-medium text-white leading-none mt-1">{readyOrders.length}</div>
                        </div>
                    </div>

                    <div className="text-right border-l border-white/10 pl-6">
                        <div className="text-2xl font-mono font-medium tracking-tight text-white/90">
                            {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Production Grid */}
            <div className="flex-1 p-10 overflow-auto bg-[#0a0a0a]">
                {filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full opacity-20">
                        <ChefHat strokeWidth={1} className="w-20 h-20 text-white mb-6" />
                        <p className="text-xl font-serif italic text-white">No active orders</p>
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold mt-4">Kitchen is clear</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                        {filteredOrders.map(ticket => {
                            const elapsedMinutes = Math.floor((new Date().getTime() - ticket.timestamp.getTime()) / 60000);
                            const isUrgent = elapsedMinutes > 15;
                            const isWarning = elapsedMinutes > 8 && elapsedMinutes <= 15;

                            const getTimerColorClass = (minutes: number): string => {
                                if (minutes < 8) return 'text-success bg-success/10';
                                if (minutes < 15) return 'text-warning bg-warning/10';
                                return 'text-error bg-error/10';
                            };
                            const timerClass = getTimerColorClass(elapsedMinutes);

                            const dominantStation = ticket.items[0] ? (ITEM_STATION_MAP[ticket.items[0].name] || 'hot') : 'hot';
                            const stationColor = STATION_CONFIG[dominantStation]?.color || '#FF9900';

                            return (
                                <div
                                    key={ticket.id}
                                    className={cn(
                                        "flex flex-col bg-[#141414] rounded-xl overflow-hidden border border-white/5 transition-all duration-500",
                                        isUrgent && "border-error/40 shadow-2xl shadow-error/10"
                                    )}
                                >
                                    {/* Ticket Header */}
                                    <div className="p-6 bg-white/[0.03] flex justify-between items-start border-b border-white/5">
                                        <div>
                                            <div className="font-serif text-2xl font-semibold tracking-tight">Table {ticket.tableNumber}</div>
                                            <div className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mt-2">Server: {ticket.serverName}</div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className={cn("font-mono text-sm px-2.5 py-1 rounded flex items-center gap-2", timerClass)}>
                                                <Clock strokeWidth={1.5} className="w-3.5 h-3.5" />
                                                {elapsedMinutes}m
                                            </div>
                                            {isUrgent && <span className="text-[8px] font-bold text-error uppercase tracking-widest animate-pulse mt-2">Critical</span>}
                                        </div>
                                    </div>

                                    {/* Ticket Items */}
                                    <div className="flex-1 p-7 space-y-6">
                                        {ticket.items.map((item, i) => {
                                            const itemStation = ITEM_STATION_MAP[item.name] || 'hot';
                                            const itemColor = STATION_CONFIG[itemStation]?.color || '#FF9900';

                                            return (
                                                <div key={i} className="flex flex-col">
                                                    <div className="flex items-start gap-5">
                                                        <div className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center font-mono text-[14px] font-medium text-white">
                                                            {item.quantity}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-base font-semibold leading-tight block">
                                                                    {item.name}
                                                                </span>
                                                                <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded border border-white/10 text-white/40">
                                                                    {STATION_CONFIG[itemStation]?.label}
                                                                </span>
                                                            </div>
                                                            {item.modifiers && item.modifiers.length > 0 && (
                                                                <div className="flex flex-wrap gap-2 mt-2.5">
                                                                    {item.modifiers.map((m, mi) => (
                                                                        <span key={mi} className="text-[10px] font-medium text-success/80 italic border-l border-success/30 pl-2">
                                                                            {m}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            {item.notes && (
                                                                <div className="mt-3 flex items-center gap-2 text-[11px] text-warning bg-warning/5 p-2 rounded border border-warning/10 leading-relaxed italic">
                                                                    <AlertTriangle strokeWidth={1.5} className="w-3.5 h-3.5 shrink-0" />
                                                                    {item.notes}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Ticket Action Footer */}
                                    <div className="p-6 pt-0">
                                        {ticket.status === "ready" ? (
                                            <button
                                                className="w-full h-12 bg-white/5 hover:bg-white/10 text-white text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all border border-white/10 flex items-center justify-center gap-2"
                                                onClick={() => updateOrderStatus(ticket.id, 'delivered')}
                                            >
                                                <CheckCircle2 strokeWidth={1.5} className="w-4 h-4 text-success" />
                                                Archive Ticket
                                            </button>
                                        ) : (
                                            <div className="flex gap-2">
                                                {ticket.status === "new" ? (
                                                    <button
                                                        className="flex-1 h-12 bg-white/10 hover:bg-white text-white hover:text-black font-bold text-[11px] uppercase tracking-widest rounded-lg transition-all"
                                                        onClick={() => updateOrderStatus(ticket.id, 'preparing')}
                                                    >
                                                        Start Service
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="flex-1 h-12 bg-success hover:bg-success/90 text-white font-bold text-[11px] uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-success/10 flex items-center justify-center gap-2"
                                                        onClick={() => updateOrderStatus(ticket.id, 'ready')}
                                                    >
                                                        Mark Ready
                                                        <ArrowRight strokeWidth={1.5} className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

