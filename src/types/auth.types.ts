/**
 * AUTH & USERS TYPES
 */

export type UserRole = 'server' | 'manager' | 'floor_manager' | 'kitchen_chef' | 'kitchen_line' | 'bartender' | 'host' | 'cashier' | 'admin';

export interface User {
    id: string;
    name: string;
    pin: string;
    role: UserRole;
    avatar?: string;
    lastActive?: string;
    performanceScore?: number;
    accessLevel?: number;
    weeklyHours?: number[]; // Hours per day [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
    hourlyRate?: number;
}
