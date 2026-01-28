"use client";

import React, { createContext, useContext, useEffect, useMemo, useCallback, ReactNode } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { PRODUCTS } from '@/lib/mock-data';
import { useReservations } from './ReservationsContext';
import { useInventory } from './InventoryContext';
import type { PrepTask, Product, Recipe, MiseEnPlaceTask, RecipeIngredient } from '@/types';

/**
 * RECIPE & PRODUCTION CONTEXT
 * Manages kitchen production workflow, recipes, prep lists, and task assignments via Dexie.js.
 */

interface RecipeContextType {
    recipes: any[];
    customRecipes: Recipe[];
    prepTasks: MiseEnPlaceTask[];

    // Recipe CRUD
    addRecipe: (recipe: any) => Promise<void>;
    updateRecipe: (id: string, updates: Partial<Recipe>) => Promise<void>;
    deleteRecipe: (id: string) => Promise<void>;
    getRecipeById: (id: string) => Promise<Recipe | undefined>;

    // Prep Tasks CRUD
    addPrepTask: (task: Omit<MiseEnPlaceTask, 'id'>) => Promise<void>;
    updatePrepTask: (id: string, updates: Partial<MiseEnPlaceTask>) => Promise<void>;
    deletePrepTask: (id: string) => Promise<void>;
    togglePrepTask: (id: string) => Promise<void>;
    assignPrepTask: (taskId: string, staffId: string) => Promise<void>;

    // Helpers
    getRecipeSteps: (productId: string) => any[];
    miseEnPlaceTarget: Record<string, number>;
    calculateRecipeCost: (ingredients: any[]) => number;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

const INITIAL_RECIPES: Recipe[] = [
    {
        id: 'recipe_001',
        name: 'Risotto aux Truffes',
        category: 'Plat Principal',
        description: 'Risotto crémeux aux truffes noires du Périgord, une explosion de saveurs automnales.',
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
            { id: 'ing6', name: 'Échalotes', quantity: 2, unit: 'pièces', cost: 0.40 }
        ],
        steps: [
            {
                order: 1,
                instruction: 'Faire suer les échalotes finement ciselées dans le beurre noisette jusqu\'à ce qu\'elles soient translucides.',
                duration: 3,
                imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=800&auto=format&fit=crop'
            },
            {
                order: 2,
                instruction: 'Nacrer le riz Carnaroli pendant 2 minutes en remuant constamment pour enrober chaque grain de matière grasse.',
                duration: 2,
                tip: 'Le riz doit devenir nacré et légèrement translucide sur les bords.',
                imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop'
            },
            {
                order: 3,
                instruction: 'Mouiller avec le bouillon chaud, louche par louche, en attendant que le liquide soit absorbé avant d\'en ajouter davantage.',
                duration: 18,
                temperature: 'Feu moyen',
                videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cooking-a-delicious-rice-dish-40340-large.mp4'
            },
            {
                order: 4,
                instruction: 'Mantecare hors du feu : ajouter le parmesan fraîchement râpé et le beurre très froid pour créer une émulsion crémeuse.',
                duration: 2,
                tip: 'Le choc thermique aide à créer l\'onctuosité caractéristique.',
                imageUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=800&auto=format&fit=crop'
            },
            {
                order: 5,
                instruction: 'Râper la truffe noire fraîche à la mandoline directement sur le risotto fumant au moment du dressage.',
                duration: 1,
                imageUrl: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=800&auto=format&fit=crop'
            }
        ],
        allergens: ['Lactose', 'Gluten'],
        dietaryInfo: ['Végétarien'],
        costPrice: 53.50,
        sellingPrice: 85.00,
        margin: 37,
        color: '#1A1A1A',
        isActive: true,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01')
    },
];

const INITIAL_PREP_TASKS: MiseEnPlaceTask[] = [
    { id: 'mep_001', name: 'Préparer la brunoise de légumes', quantity: 2, unit: 'kg', isCompleted: false, dueDate: new Date(), assignedTo: 'Jean', station: 'Garde-manger', priority: 'high', estimatedTime: 45, notes: 'Carottes, céleri, oignons pour les sauces du soir' },
    { id: 'mep_002', name: 'Tailler les pommes de terre', quantity: 5, unit: 'kg', isCompleted: false, dueDate: new Date(), assignedTo: 'Marie', station: 'Légumerie', priority: 'normal', estimatedTime: 30 },
];

export function RecipeProvider({ children }: { children: ReactNode }) {
    const { reservations } = useReservations();
    const { ingredients: inventoryIngredients } = useInventory();
    const customRecipes = useLiveQuery(() => db.recipes.toArray()) || [];
    const prepTasks = useLiveQuery(() => db.prepTasks.toArray()) || [];

    // Initial Migration
    useEffect(() => {
        const init = async () => {
            const recipeCount = await db.recipes.count();
            if (recipeCount === 0) {
                // Initialize with both INITIAL_RECIPES and PRODUCTS (mapped to Recipe structure)
                const recipesToSeed: Recipe[] = [
                    ...INITIAL_RECIPES,
                    ...PRODUCTS.map(p => ({
                        id: p.id,
                        name: p.name,
                        category: p.categoryId,
                        description: p.description || '',
                        prepTime: (p as any).prepTime || 15,
                        cookTime: (p as any).cookTime || 10,
                        portions: 1,
                        difficulty: 'easy',
                        ingredients: (p.ingredients || []).map(i => ({
                            id: i.ingredientId,
                            name: i.ingredientId, // Best effort name
                            quantity: i.quantity,
                            unit: 'kg',
                            cost: 0
                        })),
                        steps: (p as any).recipeSteps || [
                            { order: 1, instruction: "Préparer les ingrédients frais", duration: 5 },
                            { order: 2, instruction: "Assemblage selon fiche technique", duration: 10 },
                            { order: 3, instruction: "Dressage premium sur assiette chaude", duration: 2 }
                        ],
                        allergens: [],
                        dietaryInfo: [],
                        costPrice: 0,
                        sellingPrice: p.price,
                        margin: 100,
                        color: (p as any).color || '#1A1A1A',
                        isActive: true,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }))
                ] as Recipe[];
                await db.recipes.bulkAdd(recipesToSeed);
            }

            const taskCount = await db.prepTasks.count();
            if (taskCount === 0) await db.prepTasks.bulkAdd(INITIAL_PREP_TASKS);
        };
        init();
    }, []);

    // Unified recipes list: Custom recipes from DB
    const recipes = useMemo(() => {
        return customRecipes;
    }, [customRecipes]);

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
    const addRecipe = async (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'margin'>) => {
        const newRecipe: Recipe = {
            ...recipe,
            id: `recipe_${Date.now()}`,
            margin: recipe.sellingPrice > 0 ? ((recipe.sellingPrice - recipe.costPrice) / recipe.sellingPrice) * 100 : 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        await db.recipes.add(newRecipe);
    };

    const updateRecipe = async (id: string, updates: Partial<Recipe>) => {
        const r = await db.recipes.get(id);

        let baseRecipe: Recipe;
        if (!r) {
            // Find in current recipes list if not in DB yet (fallback for sync issues)
            const found = recipes.find(rec => rec.id === id);
            if (!found) return;
            baseRecipe = found;
        } else {
            baseRecipe = r;
        }

        const updated = { ...baseRecipe, ...updates, updatedAt: new Date() };
        if (updates.sellingPrice !== undefined || updates.costPrice !== undefined) {
            const sp = updates.sellingPrice ?? baseRecipe.sellingPrice;
            const cp = updates.costPrice ?? baseRecipe.costPrice;
            updated.margin = sp > 0 ? ((sp - cp) / sp) * 100 : 0;
        }
        await db.recipes.put(updated);
    };

    const deleteRecipe = async (id: string) => {
        await db.recipes.delete(id);
    };

    const getRecipeById = async (id: string) => {
        return await db.recipes.get(id);
    };

    // Prep Task CRUD
    const addPrepTask = async (task: Omit<MiseEnPlaceTask, 'id'>) => {
        const newTask: MiseEnPlaceTask = {
            ...task,
            id: `mep_${Date.now()}`,
        };
        await db.prepTasks.add(newTask);
    };

    const updatePrepTask = async (id: string, updates: Partial<MiseEnPlaceTask>) => {
        await db.prepTasks.update(id, updates);
    };

    const deletePrepTask = async (id: string) => {
        await db.prepTasks.delete(id);
    };

    const togglePrepTask = async (id: string) => {
        const t = await db.prepTasks.get(id);
        if (t) {
            await db.prepTasks.update(id, { isCompleted: !t.isCompleted });
        }
    };

    const assignPrepTask = async (taskId: string, staffId: string) => {
        await db.prepTasks.update(taskId, { assignedTo: staffId });
    };

    const getRecipeSteps = (productId: string) => {
        const product = recipes.find(p => p.id === productId);
        return (product as any)?.recipeSteps || [];
    };

    const calculateRecipeCost = useCallback((recipeIngredients: any[]) => {
        return recipeIngredients.reduce((sum, ing) => {
            const inventoryItem = inventoryIngredients.find(ii => ii.id === ing.ingredientId);
            const unitCost = inventoryItem?.cost || 0;
            return sum + (unitCost * ing.quantity);
        }, 0);
    }, [inventoryIngredients]);

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
