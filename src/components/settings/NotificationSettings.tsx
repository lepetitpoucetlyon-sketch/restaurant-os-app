"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "@/context/SettingsContext";
import { NotificationsConfig } from "@/types/settings";
import {
    Bell,
    Save,
    Loader2,
    Mail,
    MessageSquare,
    Smartphone,
    Volume2,
    AlertTriangle,
    TrendingUp,
    ClipboardCheck,
    Calendar,
    Package,
    Users,
    Zap,
    Clock,
    ShieldAlert,
    Wifi
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertConfig {
    id: string;
    label: string;
    description: string;
    icon: React.ElementType;
    color: string;
    email: boolean;
    push: boolean;
    sms: boolean;
}

const ALERT_CONFIGS: AlertConfig[] = [
    { id: 'new_reservation', label: 'Booking Request', description: 'Incoming client synchronization', icon: Calendar, color: '#3B82F6', email: true, push: true, sms: false },
    { id: 'cancel_reservation', label: 'Booking Termination', description: 'Client session cancellation', icon: AlertTriangle, color: '#EF4444', email: true, push: true, sms: false },
    { id: 'low_stock', label: 'Material Depletion', description: 'Resource threshold reached', icon: Package, color: '#8B5CF6', email: true, push: true, sms: false },
    { id: 'expiring_stock', label: 'DLC Criticality', description: 'Immediate expiration risk', icon: ShieldAlert, color: '#F59E0B', email: true, push: true, sms: false },
    { id: 'haccp_alert', label: 'HACCP Breach', description: 'Thermal variance detected', icon: ClipboardCheck, color: '#DC2626', email: true, push: true, sms: true },
    { id: 'goal_reached', label: 'Target Synchronized', description: 'Revenue threshold achieved', icon: TrendingUp, color: '#22C55E', email: false, push: true, sms: false },
    { id: 'staff_absence', label: 'Node Absence', description: 'Labor availability shift', icon: Users, color: '#EC4899', email: true, push: true, sms: false },
];

export default function NotificationSettings() {
    const { settings, updateConfig, updateList, isSaving: contextIsSaving } = useSettings();
    const [localConfig, setLocalConfig] = useState<NotificationsConfig>(settings.notificationsConfig || {
        globalSound: true,
        doNotDisturb: false,
        dndStartTime: '22:00',
        dndEndTime: '08:00',
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        await updateConfig('notificationsConfig', localConfig);
        setIsSaving(false);
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Signal Core (Global Settings) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-10 overflow-hidden relative group"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32 transition-opacity group-hover:opacity-100 opacity-50 pointer-events-none" />

                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent">
                        <Wifi className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                            Neural Signal Core
                        </h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Global Dispatch Parameters</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className={cn(
                        "p-8 rounded-[2rem] border transition-all duration-500",
                        localConfig.globalSound
                            ? "bg-bg-tertiary border-accent/30 shadow-lg"
                            : "bg-bg-primary border-border"
                    )}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                                    localConfig.globalSound ? "bg-accent text-white shadow-lg shadow-accent/20" : "bg-bg-tertiary text-text-muted"
                                )}>
                                    <Volume2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-text-primary uppercase tracking-tight">Audio Feedback</p>
                                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Acoustic notification triggers</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setLocalConfig(s => ({ ...s, globalSound: !s.globalSound }))}
                                className={cn(
                                    "w-14 h-7 rounded-full relative transition-all duration-500",
                                    localConfig.globalSound ? "bg-accent" : "bg-bg-tertiary border border-border"
                                )}
                            >
                                <motion.div
                                    animate={{ x: localConfig.globalSound ? 28 : 2 }}
                                    className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md"
                                />
                            </button>
                        </div>
                    </div>

                    <div className={cn(
                        "p-8 rounded-[2rem] border transition-all duration-500",
                        localConfig.doNotDisturb
                            ? "bg-text-primary border-text-primary shadow-2xl"
                            : "bg-bg-primary border-border"
                    )}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-5">
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                                    localConfig.doNotDisturb ? "bg-bg-primary text-text-primary" : "bg-bg-tertiary text-text-muted"
                                )}>
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className={cn("font-bold uppercase tracking-tight", localConfig.doNotDisturb ? "text-bg-primary" : "text-text-primary")}>Silence Protocol</p>
                                    <p className={cn("text-[10px] font-bold uppercase tracking-widest mt-1", localConfig.doNotDisturb ? "text-bg-primary/60" : "text-text-muted")}>Suppress all outgoing signals</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setLocalConfig(s => ({ ...s, doNotDisturb: !s.doNotDisturb }))}
                                className={cn(
                                    "w-14 h-7 rounded-full relative transition-all duration-500",
                                    localConfig.doNotDisturb ? "bg-bg-primary" : "bg-bg-tertiary border border-border"
                                )}
                            >
                                <motion.div
                                    animate={{ x: localConfig.doNotDisturb ? 28 : 2 }}
                                    className={cn("absolute top-1 left-1 w-5 h-5 rounded-full shadow-md", localConfig.doNotDisturb ? "bg-text-primary" : "bg-white")}
                                />
                            </button>
                        </div>

                        <AnimatePresence>
                            {localConfig.doNotDisturb && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="flex items-center gap-4 mt-6 pt-6 border-t border-bg-primary/10">
                                        <div className="flex-1 space-y-2">
                                            <label className="block text-[9px] font-bold text-bg-primary/60 uppercase tracking-widest">Activation</label>
                                            <input
                                                type="time"
                                                value={localConfig.dndStartTime}
                                                onChange={(e) => setLocalConfig(s => ({ ...s, dndStartTime: e.target.value }))}
                                                className="w-full px-4 py-3 bg-bg-primary/10 border border-bg-primary/10 rounded-xl text-bg-primary font-bold text-xs outline-none focus:bg-bg-primary/20 transition-all"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <label className="block text-[9px] font-bold text-bg-primary/60 uppercase tracking-widest">Termination</label>
                                            <input
                                                type="time"
                                                value={localConfig.dndEndTime}
                                                onChange={(e) => setLocalConfig(s => ({ ...s, dndEndTime: e.target.value }))}
                                                className="w-full px-4 py-3 bg-bg-primary/10 border border-bg-primary/10 rounded-xl text-bg-primary font-bold text-xs outline-none focus:bg-bg-primary/20 transition-all"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>

            {/* Matrix Logic (Alert Configuration) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-10"
            >
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent">
                        <Zap className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                            Signal Matrix
                        </h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Routing & Priority Configuration</p>
                    </div>
                </div>

                {/* Matrix Header */}
                <div className="grid grid-cols-[1fr,100px,100px,100px] gap-6 mb-6 px-10">
                    <div />
                    {[
                        { label: 'SMTP', icon: Mail },
                        { label: 'Push', icon: Smartphone },
                        { label: 'SMS', icon: MessageSquare }
                    ].map((channel) => (
                        <div key={channel.label} className="text-center space-y-2">
                            <div className="w-10 h-10 mx-auto rounded-xl bg-bg-tertiary flex items-center justify-center border border-border">
                                <channel.icon className="w-4 h-4 text-text-muted" />
                            </div>
                            <p className="text-[9px] font-bold text-text-muted uppercase tracking-[0.2em]">{channel.label}</p>
                        </div>
                    ))}
                </div>

                {/* Signal Rows */}
                <div className="space-y-4">
                    {settings.notificationRoutings.map((alert, idx) => {
                        const Icon = ALERT_CONFIGS.find(c => c.id === alert.eventType)?.icon || Bell;
                        const label = ALERT_CONFIGS.find(c => c.id === alert.eventType)?.label || alert.eventType;
                        const description = ALERT_CONFIGS.find(c => c.id === alert.eventType)?.description || 'Signal routing configuration';
                        // Use accent color for checkmarks instead of hardcoded colors for better consistency, or keep them if they represent severity
                        const color = ALERT_CONFIGS.find(c => c.id === alert.eventType)?.color || '#94a3b8';

                        return (
                            <motion.div
                                key={alert.eventType}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + (idx * 0.05) }}
                                className="grid grid-cols-[1fr,100px,100px,100px] gap-6 p-6 md:p-8 bg-bg-primary rounded-[2.5rem] border border-border shadow-sm hover:shadow-md transition-all group items-center"
                            >
                                <div className="flex items-center gap-6">
                                    <div
                                        className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500 bg-bg-tertiary border border-border"
                                    >
                                        <Icon className="w-7 h-7 text-text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-serif text-text-primary uppercase tracking-tight text-lg italic">{label}</p>
                                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">{description}</p>
                                    </div>
                                </div>

                                {['email', 'push', 'sms'].map((channel) => {
                                    const isActive = alert.channels.includes(channel as any);
                                    return (
                                        <div key={channel} className="flex justify-center items-center">
                                            <button
                                                onClick={() => {
                                                    const newChannels = isActive
                                                        ? alert.channels.filter(c => c !== channel)
                                                        : [...alert.channels, channel as any];
                                                    const newRoutings = settings.notificationRoutings.map(r =>
                                                        r.eventType === alert.eventType ? { ...r, channels: newChannels } : r
                                                    );
                                                    updateList('notificationRoutings', newRoutings);
                                                }}
                                                className={cn(
                                                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 border",
                                                    isActive
                                                        ? "bg-text-primary border-text-primary text-bg-primary shadow-lg"
                                                        : "bg-bg-tertiary border-border text-text-muted hover:border-accent/50"
                                                )}
                                            >
                                                <AnimatePresence mode="wait">
                                                    {isActive ? (
                                                        <motion.div
                                                            key="active"
                                                            initial={{ scale: 0, rotate: -45 }}
                                                            animate={{ scale: 1, rotate: 0 }}
                                                            exit={{ scale: 0, rotate: 45 }}
                                                        >
                                                            <Zap className="w-5 h-5 fill-current" />
                                                        </motion.div>
                                                    ) : (
                                                        <motion.div
                                                            key="inactive"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                        >
                                                            <Circle className="w-1.5 h-1.5 fill-current opacity-20" />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </button>
                                        </div>
                                    );
                                })}
                            </motion.div>
                        );
                    })}
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
                    Synchronize Signals
                </motion.button>
            </div>
        </div>
    );
}

import { Circle } from "lucide-react";
