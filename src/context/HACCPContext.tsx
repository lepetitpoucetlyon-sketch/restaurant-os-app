"use client";

import React, { createContext, useContext, useEffect, useMemo, ReactNode } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import type { SensorReading, HACCPChecklistItem, WasteLog, TemperatureLog } from '@/types';

/**
 * HACCP CONTEXT - Food Safety & Compliance System
 * Simulates IoT sensor readings and manages compliance checklists via Dexie.js.
 */

interface HACCPContextType {
    sensors: SensorReading[];
    checklists: HACCPChecklistItem[];
    updateSensorValue: (id: string, value: number) => Promise<void>;
    toggleChecklistItem: (id: string) => Promise<void>;
    resetDailyChecklist: () => Promise<void>;
    getComplianceScore: () => number;
    criticalAlerts: SensorReading[];
    triggerAlert: (sensorId: string) => Promise<void>;
    logWaste: (data: Omit<WasteLog, 'id' | 'timestamp'>) => Promise<void>;
    temperatureHistory: TemperatureLog[];
}

const INITIAL_SENSORS: SensorReading[] = [
    { id: 'sensor_fridge_a', name: 'Frigo Principal A', type: 'temperature', value: 3.2, unit: '°C', status: 'ok', lastUpdated: new Date(), minThreshold: 0, maxThreshold: 4 },
    { id: 'sensor_freezer_b', name: 'Congélateur B', type: 'temperature', value: -18.5, unit: '°C', status: 'ok', lastUpdated: new Date(), minThreshold: -25, maxThreshold: -18 },
    { id: 'sensor_humidity', name: 'Humidité Cave', type: 'humidity', value: 62, unit: '%', status: 'ok', lastUpdated: new Date(), minThreshold: 50, maxThreshold: 70 },
    { id: 'sensor_air', name: 'Qualité d\'Air', type: 'air_quality', value: 95, unit: 'AQI', status: 'ok', lastUpdated: new Date(), minThreshold: 0, maxThreshold: 100 }
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
    const sensors = useLiveQuery(() => db.sensors.toArray()) || [];
    const checklists = useLiveQuery(() => db.haccpChecklist.toArray()) || [];
    const temperatureHistory = useLiveQuery(() => db.temperatureLogs.orderBy('recordedAt').reverse().limit(50).toArray()) || [];

    // Initial Migration
    useEffect(() => {
        const init = async () => {
            const sensorCount = await db.sensors.count();
            if (sensorCount === 0) await db.sensors.bulkAdd(INITIAL_SENSORS);

            const listCount = await db.haccpChecklist.count();
            if (listCount === 0) await db.haccpChecklist.bulkAdd(INITIAL_CHECKLISTS);
        };
        init();
    }, []);

    // Simulate sensor value fluctuations every 30 seconds
    useEffect(() => {
        if (sensors.length === 0) return;

        const interval = setInterval(async () => {
            for (const sensor of sensors) {
                let variation = 0;
                if (sensor.type === 'temperature') variation = (Math.random() - 0.5) * 0.6;
                else if (sensor.type === 'humidity') variation = (Math.random() - 0.5) * 4;
                else if (sensor.type === 'air_quality') variation = (Math.random() - 0.5) * 6;

                const newValue = parseFloat((sensor.value + variation).toFixed(1));
                let status: 'ok' | 'warning' | 'alert' = 'ok';
                if (sensor.maxThreshold !== undefined && newValue > sensor.maxThreshold) status = 'alert';
                else if (sensor.minThreshold !== undefined && newValue < sensor.minThreshold) status = 'alert';
                else if (sensor.maxThreshold !== undefined && newValue > sensor.maxThreshold * 0.9) status = 'warning';

                await db.sensors.update(sensor.id, {
                    value: newValue,
                    status,
                    lastUpdated: new Date()
                });

                // Record historical log every 5 minutes (simplified for demo: every update)
                await db.temperatureLogs.add({
                    id: `temp_${Date.now()}_${sensor.id}`,
                    storageLocationId: sensor.id,
                    recordedAt: new Date().toISOString(),
                    temperature: newValue,
                    recordedBy: 'System IoT',
                    isCompliant: status !== 'alert',
                    notes: status === 'alert' ? 'Seuil critique dépassé' : undefined
                } as any);
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [sensors]);

    const updateSensorValue = async (id: string, value: number) => {
        await db.sensors.update(id, { value, lastUpdated: new Date() });
    };

    const toggleChecklistItem = async (id: string) => {
        const item = await db.haccpChecklist.get(id);
        if (item) {
            await db.haccpChecklist.update(id, {
                completed: !item.completed,
                completedAt: !item.completed ? new Date() : undefined
            });
        }
    };

    const resetDailyChecklist = async () => {
        await db.haccpChecklist.where('frequency').equals('daily').modify({
            completed: false,
            completedAt: undefined
        });
    };

    const getComplianceScore = (): number => {
        const dailyItems = checklists.filter(c => c.frequency === 'daily');
        const completed = dailyItems.filter(c => c.completed).length;
        return dailyItems.length > 0 ? Math.round((completed / dailyItems.length) * 100) : 0;
    };

    const criticalAlerts = useMemo(() => sensors.filter(s => s.status === 'alert'), [sensors]);

    const triggerAlert = async (sensorId: string) => {
        const sensor = sensors.find(s => s.id === sensorId);
        if (sensor) {
            await db.sensors.update(sensorId, {
                value: (sensor.maxThreshold || 5) + 2,
                status: 'alert',
                lastUpdated: new Date()
            });
        }
    };

    const logWaste = async (data: Omit<WasteLog, 'id' | 'timestamp'>) => {
        await db.wasteLogs.add({
            ...data,
            id: `waste_${Date.now()}`,
            timestamp: new Date().toISOString()
        } as any);
    };

    return (
        <HACCPContext.Provider value={{
            sensors,
            checklists,
            updateSensorValue,
            toggleChecklistItem,
            resetDailyChecklist,
            getComplianceScore,
            criticalAlerts,
            triggerAlert,
            logWaste,
            temperatureHistory
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
