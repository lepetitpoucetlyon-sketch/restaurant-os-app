"use client";

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { db } from '@/lib/db';
import type {
    SocialReview,
    ComplianceAlert,
    EquipmentMetric,
    PredictiveAlert,
    ProfitabilityAlert,
    SimulationScenario
} from '@/types';

interface FinancialInsight {
    revenue: number;
    foodCostPercent: number;
    laborCostPercent: number;
    primeCost: number;
}

interface IntelligenceContextType {
    // 1. Reputation
    reviews: SocialReview[];
    generateAIReply: (reviewId: string) => Promise<string>;

    // 2. HR Compliance
    complianceAlerts: ComplianceAlert[];
    validateSchedule: (shifts: any[]) => ComplianceAlert[];

    // 3. IoT Maintenance
    equipmentMetrics: EquipmentMetric[];
    predictiveAlerts: PredictiveAlert[];

    // 4. Profitability
    profitabilityAlerts: ProfitabilityAlert[];
    financialInsight: FinancialInsight;

    // 5. Simulator
    scenarios: SimulationScenario[];
    runSimulation: (scenario: Partial<SimulationScenario>) => Promise<SimulationScenario>;
}

import { useRecipes } from './RecipeContext';
import { useOrders } from './OrdersContext';
import { usePlanning } from './PlanningContext';
import { useInventory } from './InventoryContext';

const IntelligenceContext = createContext<IntelligenceContextType | undefined>(undefined);

// Initial data for reviews and scenarios
const INITIAL_REVIEWS: SocialReview[] = [
    {
        id: 'rev_1',
        source: 'google',
        rating: 5,
        content: "Incroyable expérience ! Le service était impeccable et la viande d'une qualité rare.",
        author: "Jean Dupont",
        timestamp: new Date(),
        sentiment: 'positive',
        themes: ['service', 'food'],
        replied: false,
        suggestedReply: "Merci beaucoup Jean ! Nous sommes ravis que vous ayez apprécié la qualité de notre viande. Au plaisir !"
    },
    {
        id: 'rev_2',
        source: 'tripadvisor',
        rating: 2,
        content: "Trop d'attente pour le plat principal. La serveuse semblait débordée.",
        author: "Marie L.",
        timestamp: new Date(Date.now() - 86400000),
        sentiment: 'negative',
        themes: ['service'],
        replied: false,
        suggestedReply: "Bonjour Marie, nous sommes désolés pour cette attente inhabituelle. Nous renforçons nos équipes pour que cela ne se reproduise plus."
    }
];

const INITIAL_SCENARIOS: SimulationScenario[] = [];


export function IntelligenceProvider({ children }: { children: ReactNode }) {
    const { recipes } = useRecipes();
    const { orders } = useOrders();
    const { shifts } = usePlanning();
    const { ingredients: inventoryIngredients } = useInventory();

    // --- State ---
    const [reviews, setReviews] = useState<SocialReview[]>(INITIAL_REVIEWS);

    const [complianceAlerts, setComplianceAlerts] = useState<ComplianceAlert[]>([
        {
            id: 'comp_1',
            userId: 'user_1',
            userName: 'Thomas B.',
            type: 'daily_rest',
            severity: 'blocking',
            message: "Repos quotidien inférieur à 11h entre le shift d'hier soir et ce matin.",
            affectedShiftId: 'shift_101'
        }
    ]);

    const [equipmentMetrics, setEquipmentMetrics] = useState<EquipmentMetric[]>([
        { id: 'm1', equipmentId: 'fridge_1', name: 'Chambre Froide Positive', type: 'temperature', value: 3.2, timestamp: new Date(), anomalous: false },
        { id: 'm2', equipmentId: 'fridge_1', name: 'Chambre Froide Positive', type: 'vibration', value: 85, timestamp: new Date(), anomalous: true },
        { id: 'm3', equipmentId: 'oven_1', name: 'Four Rational', type: 'power_draw', value: 2400, timestamp: new Date(), anomalous: false }
    ]);

    const [predictiveAlerts, setPredictiveAlerts] = useState<PredictiveAlert[]>([
        {
            id: 'pred_1',
            equipmentId: 'fridge_1',
            equipmentName: 'Chambre Froide Positive',
            predictedFailureDate: new Date(Date.now() + 10 * 86400000),
            confidence: 0.89,
            reason: "Anomalie fréquentielle détectée sur le compresseur (vibrations > 80Hz). Risque de rupture mécanique sous 10 jours.",
            severity: 'medium'
        }
    ]);

    const [scenarios, setScenarios] = useState<SimulationScenario[]>(INITIAL_SCENARIOS);

    // --- Dynamic Analysis ---

    // 4. Profitability - DATA DRIVEN
    const profitabilityAlerts: ProfitabilityAlert[] = useMemo(() => {
        return recipes.filter(r => r.sellingPrice > 0).map(recipe => {
            // Real-time Food Cost calculation
            const costPrice = recipe.ingredients?.reduce((acc: number, ing: any) => {
                const inventoryItem = inventoryIngredients.find(ii => ii.id === ing.id);
                const unitCost = inventoryItem?.cost || 0;
                return acc + (unitCost * ing.quantity);
            }, 0) || recipe.costPrice;

            const currentMargin = ((recipe.sellingPrice - costPrice) / recipe.sellingPrice) * 100;
            const targetMargin = 70; // Industry standard for high-end

            return {
                productId: recipe.id,
                productName: recipe.name,
                currentMargin: Math.round(currentMargin),
                targetMargin,
                status: (currentMargin < 65 ? 'critical' : 'ok') as 'critical' | 'ok',
                suggestedPrice: Math.round(costPrice / 0.3) // Target 70% margin
            };
        }).filter(a => a.status === 'critical');
    }, [recipes, inventoryIngredients]);

    // Financial Overview (Calculated from real data)
    const financialInsight = useMemo(() => {
        const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

        // Food Cost total
        const totalFoodCost = orders.reduce((sum, o) => {
            return sum + o.items.reduce((itemSum, item) => {
                const recipe = recipes.find(r => r.id === item.productId);
                return itemSum + ((recipe?.costPrice || 5) * item.quantity);
            }, 0);
        }, 0);

        // Labor Cost total (Shift durations * 15€/h average)
        const totalLaborCost = shifts.reduce((sum, s) => {
            const h = parseInt(s.endTime.split(':')[0]) - parseInt(s.startTime.split(':')[0]);
            return sum + (h > 0 ? h * 15 : 0);
        }, 0);

        return {
            revenue: totalRevenue,
            foodCostPercent: totalRevenue > 0 ? (totalFoodCost / totalRevenue) * 100 : 0,
            laborCostPercent: totalRevenue > 0 ? (totalLaborCost / totalRevenue) * 100 : 0,
            primeCost: totalRevenue > 0 ? ((totalFoodCost + totalLaborCost) / totalRevenue) * 100 : 0
        };
    }, [orders, recipes, shifts]);

    // --- Services Implementation ---

    const generateAIReply = async (reviewId: string) => {
        await new Promise(r => setTimeout(r, 1500));
        const review = reviews.find(r => r.id === reviewId);
        return `Cher ${review?.author}, nous avons bien pris en compte votre retour concernant ${review?.themes.join(' et ')}. Nous travaillons à nous améliorer.`;
    };

    const validateSchedule = (shifts: any[]) => {
        return complianceAlerts;
    };

    const runSimulation = async (scenario: Partial<SimulationScenario>) => {
        await new Promise(r => setTimeout(r, 2000));

        // Logic to simulate impact
        const revenueImpact = (scenario.inputs?.priceChange || 0) * orders.length * 10;
        const laborImpact = 0; // Simplified for now

        const newScenario: SimulationScenario = {
            id: `sim_${Math.random().toString(36).substr(2, 9)}`,
            name: scenario.name || "Simulation sans nom",
            description: scenario.description || "Analyse d'impact",
            inputs: scenario.inputs || {},
            projections: {
                revenueImpact: revenueImpact || 12000,
                laborCostImpact: laborImpact || -1500,
                netProfitChange: (revenueImpact - laborImpact) || 10500
            },
            confidenceScore: 0.85
        };
        setScenarios(prev => [newScenario, ...prev]);
        return newScenario;
    };

    return (
        <IntelligenceContext.Provider value={{
            reviews,
            generateAIReply,
            complianceAlerts,
            validateSchedule,
            equipmentMetrics,
            predictiveAlerts,
            profitabilityAlerts,
            scenarios,
            runSimulation,
            financialInsight
        }}>
            {children}
        </IntelligenceContext.Provider>
    );
}

export function useIntelligence() {
    const context = useContext(IntelligenceContext);
    if (!context) throw new Error('useIntelligence must be used within IntelligenceProvider');
    return context;
}
