"use client";

import { useState, useEffect } from "react";

/**
 * Hook to detect if a media query matches.
 * @param query - CSS media query string (e.g., "(max-width: 768px)")
 * @returns boolean indicating if the query matches
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const mediaQuery = window.matchMedia(query);
        setMatches(mediaQuery.matches);

        const handler = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, [query]);

    return matches;
}

// Breakpoint constants matching Tailwind defaults
export const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
} as const;

/**
 * Hook providing responsive breakpoint booleans.
 */
export function useResponsive() {
    const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.md - 1}px)`);
    const isTablet = useMediaQuery(`(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`);
    const isDesktop = useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);

    return { isMobile, isTablet, isDesktop };
}
