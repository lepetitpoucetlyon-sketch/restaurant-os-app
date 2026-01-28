"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChefHat,
    Save,
    Loader2,
    Calculator,
    Clock,
    Flame,
    Users,
    Leaf,
    Scale,
    Zap,
    Layout,
    Timer,
    ShieldCheck,
    MessageSquare,
    Sparkles,
    CheckCircle2,
    FileText,
    Target,
    Activity,
    Utensils,
    Layers,
    Printer,
    Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useSettings } from "@/context/SettingsContext";
import { RecipesConfig } from "@/types/settings";

export default function RecipesSettings() {
    const { settings: globalSettings, updateConfig, isSaving: contextIsSaving } = useSettings();
    const [isSaving, setIsSaving] = useState(false);

    // Local state for buffered edits
    const [localConfig, setLocalConfig] = useState<RecipesConfig>(globalSettings.recipesConfig || {
        defaultYield: 4,
        defaultUnit: 'portions',
        showCostsToChefs: true,
        showMarginsToManagers: true,
        autoCalculateCosts: true,
        includeWastePercentage: true,
        defaultWastePercent: 5,
        showNutrition: true,
        showAllergens: true,
        printFormat: 'a4',
        showPhotosInRecipe: true,
        showTimersInRecipe: true,
        targetFoodCostPercent: 30,
        targetGrossMargin: 70,
    });

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateConfig('recipesConfig', localConfig);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Gastronomic Blueprint Defaults */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-6 md:p-10 overflow-hidden relative group"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] -mr-32 -mt-32 transition-opacity group-hover:opacity-100 opacity-50 pointer-events-none" />

                <div className="flex items-center gap-4 mb-10 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent">
                        <Layers className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                            Blueprint Archetypes
                        </h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Global Recipe Matrix Defaults</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                    <div className="space-y-4 bg-bg-primary p-8 rounded-[2rem] border border-border hover:border-accent/40 transition-colors group/item">
                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1 group-hover/item:text-accent transition-colors">Yield Multiplier</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="number"
                                value={localConfig.defaultYield}
                                onChange={(e) => setLocalConfig(s => ({ ...s, defaultYield: Number(e.target.value) }))}
                                className="w-full bg-transparent text-4xl font-serif text-text-primary outline-none"
                                data-tutorial="settings-3-3"
                            />
                            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                                <Users className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4 bg-bg-primary p-8 rounded-[2rem] border border-border hover:border-accent/40 transition-colors group/item">
                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1 group-hover/item:text-accent transition-colors">Dimensional Unit</label>
                        <select
                            value={localConfig.defaultUnit}
                            onChange={(e) => setLocalConfig(s => ({ ...s, defaultUnit: e.target.value as any }))}
                            className="w-full bg-transparent text-xl font-serif text-text-primary outline-none uppercase tracking-widest cursor-pointer appearance-none"
                        >
                            <option value="portions" className="bg-bg-primary text-text-primary">Portions</option>
                            <option value="kg" className="bg-bg-primary text-text-primary">Kilograms</option>
                            <option value="l" className="bg-bg-primary text-text-primary">Litres</option>
                        </select>
                    </div>
                    <div className="space-y-4 bg-bg-primary p-8 rounded-[2rem] border border-border hover:border-accent/40 transition-colors group/item">
                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1 group-hover/item:text-accent transition-colors">Synthesis Format</label>
                        <div className="flex items-center gap-4">
                            <select
                                value={localConfig.printFormat}
                                onChange={(e) => setLocalConfig(s => ({ ...s, printFormat: e.target.value as any }))}
                                className="w-full bg-transparent text-xl font-serif text-text-primary outline-none uppercase tracking-widest font-mono cursor-pointer appearance-none"
                            >
                                <option value="a4" className="bg-bg-primary text-text-primary">PDF-A4</option>
                                <option value="letter" className="bg-bg-primary text-text-primary">PDF-LTR</option>
                                <option value="recipe-card" className="bg-bg-primary text-text-primary">NODE-CRD</option>
                            </select>
                            <Printer className="w-5 h-5 text-text-muted" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Economic Logic (Costing) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-6 md:p-10 relative overflow-hidden"
            >
                <div className="flex items-center gap-4 mb-10 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent">
                        <Calculator className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                            Economic Logic
                        </h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Food Cost Projection & Margin Enforcement</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 relative z-10">
                    <div className="bg-bg-primary p-8 rounded-[2.5rem] border border-border space-y-4 group/card hover:border-emerald-500/40 transition-colors duration-500">
                        <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest px-1">Target Food Cost Velocity</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={localConfig.targetFoodCostPercent}
                                onChange={(e) => setLocalConfig(s => ({ ...s, targetFoodCostPercent: Number(e.target.value) }))}
                                className="w-full bg-transparent text-5xl font-serif text-text-primary outline-none pr-12"
                                data-tutorial="settings-3-4"
                            />
                            <span className="absolute right-0 bottom-2 text-xl font-bold text-emerald-500/50">%</span>
                        </div>
                        <div className="w-full h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                            <motion.div
                                animate={{ width: `${localConfig.targetFoodCostPercent}%` }}
                                className="h-full bg-emerald-500"
                            />
                        </div>
                    </div>

                    <div className="bg-bg-primary p-8 rounded-[2.5rem] border border-border space-y-4 group/card hover:border-blue-500/40 transition-colors duration-500">
                        <label className="text-[10px] font-bold text-blue-500 uppercase tracking-widest px-1">Target Gross Margin Threshold</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={localConfig.targetGrossMargin}
                                onChange={(e) => setLocalConfig(s => ({ ...s, targetGrossMargin: Number(e.target.value) }))}
                                className="w-full bg-transparent text-5xl font-serif text-text-primary outline-none pr-12"
                            />
                            <span className="absolute right-0 bottom-2 text-xl font-bold text-blue-500/50">%</span>
                        </div>
                        <div className="w-full h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                            <motion.div
                                animate={{ width: `${localConfig.targetGrossMargin}%` }}
                                className="h-full bg-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    {[
                        { key: 'autoCalculateCosts', label: 'Neural Cost Engine', desc: 'Real-time calibration during blueprint modification', icon: Cpu },
                        { key: 'includeWastePercentage', label: 'Entropy Compensation', desc: 'Factor operational degradation into costing', icon: Activity },
                    ].map((item) => {
                        const isEnabled = localConfig[item.key as keyof RecipesConfig] as boolean;
                        return (
                            <motion.button
                                key={item.key}
                                layout
                                onClick={() => setLocalConfig(s => ({ ...s, [item.key]: !isEnabled }))}
                                className={cn(
                                    "flex items-center justify-between p-8 rounded-[2rem] border transition-all duration-500 text-left",
                                    isEnabled
                                        ? "bg-bg-primary border-accent/20 shadow-lg text-text-primary"
                                        : "bg-bg-tertiary/50 border-border opacity-80 hover:opacity-100 text-text-muted"
                                )}
                            >
                                <div className="flex items-center gap-6">
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500",
                                        isEnabled ? "bg-accent text-bg-primary" : "bg-bg-tertiary text-text-muted"
                                    )}>
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-serif text-lg uppercase tracking-tight leading-none mb-2 italic">{item.label}</p>
                                        <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">{item.desc}</p>
                                    </div>
                                </div>
                                <div className={cn(
                                    "w-12 h-6 rounded-full relative transition-all duration-500",
                                    isEnabled ? "bg-emerald-500" : "bg-bg-tertiary border border-border"
                                )}>
                                    <motion.div
                                        animate={{ x: isEnabled ? 26 : 2 }}
                                        className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md"
                                    />
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                <AnimatePresence>
                    {localConfig.includeWastePercentage && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6 pl-24 relative z-10"
                        >
                            <div className="inline-flex items-center gap-6 bg-red-500/5 px-8 py-4 rounded-2xl border border-red-500/20">
                                <label className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Base Entropy Factor:</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={localConfig.defaultWastePercent}
                                        onChange={(e) => setLocalConfig(s => ({ ...s, defaultWastePercent: Number(e.target.value) }))}
                                        className="w-12 bg-transparent text-xl font-serif text-red-500 outline-none text-right"
                                    />
                                    <span className="text-sm font-bold text-red-500/60">%</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Signal Visibility Infrastructure */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-6 md:p-10 overflow-hidden relative"
            >
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />

                <div className="flex items-center gap-4 mb-10 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                            Signal Visibility
                        </h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Node Accessibility & Blueprint Projection Rules</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    {[
                        { key: 'showCostsToChefs', label: 'Chef Cost Stream', desc: 'Enable ingredient valuation for culinary nodes', icon: ChefHat },
                        { key: 'showMarginsToManagers', label: 'Manager Margin Sync', desc: 'Project profitability logic to administrative nodes', icon: Scale },
                        { key: 'showNutrition', label: 'Molecular Intel', desc: 'Project nutritional data into the blueprint', icon: Leaf },
                        { key: 'showAllergens', label: 'Bioshield Signaling', desc: 'Toggle active allergen hazard signals', icon: Flame },
                        { key: 'showPhotosInRecipe', label: 'Visual Synthesis', desc: 'Embed high-fidelity product images', icon: FileText },
                        { key: 'showTimersInRecipe', label: 'Temporal Trackers', desc: 'Display active chronos modules in steps', icon: Clock },
                    ].map((item) => {
                        const isEnabled = localConfig[item.key as keyof RecipesConfig] as boolean;
                        return (
                            <motion.button
                                key={item.key}
                                whileHover={{ scale: 1.01, x: 4 }}
                                onClick={() => setLocalConfig(s => ({ ...s, [item.key]: !isEnabled }))}
                                className={cn(
                                    "flex items-center justify-between p-8 rounded-[2rem] border transition-all duration-500 text-left group",
                                    isEnabled
                                        ? "bg-bg-primary border-border shadow-lg text-text-primary"
                                        : "bg-bg-tertiary/50 border-transparent opacity-60 hover:opacity-100 hover:bg-bg-primary/50"
                                )}
                            >
                                <div className="flex items-center gap-6">
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500",
                                        isEnabled ? "bg-accent/10 text-accent" : "bg-bg-tertiary text-text-muted group-hover:text-text-primary"
                                    )}>
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className={cn("font-serif text-lg uppercase tracking-tight leading-none mb-2 italic", isEnabled ? "text-text-primary" : "text-text-muted group-hover:text-text-primary")}>{item.label}</p>
                                        <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">{item.desc}</p>
                                    </div>
                                </div>
                                <div className={cn(
                                    "w-12 h-6 rounded-full relative transition-all duration-500",
                                    isEnabled ? "bg-emerald-500 shadow-lg shadow-emerald-500/20" : "bg-bg-tertiary shadow-inner border border-border"
                                )}>
                                    <motion.div
                                        animate={{ x: isEnabled ? 26 : 2 }}
                                        className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md"
                                    />
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </motion.div>

            {/* Global Dispatch */}
            <div className="flex justify-end pt-4">
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
                            <Target className="w-6 h-6 transition-transform group-hover:scale-110" />
                            <div className="absolute inset-0 bg-white/40 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    )}
                    Commit Blueprint Architecture
                </motion.button>
            </div>
        </div>
    );
}
