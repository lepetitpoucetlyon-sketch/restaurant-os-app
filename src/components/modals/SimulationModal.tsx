"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import {
    Cpu,
    ArrowRight,
    TrendingUp,
    DollarSign,
    Clock,
    Users,
    Maximize,
    Megaphone,
    CheckCircle2,
    AlertTriangle,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    Loader2,
    Sparkles,
    Zap,
    X,
    Target
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SimulationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRun: (config: any) => void;
}

type ScenarioType = 'pricing' | 'hours' | 'staff' | 'capacity' | 'marketing';

const SCENARIOS: { id: ScenarioType; label: string; icon: any; color: string; desc: string }[] = [
    { id: 'pricing', label: 'Stratégie Prix', icon: DollarSign, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', desc: 'Tester l\'élasticité prix et l\'impact sur la marge brute.' },
    { id: 'hours', label: 'Horaires', icon: Clock, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', desc: 'Simuler l\'ouverture sur de nouveaux créneaux d\'exploitation.' },
    { id: 'staff', label: 'Staffing', icon: Users, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20', desc: 'Optimiser la masse salariale vs qualité de service.' },
    { id: 'capacity', label: 'Capacité', icon: Maximize, color: 'text-orange-500 bg-orange-500/10 border-orange-500/20', desc: 'Simuler l\'ajout de tables ou extension de terrasse.' },
    { id: 'marketing', label: 'Campagne', icon: Megaphone, color: 'text-pink-500 bg-pink-500/10 border-pink-500/20', desc: 'ROI estimé d\'une action promotionnelle ciblée.' },
];

export function SimulationModal({ isOpen, onClose, onRun }: SimulationModalProps) {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [selectedType, setSelectedType] = useState<ScenarioType | null>(null);
    const [isSimulating, setIsSimulating] = useState(false);
    const [config, setConfig] = useState({
        name: '',
        param1: 0, // Generic param (e.g., % price increase)
        param2: 0  // Generic param
    });

    const handleRunSimulation = () => {
        if (!selectedType) return;
        setIsSimulating(true);

        // Fake simulation delay
        setTimeout(() => {
            setIsSimulating(false);
            setStep(3);
            onRun({ type: selectedType, ...config });
        }, 2000);
    };

    const reset = () => {
        setStep(1);
        setSelectedType(null);
        setConfig({ name: '', param1: 0, param2: 0 });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => { onClose(); setTimeout(reset, 300); }}
            size="xl"
            className="p-0 border-none bg-transparent"
            showClose={false}
            noPadding
        >
            <div className="flex flex-col h-[80vh] bg-bg-primary rounded-[3rem] overflow-hidden shadow-[0_32px_128px_rgba(0,0,0,0.4)] border border-white/20">
                {/* Premium Animated Header */}
                <div className="px-12 py-10 bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] text-white relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,215,100,0.15),transparent)]" />
                    </div>

                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <div className="w-16 h-16 rounded-3xl bg-accent flex items-center justify-center shadow-xl shadow-accent/20">
                                <Cpu className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-serif font-black tracking-tight flex items-center gap-3">
                                    Simulateur Digital Twin
                                    <Sparkles className="w-5 h-5 text-accent animate-pulse" />
                                </h2>
                                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mt-1">
                                    Intelligence Prédictive pour Optimisation de l'Exploitation
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-all"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Stepper Logic */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                        <motion.div
                            className="h-full bg-accent shadow-[0_0_15px_rgba(0,215,100,0.5)]"
                            initial={{ width: "33.33%" }}
                            animate={{ width: step === 1 ? "33.33%" : step === 2 ? "66.66%" : "100%" }}
                            transition={{ duration: 0.6, ease: "circOut" }}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto elegant-scrollbar p-12">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-10"
                            >
                                <div className="text-center space-y-2">
                                    <h3 className="text-2xl font-serif font-black text-text-primary italic">Quel axe stratégique souhaitez-vous projeter ?</h3>
                                    <p className="text-text-muted text-sm">Sélectionnez une dimension pour paramétrer votre jumeau numérique d'établissement.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6" data-tutorial="intelligence-0-0-2">
                                    {SCENARIOS.map((scenario) => (
                                        <motion.button
                                            key={scenario.id}
                                            whileHover={{ y: -8 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setSelectedType(scenario.id)}
                                            className={cn(
                                                "flex flex-col items-center p-8 rounded-[2.5rem] border-2 transition-all duration-300 text-center relative overflow-hidden group",
                                                selectedType === scenario.id
                                                    ? "bg-bg-secondary border-accent shadow-2xl shadow-accent/10"
                                                    : "bg-white dark:bg-bg-secondary border-border hover:border-text-secondary/30"
                                            )}
                                        >
                                            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", scenario.color)}>
                                                <scenario.icon strokeWidth={1.5} className="w-7 h-7" />
                                            </div>
                                            <h4 className="font-black text-[10px] uppercase tracking-widest text-text-primary mb-3">{scenario.label}</h4>
                                            <p className="text-[11px] text-text-muted leading-relaxed italic">{scenario.desc}</p>

                                            {selectedType === scenario.id && (
                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 right-4 text-accent">
                                                    <CheckCircle2 className="w-6 h-6" />
                                                </motion.div>
                                            )}
                                        </motion.button>
                                    ))}
                                </div>

                                <div className="flex justify-center pt-8">
                                    <Button
                                        onClick={() => setStep(2)}
                                        disabled={!selectedType}
                                        className="h-16 px-12 bg-accent hover:bg-black text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-accent/20 transition-all transform hover:scale-[1.02]"
                                    >
                                        Configurer les Paramètres <ArrowRight className="ml-3 w-4 h-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && selectedType && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-10"
                            >
                                <div className="flex items-center gap-6">
                                    <button onClick={() => setStep(1)} className="w-12 h-12 rounded-xl bg-bg-tertiary hover:bg-border flex items-center justify-center transition-all">
                                        <X className="w-5 h-5 text-text-muted" />
                                    </button>
                                    <div>
                                        <h3 className="text-2xl font-serif font-black text-text-primary">Paramétrage : {SCENARIOS.find(s => s.id === selectedType)?.label}</h3>
                                        <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em]">Définition des variables de simulation</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                    <div className="space-y-10">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-4">Identification du Scénario</label>
                                            <input
                                                type="text"
                                                data-tutorial="intelligence-0-1-0"
                                                placeholder="Ex: Optimisation Yield Management Hiver..."
                                                className="w-full h-16 px-8 bg-white dark:bg-bg-secondary rounded-3xl border-2 border-border focus:border-accent font-serif font-black text-lg outline-none transition-all placeholder:text-text-muted/30"
                                                value={config.name}
                                                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                                            />
                                        </div>

                                        {selectedType === 'pricing' && (
                                            <div className="bg-white dark:bg-bg-secondary p-10 rounded-[3rem] border border-border shadow-sm space-y-8">
                                                <div className="space-y-6">
                                                    <div className="flex justify-between items-center">
                                                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Variation Tarifaire Cible</label>
                                                        <span className="text-3xl font-serif font-black text-accent">{config.param1 > 0 ? '+' : ''}{config.param1}%</span>
                                                    </div>
                                                    <input
                                                        type="range"
                                                        data-tutorial="intelligence-0-1-1"
                                                        min="-20"
                                                        max="50"
                                                        step="1"
                                                        value={config.param1}
                                                        onChange={(e) => setConfig({ ...config, param1: parseInt(e.target.value) })}
                                                        className="w-full h-2 bg-bg-tertiary rounded-lg appearance-none cursor-pointer accent-accent"
                                                    />
                                                    <div className="flex justify-between text-[10px] text-text-muted font-black tracking-widest">
                                                        <span>DÉFLATION (-20%)</span>
                                                        <span>STATU QUO</span>
                                                        <span>OFFENSIF (+50%)</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {selectedType !== 'pricing' && (
                                            <div className="p-12 bg-bg-tertiary border-2 border-dashed border-border rounded-[3.5rem] flex flex-col items-center justify-center text-center space-y-4 text-text-muted">
                                                <Zap className="w-10 h-10 opacity-20" />
                                                <p className="font-bold italic text-sm">Modules haute-précision pour {selectedType} en cours de synchronisation.<br />Les moteurs de calcul par défaut seront activés.</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-bg-secondary rounded-[3.5rem] border border-border p-10 shadow-inner relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16" />
                                        <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-10">Moteurs IA en Action</h4>
                                        <ul className="space-y-8">
                                            {[
                                                { icon: Target, label: 'Élasticité du Chiffre d\'Affaires', desc: 'Basée sur l\'historique transactionnel (2022-2025).' },
                                                { icon: TrendingUp, label: 'Projection de la Marge Nette', desc: 'Ajustement automatique des coûts matières volatils.' },
                                                { icon: Users, label: 'Satisfaction & Fidélité Client', desc: 'Impact psychologique estimé par analyse lexicale.' },
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-start gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-bg-tertiary flex items-center justify-center shadow-sm border border-border/50 shrink-0">
                                                        <item.icon className="w-5 h-5 text-accent" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-text-primary uppercase tracking-tight">{item.label}</p>
                                                        <p className="text-xs text-text-muted mt-1 leading-relaxed">{item.desc}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="flex justify-center pt-8">
                                    <Button
                                        onClick={handleRunSimulation}
                                        disabled={config.name.length < 3 || isSimulating}
                                        data-tutorial="intelligence-0-2-0"
                                        className="h-16 px-16 bg-accent hover:bg-black text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-accent/20 transition-all flex items-center min-w-[280px]"
                                    >
                                        {isSimulating ? (
                                            <>
                                                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                                Génération du Jumeau Numérique...
                                            </>
                                        ) : (
                                            <>
                                                Lancer la Simulation <Cpu className="ml-3 w-5 h-5" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-10"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-success/10 text-success flex items-center justify-center border border-success/20">
                                            <CheckCircle2 className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-serif font-black text-text-primary">Projection IA : {config.name}</h3>
                                            <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em] mt-1">Données basées sur les 36 derniers mois d'exploitation</p>
                                        </div>
                                    </div>
                                    <div className="px-6 py-3 bg-accent/5 border border-accent/20 rounded-2xl">
                                        <span className="text-[10px] font-black text-accent uppercase tracking-widest block mb-1">Indice de Confiance</span>
                                        <span className="text-2xl font-serif font-black text-text-primary">94.8%</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {[
                                        { label: 'Impact Revenus (Mois)', value: '+4,250€', sub: '+12.5%', icon: ArrowUpRight, color: 'text-success' },
                                        { label: 'Marge Nette Projetée', value: '22.4%', sub: '+1.8 pts', icon: TrendingUp, color: 'text-success' },
                                        { label: 'Risque Volatilité Client', value: 'Critique', sub: 'Faible', icon: AlertTriangle, color: 'text-warning' },
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white dark:bg-bg-secondary p-8 rounded-[2.5rem] border border-border shadow-soft relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-20 h-20 bg-bg-tertiary rounded-full -mr-10 -mt-10 group-hover:bg-accent/5 transition-colors" />
                                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-4 relative z-10">{stat.label}</p>
                                            <div className="flex items-baseline gap-3 relative z-10">
                                                <span className="text-4xl font-serif font-black text-text-primary">{stat.value}</span>
                                                <span className={cn("flex items-center text-xs font-black", stat.color)}>
                                                    <stat.icon className="w-3.5 h-3.5 mr-1" /> {stat.sub}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Custom Chart Area */}
                                <div className="bg-white dark:bg-bg-secondary p-10 rounded-[3.5rem] border border-border shadow-soft relative overflow-hidden">
                                    <div className="flex items-center justify-between mb-10">
                                        <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                                            <BarChart3 className="w-4 h-4" /> Analyse Prédictive Semestrielle
                                        </h4>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-accent" />
                                                <span className="text-[9px] font-black text-text-muted uppercase tracking-wider">Scénario Testé</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-bg-tertiary" />
                                                <span className="text-[9px] font-black text-text-muted uppercase tracking-wider">Référence 2024</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-end justify-between h-48 gap-4 px-6">
                                        {[45, 52, 42, 60, 78, 85, 92, 72, 95, 100, 105, 102].map((h, i) => (
                                            <div key={i} className="flex flex-col items-center gap-3 w-full group/bar relative">
                                                <div className="absolute -top-8 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-text-primary text-white text-[10px] font-black px-2 py-1 rounded">
                                                    +{Math.floor(h * 0.1)}%
                                                </div>
                                                <div className="w-full h-full bg-bg-tertiary rounded-2xl overflow-hidden flex flex-col justify-end">
                                                    <motion.div
                                                        initial={{ height: 0 }}
                                                        animate={{ height: `${h}%` }}
                                                        transition={{ duration: 1, delay: i * 0.05 }}
                                                        className="w-full bg-accent/30 relative"
                                                    >
                                                        <div
                                                            className="absolute bottom-0 left-0 right-0 bg-accent rounded-t-lg shadow-[0_0_10px_rgba(0,215,100,0.3)]"
                                                            style={{ height: '30%' }}
                                                        />
                                                    </motion.div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-8 text-[9px] font-black text-text-muted uppercase tracking-[0.2em] px-4">
                                        <span>JAN</span><span>FÉV</span><span>MAR</span><span>AVR</span><span>MAI</span><span>JUIN</span><span>JUIL</span><span>AOÛT</span><span>SEP</span><span>OCT</span><span>NOV</span><span>DÉC</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center bg-bg-tertiary p-8 rounded-[2.5rem] border border-border/50">
                                    <Button
                                        variant="outline"
                                        onClick={reset}
                                        className="h-14 px-8 border-border bg-white dark:bg-bg-secondary font-black text-[10px] tracking-widest uppercase hover:bg-bg-tertiary"
                                    >
                                        Nouveau Scénario
                                    </Button>
                                    <div className="flex gap-4">
                                        <Button
                                            className="h-14 px-8 bg-text-primary text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black"
                                        >
                                            Exporter en PDF
                                        </Button>
                                        <Button
                                            onClick={onClose}
                                            className="h-14 px-12 bg-accent hover:bg-black text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-accent/20 transition-all transform hover:scale-[1.05]"
                                        >
                                            Implémenter Stratégie
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </Modal>
    );
}
