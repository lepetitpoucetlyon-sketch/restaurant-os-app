"use client";

import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
    ChefHat,
    BarChart3,
    Package,
    Users,
    Shield,
    Utensils,
    Check,
    ArrowRight,
    Sparkles,
    Star,
    Play,
    Menu,
    X,
    Globe,
    Mail,
    Phone,
    MapPin,
    Instagram,
    Linkedin,
    Twitter,
    ChevronRight,
    Zap,
    Clock,
    TrendingUp,
    Lock,
    Cpu,
    Layers
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ============================================
// DESIGN TOKENS
// ============================================
const ACCENT = "#C9A227"; // Gold accent from Restaurant OS

// ============================================
// DATA
// ============================================
const FEATURES = [
    {
        id: "pos",
        title: "POS & Gestion Salle",
        description: "Interface de caisse intuitive et plan de salle interactif pour un service fluide.",
        icon: Utensils,
        color: "#C5A059",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop",
        size: "large"
    },
    {
        id: "kitchen",
        title: "Cuisine & KDS",
        description: "Écran de production, fiches recettes et mise en place automatisée.",
        icon: ChefHat,
        color: "#FF9500",
        image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop",
        size: "medium"
    },
    {
        id: "stock",
        title: "Stocks Intelligents",
        description: "Prédictions de rupture, commandes fournisseurs et traçabilité HACCP.",
        icon: Package,
        color: "#007AFF",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop",
        size: "medium"
    },
    {
        id: "finance",
        title: "Finance & Comptabilité",
        description: "Tableau de bord P&L, cash-flow prédictif et génération de devis.",
        icon: BarChart3,
        color: "#9333EA",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop",
        size: "small"
    },
    {
        id: "hr",
        title: "RH & Planning",
        description: "Planification des équipes, gestion des congés et conformité légale.",
        icon: Users,
        color: "#EC4899",
        image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop",
        size: "small"
    },
    {
        id: "haccp",
        title: "Qualité HACCP",
        description: "Relevés de température, plans de nettoyage et audit trail complet.",
        icon: Shield,
        color: "#C5A059",
        image: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?q=80&w=800&auto=format&fit=crop",
        size: "small"
    }
];

const PRICING = [
    {
        id: "essential",
        name: "Essential",
        price: "99",
        period: "/mois",
        description: "Pour les restaurants indépendants",
        features: [
            "POS & Gestion Salle",
            "Livre de Recettes (50 max)",
            "Gestion Stocks de base",
            "1 Terminal",
            "Support Email"
        ],
        highlighted: false,
        cta: "Commencer"
    },
    {
        id: "professional",
        name: "Professional",
        price: "199",
        period: "/mois",
        description: "Pour les établissements ambitieux",
        features: [
            "Tout Essential +",
            "Recettes illimitées",
            "Prédictions IA Stock",
            "Module RH & Planning",
            "KDS Multi-postes",
            "3 Terminaux",
            "Support Prioritaire 24/7"
        ],
        highlighted: true,
        cta: "Essai Gratuit 14j"
    },
    {
        id: "enterprise",
        name: "Enterprise",
        price: "Sur mesure",
        period: "",
        description: "Pour les groupes multi-sites",
        features: [
            "Tout Professional +",
            "Multi-établissements",
            "API & Intégrations",
            "Comptabilité Certifiée",
            "Onboarding Dédié",
            "SLA Garanti 99.9%"
        ],
        highlighted: false,
        cta: "Nous Contacter"
    }
];

const TESTIMONIALS = [
    {
        id: 1,
        quote: "Restaurant OS a révolutionné notre service. Le temps de formation des équipes a été divisé par deux.",
        author: "Marie Dupont",
        role: "Directrice, Le Petit Bistrot",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
        rating: 5
    },
    {
        id: 2,
        quote: "L'intelligence prédictive des stocks nous a fait économiser 18% sur notre food cost en 3 mois.",
        author: "Jean-Pierre Martin",
        role: "Chef Exécutif, Brasserie Moderne",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
        rating: 5
    },
    {
        id: 3,
        quote: "Enfin un outil pensé par des restaurateurs, pour des restaurateurs. L'interface est sublime.",
        author: "Sophie Bernard",
        role: "Propriétaire, Café des Arts",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
        rating: 5
    }
];

const STATS = [
    { value: "2,500+", label: "Restaurants Actifs" },
    { value: "18%", label: "Réduction Food Cost" },
    { value: "99.9%", label: "Uptime Garanti" },
    { value: "4.9/5", label: "Note Clients" }
];

// ============================================
// COMPONENTS
// ============================================

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        >
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                    {/* Logo */}
                    <Link href="/landing" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9A227] to-[#8B7355] flex items-center justify-center shadow-lg shadow-[#C9A227]/20">
                            <ChefHat className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white font-serif text-xl font-semibold tracking-tight">Restaurant OS</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="#features" className="text-white/60 hover:text-white text-sm font-medium transition-colors">Fonctionnalités</Link>
                        <Link href="#pricing" className="text-white/60 hover:text-white text-sm font-medium transition-colors">Tarifs</Link>
                        <Link href="#testimonials" className="text-white/60 hover:text-white text-sm font-medium transition-colors">Témoignages</Link>
                        <Link href="/login" className="text-white/60 hover:text-white text-sm font-medium transition-colors">Connexion</Link>
                    </div>

                    {/* CTA */}
                    <div className="hidden md:flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-2.5 bg-[#C9A227] text-black font-bold text-sm rounded-xl shadow-lg shadow-[#C9A227]/30 hover:shadow-xl hover:shadow-[#C9A227]/40 transition-all"
                        >
                            Démonstration
                        </motion.button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:hidden mt-4 p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
                    >
                        <div className="flex flex-col gap-4">
                            <Link href="#features" className="text-white/80 text-lg font-medium">Fonctionnalités</Link>
                            <Link href="#pricing" className="text-white/80 text-lg font-medium">Tarifs</Link>
                            <Link href="#testimonials" className="text-white/80 text-lg font-medium">Témoignages</Link>
                            <Link href="/login" className="text-white/80 text-lg font-medium">Connexion</Link>
                            <button className="mt-4 w-full py-3 bg-[#C9A227] text-black font-bold rounded-xl">
                                Démonstration
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.nav>
    );
}

function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-20 px-6">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[#0a0a0a]" />
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#C9A227]/10 rounded-full blur-[150px] opacity-50" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#007AFF]/10 rounded-full blur-[120px] opacity-30" />

            {/* Grid Pattern */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '100px 100px'
                }}
            />

            <div className="relative z-10 max-w-6xl mx-auto text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
                >
                    <Sparkles className="w-4 h-4 text-[#C9A227]" />
                    <span className="text-white/60 text-sm font-medium">Propulsé par l'IA</span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-serif font-semibold text-white leading-[1.1] tracking-tight mb-8"
                >
                    L'Intelligence<br />
                    <span className="text-[#C9A227]">Exécutive</span><br />
                    pour Restaurateurs
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed"
                >
                    Gérez votre établissement avec la précision d'un chef étoilé.<br />
                    POS, Cuisine, Stocks, Finance, RH — tout en un.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
                >
                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(201, 162, 39, 0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        className="group px-8 py-4 bg-[#C9A227] text-black font-bold text-lg rounded-2xl shadow-xl shadow-[#C9A227]/30 flex items-center gap-3 transition-all"
                    >
                        Demander une Démonstration
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="group px-8 py-4 bg-white/5 text-white font-bold text-lg rounded-2xl border border-white/10 hover:bg-white/10 flex items-center gap-3 transition-all"
                    >
                        <Play className="w-5 h-5" />
                        Voir la Vidéo
                    </motion.button>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
                >
                    {STATS.map((stat, idx) => (
                        <div key={idx} className="text-center">
                            <div className="text-3xl md:text-4xl font-mono font-bold text-white mb-2">{stat.value}</div>
                            <div className="text-sm text-white/40 font-medium">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
                    <div className="w-1.5 h-3 rounded-full bg-white/40" />
                </div>
            </motion.div>
        </section>
    );
}

function FeaturesSection() {
    return (
        <section id="features" className="relative py-32 px-6 bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <span className="text-[#C9A227] text-sm font-bold uppercase tracking-[0.3em] mb-4 block">Fonctionnalités</span>
                    <h2 className="text-4xl md:text-6xl font-serif font-semibold text-white mb-6">
                        Tout ce dont vous avez besoin
                    </h2>
                    <p className="text-xl text-white/50 max-w-2xl mx-auto">
                        Une suite complète d'outils conçus pour l'excellence opérationnelle.
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FEATURES.map((feature, idx) => (
                        <motion.div
                            key={feature.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className={cn(
                                "group relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-white/5 to-transparent cursor-pointer",
                                feature.size === "large" ? "md:col-span-2 md:row-span-2" : "",
                                feature.size === "medium" ? "md:row-span-2" : ""
                            )}
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-700">
                                <img
                                    src={feature.image}
                                    alt={feature.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 p-8 h-full flex flex-col justify-end min-h-[300px]">
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-white/10 backdrop-blur-sm transition-all duration-300 group-hover:scale-110"
                                    style={{ backgroundColor: `${feature.color}20` }}
                                >
                                    <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                                </div>
                                <h3 className="text-2xl font-serif font-semibold text-white mb-3">{feature.title}</h3>
                                <p className="text-white/50 leading-relaxed">{feature.description}</p>

                                <div className="mt-6 flex items-center gap-2 text-[#C9A227] opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-sm font-bold uppercase tracking-widest">En savoir plus</span>
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function PricingSection() {
    return (
        <section id="pricing" className="relative py-32 px-6 bg-[#0a0a0a]">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#C9A227]/5 rounded-full blur-[150px]" />

            <div className="relative z-10 max-w-6xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <span className="text-[#C9A227] text-sm font-bold uppercase tracking-[0.3em] mb-4 block">Tarifs</span>
                    <h2 className="text-4xl md:text-6xl font-serif font-semibold text-white mb-6">
                        Investissez dans l'excellence
                    </h2>
                    <p className="text-xl text-white/50 max-w-2xl mx-auto">
                        Des formules adaptées à chaque ambition. Sans engagement, sans surprise.
                    </p>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {PRICING.map((plan, idx) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            whileHover={{ y: -10 }}
                            className={cn(
                                "relative rounded-3xl p-8 border transition-all duration-500",
                                plan.highlighted
                                    ? "bg-gradient-to-b from-[#C9A227]/20 to-[#C9A227]/5 border-[#C9A227]/30 shadow-2xl shadow-[#C9A227]/10"
                                    : "bg-white/5 border-white/10 hover:border-white/20"
                            )}
                        >
                            {plan.highlighted && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#C9A227] text-black text-xs font-bold uppercase tracking-widest rounded-full shadow-lg">
                                    Populaire
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                                <p className="text-white/50 text-sm">{plan.description}</p>
                            </div>

                            <div className="mb-8">
                                <span className="text-5xl font-mono font-bold text-white">{plan.price}</span>
                                {plan.period && <span className="text-white/50 text-lg">{plan.period}</span>}
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, fIdx) => (
                                    <li key={fIdx} className="flex items-start gap-3">
                                        <Check className={cn("w-5 h-5 mt-0.5 flex-shrink-0", plan.highlighted ? "text-[#C9A227]" : "text-white/40")} />
                                        <span className="text-white/80 text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={cn(
                                    "w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all",
                                    plan.highlighted
                                        ? "bg-[#C9A227] text-black shadow-lg shadow-[#C9A227]/30"
                                        : "bg-white/10 text-white hover:bg-white/20"
                                )}
                            >
                                {plan.cta}
                            </motion.button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function TestimonialsSection() {
    return (
        <section id="testimonials" className="relative py-32 px-6 bg-[#0a0a0a]">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <span className="text-[#C9A227] text-sm font-bold uppercase tracking-[0.3em] mb-4 block">Témoignages</span>
                    <h2 className="text-4xl md:text-6xl font-serif font-semibold text-white mb-6">
                        Ils nous font confiance
                    </h2>
                </motion.div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {TESTIMONIALS.map((testimonial, idx) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#C9A227]/30 transition-all duration-500"
                        >
                            {/* Stars */}
                            <div className="flex gap-1 mb-6">
                                {Array.from({ length: testimonial.rating }).map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-[#C9A227] text-[#C9A227]" />
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-white/80 text-lg leading-relaxed mb-8 italic">
                                "{testimonial.quote}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4">
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.author}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-[#C9A227]/30"
                                />
                                <div>
                                    <div className="text-white font-semibold">{testimonial.author}</div>
                                    <div className="text-white/50 text-sm">{testimonial.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CTASection() {
    return (
        <section className="relative py-32 px-6 bg-[#0a0a0a] overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#C9A227]/10 via-transparent to-[#007AFF]/5" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-[#C9A227]/10 rounded-full blur-[150px]" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative z-10 max-w-4xl mx-auto text-center"
            >
                <h2 className="text-4xl md:text-6xl font-serif font-semibold text-white mb-6">
                    Prêt à transformer<br />votre établissement ?
                </h2>
                <p className="text-xl text-white/50 max-w-2xl mx-auto mb-12">
                    Rejoignez les restaurateurs visionnaires qui ont choisi l'excellence opérationnelle.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 0 60px rgba(201, 162, 39, 0.5)" }}
                        whileTap={{ scale: 0.98 }}
                        className="group px-10 py-5 bg-[#C9A227] text-black font-bold text-lg rounded-2xl shadow-xl shadow-[#C9A227]/30 flex items-center gap-3"
                    >
                        Commencer Maintenant
                        <Zap className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-10 py-5 text-white/80 font-bold text-lg flex items-center gap-3 hover:text-white transition-colors"
                    >
                        <Phone className="w-5 h-5" />
                        Parler à un Expert
                    </motion.button>
                </div>
            </motion.div>
        </section>
    );
}

function Footer() {
    return (
        <footer className="relative py-20 px-6 bg-[#050505] border-t border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9A227] to-[#8B7355] flex items-center justify-center">
                                <ChefHat className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-white font-serif text-xl font-semibold">Restaurant OS</span>
                        </div>
                        <p className="text-white/40 text-sm leading-relaxed mb-6">
                            L'intelligence exécutive pour restaurateurs visionnaires.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Produit</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Fonctionnalités</a></li>
                            <li><a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Tarifs</a></li>
                            <li><a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Intégrations</a></li>
                            <li><a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Changelog</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Ressources</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Documentation</a></li>
                            <li><a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Guides</a></li>
                            <li><a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Blog</a></li>
                            <li><a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Support</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Légal</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-white/40 hover:text-white text-sm transition-colors">CGV</a></li>
                            <li><a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Mentions légales</a></li>
                            <li><a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Confidentialité</a></li>
                            <li><a href="#" className="text-white/40 hover:text-white text-sm transition-colors">RGPD</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-white/30 text-sm">
                        © 2026 Restaurant OS. Tous droits réservés.
                    </p>
                    <p className="text-white/30 text-sm">
                        Fait avec ❤️ par des passionnés de gastronomie.
                    </p>
                </div>
            </div>
        </footer>
    );
}

// ============================================
// MAIN PAGE
// ============================================
export default function LandingPage() {
    return (
        <main className="bg-[#0a0a0a] min-h-screen overflow-x-hidden">
            <Navbar />
            <HeroSection />
            <FeaturesSection />
            <PricingSection />
            <TestimonialsSection />
            <CTASection />
            <Footer />
        </main>
    );
}
