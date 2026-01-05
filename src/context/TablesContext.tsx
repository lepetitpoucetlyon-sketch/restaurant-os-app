"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * EXECUTIVE FLOOR MANAGEMENT - Tables and Zones Context
 * Manages the dining room layout, table statuses, and spatial data.
 */

import { Table, TableStatus, TableShape, Zone, ZoneId } from '@/types';

const INITIAL_ZONES: Zone[] = [
    { id: 'main', name: 'Salle Principale', color: '#E9ECEF', description: 'Capacité standard' },
    { id: 'terrace', name: 'Terrasse d\'Été', color: '#E3F2FD', description: 'Vue extérieure' },
    { id: 'vip', name: 'Carré VIP', color: '#F3E5F5', description: 'Service premium' },
    { id: 'bar', name: 'Bar & Lounge', color: '#FFF3E0', description: 'Boissons et tapas' }
];

const INITIAL_TABLES: Table[] = [
    // MAIN HALL
    { id: 't1', number: '1', seats: 4, status: 'free', shape: 'rect', x: 100, y: 100, width: 80, height: 80, zoneId: 'main', revenueToday: 120.50 },
    { id: 't2', number: '2', seats: 2, status: 'reserved', shape: 'circle', x: 250, y: 100, radius: 40, zoneId: 'main', revenueToday: 45.00 },
    { id: 't3', number: '3', seats: 4, status: 'seated', shape: 'rect', x: 400, y: 100, width: 80, height: 80, zoneId: 'main', revenueToday: 210.00 },
    { id: 't4', number: '4', seats: 6, status: 'free', shape: 'rect', x: 100, y: 250, width: 120, height: 80, zoneId: 'main' },

    // VIP SECTION
    { id: 't5', number: 'V1', seats: 2, status: 'eating', shape: 'circle', x: 600, y: 100, radius: 45, zoneId: 'vip', revenueToday: 350.00 },
    { id: 't6', number: 'V2', seats: 8, status: 'reserved', shape: 'rect', x: 550, y: 250, width: 180, height: 90, zoneId: 'vip' },

    // TERRACE
    { id: 't7', number: 'T1', seats: 2, status: 'free', shape: 'circle', x: 100, y: 450, radius: 35, zoneId: 'terrace' },
    { id: 't8', number: 'T2', seats: 2, status: 'paying', shape: 'circle', x: 250, y: 450, radius: 35, zoneId: 'terrace' },
];

interface TablesContextType {
    tables: Table[];
    zones: Zone[];
    updateTableStatus: (id: string, status: TableStatus) => void;
    updateTablePosition: (id: string, x: number, y: number) => void;
    addTable: (table: Omit<Table, 'id'>) => void;
    deleteTable: (id: string) => void;
    updateTable: (id: string, updates: Partial<Table>) => void;
    getTableById: (id: string) => Table | undefined;

    // Zone Management
    addZone: (zone: Omit<Zone, 'id'>) => void;
    updateZone: (id: string, updates: Partial<Zone>) => void;
    deleteZone: (id: string) => void;
}

const TablesContext = createContext<TablesContextType | undefined>(undefined);

export function TablesProvider({ children }: { children: ReactNode }) {
    const [tables, setTables] = useState<Table[]>([]);
    const [zones, setZones] = useState<Zone[]>([]);

    // LOADING PERSISTENT MAP
    useEffect(() => {
        const savedTables = localStorage.getItem('executive_floor_plan');
        const savedZones = localStorage.getItem('executive_floor_zones');

        if (savedTables) {
            // Migration logic: convert old `zone` string to `zoneId` if needed
            const loaded = JSON.parse(savedTables);
            const migrated = loaded.map((t: any) => ({
                ...t,
                zoneId: t.zoneId || t.zone || 'main' // Fallback
            }));
            setTables(migrated);
        } else {
            setTables(INITIAL_TABLES);
        }

        if (savedZones) {
            setZones(JSON.parse(savedZones));
        } else {
            setZones(INITIAL_ZONES);
        }
    }, []);

    // AUTO-SAVE EFFECT
    useEffect(() => {
        if (tables.length > 0) {
            localStorage.setItem('executive_floor_plan', JSON.stringify(tables));
        }
    }, [tables]);

    useEffect(() => {
        if (zones.length > 0) {
            localStorage.setItem('executive_floor_zones', JSON.stringify(zones));
        }
    }, [zones]);

    const updateTableStatus = (id: string, status: TableStatus) => {
        setTables(prev => prev.map(t => t.id === id ? { ...t, status, lastService: new Date().toISOString() } : t));
    };

    const updateTablePosition = (id: string, x: number, y: number) => {
        setTables(prev => prev.map(t => t.id === id ? { ...t, x, y } : t));
    };

    const addTable = (tableData: Omit<Table, 'id'>) => {
        const newTable = {
            ...tableData,
            id: `t_${Math.random().toString(36).substr(2, 9)}`,
        };
        setTables(prev => [...prev, newTable]);
    };

    const deleteTable = (id: string) => {
        setTables(prev => prev.filter(t => t.id !== id));
    };

    const getTableById = (id: string) => tables.find(t => t.id === id);

    const updateTable = (id: string, updates: Partial<Table>) => {
        setTables(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    };

    // ZONE OPERATIONS
    const addZone = (zoneData: Omit<Zone, 'id'>) => {
        const newZone = {
            ...zoneData,
            id: `z_${Math.random().toString(36).substr(2, 9)}`,
        };
        setZones(prev => [...prev, newZone]);
    };

    const updateZone = (id: string, updates: Partial<Zone>) => {
        setZones(prev => prev.map(z => z.id === id ? { ...z, ...updates } : z));
    };

    const deleteZone = (id: string) => {
        // Prevent deleting last zone or check constraints if needed
        setZones(prev => prev.filter(z => z.id !== id));
    };

    return (
        <TablesContext.Provider value={{
            tables,
            zones,
            updateTableStatus,
            updateTablePosition,
            updateTable,
            addTable,
            deleteTable,
            getTableById,
            addZone,
            updateZone,
            deleteZone
        }}>
            {children}
        </TablesContext.Provider>
    );
}

export function useTables() {
    const context = useContext(TablesContext);
    if (!context) throw new Error('useTables must be used within TablesProvider');
    return context;
}
