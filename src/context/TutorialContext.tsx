"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface TutorialPoint {
    label: string;
    description: string;
    selector: string;
    path?: string;
    action?: () => void;
}

export interface TutorialSection {
    title: string;
    points: TutorialPoint[];
}

interface TutorialContextType {
    isActive: boolean;
    currentSection: TutorialSection | null;
    currentPointIndex: number;
    startTutorial: (section: TutorialSection) => void;
    stopTutorial: () => void;
    nextStep: () => void;
    prevStep: () => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export function TutorialProvider({ children }: { children: ReactNode }) {
    const [isActive, setIsActive] = useState(false);
    const [currentSection, setCurrentSection] = useState<TutorialSection | null>(null);
    const [currentPointIndex, setCurrentPointIndex] = useState(0);

    const startTutorial = useCallback((section: TutorialSection) => {
        setCurrentSection(section);
        setCurrentPointIndex(0);
        setIsActive(true);
    }, []);

    const stopTutorial = useCallback(() => {
        setIsActive(false);
        setCurrentSection(null);
        setCurrentPointIndex(0);
    }, []);

    const nextStep = useCallback(() => {
        if (!currentSection) return;
        if (currentPointIndex < currentSection.points.length - 1) {
            setCurrentPointIndex(prev => prev + 1);
        } else {
            stopTutorial();
        }
    }, [currentSection, currentPointIndex, stopTutorial]);

    const prevStep = useCallback(() => {
        if (currentPointIndex > 0) {
            setCurrentPointIndex(prev => prev - 1);
        }
    }, [currentPointIndex]);

    return (
        <TutorialContext.Provider value={{
            isActive,
            currentSection,
            currentPointIndex,
            startTutorial,
            stopTutorial,
            nextStep,
            prevStep
        }}>
            {children}
        </TutorialContext.Provider>
    );
}

export function useTutorial() {
    const context = useContext(TutorialContext);
    if (!context) throw new Error('useTutorial must be used within TutorialProvider');
    return context;
}
