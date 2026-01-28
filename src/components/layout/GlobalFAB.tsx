"use client";

import { motion } from "framer-motion";
import { Mic, Sparkles } from "lucide-react";
import { useUI } from "@/context/UIContext";
import { cn } from "@/lib/utils";

export function GlobalFAB() {
    const { openCommandPalette, toggleLaunchpad } = useUI();

    const triggerVoice = () => {
        window.dispatchEvent(new KeyboardEvent('keydown', { altKey: true, key: 'v' }));
    };

    return (
        <div className="fixed bottom-32 right-6 lg:bottom-12 lg:right-6 z-[100] flex flex-col items-center gap-4 pointer-events-none">
            {/* 1. Mic Button - Desktop Only in FAB */}
            <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={triggerVoice}
                className="pointer-events-auto hidden lg:flex w-14 h-14 rounded-2xl bg-white dark:bg-neutral-900 border border-border items-center justify-center text-text-primary shadow-premium group transition-all"
                title="Commande Vocale (Alt+V)"
            >
                <Mic className="w-6 h-6 group-hover:scale-110 transition-transform text-neutral-500 dark:text-neutral-400 group-hover:text-accent-gold" strokeWidth={1.5} />
            </motion.button>

            {/* 2. Golden Logo / AI Button - Floating on Desktop and Mobile */}
            <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={openCommandPalette}
                className="pointer-events-auto w-14 h-14 md:w-16 md:h-16 rounded-2xl md:rounded-[1.8rem] bg-gradient-to-br from-neutral-900 via-neutral-800 to-black border border-accent-gold/40 flex items-center justify-center text-accent-gold shadow-[0_15px_35px_rgba(0,0,0,0.4),0_0_20px_rgba(197,160,89,0.15)] group transition-all"
                title="Oracle Intelligence"
            >
                <div className="relative">
                    <Sparkles className="w-6 h-6 md:w-7 md:h-7 group-hover:rotate-12 transition-transform" strokeWidth={1.5} />
                    <div className="absolute inset-0 blur-md bg-accent-gold/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </motion.button>
        </div>
    );
}
