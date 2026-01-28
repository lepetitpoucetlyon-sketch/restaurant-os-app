"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useSettings } from "@/context/SettingsContext";
import { DaySchedule, DayOfWeek } from "@/types/settings";
import {
    Clock,
    Save,
    Loader2,
    Sun,
    Moon,
    Coffee,
    Plus,
    Trash2,
    Calendar,
    ChevronRight,
    ArrowRight,
    ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";

const DAYS_CONFIG: { id: DayOfWeek; label: string; shortLabel: string }[] = [
    { id: 'monday', label: 'Lundi', shortLabel: 'Lun' },
    { id: 'tuesday', label: 'Mardi', shortLabel: 'Mar' },
    { id: 'wednesday', label: 'Mercredi', shortLabel: 'Mer' },
    { id: 'thursday', label: 'Jeudi', shortLabel: 'Jeu' },
    { id: 'friday', label: 'Vendredi', shortLabel: 'Ven' },
    { id: 'saturday', label: 'Samedi', shortLabel: 'Sam' },
    { id: 'sunday', label: 'Dimanche', shortLabel: 'Dim' },
];

interface TimeInputProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    label?: string;
    icon: any;
}

function TimeInput({ value, onChange, disabled, label, icon: Icon }: TimeInputProps) {
    return (
        <div className="relative group/time flex-1 min-w-[140px]">
            {label && (
                <span className="absolute -top-3 left-6 px-3 py-0.5 bg-neutral-900 dark:bg-accent rounded-full text-[8px] font-black text-white dark:text-bg-primary uppercase tracking-[0.2em] z-20 shadow-lg border border-white/10 dark:border-white/20 whitespace-nowrap">
                    {label}
                </span>
            )}
            <div className={cn(
                "flex items-center gap-4 px-6 h-16 bg-white dark:bg-white/[0.03] backdrop-blur-md border border-neutral-200 dark:border-white/10 rounded-[2rem] transition-all duration-500",
                !disabled && "hover:bg-white dark:hover:bg-white/[0.08] hover:border-accent/40 group-focus-within/time:border-accent group-focus-within/time:ring-4 group-focus-within/time:ring-accent/10 group-focus-within/time:bg-white dark:group-focus-within/time:bg-black",
                disabled && "opacity-20 grayscale cursor-not-allowed"
            )}>
                <div className="flex items-center gap-3 flex-1 overflow-hidden">
                    <Icon className="w-4 h-4 text-text-muted transition-colors group-focus-within/time:text-accent shrink-0" strokeWidth={2.5} />
                    <input
                        type="time"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={disabled}
                        className="bg-transparent border-none text-[15px] font-serif italic text-text-primary outline-none w-full appearance-none cursor-pointer tracking-tight"
                    />
                </div>
                <div className="w-5 h-5 rounded-full bg-neutral-100 dark:bg-white/5 flex items-center justify-center opacity-0 group-hover/time:opacity-100 transition-opacity">
                    <Clock className="w-3 h-3 text-text-muted" />
                </div>
            </div>
        </div>
    );
}

interface DayRowProps {
    day: DaySchedule;
    config: typeof DAYS_CONFIG[0];
    onChange: (updates: Partial<DaySchedule>) => void;
    index: number;
}

function DayRow({ day, config, onChange, index }: DayRowProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
                "group relative flex flex-col gap-6 lg:grid lg:grid-cols-[240px_1fr] lg:gap-12 p-6 md:p-10 rounded-[3rem] md:rounded-[4rem] border transition-all duration-700 isolate",
                day.isOpen
                    ? "bg-white/95 dark:bg-neutral-900/40 backdrop-blur-3xl border-black/5 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] z-0 hover:z-10 focus-within:z-50 focus-within:shadow-[0_40px_100px_rgba(0,0,0,0.1)] dark:focus-within:shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
                    : "bg-black/[0.02] dark:bg-white/[0.02] border-transparent opacity-40 hover:opacity-100"
            )}
        >
            {/* Day Control */}
            <div className="flex items-center justify-between lg:flex-col lg:items-start lg:justify-center py-1 gap-6">
                <div>
                    <h4 className={cn(
                        "text-3xl md:text-4xl font-serif italic uppercase tracking-tighter mb-1 transition-all duration-500",
                        day.isOpen ? "text-text-primary" : "text-text-muted/50"
                    )}>
                        {config.label}
                    </h4>
                    <p className="text-[10px] font-black text-text-muted/60 uppercase tracking-[0.3em] ml-1">
                        {day.isOpen ? "Service Actif" : "Établissement Clos"}
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-white/50 dark:bg-white/[0.05] p-2 pr-6 rounded-full border border-black/5 dark:border-white/5">
                    <button
                        onClick={() => onChange({ isOpen: !day.isOpen })}
                        className={cn(
                            "w-16 h-10 rounded-full relative transition-all duration-700 shadow-inner group/toggle overflow-hidden",
                            day.isOpen ? "bg-accent shadow-[0_0_20px_rgba(197,160,89,0.3)]" : "bg-neutral-200 dark:bg-neutral-800"
                        )}
                    >
                        <motion.div
                            animate={{ x: day.isOpen ? 26 : 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="absolute top-1.5 left-1.5 w-7 h-7 bg-white dark:bg-bg-primary rounded-full shadow-xl z-10 flex items-center justify-center"
                        >
                            <div className={cn("w-1.5 h-1.5 rounded-full transition-all duration-500", day.isOpen ? "bg-accent" : "bg-neutral-300")} />
                        </motion.div>
                        {day.isOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 bg-gradient-to-r from-accent to-[#D4AF6A] opacity-80"
                            />
                        )}
                    </button>
                    <span className={cn(
                        "text-[10px] font-black uppercase tracking-[0.2em] transition-colors",
                        day.isOpen ? "text-accent" : "text-text-muted"
                    )}>
                        {day.isOpen ? "ON" : "OFF"}
                    </span>
                </div>
            </div>

            {/* Service Grid - Improved spacing & responsiveness */}
            <div className="flex flex-col xl:flex-row gap-10 xl:gap-14 flex-1">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Lunch Segment */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 px-2">
                            <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shadow-sm border",
                                day.isOpen ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-neutral-100 dark:bg-white/5 border-transparent text-text-muted")}>
                                <Sun strokeWidth={2.5} className="w-4 h-4" />
                            </div>
                            <span className="text-[11px] font-black text-text-muted dark:text-neutral-400 uppercase tracking-[0.3em]">Matinée & Midi</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <TimeInput
                                value={day.lunchOpen || ''}
                                onChange={(v) => onChange({ lunchOpen: v })}
                                disabled={!day.isOpen}
                                icon={ArrowRight}
                                label="OUVERTURE"
                            />
                            <div className="w-6 h-px bg-neutral-200 dark:bg-white/10 shrink-0" />
                            <TimeInput
                                value={day.lunchClose || ''}
                                onChange={(v) => onChange({ lunchClose: v })}
                                disabled={!day.isOpen}
                                icon={ChevronRight}
                                label="FERMETURE"
                            />
                        </div>
                    </div>

                    {/* Dinner Segment */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 px-2">
                            <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shadow-sm border",
                                day.isOpen ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-500" : "bg-neutral-100 dark:bg-white/5 border-transparent text-text-muted")}>
                                <Moon strokeWidth={2.5} className="w-4 h-4" />
                            </div>
                            <span className="text-[11px] font-black text-text-muted dark:text-neutral-400 uppercase tracking-[0.3em]">Soirée & Cocktail</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <TimeInput
                                value={day.dinnerOpen || ''}
                                onChange={(v) => onChange({ dinnerOpen: v })}
                                disabled={!day.isOpen}
                                icon={ArrowRight}
                                label="OUVERTURE"
                            />
                            <div className="w-6 h-px bg-neutral-200 dark:bg-white/10 shrink-0" />
                            <TimeInput
                                value={day.dinnerClose || ''}
                                onChange={(v) => onChange({ dinnerClose: v })}
                                disabled={!day.isOpen}
                                icon={ChevronRight}
                                label="FERMETURE"
                            />
                        </div>
                    </div>
                </div>

                {/* Deadline Segment - Visual distinction */}
                <div className="hidden xl:block w-px h-24 bg-neutral-200 dark:bg-white/10 self-center" />
                <div className="h-px w-full bg-neutral-200 dark:bg-white/5 xl:hidden" />

                <div className="space-y-6 lg:min-w-[200px]">
                    <div className="flex items-center gap-3 px-2">
                        <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shadow-sm border",
                            day.isOpen ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-neutral-100 dark:bg-white/5 border-transparent text-text-muted")}>
                            <Coffee strokeWidth={2.5} className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-black text-text-muted dark:text-neutral-400 uppercase tracking-[0.3em]">Fermeture Cuisine</span>
                    </div>
                    <TimeInput
                        value={day.lastKitchenOrder || ''}
                        onChange={(v) => onChange({ lastKitchenOrder: v })}
                        disabled={!day.isOpen}
                        icon={Clock}
                        label="DERNIÈRE COMMANDE"
                    />
                </div>
            </div>
        </motion.div>
    );
}

export default function HoursSettings() {
    const { settings, updateSchedule, updateService, addClosedPeriod, deleteClosedPeriod, isSaving } = useSettings();
    const [schedule, setSchedule] = useState<DaySchedule[]>(settings.schedule);
    const [service, setService] = useState(settings.service);
    const [newPeriod, setNewPeriod] = useState({ startDate: '', endDate: '', reason: '' });

    if (!settings) return null;

    useEffect(() => {
        if (settings) {
            setSchedule(settings.schedule);
            setService(settings.service);
        }
    }, [settings]);

    const handleDayChange = (dayId: DayOfWeek, updates: Partial<DaySchedule>) => {
        setSchedule(prev =>
            prev.map(d => d.day === dayId ? { ...d, ...updates } : d)
        );
    };

    const handleSave = async () => {
        await updateSchedule(schedule);
        await updateService(service);
    };

    const handleAddClosedPeriod = async () => {
        if (newPeriod.startDate && newPeriod.endDate && newPeriod.reason) {
            await addClosedPeriod({ ...newPeriod, isAnnual: false });
            setNewPeriod({ startDate: '', endDate: '', reason: '' });
        }
    };

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
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <motion.div
            variants={cinematicContainer}
            initial="hidden"
            animate="visible"
            className="space-y-12 pb-20"
        >
            {/* Weekly Schedule Matrix */}
            <motion.div
                variants={cinematicItem}
                className="space-y-6"
            >
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-4">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 10 }}
                            className="w-14 h-14 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center border border-black/5 dark:border-white/10 text-accent shadow-premium"
                        >
                            <Clock className="w-7 h-7" />
                        </motion.div>
                        <div>
                            <h3 className="text-3xl font-serif text-text-primary uppercase tracking-tighter italic">
                                Matrice des Opérations Hebdomadaires
                            </h3>
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] ml-1">Configuration de l'Infrastructure Temporelle</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {DAYS_CONFIG.map((config, index) => {
                        const day = schedule.find(d => d.day === config.id) || {
                            day: config.id,
                            isOpen: false,
                        };
                        return (
                            <DayRow
                                key={config.id}
                                index={index}
                                day={day}
                                config={config}
                                onChange={(updates) => handleDayChange(config.id, updates)}
                            />
                        );
                    })}
                </div>
            </motion.div>

            {/* Critical Dynamics */}
            <motion.div
                variants={cinematicItem}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-6 md:p-10"
            >
                <div className="flex items-center gap-4 mb-10">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: -10 }}
                        className="w-14 h-14 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center border border-black/5 dark:border-white/10 text-accent shadow-premium"
                    >
                        <ShieldAlert className="w-7 h-7" />
                    </motion.div>
                    <div>
                        <h3 className="text-3xl font-serif text-text-primary uppercase tracking-tighter italic">
                            Vélocités Opérationnelles
                        </h3>
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] ml-1">Optimisation des Flux & Marges de Sécurité</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { label: 'Durée Moyenne Midi', key: 'avgMealDurationLunch', value: service.avgMealDurationLunch },
                        { label: 'Durée Moyenne Soir', key: 'avgMealDurationDinner', value: service.avgMealDurationDinner },
                        { label: 'Dernière Arrivée Autorisée', key: 'lastArrivalBeforeClose', value: service.lastArrivalBeforeClose },
                    ].map((item) => (
                        <div key={item.key} className="space-y-3">
                            <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1">
                                {item.label}
                            </label>
                            <div className="relative group/input">
                                <input
                                    type="number"
                                    value={item.value}
                                    onChange={(e) => setService(s => ({ ...s, [item.key]: Number(e.target.value) }))}
                                    className="w-full px-6 py-5 bg-bg-primary border border-border rounded-2xl text-text-primary font-serif italic outline-none text-xl shadow-sm focus:border-accent/50 transition-colors"
                                />
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-text-muted uppercase">Minutes</span>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Temporal Exceptions */}
            <motion.div
                variants={cinematicItem}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-6 md:p-10 overflow-hidden relative"
            >
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />

                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4 relative z-10">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 180 }}
                            className="w-14 h-14 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center border border-black/5 dark:border-white/10 text-accent shadow-premium"
                        >
                            <Calendar className="w-7 h-7" />
                        </motion.div>
                        <div>
                            <h3 className="text-3xl font-serif text-text-primary uppercase tracking-tighter italic">
                                Interruptions Temporelles
                            </h3>
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] ml-1">Calibration des Fenêtres de Service Exceptionnelles</p>
                        </div>
                    </div>
                </div>

                {/* Exceptional Entry */}
                <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 p-4 bg-bg-primary rounded-[2rem] border border-border shadow-inner mb-8">
                    <div className="space-y-2">
                        <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest px-2">Date de Début</label>
                        <input
                            type="date"
                            value={newPeriod.startDate}
                            onChange={(e) => setNewPeriod(p => ({ ...p, startDate: e.target.value }))}
                            className="w-full px-5 py-4 bg-bg-tertiary border border-border text-sm font-serif italic outline-none focus:border-accent/50 transition-colors text-text-primary rounded-xl"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest px-2">Date de Fin</label>
                        <input
                            type="date"
                            value={newPeriod.endDate}
                            onChange={(e) => setNewPeriod(p => ({ ...p, endDate: e.target.value }))}
                            className="w-full px-5 py-4 bg-bg-tertiary border border-border text-sm font-serif italic outline-none focus:border-accent/50 transition-colors text-text-primary rounded-xl"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest px-2">Motif de Fermeture</label>
                        <input
                            type="text"
                            value={newPeriod.reason}
                            onChange={(e) => setNewPeriod(p => ({ ...p, reason: e.target.value }))}
                            placeholder="Ex : Travaux de Rénovation"
                            className="w-full px-5 py-4 bg-bg-tertiary border border-border text-sm font-serif italic outline-none focus:border-accent/50 transition-colors text-text-primary rounded-xl"
                        />
                    </div>
                    <div className="pt-5.5 flex items-end mb-1">
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddClosedPeriod}
                            className="w-14 h-14 bg-accent text-bg-primary rounded-2xl flex items-center justify-center shadow-lg hover:bg-accent/90 transition-colors"
                        >
                            <Plus className="w-6 h-6" />
                        </motion.button>
                    </div>
                </div>

                {/* Exception List */}
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {settings.closedPeriods.map(period => (
                            <motion.div
                                key={period.id}
                                layoutId={period.id}
                                initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                                className="flex items-center justify-between p-6 bg-rose-500/5 backdrop-blur-md rounded-[2rem] border border-rose-500/10 shadow-sm"
                            >
                                <div className="flex items-center gap-8">
                                    <div className="flex items-center gap-4">
                                        <div className="text-center">
                                            <div className="text-xl font-serif font-bold text-rose-600 tracking-tighter">
                                                {new Date(period.startDate).toLocaleDateString('fr-FR', { day: '2-digit' })}
                                            </div>
                                            <div className="text-[9px] font-bold text-rose-400 uppercase">{new Date(period.startDate).toLocaleDateString('fr-FR', { month: 'short' })}</div>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-rose-200" />
                                        <div className="text-center">
                                            <div className="text-xl font-serif font-bold text-rose-600 tracking-tighter">
                                                {new Date(period.endDate).toLocaleDateString('fr-FR', { day: '2-digit' })}
                                            </div>
                                            <div className="text-[9px] font-bold text-rose-400 uppercase">{new Date(period.endDate).toLocaleDateString('fr-FR', { month: 'short' })}</div>
                                        </div>
                                    </div>
                                    <div className="w-px h-10 bg-rose-500/20" />
                                    <div>
                                        <div className="text-sm font-serif font-bold text-text-primary uppercase tracking-tight italic">{period.reason}</div>
                                        <div className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">
                                            Durée : {Math.ceil((new Date(period.endDate).getTime() - new Date(period.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} Jours
                                        </div>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => deleteClosedPeriod(period.id)}
                                    className="p-3 text-rose-500 rounded-xl transition-all"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </motion.button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {settings.closedPeriods.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed border-border/50 rounded-[2.5rem]">
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Aucun Protocole d'Exception Détecté</p>
                        </div>
                    )}
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
                    className="flex items-center gap-3 px-10 py-5 bg-text-primary text-bg-primary rounded-[1.5rem] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all disabled:opacity-50 group border border-border"
                >
                    {isSaving ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <div className="relative">
                            <Save className="w-5 h-5 transition-transform group-hover:scale-110" />
                            <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    )}
                    Synchroniser les Protocoles
                </motion.button>
            </motion.div>
        </motion.div>
    );
}
