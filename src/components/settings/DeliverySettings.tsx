"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "@/context/SettingsContext";
import {
    Truck,
    Save,
    Loader2,
    MapPin,
    Clock,
    DollarSign,
    ShoppingBag,
    Plus,
    Trash2,
    Package,
    Navigation2,
    Zap,
    Map,
    Info,
    ChevronRight,
    Bike
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DeliveryZone {
    id: string;
    name: string;
    postalCodes: string;
    deliveryFee: number;
    freeMinimum: number;
    estimatedTime: number;
    isActive: boolean;
}

const defaultZones: DeliveryZone[] = [
    { id: '1', name: 'Core Urban Zone', postalCodes: '75001, 75002, 75003', deliveryFee: 0, freeMinimum: 0, estimatedTime: 20, isActive: true },
    { id: '2', name: 'Metropolitan Perimeter', postalCodes: '75004, 75005, 75006', deliveryFee: 3, freeMinimum: 25, estimatedTime: 30, isActive: true },
    { id: '3', name: 'Extended Reach', postalCodes: '75007, 75008', deliveryFee: 5, freeMinimum: 35, estimatedTime: 45, isActive: false },
];

import { DeliveryZone as SettingsDeliveryZone } from "@/types/settings";

export default function DeliverySettings() {
    const { settings, updateClickCollect, updateList, isSaving: contextIsSaving } = useSettings();
    const [clickCollect, setClickCollect] = useState(settings.clickCollect);
    const [zones, setZones] = useState<SettingsDeliveryZone[]>(settings.deliveryZones || []);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateClickCollect(clickCollect);
            await updateList('deliveryZones', zones);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const addZone = () => {
        const newZone: SettingsDeliveryZone = {
            id: Date.now().toString(),
            name: 'New Logistics Sector',
            postalCodes: [],
            deliveryFee: 5,
            freeDeliveryMinimum: 30,
            estimatedTime: 30,
            isActive: true
        };
        setZones([...zones, newZone]);
    };

    const updateZone = (id: string, updates: Partial<SettingsDeliveryZone>) => {
        setZones(zones.map(z => z.id === id ? { ...z, ...updates } : z));
    };

    const deleteZone = (id: string) => {
        setZones(zones.filter(z => z.id !== id));
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Click & Collect Configuration */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-6 md:p-10 overflow-hidden relative group"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32 transition-opacity group-hover:opacity-100 opacity-50 pointer-events-none" />

                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                                Click & Collect Vector
                            </h3>
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Store Pickup Logistics</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setClickCollect(c => ({ ...c, enabled: !c.enabled }))}
                        className={cn(
                            "w-16 h-8 rounded-full relative transition-all duration-500",
                            clickCollect.enabled ? "bg-accent shadow-lg shadow-accent/20" : "bg-bg-tertiary shadow-inner border border-border"
                        )}
                        data-tutorial="settings-1-2"
                    >
                        <motion.div
                            animate={{ x: clickCollect.enabled ? 34 : 4 }}
                            className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                        />
                    </button>
                </div>

                <AnimatePresence>
                    {clickCollect.enabled && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 overflow-hidden"
                        >
                            <div className="space-y-3">
                                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1">Preparation Buffer</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={clickCollect.minPrepTime}
                                        onChange={(e) => setClickCollect(c => ({ ...c, minPrepTime: Number(e.target.value) }))}
                                        className="w-full px-6 py-5 bg-bg-primary border border-border rounded-2xl text-text-primary font-medium focus:border-accent transition-all outline-none"
                                    />
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-text-muted uppercase">Min</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1">Slot Capacity</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={clickCollect.maxOrdersPerSlot}
                                        onChange={(e) => setClickCollect(c => ({ ...c, maxOrdersPerSlot: Number(e.target.value) }))}
                                        className="w-full px-6 py-5 bg-bg-primary border border-border rounded-2xl text-text-primary font-medium focus:border-accent transition-all outline-none"
                                    />
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-text-muted uppercase">Orders/Slot</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1">Pickup Coordinates</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={clickCollect.pickupLocation || ''}
                                        onChange={(e) => setClickCollect(c => ({ ...c, pickupLocation: e.target.value }))}
                                        className="w-full px-6 py-5 bg-bg-primary border border-border rounded-2xl text-text-primary font-medium focus:border-accent transition-all outline-none"
                                    />
                                    <MapPin className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Delivery Zones */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-6 md:p-10"
            >
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent">
                            <Truck className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                                Delivery Zoning
                            </h3>
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Geospatial Logistics Matrix</p>
                        </div>
                    </div>
                    <button
                        onClick={addZone}
                        className="w-12 h-12 rounded-2xl bg-bg-tertiary border border-border flex items-center justify-center text-text-primary hover:bg-accent hover:text-bg-primary transition-all duration-300 shadow-sm"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-6">
                    {zones.map((zone, index) => (
                        <motion.div
                            key={zone.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-bg-primary p-8 rounded-[2rem] border border-border hover:border-accent transition-all duration-300 relative group shadow-sm"
                        >
                            <button
                                onClick={() => deleteZone(zone.id)}
                                className="absolute top-6 right-6 p-2 text-text-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Zone Identifier</label>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-accent" />
                                        <input
                                            type="text"
                                            value={zone.name}
                                            onChange={(e) => updateZone(zone.id, { name: e.target.value })}
                                            className="bg-transparent text-lg font-serif text-text-primary w-full outline-none focus:text-accent transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Postal Codes</label>
                                    <input
                                        type="text"
                                        value={Array.isArray(zone.postalCodes) ? zone.postalCodes.join(', ') : zone.postalCodes}
                                        onChange={(e) => updateZone(zone.id, { postalCodes: e.target.value.split(',').map(s => s.trim()) })}
                                        className="w-full bg-transparent border-b border-border py-2 text-sm font-medium text-text-primary focus:border-accent outline-none"
                                        placeholder="75001, 75002..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Minimum Order</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={zone.freeDeliveryMinimum}
                                            onChange={(e) => updateZone(zone.id, { freeDeliveryMinimum: Number(e.target.value) })}
                                            className="w-full bg-transparent border-b border-border py-2 text-lg font-serif text-text-primary focus:border-accent outline-none"
                                        />
                                        <span className="absolute right-0 bottom-2 text-sm text-text-muted">€</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Logistics Fee</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={zone.deliveryFee}
                                            onChange={(e) => updateZone(zone.id, { deliveryFee: Number(e.target.value) })}
                                            className="w-full bg-transparent border-b border-border py-2 text-lg font-serif text-text-primary focus:border-accent outline-none"
                                        />
                                        <span className="absolute right-0 bottom-2 text-sm text-text-muted">€</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-text-muted" />
                                        <input
                                            type="number"
                                            value={zone.estimatedTime}
                                            onChange={(e) => updateZone(zone.id, { estimatedTime: Number(e.target.value) })}
                                            className="w-12 bg-transparent text-center font-bold text-text-primary outline-none hover:text-accent"
                                        />
                                        <span className="text-[10px] font-bold text-text-muted uppercase">Min Est.</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => updateZone(zone.id, { isActive: !zone.isActive })}
                                    className={cn(
                                        "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all",
                                        zone.isActive
                                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                            : "bg-red-500/10 text-red-600 border-red-500/20"
                                    )}
                                >
                                    {zone.isActive ? 'Active Node' : 'Inactive'}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Global Dispatch */}
            <div className="flex justify-end pt-4">
                <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-3 px-10 py-5 bg-text-primary text-bg-primary rounded-[1.5rem] font-bold uppercase tracking-widest shadow-2xl hover:scale-105 transition-all disabled:opacity-50 group border border-border"
                >
                    {isSaving ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <div className="relative">
                            <Zap className="w-5 h-5 transition-transform group-hover:scale-110" />
                        </div>
                    )}
                    Commit Logistics Matrix
                </motion.button>
            </div>
        </div>
    );
}
