"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import {
    Monitor,
    Printer,
    Zap,
    LayoutGrid,
    Smartphone,
    Clock,
    Check,
    ChevronRight,
    Search,
    Database,
    CloudIcon,
    Sparkles,
    X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/context/LanguageContext";

interface POSSettingsDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const SETTINGS_TABS = [
    { id: 'interface', label: 'Interface', icon: Monitor },
    { id: 'hardware', label: 'Matériel', icon: Printer },
    { id: 'sales', label: 'Ventes', icon: Zap },
    { id: 'system', label: 'Système', icon: Database },
];

export function POSSettingsDialog({ isOpen, onClose }: POSSettingsDialogProps) {
    const [activeTab, setActiveTab] = useState('interface');
    const [isSaving, setIsSaving] = useState(false);
    const { showToast } = useToast();
    const { t } = useLanguage();

    const [config, setConfig] = useState({
        gridSize: 'auto',
        showImages: true,
        autoPrint: false,
        fastCheckout: true,
        confirmKitchen: true,
        confirmDelete: true,
        compactMode: false,
        soundEffects: true,
        printerSelection: 'EPSON-T88-MAIN',
    });

    const toggleConfig = (key: keyof typeof config) => {
        setConfig(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            showToast(t('pos.settings.actions.save_success'), "premium");
            onClose();
        }, 800);
    };

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.98, filter: "blur(10px)" },
        visible: {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 300,
                staggerChildren: 0.08,
                delayChildren: 0.1
            } as const
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="xl"
            className="p-0 border-none bg-transparent"
            showClose={false}
            noPadding
        >
            <div className="relative bg-bg-primary dark:bg-black border border-border dark:border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,1)] w-full overflow-hidden group/modal flex h-[650px]">
                {/* Visual Accent Glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent-gold/5 blur-[120px] pointer-events-none" />

                {/* Left Sidebar - Glassmorphic Architecture */}
                <div className="w-72 border-r border-border dark:border-white/5 bg-bg-secondary dark:bg-white/[0.02] backdrop-blur-3xl p-10 space-y-2 relative flex flex-col h-full z-10 shrink-0">
                    <div className="mb-12 px-2">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="w-12 h-12 rounded-xl bg-accent-gold/10 flex items-center justify-center border border-accent-gold/20 mb-6 shadow-glow">
                                <Monitor className="w-6 h-6 text-accent-gold" />
                            </div>
                            <p className="text-[9px] font-black text-accent-gold uppercase tracking-[0.4em] mb-2 leading-none">{t('pos.settings.intel_hub')}</p>
                            <h3 className="text-2xl font-serif font-black italic text-text-primary dark:text-white leading-none">{t('pos.settings.title')}</h3>
                        </motion.div>
                    </div>

                    <div className="flex-1 space-y-2">
                        {SETTINGS_TABS.map((tab, idx) => (
                            <motion.button
                                key={tab.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + idx * 0.05 }}
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "w-full flex items-center justify-between px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 relative group overflow-hidden",
                                    activeTab === tab.id
                                        ? "text-black dark:text-black shadow-glow"
                                        : "text-text-muted dark:text-white/40 hover:text-accent-gold hover:bg-bg-tertiary dark:hover:bg-white/5"
                                )}
                            >
                                <div className="flex items-center gap-5 relative z-10 font-black">
                                    <tab.icon strokeWidth={2.5} className={cn("w-4 h-4 transition-transform duration-500", activeTab === tab.id ? "scale-110 text-black" : "opacity-40 group-hover:opacity-100 group-hover:text-accent-gold")} />
                                    {t(`pos.settings.tabs.${tab.id}`)}
                                </div>
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTabIndicator"
                                        className="absolute inset-0 bg-accent-gold z-0"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </motion.button>
                        ))}
                    </div>

                    <div className="pt-6 mt-6 border-t border-white/5">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="p-6 rounded-[2rem] bg-accent-gold/5 border border-accent-gold/10 relative overflow-hidden group"
                        >
                            <div className="relative z-10 text-center">
                                <div className="flex items-center justify-center gap-2 mb-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse shadow-glow" />
                                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-accent-gold">Live Node</span>
                                </div>
                                <p className="text-[10px] font-black text-text-muted dark:text-white/40 tracking-wider">UK-MASTER-ARCHIVE</p>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Right Content Area */}
                <div className="flex-1 flex flex-col relative overflow-hidden bg-bg-primary dark:bg-white/[0.01]">
                    {/* Top Content Header */}
                    <div className="p-10 border-b border-border dark:border-white/5 flex items-center justify-between relative z-10 shrink-0">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-text-muted dark:text-white/20 uppercase tracking-[0.5em]">{t('pos.settings.arch_section')}</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-gold/40" />
                            <span className="text-[11px] font-black text-text-primary dark:text-white uppercase tracking-[0.3em]">
                                {t(`pos.settings.tabs.${activeTab}`)}
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-12 h-12 rounded-2xl bg-bg-tertiary dark:bg-white/5 hover:bg-bg-tertiary/80 dark:hover:bg-white/10 flex items-center justify-center transition-all border border-border dark:border-white/10 hover:rotate-90"
                        >
                            <X className="w-5 h-5 text-text-muted dark:text-white/40" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-12 elegant-scrollbar relative z-10">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                                variants={containerVariants}
                                className="h-full"
                            >
                                {activeTab === 'interface' && (
                                    <div className="space-y-14">
                                        <motion.section variants={itemVariants}>
                                            <div className="flex items-center justify-between mb-8 px-2">
                                                <div>
                                                    <h4 className="text-[10px] font-black text-accent-gold uppercase tracking-[0.4em] mb-2 leading-none">{t('pos.settings.grid.title')}</h4>
                                                    <p className="text-[11px] text-text-muted dark:text-white/40 font-serif italic uppercase tracking-widest">{t('pos.settings.grid.subtitle')}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-6">
                                                {[
                                                    { id: 'auto', label: t('pos.settings.grid.auto'), desc: t('pos.settings.grid.auto_desc'), icon: LayoutGrid },
                                                    { id: 'compact', label: t('pos.settings.grid.compact'), desc: t('pos.settings.grid.compact_desc'), icon: LayoutGrid },
                                                    { id: 'relaxed', label: t('pos.settings.grid.relaxed'), desc: t('pos.settings.grid.relaxed_desc'), icon: LayoutGrid },
                                                ].map(size => (
                                                    <motion.button
                                                        key={size.id}
                                                        variants={itemVariants}
                                                        whileHover={{ y: -4 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => setConfig(prev => ({ ...prev, gridSize: size.id }))}
                                                        className={cn(
                                                            "p-8 rounded-[2.5rem] border-2 transition-all duration-500 text-left group relative overflow-hidden",
                                                            config.gridSize === size.id
                                                                ? "border-accent-gold bg-accent-gold/10 text-accent-gold shadow-glow"
                                                                : "border-border dark:border-white/5 bg-bg-tertiary dark:bg-white/5 hover:border-accent-gold/40 dark:hover:border-white/20 hover:bg-accent-gold/5 dark:hover:bg-white/[0.08]"
                                                        )}
                                                    >
                                                        <size.icon strokeWidth={2} className={cn("w-6 h-6 mb-6 transition-all duration-500", config.gridSize === size.id ? "text-accent-gold scale-110" : "text-white/20 group-hover:text-accent-gold/50")} />
                                                        <p className="text-[11px] font-black text-text-primary dark:text-white uppercase tracking-[0.2em] block">{size.label}</p>
                                                        <p className="text-[9px] font-black text-text-muted dark:text-white/30 uppercase mt-2 tracking-[0.2em]">{size.desc}</p>
                                                        {config.gridSize === size.id && (
                                                            <div className="absolute top-8 right-8 w-6 h-6 bg-accent-gold text-black rounded-full flex items-center justify-center shadow-glow">
                                                                <Check className="w-4 h-4" strokeWidth={3} />
                                                            </div>
                                                        )}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </motion.section>

                                        <motion.section variants={itemVariants} className="space-y-6">
                                            <h4 className="text-[10px] font-black text-accent-gold uppercase tracking-[0.4em] mb-10 px-2 leading-none">{t('pos.settings.render.title')}</h4>
                                            <div className="space-y-4">
                                                {[
                                                    { id: 'showImages', label: t('pos.settings.render.visual'), desc: t('pos.settings.render.visual_desc'), icon: Monitor },
                                                    { id: 'compactMode', label: t('pos.settings.render.neural'), desc: t('pos.settings.render.neural_desc'), icon: Smartphone },
                                                    { id: 'soundEffects', label: t('pos.settings.render.acoustic'), desc: t('pos.settings.render.acoustic_desc'), icon: Zap },
                                                ].map((item) => (
                                                    <motion.div
                                                        key={item.id}
                                                        variants={itemVariants}
                                                        className="flex items-center justify-between p-8 rounded-[2.5rem] border border-border dark:border-white/5 bg-bg-tertiary dark:bg-white/5 hover:bg-accent-gold/5 dark:hover:bg-white/[0.08] hover:border-accent-gold/40 dark:hover:border-white/20 transition-all duration-500 cursor-pointer group"
                                                        onClick={() => toggleConfig(item.id as any)}
                                                    >
                                                        <div className="flex items-center gap-6">
                                                            <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-white/20 group-hover:text-accent-gold shadow-glow-sm transition-all duration-500">
                                                                <item.icon strokeWidth={1} className="w-7 h-7" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-black text-text-primary dark:text-white uppercase tracking-tight">{item.label}</p>
                                                                <p className="text-[10px] text-text-muted dark:text-white/30 font-black uppercase tracking-widest mt-1">{item.desc}</p>
                                                            </div>
                                                        </div>
                                                        <div className={cn(
                                                            "w-14 h-7 rounded-full p-1.5 transition-all duration-700 relative",
                                                            (config as any)[item.id] ? "bg-accent-gold" : "bg-white/10 shadow-inner"
                                                        )}>
                                                            <motion.div
                                                                animate={{ x: (config as any)[item.id] ? 28 : 0 }}
                                                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                                                className="w-4 h-4 bg-white rounded-full shadow-2xl relative z-10"
                                                            />
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.section>
                                    </div>
                                )}

                                {activeTab === 'hardware' && (
                                    <div className="h-full flex flex-col justify-center items-center text-center space-y-12">
                                        <motion.div variants={itemVariants} className="relative">
                                            <div className="w-40 h-40 bg-white/5 rounded-[3.5rem] flex items-center justify-center text-accent-gold/20 shadow-inner border border-white/5">
                                                <Printer className="w-16 h-16" strokeWidth={1} />
                                            </div>
                                            <div className="absolute -bottom-6 -right-6 w-16 h-16 rounded-full bg-black border-4 border-black flex items-center justify-center shadow-glow">
                                                <div className="w-4 h-4 rounded-full bg-accent-gold animate-pulse" />
                                            </div>
                                        </motion.div>
                                        <motion.div variants={itemVariants} className="space-y-6">
                                            <h4 className="text-4xl font-serif font-black text-text-primary dark:text-white italic tracking-tighter">{t('pos.settings.hardware.title')}</h4>
                                            <p className="text-[11px] text-accent-gold uppercase font-black tracking-[0.5em] max-w-[400px] mx-auto leading-loose opacity-60">{t('pos.settings.hardware.testing')}</p>
                                        </motion.div>
                                        <motion.button
                                            variants={itemVariants}
                                            whileHover={{ scale: 1.05, y: -4 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-14 py-6 bg-accent-gold text-black rounded-full text-[11px] font-black uppercase tracking-[0.5em] shadow-glow hover:bg-white transition-all duration-700"
                                        >
                                            {t('pos.settings.hardware.scan')}
                                        </motion.button>
                                    </div>
                                )}

                                {activeTab === 'sales' && (
                                    <div className="space-y-8">
                                        <motion.h4 variants={itemVariants} className="text-[10px] font-black text-accent-gold uppercase tracking-[0.4em] mb-12 px-2 leading-none">{t('pos.settings.sales.title')}</motion.h4>
                                        <div className="space-y-4">
                                            {[
                                                { id: 'autoPrint', label: t('pos.settings.sales.logistics'), desc: t('pos.settings.sales.logistics_desc'), icon: Printer },
                                                { id: 'fastCheckout', label: t('pos.settings.sales.speed'), desc: t('pos.settings.sales.speed_desc'), icon: Zap },
                                                { id: 'confirmKitchen', label: t('pos.settings.sales.kitchen'), desc: t('pos.settings.sales.kitchen_desc'), icon: Clock },
                                                { id: 'confirmDelete', label: t('pos.settings.sales.cart_security'), desc: t('pos.settings.sales.cart_security_desc'), icon: Check },
                                            ].map((item) => (
                                                <motion.div
                                                    key={item.id}
                                                    variants={itemVariants}
                                                    className="group flex items-center justify-between p-8 rounded-[2.5rem] border border-border dark:border-white/5 bg-bg-tertiary dark:bg-white/5 hover:bg-accent-gold/5 dark:hover:bg-white/[0.08] hover:border-accent-gold/40 dark:hover:border-white/20 transition-all duration-500 cursor-pointer"
                                                    onClick={() => toggleConfig(item.id as any)}
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-white/20 group-hover:text-accent-gold shadow-glow-sm transition-all duration-500">
                                                            <item.icon strokeWidth={1} className="w-7 h-7" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-text-primary dark:text-white uppercase tracking-tight">{item.label}</p>
                                                            <p className="text-[10px] text-text-muted dark:text-white/30 font-black uppercase tracking-widest mt-1">{item.desc}</p>
                                                        </div>
                                                    </div>
                                                    <div className={cn(
                                                        "w-14 h-7 rounded-full p-1.5 transition-all duration-700 relative",
                                                        (config as any)[item.id] ? "bg-accent-gold" : "bg-white/10 shadow-inner"
                                                    )}>
                                                        <motion.div
                                                            animate={{ x: (config as any)[item.id] ? 28 : 0 }}
                                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                                            className="w-4 h-4 bg-white rounded-full shadow-2xl relative z-10"
                                                        />
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'system' && (
                                    <div className="space-y-12">
                                        <motion.div
                                            variants={itemVariants}
                                            className="p-14 rounded-[3.5rem] bg-accent-gold text-black relative overflow-hidden group shadow-glow"
                                        >
                                            <div className="relative z-10 flex items-center gap-10">
                                                <div className="w-24 h-24 rounded-[2.5rem] bg-black/10 backdrop-blur-3xl flex items-center justify-center transition-transform group-hover:rotate-12 duration-1000">
                                                    <CloudIcon className="w-12 h-12 text-black/60" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.5em] mb-3 leading-none underline decoration-black/10 underline-offset-4">{t('pos.settings.system.kernel')}</p>
                                                    <h3 className="text-6xl font-serif font-black italic text-black tracking-tighter leading-none">V2.4.8</h3>
                                                    <p className="text-[10px] text-black/30 mt-6 font-mono font-black tracking-[0.3em]">BUILD-EXEC-ALPHRES</p>
                                                </div>
                                            </div>
                                            <div className="absolute top-12 right-12 animate-pulse text-black">
                                                <div className="w-16 h-16 rounded-full border border-black/10 flex items-center justify-center">
                                                    <div className="w-3 h-3 rounded-full bg-black/40" />
                                                </div>
                                            </div>
                                            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-black/5 rounded-full blur-[100px] pointer-events-none" />
                                        </motion.div>

                                        <div className="space-y-4">
                                            {[
                                                { label: t('pos.settings.system.archive_sync'), value: 'Neural Sync Active', icon: CloudIcon },
                                                { label: t('pos.settings.system.uptime'), value: '99.98% Guaranteed', icon: Clock },
                                                { label: t('pos.settings.system.latency'), value: '14ms Edge Response', icon: Monitor },
                                            ].map((stat, i) => (
                                                <motion.div
                                                    key={i}
                                                    variants={itemVariants}
                                                    className="flex items-center justify-between p-8 rounded-[2.5rem] border border-border dark:border-white/5 bg-bg-tertiary dark:bg-white/5 hover:bg-accent-gold/5 dark:hover:bg-white/[0.08] hover:border-accent-gold/40 dark:hover:border-white/20 transition-all duration-500 group"
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center border border-white/10 transition-colors group-hover:bg-accent-gold/20">
                                                            <stat.icon className="w-5 h-5 text-white/20 group-hover:text-accent-gold transition-colors" />
                                                        </div>
                                                        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] group-hover:text-white transition-colors">{stat.label}</span>
                                                    </div>
                                                    <span className="text-[11px] font-black text-accent-gold uppercase italic tracking-[0.2em]">{stat.value}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Footer Action - Cinematic Bar */}
                    <div className="p-10 border-t border-white/5 bg-white/[0.02] flex items-center justify-between relative shrink-0">
                        <button
                            onClick={() => setConfig({
                                gridSize: 'auto',
                                showImages: true,
                                autoPrint: false,
                                fastCheckout: true,
                                confirmKitchen: true,
                                confirmDelete: true,
                                compactMode: false,
                                soundEffects: true,
                                printerSelection: 'EPSON-T88-MAIN',
                            })}
                            className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] hover:text-accent-gold transition-all duration-500 border-b border-transparent hover:border-accent-gold"
                        >
                            {t('pos.settings.actions.reset')}
                        </button>
                        <div className="flex items-center gap-8">
                            <p className="px-10 py-4 text-[11px] font-black text-text-muted dark:text-white/30 uppercase tracking-[0.4em] hover:text-text-primary dark:hover:text-white transition-all">
                                {t('pos.settings.actions.abandon')}
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSave}
                                disabled={isSaving}
                                className={cn(
                                    "flex items-center gap-5 px-14 py-6 bg-accent-gold text-black rounded-[22px] text-[11px] font-black uppercase tracking-[0.5em] shadow-glow transition-all duration-700 relative overflow-hidden group",
                                    isSaving && "opacity-50 cursor-not-allowed grayscale"
                                )}
                            >
                                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                                {isSaving ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin relative z-10" />
                                        <span className="relative z-10">{t('pos.settings.actions.saving')}</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform" />
                                        <span className="relative z-10">{t('pos.settings.actions.save')}</span>
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
