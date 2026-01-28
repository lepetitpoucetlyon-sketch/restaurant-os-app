"use client";

/**
 * MOTION LIBRARY - Framer Motion Variants & Hooks
 * Reusable animation configurations for Restaurant OS
 */

import { Variants, Transition } from "framer-motion";

// ============================================
// TIMING FUNCTIONS
// ============================================

export const easing = {
    easeOutExpo: [0.16, 1, 0.3, 1] as const,
    easeOutBack: [0.34, 1.56, 0.64, 1] as const,
    easeInOutQuint: [0.83, 0, 0.17, 1] as const,
    easeInExpo: [0.7, 0, 0.84, 0] as const,
    easeOutQuart: [0.25, 1, 0.5, 1] as const,
    spring: [0.4, 0.5, 0.3, 1.4] as const,
    bounce: [0.68, -0.55, 0.265, 1.55] as const,
};

export const duration = {
    instant: 0.1,
    fast: 0.2,
    normal: 0.35,
    slow: 0.5,
    dramatic: 0.7,
};

// ============================================
// SPRING CONFIGS
// ============================================

export const springConfig = {
    gentle: { type: "spring", stiffness: 120, damping: 14 } as Transition,
    snappy: { type: "spring", stiffness: 300, damping: 20 } as Transition,
    bouncy: { type: "spring", stiffness: 400, damping: 10 } as Transition,
    smooth: { type: "spring", stiffness: 100, damping: 20 } as Transition,
};

// ============================================
// FADE VARIANTS
// ============================================

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: duration.normal, ease: easing.easeOutExpo }
    },
    exit: {
        opacity: 0,
        transition: { duration: duration.fast }
    }
};

export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: duration.normal, ease: easing.easeOutExpo }
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: { duration: duration.fast }
    }
};

export const fadeInDown: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: duration.normal, ease: easing.easeOutExpo }
    },
    exit: {
        opacity: 0,
        y: 10,
        transition: { duration: duration.fast }
    }
};

export const fadeInLeft: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: duration.normal, ease: easing.easeOutExpo }
    },
    exit: {
        opacity: 0,
        x: 20,
        transition: { duration: duration.fast }
    }
};

export const fadeInRight: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: duration.normal, ease: easing.easeOutExpo }
    },
    exit: {
        opacity: 0,
        x: -20,
        transition: { duration: duration.fast }
    }
};

// ============================================
// SCALE VARIANTS
// ============================================

export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: duration.normal, ease: easing.easeOutExpo }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: duration.fast }
    }
};

export const scaleInBounce: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: springConfig.bouncy
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        transition: { duration: duration.fast }
    }
};

// ============================================
// SLIDE VARIANTS
// ============================================

export const slideInRight: Variants = {
    hidden: { x: "100%", opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { duration: duration.normal, ease: easing.easeOutExpo }
    },
    exit: {
        x: "100%",
        opacity: 0,
        transition: { duration: duration.fast }
    }
};

export const slideInLeft: Variants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { duration: duration.normal, ease: easing.easeOutExpo }
    },
    exit: {
        x: "-100%",
        opacity: 0,
        transition: { duration: duration.fast }
    }
};

export const slideInBottom: Variants = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: duration.normal, ease: easing.easeOutExpo }
    },
    exit: {
        y: "100%",
        opacity: 0,
        transition: { duration: duration.fast }
    }
};

export const slideInTop: Variants = {
    hidden: { y: "-100%", opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: duration.normal, ease: easing.easeOutExpo }
    },
    exit: {
        y: "-100%",
        opacity: 0,
        transition: { duration: duration.fast }
    }
};

// ============================================
// STAGGER CONTAINER
// ============================================

export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1
        }
    },
    exit: {
        opacity: 0,
        transition: {
            staggerChildren: 0.03,
            staggerDirection: -1
        }
    }
};

export const staggerContainerSlow: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.15
        }
    }
};

export const cinematicContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        }
    }
};

export const cinematicItem: Variants = {
    hidden: { opacity: 0, scale: 0.98, y: 10 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.5, ease: easing.easeOutExpo }
    }
};

export const staggerItem: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: duration.normal, ease: easing.easeOutExpo }
    }
};

// ============================================
// MODAL / OVERLAY VARIANTS
// ============================================

export const modalBackdrop: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: duration.fast }
    },
    exit: {
        opacity: 0,
        transition: { duration: duration.fast, delay: 0.1 }
    }
};

export const modalContent: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.95,
        y: 20
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: springConfig.gentle
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: 20,
        transition: { duration: duration.fast }
    }
};

export const modalCinematic: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.8,
        y: 100,
        rotateX: 15,
        filter: "blur(10px)"
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        rotateX: 0,
        filter: "blur(0px)",
        transition: {
            type: "spring",
            damping: 25,
            stiffness: 200,
            mass: 0.8
        }
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        y: 50,
        filter: "blur(5px)",
        transition: { duration: duration.normal, ease: easing.easeInExpo }
    }
};

// ============================================
// TOAST / NOTIFICATION VARIANTS
// ============================================

export const toastVariants: Variants = {
    hidden: {
        opacity: 0,
        x: 50,
        scale: 0.95
    },
    visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: springConfig.snappy
    },
    exit: {
        opacity: 0,
        x: 50,
        scale: 0.95,
        transition: { duration: duration.fast }
    }
};

// ============================================
// BUTTON / INTERACTIVE VARIANTS
// ============================================

export const buttonTap = {
    scale: 0.97,
    transition: { duration: 0.1 }
};

export const buttonHover = {
    scale: 1.02,
    transition: { duration: 0.2 }
};

export const cardHover = {
    y: -4,
    boxShadow: "0 20px 50px -15px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.3, ease: easing.easeOutExpo }
};

// ============================================
// PAGE TRANSITION VARIANTS
// ============================================

export const pageTransition: Variants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: duration.normal,
            ease: easing.easeOutExpo,
            staggerChildren: 0.05
        }
    },
    exit: {
        opacity: 0,
        y: -8,
        transition: { duration: duration.fast }
    }
};

// ============================================
// ACCORDION / COLLAPSE VARIANTS
// ============================================

export const accordionContent: Variants = {
    hidden: {
        height: 0,
        opacity: 0,
        transition: { duration: duration.normal, ease: easing.easeOutExpo }
    },
    visible: {
        height: "auto",
        opacity: 1,
        transition: { duration: duration.normal, ease: easing.easeOutExpo }
    }
};

// ============================================
// CHART / DATA VISUALIZATION
// ============================================

export const chartDraw: Variants = {
    hidden: {
        pathLength: 0,
        opacity: 0
    },
    visible: {
        pathLength: 1,
        opacity: 1,
        transition: {
            pathLength: { duration: 1.5, ease: easing.easeOutExpo },
            opacity: { duration: 0.3 }
        }
    }
};

export const barGrow: Variants = {
    hidden: { scaleY: 0, originY: 1 },
    visible: {
        scaleY: 1,
        transition: { duration: duration.slow, ease: easing.easeOutExpo }
    }
};

// ============================================
// HOVER STATES
// ============================================

export const hoverLift = {
    y: -4,
    transition: { duration: 0.2, ease: easing.easeOutExpo }
};

export const hoverGlow = {
    boxShadow: "0 0 30px rgba(34, 197, 94, 0.3)",
    transition: { duration: 0.2 }
};

// ============================================
// MOBILE-SPECIFIC VARIANTS
// ============================================

/**
 * Faster spring for mobile - less bounce, quicker settlement
 * Optimized for utility feel on touch devices
 */
export const mobileSpring = {
    type: "spring",
    stiffness: 400,
    damping: 30,
    mass: 0.8
} as Transition;

/**
 * Bottom Sheet / Drawer variants for mobile modals
 */
export const drawerVariants: Variants = {
    hidden: {
        y: "100%",
        opacity: 0.8
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: mobileSpring
    },
    exit: {
        y: "100%",
        opacity: 0,
        transition: { duration: duration.fast, ease: easing.easeInExpo }
    }
};

/**
 * Sheet handle animation for drag affordance
 */
export const sheetHandleVariants: Variants = {
    idle: { scaleX: 1 },
    dragging: { scaleX: 1.2 },
};

/**
 * Mobile backdrop with faster fade
 */
export const mobileBackdrop: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: duration.fast }
    },
    exit: {
        opacity: 0,
        transition: { duration: duration.instant }
    }
};

/**
 * Floating Action Button variants
 */
export const fabVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: { type: "spring", stiffness: 500, damping: 25 }
    },
    exit: {
        scale: 0,
        opacity: 0,
        transition: { duration: duration.fast }
    }
};

/**
 * Radial menu item for touch interfaces
 */
export const radialMenuItemVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
        scale: 1,
        opacity: 1,
        transition: {
            delay: i * 0.05,
            type: "spring",
            stiffness: 400,
            damping: 20
        }
    }),
    exit: {
        scale: 0,
        opacity: 0,
        transition: { duration: duration.instant }
    }
};

/**
 * Swipe action reveal (for list items)
 */
export const swipeActionVariants: Variants = {
    hidden: { x: 0 },
    revealed: { x: -80 },
    deleted: { x: "-100%", opacity: 0 }
};

// ============================================
// DASHBOARD SPECIFIC VARIANTS
// ============================================

export const kpiContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

export const kpiCardVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: easing.easeOutExpo
        }
    }
};

// ============================================
// UTILITY: Reduced Motion Check
// ============================================

export const getReducedMotionVariants = (variants: Variants): Variants => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return {
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
            exit: { opacity: 0 }
        };
    }
    return variants;
};
