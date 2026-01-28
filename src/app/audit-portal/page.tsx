"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    Zap,
    Cpu,
    Layers,
    Code2,
    Globe,
    Cpu as AiIcon,
    TrendingUp,
    BookOpen,
    Copy,
    CheckCircle2,
    ArrowRight,
    ChevronDown,
    ExternalLink,
    Lock,
    Eye,
    Star,
    Sparkles,
    AlertTriangle,
    Clock,
    LucideIcon
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

// --- Types & Data ---

interface AuditSection {
    id: string;
    title: string;
    icon: LucideIcon;
    color: string;
    description: string;
    axes: {
        id: string;
        title: string;
        problem: string;
        prompt: string;
    }[];
}

const AUDIT_DATA: AuditSection[] = [
    {
        id: 'architecture',
        title: 'Architecture Système',
        icon: Layers,
        color: '#8B5CF6',
        description: 'Refonte structurelle pour une scalabilité industrielle et une maintenance simplifiée.',
        axes: [
            {
                id: 'A1.1',
                title: 'Feature-Sliced Design',
                problem: 'Couplage fort et dispersion de la logique métier.',
                prompt: `Restructure le projet en architecture Feature-Sliced :
src/features/
├── reservations/
│   ├── components/      # UI spécifique réservations
│   ├── hooks/           # useReservationLogic, useTableAvailability
│   ├── services/        # ReservationService.ts (accès Dexie)
│   ├── types.ts         # Types locaux
│   └── index.ts         # Exports publics
├── kitchen/
├── pos/
├── crm/
└── shared/              # Composants vraiment transverses`
            },
            {
                id: 'A1.2',
                title: 'Consolidation des Contextes',
                problem: 'Context Hell (17 providers) impactant les performances.',
                prompt: `Fusionne les contextes par domaine métier :
1. OperationsStore = Orders + Tables + Reservations
2. KitchenStore = Recipe + Inventory + HACCP + Prep
3. StaffStore = Planning + Leaves + Management
4. FinanceStore = Accounting + Finance + PMS
5. SystemStore = Settings + UI + Notifications + Tutorial
6. IntelligenceStore = AI + Analytics
Utilise Zustand avec le pattern "slice" pour éviter les re-renders massifs.`
            }
        ]
    },
    {
        id: 'performance',
        title: 'Performance & Bundle',
        icon: Zap,
        color: '#F59E0B',
        description: 'Optimisation de la vitesse de chargement et de la fluidité runtime.',
        axes: [
            {
                id: 'A3.1',
                title: 'Code Splitting Agressif',
                problem: 'Bundle initial trop lourd, chargement de modules inutiles.',
                prompt: `Applique dynamic import sur tous les composants lourds :
// pages/floor-plan/page.tsx
const FloorPlanEditor = dynamic(
  () => import('@/components/floor-plan/FloorPlanEditor'),
  { loading: () => <FloorPlanSkeleton />, ssr: false }
);
Cibles prioritaires : FloorPlanEditor, RecipeEditorDialog, tous les *Settings.tsx`
            },
            {
                id: 'A3.2',
                title: 'Virtualisation des Listes',
                problem: 'Lenteur d\'affichage sur les grands volumes de données.',
                prompt: `Utilise le hook useVirtualizedList existant sur :
1. Liste des réservations (1000+ entrées)
2. Historique CRM (500+ clients)
3. Inventaire (2000+ produits)
4. Logs HACCP (10000+ relevés)
Si pas assez performant, migre vers @tanstack/react-virtual.`
            }
        ]
    },
    {
        id: 'ai',
        title: 'Intelligence Artificielle',
        icon: AiIcon,
        color: '#10B981',
        description: 'Passage d\'un assistant passif à une couche de décision proactive.',
        axes: [
            {
                id: 'A6.1',
                title: 'Menu Engineering IA',
                problem: 'Analyses de rentabilité manuelles et statiques.',
                prompt: `Utilise Gemini pour analyser automatiquement :
1. Matrice BCG des plats (Stars, Vaches à lait, Dilemmes, Poids morts)
2. Suggestions de prix basées sur le food cost et la popularité
3. Recommandations de mise en avant (menu du jour)
4. Alertes sur les plats à supprimer (low margin + low sales)
Affiche un dashboard "Menu Intelligence" avec actions en un clic.`
            },
            {
                id: 'A6.4',
                title: 'Assistant Vocal HACCP',
                problem: 'Contraintes d\'hygiène lors de la saisie manuelle en cuisine.',
                prompt: `Permets la saisie vocale des relevés HACCP :
1. "Frigo 2, température 4 degrés, OK"
2. "Réception marchandise Metro, conforme"
3. "Alerte : température chambre froide à 8 degrés"
Utilise Web Speech API + Gemini pour le parsing.
Mains libres = hygiène préservée en cuisine.`
            }
        ]
    },
    {
        id: 'security',
        title: 'Sécurité & Conformité',
        icon: Shield,
        color: '#EF4444',
        description: 'Protection des données sensibles et respect des normes fiscales.',
        axes: [
            {
                id: 'A4.4',
                title: 'Conformité NF525',
                problem: 'Absence de scellement des transactions (obligatoire en France).',
                prompt: `Pour la certification NF525 :
1. Implémenter un journal des transactions inaltérable (append-only)
2. Générer un hash chaîné pour chaque ticket (blockchain simplifiée)
3. Exporter les données au format FEC (Fichier des Écritures Comptables)
4. Ajouter un mode "Z de caisse" avec clôture journalière
5. Conserver les données 6 ans minimum`
            }
        ]
    }
];

// --- Sub-components ---

const CinematicCard = ({ section, isExpanded, onToggle }: { section: AuditSection, isExpanded: boolean, onToggle: () => void }) => {
    const { showToast } = useToast();

    const copyPrompt = (prompt: string, id: string) => {
        navigator.clipboard.writeText(prompt);
        showToast(`Prompt ${id} copié !`, "success");
    };

    return (
        <motion.div
            layout
            className={cn(
                "bg-bg-secondary border border-border/40 rounded-[3.5rem] overflow-hidden transition-all duration-700",
                isExpanded ? "ring-2 ring-border shadow-2xl" : "hover:bg-bg-tertiary/50"
            )}
        >
            <div
                className="p-10 cursor-pointer flex items-center justify-between"
                onClick={onToggle}
            >
                <div className="flex items-center gap-10">
                    <div
                        className="w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl relative overflow-hidden"
                        style={{ backgroundColor: `${section.color}15` }}
                    >
                        <section.icon className="w-10 h-10 relative z-10" style={{ color: section.color }} />
                        <div className="absolute inset-0 bg-gradient-to-br from-text-primary/10 to-transparent opacity-20" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-serif italic text-text-primary tracking-tight mb-2">{section.title}</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted/40">{section.axes.length} Axes Stratégiques</p>
                    </div>
                </div>
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <ChevronDown className="w-6 h-6 text-text-muted/30" />
                </motion.div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-10 pb-10 border-t border-border/20"
                    >
                        <div className="pt-10 space-y-8">
                            <p className="text-sm text-text-muted italic leading-relaxed max-w-2xl">
                                {section.description}
                            </p>

                            <div className="grid gap-6">
                                {section.axes.map((axis) => (
                                    <div key={axis.id} className="p-8 bg-bg-primary/50 rounded-[2.5rem] border border-border/20 group hover:border-accent-gold/20 transition-all">
                                        <div className="flex items-start justify-between mb-6">
                                            <div>
                                                <div className="flex items-center gap-4 mb-3">
                                                    <span className="text-[10px] font-mono font-black text-accent-gold/60">{axis.id}</span>
                                                    <h4 className="text-xl font-serif italic text-text-primary">{axis.title}</h4>
                                                </div>
                                                <p className="text-xs text-text-muted font-medium uppercase tracking-widest flex items-center gap-3">
                                                    <AlertTriangle className="w-4 h-4 text-error/40" />
                                                    {axis.problem}
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => copyPrompt(axis.prompt, axis.id)}
                                                className="w-12 h-12 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary shadow-soft border border-border/50"
                                            >
                                                <Copy className="w-4 h-4 text-accent-gold/60" />
                                            </Button>
                                        </div>
                                        <div className="relative group/prompt overflow-hidden rounded-2xl bg-black/5 dark:bg-black/40 p-6 border border-border/10">
                                            <pre className="text-[11px] font-mono leading-relaxed text-text-muted/80 whitespace-pre-wrap">
                                                {axis.prompt}
                                            </pre>
                                            <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary/40 to-transparent pointer-events-none" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// --- Main Component ---

export default function AuditPortal() {
    const [expandedSection, setExpandedSection] = useState<string | null>('architecture');

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary px-4 md:px-12 py-20 elegant-scrollbar relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent-gold/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Hero Section */}
                <header className="mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center text-center space-y-8"
                    >
                        <div className="inline-flex items-center gap-4 px-6 py-2 bg-accent-gold/10 border border-accent-gold/20 rounded-full">
                            <Sparkles className="w-4 h-4 text-accent-gold" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-gold">Excellence Hub</span>
                        </div>
                        <h1 className="text-7xl md:text-9xl font-serif italic tracking-tighter leading-[0.8] mb-4">
                            L'Audit <br />
                            <span className="text-text-muted/20 font-light not-italic">Suprême</span>
                        </h1>
                        <p className="max-w-2xl text-lg text-text-muted/60 italic font-light leading-relaxed">
                            Transformer Restaurant OS en une plateforme industrielle à 300€/mois.
                            Le blueprint stratégique pour l'excellence opérationnelle et technologique.
                        </p>
                    </motion.div>
                </header>

                {/* Metrics Grid */}
                <section className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-32">
                    {[
                        { label: 'LOC Mastered', value: '62K', sub: '+242 Files', icon: Code2 },
                        { label: 'Active Modules', value: '33', sub: 'Production Ready', icon: Layers },
                        { label: 'Integrations', value: '24', sub: 'Npm Ecosystem', icon: Cpu },
                        { label: 'Trust Margin', value: '7.2', sub: 'Audit Score / 10', icon: Shield, isGold: true },
                    ].map((metric, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + (i * 0.1) }}
                            className="bg-bg-secondary p-10 rounded-[3rem] border border-border/40 text-center relative overflow-hidden group hover:border-accent-gold/20 transition-all duration-500"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-text-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <metric.icon className="w-8 h-8 mx-auto mb-6 text-text-muted/20" />
                            <p className="text-5xl font-serif italic mb-2 tracking-tighter" style={{ color: metric.isGold ? '#C5A059' : undefined }}>{metric.value}</p>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted/40">{metric.label}</p>
                                <p className="text-[10px] font-bold text-text-muted/60 lowercase italic">{metric.sub}</p>
                            </div>
                        </motion.div>
                    ))}
                </section>

                {/* Main Improvement Axes */}
                <section className="space-y-12 mb-32">
                    <div className="flex items-end justify-between mb-16 px-4">
                        <div className="space-y-4">
                            <h2 className="text-6xl font-serif italic tracking-tight">Axes de Transformation</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted/30">9 Dimensions • 45+ Améliorations Spécifiques</p>
                        </div>
                        <div className="hidden md:flex gap-4">
                            <Button variant="outline" className="h-14 rounded-2xl bg-bg-secondary border-border text-[10px] font-black uppercase tracking-[0.2em] px-10 text-text-muted/50">
                                EXPORTER PDF
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-10">
                        {AUDIT_DATA.map((section) => (
                            <CinematicCard
                                key={section.id}
                                section={section}
                                isExpanded={expandedSection === section.id}
                                onToggle={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                            />
                        ))}
                    </div>
                </section>

                {/* Transformation Roadmap */}
                <section className="mb-32">
                    <div className="bg-bg-secondary rounded-[4.5rem] p-16 border border-border/40 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-gold/20 blur-[150px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />

                        <div className="mb-20 text-center space-y-4">
                            <h2 className="text-6xl font-serif italic tracking-tight">Vecteur 12 Semaines</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted/30">Le Déploiement de la Révolution Opérationnelle</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                            {[
                                {
                                    phase: 'Phase Alpha',
                                    title: 'Stabilisation',
                                    week: '1-4',
                                    tasks: ['Setup Vitest & Playwright', 'Tests hooks critiques', 'Refactoring LOC > 700', 'CI/CD Pipeline']
                                },
                                {
                                    phase: 'Phase Beta',
                                    title: 'Optimisation',
                                    week: '5-8',
                                    tasks: ['Consolidation Contextes', 'Code Splitting', 'Virtualisation', 'Performance Assets']
                                },
                                {
                                    phase: 'Phase Gamma',
                                    title: 'Expansion',
                                    week: '9-12',
                                    tasks: ['Multi-Tenant Architecture', 'Conformité NF525', 'Licensing System', 'Intelligence IA']
                                },
                            ].map((p, i) => (
                                <div key={i} className="space-y-8 p-10 bg-bg-primary/40 rounded-[3rem] border border-border/20 backdrop-blur-xl relative group">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-gold">{p.phase}</span>
                                        <span className="text-[10px] font-mono font-bold text-text-muted/40 italic">S{p.week}</span>
                                    </div>
                                    <h4 className="text-3xl font-serif italic text-text-primary leading-none">{p.title}</h4>
                                    <ul className="space-y-4">
                                        {p.tasks.map((t, j) => (
                                            <li key={j} className="flex items-center gap-4 text-sm text-text-muted/60 font-medium tracking-tight">
                                                <div className="w-2 h-2 rounded-full bg-accent-gold/20 group-hover:bg-accent-gold/60 transition-colors" />
                                                {t}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Call to Action / Footer */}
                <footer className="text-center pb-20">
                    <motion.div
                        whileInView={{ opacity: 1, scale: 1 }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        className="p-20 bg-text-primary rounded-[5rem] text-bg-primary shadow-2xl relative overflow-hidden group"
                    >
                        <AlertTriangle className="w-16 h-16 mx-auto mb-10 opacity-20" />
                        <h2 className="text-6xl font-serif italic mb-8 tracking-tighter">Prêt pour la Révolution ?</h2>
                        <p className="max-w-xl mx-auto text-lg opacity-60 italic mb-12">
                            L'excellence n'est pas un acte, c'est une habitude. Commencez la transformation aujourd'hui en activant le premier bloc d'audit.
                        </p>
                        <div className="flex flex-col md:flex-row gap-6 justify-center">
                            <Button className="h-20 px-16 rounded-[2rem] bg-accent-gold hover:bg-accent-gold/90 text-bg-primary text-sm font-black uppercase tracking-widest shadow-2xl transition-all hover:scale-105">
                                Démarrer Phase Alpha
                                <ArrowRight className="w-5 h-5 ml-4" />
                            </Button>
                            <Button variant="outline" className="h-20 px-14 rounded-[2rem] border-white/20 hover:bg-white/10 text-white text-sm font-black uppercase tracking-widest transition-all">
                                Télécharger le Plan stratégique
                            </Button>
                        </div>

                        {/* Visual Glow Decorations */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full translate-x-1/2 translate-y-1/2" />
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 blur-[120px] rounded-full -translate-x-1/3 translate-y-1/3" />
                    </motion.div>
                </footer>
            </div>
        </div>
    );
}
