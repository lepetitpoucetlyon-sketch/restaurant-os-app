"use client";

import { ReactNode, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MobileNavBar } from "@/components/layout/MobileNavBar";

interface PageTransitionProps {
    children: ReactNode;
    className?: string;
}

// Simplified transition for better performance
const fastTransition = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.15 }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.1 }
    }
};

/**
 * PAGE TRANSITION WRAPPER
 * Wrap page content for smooth enter/exit animations
 * Also includes MobileNavBar for mobile devices
 */
export const PageTransition = memo(function PageTransition({ children, className }: PageTransitionProps) {
    return (
        <>
            <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fastTransition}
                className={className}
            >
                {children}
            </motion.div>
            {/* Mobile Navigation - renders floating dock on mobile viewports */}
            <MobileNavBar />
        </>
    );
});

/**
 * STAGGER CONTAINER
 * Wrap list items for staggered animations
 */
export function StaggerContainer({
    children,
    className,
    delay = 0.05
}: PageTransitionProps & { delay?: number }) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: delay,
                        delayChildren: 0.1
                    }
                }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/**
 * STAGGER ITEM
 * Individual items within a StaggerContainer
 */
export function StaggerItem({ children, className }: PageTransitionProps) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.35,
                        ease: [0.16, 1, 0.3, 1]
                    }
                }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/**
 * FADE IN WRAPPER
 * Simple fade-in animation on mount
 */
export function FadeIn({
    children,
    className,
    delay = 0,
    direction = "up"
}: PageTransitionProps & { delay?: number; direction?: "up" | "down" | "left" | "right" | "none" }) {
    const directionOffset = {
        up: { y: 20 },
        down: { y: -20 },
        left: { x: -20 },
        right: { x: 20 },
        none: {}
    };

    return (
        <motion.div
            initial={{ opacity: 0, ...directionOffset[direction] }}
            animate={{
                opacity: 1,
                x: 0,
                y: 0,
                transition: {
                    duration: 0.35,
                    delay,
                    ease: [0.16, 1, 0.3, 1]
                }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/**
 * SCALE IN WRAPPER
 * Scale + fade animation on mount
 */
export function ScaleIn({
    children,
    className,
    delay = 0
}: PageTransitionProps & { delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
                opacity: 1,
                scale: 1,
                transition: {
                    duration: 0.35,
                    delay,
                    ease: [0.16, 1, 0.3, 1]
                }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/**
 * HOVER CARD WRAPPER
 * Add premium hover effects to cards
 */
export function HoverCard({ children, className }: PageTransitionProps) {
    return (
        <motion.div
            whileHover={{
                y: -4,
                boxShadow: "0 20px 50px -15px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
            }}
            whileTap={{ scale: 0.995 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/**
 * PRESS BUTTON WRAPPER
 * Add tactile feedback to buttons
 */
export function PressButton({ children, className }: PageTransitionProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/**
 * PRESENCE WRAPPER
 * For elements that need enter/exit animations
 */
export function PresenceWrapper({
    children,
    isVisible,
    mode = "wait"
}: {
    children: ReactNode;
    isVisible: boolean;
    mode?: "wait" | "sync" | "popLayout";
}) {
    return (
        <AnimatePresence mode={mode}>
            {isVisible && children}
        </AnimatePresence>
    );
}

/**
 * SLIDE PANEL WRAPPER
 * For side panels and drawers
 */
export function SlidePanel({
    children,
    className,
    direction = "right"
}: PageTransitionProps & { direction?: "left" | "right" | "top" | "bottom" }) {
    const slideOffset = {
        left: { x: "-100%" },
        right: { x: "100%" },
        top: { y: "-100%" },
        bottom: { y: "100%" }
    };

    return (
        <motion.div
            initial={{ ...slideOffset[direction], opacity: 0 }}
            animate={{
                x: 0,
                y: 0,
                opacity: 1,
                transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
            }}
            exit={{
                ...slideOffset[direction],
                opacity: 0,
                transition: { duration: 0.2 }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
