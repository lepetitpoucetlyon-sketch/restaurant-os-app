import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Format a number as French currency (€)
 * @example formatCurrency(1234.5) => "1 234,50 €"
 */
export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

/**
 * Format a number as percentage
 * @example formatPercent(0.724) => "72,4%"
 */
export function formatPercent(value: number): string {
    // If value is > 1, assume it's already in percentage scale (e.g. 15 for 15%)
    const normalizedValue = Math.abs(value) > 1 ? value / 100 : value;

    return new Intl.NumberFormat('fr-FR', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    }).format(normalizedValue);
}

/**
 * Format a date to French locale
 * @example formatDate(new Date()) => "29 Déc 2025"
 */
export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'd MMM yyyy', { locale: fr });
}

/**
 * Format a date to full French locale
 * @example formatDateFull(new Date()) => "Lundi 29 Décembre 2025"
 */
export function formatDateFull(date: Date | string): string {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'EEEE d MMMM yyyy', { locale: fr });
}

/**
 * Format time
 * @example formatTime(new Date()) => "14:30"
 */
export function formatTime(date: Date | string): string {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'HH:mm', { locale: fr });
}

/**
 * Generate a unique ID
 */
export function generateId(prefix: string = 'id'): string {
    return `${prefix}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}
