"use client";

import { useState } from "react";
import {
    Bot,
    Globe,
    Search,
    CheckCircle2,
    AlertCircle,
    Code,
    FileJson,
    ExternalLink,
    Copy,
    Eye,
    RefreshCw,
    Settings,
    Utensils,
    Clock,
    MapPin,
    Phone,
    Star,
    Calendar,
    DollarSign,
    Info,
    Zap,
    MessageSquare,
    Link2,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { motion, AnimatePresence } from "framer-motion";

// Restaurant structured data for AI referencing
const RESTAURANT_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Restaurant Exemple",
    "image": "https://restaurant-exemple.com/images/facade.jpg",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Avenue des Champs-Élysées",
        "addressLocality": "Paris",
        "postalCode": "75008",
        "addressCountry": "FR"
    },
    "geo": {
        "@type": "GeoCoordinates",
        "latitude": 48.8698,
        "longitude": 2.3078
    },
    "telephone": "+33 1 23 45 67 89",
    "email": "contact@restaurant-exemple.com",
    "url": "https://restaurant-exemple.com",
    "openingHoursSpecification": [
        {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "12:00",
            "closes": "14:30"
        },
        {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "19:00",
            "closes": "23:00"
        }
    ],
    "servesCuisine": "French",
    "priceRange": "€€€",
    "acceptsReservations": true,
    "menu": "https://restaurant-exemple.com/menu",
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.7",
        "reviewCount": "342"
    }
};

// AI Optimization checks
const AI_CHECKS = [
    { id: 'schema', name: 'Schema.org Restaurant', status: 'ok', description: 'Données structurées complètes' },
    { id: 'openapi', name: 'API Publique Menu', status: 'ok', description: 'Endpoint /api/menu accessible' },
    { id: 'hours', name: 'Horaires dynamiques', status: 'ok', description: 'Mise à jour automatique' },
    { id: 'reservations', name: 'Réservation API', status: 'ok', description: 'Endpoint de réservation actif' },
    { id: 'reviews', name: 'Avis agrégés', status: 'warning', description: 'Connexion Google My Business requise' },
    { id: 'events', name: 'Événements spéciaux', status: 'ok', description: 'Menus spéciaux référencés' },
];

// Sample AI Prompts that would trigger restaurant
const AI_PROMPTS = [
    "Quel est un bon restaurant français à Paris ?",
    "Où dîner près des Champs-Élysées ?",
    "Restaurant gastronomique avec réservation en ligne à Paris",
    "Meilleur restaurant pour un anniversaire à Paris 8ème",
    "Restaurant ouvert le dimanche soir à Paris",
];

export default function AIReferencingPage() {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<'overview' | 'schema' | 'api' | 'prompts'>('overview');

    const handleCopySchema = () => {
        navigator.clipboard.writeText(JSON.stringify(RESTAURANT_SCHEMA, null, 2));
        showToast("Schema.org copié dans le presse-papiers", "success");
    };

    const handleTestPrompt = (prompt: string) => {
        showToast(`Test de visibilité IA pour: "${prompt}"`, "premium");
        setTimeout(() => {
            showToast("Votre restaurant apparaît dans les résultats IA! 🎉", "success");
        }, 2000);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] -m-4 md:-m-8 bg-bg-primary overflow-hidden pb-20 md:pb-0">
            {/* Header Card */}
            <div className="px-8 pt-8 pb-4">
                <div className="bg-white dark:bg-bg-primary rounded-2xl border border-black/5 dark:border-white/5 p-6 flex items-center justify-between shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center gap-8">
                        <div>
                            <h1 className="text-2xl font-serif font-black text-text-primary dark:text-white tracking-tight italic">
                                Référencement <span className="not-italic text-text-primary dark:text-white">IA</span>
                            </h1>
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-2">
                                Optimisez votre visibilité sur ChatGPT, Gemini, Copilot...
                            </p>
                        </div>

                        {/* AI Score Badge - Integrated in Header */}
                        <div className="hidden md:flex items-center gap-4 pl-8 border-l border-black/5 dark:border-white/5 h-12">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C5A059] to-[#8B7355] flex items-center justify-center shadow-lg shadow-[#C5A059]/20">
                                <span className="text-xl font-black text-white">92</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Score IA</span>
                                <span className="text-sm font-black text-accent-gold">Excellent</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3" data-tutorial="ai-referencing-0-0-1">
                        <Button variant="outline" className="h-10 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest border-black/10 hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/5 transition-all">
                            <RefreshCw className="w-3.5 h-3.5 mr-2" />
                            Actualiser
                        </Button>
                        <Button className="h-10 px-4 bg-text-primary text-bg-primary hover:bg-black hover:text-white dark:bg-white dark:text-black rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-black/5">
                            <Settings className="w-3.5 h-3.5 mr-2" />
                            Configurer
                        </Button>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="px-8 pb-6">
                <div className="flex bg-bg-tertiary dark:bg-white/5 p-1 rounded-xl w-fit border border-black/5 dark:border-white/5">
                    {[
                        { id: 'overview', label: "Vue d'ensemble", icon: Eye },
                        { id: 'schema', label: 'Données structurées', icon: FileJson },
                        { id: 'api', label: 'Endpoints API', icon: Code },
                        { id: 'prompts', label: 'Test de visibilité', icon: MessageSquare },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                activeTab === tab.id
                                    ? "bg-white dark:bg-bg-primary shadow-sm text-text-primary dark:text-white"
                                    : "text-text-muted hover:text-text-primary dark:hover:text-white"
                            )}
                        >
                            <tab.icon strokeWidth={2} className={cn("w-3.5 h-3.5", activeTab === tab.id ? "text-text-primary dark:text-white" : "text-text-muted")} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-auto px-8 pb-12 elegant-scrollbar">
                <AnimatePresence mode="wait">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            {/* AI Compatibility Checks */}
                            <div className="card-premium p-8">
                                <h3 className="text-xl font-serif font-black text-text-primary dark:text-white italic tracking-tight mb-8">Compatibilité IA</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {AI_CHECKS.map((check) => (
                                        <div
                                            key={check.id}
                                            className={cn(
                                                "p-6 rounded-2xl border transition-all duration-300 hover:shadow-md group",
                                                check.status === 'ok'
                                                    ? "border-success/20 bg-success/5 dark:bg-success/5"
                                                    : check.status === 'warning'
                                                        ? "border-warning/20 bg-warning/5 dark:bg-warning/5"
                                                        : "border-error/20 bg-error/5 dark:bg-error/5"
                                            )}
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="font-bold text-text-primary dark:text-white text-sm">{check.name}</span>
                                                {check.status === 'ok' ? (
                                                    <CheckCircle2 className="w-5 h-5 text-success" />
                                                ) : (
                                                    <AlertCircle className="w-5 h-5 text-warning" />
                                                )}
                                            </div>
                                            <p className="text-xs text-text-muted font-medium">{check.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Restaurant Preview Card */}
                            <div className="card-premium p-8">
                                <h3 className="text-xl font-serif font-black text-text-primary dark:text-white italic tracking-tight mb-2">Prévisualisation IA</h3>
                                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-8">Voici comment votre restaurant apparaît dans les réponses IA</p>

                                <div className="bg-bg-tertiary dark:bg-white/5 rounded-2xl p-8 border border-black/5 dark:border-white/10">
                                    <div className="flex items-start gap-6 mb-8">
                                        <div className="w-20 h-20 rounded-2xl bg-black dark:bg-white/10 flex items-center justify-center shrink-0 shadow-lg shadow-black/10">
                                            <Utensils className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h4 className="text-2xl font-black text-text-primary dark:text-white tracking-tight">{RESTAURANT_SCHEMA.name}</h4>
                                                <CheckCircle2 className="w-5 h-5 text-[#4285F4] fill-white" />
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-lg">
                                                    <Star className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500 fill-amber-600 dark:fill-amber-500" />
                                                    <span className="font-black text-amber-700 dark:text-amber-400 text-xs">{RESTAURANT_SCHEMA.aggregateRating.ratingValue}</span>
                                                </div>
                                                <span className="text-xs font-medium text-text-muted">({RESTAURANT_SCHEMA.aggregateRating.reviewCount} avis)</span>
                                                <span className="text-text-muted/30">•</span>
                                                <span className="text-xs font-bold text-text-primary dark:text-white uppercase tracking-wide">{RESTAURANT_SCHEMA.servesCuisine}</span>
                                                <span className="text-text-muted/30">•</span>
                                                <span className="text-xs font-medium text-text-muted">{RESTAURANT_SCHEMA.priceRange}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-8 p-6 bg-white dark:bg-black/20 rounded-xl border border-black/5 dark:border-white/5">
                                        <div className="flex items-center gap-3 text-sm text-text-secondary dark:text-neutral-300">
                                            <MapPin className="w-4 h-4 text-text-muted" />
                                            {RESTAURANT_SCHEMA.address.streetAddress}, {RESTAURANT_SCHEMA.address.addressLocality}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-text-secondary dark:text-neutral-300">
                                            <Phone className="w-4 h-4 text-text-muted" />
                                            {RESTAURANT_SCHEMA.telephone}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-text-secondary dark:text-neutral-300">
                                            <Clock className="w-4 h-4 text-text-muted" />
                                            <span className="font-medium">Midi: 12h-14h30 • Soir: 19h-23h</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-accent-gold font-bold">
                                            <Calendar className="w-4 h-4" />
                                            Réservation en ligne disponible
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <Button className="h-10 bg-accent-gold hover:bg-black text-white rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-accent-gold/20 transition-all" data-tutorial="ai-referencing-0-2-2">
                                            <Calendar className="w-3.5 h-3.5 mr-2" />
                                            Réserver
                                        </Button>
                                        <Button variant="outline" className="h-10 rounded-xl border-border bg-white dark:bg-transparent dark:border-white/10 font-bold uppercase tracking-widest text-[10px] hover:bg-bg-tertiary">
                                            <Utensils className="w-3.5 h-3.5 mr-2" />
                                            Voir le menu
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* AI Platforms */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                {[
                                    { name: 'ChatGPT', status: 'indexed', logo: '🤖' },
                                    { name: 'Google Gemini', status: 'indexed', logo: '✨' },
                                    { name: 'Microsoft Copilot', status: 'indexed', logo: '🔷' },
                                    { name: 'Claude', status: 'pending', logo: '🧠' },
                                ].map((platform, platformIdx) => (
                                    <div key={platform.name} data-tutorial={`ai-referencing-0-1-${platformIdx === 0 ? '1' : platformIdx}`} className="card-premium p-6 hover:translate-y-[-2px] transition-transform duration-300">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-3xl">{platform.logo}</span>
                                            {platform.status === 'indexed' ? (
                                                <span className="px-2 py-1 bg-success/10 text-success text-[9px] font-black uppercase tracking-widest rounded-md border border-success/20">Indexé</span>
                                            ) : (
                                                <span className="px-2 py-1 bg-warning/10 text-warning text-[9px] font-black uppercase tracking-widest rounded-md border border-warning/20">En cours</span>
                                            )}
                                        </div>
                                        <h4 className="font-black text-lg text-text-primary dark:text-white mb-1">{platform.name}</h4>
                                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                                            {platform.status === 'indexed' ? 'Recommandable' : 'Indexation en cours...'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Schema Tab */}
                    {activeTab === 'schema' && (
                        <motion.div
                            key="schema"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <div className="card-premium p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-xl font-serif font-black text-text-primary dark:text-white italic tracking-tight">Schema.org Restaurant</h3>
                                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">Données structurées pour les moteurs IA</p>
                                    </div>
                                    <Button onClick={handleCopySchema} variant="outline" className="h-10 rounded-xl border-border font-bold uppercase tracking-widest text-[10px] hover:bg-bg-tertiary">
                                        <Copy className="w-3.5 h-3.5 mr-2" />
                                        Copier le JSON-LD
                                    </Button>
                                </div>
                                <div className="rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 shadow-inner">
                                    <div className="bg-[#1e1e1e] px-4 py-2 border-b border-white/10 flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                                        <span className="ml-2 text-xs text-white/40 font-mono">schema.json</span>
                                    </div>
                                    <pre className="bg-[#1e1e1e] text-[#d4d4d4] p-6 overflow-auto text-xs font-mono leading-relaxed max-h-[600px]">
                                        {JSON.stringify(RESTAURANT_SCHEMA, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* API Tab */}
                    {activeTab === 'api' && (
                        <motion.div
                            key="api"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <div className="card-premium p-8">
                                <h3 className="text-xl font-serif font-black text-text-primary dark:text-white italic tracking-tight mb-8">Endpoints API Publics</h3>
                                <div className="space-y-4">
                                    {[
                                        { method: 'GET', path: '/api/restaurant', description: 'Informations générales' },
                                        { method: 'GET', path: '/api/menu', description: 'Menu complet avec prix' },
                                        { method: 'GET', path: '/api/hours', description: "Horaires d'ouverture" },
                                        { method: 'GET', path: '/api/availability', description: 'Créneaux disponibles' },
                                        { method: 'POST', path: '/api/reservations', description: 'Créer une réservation' },
                                    ].map((endpoint, i) => (
                                        <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-bg-tertiary dark:bg-white/5 border border-transparent hover:border-black/5 transition-colors group">
                                            <div className="flex items-center gap-6">
                                                <span className={cn(
                                                    "px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest min-w-[60px] text-center",
                                                    endpoint.method === 'GET' ? "bg-success/10 text-success" : "bg-info/10 text-info"
                                                )}>
                                                    {endpoint.method}
                                                </span>
                                                <code className="font-mono text-sm font-bold text-text-primary dark:text-white bg-white dark:bg-black/20 px-3 py-1 rounded-lg border border-black/5 dark:border-white/10">{endpoint.path}</code>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <span className="text-sm font-medium text-text-muted">{endpoint.description}</span>
                                                <Button size="sm" variant="ghost" className="rounded-xl h-9 w-9 p-0 hover:bg-white dark:hover:bg-white/10 dark:text-white transition-colors">
                                                    <ExternalLink className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Prompts Tab */}
                    {activeTab === 'prompts' && (
                        <motion.div
                            key="prompts"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <div className="card-premium p-8">
                                <h3 className="text-xl font-serif font-black text-text-primary dark:text-white italic tracking-tight mb-2">Test de Visibilité IA</h3>
                                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-8">Testez si votre restaurant apparaît dans les réponses IA pour ces requêtes</p>

                                <div className="space-y-4">
                                    {AI_PROMPTS.map((prompt, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between p-5 rounded-2xl border border-border bg-white dark:bg-white/5 hover:border-accent hover:shadow-md transition-all cursor-pointer group"
                                            onClick={() => handleTestPrompt(prompt)}
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className="w-10 h-10 rounded-xl bg-bg-tertiary dark:bg-white/10 flex items-center justify-center transition-colors group-hover:bg-accent group-hover:text-white">
                                                    <Search className="w-5 h-5 text-text-muted group-hover:text-white" />
                                                </div>
                                                <span className="font-bold text-text-primary dark:text-white text-sm transition-colors group-hover:text-accent">"{prompt}"</span>
                                            </div>
                                            <Button size="sm" variant="outline" className="rounded-xl border-border font-bold uppercase tracking-widest text-[10px] group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all">
                                                <Zap className="w-3.5 h-3.5 mr-2" />
                                                Tester
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 p-6 rounded-2xl bg-success/5 border border-success/20 transition-all flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-6 h-6 text-success" />
                                    </div>
                                    <div>
                                        <p className="font-black text-success text-lg mb-1">Votre restaurant est bien référencé!</p>
                                        <p className="text-sm font-medium text-text-muted">
                                            Grâce aux données structurées et à l'API publique, votre restaurant sera recommandé par les IA conversationnelles comme ChatGPT, Gemini et Copilot.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
