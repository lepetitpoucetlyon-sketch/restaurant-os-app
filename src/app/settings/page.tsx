"use client";

import { useState, useEffect } from "react";
import {
    Settings,
    Building2,
    Percent,
    Globe,
    Palette,
    Bell,
    Shield,
    Database,
    Save,
    RotateCcw,
    Check,
    ChevronRight,
    Moon,
    Sun,
    Users,
    CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";

interface RestaurantSettings {
    name: string;
    address: string;
    phone: string;
    email: string;
    siret: string;
    tvaRate: number;
    currency: string;
    timezone: string;
    theme: 'light' | 'dark' | 'auto';
    language: 'fr' | 'en';
    notificationsEnabled: boolean;
    lowStockThreshold: number;
    autoLogoutMinutes: number;
}

const DEFAULT_SETTINGS: RestaurantSettings = {
    name: "Restaurant Executive",
    address: "123 Avenue des Champs-Élysées, 75008 Paris",
    phone: "+33 1 23 45 67 89",
    email: "contact@restaurant-executive.fr",
    siret: "123 456 789 00012",
    tvaRate: 10,
    currency: "EUR",
    timezone: "Europe/Paris",
    theme: 'light',
    language: 'fr',
    notificationsEnabled: true,
    lowStockThreshold: 20,
    autoLogoutMinutes: 30
};

type SettingsTab = 'general' | 'finance' | 'notifications' | 'security' | 'data';

const TABS: { id: SettingsTab; label: string; icon: any }[] = [
    { id: 'general', label: 'Général', icon: Building2 },
    { id: 'finance', label: 'Finance & TVA', icon: Percent },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'data', label: 'Données', icon: Database },
];

export default function SettingsPage() {
    const { showToast } = useToast();
    const { currentUser, users } = useAuth();
    const [activeTab, setActiveTab] = useState<SettingsTab>('general');
    const [settings, setSettings] = useState<RestaurantSettings>(DEFAULT_SETTINGS);
    const [hasChanges, setHasChanges] = useState(false);

    // Load settings from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('executive_os_settings');
        if (saved) {
            try {
                setSettings(JSON.parse(saved));
            } catch {
                setSettings(DEFAULT_SETTINGS);
            }
        }
    }, []);

    const updateSetting = <K extends keyof RestaurantSettings>(key: K, value: RestaurantSettings[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setHasChanges(true);
    };

    const handleSave = () => {
        localStorage.setItem('executive_os_settings', JSON.stringify(settings));
        setHasChanges(false);
        showToast("Paramètres enregistrés avec succès", "success");
    };

    const handleReset = () => {
        setSettings(DEFAULT_SETTINGS);
        setHasChanges(true);
        showToast("Paramètres réinitialisés", "info");
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div>
                            <h3 className="text-lg font-black text-[#1A1A1A] mb-6">Informations du Restaurant</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[11px] font-bold text-[#ADB5BD] uppercase tracking-widest mb-2">
                                        Nom de l'établissement
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.name}
                                        onChange={(e) => updateSetting('name', e.target.value)}
                                        className="w-full h-12 px-4 bg-[#F8F9FA] border border-neutral-100 rounded-xl font-bold text-[#1A1A1A] focus:ring-2 focus:ring-[#00D764] focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-[#ADB5BD] uppercase tracking-widest mb-2">
                                        Numéro SIRET
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.siret}
                                        onChange={(e) => updateSetting('siret', e.target.value)}
                                        className="w-full h-12 px-4 bg-[#F8F9FA] border border-neutral-100 rounded-xl font-bold text-[#1A1A1A] focus:ring-2 focus:ring-[#00D764] focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[11px] font-bold text-[#ADB5BD] uppercase tracking-widest mb-2">
                                        Adresse
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.address}
                                        onChange={(e) => updateSetting('address', e.target.value)}
                                        className="w-full h-12 px-4 bg-[#F8F9FA] border border-neutral-100 rounded-xl font-bold text-[#1A1A1A] focus:ring-2 focus:ring-[#00D764] focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-[#ADB5BD] uppercase tracking-widest mb-2">
                                        Téléphone
                                    </label>
                                    <input
                                        type="tel"
                                        value={settings.phone}
                                        onChange={(e) => updateSetting('phone', e.target.value)}
                                        className="w-full h-12 px-4 bg-[#F8F9FA] border border-neutral-100 rounded-xl font-bold text-[#1A1A1A] focus:ring-2 focus:ring-[#00D764] focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-[#ADB5BD] uppercase tracking-widest mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={settings.email}
                                        onChange={(e) => updateSetting('email', e.target.value)}
                                        className="w-full h-12 px-4 bg-[#F8F9FA] border border-neutral-100 rounded-xl font-bold text-[#1A1A1A] focus:ring-2 focus:ring-[#00D764] focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-black text-[#1A1A1A] mb-6">Apparence</h3>
                            <div className="grid grid-cols-3 gap-4">
                                {(['light', 'dark', 'auto'] as const).map((theme) => (
                                    <button
                                        key={theme}
                                        onClick={() => updateSetting('theme', theme)}
                                        className={cn(
                                            "p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3",
                                            settings.theme === theme
                                                ? "border-[#00D764] bg-[#E6F9EF]"
                                                : "border-neutral-100 bg-white hover:border-neutral-200"
                                        )}
                                    >
                                        {theme === 'light' && <Sun className="w-6 h-6 text-amber-500" />}
                                        {theme === 'dark' && <Moon className="w-6 h-6 text-indigo-500" />}
                                        {theme === 'auto' && <Settings className="w-6 h-6 text-[#ADB5BD]" />}
                                        <span className="text-sm font-bold">
                                            {theme === 'light' ? 'Clair' : theme === 'dark' ? 'Sombre' : 'Auto'}
                                        </span>
                                        {settings.theme === theme && (
                                            <Check className="w-4 h-4 text-[#00D764]" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'finance':
                return (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div>
                            <h3 className="text-lg font-black text-[#1A1A1A] mb-6">Paramètres Fiscaux</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[11px] font-bold text-[#ADB5BD] uppercase tracking-widest mb-2">
                                        Taux de TVA (%)
                                    </label>
                                    <input
                                        type="number"
                                        value={settings.tvaRate}
                                        onChange={(e) => updateSetting('tvaRate', parseFloat(e.target.value))}
                                        className="w-full h-12 px-4 bg-[#F8F9FA] border border-neutral-100 rounded-xl font-bold text-[#1A1A1A] focus:ring-2 focus:ring-[#00D764] focus:border-transparent outline-none transition-all"
                                    />
                                    <p className="text-[10px] text-[#ADB5BD] mt-2">Taux applicable: 5.5% (plats à emporter), 10% (sur place), 20% (alcool)</p>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-[#ADB5BD] uppercase tracking-widest mb-2">
                                        Devise
                                    </label>
                                    <select
                                        value={settings.currency}
                                        onChange={(e) => updateSetting('currency', e.target.value)}
                                        className="w-full h-12 px-4 bg-[#F8F9FA] border border-neutral-100 rounded-xl font-bold text-[#1A1A1A] focus:ring-2 focus:ring-[#00D764] focus:border-transparent outline-none transition-all"
                                    >
                                        <option value="EUR">Euro (€)</option>
                                        <option value="USD">Dollar ($)</option>
                                        <option value="GBP">Livre (£)</option>
                                        <option value="CHF">Franc Suisse (CHF)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-[#FFF7E6] border border-amber-200 rounded-2xl">
                            <div className="flex items-start gap-4">
                                <CreditCard className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-bold text-[#1A1A1A]">Moyens de Paiement</h4>
                                    <p className="text-sm text-[#6C757D] mt-1">
                                        Pour configurer les terminaux de paiement et les intégrations bancaires,
                                        contactez votre gestionnaire de compte.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'notifications':
                return (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div>
                            <h3 className="text-lg font-black text-[#1A1A1A] mb-6">Préférences de Notification</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-xl">
                                    <div>
                                        <p className="font-bold text-[#1A1A1A]">Notifications Activées</p>
                                        <p className="text-[12px] text-[#ADB5BD]">Recevoir les alertes en temps réel</p>
                                    </div>
                                    <button
                                        onClick={() => updateSetting('notificationsEnabled', !settings.notificationsEnabled)}
                                        className={cn(
                                            "w-14 h-8 rounded-full transition-all relative",
                                            settings.notificationsEnabled ? "bg-[#00D764]" : "bg-neutral-300"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-6 h-6 bg-white rounded-full absolute top-1 transition-all shadow-md",
                                            settings.notificationsEnabled ? "left-7" : "left-1"
                                        )} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-xl">
                                    <div>
                                        <p className="font-bold text-[#1A1A1A]">Seuil d'Alerte Stock Bas</p>
                                        <p className="text-[12px] text-[#ADB5BD]">Alerter quand le stock passe sous ce pourcentage</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={settings.lowStockThreshold}
                                            onChange={(e) => updateSetting('lowStockThreshold', parseInt(e.target.value))}
                                            className="w-20 h-10 px-3 bg-white border border-neutral-200 rounded-lg font-bold text-center"
                                        />
                                        <span className="text-[#ADB5BD] font-bold">%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'security':
                return (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div>
                            <h3 className="text-lg font-black text-[#1A1A1A] mb-6">Sécurité & Session</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-xl">
                                    <div>
                                        <p className="font-bold text-[#1A1A1A]">Déconnexion Automatique</p>
                                        <p className="text-[12px] text-[#ADB5BD]">Après une période d'inactivité</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={settings.autoLogoutMinutes}
                                            onChange={(e) => updateSetting('autoLogoutMinutes', parseInt(e.target.value))}
                                            className="w-20 h-10 px-3 bg-white border border-neutral-200 rounded-lg font-bold text-center"
                                        />
                                        <span className="text-[#ADB5BD] font-bold">min</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-black text-[#1A1A1A] mb-6">Utilisateurs Actifs</h3>
                            <div className="space-y-3">
                                {users.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between p-4 bg-white border border-neutral-100 rounded-xl">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-[#F8F9FA] flex items-center justify-center font-bold">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#1A1A1A]">{user.name}</p>
                                                <p className="text-[11px] text-[#ADB5BD] uppercase">{user.role}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-[#ADB5BD]" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'data':
                return (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div>
                            <h3 className="text-lg font-black text-[#1A1A1A] mb-6">Gestion des Données</h3>
                            <div className="space-y-4">
                                <button className="w-full flex items-center justify-between p-4 bg-[#F8F9FA] rounded-xl hover:bg-neutral-100 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <Database className="w-5 h-5 text-[#1A1A1A]" />
                                        <div className="text-left">
                                            <p className="font-bold text-[#1A1A1A]">Exporter les Données</p>
                                            <p className="text-[12px] text-[#ADB5BD]">Télécharger une sauvegarde complète</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-[#ADB5BD]" />
                                </button>

                                <button
                                    onClick={() => {
                                        if (confirm('Êtes-vous sûr de vouloir effacer le cache local ?')) {
                                            localStorage.clear();
                                            showToast("Cache effacé - Rechargement...", "info");
                                            setTimeout(() => window.location.reload(), 1000);
                                        }
                                    }}
                                    className="w-full flex items-center justify-between p-4 bg-[#FEECEC] rounded-xl hover:bg-red-100 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <RotateCcw className="w-5 h-5 text-[#FF4D4D]" />
                                        <div className="text-left">
                                            <p className="font-bold text-[#FF4D4D]">Effacer le Cache Local</p>
                                            <p className="text-[12px] text-[#FF4D4D]/70">Réinitialiser toutes les données locales</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-[#FF4D4D]" />
                                </button>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="flex h-[calc(100vh-70px)] -m-6 bg-[#F8F9FA] overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-72 bg-white border-r border-neutral-100 p-6 flex flex-col">
                <div className="mb-8">
                    <h1 className="text-xl font-black text-[#1A1A1A] tracking-tight">Paramètres</h1>
                    <p className="text-[11px] font-bold text-[#ADB5BD] uppercase tracking-wider mt-1">
                        Configuration du système
                    </p>
                </div>

                <nav className="flex-1 space-y-2">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all",
                                    activeTab === tab.id
                                        ? "bg-[#1A1A1A] text-white"
                                        : "text-[#6C757D] hover:bg-neutral-50"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>

                {/* Save Actions */}
                {hasChanges && (
                    <div className="pt-6 border-t border-neutral-100 space-y-3 animate-in slide-in-from-bottom duration-300">
                        <Button
                            onClick={handleSave}
                            className="w-full h-12 bg-[#00D764] hover:bg-[#00B956] text-white rounded-xl font-bold"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Enregistrer
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleReset}
                            className="w-full h-10 border-neutral-200 rounded-xl font-bold text-sm"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Réinitialiser
                        </Button>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-8">
                <div className="max-w-3xl">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
}
