"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CalendarDays,
    Save,
    Loader2,
    Clock,
    Users,
    Shield,
    Bell,
    Calendar,
    Zap,
    Layout,
    Timer,
    Scale,
    ShieldCheck,
    MessageSquare,
    Sparkles,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSettings } from "@/context/SettingsContext";
import { ShiftTemplate, PlanningConfig } from "@/types/settings";

export default function PlanningSettings() {
    const { settings: globalSettings, updateConfig, updateList, isSaving: contextIsSaving } = useSettings();
    const [isSaving, setIsSaving] = useState(false);

    // Local state for buffered edits
    const [localConfig, setLocalConfig] = useState<PlanningConfig>(globalSettings.planningConfig || {
        weekStartDay: 1,
        defaultView: 'week',
        minHoursBetweenShifts: 11,
        maxHoursPerDay: 10,
        maxHoursPerWeek: 35,
        notifyOnPublish: true,
        absenceRequestApproval: true,
        swapRequestApproval: true,
        overtimeEnabled: false,
    });

    const [templates, setTemplates] = useState<ShiftTemplate[]>(globalSettings.shiftTemplates || []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateConfig('planningConfig', localConfig);
            await updateList('shiftTemplates', templates);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Temporal Framework (Display) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-6 md:p-10 overflow-hidden relative group"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] -mr-32 -mt-32 transition-opacity group-hover:opacity-100 opacity-50 pointer-events-none" />

                <div className="flex items-center gap-4 mb-10 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent">
                        <Layout className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                            Temporal Framework
                        </h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Global Planning Projection Parameters</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div className="space-y-4">
                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1 group-hover:text-accent transition-colors">Anchor Day (Week Start)</label>
                        <div className="flex gap-4 bg-bg-tertiary p-2 rounded-[1.5rem] border border-border">
                            {['monday', 'sunday'].map((day) => (
                                <button
                                    key={day}
                                    onClick={() => setLocalConfig(s => ({ ...s, weekStartDay: day === 'monday' ? 1 : 0 }))}
                                    className={cn(
                                        "flex-1 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all",
                                        (localConfig.weekStartDay === 1 && day === 'monday') || (localConfig.weekStartDay === 0 && day === 'sunday')
                                            ? "bg-bg-primary shadow-lg text-text-primary border border-border"
                                            : "text-text-muted hover:text-text-primary"
                                    )}
                                    data-tutorial={day === 'monday' ? 'settings-6-0' : undefined}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1">Default Perspective</label>
                        <div className="flex gap-4 bg-bg-tertiary p-2 rounded-[1.5rem] border border-border">
                            {['day', 'week', 'month'].map((view) => (
                                <button
                                    key={view}
                                    onClick={() => setLocalConfig(s => ({ ...s, defaultView: view as any }))}
                                    className={cn(
                                        "flex-1 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all",
                                        localConfig.defaultView === view
                                            ? "bg-bg-primary shadow-lg text-text-primary border border-border"
                                            : "text-text-muted hover:text-text-primary"
                                    )}
                                >
                                    {view}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Neural Shift Blueprints */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-6 md:p-10"
            >
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                                Neural Shift Blueprints
                            </h3>
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Predetermined Temporal Allocation Intervals</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map((template, idx) => (
                        <motion.div
                            key={template.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 + (idx * 0.05) }}
                            whileHover={{ scale: 1.05, y: -4 }}
                            className="p-8 rounded-[2.5rem] border border-border transition-all duration-500 relative overflow-hidden group bg-bg-primary shadow-sm hover:shadow-lg hover:border-accent/30"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div
                                    className="w-4 h-4 rounded-full shadow-[0_0_10px_currentcolor] bg-accent text-accent"
                                />
                                <span className="font-serif text-text-primary uppercase tracking-tight text-lg italic">{template.name}</span>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-bg-tertiary rounded-2xl border border-border flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Timer className="w-4 h-4 text-text-muted" />
                                        <span className="text-sm font-bold text-text-primary font-mono">{template.startTime}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-text-muted uppercase">to</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-text-primary font-mono">{template.endTime}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-bg-tertiary rounded-xl border border-border w-fit">
                                    <Zap className="w-3 h-3 text-text-muted" />
                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Rest: {template.breakDuration} Min</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Neural Constraint Matrix (Work Rules) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-6 md:p-10"
            >
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent">
                        <Scale className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                            Temporal Constraints
                        </h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Legal & Operational Neural Guardrails</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-bg-primary p-8 rounded-[2.5rem] border border-border shadow-sm space-y-4">
                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1">Inter-Shift Buffer</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={localConfig.minHoursBetweenShifts}
                                onChange={(e) => setLocalConfig(s => ({ ...s, minHoursBetweenShifts: Number(e.target.value) }))}
                                className="w-full bg-transparent text-4xl font-serif text-text-primary outline-none pr-12"
                            />
                            <span className="absolute right-0 bottom-2 text-xs font-bold text-text-muted uppercase">Hours</span>
                        </div>
                    </div>
                    <div className="bg-bg-primary p-8 rounded-[2.5rem] border border-border shadow-sm space-y-4">
                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1">Daily Upper Limit</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={localConfig.maxHoursPerDay}
                                onChange={(e) => setLocalConfig(s => ({ ...s, maxHoursPerDay: Number(e.target.value) }))}
                                className="w-full bg-transparent text-4xl font-serif text-text-primary outline-none pr-12"
                            />
                            <span className="absolute right-0 bottom-2 text-xs font-bold text-text-muted uppercase">Hours</span>
                        </div>
                    </div>
                    <div className="bg-bg-primary p-8 rounded-[2.5rem] border border-border shadow-sm space-y-4">
                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1">Weekly Threshold</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={localConfig.maxHoursPerWeek}
                                onChange={(e) => setLocalConfig(s => ({ ...s, maxHoursPerWeek: Number(e.target.value) }))}
                                className="w-full bg-transparent text-4xl font-serif text-text-primary outline-none pr-12"
                                data-tutorial="settings-6-1"
                            />
                            <span className="absolute right-0 bottom-2 text-xs font-bold text-text-muted uppercase">Hours</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Signal & Approval Infrastructure */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-6 md:p-10 overflow-hidden relative"
            >
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />

                <div className="flex items-center gap-4 mb-10 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent">
                        <Bell className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                            Signal Infrastructure
                        </h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Node Communication & Approval Protocols</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    {[
                        { key: 'notifyOnPublish', label: 'Publication Signal', desc: 'Broadcast temporal framework to all nodes', icon: Sparkles },
                        { key: 'absenceRequestApproval', label: 'Absence Node Review', desc: 'Manual override for temporal gaps', icon: Shield },
                        { key: 'swapRequestApproval', label: 'Node Permutation Review', desc: 'Acknowledgement of shift transfers', icon: Users },
                        { key: 'overtimeEnabled', label: 'Capacity Expansion', desc: 'Allow exceeding core hour limits', icon: Zap },
                    ].map((item) => {
                        const isEnabled = localConfig[item.key as keyof PlanningConfig] as boolean;
                        return (
                            <motion.div
                                key={item.key}
                                whileHover={{ scale: 1.01, x: 4 }}
                                onClick={() => setLocalConfig(s => ({ ...s, [item.key]: !isEnabled }))}
                                className={cn(
                                    "flex items-center justify-between p-8 rounded-[2rem] border cursor-pointer transition-all duration-500 group",
                                    isEnabled
                                        ? "bg-bg-primary border-accent/30 shadow-lg shadow-accent/5"
                                        : "bg-bg-tertiary border-transparent opacity-60 hover:opacity-100"
                                )}
                                data-tutorial={item.key === 'overtimeEnabled' ? 'settings-6-2' : undefined}
                            >
                                <div className="flex items-center gap-6">
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500",
                                        isEnabled ? "bg-accent/10 text-accent" : "bg-bg-tertiary text-text-muted group-hover:bg-bg-primary group-hover:text-text-primary"
                                    )}>
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className={cn("font-serif text-lg uppercase tracking-tight leading-none mb-2 italic", isEnabled ? "text-text-primary" : "text-text-muted")}>{item.label}</p>
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
                            </motion.div>
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
                            <ShieldCheck className="w-6 h-6 transition-transform group-hover:scale-110" />
                            <div className="absolute inset-0 bg-white/40 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    )}
                    Commit Temporal State
                </motion.button>
            </div>
        </div>
    );
}
