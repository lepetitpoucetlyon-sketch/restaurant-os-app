"use client";

import { useState } from "react";
import { X, Plus, Clock, User, AlertCircle, Save, MapPin, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRecipes, MiseEnPlaceTask } from "@/context/RecipeContext";
import { useToast } from "@/components/ui/Toast";

interface PrepTaskDialogProps {
    isOpen: boolean;
    onClose: () => void;
    task?: MiseEnPlaceTask; // If provided, we're editing
}

const STATIONS = ['Garde-manger', 'Entrées', 'Poissons', 'Viandes', 'Saucier', 'Pâtisserie', 'Légumerie', 'Plonge'];
const STAFF_MEMBERS = ['Jean', 'Marie', 'Pierre', 'Sophie', 'Alexandre', 'Claire'];
const PRIORITIES = [
    { value: 'low', label: 'Basse', color: '#ADB5BD' },
    { value: 'normal', label: 'Normale', color: '#4285F4' },
    { value: 'high', label: 'Haute', color: '#FF9900' },
    { value: 'urgent', label: 'Urgente', color: '#FF4D4D' },
];
const UNITS = ['kg', 'g', 'L', 'cl', 'ml', 'portions', 'pièces', 'barquettes'];

export function PrepTaskDialog({ isOpen, onClose, task }: PrepTaskDialogProps) {
    const { showToast } = useToast();
    const { addPrepTask, updatePrepTask } = useRecipes();

    const [formData, setFormData] = useState<Partial<MiseEnPlaceTask>>({
        name: task?.name || '',
        quantity: task?.quantity || 0,
        unit: task?.unit || 'kg',
        assignedTo: task?.assignedTo || '',
        station: task?.station || '',
        priority: task?.priority || 'normal',
        estimatedTime: task?.estimatedTime || 30,
        notes: task?.notes || '',
        dueDate: task?.dueDate || new Date(),
        isCompleted: task?.isCompleted || false,
    });

    const handleSave = () => {
        if (!formData.name) {
            showToast("Le nom de la tâche est requis", "error");
            return;
        }
        if (!formData.quantity || formData.quantity <= 0) {
            showToast("La quantité doit être supérieure à 0", "error");
            return;
        }

        if (task) {
            updatePrepTask(task.id, formData);
            showToast("Tâche mise à jour avec succès", "success");
        } else {
            addPrepTask({
                ...formData,
                isCompleted: false,
                dueDate: formData.dueDate || new Date(),
            } as Omit<MiseEnPlaceTask, 'id'>);
            showToast("Nouvelle tâche de préparation créée", "success");
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-[#1A1A1A] text-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#00D764]/20 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-[#00D764]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black">
                                {task ? 'Modifier la Tâche' : 'Nouvelle Tâche'}
                            </h2>
                            <p className="text-white/60 text-sm">Mise en place</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                    {/* Task Name */}
                    <div>
                        <label className="text-[11px] font-black text-[#ADB5BD] uppercase">Nom de la tâche *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full h-12 mt-1 px-4 bg-[#F8F9FA] rounded-xl border-2 border-transparent focus:border-[#1A1A1A] font-bold outline-none"
                            placeholder="Ex: Préparer la brunoise de légumes"
                        />
                    </div>

                    {/* Quantity & Unit */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[11px] font-black text-[#ADB5BD] uppercase">Quantité *</label>
                            <input
                                type="number"
                                value={formData.quantity || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                                className="w-full h-12 mt-1 px-4 bg-[#F8F9FA] rounded-xl border-2 border-transparent focus:border-[#1A1A1A] font-bold outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-black text-[#ADB5BD] uppercase">Unité</label>
                            <select
                                value={formData.unit}
                                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                                className="w-full h-12 mt-1 px-4 bg-[#F8F9FA] rounded-xl border-2 border-transparent focus:border-[#1A1A1A] font-bold outline-none"
                            >
                                {UNITS.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Station & Assignment */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[11px] font-black text-[#ADB5BD] uppercase flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                Station
                            </label>
                            <select
                                value={formData.station}
                                onChange={(e) => setFormData(prev => ({ ...prev, station: e.target.value }))}
                                className="w-full h-12 mt-1 px-4 bg-[#F8F9FA] rounded-xl border-2 border-transparent focus:border-[#1A1A1A] font-bold outline-none"
                            >
                                <option value="">Non assignée</option>
                                {STATIONS.map(station => <option key={station} value={station}>{station}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[11px] font-black text-[#ADB5BD] uppercase flex items-center gap-1">
                                <User className="w-3 h-3" />
                                Assigné à
                            </label>
                            <select
                                value={formData.assignedTo}
                                onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                                className="w-full h-12 mt-1 px-4 bg-[#F8F9FA] rounded-xl border-2 border-transparent focus:border-[#1A1A1A] font-bold outline-none"
                            >
                                <option value="">Non assigné</option>
                                {STAFF_MEMBERS.map(staff => <option key={staff} value={staff}>{staff}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="text-[11px] font-black text-[#ADB5BD] uppercase mb-2 block">Priorité</label>
                        <div className="flex gap-2">
                            {PRIORITIES.map(p => (
                                <button
                                    key={p.value}
                                    onClick={() => setFormData(prev => ({ ...prev, priority: p.value as any }))}
                                    className={cn(
                                        "flex-1 h-11 rounded-xl font-bold text-sm transition-all border-2",
                                        formData.priority === p.value
                                            ? "border-transparent text-white"
                                            : "border-[#E9ECEF] bg-white text-[#6C757D] hover:bg-[#F8F9FA]"
                                    )}
                                    style={{
                                        backgroundColor: formData.priority === p.value ? p.color : undefined,
                                    }}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Estimated Time */}
                    <div>
                        <label className="text-[11px] font-black text-[#ADB5BD] uppercase flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Temps estimé (minutes)
                        </label>
                        <input
                            type="number"
                            value={formData.estimatedTime || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: parseInt(e.target.value) || 0 }))}
                            className="w-full h-12 mt-1 px-4 bg-[#F8F9FA] rounded-xl border-2 border-transparent focus:border-[#1A1A1A] font-bold outline-none"
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="text-[11px] font-black text-[#ADB5BD] uppercase">Notes</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                            className="w-full h-20 mt-1 px-4 py-3 bg-[#F8F9FA] rounded-xl border-2 border-transparent focus:border-[#1A1A1A] font-bold outline-none resize-none"
                            placeholder="Instructions supplémentaires..."
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-[#F8F9FA] border-t border-neutral-100 flex gap-3">
                    <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={onClose}>
                        Annuler
                    </Button>
                    <Button className="flex-1 h-12 bg-[#00D764] hover:bg-[#00B956] rounded-xl font-bold" onClick={handleSave}>
                        <Save className="w-4 h-4 mr-2" />
                        {task ? 'Mettre à jour' : 'Créer la tâche'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
