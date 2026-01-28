"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useSettings } from "@/context/SettingsContext";
import {
    CreditCard,
    Save,
    Loader2,
    Banknote,
    Wallet,
    Smartphone,
    Receipt,
    Monitor,
    Volume2,
    Printer,
    Check,
    Cpu,
    Coins,
    Sparkles,
    LayoutGrid,
    Sun,
    Moon
} from "lucide-react";
import { cn } from "@/lib/utils";

const PAYMENT_METHODS = [
    { id: 'cash', name: 'Fiat (Espèces)', icon: Banknote, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { id: 'card', name: 'Terminal (CB)', icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { id: 'amex', name: 'Platinum (Amex)', icon: CreditCard, color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    { id: 'meal_voucher', name: 'Meal Vouchers', icon: Receipt, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { id: 'check', name: 'Legacy (Chèque)', icon: Wallet, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { id: 'digital', name: 'NFC Matrix', icon: Smartphone, color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
];

export default function POSSettings() {
    const { settings, updatePOS, updateReceipt, isSaving } = useSettings();
    const [pos, setPOS] = useState(settings.pos);
    const [receipt, setReceipt] = useState(settings.receipt);
    const [enabledPayments, setEnabledPayments] = useState<string[]>(['cash', 'card']);

    useEffect(() => {
        setPOS(settings.pos);
        setReceipt(settings.receipt);
    }, [settings]);

    const handleSave = async () => {
        await updatePOS(pos);
        await updateReceipt(receipt);
    };

    const togglePaymentMethod = (id: string) => {
        setEnabledPayments(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
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
            {/* Terminal Configuration */}
            <motion.div
                variants={cinematicItem}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-6 md:p-10 overflow-hidden relative group"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] -mr-32 -mt-32 transition-opacity group-hover:opacity-100 opacity-50 pointer-events-none" />

                <div className="flex items-center gap-4 mb-10 relative z-10">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent"
                    >
                        <Cpu className="w-6 h-6" />
                    </motion.div>
                    <div>
                        <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                            POS Neural Core
                        </h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Transaction Engine Parameters</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                    {[
                        {
                            label: 'Fiat Currency', key: 'currency', options: [
                                { v: 'EUR', l: 'Euro (€)' },
                                { v: 'USD', l: 'Dollar ($)' },
                                { v: 'GBP', l: 'Pound (£)' },
                                { v: 'CHF', l: 'Swiss Franc (CHF)' }
                            ]
                        },
                        {
                            label: 'Pricing Logic', key: 'displayMode', options: [
                                { v: 'ttc', l: 'Tax Inclusive (TTC)' },
                                { v: 'ht', l: 'Net Basis (HT)' }
                            ]
                        },
                        {
                            label: 'Operational Flow', key: 'serviceMode', options: [
                                { v: 'table', l: 'Full Table Service' },
                                { v: 'counter', l: 'Quick Counter' },
                                { v: 'delivery', l: 'Logistics Focused' },
                                { v: 'mixed', l: 'Hybrid Ecosystem' }
                            ]
                        }
                    ].map((item) => (
                        <div key={item.key} className="space-y-3">
                            <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1">
                                {item.label}
                            </label>
                            <select
                                value={(pos as any)[item.key]}
                                onChange={(e) => setPOS(p => ({ ...p, [item.key]: e.target.value }))}
                                className="w-full px-6 py-5 bg-bg-primary border border-border rounded-2xl text-text-primary font-serif outline-none appearance-none shadow-sm"
                                data-tutorial={item.key === 'currency' ? 'settings-5-0' : item.key === 'serviceMode' ? 'settings-5-1' : undefined}
                            >
                                {item.options.map(opt => <option key={opt.v} value={opt.v} className="dark:bg-bg-secondary">{opt.l}</option>)}
                            </select>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Financial Nexus (Payment Methods) */}
            <motion.div
                variants={cinematicItem}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-6 md:p-10"
            >
                <div className="flex items-center gap-4 mb-10">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent"
                    >
                        <Coins className="w-6 h-6" />
                    </motion.div>
                    <div>
                        <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                            Payment Matrix
                        </h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Supported Value Exchange Channels</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {PAYMENT_METHODS.map((method) => {
                        const Icon = method.icon;
                        const isEnabled = enabledPayments.includes(method.id);
                        return (
                            <motion.button
                                key={method.id}
                                whileHover={{ scale: 1.02, y: -4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => togglePaymentMethod(method.id)}
                                className={cn(
                                    "relative flex flex-col items-start p-6 rounded-[2rem] border transition-all duration-300 overflow-hidden group",
                                    isEnabled
                                        ? "bg-bg-primary border-accent/40 shadow-lg shadow-accent/5"
                                        : "bg-bg-tertiary/20 border-border opacity-70 hover:opacity-100"
                                )}
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300",
                                    isEnabled ? "bg-accent/10 text-accent" : "bg-bg-tertiary text-text-muted group-hover:bg-bg-primary"
                                )}>
                                    <Icon className="w-6 h-6" />
                                </div>

                                <span className={cn(
                                    "font-serif text-sm uppercase tracking-tight italic",
                                    isEnabled ? "text-text-primary" : "text-text-muted"
                                )}>
                                    {method.name}
                                </span>

                                <AnimatePresence>
                                    {isEnabled && (
                                        <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            className="absolute top-6 right-6 w-6 h-6 bg-accent rounded-full flex items-center justify-center shadow-md"
                                        >
                                            <Check className="w-3 h-3 text-bg-primary stroke-[3px]" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {!isEnabled && (
                                    <div className="absolute top-6 right-6 w-6 h-6 rounded-full border border-border" />
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </motion.div>

            {/* Interface Modulation */}
            <motion.div
                variants={cinematicItem}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-6 md:p-10"
            >
                <div className="flex items-center gap-4 mb-10">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent"
                    >
                        <LayoutGrid className="w-6 h-6" />
                    </motion.div>
                    <div>
                        <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                            UI Synchronization
                        </h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Visual Feedback & Ergonomics</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1">
                            Node Density (Button Size)
                        </label>
                        <div className="flex gap-3 p-2 bg-bg-tertiary rounded-2xl border border-border">
                            {['small', 'medium', 'large'].map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setPOS(p => ({ ...p, buttonSize: size as 'small' | 'medium' | 'large' }))}
                                    className={cn(
                                        "flex-1 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all",
                                        pos.buttonSize === size
                                            ? "bg-bg-primary text-text-primary shadow-sm border border-border"
                                            : "text-text-muted hover:text-text-primary"
                                    )}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1">
                            Luminance Mode
                        </label>
                        <div className="flex gap-3 p-2 bg-bg-tertiary rounded-2xl border border-border">
                            {[
                                { id: 'light', icon: Sun, label: 'Spectrum' },
                                { id: 'dark', icon: Moon, label: 'Void' }
                            ].map((theme) => (
                                <button
                                    key={theme.id}
                                    onClick={() => setPOS(p => ({ ...p, theme: theme.id as any }))}
                                    className={cn(
                                        "flex-1 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                                        pos.theme === theme.id
                                            ? "bg-bg-primary text-text-primary shadow-sm border border-border"
                                            : "text-text-muted hover:text-text-primary"
                                    )}
                                >
                                    <theme.icon className="w-4 h-4" />
                                    {theme.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Automation Toggles */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { id: 'showImages', label: 'Visual Rendering', desc: 'Enable product optics', icon: Monitor },
                        { id: 'notificationSound', label: 'Audio Feedback', desc: 'Sonic transaction alerts', icon: Volume2 },
                        { id: 'autoPrintReceipt', label: 'Hard-Copy Protocol', desc: 'Pre-emptive receipt printing', icon: Printer },
                    ].map((toggle) => (
                        <div key={toggle.id} className="p-6 bg-bg-primary rounded-[2rem] border border-border shadow-sm flex flex-col justify-between">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-bg-tertiary flex items-center justify-center text-text-muted">
                                    <toggle.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-serif text-text-primary text-xs uppercase tracking-tight italic">{toggle.label}</p>
                                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none mt-1">{toggle.desc}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setPOS(p => ({ ...p, [toggle.id]: !p[toggle.id as keyof typeof p] }))}
                                className={cn(
                                    "w-full h-10 rounded-xl relative transition-all duration-500 shadow-inner overflow-hidden border border-border",
                                    (pos as any)[toggle.id] ? "bg-accent" : "bg-bg-tertiary"
                                )}
                            >
                                <motion.div
                                    animate={{ x: (pos as any)[toggle.id] ? "290%" : "2%" }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    className="absolute top-1 left-1 h-8 w-1/4 bg-white rounded-lg shadow-sm"
                                />
                                <span className={cn(
                                    "absolute inset-0 flex items-center justify-center text-[10px] font-bold uppercase tracking-widest",
                                    (pos as any)[toggle.id] ? "text-bg-primary" : "text-text-muted"
                                )}>
                                    {(pos as any)[toggle.id] ? 'Active' : 'Standby'}
                                </span>
                            </button>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Incentives & Documentation (Tips & Receipts) */}
            <motion.div
                variants={cinematicItem}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
                {/* Tip Architecture */}
                <div className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-6 md:p-10">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 180 }}
                                className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent"
                            >
                                <Sparkles className="w-6 h-6" />
                            </motion.div>
                            <div>
                                <h3 className="text-xl font-serif text-text-primary uppercase tracking-tight italic">
                                    Gratuity Engine
                                </h3>
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Optional Reward Nodes</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setPOS(p => ({ ...p, tipsEnabled: !p.tipsEnabled }))}
                            className={cn(
                                "w-14 h-8 rounded-full relative transition-all duration-500 shadow-inner border border-border",
                                pos.tipsEnabled ? "bg-emerald-500" : "bg-bg-tertiary"
                            )}
                            data-tutorial="settings-5-2"
                        >
                            <motion.div
                                animate={{ x: pos.tipsEnabled ? 24 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm"
                            />
                        </button>
                    </div>

                    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity", !pos.tipsEnabled && "opacity-20 pointer-events-none")}>
                        {pos.tipSuggestions.map((tip, index) => (
                            <div key={index} className="space-y-2">
                                <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest px-2">Node {index + 1}</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={tip}
                                        onChange={(e) => {
                                            const newTips = [...pos.tipSuggestions];
                                            newTips[index] = Number(e.target.value);
                                            setPOS(p => ({ ...p, tipSuggestions: newTips }));
                                        }}
                                        className="w-full px-4 py-4 bg-bg-primary border border-border rounded-2xl text-text-primary font-bold text-center outline-none shadow-sm"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-text-muted uppercase">%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ledger Config */}
                <div className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-6 md:p-10">
                    <div className="flex items-center gap-4 mb-8">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 10 }}
                            className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent"
                        >
                            <Receipt className="w-6 h-6" />
                        </motion.div>
                        <div>
                            <h3 className="text-xl font-serif text-text-primary uppercase tracking-tight italic">
                                Evidence Protocol
                            </h3>
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Fiscal Receipt Calibration</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest px-2">SIRET Node</label>
                                <input
                                    type="text"
                                    value={receipt.siret}
                                    onChange={(e) => setReceipt(r => ({ ...r, siret: e.target.value }))}
                                    className="w-full px-5 py-4 bg-bg-primary border border-border rounded-2xl text-sm font-bold shadow-sm outline-none text-text-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest px-2">Tax Matrix ID</label>
                                <input
                                    type="text"
                                    value={receipt.vatNumber}
                                    onChange={(e) => setReceipt(r => ({ ...r, vatNumber: e.target.value }))}
                                    className="w-full px-5 py-4 bg-bg-primary border border-border rounded-2xl text-sm font-bold shadow-sm outline-none text-text-primary"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest px-2">Termination Message</label>
                            <input
                                type="text"
                                value={receipt.thankYouMessage || ''}
                                onChange={(e) => setReceipt(r => ({ ...r, thankYouMessage: e.target.value }))}
                                className="w-full px-5 py-4 bg-bg-primary border border-border rounded-2xl text-sm font-bold shadow-sm outline-none text-text-primary placeholder:text-text-muted"
                                placeholder="Thank you for your protocol membership"
                            />
                        </div>
                    </div>
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
                            <div className="absolute inset-0 bg-white/40 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    )}
                    Commit Financial State
                </motion.button>
            </motion.div>
        </motion.div>
    );
}
