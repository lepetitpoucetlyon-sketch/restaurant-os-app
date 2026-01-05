"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { SensorReading, HACCPChecklistItem } from '@/types';

/**
 * HACCP CONTEXT - Food Safety & Compliance System
 * Simulates IoT sensor readings and manages compliance checklists.
 */

interface HACCPContextType {
    sensors: SensorReading[];
    checklists: HACCPChecklistItem[];
    updateSensorValue: (id: string, value: number) => void;
    toggleChecklistItem: (id: string) => void;
    resetDailyChecklist: () => void;
    getComplianceScore: () => number;
    criticalAlerts: SensorReading[];
}

const INITIAL_SENSORS: SensorReading[] = [
    {
        id: 'sensor_fridge_a',
        name: 'Frigo Principal A',
        type: 'temperature',
        value: 3.2,
        unit: '°C',
        status: 'ok',
        lastUpdated: new Date(),
        minThreshold: 0,
        maxThreshold: 4
    },
    {
        id: 'sensor_freezer_b',
        name: 'Congélateur B',
        type: 'temperature',
        value: -18.5,
        unit: '°C',
        status: 'ok',
        lastUpdated: new Date(),
        minThreshold: -25,
        maxThreshold: -18
    },
    {
        id: 'sensor_humidity',
        name: 'Humidité Cave',
        type: 'humidity',
        value: 62,
        unit: '%',
        status: 'ok',
        lastUpdated: new Date(),
        minThreshold: 50,
        maxThreshold: 70
    },
    {
        id: 'sensor_air',
        name: 'Qualité d\'Air',
        type: 'air_quality',
        value: 95,
        unit: 'AQI',
        status: 'ok',
        lastUpdated: new Date(),
        minThreshold: 0,
        maxThreshold: 100
    }
];

const INITIAL_CHECKLISTS: HACCPChecklistItem[] = [
    { id: 'check_1', task: 'Contrôle températures frigos', frequency: 'daily', completed: false },
    { id: 'check_2', task: 'Nettoyage plans de travail', frequency: 'daily', completed: false },
    { id: 'check_3', task: 'Vérification DLC produits', frequency: 'daily', completed: false },
    { id: 'check_4', task: 'Contrôle huile friteuse', frequency: 'daily', completed: false },
    { id: 'check_5', task: 'Lavage mains personnel', frequency: 'daily', completed: true },
    { id: 'check_6', task: 'Nettoyage hottes', frequency: 'weekly', completed: false },
    { id: 'check_7', task: 'Désinfection chambres froides', frequency: 'weekly', completed: false },
    { id: 'check_8', task: 'Calibration thermomètres', frequency: 'monthly', completed: true },
];

const HACCPContext = createContext<HACCPContextType | undefined>(undefined);

export function HACCPProvider({ children }: { children: ReactNode }) {
    const [sensors, setSensors] = useState<SensorReading[]>(INITIAL_SENSORS);
    const [checklists, setChecklists] = useState<HACCPChecklistItem[]>(INITIAL_CHECKLISTS);

    // Simulate sensor value fluctuations every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setSensors(prev => prev.map(sensor => {
                // Add small random variation
                let variation = 0;
                if (sensor.type === 'temperature') {
                    variation = (Math.random() - 0.5) * 0.6; // ±0.3°C
                } else if (sensor.type === 'humidity') {
                    variation = (Math.random() - 0.5) * 4; // ±2%
                } else if (sensor.type === 'air_quality') {
                    variation = (Math.random() - 0.5) * 6; // ±3 AQI
                }

                const newValue = parseFloat((sensor.value + variation).toFixed(1));

                // Determine status based on thresholds
                let status: 'ok' | 'warning' | 'alert' = 'ok';
                if (sensor.maxThreshold !== undefined && newValue > sensor.maxThreshold) {
                    status = 'alert';
                } else if (sensor.minThreshold !== undefined && newValue < sensor.minThreshold) {
                    status = 'alert';
                } else if (sensor.maxThreshold !== undefined && newValue > sensor.maxThreshold * 0.9) {
                    status = 'warning';
                }

                return {
                    ...sensor,
                    value: newValue,
                    status,
                    lastUpdated: new Date()
                };
            }));
        }, 30000); // Update every 30 seconds

        return () => clearInterval(interval);
    }, []);

    const updateSensorValue = (id: string, value: number) => {
        setSensors(prev => prev.map(sensor =>
            sensor.id === id ? { ...sensor, value, lastUpdated: new Date() } : sensor
        ));
    };

    const toggleChecklistItem = (id: string) => {
        setChecklists(prev => prev.map(item =>
            item.id === id ? {
                ...item,
                completed: !item.completed,
                completedAt: !item.completed ? new Date() : undefined
            } : item
        ));
    };

    const resetDailyChecklist = () => {
        setChecklists(prev => prev.map(item =>
            item.frequency === 'daily' ? { ...item, completed: false, completedAt: undefined } : item
        ));
    };

    const getComplianceScore = (): number => {
        const dailyItems = checklists.filter(c => c.frequency === 'daily');
        const completed = dailyItems.filter(c => c.completed).length;
        return dailyItems.length > 0 ? Math.round((completed / dailyItems.length) * 100) : 0;
    };

    const criticalAlerts = sensors.filter(s => s.status === 'alert');

    return (
        <HACCPContext.Provider value={{
            sensors,
            checklists,
            updateSensorValue,
            toggleChecklistItem,
            resetDailyChecklist,
            getComplianceScore,
            criticalAlerts
        }}>
            {children}
        </HACCPContext.Provider>
    );
}

export function useHACCP() {
    const context = useContext(HACCPContext);
    if (!context) throw new Error('useHACCP must be used within HACCPProvider');
    return context;
}
