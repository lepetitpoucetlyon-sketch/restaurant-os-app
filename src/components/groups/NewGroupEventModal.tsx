"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Calendar,
    Clock,
    MapPin,
    Building2,
    User,
    Mail,
    Phone,
    Sparkles,
    CheckCircle2,
    PartyPopper
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { PremiumSelect } from '@/components/ui/PremiumSelect';
import { cn } from '@/lib/utils';
import {
    EventType,
    EVENT_TYPE_LABELS,
    SpaceConfiguration
} from '@/types';

interface NewGroupEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (event: any) => void;
}

const SPACES = [
    { id: 'space-1', name: 'Salon Napoléon', capacity: 100 },
    { id: 'space-2', name: 'Salle des Lumières', capacity: 60 },
    { id: 'space-3', name: 'Terrasse Panoramique', capacity: 150 }
];

const CONFIGURATIONS: SpaceConfiguration[] = ['banquet', 'cocktail', 'theater', 'classroom', 'u_shape', 'cabaret'];

export function NewGroupEventModal({ isOpen, onClose, onSuccess }: NewGroupEventModalProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        type: 'corporate' as EventType,
        organizerType: 'company' as 'individual' | 'company',
        organizerName: '',
        companyName: '',
        email: '',
        phone: '',
        eventDate: '',
        startTime: '',
        endTime: '',
        spaceId: 'space-1',
        configuration: 'banquet' as SpaceConfiguration,
        guests: 50
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate creation
        onSuccess({
            ...formData,
            id: Math.random().toString(36).substr(2, 9),
            status: 'inquiry',
            createdAt: new Date().toISOString()
        });
        onClose();
        setStep(1); // Reset for next time
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Nouvelle Privatisation"
            size="lg"
            variant="premium"
        >
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Progress Mini Bar */}
                <div className="flex items-center gap-2 mb-8">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={cn(
                                "h-1.5 flex-1 rounded-full transition-all duration-500",
                                step >= s ? "bg-[#C5A572] shadow-[0_0_10px_rgba(197,165,114,0.3)]" : "bg-bg-tertiary"
                            )}
                        />
                    ))}
                </div>

                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Nom de l'événement</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Ex: Séminaire Annuel Tech Corp"
                                        className="w-full h-14 bg-bg-tertiary border border-border rounded-2xl px-6 text-sm focus:outline-none focus:border-[#C5A572] transition-colors"
                                        required
                                    />
                                    <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A572]/30" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <PremiumSelect
                                    label="Type d'événement"
                                    value={formData.type}
                                    onChange={(val) => setFormData(p => ({ ...p, type: val as EventType }))}
                                    options={Object.entries(EVENT_TYPE_LABELS).map(([key, label]) => ({
                                        value: key,
                                        label: label
                                    }))}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Type d'organisateur</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData(p => ({ ...p, organizerType: 'company' }))}
                                    className={cn(
                                        "h-20 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all",
                                        formData.organizerType === 'company'
                                            ? "bg-[#C5A572]/10 border-[#C5A572] text-[#9F825B]"
                                            : "bg-transparent border-border text-text-muted hover:border-[#C5A572]/50"
                                    )}
                                >
                                    <Building2 className="w-5 h-5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Entreprise</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(p => ({ ...p, organizerType: 'individual' }))}
                                    className={cn(
                                        "h-20 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all",
                                        formData.organizerType === 'individual'
                                            ? "bg-[#C5A572]/10 border-[#C5A572] text-[#9F825B]"
                                            : "bg-transparent border-border text-text-muted hover:border-[#C5A572]/50"
                                    )}
                                >
                                    <User className="w-5 h-5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Particulier</span>
                                </button>
                            </div>
                        </div>

                        {formData.organizerType === 'company' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="space-y-2"
                            >
                                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Raison Sociale</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    placeholder="Nom de l'entreprise"
                                    className="w-full h-14 bg-bg-tertiary border border-border rounded-2xl px-6 text-sm focus:outline-none focus:border-[#C5A572] transition-colors"
                                />
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Nom du contact</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="organizerName"
                                        value={formData.organizerName}
                                        onChange={handleChange}
                                        className="w-full h-14 bg-bg-tertiary border border-border rounded-2xl px-6 pb-1 pt-4 text-sm focus:outline-none focus:border-[#C5A572] transition-colors"
                                        required
                                    />
                                    <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/30" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Email</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full h-14 bg-bg-tertiary border border-border rounded-2xl px-6 text-sm focus:outline-none focus:border-[#C5A572] transition-colors"
                                        required
                                    />
                                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/30" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Date prévue</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        name="eventDate"
                                        value={formData.eventDate}
                                        onChange={handleChange}
                                        className="w-full h-14 bg-bg-tertiary border border-border rounded-2xl px-6 text-sm focus:outline-none focus:border-[#C5A572] transition-colors"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Début</label>
                                    <input
                                        type="time"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleChange}
                                        className="w-full h-14 bg-bg-tertiary border border-border rounded-2xl px-6 text-sm focus:outline-none focus:border-[#C5A572] transition-colors"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Fin</label>
                                    <input
                                        type="time"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleChange}
                                        className="w-full h-14 bg-bg-tertiary border border-border rounded-2xl px-6 text-sm focus:outline-none focus:border-[#C5A572] transition-colors"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Espace souhaité</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {SPACES.map((space) => (
                                    <button
                                        key={space.id}
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, spaceId: space.id }))}
                                        className={cn(
                                            "p-4 rounded-2xl border flex flex-col items-center gap-3 transition-all text-center",
                                            formData.spaceId === space.id
                                                ? "bg-[#C5A572]/10 border-[#C5A572] text-[#9F825B]"
                                                : "bg-transparent border-border text-text-muted hover:border-[#C5A572]/50 shadow-sm"
                                        )}
                                    >
                                        <MapPin className="w-5 h-5" />
                                        <div className="space-y-1">
                                            <p className="text-[11px] font-black uppercase tracking-widest">{space.name}</p>
                                            <p className="text-[9px] opacity-60">Max {space.capacity} pers.</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Nombre de convives</label>
                                <div className="relative">
                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                    <input
                                        type="number"
                                        name="guests"
                                        value={formData.guests}
                                        onChange={handleChange}
                                        className="w-full h-14 bg-bg-tertiary border border-border rounded-2xl pl-12 pr-6 text-sm focus:outline-none focus:border-[#C5A572] transition-colors"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <PremiumSelect
                                    label="Configuration"
                                    value={formData.configuration}
                                    onChange={(val) => setFormData(p => ({ ...p, configuration: val as SpaceConfiguration }))}
                                    options={CONFIGURATIONS.map(c => ({
                                        value: c,
                                        label: (c || '').charAt(0).toUpperCase() + (c || '').slice(1).replace('_', ' ')
                                    }))}
                                />
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-[#00D9A6]/5 border border-[#00D9A6]/20 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#00D9A6]/10 flex items-center justify-center text-[#00D9A6]">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <p className="text-[11px] font-bold text-text-muted">
                                Une vérification automatique de disponibilité sera effectuée après validation.
                            </p>
                        </div>
                    </motion.div>
                )}

                <div className="flex items-center justify-between pt-8 border-t border-border mt-10">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={step === 1 ? onClose : prevStep}
                        className="text-[10px] font-black uppercase tracking-widest hover:bg-bg-tertiary"
                    >
                        {step === 1 ? 'Annuler' : 'Retour'}
                    </Button>

                    {step < 3 ? (
                        <Button
                            type="button"
                            onClick={nextStep}
                            className="h-12 px-8 bg-[#C5A572] text-white hover:bg-[#B39360] rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg"
                        >
                            Suivant
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            className="h-12 px-10 bg-[#00D9A6] text-white hover:bg-[#00BF92] rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-3"
                        >
                            <PartyPopper className="w-4 h-4" />
                            Créer la Demande
                        </Button>
                    )}
                </div>
            </form>
        </Modal>
    );
}
