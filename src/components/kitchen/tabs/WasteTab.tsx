
"use client";

import { motion } from "framer-motion";
import { History, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { cinematicContainer, fadeInUp } from "@/lib/motion";
import { useToast } from "@/components/ui/Toast";
import React, { useState } from "react";
import { PremiumSelect } from "@/components/ui/PremiumSelect";

interface WasteTabProps {
    ingredients: any[];
    wasteLogs: any[];
}

export function WasteTab({ ingredients, wasteLogs }: WasteTabProps) {
    const { showToast } = useToast();
    const [selectedIngredient, setSelectedIngredient] = useState("");

    const ingredientOptions = ingredients.map(i => ({
        value: i.id || i.name,
        label: i.name,
        description: i.category || "Ingrédient",
        icon: <div className="w-4 h-4 rounded-full bg-accent-gold" />
    }));

    const handleWasteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, we'd have a form state here
        showToast("Perte enregistrée avec succès", "success");
    };

    return (
        <motion.div
            variants={cinematicContainer}
            initial="hidden"
            animate="visible"
            className="w-full max-w-full xl:max-w-5xl"
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                {/* Waste Form */}
                <motion.div variants={fadeInUp} className="lg:col-span-8">
                    <div className="bg-white/80 dark:bg-neutral-900/60 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 border border-neutral-200/50 dark:border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-none">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 rounded-2xl bg-error/10 dark:bg-error/20 flex items-center justify-center border border-error/20">
                                <Trash2 className="w-6 h-6 text-error" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-serif font-black text-neutral-900 dark:text-white tracking-tight italic">
                                    Déclarer une <span className="text-secondary">Perte</span>
                                </h3>
                                <p className="text-[10px] uppercase tracking-[0.3em] font-black text-neutral-400 mt-1">
                                    Saisie rapide des écarts de stock
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleWasteSubmit} className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="group">
                                    <PremiumSelect
                                        label="Article"
                                        value={selectedIngredient}
                                        onChange={setSelectedIngredient}
                                        options={ingredientOptions}
                                        placeholder="Sélectionner un ingrédient..."
                                    />
                                </div>

                                <div className="space-y-3 group">
                                    <label className="text-[10px] font-black uppercase text-neutral-400 tracking-[0.2em] ml-1 group-focus-within:text-error transition-colors">Quantité</label>
                                    <div className="flex gap-3">
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            className="flex-1 h-14 px-5 bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-2xl font-mono font-black text-lg focus:ring-2 focus:ring-error/20 focus:border-error outline-none transition-all"
                                        />
                                        <div className="w-20 h-14 bg-neutral-900 dark:bg-white/[0.08] rounded-2xl flex items-center justify-center font-black text-white dark:text-neutral-400 text-[11px] uppercase tracking-[0.2em] shadow-lg">KG</div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-neutral-400 tracking-[0.2em] ml-1">Motif de la Saisie</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {['Plat Erreur', 'DLC Passée', 'Abîmé', 'Surplus'].map(reason => (
                                        <motion.button
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            type="button"
                                            key={reason}
                                            className="h-14 lg:h-16 px-4 border-2 border-dashed border-neutral-200 dark:border-white/5 bg-transparent hover:bg-neutral-900 dark:hover:bg-white hover:border-transparent hover:text-white dark:hover:text-neutral-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] transition-all duration-300 shadow-sm hover:shadow-xl"
                                        >
                                            {reason}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            <motion.div
                                className="pt-6"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button className="w-full h-16 bg-neutral-900 dark:bg-white dark:text-neutral-900 text-white rounded-[1.25rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_20px_40px_rgba(255,255,255,0.1)] transition-all flex items-center justify-center gap-3">
                                    Enregistrer la Perte <Trash2 className="w-4 h-4 ml-1 opacity-40" />
                                </Button>
                            </motion.div>
                        </form>
                    </div>
                </motion.div>

                {/* Financial Summary */}
                <div className="lg:col-span-4 lg:sticky lg:top-8 h-fit">
                    <motion.div
                        variants={fadeInUp}
                        whileHover={{ y: -5 }}
                        className="p-10 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black dark:from-white dark:via-neutral-100 dark:to-neutral-200 rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.5)] dark:shadow-[0_30px_70px_rgba(255,255,255,0.1)] relative overflow-hidden group"
                    >
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-error/10 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-error/20 transition-all duration-700" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-2 h-2 rounded-full bg-error shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400 dark:text-neutral-500">
                                    Impact Financier
                                </h4>
                            </div>

                            <div className="space-y-1">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-5xl font-mono font-black text-white dark:text-neutral-900 flex items-baseline gap-1"
                                >
                                    <span className="text-error text-[0.6em] font-black">-</span>
                                    {formatCurrency(124.50)}
                                </motion.div>
                                <p className="text-[9px] font-bold text-error uppercase tracking-[0.2em] opacity-80 pl-4">
                                    Mois en cours
                                </p>
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/10 dark:border-black/5">
                                <p className="text-[13px] text-neutral-300 dark:text-neutral-600 font-medium leading-relaxed">
                                    Ce mois-ci, les pertes représentent
                                    <span className="block text-2xl font-serif font-black text-error mt-2 italic tracking-tighter">
                                        2.4% du CA Total
                                    </span>
                                </p>
                                <div className="mt-6 w-full h-1.5 bg-white/5 dark:bg-black/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '2.4%' }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="h-full bg-error shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
