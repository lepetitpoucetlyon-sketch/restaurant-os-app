"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Shield,
    Save,
    Loader2,
    Key,
    Users,
    Clock,
    Eye,
    EyeOff,
    Lock,
    Smartphone,
    FileText,
    Check,
    X,
    Fingerprint,
    Database,
    Zap,
    ShieldAlert,
    ShieldCheck,
    Terminal,
    Plus,
    Edit3,
    Trash2,
    Palette
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Role {
    id: string;
    name: string;
    color: string;
    permissions: {
        module: string;
        read: boolean;
        write: boolean;
        delete: boolean;
    }[];
}

const MODULES = [
    'Reservations', 'Orders', 'Menu System', 'Inventory', 'Labor Force',
    'Planning', 'Fiscal Unit', 'Analytics', 'System Architecture'
];

const defaultRoles: Role[] = [
    {
        id: '1',
        name: 'Omni Admin',
        color: '#EF4444',
        permissions: MODULES.map(m => ({ module: m, read: true, write: true, delete: true }))
    },
    {
        id: '2',
        name: 'Sector Manager',
        color: '#3B82F6',
        permissions: MODULES.map(m => ({
            module: m,
            read: true,
            write: !['Fiscal Unit', 'System Architecture'].includes(m),
            delete: !['Fiscal Unit', 'System Architecture', 'Labor Force'].includes(m)
        }))
    },
    {
        id: '3',
        name: 'Node Operator',
        color: '#10B981',
        permissions: MODULES.map(m => ({
            module: m,
            read: ['Reservations', 'Orders', 'Menu System'].includes(m),
            write: ['Reservations', 'Orders'].includes(m),
            delete: false
        }))
    },
    {
        id: '4',
        name: 'Resource Analyst',
        color: '#F59E0B',
        permissions: MODULES.map(m => ({
            module: m,
            read: ['Orders', 'Menu System', 'Inventory'].includes(m),
            write: ['Inventory'].includes(m),
            delete: false
        }))
    },
];

import { useSettings } from "@/context/SettingsContext";
import { RoleSettings, SecurityConfig } from "@/types/settings";

export default function SecuritySettings() {
    const { settings, updateConfig, updateList, isSaving: contextIsSaving } = useSettings();
    const [roles, setRoles] = useState<RoleSettings[]>(settings.roles || defaultRoles);
    const [selectedRole, setSelectedRole] = useState<RoleSettings>(roles[0] || defaultRoles[0]);
    const [localConfig, setLocalConfig] = useState<SecurityConfig>(settings.securityConfig || {
        require2FA: false,
        sessionTimeout: 30,
        logRetention: 90
    });
    const [isSaving, setIsSaving] = useState(false);

    // Role editing state
    const [isEditingRole, setIsEditingRole] = useState(false);
    const [editingRoleName, setEditingRoleName] = useState('');
    const [editingRoleColor, setEditingRoleColor] = useState('#3B82F6');
    const [isAddingNewRole, setIsAddingNewRole] = useState(false);

    const ROLE_COLORS = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateConfig('securityConfig', localConfig);
            await updateList('roles', roles);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const togglePermission = (module: string, type: 'read' | 'write' | 'delete') => {
        const updatedPermissions = selectedRole.permissions.map(p =>
            p.module === module ? { ...p, [type]: !p[type] } : p
        );
        const updatedRole = { ...selectedRole, permissions: updatedPermissions };

        setSelectedRole(updatedRole);
        setRoles(prev => prev.map(r => r.id === selectedRole.id ? updatedRole : r));
    };

    const handleAddRole = () => {
        setIsAddingNewRole(true);
        setEditingRoleName('');
        setEditingRoleColor('#3B82F6');
        setIsEditingRole(true);
    };

    const handleEditRole = () => {
        setIsAddingNewRole(false);
        setEditingRoleName(selectedRole.name);
        setEditingRoleColor(selectedRole.color);
        setIsEditingRole(true);
    };

    const handleSaveRoleEdit = () => {
        if (!editingRoleName.trim()) return;

        if (isAddingNewRole) {
            const newRole: RoleSettings = {
                id: Date.now().toString(),
                name: editingRoleName,
                color: editingRoleColor,
                description: '',
                permissions: MODULES.map(m => ({ module: m, read: false, write: false, delete: false })),
                canAccessFinancials: false,
                canAccessSensitiveData: false
            };
            setRoles(prev => [...prev, newRole]);
            setSelectedRole(newRole);
        } else {
            const updatedRole = { ...selectedRole, name: editingRoleName, color: editingRoleColor };
            setSelectedRole(updatedRole);
            setRoles(prev => prev.map(r => r.id === selectedRole.id ? updatedRole : r));
        }
        setIsEditingRole(false);
    };

    const handleDeleteRole = () => {
        if (roles.length <= 1) return; // Keep at least one role
        const newRoles = roles.filter(r => r.id !== selectedRole.id);
        setRoles(newRoles);
        setSelectedRole(newRoles[0]);
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Session & Cryptographic Parameters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-10 overflow-hidden relative group"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32 transition-opacity group-hover:opacity-100 opacity-50 pointer-events-none" />

                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent">
                        <Lock className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                            Security Architecture
                        </h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Global Authentication Protocols</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-bg-primary p-8 rounded-[2rem] border border-border shadow-sm space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <Clock className="w-5 h-5 text-text-muted" />
                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Session TTL</label>
                        </div>
                        <div className="relative">
                            <input
                                type="number"
                                value={localConfig.sessionTimeout}
                                onChange={(e) => setLocalConfig(prev => ({ ...prev, sessionTimeout: Number(e.target.value) }))}
                                className="w-full bg-transparent text-3xl font-serif text-text-primary outline-none pr-16"
                            />
                            <span className="absolute right-0 bottom-1.5 text-xs font-bold text-text-muted uppercase">Minutes</span>
                        </div>
                    </div>

                    <div className="bg-bg-primary p-8 rounded-[2rem] border border-border shadow-sm space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <Database className="w-5 h-5 text-text-muted" />
                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Audit Retention</label>
                        </div>
                        <div className="relative">
                            <input
                                type="number"
                                value={localConfig.logRetention}
                                onChange={(e) => setLocalConfig(prev => ({ ...prev, logRetention: Number(e.target.value) }))}
                                className="w-full bg-transparent text-3xl font-serif text-text-primary outline-none pr-16"
                                data-tutorial="settings-0-2"
                            />
                            <span className="absolute right-0 bottom-1.5 text-xs font-bold text-text-muted uppercase">Days</span>
                        </div>
                    </div>

                    <div className={cn(
                        "p-8 rounded-[2rem] border transition-all duration-500 flex flex-col justify-between",
                        localConfig.require2FA ? "bg-text-primary border-text-primary shadow-xl" : "bg-bg-primary border-border"
                    )}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Fingerprint className={cn("w-6 h-6", localConfig.require2FA ? "text-bg-primary" : "text-text-muted")} />
                                <div>
                                    <p className={cn("font-bold text-[10px] uppercase tracking-widest", localConfig.require2FA ? "text-bg-primary" : "text-text-primary")}>Multi-Factor Auth</p>
                                    <p className={cn("text-[9px] font-bold uppercase tracking-widest", localConfig.require2FA ? "text-bg-primary/60" : "text-text-muted")}>Mandatory 2FA Policy</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setLocalConfig(prev => ({ ...prev, require2FA: !prev.require2FA }))}
                                className={cn(
                                    "w-14 h-7 rounded-full relative transition-all duration-500",
                                    localConfig.require2FA ? "bg-bg-primary shadow-lg" : "bg-bg-tertiary border border-border"
                                )}
                                data-tutorial="settings-0-0"
                            >
                                <motion.div
                                    animate={{ x: localConfig.require2FA ? 28 : 2 }}
                                    className={cn("absolute top-1 left-1 w-5 h-5 rounded-full shadow-md", localConfig.require2FA ? "bg-text-primary" : "bg-white")}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Neural Roles & Access Matrix */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-bg-secondary border border-border rounded-[2.5rem] shadow-premium p-10"
            >
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center border border-border text-accent">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-serif text-text-primary uppercase tracking-tight italic">
                                Access Control Matrix
                            </h3>
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Role-Based Permission Hierarchy</p>
                        </div>
                    </div>

                    {/* CRUD Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleAddRole}
                            className="flex items-center gap-2 px-5 py-3 bg-text-primary text-bg-primary rounded-xl font-bold text-[9px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                            data-tutorial="settings-0-1"
                        >
                            <Plus className="w-4 h-4" />
                            Add Role
                        </button>
                        <button
                            onClick={handleEditRole}
                            className="flex items-center gap-2 px-4 py-3 bg-bg-tertiary text-text-primary border border-border rounded-xl font-bold text-[9px] uppercase tracking-widest hover:bg-bg-primary transition-all"
                        >
                            <Edit3 className="w-4 h-4" />
                            Edit
                        </button>
                        {roles.length > 1 && (
                            <button
                                onClick={handleDeleteRole}
                                className="flex items-center gap-2 px-4 py-3 bg-error/10 text-error border border-error/20 rounded-xl font-bold text-[9px] uppercase tracking-widest hover:bg-error/20 transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Role Edit Modal */}
                <AnimatePresence>
                    {isEditingRole && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-8 overflow-hidden"
                        >
                            <div className="p-8 bg-bg-tertiary rounded-[2rem] border border-border shadow-xl">
                                <div className="flex items-center gap-4 mb-6">
                                    <Palette className="w-5 h-5 text-text-muted" />
                                    <h4 className="font-serif text-text-primary uppercase tracking-tight italic">
                                        {isAddingNewRole ? 'Create New Role' : 'Edit Role'}
                                    </h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest">Role Name</label>
                                        <input
                                            type="text"
                                            value={editingRoleName}
                                            onChange={(e) => setEditingRoleName(e.target.value)}
                                            placeholder="e.g. Floor Manager"
                                            className="w-full px-5 py-4 bg-bg-primary border border-border rounded-xl text-text-primary font-medium focus:border-accent transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest">Role Color</label>
                                        <div className="flex gap-2">
                                            {ROLE_COLORS.map((color) => (
                                                <button
                                                    key={color}
                                                    onClick={() => setEditingRoleColor(color)}
                                                    className={cn(
                                                        "w-10 h-10 rounded-xl transition-all hover:scale-110",
                                                        editingRoleColor === color && "ring-2 ring-offset-2 ring-text-primary scale-110"
                                                    )}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        onClick={() => setIsEditingRole(false)}
                                        className="px-6 py-3 text-text-muted font-bold text-[10px] uppercase tracking-widest hover:text-text-primary transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveRoleEdit}
                                        disabled={!editingRoleName.trim()}
                                        className="flex items-center gap-2 px-6 py-3 bg-text-primary text-bg-primary rounded-xl font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                                    >
                                        <Check className="w-4 h-4" />
                                        {isAddingNewRole ? 'Create Role' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Role Tabs */}
                <div className="flex gap-4 mb-10 bg-bg-tertiary p-2 rounded-[1.5rem] border border-border overflow-x-auto">
                    {roles.map((role) => (
                        <button
                            key={role.id}
                            onClick={() => setSelectedRole(role)}
                            className={cn(
                                "flex-1 min-w-[140px] px-8 py-5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all relative overflow-hidden group",
                                selectedRole.id === role.id
                                    ? "text-white shadow-2xl scale-105 z-10"
                                    : "text-text-muted hover:text-text-primary"
                            )}
                            style={{
                                backgroundColor: selectedRole.id === role.id ? role.color : 'transparent'
                            }}
                        >
                            {selectedRole.id === role.id && (
                                <motion.div
                                    layoutId="active-role-bg"
                                    className="absolute inset-0 bg-white/10"
                                />
                            )}
                            <div className="relative z-10 flex items-center justify-center gap-3">
                                <Shield className={cn("w-4 h-4", selectedRole.id === role.id ? "text-white" : "text-text-muted group-hover:text-text-primary")} />
                                {role.name}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Permissions Matrix */}
                <div className="bg-bg-primary rounded-[2rem] border border-border overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-bg-tertiary border-b border-border">
                                <th className="text-left px-10 py-6 text-[10px] font-bold text-text-muted uppercase tracking-widest">Neural Module</th>
                                {['Read', 'Write', 'Purge'].map((type) => (
                                    <th key={type} className="text-center px-10 py-6 text-[10px] font-bold text-text-muted uppercase tracking-widest">{type}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {selectedRole.permissions.map((perm, idx) => (
                                <motion.tr
                                    key={perm.module}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group hover:bg-bg-tertiary/50 transition-colors"
                                >
                                    <td className="px-10 py-6">
                                        <p className="font-bold text-text-primary uppercase tracking-tight">{perm.module}</p>
                                    </td>
                                    {['read', 'write', 'delete'].map((type) => {
                                        const isAllowed = perm[type as keyof typeof perm];
                                        return (
                                            <td key={type} className="text-center px-10 py-6">
                                                <button
                                                    onClick={() => togglePermission(perm.module, type as any)}
                                                    className={cn(
                                                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 mx-auto border",
                                                        isAllowed
                                                            ? "bg-text-primary border-text-primary text-bg-primary shadow-lg"
                                                            : "bg-bg-tertiary border-border text-text-muted hover:border-accent/50 hover:text-text-primary"
                                                    )}
                                                >
                                                    {isAllowed ? (
                                                        <Zap className="w-5 h-5 fill-current" />
                                                    ) : (
                                                        <X className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </td>
                                        );
                                    })}
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Deep Audit Log Terminal */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-neutral-900 rounded-[2.5rem] border border-neutral-800 shadow-2xl p-10 overflow-hidden relative"
            >
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] -mr-48 -mt-48" />

                <div className="flex items-center justify-between mb-10 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                            <Terminal className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-serif text-white uppercase tracking-tight italic">
                                Deep Audit Log
                            </h3>
                            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Real-time System Mutation Feed</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Monitoring Active</span>
                    </div>
                </div>

                <div className="space-y-4 relative z-10 font-mono">
                    {[
                        { action: 'AUTH_SUCCESS', user: 'admin@resto.fr', time: '14:22:05', status: 'OK', color: 'text-emerald-500' },
                        { action: 'MENU_MUTATION', user: 'chef@resto.fr', time: '14:21:40', status: 'MODIFIED', color: 'text-blue-400' },
                        { action: 'RESERVATION_COMMIT', user: 'system', time: '14:15:22', status: 'SUCCESS', color: 'text-emerald-500' },
                        { action: 'FISCAL_EXPORT', user: 'admin@resto.fr', time: '13:45:10', status: 'PENDING', color: 'text-amber-400' },
                        { action: 'FIREWALL_TRIGGER', user: 'ext_ip_blocked', time: '13:40:05', status: 'BLOCKED', color: 'text-rose-500' },
                    ].map((log, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all group">
                            <div className="flex items-center gap-6">
                                <span className="text-[10px] text-neutral-500">{log.time}</span>
                                <div className="flex items-center gap-3">
                                    <span className={cn("text-xs font-bold uppercase tracking-widest", log.color)}>[{log.action}]</span>
                                    <span className="text-xs text-neutral-300">USER://{log.user.split('@')[0]}</span>
                                </div>
                            </div>
                            <span className={cn("text-[10px] font-bold uppercase tracking-widest", log.color)}>{log.status}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Global Dispatch */}
            <div className="flex justify-end pt-4">
                <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-3 px-10 py-5 bg-text-primary text-bg-primary rounded-[1.5rem] font-bold uppercase tracking-widest shadow-2xl hover:scale-105 transition-all disabled:opacity-50 group border border-border"
                >
                    {isSaving ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <div className="relative">
                            <ShieldCheck className="w-5 h-5 transition-transform group-hover:scale-110" />
                        </div>
                    )}
                    Commit Security State
                </motion.button>
            </div>
        </div>
    );
}
