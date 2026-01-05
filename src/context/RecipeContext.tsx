"use client";

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { PRODUCTS } from '@/lib/mock-data';
import { useReservations } from './ReservationsContext';
import type { PrepTask, Product } from '@/types';

/**
 * RECIPE & PRODUCTION CONTEXT
 * Manages kitchen production workflow, recipes, prep lists, and task assignments.
 */

export interface RecipeIngredient {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    cost: number;
}

export interface RecipeStep {
    order: number;
    instruction: string;
    duration: number; // in minutes
    temperature?: string;
    tip?: string;
}

export interface Recipe {
    id: string;
    name: string;
    category: string;
    description?: string;
    prepTime: number;
    cookTime: number;
    portions: number;
    difficulty: 'easy' | 'medium' | 'hard';
    ingredients: RecipeIngredient[];
    steps: RecipeStep[];
    allergens: string[];
    dietaryInfo: string[];
    costPrice: number;
    sellingPrice: number;
    margin: number;
    imageUrl?: string;
    color: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface MiseEnPlaceTask extends PrepTask {
    assignedTo?: string;
    station?: string;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    estimatedTime: number; // in minutes
    actualTime?: number;
    notes?: string;
    recipe?: string; // linked recipe id
}

interface RecipeContextType {
    recipes: Product[];
    customRecipes: Recipe[];
    prepTasks: MiseEnPlaceTask[];

    // Recipe CRUD
    addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'margin'>) => void;
    updateRecipe: (id: string, updates: Partial<Recipe>) => void;
    deleteRecipe: (id: string) => void;
    getRecipeById: (id: string) => Recipe | undefined;

    // Prep Tasks CRUD
    addPrepTask: (task: Omit<MiseEnPlaceTask, 'id'>) => void;
    updatePrepTask: (id: string, updates: Partial<MiseEnPlaceTask>) => void;
    deletePrepTask: (id: string) => void;
    togglePrepTask: (id: string) => void;
    assignPrepTask: (taskId: string, staffId: string) => void;

    // Helpers
    getRecipeSteps: (productId: string) => any[];
    miseEnPlaceTarget: Record<string, number>;
    calculateRecipeCost: (ingredients: RecipeIngredient[]) => number;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

// Initial custom recipes
const INITIAL_RECIPES: Recipe[] = [
    {
        id: 'recipe_001',
        name: 'Risotto aux Truffes',
        category: 'Plat Principal',
        description: 'Risotto crémeux aux truffes noires du Périgord',
        prepTime: 15,
        cookTime: 25,
        portions: 4,
        difficulty: 'medium',
        ingredients: [
            { id: 'ing1', name: 'Riz Carnaroli', quantity: 320, unit: 'g', cost: 2.50 },
            { id: 'ing2', name: 'Truffe noire', quantity: 30, unit: 'g', cost: 45.00 },
            { id: 'ing3', name: 'Parmesan', quantity: 80, unit: 'g', cost: 3.20 },
            { id: 'ing4', name: 'Bouillon', quantity: 1, unit: 'L', cost: 1.50 },
            { id: 'ing5', name: 'Beurre', quantity: 60, unit: 'g', cost: 0.90 },
            { id: 'ing6', name: 'Échalotes', quantity: 2, unit: 'pièces', cost: 0.40 },
        ],
        steps: [
            { order: 1, instruction: 'Faire suer les échalotes dans le beurre', duration: 3 },
            { order: 2, instruction: 'Nacrer le riz 2 minutes', duration: 2, tip: 'Le riz doit devenir translucide' },
            { order: 3, instruction: 'Mouiller louche par louche en remuant', duration: 18, temperature: 'Feu moyen' },
            { order: 4, instruction: 'Mantecare avec le parmesan et le beurre froid', duration: 2, tip: 'Hors du feu pour émulsionner' },
            { order: 5, instruction: 'Râper la truffe au moment du service', duration: 1 },
        ],
        allergens: ['Lactose', 'Gluten'],
        dietaryInfo: ['Végétarien'],
        costPrice: 53.50,
        sellingPrice: 42.00,
        margin: 0,
        color: '#1A1A1A',
        isActive: true,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
    },
    {
        id: 'recipe_002',
        name: 'Tartare de Boeuf',
        category: 'Entrée',
        description: 'Tartare de boeuf Charolais coupé au couteau',
        prepTime: 20,
        cookTime: 0,
        portions: 4,
        difficulty: 'easy',
        ingredients: [
            { id: 'ing1', name: 'Filet de boeuf', quantity: 600, unit: 'g', cost: 28.00 },
            { id: 'ing2', name: 'Câpres', quantity: 30, unit: 'g', cost: 1.20 },
            { id: 'ing3', name: 'Cornichons', quantity: 40, unit: 'g', cost: 0.80 },
            { id: 'ing4', name: 'Échalotes', quantity: 2, unit: 'pièces', cost: 0.40 },
            { id: 'ing5', name: 'Jaune d\'oeuf', quantity: 4, unit: 'pièces', cost: 1.20 },
        ],
        steps: [
            { order: 1, instruction: 'Parer le filet de boeuf', duration: 5 },
            { order: 2, instruction: 'Couper en brunoise fine au couteau', duration: 10, tip: 'Garder la viande très froide' },
            { order: 3, instruction: 'Ciseler les condiments', duration: 3 },
            { order: 4, instruction: 'Assaisonner et mélanger délicatement', duration: 2 },
        ],
        allergens: ['Oeufs', 'Moutarde'],
        dietaryInfo: [],
        costPrice: 31.60,
        sellingPrice: 24.00,
        margin: 0,
        color: '#8B0000',
        isActive: true,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
    },
];

// Initial prep tasks
const INITIAL_PREP_TASKS: MiseEnPlaceTask[] = [
    {
        id: 'mep_001',
        name: 'Préparer la brunoise de légumes',
        quantity: 2,
        unit: 'kg',
        isCompleted: false,
        dueDate: new Date(),
        assignedTo: 'Jean',
        station: 'Garde-manger',
        priority: 'high',
        estimatedTime: 45,
        notes: 'Carottes, céleri, oignons pour les sauces du soir',
    },
    {
        id: 'mep_002',
        name: 'Tailler les pommes de terre',
        quantity: 5,
        unit: 'kg',
        isCompleted: false,
        dueDate: new Date(),
        assignedTo: 'Marie',
        station: 'Légumerie',
        priority: 'normal',
        estimatedTime: 30,
    },
    {
        id: 'mep_003',
        name: 'Préparer les fonds de sauce',
        quantity: 4,
        unit: 'L',
        isCompleted: true,
        dueDate: new Date(),
        assignedTo: 'Pierre',
        station: 'Saucier',
        priority: 'high',
        estimatedTime: 120,
    },
    {
        id: 'mep_004',
        name: 'Portionner les viandes',
        quantity: 20,
        unit: 'portions',
        isCompleted: false,
        dueDate: new Date(),
        station: 'Garde-manger',
        priority: 'urgent',
        estimatedTime: 40,
        notes: 'Filets de boeuf pour le service du soir',
    },
];

export function RecipeProvider({ children }: { children: ReactNode }) {
    const { reservations } = useReservations();
    const [customRecipes, setCustomRecipes] = useState<Recipe[]>(INITIAL_RECIPES);
    const [prepTasks, setPrepTasks] = useState<MiseEnPlaceTask[]>(INITIAL_PREP_TASKS);

    // Recipes are extended products from mock-data
    const recipes = useMemo(() => {
        return PRODUCTS.map(p => ({
            ...p,
            recipeSteps: p.recipeSteps || [
                { order: 1, instruction: "Préparer les ingrédients frais", duration: 5 },
                { order: 2, instruction: "Assemblage selon fiche technique", duration: 10 },
                { order: 3, instruction: "Dressage premium sur assiette chaude", duration: 2 }
            ],
            prepTime: p.prepTime || 15
        })) as Product[];
    }, []);

    // Calculate Mise-en-place targets based on reservations for Today
    const miseEnPlaceTarget = useMemo(() => {
        const todayRes = reservations.filter(r => {
            const today = new Date().toISOString().split('T')[0];
            return r.date === today && r.status === 'confirmed';
        });

        const totalCovers = todayRes.reduce((sum, r) => sum + r.covers, 0);

        return {
            "Pâte à Pizza": Math.ceil(totalCovers * 0.8),
            "Sauce Tomate (L)": Math.ceil(totalCovers * 0.1),
            "Mozzarella coupée (kg)": Math.ceil(totalCovers * 0.15),
            "Garnitures préparées": totalCovers
        };
    }, [reservations]);

    // Recipe CRUD
    const addRecipe = (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'margin'>) => {
        const newRecipe: Recipe = {
            ...recipe,
            id: `recipe_${Date.now()}`,
            margin: recipe.sellingPrice > 0 ? ((recipe.sellingPrice - recipe.costPrice) / recipe.sellingPrice) * 100 : 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        setCustomRecipes(prev => [...prev, newRecipe]);
    };

    const updateRecipe = (id: string, updates: Partial<Recipe>) => {
        setCustomRecipes(prev => prev.map(r => {
            if (r.id === id) {
                const updated = { ...r, ...updates, updatedAt: new Date() };
                // Recalculate margin if prices changed
                if (updates.sellingPrice !== undefined || updates.costPrice !== undefined) {
                    const sp = updates.sellingPrice ?? r.sellingPrice;
                    const cp = updates.costPrice ?? r.costPrice;
                    updated.margin = sp > 0 ? ((sp - cp) / sp) * 100 : 0;
                }
                return updated;
            }
            return r;
        }));
    };

    const deleteRecipe = (id: string) => {
        setCustomRecipes(prev => prev.filter(r => r.id !== id));
    };

    const getRecipeById = (id: string) => {
        return customRecipes.find(r => r.id === id);
    };

    // Prep Task CRUD
    const addPrepTask = (task: Omit<MiseEnPlaceTask, 'id'>) => {
        const newTask: MiseEnPlaceTask = {
            ...task,
            id: `mep_${Date.now()}`,
        };
        setPrepTasks(prev => [...prev, newTask]);
    };

    const updatePrepTask = (id: string, updates: Partial<MiseEnPlaceTask>) => {
        setPrepTasks(prev => prev.map(t =>
            t.id === id ? { ...t, ...updates } : t
        ));
    };

    const deletePrepTask = (id: string) => {
        setPrepTasks(prev => prev.filter(t => t.id !== id));
    };

    const togglePrepTask = (id: string) => {
        setPrepTasks(prev => prev.map(t =>
            t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
        ));
    };

    const assignPrepTask = (taskId: string, staffId: string) => {
        setPrepTasks(prev => prev.map(t =>
            t.id === taskId ? { ...t, assignedTo: staffId } : t
        ));
    };

    const getRecipeSteps = (productId: string) => {
        const product = recipes.find(p => p.id === productId);
        return product?.recipeSteps || [];
    };

    const calculateRecipeCost = (ingredients: RecipeIngredient[]) => {
        return ingredients.reduce((sum, ing) => sum + ing.cost, 0);
    };

    return (
        <RecipeContext.Provider value={{
            recipes,
            customRecipes,
            prepTasks,
            addRecipe,
            updateRecipe,
            deleteRecipe,
            getRecipeById,
            addPrepTask,
            updatePrepTask,
            deletePrepTask,
            togglePrepTask,
            assignPrepTask,
            getRecipeSteps,
            miseEnPlaceTarget,
            calculateRecipeCost,
        }}>
            {children}
        </RecipeContext.Provider>
    );
}

export function useRecipes() {
    const context = useContext(RecipeContext);
    if (!context) throw new Error('useRecipes must be used within RecipeProvider');
    return context;
}
