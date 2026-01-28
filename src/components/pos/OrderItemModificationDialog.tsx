"use client";

import { useState } from "react";
import { X, Minus, Plus, AlertTriangle, Send, ChefHat, Trash2, PlusCircle, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { OrderItem, OrderItemModification } from "@/types";
import { useOrders } from "@/context/OrdersContext";
import { useAuth } from "@/context/AuthContext";
import { Modal } from "@/components/ui/Modal";

// Common ingredients that can be removed/added
const COMMON_INGREDIENTS = [
    'Oignon', 'Ail', 'Sel', 'Poivre', 'Fromage', 'Sauce', 'Crème',
    'Beurre', 'Huile', 'Persil', 'Basilic', 'Tomate', 'Salade',
    'Cornichon', 'Moutarde', 'Mayonnaise', 'Ketchup'
];

interface OrderItemModificationDialogProps {
    orderId: string;
    item: OrderItem;
    isOpen: boolean;
    onClose: () => void;
}

export function OrderItemModificationDialog({
    orderId,
    item,
    isOpen,
    onClose
}: OrderItemModificationDialogProps) {
    const { requestItemModification, updateOrderItem } = useOrders();
    const { currentUser } = useAuth();

    const [removedIngredients, setRemovedIngredients] = useState<string[]>(item.removedIngredients || []);
    const [addedIngredients, setAddedIngredients] = useState<string[]>(item.addedIngredients || []);
    const [notes, setNotes] = useState(item.notes || '');
    const [customIngredient, setCustomIngredient] = useState('');
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [modificationType, setModificationType] = useState<'remove' | 'add'>('remove');

    if (!isOpen) return null;

    const toggleIngredientRemoval = (ingredient: string) => {
        setRemovedIngredients(prev =>
            prev.includes(ingredient)
                ? prev.filter(i => i !== ingredient)
                : [...prev, ingredient]
        );
    };

    const toggleIngredientAddition = (ingredient: string) => {
        setAddedIngredients(prev =>
            prev.includes(ingredient)
                ? prev.filter(i => i !== ingredient)
                : [...prev, ingredient]
        );
    };

    const addCustomIngredient = () => {
        if (customIngredient.trim()) {
            if (modificationType === 'remove') {
                setRemovedIngredients(prev => [...prev, customIngredient.trim()]);
            } else {
                setAddedIngredients(prev => [...prev, customIngredient.trim()]);
            }
            setCustomIngredient('');
            setShowCustomInput(false);
        }
    };

    const hasChanges = () => {
        const origRemoved = item.removedIngredients || [];
        const origAdded = item.addedIngredients || [];
        const origNotes = item.notes || '';

        return JSON.stringify(removedIngredients.sort()) !== JSON.stringify(origRemoved.sort()) ||
            JSON.stringify(addedIngredients.sort()) !== JSON.stringify(origAdded.sort()) ||
            notes !== origNotes;
    };

    const handleSendModification = async () => {
        const origRemoved = item.removedIngredients || [];
        const origAdded = item.addedIngredients || [];

        // Check what changed
        const newRemovals = removedIngredients.filter(i => !origRemoved.includes(i));
        const newAdditions = addedIngredients.filter(i => !origAdded.includes(i));
        const notesChanged = notes !== (item.notes || '');

        // Build modification description
        const changes: string[] = [];
        if (newRemovals.length > 0) {
            changes.push(`SANS: ${newRemovals.join(', ')}`);
        }
        if (newAdditions.length > 0) {
            changes.push(`AVEC: ${newAdditions.join(', ')}`);
        }
        if (notesChanged) {
            changes.push(`Note: ${notes}`);
        }

        // Request modification to kitchen
        if (changes.length > 0) {
            // If item is already being prepared, send request to kitchen
            if (item.status === 'cooking' || item.status === 'pending') {
                await requestItemModification(orderId, item.id, {
                    type: newRemovals.length > 0 ? 'ingredient_remove' :
                        newAdditions.length > 0 ? 'ingredient_add' : 'note_update',
                    description: changes.join(' | '),
                    oldValue: JSON.stringify({ removed: origRemoved, added: origAdded, notes: item.notes }),
                    newValue: JSON.stringify({ removed: removedIngredients, added: addedIngredients, notes }),
                    requestedBy: currentUser?.name || 'Serveur'
                });
            } else {
                // If not yet cooking, apply directly
                await updateOrderItem(orderId, item.id, {
                    removedIngredients,
                    addedIngredients,
                    notes
                });
            }
        }

        onClose();
    };

    const requiresApproval = item.status === 'cooking' || item.status === 'pending';

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="lg"
            className="p-0 border-none bg-transparent"
            showClose={false}
            noPadding
        >
            <div className="relative bg-black border border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,1)] w-full overflow-hidden group/modal">
                {/* Visual Accent Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/5 blur-[100px] pointer-events-none" />

                {/* Header */}
                <div className="p-10 border-b border-white/5 relative z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-[22px] bg-accent-gold/10 flex items-center justify-center border border-accent-gold/20 shadow-glow">
                                <ChefHat className="w-8 h-8 text-accent-gold" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-serif font-black text-white italic tracking-tight">{item.name}</h2>
                                <p className="text-[10px] font-black text-accent-gold/60 uppercase tracking-[0.4em] mt-2">Protocole de Modification Culinaire</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/10 hover:rotate-90"
                        >
                            <X className="w-5 h-5 text-white/40" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-10 space-y-10 relative z-10 overflow-y-auto max-h-[65vh] elegant-scrollbar">
                    {/* Warning if requires approval */}
                    {requiresApproval && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-start gap-5 p-6 bg-amber-500/10 border border-amber-500/20 rounded-[2rem]"
                        >
                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                                <p className="text-[11px] font-black text-amber-500 uppercase tracking-widest mt-1">Production en cours</p>
                                <p className="text-[13px] text-white/60 font-medium leading-relaxed mt-1">Ce plat est déjà en phase de production. Votre modification sera transmise au Chef pour homologation.</p>
                            </div>
                        </motion.div>
                    )}

                    {/* Modification Sections Area */}
                    <div className="space-y-12">
                        {/* Remove Ingredients Section */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] flex items-center gap-3">
                                    <Minus className="w-3.5 h-3.5 text-red-500/60" />
                                    Retrait d&apos;ingrédients
                                </h3>
                                <button
                                    onClick={() => { setModificationType('remove'); setShowCustomInput(true); }}
                                    className="text-[9px] font-black text-accent-gold uppercase tracking-[0.2em] hover:text-white transition-colors"
                                >
                                    + Ajouter Manuel
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2.5">
                                {COMMON_INGREDIENTS.map(ingredient => {
                                    const isRemoved = removedIngredients.includes(ingredient);
                                    return (
                                        <button
                                            key={ingredient}
                                            onClick={() => toggleIngredientRemoval(ingredient)}
                                            className={cn(
                                                "px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 border-2",
                                                isRemoved
                                                    ? "bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                                                    : "bg-white/5 border-white/5 text-white/40 hover:border-white/20 hover:text-white/60"
                                            )}
                                        >
                                            {isRemoved && <span className="mr-2">✗</span>}
                                            {ingredient}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Add Ingredients Section */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] flex items-center gap-3">
                                    <Plus className="w-3.5 h-3.5 text-green-500/60" />
                                    Éléments additionnels
                                </h3>
                                <button
                                    onClick={() => { setModificationType('add'); setShowCustomInput(true); }}
                                    className="text-[9px] font-black text-accent-gold uppercase tracking-[0.2em] hover:text-white transition-colors"
                                >
                                    + Ajouter Manuel
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2.5">
                                {COMMON_INGREDIENTS.map(ingredient => {
                                    const isAdded = addedIngredients.includes(ingredient);
                                    return (
                                        <button
                                            key={ingredient}
                                            onClick={() => toggleIngredientAddition(ingredient)}
                                            className={cn(
                                                "px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 border-2",
                                                isAdded
                                                    ? "bg-green-500/20 border-green-500 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                                                    : "bg-white/5 border-white/5 text-white/40 hover:border-white/20 hover:text-white/60"
                                            )}
                                        >
                                            {isAdded && <span className="mr-2">✓</span>}
                                            {ingredient}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Custom Input Modal-like area */}
                        <AnimatePresence>
                            {showCustomInput && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="p-6 bg-white/[0.03] border border-white/10 rounded-[2rem] flex items-center gap-4 group"
                                >
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            placeholder={`Ingrédient à ${modificationType === 'remove' ? 'ÉCARTER' : 'AJOUTER'}...`}
                                            value={customIngredient}
                                            onChange={(e) => setCustomIngredient(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && addCustomIngredient()}
                                            className="w-full bg-transparent text-sm font-black text-white placeholder:text-white/10 focus:outline-none uppercase tracking-widest"
                                            autoFocus
                                        />
                                        <div className="absolute bottom-0 left-0 w-full h-px bg-white/10 group-focus-within:bg-accent-gold transition-colors" />
                                    </div>
                                    <button
                                        onClick={addCustomIngredient}
                                        disabled={!customIngredient.trim()}
                                        className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                                            modificationType === 'remove'
                                                ? "bg-red-500 text-white hover:bg-red-600 shadow-glow-red"
                                                : "bg-green-500 text-white hover:bg-green-600 shadow-glow-green"
                                        )}
                                    >
                                        <Check className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => { setShowCustomInput(false); setCustomIngredient(''); }}
                                        className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 text-white/20 hover:text-white transition-all flex items-center justify-center"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Notes Section */}
                        <div className="space-y-6">
                            <label className="text-[10px] font-black text-accent-gold uppercase tracking-[0.4em] px-2 block">DIRECTIVES À LA BRIGADE</label>
                            <div className="relative group">
                                <textarea
                                    placeholder="CONSIGNES SPÉCIFIQUES POUR LA CUISINE..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-8 text-sm font-serif italic text-white placeholder:text-white/10 focus:outline-none focus:border-accent-gold/40 transition-all resize-none min-h-[120px]"
                                />
                                <div className="absolute top-4 right-6 pointer-events-none opacity-10">
                                    <ChefHat className="w-8 h-8 text-accent-gold" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-10 border-t border-white/5 bg-white/[0.02] flex items-center justify-between gap-6 relative z-10">
                    <button
                        onClick={onClose}
                        className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-white transition-all"
                    >
                        ABANDONNER
                    </button>
                    <button
                        onClick={handleSendModification}
                        disabled={!hasChanges()}
                        className={cn(
                            "flex items-center gap-4 px-12 py-5 rounded-[22px] text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-500 relative overflow-hidden group/btn shadow-glow",
                            hasChanges()
                                ? requiresApproval
                                    ? "bg-amber-500 text-black hover:bg-white"
                                    : "bg-accent-gold text-black hover:bg-white"
                                : "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
                        )}
                    >
                        <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        {requiresApproval ? "TRANSMETTRE AU CHEF" : "HOMOLOGUER"}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                    </button>
                </div>
            </div>
        </Modal>
    );

}
