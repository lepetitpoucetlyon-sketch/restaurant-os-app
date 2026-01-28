"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback, ReactNode } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Table, TableStatus, Zone, Floor } from '@/types';

/**
 * EXECUTIVE FLOOR MANAGEMENT - Tables, Zones, and Floors Context
 * Manages the dining room layout, table statuses, spatial data, floors, and saved layouts via Dexie.js.
 */

// Layout type for saved configurations
export interface FloorLayout {
    id: string;
    name: string;
    tables: Table[];
    zones: Zone[];
    floors: Floor[];
    createdAt: string;
    isDefault?: boolean;
}

// Default floors for a typical restaurant
const INITIAL_FLOORS: Floor[] = [
    { id: 'rdc', name: 'Rez-de-chaussée', level: 0, description: 'Salle principale', isActive: true, icon: 'home' },
    { id: 'mezzanine', name: 'Mezzanine', level: 1, description: 'Vue en hauteur', isActive: true, icon: 'layers' },
    { id: 'terrasse', name: 'Terrasse', level: 0, description: 'Espace extérieur', isActive: true, icon: 'sun' },
];

const INITIAL_ZONES: Zone[] = [
    { id: 'main', name: 'Salle Principale', color: '#E9ECEF', description: 'Capacité standard', floorId: 'rdc' },
    { id: 'terrace', name: 'Terrasse d\'Été', color: '#E3F2FD', description: 'Vue extérieure', floorId: 'terrasse' },
    { id: 'vip', name: 'Carré VIP', color: '#F3E5F5', description: 'Service premium', floorId: 'mezzanine' },
    { id: 'bar', name: 'Bar & Lounge', color: '#FFF3E0', description: 'Boissons et tapas', floorId: 'rdc' }
];

const INITIAL_TABLES: Table[] = [
    { id: 't1', number: '1', seats: 4, status: 'free', shape: 'rect', x: 100, y: 100, width: 80, height: 80, zoneId: 'main', floorId: 'rdc', revenueToday: 120.50 },
    { id: 't2', number: '2', seats: 2, status: 'reserved', shape: 'circle', x: 250, y: 100, radius: 40, zoneId: 'main', floorId: 'rdc', revenueToday: 45.00 },
    { id: 't3', number: '3', seats: 4, status: 'seated', shape: 'rect', x: 400, y: 100, width: 80, height: 80, zoneId: 'main', floorId: 'rdc', revenueToday: 210.00 },
    { id: 't4', number: '4', seats: 6, status: 'free', shape: 'rect', x: 100, y: 250, width: 120, height: 80, zoneId: 'main', floorId: 'rdc' },
    { id: 't5', number: 'V1', seats: 2, status: 'eating', shape: 'circle', x: 150, y: 100, radius: 45, zoneId: 'vip', floorId: 'mezzanine', revenueToday: 350.00 },
    { id: 't6', number: 'V2', seats: 8, status: 'reserved', shape: 'rect', x: 150, y: 250, width: 180, height: 90, zoneId: 'vip', floorId: 'mezzanine' },
    { id: 't7', number: 'T1', seats: 2, status: 'free', shape: 'circle', x: 100, y: 100, radius: 35, zoneId: 'terrace', floorId: 'terrasse' },
    { id: 't8', number: 'T2', seats: 2, status: 'paying', shape: 'circle', x: 250, y: 100, radius: 35, zoneId: 'terrace', floorId: 'terrasse' },
];

interface TablesContextType {
    tables: Table[];
    zones: Zone[];
    floors: Floor[];
    currentFloorId: string;
    isLoading: boolean;

    // Floor Management
    setCurrentFloor: (floorId: string) => void;
    addFloor: (floor: Omit<Floor, 'id'>) => void;
    updateFloor: (id: string, updates: Partial<Floor>) => void;
    deleteFloor: (id: string) => void;
    getTablesForFloor: (floorId: string) => Table[];
    getZonesForFloor: (floorId: string) => Zone[];

    // Table Operations
    updateTableStatus: (id: string, status: TableStatus) => Promise<void>;
    updateTablePosition: (id: string, x: number, y: number) => Promise<void>;
    addTable: (table: Omit<Table, 'id'>) => Promise<void>;
    deleteTable: (id: string) => Promise<void>;
    updateTable: (id: string, updates: Partial<Table>) => Promise<void>;
    getTableById: (id: string) => Promise<Table | undefined>;

    // Zone Management
    addZone: (zone: Omit<Zone, 'id'>) => void;
    updateZone: (id: string, updates: Partial<Zone>) => void;
    deleteZone: (id: string) => void;
    resetToTemplate: (templateName: string) => Promise<void>;

    // Layout Management
    savedLayouts: FloorLayout[];
    currentLayoutId: string | null;
    saveCurrentLayout: (name: string) => Promise<void>;
    loadLayout: (layoutId: string) => Promise<void>;
    deleteLayout: (layoutId: string) => Promise<void>;
    renameLayout: (layoutId: string, newName: string) => Promise<void>;

    // Global Settings
    isZonesLocked: boolean;
    toggleZonesLock: () => void;
}

const TablesContext = createContext<TablesContextType | undefined>(undefined);

const LAYOUTS_STORAGE_KEY = 'restaurant_floor_layouts';
const CURRENT_LAYOUT_KEY = 'restaurant_current_layout';
const ZONES_LOCK_KEY = 'restaurant_zones_lock';
const FLOORS_STORAGE_KEY = 'restaurant_floors';
const CURRENT_FLOOR_KEY = 'restaurant_current_floor';
const ZONES_STORAGE_KEY = 'executive_floor_zones';

export function TablesProvider({ children }: { children: ReactNode }) {
    // 1. Reactive Queries using useLiveQuery
    const tables = useLiveQuery(() => db.diningTables.toArray()) || [];

    // Floors state
    const [floors, setFloors] = useState<Floor[]>(INITIAL_FLOORS);
    const [currentFloorId, setCurrentFloorId] = useState<string>('rdc');

    // Zones state
    const zonesFromLS = typeof window !== 'undefined' ? localStorage.getItem(ZONES_STORAGE_KEY) : null;
    const [zones, setZones] = useState<Zone[]>(zonesFromLS ? JSON.parse(zonesFromLS) : INITIAL_ZONES);

    const isLoading = !tables.length && INITIAL_TABLES.length > 0;

    // Layouts state
    const [savedLayouts, setSavedLayouts] = useState<FloorLayout[]>([]);
    const [currentLayoutId, setCurrentLayoutId] = useState<string | null>(null);
    const [isZonesLocked, setIsZonesLocked] = useState(true);

    // Load saved data from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Load floors
            const floorsData = localStorage.getItem(FLOORS_STORAGE_KEY);
            if (floorsData) {
                setFloors(JSON.parse(floorsData));
            }

            // Load current floor
            const savedFloorId = localStorage.getItem(CURRENT_FLOOR_KEY);
            if (savedFloorId) {
                setCurrentFloorId(savedFloorId);
            }

            // Load zones
            const zonesData = localStorage.getItem(ZONES_STORAGE_KEY);
            if (zonesData) {
                setZones(JSON.parse(zonesData));
            }

            // Load layouts
            const layoutsData = localStorage.getItem(LAYOUTS_STORAGE_KEY);
            if (layoutsData) {
                setSavedLayouts(JSON.parse(layoutsData));
            }
            const currentId = localStorage.getItem(CURRENT_LAYOUT_KEY);
            if (currentId) {
                setCurrentLayoutId(currentId);
            }
            const lockStatus = localStorage.getItem(ZONES_LOCK_KEY);
            if (lockStatus !== null) {
                setIsZonesLocked(lockStatus === 'true');
            }
        }
    }, []);

    // Save floors to localStorage when they change
    useEffect(() => {
        if (typeof window !== 'undefined' && floors.length > 0) {
            localStorage.setItem(FLOORS_STORAGE_KEY, JSON.stringify(floors));
        }
    }, [floors]);

    // Save zones to localStorage when they change
    useEffect(() => {
        if (typeof window !== 'undefined' && zones.length > 0) {
            localStorage.setItem(ZONES_STORAGE_KEY, JSON.stringify(zones));
        }
    }, [zones]);

    const toggleZonesLock = () => {
        setIsZonesLocked(prev => {
            const next = !prev;
            localStorage.setItem(ZONES_LOCK_KEY, String(next));
            return next;
        });
    };

    // 2. Initial Migration from LocalStorage to Dexie
    useEffect(() => {
        const checkAndMigrate = async () => {
            const count = await db.diningTables.count();
            if (count === 0) {
                const savedTables = localStorage.getItem('executive_floor_plan');
                if (savedTables) {
                    const loaded = JSON.parse(savedTables);
                    const migrated = loaded.map((t: any) => ({
                        ...t,
                        zoneId: t.zoneId || t.zone || 'main',
                        floorId: t.floorId || 'rdc'
                    }));
                    await db.diningTables.bulkAdd(migrated);
                } else {
                    await db.diningTables.bulkAdd(INITIAL_TABLES);
                }
            }
        };
        checkAndMigrate();
    }, []);

    // ==========================================
    // FLOOR OPERATIONS
    // ==========================================

    const setCurrentFloor = (floorId: string) => {
        setCurrentFloorId(floorId);
        localStorage.setItem(CURRENT_FLOOR_KEY, floorId);
    };

    const addFloor = (floorData: Omit<Floor, 'id'>) => {
        const newFloor: Floor = {
            ...floorData,
            id: `floor_${Date.now()}`
        };
        setFloors(prev => [...prev, newFloor]);
    };

    const updateFloor = (id: string, updates: Partial<Floor>) => {
        setFloors(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const deleteFloor = (id: string) => {
        // Don't delete if it's the only floor
        if (floors.length <= 1) return;

        setFloors(prev => prev.filter(f => f.id !== id));

        // If deleting current floor, switch to first available
        if (currentFloorId === id) {
            const remaining = floors.filter(f => f.id !== id);
            if (remaining.length > 0) {
                setCurrentFloor(remaining[0].id);
            }
        }
    };

    const getTablesForFloor = (floorId: string): Table[] => {
        return tables.filter(t => t.floorId === floorId || (!t.floorId && floorId === 'rdc'));
    };

    const getZonesForFloor = (floorId: string): Zone[] => {
        return zones.filter(z => z.floorId === floorId || (!z.floorId && floorId === 'rdc'));
    };

    // ==========================================
    // TABLE OPERATIONS
    // ==========================================

    const updateTableStatus = async (id: string, status: TableStatus) => {
        await db.diningTables.update(id, {
            status,
            lastService: new Date().toISOString()
        });
    };

    const updateTablePosition = async (id: string, x: number, y: number) => {
        await db.diningTables.update(id, { x, y });
    };

    const addTable = async (tableData: Omit<Table, 'id'>) => {
        const id = `t_${Math.random().toString(36).substr(2, 9)}`;
        // Ensure the table is added to the current floor if not specified
        const floorId = tableData.floorId || currentFloorId;
        await db.diningTables.add({ ...tableData, id, floorId } as Table);
    };

    const deleteTable = async (id: string) => {
        await db.diningTables.delete(id);
    };

    const getTableById = async (id: string) => {
        return await db.diningTables.get(id);
    };

    const updateTable = async (id: string, updates: Partial<Table>) => {
        await db.diningTables.update(id, updates);
    };

    const resetToTemplate = async (templateName: string) => {
        const templates: Record<string, Table[]> = {
            'standard': INITIAL_TABLES.filter(t => t.floorId === currentFloorId),
            'banquet': [
                { id: 'b1', number: 'A', seats: 12, status: 'free', shape: 'rect', x: 200, y: 150, width: 300, height: 100, zoneId: 'main', floorId: currentFloorId },
                { id: 'b2', number: 'B', seats: 12, status: 'free', shape: 'rect', x: 200, y: 350, width: 300, height: 100, zoneId: 'main', floorId: currentFloorId },
            ],
            'intimate': [
                { id: 'i1', number: '1', seats: 2, status: 'free', shape: 'circle', x: 150, y: 150, radius: 45, zoneId: 'main', floorId: currentFloorId },
                { id: 'i2', number: '2', seats: 2, status: 'free', shape: 'circle', x: 350, y: 150, radius: 45, zoneId: 'main', floorId: currentFloorId },
                { id: 'i3', number: '3', seats: 2, status: 'free', shape: 'circle', x: 550, y: 150, radius: 45, zoneId: 'main', floorId: currentFloorId },
                { id: 'i4', number: '4', seats: 2, status: 'free', shape: 'circle', x: 150, y: 350, radius: 45, zoneId: 'main', floorId: currentFloorId },
            ]
        };

        const template = templates[templateName];
        if (template) {
            // Only clear tables for current floor
            await db.transaction('rw', db.diningTables, async () => {
                const tablesToDelete = tables.filter(t => t.floorId === currentFloorId);
                await Promise.all(tablesToDelete.map(t => db.diningTables.delete(t.id)));
                await db.diningTables.bulkAdd(template);
            });
        }
    };

    // Layout Management Functions
    const saveCurrentLayout = async (name: string) => {
        const currentTables = await db.diningTables.toArray();
        const newLayout: FloorLayout = {
            id: `layout_${Date.now()}`,
            name,
            tables: currentTables.map(t => ({
                ...t,
                status: 'free' as TableStatus,
                revenueToday: 0
            })),
            zones: zones,
            floors: floors,
            createdAt: new Date().toISOString(),
        };

        const updatedLayouts = [...savedLayouts, newLayout];
        setSavedLayouts(updatedLayouts);
        setCurrentLayoutId(newLayout.id);
        localStorage.setItem(LAYOUTS_STORAGE_KEY, JSON.stringify(updatedLayouts));
        localStorage.setItem(CURRENT_LAYOUT_KEY, newLayout.id);
    };

    const loadLayout = async (layoutId: string) => {
        const layout = savedLayouts.find(l => l.id === layoutId);
        if (layout) {
            await db.transaction('rw', db.diningTables, async () => {
                await db.diningTables.clear();
                const tablesWithNewIds = layout.tables.map((t, idx) => ({
                    ...t,
                    id: `t_${Math.random().toString(36).substr(2, 9)}_${idx}`,
                    status: 'free' as TableStatus
                }));
                await db.diningTables.bulkAdd(tablesWithNewIds);
            });

            // Restore floors and zones
            if (layout.floors) {
                setFloors(layout.floors);
            }
            if (layout.zones) {
                setZones(layout.zones);
            }

            setCurrentLayoutId(layoutId);
            localStorage.setItem(CURRENT_LAYOUT_KEY, layoutId);
        }
    };

    const deleteLayout = async (layoutId: string) => {
        const updatedLayouts = savedLayouts.filter(l => l.id !== layoutId);
        setSavedLayouts(updatedLayouts);
        localStorage.setItem(LAYOUTS_STORAGE_KEY, JSON.stringify(updatedLayouts));
        if (currentLayoutId === layoutId) {
            setCurrentLayoutId(null);
            localStorage.removeItem(CURRENT_LAYOUT_KEY);
        }
    };

    const renameLayout = async (layoutId: string, newName: string) => {
        const updatedLayouts = savedLayouts.map(l =>
            l.id === layoutId ? { ...l, name: newName } : l
        );
        setSavedLayouts(updatedLayouts);
        localStorage.setItem(LAYOUTS_STORAGE_KEY, JSON.stringify(updatedLayouts));
    };

    // ZONE OPERATIONS
    const addZone = (zoneData: Omit<Zone, 'id'>) => {
        const newZone: Zone = {
            ...zoneData,
            id: `zone_${Date.now()}`,
            floorId: zoneData.floorId || currentFloorId
        };
        setZones(prev => [...prev, newZone]);
    };

    const updateZone = (id: string, updates: Partial<Zone>) => {
        setZones(prev => prev.map(z => z.id === id ? { ...z, ...updates } : z));
    };

    const deleteZone = (id: string) => {
        setZones(prev => prev.filter(z => z.id !== id));
    };

    const contextValue = useMemo(() => ({
        tables,
        zones,
        floors,
        currentFloorId,
        isLoading,

        // Floor operations
        setCurrentFloor,
        addFloor,
        updateFloor,
        deleteFloor,
        getTablesForFloor,
        getZonesForFloor,

        // Table operations
        updateTableStatus,
        updateTablePosition,
        updateTable,
        addTable,
        deleteTable,
        getTableById,

        // Zone operations
        addZone,
        updateZone,
        deleteZone,
        resetToTemplate,

        // Layout functions
        savedLayouts,
        currentLayoutId,
        saveCurrentLayout,
        loadLayout,
        deleteLayout,
        renameLayout,

        // Global Settings
        isZonesLocked,
        toggleZonesLock,
    }), [
        tables,
        zones,
        floors,
        currentFloorId,
        isLoading,
        savedLayouts,
        currentLayoutId,
        isZonesLocked,
    ]);

    return (
        <TablesContext.Provider value={contextValue}>
            {children}
        </TablesContext.Provider>
    );
}

export function useTables() {
    const context = useContext(TablesContext);
    if (!context) throw new Error('useTables must be used within TablesProvider');
    return context;
}
