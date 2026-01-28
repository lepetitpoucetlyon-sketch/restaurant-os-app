"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Receipt,
    Save,
    Loader2,
    FileText,
    Calculator,
    Calendar,
    Wallet,
    TrendingUp,
    Building2,
    Zap,
    Scale,
    ShieldCheck,
    CreditCard,
    Code,
    Cpu,
    Target,
    Banknote
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VATRate {
    id: string;
    name: string;
    rate: number;
    category: string;
}

import { useSettings } from "@/context/SettingsContext";
import { AccountingConfig } from "@/types/settings";

export default function AccountingSettings() {
    const { settings: globalSettings, updateConfig, isSaving: contextIsSaving } = useSettings();
    const [isSaving, setIsSaving] = useState(false);

    // Local state for buffered edits
    const [localConfig, setLocalConfig] = useState<AccountingConfig>(globalSettings.accountingConfig || {
        fiscalYearStart: '2024-01-01',
        accountingMethod: 'accrual',
        defaultPaymentTerms: 30,
        vatRates: [
            { rate: 20, name: 'Normal', category: 'Standard' },
            { rate: 10, name: 'Intermédiaire', category: 'Restauration' },
            { rate: 5.5, name: 'Réduit', category: 'Alimentaire' },
        ],
        invoicePrefix: 'INV-',
        invoiceNextNumber: 1,
        bankName: '',
        iban: '',
        bic: '',
        exportFormat: 'pdf',
    });

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateConfig('accountingConfig', localConfig);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Fiscal Architecture (Global Params) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-10 overflow-hidden relative group"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32 transition-opacity group-hover:opacity-100 opacity-50 pointer-events-none" />

                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                            Fiscal Architecture
                        </h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Global Accounting Cycle Parameters</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="space-y-4 bg-bg-primary p-8 rounded-[2rem] border border-border shadow-sm">
                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1 group-hover:text-accent transition-colors">Cycle Genesis (Year Start)</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={localConfig.fiscalYearStart}
                                onChange={(e) => setLocalConfig(s => ({ ...s, fiscalYearStart: e.target.value }))}
                                className="w-full bg-transparent text-3xl font-serif text-text-primary outline-none font-mono tracking-tighter"
                                placeholder="DD-MM"
                            />
                            <div className="absolute right-0 bottom-1 w-2 h-2 rounded-full bg-accent animate-pulse" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1">Logic Pattern</label>
                        <div className="flex gap-4 bg-bg-tertiary p-2 rounded-[1.5rem] border border-border">
                            {[
                                { id: 'accrual', label: 'Accrual' },
                                { id: 'cash', label: 'Cash Flow' }
                            ].map((method) => (
                                <button
                                    key={method.id}
                                    onClick={() => setLocalConfig(s => ({ ...s, accountingMethod: method.id as any }))}
                                    className={cn(
                                        "flex-1 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all",
                                        localConfig.accountingMethod === method.id
                                            ? "bg-bg-primary shadow-xl text-text-primary border border-border"
                                            : "text-text-muted hover:text-text-primary"
                                    )}
                                >
                                    {method.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4 bg-bg-primary p-8 rounded-[2rem] border border-border shadow-sm">
                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1">Settlement Buffer</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={localConfig.defaultPaymentTerms}
                                onChange={(e) => setLocalConfig(s => ({ ...s, defaultPaymentTerms: Number(e.target.value) }))}
                                className="w-full bg-transparent text-3xl font-serif text-text-primary outline-none"
                            />
                            <span className="absolute right-0 bottom-1.5 text-xs font-bold text-text-muted uppercase">Days</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Tax Matrix (VAT Rates) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-10"
            >
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent">
                        <Calculator className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                            Taxation Matrix
                        </h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Active VAT Tiers & Category Alignment</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {localConfig.vatRates.map((vat, idx) => (
                        <motion.div
                            key={`${vat.rate}-${idx}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 + (idx * 0.05) }}
                            whileHover={{ y: -4, scale: 1.02 }}
                            className="p-8 rounded-[2rem] bg-bg-primary border border-border shadow-sm hover:shadow-xl transition-all duration-500 group text-center"
                        >
                            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-bg-tertiary text-text-primary group-hover:bg-accent group-hover:text-bg-primary transition-all duration-500 shadow-inner border border-border group-hover:border-accent">
                                <span className="text-2xl font-serif italic">{vat.rate}%</span>
                            </div>
                            <p className="font-bold text-text-primary uppercase tracking-tight text-sm mb-1">{vat.name}</p>
                            <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">{vat.category} link</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Artifact Serialization (Invoicing) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-10"
            >
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent">
                        <Code className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                            Artifact Serialization
                        </h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Invoice Prefix & Séquence Logic</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1">Node Prefix</label>
                        <input
                            type="text"
                            value={localConfig.invoicePrefix}
                            onChange={(e) => setLocalConfig(s => ({ ...s, invoicePrefix: e.target.value }))}
                            className="w-full px-8 py-5 bg-bg-primary border border-border rounded-[2rem] text-2xl font-serif text-text-primary outline-none font-mono focus:border-accent transition-all shadow-inner"
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1">Sequence Cursor</label>
                        <input
                            type="number"
                            value={localConfig.invoiceNextNumber}
                            onChange={(e) => setLocalConfig(s => ({ ...s, invoiceNextNumber: Number(e.target.value) }))}
                            className="w-full px-8 py-5 bg-bg-primary border border-border rounded-[2rem] text-2xl font-serif text-text-primary outline-none font-mono focus:border-accent transition-all shadow-inner"
                        />
                    </div>
                    <div className="flex items-end">
                        <div className="w-full p-6 bg-text-primary rounded-[2rem] border border-text-primary flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-bg-primary/10 flex items-center justify-center text-bg-primary">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[8px] font-bold text-bg-primary/60 uppercase tracking-widest">Live Projection</p>
                                    <p className="text-lg font-serif italic text-bg-primary font-mono group-hover:text-accent transition-colors">
                                        {localConfig.invoicePrefix}{localConfig.invoiceNextNumber}
                                    </p>
                                </div>
                            </div>
                            <Zap className="w-4 h-4 text-bg-primary/40 animate-pulse" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Liquidity Channels (Bank Details) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-10"
            >
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent">
                        <Banknote className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                            Liquidity Channels
                        </h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Banking Coordinates & Inbound Pathways</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1 group-hover:text-accent transition-colors">Institution Node</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={localConfig.bankName}
                                    onChange={(e) => setLocalConfig(s => ({ ...s, bankName: e.target.value }))}
                                    className="w-full px-6 py-5 bg-bg-primary border border-border rounded-2xl text-text-primary font-medium focus:border-accent transition-all outline-none"
                                    placeholder="Neural Banking Corp"
                                />
                                <Building2 className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1">Network Identifier (BIC/SWIFT)</label>
                            <input
                                type="text"
                                value={localConfig.bic}
                                onChange={(e) => setLocalConfig(s => ({ ...s, bic: e.target.value }))}
                                className="w-full px-6 py-5 bg-bg-primary border border-border rounded-2xl text-text-primary font-medium focus:border-accent transition-all outline-none font-mono"
                                placeholder="NODEID-XXXX"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1">Global IBAN Sequence</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={localConfig.iban}
                                onChange={(e) => setLocalConfig(s => ({ ...s, iban: e.target.value }))}
                                className="w-full px-6 py-5 bg-bg-primary border border-border rounded-2xl text-text-primary font-medium focus:border-accent transition-all outline-none font-mono tracking-widest"
                                placeholder="FR76 0000 0000 0000 0000 0000 000"
                            />
                            <CreditCard className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Neural Export Pipeline */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-bg-secondary rounded-[2.5rem] border border-border shadow-premium p-10 overflow-hidden relative"
            >
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />

                <div className="flex items-center gap-4 mb-10 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent">
                        <Cpu className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                            Export Pipeline
                        </h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Data Projection & Synthesis Formats</p>
                    </div>
                </div>

                <div className="flex gap-6 relative z-10">
                    {['csv', 'xlsx', 'pdf'].map((format) => (
                        <motion.button
                            key={format}
                            whileHover={{ scale: 1.05, y: -4 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setLocalConfig(s => ({ ...s, exportFormat: format as any }))}
                            className={cn(
                                "flex-1 py-10 rounded-[2.5rem] font-bold uppercase tracking-[0.3em] text-sm transition-all duration-500 border group/btn relative overflow-hidden",
                                localConfig.exportFormat === format
                                    ? "bg-text-primary text-bg-primary border-text-primary shadow-2xl"
                                    : "bg-bg-primary text-text-muted border-border hover:border-accent/40 hover:text-text-primary hover:shadow-lg"
                            )}
                        >
                            <span className="relative z-10">{format}</span>
                            {localConfig.exportFormat === format && (
                                <motion.div
                                    layoutId="export-active"
                                    className="absolute inset-x-0 bottom-0 h-1.5 bg-accent"
                                />
                            )}
                        </motion.button>
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
                            <ShieldCheck className="w-5 h-5 transition-transform group-hover:scale-110" />
                        </div>
                    )}
                    Commit Fiscal State
                </motion.button>
            </div>
        </div>
    );
}
