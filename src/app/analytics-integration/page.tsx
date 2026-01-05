"use client";

import { useState } from "react";
import {
    BarChart3,
    TrendingUp,
    Users,
    MousePointerClick,
    Globe,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    RefreshCw,
    Settings,
    Link2,
    CheckCircle2,
    AlertCircle,
    ExternalLink,
    Eye,
    Clock,
    Target,
    Smartphone,
    Monitor,
    Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

// Mock Analytics Data
const MOCK_ANALYTICS = {
    isConnected: true,
    propertyId: "GA4-123456789",
    lastSync: "Il y a 5 minutes",

    summary: {
        visitors: { value: 2847, change: 12.4, trend: 'up' as const },
        pageViews: { value: 8932, change: 8.2, trend: 'up' as const },
        reservations: { value: 156, change: 23.5, trend: 'up' as const },
        conversionRate: { value: 5.48, change: -0.3, trend: 'down' as const },
    },

    sources: [
        { name: 'Google Organic', visitors: 1245, percentage: 43.7, color: '#4285F4' },
        { name: 'Direct', visitors: 689, percentage: 24.2, color: '#1A1A1A' },
        { name: 'Instagram', visitors: 423, percentage: 14.9, color: '#E4405F' },
        { name: 'Facebook', visitors: 312, percentage: 11.0, color: '#1877F2' },
        { name: 'Google Ads', visitors: 178, percentage: 6.2, color: '#34A853' },
    ],

    devices: [
        { name: 'Mobile', percentage: 67, icon: Smartphone },
        { name: 'Desktop', percentage: 28, icon: Monitor },
        { name: 'Tablet', percentage: 5, icon: Monitor },
    ],

    topPages: [
        { path: '/menu', views: 3421, avgTime: '2:34' },
        { path: '/reservations', views: 2156, avgTime: '4:12' },
        { path: '/', views: 1876, avgTime: '1:45' },
        { path: '/contact', views: 892, avgTime: '1:12' },
        { path: '/about', views: 587, avgTime: '2:01' },
    ],

    reservationFunnel: [
        { step: 'Page vue', value: 2156, percentage: 100 },
        { step: 'Formulaire ouvert', value: 987, percentage: 45.8 },
        { step: 'Date sélectionnée', value: 654, percentage: 30.3 },
        { step: 'Réservation confirmée', value: 156, percentage: 7.2 },
    ],

    weeklyTrend: [
        { day: 'Lun', visitors: 312, reservations: 18 },
        { day: 'Mar', visitors: 287, reservations: 15 },
        { day: 'Mer', visitors: 356, reservations: 22 },
        { day: 'Jeu', visitors: 423, reservations: 28 },
        { day: 'Ven', visitors: 567, reservations: 35 },
        { day: 'Sam', visitors: 612, reservations: 42 },
        { day: 'Dim', visitors: 290, reservations: 16 },
    ],
};

const StatCard = ({ title, value, change, trend, icon: Icon, suffix = '' }: any) => (
    <div className="bg-white rounded-2xl p-6 border border-[#E9ECEF] shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#F8F9FA] flex items-center justify-center">
                <Icon className="w-6 h-6 text-[#1A1A1A]" />
            </div>
            <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-black",
                trend === 'up' ? "bg-[#E6F9EF] text-[#00D764]" : "bg-[#FEECEC] text-[#FF4D4D]"
            )}>
                {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(change)}%
            </div>
        </div>
        <p className="text-[10px] font-black text-[#ADB5BD] uppercase tracking-widest mb-1">{title}</p>
        <p className="text-2xl font-black text-[#1A1A1A]">{value.toLocaleString('fr-FR')}{suffix}</p>
    </div>
);

export default function AnalyticsIntegrationPage() {
    const { showToast } = useToast();
    const [isConnected, setIsConnected] = useState(MOCK_ANALYTICS.isConnected);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('7d');

    const handleConnect = () => {
        showToast("Redirection vers Google Analytics...", "premium");
        setTimeout(() => {
            setIsConnected(true);
            showToast("Compte Google Analytics connecté avec succès!", "success");
        }, 2000);
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
            showToast("Données Analytics synchronisées", "success");
        }, 1500);
    };

    if (!isConnected) {
        return (
            <div className="flex h-[calc(100vh-70px)] -m-6 items-center justify-center bg-[#F8F9FA]">
                <div className="max-w-md text-center p-8">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#4285F4] to-[#34A853] flex items-center justify-center">
                        <BarChart3 className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-2xl font-black text-[#1A1A1A] mb-3">Connectez Google Analytics</h1>
                    <p className="text-[#6C757D] mb-8">
                        Synchronisez vos données Analytics pour suivre le trafic, les conversions et optimiser vos réservations en ligne.
                    </p>
                    <Button
                        onClick={handleConnect}
                        className="h-14 px-8 bg-[#4285F4] hover:bg-[#3367D6] text-white rounded-xl font-bold shadow-lg"
                    >
                        <img src="https://www.google.com/favicon.ico" alt="" className="w-5 h-5 mr-3" />
                        Connecter Google Analytics 4
                    </Button>
                    <p className="text-[11px] text-[#ADB5BD] mt-4">
                        Nécessite un compte Google Analytics avec accès administrateur
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-70px)] -m-6 flex-col bg-[#F8F9FA] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between bg-white border-b border-neutral-100 px-8 py-4">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <h1 className="text-xl font-black text-[#1A1A1A] tracking-tight">Google Analytics</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#00D764]" />
                            <span className="text-[11px] font-bold text-[#00D764]">Connecté</span>
                            <span className="text-[11px] text-[#ADB5BD]">• {MOCK_ANALYTICS.propertyId}</span>
                            <span className="text-[11px] text-[#ADB5BD]">• Sync: {MOCK_ANALYTICS.lastSync}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Period Selector */}
                    <div className="flex bg-[#F8F9FA] p-1 rounded-xl border border-neutral-100">
                        {(['7d', '30d', '90d'] as const).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-[11px] font-bold transition-all",
                                    period === p ? "bg-white shadow-sm text-[#1A1A1A]" : "text-[#ADB5BD]"
                                )}
                            >
                                {p === '7d' ? '7 jours' : p === '30d' ? '30 jours' : '90 jours'}
                            </button>
                        ))}
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="h-10 rounded-xl"
                    >
                        <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} />
                        Synchroniser
                    </Button>
                    <Button variant="outline" className="h-10 rounded-xl">
                        <Settings className="w-4 h-4 mr-2" />
                        Paramètres
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-8 space-y-8">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Visiteurs"
                        value={MOCK_ANALYTICS.summary.visitors.value}
                        change={MOCK_ANALYTICS.summary.visitors.change}
                        trend={MOCK_ANALYTICS.summary.visitors.trend}
                        icon={Users}
                    />
                    <StatCard
                        title="Pages Vues"
                        value={MOCK_ANALYTICS.summary.pageViews.value}
                        change={MOCK_ANALYTICS.summary.pageViews.change}
                        trend={MOCK_ANALYTICS.summary.pageViews.trend}
                        icon={Eye}
                    />
                    <StatCard
                        title="Réservations"
                        value={MOCK_ANALYTICS.summary.reservations.value}
                        change={MOCK_ANALYTICS.summary.reservations.change}
                        trend={MOCK_ANALYTICS.summary.reservations.trend}
                        icon={Calendar}
                    />
                    <StatCard
                        title="Taux de Conversion"
                        value={MOCK_ANALYTICS.summary.conversionRate.value}
                        change={MOCK_ANALYTICS.summary.conversionRate.change}
                        trend={MOCK_ANALYTICS.summary.conversionRate.trend}
                        icon={Target}
                        suffix="%"
                    />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Traffic Sources */}
                    <div className="bg-white rounded-2xl p-6 border border-[#E9ECEF] shadow-sm">
                        <h3 className="text-lg font-black text-[#1A1A1A] mb-6">Sources de Trafic</h3>
                        <div className="space-y-4">
                            {MOCK_ANALYTICS.sources.map((source, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: source.color }}
                                    />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-sm text-[#1A1A1A]">{source.name}</span>
                                            <span className="text-sm font-bold text-[#6C757D]">{source.visitors}</span>
                                        </div>
                                        <div className="h-2 bg-[#F8F9FA] rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all"
                                                style={{ width: `${source.percentage}%`, backgroundColor: source.color }}
                                            />
                                        </div>
                                    </div>
                                    <span className="text-[11px] font-black text-[#ADB5BD] w-12 text-right">
                                        {source.percentage}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Weekly Trend Chart */}
                    <div className="bg-white rounded-2xl p-6 border border-[#E9ECEF] shadow-sm">
                        <h3 className="text-lg font-black text-[#1A1A1A] mb-6">Tendance Hebdomadaire</h3>
                        <div className="h-48 flex items-end justify-between gap-2">
                            {MOCK_ANALYTICS.weeklyTrend.map((day, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full flex flex-col items-center gap-1">
                                        <div
                                            className="w-full bg-[#00D764]/20 rounded-t-lg hover:bg-[#00D764]/40 transition-all cursor-pointer"
                                            style={{ height: `${(day.reservations / 50) * 100}px` }}
                                            title={`${day.reservations} réservations`}
                                        />
                                        <div
                                            className="w-full bg-[#4285F4]/20 rounded-t-lg hover:bg-[#4285F4]/40 transition-all cursor-pointer"
                                            style={{ height: `${(day.visitors / 700) * 80}px` }}
                                            title={`${day.visitors} visiteurs`}
                                        />
                                    </div>
                                    <span className="text-[10px] font-bold text-[#ADB5BD]">{day.day}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center gap-6 mt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-[#4285F4]/30" />
                                <span className="text-[10px] font-bold text-[#ADB5BD]">Visiteurs</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-[#00D764]/30" />
                                <span className="text-[10px] font-bold text-[#ADB5BD]">Réservations</span>
                            </div>
                        </div>
                    </div>

                    {/* Reservation Funnel */}
                    <div className="bg-white rounded-2xl p-6 border border-[#E9ECEF] shadow-sm">
                        <h3 className="text-lg font-black text-[#1A1A1A] mb-6">Tunnel de Réservation</h3>
                        <div className="space-y-4">
                            {MOCK_ANALYTICS.reservationFunnel.map((step, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-sm text-[#1A1A1A]">{step.step}</span>
                                        <span className="text-sm font-bold text-[#6C757D]">{step.value}</span>
                                    </div>
                                    <div className="h-8 bg-[#F8F9FA] rounded-lg overflow-hidden relative">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#00D764] to-[#00B956] rounded-lg transition-all flex items-center justify-end pr-3"
                                            style={{ width: `${step.percentage}%` }}
                                        >
                                            <span className="text-[10px] font-black text-white">{step.percentage}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top Pages & Devices */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Top Pages */}
                    <div className="bg-white rounded-2xl p-6 border border-[#E9ECEF] shadow-sm">
                        <h3 className="text-lg font-black text-[#1A1A1A] mb-6">Pages les Plus Vues</h3>
                        <div className="space-y-3">
                            {MOCK_ANALYTICS.topPages.map((page, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F8F9FA] transition-all">
                                    <div className="flex items-center gap-4">
                                        <span className="w-8 h-8 rounded-lg bg-[#F8F9FA] flex items-center justify-center font-black text-[#1A1A1A] text-sm">
                                            {i + 1}
                                        </span>
                                        <span className="font-bold text-[#1A1A1A]">{page.path}</span>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="font-black text-[#1A1A1A]">{page.views.toLocaleString()}</p>
                                            <p className="text-[10px] text-[#ADB5BD]">vues</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-[#6C757D]">{page.avgTime}</p>
                                            <p className="text-[10px] text-[#ADB5BD]">temps moyen</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Devices */}
                    <div className="bg-white rounded-2xl p-6 border border-[#E9ECEF] shadow-sm">
                        <h3 className="text-lg font-black text-[#1A1A1A] mb-6">Appareils</h3>
                        <div className="flex items-center justify-center gap-8">
                            {MOCK_ANALYTICS.devices.map((device, i) => {
                                const Icon = device.icon;
                                return (
                                    <div key={i} className="text-center">
                                        <div className="w-24 h-24 rounded-2xl bg-[#F8F9FA] flex items-center justify-center mb-4">
                                            <Icon className="w-10 h-10 text-[#1A1A1A]" />
                                        </div>
                                        <p className="text-2xl font-black text-[#1A1A1A]">{device.percentage}%</p>
                                        <p className="text-sm font-bold text-[#ADB5BD]">{device.name}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
