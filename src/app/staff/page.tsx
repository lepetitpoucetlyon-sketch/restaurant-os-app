"use client";

import { useState } from "react";
import { useAuth, User } from "@/context/AuthContext";
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
    Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { generatePaySlip } from "@/lib/paySlipGenerator";

const StaffCard = ({ user }: { user: User }) => (
    <div className="group bg-white rounded-xl border border-border shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden relative">
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
                <button className="w-9 h-9 rounded-lg bg-white border border-border flex items-center justify-center text-text-muted hover:bg-accent hover:text-white hover:border-accent transition-all shadow-sm">
                    <Mail strokeWidth={1.5} className="w-4 h-4" />
                </button>
                <button className="w-9 h-9 rounded-lg bg-white border border-border flex items-center justify-center text-text-muted hover:bg-accent hover:text-white hover:border-accent transition-all shadow-sm">
                    <Phone strokeWidth={1.5} className="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
);

type TabType = 'directory' | 'timesheets' | 'payroll' | 'skills';

export default function StaffPage() {
    const { users } = useAuth();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<TabType>('directory');

    const renderContent = () => {
        switch (activeTab) {
            case 'timesheets':
                return (
                    <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden animate-in fade-in duration-500">
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
                                    {users.map((user, idx) => (
                                        <tr key={user.id} className="group hover:bg-bg-tertiary/20 transition-all duration-300">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-9 h-9 rounded-lg bg-bg-tertiary border border-border flex items-center justify-center text-xs font-serif font-bold text-text-primary group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <span className="font-serif font-semibold text-text-primary text-[15px] group-hover:text-accent transition-colors">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-text-muted font-mono text-[13px]">7h</td>
                                            <td className="px-6 py-5 text-text-muted font-mono text-[13px]">8h</td>
                                            <td className="px-6 py-5 text-text-muted font-mono text-[13px] italic">{idx % 2 === 0 ? "Repos" : "8h"}</td>
                                            <td className="px-6 py-5 text-text-muted font-mono text-[13px]">10h</td>
                                            <td className="px-6 py-5 text-text-muted font-mono text-[13px]">9h</td>
                                            <td className="px-8 py-5 font-mono font-bold text-text-primary text-[15px] bg-bg-tertiary/20 border-l border-border/50">{idx % 2 === 0 ? "34h" : "42h"}</td>
                                            <td className="px-8 py-5">
                                                <span className={cn(
                                                    "px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border border-current/10",
                                                    idx % 2 === 0 ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                                                )}>
                                                    {idx % 2 === 0 ? "Validé" : "En Attente"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'payroll':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
                        {users.map((user) => (
                            <div key={user.id} className="bg-white rounded-xl p-8 border border-border shadow-sm flex items-center justify-between group hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-xl bg-bg-tertiary flex items-center justify-center text-text-muted border border-border group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all">
                                        <FileText strokeWidth={1.5} className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-serif font-semibold text-text-primary tracking-tight">{user.name}</h4>
                                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mt-1">CDI • Chef de Rang</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-mono font-medium text-text-primary tracking-tight">2 450,00 €</p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            generatePaySlip(user);
                                            showToast(`Bulletin de salaire généré pour ${user.name}`, "premium");
                                        }}
                                        className="h-8 text-[10px] font-bold text-accent uppercase tracking-widest hover:bg-accent/5 mt-1"
                                    >
                                        <Download strokeWidth={1.5} className="w-3.5 h-3.5 mr-2" />
                                        Télécharger
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 'skills':
                return (
                    <div className="bg-white rounded-xl p-10 border border-border shadow-sm animate-in fade-in duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {users.map((user) => (
                                <div key={user.id} className="bg-bg-tertiary/20 border border-border/50 rounded-2xl p-8 hover:bg-white hover:shadow-2xl hover:border-accent/20 transition-all duration-500 group">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 rounded-xl bg-white border border-border flex items-center justify-center font-serif text-lg font-bold text-text-primary group-hover:bg-accent group-hover:text-white transition-all">
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
                    </div>
                );

            case 'directory':
            default:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 animate-in fade-in duration-500">
                        {users.map(user => (
                            <StaffCard key={user.id} user={user} />
                        ))}

                        {/* Empty state add card */}
                        <button
                            onClick={() => showToast("Ouverture formulaire nouveau profil", "info")}
                            className="h-full min-h-[300px] border-2 border-dashed border-border/60 bg-bg-tertiary/20 rounded-xl flex flex-col items-center justify-center p-10 group hover:border-accent hover:bg-bg-tertiary transition-all duration-500"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-white border border-border flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all shadow-sm">
                                <Plus strokeWidth={1.5} className="w-8 h-8 text-text-muted group-hover:text-white" />
                            </div>
                            <h4 className="text-xl font-serif font-semibold text-text-primary">Nouveau Profil</h4>
                            <p className="text-[13px] text-text-muted font-medium text-center mt-3 leading-relaxed">
                                Ajouter un nouveau membre à votre <br />brigade d'élite.
                            </p>
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-1 -m-8 flex-col bg-bg-primary min-h-screen overflow-hidden">
            {/* Header Area */}
            <div className="bg-white border-b border-border px-10 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-serif font-semibold text-text-primary tracking-tight">Ressources Humaines</h1>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                            <Users strokeWidth={1.5} className="w-3.5 h-3.5 text-accent" />
                            Gestion de la brigade et pilotage RH
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right mr-4">
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Effectif Total</p>
                            <p className="text-[15px] font-serif font-black text-text-primary mt-0.5">{users.length} Collaborateurs</p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => showToast("Chargement du planning dynamique...", "info")}
                            className="h-10 border-border rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-bg-tertiary transition-all"
                        >
                            <Calendar strokeWidth={1.5} className="mr-2 h-4 w-4 text-text-muted" />
                            Planning Global
                        </Button>
                        <Button
                            onClick={() => showToast("Initialisation du module de recrutement (ATS)", "premium")}
                            className="btn-elegant-primary h-10 px-6 shadow-lg shadow-accent/10"
                        >
                            <Plus strokeWidth={1.5} className="h-4 w-4 mr-2" />
                            Recruter
                        </Button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex items-center gap-2 mt-8">
                    {[
                        { id: 'directory', label: 'Annuaire de Brigade' },
                        { id: 'timesheets', label: "Suivi d'Activité" },
                        { id: 'payroll', label: 'Paies & Contrats' },
                        { id: 'skills', label: 'Compétences & Évol.' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
                            className={cn(
                                "px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300",
                                activeTab === tab.id
                                    ? "bg-bg-tertiary text-accent border border-accent/20 shadow-sm"
                                    : "text-text-muted hover:text-text-primary hover:bg-bg-tertiary/10"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-auto p-12 elegant-scrollbar space-y-12">
                {renderContent()}

                {/* System Activity Panel */}
                {activeTab === 'directory' && (
                    <div className="bg-white rounded-xl p-8 border border-border shadow-sm">
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
        </div>
    );
}
