"use client";

import { useState, useEffect } from "react";
import {
    X,
    Plus,
    Trash2,
    ChefHat,
    Wine,
    DollarSign,
    Clock,
    Leaf,
    AlertTriangle,
    Save,
    Sparkles,
    UtensilsCrossed,
    Gem,
    Percent,
    Timer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import { useInventory } from "@/context/InventoryContext";
import { useRecipes } from "@/context/RecipeContext";
import { useToast } from "@/components/ui/Toast";
import { Modal } from "@/components/ui/Modal";
import { PremiumSelect } from "@/components/ui/PremiumSelect";
import { motion, AnimatePresence } from "framer-motion";

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    productType: 'dish' | 'cocktail';
    editProduct?: any;
}

const ALLERGENS = [
    { id: 'gluten', name: 'Gluten', icon: '🌾' },
    { id: 'lactose', name: 'Lactose', icon: '🥛' },
    { id: 'eggs', name: 'Œufs', icon: '🥚' },
    { id: 'nuts', name: 'Fruits à coque', icon: '🥜' },
    { id: 'shellfish', name: 'Crustacés', icon: '🦐' },
    { id: 'fish', name: 'Poisson', icon: '🐟' },
    { id: 'soy', name: 'Soja', icon: '🫘' },
    { id: 'celery', name: 'Céleri', icon: '🥬' },
];

const CATEGORIES_DISH = [
    'ENTRÉES',
    'PLATS',
    'DESSERTS',
    'ACCOMPAGNEMENTS',
    'SUGGESTIONS DU CHEF',
];

const CATEGORIES_COCKTAIL = [
    'CLASSIQUES',
    'SIGNATURES',
    'SANS ALCOOL',
    'APÉRITIFS',
    'DIGESTIFS',
];

export function ProductFormModal({ isOpen, onClose, productType, editProduct }: ProductFormModalProps) {
    const { ingredients } = useInventory();
    const { addRecipe, updateRecipe } = useRecipes();
    const { showToast } = useToast();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [sellPrice, setSellPrice] = useState<number>(0);
    const [prepTime, setPrepTime] = useState<number>(0);
    const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
    const [isVegetarian, setIsVegetarian] = useState(false);
    const [isVegan, setIsVegan] = useState(false);
    const [isGlutenFree, setIsGlutenFree] = useState(false);
    const [recipeIngredients, setRecipeIngredients] = useState<Array<{ ingredientId: string; quantity: number }>>([]);
    const [recipeSteps, setRecipeSteps] = useState<Array<{ order: number; instruction: string; duration?: number }>>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (editProduct && isOpen) {
            setName(editProduct.name || "");
            setDescription(editProduct.description || "");
            setCategory(editProduct.category || "");
            setSellPrice(editProduct.price || 0);
            setPrepTime(editProduct.prepTime || 0);
            setSelectedAllergens(editProduct.allergens || []);
            setIsVegetarian(editProduct.isVegetarian || false);
            setIsVegan(editProduct.isVegan || false);
            setIsGlutenFree(editProduct.isGlutenFree || false);
            setRecipeIngredients(editProduct.ingredients || []);
            setRecipeSteps(editProduct.recipeSteps || []);
        } else if (!editProduct && isOpen) {
            setName("");
            setDescription("");
            setCategory("");
            setSellPrice(0);
            setPrepTime(0);
            setSelectedAllergens([]);
            setIsVegetarian(false);
            setIsVegan(false);
            setIsGlutenFree(false);
            setRecipeIngredients([]);
            setRecipeSteps([]);
        }
    }, [editProduct, isOpen]);

    const categories = productType === 'dish' ? CATEGORIES_DISH : CATEGORIES_COCKTAIL;

    const toggleAllergen = (id: string) => {
        setSelectedAllergens(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        );
    };

    const addIngredient = () => {
        setRecipeIngredients([...recipeIngredients, { ingredientId: '', quantity: 0 }]);
    };

    const updateIngredient = (index: number, field: 'ingredientId' | 'quantity', value: string | number) => {
        const updated = [...recipeIngredients];
        updated[index] = { ...updated[index], [field]: value };
        setRecipeIngredients(updated);
    };

    const removeIngredient = (index: number) => {
        setRecipeIngredients(recipeIngredients.filter((_, i) => i !== index));
    };

    const addStep = () => {
        setRecipeSteps([...recipeSteps, { order: recipeSteps.length + 1, instruction: '', duration: undefined }]);
    };

    const updateStep = (index: number, field: 'instruction' | 'duration', value: string | number) => {
        const updated = [...recipeSteps];
        updated[index] = { ...updated[index], [field]: value };
        setRecipeSteps(updated);
    };

    const removeStep = (index: number) => {
        const updated = recipeSteps.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i + 1 }));
        setRecipeSteps(updated);
    };

    const { calculateRecipeCost } = useRecipes();

    const calculatedCost = calculateRecipeCost(recipeIngredients);

    const margin = sellPrice > 0 ? ((sellPrice - calculatedCost) / sellPrice) * 100 : 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !category) {
            showToast("Nom et catégorie requis", "error");
            return;
        }

        setIsSubmitting(true);
        try {
            const productData = {
                name,
                description,
                category,
                price: sellPrice,
                costPrice: calculatedCost,
                prepTime,
                allergens: selectedAllergens,
                isVegetarian,
                isVegan,
                isGlutenFree,
                ingredients: recipeIngredients.map((ri, idx) => {
                    const ing = ingredients.find(i => i.id === ri.ingredientId);
                    return {
                        id: `ing_${idx}`,
                        ingredientId: ri.ingredientId,
                        name: ing?.name || '',
                        quantity: ri.quantity,
                        unit: ing?.unit || 'unit',
                        cost: (ing?.cost || 0) * ri.quantity,
                    };
                }),
                recipeSteps,
                productType,
                isActive: true,
                color: productType === 'dish' ? '#1B4332' : '#7C3AED',
            };

            if (editProduct) {
                await updateRecipe(editProduct.id, productData);
                showToast("Fiche mise à jour", "success");
            } else {
                await addRecipe(productData as any);
                showToast("Fiche créée", "success");
            }
            onClose();
        } catch (error) {
            showToast("Erreur d'enregistrement", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="xl"
            className="p-0 border-none bg-transparent"
            showClose={false}
            noPadding
        >
            <div className="flex flex-col h-[85vh] bg-bg-primary rounded-[3rem] overflow-hidden shadow-[0_32px_128px_rgba(0,0,0,0.3)] border border-white/20">
                {/* Premium Header */}
                <div className={cn(
                    "px-10 py-8 text-white relative overflow-hidden",
                    productType === 'dish' ? "bg-gradient-to-br from-[#1B4332] to-[#2D6A4F]" : "bg-gradient-to-br from-[#4C1D95] to-[#7C3AED]"
                )}>
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/carbon-fibre.png")` }} />

                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20">
                                {productType === 'dish' ? <ChefHat className="w-8 h-8" /> : <Wine className="w-8 h-8" />}
                            </div>
                            <div>
                                <h2 className="text-3xl font-serif font-black tracking-tight flex items-center gap-3">
                                    {editProduct ? 'Modifier' : 'Nouveau'} {productType === 'dish' ? 'Plat Signature' : 'Cocktail Signature'}
                                    <Sparkles className="w-5 h-5 text-accent/80" />
                                </h2>
                                <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em] mt-1">
                                    Configuration de la Fiche Technique de Vente
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-all"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Form Content */}
                <div className="flex-1 overflow-y-auto elegant-scrollbar p-10 space-y-10">
                    {/* Section: Identité */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 px-2">
                            <Gem className="w-4 h-4 text-accent" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Identité de l'Offre</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2 lg:col-span-1 space-y-3">
                                <label className="text-[10px] font-bold text-text-muted px-4 font-black uppercase tracking-widest">Intitulé de la Création</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Ex: Noix de Saint-Jacques Snackées..."
                                    className="w-full h-14 px-6 bg-white dark:bg-bg-secondary rounded-2xl border-2 border-border focus:border-accent font-serif font-black text-lg outline-none transition-all"
                                />
                            </div>
                            <div className="col-span-2 lg:col-span-1">
                                <PremiumSelect
                                    label="Classification"
                                    value={category}
                                    onChange={setCategory}
                                    options={categories.map(cat => ({ value: cat, label: cat }))}
                                    placeholder="SÉLECTIONNER..."
                                />
                            </div>
                            <div className="col-span-2 space-y-3">
                                <label className="text-[10px] font-bold text-text-muted px-4 font-black uppercase tracking-widest">Description Narrative</label>
                                <textarea
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="Briefing pour le personnel de salle et informations clients..."
                                    className="w-full h-24 px-6 py-4 bg-white dark:bg-bg-secondary rounded-2xl border-2 border-border focus:border-accent font-bold text-sm outline-none resize-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section: Performance Financière & Temps */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-white dark:bg-bg-secondary rounded-3xl border border-border shadow-soft space-y-3">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                                <DollarSign className="w-3.5 h-3.5" /> Prix Carte
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    step="0.01"
                                    value={sellPrice}
                                    onChange={e => setSellPrice(parseFloat(e.target.value) || 0)}
                                    className="w-full h-10 bg-transparent text-3xl font-serif font-black outline-none"
                                />
                                <span className="text-xl font-black">€</span>
                            </div>
                        </div>
                        <div className="p-6 bg-white dark:bg-bg-secondary rounded-3xl border border-border shadow-soft space-y-3">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                                <Timer className="w-3.5 h-3.5" /> Envoi ESTIMÉ
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={prepTime}
                                    onChange={e => setPrepTime(parseInt(e.target.value) || 0)}
                                    className="w-full h-10 bg-transparent text-3xl font-serif font-black outline-none"
                                />
                                <span className="text-xl font-black">MIN</span>
                            </div>
                        </div>
                        <div className={cn(
                            "p-6 rounded-3xl border shadow-soft flex flex-col justify-center",
                            margin >= 70 ? "bg-success-soft border-success/20" : margin >= 50 ? "bg-warning-soft border-warning/20" : "bg-error-soft border-error/20"
                        )}>
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                                <Percent className="w-3.5 h-3.5" /> Rentabilité
                            </label>
                            <div className="flex items-baseline gap-2">
                                <span className={cn(
                                    "text-3xl font-serif font-black",
                                    margin >= 70 ? "text-success" : margin >= 50 ? "text-warning" : "text-error"
                                )}>{margin.toFixed(1)}</span>
                                <span className="text-sm font-black text-text-muted">%</span>
                            </div>
                            <p className="text-[9px] font-bold text-text-muted mt-1">COÛT REVIENT: {formatCurrency(calculatedCost)}</p>
                        </div>
                    </div>

                    {/* Section: Régimes & Allergènes */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-2 px-2">
                                <Leaf className="w-3.5 h-3.5 text-success" /> Labels Éthiques
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { id: 'vegetarian', label: 'VÉGÉTARIEN', icon: '🥗', state: isVegetarian, setState: setIsVegetarian },
                                    { id: 'vegan', label: 'VÉGAN', icon: '🌱', state: isVegan, setState: setIsVegan },
                                    { id: 'glutenFree', label: 'NO GLUTEN', icon: '🌾', state: isGlutenFree, setState: setIsGlutenFree },
                                ].map(opt => (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => opt.setState(!opt.state)}
                                        className={cn(
                                            "px-5 py-3 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all",
                                            opt.state
                                                ? "bg-success text-white border-success shadow-lg shadow-success/20"
                                                : "bg-white border-border text-text-muted hover:border-text-muted/30"
                                        )}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-2 px-2">
                                <AlertTriangle className="w-3.5 h-3.5 text-error" /> Vigilance Allergènes
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {ALLERGENS.map(a => (
                                    <button
                                        key={a.id}
                                        type="button"
                                        onClick={() => toggleAllergen(a.id)}
                                        className={cn(
                                            "px-4 py-2 rounded-xl border-2 text-[9px] font-black transition-all",
                                            selectedAllergens.includes(a.id)
                                                ? "bg-error/10 border-error text-error"
                                                : "bg-white border-border text-text-muted hover:bg-bg-tertiary"
                                        )}
                                    >
                                        {a.name.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Section: Composition technique */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                                <UtensilsCrossed className="w-4 h-4 text-accent" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Nomenclature technique</h3>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={addIngredient}
                                className="h-10 rounded-xl bg-white font-black text-[10px] tracking-widest uppercase border-border hover:bg-bg-tertiary"
                            >
                                <Plus className="w-3 h-3 mr-2" /> Injecter Composant
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {recipeIngredients.length === 0 ? (
                                <div className="py-12 bg-bg-tertiary/50 border-2 border-dashed border-border rounded-[2rem] text-center">
                                    <p className="text-text-muted font-bold italic text-sm">Définissez les ingrédients pour calculer la marge brute.</p>
                                </div>
                            ) : (
                                recipeIngredients.map((ing, i) => (
                                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-bg-secondary rounded-3xl border border-border">
                                        <div className="flex-1">
                                            <PremiumSelect
                                                value={ing.ingredientId}
                                                onChange={val => updateIngredient(i, 'ingredientId', val)}
                                                options={ingredients.map(item => ({
                                                    value: item.id,
                                                    label: item.name,
                                                    description: item.unit,
                                                    icon: <ChefHat className="w-4 h-4" />
                                                }))}
                                                placeholder="SÉLECTIONNER INGRÉDIENT..."
                                            />
                                        </div>
                                        <div className="w-32 relative pt-8"> {/* pt-8 to align with PremiumSelect label vertical space if any */}
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={ing.quantity}
                                                onChange={e => updateIngredient(i, 'quantity', parseFloat(e.target.value) || 0)}
                                                className="w-full h-16 px-4 bg-bg-tertiary rounded-2xl border-2 border-border font-serif font-black text-center outline-none focus:border-accent transition-all"
                                                placeholder="QTÉ"
                                            />
                                        </div>
                                        <div className="pt-8">
                                            <button
                                                type="button"
                                                onClick={() => removeIngredient(i)}
                                                className="w-14 h-16 rounded-2xl bg-error/5 hover:bg-error text-error hover:text-white flex items-center justify-center transition-all border-2 border-transparent hover:border-error/20"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Section: Protocole d'Exécution */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                                <Clock className="w-4 h-4 text-accent" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Étapes de Production</h3>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={addStep}
                                className="h-10 rounded-xl bg-white font-black text-[10px] tracking-widest uppercase border-border hover:bg-bg-tertiary"
                            >
                                <Plus className="w-3 h-3 mr-2" /> Ajouter Étape
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {recipeSteps.length === 0 ? (
                                <div className="py-12 bg-bg-tertiary/50 border-2 border-dashed border-border rounded-[2rem] text-center">
                                    <p className="text-text-muted font-bold italic text-sm">Le personnel de cuisine verra ce protocole lors de l'exécution.</p>
                                </div>
                            ) : (
                                recipeSteps.map((step, i) => (
                                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} key={i} className="flex gap-6 p-6 bg-white rounded-[2rem] border border-border relative group">
                                        <div className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center font-serif font-black text-lg shrink-0">
                                            {step.order}
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <textarea
                                                value={step.instruction}
                                                onChange={e => updateStep(i, 'instruction', e.target.value)}
                                                placeholder="Veuillez détailler l'instruction technique..."
                                                className="w-full h-24 px-6 py-4 bg-bg-tertiary rounded-2xl font-bold text-sm outline-none resize-none focus:bg-white transition-all transition-all"
                                            />
                                            <div className="flex items-center gap-3">
                                                <Clock className="w-4 h-4 text-text-muted" />
                                                <input
                                                    type="number"
                                                    value={step.duration || ''}
                                                    onChange={e => updateStep(i, 'duration', parseInt(e.target.value) || 0)}
                                                    className="w-24 h-10 px-4 bg-bg-tertiary rounded-xl font-black text-xs outline-none focus:bg-white transition-all"
                                                    placeholder="MIN"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeStep(i)}
                                            className="w-10 h-10 rounded-xl bg-error/5 hover:bg-error/10 text-error flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Sticky Footer */}
                <div className="px-10 py-8 border-t border-border bg-white dark:bg-bg-secondary flex gap-6 shrink-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-border bg-white hover:bg-bg-tertiary transition-all"
                    >
                        Abandonner
                    </Button>
                    <Button
                        disabled={isSubmitting}
                        onClick={handleSubmit}
                        className={cn(
                            "flex-2 px-12 h-14 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl transition-all transform hover:scale-[1.02]",
                            productType === 'dish' ? "bg-[#1B4332] hover:bg-black shadow-[#1B4332]/20" : "bg-[#4C1D95] hover:bg-black shadow-[#4C1D95]/20"
                        )}
                    >
                        {isSubmitting ? (
                            <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4 mr-2" />
                        )}
                        {editProduct ? 'Sauvegarder les modifications' : 'Consigner la Fiche Technique'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
