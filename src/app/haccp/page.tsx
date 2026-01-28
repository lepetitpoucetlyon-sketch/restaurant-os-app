"use client";

import { useState } from "react";
import {
    ShieldCheck,
    Thermometer,
    ClipboardCheck,
    History,
    AlertTriangle,
    Trash2,
    Plus,
    ChevronRight,
    Search,
    RefreshCw,
    Activity,
    Wind,
    Droplets,
    FileText,
    CheckCircle2,
    Clock,
    Zap
} from "lucide-react";
import { useHACCP } from "@/context/HACCPContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "@/context/NotificationsContext";
import { useAuth } from "@/context/AuthContext";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { useIsMobile } from "@/hooks";

export default function HACCPPage() {
    const isMobile = useIsMobile();
    const {
        sensors,
        checklists,
        toggleChecklistItem,
        resetDailyChecklist,
        getComplianceScore,
        temperatureHistory,
        logWaste
    } = useHACCP();
    const { addNotification } = useNotifications();

    const [activeTab, setActiveTab] = useState<'monitoring' | 'logbook' | 'waste' | 'history'>('monitoring');
    const [showWasteSheet, setShowWasteSheet] = useState(false);

    const complianceScore = getComplianceScore();

    return (
        <div className="flex flex-1 flex-col bg-bg-primary h-[calc(100vh-80px)] lg:h-[calc(100vh-100px)] -m-4 lg:-m-8 overflow-hidden relative pb-24 lg:pb-0">
            {/* Header & Score */}
            <div className="bg-white/80 dark:bg-bg-primary/80 backdrop-blur-2xl px-6 py-6 border-b border-border/50 z-40">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-4xl font-serif font-black italic text-text-primary tracking-tight">HACCP<span className="text-accent-gold">.</span></h1>
                        <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] mt-1">Conformité Intelligente</p>
                    </div>
                    <div className="flex items-center gap-3 bg-bg-tertiary px-4 py-3 rounded-2xl border border-border">
                        <Zap className="w-4 h-4 text-accent-gold" />
                        <span className="text-2xl font-serif font-black italic">{complianceScore}%</span>
                    </div>
                </div>

                {/* Navigation Swiper */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                    {[
                        { id: 'monitoring', label: 'Capsules IoT', icon: Activity },
                        { id: 'logbook', label: 'Journal', icon: ClipboardCheck },
                        { id: 'waste', label: 'Pertes', icon: Trash2 },
                        { id: 'history', label: 'Archives', icon: History },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "flex items-center gap-2 h-11 px-6 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                                activeTab === tab.id ? "bg-text-primary text-white shadow-xl scale-105" : "bg-bg-tertiary text-text-muted"
                            )}
                        >
                            <tab.icon className="w-3.5 h-3.5" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto p-4 space-y-6 elegant-scrollbar">
                <AnimatePresence mode="wait">
                    {activeTab === 'monitoring' && (
                        <motion.div key="monitoring" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            {/* Horizontal Sensor Swiper on mobile */}
                            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-1">
                                {sensors.map(sensor => (
                                    <div key={sensor.id} className="min-w-[280px] bg-white dark:bg-bg-secondary p-8 rounded-[3rem] border border-border/50 shadow-soft relative overflow-hidden">
                                        <div className={cn("absolute top-0 right-0 w-2 h-full", sensor.status === 'alert' ? "bg-error" : "bg-success")} />
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center">
                                                {sensor.type === 'temperature' ? <Thermometer className="w-6 h-6 text-accent-gold" /> : <Droplets className="w-6 h-6 text-blue-500" />}
                                            </div>
                                            <div className="text-4xl font-serif font-black italic text-text-primary">{sensor.value}{sensor.type === 'temperature' ? '°' : '%'}</div>
                                        </div>
                                        <h4 className="text-sm font-bold uppercase tracking-tight">{sensor.name}</h4>
                                        <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mt-1">Protocole Normal</p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white dark:bg-bg-secondary p-6 rounded-[2.5rem] border border-border/50">
                                <h3 className="text-xl font-serif italic font-black mb-4">Analyse Thermique</h3>
                                <div className="h-40 w-full flex items-end gap-1 px-2">
                                    {temperatureHistory.slice(0, 15).map((log, i) => (
                                        <div key={i} className={cn("flex-1 rounded-full", log.isCompliant ? "bg-accent-gold/40" : "bg-error/40")} style={{ height: `${(log.temperature + 5) * 4}%` }} />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'logbook' && (
                        <motion.div key="logbook" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                            {checklists.map(item => (
                                <div
                                    key={item.id}
                                    onClick={() => toggleChecklistItem(item.id)}
                                    className={cn(
                                        "p-6 rounded-[2rem] border transition-all flex items-center gap-5",
                                        item.completed ? "bg-success-soft/30 border-success/10" : "bg-white dark:bg-bg-secondary border-border"
                                    )}
                                >
                                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border", item.completed ? "bg-success text-white border-transparent" : "bg-bg-tertiary text-text-muted border-border")}>
                                        <CheckCircle2 strokeWidth={3} className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <p className={cn("text-sm font-bold uppercase tracking-tight", item.completed && "opacity-40 line-through")}>{item.task}</p>
                                        <span className="text-[8px] font-black text-text-muted uppercase tracking-widest">{item.frequency}</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-text-muted opacity-30" />
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'waste' && (
                        <motion.div key="waste" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            <div className="flex justify-between items-center px-2">
                                <h3 className="text-xl font-serif italic font-black">Historique des Pertes</h3>
                                <button onClick={() => setShowWasteSheet(true)} className="w-10 h-10 rounded-full bg-error text-white flex items-center justify-center shadow-lg">
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { item: 'Filet de Bar', qty: '2.5kg', cost: '145€', reason: 'Expiration' },
                                    { item: 'Crème Liquide', qty: '12L', cost: '42€', reason: 'Rupture Froid' }
                                ].map((w, i) => (
                                    <div key={i} className="bg-white dark:bg-bg-secondary p-5 rounded-[2rem] border border-border/50 flex items-center justify-between">
                                        <div>
                                            <h4 className="text-lg font-serif italic font-black text-text-primary">{w.item}</h4>
                                            <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">{w.reason}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-serif italic font-black text-error">{w.cost}</p>
                                            <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">{w.qty}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Waste Declaration BottomSheet */}
            <BottomSheet
                isOpen={showWasteSheet}
                onClose={() => setShowWasteSheet(false)}
                title="Déclaration de Perte"
                subtitle="Enregistrement journalier des non-conformités"
            >
                <div className="space-y-8 py-6">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-text-muted px-2">Référence Produit</label>
                        <input type="text" className="w-full h-14 bg-bg-tertiary rounded-2xl px-6 font-bold" placeholder="EX: FILET DE BAR" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-text-muted px-2">Quantité</label>
                            <input type="number" className="w-full h-14 bg-bg-tertiary rounded-2xl px-6 font-bold" placeholder="0.00" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-text-muted px-2">Unité</label>
                            <select className="w-full h-14 bg-bg-tertiary rounded-2xl px-6 font-bold appearance-none">
                                <option>kg</option>
                                <option>Litre</option>
                                <option>Unité</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-text-muted px-2">Motif</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['Expiration', 'Brisé', 'Coupure Froid', 'Erreur Prép'].map(m => (
                                <button key={m} className="h-12 rounded-xl bg-bg-tertiary text-text-muted text-[9px] font-black uppercase border border-border hover:bg-bg-primary transition-all">{m}</button>
                            ))}
                        </div>
                    </div>
                    <Button onClick={() => setShowWasteSheet(false)} className="w-full h-16 bg-error text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-error/20">
                        Homologuer la Perte
                    </Button>
                </div>
            </BottomSheet>
        </div>
    );
}
