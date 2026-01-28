"use client";

import { useCallback, useRef, useMemo } from "react";

/**
 * Hook pour mémoriser efficacement une fonction avec dépendances stables.
 * Évite les re-renders inutiles tout en gardant la fonction à jour.
 * 
 * @example
 * const handleClick = useEventCallback((id: string) => {
 *   // Toujours accès aux dernières valeurs sans causer de re-render
 *   doSomething(id, currentState);
 * });
 */
export function useEventCallback<T extends (...args: unknown[]) => unknown>(
    callback: T
): T {
    const ref = useRef<T>(callback);

    // Mise à jour de la référence à chaque render
    ref.current = callback;

    // Retourne une fonction stable qui appelle toujours la dernière version
    return useCallback(
        ((...args) => ref.current(...args)) as T,
        []
    );
}

/**
 * Hook pour créer une valeur mémorisée avec comparaison profonde.
 * Utile quand les dépendances sont des objets qui changent de référence.
 * 
 * @example
 * const filters = useDeepMemo(() => ({ status, category }), [status, category]);
 */
export function useDeepMemo<T>(factory: () => T, deps: unknown[]): T {
    const ref = useRef<{ deps: unknown[]; value: T } | null>(null);

    if (ref.current === null || !deepEqual(ref.current.deps, deps)) {
        ref.current = { deps, value: factory() };
    }

    return ref.current.value;
}

function deepEqual(a: unknown, b: unknown): boolean {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (a === null || b === null) return a === b;
    if (typeof a !== "object") return a === b;

    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        return a.every((item, index) => deepEqual(item, b[index]));
    }

    if (Array.isArray(a) || Array.isArray(b)) return false;

    const aKeys = Object.keys(a as object);
    const bKeys = Object.keys(b as object);

    if (aKeys.length !== bKeys.length) return false;

    return aKeys.every((key) =>
        deepEqual(
            (a as Record<string, unknown>)[key],
            (b as Record<string, unknown>)[key]
        )
    );
}

/**
 * Hook pour tracker le nombre de renders (debug).
 */
export function useRenderCount(componentName: string): number {
    const renderCount = useRef(0);
    renderCount.current++;

    // Debug info tracked internally - no console output in production
    // Access renderCount.current for debugging if needed

    return renderCount.current;
}

/**
 * Hook pour mesurer la performance d'un rendu.
 */
export function usePerformanceMeasure(name: string): void {
    const startTime = useRef(0);

    if (typeof performance !== "undefined") {
        startTime.current = performance.now();
    }

    // Effet exécuté après le render
    useMemo(() => {
        if (typeof performance !== "undefined" && process.env.NODE_ENV === "development") {
            const endTime = performance.now();
            const duration = endTime - startTime.current;
            if (duration > 16) {
                // Plus d'une frame (16ms)
                console.warn(`[Perf] ${name} took ${duration.toFixed(2)}ms to render`);
            }
        }
    }, [name]);
}
