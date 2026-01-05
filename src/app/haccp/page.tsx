"use client";

import { useState } from "react";
import {
    ClipboardCheck,
    Thermometer,
    Wind,
    Droplets,
    Clock,
    CheckCircle2,
    AlertTriangle,
    FileText,
    History,
    RefreshCw,
    AlertCircle,
    CheckSquare,
    Square
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/utils";
import { useHACCP } from "@/context/HACCPContext";
import { useToast } from "@/components/ui/Toast";

const SENSOR_ICONS: Record<string, any> = {
    temperature: Thermometer,
    humidity: Droplets,
    air_quality: Wind
};

const STATUS_STYLES = {
    ok: "bg-[#E6F9EF] border-[#00D764] text-[#00D764]",
    warning: "bg-[#FFF7E6] border-[#FF9900] text-[#FF9900]",
    alert: "bg-[#FEECEC] border-[#FF4D4D] text-[#FF4D4D]"
};

export default function HACCPPage() {
    const { showToast } = useToast();
    const { sensors, checklists, toggleChecklistItem, getComplianceScore, criticalAlerts, resetDailyChecklist } = useHACCP();
    const [activeTab, setActiveTab] = useState<'sensors' | 'checklists'>('sensors');

    const handleAudit = () => {
        showToast("Génération du rapport d'audit HACCP...", "premium");
        setTimeout(() => {
            showToast("Rapport d'audit HACCP généré (PDF)", "success");
        }, 2000);
    };

    const complianceScore = getComplianceScore();
    const dailyChecklists = checklists.filter(c => c.frequency === 'daily');
    const weeklyChecklists = checklists.filter(c => c.frequency === 'weekly');
    const monthlyChecklists = checklists.filter(c => c.frequency === 'monthly');

    return (
        <div className="flex h-[calc(100vh-70px)] -m-6 flex-col bg-[#F8F9FA] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between bg-white border-b border-neutral-100 px-8 py-4">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <h1 className="text-xl font-black text-[#1A1A1A] tracking-tight">HACCP & Contrôle Qualité</h1>
                        <p className="text-[11px] font-bold text-[#ADB5BD] uppercase tracking-wider mt-0.5">
                            Surveillance sanitaire en temps réel • Score: {complianceScore}%
                        </p>
                    </div>

                    {/* Compliance Badge */}
                    <div className={cn(
                        "px-4 py-2 rounded-xl font-bold text-sm",
                        complianceScore >= 80 ? "bg-[#E6F9EF] text-[#00D764]" :
                            complianceScore >= 50 ? "bg-[#FFF7E6] text-[#FF9900]" :
                                "bg-[#FEECEC] text-[#FF4D4D]"
                    )}>
                        {complianceScore >= 80 ? "Conforme" : complianceScore >= 50 ? "Attention Requise" : "Non Conforme"}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => {
                            resetDailyChecklist();
                            showToast("Checklist journalière réinitialisée", "info");
                        }}
                        className="h-10 border-neutral-100 rounded-xl font-bold text-sm bg-white"
                    >
                        <RefreshCw className="mr-2 h-4 w-4 text-[#ADB5BD]" />
                        Nouvelle Journée
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => showToast("Historique de conformité chargé sur 365 jours", "info")}
                        className="h-10 border-neutral-100 rounded-xl font-bold text-sm bg-white"
                    >
                        <History className="mr-2 h-4 w-4 text-[#ADB5BD]" />
                        Historique
                    </Button>
                    <Button
                        onClick={handleAudit}
                        className="h-10 bg-[#1A1A1A] hover:bg-black rounded-xl font-bold text-sm px-6 shadow-xl"
                    >
                        <FileText className="h-4 w-4 mr-2 text-[#00D764]" />
                        Générer Rapport Audit
                    </Button>
                </div>
            </div>

            {/* Critical Alerts Banner */}
            {criticalAlerts.length > 0 && (
                <div className="bg-[#FF4D4D] text-white px-8 py-3 flex items-center gap-4 animate-pulse">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-bold">
                        ALERTE CRITIQUE: {criticalAlerts.map(s => `${s.name} (${s.value}${s.unit})`).join(', ')}
                    </span>
                </div>
            )}

            {/* Tab Navigation */}
            <div className="bg-white border-b border-neutral-100 px-8">
                <div className="flex gap-8">
                    {(['sensors', 'checklists'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "py-4 border-b-2 font-bold text-sm transition-all",
                                activeTab === tab
                                    ? "border-[#00D764] text-[#1A1A1A]"
                                    : "border-transparent text-[#ADB5BD] hover:text-[#6C757D]"
                            )}
                        >
                            {tab === 'sensors' ? 'Capteurs IoT' : 'Checklists'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-auto p-8">
                {activeTab === 'sensors' ? (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {/* Live Sensors Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {sensors.map((sensor) => {
                                const Icon = SENSOR_ICONS[sensor.type] || Thermometer;
                                return (
                                    <div
                                        key={sensor.id}
                                        className={cn(
                                            "card-premium p-6 border-l-4 transition-all",
                                            STATUS_STYLES[sensor.status]
                                        )}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center",
                                                sensor.status === 'ok' ? "bg-[#E6F9EF] text-[#00D764]" :
                                                    sensor.status === 'warning' ? "bg-[#FFF7E6] text-[#FF9900]" :
                                                        "bg-[#FEECEC] text-[#FF4D4D]"
                                            )}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <span className={cn(
                                                "text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md",
                                                sensor.status === 'ok' ? "bg-[#00D764]/10 text-[#00D764]" :
                                                    sensor.status === 'warning' ? "bg-[#FF9900]/10 text-[#FF9900]" :
                                                        "bg-[#FF4D4D]/10 text-[#FF4D4D]"
                                            )}>
                                                {sensor.status === 'ok' ? 'Normal' : sensor.status === 'warning' ? 'Attention' : 'Alerte'}
                                            </span>
                                        </div>
                                        <p className="text-[11px] font-bold text-[#ADB5BD] uppercase tracking-widest mb-1">
                                            {sensor.name}
                                        </p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-black text-[#1A1A1A]">{sensor.value}</span>
                                            <span className="text-lg font-bold text-[#ADB5BD]">{sensor.unit}</span>
                                        </div>
                                        <p className="text-[10px] text-[#ADB5BD] mt-2 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            Mis à jour à {formatTime(sensor.lastUpdated)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Sensor Info */}
                        <div className="card-premium p-6 bg-gradient-to-r from-neutral-50 to-white">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] flex items-center justify-center">
                                    <RefreshCw className="w-5 h-5 text-[#00D764]" />
                                </div>
                                <div>
                                    <p className="font-bold text-[#1A1A1A]">Mise à jour automatique</p>
                                    <p className="text-[12px] text-[#ADB5BD]">
                                        Les capteurs IoT sont actualisés toutes les 30 secondes
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {/* Daily Checklists */}
                        <div>
                            <h3 className="text-lg font-black text-[#1A1A1A] mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-[#00D764]" />
                                Tâches Quotidiennes
                                <span className="text-sm font-bold text-[#ADB5BD] ml-2">
                                    ({dailyChecklists.filter(c => c.completed).length}/{dailyChecklists.length})
                                </span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {dailyChecklists.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => toggleChecklistItem(item.id)}
                                        className={cn(
                                            "flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                                            item.completed
                                                ? "bg-[#E6F9EF] border-[#00D764]"
                                                : "bg-white border-neutral-100 hover:border-neutral-200"
                                        )}
                                    >
                                        {item.completed ? (
                                            <CheckSquare className="w-6 h-6 text-[#00D764] shrink-0" />
                                        ) : (
                                            <Square className="w-6 h-6 text-[#ADB5BD] shrink-0" />
                                        )}
                                        <div>
                                            <p className={cn(
                                                "font-bold",
                                                item.completed ? "text-[#00D764]" : "text-[#1A1A1A]"
                                            )}>
                                                {item.task}
                                            </p>
                                            {item.completedAt && (
                                                <p className="text-[10px] text-[#ADB5BD] mt-1">
                                                    Validé à {formatTime(item.completedAt)}
                                                </p>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Weekly Checklists */}
                        <div>
                            <h3 className="text-lg font-black text-[#1A1A1A] mb-4 flex items-center gap-2">
                                <ClipboardCheck className="w-5 h-5 text-indigo-500" />
                                Tâches Hebdomadaires
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {weeklyChecklists.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => toggleChecklistItem(item.id)}
                                        className={cn(
                                            "flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                                            item.completed
                                                ? "bg-indigo-50 border-indigo-400"
                                                : "bg-white border-neutral-100 hover:border-neutral-200"
                                        )}
                                    >
                                        {item.completed ? (
                                            <CheckSquare className="w-6 h-6 text-indigo-500 shrink-0" />
                                        ) : (
                                            <Square className="w-6 h-6 text-[#ADB5BD] shrink-0" />
                                        )}
                                        <p className={cn(
                                            "font-bold",
                                            item.completed ? "text-indigo-600" : "text-[#1A1A1A]"
                                        )}>
                                            {item.task}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Monthly Checklists */}
                        <div>
                            <h3 className="text-lg font-black text-[#1A1A1A] mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-amber-500" />
                                Tâches Mensuelles
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {monthlyChecklists.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => toggleChecklistItem(item.id)}
                                        className={cn(
                                            "flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                                            item.completed
                                                ? "bg-amber-50 border-amber-400"
                                                : "bg-white border-neutral-100 hover:border-neutral-200"
                                        )}
                                    >
                                        {item.completed ? (
                                            <CheckSquare className="w-6 h-6 text-amber-500 shrink-0" />
                                        ) : (
                                            <Square className="w-6 h-6 text-[#ADB5BD] shrink-0" />
                                        )}
                                        <p className={cn(
                                            "font-bold",
                                            item.completed ? "text-amber-600" : "text-[#1A1A1A]"
                                        )}>
                                            {item.task}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
