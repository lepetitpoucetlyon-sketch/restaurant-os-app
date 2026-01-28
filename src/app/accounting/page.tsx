"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    ArrowRightLeft,
    BookOpen,
    PieChart,
    Download,
    UploadCloud,
    RefreshCw,
    Wallet,
    TrendingDown,
    TrendingUp,
    Scale,
    Percent,
    CheckCircle2,
    Calendar,
    MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import { useUI } from "@/context/UIContext";

import { ChartOfAccountsView } from "@/components/accounting/views/ChartOfAccountsView";
import { GeneralLedgerView } from "@/components/accounting/views/GeneralLedgerView";
import { JournalEntriesView } from "@/components/accounting/views/JournalEntriesView";
import { TrialBalanceView } from "@/components/accounting/views/TrialBalanceView";
import { ProfitLossView } from "@/components/accounting/views/ProfitLossView";
import { BalanceSheetView } from "@/components/accounting/views/BalanceSheetView";
import { CashBankView } from "@/components/accounting/views/PlaceholderViews";

// ============================================
// MAIN COMPONENT
// ============================================

export default function AccountingConsolePage() {
    const { openDocumentation } = useUI();
    const [activeTab, setActiveTab] = useState<'pilotage' | 'flux' | 'registres' | 'syntheses'>('pilotage');
    const [selectedYear, setSelectedYear] = useState(2025);

    return (
        <div className="flex h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] -m-4 md:-m-8 flex-col bg-bg-primary overflow-hidden pb-20 md:pb-0 font-sans">
            {/* ============================================ */}
            {/* HEADER SECTION */}
            {/* ============================================ */}
            {/* ============================================ */}
            {/* HEADER SECTION - NEW DESIGN S2 */}
            {/* ============================================ */}
            <div className="bg-bg-primary pt-8 px-10 pb-4 shrink-0">
                <div className="flex items-center justify-between mb-8 max-w-[1600px] mx-auto">
                    {/* LEFT: TITLE IDENTITY */}
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-text-primary flex items-center justify-center shadow-2xl shadow-black/20">
                            <LayoutDashboard className="w-7 h-7 text-bg-primary" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h1 className="text-5xl font-serif font-light text-text-primary tracking-tight leading-none mb-2">
                                FACTURATION <span className="italic font-light opacity-60">EXPERT</span>
                            </h1>
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] flex items-center gap-3">
                                GESTION FINANCIÈRE & FISCALE <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" /> EXERCICE {selectedYear}
                            </p>
                        </div>
                    </div>

                    {/* RIGHT: YEAR CONTROL & EXPORT */}
                    <div className="flex items-center gap-4">
                        <div className="flex bg-white dark:bg-black/20 p-1.5 rounded-2xl border border-black/5 dark:border-white/10 shadow-sm">
                            {[2024, 2025, 2026].map((year) => (
                                <button
                                    key={year}
                                    onClick={() => setSelectedYear(year)}
                                    className={cn(
                                        "px-8 py-2.5 rounded-xl text-[12px] font-black transition-all tracking-widest",
                                        selectedYear === year
                                            ? "bg-[#F4F1EA] dark:bg-white/10 text-black dark:text-white shadow-sm border border-black/5"
                                            : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                                    )}
                                >
                                    {year}
                                </button>
                            ))}
                        </div>
                        <button className="w-12 h-12 rounded-2xl border border-black/10 dark:border-white/10 flex items-center justify-center text-neutral-400 hover:text-black dark:hover:text-white hover:border-black/30 w-12 h-12 bg-white dark:bg-black/20 shadow-sm transition-all">
                            <Download className="w-5 h-5" strokeWidth={1.5} />
                        </button>
                    </div>
                </div>

                {/* THE BIG BAR - UNIFIED NAVIGATION & STATS */}
                <div className="flex items-center justify-between bg-[#FDFCF8] dark:bg-[#121212] p-2.5 rounded-[2.5rem] border border-black/5 dark:border-white/5 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] mx-auto max-w-[1600px] relative overflow-hidden">

                    {/* LEFT: TABS */}
                    <div className="flex items-center gap-2">
                        {[
                            { id: 'pilotage', label: 'PILOTAGE', icon: LayoutDashboard },
                            { id: 'flux', label: 'FLUX', icon: ArrowRightLeft },
                            { id: 'registres', label: 'REGISTRES', icon: BookOpen },
                            { id: 'syntheses', label: 'SYNTHÈSES', icon: PieChart },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "flex items-center gap-3 px-8 py-4 rounded-[2rem] transition-all duration-500 relative group overflow-hidden",
                                    activeTab === tab.id
                                        ? "bg-[#F4F0E6] dark:bg-[#C5A059]/20 text-[#C5A059] shadow-inner"
                                        : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                                )}
                            >
                                <tab.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", activeTab === tab.id ? "text-[#C5A059]" : "text-neutral-300")} strokeWidth={1.5} />
                                <span className={cn("text-[10px] font-black uppercase tracking-[0.25em]", activeTab === tab.id ? "text-[#8C6D36] dark:text-[#C5A059]" : "")}>{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* RIGHT: LIVE STATS PULSE */}
                    <div className="flex items-center gap-10 pr-10">
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] font-black text-neutral-300 uppercase tracking-[0.2em] mb-1">C.A MENSUEL</span>
                            <span className="text-xl font-serif font-bold text-[#C5A059] tracking-tight">0,00 €</span>
                        </div>
                        <div className="w-px h-10 bg-black/5 dark:bg-white/5" />
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] font-black text-neutral-300 uppercase tracking-[0.2em] mb-1">SOLDE TRÉSO</span>
                            <span className="text-xl font-serif font-bold text-[#10B981] tracking-tight">36 933,85 €</span>
                        </div>
                        <div className="w-px h-10 bg-black/5 dark:bg-white/5" />
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] font-black text-neutral-300 uppercase tracking-[0.2em] mb-1">TVA ESTIMÉE</span>
                            <span className="text-xl font-serif font-bold text-[#8B5CF6] tracking-tight">0,00 €</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ============================================ */}
            {/* CONTENT AREA */}
            {/* ============================================ */}
            <div className="flex-1 overflow-auto elegant-scrollbar p-10 pt-6">
                <div className="max-w-[1600px] mx-auto">
                    <AnimatePresence mode="wait">
                        {activeTab === 'pilotage' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                {/* Dashboard Header button */}
                                <div className="flex mb-8">
                                    <button className="flex items-center gap-3 px-6 py-3 bg-text-primary text-bg-primary rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:shadow-xl transition-all">
                                        <LayoutDashboard className="w-4 h-4" />
                                        DASHBOARD ANALYTIQUE
                                    </button>
                                </div>

                                {/* HERO SECTION */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Main Action Card */}
                                    <div className="lg:col-span-2 bg-bg-secondary rounded-[2.5rem] p-10 border border-border shadow-xl shadow-amber-900/5 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none" />

                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-6">
                                                <TrendingUp className="w-5 h-5 text-accent" />
                                                <span className="text-[10px] font-black text-accent uppercase tracking-widest">IA INTELLIGENCE</span>
                                            </div>

                                            <h2 className="text-4xl font-serif font-bold text-text-primary mb-6">
                                                Pilotage <span className="text-accent">Analytique</span>
                                            </h2>

                                            <p className="text-text-muted text-lg max-w-xl leading-relaxed mb-10">
                                                Vos extractions bancaires et rapprochements sont automatisés. <strong className="text-text-primary">Lettrage en temps réel activé.</strong>
                                            </p>

                                            <div className="flex items-center gap-4">
                                                <button className="h-12 px-8 bg-accent hover:bg-amber-600 text-bg-primary rounded-full font-bold text-[11px] uppercase tracking-widest shadow-lg shadow-amber-500/20 transition-all flex items-center gap-3">
                                                    IMPORT RELEVÉ
                                                </button>
                                                <button className="h-12 px-8 bg-bg-tertiary border border-border hover:bg-bg-secondary text-text-primary rounded-full font-bold text-[11px] uppercase tracking-widest shadow-sm transition-all flex items-center gap-3">
                                                    <RefreshCw className="w-4 h-4 text-accent" />
                                                    SYNCHRONISATION
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Health Score Card */}
                                    <div className="bg-bg-secondary rounded-[2.5rem] p-10 border border-border shadow-xl shadow-emerald-900/5 flex flex-col items-center justify-center text-center relative overflow-hidden">
                                        <div className="relative w-40 h-40 mb-8 flex items-center justify-center">
                                            {/* Simple SVG Circular Progress Mockup */}
                                            <svg className="w-full h-full -rotate-90">
                                                <circle cx="80" cy="80" r="70" className="stroke-border/20" strokeWidth="8" fill="none" />
                                                <circle cx="80" cy="80" r="70" className="stroke-emerald-400" strokeWidth="8" fill="none" strokeDasharray="440" strokeDashoffset="440" strokeLinecap="round" />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-4xl font-serif font-bold text-text-primary">0</span>
                                                <span className="text-[8px] font-black text-text-muted uppercase tracking-widest mt-1">SCORE</span>
                                            </div>
                                            {/* Dot indicator */}
                                            <div className="absolute top-1/2 left-0 -translate-x-1 w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
                                        </div>

                                        <div className="px-6 py-3 bg-emerald-500/10 text-emerald-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
                                            SANTÉ STRUCTURELLE : OPTIMALE
                                        </div>
                                    </div>
                                </div>

                                {/* METRICS GRID */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[
                                        { label: "CHIFFRE D'AFFAIRES", value: "2 334,60 €", icon: Wallet, color: "text-accent", bg: "bg-amber-500/10", badge: "HT" },
                                        { label: "CHARGES & FRAIS", value: "6 432,32 €", icon: TrendingDown, color: "text-red-500", bg: "bg-error/10", badge: "OPÉRATIONS" },
                                        { label: "RÉSULTAT NET", value: "-4 097,72 €", icon: Scale, color: "text-emerald-500", bg: "bg-emerald-500/10", badge: "-176%" },
                                        { label: "TVA PROVISIONNÉE", value: "121,71 €", icon: Percent, color: "text-purple-500", bg: "bg-indigo-500/10", badge: "CALCUL CA3" },
                                    ].map((metric, i) => (
                                        <motion.div
                                            key={metric.label}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 + (i * 0.1) }}
                                            className="bg-bg-secondary rounded-[2rem] p-8 border border-border shadow-lg hover:shadow-xl transition-all group"
                                        >
                                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-6 transition-all group-hover:scale-110", metric.bg)}>
                                                <metric.icon className={cn("w-5 h-5", metric.color)} />
                                            </div>

                                            <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-3">{metric.label}</p>
                                            <p className="text-3xl font-serif font-bold text-text-primary mb-6">{metric.value}</p>

                                            <span className="px-3 py-1.5 bg-bg-primary border border-border rounded-lg text-[9px] font-bold text-text-muted uppercase tracking-widest">
                                                {metric.badge}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'flux' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-bg-secondary rounded-[2rem] border border-border overflow-hidden">
                                <CashBankView />
                            </motion.div>
                        )}

                        {activeTab === 'registres' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-bg-secondary p-8 rounded-[2rem] border border-border">
                                        <h3 className="text-xl font-bold mb-4">Grand Livre</h3>
                                        <GeneralLedgerView />
                                    </div>
                                    <div className="bg-bg-secondary p-8 rounded-[2rem] border border-border">
                                        <h3 className="text-xl font-bold mb-4">Journaux</h3>
                                        <JournalEntriesView />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'syntheses' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="bg-bg-secondary p-8 rounded-[2rem] border border-border">
                                        <h3 className="text-xl font-bold mb-4">Compte de Résultat</h3>
                                        <ProfitLossView />
                                    </div>
                                    <div className="bg-bg-secondary p-8 rounded-[2rem] border border-border">
                                        <h3 className="text-xl font-bold mb-4">Bilan</h3>
                                        <BalanceSheetView />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Chat button bubble bottom right */}
            <div className="fixed bottom-8 right-8 z-50">
                <button className="w-14 h-14 bg-accent rounded-full shadow-2xl flex items-center justify-center text-bg-primary hover:scale-110 transition-transform">
                    <MessageSquare className="w-6 h-6" fill="currentColor" />
                </button>
            </div>
        </div>
    );
}
