"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * EXECUTIVE AUTH SYSTEM - Core Authentication Context
 * Manages user roles, PIN-based login, session persistence, and role-based permissions.
 */

export type UserRole =
    | 'admin'
    | 'manager'
    | 'floor_manager'
    | 'server'
    | 'bartender'
    | 'kitchen_chef'
    | 'kitchen_line'
    | 'host'
    | 'cashier';

export interface User {
    id: string;
    name: string;
    pin: string;
    role: UserRole;
    avatar?: string;
    lastActive?: string;
    performanceScore?: number;
    accessLevel?: number;
}

// All available navigation categories
export const ALL_CATEGORIES = [
    'dashboard',
    'pos',
    'floor-plan',
    'reservations',
    'kitchen',
    'inventory',
    'kds',
    'staff',
    'onboarding',
    'planning',
    'analytics',
    'haccp',
    'accounting',
    'settings',
    'account-settings',
] as const;

export type CategoryKey = typeof ALL_CATEGORIES[number];

// Label translations for categories
export const CATEGORY_LABELS: Record<CategoryKey, string> = {
    'dashboard': 'Tableau de bord',
    'pos': 'Point de vente',
    'floor-plan': 'Plan de salle',
    'reservations': 'Réservations',
    'kitchen': 'Gestion Cuisine',
    'inventory': 'Stocks & Inventaire',
    'kds': 'Production (KDS)',
    'staff': 'Ressources Humaines',
    'onboarding': 'Prise de Poste',
    'planning': 'Planning',
    'analytics': 'Analytique BI',
    'haccp': 'HACCP & Qualité',
    'accounting': 'Finance & Compta',
    'settings': 'Paramètres',
    'account-settings': 'Gestion des Accès',
};

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

// Default permissions per role
export type RolePermissions = Record<UserRole, CategoryKey[]>;

const DEFAULT_ROLE_PERMISSIONS: RolePermissions = {
    'admin': [...ALL_CATEGORIES], // Full access
    'manager': ['dashboard', 'pos', 'floor-plan', 'reservations', 'kitchen', 'inventory', 'kds', 'staff', 'onboarding', 'planning', 'analytics', 'haccp', 'accounting', 'settings'],
    'floor_manager': ['dashboard', 'pos', 'floor-plan', 'reservations', 'staff', 'onboarding', 'planning'],
    'server': ['dashboard', 'pos', 'floor-plan', 'reservations', 'onboarding'],
    'bartender': ['dashboard', 'pos', 'inventory', 'onboarding'],
    'kitchen_chef': ['dashboard', 'kitchen', 'inventory', 'kds', 'haccp', 'onboarding', 'planning'],
    'kitchen_line': ['dashboard', 'kitchen', 'kds', 'onboarding'],
    'host': ['dashboard', 'reservations', 'floor-plan', 'onboarding'],
    'cashier': ['dashboard', 'pos', 'accounting', 'onboarding'],
};

/**
 * MOCK BRIGADE DATA - Elite Restaurant Staff
 */
const MOCK_USERS: User[] = [
    {
        id: 'user_1',
        name: 'Alexandre De Rossi',
        pin: '0000',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80',
        performanceScore: 5.0,
        accessLevel: 10
    },
    {
        id: 'user_2',
        name: 'Marie Laurent',
        pin: '0000',
        role: 'manager',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
        performanceScore: 4.8,
        accessLevel: 8
    },
    {
        id: 'user_3',
        name: 'Sophie Martin',
        pin: '0000',
        role: 'server',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
        performanceScore: 4.6,
        accessLevel: 3
    },
    {
        id: 'user_4',
        name: 'Jean Bon',
        pin: '0000',
        role: 'kitchen_chef',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
        performanceScore: 4.9,
        accessLevel: 6
    },
    {
        id: 'user_5',
        name: 'Lucas Moreau',
        pin: '0000',
        role: 'bartender',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
        performanceScore: 4.5,
        accessLevel: 4
    },
    {
        id: 'user_6',
        name: 'Emma Dubois',
        pin: '0000',
        role: 'floor_manager',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
        performanceScore: 4.7,
        accessLevel: 6
    },
    {
        id: 'user_7',
        name: 'Pierre Lefèvre',
        pin: '0000',
        role: 'kitchen_line',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80',
        performanceScore: 4.3,
        accessLevel: 3
    },
    {
        id: 'user_8',
        name: 'Julie Bernard',
        pin: '0000',
        role: 'host',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
        performanceScore: 4.6,
        accessLevel: 3
    },
    {
        id: 'user_9',
        name: 'Thomas Petit',
        pin: '0000',
        role: 'cashier',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
        performanceScore: 4.4,
        accessLevel: 4
    },
];

interface AuthContextType {
    currentUser: User | null;
    isAuthenticated: boolean;
    login: (pin: string) => boolean;
    loginAsUser: (userId: string) => boolean;
    logout: () => void;
    users: User[];
    updateUserStatus: (userId: string, status: Partial<User>) => void;
    rolePermissions: RolePermissions;
    updateRolePermissions: (role: UserRole, categories: CategoryKey[]) => void;
    hasAccess: (category: CategoryKey) => boolean;
    getAccessibleCategories: () => CategoryKey[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [rolePermissions, setRolePermissions] = useState<RolePermissions>(DEFAULT_ROLE_PERMISSIONS);

    // PERSISTENCE EFFECT - Local Storage session management
    useEffect(() => {
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
    }, []);

    const login = (pin: string): boolean => {
        const user = users.find(u => u.pin === pin);
        if (user) {
            const sessionUser = { ...user, lastActive: new Date().toISOString() };
            setCurrentUser(sessionUser);
            localStorage.setItem('executive_user_session', JSON.stringify(sessionUser));
            return true;
        }
        return false;
    };

    const loginAsUser = (userId: string): boolean => {
        const user = users.find(u => u.id === userId);
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

    const updateUserStatus = (userId: string, data: Partial<User>) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
    };

    const updateRolePermissions = (role: UserRole, categories: CategoryKey[]) => {
        const newPermissions = { ...rolePermissions, [role]: categories };
        setRolePermissions(newPermissions);
        localStorage.setItem('role_permissions', JSON.stringify(newPermissions));
    };

    const hasAccess = (category: CategoryKey): boolean => {
        if (!currentUser) return false;
        const userCategories = rolePermissions[currentUser.role] || [];
        return userCategories.includes(category);
    };

    const getAccessibleCategories = (): CategoryKey[] => {
        if (!currentUser) return [];
        return rolePermissions[currentUser.role] || [];
    };

    const isAuthenticated = !!currentUser;

    return (
        <AuthContext.Provider value={{
            currentUser,
            isAuthenticated,
            login,
            loginAsUser,
            logout,
            users,
            updateUserStatus,
            rolePermissions,
            updateRolePermissions,
            hasAccess,
            getAccessibleCategories,
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
