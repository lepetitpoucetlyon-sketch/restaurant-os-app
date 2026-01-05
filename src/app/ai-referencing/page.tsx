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
        <div className="flex h-[calc(100vh-70px)] -m-6 flex-col bg-[#F8F9FA] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between bg-white border-b border-neutral-100 px-8 py-4">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <h1 className="text-xl font-black text-[#1A1A1A] tracking-tight">Référencement IA</h1>
                        <p className="text-[11px] font-bold text-[#ADB5BD] uppercase tracking-wider mt-0.5">
                            Optimisez votre visibilité sur ChatGPT, Gemini, Copilot...
                        </p>
                    </div>

                    {/* AI Score */}
                    <div className="flex items-center gap-3 ml-6 pl-6 border-l border-neutral-100">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00D764] to-[#00B956] flex items-center justify-center">
                            <span className="text-xl font-black text-white">92</span>
                        </div>
                        <div>
                            <p className="font-black text-[#1A1A1A]">Score IA</p>
                            <p className="text-[11px] text-[#00D764] font-bold">Excellent</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 rounded-xl">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Actualiser
                    </Button>
                    <Button className="h-10 bg-[#1A1A1A] rounded-xl">
                        <Settings className="w-4 h-4 mr-2" />
                        Configurer
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b border-neutral-100 px-8">
                <div className="flex gap-8">
                    {[
                        { id: 'overview', label: 'Vue d\'ensemble', icon: Eye },
                        { id: 'schema', label: 'Données structurées', icon: FileJson },
                        { id: 'api', label: 'Endpoints API', icon: Code },
                        { id: 'prompts', label: 'Test de visibilité', icon: MessageSquare },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "flex items-center gap-2 py-4 border-b-2 font-bold text-sm transition-all",
                                    activeTab === tab.id
                                        ? "border-[#00D764] text-[#1A1A1A]"
                                        : "border-transparent text-[#ADB5BD] hover:text-[#6C757D]"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex-1 overflow-auto p-8">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {/* AI Compatibility Checks */}
                        <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
                            <h3 className="text-lg font-black text-[#1A1A1A] mb-6">Compatibilité IA</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {AI_CHECKS.map((check) => (
                                    <div
                                        key={check.id}
                                        className={cn(
                                            "p-4 rounded-xl border-2 transition-all",
                                            check.status === 'ok'
                                                ? "border-[#00D764]/30 bg-[#E6F9EF]/50"
                                                : check.status === 'warning'
                                                    ? "border-[#FF9900]/30 bg-[#FFF7E6]/50"
                                                    : "border-[#FF4D4D]/30 bg-[#FEECEC]/50"
                                        )}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-[#1A1A1A]">{check.name}</span>
                                            {check.status === 'ok' ? (
                                                <CheckCircle2 className="w-5 h-5 text-[#00D764]" />
                                            ) : (
                                                <AlertCircle className="w-5 h-5 text-[#FF9900]" />
                                            )}
                                        </div>
                                        <p className="text-sm text-[#6C757D]">{check.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Restaurant Preview Card */}
                        <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
                            <h3 className="text-lg font-black text-[#1A1A1A] mb-6">Prévisualisation IA</h3>
                            <p className="text-sm text-[#6C757D] mb-4">Voici comment votre restaurant apparaît dans les réponses IA :</p>

                            <div className="bg-[#F8F9FA] rounded-2xl p-6 border border-[#E9ECEF]">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] flex items-center justify-center">
                                        <Utensils className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-xl font-black text-[#1A1A1A]">{RESTAURANT_SCHEMA.name}</h4>
                                            <CheckCircle2 className="w-5 h-5 text-[#4285F4]" />
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                            <span className="font-bold">{RESTAURANT_SCHEMA.aggregateRating.ratingValue}</span>
                                            <span className="text-sm text-[#6C757D]">({RESTAURANT_SCHEMA.aggregateRating.reviewCount} avis)</span>
                                            <span className="text-[#6C757D]">•</span>
                                            <span className="text-sm text-[#6C757D]">{RESTAURANT_SCHEMA.servesCuisine}</span>
                                            <span className="text-[#6C757D]">•</span>
                                            <span className="text-sm text-[#6C757D]">{RESTAURANT_SCHEMA.priceRange}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-[#6C757D]">
                                        <MapPin className="w-4 h-4" />
                                        {RESTAURANT_SCHEMA.address.streetAddress}, {RESTAURANT_SCHEMA.address.addressLocality}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-[#6C757D]">
                                        <Phone className="w-4 h-4" />
                                        {RESTAURANT_SCHEMA.telephone}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-[#6C757D]">
                                        <Clock className="w-4 h-4" />
                                        Midi: 12h-14h30 • Soir: 19h-23h
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-[#00D764]">
                                        <Calendar className="w-4 h-4" />
                                        Réservation en ligne disponible
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button size="sm" className="bg-[#00D764] hover:bg-[#00B956] rounded-lg">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Réserver
                                    </Button>
                                    <Button size="sm" variant="outline" className="rounded-lg">
                                        <Utensils className="w-4 h-4 mr-2" />
                                        Voir le menu
                                    </Button>
                                    <Button size="sm" variant="outline" className="rounded-lg">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        Itinéraire
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* AI Platforms */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[
                                { name: 'ChatGPT', status: 'indexed', logo: '🤖' },
                                { name: 'Google Gemini', status: 'indexed', logo: '✨' },
                                { name: 'Microsoft Copilot', status: 'indexed', logo: '🔷' },
                                { name: 'Claude', status: 'pending', logo: '🧠' },
                            ].map((platform) => (
                                <div key={platform.name} className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-2xl">{platform.logo}</span>
                                        {platform.status === 'indexed' ? (
                                            <span className="px-2 py-1 bg-[#E6F9EF] text-[#00D764] text-[10px] font-black rounded-md">INDEXÉ</span>
                                        ) : (
                                            <span className="px-2 py-1 bg-[#FFF7E6] text-[#FF9900] text-[10px] font-black rounded-md">EN COURS</span>
                                        )}
                                    </div>
                                    <h4 className="font-bold text-[#1A1A1A]">{platform.name}</h4>
                                    <p className="text-[11px] text-[#6C757D] mt-1">
                                        {platform.status === 'indexed' ? 'Recommandable' : 'Indexation en cours...'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Schema Tab */}
                {activeTab === 'schema' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-black text-[#1A1A1A]">Schema.org Restaurant</h3>
                                    <p className="text-sm text-[#6C757D]">Données structurées pour les moteurs IA</p>
                                </div>
                                <Button onClick={handleCopySchema} variant="outline" className="rounded-xl">
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copier le JSON-LD
                                </Button>
                            </div>
                            <pre className="bg-[#1A1A1A] text-white p-6 rounded-xl overflow-auto text-sm font-mono max-h-[500px]">
                                {JSON.stringify(RESTAURANT_SCHEMA, null, 2)}
                            </pre>
                        </div>
                    </div>
                )}

                {/* API Tab */}
                {activeTab === 'api' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
                            <h3 className="text-lg font-black text-[#1A1A1A] mb-6">Endpoints API Publics</h3>
                            <div className="space-y-4">
                                {[
                                    { method: 'GET', path: '/api/restaurant', description: 'Informations générales' },
                                    { method: 'GET', path: '/api/menu', description: 'Menu complet avec prix' },
                                    { method: 'GET', path: '/api/hours', description: 'Horaires d\'ouverture' },
                                    { method: 'GET', path: '/api/availability', description: 'Créneaux disponibles' },
                                    { method: 'POST', path: '/api/reservations', description: 'Créer une réservation' },
                                ].map((endpoint, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[#F8F9FA]">
                                        <div className="flex items-center gap-4">
                                            <span className={cn(
                                                "px-3 py-1 rounded-lg text-[11px] font-black",
                                                endpoint.method === 'GET' ? "bg-[#E6F9EF] text-[#00D764]" : "bg-[#E8F4FD] text-[#007AFF]"
                                            )}>
                                                {endpoint.method}
                                            </span>
                                            <code className="font-mono text-sm text-[#1A1A1A]">{endpoint.path}</code>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-[#6C757D]">{endpoint.description}</span>
                                            <Button size="sm" variant="ghost" className="rounded-lg">
                                                <ExternalLink className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Prompts Tab */}
                {activeTab === 'prompts' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
                            <h3 className="text-lg font-black text-[#1A1A1A] mb-2">Test de Visibilité IA</h3>
                            <p className="text-sm text-[#6C757D] mb-6">Testez si votre restaurant apparaît dans les réponses IA pour ces requêtes</p>

                            <div className="space-y-3">
                                {AI_PROMPTS.map((prompt, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between p-4 rounded-xl border border-neutral-100 hover:bg-[#F8F9FA] transition-all cursor-pointer"
                                        onClick={() => handleTestPrompt(prompt)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-[#F8F9FA] flex items-center justify-center">
                                                <Search className="w-5 h-5 text-[#6C757D]" />
                                            </div>
                                            <span className="font-bold text-[#1A1A1A]">"{prompt}"</span>
                                        </div>
                                        <Button size="sm" variant="outline" className="rounded-lg">
                                            <Zap className="w-4 h-4 mr-2" />
                                            Tester
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 p-4 rounded-xl bg-[#E6F9EF] border border-[#00D764]/30">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-[#00D764] mt-0.5" />
                                    <div>
                                        <p className="font-bold text-[#00D764]">Votre restaurant est bien référencé!</p>
                                        <p className="text-sm text-[#6C757D] mt-1">
                                            Grâce aux données structurées et à l'API publique, votre restaurant sera recommandé par les IA conversationnelles.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
