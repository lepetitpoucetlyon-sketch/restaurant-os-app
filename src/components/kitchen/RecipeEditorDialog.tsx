"use client";

import { useState } from "react";
import { X, Plus, Trash2, Clock, DollarSign, Users, AlertTriangle, Save, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRecipes, Recipe, RecipeIngredient, RecipeStep } from "@/context/RecipeContext";
import { useToast } from "@/components/ui/Toast";

interface RecipeEditorDialogProps {
    isOpen: boolean;
    onClose: () => void;
    recipe?: Recipe; // If provided, we're editing. Otherwise creating.
}

const CATEGORIES = ['Entrée', 'Plat Principal', 'Dessert', 'Accompagnement', 'Sauce', 'Base'];
const ALLERGENS = ['Gluten', 'Lactose', 'Oeufs', 'Poisson', 'Crustacés', 'Arachides', 'Fruits à coque', 'Soja', 'Céleri', 'Moutarde', 'Sésame', 'Sulfites'];
const DIETARY = ['Végétarien', 'Végan', 'Sans Gluten', 'Halal', 'Casher'];
const COLORS = ['#1A1A1A', '#8B0000', '#00D764', '#4285F4', '#8B5CF6', '#FF9900', '#E4405F', '#722F37'];

export function RecipeEditorDialog({ isOpen, onClose, recipe }: RecipeEditorDialogProps) {
    const { showToast } = useToast();
    const { addRecipe, updateRecipe } = useRecipes();
    
    const [formData, setFormData] = useState<Partial<Recipe>>({
        name: recipe?.name || '',
        category: recipe?.category || 'Plat Principal',
        description: recipe?.description || '',
        prepTime: recipe?.prepTime || 15,
        cookTime: recipe?.cookTime || 20,
        portions: recipe?.portions || 4,
        difficulty: recipe?.difficulty || 'medium',
        ingredients: recipe?.ingredients || [],
        steps: recipe?.steps || [],
        allergens: recipe?.allergens || [],
        dietaryInfo: recipe?.dietaryInfo || [],
        costPrice: recipe?.costPrice || 0,
        sellingPrice: recipe?.sellingPrice || 0,
        color: recipe?.color || '#1A1A1A',
        isActive: recipe?.isActive ?? true,
    });

    const [newIngredient, setNewIngredient] = useState<Partial<RecipeIngredient>>({
        name: '', quantity: 0, unit: 'g', cost: 0
    });

    const [newStep, setNewStep] = useState<Partial<RecipeStep>>({
        instruction: '', duration: 5
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
        };
        setFormData(prev => ({
            ...prev,
            steps: [...(prev.steps || []), step],
        }));
        setNewStep({ instruction: '', duration: 5 });
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

    const handleSave = () => {
        if (!formData.name) {
            showToast("Le nom de la recette est requis", "error");
            return;
        }
        if ((formData.ingredients?.length || 0) === 0) {
            showToast("Ajoutez au moins un ingrédient", "error");
            return;
        }

        if (recipe) {
            updateRecipe(recipe.id, formData);
            showToast("Recette mise à jour avec succès", "success");
        } else {
            addRecipe(formData as Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'margin'>);
            showToast("Nouvelle recette créée avec succès", "success");
        }
        onClose();
    };

    const margin = formData.sellingPrice && formData.sellingPrice > 0
        ? (((formData.sellingPrice - (formData.costPrice || 0)) / formData.sellingPrice) * 100).toFixed(1)
        : '0';

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-[#1A1A1A] text-white">
                    <div className="flex items-center gap-4">
                        <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: formData.color }}
                        >
                            <ChefHat className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black">
                                {recipe ? 'Modifier la Recette' : 'Nouvelle Recette'}
                            </h2>
                            <p className="text-white/60 text-sm">Fiche technique complète</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-auto p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2 md:col-span-1">
                            <label className="text-[11px] font-black text-[#ADB5BD] uppercase">Nom de la recette *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full h-12 mt-1 px-4 bg-[#F8F9FA] rounded-xl border-2 border-transparent focus:border-[#1A1A1A] font-bold outline-none"
                                placeholder="Ex: Risotto aux Truffes"
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-black text-[#ADB5BD] uppercase">Catégorie</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full h-12 mt-1 px-4 bg-[#F8F9FA] rounded-xl border-2 border-transparent focus:border-[#1A1A1A] font-bold outline-none"
                            >
                                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-[11px] font-black text-[#ADB5BD] uppercase">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full h-20 mt-1 px-4 py-3 bg-[#F8F9FA] rounded-xl border-2 border-transparent focus:border-[#1A1A1A] font-bold outline-none resize-none"
                            placeholder="Description courte du plat..."
                        />
                    </div>

                    {/* Times & Portions */}
                    <div className="grid grid-cols-4 gap-4">
                        <div>
                            <label className="text-[11px] font-black text-[#ADB5BD] uppercase">Préparation</label>
                            <div className="flex items-center gap-2 mt-1">
                                <input
                                    type="number"
                                    value={formData.prepTime}
                                    onChange={(e) => setFormData(prev => ({ ...prev, prepTime: parseInt(e.target.value) || 0 }))}
                                    className="w-full h-12 px-4 bg-[#F8F9FA] rounded-xl border-2 border-transparent focus:border-[#1A1A1A] font-bold outline-none"
                                />
                                <span className="text-sm font-bold text-[#ADB5BD]">min</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-[11px] font-black text-[#ADB5BD] uppercase">Cuisson</label>
                            <div className="flex items-center gap-2 mt-1">
                                <input
                                    type="number"
                                    value={formData.cookTime}
                                    onChange={(e) => setFormData(prev => ({ ...prev, cookTime: parseInt(e.target.value) || 0 }))}
                                    className="w-full h-12 px-4 bg-[#F8F9FA] rounded-xl border-2 border-transparent focus:border-[#1A1A1A] font-bold outline-none"
                                />
                                <span className="text-sm font-bold text-[#ADB5BD]">min</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-[11px] font-black text-[#ADB5BD] uppercase">Portions</label>
                            <input
                                type="number"
                                value={formData.portions}
                                onChange={(e) => setFormData(prev => ({ ...prev, portions: parseInt(e.target.value) || 1 }))}
                                className="w-full h-12 mt-1 px-4 bg-[#F8F9FA] rounded-xl border-2 border-transparent focus:border-[#1A1A1A] font-bold outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-black text-[#ADB5BD] uppercase">Difficulté</label>
                            <select
                                value={formData.difficulty}
                                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                                className="w-full h-12 mt-1 px-4 bg-[#F8F9FA] rounded-xl border-2 border-transparent focus:border-[#1A1A1A] font-bold outline-none"
                            >
                                <option value="easy">Facile</option>
                                <option value="medium">Moyen</option>
                                <option value="hard">Difficile</option>
                            </select>
                        </div>
                    </div>

                    {/* Ingredients */}
                    <div className="p-4 bg-[#F8F9FA] rounded-2xl">
                        <h3 className="font-black text-[#1A1A1A] mb-4">Ingrédients</h3>
                        
                        {/* Ingredient List */}
                        {formData.ingredients && formData.ingredients.length > 0 && (
                            <div className="space-y-2 mb-4">
                                {formData.ingredients.map((ing) => (
                                    <div key={ing.id} className="flex items-center justify-between p-3 bg-white rounded-xl">
                                        <div className="flex items-center gap-4">
                                            <span className="font-bold">{ing.quantity} {ing.unit}</span>
                                            <span className="text-[#6C757D]">{ing.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold text-[#00D764]">{ing.cost.toFixed(2)} €</span>
                                            <button 
                                                onClick={() => handleRemoveIngredient(ing.id)}
                                                className="p-1.5 text-[#FF4D4D] hover:bg-[#FF4D4D]/10 rounded-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add Ingredient Form */}
                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="Qté"
                                value={newIngredient.quantity || ''}
                                onChange={(e) => setNewIngredient(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                                className="w-20 h-10 px-3 bg-white rounded-lg border border-neutral-200 font-bold text-sm outline-none"
                            />
                            <select
                                value={newIngredient.unit}
                                onChange={(e) => setNewIngredient(prev => ({ ...prev, unit: e.target.value }))}
                                className="w-20 h-10 px-2 bg-white rounded-lg border border-neutral-200 font-bold text-sm outline-none"
                            >
                                <option value="g">g</option>
                                <option value="kg">kg</option>
                                <option value="L">L</option>
                                <option value="cl">cl</option>
                                <option value="ml">ml</option>
                                <option value="pièces">pcs</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Nom de l'ingrédient"
                                value={newIngredient.name}
                                onChange={(e) => setNewIngredient(prev => ({ ...prev, name: e.target.value }))}
                                className="flex-1 h-10 px-3 bg-white rounded-lg border border-neutral-200 font-bold text-sm outline-none"
                            />
                            <input
                                type="number"
                                placeholder="Coût €"
                                value={newIngredient.cost || ''}
                                onChange={(e) => setNewIngredient(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                                className="w-24 h-10 px-3 bg-white rounded-lg border border-neutral-200 font-bold text-sm outline-none"
                            />
                            <Button onClick={handleAddIngredient} size="sm" className="h-10 bg-[#00D764] hover:bg-[#00B956] rounded-lg">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="p-4 bg-[#F8F9FA] rounded-2xl">
                        <h3 className="font-black text-[#1A1A1A] mb-4">Étapes de Préparation</h3>
                        
                        {formData.steps && formData.steps.length > 0 && (
                            <div className="space-y-2 mb-4">
                                {formData.steps.map((step) => (
                                    <div key={step.order} className="flex items-start gap-4 p-3 bg-white rounded-xl">
                                        <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] text-white flex items-center justify-center font-black text-sm shrink-0">
                                            {step.order}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-[#1A1A1A]">{step.instruction}</p>
                                            <p className="text-[11px] text-[#ADB5BD] mt-1 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {step.duration} min
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => handleRemoveStep(step.order)}
                                            className="p-1.5 text-[#FF4D4D] hover:bg-[#FF4D4D]/10 rounded-lg"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add Step Form */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Instruction de l'étape..."
                                value={newStep.instruction}
                                onChange={(e) => setNewStep(prev => ({ ...prev, instruction: e.target.value }))}
                                className="flex-1 h-10 px-3 bg-white rounded-lg border border-neutral-200 font-bold text-sm outline-none"
                            />
                            <input
                                type="number"
                                placeholder="min"
                                value={newStep.duration}
                                onChange={(e) => setNewStep(prev => ({ ...prev, duration: parseInt(e.target.value) || 5 }))}
                                className="w-20 h-10 px-3 bg-white rounded-lg border border-neutral-200 font-bold text-sm outline-none"
                            />
                            <Button onClick={handleAddStep} size="sm" className="h-10 bg-[#00D764] hover:bg-[#00B956] rounded-lg">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Allergens & Dietary */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-[11px] font-black text-[#ADB5BD] uppercase mb-2 block">Allergènes</label>
                            <div className="flex flex-wrap gap-2">
                                {ALLERGENS.map(allergen => (
                                    <button
                                        key={allergen}
                                        onClick={() => toggleAllergen(allergen)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all",
                                            formData.allergens?.includes(allergen)
                                                ? "bg-[#FF4D4D] text-white"
                                                : "bg-[#F8F9FA] text-[#6C757D] hover:bg-[#E9ECEF]"
                                        )}
                                    >
                                        {allergen}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-[11px] font-black text-[#ADB5BD] uppercase mb-2 block">Régimes</label>
                            <div className="flex flex-wrap gap-2">
                                {DIETARY.map(diet => (
                                    <button
                                        key={diet}
                                        onClick={() => toggleDietary(diet)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all",
                                            formData.dietaryInfo?.includes(diet)
                                                ? "bg-[#00D764] text-white"
                                                : "bg-[#F8F9FA] text-[#6C757D] hover:bg-[#E9ECEF]"
                                        )}
                                    >
                                        {diet}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Color */}
                    <div className="grid grid-cols-4 gap-4">
                        <div>
                            <label className="text-[11px] font-black text-[#ADB5BD] uppercase">Coût Total</label>
                            <div className="h-12 mt-1 px-4 bg-[#F8F9FA] rounded-xl flex items-center font-black text-[#1A1A1A]">
                                {(formData.costPrice || 0).toFixed(2)} €
                            </div>
                        </div>
                        <div>
                            <label className="text-[11px] font-black text-[#ADB5BD] uppercase">Prix de Vente</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.sellingPrice || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, sellingPrice: parseFloat(e.target.value) || 0 }))}
                                className="w-full h-12 mt-1 px-4 bg-[#F8F9FA] rounded-xl border-2 border-transparent focus:border-[#1A1A1A] font-bold outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-black text-[#ADB5BD] uppercase">Marge</label>
                            <div className={cn(
                                "h-12 mt-1 px-4 rounded-xl flex items-center font-black",
                                parseFloat(margin) >= 60 ? "bg-[#E6F9EF] text-[#00D764]" :
                                parseFloat(margin) >= 40 ? "bg-[#FFF7E6] text-[#FF9900]" :
                                "bg-[#FEECEC] text-[#FF4D4D]"
                            )}>
                                {margin}%
                            </div>
                        </div>
                        <div>
                            <label className="text-[11px] font-black text-[#ADB5BD] uppercase">Couleur</label>
                            <div className="flex gap-1 mt-1">
                                {COLORS.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                                        className={cn(
                                            "w-8 h-8 rounded-lg transition-all",
                                            formData.color === color ? "ring-2 ring-offset-2 ring-[#1A1A1A]" : ""
                                        )}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-[#F8F9FA] border-t border-neutral-100 flex gap-3">
                    <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={onClose}>
                        Annuler
                    </Button>
                    <Button className="flex-1 h-12 bg-[#00D764] hover:bg-[#00B956] rounded-xl font-bold" onClick={handleSave}>
                        <Save className="w-4 h-4 mr-2" />
                        {recipe ? 'Mettre à jour' : 'Créer la recette'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
