import { Product, Category, Option, OptionGroup, ProductIngredient, LeaveBalance, LeaveRequest } from '@/types';

export const CATEGORIES = [
    { id: "antipasti", name: "Antipasti", color: "bg-[#FF9900]" },
    { id: "pizzas", name: "Pizzas", color: "bg-[#C5A059]" },
    { id: "pasta", name: "Pasta", color: "bg-[#3B82F6]" },
    { id: "viandes", name: "Viandes", color: "bg-[#EF4444]" },
    { id: "cocktails", name: "Cocktails", color: "bg-[#9333EA]" },
    { id: "desserts", name: "Desserts", color: "bg-[#EC4899]" },
];

const COOKING_OPTIONS: OptionGroup = {
    id: "opt_cooking",
    name: "Cuisson",
    type: "single",
    required: true,
    minSelections: 1,
    maxSelections: 1,
    options: [
        { id: "cook_bleu", name: "Bleu", priceModifier: 0 },
        { id: "cook_saignant", name: "Saignant", priceModifier: 0, isDefault: true },
        { id: "cook_apoint", name: "À point", priceModifier: 0 },
        { id: "cook_biencuit", name: "Bien cuit", priceModifier: 0 },
    ]
};

const SUPPLEMENTS_OPTIONS: OptionGroup = {
    id: "opt_supplements",
    name: "Suppléments",
    type: "multiple",
    required: false,
    maxSelections: 3,
    options: [
        { id: "supp_truffle", name: "Truffes Fraîches", priceModifier: 6.00 },
        { id: "supp_mozzarella", name: "Extra Mozzarella", priceModifier: 2.50 },
        { id: "supp_jambon", name: "Jambon de Parme", priceModifier: 4.00 },
    ]
};

export const PRODUCTS: Product[] = [
    // Antipasti
    {
        id: "ant_1",
        categoryId: "antipasti",
        name: "Burrata Crémeuse",
        price: 14.50,
        color: "bg-[#FF9900]/10",
        description: "Burrata des Pouilles, tomates cerises et pesto basilic.",
        image: "/images/dishes/burrata.png",
        ingredients: [
            { ingredientId: 'ing_2', quantity: 0.15 } // 150g Mozzarella/Burrata
        ]
    },

    // Pizzas
    {
        id: "piz_1",
        categoryId: "pizzas",
        name: "Pizza Prosciutto",
        price: 18.00,
        color: "bg-[#C5A059]/10",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop",
        description: "Tomate, mozzarella fior di latte, jambon cru, roquette.",
        optionGroups: [SUPPLEMENTS_OPTIONS],
        ingredients: [
            { ingredientId: 'ing_1', quantity: 0.25 }, // 250g Farine
            { ingredientId: 'ing_2', quantity: 0.12 }, // 120g Mozzarella
            { ingredientId: 'ing_3', quantity: 0.08 }  // 80g Tomates
        ]
    },
    {
        id: "piz_2",
        categoryId: "pizzas",
        name: "Margherita Royal",
        price: 15.00,
        color: "bg-[#C5A059]/10",
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=800&auto=format&fit=crop",
        description: "Tomate, double mozzarella, basilic frais, huile d'olive.",
        ingredients: [
            { ingredientId: 'ing_1', quantity: 0.25 },
            { ingredientId: 'ing_2', quantity: 0.18 },
            { ingredientId: 'ing_3', quantity: 0.10 }
        ]
    },

    // Pasta
    {
        id: "pas_1",
        categoryId: "pasta",
        name: "Spaghetti Carbonara",
        price: 19.50,
        color: "bg-[#3B82F6]/10",
        image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=800&auto=format&fit=crop",
        description: "Authentique recette italienne : guanciale, pecorino, oeuf.",
        optionGroups: [SUPPLEMENTS_OPTIONS]
    },
    {
        id: "pas_2",
        categoryId: "pasta",
        name: "Risotto aux Truffes",
        price: 26.00,
        color: "bg-[#3B82F6]/10",
        image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=800&auto=format&fit=crop",
        description: "Riz Carnaroli, truffes fraîches d'été, parmesan 24 mois."
    },

    // Viandes
    {
        id: "via_1",
        categoryId: "viandes",
        name: "Burger Signature",
        price: 22.00,
        color: "bg-[#EF4444]/10",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop",
        description: "Boeuf Wagyu, cheddar affiné, oignons confits, frites maison.",
        optionGroups: [COOKING_OPTIONS, SUPPLEMENTS_OPTIONS]
    },

    // Cocktails
    {
        id: "cok_1",
        categoryId: "cocktails",
        name: "Aperol Spritz",
        price: 11.00,
        color: "bg-[#9333EA]/10",
        image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=800&auto=format&fit=crop",
        description: "Aperol, Prosecco, trait de soda, orange fraîche."
    },

    // Desserts
    {
        id: "des_1",
        categoryId: "desserts",
        name: "Tiramisu Classico",
        price: 9.50,
        color: "bg-[#EC4899]/10",
        image: "https://images.unsplash.com/photo-1567327613485-fbc7bf196198?q=80&w=800&auto=format&fit=crop",
        description: "Mascarpone, biscuits imbibés au café, cacao amer."
    },
    // KDS Demo Items matches
    {
        id: "kds_1",
        categoryId: "viandes",
        name: "Tartare de Bœuf",
        price: 24.00,
        color: "bg-[#EF4444]/10",
        image: "https://images.unsplash.com/photo-1504973960431-1c467e159aa4?q=80&w=800&auto=format&fit=crop",
        description: "Bœuf coupé au couteau, câpres, échalotes."
    },
    {
        id: "kds_2",
        categoryId: "viandes",
        name: "Filet de Bœuf Wellington",
        price: 45.00,
        color: "bg-[#EF4444]/10",
        image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=800&auto=format&fit=crop",
        description: "Filet de bœuf, duxelle de champignons, pâte feuilletée."
    },
    {
        id: "kds_3",
        categoryId: "antipasti",
        name: "Saumon Gravlax",
        price: 18.00,
        color: "bg-[#FF9900]/10",
        image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop",
        description: "Saumon mariné à l'aneth, baies roses."
    },
    {
        id: "kds_4",
        categoryId: "cocktails",
        name: "Cocktail Signature",
        price: 14.00,
        color: "bg-[#9333EA]/10",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop",
        description: "Création du mixologue."
    },
];

// ============================================
// LEAVE MANAGEMENT MOCK DATA
// ============================================

export const MOCK_BALANCES: LeaveBalance[] = [
    {
        id: '1',
        employeeId: 'current-user',
        type: 'paid_leave',
        entitled: 25,
        acquired: 20.8,
        taken: 5,
        pending: 2,
        planned: 0,
        remaining: 13.8,
        carriedOver: 3,
        periodStart: '2025-06-01',
        periodEnd: '2026-05-31'
    },
    {
        id: '2',
        employeeId: 'current-user',
        type: 'rtt',
        entitled: 11,
        acquired: 9.2,
        taken: 3,
        pending: 0,
        planned: 2,
        remaining: 4.2,
        carriedOver: 0,
        periodStart: '2026-01-01',
        periodEnd: '2026-12-31'
    },
    {
        id: '3',
        employeeId: 'current-user',
        type: 'recovery',
        entitled: 0,
        acquired: 2,
        taken: 0,
        pending: 0,
        planned: 0,
        remaining: 2,
        carriedOver: 0,
        periodStart: '2026-01-01',
        periodEnd: '2026-12-31'
    }
];

export const MOCK_REQUESTS: LeaveRequest[] = [
    {
        id: '1',
        requestNumber: 'ABS-2026-00127',
        employeeId: 'current-user',
        employeeName: 'Jean Dupont',
        type: 'paid_leave',
        startDate: '2026-03-15',
        endDate: '2026-03-22',
        startPeriod: 'full_day',
        endPeriod: 'full_day',
        workingDays: 6,
        calendarDays: 8,
        status: 'approved',
        submittedAt: '2026-01-05T10:30:00Z',
        approvalChain: [
            { level: 1, approverId: 'mgr-1', approverName: 'Marie Martin', approverRole: 'Manager', status: 'approved', decidedAt: '2026-01-05T14:00:00Z' }
        ],
        currentLevel: 1,
        finalDecision: 'approved',
        finalDecisionAt: '2026-01-05T14:00:00Z',
        conflictsDetected: false,
        createdAt: '2026-01-05T10:30:00Z',
        createdBy: 'current-user',
        updatedAt: '2026-01-05T14:00:00Z'
    },
    {
        id: '2',
        requestNumber: 'ABS-2026-00142',
        employeeId: 'current-user',
        employeeName: 'Jean Dupont',
        type: 'paid_leave',
        startDate: '2026-04-10',
        endDate: '2026-04-11',
        startPeriod: 'full_day',
        endPeriod: 'full_day',
        workingDays: 2,
        calendarDays: 2,
        status: 'pending_approval',
        submittedAt: '2026-01-08T09:15:00Z',
        approvalChain: [
            { level: 1, approverId: 'mgr-1', approverName: 'Marie Martin', approverRole: 'Manager', status: 'pending' }
        ],
        currentLevel: 1,
        conflictsDetected: false,
        teamCoverage: { percent: 66, minimumRequired: 60, compliant: true },
        createdAt: '2026-01-08T09:15:00Z',
        createdBy: 'current-user',
        updatedAt: '2026-01-08T09:15:00Z'
    },
    {
        id: '3',
        requestNumber: 'ABS-2026-00089',
        employeeId: 'emp-2',
        employeeName: 'Sophie Laurent',
        type: 'sick_leave',
        startDate: '2026-01-06',
        endDate: '2026-01-08',
        startPeriod: 'full_day',
        endPeriod: 'full_day',
        workingDays: 3,
        calendarDays: 3,
        status: 'in_progress',
        submittedAt: '2026-01-06T08:00:00Z',
        approvalChain: [],
        currentLevel: 0,
        conflictsDetected: false,
        createdAt: '2026-01-06T08:00:00Z',
        createdBy: 'emp-2',
        updatedAt: '2026-01-06T08:00:00Z'
    }
];
export const MOCK_CUSTOMERS = [
    {
        id: 'CRM001',
        name: 'Marie Dupont',
        email: 'marie.dupont@email.com',
        phone: '06 12 34 56 78',
        segment: 'vip',
        totalVisits: 24,
        totalSpent: 2840.00,
        avgSpend: 118.33,
        lastVisit: '2026-01-03',
        firstVisit: '2024-06-15',
        birthday: '1985-03-15',
        preferences: ['Vin blanc', 'Table terrasse', 'Allergique fruits de mer'],
        notes: 'Cliente fidèle, préfère être servie par Alexandre',
        tags: ['VIP', 'Entreprise', 'Anniversaire traité'],
        reservationHistory: [
            { date: '2026-01-03', time: '20:00', guests: 2, spent: 156.00 },
            { date: '2025-12-20', time: '19:30', guests: 4, spent: 312.00 },
            { date: '2025-11-15', time: '20:30', guests: 2, spent: 142.00 },
        ],
    },
    {
        id: 'CRM002',
        name: 'Jean Martin',
        email: 'jean.martin@gmail.com',
        phone: '06 98 76 54 32',
        segment: 'regular',
        totalVisits: 8,
        totalSpent: 720.00,
        avgSpend: 90.00,
        lastVisit: '2025-12-28',
        firstVisit: '2025-03-10',
        birthday: '1990-07-22',
        preferences: ['Vin rouge Bordeaux', 'Menu dégustation'],
        notes: '',
        tags: ['Couple', 'Gastronomie'],
        reservationHistory: [
            { date: '2025-12-28', time: '20:00', guests: 2, spent: 98.00 },
            { date: '2025-11-05', time: '19:00', guests: 2, spent: 112.00 },
        ],
    },
    {
        id: 'CRM003',
        name: 'Sophie Bernard',
        email: 'sophie.b@email.com',
        phone: '06 11 22 33 44',
        segment: 'new',
        totalVisits: 1,
        totalSpent: 86.00,
        avgSpend: 86.00,
        lastVisit: '2025-12-30',
        firstVisit: '2025-12-30',
        birthday: null,
        preferences: [],
        notes: 'Première visite suite à une recommandation Instagram',
        tags: ['Nouveau', 'Instagram'],
        reservationHistory: [
            { date: '2025-12-30', time: '20:30', guests: 2, spent: 86.00 },
        ],
    },
    {
        id: 'CRM004',
        name: 'Pierre Leroy',
        email: 'p.leroy@business.com',
        phone: '06 55 66 77 88',
        segment: 'vip',
        totalVisits: 32,
        totalSpent: 4560.00,
        avgSpend: 142.50,
        lastVisit: '2026-01-04',
        firstVisit: '2023-11-20',
        birthday: '1978-11-08',
        preferences: ['Champagne', 'Carré VIP', 'Repas affaires'],
        notes: 'CEO Tech company, réunions business fréquentes',
        tags: ['VIP', 'Business', 'High-spender'],
        reservationHistory: [],
    },
    {
        id: 'CRM005',
        name: 'Claire Moreau',
        email: 'claire.m@outlook.com',
        phone: '06 99 88 77 66',
        segment: 'lost',
        totalVisits: 5,
        totalSpent: 340.00,
        avgSpend: 68.00,
        lastVisit: '2025-06-15',
        firstVisit: '2024-12-10',
        birthday: '1995-01-20',
        preferences: ['Végétarienne'],
        notes: 'À réactiver - dernière visite il y a 6 mois',
        tags: ['À réactiver', 'Végétarienne'],
        reservationHistory: [],
    },
];
