"use client";

import { useState, useMemo, useEffect } from "react";
import { useAuth, User } from "@/context/AuthContext";
import { format, startOfWeek, addDays, getISOWeek, isSameDay } from "date-fns";
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
    User as UserIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

// --- Types ---
type ShiftType = 'morning' | 'lunch' | 'evening' | 'double' | 'off';

interface Shift {
    id: string;
    userId: string;
    date: Date;
    startTime: string;
    endTime: string;
    zoneId?: string;
    type: ShiftType;
    status: 'published' | 'draft';
}

// Available Zones (would normally come from TablesContext)
const ZONES = [
    { id: 'main', name: 'Salle Principale' },
    { id: 'terrace', name: 'Terrasse' },
    { id: 'vip', name: 'Carré VIP' },
    { id: 'bar', name: 'Bar' },
];

// --- Mock Initial Data ---
const generateMockShifts = (users: User[], startDate: Date): Shift[] => {
    const shifts: Shift[] = [];
    users.forEach(user => {
        for (let i = 0; i < 7; i++) {
            const date = addDays(startDate, i);
            if (Math.random() > 0.8) continue;
            const isEvening = Math.random() > 0.5;
            shifts.push({
                id: Math.random().toString(36).substr(2, 9),
                userId: user.id,
                date: date,
                startTime: isEvening ? "18:00" : "11:00",
                endTime: isEvening ? "23:00" : "15:00",
                type: isEvening ? 'evening' : 'lunch',
                zoneId: ZONES[Math.floor(Math.random() * ZONES.length)].id,
                status: 'published'
            });
        }
    });
    return shifts;
};

// --- Shift Edit Modal Component ---
interface ShiftEditModalProps {
    shift: Shift | null;
    user: User | null;
    date: Date | null;
    onClose: () => void;
    onSave: (shift: Shift) => void;
    onDelete: (shiftId: string) => void;
    onCreate: (newShift: Omit<Shift, 'id'>) => void;
}

const ShiftEditModal = ({ shift, user, date, onClose, onSave, onDelete, onCreate }: ShiftEditModalProps) => {
    const isNew = !shift;
    const [formData, setFormData] = useState({
        startTime: shift?.startTime || "11:00",
        endTime: shift?.endTime || "15:00",
        type: shift?.type || 'lunch' as ShiftType,
        zoneId: shift?.zoneId || ZONES[0].id,
    });

    const handleSave = () => {
        if (isNew && user && date) {
            onCreate({
                userId: user.id,
                date: date,
                startTime: formData.startTime,
                endTime: formData.endTime,
                type: formData.type,
                zoneId: formData.zoneId,
                status: 'draft'
            });
        } else if (shift) {
            onSave({
                ...shift,
                startTime: formData.startTime,
                endTime: formData.endTime,
                type: formData.type,
                zoneId: formData.zoneId,
            });
        }
        onClose();
    };

    const handleTypeChange = (type: ShiftType) => {
        setFormData(prev => ({
            ...prev,
            type,
            startTime: type === 'evening' ? "18:00" : type === 'lunch' ? "11:00" : "09:00",
            endTime: type === 'evening' ? "23:00" : type === 'lunch' ? "15:00" : "17:00",
        }));
    };

    if (!user || !date) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Modal Header */}
                <div className="bg-[#1A1A1A] p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-white/10 overflow-hidden">
                                {user.avatar ?
                                    <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} /> :
                                    <div className="w-full h-full flex items-center justify-center font-bold text-white/50">{user.name.charAt(0)}</div>
                                }
                            </div>
                            <div>
                                <h2 className="text-lg font-black">{isNew ? 'Nouveau Shift' : 'Modifier Shift'}</h2>
                                <p className="text-sm text-white/60">{user.name} • {format(date, "EEEE d MMMM", { locale: fr })}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                    {/* Service Type Selector */}
                    <div>
                        <label className="text-[10px] font-black text-[#ADB5BD] uppercase tracking-widest mb-3 block">Type de Service</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { id: 'lunch', label: 'Midi', emoji: '☀️' },
                                { id: 'evening', label: 'Soir', emoji: '🌙' },
                                { id: 'double', label: 'Coupure', emoji: '🔄' },
                            ].map(type => (
                                <button
                                    key={type.id}
                                    onClick={() => handleTypeChange(type.id as ShiftType)}
                                    className={cn(
                                        "p-3 rounded-xl border-2 text-center transition-all",
                                        formData.type === type.id
                                            ? "border-[#00D764] bg-[#E6F9EF]"
                                            : "border-neutral-100 hover:border-neutral-300"
                                    )}
                                >
                                    <span className="text-2xl">{type.emoji}</span>
                                    <p className={cn(
                                        "text-xs font-bold mt-1",
                                        formData.type === type.id ? "text-[#00D764]" : "text-[#1A1A1A]"
                                    )}>{type.label}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Time Inputs */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-[#ADB5BD] uppercase tracking-widest mb-2 block">Début</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ADB5BD]" />
                                <input
                                    type="time"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#00D764] focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-[#ADB5BD] uppercase tracking-widest mb-2 block">Fin</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ADB5BD]" />
                                <input
                                    type="time"
                                    value={formData.endTime}
                                    onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#00D764] focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Zone Selector */}
                    <div>
                        <label className="text-[10px] font-black text-[#ADB5BD] uppercase tracking-widest mb-2 block">Zone Assignée</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ADB5BD]" />
                            <select
                                value={formData.zoneId}
                                onChange={(e) => setFormData(prev => ({ ...prev, zoneId: e.target.value }))}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#00D764] focus:border-transparent appearance-none bg-white"
                            >
                                {ZONES.map(zone => (
                                    <option key={zone.id} value={zone.id}>{zone.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 bg-[#F8F9FA] border-t border-neutral-100 flex items-center justify-between">
                    {!isNew ? (
                        <Button
                            variant="ghost"
                            onClick={() => { onDelete(shift!.id); onClose(); }}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                        </Button>
                    ) : (
                        <div />
                    )}
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose} className="border-neutral-200">
                            Annuler
                        </Button>
                        <Button onClick={handleSave} className="bg-[#00D764] hover:bg-[#00C05A] text-white shadow-lg shadow-[#00D764]/20">
                            <Save className="w-4 h-4 mr-2" />
                            {isNew ? 'Créer' : 'Enregistrer'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Page Component ---
export default function PlanningPage() {
    const { users } = useAuth();
    const { showToast } = useToast();
    const [currentDate, setCurrentDate] = useState(new Date());

    // Derived State
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = [...Array(7)].map((_, i) => addDays(weekStart, i));
    const currentWeekNumber = getISOWeek(currentDate);

    // Shifts State with localStorage persistence
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load shifts from localStorage on mount
    useEffect(() => {
        const savedShifts = localStorage.getItem('executive_os_shifts');
        if (savedShifts) {
            try {
                const parsed = JSON.parse(savedShifts);
                // Convert date strings back to Date objects
                const restored = parsed.map((s: any) => ({
                    ...s,
                    date: new Date(s.date)
                }));
                setShifts(restored);
            } catch (e) {
                console.error('Failed to parse saved shifts', e);
                setShifts(generateMockShifts(users, weekStart));
            }
        } else {
            setShifts(generateMockShifts(users, weekStart));
        }
        setIsLoaded(true);
    }, []);

    // Save shifts to localStorage when they change
    useEffect(() => {
        if (isLoaded && shifts.length > 0) {
            localStorage.setItem('executive_os_shifts', JSON.stringify(shifts));
        }
    }, [shifts, isLoaded]);

    // Modal State
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    // Filter State
    const [activeFilter, setActiveFilter] = useState<'ALL' | 'server' | 'kitchen'>('ALL');

    // Filtered Users
    const filteredUsers = useMemo(() => {
        if (activeFilter === 'ALL') return users;
        return users.filter(u => u.role === activeFilter);
    }, [users, activeFilter]);

    // --- Helpers ---
    const getShiftForUserAndDate = (userId: string, date: Date) => {
        return shifts.find(s => s.userId === userId && isSameDay(s.date, date));
    };

    const handlePrevWeek = () => setCurrentDate(addDays(currentDate, -7));
    const handleNextWeek = () => setCurrentDate(addDays(currentDate, 7));
    const handleToday = () => setCurrentDate(new Date());

    // Open modal for editing or creating
    const handleCellClick = (user: User, date: Date) => {
        const existingShift = getShiftForUserAndDate(user.id, date);
        setSelectedShift(existingShift || null);
        setSelectedUser(user);
        setSelectedDate(date);
        setEditModalOpen(true);
    };

    // CRUD Operations
    const handleSaveShift = (updatedShift: Shift) => {
        setShifts(prev => prev.map(s => s.id === updatedShift.id ? updatedShift : s));
        showToast("Shift modifié avec succès", "premium");
    };

    const handleDeleteShift = (shiftId: string) => {
        setShifts(prev => prev.filter(s => s.id !== shiftId));
        showToast("Shift supprimé", "info");
    };

    const handleCreateShift = (newShiftData: Omit<Shift, 'id'>) => {
        const newShift: Shift = {
            ...newShiftData,
            id: Math.random().toString(36).substr(2, 9),
        };
        setShifts(prev => [...prev, newShift]);
        showToast("Nouveau shift créé", "premium");
    };

    // Publish Planning
    const handlePublish = () => {
        setShifts(prev => prev.map(s => ({ ...s, status: 'published' as const })));
        showToast("Planning publié et notifications envoyées à l'équipe !", "premium");
    };

    // Calculate total hours
    const totalHours = useMemo(() => {
        let midi = 0;
        let soir = 0;
        shifts.forEach(s => {
            const start = parseInt(s.startTime.split(':')[0]);
            const end = parseInt(s.endTime.split(':')[0]);
            const hours = end - start;
            if (s.type === 'evening') soir += hours;
            else midi += hours;
        });
        return { midi, soir, total: midi + soir };
    }, [shifts]);

    return (
        <div className="flex h-[calc(100vh-70px)] -m-6 flex-col bg-[#F8F9FA] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between bg-white border-b border-neutral-100 px-8 py-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#F8F9FA] flex items-center justify-center text-[#1A1A1A]">
                        <CalendarRange className="w-5 h-5" />
                    </div>
                </div>

                {/* Week & Date Navigation */}
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center">
                        <h1 className="text-xl font-black text-[#1A1A1A] tracking-tight">Planning Brigade</h1>
                        <p className="text-[11px] font-bold text-[#ADB5BD] uppercase tracking-wider mt-0.5">
                            Semaine {currentWeekNumber} • {format(weekStart, "d MMMM", { locale: fr })} - {format(addDays(weekStart, 6), "d MMMM yyyy", { locale: fr })}
                        </p>
                    </div>

                    <div className="flex items-center bg-[#F8F9FA] rounded-xl p-1 border border-neutral-100">
                        <button onClick={handlePrevWeek} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-[#1A1A1A]">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button onClick={handleToday} className="px-3 py-1.5 text-[10px] font-black text-[#1A1A1A] uppercase tracking-widest hover:bg-white rounded-lg transition-all">
                            Aujourd'hui
                        </button>
                        <button onClick={handleNextWeek} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-[#1A1A1A]">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Role Filter Tabs */}
                    <div className="flex p-1 bg-[#F8F9FA] rounded-xl border border-neutral-100 mr-4">
                        {[
                            { id: 'ALL', label: 'Tous' },
                            { id: 'server', label: 'Salle' },
                            { id: 'kitchen', label: 'Cuisine' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveFilter(tab.id as any)}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                                    activeFilter === tab.id
                                        ? "bg-white text-[#1A1A1A] shadow-sm"
                                        : "text-[#ADB5BD] hover:text-[#1A1A1A]"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <Button
                        className="h-10 bg-[#1A1A1A] hover:bg-black text-white gap-2 rounded-xl shadow-lg shadow-black/10"
                        onClick={handlePublish}
                    >
                        <Bell className="w-4 h-4 text-[#00D764]" />
                        Publier
                    </Button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 overflow-auto p-6">
                <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden min-w-[1000px]">

                    {/* Grid Header (Days) */}
                    <div className="grid grid-cols-[250px_repeat(7,1fr)] border-b border-neutral-100 sticky top-0 bg-white z-10">
                        <div className="p-4 border-r border-neutral-100 bg-[#F8F9FA]/50 flex items-center">
                            <span className="text-[10px] font-black text-[#ADB5BD] uppercase tracking-widest">Employés ({filteredUsers.length})</span>
                        </div>
                        {weekDays.map((day, i) => {
                            const isToday = isSameDay(day, new Date());
                            return (
                                <div key={i} className={cn(
                                    "p-4 text-center border-r border-neutral-100 last:border-0",
                                    isToday ? "bg-[#E6F9EF]/30" : ""
                                )}>
                                    <p className={cn(
                                        "text-[10px] font-black uppercase tracking-widest mb-1",
                                        isToday ? "text-[#00D764]" : "text-[#ADB5BD]"
                                    )}>
                                        {format(day, "EEEE", { locale: fr })}
                                    </p>
                                    <p className={cn(
                                        "text-xl font-black",
                                        isToday ? "text-[#00D764]" : "text-[#1A1A1A]"
                                    )}>
                                        {format(day, "d")}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Grid Body (Users Rows) */}
                    <div className="divide-y divide-neutral-100">
                        {filteredUsers.map(user => (
                            <div key={user.id} className="grid grid-cols-[250px_repeat(7,1fr)] group hover:bg-[#F8F9FA]/30 transition-colors">

                                {/* User Info Col */}
                                <div className="p-4 border-r border-neutral-100 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-neutral-100 overflow-hidden shrink-0">
                                        {user.avatar ?
                                            <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} /> :
                                            <div className="w-full h-full flex items-center justify-center font-bold text-[#ADB5BD]">{user.name.charAt(0)}</div>
                                        }
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-[#1A1A1A] truncate">{user.name}</p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#00D764]" />
                                            <p className="text-[10px] font-bold text-[#ADB5BD] uppercase tracking-wide truncate">{user.role}</p>
                                        </div>
                                    </div>
                                    <button
                                        className="ml-auto opacity-0 group-hover:opacity-100 p-1 hover:bg-neutral-100 rounded-lg transition-all"
                                        onClick={() => showToast(`Options pour ${user.name}`, "info")}
                                    >
                                        <MoreHorizontal className="w-4 h-4 text-[#ADB5BD]" />
                                    </button>
                                </div>

                                {/* Days Cols */}
                                {weekDays.map((day, i) => {
                                    const shift = getShiftForUserAndDate(user.id, day);
                                    const isToday = isSameDay(day, new Date());
                                    const zoneName = shift ? ZONES.find(z => z.id === shift.zoneId)?.name || 'Non assigné' : '';

                                    return (
                                        <div
                                            key={i}
                                            onClick={() => handleCellClick(user, day)}
                                            className={cn(
                                                "p-2 border-r border-neutral-100 last:border-0 relative h-24 transition-colors cursor-pointer hover:bg-[#F8F9FA]/50",
                                                isToday ? "bg-[#E6F9EF]/10" : ""
                                            )}
                                        >
                                            {shift ? (
                                                <div className={cn(
                                                    "w-full h-full rounded-xl p-2.5 shadow-sm border flex flex-col justify-between group/shift transition-all hover:scale-[1.02] hover:shadow-md",
                                                    shift.type === 'evening'
                                                        ? "bg-[#1A1A1A] border-[#1A1A1A] text-white"
                                                        : "bg-white border-neutral-200 text-[#1A1A1A]",
                                                    shift.status === 'draft' && "border-dashed border-amber-400"
                                                )}>
                                                    <div className="flex items-center justify-between">
                                                        <span className={cn(
                                                            "text-[9px] font-black uppercase tracking-wider",
                                                            shift.type === 'evening' ? "text-[#ADB5BD]" : "text-[#ADB5BD]"
                                                        )}>
                                                            {shift.type === 'evening' ? 'Soir' : shift.type === 'double' ? 'Coupure' : 'Midi'}
                                                        </span>
                                                        <div className={cn(
                                                            "w-1.5 h-1.5 rounded-full",
                                                            shift.type === 'evening' ? "bg-[#00D764]" : "bg-amber-400"
                                                        )} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black mb-0.5 tracking-tight">
                                                            {shift.startTime} - {shift.endTime}
                                                        </p>
                                                        <p className={cn(
                                                            "text-[9px] font-bold truncate",
                                                            shift.type === 'evening' ? "text-neutral-400" : "text-neutral-400"
                                                        )}>
                                                            {zoneName}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                    <div className="w-8 h-8 rounded-full bg-[#E6F9EF] flex items-center justify-center border border-dashed border-[#00D764]">
                                                        <Plus className="w-4 h-4 text-[#00D764]" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    {/* Summary Footer */}
                    <div className="border-t border-neutral-100 p-6 bg-[#F8F9FA]/50">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-[#1A1A1A]">Total Heures Planifiées</h3>
                            <div className="flex gap-8">
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-[#ADB5BD] uppercase tracking-widest">Service Midi</p>
                                    <p className="text-lg font-black text-[#1A1A1A]">{totalHours.midi}h</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-[#ADB5BD] uppercase tracking-widest">Service Soir</p>
                                    <p className="text-lg font-black text-[#1A1A1A]">{totalHours.soir}h</p>
                                </div>
                                <div className="text-right pl-8 border-l border-neutral-200">
                                    <p className="text-[10px] font-black text-[#00D764] uppercase tracking-widest">Total</p>
                                    <p className="text-2xl font-black text-[#1A1A1A]">{totalHours.total}h</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shift Edit Modal */}
            {editModalOpen && (
                <ShiftEditModal
                    shift={selectedShift}
                    user={selectedUser}
                    date={selectedDate}
                    onClose={() => setEditModalOpen(false)}
                    onSave={handleSaveShift}
                    onDelete={handleDeleteShift}
                    onCreate={handleCreateShift}
                />
            )}
        </div>
    );
}
