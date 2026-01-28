"use client";

import { useState, useMemo } from "react";
import { useAuth, User } from "@/context/AuthContext";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import {
    CalendarRange,
    ChevronLeft,
    ChevronRight,
    Plus,
    Clock,
    MoreHorizontal,
    Bell,
    X,
    Trash2,
    Save,
    MapPin,
    User as UserIcon,
    Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { usePlanning, Shift as ContextShift } from "@/context/PlanningContext";
import { useIsMobile } from "@/hooks";
import { BottomSheet } from "@/components/ui/BottomSheet";

type Shift = ContextShift;
type ShiftType = 'morning' | 'lunch' | 'evening' | 'double' | 'off';

const ZONES = [
    { id: 'main', name: 'planning.zones.main' },
    { id: 'terrace', name: 'planning.zones.terrace' },
    { id: 'vip', name: 'planning.zones.vip' },
    { id: 'bar', name: 'planning.zones.bar' },
];

export default function PlanningPage() {
    const isMobile = useIsMobile();
    const { users } = useAuth();
    const { shifts, addShift, updateShift, deleteShift, publishShifts } = usePlanning();
    const { showToast } = useToast();
    const { t } = useLanguage();

    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'daily' | 'staff'>('daily');
    const [selectedDay, setSelectedDay] = useState(new Date());

    // BottomSheet State
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [activeShift, setActiveShift] = useState<Shift | null>(null);
    const [activeUser, setActiveUser] = useState<User | null>(null);

    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = [...Array(7)].map((_, i) => addDays(weekStart, i));

    const dayShifts = useMemo(() => {
        return shifts.filter(s => isSameDay(s.date, selectedDay));
    }, [shifts, selectedDay]);

    const handleCreateShift = (user: User) => {
        setActiveUser(user);
        setActiveShift(null);
        setIsEditOpen(true);
    };

    const handleEditShift = (shift: Shift) => {
        const user = users.find(u => u.id === shift.userId);
        if (user) {
            setActiveUser(user);
            setActiveShift(shift);
            setIsEditOpen(true);
        }
    };

    return (
        <div className="flex flex-1 flex-col bg-bg-primary h-[calc(100vh-80px)] lg:h-[calc(100vh-100px)] -m-4 lg:-m-8 overflow-hidden relative pb-24 lg:pb-0">
            {/* Header / Week Navigator */}
            <div className="bg-white/80 dark:bg-bg-primary/80 backdrop-blur-2xl px-6 py-6 border-b border-border/50 sticky top-0 z-40">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-4xl font-serif font-black italic text-text-primary tracking-tight">Planning<span className="text-accent-gold">.</span></h1>
                    <div className="flex bg-bg-tertiary p-1 rounded-full border border-border">
                        <button onClick={() => setViewMode('daily')} className={cn("px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all", viewMode === 'daily' ? "bg-white dark:bg-bg-primary shadow-sm" : "text-text-muted")}>JOUR</button>
                        <button onClick={() => setViewMode('staff')} className={cn("px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all", viewMode === 'staff' ? "bg-white dark:bg-bg-primary shadow-sm" : "text-text-muted")}>STAFF</button>
                    </div>
                </div>

                {/* Day Selection Bar (Sub-Categories) */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                    {weekDays.map((day, i) => {
                        const isSelected = isSameDay(day, selectedDay);
                        return (
                            <button
                                key={i}
                                onClick={() => setSelectedDay(day)}
                                className={cn(
                                    "flex flex-col items-center justify-center min-w-[64px] h-20 rounded-2xl border transition-all",
                                    isSelected ? "bg-text-primary text-white border-transparent shadow-xl scale-105" : "bg-bg-tertiary/50 text-text-muted border-border"
                                )}
                            >
                                <span className="text-[8px] font-black uppercase tracking-widest opacity-60 mb-1">{format(day, "EEE", { locale: fr })}</span>
                                <span className="text-xl font-serif italic font-black">{format(day, "d")}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* List View */}
            <div className="flex-1 overflow-auto p-4 space-y-4 elegant-scrollbar">
                <AnimatePresence mode="wait">
                    {viewMode === 'daily' ? (
                        <motion.div key="daily" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            {users.map(user => {
                                const shift = dayShifts.find(s => s.userId === user.id);
                                return (
                                    <motion.div
                                        key={user.id}
                                        onClick={() => shift ? handleEditShift(shift) : handleCreateShift(user)}
                                        className={cn(
                                            "bg-white dark:bg-bg-secondary p-5 rounded-[2rem] border border-border/50 flex items-center justify-between",
                                            !shift && "opacity-60 bg-bg-tertiary/30"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-bg-tertiary overflow-hidden border border-border">
                                                {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl font-serif italic">{user.name[0]}</div>}
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-serif font-black italic text-text-primary">{user.name}</h4>
                                                <p className="text-[9px] font-black text-accent-gold uppercase tracking-widest">{t(`planning.roles.${user.role}`)}</p>
                                            </div>
                                        </div>
                                        {shift ? (
                                            <div className="text-right">
                                                <p className="text-lg font-mono font-bold tracking-tighter text-text-primary">{shift.startTime}—{shift.endTime}</p>
                                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-text-muted">{shift.type.toUpperCase()}</span>
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 rounded-full border border-dashed border-border flex items-center justify-center text-text-muted/40">
                                                <Plus className="w-5 h-5" />
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <motion.div key="staff" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            {users.map(user => (
                                <div key={user.id} className="bg-white dark:bg-bg-secondary p-6 rounded-[2.5rem] border border-border/50 flex flex-col gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                            <UserIcon className="w-6 h-6" />
                                        </div>
                                        <h4 className="text-2xl font-serif font-black italic text-text-primary">{user.name}</h4>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 h-2">
                                        {weekDays.map((d, i) => (
                                            <div key={i} className={cn("rounded-full", shifts.some(s => s.userId === user.id && isSameDay(s.date, d)) ? "bg-accent-gold" : "bg-bg-tertiary")} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Shift Editor BottomSheet */}
            <BottomSheet
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                title={activeUser?.name || "Nouveau Shift"}
                subtitle={`${format(selectedDay, "EEEE d MMMM", { locale: fr })}`}
            >
                <div className="space-y-8 py-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-text-muted px-2">Début</label>
                            <input type="time" className="w-full h-14 bg-bg-tertiary rounded-2xl px-6 font-bold" defaultValue={activeShift?.startTime || "10:00"} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-text-muted px-2">Fin</label>
                            <input type="time" className="w-full h-14 bg-bg-tertiary rounded-2xl px-6 font-bold" defaultValue={activeShift?.endTime || "15:00"} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-text-muted px-2">Service</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['lunch', 'evening', 'double'].map(type => (
                                <button key={type} className={cn("h-12 rounded-xl text-[9px] font-black uppercase tracking-widest border", activeShift?.type === type ? "bg-text-primary text-white" : "bg-bg-tertiary text-text-muted")}>
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 flex gap-3">
                        {activeShift && (
                            <Button variant="ghost" onClick={() => { deleteShift(activeShift.id); setIsEditOpen(false); }} className="h-16 w-16 bg-error/10 text-error rounded-2xl">
                                <Trash2 className="w-6 h-6" />
                            </Button>
                        )}
                        <Button className="flex-1 h-16 bg-text-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest" onClick={() => setIsEditOpen(false)}>
                            Homologuer
                        </Button>
                    </div>
                </div>
            </BottomSheet>

            {/* Mobile FAB for Quick Actions */}
            {isMobile && !isEditOpen && (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => publishShifts([], weekStart, addDays(weekStart, 6))}
                    className="fixed bottom-28 right-6 w-14 h-14 bg-accent text-white rounded-full flex items-center justify-center shadow-2xl z-40 border-4 border-white dark:border-bg-primary"
                >
                    <Bell className="w-6 h-6" />
                </motion.button>
            )}
        </div>
    );
}
