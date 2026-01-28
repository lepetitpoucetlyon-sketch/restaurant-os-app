"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
    Package,
    Save,
    Loader2,
    AlertTriangle,
    Thermometer,
    MapPin,
    Tag,
    RefreshCw,
    Truck,
    ShoppingCart,
    Zap,
    Cpu,
    Database,
    Binary,
    Activity,
    Box,
    Droplets,
    Wind,
    Snowflake,
    ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StorageLocation {
    id: string;
    name: string;
    type: 'fridge' | 'freezer' | 'dry' | 'bar' | 'cellar';
    tempMin: number;
    tempMax: number;
    capacity: number;
}

const defaultLocations: StorageLocation[] = [
    { id: '1', name: 'Primary Thermal Node', type: 'fridge', tempMin: 0, tempMax: 4, capacity: 200 },
    { id: '2', name: 'Cryogenic Vault', type: 'freezer', tempMin: -22, tempMax: -18, capacity: 100 },
    { id: '3', name: 'Ambient Archives', type: 'dry', tempMin: 15, tempMax: 25, capacity: 300 },
    { id: '4', name: 'Mixology Matrix', type: 'bar', tempMin: 18, tempMax: 22, capacity: 50 },
    { id: '5', name: 'Vineyard Habitat', type: 'cellar', tempMin: 12, tempMax: 16, capacity: 150 },
];

export default function InventorySettings() {
    const [locations, setLocations] = useState<StorageLocation[]>(defaultLocations);
    const [isSaving, setIsSaving] = useState(false);
    const [settings, setSettings] = useState({
        lowStockThreshold: 20,
        criticalStockThreshold: 10,
        expiryWarningDays: 3,
        autoReorderEnabled: false,
        autoReorderThreshold: 15,
        trackLotNumbers: true,
        fifoEnabled: true,
        wasteTrackingEnabled: true,
        inventorySchedule: 'weekly' as 'daily' | 'weekly' | 'monthly',
        defaultUnit: 'kg' as 'kg' | 'l' | 'unit',
    });

    const cinematicContainer: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const cinematicItem: Variants = {
        hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(r => setTimeout(r, 800));
        setIsSaving(false);
    };

    return (
        <motion.div
            variants={cinematicContainer}
            initial="hidden"
            animate="visible"
            className="space-y-12 pb-20"
        >
            {/* Stock Hazard Matrix (Alerts) */}
            <motion.div
                variants={cinematicItem}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-6 md:p-10 overflow-hidden relative group"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] -mr-32 -mt-32 transition-opacity group-hover:opacity-100 opacity-50 pointer-events-none" />

                <div className="flex items-center gap-4 mb-10">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent"
                    >
                        <AlertTriangle className="w-6 h-6" />
                    </motion.div>
                    <div>
                        <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                            Stock Hazard Thresholds
                        </h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Neural Depletion Guardrails</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-amber-500/5 p-8 rounded-[2rem] border border-amber-500/20 space-y-4 group/card transition-colors duration-500"
                    >
                        <label className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest px-1">Signal: Low Stock</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={settings.lowStockThreshold}
                                onChange={(e) => setSettings(s => ({ ...s, lowStockThreshold: Number(e.target.value) }))}
                                className="w-full bg-transparent text-4xl font-serif text-amber-600 dark:text-amber-500 outline-none pr-12"
                                data-tutorial="settings-4-0"
                            />
                            <span className="absolute right-0 bottom-2 text-xs font-bold text-amber-500/50">%</span>
                        </div>
                        <div className="w-full h-1 bg-amber-500/20 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${settings.lowStockThreshold}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-amber-500"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-rose-500/5 p-8 rounded-[2rem] border border-rose-500/20 space-y-4 group/card transition-colors duration-500"
                    >
                        <label className="text-[10px] font-bold text-rose-600 dark:text-rose-500 uppercase tracking-widest px-1">Signal: Critical</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={settings.criticalStockThreshold}
                                onChange={(e) => setSettings(s => ({ ...s, criticalStockThreshold: Number(e.target.value) }))}
                                className="w-full bg-transparent text-4xl font-serif text-rose-600 dark:text-rose-500 outline-none pr-12"
                            />
                            <span className="absolute right-0 bottom-2 text-xs font-bold text-rose-500/50">%</span>
                        </div>
                        <div className="w-full h-1 bg-rose-500/20 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${settings.criticalStockThreshold}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-rose-500"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-bg-primary p-8 rounded-[2rem] border border-border space-y-4 group/card transition-colors duration-500"
                    >
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1">Degradation Warning</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={settings.expiryWarningDays}
                                onChange={(e) => setSettings(s => ({ ...s, expiryWarningDays: Number(e.target.value) }))}
                                className="w-full bg-transparent text-4xl font-serif text-text-primary outline-none pr-12"
                            />
                            <span className="absolute right-0 bottom-2 text-[10px] font-bold text-text-muted uppercase">Days</span>
                        </div>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(i => (
                                <motion.div
                                    key={i}
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 0.1 * i }}
                                    className={cn("h-1 flex-1 rounded-full origin-left", i <= settings.expiryWarningDays ? "bg-text-primary" : "bg-bg-tertiary")}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Storage Node Topography */}
            <motion.div
                variants={cinematicItem}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-6 md:p-10"
            >
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <motion.div
                            whileHover={{ rotate: -10, scale: 1.1 }}
                            className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent"
                        >
                            <Database className="w-6 h-6" />
                        </motion.div>
                        <div>
                            <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                                Storage Node Topography
                            </h3>
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{locations.length} Environmental Sectors Active</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {locations.map((loc, idx) => {
                        const Icon = loc.type === 'freezer' ? Snowflake :
                            loc.type === 'fridge' ? Wind :
                                loc.type === 'cellar' ? Droplets : Box;
                        const colorClass = loc.type === 'freezer' ? 'text-blue-500 bg-blue-500/10' :
                            loc.type === 'fridge' ? 'text-cyan-500 bg-cyan-500/10' :
                                loc.type === 'cellar' ? 'text-purple-500 bg-purple-500/10' : 'text-stone-500 bg-stone-500/10';

                        return (
                            <motion.div
                                key={loc.id}
                                variants={cinematicItem}
                                whileHover={{ scale: 1.02, y: -4 }}
                                className="p-8 rounded-[2.5rem] bg-bg-primary border border-border shadow-sm hover:shadow-lg hover:border-accent/30 transition-all duration-500 group"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-5">
                                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500", colorClass)}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-serif text-text-primary uppercase tracking-tight text-lg italic">{loc.name}</p>
                                            <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">{loc.type} sector</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Capacity</p>
                                        <p className="text-xl font-serif text-text-primary">{loc.capacity}<span className="text-[10px] ml-1 font-sans">KG</span></p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-bg-tertiary px-6 py-4 rounded-2xl border border-border/50">
                                        <p className="text-[9px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1 text-center">Temp Floor</p>
                                        <div className="flex items-center justify-center gap-2">
                                            <Thermometer className="w-3 h-3 text-blue-400" />
                                            <p className="text-lg font-serif text-text-primary">{loc.tempMin}°C</p>
                                        </div>
                                    </div>
                                    <div className="bg-bg-tertiary px-6 py-4 rounded-2xl border border-border/50">
                                        <p className="text-[9px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1 text-center">Temp Ceiling</p>
                                        <div className="flex items-center justify-center gap-2">
                                            <Thermometer className="w-3 h-3 text-rose-400" />
                                            <p className="text-lg font-serif text-text-primary">{loc.tempMax}°C</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Neural Supply Protocols (Automation) */}
            <motion.div
                variants={cinematicItem}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-6 md:p-10"
            >
                <div className="flex items-center gap-4 mb-10">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent"
                    >
                        <Cpu className="w-6 h-6" />
                    </motion.div>
                    <div>
                        <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                            Neural Supply Protocols
                        </h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Autonomous Material Logic & Reacquisition</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        { key: 'autoReorderEnabled', label: 'Autonomous Reorder', sub: 'Execute acquisitions below threshold', icon: ShoppingCart },
                        { key: 'trackLotNumbers', label: 'Genetic Lot Tracking', sub: 'Molecular node traceability', icon: Binary },
                        { key: 'fifoEnabled', label: 'Chronos Allocation (FIFO)', sub: 'Temporal stock prioritized flow', icon: RefreshCw },
                        { key: 'wasteTrackingEnabled', label: 'Entropy Analysis', sub: 'Waste vector degradation monitoring', icon: Activity },
                    ].map((protocol) => {
                        const isEnabled = settings[protocol.key as keyof typeof settings];
                        const Icon = protocol.icon;

                        return (
                            <motion.div
                                key={protocol.key}
                                variants={cinematicItem}
                                whileHover={{ y: -4, scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSettings(s => ({ ...s, [protocol.key]: !isEnabled }))}
                                className={cn(
                                    "p-8 rounded-[2.5rem] border-2 transition-all duration-500 cursor-pointer flex items-center justify-between group",
                                    isEnabled
                                        ? "bg-bg-primary border-accent/20 shadow-lg shadow-accent/5"
                                        : "bg-bg-tertiary/50 border-transparent hover:bg-bg-primary/50"
                                )}
                                data-tutorial={protocol.key === 'autoReorderEnabled' ? 'settings-4-1' : undefined}
                            >
                                <div className="flex items-center gap-6">
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-all duration-500",
                                        isEnabled ? "bg-accent/10 text-accent" : "bg-bg-tertiary text-text-muted group-hover:text-text-primary"
                                    )}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className={cn("font-serif text-lg uppercase tracking-tight italic", isEnabled ? "text-text-primary" : "text-text-muted group-hover:text-text-primary")}>{protocol.label}</p>
                                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{protocol.sub}</p>
                                    </div>
                                </div>
                                <div className={cn(
                                    "w-12 h-6 rounded-full relative transition-all duration-500",
                                    isEnabled ? "bg-emerald-500" : "bg-bg-tertiary border border-border"
                                )}>
                                    <motion.div
                                        animate={{ x: isEnabled ? 26 : 2 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Inventory Frequency Spectrum */}
            <motion.div
                variants={cinematicItem}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-6 md:p-10 overflow-hidden relative"
            >
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />

                <div className="flex items-center gap-4 mb-10 relative z-10">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 180 }}
                        className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent"
                    >
                        <Zap className="w-6 h-6" />
                    </motion.div>
                    <div>
                        <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                            Auditing Pulse Sequence
                        </h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Inventory Recalibration Frequency</p>
                    </div>
                </div>

                <div className="flex gap-6 relative z-10">
                    {['daily', 'weekly', 'monthly'].map((freq) => (
                        <motion.button
                            key={freq}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSettings(s => ({ ...s, inventorySchedule: freq as any }))}
                            className={cn(
                                "flex-1 py-8 rounded-[2rem] font-bold uppercase tracking-[0.2em] text-xs transition-all duration-500 border relative overflow-hidden group/btn",
                                settings.inventorySchedule === freq
                                    ? "bg-text-primary text-bg-primary border-text-primary shadow-xl"
                                    : "bg-bg-tertiary text-text-muted border-transparent hover:bg-bg-primary hover:text-text-primary"
                            )}
                            data-tutorial={freq === 'weekly' ? 'settings-4-2' : undefined}
                        >
                            <span className="relative z-10">{freq}</span>
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* Global Dispatch */}
            <motion.div
                variants={cinematicItem}
                className="flex justify-end pt-4"
            >
                <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-4 px-12 py-6 bg-text-primary text-bg-primary rounded-[2rem] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all disabled:opacity-50 group border border-border"
                >
                    {isSaving ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <div className="relative">
                            <ShieldCheck className="w-6 h-6 transition-transform group-hover:scale-110" />
                            <div className="absolute inset-0 bg-white/40 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    )}
                    Commit Inventory Framework
                </motion.button>
            </motion.div>
        </motion.div>
    );
}
