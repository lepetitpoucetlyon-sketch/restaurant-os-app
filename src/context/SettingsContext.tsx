"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { db } from '@/lib/db';
import {
    GlobalSettings,
    RestaurantIdentity,
    RestaurantContact,
    SocialMedia,
    DaySchedule,
    ServiceSettings,
    ReservationSlotSettings,
    ClosedPeriod,
    ReservationSettings,
    POSSettings,
    ReceiptTemplate,
    ClickCollectSettings,
    SessionSettings,
    ThemeSettings,
    PerformanceGoals,
    HACCPConfig,
    NotificationsConfig,
    IntegrationsConfig,
    SecurityConfig,
    StaffConfig
} from '@/types/settings';

// ============ DEFAULT VALUES ============

const defaultIdentity: RestaurantIdentity = {
    id: 'main',
    name: 'Mon Restaurant',
    cuisineType: 'Française',
    category: 'bistrot',
};

const defaultContact: RestaurantContact = {
    address: '',
    postalCode: '',
    city: '',
    country: 'France',
    phoneMain: '',
    emailGeneral: '',
};

const defaultSocial: SocialMedia = {};

const defaultSchedule: DaySchedule[] = [
    { day: 'monday', isOpen: true, lunchOpen: '12:00', lunchClose: '14:30', dinnerOpen: '19:00', dinnerClose: '22:30' },
    { day: 'tuesday', isOpen: true, lunchOpen: '12:00', lunchClose: '14:30', dinnerOpen: '19:00', dinnerClose: '22:30' },
    { day: 'wednesday', isOpen: true, lunchOpen: '12:00', lunchClose: '14:30', dinnerOpen: '19:00', dinnerClose: '22:30' },
    { day: 'thursday', isOpen: true, lunchOpen: '12:00', lunchClose: '14:30', dinnerOpen: '19:00', dinnerClose: '22:30' },
    { day: 'friday', isOpen: true, lunchOpen: '12:00', lunchClose: '14:30', dinnerOpen: '19:00', dinnerClose: '23:00' },
    { day: 'saturday', isOpen: true, lunchOpen: '12:00', lunchClose: '15:00', dinnerOpen: '19:00', dinnerClose: '23:00' },
    { day: 'sunday', isOpen: false },
];

const defaultService: ServiceSettings = {
    avgMealDurationLunch: 75,
    avgMealDurationDinner: 105,
    lastArrivalBeforeClose: 30,
};

const defaultReservationSlots: ReservationSlotSettings = {
    slotDuration: 15,
    intervalBetweenSlots: 15,
    maxCoversPerSlot: 20,
};

const defaultReservationConfig: ReservationSettings = {
    minAdvanceHours: 2,
    maxAdvanceDays: 60,
    defaultDuration: 90,
    overbookingAllowed: false,
    autoConfirm: false,
    requireDeposit: false,
    emailReminderHours: 24,
    noShowDelayMinutes: 15,
    confirmationMessage: 'Votre réservation est confirmée.',
    reminderMessage: 'Rappel : vous avez une réservation demain.',
    cancellationMessage: 'Votre réservation a été annulée.',
    cancellationPolicy: 'Annulation gratuite 24h avant.',
    terms: '',
};

const defaultPOS: POSSettings = {
    currency: 'EUR',
    priceFormat: 'with_cents',
    displayMode: 'ttc',
    roundingRule: 'none',
    serviceMode: 'table',
    buttonSize: 'medium',
    showImages: true,
    theme: 'light',
    notificationSound: true,
    autoPrintReceipt: true,
    receiptCopies: 1,
    tipsEnabled: true,
    tipSuggestions: [10, 15, 20],
};

const defaultReceipt: ReceiptTemplate = {
    restaurantName: 'Mon Restaurant',
    address: '',
    siret: '',
    vatNumber: '',
    showDetailedTax: true,
    format: '80mm',
};

const defaultClickCollect: ClickCollectSettings = {
    enabled: false,
    minPrepTime: 30,
    slotsPerHour: 4,
    maxOrdersPerSlot: 5,
};

const defaultSession: SessionSettings = {
    autoLogoutMinutes: 30,
    requireMFA: false,
    maxConcurrentSessions: 3,
    logRetentionDays: 90,
};

const defaultTheme: ThemeSettings = {
    primaryColor: '#C5A059',
    secondaryColor: '#3B82F6',
    backgroundColor: '#FFFFFF',
    textColor: '#1A1A1A',
    mode: 'light',
    fontPrimary: 'Outfit',
    fontHeadings: 'Outfit',
    borderRadius: 'large',
    buttonStyle: 'gradient',
    animationsEnabled: true,
};

const defaultGoals: PerformanceGoals = {};

const defaultSettings: GlobalSettings = {
    identity: defaultIdentity,
    contact: defaultContact,
    social: defaultSocial,
    schedule: defaultSchedule,
    service: defaultService,
    reservationSlots: defaultReservationSlots,
    closedPeriods: [],
    menuCategories: [],
    products: [],
    supplements: [],
    formules: [],
    recipes: [],
    recipeSteps: [],
    recipeIngredients: [],
    ingredients: [],
    suppliers: [],
    employees: [],
    positions: [],
    shiftTemplates: [],
    absences: [],
    reservationConfig: defaultReservationConfig,
    clients: [],
    pos: defaultPOS,
    paymentMethods: [],
    receipt: defaultReceipt,
    haccpControlPoints: [],
    haccpNonConformities: [],
    deliveryZones: [],
    clickCollect: defaultClickCollect,
    notificationRoutings: [],
    reportSchedules: [],
    roles: [],
    session: defaultSession,
    theme: defaultTheme,
    goals: defaultGoals,
    integrations: [],
    planningConfig: {
        weekStartDay: 1,
        defaultView: 'week',
        minHoursBetweenShifts: 11,
        maxHoursPerDay: 10,
        maxHoursPerWeek: 35,
        notifyOnPublish: true,
        absenceRequestApproval: true,
        swapRequestApproval: true,
        overtimeEnabled: false,
    },
    accountingConfig: {
        fiscalYearStart: '2024-01-01',
        accountingMethod: 'accrual',
        defaultPaymentTerms: 30,
        vatRates: [
            { rate: 20, name: 'Normal', category: 'Standard' },
            { rate: 10, name: 'Intermédiaire', category: 'Restauration' },
            { rate: 5.5, name: 'Réduit', category: 'Alimentaire' },
        ],
        invoicePrefix: 'INV-',
        invoiceNextNumber: 1,
        bankName: '',
        iban: '',
        bic: '',
        exportFormat: 'pdf',
    },
    recipesConfig: {
        defaultYield: 4,
        defaultUnit: 'portions',
        showCostsToChefs: true,
        showMarginsToManagers: true,
        autoCalculateCosts: true,
        includeWastePercentage: true,
        defaultWastePercent: 5,
        showNutrition: true,
        showAllergens: true,
        printFormat: 'a4',
        showPhotosInRecipe: true,
        showTimersInRecipe: true,
        targetFoodCostPercent: 30,
        targetGrossMargin: 70,
    },
    haccpConfig: {
        tempCheckFrequencyHours: 4,
        tempAlertDelay: 15,
        tempCriticalDelay: 60,
        autoTempRecording: true,
        sensorIntegration: true,
        tempLogRetentionDays: 90,
        digitalChecklist: true,
        photoRequired: false,
        signatureRequired: true,
        supervisorValidation: true,
        correctiveActionRequired: true,
        alertOnNonConformity: true,
        alertSupervisor: true,
        alertEmail: 'haccp@restaurant.com',
        alertSMS: true,
        alertPhone: '+33 6 12 34 56 78',
        escalationDelay: 30,
        lotTrackingEnabled: true,
        supplierTrackingEnabled: true,
        productionDateRequired: true,
        expiryDateRequired: true,
        allergenTracking: true,
        autoGenerateReports: true,
        reportFrequency: 'weekly',
        pdfExport: true,
        cloudBackup: true,
        retentionYears: 5,
        trainingReminders: true,
        trainingFrequencyMonths: 6,
        certificationTracking: true,
        internalAuditFrequency: 'monthly',
        externalAuditReminder: true,
        auditScoreTarget: 95,
        nonConformityTracking: true,
        temperatureZones: [],
    },
    notificationsConfig: {
        globalSound: true,
        doNotDisturb: false,
        dndStartTime: '22:00',
        dndEndTime: '08:00',
    },
    integrationsConfig: {
        stripePublicKey: 'pk_live_xxxxxxxxxxxxx',
        stripeSecretKey: 'sk_live_xxxxxxxxxxxxx',
        stripeWebhookSecret: 'whsec_xxxxxxxxxxxxx',
        webhooks: [
            { id: '1', event: 'EVENT_ORDER_COMMIT', url: 'https://projection.nexus.io/v1/signals', isActive: true },
            { id: '2', event: 'EVENT_RESERVATION_ACK', url: 'https://sync.thefork.pro/webhooks', isActive: true },
            { id: '3', event: 'EVENT_CLIENT_MUTATION', url: 'https://hub.mailchimp.com/sync', isActive: false },
        ],
    },
    securityConfig: {
        require2FA: false,
        sessionTimeout: 30,
        logRetention: 90,
    },
    staffConfig: {
        maxHoursPerWeek: 35,
        maxOvertimePerWeek: 8,
        minRestBetweenShiftsHours: 11,
        nightShiftStart: '22:00',
        nightShiftBonusPercent: 10,
        sundayBonusPercent: 25,
        holidayBonusPercent: 100,
        paidBreaks: true,
        autoScheduling: true,
        contractTypes: ['CDI', 'CDD', 'Extra', 'Interim', 'Training'],
    },
};

// ============ CONTEXT TYPE ============

interface SettingsContextType {
    settings: GlobalSettings;
    isLoading: boolean;
    isSaving: boolean;
    lastSaved: Date | null;

    // Update functions
    updateIdentity: (data: Partial<RestaurantIdentity>) => Promise<void>;
    updateContact: (data: Partial<RestaurantContact>) => Promise<void>;
    updateSocial: (data: Partial<SocialMedia>) => Promise<void>;
    updateSchedule: (data: DaySchedule[]) => Promise<void>;
    updateService: (data: Partial<ServiceSettings>) => Promise<void>;
    updateReservationSlots: (data: Partial<ReservationSlotSettings>) => Promise<void>;
    updateReservationConfig: (data: Partial<ReservationSettings>) => Promise<void>;
    updatePOS: (data: Partial<POSSettings>) => Promise<void>;
    updateReceipt: (data: Partial<ReceiptTemplate>) => Promise<void>;
    updateClickCollect: (data: Partial<ClickCollectSettings>) => Promise<void>;
    updateSession: (data: Partial<SessionSettings>) => Promise<void>;
    updateTheme: (data: Partial<ThemeSettings>) => Promise<void>;
    updateGoals: (data: Partial<PerformanceGoals>) => Promise<void>;

    // Generic list updates
    updateList: <K extends keyof GlobalSettings>(key: K, data: GlobalSettings[K]) => Promise<void>;
    updateConfig: <K extends 'planningConfig' | 'accountingConfig' | 'recipesConfig' | 'haccpConfig' | 'notificationsConfig' | 'integrationsConfig' | 'securityConfig' | 'staffConfig'>(key: K, data: Partial<GlobalSettings[K]>) => Promise<void>;

    // Legal Specific
    updateLegal: (data: Partial<Pick<GlobalSettings, 'legalEntityName' | 'legalForm' | 'siret' | 'vatNumber' | 'registrationCity' | 'capital' | 'insuranceDetails' | 'licenseIV'>>) => Promise<void>;

    // Closed periods
    addClosedPeriod: (period: Omit<ClosedPeriod, 'id'>) => Promise<void>;
    updateClosedPeriod: (id: string, data: Partial<ClosedPeriod>) => Promise<void>;
    deleteClosedPeriod: (id: string) => Promise<void>;

    // Utility
    resetToDefaults: () => Promise<void>;
    exportSettings: () => string;
    importSettings: (json: string) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// ============ STORAGE KEY ============

const SETTINGS_STORAGE_KEY = 'restaurant-os-global-settings';

// ============ PROVIDER ============

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<GlobalSettings>(defaultSettings);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Load settings on mount
    useEffect(() => {
        const loadSettings = () => {
            try {
                const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    setSettings({ ...defaultSettings, ...parsed });
                }
            } catch (error) {
                console.error('Failed to load settings:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadSettings();
    }, []);

    // Apply theme mode to document
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const root = window.document.documentElement;
            root.classList.remove('light', 'dark');

            if (settings.theme.mode === 'auto') {
                // Check system preference
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                root.classList.add(prefersDark ? 'dark' : 'light');
            } else {
                root.classList.add(settings.theme.mode);
            }
        }
    }, [settings.theme.mode]);

    // Save to localStorage
    const saveSettings = useCallback(async (newSettings: GlobalSettings) => {
        setIsSaving(true);
        try {
            localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
            setSettings(newSettings);
            setLastSaved(new Date());
        } catch (error) {
            console.error('Failed to save settings:', error);
            throw error;
        } finally {
            setIsSaving(false);
        }
    }, []);

    // Update functions
    const updateIdentity = useCallback(async (data: Partial<RestaurantIdentity>) => {
        await saveSettings({ ...settings, identity: { ...settings.identity, ...data } });
    }, [settings, saveSettings]);

    const updateContact = useCallback(async (data: Partial<RestaurantContact>) => {
        await saveSettings({ ...settings, contact: { ...settings.contact, ...data } });
    }, [settings, saveSettings]);

    const updateSocial = useCallback(async (data: Partial<SocialMedia>) => {
        await saveSettings({ ...settings, social: { ...settings.social, ...data } });
    }, [settings, saveSettings]);

    const updateSchedule = useCallback(async (data: DaySchedule[]) => {
        await saveSettings({ ...settings, schedule: data });
    }, [settings, saveSettings]);

    const updateService = useCallback(async (data: Partial<ServiceSettings>) => {
        await saveSettings({ ...settings, service: { ...settings.service, ...data } });
    }, [settings, saveSettings]);

    const updateReservationSlots = useCallback(async (data: Partial<ReservationSlotSettings>) => {
        await saveSettings({ ...settings, reservationSlots: { ...settings.reservationSlots, ...data } });
    }, [settings, saveSettings]);

    const updateReservationConfig = useCallback(async (data: Partial<ReservationSettings>) => {
        await saveSettings({ ...settings, reservationConfig: { ...settings.reservationConfig, ...data } });
    }, [settings, saveSettings]);

    const updatePOS = useCallback(async (data: Partial<POSSettings>) => {
        await saveSettings({ ...settings, pos: { ...settings.pos, ...data } });
    }, [settings, saveSettings]);

    const updateReceipt = useCallback(async (data: Partial<ReceiptTemplate>) => {
        await saveSettings({ ...settings, receipt: { ...settings.receipt, ...data } });
    }, [settings, saveSettings]);

    const updateClickCollect = useCallback(async (data: Partial<ClickCollectSettings>) => {
        await saveSettings({ ...settings, clickCollect: { ...settings.clickCollect, ...data } });
    }, [settings, saveSettings]);

    const updateSession = useCallback(async (data: Partial<SessionSettings>) => {
        await saveSettings({ ...settings, session: { ...settings.session, ...data } });
    }, [settings, saveSettings]);

    const updateTheme = useCallback(async (data: Partial<ThemeSettings>) => {
        await saveSettings({ ...settings, theme: { ...settings.theme, ...data } });
    }, [settings, saveSettings]);

    const updateGoals = useCallback(async (data: Partial<PerformanceGoals>) => {
        await saveSettings({ ...settings, goals: { ...settings.goals, ...data } });
    }, [settings, saveSettings]);

    const updateList = useCallback(async <K extends keyof GlobalSettings>(key: K, data: GlobalSettings[K]) => {
        await saveSettings({ ...settings, [key]: data });
    }, [settings, saveSettings]);

    const updateConfig = useCallback(async <K extends 'planningConfig' | 'accountingConfig' | 'recipesConfig' | 'haccpConfig' | 'notificationsConfig' | 'integrationsConfig' | 'securityConfig' | 'staffConfig'>(key: K, data: Partial<GlobalSettings[K]>) => {
        await saveSettings({ ...settings, [key]: { ...settings[key], ...data } as any });
    }, [settings, saveSettings]);

    const updateLegal = useCallback(async (data: Partial<Pick<GlobalSettings, 'legalEntityName' | 'legalForm' | 'siret' | 'vatNumber' | 'registrationCity' | 'capital' | 'insuranceDetails' | 'licenseIV'>>) => {
        await saveSettings({ ...settings, ...data });
    }, [settings, saveSettings]);

    // Closed periods
    const addClosedPeriod = useCallback(async (period: Omit<ClosedPeriod, 'id'>) => {
        const newPeriod = { ...period, id: `period-${Date.now()}` } as ClosedPeriod;
        await saveSettings({ ...settings, closedPeriods: [...settings.closedPeriods, newPeriod] });
    }, [settings, saveSettings]);

    const updateClosedPeriod = useCallback(async (id: string, data: Partial<ClosedPeriod>) => {
        const updated = settings.closedPeriods.map(p => p.id === id ? { ...p, ...data } : p);
        await saveSettings({ ...settings, closedPeriods: updated });
    }, [settings, saveSettings]);

    const deleteClosedPeriod = useCallback(async (id: string) => {
        await saveSettings({ ...settings, closedPeriods: settings.closedPeriods.filter(p => p.id !== id) });
    }, [settings, saveSettings]);

    // Utility
    const resetToDefaults = useCallback(async () => {
        await saveSettings(defaultSettings);
    }, [saveSettings]);

    const exportSettings = useCallback(() => {
        return JSON.stringify(settings, null, 2);
    }, [settings]);

    const importSettings = useCallback(async (json: string) => {
        const imported = JSON.parse(json);
        await saveSettings({ ...defaultSettings, ...imported });
    }, [saveSettings]);

    const value: SettingsContextType = useMemo(() => ({
        settings,
        isLoading,
        isSaving,
        lastSaved,
        updateIdentity,
        updateContact,
        updateSocial,
        updateSchedule,
        updateService,
        updateReservationSlots,
        updateReservationConfig,
        updatePOS,
        updateReceipt,
        updateClickCollect,
        updateSession,
        updateTheme,
        updateGoals,
        updateList,
        updateConfig,
        updateLegal,
        addClosedPeriod,
        updateClosedPeriod,
        deleteClosedPeriod,
        resetToDefaults,
        exportSettings,
        importSettings,
    }), [
        settings,
        isLoading,
        isSaving,
        lastSaved,
        updateIdentity,
        updateContact,
        updateSocial,
        updateSchedule,
        updateService,
        updateReservationSlots,
        updateReservationConfig,
        updatePOS,
        updateReceipt,
        updateClickCollect,
        updateSession,
        updateTheme,
        updateGoals,
        updateList,
        updateConfig,
        updateLegal,
        addClosedPeriod,
        updateClosedPeriod,
        deleteClosedPeriod,
        resetToDefaults,
        exportSettings,
        importSettings,
    ]);

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
}

// ============ HOOK ============

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}

export default SettingsContext;

