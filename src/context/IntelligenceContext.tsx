"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type {
    SocialReview,
    ComplianceAlert,
    EquipmentMetric,
    PredictiveAlert,
    ProfitabilityAlert,
    SimulationScenario
} from '@/types';

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

    // 5. Simulator
    scenarios: SimulationScenario[];
    runSimulation: (scenario: Partial<SimulationScenario>) => Promise<SimulationScenario>;
}

const IntelligenceContext = createContext<IntelligenceContextType | undefined>(undefined);

export function IntelligenceProvider({ children }: { children: ReactNode }) {
    // --- Mock Data Initialization ---
    const [reviews, setReviews] = useState<SocialReview[]>([
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
    ]);

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

    const [profitabilityAlerts, setProfitabilityAlerts] = useState<ProfitabilityAlert[]>([
        {
            productId: 'prod_1',
            productName: 'Entrecôte Arg.',
            currentMargin: 22,
            targetMargin: 35,
            status: 'critical',
            suggestedPrice: 32.50
        }
    ]);

    const [scenarios, setScenarios] = useState<SimulationScenario[]>([]);

    // --- Services Implementation ---

    const generateAIReply = async (reviewId: string) => {
        // Mock AI thinking
        await new Promise(r => setTimeout(r, 1500));
        const review = reviews.find(r => r.id === reviewId);
        return `Cher ${review?.author}, nous avons bien pris en compte votre retour concernant ${review?.themes.join(' et ')}. Nous travaillons à nous améliorer.`;
    };

    const validateSchedule = (shifts: any[]) => {
        // Logic would go here. For demo, we just return existing alerts
        return complianceAlerts;
    };

    const runSimulation = async (scenario: Partial<SimulationScenario>) => {
        await new Promise(r => setTimeout(r, 2000));
        const newScenario: SimulationScenario = {
            id: `sim_${Math.random().toString(36).substr(2, 9)}`,
            name: scenario.name || "Simulation sans nom",
            description: scenario.description || "Description",
            inputs: scenario.inputs || {},
            projections: {
                revenueImpact: 15400,
                laborCostImpact: -2100,
                netProfitChange: 13300
            },
            confidenceScore: 0.82
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
            runSimulation
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
