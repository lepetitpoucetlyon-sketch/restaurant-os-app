"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    Save,
    Loader2,
    Shield,
    Scale,
    Building2,
    CreditCard,
    Download,
    Upload,
    Check,
    Briefcase,
    Zap,
    MapPin,
    Calendar,
    Stamp,
    Gavel,
    ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LegalSettings() {
    const [isSaving, setIsSaving] = useState(false);
    const [legalInfo, setLegalInfo] = useState({
        companyName: '',
        legalForm: 'SARL',
        registrationNumber: '',
        siret: '',
        vatNumber: '',
        shareCapital: '',
        registeredAddress: '',
        representativeName: '',
        representativeTitle: 'Gérant',
        insuranceProvider: '',
        insurancePolicyNumber: '',
        licenseType: 'licence_iv',
        licenseNumber: '',
        licenseExpiry: '',
    });

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(r => setTimeout(r, 800));
        setIsSaving(false);
    };

    const handleExport = (type: string) => {
        // Export logic likely to be implemented
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Entity Architecture (Company Info) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-6 md:p-10 overflow-hidden relative group"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] -mr-32 -mt-32 transition-opacity group-hover:opacity-100 opacity-50 pointer-events-none" />

                <div className="flex items-center gap-4 mb-10 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                            Entity Architecture
                        </h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Legal Foundation & Registration</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div className="col-span-2 space-y-3">
                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1 group-hover:text-accent transition-colors">Corporate Identity (Company Name)</label>
                        <input
                            type="text"
                            value={legalInfo.companyName}
                            onChange={(e) => setLegalInfo(l => ({ ...l, companyName: e.target.value }))}
                            className="w-full px-6 py-5 bg-bg-primary border border-border rounded-2xl text-text-primary font-serif italic placeholder:not-italic focus:bg-bg-primary/50 transition-all outline-none"
                            placeholder="Quantum Gastronomy SARL"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1">Structure Type</label>
                        <select
                            value={legalInfo.legalForm}
                            onChange={(e) => setLegalInfo(l => ({ ...l, legalForm: e.target.value }))}
                            className="w-full px-6 py-5 bg-bg-primary border border-border rounded-2xl text-text-primary font-serif outline-none appearance-none cursor-pointer"
                        >
                            <option value="SARL">SARL (Limited Liability)</option>
                            <option value="SAS">SAS (Simplified Joint Stock)</option>
                            <option value="EURL">EURL (Single Member Ltd)</option>
                            <option value="SA">SA (Public Limited)</option>
                            <option value="MICRO">Micro-Entity</option>
                        </select>
                    </div>
                    <div className="space-y-3">
                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1">Share Capital</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={legalInfo.shareCapital}
                                onChange={(e) => setLegalInfo(l => ({ ...l, shareCapital: e.target.value }))}
                                className="w-full px-6 py-5 bg-bg-primary border border-border rounded-2xl text-text-primary font-serif focus:bg-bg-primary/50 transition-all outline-none"
                                placeholder="10,000"
                            />
                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-text-muted uppercase">EUR</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1">RCS / Trade Registry</label>
                        <input
                            type="text"
                            value={legalInfo.registrationNumber}
                            onChange={(e) => setLegalInfo(l => ({ ...l, registrationNumber: e.target.value }))}
                            className="w-full px-6 py-5 bg-bg-primary border border-border rounded-2xl text-text-primary font-serif focus:bg-bg-primary/50 transition-all outline-none"
                            placeholder="Registry Node ID"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1">SIRET Protocol</label>
                        <input
                            type="text"
                            value={legalInfo.siret}
                            onChange={(e) => setLegalInfo(l => ({ ...l, siret: e.target.value }))}
                            className="w-full px-6 py-5 bg-bg-primary border border-border rounded-2xl text-text-primary font-serif focus:bg-bg-primary/50 transition-all outline-none"
                            placeholder="14-Digit Node ID"
                        />
                    </div>
                    <div className="col-span-2 space-y-3">
                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1">Registered Coordinates (HQ)</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={legalInfo.registeredAddress}
                                onChange={(e) => setLegalInfo(l => ({ ...l, registeredAddress: e.target.value }))}
                                className="w-full px-6 py-5 bg-bg-primary border border-border rounded-2xl text-text-primary font-serif focus:bg-bg-primary/50 transition-all outline-none pl-14"
                                placeholder="Geographical Sector Address..."
                            />
                            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Fiscal & Representation */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-6 md:p-10 overflow-hidden relative"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                <div className="flex items-center gap-4 mb-10 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent">
                        <Gavel className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                            Fiscal Protocol
                        </h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Tax Identity & Legal Agency</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div className="space-y-3">
                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1">Intracommunity VAT Node</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={legalInfo.vatNumber}
                                onChange={(e) => setLegalInfo(l => ({ ...l, vatNumber: e.target.value }))}
                                className="w-full px-6 py-5 bg-bg-primary border border-border rounded-2xl text-text-primary font-serif focus:bg-bg-primary/50 transition-all outline-none"
                                placeholder="FRXX XXXXXXXXX"
                            />
                            <CreditCard className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1">Authorized Representative</label>
                        <input
                            type="text"
                            value={legalInfo.representativeName}
                            onChange={(e) => setLegalInfo(l => ({ ...l, representativeName: e.target.value }))}
                            className="w-full px-6 py-5 bg-bg-primary border border-border rounded-2xl text-text-primary font-serif focus:bg-bg-primary/50 transition-all outline-none"
                            placeholder="Principal Agent Name"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Licenses & Neural Shield (Assurances) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-6 md:p-10 overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full blur-[80px] -mr-24 -mt-24 pointer-events-none" />
                    <div className="flex items-center gap-4 mb-10 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-bg-tertiary flex items-center justify-center text-accent">
                            <Stamp className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-serif text-text-primary uppercase tracking-tight italic">Operating Permits</h3>
                    </div>
                    <div className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1">License Type</label>
                            <select
                                value={legalInfo.licenseType}
                                onChange={(e) => setLegalInfo(l => ({ ...l, licenseType: e.target.value }))}
                                className="w-full px-6 py-4 bg-bg-primary border border-border rounded-2xl text-sm font-serif text-text-primary outline-none cursor-pointer"
                            >
                                <option value="petite_licence">Restaurant Restricted</option>
                                <option value="licence_iii">Licence III (Logic Alcohols)</option>
                                <option value="licence_iv">Licence IV (Full Spectrum)</option>
                                <option value="none">Zero Alcohol Protocol</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1">License ID</label>
                                <input
                                    type="text"
                                    value={legalInfo.licenseNumber}
                                    onChange={(e) => setLegalInfo(l => ({ ...l, licenseNumber: e.target.value }))}
                                    className="w-full px-6 py-4 bg-bg-primary border border-border rounded-2xl text-sm font-serif text-text-primary outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1">Expiry</label>
                                <input
                                    type="date"
                                    value={legalInfo.licenseExpiry}
                                    onChange={(e) => setLegalInfo(l => ({ ...l, licenseExpiry: e.target.value }))}
                                    className="w-full px-6 py-4 bg-bg-primary border border-border rounded-2xl text-sm font-serif text-text-primary outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-6 md:p-10 overflow-hidden relative"

                >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full blur-[80px] -mr-24 -mt-24 pointer-events-none" />
                    <div className="flex items-center gap-4 mb-10 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-bg-tertiary flex items-center justify-center text-accent">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-serif text-text-primary uppercase tracking-tight italic">Neural Shield</h3>
                    </div>
                    <div className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1">Policy Provider</label>
                            <input
                                type="text"
                                value={legalInfo.insuranceProvider}
                                onChange={(e) => setLegalInfo(l => ({ ...l, insuranceProvider: e.target.value }))}
                                className="w-full px-6 py-4 bg-bg-primary border border-border rounded-2xl text-sm font-serif text-text-primary outline-none"
                                placeholder="AXA, Allianz, Quantum Shield..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1">Policy Reference Node</label>
                            <input
                                type="text"
                                value={legalInfo.insurancePolicyNumber}
                                onChange={(e) => setLegalInfo(l => ({ ...l, insurancePolicyNumber: e.target.value }))}
                                className="w-full px-6 py-4 bg-bg-primary border border-border rounded-2xl text-sm font-serif text-text-primary outline-none"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Artifact Generation (Document Export) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-6 md:p-10 overflow-hidden relative"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                <div className="flex items-center gap-4 mb-10 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                            Artifact Synthesis
                        </h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Automated Legal Document Generation</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                    {[
                        { name: 'Legal Protocol', label: 'Mentions Légales', icon: Scale },
                        { name: 'Service Terms', label: 'CGV / Terms', icon: Gavel },
                        { name: 'Privacy Shield', label: 'RGPD / Privacy', icon: ShieldCheck },
                    ].map((doc, idx) => (
                        <motion.button
                            key={doc.name}
                            whileHover={{ scale: 1.05, y: -4 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleExport(doc.name)}
                            className="p-8 bg-bg-primary rounded-[2rem] border border-border flex flex-col items-center gap-4 group hover:border-accent/40 hover:shadow-lg transition-all duration-500"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border group-hover:bg-accent group-hover:text-bg-primary transition-all duration-500 shadow-inner">
                                <doc.icon className="w-8 h-8 text-text-primary group-hover:text-bg-primary" />
                            </div>
                            <div className="text-center">
                                <span className="block font-serif text-text-primary uppercase tracking-tight italic">{doc.name}</span>
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{doc.label}</span>
                            </div>
                            <div className="mt-2 flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20 group-hover:bg-accent group-hover:text-bg-primary transition-all duration-500">
                                <Download className="w-3 h-3" />
                                <span className="text-[9px] font-bold uppercase tracking-widest">Synthesize</span>
                            </div>
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
                    className="flex items-center gap-4 px-12 py-6 bg-text-primary text-bg-primary rounded-[2rem] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all disabled:opacity-50 group border border-border"
                >
                    {isSaving ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <div className="relative">
                            <Stamp className="w-6 h-6 transition-transform group-hover:scale-110" />
                            <div className="absolute inset-0 bg-white/40 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    )}
                    Commit Legal State
                </motion.button>
            </div>
        </div>
    );
}
