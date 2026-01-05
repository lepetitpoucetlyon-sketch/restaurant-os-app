"use client";

import { useState } from "react";
import {
    Instagram,
    Facebook,
    Image,
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
    Link2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

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
        posts: 234,
        engagement: 4.2
    },
    {
        id: 'facebook',
        platform: 'Facebook',
        handle: 'Restaurant Exemple',
        followers: 8920,
        connected: true,
        icon: Facebook,
        color: '#1877F2',
        posts: 189,
        engagement: 2.8
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
];

// Mock campaigns
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
    {
        id: 'CAMP003',
        name: 'Réactivation - Clients perdus',
        type: 'sms',
        audience: 'Sans visite depuis 6 mois',
        audienceSize: 89,
        status: 'draft',
        sent: 0,
        opened: 0,
        clicked: 0,
        conversions: 0,
    },
];

// CRM Segments
const CRM_SEGMENTS = [
    { id: 'vip', name: 'VIP', count: 45, color: '#8B5CF6', criteria: '10+ visites, panier > 100€' },
    { id: 'regular', name: 'Réguliers', count: 156, color: '#00D764', criteria: '3-9 visites' },
    { id: 'new', name: 'Nouveaux', count: 89, color: '#4285F4', criteria: 'Première visite < 30j' },
    { id: 'lost', name: 'À réactiver', count: 67, color: '#FF9900', criteria: 'Sans visite > 90j' },
    { id: 'birthday', name: 'Anniversaires', count: 28, color: '#E4405F', criteria: 'Anniversaire ce mois' },
];

export default function SocialMarketingPage() {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<'social' | 'campaigns' | 'segments'>('social');
    const [showNewPost, setShowNewPost] = useState(false);
    const [showNewCampaign, setShowNewCampaign] = useState(false);

    return (
        <div className="flex h-[calc(100vh-70px)] -m-6 flex-col bg-[#F8F9FA] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between bg-white border-b border-neutral-100 px-8 py-4">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <h1 className="text-xl font-black text-[#1A1A1A] tracking-tight">Marketing & Réseaux Sociaux</h1>
                        <p className="text-[11px] font-bold text-[#ADB5BD] uppercase tracking-wider mt-0.5">
                            Gestion centralisée de votre présence digitale
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Tab Switcher */}
                    <div className="flex bg-[#F8F9FA] p-1 rounded-xl">
                        {[
                            { id: 'social', label: 'Réseaux Sociaux', icon: Instagram },
                            { id: 'campaigns', label: 'Campagnes', icon: Megaphone },
                            { id: 'segments', label: 'Segments CRM', icon: Users },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-bold transition-all",
                                    activeTab === tab.id ? "bg-white shadow-sm text-[#1A1A1A]" : "text-[#ADB5BD]"
                                )}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-8">
                {/* Social Media Tab */}
                {activeTab === 'social' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {/* Connected Accounts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {SOCIAL_ACCOUNTS.map((account) => {
                                const Icon = account.icon;
                                return (
                                    <div key={account.id} className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                                                    style={{ backgroundColor: `${account.color}15` }}
                                                >
                                                    <Icon className="w-7 h-7" style={{ color: account.color }} />
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-lg text-[#1A1A1A]">{account.platform}</h3>
                                                    <p className="text-sm text-[#6C757D]">{account.handle}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="w-5 h-5 text-[#00D764]" />
                                                <span className="text-sm font-bold text-[#00D764]">Connecté</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="text-center p-3 bg-[#F8F9FA] rounded-xl">
                                                <p className="text-xl font-black text-[#1A1A1A]">{(account.followers / 1000).toFixed(1)}K</p>
                                                <p className="text-[10px] font-bold text-[#ADB5BD] uppercase">Abonnés</p>
                                            </div>
                                            <div className="text-center p-3 bg-[#F8F9FA] rounded-xl">
                                                <p className="text-xl font-black text-[#1A1A1A]">{account.posts}</p>
                                                <p className="text-[10px] font-bold text-[#ADB5BD] uppercase">Posts</p>
                                            </div>
                                            <div className="text-center p-3 bg-[#F8F9FA] rounded-xl">
                                                <p className="text-xl font-black text-[#00D764]">{account.engagement}%</p>
                                                <p className="text-[10px] font-bold text-[#ADB5BD] uppercase">Engagement</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Scheduled Posts */}
                        <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-black text-[#1A1A1A]">Publications Programmées</h3>
                                <Button onClick={() => setShowNewPost(true)} className="h-10 bg-[#1A1A1A] rounded-xl">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nouvelle Publication
                                </Button>
                            </div>
                            <div className="space-y-4">
                                {SCHEDULED_POSTS.map((post) => (
                                    <div key={post.id} className="flex items-start gap-4 p-4 rounded-xl bg-[#F8F9FA]">
                                        <div className="w-24 h-24 rounded-xl bg-neutral-200 flex items-center justify-center">
                                            {post.media.type === 'image' ? (
                                                <Image className="w-8 h-8 text-neutral-400" />
                                            ) : (
                                                <Video className="w-8 h-8 text-neutral-400" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                {post.platforms.map((p) => {
                                                    const account = SOCIAL_ACCOUNTS.find(a => a.id === p);
                                                    if (!account) return null;
                                                    const Icon = account.icon;
                                                    return (
                                                        <div
                                                            key={p}
                                                            className="w-6 h-6 rounded-md flex items-center justify-center"
                                                            style={{ backgroundColor: `${account.color}15` }}
                                                        >
                                                            <Icon className="w-3.5 h-3.5" style={{ color: account.color }} />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <p className="text-sm text-[#1A1A1A] line-clamp-2">{post.content}</p>
                                            <div className="flex items-center gap-4 mt-2 text-[11px] text-[#ADB5BD]">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(post.scheduledFor).toLocaleDateString('fr-FR')}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(post.scheduledFor).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg">
                                                <Edit3 className="w-4 h-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg text-[#FF4D4D]">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Campaigns Tab */}
                {activeTab === 'campaigns' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {/* Campaign Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#E6F9EF] flex items-center justify-center">
                                        <Send className="w-5 h-5 text-[#00D764]" />
                                    </div>
                                </div>
                                <p className="text-[10px] font-black text-[#ADB5BD] uppercase">Envoyés ce mois</p>
                                <p className="text-2xl font-black text-[#1A1A1A]">1,247</p>
                            </div>
                            <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#E8F4FD] flex items-center justify-center">
                                        <Eye className="w-5 h-5 text-[#007AFF]" />
                                    </div>
                                </div>
                                <p className="text-[10px] font-black text-[#ADB5BD] uppercase">Taux d'ouverture</p>
                                <p className="text-2xl font-black text-[#1A1A1A]">62.7%</p>
                            </div>
                            <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#FFF3E6] flex items-center justify-center">
                                        <Target className="w-5 h-5 text-[#FF9900]" />
                                    </div>
                                </div>
                                <p className="text-[10px] font-black text-[#ADB5BD] uppercase">Taux de clic</p>
                                <p className="text-2xl font-black text-[#1A1A1A]">24.3%</p>
                            </div>
                            <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#F3E8FF] flex items-center justify-center">
                                        <Zap className="w-5 h-5 text-[#8B5CF6]" />
                                    </div>
                                </div>
                                <p className="text-[10px] font-black text-[#ADB5BD] uppercase">Conversions</p>
                                <p className="text-2xl font-black text-[#1A1A1A]">48</p>
                            </div>
                        </div>

                        {/* Campaigns List */}
                        <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-black text-[#1A1A1A]">Campagnes Marketing</h3>
                                <Button onClick={() => setShowNewCampaign(true)} className="h-10 bg-[#1A1A1A] rounded-xl">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nouvelle Campagne
                                </Button>
                            </div>
                            <div className="space-y-4">
                                {MARKETING_CAMPAIGNS.map((campaign) => (
                                    <div key={campaign.id} className="flex items-center justify-between p-5 rounded-xl border border-neutral-100 hover:shadow-md transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center",
                                                campaign.type === 'email' ? "bg-[#E8F4FD]" : "bg-[#E6F9EF]"
                                            )}>
                                                {campaign.type === 'email' ? (
                                                    <Mail className="w-6 h-6 text-[#007AFF]" />
                                                ) : (
                                                    <MessageCircle className="w-6 h-6 text-[#00D764]" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[#1A1A1A]">{campaign.name}</h4>
                                                <p className="text-sm text-[#6C757D]">{campaign.audience}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="text-center">
                                                <p className="font-black text-[#1A1A1A]">{campaign.audienceSize}</p>
                                                <p className="text-[10px] text-[#ADB5BD]">Audience</p>
                                            </div>
                                            {campaign.status === 'active' && (
                                                <>
                                                    <div className="text-center">
                                                        <p className="font-black text-[#1A1A1A]">{((campaign.opened / campaign.sent) * 100).toFixed(0)}%</p>
                                                        <p className="text-[10px] text-[#ADB5BD]">Ouvert</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="font-black text-[#00D764]">{campaign.conversions}</p>
                                                        <p className="text-[10px] text-[#ADB5BD]">Réservations</p>
                                                    </div>
                                                </>
                                            )}
                                            <span className={cn(
                                                "px-3 py-1.5 rounded-lg text-[11px] font-bold",
                                                campaign.status === 'active' ? "bg-[#E6F9EF] text-[#00D764]" :
                                                    campaign.status === 'scheduled' ? "bg-[#E8F4FD] text-[#007AFF]" :
                                                        "bg-[#F8F9FA] text-[#6C757D]"
                                            )}>
                                                {campaign.status === 'active' ? 'Active' : campaign.status === 'scheduled' ? 'Programmée' : 'Brouillon'}
                                            </span>
                                            <Button size="sm" variant="ghost" className="rounded-lg">
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Segments Tab */}
                {activeTab === 'segments' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {CRM_SEGMENTS.map((segment) => (
                                <div
                                    key={segment.id}
                                    className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm hover:shadow-lg transition-all cursor-pointer"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                                            style={{ backgroundColor: `${segment.color}15` }}
                                        >
                                            <Users className="w-6 h-6" style={{ color: segment.color }} />
                                        </div>
                                        <span
                                            className="text-2xl font-black"
                                            style={{ color: segment.color }}
                                        >
                                            {segment.count}
                                        </span>
                                    </div>
                                    <h4 className="font-black text-lg text-[#1A1A1A] mb-1">{segment.name}</h4>
                                    <p className="text-sm text-[#6C757D] mb-4">{segment.criteria}</p>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1 h-9 rounded-lg text-[11px]"
                                            onClick={() => showToast(`Campagne créée pour ${segment.count} clients ${segment.name}`, "success")}
                                        >
                                            <Mail className="w-3.5 h-3.5 mr-1" />
                                            Email
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1 h-9 rounded-lg text-[11px]"
                                            onClick={() => showToast(`SMS programmé pour ${segment.count} clients`, "success")}
                                        >
                                            <MessageCircle className="w-3.5 h-3.5 mr-1" />
                                            SMS
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {/* Add Segment Card */}
                            <div
                                className="bg-[#F8F9FA] rounded-2xl p-6 border-2 border-dashed border-[#DEE2E6] flex flex-col items-center justify-center cursor-pointer hover:border-[#1A1A1A] transition-all"
                                onClick={() => showToast("Création de segment personnalisé...", "info")}
                            >
                                <Plus className="w-10 h-10 text-[#ADB5BD] mb-3" />
                                <p className="font-bold text-[#6C757D]">Nouveau Segment</p>
                                <p className="text-[11px] text-[#ADB5BD] text-center mt-1">Créez des segments personnalisés basés sur le comportement client</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* New Post Modal */}
            {showNewPost && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
                        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                            <h2 className="text-xl font-black text-[#1A1A1A]">Nouvelle Publication</h2>
                            <button onClick={() => setShowNewPost(false)} className="p-2 hover:bg-[#F8F9FA] rounded-lg">
                                <Trash2 className="w-5 h-5 text-[#ADB5BD]" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="text-[11px] font-black text-[#ADB5BD] uppercase">Plateformes</label>
                                <div className="flex gap-3 mt-2">
                                    {SOCIAL_ACCOUNTS.map((account) => {
                                        const Icon = account.icon;
                                        return (
                                            <button
                                                key={account.id}
                                                className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-[#1A1A1A] bg-[#F8F9FA]"
                                            >
                                                <Icon className="w-4 h-4" style={{ color: account.color }} />
                                                {account.platform}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div>
                                <label className="text-[11px] font-black text-[#ADB5BD] uppercase">Contenu</label>
                                <textarea
                                    className="w-full h-32 mt-2 p-4 bg-[#F8F9FA] rounded-xl border-2 border-transparent focus:border-[#1A1A1A] outline-none resize-none"
                                    placeholder="Écrivez votre publication..."
                                />
                            </div>
                            <div>
                                <label className="text-[11px] font-black text-[#ADB5BD] uppercase">Média</label>
                                <div className="mt-2 p-8 border-2 border-dashed border-[#DEE2E6] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#1A1A1A] transition-all">
                                    <Image className="w-10 h-10 text-[#ADB5BD] mb-2" />
                                    <p className="font-bold text-[#6C757D]">Glissez une image ou vidéo</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[11px] font-black text-[#ADB5BD] uppercase">Date</label>
                                    <input type="date" className="w-full h-11 mt-2 px-4 bg-[#F8F9FA] rounded-xl border-2 border-transparent focus:border-[#1A1A1A] outline-none" />
                                </div>
                                <div>
                                    <label className="text-[11px] font-black text-[#ADB5BD] uppercase">Heure</label>
                                    <input type="time" className="w-full h-11 mt-2 px-4 bg-[#F8F9FA] rounded-xl border-2 border-transparent focus:border-[#1A1A1A] outline-none" />
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-[#F8F9FA] flex gap-3">
                            <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setShowNewPost(false)}>
                                Annuler
                            </Button>
                            <Button
                                className="flex-1 h-12 bg-[#1A1A1A] rounded-xl"
                                onClick={() => {
                                    showToast("Publication programmée avec succès!", "success");
                                    setShowNewPost(false);
                                }}
                            >
                                <Calendar className="w-4 h-4 mr-2" />
                                Programmer
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
