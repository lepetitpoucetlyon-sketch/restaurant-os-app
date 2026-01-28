"use client";

import { useState } from "react";
import {
    Instagram,
    Facebook,
    Image as ImageIcon,
    Video,
    Calendar,
    Clock,
    Heart,
    MessageCircle,
    Share2,
    TrendingUp,
    Users,
    Target,
    Plus,
    Send,
    Edit3,
    Trash2,
    Eye,
    BarChart3,
    Zap,
    Mail,
    Megaphone,
    Gift,
    Star,
    ChevronRight,
    CheckCircle2,
    AlertCircle,
    RefreshCw,
    Settings,
    MoreHorizontal,
    Search,
    LayoutGrid,
    Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { motion, AnimatePresence } from "framer-motion";

// Mock Social Accounts
const SOCIAL_ACCOUNTS = [
    {
        id: 'instagram',
        platform: 'Instagram',
        handle: '@restaurant_exemple',
        followers: 12450,
        connected: true,
        icon: Instagram,
        color: '#E4405F',
        gradient: 'from-[#833AB4] via-[#FD1D1D] to-[#F77737]',
        posts: 234,
        engagement: 4.2,
        trend: '+2.4%'
    },
    {
        id: 'facebook',
        platform: 'Facebook',
        handle: 'Restaurant Exemple',
        followers: 8920,
        connected: true,
        icon: Facebook,
        color: '#1877F2',
        gradient: 'from-[#1877F2] to-[#0052CC]',
        posts: 189,
        engagement: 2.8,
        trend: '+1.1%'
    },
];

// Mock scheduled posts
const SCHEDULED_POSTS = [
    {
        id: 'POST001',
        platforms: ['instagram', 'facebook'],
        content: "🍝 Nouveau plat du jour ! Notre risotto aux truffes noires est de retour pour une durée limitée. Réservez votre table dès maintenant ! #gastronomie #truffe #restaurant",
        media: { type: 'image', url: '/placeholder.jpg' },
        scheduledFor: '2026-01-06T12:00:00',
        status: 'scheduled',
    },
    {
        id: 'POST002',
        platforms: ['instagram'],
        content: "✨ Les coulisses de notre cuisine... Découvrez le savoir-faire de notre Chef ! #kitchen #behindthescenes",
        media: { type: 'video', url: '/placeholder.mp4' },
        scheduledFor: '2026-01-07T18:00:00',
        status: 'scheduled',
    },
    {
        id: 'POST003',
        platforms: ['instagram', 'facebook'],
        content: "🥂 Soirée Dégustation de Vins - Vendredi 24 Janvier. Places limitées ! #wine #tasting #bordeaux",
        media: { type: 'image', url: '/placeholder.jpg' },
        scheduledFor: '2026-01-10T19:00:00',
        status: 'scheduled',
    },
];

const MARKETING_CAMPAIGNS = [
    {
        id: 'CAMP001',
        name: 'Clients Fidèles - Janvier',
        type: 'email',
        audience: 'Clients ayant réservé 3+ fois',
        audienceSize: 156,
        status: 'active',
        sent: 142,
        opened: 89,
        clicked: 34,
        conversions: 12,
    },
    {
        id: 'CAMP002',
        name: 'Anniversaires du mois',
        type: 'email',
        audience: 'Clients avec anniversaire en Janvier',
        audienceSize: 28,
        status: 'scheduled',
        sent: 0,
        opened: 0,
        clicked: 0,
        conversions: 0,
    },
];

const CRM_SEGMENTS = [
    { id: 'vip', name: 'VIP', count: 45, color: '#8B5CF6', criteria: '10+ visites, panier > 100€' },
    { id: 'regular', name: 'Réguliers', count: 156, color: '#C5A059', criteria: '3-9 visites' },
    { id: 'new', name: 'Nouveaux', count: 89, color: '#4285F4', criteria: 'Première visite < 30j' },
];

export default function SocialMarketingPage() {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<'social' | 'campaigns' | 'segments'>('social');
    const [showNewPost, setShowNewPost] = useState(false);

    // Background decoration
    const BackgroundDecor = () => (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
            <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/3 rounded-full blur-[150px]" />
        </div>
    );

    return (
        <div className="relative min-h-screen bg-bg-primary/50 text-text-primary p-6 md:p-10 font-sans overflow-hidden">
            <BackgroundDecor />

            <div className="relative z-10 max-w-7xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-6 border-b border-border/40">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-tr from-purple-500 to-indigo-600 rounded-2xl shadow-lg shadow-purple-500/20">
                                <Share2 className="w-6 h-6 text-white" strokeWidth={2} />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight text-text-primary">
                                Social <span className="italic font-light text-text-muted">Marketing</span>
                            </h1>
                        </div>
                        <p className="text-sm font-medium text-text-muted/80 max-w-lg leading-relaxed ml-1">
                            Gérez votre présence digitale, planifiez vos publications et analysez vos performances depuis un hub centralisé.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-white/50 dark:bg-black/20 p-2 rounded-full border border-white/20 shadow-sm backdrop-blur-sm">
                        {[
                            { id: 'social', label: 'Réseaux', icon: Instagram },
                            { id: 'campaigns', label: 'Campagnes', icon: Megaphone },
                            { id: 'segments', label: 'CRM Segments', icon: Users },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "relative px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2",
                                    activeTab === tab.id
                                        ? "bg-text-primary text-bg-primary shadow-lg scale-105"
                                        : "text-text-muted hover:bg-white/40 dark:hover:bg-white/5 hover:text-text-primary"
                                )}
                            >
                                <tab.icon className={cn("w-3.5 h-3.5", activeTab === tab.id ? "opacity-100" : "opacity-70")} strokeWidth={2.5} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <AnimatePresence mode="wait">
                    {/* SOCIAL TAB */}
                    {activeTab === 'social' && (
                        <motion.div
                            key="social"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="space-y-10"
                        >
                            {/* Connected Accounts Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {SOCIAL_ACCOUNTS.map((account, i) => {
                                    const Icon = account.icon;
                                    return (
                                        <div key={account.id} className="group relative overflow-hidden bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all duration-500">
                                            {/* Decorative Background */}
                                            <div className={cn(
                                                "absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br rounded-full blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity",
                                                account.gradient
                                            )} />

                                            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-5">
                                                        <div className={cn(
                                                            "w-20 h-20 rounded-[2rem] flex items-center justify-center text-white shadow-lg bg-gradient-to-br transform group-hover:scale-105 group-hover:rotate-3 transition-all duration-500",
                                                            account.gradient
                                                        )}>
                                                            <Icon size={40} strokeWidth={1.5} />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-serif font-bold text-3xl text-text-primary tracking-tight mb-1">{account.platform}</h3>
                                                            <p className="text-sm font-medium text-text-muted">{account.handle}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20 backdrop-blur-md">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Connecté</span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-3 gap-4">
                                                    {[
                                                        { label: 'Abonnés', value: (account.followers / 1000).toFixed(1) + 'K', trend: account.trend },
                                                        { label: 'Publications', value: account.posts, trend: null },
                                                        { label: 'Engagement', value: account.engagement + '%', trend: '+0.4%' }
                                                    ].map((stat, idx) => (
                                                        <div key={idx} className="p-5 bg-white/50 dark:bg-black/20 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-white/5 transition-colors">
                                                            <p className="text-3xl font-serif font-medium text-text-primary tracking-tighter tabular-nums">
                                                                {stat.value}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">{stat.label}</p>
                                                                {stat.trend && (
                                                                    <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">{stat.trend}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Scheduled Posts Section */}
                            <div className="bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-text-primary/10 to-transparent" />

                                <div className="flex items-center justify-between mb-10 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-bg-primary flex items-center justify-center border border-border/50 shadow-inner">
                                            <Calendar className="w-6 h-6 text-text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-serif font-medium text-text-primary tracking-tight">Publications Programmées</h3>
                                            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mt-1">
                                                {SCHEDULED_POSTS.length} en attente
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => setShowNewPost(true)}
                                        className="h-14 px-8 bg-text-primary text-bg-primary hover:bg-black hover:text-white dark:bg-white dark:text-black rounded-full transition-all duration-300 font-bold text-xs uppercase tracking-widest shadow-xl shadow-black/10 hover:shadow-2xl hover:-translate-y-1 active:scale-95 group"
                                    >
                                        <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-500" />
                                        Nouvelle Publication
                                    </Button>
                                </div>

                                <div className="space-y-4 relative z-10">
                                    {SCHEDULED_POSTS.map((post, i) => (
                                        <div key={post.id} className="group flex flex-col md:flex-row items-start gap-6 p-6 rounded-3xl bg-white/60 dark:bg-white/5 border border-white/20 dark:border-white/5 hover:border-text-primary/20 hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300">
                                            {/* Media Preview */}
                                            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-neutral-100 dark:bg-neutral-800 overflow-hidden shrink-0 shadow-inner">
                                                <div className="absolute inset-0 flex items-center justify-center text-text-muted group-hover:scale-110 transition-transform duration-700">
                                                    {post.media.type === 'image' ? <ImageIcon size={32} /> : <Video size={32} />}
                                                </div>
                                                {/* Scheduled Badge */}
                                                <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[9px] font-bold text-white uppercase tracking-wider border border-white/10">
                                                    {new Date(post.scheduledFor).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0 py-1 space-y-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-2">
                                                        {post.platforms.map((p) => {
                                                            const account = SOCIAL_ACCOUNTS.find(a => a.id === p);
                                                            if (!account) return null;
                                                            const Icon = account.icon;
                                                            return (
                                                                <div key={p} className="p-1.5 rounded-lg bg-white dark:bg-black/20 text-text-primary shadow-sm ring-1 ring-black/5">
                                                                    <Icon size={14} style={{ color: account.color }} />
                                                                </div>
                                                            );
                                                        })}
                                                        <div className="w-px h-4 bg-border mx-1" />
                                                        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">
                                                            {new Date(post.scheduledFor).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>

                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                                                        <button className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors">
                                                            <Edit3 size={16} className="text-text-secondary" />
                                                        </button>
                                                        <button className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-colors">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <p className="text-sm font-medium text-text-primary/80 leading-relaxed max-w-2xl line-clamp-2">
                                                    {post.content}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* CAMPAIGNS TAB */}
                    {activeTab === 'campaigns' && (
                        <motion.div
                            key="campaigns"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {[
                                    { label: 'Campagnes', value: '12', icon: Send, color: 'text-text-primary' },
                                    { label: "Taux d'ouverture", value: '62.7%', icon: Eye, color: 'text-blue-500' },
                                    { label: 'Taux de clic', value: '24.3%', icon: Target, color: 'text-amber-500' },
                                    { label: 'Conversions', value: '8.4%', icon: Zap, color: 'text-purple-500' }
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-[2rem] p-6 relative overflow-hidden group hover:border-text-primary/20 transition-all cursor-crosshair">
                                        <div className="absolute top-0 right-0 p-6 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                                            <stat.icon className={cn("w-12 h-12 opacity-10", stat.color)} />
                                        </div>
                                        <div className="relative z-10 flex flex-col justify-between h-full min-h-[100px]">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className={cn("p-2 rounded-xl bg-white/50 shadow-sm", stat.color.replace('text-', 'bg-').replace('500', '100'))}>
                                                    <stat.icon className={cn("w-4 h-4", stat.color)} />
                                                </div>
                                                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{stat.label}</span>
                                            </div>
                                            <p className="text-4xl font-serif font-medium text-text-primary tracking-tighter tabular-nums">
                                                {stat.value}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Campaign List */}
                            <div className="bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-2xl font-serif font-medium text-text-primary italic tracking-tight">Campagnes Actives</h3>
                                    <Button className="rounded-full h-10 px-6 font-bold text-xs uppercase tracking-widest">
                                        Créer campagne
                                    </Button>
                                </div>
                                <div className="space-y-4">
                                    {MARKETING_CAMPAIGNS.map(campaign => (
                                        <div key={campaign.id} className="flex flex-col md:flex-row items-center justify-between p-6 rounded-3xl bg-white/50 border border-white/10 hover:bg-white/80 transition-all gap-4">
                                            <div className="flex items-center gap-4 w-full md:w-auto">
                                                <div className={cn(
                                                    "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
                                                    campaign.type === 'email' ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white" : "bg-gradient-to-br from-emerald-500 to-teal-500 text-white"
                                                )}>
                                                    {campaign.type === 'email' ? <Mail size={24} /> : <MessageCircle size={24} />}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lg text-text-primary">{campaign.name}</h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                        <p className="text-xs font-medium text-text-muted">{campaign.audience} • <span className="text-text-primary font-bold">{campaign.audienceSize} cibles</span></p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end bg-white/40 px-6 py-3 rounded-2xl border border-white/20">
                                                <div className="text-center md:text-right">
                                                    <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Envoyés</p>
                                                    <p className="font-serif font-bold text-xl">{campaign.sent}</p>
                                                </div>
                                                <div className="w-px h-8 bg-black/5" />
                                                <div className="text-center md:text-right">
                                                    <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Ouverts</p>
                                                    <p className="font-serif font-bold text-xl text-emerald-600">{campaign.opened}</p>
                                                </div>
                                                <div className="w-px h-8 bg-black/5" />
                                                <div className="text-center md:text-right">
                                                    <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Clics</p>
                                                    <p className="font-serif font-bold text-xl text-blue-600">{campaign.clicked}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* SEGMENTS TAB */}
                    {activeTab === 'segments' && (
                        <motion.div
                            key="segments"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        >
                            {CRM_SEGMENTS.map((segment) => (
                                <div key={segment.id} className="group bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-[2.5rem] p-8 hover:translate-y-[-4px] transition-all duration-300 shadow-sm hover:shadow-xl">
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="p-4 rounded-2xl shadow-lg" style={{ backgroundColor: segment.color, color: 'white' }}>
                                            <Users size={24} strokeWidth={2} />
                                        </div>
                                        <Button size="icon" variant="ghost" className="rounded-full hover:bg-black/5">
                                            <MoreHorizontal size={20} className="text-text-muted" />
                                        </Button>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-3xl font-serif font-bold text-text-primary tracking-tight mb-2">{segment.name}</h3>
                                            <p className="text-sm font-medium text-text-muted p-3 bg-white/50 rounded-xl border border-white/20 inline-block">
                                                {segment.criteria}
                                            </p>
                                        </div>

                                        <div className="flex items-end gap-2">
                                            <span className="text-6xl font-serif font-medium tracking-tighter text-text-primary" style={{ color: segment.color }}>
                                                {segment.count}
                                            </span>
                                            <span className="text-sm font-bold text-text-muted uppercase tracking-widest pb-4">Clients</span>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-black/5">
                                        <Button className="w-full h-12 rounded-xl text-xs font-bold uppercase tracking-widest bg-white text-text-primary hover:bg-bg-tertiary border border-border shadow-sm">
                                            Voir la liste
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={() => showToast("Fonctionnalité à venir", "info")}
                                className="group flex flex-col items-center justify-center gap-6 bg-transparent border-2 border-dashed border-text-muted/20 hover:border-text-primary/50 rounded-[2.5rem] p-8 transition-all duration-300 min-h-[300px]"
                            >
                                <div className="w-20 h-20 rounded-full bg-bg-tertiary flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
                                    <Plus size={32} className="text-text-muted group-hover:text-text-primary" />
                                </div>
                                <div className="text-center space-y-2">
                                    <span className="block text-xl font-serif font-bold text-text-primary group-hover:text-amber-500 transition-colors">Nouveau Segment</span>
                                    <span className="block text-xs font-bold text-text-muted uppercase tracking-widest">Créer une audience personnalisée</span>
                                </div>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* New Post Modal */}
            <AnimatePresence>
                {showNewPost && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowNewPost(false)}
                            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-3xl bg-white dark:bg-[#111] rounded-[3rem] shadow-2xl overflow-hidden border border-white/10"
                        >
                            {/* Header */}
                            <div className="px-10 py-8 border-b border-border/50 bg-bg-primary/50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-text-primary text-bg-primary flex items-center justify-center shadow-lg">
                                        <Edit3 size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-serif font-bold text-text-primary tracking-tight">Nouvelle Publication</h2>
                                        <p className="text-xs font-bold text-text-muted uppercase tracking-wider mt-1">Créez votre contenu</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowNewPost(false)} className="w-10 h-10 rounded-full bg-bg-tertiary hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors">
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-10 space-y-8 bg-bg-primary/30">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-1">Sélectionner les plateformes</label>
                                    <div className="flex gap-4">
                                        {SOCIAL_ACCOUNTS.map((account) => {
                                            const Icon = account.icon;
                                            return (
                                                <button
                                                    key={account.id}
                                                    className="group flex flex-1 items-center justify-center gap-3 px-6 py-5 rounded-2xl border border-border bg-white hover:border-black/10 dark:bg-white/5 dark:hover:border-white/20 transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
                                                >
                                                    <div className="p-2 rounded-lg bg-black/5 group-hover:bg-white transition-colors">
                                                        <Icon className="w-5 h-5" style={{ color: account.color }} />
                                                    </div>
                                                    <span className="font-bold text-sm text-text-primary">{account.platform}</span>
                                                    <div className="ml-auto w-5 h-5 rounded-full border-2 border-border group-hover:border-emerald-500 group-hover:bg-emerald-500 flex items-center justify-center transition-colors">
                                                        <Check size={12} className="text-white opacity-0 group-hover:opacity-100" />
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-1">Contenu & Média</label>
                                    <div className="relative">
                                        <textarea
                                            className="w-full h-40 p-6 bg-white dark:bg-white/5 rounded-[2rem] border border-border/50 focus:border-text-primary/20 focus:ring-4 focus:ring-text-primary/5 outline-none resize-none text-text-primary dark:text-white placeholder:text-text-muted/50 text-base font-medium shadow-sm transition-all"
                                            placeholder="Écrivez une légende captivante..."
                                        />
                                        <div className="absolute bottom-4 left-4 flex gap-2">
                                            <button className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-text-muted hover:text-text-primary transition-colors">
                                                <ImageIcon size={20} />
                                            </button>
                                            <button className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-text-muted hover:text-text-primary transition-colors">
                                                <Settings size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-1">Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                            <input type="date" className="w-full h-14 pl-12 pr-4 bg-white dark:bg-white/5 rounded-2xl border border-border/50 outline-none text-text-primary font-bold shadow-sm" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-1">Heure</label>
                                        <div className="relative">
                                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                            <input type="time" className="w-full h-14 pl-12 pr-4 bg-white dark:bg-white/5 rounded-2xl border border-border/50 outline-none text-text-primary font-bold shadow-sm" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-8 bg-white border-t border-border flex gap-4">
                                <Button
                                    variant="ghost"
                                    className="flex-1 h-16 rounded-[1.5rem] font-bold uppercase tracking-widest text-xs hover:bg-bg-tertiary"
                                    onClick={() => setShowNewPost(false)}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    className="flex-[2] h-16 bg-text-primary text-bg-primary hover:bg-black dark:bg-white dark:text-black rounded-[1.5rem] transition-all font-black uppercase tracking-widest text-xs shadow-xl shadow-black/10 hover:shadow-2xl hover:-translate-y-1 active:scale-95 text-base"
                                    onClick={() => {
                                        showToast("Publication programmée avec succès!", "premium");
                                        setShowNewPost(false);
                                    }}
                                >
                                    Programmer la publication
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
