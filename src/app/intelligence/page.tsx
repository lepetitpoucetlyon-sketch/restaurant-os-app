"use client";

import { useState } from "react";
import {
    BrainCircuit,
    MessageSquare,
    ShieldCheck,
    Wrench,
    TrendingUp,
    AreaChart,
    ChevronRight,
    Search,
    RefreshCw,
    Settings,
    Star,
    AlertTriangle,
    CheckCircle2,
    ArrowUpRight,
    Zap,
    Thermometer,
    Activity,
    Factory,
    DollarSign,
    Target,
    Clock,
    BookOpen,
    X,
    Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIntelligence } from "@/context/IntelligenceContext";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import { SimulationModal } from "@/components/modals/SimulationModal";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks";
import { BottomSheet } from "@/components/ui/BottomSheet";

type TabId = 'reputation' | 'hr' | 'iot' | 'profitability' | 'simulator';

export default function IntelligencePage() {
    const router = useRouter();
    const isMobile = useIsMobile();
    const {
        reviews,
        complianceAlerts,
        equipmentMetrics,
        predictiveAlerts,
        profitabilityAlerts,
        runSimulation
    } = useIntelligence();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<TabId>('reputation');
    const [showSimulationSheet, setShowSimulationSheet] = useState(false);

    return (
        <div className="flex flex-1 flex-col bg-bg-primary h-[calc(100vh-80px)] lg:h-[calc(100vh-100px)] -m-4 lg:-m-8 overflow-hidden relative pb-24 lg:pb-0">
            {/* Header & Categories Swiper */}
            <div className="bg-white/80 dark:bg-bg-primary/80 backdrop-blur-2xl px-6 py-6 border-b border-border/50 sticky top-0 z-40">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-4xl font-serif font-black italic text-text-primary tracking-tight">Oracle<span className="text-accent-gold">.</span></h1>
                        <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] mt-1">Intelligence Nerveuse Centralisée</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-bg-tertiary flex items-center justify-center border border-border">
                        <Cpu className="w-5 h-5 text-accent-gold" />
                    </div>
                </div>

                {/* Navigation Swiper */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                    {[
                        { id: 'reputation', label: 'Sentiment', icon: MessageSquare },
                        { id: 'hr', label: 'Légalité', icon: ShieldCheck },
                        { id: 'iot', label: 'Maintenance', icon: Wrench },
                        { id: 'profitability', label: 'Marge', icon: TrendingUp },
                        { id: 'simulator', label: 'Simulateur', icon: AreaChart },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabId)}
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
                    {activeTab === 'reputation' && (
                        <motion.div key="reputation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white dark:bg-bg-secondary p-6 rounded-[2.5rem] border border-border/50">
                                    <h4 className="text-[8px] font-black uppercase tracking-widest text-text-muted mb-2">Score Global</h4>
                                    <div className="text-4xl font-serif font-black italic">4.8<span className="text-lg opacity-40">/5</span></div>
                                </div>
                                <div className="bg-white dark:bg-bg-secondary p-6 rounded-[2.5rem] border border-border/50">
                                    <h4 className="text-[8px] font-black uppercase tracking-widest text-text-muted mb-2">Avis Noirs</h4>
                                    <div className="text-4xl font-serif font-black italic text-error">{reviews.filter(r => !r.replied).length}</div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {reviews.map(review => (
                                    <div key={review.id} className="bg-white dark:bg-bg-secondary p-6 rounded-[2.5rem] border border-border/50">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center font-bold">{review.author[0]}</div>
                                            <div>
                                                <p className="text-sm font-bold uppercase tracking-tight">{review.author}</p>
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, i) => <Star key={i} className={cn("w-2 h-2", i < review.rating ? "text-accent-gold fill-accent-gold" : "text-border")} />)}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm italic font-serif leading-relaxed text-text-secondary opacity-80 mb-4">"{review.content}"</p>
                                        {review.suggestedReply && (
                                            <div className="bg-bg-tertiary/50 p-4 rounded-2xl border border-accent-gold/10">
                                                <p className="text-[10px] uppercase font-black tracking-widest text-accent-gold mb-2">Oracle Brain :</p>
                                                <p className="text-xs italic opacity-70 mb-3">{review.suggestedReply}</p>
                                                <Button size="sm" className="h-9 w-full bg-text-primary text-white rounded-xl text-[8px] font-black uppercase tracking-widest">Approuver la Réponse</Button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'hr' && (
                        <motion.div key="hr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <div className="bg-error/10 p-6 rounded-[2.5rem] border border-error/20 flex items-center gap-4">
                                <AlertTriangle className="w-10 h-10 text-error" />
                                <div>
                                    <h3 className="text-xl font-serif font-black italic text-error">Anomalie Convention</h3>
                                    <p className="text-[9px] font-black uppercase opacity-60">Réajustement légal requis</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {complianceAlerts.map(alert => (
                                    <div key={alert.id} className="bg-white dark:bg-bg-secondary p-6 rounded-[2.5rem] border border-border/50">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-lg font-serif font-bold italic">{alert.userName}</h4>
                                            <div className="px-2 py-0.5 bg-error text-white text-[7px] font-black uppercase rounded-full">Violation</div>
                                        </div>
                                        <p className="text-xs text-text-muted mb-4 leading-relaxed">{alert.message}</p>
                                        <Button className="w-full h-11 bg-bg-tertiary text-text-primary rounded-xl text-[8px] font-black uppercase tracking-widest" onClick={() => router.push('/planning')}>Corriger au Planning</Button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'iot' && (
                        <motion.div key="iot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                {equipmentMetrics.map(m => (
                                    <div key={m.id} className="bg-white dark:bg-bg-secondary p-6 rounded-[2.5rem] border border-border/50">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", m.anomalous ? "bg-error/10 text-error" : "bg-success/10 text-success")}>
                                                {m.type === 'temperature' ? <Thermometer className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                                            </div>
                                            <span className="text-[8px] font-black uppercase tracking-widest truncate">{m.name}</span>
                                        </div>
                                        <div className="text-3xl font-serif font-black italic">{m.value}{m.type === 'temperature' ? '°' : 'Hz'}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-text-primary p-8 rounded-[3rem] text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/20 blur-[60px]" />
                                <h3 className="text-2xl font-serif italic font-black mb-2">Prédictif</h3>
                                <p className="text-sm opacity-60 font-light mb-6 leading-relaxed">Oracle détecte une usure prématurée sur le groupe froid n°4. Maintenance préventive suggérée.</p>
                                <Button className="w-full h-14 bg-accent-gold text-bg-primary rounded-2xl text-[9px] font-black uppercase tracking-widest">Planifier Technicien</Button>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'profitability' && (
                        <motion.div key="profitability" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            {profitabilityAlerts.map(alert => (
                                <div key={alert.productId} className="bg-gray-50 dark:bg-bg-secondary p-6 rounded-[2.5rem] border border-border/50">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h4 className="text-xl font-serif font-black italic">{alert.productName}</h4>
                                            <p className="text-[9px] font-black text-error uppercase tracking-widest mt-1">Marge sous le seuil ({alert.currentMargin}%)</p>
                                        </div>
                                        <TrendingUp className="w-6 h-6 text-error" />
                                    </div>
                                    <div className="flex items-end justify-between bg-bg-tertiary p-5 rounded-3xl">
                                        <div>
                                            <p className="text-[8px] font-black uppercase opacity-40 mb-1">Prix Suggéré</p>
                                            <div className="text-3xl font-serif italic text-accent-gold font-black">{alert.suggestedPrice.toFixed(2)}€</div>
                                        </div>
                                        <Button className="h-11 px-8 bg-text-primary text-white rounded-xl text-[9px] font-black uppercase tracking-widest">Appliquer</Button>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'simulator' && (
                        <motion.div key="simulator" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center space-y-8">
                            <div className="w-32 h-32 rounded-[3rem] bg-accent-gold/10 flex items-center justify-center text-accent-gold relative">
                                <AreaChart className="w-16 h-16" strokeWidth={1} />
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-2 border-dashed border-accent-gold/40 rounded-[3rem]" />
                            </div>
                            <div className="max-w-[280px]">
                                <h2 className="text-3xl font-serif font-black italic mb-2">Simulateur Alpha</h2>
                                <p className="text-sm font-light text-text-muted leading-relaxed">Lancez des scénarios de jumeau numérique pour valider vos décisions stratégiques.</p>
                            </div>
                            <Button
                                onClick={() => setShowSimulationSheet(true)}
                                className="h-16 px-12 bg-text-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all"
                            >
                                Configurer Simulation
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Simulation BottomSheet */}
            <BottomSheet
                isOpen={showSimulationSheet}
                onClose={() => setShowSimulationSheet(false)}
                title="Simulation Engine"
                subtitle="Jumeau Numérique / Scenario Builder"
            >
                <div className="space-y-8 py-6">
                    <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-widest text-text-muted px-2">Type de Scénario</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['Augmentation Prix', 'Nouveau Menu', 'Events', 'Coupure Réseau'].map(s => (
                                <button key={s} className="h-14 rounded-2xl bg-bg-tertiary border border-border text-[10px] font-black uppercase text-text-muted hover:bg-bg-primary transition-all">{s}</button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-text-muted px-2">Impact Estimé</label>
                        <input type="range" className="w-full accent-accent-gold" />
                    </div>
                    <Button onClick={() => setShowSimulationSheet(false)} className="w-full h-16 bg-accent-gold text-bg-primary rounded-2xl text-[10px] font-black uppercase tracking-widest">Lancer l'Analyse</Button>
                </div>
            </BottomSheet>
        </div>
    );
}
