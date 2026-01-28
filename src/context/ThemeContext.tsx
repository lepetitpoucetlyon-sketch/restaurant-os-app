"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type AccentColor = 'gold' | 'emerald' | 'sapphire' | 'ruby' | 'amethyst';
type UIDensity = 'compact' | 'premium' | 'cinematic';
type ThemeMode = 'light' | 'dark' | 'auto';
type BorderRadius = 'none' | 'small' | 'medium' | 'large';

interface ThemeState {
    mode: ThemeMode;
    accentColor: AccentColor;
    density: UIDensity;
    glassmorphism: number; // 0 to 100
    borderRadius: BorderRadius;
    buttonStyle: 'flat' | 'gradient';
    animations: boolean;
    fontPrimary: string;
    fontHeadings: string;
}

interface ThemeContextType extends ThemeState {
    setMode: (mode: ThemeMode) => void;
    setAccentColor: (color: AccentColor) => void;
    setDensity: (density: UIDensity) => void;
    setGlassmorphism: (value: number) => void;
    setBorderRadius: (radius: BorderRadius) => void;
    setButtonStyle: (style: 'flat' | 'gradient') => void;
    setAnimations: (enabled: boolean) => void;
    setFontPrimary: (font: string) => void;
    setFontHeadings: (font: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<ThemeState>({
        mode: 'light',
        accentColor: 'gold',
        density: 'premium',
        glassmorphism: 20,
        borderRadius: 'large',
        buttonStyle: 'gradient',
        animations: true,
        fontPrimary: 'Outfit',
        fontHeadings: 'Outfit',
    });

    // Initialize from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('app-theme-config');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setState(prev => ({ ...prev, ...parsed, mode: 'light' })); // FORCE LIGHT MODE
            } catch (e) {
                console.error('Failed to load theme config', e);
            }
        }
    }, []);

    // Persist to localStorage and apply CSS variables
    useEffect(() => {
        localStorage.setItem('app-theme-config', JSON.stringify(state));

        // Apply Mode Class
        const root = document.documentElement;
        root.classList.remove('light', 'dark');

        // FORCED LIGHT MODE
        root.classList.add('light');

        // Accent Colors Map
        const colors = {
            gold: { primary: '#C5A059', muted: 'rgba(197,160,89,0.1)' },
            emerald: { primary: '#10B981', muted: 'rgba(16,185,129,0.1)' },
            sapphire: { primary: '#3B82F6', muted: 'rgba(59,130,246,0.1)' },
            ruby: { primary: '#EF4444', muted: 'rgba(239,68,68,0.1)' },
            amethyst: { primary: '#8B5CF6', muted: 'rgba(139,92,246,0.1)' },
        };

        const activeColor = colors[state.accentColor];
        root.style.setProperty('--accent-primary', activeColor.primary);
        root.style.setProperty('--accent-muted', activeColor.muted);
        root.style.setProperty('--color-accent-gold', activeColor.primary); // Compatibility

        // Density Map
        const densities = {
            compact: { padding: '0.5rem', gap: '0.5rem', fontSize: '13px' },
            premium: { padding: '1rem', gap: '1rem', fontSize: '14px' },
            cinematic: { padding: '1.5rem', gap: '1.5rem', fontSize: '15px' },
        };

        const activeDensity = densities[state.density];
        root.style.setProperty('--ui-padding', activeDensity.padding);
        root.style.setProperty('--ui-gap', activeDensity.gap);
        root.style.setProperty('--ui-font-size', activeDensity.fontSize);

        // Glassmorphism
        root.style.setProperty('--glass-intensity', `${state.glassmorphism / 100}`);
        root.style.setProperty('--glass-blur', `${(state.glassmorphism / 10) * 2}px`);

        // Border Radius
        const radii = {
            none: '0px',
            small: '0.5rem',
            medium: '1.5rem',
            large: '2.5rem',
        };
        root.style.setProperty('--radius-main', radii[state.borderRadius]);

        // Typography
        root.style.setProperty('--font-primary', state.fontPrimary);
        root.style.setProperty('--font-headings', state.fontHeadings);

    }, [state]);

    const setMode = (mode: ThemeMode) => setState(prev => ({ ...prev, mode }));
    const setAccentColor = (accentColor: AccentColor) => setState(prev => ({ ...prev, accentColor }));
    const setDensity = (density: UIDensity) => setState(prev => ({ ...prev, density }));
    const setGlassmorphism = (glassmorphism: number) => setState(prev => ({ ...prev, glassmorphism }));
    const setBorderRadius = (borderRadius: BorderRadius) => setState(prev => ({ ...prev, borderRadius }));
    const setButtonStyle = (buttonStyle: 'flat' | 'gradient') => setState(prev => ({ ...prev, buttonStyle }));
    const setAnimations = (animations: boolean) => setState(prev => ({ ...prev, animations }));
    const setFontPrimary = (fontPrimary: string) => setState(prev => ({ ...prev, fontPrimary }));
    const setFontHeadings = (fontHeadings: string) => setState(prev => ({ ...prev, fontHeadings }));

    return (
        <ThemeContext.Provider value={{
            ...state,
            setMode,
            setAccentColor,
            setDensity,
            setGlassmorphism,
            setBorderRadius,
            setButtonStyle,
            setAnimations,
            setFontPrimary,
            setFontHeadings
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
