"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { User, UserRole } from '@/types';
export type { User, UserRole };

/**
 * EXECUTIVE AUTH SYSTEM - Core Authentication Context
 * Manages user roles, PIN-based login, session persistence via Dexie.js.
 */

// All available navigation categories
export const ALL_CATEGORIES = [
    'dashboard', 'pos', 'floor-plan', 'reservations', 'kitchen', 'inventory', 'kds',
    'staff', 'crm', 'onboarding', 'planning', 'analytics', 'haccp', 'accounting',
    'settings', 'account-settings',
] as const;

export type CategoryKey = typeof ALL_CATEGORIES[number];

// Role labels in French
export const ROLE_LABELS: Record<UserRole, string> = {
    'admin': 'Administrateur',
    'manager': 'Directeur',
    'floor_manager': 'Responsable de salle',
    'server': 'Serveur(se)',
    'bartender': 'Barman/Barmaid',
    'kitchen_chef': 'Chef de cuisine',
    'kitchen_line': 'Commis de cuisine',
    'host': 'Hôte(sse) d\'accueil',
    'cashier': 'Caissier(ère)',
};

export const ROLE_LEVELS: Record<UserRole, number> = {
    'admin': 100,
    'manager': 90,
    'floor_manager': 70,
    'kitchen_chef': 70,
    'bartender': 40,
    'server': 30,
    'host': 30,
    'kitchen_line': 20,
    'cashier': 20,
};

// Action permissions mapping
export const ACTION_PERMISSIONS: Record<string, number> = {
    'delete_employee': 90,
    'modify_salary': 90,
    'view_salaries': 70,
    'delete_client': 70,
    'modify_recipe_cost': 70,
    'approve_leave': 70,
    'publish_planning': 70,
    'manual_stock_adjustment': 40,
    'delete_order': 90,
    'apply_large_discount': 70,
};

// Category labels in French
export const CATEGORY_LABELS: Record<CategoryKey, string> = {
    'dashboard': 'Tableau de bord',
    'pos': 'Point de Vente (POS)',
    'floor-plan': 'Plan de salle',
    'reservations': 'Réservations',
    'kitchen': 'Production Cuisine',
    'inventory': 'Stocks & Inventaire',
    'kds': 'Kitchen Display (KDS)',
    'staff': 'Gestion Équipe & RH',
    'crm': 'CRM & Clients',
    'onboarding': 'Prise de Poste',
    'planning': 'Planning & Horaires',
    'analytics': 'Analyses & Rapports',
    'haccp': 'Hygiène & HACCP',
    'accounting': 'Comptabilité & Factures',
    'settings': 'Paramètres Système',
    'account-settings': 'Mon profil & Sécurité',
};

// Default permissions per role
export type RolePermissions = Record<UserRole, CategoryKey[]>;

const DEFAULT_ROLE_PERMISSIONS: RolePermissions = {
    'admin': [...ALL_CATEGORIES],
    'manager': ['dashboard', 'pos', 'floor-plan', 'reservations', 'kitchen', 'crm', 'inventory', 'kds', 'staff', 'onboarding', 'planning', 'analytics', 'haccp', 'accounting', 'settings', 'account-settings'],
    'floor_manager': ['dashboard', 'pos', 'floor-plan', 'reservations', 'crm', 'staff', 'onboarding', 'planning', 'account-settings'],
    'server': ['dashboard', 'pos', 'floor-plan', 'reservations', 'onboarding', 'account-settings'],
    'bartender': ['dashboard', 'pos', 'inventory', 'onboarding', 'account-settings'],
    'kitchen_chef': ['dashboard', 'kitchen', 'inventory', 'kds', 'haccp', 'onboarding', 'planning', 'account-settings'],
    'kitchen_line': ['dashboard', 'kitchen', 'kds', 'onboarding', 'account-settings'],
    'host': ['dashboard', 'reservations', 'floor-plan', 'crm', 'onboarding', 'account-settings'],
    'cashier': ['dashboard', 'pos', 'accounting', 'crm', 'onboarding', 'account-settings'],
};


export const MOCK_USERS: User[] = [
    { id: 'user_1', name: 'Alexandre De Rossi', pin: '0000', role: 'admin', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80', performanceScore: 5.0, accessLevel: 10 },
    { id: 'user_2', name: 'Marie Laurent', pin: '0000', role: 'manager', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', performanceScore: 4.8, accessLevel: 8 },
    { id: 'user_3', name: 'Sophie Martin', pin: '0000', role: 'server', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', performanceScore: 4.6, accessLevel: 3 },
    { id: 'user_4', name: 'Vincent Moreau', pin: '0000', role: 'kitchen_chef', avatar: 'https://images.unsplash.com/photo-1577214495773-5146b4038a8a?w=100&q=80', performanceScore: 4.9, accessLevel: 7 },
    { id: 'user_5', name: 'Marco Rossi', pin: '0000', role: 'bartender', avatar: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=100&q=80', performanceScore: 4.5, accessLevel: 5 },
    { id: 'user_6', name: 'Clara Leroy', pin: '0000', role: 'floor_manager', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80', performanceScore: 4.7, accessLevel: 6 },
    { id: 'user_7', name: 'Thomas Bernard', pin: '0000', role: 'host', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', performanceScore: 4.4, accessLevel: 4 },
    { id: 'user_8', name: 'Julie Dubois', pin: '0000', role: 'kitchen_line', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80', performanceScore: 4.3, accessLevel: 4 },
    { id: 'user_9', name: 'Nicolas Petit', pin: '0000', role: 'cashier', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', performanceScore: 4.5, accessLevel: 4 },
];

interface AuthContextType {
    currentUser: User | null;
    isAuthenticated: boolean;
    isAuthLoading: boolean;
    login: (pin: string) => Promise<boolean>;
    loginAsUser: (userId: string) => Promise<boolean>;
    logout: () => void;
    users: User[];
    updateUserStatus: (userId: string, status: Partial<User>) => Promise<void>;
    rolePermissions: RolePermissions;
    updateRolePermissions: (role: UserRole, categories: CategoryKey[]) => void;
    addUser: (user: Omit<User, 'id'>) => Promise<void>;
    deleteUser: (userId: string) => Promise<void>;
    resetUsers: () => Promise<void>;
    hasAccess: (category: CategoryKey) => boolean;
    getAccessibleCategories: () => CategoryKey[];
    canDo: (action: string) => boolean;
    logAction: (action: string, metadata?: any) => Promise<void>;
    verifyPin: (pin: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [rolePermissions, setRolePermissions] = useState<RolePermissions>(DEFAULT_ROLE_PERMISSIONS);
    const [isInitDone, setIsInitDone] = useState(false);

    // useLiveQuery returns undefined while loading
    const usersQueryResult = useLiveQuery(() => db.users.toArray());
    const users = usersQueryResult || [];

    // 1. Initial Migration & Session Restore
    useEffect(() => {
        const init = async () => {
            try {
                // Ensure DB is open
                await db.init();

                // Sync mock users to ensure PINs and roles are up-to-date
                const userCount = await db.users.count();
                if (userCount === 0) {
                    await db.users.bulkPut(MOCK_USERS);
                }

                // Restore user session
                const savedUser = localStorage.getItem('executive_user_session');
                if (savedUser) {
                    try {
                        setCurrentUser(JSON.parse(savedUser));
                    } catch (e) {
                        console.error("Auth session recovery failed", e);
                    }
                }

                // Restore role permissions
                const savedPermissions = localStorage.getItem('role_permissions');
                if (savedPermissions) {
                    try {
                        setRolePermissions(JSON.parse(savedPermissions));
                    } catch (e) {
                        console.error("Permissions recovery failed", e);
                    }
                }
            } catch (err) {
                console.error("Authentication system initialization failed", err);
            } finally {
                setIsInitDone(true);
            }
        };
        init();
    }, []);

    const isAuthLoading = !isInitDone || usersQueryResult === undefined;

    const login = async (pin: string): Promise<boolean> => {
        const user = await db.users.where('pin').equals(pin).first();
        if (user) {
            const sessionUser = { ...user, lastActive: new Date().toISOString() };
            setCurrentUser(sessionUser);
            localStorage.setItem('executive_user_session', JSON.stringify(sessionUser));
            return true;
        }
        return false;
    };

    const loginAsUser = async (userId: string): Promise<boolean> => {
        const user = await db.users.get(userId);
        if (user) {
            const sessionUser = { ...user, lastActive: new Date().toISOString() };
            setCurrentUser(sessionUser);
            localStorage.setItem('executive_user_session', JSON.stringify(sessionUser));
            return true;
        }
        return false;
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('executive_user_session');
    };

    const updateUserStatus = async (userId: string, data: Partial<User>) => {
        await db.users.update(userId, data);
    };

    const addUser = async (user: Omit<User, 'id'>) => {
        const newUser: User = {
            ...user,
            id: `user_${Date.now()}`,
        };
        await db.users.add(newUser);
    };

    const deleteUser = async (userId: string) => {
        await db.users.delete(userId);
    };

    const updateRolePermissions = (role: UserRole, categories: CategoryKey[]) => {
        const newPermissions = { ...rolePermissions, [role]: categories };
        setRolePermissions(newPermissions);
        localStorage.setItem('role_permissions', JSON.stringify(newPermissions));
    };

    const canDo = (action: string): boolean => {
        if (!currentUser) return false;
        if (currentUser.role === 'admin') return true;

        const requiredLevel = ACTION_PERMISSIONS[action] || 0;
        const userLevel = ROLE_LEVELS[currentUser.role] || 0;

        return userLevel >= requiredLevel;
    };

    const logAction = async (action: string, metadata?: any, status: 'success' | 'failure' = 'success') => {
        if (!currentUser) return;
        await db.auditLogs.add({
            id: `audit_${Date.now()}`,
            userId: currentUser.id,
            userName: currentUser.name,
            action,
            status,
            timestamp: new Date().toISOString(),
            metadata: metadata ? JSON.stringify(metadata) : undefined
        } as any);
    };

    const verifyPin = async (pin: string): Promise<boolean> => {
        const user = await db.users.where('pin').equals(pin).first();
        return !!user && (ROLE_LEVELS[user.role] >= 70); // Only managers+ can verify PIN-guarded actions
    };

    const resetUsers = async () => {
        await logAction('system_reset_users');
        await db.users.clear();
        await db.users.bulkPut(MOCK_USERS);
    };

    const isAuthenticated = !!currentUser;

    return (
        <AuthContext.Provider value={{
            currentUser,
            isAuthenticated,
            isAuthLoading,
            login,
            loginAsUser,
            logout,
            users,
            updateUserStatus,
            rolePermissions,
            updateRolePermissions,
            hasAccess: (category: CategoryKey) => {
                if (!currentUser) return false;
                return rolePermissions[currentUser.role]?.includes(category) || false;
            },
            getAccessibleCategories: () => {
                if (!currentUser) return [];
                return rolePermissions[currentUser.role] || [];
            },
            resetUsers,
            addUser,
            deleteUser,
            canDo,
            logAction,
            verifyPin
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
