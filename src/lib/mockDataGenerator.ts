/**
 * MOCK DATA GENERATOR - Restaurant OS
 * Generates realistic demo data for dashboard and analytics
 */

// Helper for random number in range
const randomInRange = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;

// Helper for random float with decimals
const randomFloat = (min: number, max: number, decimals: number = 2): number =>
    parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

/**
 * Generate daily revenue in euros
 */
export function generateDailyRevenue(): number {
    // Weekday vs weekend variance
    const dayOfWeek = new Date().getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;

    return isWeekend
        ? randomInRange(3500, 5500)
        : randomInRange(2200, 3800);
}

/**
 * Generate occupancy rate percentage
 */
export function generateOccupancyRate(): number {
    const hour = new Date().getHours();

    // Peak hours have higher occupancy
    if (hour >= 12 && hour <= 14) return randomInRange(75, 98);
    if (hour >= 19 && hour <= 22) return randomInRange(80, 100);

    return randomInRange(45, 70);
}

/**
 * Generate average ticket value
 */
export function generateAverageTicket(): number {
    return randomFloat(38, 65, 2);
}

/**
 * Generate hourly sales data for charts
 */
export function generateHourlySales(): { hour: number; revenue: number }[] {
    return Array.from({ length: 12 }, (_, i) => {
        const hour = 11 + i;
        let base = 0;

        // Lunch peak
        if (hour >= 12 && hour <= 14) base = randomInRange(400, 700);
        // Dinner peak
        else if (hour >= 19 && hour <= 22) base = randomInRange(500, 900);
        // Off-peak
        else base = randomInRange(50, 200);

        return { hour, revenue: base };
    });
}

/**
 * Generate weekly revenue data
 */
export function generateWeeklyRevenue(): { day: string; revenue: number; previousWeek: number }[] {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    return days.map((day, i) => {
        const isWeekend = i >= 4;
        const revenue = isWeekend
            ? randomInRange(3500, 5500)
            : randomInRange(2200, 3800);
        const previousWeek = Math.round(revenue * randomFloat(0.85, 1.15, 2));

        return { day, revenue, previousWeek };
    });
}

/**
 * Generate top products data
 */
export function generateTopProducts(): { name: string; count: number; revenue: number }[] {
    const products = [
        { name: 'Filet de Bœuf Wellington', basePrice: 45 },
        { name: 'Homard Thermidor', basePrice: 58 },
        { name: 'Magret de Canard', basePrice: 32 },
        { name: 'Tartare de Bœuf', basePrice: 24 },
        { name: 'Sole Meunière', basePrice: 38 },
        { name: 'Risotto Truffes', basePrice: 28 },
        { name: 'Champagne (btl)', basePrice: 85 },
        { name: 'Café Gourmand', basePrice: 12 },
    ];

    return products
        .map(p => {
            const count = randomInRange(8, 45);
            return {
                name: p.name,
                count,
                revenue: count * p.basePrice
            };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);
}

/**
 * Generate payment method distribution
 */
export function generatePaymentMethods(): { method: string; amount: number; percentage: number }[] {
    const total = generateDailyRevenue();
    const cbPercent = randomInRange(55, 70);
    const cashPercent = randomInRange(15, 25);
    const ticketPercent = 100 - cbPercent - cashPercent;

    return [
        { method: 'Carte Bancaire', amount: Math.round(total * cbPercent / 100), percentage: cbPercent },
        { method: 'Espèces', amount: Math.round(total * cashPercent / 100), percentage: cashPercent },
        { method: 'Tickets Restaurant', amount: Math.round(total * ticketPercent / 100), percentage: ticketPercent },
    ];
}

/**
 * Generate KPI comparison data
 */
export function generateKPIComparison(): {
    revenue: { value: number; delta: number };
    tickets: { value: number; delta: number };
    avgTicket: { value: number; delta: number };
    occupancy: { value: number; delta: number };
} {
    return {
        revenue: { value: generateDailyRevenue(), delta: randomFloat(-5, 15, 1) },
        tickets: { value: randomInRange(85, 142), delta: randomFloat(-8, 12, 1) },
        avgTicket: { value: generateAverageTicket(), delta: randomFloat(-3, 8, 1) },
        occupancy: { value: generateOccupancyRate(), delta: randomFloat(-10, 15, 1) },
    };
}

/**
 * Generate service distribution (lunch vs dinner)
 */
export function generateServiceDistribution(): { service: string; covers: number; revenue: number }[] {
    const lunchCovers = randomInRange(35, 55);
    const dinnerCovers = randomInRange(50, 85);

    return [
        { service: 'Déjeuner', covers: lunchCovers, revenue: lunchCovers * randomInRange(38, 48) },
        { service: 'Dîner', covers: dinnerCovers, revenue: dinnerCovers * randomInRange(52, 68) },
    ];
}

/**
 * Generate alerts for dashboard
 */
export function generateAlerts(): { type: string; title: string; message: string; time: string }[] {
    const alerts = [
        { type: 'stock', title: 'Stock Critique', message: 'Mozzarella di Bufala sous le seuil minimum', time: 'Il y a 12 min' },
        { type: 'rh', title: 'Retard Pointage', message: 'Marie Laurent - 15 min de retard', time: 'Il y a 8 min' },
        { type: 'reservation', title: 'VIP Incoming', message: 'Table 4 - Client fidèle Marco Rossi arrive', time: 'Dans 30 min' },
        { type: 'kitchen', title: 'Ticket Long', message: 'Table 7 en attente depuis 18 minutes', time: 'Maintenant' },
    ];

    // Return 2-3 random alerts
    return alerts.slice(0, randomInRange(2, 4));
}
