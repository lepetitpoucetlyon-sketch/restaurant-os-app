"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Clock, DollarSign, Users, AlertTriangle, Save, ChefHat, CheckCircle2, Play, Timer, UtensilsCrossed, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRecipes } from "@/context/RecipeContext";
import { Recipe, RecipeIngredient, RecipeStep } from "@/types";
import { useToast } from "@/components/ui/Toast";
import { Modal } from "@/components/ui/Modal";
import { motion, AnimatePresence } from "framer-motion";
import { PremiumSelect } from "@/components/ui/PremiumSelect";

interface RecipeEditorDialogProps {
    isOpen: boolean;
    onClose: () => void;
    recipe?: Recipe; // If provided, we're editing. Otherwise creating.
}

const CATEGORIES = ['Entrée', 'Plat Principal', 'Dessert', 'Accompagnement', 'Sauce', 'Base'];
const ALLERGENS = ['Gluten', 'Lactose', 'Oeufs', 'Poisson', 'Crustacés', 'Arachides', 'Fruits à coque', 'Soja', 'Céleri', 'Moutarde', 'Sésame', 'Sulfites'];
const DIETARY = ['Végétarien', 'Végan', 'Sans Gluten', 'Halal', 'Casher'];
const COLORS = ['#1A1A1A', '#8B0000', '#C5A059', '#4285F4', '#8B5CF6', '#FF9900', '#E4405F', '#722F37'];

export function RecipeEditorDialog({ isOpen, onClose, recipe }: RecipeEditorDialogProps) {
    const { showToast } = useToast();
    const { addRecipe, updateRecipe } = useRecipes();

    const [formData, setFormData] = useState<Partial<Recipe>>({
        name: '',
        category: 'Plat Principal',
        description: '',
        prepTime: 15,
        cookTime: 20,
        portions: 4,
        difficulty: 'medium',
        ingredients: [],
        steps: [],
        allergens: [],
        dietaryInfo: [],
        costPrice: 0,
        sellingPrice: 0,
        color: '#1A1A1A',
        isActive: true,
    });

    const [activeTab, setActiveTab] = useState<'basics' | 'ingredients' | 'steps' | 'pricing'>('basics');

    useEffect(() => {
        if (recipe && isOpen) {
            setFormData({
                ...recipe,
                ingredients: recipe.ingredients || [],
                steps: recipe.steps || [],
            });
        } else if (!recipe && isOpen) {
            setFormData({
                name: '',
                category: 'Plat Principal',
                description: '',
                prepTime: 15,
                cookTime: 20,
                portions: 4,
                difficulty: 'medium',
                ingredients: [],
                steps: [],
                allergens: [],
                dietaryInfo: [],
                costPrice: 0,
                sellingPrice: 0,
                color: '#1A1A1A',
                isActive: true,
            });
        }
    }, [recipe, isOpen]);

    const [newIngredient, setNewIngredient] = useState<Partial<RecipeIngredient>>({
        name: '', quantity: 0, unit: 'g', cost: 0
    });

    const [newStep, setNewStep] = useState<Partial<RecipeStep>>({
        instruction: '', duration: 5, imageUrl: '', videoUrl: '', tip: ''
    });

    const handleAddIngredient = () => {
        if (!newIngredient.name) return;
        const ingredient: RecipeIngredient = {
            id: `ing_${Date.now()}`,
            name: newIngredient.name!,
            quantity: newIngredient.quantity || 0,
            unit: newIngredient.unit || 'g',
            cost: newIngredient.cost || 0,
        };
        setFormData(prev => ({
            ...prev,
            ingredients: [...(prev.ingredients || []), ingredient],
            costPrice: (prev.costPrice || 0) + ingredient.cost,
        }));
        setNewIngredient({ name: '', quantity: 0, unit: 'g', cost: 0 });
    };

    const handleRemoveIngredient = (id: string) => {
        const ingredient = formData.ingredients?.find(i => i.id === id);
        setFormData(prev => ({
            ...prev,
            ingredients: (prev.ingredients || []).filter(i => i.id !== id),
            costPrice: (prev.costPrice || 0) - (ingredient?.cost || 0),
        }));
    };

    const handleAddStep = () => {
        if (!newStep.instruction) return;
        const step: RecipeStep = {
            order: (formData.steps?.length || 0) + 1,
            instruction: newStep.instruction!,
            duration: newStep.duration || 5,
            imageUrl: newStep.imageUrl,
            videoUrl: newStep.videoUrl,
            tip: newStep.tip,
        };
        setFormData(prev => ({
            ...prev,
            steps: [...(prev.steps || []), step],
        }));
        setNewStep({ instruction: '', duration: 5, imageUrl: '', videoUrl: '', tip: '' });
    };

    const handleRemoveStep = (order: number) => {
        setFormData(prev => ({
            ...prev,
            steps: (prev.steps || []).filter(s => s.order !== order).map((s, i) => ({ ...s, order: i + 1 })),
        }));
    };

    const toggleAllergen = (allergen: string) => {
        setFormData(prev => ({
            ...prev,
            allergens: prev.allergens?.includes(allergen)
                ? prev.allergens.filter(a => a !== allergen)
                : [...(prev.allergens || []), allergen],
        }));
    };

    const toggleDietary = (diet: string) => {
        setFormData(prev => ({
            ...prev,
            dietaryInfo: prev.dietaryInfo?.includes(diet)
                ? prev.dietaryInfo.filter(d => d !== diet)
                : [...(prev.dietaryInfo || []), diet],
        }));
    };

    const handleSave = async () => {
        if (!formData.name) {
            showToast("Le nom de la recette est requis", "error");
            return;
        }

        try {
            if (recipe) {
                await updateRecipe(recipe.id, formData);
                showToast("Fiche technique mise à jour", "success");
            } else {
                await addRecipe(formData as any);
                showToast("Nouvelle création ajoutée au catalogue", "success");
            }
            onClose();
        } catch (error) {
            showToast("Erreur lors de l'enregistrement", "error");
        }
    };

    const margin = formData.sellingPrice && formData.sellingPrice > 0
        ? (((formData.sellingPrice - (formData.costPrice || 0)) / formData.sellingPrice) * 100).toFixed(1)
        : '0';

    const tabs = [
        { id: 'basics', label: 'Identité', icon: ChefHat },
        { id: 'ingredients', label: 'Composition', icon: UtensilsCrossed },
        { id: 'steps', label: 'Protocole', icon: CheckCircle2 },
        { id: 'pricing', label: 'Analyse', icon: DollarSign },
    ] as const;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="xl"
            className="p-0"
            showClose={false}
            noPadding
        >
            <div className="flex flex-col h-[85vh] bg-bg-primary overflow-hidden">
                {/* Premium Header */}
                <div className="px-12 py-8 border-b border-border bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] text-white shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <motion.div
                                layoutId="recipe-icon"
                                className="w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden group"
                                style={{ backgroundColor: formData.color }}
                            >
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <ChefHat className="w-8 h-8 text-white relative z-10" />
                            </motion.div>
                            <div>
                                <h2 className="text-3xl font-serif font-black tracking-tight flex items-center gap-3">
                                    {recipe ? 'Édition de Recette' : 'Nouvelle Signature'}
                                    <Sparkles className="w-5 h-5 text-accent animate-pulse" />
                                </h2>
                                <div className="flex items-center gap-4 mt-1">
                                    <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Fiche Technique Digitalisée</span>
                                    <div className="h-1 w-1 rounded-full bg-white/20" />
                                    <span className="text-accent text-[10px] font-black uppercase tracking-[0.2em]">{formData.category?.toUpperCase()}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-white/50 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="px-12 bg-white border-b border-border shrink-0 flex items-center gap-8 overflow-x-auto no-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-3 py-6 px-4 border-b-4 transition-all relative font-black text-[11px] uppercase tracking-[0.15em]",
                                activeTab === tab.id
                                    ? "border-accent text-text-primary"
                                    : "border-transparent text-text-muted hover:text-text-primary hover:bg-bg-tertiary"
                            )}
                        >
                            <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-accent" : "text-text-muted")} />
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-accent" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto elegant-scrollbar p-12">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-10 max-w-5xl mx-auto"
                        >
                            {activeTab === 'basics' && (
                                <div className="space-y-10">
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="col-span-2 lg:col-span-1">
                                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4 block">Dénomination Commerciale</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData((prev: any) => ({ ...prev, name: e.target.value }))}
                                                className="w-full h-16 px-8 bg-white rounded-3xl border-2 border-border focus:border-accent font-serif font-black text-xl outline-none transition-all placeholder:text-text-muted/30"
                                                placeholder="Ex: Risotto aux Morilles & Truffe..."
                                            />
                                        </div>
                                        <div>
                                            <PremiumSelect
                                                label="Catégorie du Menu"
                                                value={formData.category || ''}
                                                onChange={(val) => setFormData(prev => ({ ...prev, category: val }))}
                                                options={CATEGORIES.map(cat => ({ value: cat, label: cat.toUpperCase() }))}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4 block">Description Gastronomique</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                            className="w-full h-32 px-8 py-6 bg-white rounded-[2rem] border-2 border-border focus:border-accent font-bold text-sm outline-none resize-none transition-all placeholder:text-text-muted/30"
                                            placeholder="Texte court pour le menu ou le personnel de salle..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 gap-6">
                                        {[
                                            { label: 'Préparation', value: formData.prepTime, key: 'prepTime', icon: Clock, unit: 'MIN' },
                                            { label: 'Cuisson', value: formData.cookTime, key: 'cookTime', icon: Timer, unit: 'MIN' },
                                            { label: 'Portions', value: formData.portions, key: 'portions', icon: Users, unit: 'PAX' },
                                        ].map(item => (
                                            <div key={item.key} className="bg-white p-6 rounded-[2rem] border border-border/50">
                                                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 block flex items-center gap-2">
                                                    <item.icon className="w-3.5 h-3.5" />
                                                    {item.label}
                                                </label>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="number"
                                                        value={item.value}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, [item.key]: parseInt(e.target.value) || 0 }))}
                                                        className="w-full h-12 px-4 bg-bg-tertiary rounded-xl font-black text-lg outline-none"
                                                    />
                                                    <span className="text-[10px] font-black text-text-muted">{item.unit}</span>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="bg-white p-6 rounded-[2rem] border border-border/50">
                                            <PremiumSelect
                                                label="Expertise"
                                                value={formData.difficulty || 'medium'}
                                                onChange={(val) => setFormData(prev => ({ ...prev, difficulty: val as any }))}
                                                options={[
                                                    { value: 'easy', label: 'FACILE' },
                                                    { value: 'medium', label: 'MAÎTRISÉ' },
                                                    { value: 'hard', label: 'EXPERT' }
                                                ]}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4 block">Code Couleur Visuel</label>
                                        <div className="flex gap-4 p-4 bg-white rounded-3xl border border-border/50 overflow-x-auto no-scrollbar">
                                            {COLORS.map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => setFormData((prev: any) => ({ ...prev, color }))}
                                                    className={cn(
                                                        "w-12 h-12 rounded-2xl transition-all shrink-0 border-4",
                                                        formData.color === color ? "border-accent scale-110 shadow-lg shadow-black/10" : "border-transparent opacity-60 hover:opacity-100"
                                                    )}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'ingredients' && (
                                <div className="space-y-10">
                                    <div className="bg-bg-tertiary p-8 rounded-[3rem] border-2 border-dashed border-border">
                                        <h3 className="font-serif font-black text-xl mb-6">Ajouter un Élement</h3>
                                        <div className="grid grid-cols-12 gap-4">
                                            <div className="col-span-8">
                                                <input
                                                    type="text"
                                                    placeholder="Nom du composant..."
                                                    value={newIngredient.name}
                                                    onChange={(e) => setNewIngredient(prev => ({ ...prev, name: e.target.value }))}
                                                    className="w-full h-14 px-6 bg-white rounded-2xl border-2 border-transparent focus:border-accent font-bold outline-none"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <input
                                                    type="number"
                                                    placeholder="Qté"
                                                    value={newIngredient.quantity || ''}
                                                    onChange={(e) => setNewIngredient(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                                                    className="w-full h-14 px-6 bg-white rounded-2xl border-2 border-transparent focus:border-accent font-bold outline-none"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <PremiumSelect
                                                    value={newIngredient.unit || 'g'}
                                                    onChange={(val) => setNewIngredient(prev => ({ ...prev, unit: val }))}
                                                    options={['g', 'kg', 'L', 'cl', 'ml', 'pièces'].map(u => ({ value: u, label: u }))}
                                                />
                                            </div>
                                            <div className="col-span-4">
                                                <div className="relative">
                                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                                    <input
                                                        type="number"
                                                        placeholder="Coût Unitaire"
                                                        value={newIngredient.cost || ''}
                                                        onChange={(e) => setNewIngredient(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                                                        className="w-full h-14 pl-10 pr-6 bg-white rounded-2xl border-2 border-transparent focus:border-accent font-bold outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-span-8">
                                                <Button onClick={handleAddIngredient} className="w-full h-14 bg-text-primary hover:bg-black text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all">
                                                    <Plus className="w-4 h-4 mr-2" /> Valider l'Ingrédient
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4 block">Nomenclature des Ingrédients</label>
                                        <AnimatePresence mode="popLayout">
                                            {formData.ingredients?.map((ing, idx) => (
                                                <motion.div
                                                    key={ing.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    className="group flex items-center justify-between p-6 bg-white rounded-[2rem] border border-border shadow-sm hover:shadow-md transition-all"
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-10 h-10 rounded-xl bg-bg-tertiary flex items-center justify-center font-black text-[10px] text-text-muted">
                                                            {idx + 1}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-text-primary">{ing.name}</p>
                                                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mt-1">{ing.quantity} {ing.unit}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-8">
                                                        <span className="font-serif font-black text-accent text-lg">{(ing.cost).toFixed(2)} €</span>
                                                        <button
                                                            onClick={() => handleRemoveIngredient(ing.id)}
                                                            className="w-10 h-10 rounded-xl bg-error/5 hover:bg-error/10 text-error flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                        {(!formData.ingredients || formData.ingredients.length === 0) && (
                                            <div className="py-20 text-center bg-bg-tertiary rounded-[3rem] border border-border/50">
                                                <UtensilsCrossed className="w-12 h-12 text-text-muted/20 mx-auto mb-4" />
                                                <p className="text-text-muted font-bold italic">Aucun ingrédient défini pour cette recette.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'steps' && (
                                <div className="space-y-10">
                                    <div className="bg-bg-tertiary p-8 rounded-[3rem] border-2 border-dashed border-border">
                                        <h3 className="font-serif font-black text-xl mb-6">Nouvelle Étape Opérationnelle</h3>
                                        <div className="space-y-4">
                                            <textarea
                                                placeholder="Instruction technique détaillée..."
                                                value={newStep.instruction}
                                                onChange={(e) => setNewStep(prev => ({ ...prev, instruction: e.target.value }))}
                                                className="w-full h-24 px-6 py-4 bg-white rounded-2xl border-2 border-transparent focus:border-accent font-bold text-sm outline-none resize-none"
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="relative">
                                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                                    <input
                                                        type="number"
                                                        placeholder="Temps requis (min)"
                                                        value={newStep.duration}
                                                        onChange={(e) => setNewStep(prev => ({ ...prev, duration: parseInt(e.target.value) || 5 }))}
                                                        className="w-full h-14 pl-10 pr-6 bg-white rounded-2xl border-2 border-transparent focus:border-accent font-bold outline-none"
                                                    />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="URL Illustration (Visuel)"
                                                    value={newStep.imageUrl}
                                                    onChange={(e) => setNewStep(prev => ({ ...prev, imageUrl: e.target.value }))}
                                                    className="w-full h-14 px-6 bg-white rounded-2xl border-2 border-transparent focus:border-accent font-bold outline-none"
                                                />
                                            </div>
                                            <textarea
                                                placeholder="Le conseil du Chef (Astuces de dressage, points de vigilance...)"
                                                value={newStep.tip}
                                                onChange={(e) => setNewStep(prev => ({ ...prev, tip: e.target.value }))}
                                                className="w-full h-20 px-6 py-4 bg-white rounded-2xl border-2 border-transparent focus:border-accent font-bold italic text-sm outline-none resize-none"
                                            />
                                            <Button onClick={handleAddStep} className="w-full h-14 bg-text-primary hover:bg-black text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all">
                                                <Plus className="w-4 h-4 mr-2" /> Intégrer cette étape au protocole
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4 block">Chronologie d'Exécution</label>
                                        <AnimatePresence mode="popLayout">
                                            {formData.steps?.map((step, idx) => (
                                                <motion.div
                                                    key={step.order}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="group bg-white p-8 rounded-[3rem] border border-border shadow-sm relative overflow-hidden"
                                                >
                                                    <div className="absolute top-0 left-0 w-2 h-full bg-accent opacity-20" />
                                                    <div className="flex items-start gap-8">
                                                        <div className="w-14 h-14 rounded-2xl bg-bg-tertiary flex items-center justify-center font-serif font-black text-2xl text-accent border border-border">
                                                            {step.order}
                                                        </div>
                                                        <div className="flex-1 space-y-4">
                                                            <p className="text-xl font-serif font-medium text-text-primary leading-relaxed">{step.instruction}</p>
                                                            <div className="flex items-center gap-6">
                                                                <span className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-widest">
                                                                    <Timer className="w-3.5 h-3.5" />
                                                                    {step.duration} MINUTES
                                                                </span>
                                                                {step.tip && (
                                                                    <span className="flex items-center gap-2 text-[10px] font-black text-accent uppercase tracking-widest">
                                                                        <AlertTriangle className="w-3.5 h-3.5" />
                                                                        CONSEIL DU CHEF
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {step.tip && <p className="text-sm font-medium italic text-text-muted bg-accent/5 p-4 rounded-2xl border border-accent/10">"{step.tip}"</p>}
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemoveStep(step.order)}
                                                            className="w-10 h-10 rounded-xl bg-error/5 hover:bg-error/10 text-error flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'pricing' && (
                                <div className="space-y-12">
                                    <div className="grid grid-cols-3 gap-8">
                                        <div className="bg-white p-10 rounded-[3rem] border border-border shadow-soft">
                                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4 block">Coût de Revient HT</label>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-4xl font-serif font-black text-text-primary">{(formData.costPrice || 0).toFixed(2)}</span>
                                                <span className="text-xl font-black text-text-muted">€</span>
                                            </div>
                                        </div>
                                        <div className="bg-white p-10 rounded-[3rem] border-2 border-accent shadow-xl shadow-accent/5 relative overflow-hidden">
                                            <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-4 block">Prix de Vente Conseillé</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={formData.sellingPrice || ''}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, sellingPrice: parseFloat(e.target.value) || 0 }))}
                                                    className="w-full bg-transparent text-4xl font-serif font-black text-text-primary outline-none"
                                                    placeholder="0.00"
                                                />
                                                <span className="text-2xl font-black text-text-primary">€</span>
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "p-10 rounded-[3rem] border shadow-soft flex flex-col justify-center",
                                            parseFloat(margin) >= 60 ? "bg-success-soft border-success/20" :
                                                parseFloat(margin) >= 40 ? "bg-warning-soft border-warning/20" :
                                                    "bg-error-soft border-error/20"
                                        )}>
                                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4 block">Marge Brute Estimée</label>
                                            <div className="flex items-baseline gap-2">
                                                <span className={cn(
                                                    "text-4xl font-serif font-black",
                                                    parseFloat(margin) >= 60 ? "text-success" :
                                                        parseFloat(margin) >= 40 ? "text-warning" :
                                                            "text-error"
                                                )}>{margin}</span>
                                                <span className="text-xl font-black text-text-muted">%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-10">
                                        <div className="space-y-6">
                                            <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-4">Allergènes Présents</h4>
                                            <div className="flex flex-wrap gap-3">
                                                {ALLERGENS.map(a => (
                                                    <button
                                                        key={a}
                                                        onClick={() => toggleAllergen(a)}
                                                        className={cn(
                                                            "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2",
                                                            formData.allergens?.includes(a)
                                                                ? "bg-error text-white border-error shadow-lg shadow-error/20"
                                                                : "bg-white text-text-muted border-border hover:border-text-muted/30"
                                                        )}
                                                    >
                                                        {a}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-4">Régime Alimentaire compatible</h4>
                                            <div className="flex flex-wrap gap-3">
                                                {DIETARY.map(d => (
                                                    <button
                                                        key={d}
                                                        onClick={() => toggleDietary(d)}
                                                        className={cn(
                                                            "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2",
                                                            formData.dietaryInfo?.includes(d)
                                                                ? "bg-success text-white border-success shadow-lg shadow-success/20"
                                                                : "bg-white text-text-muted border-border hover:border-text-muted/30"
                                                        )}
                                                    >
                                                        {d}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer Controls */}
                <div className="px-12 py-8 border-t border-border bg-white flex gap-6 shrink-0">
                    <Button
                        variant="outline"
                        className="flex-1 h-16 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] border-2 border-border bg-white hover:bg-bg-tertiary transition-all"
                        onClick={onClose}
                    >
                        Abandonner les modifications
                    </Button>
                    <Button
                        className="flex-2 h-16 bg-accent hover:bg-black text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-accent/20 transition-all transform hover:scale-[1.02] px-12"
                        onClick={handleSave}
                    >
                        <Save className="w-5 h-5 mr-3" />
                        {recipe ? 'Finaliser la Mise à Jour' : 'Enregistrer dans le Livre de Recettes'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
