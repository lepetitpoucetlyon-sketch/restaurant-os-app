"use client";

import { useState, useEffect } from "react";
import { X, Clock, User, Save, MapPin, FileText, Scale, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRecipes } from "@/context/RecipeContext";
import { useToast } from "@/components/ui/Toast";
import { Modal } from "@/components/ui/Modal";
import { motion } from "framer-motion";
import { PremiumSelect } from "@/components/ui/PremiumSelect";
import type { MiseEnPlaceTask } from "@/types";

interface PrepTaskDialogProps {
    isOpen: boolean;
    onClose: () => void;
    task?: MiseEnPlaceTask; // If provided, we're editing
}

const STATIONS = ['Garde-manger', 'Entrées', 'Poissons', 'Viandes', 'Saucier', 'Pâtisserie', 'Légumerie', 'Plonge'];
const STAFF_MEMBERS = ['Jean', 'Marie', 'Pierre', 'Sophie', 'Alexandre', 'Claire'];
const PRIORITIES = [
    { value: 'low', label: 'Basse', color: 'bg-text-muted/10 text-text-muted border-text-muted/20' },
    { value: 'normal', label: 'Normale', color: 'bg-info/10 text-info border-info/20' },
    { value: 'high', label: 'Haute', color: 'bg-warning/10 text-warning border-warning/20' },
    { value: 'urgent', label: 'Urgente', color: 'bg-error/10 text-error border-error/20' },
];
const UNITS = ['kg', 'g', 'L', 'cl', 'ml', 'portions', 'pièces', 'barquettes'];

export function PrepTaskDialog({ isOpen, onClose, task }: PrepTaskDialogProps) {
    const { showToast } = useToast();
    const { addPrepTask, updatePrepTask } = useRecipes();

    const [formData, setFormData] = useState<Partial<MiseEnPlaceTask>>({
        name: '',
        quantity: 0,
        unit: 'kg',
        assignedTo: '',
        station: '',
        priority: 'normal',
        estimatedTime: 30,
        notes: '',
        dueDate: new Date(),
        isCompleted: false,
    });

    useEffect(() => {
        if (task && isOpen) {
            setFormData({
                name: task.name,
                quantity: task.quantity,
                unit: task.unit,
                assignedTo: task.assignedTo,
                station: task.station,
                priority: task.priority,
                estimatedTime: task.estimatedTime,
                notes: task.notes,
                dueDate: task.dueDate,
                isCompleted: task.isCompleted,
            });
        } else if (!task && isOpen) {
            setFormData({
                name: '',
                quantity: 0,
                unit: 'kg',
                assignedTo: '',
                station: '',
                priority: 'normal',
                estimatedTime: 30,
                notes: '',
                dueDate: new Date(),
                isCompleted: false,
            });
        }
    }, [task, isOpen]);

    const handleSave = async () => {
        if (!formData.name) {
            showToast("Le nom de la tâche est requis", "error");
            return;
        }
        if (!formData.quantity || formData.quantity <= 0) {
            showToast("La quantité doit être supérieure à 0", "error");
            return;
        }

        try {
            if (task) {
                await updatePrepTask(task.id, formData);
                showToast("Tâche de préparation mise à jour", "success");
            } else {
                await addPrepTask({
                    ...formData,
                    isCompleted: false,
                    dueDate: formData.dueDate || new Date(),
                } as Omit<MiseEnPlaceTask, 'id'>);
                showToast("Nouvelle tâche de préparation créée", "success");
            }
            onClose();
        } catch (error) {
            showToast("Erreur lors de l'enregistrement", "error");
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="md"
            className="p-0"
            showClose={false}
            noPadding
        >
            <div className="flex flex-col bg-bg-primary">
                {/* Custom Header */}
                <div className="px-10 py-8 border-b border-border bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center shadow-xl shadow-accent/20">
                                <FileText className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-serif font-black tracking-tight">
                                    {task ? 'Modifier la Tâche' : 'Nouveau Protocole'}
                                </h2>
                                <p className="text-white/50 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Mise en place / Production</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white/50 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Form Content */}
                <div className="px-10 py-8 space-y-8 overflow-y-auto max-h-[60vh] elegant-scrollbar">
                    {/* Task Name */}
                    <div className="group">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 block">Intitulé de la Préparation</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full h-14 px-6 bg-bg-tertiary rounded-2xl border-2 border-transparent focus:border-accent focus:bg-white font-serif font-black text-lg outline-none transition-all placeholder:text-text-muted/30"
                            placeholder="Ex: Fond de Veau Réduit..."
                        />
                    </div>

                    {/* Quantity & Unit */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 block flex items-center gap-2">
                                <Scale className="w-3.5 h-3.5" />
                                Volume Cible
                            </label>
                            <input
                                type="number"
                                value={formData.quantity || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                                className="w-full h-14 px-6 bg-bg-tertiary rounded-2xl border-2 border-transparent focus:border-accent focus:bg-white font-black text-lg outline-none transition-all"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <PremiumSelect
                                label="Unité de Mesure"
                                value={formData.unit || 'kg'}
                                onChange={(val) => setFormData(prev => ({ ...prev, unit: val }))}
                                options={UNITS.map(unit => ({ value: unit, label: unit.toUpperCase() }))}
                            />
                        </div>
                    </div>

                    {/* Station & Assignment */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <PremiumSelect
                                label="Station Cuisine"
                                value={formData.station || ''}
                                onChange={(val) => setFormData(prev => ({ ...prev, station: val }))}
                                options={[
                                    { value: '', label: 'NON ASSIGNÉE' },
                                    ...STATIONS.map(station => ({ value: station, label: station.toUpperCase() }))
                                ]}
                                icon={<MapPin className="w-3.5 h-3.5" />}
                            />
                        </div>
                        <div>
                            <PremiumSelect
                                label="Opérateur"
                                value={formData.assignedTo || ''}
                                onChange={(val) => setFormData(prev => ({ ...prev, assignedTo: val }))}
                                options={[
                                    { value: '', label: 'LIBRE / POOL' },
                                    ...STAFF_MEMBERS.map(staff => ({ value: staff, label: staff.toUpperCase() }))
                                ]}
                                icon={<User className="w-3.5 h-3.5" />}
                            />
                        </div>
                    </div>

                    {/* Priority Selector */}
                    <div>
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4 block">Niveau de Priorité</label>
                        <div className="grid grid-cols-4 gap-3">
                            {PRIORITIES.map(p => (
                                <motion.button
                                    key={p.value}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setFormData(prev => ({ ...prev, priority: p.value as any }))}
                                    className={cn(
                                        "h-14 rounded-2xl font-black text-[10px] uppercase tracking-wider transition-all border-2",
                                        formData.priority === p.value
                                            ? "border-accent bg-accent/5 text-accent shadow-sm"
                                            : "border-transparent bg-bg-tertiary text-text-muted hover:bg-bg-tertiary/70"
                                    )}
                                >
                                    {p.label}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Estimated Time */}
                    <div className="bg-bg-tertiary p-6 rounded-[2rem] border border-border/50">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4 block flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" />
                            Temps Alloué (Minutes)
                        </label>
                        <div className="flex items-center gap-6">
                            <input
                                type="range"
                                min="5"
                                max="180"
                                step="5"
                                value={formData.estimatedTime || 30}
                                onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: parseInt(e.target.value) }))}
                                className="flex-1 accent-accent"
                            />
                            <div className="w-24 h-12 bg-white rounded-xl border border-border flex items-center justify-center font-black text-lg">
                                {formData.estimatedTime}
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 block">Consignes & Détails</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                            className="w-full h-32 px-6 py-5 bg-bg-tertiary rounded-2xl border-2 border-transparent focus:border-accent focus:bg-white font-bold text-sm outline-none resize-none transition-all placeholder:text-text-muted/30"
                            placeholder="Précisez les points critiques du protocole..."
                        />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-10 py-8 border-t border-border bg-bg-tertiary flex gap-4">
                    <Button
                        variant="outline"
                        className="flex-1 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest border-border bg-white hover:bg-bg-tertiary transition-all"
                        onClick={onClose}
                    >
                        Annuler
                    </Button>
                    <Button
                        className="flex-1 h-14 bg-accent hover:bg-accent/90 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white shadow-xl shadow-accent/20 transition-all transform hover:scale-[1.02]"
                        onClick={handleSave}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {task ? 'Mettre à jour le Protocole' : 'Générer le Protocole'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
