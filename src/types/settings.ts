// ===========================================
// RESTAURANT OS - SETTINGS TYPES
// ===========================================

// ============ 1. IDENTITY & CONTACT ============

export interface RestaurantIdentity {
    id: string;
    name: string;
    logo?: string;
    slogan?: string;
    cuisineType: string;
    category: 'bistrot' | 'gastronomique' | 'brasserie' | 'fast_casual' | 'cafe' | 'bar' | 'other';
    shortDescription?: string;
    longDescription?: string;
    foundedYear?: number;
    headChef?: string;
    owner?: string;
}

export interface RestaurantContact {
    address: string;
    postalCode: string;
    city: string;
    country: string;
    latitude?: number;
    longitude?: number;
    phoneMain: string;
    phoneReservations?: string;
    whatsapp?: string;
    emailGeneral: string;
    emailReservations?: string;
    emailAccounting?: string;
    website?: string;
    googleMapsUrl?: string;
}

export interface SocialMedia {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    pinterest?: string;
    tripadvisor?: string;
    thefork?: string;
    google?: string;
}

// ============ 2. HOURS & AVAILABILITY ============

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface DaySchedule {
    day: DayOfWeek;
    isOpen: boolean;
    lunchOpen?: string;
    lunchClose?: string;
    dinnerOpen?: string;
    dinnerClose?: string;
    lastKitchenOrder?: string;
}

export interface ServiceSettings {
    avgMealDurationLunch: number;
    avgMealDurationDinner: number;
    lastArrivalBeforeClose: number;
}

export interface ReservationSlotSettings {
    slotDuration: number;
    intervalBetweenSlots: number;
    maxCoversPerSlot: number;
}

export interface ClosedPeriod {
    id: string;
    startDate: string;
    endDate: string;
    reason: string;
    isAnnual: boolean;
}

// ============ 3. MENU & PRODUCTS ============

export interface MenuCategory {
    id: string;
    name: string;
    description?: string;
    order: number;
    icon?: string;
    color?: string;
    image?: string;
    isVisible: boolean;
    availableFor: 'lunch' | 'dinner' | 'both';
    availableFrom?: string;
    availableTo?: string;
}

export interface NutritionInfo {
    calories?: number;
    proteins?: number;
    carbs?: number;
    fats?: number;
    fiber?: number;
    salt?: number;
}

export interface ProductSettings {
    id: string;
    name: string;
    shortDescription?: string;
    longDescription?: string;
    priceHT: number;
    priceTTC: number;
    taxRate: number;
    mainPhoto?: string;
    gallery?: string[];
    categoryId: string;
    secondaryCategories?: string[];
    tags: string[];
    allergens: string[];
    nutritionInfo?: NutritionInfo;
    origin?: string;
    labels?: string[];
    prepTime?: number;
    portion?: string;
    availability: 'in_stock' | 'out_of_stock' | 'seasonal';
    seasonalMonths?: number[];
    visibleOnMenu: boolean;
    visibleOnline: boolean;
    isChefRecommended: boolean;
    isNew: boolean;
    isPopular: boolean;
    foodCost?: number;
    targetMargin?: number;
    suggestedSides?: string[];
    suggestedDrinks?: string[];
    displayOrder: number;
}

export interface Supplement {
    id: string;
    name: string;
    price: number;
    category: string;
    productIds: string[];
    maxSelectable: number;
    isRequired: boolean;
}

export interface MenuFormule {
    id: string;
    name: string;
    description?: string;
    price: number;
    starterIds: string[];
    mainIds: string[];
    dessertIds: string[];
    drinkIds?: string[];
    availableFor: 'lunch' | 'dinner' | 'both';
    maxChoicesPerCategory: number;
    supplements?: string[];
    restrictions?: string;
}

// ============ 4. RECIPES ============

export interface RecipeSettings {
    id: string;
    name: string;
    photo?: string;
    category: 'starter' | 'main' | 'dessert' | 'base' | 'sauce' | 'marinade';
    prepTime: number;
    cookTime: number;
    restTime?: number;
    portions: number;
    yield?: number;
    yieldUnit?: string;
    calculatedCost: number;
    multiplier: number;
    suggestedPrice: number;
    targetMargin: number;
    difficulty: 1 | 2 | 3 | 4 | 5;
    createdBy?: string;
    version: number;
    notes?: string;
    presentationTip?: string;
}

export interface RecipesConfig {
    defaultYield: number;
    defaultUnit: 'portions' | 'kg' | 'l';
    showCostsToChefs: boolean;
    showMarginsToManagers: boolean;
    autoCalculateCosts: boolean;
    includeWastePercentage: boolean;
    defaultWastePercent: number;
    showNutrition: boolean;
    showAllergens: boolean;
    printFormat: 'a4' | 'letter' | 'recipe-card';
    showPhotosInRecipe: boolean;
    showTimersInRecipe: boolean;
    targetFoodCostPercent: number;
    targetGrossMargin: number;
}

export interface RecipeStep {
    id: string;
    recipeId: string;
    order: number;
    description: string;
    duration?: number;
    photo?: string;
    video?: string;
    temperature?: number;
    equipment?: string[];
    techniques?: string[];
}

export interface RecipeIngredient {
    id: string;
    recipeId: string;
    ingredientId: string;
    grossQuantity: number;
    netQuantity: number;
    unit: string;
    lossRate: number;
    substitute?: string;
    notes?: string;
}

// ============ 5. INVENTORY ============

export interface IngredientSettings {
    id: string;
    name: string;
    sku?: string;
    barcode?: string;
    photo?: string;
    category: string;
    subcategory?: string;
    stockUnit: string;
    orderUnit: string;
    standardPackaging?: number;
    purchasePrice: number;
    pricePerUnit?: number;
    primarySupplierId?: string;
    alternateSuppliersIds?: string[];
    deliveryLeadTime?: number;
    minOrderQuantity?: number;
    minStock: number;
    safetyStock?: number;
    maxStock?: number;
    defaultStorageLocation?: string;
    storageTemperature?: number;
    typicalShelfLife?: number;
    allergen?: string;
    isOrganic: boolean;
    labels?: string[];
    origin?: string;
    isSeasonal: boolean;
    seasonalMonths?: number[];
}

// ============ 6. STAFF & HR ============

export type ContractType = 'cdi' | 'cdd' | 'extra' | 'intern' | 'apprentice';
export type Department = 'kitchen' | 'service' | 'bar' | 'admin';

export interface EmployeeSettings {
    id: string;
    firstName: string;
    lastName: string;
    photo?: string;
    birthDate?: string;
    gender?: 'male' | 'female' | 'other';
    nationality?: string;
    address?: string;
    phone: string;
    email: string;
    emergencyContact?: { name: string; phone: string };
    socialSecurityNumber?: string;
    contractNumber?: string;
    contractType: ContractType;
    hireDate: string;
    endDate?: string;
    positionId: string;
    department: Department;
    hierarchyLevel?: number;
    managerId?: string;
    hourlyRate?: number;
    monthlySalary?: number;
    weeklyHours: number;
    hasHealthInsurance: boolean;
    hasMealVouchers: boolean;
    transportReimbursement?: number;
    bankDetails?: string;
    pinCode: string;
    systemRole: string;
    specificPermissions?: string[];
    languages?: string[];
    certifications?: string[];
    personalAllergies?: string[];
    uniformSize?: string;
    shoeSize?: number;
    isActive: boolean;
    terminationReason?: string;
    terminationDate?: string;
}

export interface PositionSettings {
    id: string;
    name: string;
    description?: string;
    department: Department;
    responsibilityLevel?: number;
    minHourlyRate?: number;
    maxHourlyRate?: number;
    requiredSkills?: string[];
    budgetedCount?: number;
    color?: string;
    overtimeRate?: number;
    breakDuration?: number;
}

export interface StaffConfig {
    maxHoursPerWeek: number;
    maxOvertimePerWeek: number;
    minRestBetweenShiftsHours: number;
    nightShiftStart: string;
    nightShiftBonusPercent: number;
    sundayBonusPercent: number;
    holidayBonusPercent: number;
    paidBreaks: boolean;
    autoScheduling: boolean;
    contractTypes: string[];
}

// ============ 7. PLANNING & SHIFTS ============

export interface ShiftTemplate {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    breakDuration: number;
    positionId?: string;
    workZone?: string;
    color: string;
    notes?: string;
}

export type AbsenceType = 'paid_leave' | 'rtt' | 'sick' | 'maternity' | 'unpaid' | 'training';
export type AbsenceStatus = 'pending' | 'approved' | 'rejected';

export interface AbsenceSettings {
    id: string;
    employeeId: string;
    type: AbsenceType;
    startDate: string;
    endDate: string;
    isHalfDay: boolean;
    halfDayPeriod?: 'morning' | 'afternoon';
    status: AbsenceStatus;
    justificationFile?: string;
    employeeComment?: string;
    managerComment?: string;
    leaveBalanceBefore?: number;
    leaveBalanceAfter?: number;
}

export interface PlanningConfig {
    weekStartDay: number;
    defaultView: 'day' | 'week' | 'month';
    minHoursBetweenShifts: number;
    maxHoursPerDay: number;
    maxHoursPerWeek: number;
    notifyOnPublish: boolean;
    absenceRequestApproval: boolean;
    swapRequestApproval: boolean;
    overtimeEnabled: boolean;
}

// ============ 8. RESERVATIONS ============

export interface ReservationSettings {
    minAdvanceHours: number;
    maxAdvanceDays: number;
    defaultDuration: number;
    overbookingAllowed: boolean;
    overbookingPercent?: number;
    autoConfirm: boolean;
    requireDeposit: boolean;
    depositAmount?: number;
    depositType?: 'fixed' | 'percent';
    emailReminderHours: number;
    smsReminderHours?: number;
    noShowDelayMinutes: number;
    noShowPenalty?: number;
    confirmationMessage: string;
    reminderMessage: string;
    cancellationMessage: string;
    cancellationPolicy: string;
    terms: string;
}

export type ReservationChannel = 'phone' | 'website' | 'thefork' | 'google' | 'walkin';
export type ReservationStatus = 'pending' | 'confirmed' | 'arrived' | 'seated' | 'finished' | 'cancelled' | 'noshow';

// ============ 9. CRM & CLIENTS ============

export type ClientCategory = 'individual' | 'business' | 'vip' | 'press' | 'influencer';
export type ClientSegment = 'new' | 'regular' | 'loyal' | 'lost';
export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface ClientSettings {
    id: string;
    firstName: string;
    lastName: string;
    photo?: string;
    gender?: 'male' | 'female' | 'other';
    birthDate?: string;
    email: string;
    secondaryEmails?: string[];
    phone: string;
    secondaryPhone?: string;
    address?: string;
    company?: string;
    position?: string;
    vatNumber?: string;
    category: ClientCategory;
    segment: ClientSegment;
    loyaltyPoints?: number;
    loyaltyTier?: LoyaltyTier;
    foodPreferences?: string[];
    allergies?: string[];
    diets?: string[];
    preferredTable?: string;
    preferredZone?: string;
    preferredServer?: string;
    favoriteDishes?: string[];
    favoriteDrinks?: string[];
    usualOccasion?: string;
    avgSpend?: number;
    visitFrequency?: string;
    firstVisitDate?: string;
    lastVisitDate?: string;
    totalVisits?: number;
    totalRevenue?: number;
    relationshipNotes?: string;
    marketingConsent: { email: boolean; sms: boolean; postal: boolean };
    consentDate?: string;
    acquisitionSource?: string;
    customTags?: string[];
    isActive: boolean;
    deletionRequested?: boolean;
}

export interface LoyaltyProgram {
    id: string;
    name: string;
    pointsPerEuro: number;
    euroPerPoint: number;
    tiers: { name: string; minPoints: number; benefits: string[]; color: string }[];
    rewards: { name: string; pointsCost: number; description: string }[];
    pointsValidityDays: number;
    signupBonus: number;
    referralRewardReferrer: number;
    referralRewardReferee: number;
}

// ============ 10. POS SETTINGS ============

export interface POSSettings {
    currency: string;
    priceFormat: 'with_cents' | 'rounded';
    displayMode: 'ht' | 'ttc';
    roundingRule: 'none' | 'nearest_5' | 'nearest_10';
    serviceMode: 'table' | 'counter' | 'delivery' | 'mixed';
    buttonSize: 'small' | 'medium' | 'large';
    showImages: boolean;
    theme: 'light' | 'dark';
    notificationSound: boolean;
    autoPrintReceipt: boolean;
    receiptCopies: number;
    tipsEnabled: boolean;
    tipSuggestions: number[];
}

export interface PaymentMethod {
    id: string;
    name: string;
    type: 'cash' | 'card' | 'amex' | 'meal_voucher' | 'check' | 'transfer' | 'account' | 'digital' | 'voucher';
    enabled: boolean;
    icon?: string;
    order: number;
}

export interface ReceiptTemplate {
    logo?: string;
    restaurantName: string;
    address: string;
    siret: string;
    vatNumber: string;
    welcomeMessage?: string;
    thankYouMessage?: string;
    footer?: string;
    showDetailedTax: boolean;
    qrCodeUrl?: string;
    format: '80mm' | '58mm';
}

export interface AccountingConfig {
    fiscalYearStart: string;
    accountingMethod: 'accrual' | 'cash';
    defaultPaymentTerms: number;
    vatRates: { rate: number; name: string; category: string }[];
    invoicePrefix: string;
    invoiceNextNumber: number;
    bankName: string;
    iban: string;
    bic: string;
    exportFormat: 'csv' | 'xlsx' | 'pdf';
}

// ============ 11. SUPPLIERS ============

export interface SupplierSettings {
    id: string;
    name: string;
    type: 'food' | 'beverage' | 'equipment' | 'services' | 'other';
    contactName?: string;
    email?: string;
    phone?: string;
    address?: string;
    siret?: string;
    vatNumber?: string;
    iban?: string;
    paymentTerms: '30' | '60' | 'immediate';
    negotiatedDiscount?: number;
    minimumOrder?: number;
    avgDeliveryTime?: number;
    deliveryDays?: DayOfWeek[];
    deliveryHours?: string;
    products?: string[];
    notes?: string;
}

// ============ 12. HACCP ============

export type ControlFrequency = 'daily' | 'weekly' | 'monthly';
export type ControlCategory = 'temperature' | 'cleaning' | 'reception' | 'storage';

export interface ControlPoint {
    id: string;
    name: string;
    category: ControlCategory;
    frequency: ControlFrequency;
    scheduledTime?: string;
    minValue?: number;
    maxValue?: number;
    equipmentId?: string;
    responsibleId?: string;
    correctiveAction?: string;
    isRequired: boolean;
}

export interface NonConformity {
    id: string;
    type: string;
    severity: 'minor' | 'major' | 'critical';
    detectionDate: string;
    description: string;
    affectedProducts?: string[];
    immediateAction?: string;
    correctiveAction?: string;
    responsibleId?: string;
    status: 'open' | 'in_progress' | 'closed';
    closedDate?: string;
}

export interface HACCPConfig {
    tempCheckFrequencyHours: number;
    tempAlertDelay: number;
    tempCriticalDelay: number;
    autoTempRecording: boolean;
    sensorIntegration: boolean;
    tempLogRetentionDays: number;
    digitalChecklist: boolean;
    photoRequired: boolean;
    signatureRequired: boolean;
    supervisorValidation: boolean;
    correctiveActionRequired: boolean;
    alertOnNonConformity: boolean;
    alertSupervisor: boolean;
    alertEmail: string;
    alertSMS: boolean;
    alertPhone: string;
    escalationDelay: number;
    lotTrackingEnabled: boolean;
    supplierTrackingEnabled: boolean;
    productionDateRequired: boolean;
    expiryDateRequired: boolean;
    allergenTracking: boolean;
    autoGenerateReports: boolean;
    reportFrequency: 'daily' | 'weekly' | 'monthly';
    pdfExport: boolean;
    cloudBackup: boolean;
    retentionYears: number;
    trainingReminders: boolean;
    trainingFrequencyMonths: number;
    certificationTracking: boolean;
    internalAuditFrequency: 'weekly' | 'monthly' | 'quarterly';
    externalAuditReminder: boolean;
    auditScoreTarget: number;
    nonConformityTracking: boolean;
    temperatureZones: {
        id: string;
        name: string;
        type: 'fridge' | 'freezer' | 'hot' | 'ambient';
        minTemp: number;
        maxTemp: number;
        frequency: number;
        sensorId: string;
        autoAlert: boolean;
    }[];
}

// ============ 13. DELIVERY & ONLINE ============

export interface DeliveryZone {
    id: string;
    name: string;
    postalCodes?: string[];
    radiusKm?: number;
    deliveryFee: number;
    freeDeliveryMinimum?: number;
    estimatedTime: number;
    isActive: boolean;
}

export interface ClickCollectSettings {
    enabled: boolean;
    minPrepTime: number;
    slotsPerHour: number;
    maxOrdersPerSlot: number;
    pickupInstructions?: string;
    pickupLocation?: string;
}

// ============ 14. NOTIFICATIONS ============

export type NotificationChannel = 'push' | 'email' | 'sms' | 'whatsapp' | 'slack';

export interface AlertRouting {
    eventType: string;
    recipients: string[];
    channels: NotificationChannel[];
    enabled: boolean;
}

export interface NotificationsConfig {
    globalSound: boolean;
    doNotDisturb: boolean;
    dndStartTime: string;
    dndEndTime: string;
}

export interface ReportSchedule {
    id: string;
    name: string;
    type: 'daily' | 'weekly' | 'monthly';
    sendTime: string;
    recipients: string[];
    content: string[];
}

// ============ 15. SECURITY ============

export interface RoleSettings {
    id: string;
    name: string;
    description?: string;
    color: string;
    permissions: { module: string; read: boolean; write: boolean; delete: boolean }[];
    hourRestrictions?: { startTime: string; endTime: string }[];
    zoneRestrictions?: string[];
    canAccessFinancials: boolean;
    canAccessSensitiveData: boolean;
}

export interface SessionSettings {
    autoLogoutMinutes: number;
    requireMFA: boolean;
    maxConcurrentSessions: number;
    logRetentionDays: number;
}

export interface SecurityConfig {
    require2FA: boolean;
    sessionTimeout: number;
    logRetention: number;
}

// ============ 16. APPEARANCE ============

export interface ThemeSettings {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    mode: 'light' | 'dark' | 'auto';
    fontPrimary: string;
    fontHeadings: string;
    borderRadius: 'none' | 'small' | 'medium' | 'large';
    buttonStyle: 'flat' | 'outlined' | 'gradient';
    animationsEnabled: boolean;
}

// ============ 17. GOALS & KPIs ============

export interface PerformanceGoals {
    dailyRevenue?: number;
    weeklyRevenue?: number;
    monthlyRevenue?: number;
    avgTicket?: number;
    occupancyRate?: number;
    dailyCovers?: number;
    foodCostPercent?: number;
    laborCostPercent?: number;
    avgReviewScore?: number;
    noShowPercent?: number;
}

// ============ 18. INTEGRATIONS ============

export interface IntegrationSettings {
    id: string;
    name: string;
    provider: string;
    apiKey?: string;
    environment: 'sandbox' | 'production' | string;
    isActive: boolean;
    lastSyncDate?: string;
    webhookUrl?: string;
}

export interface IntegrationsConfig {
    stripePublicKey: string;
    stripeSecretKey: string;
    stripeWebhookSecret: string;
    webhooks: {
        id: string;
        event: string;
        url: string;
        isActive: boolean;
    }[];
}

// ============ GLOBAL SETTINGS CONTAINER ============

export interface GlobalSettings {
    // 1. Identity & Contact
    identity: RestaurantIdentity;
    contact: RestaurantContact;
    social: SocialMedia;

    // 2. Hours & Availability
    schedule: DaySchedule[];
    service: ServiceSettings;
    reservationSlots: ReservationSlotSettings;
    closedPeriods: ClosedPeriod[];

    // 3. Menu & Products
    menuCategories: MenuCategory[];
    products: ProductSettings[];
    supplements: Supplement[];
    formules: MenuFormule[];

    // 4. Recipes
    recipes: RecipeSettings[];
    recipeSteps: RecipeStep[];
    recipeIngredients: RecipeIngredient[];

    // 5. Inventory
    ingredients: IngredientSettings[];
    suppliers: SupplierSettings[];

    // 6. Staff & HR
    employees: EmployeeSettings[];
    positions: PositionSettings[];

    // 7. Planning & Shifts
    shiftTemplates: ShiftTemplate[];
    absences: AbsenceSettings[];

    // 8. Reservations
    reservationConfig: ReservationSettings;

    // 9. CRM & Clients
    clients: ClientSettings[];
    loyaltyProgram?: LoyaltyProgram;

    // 10. POS Settings
    pos: POSSettings;
    paymentMethods: PaymentMethod[];
    receipt: ReceiptTemplate;

    // 11. HACCP
    haccpControlPoints: ControlPoint[];
    haccpNonConformities: NonConformity[];

    // 12. Delivery & Online
    deliveryZones: DeliveryZone[];
    clickCollect: ClickCollectSettings;

    // 13. Notifications
    notificationRoutings: AlertRouting[];
    reportSchedules: ReportSchedule[];

    // 14. Security
    roles: RoleSettings[];
    session: SessionSettings;

    // 15. Appearance
    theme: ThemeSettings;

    // 16. Goals & KPIs
    goals: PerformanceGoals;

    // 17. Integrations
    integrations: IntegrationSettings[];

    // 18. Legal
    legalEntityName?: string;
    legalForm?: string;
    siret?: string;
    vatNumber?: string;
    registrationCity?: string;
    capital?: string;
    insuranceDetails?: string;
    licenseIV?: boolean;

    // Config objects for complex settings
    planningConfig?: PlanningConfig;
    accountingConfig?: AccountingConfig;
    recipesConfig?: RecipesConfig;
    haccpConfig?: HACCPConfig;
    notificationsConfig?: NotificationsConfig;
    integrationsConfig?: IntegrationsConfig;
    securityConfig?: SecurityConfig;
    staffConfig?: StaffConfig;
}
