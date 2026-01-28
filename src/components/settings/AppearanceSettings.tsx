"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "@/context/SettingsContext";
import {
    Palette,
    Save,
    Loader2,
    Sun,
    Moon,
    Monitor,
    Type,
    Circle,
    Square,
    Sparkles,
    Layout,
    Layers,
    MousePointer2,
    Eye,
    Zap,
    ImagePlus,
    Upload,
    Trash2,
    Building2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PremiumSelect } from "@/components/ui/PremiumSelect";
import { useTheme } from "@/context/ThemeContext";

const PRESET_COLORS = [
    { name: 'Gold', primary: '#C5A059', secondary: '#3B82F6', bg: 'bg-gold-500/10' },
    { name: 'Emerald', primary: '#10B981', secondary: '#059669', bg: 'bg-emerald-500/10' },
    { name: 'Sapphire', primary: '#3B82F6', secondary: '#2563EB', bg: 'bg-blue-500/10' },
    { name: 'Ruby', primary: '#EF4444', secondary: '#991B1B', bg: 'bg-rose-500/10' },
    { name: 'Amethyst', primary: '#8B5CF6', secondary: '#6D28D9', bg: 'bg-purple-500/10' },
];

const FONT_OPTIONS = [
    { name: 'Outfit (Premium)', value: 'Outfit' },
    { name: 'Inter (Clean)', value: 'Inter' },
    { name: 'Roboto (System)', value: 'Roboto' },
    { name: 'Poppins (Soft)', value: 'Poppins' },
    { name: 'Montserrat (Modern)', value: 'Montserrat' },
];

export default function AppearanceSettings() {
    const { settings, updateIdentity, isSaving } = useSettings();
    const theme = useTheme();
    const [logo, setLogo] = useState(settings.identity?.logo || '');
    const logoInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setLogo(settings.identity?.logo || '');
    }, [settings]);

    const handleSave = async () => {
        if (logo !== settings.identity?.logo) {
            await updateIdentity({ logo });
        }
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogo(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Brand Identity (Logo & Visual Mark) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-10 overflow-hidden relative group"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32 transition-opacity group-hover:opacity-100 opacity-50 pointer-events-none" />

                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                            Identité de Marque
                        </h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Logo & Empreinte Visuelle</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-10 items-start">
                    {/* Logo Preview */}
                    <div className="flex flex-col items-center gap-4">
                        <div
                            className={cn(
                                "w-40 h-40 rounded-[2rem] border-2 border-dashed flex items-center justify-center overflow-hidden transition-all",
                                logo
                                    ? "border-accent/30 bg-bg-tertiary"
                                    : "border-border bg-bg-primary"
                            )}
                        >
                            {logo ? (
                                <img src={logo} alt="Restaurant Logo" className="w-full h-full object-contain p-2" />
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-text-muted">
                                    <ImagePlus className="w-10 h-10" strokeWidth={1} />
                                    <span className="text-[9px] font-bold uppercase tracking-widest">Aucun Logo</span>
                                </div>
                            )}
                        </div>
                        <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest text-center max-w-[160px]">
                            Recommandé : PNG, 512×512px
                        </p>
                    </div>

                    {/* Upload Actions */}
                    <div className="flex-1 space-y-6">
                        <div className="space-y-3">
                            <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1">Logo Restaurant</label>
                            <p className="text-sm text-text-muted leading-relaxed font-medium">
                                Votre logo apparaît sur les reçus, factures, le widget de réservation et dans toute l'interface. Téléchargez une image haute qualité.
                            </p>
                        </div>

                        <input
                            ref={logoInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                        />

                        <div className="flex gap-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => logoInputRef.current?.click()}
                                className="flex items-center gap-3 px-8 py-4 bg-text-primary text-bg-primary rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all"
                            >
                                <Upload className="w-4 h-4" />
                                {logo ? 'Changer le Logo' : 'Uploader le Logo'}
                            </motion.button>

                            {logo && (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setLogo('')}
                                    className="flex items-center gap-3 px-6 py-4 bg-error/10 text-error border border-error/20 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-error/20 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Supprimer
                                </motion.button>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Aesthetic Engine (Color Scheme) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-10 overflow-hidden relative group"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32 transition-opacity group-hover:opacity-100 opacity-50 pointer-events-none" />

                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent">
                        <Palette className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                            Calibration Esthétique
                        </h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Identité Chromatique & Tons</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
                    {PRESET_COLORS.map((preset) => (
                        <motion.button
                            key={preset.name}
                            whileHover={{ scale: 1.05, y: -4 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => theme.setAccentColor(preset.name.toLowerCase() as any)}
                            className={cn(
                                "group relative flex flex-col items-center gap-3 p-4 rounded-[1.5rem] border transition-all duration-300",
                                theme.accentColor === preset.name.toLowerCase()
                                    ? "bg-text-primary border-text-primary shadow-xl"
                                    : "bg-bg-tertiary border-border hover:border-accent/50"
                            )}
                        >
                            <div className="relative w-12 h-12">
                                <div
                                    className="absolute inset-0 rounded-full shadow-lg"
                                    style={{ background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})` }}
                                />
                                {theme.accentColor === preset.name.toLowerCase() && (
                                    <motion.div
                                        layoutId="preset-check"
                                        className="absolute -top-1 -right-1 w-5 h-5 bg-bg-primary rounded-full flex items-center justify-center border-2 border-text-primary"
                                    >
                                        <Sparkles className="w-3 h-3 text-text-primary" />
                                    </motion.div>
                                )}
                            </div>
                            <span className={cn(
                                "text-[10px] font-bold uppercase tracking-widest transition-colors",
                                theme.accentColor === preset.name.toLowerCase() ? "text-bg-primary" : "text-text-muted"
                            )}>{preset.name}</span>
                        </motion.button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 opacity-30 pointer-events-none">
                    <div className="space-y-4">
                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1">Couleur Primaire (Preset Actif)</label>
                        <div className="flex items-center gap-4 bg-bg-tertiary p-4 rounded-2xl border border-border">
                            <div className="w-12 h-12 rounded-xl" style={{ backgroundColor: theme.accentColor === 'gold' ? '#C5A059' : '#10B981' }} />
                            <div className="flex-1 space-y-1">
                                <span className="text-sm font-bold text-text-primary uppercase tracking-widest">{theme.accentColor}</span>
                                <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Global Accent ID</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Luminance Modulation (Theme Mode) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-10"
            >
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent-gold">
                        <Sun className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                            État de Luminance
                        </h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Calibration de la Luminosité</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                        { id: 'light', label: 'Spectre', desc: 'Photon Output Max', icon: Sun, style: 'bg-white text-neutral-900 border-neutral-100' },
                        { id: 'dark', label: 'Obsidienne', desc: 'Émission Zéro', icon: Moon, style: 'bg-neutral-900 text-white border-neutral-800' },
                        { id: 'auto', label: 'Dynamique', desc: 'Synchro Circadienne', icon: Monitor, style: 'bg-gradient-to-br from-white to-neutral-900 text-white/80 border-neutral-400' },
                    ].map((mode) => {
                        const Icon = mode.icon;
                        const isActive = theme.mode === mode.id;

                        // Override style for Silent Luxury consistnecy
                        const activeStyle = "bg-text-primary text-bg-primary border-text-primary shadow-xl";
                        const inactiveStyle = "bg-bg-tertiary text-text-muted border-border hover:border-accent/50 hover:text-text-primary";

                        return (
                            <motion.button
                                key={mode.id}
                                whileHover={{ scale: isActive ? 1 : 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => theme.setMode(mode.id as any)}
                                className={cn(
                                    "relative p-8 rounded-[2rem] border transition-all duration-500 flex flex-col items-center gap-4 overflow-hidden group",
                                    isActive ? activeStyle : inactiveStyle
                                )}
                            >
                                <div className={cn(
                                    "w-16 h-16 rounded-2xl flex items-center justify-center mb-2 transition-transform duration-500 bg-bg-primary/10 border border-white/20",
                                    isActive ? "scale-110 rotate-12" : "group-hover:scale-105"
                                )}>
                                    <Icon className="w-8 h-8" />
                                </div>
                                <div className="text-center">
                                    <p className={cn(
                                        "font-black text-sm uppercase tracking-tighter"
                                    )}>
                                        {mode.label}
                                    </p>
                                    <p className="text-[9px] font-bold uppercase tracking-widest mt-1 opacity-60">
                                        {mode.desc}
                                    </p>
                                </div>
                                {isActive && (
                                    <motion.div
                                        layoutId="mode-active"
                                        className="absolute inset-x-0 bottom-0 h-1 bg-accent-gold"
                                    />
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
                {/* Neural Typography */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-10"
                >
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent">
                            <Type className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-serif text-text-primary uppercase tracking-tight italic">
                                Synthèse Typographique
                            </h3>
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Typographie & Lisibilité</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <PremiumSelect
                            label="Police Corps Primaire"
                            value={theme.fontPrimary}
                            onChange={(val) => theme.setFontPrimary(val)}
                            options={FONT_OPTIONS.map(font => ({
                                value: font.value,
                                label: font.name,
                                icon: <Type className="w-4 h-4" />
                            }))}
                        />
                        <PremiumSelect
                            label="Projection des Titres"
                            value={theme.fontHeadings}
                            onChange={(val) => theme.setFontHeadings(val)}
                            options={FONT_OPTIONS.map(font => ({
                                value: font.value,
                                label: font.name,
                                icon: <Type className="w-4 h-4" />
                            }))}
                        />
                    </div>
                </motion.div>

                {/* Surface Dynamics (UI Style) */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-10"
                >
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent-gold">
                            <Layers className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-serif text-text-primary uppercase tracking-tight italic">
                                Dynamique de Surface
                            </h3>
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Bords & Logique de Mouvement</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1">Intensité de Courbure</label>
                            <div className="flex gap-2 p-1.5 bg-bg-tertiary rounded-2xl border border-border">
                                {[
                                    { id: 'none', label: 'Vif', icon: Square },
                                    { id: 'small', label: 'Minimal' },
                                    { id: 'medium', label: 'Équilibré' },
                                    { id: 'large', label: 'Doux' },
                                ].map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => theme.setBorderRadius(option.id as any)}
                                        className={cn(
                                            "flex-1 py-4 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all",
                                            theme.borderRadius === option.id
                                                ? "bg-text-primary text-bg-primary shadow-lg"
                                                : "text-text-muted hover:text-text-primary"
                                        )}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-6 bg-bg-tertiary rounded-[1.5rem] border border-border">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                                    theme.animations ? "bg-accent text-white" : "bg-bg-primary text-text-muted"
                                )}>
                                    <Zap className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-text-primary text-[10px] uppercase tracking-widest leading-none">Moteurs de Mouvement</p>
                                    <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mt-1 leading-none">Contrôles de Fluidité Améliorés</p>
                                </div>
                            </div>
                            <button
                                onClick={() => theme.setAnimations(!theme.animations)}
                                className={cn(
                                    "w-12 h-6 rounded-full relative transition-all duration-300",
                                    theme.animations ? "bg-accent" : "bg-text-muted/20"
                                )}
                            >
                                <motion.div
                                    animate={{ x: theme.animations ? 26 : 2 }}
                                    className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                                />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Live Hologram (Preview) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-10"
            >
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-text-primary">
                        <Eye className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                            Hologramme Live
                        </h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Sortie de Visualisation Temps Réel</p>
                    </div>
                </div>

                <div
                    className={cn(
                        "p-10 rounded-[2.5rem] border transition-all duration-700 relative overflow-hidden",
                        theme.mode === 'dark' ? "bg-black border-white/10" : "bg-white border-neutral-200"
                    )}
                >
                    <div className="absolute top-0 right-0 w-96 h-96 blur-[100px] opacity-20 -mr-48 -mt-48 transition-colors duration-700" style={{ backgroundColor: theme.accentColor === 'gold' ? '#C5A059' : theme.accentColor === 'emerald' ? '#10B981' : theme.accentColor === 'sapphire' ? '#3B82F6' : theme.accentColor === 'ruby' ? '#EF4444' : '#8B5CF6' }} />
                    <div className="absolute bottom-0 left-0 w-96 h-96 blur-[100px] opacity-10 -ml-48 -mb-48 transition-colors duration-700" style={{ backgroundColor: theme.accentColor === 'gold' ? '#C5A059' : theme.accentColor === 'emerald' ? '#10B981' : theme.accentColor === 'sapphire' ? '#3B82F6' : theme.accentColor === 'ruby' ? '#EF4444' : '#8B5CF6' }} />

                    <div className="relative z-10 flex flex-col gap-10">
                        <div className="flex items-center gap-6">
                            <div
                                className="w-20 h-20 rounded-[1.5rem] flex items-center justify-center shadow-xl transition-all duration-700 transform rotate-12"
                                style={{
                                    backgroundColor: theme.accentColor === 'gold' ? 'rgba(197,160,89,0.2)' : 'rgba(16,185,129,0.2)',
                                    color: theme.accentColor === 'gold' ? '#C5A059' : '#10B981'
                                }}
                            >
                                <Palette className="w-10 h-10" />
                            </div>
                            <div>
                                <h4
                                    className="text-3xl font-black uppercase tracking-tighter"
                                    style={{
                                        color: theme.mode === 'dark' ? '#fff' : '#1a1a1a',
                                        fontFamily: theme.fontHeadings
                                    }}
                                >
                                    Nexus Interface v1
                                </h4>
                                <p
                                    className="text-xs font-black uppercase tracking-[0.3em] opacity-40"
                                    style={{
                                        color: theme.mode === 'dark' ? '#999' : '#666',
                                        fontFamily: theme.fontPrimary
                                    }}
                                >
                                    Simulation Réalité Opérationnelle
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                className={cn(
                                    "px-10 py-5 font-black text-xs uppercase tracking-widest text-white shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95",
                                    theme.borderRadius === 'none' ? '' :
                                        theme.borderRadius === 'small' ? 'rounded-lg' :
                                            theme.borderRadius === 'medium' ? 'rounded-2xl' : 'rounded-[1.5rem]'
                                )}
                                style={{
                                    background: theme.accentColor === 'gold' ? 'linear-gradient(135deg, #C5A059, #3B82F6)' : '#10B981'
                                }}
                            >
                                Déployer État
                            </button>
                            <button
                                className={cn(
                                    "px-10 py-5 font-black text-xs uppercase tracking-widest border-2 transition-all duration-500 hover:bg-neutral-500/10 active:scale-95",
                                    theme.borderRadius === 'none' ? '' :
                                        theme.borderRadius === 'small' ? 'rounded-lg' :
                                            theme.borderRadius === 'medium' ? 'rounded-2xl' : 'rounded-[1.5rem]'
                                )}
                                style={{
                                    borderColor: theme.mode === 'dark' ? '#333' : '#eee',
                                    color: theme.mode === 'dark' ? '#fff' : '#111'
                                }}
                            >
                                Calibration
                            </button>
                        </div>
                    </div>
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
                            <Save className="w-5 h-5 transition-transform group-hover:scale-110" />
                        </div>
                    )}
                    Valider l'État Visuel
                </motion.button>
            </div>
        </div>
    );
}
