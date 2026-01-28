"use client";

import { useState } from "react";
import { useAuth, User } from "@/context/AuthContext";
import { useOrders } from "@/context/OrdersContext";
import { usePlanning } from "@/context/PlanningContext";
import { format, startOfWeek, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import {
    Users,
    Plus,
    Search,
    Mail,
    Phone,
    Calendar,
    ChevronRight,
    Shield,
    UserCheck,
    Clock,
    DollarSign,
    Star,
    FileText,
    Award,
    Briefcase,
    Download,
    User as UserIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    staggerContainer,
    staggerItem,
    cinematicContainer,
    fadeInUp,
    buttonTap,
    buttonHover
} from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { generatePaySlip } from "@/lib/paySlipGenerator";
import { OptimizationDialog } from "@/components/ui/OptimizationDialog";
import { Modal, PremiumSelect, SecurityPinModal } from "@/components/ui";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";

const ROLES = [
    { value: 'admin', label: 'Administrateur' },
    { value: 'manager', label: 'Directeur' },
    { value: 'floor_manager', label: 'Responsable de salle' },
    { value: 'server', label: 'Serveur(se)' },
    { value: 'bartender', label: 'Barman/Barmaid' },
    { value: 'kitchen_chef', label: 'Chef de cuisine' },
    { value: 'kitchen_line', label: 'Commis de cuisine' },
    { value: 'host', label: 'Hôte(sse) d\'accueil' },
    { value: 'cashier', label: 'Caissier(ère)' },
];

const StaffCard = ({ user, onClick }: { user: User; onClick?: () => void }) => (
    <motion.div
        variants={staggerItem}
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="group bg-white dark:bg-bg-secondary rounded-xl border border-border shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden relative"
    >
        <div className="absolute top-0 right-0 w-24 h-24 bg-bg-tertiary -mr-12 -mt-12 rounded-full opacity-50 group-hover:scale-150 transition-all duration-700" />

        <div className="p-8 relative z-10">
            <div className="flex items-start justify-between mb-8">
                <div className="flex gap-5 items-center">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-[2rem] bg-bg-tertiary border border-border flex items-center justify-center font-serif text-3xl text-text-primary shadow-inner group-hover:scale-105 transition-all duration-500 overflow-hidden">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : user.name.charAt(0)}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-success border-4 border-white shadow-sm" />
                    </div>
                    <div>
                        <h3 className="text-xl font-serif font-semibold text-text-primary leading-tight group-hover:text-accent transition-colors">{user.name}</h3>
                        <p className="text-[10px] font-bold text-accent uppercase tracking-widest mt-1.5 flex items-center gap-2">
                            <Briefcase strokeWidth={2} className="w-3 h-3" />
                            {user.role}
                        </p>
                    </div>
                </div>
                <button className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center text-text-muted hover:bg-accent hover:text-white transition-all shadow-sm">
                    <ChevronRight strokeWidth={1.5} className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border pt-6 mt-2">
                <div className="space-y-1.5">
                    <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Dernier Service</p>
                    <p className="text-[12px] font-medium text-text-primary font-mono tracking-tighter">Aujourd&apos;hui, 12:45</p>
                </div>
                <div className="space-y-1.5">
                    <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Performance</p>
                    <div className="flex items-center gap-1.5">
                        <Star strokeWidth={1.5} className="w-3.5 h-3.5 text-warning fill-warning/20" />
                        <span className="text-[12px] font-bold text-text-primary font-mono">4.9</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="px-8 py-5 bg-bg-tertiary/40 border-t border-border flex items-center justify-between group-hover:bg-accent/5 transition-colors">
            <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                <span className="text-[10px] font-bold text-text-primary uppercase tracking-[0.2em]">En Service</span>
            </div>
            <div className="flex gap-2">
                <button className="w-9 h-9 rounded-lg bg-white dark:bg-bg-tertiary border border-border flex items-center justify-center text-text-muted hover:bg-accent hover:text-white hover:border-accent transition-all shadow-sm">
                    <Mail strokeWidth={1.5} className="w-4 h-4" />
                </button>
                <button className="w-9 h-9 rounded-lg bg-white dark:bg-bg-tertiary border border-border flex items-center justify-center text-text-muted hover:bg-accent hover:text-white hover:border-accent transition-all shadow-sm">
                    <Phone strokeWidth={1.5} className="w-4 h-4" />
                </button>
            </div>
        </div>
    </motion.div>
);

type TabType = 'directory' | 'timesheets' | 'payroll' | 'skills' | 'audit';

export default function StaffPage() {
    const { users, currentUser, updateUserStatus, addUser, deleteUser, canDo, logAction } = useAuth();
    const { shifts } = usePlanning();
    const { orders } = useOrders();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<TabType>('directory');
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [optTitle, setOptTitle] = useState("");
    const [optDesc, setOptDesc] = useState("");
    const [showSecurityModal, setShowSecurityModal] = useState(false);

    // Audit Logs Query
    const auditLogs = useLiveQuery(() => db.table('auditLogs').orderBy('timestamp').reverse().limit(50).toArray());

    // Staff Form State
    const [showStaffModal, setShowStaffModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        role: 'server' as any,
        pin: '0000',
        avatar: '',
        hourlyRate: 15, // Added hourlyRate
    });

    const handleOpenModal = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name,
                role: user.role,
                pin: user.pin,
                avatar: user.avatar || '',
                hourlyRate: user.hourlyRate || 15, // Set hourlyRate from user
            });
        } else {
            setEditingUser(null);
            setFormData({
                name: '',
                role: 'server',
                pin: '0000',
                avatar: '',
                hourlyRate: 15, // Default hourlyRate for new user
            });
        }
        setShowStaffModal(true);
    };

    const handleSaveStaff = async () => {
        if (!formData.name) {
            showToast("Le nom est requis", "error");
            return;
        }
        if (editingUser) {
            await updateUserStatus(editingUser.id, formData);
            await logAction('modify_employee', { name: formData.name });
            showToast("Collaborateur mis à jour", "success");
        } else {
            await addUser({
                ...formData,
                performanceScore: 5.0,
                accessLevel: 3,
            });
            await logAction('create_employee', { name: formData.name });
            showToast("Nouveau collaborateur ajouté", "success");
        }
        setShowStaffModal(false);
    };

    const confirmDeleteStaff = async () => {
        if (editingUser) {
            await deleteUser(editingUser.id);
            await logAction('delete_employee', { name: editingUser.name });
            showToast("Profil supprimé", "success");
            setShowStaffModal(false);
        }
    };

    // --- Labor Cost Logic ---
    const totalDailyRevenue = orders.reduce((acc, order) => acc + order.total, 0);
    const estimatedDailyPayroll = users.length * 150;
    const laborCostRatio = totalDailyRevenue > 0 ? (estimatedDailyPayroll / totalDailyRevenue) * 100 : 0;

    const triggerOpt = (title: string, desc: string) => {
        setOptTitle(title);
        setOptDesc(desc);
        setIsOptimizing(true);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'timesheets':
                return (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={cinematicContainer}
                        className="bg-white dark:bg-bg-secondary rounded-xl border border-border shadow-sm overflow-hidden"
                    >
                        <div className="p-8 border-b border-border/50 flex items-center justify-between">
                            <h3 className="text-xl font-serif font-semibold text-text-primary tracking-tight flex items-center gap-3">
                                <Clock strokeWidth={1.5} className="w-6 h-6 text-accent" />
                                Relevé d&apos;Heures Hebdomadaire
                            </h3>
                            <Button variant="ghost" className="text-[11px] font-bold text-text-muted uppercase tracking-widest hover:bg-bg-tertiary">Exporter PDF</Button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead>
                                    <tr className="bg-bg-tertiary/20 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] border-b border-border/50">
                                        <th className="px-8 py-5">Collaborateur</th>
                                        <th className="px-6 py-5">Lun</th>
                                        <th className="px-6 py-5">Mar</th>
                                        <th className="px-6 py-5">Mer</th>
                                        <th className="px-6 py-5">Jeu</th>
                                        <th className="px-6 py-5">Ven</th>
                                        <th className="px-8 py-5 bg-bg-tertiary/40 text-text-primary border-l border-border/50">Total</th>
                                        <th className="px-8 py-5">Statut</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {users.map((user, idx) => {
                                        // Calculate actual hours for the current week from PlanningContext
                                        const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
                                        const userShifts = shifts.filter(s => s.userId === user.id && new Date(s.date) >= weekStart && new Date(s.date) <= addDays(weekStart, 6));

                                        const getHoursForDay = (dayOffset: number) => {
                                            const dayDate = addDays(weekStart, dayOffset);
                                            const dayShift = userShifts.find(s => {
                                                const d1 = new Date(s.date);
                                                return d1.getDate() === dayDate.getDate() && d1.getMonth() === dayDate.getMonth();
                                            });
                                            if (!dayShift) return 0;
                                            const start = parseInt(dayShift.startTime.split(':')[0]);
                                            const end = parseInt(dayShift.endTime.split(':')[0]);
                                            return end - start;
                                        };

                                        const mon = getHoursForDay(0);
                                        const tue = getHoursForDay(1);
                                        const wed = getHoursForDay(2);
                                        const thu = getHoursForDay(3);
                                        const fri = getHoursForDay(4);
                                        const total = mon + tue + wed + thu + fri;

                                        return (
                                            <tr key={user.id} className="group hover:bg-bg-tertiary/20 transition-all duration-300">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-9 h-9 rounded-lg bg-bg-tertiary border border-border flex items-center justify-center text-xs font-serif font-bold text-text-primary group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <span className="font-serif font-semibold text-text-primary text-[15px] group-hover:text-accent transition-colors">{user.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-text-muted font-mono text-[13px]">{mon > 0 ? `${mon}h` : "Repos"}</td>
                                                <td className="px-6 py-5 text-text-muted font-mono text-[13px]">{tue > 0 ? `${tue}h` : "Repos"}</td>
                                                <td className="px-6 py-5 text-text-muted font-mono text-[13px]">{wed > 0 ? `${wed}h` : "Repos"}</td>
                                                <td className="px-6 py-5 text-text-muted font-mono text-[13px]">{thu > 0 ? `${thu}h` : "Repos"}</td>
                                                <td className="px-6 py-5 text-text-muted font-mono text-[13px]">{fri > 0 ? `${fri}h` : "Repos"}</td>
                                                <td className="px-8 py-5 font-mono font-bold text-text-primary text-[15px] bg-bg-tertiary/20 border-l border-border/50">{total}h</td>
                                                <td className="px-8 py-5">
                                                    <span className={cn(
                                                        "px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border border-current/10",
                                                        total >= 35 ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                                                    )}>
                                                        {total >= 35 ? "Validé" : "En Attente"}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                );

            case 'payroll':
                return (
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="bg-white dark:bg-bg-secondary rounded-xl border border-border shadow-sm overflow-hidden"
                    >
                        <div className="p-8 border-b border-border/50 flex items-center justify-between">
                            <h3 className="text-xl font-serif font-semibold text-text-primary tracking-tight flex items-center gap-3">
                                <DollarSign strokeWidth={1.5} className="w-6 h-6 text-accent" />
                                Bulletins de Paie
                            </h3>
                            <Button variant="ghost" className="text-[11px] font-bold text-text-muted uppercase tracking-widest hover:bg-bg-tertiary">Exporter Tout</Button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead>
                                    <tr className="bg-bg-tertiary/20 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] border-b border-border/50">
                                        <th className="px-8 py-5">Collaborateur</th>
                                        <th className="px-8 py-5">Taux Horaire</th>
                                        <th className="px-8 py-5">Heures Hebdo.</th>
                                        <th className="px-8 py-5 bg-bg-tertiary/40 text-text-primary border-l border-border/50">Salaire Mensuel</th>
                                        <th className="px-8 py-5">Statut</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {users.map((user, idx) => {
                                        const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
                                        const userShifts = shifts.filter(s => s.userId === user.id && new Date(s.date) >= weekStart && new Date(s.date) <= addDays(weekStart, 6));
                                        const weeklyHours = userShifts.reduce((acc, s) => {
                                            const start = parseInt(s.startTime.split(':')[0]);
                                            const end = parseInt(s.endTime.split(':')[0]);
                                            return acc + (end - start);
                                        }, 0);
                                        const monthlySalary = weeklyHours * (user.hourlyRate || 15) * 4.33; // ~4.33 weeks per month

                                        return (
                                            <tr key={user.id} className="group hover:bg-bg-tertiary/20 transition-all duration-300">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-bg-tertiary border border-border flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                                                            <DollarSign className="w-5 h-5 text-text-muted group-hover:text-accent" />
                                                        </div>
                                                        <div>
                                                            <p className="font-serif font-semibold text-text-primary text-[15px]">{user.name}</p>
                                                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{user.role}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-text-muted font-mono text-[13px]">{user.hourlyRate || 15} €/h</td>
                                                <td className="px-8 py-5 text-text-muted font-mono text-[13px]">{weeklyHours}h / semaine</td>
                                                <td className="px-8 py-5 font-mono font-bold text-text-primary text-[15px] bg-bg-tertiary/20">{monthlySalary.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex-1 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                                                            <div className="h-full bg-accent" style={{ width: '100%' }} />
                                                        </div>
                                                        <span className="text-[10px] font-black text-accent uppercase tracking-widest italic">Payé</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                );

            case 'skills':
                return (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={cinematicContainer}
                        className="bg-white dark:bg-bg-secondary rounded-xl p-10 border border-border shadow-sm"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {users.map((user) => (
                                <div key={user.id} className="bg-bg-tertiary/20 border border-border/50 rounded-2xl p-8 hover:bg-white hover:shadow-2xl hover:border-accent/20 transition-all duration-500 group">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-bg-tertiary border border-border flex items-center justify-center font-serif text-lg font-bold text-text-primary dark:text-text-primary group-hover:bg-accent group-hover:text-white transition-all">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-serif font-semibold text-text-primary text-[15px]">{user.name}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Award strokeWidth={1.5} className="w-3 h-3 text-accent" />
                                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Niveau 4</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-5">
                                        {[
                                            { label: 'Service en Salle', value: 95, color: 'accent' },
                                            { label: 'Sommellerie', value: 80, color: 'text-primary' },
                                            { label: 'Gestion Stock', value: 60, color: 'warning' }
                                        ].map((skill, si) => (
                                            <div key={si}>
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{skill.label}</span>
                                                    <span className="text-[11px] font-mono font-medium text-text-primary">{skill.value}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-white border border-border/50 rounded-full overflow-hidden">
                                                    <div className={cn("h-full transition-all duration-1000", {
                                                        'bg-accent': skill.color === 'accent',
                                                        'bg-text-primary': skill.color === 'text-primary',
                                                        'bg-warning': skill.color === 'warning'
                                                    })} style={{ width: `${skill.value}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );

            case 'audit':
                return (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={cinematicContainer}
                        className="bg-white dark:bg-bg-secondary rounded-xl border border-border shadow-sm overflow-hidden"
                    >
                        <div className="p-8 border-b border-border/50 flex items-center justify-between">
                            <h3 className="text-xl font-serif font-semibold text-text-primary tracking-tight flex items-center gap-3">
                                <Shield strokeWidth={1.5} className="w-6 h-6 text-accent" />
                                Journal d&apos;Audit & Sécurité
                            </h3>
                            <Button variant="ghost" className="text-[11px] font-bold text-text-muted uppercase tracking-widest hover:bg-bg-tertiary">Exporter CSV</Button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead>
                                    <tr className="bg-bg-tertiary/20 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] border-b border-border/50">
                                        <th className="px-8 py-5">Date & Heure</th>
                                        <th className="px-8 py-5">Utilisateur</th>
                                        <th className="px-8 py-5">Action</th>
                                        <th className="px-8 py-5">Détails</th>
                                        <th className="px-8 py-5">Statut</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {auditLogs?.map((log, idx) => (
                                        <tr key={log.id} className="group hover:bg-bg-tertiary/20 transition-all duration-300">
                                            <td className="px-8 py-5">
                                                <p className="font-mono text-[13px] text-text-primary">{format(new Date(log.timestamp), 'dd MMM yyyy, HH:mm', { locale: fr })}</p>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-bg-tertiary flex items-center justify-center text-xs font-bold text-text-muted">
                                                        <UserIcon className="w-4 h-4" />
                                                    </div>
                                                    <span className="font-serif font-semibold text-text-primary text-[14px]">{log.userName || 'Système'}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <p className="font-medium text-text-primary text-[13px]">{log.action}</p>
                                            </td>
                                            <td className="px-8 py-5">
                                                <p className="text-[12px] text-text-muted font-mono">{log.metadata || '-'}</p>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={cn(
                                                    "px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border border-current/10",
                                                    log.status === 'success' ? "bg-success/10 text-success" : "bg-error/10 text-error"
                                                )}>
                                                    {log.status === 'success' ? "Succès" : "Échec"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {auditLogs?.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-10 text-center text-text-muted">
                                                Aucun événement d&apos;audit récent.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                );

            case 'directory':
            default:
                return (
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8"
                    >
                        {users.map(user => (
                            <StaffCard key={user.id} user={user} onClick={() => handleOpenModal(user)} />
                        ))}

                        {/* Empty state add card */}
                        <motion.button
                            variants={staggerItem}
                            onClick={() => handleOpenModal()}
                            className="h-full min-h-[300px] border-2 border-dashed border-border/60 bg-bg-tertiary/20 rounded-xl flex flex-col items-center justify-center p-10 group hover:border-accent hover:bg-bg-tertiary transition-all duration-500"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-bg-tertiary border border-border flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all shadow-sm">
                                <Plus strokeWidth={1.5} className="w-8 h-8 text-text-muted group-hover:text-white" />
                            </div>
                            <h4 className="text-xl font-serif font-semibold text-text-primary">Nouveau Profil</h4>
                            <p className="text-[13px] text-text-muted font-medium text-center mt-3 leading-relaxed">
                                Ajouter un nouveau membre à votre <br />brigade d'élite.
                            </p>
                        </motion.button>
                    </motion.div>
                );
        }
    };

    return (
        <div className="flex flex-1 -m-4 md:-m-8 flex-col bg-bg-primary h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] overflow-hidden pb-20 md:pb-0">
            {/* Header Area */}
            {/* Minimal Navigation Header */}
            <div className="bg-bg-secondary border-b border-border px-4 md:px-10 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                    {[
                        { id: 'directory', label: 'Annuaire de Brigade', icon: Users },
                        { id: 'timesheets', label: "Suivi d'Activité", icon: Clock },
                        { id: 'payroll', label: 'Paies & Contrats', icon: DollarSign },
                        { id: 'skills', label: 'Compétences', icon: Award },
                        { id: 'audit', label: 'Audit & Sécurité', icon: Shield },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
                            className={cn(
                                "px-5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300 whitespace-nowrap",
                                activeTab === tab.id
                                    ? "bg-bg-tertiary text-accent border border-accent/20 shadow-sm"
                                    : "text-text-muted hover:text-text-primary hover:bg-bg-tertiary/10"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        onClick={() => handleOpenModal()}
                        className="hidden md:flex btn-elegant-primary h-9 px-5 text-[10px] uppercase tracking-widest shadow-lg shadow-accent/10 items-center gap-2"
                    >
                        <Plus strokeWidth={1.5} className="h-3.5 w-3.5" />
                        Recruter
                    </Button>
                </div>
            </div>


            <div className="flex-1 overflow-auto p-4 md:p-8 lg:p-12 elegant-scrollbar space-y-8 md:space-y-12">
                {renderContent()}

                {/* System Activity Panel */}
                {activeTab === 'directory' && (
                    <div className="bg-white dark:bg-bg-secondary rounded-xl p-8 border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-serif font-semibold text-text-primary tracking-tight">Activité Récente de l&apos;Équipe</h3>
                            <button className="text-[11px] font-bold text-accent uppercase tracking-widest border-b border-accent/30 hover:border-accent transition-all">
                                Historique Complet
                            </button>
                        </div>
                        <div className="space-y-6">
                            {[
                                { icon: Clock, user: "Jean Dupont", action: "s&apos;est connecté au module POS", time: "Il y a 2 min" },
                                { icon: Shield, user: "Admin System", action: "a modifié les permissions de Marie", time: "Il y a 15 min" },
                                { icon: UserCheck, user: "Marc Rossi", action: "a validé la clôture de service", time: "Il y a 1h" }
                            ].map((log, i) => (
                                <div key={i} className="flex items-center justify-between border-b border-border/50 pb-5 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-5">
                                        <div className="w-10 h-10 rounded-lg bg-bg-tertiary flex items-center justify-center text-text-muted border border-border/50">
                                            <log.icon strokeWidth={1.5} className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-serif font-semibold text-text-primary text-[15px]">{log.user}</p>
                                            <p className="text-[13px] text-text-muted mt-0.5" dangerouslySetInnerHTML={{ __html: log.action }} />
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest font-mono bg-bg-tertiary px-3 py-1 rounded-full">{log.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <OptimizationDialog
                isOpen={isOptimizing}
                onClose={() => setIsOptimizing(false)}
                title={optTitle}
                description={optDesc}
            />

            <Modal
                isOpen={showStaffModal}
                onClose={() => setShowStaffModal(false)}
                title={editingUser ? "Édition Collaborateur" : "Ajout Collaborateur"}
            >
                <div className="space-y-6">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Nom Complet</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                            className="w-full h-14 px-6 bg-bg-tertiary rounded-xl border border-border focus:border-accent outline-none font-bold"
                            placeholder="Alexandre De Rossi"
                        />
                    </div>
                    <div className="space-y-4">
                        <PremiumSelect
                            label="Rôle & Responsabilités"
                            value={formData.role}
                            onChange={(val) => setFormData(p => ({ ...p, role: val as any }))}
                            options={ROLES}
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Code PIN (4 chiffres)</label>
                        <input
                            type="password"
                            maxLength={4}
                            value={formData.pin}
                            onChange={(e) => setFormData(p => ({ ...p, pin: e.target.value }))}
                            className="w-full h-14 px-6 bg-bg-tertiary rounded-xl border border-border focus:border-accent outline-none font-mono text-2xl tracking-[0.5em] font-bold"
                            placeholder="0000"
                        />
                    </div>
                    <div className="pt-6 flex gap-4">
                        {editingUser && canDo('delete_employee') && (
                            <Button
                                variant="outline"
                                className="flex-1 h-14 border-error text-error hover:bg-error/5"
                                onClick={() => setShowSecurityModal(true)}
                            >
                                Supprimer
                            </Button>
                        )}
                        <Button
                            className="flex-[2] h-14 bg-accent hover:bg-black text-white rounded-xl font-bold uppercase text-[11px] tracking-widest transition-all"
                            onClick={handleSaveStaff}
                        >
                            {editingUser ? "Mettre à jour" : "Recruter"}
                        </Button>
                    </div>
                </div>
            </Modal>

            <SecurityPinModal
                isOpen={showSecurityModal}
                onClose={() => setShowSecurityModal(false)}
                onSuccess={confirmDeleteStaff}
                title="Validation Suppression"
                description={`La suppression de ${editingUser?.name} nécessite une validation manager.`}
            />
        </div>
    );
}

