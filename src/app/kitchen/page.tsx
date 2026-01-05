"use client";

import { useState } from "react";
import {
    Utensils,
    ClipboardList,
    BookOpen,
    Trash2,
    ChevronRight,
    ChefHat,
    Clock,
    CheckCircle2,
    AlertTriangle,
    Search,
    Book,
    History,
    FileText,
    ArrowRight,
    Calculator,
    Truck,
    Leaf,
    Timer,
    TrendingUp,
    PercentCircle,
    Package,
    ShieldAlert,
    X,
    Users,
    Thermometer,
    Scale,
    Play,
    Pause,
    RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRecipes } from "@/context/RecipeContext";
import { useManagement } from "@/context/ManagementContext";
import { useInventory } from "@/context/InventoryContext";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils";

type KitchenTab = 'mise-en-place' | 'recipes' | 'waste' | 'margins' | 'suppliers' | 'allergens' | 'cooking-times';

export default function KitchenPage() {
    const [activeTab, setActiveTab] = useState<KitchenTab>('mise-en-place');
    const { prepTasks, togglePrepTask, recipes, miseEnPlaceTarget } = useRecipes();
    const { addWasteLog, wasteLogs } = useManagement();
    const { ingredients } = useInventory();
    const { showToast } = useToast();
    const [searchQuery, setSearchQuery] = useState("");

    const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
    const [selectedPrepTask, setSelectedPrepTask] = useState<any>(null);

    const filteredRecipes = recipes.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleWasteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, we'd have a form state here
        showToast("Perte enregistrée avec succès", "success");
    };

    return (
        <div className="flex flex-1 -m-8 bg-bg-primary overflow-hidden min-h-screen">
            {/* Left Sidebar - Sub Navigation */}
            <div className="w-80 bg-white border-r border-border flex flex-col p-8 elegant-scrollbar">
                <div className="mb-10">
                    <h1 className="text-2xl font-serif font-semibold text-text-primary tracking-tight">Gestion Cuisine</h1>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mt-2">
                        Opérations & Production
                    </p>
                </div>

                <nav className="space-y-1.5 flex-1">
                    <button
                        onClick={() => setActiveTab('mise-en-place')}
                        className={cn(
                            "w-full flex items-center gap-4 px-5 py-4 rounded-xl font-bold text-[13px] transition-all duration-300",
                            activeTab === 'mise-en-place'
                                ? "bg-bg-tertiary text-accent shadow-sm border border-border/50"
                                : "text-text-muted hover:text-text-primary hover:bg-bg-tertiary/20"
                        )}
                    >
                        <Utensils strokeWidth={1.5} className={cn("w-5 h-5", activeTab === 'mise-en-place' ? "text-accent" : "text-text-muted")} />
                        Mise en Place
                    </button>
                    <button
                        onClick={() => setActiveTab('recipes')}
                        className={cn(
                            "w-full flex items-center gap-4 px-5 py-4 rounded-xl font-bold text-[13px] transition-all duration-300",
                            activeTab === 'recipes'
                                ? "bg-bg-tertiary text-accent shadow-sm border border-border/50"
                                : "text-text-muted hover:text-text-primary hover:bg-bg-tertiary/20"
                        )}
                    >
                        <BookOpen strokeWidth={1.5} className={cn("w-5 h-5", activeTab === 'recipes' ? "text-accent" : "text-text-muted")} />
                        Livre de Recettes
                    </button>
                    <button
                        onClick={() => setActiveTab('margins')}
                        className={cn(
                            "w-full flex items-center gap-4 px-5 py-4 rounded-xl font-bold text-[13px] transition-all duration-300",
                            activeTab === 'margins'
                                ? "bg-bg-tertiary text-accent shadow-sm border border-border/50"
                                : "text-text-muted hover:text-text-primary hover:bg-bg-tertiary/20"
                        )}
                    >
                        <Calculator strokeWidth={1.5} className={cn("w-5 h-5", activeTab === 'margins' ? "text-accent" : "text-text-muted")} />
                        Marges & Rentabilité
                    </button>
                    <button
                        onClick={() => setActiveTab('waste')}
                        className={cn(
                            "w-full flex items-center gap-4 px-5 py-4 rounded-xl font-bold text-[13px] transition-all duration-300",
                            activeTab === 'waste'
                                ? "bg-bg-tertiary text-accent shadow-sm border border-border/50"
                                : "text-text-muted hover:text-text-primary hover:bg-bg-tertiary/20"
                        )}
                    >
                        <Trash2 strokeWidth={1.5} className={cn("w-5 h-5", activeTab === 'waste' ? "text-accent" : "text-text-muted")} />
                        Gaspillage & Pertes
                    </button>
                    <button
                        onClick={() => setActiveTab('suppliers')}
                        className={cn(
                            "w-full flex items-center gap-4 px-5 py-4 rounded-xl font-bold text-[13px] transition-all duration-300",
                            activeTab === 'suppliers'
                                ? "bg-bg-tertiary text-accent shadow-sm border border-border/50"
                                : "text-text-muted hover:text-text-primary hover:bg-bg-tertiary/20"
                        )}
                    >
                        <Truck strokeWidth={1.5} className={cn("w-5 h-5", activeTab === 'suppliers' ? "text-accent" : "text-text-muted")} />
                        Fiches Fournisseurs
                    </button>
                    <button
                        onClick={() => setActiveTab('allergens')}
                        className={cn(
                            "w-full flex items-center gap-4 px-5 py-4 rounded-xl font-bold text-[13px] transition-all duration-300",
                            activeTab === 'allergens'
                                ? "bg-bg-tertiary text-accent shadow-sm border border-border/50"
                                : "text-text-muted hover:text-text-primary hover:bg-bg-tertiary/20"
                        )}
                    >
                        <ShieldAlert strokeWidth={1.5} className={cn("w-5 h-5", activeTab === 'allergens' ? "text-accent" : "text-text-muted")} />
                        Allergènes & Régimes
                    </button>
                    <button
                        onClick={() => setActiveTab('cooking-times')}
                        className={cn(
                            "w-full flex items-center gap-4 px-5 py-4 rounded-xl font-bold text-[13px] transition-all duration-300",
                            activeTab === 'cooking-times'
                                ? "bg-bg-tertiary text-accent shadow-sm border border-border/50"
                                : "text-text-muted hover:text-text-primary hover:bg-bg-tertiary/20"
                        )}
                    >
                        <Timer strokeWidth={1.5} className={cn("w-5 h-5", activeTab === 'cooking-times' ? "text-accent" : "text-text-muted")} />
                        Temps de Cuisson
                    </button>
                </nav>

                <div className="p-6 bg-bg-tertiary/40 rounded-xl border border-border/50 mt-10">
                    <div className="flex items-center gap-3 mb-3">
                        <ChefHat strokeWidth={1.5} className="w-4 h-4 text-accent" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-primary">Objectif Prep</span>
                    </div>
                    <p className="text-[12px] text-text-muted leading-relaxed font-medium">
                        Basé sur <span className="text-text-primary font-bold">{Object.keys(miseEnPlaceTarget).length} articles</span> pour les services à venir.
                    </p>
                </div>
            </div>

            {/* Main Workspace */}
            <div className="flex-1 overflow-auto p-12 elegant-scrollbar">
                {activeTab === 'mise-en-place' && (
                    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-3xl font-serif font-semibold text-text-primary tracking-tight">Mise en Place du Jour</h2>
                                <p className="text-text-muted text-[13px] mt-2 font-medium">Tâches de production calculées selon les prévisions de réservations</p>
                            </div>
                            <div className="bg-success-soft px-5 py-2.5 rounded-xl border border-success/10">
                                <span className="text-success font-bold text-[11px] uppercase tracking-wider">
                                    {prepTasks.filter(t => t.isCompleted).length} / {prepTasks.length} Tâches Terminer
                                </span>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            {prepTasks.map(task => (
                                <div
                                    key={task.id}
                                    className={cn(
                                        "group flex items-center justify-between p-6 rounded-xl border transition-all duration-300 cursor-pointer",
                                        task.isCompleted
                                            ? "bg-bg-tertiary/20 border-border/50"
                                            : "bg-white border-border hover:border-accent/40 shadow-sm hover:shadow-xl group"
                                    )}
                                >
                                    <div className="flex items-center gap-6" onClick={(e) => { e.stopPropagation(); togglePrepTask(task.id); }}>
                                        <div className={cn(
                                            "w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-500",
                                            task.isCompleted ? "bg-success border-success" : "border-border hover:border-accent group-hover:border-accent"
                                        )}>
                                            {task.isCompleted && <CheckCircle2 strokeWidth={2.5} className="w-4 h-4 text-white" />}
                                        </div>
                                        <div>
                                            <h4 className={cn("font-serif font-semibold text-xl transition-all", task.isCompleted ? "text-text-muted line-through" : "text-text-primary group-hover:text-accent")}>
                                                {task.name}
                                            </h4>
                                            <div className="flex items-center gap-4 mt-2 text-text-muted text-[10px] font-bold uppercase tracking-widest">
                                                <span className="bg-bg-tertiary px-2.5 py-1 rounded border border-border/40 text-text-primary font-mono">{task.quantity} {task.unit}</span>
                                                <span className="flex items-center gap-2">
                                                    <Clock strokeWidth={1.5} className="w-3.5 h-3.5" />
                                                    Objectif 18:30
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedPrepTask(task)}
                                        className="w-11 h-11 rounded-lg bg-bg-tertiary/50 hover:bg-accent hover:text-white flex items-center justify-center transition-all duration-300"
                                    >
                                        <ArrowRight strokeWidth={1.5} className={cn(
                                            "w-5 h-5 transition-all",
                                            task.isCompleted ? "text-success" : "text-text-muted"
                                        )} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'recipes' && (
                    <div className="animate-in fade-in duration-500">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-3xl font-serif font-semibold text-text-primary tracking-tight">Livre de Recettes & Fiches</h2>
                                <p className="text-text-muted text-[13px] mt-2 font-medium">Le savoir-faire de votre établissement, centralisé et sécurisé.</p>
                            </div>
                            <div className="relative w-80">
                                <Search strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                <input
                                    type="text"
                                    placeholder="Rechercher une fiche..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="input-elegant w-full h-12 pl-11 pr-4"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredRecipes.map(recipe => (
                                <div
                                    key={recipe.id}
                                    onClick={() => setSelectedRecipe(recipe)}
                                    className="group bg-white rounded-xl p-8 border border-border shadow-sm hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500 cursor-pointer relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-1.5 h-full opacity-40 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: recipe.color }} />
                                    <div className="flex items-start justify-between mb-8 pl-2">
                                        <div>
                                            <h3 className="font-serif font-semibold text-2xl text-text-primary tracking-tight group-hover:text-accent transition-colors">{recipe.name}</h3>
                                            <p className="text-text-muted text-[10px] font-bold uppercase tracking-[0.2em] mt-2 font-mono">
                                                {recipe.prepTime} MIN PREP • 4 ITEMS
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 rounded-lg bg-bg-tertiary flex items-center justify-center group-hover:bg-accent transition-all duration-300">
                                            <Book strokeWidth={1.5} className="w-6 h-6 text-text-primary group-hover:text-white transition-colors" />
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 px-4 py-2 bg-warning-soft rounded-lg border border-warning/10">
                                            <AlertTriangle strokeWidth={1.5} className="w-4 h-4 text-warning" />
                                            <span className="text-[11px] font-bold text-warning uppercase tracking-wider">Allergènes Présents</span>
                                        </div>
                                        <Button className="w-full h-12 bg-bg-tertiary/50 hover:bg-accent text-text-primary hover:text-white rounded-lg font-bold text-[11px] uppercase tracking-widest border border-border/50 group-hover:border-accent transition-all duration-300">
                                            Détails Techniques
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'waste' && (
                    <div className="max-w-4xl animate-in fade-in duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            {/* Waste Form */}
                            <div className="lg:col-span-8 space-y-8">
                                <div className="bg-white rounded-xl p-8 border border-border shadow-sm">
                                    <h3 className="text-xl font-serif font-semibold text-text-primary mb-8 tracking-tight">Déclarer une Perte</h3>
                                    <form onSubmit={handleWasteSubmit} className="space-y-8">
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold uppercase text-text-muted tracking-[0.2em] ml-1">Article</label>
                                                <select className="input-elegant w-full h-12 px-4">
                                                    <option>Sélectionner...</option>
                                                    {ingredients.map(i => <option key={i.id}>{i.name}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold uppercase text-text-muted tracking-[0.2em] ml-1">Quantité</label>
                                                <div className="flex gap-2">
                                                    <input type="number" placeholder="0.0" className="input-elegant flex-1 h-12 px-4 font-mono" />
                                                    <div className="w-16 h-12 bg-bg-tertiary rounded-lg flex items-center justify-center font-bold text-text-muted text-[11px] border border-border/50 uppercase tracking-widest">KG</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-bold uppercase text-text-muted tracking-[0.2em] ml-1">Motif de la Saisie</label>
                                            <div className="grid grid-cols-4 gap-4">
                                                {['Plat Erreur', 'DLC Passée', 'Abîmé', 'Surplus'].map(reason => (
                                                    <button type="button" key={reason} className="h-12 border border-border bg-bg-tertiary/20 hover:bg-bg-tertiary hover:border-accent/40 rounded-lg font-bold text-[11px] uppercase tracking-widest text-text-muted hover:text-text-primary transition-all">
                                                        {reason}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <Button className="btn-elegant-primary w-full h-14 text-white rounded-xl font-bold text-[14px] shadow-lg shadow-accent/10">
                                            Enregistrer la Perte
                                        </Button>
                                    </form>
                                </div>
                            </div>

                            {/* Recent Waste Feed */}
                            <div className="lg:col-span-4 space-y-8">
                                <h3 className="text-[10px] font-bold text-text-primary uppercase tracking-[0.2em]">Pertes Récentes</h3>
                                <div className="space-y-4">
                                    {wasteLogs.length === 0 ? (
                                        <div className="p-10 border border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center opacity-40">
                                            <History strokeWidth={1.5} className="w-8 h-8 mb-4 text-text-muted" />
                                            <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted">Aucune sortie</p>
                                        </div>
                                    ) : (
                                        wasteLogs.map(log => (
                                            <div key={log.id} className="bg-white p-5 rounded-xl border border-border shadow-sm flex items-center gap-5 group hover:border-error/40 transition-all duration-300">
                                                <div className="w-10 h-10 rounded-lg bg-error-soft flex items-center justify-center">
                                                    <Trash2 strokeWidth={1.5} className="w-5 h-5 text-error" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-serif font-semibold text-text-primary text-[15px]">{log.name}</p>
                                                    <p className="text-[12px] text-error font-mono font-bold mt-0.5">-{formatCurrency(log.cost)}</p>
                                                </div>
                                                <span className="text-[10px] font-bold text-text-muted font-mono tracking-tighter">14:20</span>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="p-8 bg-text-primary rounded-xl text-white shadow-xl shadow-text-primary/10">
                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-white/60">Impact Financier</h4>
                                    <div className="text-3xl font-mono font-medium text-error">-{formatCurrency(124.50)}</div>
                                    <p className="text-[11px] text-white/40 mt-4 leading-relaxed">Ce mois-ci, les pertes représentent <span className="text-error font-bold tracking-tight">2.4%</span> de votre volume d'affaires total.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Margins Tab - Calcul de Marge */}
                {activeTab === 'margins' && (
                    <div className="max-w-6xl animate-in fade-in duration-500">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-3xl font-serif font-semibold text-text-primary tracking-tight">Analyse des Marges</h2>
                                <p className="text-text-muted text-[13px] mt-2 font-medium">Rentabilité détaillée par plat et optimisation du coût matière</p>
                            </div>
                        </div>

                        {/* KPI Cards */}
                        <div className="grid grid-cols-4 gap-6 mb-10">
                            <div className="bg-white rounded-xl p-8 border border-border shadow-sm group hover:shadow-xl transition-all duration-500">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-success-soft rounded-lg flex items-center justify-center border border-success/10 group-hover:bg-success group-hover:text-white transition-all duration-300">
                                        <TrendingUp strokeWidth={1.5} className="w-6 h-6 text-success group-hover:text-white" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase text-text-muted tracking-[0.2em]">Marge Moyenne</span>
                                </div>
                                <div className="text-4xl font-mono font-medium text-text-primary tracking-tight group-hover:text-accent transition-colors">72%</div>
                                <p className="text-[11px] text-success font-bold mt-3 flex items-center gap-1.5">
                                    <ArrowRight strokeWidth={2} className="w-3 h-3 -rotate-45" />
                                    +3.2% vs mois dernier
                                </p>
                            </div>
                            <div className="bg-white rounded-xl p-8 border border-border shadow-sm group hover:shadow-xl transition-all duration-500">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-accent/5 rounded-lg flex items-center justify-center border border-accent/10 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                                        <Package strokeWidth={1.5} className="w-6 h-6 text-accent group-hover:text-white" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase text-text-muted tracking-[0.2em]">Coût Matière Total</span>
                                </div>
                                <div className="text-4xl font-mono font-medium text-text-primary tracking-tight group-hover:text-accent transition-colors">28.4%</div>
                                <p className="text-[11px] text-text-muted font-bold mt-3 uppercase tracking-widest">Objectif : &lt;30%</p>
                            </div>
                            <div className="bg-white rounded-xl p-8 border border-border shadow-sm group hover:shadow-xl transition-all duration-500">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-error-soft rounded-lg flex items-center justify-center border border-error/10 group-hover:bg-error group-hover:text-white transition-all duration-300">
                                        <AlertTriangle strokeWidth={1.5} className="w-6 h-6 text-error group-hover:text-white" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase text-text-muted tracking-[0.2em]">Risque Profit</span>
                                </div>
                                <div className="text-3xl font-mono font-medium text-error tracking-tight">3 PLATS</div>
                                <p className="text-[11px] text-text-muted font-bold mt-3 uppercase tracking-widest">Marge critique &lt;50%</p>
                            </div>
                            <div className="bg-white rounded-xl p-8 border border-border shadow-sm group hover:shadow-xl transition-all duration-500">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-bg-tertiary rounded-lg flex items-center justify-center border border-border/50 group-hover:bg-text-primary group-hover:text-white transition-all duration-300">
                                        <Calculator strokeWidth={1.5} className="w-6 h-6 text-text-primary group-hover:text-white" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase text-text-muted tracking-[0.2em]">Recettes Actives</span>
                                </div>
                                <div className="text-4xl font-mono font-medium text-text-primary tracking-tight group-hover:text-accent transition-colors">{recipes.length}</div>
                                <p className="text-[11px] text-text-muted font-bold mt-3 uppercase tracking-widest">Fiches validées</p>
                            </div>
                        </div>

                        {/* Recipes Margin Table */}
                        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-border/50 bg-white flex items-center justify-between">
                                <h3 className="text-xl font-serif font-semibold text-text-primary">Performance par Recette</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Trier par :</span>
                                    <button className="text-[10px] font-bold text-accent uppercase tracking-widest border-b border-accent">Marge Décroissante</button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-bg-tertiary/20 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] border-b border-border/50">
                                            <th className="text-left px-10 py-5">Désignation du Plat</th>
                                            <th className="text-right px-8 py-5">Prix Vente</th>
                                            <th className="text-right px-8 py-5">Coût Mat.</th>
                                            <th className="text-right px-8 py-5">Marge Totale</th>
                                            <th className="text-right px-8 py-5">% Marge</th>
                                            <th className="text-center px-10 py-5">Évaluation</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/30">
                                        {recipes.map((recipe, idx) => {
                                            const sellPrice = 18.50 + idx * 3;
                                            const costPrice = 4.25 + idx * 0.8;
                                            const margin = sellPrice - costPrice;
                                            const marginPercent = (margin / sellPrice) * 100;
                                            const status = marginPercent >= 70 ? 'excellent' : marginPercent >= 50 ? 'good' : 'warning';
                                            return (
                                                <tr key={recipe.id} className="group hover:bg-bg-tertiary/20 transition-all duration-300">
                                                    <td className="px-10 py-6">
                                                        <div className="flex items-center gap-5">
                                                            <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: recipe.color }} />
                                                            <div>
                                                                <p className="font-serif font-semibold text-text-primary text-[15px] group-hover:text-accent transition-colors">{recipe.name}</p>
                                                                <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mt-1.5">{recipe.prepTime} min production</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-right font-mono font-medium text-[14px] text-text-primary">{formatCurrency(sellPrice)}</td>
                                                    <td className="px-8 py-6 text-right font-mono text-text-muted text-[13px]">{formatCurrency(costPrice)}</td>
                                                    <td className="px-8 py-6 text-right font-mono font-bold text-success text-[15px]">{formatCurrency(margin)}</td>
                                                    <td className="px-8 py-6 text-right">
                                                        <span className={cn(
                                                            "font-mono font-bold text-[14px]",
                                                            status === 'excellent' ? 'text-success' : status === 'good' ? 'text-warning' : 'text-error'
                                                        )}>
                                                            {marginPercent.toFixed(1)}%
                                                        </span>
                                                    </td>
                                                    <td className="px-10 py-6 text-center">
                                                        <span className={cn(
                                                            "px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border border-current/10",
                                                            status === 'excellent' ? 'bg-success-soft text-success' : status === 'good' ? 'bg-warning-soft text-warning' : 'bg-error-soft text-error'
                                                        )}>
                                                            {status === 'excellent' ? 'Excellent' : status === 'good' ? 'Performance OK' : 'Sous Observation'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Suppliers Tab */}
                {activeTab === 'suppliers' && (
                    <div className="max-w-6xl animate-in fade-in duration-500">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-3xl font-serif font-semibold text-text-primary tracking-tight">Réseau Fournisseurs</h2>
                                <p className="text-text-muted text-[13px] mt-2 font-medium">Gestion du catalogue partenaires et pilotage de la chaîne logistique</p>
                            </div>
                            <Button className="btn-elegant-primary h-12 px-8 shadow-lg shadow-accent/10">
                                <Truck strokeWidth={1.5} className="w-4 h-4 mr-3" />
                                Nouveau Partenaire
                            </Button>
                        </div>

                        <div className="grid grid-cols-3 gap-8">
                            {[
                                { name: 'Rungis Express', category: 'Fruits & Légumes', contact: '01 45 67 89 00', email: 'contact@rungis.fr', rating: 4.8, color: '#00D764' },
                                { name: 'Boucherie Dupont', category: 'Viandes d\'Origine', contact: '01 23 45 67 89', email: 'pro@dupont.fr', rating: 4.5, color: '#FF4D4D' },
                                { name: 'Marée Fraîche', category: 'Poissons & Crustacés', contact: '01 98 76 54 32', email: 'commande@maree.fr', rating: 4.9, color: '#007AFF' },
                                { name: 'Laiterie Bio', category: 'Produits Laitiers', contact: '01 11 22 33 44', email: 'bio@laiterie.fr', rating: 4.3, color: '#FF9500' },
                                { name: 'Épicerie Fine', category: 'Épicerie & Condiments', contact: '01 55 66 77 88', email: 'fine@epicerie.fr', rating: 4.7, color: '#9B59B6' },
                                { name: 'Caves du Terroir', category: 'Vins & Spiritueux', contact: '01 99 88 77 66', email: 'caves@terroir.fr', rating: 4.6, color: '#1A1A1A' },
                            ].map((supplier, idx) => (
                                <div key={idx} className="group bg-white rounded-xl p-8 border border-border shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-bg-tertiary -mr-12 -mt-12 rounded-full opacity-50 group-hover:scale-150 transition-all duration-700" />
                                    <div className="flex items-start justify-between mb-8 relative z-10">
                                        <div className="w-14 h-14 rounded-lg flex items-center justify-center border border-border bg-bg-tertiary group-hover:bg-accent group-hover:text-white transition-all duration-300 shadow-inner">
                                            <Truck strokeWidth={1.5} className="w-7 h-7" style={{ color: supplier.color }} />
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-white shadow-xl shadow-accent/20">
                                            <span className="text-[12px]">★</span>
                                            <span className="text-[11px] font-mono leading-none">{supplier.rating}</span>
                                        </div>
                                    </div>
                                    <h3 className="font-serif font-semibold text-xl text-text-primary mb-2 group-hover:text-accent transition-colors">{supplier.name}</h3>
                                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-8">{supplier.category}</p>
                                    <div className="space-y-4 text-[13px] relative z-10">
                                        <div className="flex items-center gap-3 text-text-muted group-hover:text-text-primary transition-colors">
                                            <span className="opacity-60">📞</span>
                                            <span className="font-medium tracking-tight">{supplier.contact}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-text-muted group-hover:text-text-primary transition-colors">
                                            <span className="opacity-60">✉️</span>
                                            <span className="font-medium tracking-tight break-all">{supplier.email}</span>
                                        </div>
                                    </div>
                                    <Button className="w-full mt-8 h-12 bg-bg-tertiary hover:bg-accent text-text-primary hover:text-white rounded-lg font-bold text-[11px] uppercase tracking-widest transition-all duration-300 border border-border/50 group-hover:border-accent">
                                        Catalogue & Tarifs
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Allergens Tab */}
                {activeTab === 'allergens' && (
                    <div className="max-w-5xl animate-in fade-in duration-500">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-[#1A1A1A]">Allergènes & Régimes</h2>
                                <p className="text-[#6C757D] text-sm mt-1">Conformité réglementaire et information client</p>
                            </div>
                        </div>

                        {/* Allergen Categories */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {[
                                { name: 'Gluten', count: 12, icon: '🌾', color: '#FF9500' },
                                { name: 'Lactose', count: 8, icon: '🥛', color: '#007AFF' },
                                { name: 'Œufs', count: 6, icon: '🥚', color: '#FFD700' },
                                { name: 'Fruits à coque', count: 4, icon: '🥜', color: '#8B4513' },
                                { name: 'Crustacés', count: 3, icon: '🦐', color: '#FF4D4D' },
                                { name: 'Poisson', count: 5, icon: '🐟', color: '#007AFF' },
                                { name: 'Soja', count: 2, icon: '🫘', color: '#00D764' },
                                { name: 'Céleri', count: 7, icon: '🥬', color: '#00D764' },
                            ].map((allergen, idx) => (
                                <div key={idx} className="bg-white rounded-2xl p-4 border border-[#E9ECEF] shadow-sm hover:shadow-md transition-all cursor-pointer">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">{allergen.icon}</span>
                                        <span className="font-bold text-sm text-[#1A1A1A]">{allergen.name}</span>
                                    </div>
                                    <p className="text-[11px] text-[#ADB5BD]">{allergen.count} plats concernés</p>
                                </div>
                            ))}
                        </div>

                        {/* Dietary Options */}
                        <div className="bg-white rounded-3xl p-6 border border-[#E9ECEF] shadow-sm">
                            <h3 className="font-black text-lg text-[#1A1A1A] mb-6">Options Régimes Alimentaires</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { name: 'Végétarien', count: 15, icon: '🥗', color: '#00D764' },
                                    { name: 'Végan', count: 8, icon: '🌱', color: '#00D764' },
                                    { name: 'Sans Gluten', count: 12, icon: '🚫🌾', color: '#FF9500' },
                                    { name: 'Sans Lactose', count: 10, icon: '🚫🥛', color: '#007AFF' },
                                    { name: 'Halal', count: 6, icon: '☪️', color: '#00D764' },
                                    { name: 'Casher', count: 4, icon: '✡️', color: '#007AFF' },
                                ].map((diet, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">{diet.icon}</span>
                                            <span className="font-bold text-sm text-[#1A1A1A]">{diet.name}</span>
                                        </div>
                                        <span className="bg-white px-3 py-1 rounded-lg text-[11px] font-black text-[#1A1A1A]">{diet.count} plats</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Cooking Times Tab */}
                {activeTab === 'cooking-times' && (
                    <div className="max-w-5xl animate-in fade-in duration-500">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-[#1A1A1A]">Temps de Cuisson</h2>
                                <p className="text-[#6C757D] text-sm mt-1">Référentiel des temps de cuisson standards</p>
                            </div>
                            <Button className="h-12 bg-[#1A1A1A] hover:bg-black text-white px-6 rounded-xl font-bold">
                                + Ajouter Référence
                            </Button>
                        </div>

                        {/* Cooking Categories */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Viandes */}
                            <div className="bg-white rounded-3xl p-6 border border-[#E9ECEF] shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-[#FEECEC] rounded-xl flex items-center justify-center">
                                        <span className="text-xl">🥩</span>
                                    </div>
                                    <h3 className="font-black text-lg text-[#1A1A1A]">Viandes</h3>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { name: 'Filet de bœuf (saignant)', temp: '54°C', time: '3-4 min/côté' },
                                        { name: 'Filet de bœuf (à point)', temp: '60°C', time: '5-6 min/côté' },
                                        { name: 'Magret de canard', temp: '58°C', time: '8 min peau' },
                                        { name: 'Côte de veau', temp: '62°C', time: '7-8 min/côté' },
                                        { name: 'Poulet rôti', temp: '74°C', time: '45-50 min' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between py-3 border-b border-[#F1F3F5] last:border-0">
                                            <span className="font-bold text-sm text-[#1A1A1A]">{item.name}</span>
                                            <div className="flex items-center gap-3">
                                                <span className="bg-[#FEECEC] px-2 py-1 rounded-lg text-[10px] font-black text-[#FF4D4D]">{item.temp}</span>
                                                <span className="text-[11px] font-bold text-[#6C757D]">{item.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Poissons */}
                            <div className="bg-white rounded-3xl p-6 border border-[#E9ECEF] shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-[#E8F4FD] rounded-xl flex items-center justify-center">
                                        <span className="text-xl">🐟</span>
                                    </div>
                                    <h3 className="font-black text-lg text-[#1A1A1A]">Poissons & Fruits de mer</h3>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { name: 'Saumon (mi-cuit)', temp: '52°C', time: '4-5 min' },
                                        { name: 'Cabillaud', temp: '60°C', time: '8-10 min' },
                                        { name: 'Saint-Jacques', temp: '55°C', time: '2 min/côté' },
                                        { name: 'Homard', temp: '62°C', time: '12-15 min' },
                                        { name: 'Sole meunière', temp: '58°C', time: '3-4 min/côté' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between py-3 border-b border-[#F1F3F5] last:border-0">
                                            <span className="font-bold text-sm text-[#1A1A1A]">{item.name}</span>
                                            <div className="flex items-center gap-3">
                                                <span className="bg-[#E8F4FD] px-2 py-1 rounded-lg text-[10px] font-black text-[#007AFF]">{item.temp}</span>
                                                <span className="text-[11px] font-bold text-[#6C757D]">{item.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Légumes */}
                            <div className="bg-white rounded-3xl p-6 border border-[#E9ECEF] shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-[#E6F9EF] rounded-xl flex items-center justify-center">
                                        <span className="text-xl">🥦</span>
                                    </div>
                                    <h3 className="font-black text-lg text-[#1A1A1A]">Légumes</h3>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { name: 'Asperges vertes', temp: '95°C', time: '3-4 min (blanchi)' },
                                        { name: 'Haricots verts', temp: '95°C', time: '5-6 min' },
                                        { name: 'Pommes de terre rissolées', temp: '180°C', time: '20-25 min' },
                                        { name: 'Carottes glacées', temp: '100°C', time: '15 min' },
                                        { name: 'Champignons poêlés', temp: '200°C', time: '4-5 min' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between py-3 border-b border-[#F1F3F5] last:border-0">
                                            <span className="font-bold text-sm text-[#1A1A1A]">{item.name}</span>
                                            <div className="flex items-center gap-3">
                                                <span className="bg-[#E6F9EF] px-2 py-1 rounded-lg text-[10px] font-black text-[#00D764]">{item.temp}</span>
                                                <span className="text-[11px] font-bold text-[#6C757D]">{item.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pâtes & Féculents */}
                            <div className="bg-white rounded-3xl p-6 border border-[#E9ECEF] shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-[#FFF3E6] rounded-xl flex items-center justify-center">
                                        <span className="text-xl">🍝</span>
                                    </div>
                                    <h3 className="font-black text-lg text-[#1A1A1A]">Pâtes & Féculents</h3>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { name: 'Spaghetti al dente', temp: '100°C', time: '8-9 min' },
                                        { name: 'Risotto', temp: '90°C', time: '18-20 min' },
                                        { name: 'Riz basmati', temp: '100°C', time: '12 min' },
                                        { name: 'Gnocchis frais', temp: '100°C', time: '3-4 min' },
                                        { name: 'Polenta crémeuse', temp: '85°C', time: '25-30 min' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between py-3 border-b border-[#F1F3F5] last:border-0">
                                            <span className="font-bold text-sm text-[#1A1A1A]">{item.name}</span>
                                            <div className="flex items-center gap-3">
                                                <span className="bg-[#FFF3E6] px-2 py-1 rounded-lg text-[10px] font-black text-[#FF9500]">{item.temp}</span>
                                                <span className="text-[11px] font-bold text-[#6C757D]">{item.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Recipe Modal Overlay */}
            {selectedRecipe && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-[#1A1A1A]/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col">
                        <div className="relative h-64 bg-neutral-200">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-8 left-8">
                                <div className="bg-[#00D764] px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest mb-3 inline-block">Fiche Technique Premium</div>
                                <h1 className="text-4xl font-black text-white tracking-tight">{selectedRecipe.name}</h1>
                            </div>
                            <button
                                onClick={() => setSelectedRecipe(null)}
                                className="absolute top-8 right-8 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center transition-all text-white"
                            >
                                <ChevronRight className="w-6 h-6 rotate-90" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto p-12">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-sm font-black uppercase tracking-widest text-[#1A1A1A] mb-4">Ingrédients</h3>
                                        <div className="space-y-3">
                                            {selectedRecipe.ingredients?.map((ing: any, i: number) => (
                                                <div key={i} className="flex items-center justify-between py-2 border-b border-[#F1F3F5]">
                                                    <span className="text-sm font-bold text-[#6C757D]">{ingredients.find(item => item.id === ing.ingredientId)?.name}</span>
                                                    <span className="text-sm font-black text-[#1A1A1A]">{ing.quantity} {ingredients.find(item => item.id === ing.ingredientId)?.unit}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-6 bg-[#E6F9EF] rounded-2xl border border-[#00D764]/20">
                                        <h4 className="text-[11px] font-black uppercase text-[#00D764] mb-2 tracking-widest">Coût Portion</h4>
                                        <div className="text-2xl font-black text-[#1A1A1A]">{formatCurrency(4.25)}</div>
                                        <p className="text-[10px] text-[#6C757D] mt-1">Marge brute: 78%</p>
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-8">
                                    <div>
                                        <h3 className="text-sm font-black uppercase tracking-widest text-[#1A1A1A] mb-4">Préparation</h3>
                                        <div className="space-y-6">
                                            {selectedRecipe.recipeSteps?.map((step: any) => (
                                                <div key={step.order} className="flex gap-6">
                                                    <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] text-white flex items-center justify-center font-black shrink-0">{step.order}</div>
                                                    <div>
                                                        <p className="text-[#1A1A1A] font-bold leading-relaxed">{step.instruction}</p>
                                                        {step.duration && <span className="text-[10px] font-black text-[#ADB5BD] uppercase mt-1 inline-block">{step.duration} MINUTES</span>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-[#F8F9FA] border-t border-[#E9ECEF] flex justify-between items-center">
                            <div className="flex gap-4">
                                <Button variant="outline" className="rounded-xl font-bold h-12 border-[#DEE2E6]">
                                    <FileText className="w-4 h-4 mr-2" /> Imprimer Fiche
                                </Button>
                            </div>
                            <Button className="h-12 bg-[#1A1A1A] hover:bg-black text-white px-8 rounded-xl font-bold">
                                Marquer comme Lu par l'équipe
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Prep Task Detail Modal */}
            {selectedPrepTask && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-[#1A1A1A]/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="relative bg-gradient-to-r from-[#1A1A1A] to-[#2D2D2D] p-8">
                            <button
                                onClick={() => setSelectedPrepTask(null)}
                                className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center transition-all text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-[#00D764] flex items-center justify-center">
                                    <Utensils className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="bg-[#00D764] px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                                            Mise en Place
                                        </span>
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                            selectedPrepTask.isCompleted ? "bg-[#E6F9EF] text-[#00D764]" : "bg-[#FFF3E6] text-[#FF9500]"
                                        )}>
                                            {selectedPrepTask.isCompleted ? "Terminé" : "En cours"}
                                        </span>
                                    </div>
                                    <h1 className="text-3xl font-black text-white tracking-tight">{selectedPrepTask.name}</h1>
                                </div>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-auto p-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Left Column - Details */}
                                <div className="space-y-6">
                                    {/* Quantity Card */}
                                    <div className="bg-[#F8F9FA] rounded-2xl p-5 border border-[#E9ECEF]">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Scale className="w-5 h-5 text-[#00D764]" />
                                            <span className="text-[10px] font-black uppercase text-[#ADB5BD] tracking-widest">Quantité Requise</span>
                                        </div>
                                        <div className="text-3xl font-black text-[#1A1A1A]">
                                            {selectedPrepTask.quantity} <span className="text-lg text-[#6C757D]">{selectedPrepTask.unit}</span>
                                        </div>
                                    </div>

                                    {/* Time Card */}
                                    <div className="bg-[#F8F9FA] rounded-2xl p-5 border border-[#E9ECEF]">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Clock className="w-5 h-5 text-[#FF9500]" />
                                            <span className="text-[10px] font-black uppercase text-[#ADB5BD] tracking-widest">Échéance</span>
                                        </div>
                                        <div className="text-xl font-black text-[#1A1A1A]">18:30</div>
                                        <p className="text-[11px] text-[#6C757D] mt-1">Service du soir</p>
                                    </div>

                                    {/* Temperature Card (if applicable) */}
                                    <div className="bg-[#F8F9FA] rounded-2xl p-5 border border-[#E9ECEF]">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Thermometer className="w-5 h-5 text-[#FF4D4D]" />
                                            <span className="text-[10px] font-black uppercase text-[#ADB5BD] tracking-widest">Température</span>
                                        </div>
                                        <div className="text-xl font-black text-[#1A1A1A]">4°C - 8°C</div>
                                        <p className="text-[11px] text-[#6C757D] mt-1">Conservation réfrigérée</p>
                                    </div>

                                    {/* Assigned Staff */}
                                    <div className="bg-[#F8F9FA] rounded-2xl p-5 border border-[#E9ECEF]">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Users className="w-5 h-5 text-[#007AFF]" />
                                            <span className="text-[10px] font-black uppercase text-[#ADB5BD] tracking-widest">Assigné à</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-xs font-bold">JB</div>
                                            <span className="font-bold text-sm text-[#1A1A1A]">Jean Bon</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Steps */}
                                <div className="md:col-span-2 space-y-6">
                                    <div>
                                        <h3 className="text-sm font-black uppercase tracking-widest text-[#1A1A1A] mb-4">Étapes de Préparation</h3>
                                        <div className="space-y-4">
                                            {[
                                                { step: 1, instruction: "Rassembler tous les ingrédients nécessaires", duration: "2 min", done: true },
                                                { step: 2, instruction: "Vérifier la fraîcheur et la qualité des produits", duration: "3 min", done: true },
                                                { step: 3, instruction: "Préparer le plan de travail et les ustensiles", duration: "5 min", done: false },
                                                { step: 4, instruction: "Suivre la fiche technique associée", duration: "15 min", done: false },
                                                { step: 5, instruction: "Portionner selon les quantités requises", duration: "10 min", done: false },
                                                { step: 6, instruction: "Étiqueter et stocker correctement", duration: "5 min", done: false },
                                            ].map((item) => (
                                                <div
                                                    key={item.step}
                                                    className={cn(
                                                        "flex items-start gap-4 p-4 rounded-xl border-2 transition-all",
                                                        item.done ? "bg-[#E6F9EF]/50 border-[#00D764]/20" : "bg-white border-[#E9ECEF]"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shrink-0",
                                                        item.done ? "bg-[#00D764] text-white" : "bg-[#F8F9FA] text-[#1A1A1A]"
                                                    )}>
                                                        {item.done ? <CheckCircle2 className="w-4 h-4" /> : item.step}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className={cn(
                                                            "font-bold text-sm",
                                                            item.done ? "text-[#00D764] line-through" : "text-[#1A1A1A]"
                                                        )}>
                                                            {item.instruction}
                                                        </p>
                                                        <span className="text-[10px] font-bold text-[#ADB5BD] uppercase mt-1 inline-block">
                                                            ⏱️ {item.duration}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Notes Section */}
                                    <div className="bg-[#FFF3E6] rounded-2xl p-5 border border-[#FF9500]/20">
                                        <div className="flex items-center gap-3 mb-3">
                                            <AlertTriangle className="w-5 h-5 text-[#FF9500]" />
                                            <span className="text-[10px] font-black uppercase text-[#FF9500] tracking-widest">Points d'attention</span>
                                        </div>
                                        <ul className="space-y-2 text-sm text-[#6C757D]">
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#FF9500]">•</span>
                                                Respecter scrupuleusement la chaîne du froid
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#FF9500]">•</span>
                                                Vérifier les DLC avant utilisation
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#FF9500]">•</span>
                                                Signaler toute anomalie au chef
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 bg-[#F8F9FA] border-t border-[#E9ECEF] flex justify-between items-center">
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="rounded-xl font-bold h-11 border-[#DEE2E6]"
                                    onClick={() => setSelectedPrepTask(null)}
                                >
                                    Fermer
                                </Button>
                                <Button variant="outline" className="rounded-xl font-bold h-11 border-[#DEE2E6]">
                                    <FileText className="w-4 h-4 mr-2" /> Voir Fiche Technique
                                </Button>
                            </div>
                            <Button
                                className={cn(
                                    "h-11 px-6 rounded-xl font-bold transition-all",
                                    selectedPrepTask.isCompleted
                                        ? "bg-[#6C757D] hover:bg-[#495057] text-white"
                                        : "bg-[#00D764] hover:bg-[#00C058] text-white shadow-lg shadow-[#00D764]/20"
                                )}
                                onClick={() => {
                                    togglePrepTask(selectedPrepTask.id);
                                    setSelectedPrepTask({ ...selectedPrepTask, isCompleted: !selectedPrepTask.isCompleted });
                                }}
                            >
                                {selectedPrepTask.isCompleted ? (
                                    <>
                                        <RotateCcw className="w-4 h-4 mr-2" /> Marquer non terminé
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-4 h-4 mr-2" /> Marquer comme terminé
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
