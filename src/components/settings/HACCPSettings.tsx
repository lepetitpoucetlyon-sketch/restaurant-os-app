"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ClipboardCheck,
    Save,
    Loader2,
    Thermometer,
    AlertTriangle,
    FileText,
    Clock,
    Shield,
    Users,
    Camera,
    Bell,
    Calendar,
    CheckCircle2,
    Zap,
    Layout,
    Timer,
    ShieldCheck,
    MessageSquare,
    Sparkles,
    Activity,
    Target,
    Cloud,
    Database,
    Fingerprint,
    Cpu,
    Radio
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSettings } from "@/context/SettingsContext";
import { HACCPConfig, ControlPoint as SettingsControlPoint } from "@/types/settings";

interface TemperatureZone {
    id: string;
    name: string;
    type: 'fridge' | 'freezer' | 'hot' | 'ambient';
    minTemp: number;
    maxTemp: number;
    frequency: number;
    sensorId: string;
    autoAlert: boolean;
}

export default function HACCPSettings() {
    const { settings: globalSettings, updateConfig, updateList, isSaving: contextIsSaving } = useSettings();
    const [isSaving, setIsSaving] = useState(false);

    // Local state for buffered edits
    const [localConfig, setLocalConfig] = useState<HACCPConfig>(globalSettings.haccpConfig || {
        tempCheckFrequencyHours: 2,
        tempAlertDelay: 15,
        tempCriticalDelay: 5,
        autoTempRecording: true,
        sensorIntegration: true,
        tempLogRetentionDays: 365,
        digitalChecklist: true,
        photoRequired: true,
        signatureRequired: true,
        supervisorValidation: true,
        correctiveActionRequired: true,
        alertOnNonConformity: true,
        alertSupervisor: true,
        alertEmail: 'haccp@neural-restaurant.ai',
        alertSMS: true,
        alertPhone: '+33600000000',
        escalationDelay: 30,
        lotTrackingEnabled: true,
        supplierTrackingEnabled: true,
        productionDateRequired: true,
        expiryDateRequired: true,
        allergenTracking: true,
        autoGenerateReports: true,
        reportFrequency: 'weekly',
        pdfExport: true,
        cloudBackup: true,
        retentionYears: 3,
        trainingReminders: true,
        trainingFrequencyMonths: 12,
        certificationTracking: true,
        internalAuditFrequency: 'monthly',
        externalAuditReminder: true,
        auditScoreTarget: 90,
        nonConformityTracking: true,
        temperatureZones: [],
    });

    const [controlPoints, setControlPoints] = useState<SettingsControlPoint[]>(globalSettings.haccpControlPoints || []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateConfig('haccpConfig', localConfig);
            await updateList('haccpControlPoints', controlPoints);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Bioshield Thermal Matrix (Temperature) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-6 md:p-10 overflow-hidden relative group"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] -mr-32 -mt-32 transition-opacity group-hover:opacity-100 opacity-50 pointer-events-none" />

                <div className="flex items-center gap-4 mb-10 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent">
                        <Thermometer className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                            Bioshield Thermal Matrix
                        </h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Autonomous Environmental Guardian Protocols</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10 relative z-10">
                    <div className="bg-bg-primary p-8 rounded-[2rem] border border-border shadow-sm space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1">Check Pulse (Hrs)</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="number"
                                value={localConfig.tempCheckFrequencyHours}
                                onChange={(e) => setLocalConfig(s => ({ ...s, tempCheckFrequencyHours: Number(e.target.value) }))}
                                className="w-full bg-transparent text-4xl font-serif text-text-primary outline-none"
                                data-tutorial="settings-2-2"
                            />
                            <Clock className="w-6 h-6 text-text-muted" />
                        </div>
                    </div>
                    <div className="bg-bg-primary p-8 rounded-[2rem] border border-border space-y-2">
                        <label className="text-[10px] font-bold text-accent uppercase tracking-widest px-1">Warn Delay (Min)</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="number"
                                value={localConfig.tempAlertDelay}
                                onChange={(e) => setLocalConfig(s => ({ ...s, tempAlertDelay: Number(e.target.value) }))}
                                className="w-full bg-transparent text-4xl font-serif text-accent outline-none"
                                data-tutorial="settings-2-3"
                            />
                            <AlertTriangle className="w-6 h-6 text-accent/50" />
                        </div>
                    </div>
                    <div className="bg-bg-primary p-8 rounded-[2rem] border border-border space-y-2">
                        <label className="text-[10px] font-bold text-accent uppercase tracking-widest px-1">Panic Delay (Min)</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="number"
                                value={localConfig.tempCriticalDelay}
                                onChange={(e) => setLocalConfig(s => ({ ...s, tempCriticalDelay: Number(e.target.value) }))}
                                className="w-full bg-transparent text-4xl font-serif text-accent outline-none"
                            />
                            <Zap className="w-6 h-6 text-accent/50" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                    {localConfig.temperatureZones.map((zone, idx) => (
                        <motion.div
                            key={zone.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + (idx * 0.05) }}
                            className={cn(
                                "flex items-center gap-6 p-6 rounded-[2rem] border transition-all duration-500 group",
                                "bg-bg-primary border-border hover:border-accent/40 shadow-sm"
                            )}
                        >
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 bg-bg-tertiary text-accent"
                            )}>
                                <Thermometer className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <p className="font-serif text-text-primary uppercase tracking-tight text-lg italic">{zone.name}</p>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-2 py-0.5 bg-bg-tertiary rounded-full border border-border">
                                        {zone.minTemp}° to {zone.maxTemp}°C
                                    </span>
                                    <span className="text-[9px] font-bold text-text-muted uppercase">Freq: Every {zone.frequency}H</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setLocalConfig(prev => ({
                                    ...prev,
                                    temperatureZones: prev.temperatureZones.map(z => z.id === zone.id ? { ...z, autoAlert: !z.autoAlert } : z)
                                }))}
                                className={cn(
                                    "w-12 h-6 rounded-full relative transition-all duration-500 shadow-inner",
                                    zone.autoAlert ? "bg-accent" : "bg-bg-tertiary"
                                )}
                            >
                                <motion.div
                                    animate={{ x: zone.autoAlert ? 26 : 2 }}
                                    className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md"
                                />
                            </button>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 flex gap-4 relative z-10">
                    {[
                        { key: 'autoTempRecording', label: 'Autonomous Logging', icon: Database },
                        { key: 'sensorIntegration', label: 'Direct Sensor Sync (IoT)', icon: Radio },
                    ].map((item) => (
                        <motion.button
                            key={item.key}
                            onClick={() => setLocalConfig(s => ({ ...s, [item.key]: !localConfig[item.key as keyof HACCPConfig] }))}
                            data-tutorial={item.key === "sensorIntegration" ? "haccp-1-1" : undefined}
                            className={cn(
                                "flex-1 p-6 rounded-[2rem] border transition-all duration-500 flex items-center justify-between group",
                                localConfig[item.key as keyof HACCPConfig]
                                    ? "bg-bg-primary border-accent/40 shadow-lg"
                                    : "bg-bg-tertiary border-border opacity-70 hover:opacity-100"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <item.icon className={cn("w-5 h-5 transition-colors", localConfig[item.key as keyof HACCPConfig] ? "text-accent" : "text-text-muted")} />
                                <span className={cn("font-bold uppercase tracking-widest text-[10px]", localConfig[item.key as keyof HACCPConfig] ? "text-text-primary" : "text-text-muted")}>{item.label}</span>
                            </div>
                            <div className={cn(
                                "w-10 h-5 rounded-full relative transition-all duration-500 shadow-inner",
                                localConfig[item.key as keyof HACCPConfig] ? "bg-accent" : "bg-bg-tertiary"
                            )}>
                                <motion.div
                                    animate={{ x: localConfig[item.key as keyof HACCPConfig] ? 22 : 2 }}
                                    className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full"
                                />
                            </div>
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* Neural Control Matrix (Checkpoints) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-6 md:p-10"
            >
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent">
                            <ClipboardCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                                Neural Control Matrix
                            </h3>
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{controlPoints.filter(c => c.isRequired).length} Critical Signal Thresholds Active</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {controlPoints.map((cp, idx) => (
                        <motion.div
                            key={cp.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 + (idx * 0.03) }}
                            className={cn(
                                "flex items-center gap-6 p-6 rounded-[2.5rem] border transition-all duration-500 group overflow-hidden relative",
                                cp.isRequired ? 'bg-bg-primary border-accent/30 hover:border-accent/50' : 'bg-bg-primary border-border hover:border-border/80'
                            )}
                        >
                            {cp.isRequired && <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none" />}
                            <div className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500",
                                cp.isRequired ? 'bg-accent/10 text-accent' : 'bg-bg-tertiary text-text-muted'
                            )}>
                                {cp.isRequired ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                            </div>
                            <div className="flex-1">
                                <p className="font-serif text-text-primary uppercase tracking-tight text-lg italic">{cp.name}</p>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest px-2 py-0.5 bg-bg-tertiary rounded-full border border-border">
                                        {cp.category} Node
                                    </span>
                                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Responsibility: {cp.responsibleId}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Interval</p>
                                <span className="text-[10px] font-bold text-text-primary uppercase tracking-widest px-3 py-1 bg-bg-tertiary border border-border rounded-full shadow-sm">
                                    {cp.frequency}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { key: 'digitalChecklist', label: 'Neural Checklist', icon: ClipboardCheck },
                        { key: 'photoRequired', label: 'Visual Capture', icon: Camera },
                        { key: 'signatureRequired', label: 'Biometric Confirm', icon: Fingerprint },
                        { key: 'supervisorValidation', label: 'Admin Override', icon: Users },
                    ].map((item) => {
                        const isEnabled = localConfig[item.key as keyof HACCPConfig];
                        return (
                            <motion.button
                                key={item.key}
                                onClick={() => setLocalConfig(s => ({ ...s, [item.key]: !localConfig[item.key as keyof HACCPConfig] }))}
                                className={cn(
                                    "p-6 rounded-[2rem] border transition-all duration-500 flex flex-col gap-4 text-left group",
                                    localConfig[item.key as keyof HACCPConfig]
                                        ? "bg-bg-primary border-accent/40 shadow-lg text-text-primary"
                                        : "bg-bg-tertiary border-border text-text-muted opacity-70 hover:opacity-100"
                                )}
                            >
                                <div className="flex justify-between items-start">
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                                        isEnabled ? "bg-accent/10 text-accent shadow-inner" : "bg-bg-primary text-text-muted"
                                    )}>
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div className={cn(
                                        "w-8 h-4 rounded-full relative transition-all duration-500 shadow-inner",
                                        localConfig[item.key as keyof HACCPConfig] ? "bg-accent" : "bg-bg-tertiary border border-border"
                                    )}>
                                        <motion.div
                                            animate={{ x: localConfig[item.key as keyof HACCPConfig] ? 18 : 2 }}
                                            className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full"
                                        />
                                    </div>
                                </div>
                                <span className="font-bold uppercase tracking-widest text-[9px]">{item.label}</span>
                            </motion.button>
                        );
                    })}
                </div>
            </motion.div>

            {/* Neural Alerts & Signal Escalation */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-bg-secondary rounded-[2.5rem] border border-border shadow-premium p-6 md:p-10 overflow-hidden relative"
            >
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />

                <div className="flex items-center gap-4 mb-10 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent">
                        <Bell className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                            Signal Escalation
                        </h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Active Neural Alert Routing & Crisis Pathways</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10 mb-10">
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1">Primary Alert Node (Email)</label>
                        <div className="relative group">
                            <input
                                type="email"
                                value={localConfig.alertEmail}
                                onChange={(e) => setLocalConfig(s => ({ ...s, alertEmail: e.target.value }))}
                                className="w-full px-8 py-5 bg-bg-primary border border-border rounded-[2rem] text-sm font-bold text-text-primary outline-none focus:border-accent transition-all italic"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1">Emergency Uplink (Phone)</label>
                        <input
                            type="tel"
                            value={localConfig.alertPhone}
                            onChange={(e) => setLocalConfig(s => ({ ...s, alertPhone: e.target.value }))}
                            className="w-full px-8 py-5 bg-bg-primary border border-border rounded-[2rem] text-sm font-bold text-text-primary outline-none focus:border-accent transition-all font-mono tracking-widest"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1">Escalation Threshold (Min)</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={localConfig.escalationDelay}
                                onChange={(e) => setLocalConfig(s => ({ ...s, escalationDelay: Number(e.target.value) }))}
                                className="w-full px-8 py-5 bg-bg-primary border border-border rounded-[2rem] text-3xl font-serif text-text-primary outline-none focus:border-accent transition-all"
                            />
                            <span className="absolute right-8 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted uppercase tracking-widest">Min</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                    {[
                        { key: 'alertOnNonConformity', label: 'Zero Deviation Signal' },
                        { key: 'alertSupervisor', label: 'Admin Node Ping' },
                        { key: 'alertSMS', label: 'Global GSM Burst' },
                    ].map((item) => {
                        const isEnabled = localConfig[item.key as keyof HACCPConfig] as boolean;
                        return (
                            <motion.button
                                key={item.key}
                                onClick={() => setLocalConfig(s => ({ ...s, [item.key]: !isEnabled }))}
                                className={cn(
                                    "flex items-center justify-between p-6 rounded-[2rem] border transition-all duration-500 text-left",
                                    isEnabled
                                        ? "bg-bg-primary border-accent/40 shadow-lg"
                                        : "bg-bg-tertiary border-border text-text-muted hover:border-border/80"
                                )}
                            >
                                <span className={cn("font-bold uppercase tracking-widest text-[10px]", isEnabled ? "text-text-primary" : "text-text-muted")}>{item.label}</span>
                                <div className={cn(
                                    "w-10 h-5 rounded-full relative transition-all duration-500 shadow-inner",
                                    isEnabled ? "bg-accent" : "bg-bg-tertiary border border-border"
                                )}>
                                    <motion.div
                                        animate={{ x: isEnabled ? 22 : 2 }}
                                        className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full shadow-md"
                                    />
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </motion.div>

            {/* Traceability Protocol & DNA (Product Tracking) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-6 md:p-10"
            >
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                            DNA Traceability Protocol
                        </h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">End-to-End Molecular Logistics Monitoring</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { key: 'lotTrackingEnabled', label: 'Signal Identification (LOT#)' },
                        { key: 'supplierTrackingEnabled', label: 'Source Node Trace (Supplier)' },
                        { key: 'productionDateRequired', label: 'Genesis Timestamp (PROD)' },
                        { key: 'expiryDateRequired', label: 'Lifecycle End (EXP)' },
                        { key: 'allergenTracking', label: 'Bioshield Hazard Matrix' },
                        { key: 'correctiveActionRequired', label: 'Closed Loop Correction' },
                    ].map((item) => {
                        const isEnabled = localConfig[item.key as keyof HACCPConfig] as boolean;
                        return (
                            <motion.button
                                key={item.key}
                                onClick={() => setLocalConfig(s => ({ ...s, [item.key]: !isEnabled }))}
                                className={cn(
                                    "p-6 rounded-[2rem] border-2 transition-all duration-500 flex items-center justify-between text-left group",
                                    isEnabled
                                        ? "bg-bg-primary border-accent/40 shadow-lg"
                                        : "bg-bg-tertiary border-border opacity-70 hover:opacity-100"
                                )}
                            >
                                <span className={cn("font-bold uppercase tracking-widest text-[9px] leading-tight flex-1 pr-4", isEnabled ? "text-text-primary" : "text-text-muted")}>{item.label}</span>
                                <div className={cn(
                                    "w-10 h-5 rounded-full relative transition-all duration-500 shadow-inner",
                                    isEnabled ? "bg-accent" : "bg-bg-tertiary border border-border"
                                )}>
                                    <motion.div
                                        animate={{ x: isEnabled ? 22 : 2 }}
                                        className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full shadow-md"
                                    />
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </motion.div>

            {/* Evidence Archive (Docs & Reports) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-6 md:p-10 overflow-hidden relative"
            >
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mb-32 opacity-50 pointer-events-none" />

                <div className="flex items-center gap-4 mb-10 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                            Bioshield Evidence Archive
                        </h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Automated Compliance Synthesis & Artifact Hosting</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10 relative z-10">
                    <div className="space-y-4">
                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1">Synthesis Pulse</label>
                        <div className="flex gap-2 bg-bg-tertiary p-2 rounded-[1.5rem] border border-border">
                            {['daily', 'weekly', 'monthly'].map((freq) => (
                                <button
                                    key={freq}
                                    onClick={() => setLocalConfig(s => ({ ...s, reportFrequency: freq as any }))}
                                    className={cn(
                                        "flex-1 py-4 rounded-xl font-bold text-[9px] uppercase tracking-widest transition-all",
                                        localConfig.reportFrequency === freq
                                            ? "bg-bg-primary shadow-sm text-text-primary border border-border"
                                            : "text-text-muted hover:text-text-primary"
                                    )}
                                >
                                    {freq}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="bg-bg-primary p-8 rounded-[2rem] border border-border shadow-sm space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1">Archive Lifecycle (Years)</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={localConfig.retentionYears}
                                onChange={(e) => setLocalConfig(s => ({ ...s, retentionYears: Number(e.target.value) }))}
                                className="w-full bg-transparent text-4xl font-serif text-text-primary outline-none"
                            />
                            <Cloud className="absolute right-0 bottom-2 w-6 h-6 text-text-muted" />
                        </div>
                    </div>
                    <div className="bg-bg-primary p-8 rounded-[2rem] border border-border shadow-sm space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1">Log Persistence (Days)</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={localConfig.tempLogRetentionDays}
                                onChange={(e) => setLocalConfig(s => ({ ...s, tempLogRetentionDays: Number(e.target.value) }))}
                                className="w-full bg-transparent text-4xl font-serif text-text-primary outline-none"
                                data-tutorial="haccp-1-2"
                            />
                            <Activity className="absolute right-0 bottom-2 w-6 h-6 text-text-muted" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                    {[
                        { key: 'autoGenerateReports', label: 'Autonomous Synthesis', icon: Zap },
                        { key: 'pdfExport', label: 'Universal PDF Format', icon: FileText },
                        { key: 'cloudBackup', label: 'Off-Node Redundancy', icon: Cloud },
                    ].map((item) => {
                        const isEnabled = localConfig[item.key as keyof HACCPConfig] as boolean;
                        return (
                            <motion.button
                                key={item.key}
                                onClick={() => setLocalConfig(s => ({ ...s, [item.key]: !isEnabled }))}
                                className={cn(
                                    "p-8 rounded-[2rem] border transition-all duration-500 flex items-center justify-between group/card",
                                    isEnabled
                                        ? "bg-bg-primary border-accent/40 shadow-lg"
                                        : "bg-bg-tertiary border-border opacity-70 hover:opacity-100"
                                )}
                            >
                                <item.icon className={cn("w-6 h-6 transition-colors", isEnabled ? "text-accent" : "text-text-muted")} />
                                <span className={cn("font-bold uppercase tracking-widest text-[9px] flex-1 px-4 text-center", isEnabled ? "text-text-primary" : "text-text-muted")}>{item.label}</span>
                                <div className={cn(
                                    "w-10 h-5 rounded-full relative transition-all duration-500 shadow-inner",
                                    isEnabled ? "bg-accent" : "bg-bg-tertiary border border-border"
                                )}>
                                    <motion.div
                                        animate={{ x: isEnabled ? 22 : 2 }}
                                        className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full shadow-md"
                                    />
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </motion.div>

            {/* Bio-Audits & Cognitive Evolution (Audits & Training) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-6 md:p-10"
            >
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                            Cognitive Compliance Audits
                        </h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Self-Optimization & Periodic Subsystem Recalibration</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                    <div className="space-y-4">
                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-1">Internal Pulse Logic</label>
                        <div className="flex gap-2 bg-bg-tertiary p-2 rounded-[1.5rem] border border-border">
                            {['weekly', 'monthly', 'quarterly'].map((freq) => (
                                <button
                                    key={freq}
                                    onClick={() => setLocalConfig(s => ({ ...s, internalAuditFrequency: freq as any }))}
                                    className={cn(
                                        "flex-1 py-4 rounded-xl font-bold text-[8px] uppercase tracking-widest transition-all",
                                        localConfig.internalAuditFrequency === freq
                                            ? "bg-bg-primary shadow-sm text-text-primary border border-border"
                                            : "text-text-muted hover:text-text-primary"
                                    )}
                                >
                                    {freq}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="bg-bg-primary p-8 rounded-[2rem] border border-border space-y-4 relative overflow-hidden group/card hover:border-accent/30 transition-colors duration-500">
                        <label className="text-[10px] font-bold text-accent uppercase tracking-widest px-1">Integrity Target Score</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={localConfig.auditScoreTarget}
                                onChange={(e) => setLocalConfig(s => ({ ...s, auditScoreTarget: Number(e.target.value) }))}
                                className="w-full bg-transparent text-5xl font-serif text-accent outline-none pr-12"
                            />
                            <span className="absolute right-0 bottom-2 text-xl font-bold text-accent/50">%</span>
                        </div>
                    </div>
                    <div className="bg-bg-primary p-8 rounded-[2rem] border border-border shadow-sm space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1">Node Recalibration Logic (Months)</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={localConfig.trainingFrequencyMonths}
                                onChange={(e) => setLocalConfig(s => ({ ...s, trainingFrequencyMonths: Number(e.target.value) }))}
                                className="w-full bg-transparent text-4xl font-serif text-text-primary outline-none"
                            />
                            <Users className="absolute right-0 bottom-2 w-6 h-6 text-text-muted" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { key: 'trainingReminders', label: 'Node Reset Signals' },
                        { key: 'certificationTracking', label: 'Permit Verification' },
                        { key: 'nonConformityTracking', label: 'Anomaly Log Tracking' },
                    ].map((item) => {
                        const isEnabled = localConfig[item.key as keyof HACCPConfig] as boolean;
                        return (
                            <motion.button
                                key={item.key}
                                onClick={() => setLocalConfig(s => ({ ...s, [item.key]: !isEnabled }))}
                                className={cn(
                                    "p-6 rounded-[2rem] border transition-all duration-500 text-left",
                                    isEnabled
                                        ? "bg-bg-primary border-accent/40 shadow-lg text-text-primary"
                                        : "bg-bg-tertiary border-border text-text-muted opacity-70 hover:opacity-100"
                                )}
                            >
                                <span className="font-bold uppercase tracking-widest text-[10px] flex-1 pr-4">{item.label}</span>
                                <div className={cn(
                                    "w-10 h-5 rounded-full relative transition-all duration-500 shadow-inner",
                                    isEnabled ? "bg-accent" : "bg-bg-tertiary border border-border"
                                )}>
                                    <motion.div
                                        animate={{ x: isEnabled ? 22 : 2 }}
                                        className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full shadow-md"
                                    />
                                </div>
                            </motion.button>
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
                    className="flex items-center gap-4 px-12 py-6 bg-text-primary text-bg-primary rounded-[2rem] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all disabled:opacity-50 group border border-border"
                >
                    {isSaving ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <div className="relative">
                            <ShieldCheck className="w-6 h-6 transition-transform group-hover:scale-110" />
                            <div className="absolute inset-0 bg-white/40 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    )}
                    Commit Bioshield State
                </motion.button>
            </div>
        </div>
    );
}
