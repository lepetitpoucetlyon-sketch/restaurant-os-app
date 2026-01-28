"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Heart,
    Save,
    Loader2,
    Star,
    Gift,
    Mail,
    MessageSquare,
    Users,
    TrendingUp,
    Zap,
    Crown,
    Sparkles,
    Target,
    Activity,
    Users2,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LoyaltyTier {
    id: string;
    name: string;
    minPoints: number;
    color: string;
    benefits: string[];
}

const defaultTiers: LoyaltyTier[] = [
    { id: '1', name: 'Bronze', minPoints: 0, color: '#CD7F32', benefits: ['5% Bev Discount'] },
    { id: '2', name: 'Silver', minPoints: 500, color: '#C0C0C0', benefits: ['10% Bev Discount', 'Birthday Synthesis'] },
    { id: '3', name: 'Gold', minPoints: 1500, color: '#FFD700', benefits: ['15% Absolute Discount', 'Sparkling Reception', 'Priority Queue'] },
    { id: '4', name: 'Platinum', minPoints: 5000, color: '#E5E4E2', benefits: ['20% Absolute Discount', 'Grand Tasting Event', 'VIP Node Access'] },
];

export default function CRMSettings() {
    const [tiers, setTiers] = useState<LoyaltyTier[]>(defaultTiers);
    const [isSaving, setIsSaving] = useState(false);
    const [loyalty, setLoyalty] = useState({
        enabled: true,
        pointsPerEuro: 1,
        pointsExpiry: 365,
        birthdayBonus: 100,
        referralBonus: 200,
        welcomeBonus: 50,
    });
    const [segments, setSegments] = useState([
        { id: '1', name: 'VIP Core', count: 42, criteria: 'Spend > 500€/cycle', color: 'bg-amber-500' },
        { id: '2', name: 'Regulars', count: 156, criteria: 'Visits > 2x/cycle', color: 'bg-emerald-500' },
        { id: '3', name: 'Occasionals', count: 387, criteria: 'Visits 1x/cycle', color: 'bg-blue-500' },
        { id: '4', name: 'Dormant Nodes', count: 89, criteria: 'Zero activity > 90d', color: 'bg-rose-500' },
    ]);

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(r => setTimeout(r, 800));
        setIsSaving(false);
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Loyalty Engine Core */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-6 md:p-10 overflow-hidden relative group"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32 transition-opacity group-hover:opacity-100 opacity-50 pointer-events-none" />

                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent">
                            <Heart className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                                Loyalty Synthesis Engine
                            </h3>
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Customer Retention Protocol</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setLoyalty(l => ({ ...l, enabled: !l.enabled }))}
                        className={cn(
                            "w-16 h-8 rounded-full relative transition-all duration-500",
                            loyalty.enabled ? "bg-accent shadow-lg shadow-accent/20" : "bg-bg-tertiary shadow-inner border border-border"
                        )}
                    >
                        <motion.div
                            animate={{ x: loyalty.enabled ? 34 : 4 }}
                            className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                        />
                    </button>
                </div>

                <AnimatePresence>
                    {loyalty.enabled && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 overflow-hidden"
                        >
                            <div className="space-y-3">
                                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1">Exchange Rate</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={loyalty.pointsPerEuro}
                                        onChange={(e) => setLoyalty(l => ({ ...l, pointsPerEuro: Number(e.target.value) }))}
                                        className="w-full px-6 py-5 bg-bg-primary border border-border rounded-2xl text-text-primary font-medium focus:border-accent transition-all outline-none"
                                    />
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-text-muted uppercase">Pts/€</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1">Temporal Decay</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={loyalty.pointsExpiry}
                                        onChange={(e) => setLoyalty(l => ({ ...l, pointsExpiry: Number(e.target.value) }))}
                                        className="w-full px-6 py-5 bg-bg-primary border border-border rounded-2xl text-text-primary font-medium focus:border-accent transition-all outline-none"
                                    />
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-text-muted uppercase">Days</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1">Initialization Bonus</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={loyalty.welcomeBonus}
                                        onChange={(e) => setLoyalty(l => ({ ...l, welcomeBonus: Number(e.target.value) }))}
                                        className="w-full px-6 py-5 bg-bg-primary border border-border rounded-2xl text-text-primary font-medium focus:border-accent transition-all outline-none"
                                    />
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-text-muted uppercase">Points</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Loyalty Hierarchy Tiers */}
            <AnimatePresence>
                {loyalty.enabled && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ delay: 0.1 }}
                        className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-6 md:p-10"
                    >
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent">
                                <Crown className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                                    Node Tier Hierarchy
                                </h3>
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Aesthetic & Benefit Calibration</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {tiers.map((tier, idx) => (
                                <motion.div
                                    key={tier.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    className="p-8 rounded-[2rem] border-2 flex flex-col justify-between h-full bg-bg-primary border-border hover:border-accent/30 transition-all duration-500 shadow-sm hover:shadow-2xl"
                                    style={{ borderColor: tier.color === '#CD7F32' || tier.color === '#C0C0C0' || tier.color === '#FFD700' || tier.color === '#E5E4E2' ? undefined : undefined }}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-8">
                                            <div
                                                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner bg-bg-tertiary border border-border"
                                            >
                                                <Star className="w-6 h-6" style={{ color: tier.color }} />
                                            </div>
                                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Level {idx + 1}</span>
                                        </div>
                                        <h4 className="text-xl font-serif italic text-text-primary uppercase tracking-tight mb-6">{tier.name}</h4>
                                        <div className="space-y-4 mb-8">
                                            <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Threshold</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={tier.minPoints}
                                                    onChange={(e) => setTiers(prev => prev.map(t =>
                                                        t.id === tier.id ? { ...t, minPoints: Number(e.target.value) } : t
                                                    ))}
                                                    className="w-full bg-transparent text-2xl font-serif text-text-primary outline-none"
                                                />
                                                <span className="absolute right-0 bottom-1 text-[9px] font-bold text-text-muted uppercase">Points</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-6 border-t border-border">
                                        <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Current Privileges</label>
                                        <ul className="space-y-2">
                                            {tier.benefits.map((b, i) => (
                                                <li key={i} className="flex items-center gap-2 text-[10px] font-bold text-text-secondary">
                                                    <CheckCircle2 className="w-3 h-3" style={{ color: tier.color }} />
                                                    {b}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Special Vectors (Bonuses) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-6 md:p-10"
            >
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                            Special Reward Vectors
                        </h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Occasional Logic Multipliers</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="p-8 bg-bg-primary rounded-[2rem] border border-border shadow-sm hover:shadow-xl transition-all duration-500 flex items-center justify-between group">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-bg-tertiary flex items-center justify-center group-hover:bg-accent group-hover:text-bg-primary transition-all duration-500 text-text-primary border border-border group-hover:border-accent">
                                <Gift className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="font-serif italic text-text-primary uppercase tracking-tight text-lg">Solar Return</p>
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Individual Birthday Reward</p>
                            </div>
                        </div>
                        <div className="relative">
                            <input
                                type="number"
                                value={loyalty.birthdayBonus}
                                onChange={(e) => setLoyalty(l => ({ ...l, birthdayBonus: Number(e.target.value) }))}
                                className="w-24 text-right bg-transparent text-2xl font-serif text-text-primary outline-none"
                            />
                            <span className="block text-[9px] font-bold text-text-muted text-right uppercase tracking-widest">Points</span>
                        </div>
                    </div>

                    <div className="p-8 bg-bg-primary rounded-[2rem] border border-border shadow-sm hover:shadow-xl transition-all duration-500 flex items-center justify-between group">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-bg-tertiary flex items-center justify-center group-hover:bg-accent group-hover:text-bg-primary transition-all duration-500 text-text-primary border border-border group-hover:border-accent">
                                <Users2 className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="font-serif italic text-text-primary uppercase tracking-tight text-lg">Node Referral</p>
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Network Expansion Incentive</p>
                            </div>
                        </div>
                        <div className="relative">
                            <input
                                type="number"
                                value={loyalty.referralBonus}
                                onChange={(e) => setLoyalty(l => ({ ...l, referralBonus: Number(e.target.value) }))}
                                className="w-24 text-right bg-transparent text-2xl font-serif text-text-primary outline-none"
                            />
                            <span className="block text-[9px] font-bold text-text-muted text-right uppercase tracking-widest">Points</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Client Topology (Segments) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-6 md:p-10"
            >
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent">
                        <Target className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                            Client Topology
                        </h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Automated Behavioral Segmentation</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {segments.map((seg, idx) => (
                        <motion.div
                            key={seg.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + (idx * 0.05) }}
                            className="bg-bg-primary p-6 rounded-[1.5rem] border border-border flex items-center justify-between hover:border-accent transition-all group shadow-sm"
                        >
                            <div className="flex items-center gap-5">
                                <div className={cn("w-3 h-3 rounded-full shadow-lg", seg.color)} />
                                <div>
                                    <p className="font-serif italic text-text-primary uppercase tracking-tight text-sm">{seg.name}</p>
                                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{seg.criteria}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-serif text-text-primary leading-none">{seg.count}</p>
                                <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mt-1">Pop. Nodes</p>
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
                    Commit CRM Intelligence
                </motion.button>
            </div>
        </div>
    );
}
