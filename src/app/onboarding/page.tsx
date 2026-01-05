"use client";

import React, { useState } from "react";
import { useAuth, UserRole, ROLE_LABELS } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/button";
import {
    BookOpen,
    Sparkles,
    TrendingUp,
    Play,
    Leaf,
    Heart,
    Wine,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Award,
    Briefcase,
    Store,
    UserCheck,
    PenTool,
    User,
    FileText,
    ShieldCheck,
    Download,
    Mail,
    Phone,
    Building2,
    Key,
    Calendar,
    ArrowRight
} from "lucide-react";

type TabType = 'check-in' | 'training' | 'personal-space' | 'documents';

export default function OnboardingPage() {
    const { currentUser } = useAuth();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<TabType>('check-in');
    const [selectedPoste, setSelectedPoste] = useState<UserRole | null>(currentUser?.role || null);

    const stationChecklists: Record<string, string[]> = {
        'kitchen_chef': [
            'Vérification des températures frigos et enregistrement HACCP',
            'Briefing équipe de production (Mise en Place)',
            'Validation des stocks et commandes du jour',
            'Vérification de l\'état de propreté du poste',
            'Contrôle des DLC sur les préparations sensibles'
        ],
        'kitchen_line': [
            'Vérification de l\'équipement et du couteau de chef',
            'Lancement de la mise en place selon les fiches techniques',
            'Nettoyage et désinfection du plan de travail',
            'Vérification des stocks d\'épices et condiments'
        ],
        'server': [
            'Uniforme impeccable (Tablier, Veste, Chaussures)',
            'Briefing sur les suggestions et plats du jour',
            'Vérification du dressage des tables (Nappage, Couverts)',
            'Contrôle de la propreté de la zone de service',
            'Test des terminaux mobiles (POS)'
        ],
        'bartender': [
            'Mise en place de la glace et du bar à cocktails',
            'Vérification des stocks de verrerie propre',
            'Contrôle des pressions et fûts',
            'Préparation des garnitures fraîches du jour'
        ],
        'floor_manager': [
            'Revue du plan de salle et des réservations VIP',
            'Briefing brigade de salle sur les objectifs de vente',
            'Vérification de l\'ambiance (Lumière, Musique)',
            'Attribution des rangs et responsabilités'
        ],
        'host': [
            'Consultation du carnet de réservations',
            'Préparation des menus et des cartes des vins',
            'Vérification de l\'espace accueil / vestiaire',
            'Briefing sur les événements spéciaux du service'
        ]
    };

    const getChecklist = (role: string) => stationChecklists[role] || [
        'Vérification des équipements de sécurité',
        'Lecture des notes de service récentes',
        'Contrôle de l\'état général du poste',
        'Préparation du matériel nécessaire au service'
    ];

    return (
        <div className="flex flex-1 -m-8 flex-col bg-bg-primary min-h-screen overflow-hidden">
            {/* Header Area */}
            <div className="bg-white border-b border-border px-10 py-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-serif font-semibold text-text-primary tracking-tight">Prise de Poste & Excellence</h1>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                            <Sparkles strokeWidth={1.5} className="w-3.5 h-3.5 text-accent" />
                            Bonjour {currentUser?.name} • Vers l'excellence opérationnelle
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-right mr-4">
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Temps de Service</p>
                            <p className="text-sm font-mono font-medium text-text-primary mt-0.5">02h 14m</p>
                        </div>
                        <Button className="btn-elegant-primary h-12 px-8 shadow-lg shadow-accent/10">
                            Connecter le Service
                        </Button>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex items-center gap-2 mt-10">
                    {[
                        { id: 'check-in', label: 'Prise de Poste', icon: Briefcase },
                        { id: 'training', label: 'Formation & Culture', icon: BookOpen },
                        { id: 'personal-space', label: 'Mon Espace RH', icon: User },
                        { id: 'documents', label: 'Contrats & Paie', icon: FileText }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
                            className={cn(
                                "flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-[12px] uppercase tracking-wider transition-all duration-300",
                                activeTab === tab.id
                                    ? "bg-bg-tertiary text-accent border border-accent/20 shadow-sm"
                                    : "text-text-muted hover:text-text-primary hover:bg-bg-tertiary/10"
                            )}
                        >
                            <tab.icon strokeWidth={1.5} className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-auto p-12 elegant-scrollbar">
                {activeTab === 'check-in' && (
                    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Daily Vision & Briefing */}
                        <div className="bg-bg-tertiary/30 rounded-2xl border border-border p-8 flex items-start gap-8">
                            <div className="w-16 h-16 bg-white rounded-2xl border border-border flex items-center justify-center shrink-0 shadow-sm">
                                <Sparkles strokeWidth={1.5} className="w-8 h-8 text-accent" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-serif font-semibold text-text-primary tracking-tight mb-2">Vision du Jour : "L'Émotion par le Détail"</h3>
                                <p className="text-text-muted text-[14px] leading-relaxed italic">
                                    "Aujourd'hui, nous mettons l'accent sur la personnalisation de l'accueil. Chaque client doit se sentir reconnu. Notez que la suggestion du jour est le Turbot rôti au beurre noisette."
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-1">Météo Service</p>
                                <div className="flex items-center gap-2 justify-end">
                                    <TrendingUp strokeWidth={1.5} className="w-4 h-4 text-success" />
                                    <span className="font-mono font-medium text-text-primary">Intense (85 couv.)</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            {/* Poste Selection */}
                            <div className="lg:col-span-1 space-y-4">
                                <h3 className="text-xl font-serif font-semibold text-text-primary tracking-tight">Poste Actif</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {(Object.keys(stationChecklists) as UserRole[]).map((role) => (
                                        <button
                                            key={role}
                                            onClick={() => setSelectedPoste(role)}
                                            className={cn(
                                                "flex items-center justify-between p-5 rounded-xl border transition-all duration-300 text-left",
                                                selectedPoste === role
                                                    ? "bg-white border-accent shadow-xl shadow-accent/5 ring-1 ring-accent/20"
                                                    : "bg-white border-border hover:border-text-secondary/30 text-text-muted"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                                                    selectedPoste === role ? "bg-accent text-white" : "bg-bg-tertiary text-text-muted"
                                                )}>
                                                    <Briefcase strokeWidth={1.5} className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className={cn("font-bold text-[13px]", selectedPoste === role ? "text-text-primary" : "text-text-muted")}>
                                                        {ROLE_LABELS[role]}
                                                    </p>
                                                    <p className="text-[10px] uppercase tracking-widest opacity-60 mt-0.5">Station</p>
                                                </div>
                                            </div>
                                            {selectedPoste === role && <CheckCircle2 className="w-5 h-5 text-accent" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Checklist */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-serif font-semibold text-text-primary tracking-tight">Checklist de Mise en Place</h3>
                                    <span className="text-[10px] font-bold text-accent px-3 py-1 bg-accent/5 rounded-full border border-accent/10 uppercase tracking-widest">
                                        Préparation Requise
                                    </span>
                                </div>
                                <div className="bg-white rounded-2xl border border-border shadow-sm p-8 space-y-4">
                                    {getChecklist(selectedPoste || '').map((task, idx) => (
                                        <div key={idx} className="group flex items-start gap-4 p-4 rounded-xl hover:bg-bg-tertiary/20 cursor-pointer transition-all border border-transparent hover:border-border/50">
                                            <div className="w-6 h-6 rounded-lg border-2 border-border flex items-center justify-center group-hover:border-accent transition-colors shrink-0 mt-0.5">
                                                <CheckCircle2 strokeWidth={1.5} className="w-4 h-4 opacity-0 group-hover:opacity-20 text-accent" />
                                            </div>
                                            <div>
                                                <p className="text-[14px] font-medium text-text-primary leading-snug">{task}</p>
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <span className="text-[9px] text-text-muted font-bold uppercase tracking-widest flex items-center gap-1">
                                                        <Clock strokeWidth={1.5} className="w-3 h-3" />
                                                        Avant 11h30
                                                    </span>
                                                    <span className="w-1 h-1 bg-border rounded-full" />
                                                    <span className="text-[9px] text-accent font-bold uppercase tracking-widest">Standard Premium</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <Button className="w-full h-14 bg-text-primary hover:bg-black text-white rounded-xl font-bold text-[13px] uppercase tracking-[0.2em] shadow-xl shadow-text-primary/10 mt-6">
                                        Valider ma Prise de Poste
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Company Entry Requirements */}
                        <div className="bg-text-primary rounded-2xl p-10 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 -mr-32 -mt-32 rounded-full blur-3xl" />
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="max-w-xl">
                                    <h3 className="text-2xl font-serif font-medium mb-3">Accès Sécurisés</h3>
                                    <p className="text-white/60 text-sm leading-relaxed">
                                        Identifiants uniques pour l'ouverture de l'établissement et l'armement de la sécurité.
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 text-center w-32">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Entrée</p>
                                        <p className="text-2xl font-mono font-medium tracking-widest">8842</p>
                                    </div>
                                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 text-center w-32">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Alarme</p>
                                        <p className="text-2xl font-mono font-medium tracking-widest">1090</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'training' && (
                    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500">
                        {/* Brand DNA Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-4xl font-serif font-semibold text-text-primary tracking-tight leading-tight">
                                        L'Essence de notre <br /><span className="text-accent italic">Maison</span>
                                    </h2>
                                    <div className="w-20 h-1 bg-accent/20 mt-6" />
                                </div>
                                <p className="text-text-muted text-[16px] leading-relaxed">
                                    Bienvenue chez Restaurant OS. Plus qu'un établissement, nous sommes un laboratoire d'émotions culinaires.
                                    Notre mission est de sublimer le terroir à travers une approche moderne et durable.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {[
                                        { title: 'Excellence', desc: 'Le détail qui fait la perfection.', icon: Award },
                                        { title: 'Inclusion', desc: 'Une brigade unie et solidaire.', icon: Heart },
                                        { title: 'Durabilité', desc: 'Respect absolu du produit.', icon: Leaf },
                                        { title: 'Audace', desc: 'Oser réinventer les classiques.', icon: Sparkles }
                                    ].map((value, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-10 h-10 bg-bg-tertiary rounded-lg flex items-center justify-center shrink-0 border border-border/50">
                                                <value.icon strokeWidth={1.5} className="w-5 h-5 text-accent" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[13px] text-text-primary">{value.title}</h4>
                                                <p className="text-[11px] text-text-muted mt-0.5">{value.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative rounded-[2.5rem] overflow-hidden aspect-video bg-bg-tertiary group">
                                <img
                                    src="https://images.unsplash.com/photo-1550966841-3ee7adac1668?w=800&q=80"
                                    alt="Restaurant Interior"
                                    className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                    <button className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                        <Play fill="white" className="w-6 h-6 text-white ml-1" />
                                    </button>
                                </div>
                                <div className="absolute bottom-8 left-8 right-8">
                                    <p className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Film de Bienvenue</p>
                                    <h4 className="text-xl font-serif text-white mt-1">L'Histoire de la Maison</h4>
                                </div>
                            </div>
                        </div>

                        {/* Training Modules */}
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-serif font-semibold text-text-primary tracking-tight">Modules de Formation</h3>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Votre Progression :</span>
                                    <div className="w-48 h-1.5 bg-bg-tertiary rounded-full overflow-hidden border border-border/50">
                                        <div className="h-full bg-accent w-1/3" />
                                    </div>
                                    <span className="text-[11px] font-mono font-bold text-accent">34%</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[
                                    { title: 'Maîtrise du POS Royal', author: 'Service Client', duration: '12 min', status: 'Terminé', icon: Store },
                                    { title: 'Standard HACCP Cuisine', author: 'Chef Exécutif', duration: '25 min', status: 'En cours', icon: ShieldCheck },
                                    { title: 'Art de la Sommellerie', author: 'Chef Sommelier', duration: '18 min', status: 'Non commencé', icon: Wine },
                                    { title: 'Gestion des Allergènes', author: 'Qualité', duration: '15 min', status: 'Non commencé', icon: AlertTriangle },
                                    { title: 'Protocoles VIP', author: 'Direction', duration: '10 min', status: 'Non commencé', icon: UserCheck },
                                    { title: 'Techniques de Découpe', author: 'Sous-Chef', duration: '30 min', status: 'Non commencé', icon: PenTool }
                                ].map((module, i) => (
                                    <div key={i} className="group bg-white rounded-2xl border border-border p-6 hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500 cursor-pointer">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                                                module.status === 'Terminé' ? "bg-success/5 text-success border border-success/10" :
                                                    module.status === 'En cours' ? "bg-accent/5 text-accent border border-accent/10" : "bg-bg-tertiary text-text-muted border border-border/50"
                                            )}>
                                                <module.icon strokeWidth={1.5} className="w-6 h-6" />
                                            </div>
                                            <span className={cn(
                                                "text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full",
                                                module.status === 'Terminé' ? "bg-success/10 text-success" :
                                                    module.status === 'En cours' ? "bg-accent/10 text-accent" : "bg-bg-tertiary text-text-muted"
                                            )}>
                                                {module.status}
                                            </span>
                                        </div>
                                        <h4 className="text-[17px] font-serif font-semibold text-text-primary group-hover:text-accent transition-colors">{module.title}</h4>
                                        <p className="text-[11px] text-text-muted mt-1.5">{module.author}</p>
                                        <div className="flex items-center justify-between mt-6 pt-6 border-t border-border/50">
                                            <div className="flex items-center gap-2 text-text-muted">
                                                <Clock strokeWidth={1.5} className="w-3.5 h-3.5" />
                                                <span className="text-[11px] font-mono">{module.duration}</span>
                                            </div>
                                            <button className="flex items-center gap-1.5 text-[10px] font-bold text-accent uppercase tracking-widest group-hover:gap-3 transition-all">
                                                Démarrer <ArrowRight strokeWidth={2} className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Poste Intelligence */}
                        <div className="bg-bg-tertiary/20 rounded-3xl border border-border p-10 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-10 opacity-5">
                                <Briefcase strokeWidth={1} size={200} />
                            </div>
                            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-serif font-semibold text-text-primary tracking-tight">Intelligence du Poste</h3>
                                    <p className="text-text-muted text-sm leading-relaxed">
                                        Accédez aux guides techniques, fiches de matériel et protocoles spécifiques à votre station actuelle.
                                    </p>
                                    <Button variant="outline" className="h-11 rounded-xl border-border px-6 font-bold text-[11px] uppercase tracking-widest hover:bg-white">
                                        Manuel du Poste : {ROLE_LABELS[selectedPoste || 'server']}
                                    </Button>
                                </div>
                                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                                        <h5 className="text-[11px] font-bold text-text-primary uppercase tracking-widest mb-4">Équipements & Alertes</h5>
                                        <div className="space-y-3">
                                            {[
                                                { label: 'Réfrigérateur Tiroir #2', status: 'Stable', val: '3.4°C' },
                                                { label: 'Plaque Induction #4', status: 'Calibrée', val: 'OK' },
                                                { label: 'Lave-Verres Bar', status: 'Cycle OK', val: '72°C' }
                                            ].map((eq, i) => (
                                                <div key={i} className="flex justify-between items-center text-[12px]">
                                                    <span className="text-text-muted">{eq.label}</span>
                                                    <span className="font-mono text-success">{eq.val}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                                        <h5 className="text-[11px] font-bold text-text-primary uppercase tracking-widest mb-4">Contacts Équipe Directe</h5>
                                        <div className="flex -space-x-3 mb-4">
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-bg-tertiary flex items-center justify-center text-[10px] font-bold">
                                                    U{i}
                                                </div>
                                            ))}
                                        </div>
                                        <button className="text-[11px] font-bold text-accent uppercase tracking-widest flex items-center gap-2">
                                            Ouvrir la messagerie station <ArrowRight strokeWidth={2} className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'personal-space' && (
                    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Profile Info */}
                            <div className="md:col-span-1 space-y-6">
                                <div className="bg-white rounded-2xl p-8 border border-border shadow-sm text-center">
                                    <div className="w-24 h-24 rounded-[2rem] bg-accent/5 border-2 border-accent/20 flex items-center justify-center text-4xl text-accent font-serif mx-auto mb-6 shadow-inner">
                                        {currentUser?.name.charAt(0)}
                                    </div>
                                    <h2 className="text-2xl font-serif font-semibold text-text-primary">{currentUser?.name}</h2>
                                    <p className="text-[10px] font-bold text-accent uppercase tracking-widest mt-1 mb-8">{ROLE_LABELS[currentUser?.role || 'server']}</p>

                                    <div className="space-y-4 text-left border-t border-border pt-8">
                                        <div className="flex items-center gap-4 text-text-muted">
                                            <Mail strokeWidth={1.5} className="w-4 h-4" />
                                            <span className="text-sm font-medium">{currentUser?.name.toLowerCase().replace(' ', '.')}@restaurant.com</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-text-muted">
                                            <Phone strokeWidth={1.5} className="w-4 h-4" />
                                            <span className="text-sm font-medium">06 45 89 22 10</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-text-muted">
                                            <Building2 strokeWidth={1.5} className="w-4 h-4" />
                                            <span className="text-sm font-medium">Matricule : EMP-2024-089</span>
                                        </div>
                                    </div>

                                    <Button variant="outline" className="w-full h-12 rounded-xl border-border mt-8 font-bold text-[11px] uppercase tracking-widest hover:bg-bg-tertiary">
                                        Modifier mon profil
                                    </Button>
                                </div>

                                <div className="bg-text-primary rounded-2xl p-8 text-white shadow-xl shadow-text-primary/10">
                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-white/60">Sécurité & Accès</h4>
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 mb-3">
                                        <div className="flex items-center gap-3">
                                            <Key strokeWidth={1.5} className="w-4 h-4 text-accent" />
                                            <span className="text-sm font-medium">PIN Digital</span>
                                        </div>
                                        <span className="text-sm font-mono text-white/50">••••</span>
                                    </div>
                                    <Button className="w-full h-10 bg-accent hover:bg-accent/90 text-white rounded-lg font-bold text-[11px] uppercase tracking-widest transition-all">
                                        Changer mon PIN
                                    </Button>
                                </div>
                            </div>

                            {/* Activity & Stats */}
                            <div className="md:col-span-2 space-y-8">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-white p-8 rounded-2xl border border-border shadow-sm group hover:border-accent transition-all duration-300">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 bg-bg-tertiary rounded-xl flex items-center justify-center border border-border group-hover:bg-accent group-hover:text-white transition-all">
                                                <Calendar strokeWidth={1.5} className="w-6 h-6" />
                                            </div>
                                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Prochain Shift</span>
                                        </div>
                                        <p className="text-2xl font-serif font-semibold text-text-primary group-hover:text-accent transition-colors">Demain, 11h30</p>
                                        <p className="text-[12px] text-text-muted mt-2 font-medium">Service Déjeuner • Rang A</p>
                                    </div>
                                    <div className="bg-white p-8 rounded-2xl border border-border shadow-sm group hover:border-success transition-all duration-300">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 bg-bg-tertiary rounded-xl flex items-center justify-center border border-border group-hover:bg-success group-hover:text-white transition-all">
                                                <Clock strokeWidth={1.5} className="w-6 h-6" />
                                            </div>
                                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Heures Ce Mois</span>
                                        </div>
                                        <p className="text-2xl font-serif font-semibold text-text-primary group-hover:text-success transition-colors">156.4 Heures</p>
                                        <p className="text-[12px] text-text-muted mt-2 font-medium">Objectif 160h • 98%</p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                                    <div className="p-8 border-b border-border flex items-center justify-between">
                                        <h3 className="text-xl font-serif font-semibold text-text-primary tracking-tight">Historique de Présence</h3>
                                        <Button variant="ghost" className="text-[11px] font-bold text-accent uppercase tracking-widest hover:bg-bg-tertiary">Voir tout</Button>
                                    </div>
                                    <div className="divide-y divide-border">
                                        {[
                                            { date: 'Aujourd\'hui', checkIn: '09:00', checkOut: '--:--', type: 'Service Matin', status: 'En cours' },
                                            { date: 'Hier', checkIn: '10:15', checkOut: '17:45', type: 'Service Continu', status: 'Validé' },
                                            { date: '2 Jan', checkIn: '18:00', checkOut: '00:30', type: 'Service Soir', status: 'Validé' },
                                            { date: '1 Jan', checkIn: '--:--', checkOut: '--:--', type: 'Repos Hebdomadaire', status: 'Repos' }
                                        ].map((shift, i) => (
                                            <div key={i} className="p-6 flex items-center justify-between hover:bg-bg-tertiary/20 transition-all">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-14 h-14 bg-bg-tertiary rounded-xl flex flex-col items-center justify-center border border-border text-center">
                                                        <span className="text-[10px] font-bold uppercase text-text-muted leading-tight">{shift.date}</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-[14px] text-text-primary">{shift.type}</p>
                                                        <p className="text-[11px] text-text-muted font-mono mt-1">{shift.checkIn} — {shift.checkOut}</p>
                                                    </div>
                                                </div>
                                                <span className={cn(
                                                    "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-current/10",
                                                    shift.status === 'En cours' ? "bg-accent/10 text-accent" :
                                                        shift.status === 'Repos' ? "bg-text-muted/10 text-text-muted" : "bg-success/10 text-success"
                                                )}>
                                                    {shift.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'documents' && (
                    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
                        <div className="flex items-center justify-between bg-white p-8 rounded-[2rem] border border-border shadow-sm border-l-4 border-l-accent">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-accent/5 rounded-2xl flex items-center justify-center">
                                    <ShieldCheck strokeWidth={1.5} className="w-8 h-8 text-accent" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-serif font-semibold text-text-primary">Espace Documentaire Sécurisé</h3>
                                    <p className="text-text-muted text-sm mt-1">Vos documents personnels sont chiffrés et accessibles uniquement par vous et les RH.</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Payroll Section */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-[11px] font-bold text-text-primary uppercase tracking-[0.2em]">Bulletins de Salaire</h3>
                                    <div className="h-px flex-1 bg-border" />
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { title: 'Fiche de Paie - Décembre 2024', size: '2.4 MB', date: '01/01/2025' },
                                        { title: 'Fiche de Paie - Novembre 2024', size: '2.4 MB', date: '01/12/2024' },
                                        { title: 'Fiche de Paie - Octobre 2024', size: '2.4 MB', date: '01/11/2024' }
                                    ].map((doc, i) => (
                                        <div key={i} className="group bg-white p-6 rounded-2xl border border-border shadow-sm hover:shadow-xl transition-all duration-300 flex items-center justify-between">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 bg-bg-tertiary rounded-xl flex items-center justify-center text-text-muted group-hover:bg-accent/10 group-hover:text-accent transition-all">
                                                    <FileText strokeWidth={1.5} className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[14px] text-text-primary group-hover:text-accent transition-colors">{doc.title}</p>
                                                    <p className="text-[11px] text-text-muted font-mono mt-1">{doc.date} • {doc.size}</p>
                                                </div>
                                            </div>
                                            <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-muted hover:bg-accent hover:border-accent hover:text-white transition-all">
                                                <Download strokeWidth={1.5} className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Contracts & Legal Section */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-[11px] font-bold text-text-primary uppercase tracking-[0.2em]">Contrats & Légal</h3>
                                    <div className="h-px flex-1 bg-border" />
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { title: 'Contrat de Travail Initial', size: '4.8 MB', date: '15/05/2023', icon: PenTool, status: 'Signé' },
                                        { title: 'Avenant de Promotion', size: '1.2 MB', date: '10/10/2024', icon: ArrowRight, status: 'Signé' },
                                        { title: 'Règlement Intérieur', size: '3.5 MB', date: '15/05/2023', icon: Building2, status: 'Lecture OK' }
                                    ].map((doc, i) => (
                                        <div key={i} className="group bg-white p-6 rounded-2xl border border-border shadow-sm hover:shadow-xl transition-all duration-300 flex items-center justify-between">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 bg-bg-tertiary rounded-xl flex items-center justify-center text-text-muted group-hover:bg-white transition-all shadow-inner">
                                                    <doc.icon strokeWidth={1.5} className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[14px] text-text-primary">{doc.title}</p>
                                                    <div className="flex gap-3 mt-1.5">
                                                        <span className="text-[11px] text-success font-bold uppercase tracking-widest">{doc.status}</span>
                                                        <span className="text-[11px] text-text-muted font-mono">{doc.date}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-muted hover:bg-text-primary hover:border-text-primary hover:text-white transition-all">
                                                <Download strokeWidth={1.5} className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-8 bg-bg-tertiary/40 border-2 border-dashed border-border rounded-[2.5rem] text-center">
                                    <p className="text-text-muted text-[13px] font-medium leading-relaxed">
                                        Besoin d'un document spécifique ? <br />
                                        Contactez le service RH via la messagerie interne.
                                    </p>
                                    <Button variant="outline" className="h-11 px-6 rounded-xl border-border mt-6 font-bold text-[11px] uppercase tracking-widest hover:bg-bg-tertiary">
                                        Message RH
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
