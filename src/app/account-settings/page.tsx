"use client";

import { useState } from "react";
import {
    useAuth,
    ALL_CATEGORIES,
    CATEGORY_LABELS,
    ROLE_LABELS,
    CategoryKey,
    UserRole
} from "@/context/AuthContext";
import {
    Shield,
    Check,
    X,
    Users,
    Lock,
    Unlock,
    Save,
    AlertTriangle,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

export default function AccountSettingsPage() {
    const { currentUser, users, rolePermissions, updateRolePermissions, hasAccess } = useAuth();
    const { showToast } = useToast();
    const [expandedRole, setExpandedRole] = useState<UserRole | null>(null);
    const [pendingChanges, setPendingChanges] = useState<Record<UserRole, CategoryKey[]>>({} as Record<UserRole, CategoryKey[]>);

    // Only admins can access this page
    if (!hasAccess('account-settings')) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-black text-[#1A1A1A] mb-2">Accès Refusé</h1>
                    <p className="text-[#ADB5BD]">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
                </div>
            </div>
        );
    }

    const roles = Object.keys(ROLE_LABELS) as UserRole[];

    const toggleCategory = (role: UserRole, category: CategoryKey) => {
        const currentCategories = pendingChanges[role] || rolePermissions[role] || [];
        let newCategories: CategoryKey[];

        if (currentCategories.includes(category)) {
            newCategories = currentCategories.filter(c => c !== category);
        } else {
            newCategories = [...currentCategories, category];
        }

        setPendingChanges(prev => ({ ...prev, [role]: newCategories }));
    };

    const saveRolePermissions = (role: UserRole) => {
        const categories = pendingChanges[role];
        if (categories) {
            updateRolePermissions(role, categories);
            setPendingChanges(prev => {
                const newPending = { ...prev };
                delete newPending[role];
                return newPending;
            });
            showToast(`Permissions mises à jour pour ${ROLE_LABELS[role]}`, "success");
        }
    };

    const hasChanges = (role: UserRole) => {
        return !!pendingChanges[role];
    };

    const getCategories = (role: UserRole): CategoryKey[] => {
        return pendingChanges[role] || rolePermissions[role] || [];
    };

    const getUserCountByRole = (role: UserRole) => {
        return users.filter(u => u.role === role).length;
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-[#00D764]/10 rounded-2xl flex items-center justify-center">
                        <Shield className="w-7 h-7 text-[#00D764]" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-[#1A1A1A] tracking-tight">Gestion des Accès</h1>
                        <p className="text-[#ADB5BD] text-sm">Configurez les permissions d'accès par rôle</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mt-4">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <p className="text-sm text-amber-800">
                        <strong>Attention :</strong> Les modifications affectent tous les utilisateurs du rôle sélectionné.
                    </p>
                </div>
            </div>

            {/* Roles List */}
            <div className="space-y-4">
                {roles.map(role => {
                    const isExpanded = expandedRole === role;
                    const userCount = getUserCountByRole(role);
                    const categories = getCategories(role);
                    const isAdmin = role === 'admin';

                    return (
                        <div
                            key={role}
                            className={cn(
                                "bg-white rounded-3xl border transition-all duration-300 overflow-hidden",
                                isExpanded ? "border-[#00D764] shadow-xl shadow-[#00D764]/5" : "border-neutral-100 hover:border-neutral-200"
                            )}
                        >
                            {/* Role Header */}
                            <button
                                onClick={() => setExpandedRole(isExpanded ? null : role)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg",
                                        isAdmin ? "bg-gradient-to-br from-amber-500 to-orange-600" : "bg-[#1A1A1A]"
                                    )}>
                                        {ROLE_LABELS[role].charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-[#1A1A1A]">{ROLE_LABELS[role]}</h3>
                                        <p className="text-sm text-[#ADB5BD]">
                                            {userCount} utilisateur{userCount > 1 ? 's' : ''} • {categories.length} catégories accessibles
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {hasChanges(role) && (
                                        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                                            Non sauvegardé
                                        </span>
                                    )}
                                    {isExpanded ? (
                                        <ChevronUp className="w-5 h-5 text-[#ADB5BD]" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-[#ADB5BD]" />
                                    )}
                                </div>
                            </button>

                            {/* Expanded Content */}
                            {isExpanded && (
                                <div className="px-6 pb-6 pt-2 border-t border-neutral-100">
                                    {isAdmin ? (
                                        <div className="flex items-center gap-3 bg-neutral-50 rounded-2xl p-4">
                                            <Unlock className="w-5 h-5 text-[#00D764]" />
                                            <p className="text-sm text-[#495057]">
                                                <strong>Accès total :</strong> Les administrateurs ont accès à toutes les catégories par défaut.
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Users with this role */}
                                            <div className="mb-6">
                                                <h4 className="text-xs font-bold text-[#ADB5BD] uppercase tracking-wider mb-3">
                                                    Utilisateurs avec ce rôle
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {users.filter(u => u.role === role).map(user => (
                                                        <div
                                                            key={user.id}
                                                            className="flex items-center gap-2 bg-neutral-50 px-3 py-2 rounded-xl"
                                                        >
                                                            <div className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white text-[10px] font-bold flex items-center justify-center">
                                                                {user.name.charAt(0)}
                                                            </div>
                                                            <span className="text-sm font-medium text-[#495057]">{user.name}</span>
                                                        </div>
                                                    ))}
                                                    {userCount === 0 && (
                                                        <span className="text-sm text-[#ADB5BD] italic">Aucun utilisateur</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Categories Grid */}
                                            <div className="mb-6">
                                                <h4 className="text-xs font-bold text-[#ADB5BD] uppercase tracking-wider mb-3">
                                                    Catégories accessibles
                                                </h4>
                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                                    {ALL_CATEGORIES.filter(c => c !== 'account-settings').map(category => {
                                                        const isEnabled = categories.includes(category);
                                                        return (
                                                            <button
                                                                key={category}
                                                                onClick={() => toggleCategory(role, category)}
                                                                className={cn(
                                                                    "flex items-center gap-3 p-4 rounded-2xl border transition-all duration-300",
                                                                    isEnabled
                                                                        ? "bg-[#E6F9EF] border-[#00D764] text-[#00D764]"
                                                                        : "bg-neutral-50 border-neutral-100 text-[#ADB5BD] hover:border-neutral-200"
                                                                )}
                                                            >
                                                                <div className={cn(
                                                                    "w-6 h-6 rounded-lg flex items-center justify-center",
                                                                    isEnabled ? "bg-[#00D764] text-white" : "bg-neutral-200 text-neutral-400"
                                                                )}>
                                                                    {isEnabled ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                                                </div>
                                                                <span className="text-sm font-semibold">{CATEGORY_LABELS[category]}</span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Save Button */}
                                            {hasChanges(role) && (
                                                <button
                                                    onClick={() => saveRolePermissions(role)}
                                                    className="flex items-center gap-2 bg-[#00D764] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#00B956] transition-colors shadow-lg shadow-[#00D764]/20"
                                                >
                                                    <Save className="w-5 h-5" />
                                                    Sauvegarder les modifications
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Info Footer */}
            <div className="mt-10 bg-neutral-50 rounded-3xl p-6 border border-neutral-100">
                <div className="flex items-start gap-4">
                    <Users className="w-6 h-6 text-[#ADB5BD] mt-1" />
                    <div>
                        <h4 className="font-bold text-[#1A1A1A] mb-1">À propos des rôles</h4>
                        <p className="text-sm text-[#ADB5BD] leading-relaxed">
                            Chaque membre du personnel se voit attribuer un rôle qui détermine les catégories auxquelles il peut accéder.
                            Les modifications prennent effet immédiatement après la sauvegarde. Pour changer le rôle d'un utilisateur,
                            contactez l'administrateur système.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
