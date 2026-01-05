/**
 * FEC Export Generator
 * Fichier des Écritures Comptables - Format réglementaire français
 * Conforme aux exigences de l'article A47 A-1 du LPF
 */

export interface FECEntry {
    JournalCode: string;        // Code du journal
    JournalLib: string;         // Libellé du journal
    EcritureNum: string;        // Numéro de l'écriture
    EcritureDate: string;       // Date de l'écriture (YYYYMMDD)
    CompteNum: string;          // Numéro de compte
    CompteLib: string;          // Libellé du compte
    CompAuxNum: string;         // Numéro de compte auxiliaire
    CompAuxLib: string;         // Libellé du compte auxiliaire
    PieceRef: string;           // Référence de la pièce
    PieceDate: string;          // Date de la pièce (YYYYMMDD)
    EcritureLib: string;        // Libellé de l'écriture
    Debit: string;              // Montant débit (format 1234.56)
    Credit: string;             // Montant crédit (format 1234.56)
    EcritureLet: string;        // Lettrage
    DateLet: string;            // Date de lettrage
    ValidDate: string;          // Date de validation
    Montantdevise: string;      // Montant en devise
    Idevise: string;            // Identifiant devise (EUR)
}

// Account codes for restaurant operations (Plan Comptable Général)
const ACCOUNTS = {
    // Class 4 - Third-party accounts
    CUSTOMERS: { num: '411000', lib: 'Clients' },
    SUPPLIERS: { num: '401000', lib: 'Fournisseurs' },

    // Class 5 - Financial accounts
    CASH: { num: '531000', lib: 'Caisse' },
    BANK: { num: '512000', lib: 'Banque' },
    CARD_PENDING: { num: '511200', lib: 'Cartes bancaires à encaisser' },

    // Class 6 - Expenses
    FOOD_PURCHASES: { num: '601000', lib: 'Achats matières premières' },
    DRINKS_PURCHASES: { num: '601100', lib: 'Achats boissons' },
    PAYROLL: { num: '641000', lib: 'Rémunérations du personnel' },
    SOCIAL_CHARGES: { num: '645000', lib: 'Charges sociales' },

    // Class 7 - Revenue
    FOOD_SALES: { num: '707100', lib: 'Ventes restauration' },
    DRINKS_SALES: { num: '707200', lib: 'Ventes boissons' },
    TAKEAWAY_SALES: { num: '707300', lib: 'Ventes à emporter' },

    // VAT accounts
    VAT_10: { num: '445710', lib: 'TVA collectée 10%' },
    VAT_20: { num: '445720', lib: 'TVA collectée 20%' },
    VAT_55: { num: '445755', lib: 'TVA collectée 5.5%' },
    VAT_DEDUCTIBLE: { num: '445660', lib: 'TVA déductible' },
};

export interface Transaction {
    id: string;
    date: Date;
    type: 'sale' | 'purchase' | 'payroll';
    description: string;
    amountHT: number;
    vatRate: number;
    vatAmount: number;
    paymentMethod: 'cash' | 'card' | 'bank';
    category?: 'food' | 'drinks' | 'takeaway';
}

/**
 * Generate FEC file content from transactions
 */
export function generateFEC(
    transactions: Transaction[],
    period: { startDate: Date; endDate: Date },
    company: { name: string; siret: string }
): string {
    const entries: FECEntry[] = [];
    let ecritureNum = 1;

    // FEC Header row (column names)
    const headers = [
        'JournalCode', 'JournalLib', 'EcritureNum', 'EcritureDate',
        'CompteNum', 'CompteLib', 'CompAuxNum', 'CompAuxLib',
        'PieceRef', 'PieceDate', 'EcritureLib', 'Debit', 'Credit',
        'EcritureLet', 'DateLet', 'ValidDate', 'Montantdevise', 'Idevise'
    ];

    // Process each transaction
    transactions.forEach(tx => {
        const dateStr = formatDate(tx.date);
        const totalTTC = tx.amountHT + tx.vatAmount;

        if (tx.type === 'sale') {
            // Sale transaction - 3 lines: Customer debit, Revenue credit, VAT credit
            const JournalCode = 'VE';
            const JournalLib = 'Ventes';
            const PieceRef = `FAC-${tx.id}`;

            // 1. Debit customer/payment account
            const paymentAccount = tx.paymentMethod === 'cash' ? ACCOUNTS.CASH :
                tx.paymentMethod === 'card' ? ACCOUNTS.CARD_PENDING :
                    ACCOUNTS.BANK;

            entries.push(createEntry({
                JournalCode, JournalLib,
                EcritureNum: ecritureNum.toString().padStart(6, '0'),
                EcritureDate: dateStr,
                CompteNum: paymentAccount.num,
                CompteLib: paymentAccount.lib,
                PieceRef, PieceDate: dateStr,
                EcritureLib: tx.description,
                Debit: formatAmount(totalTTC),
                Credit: '',
                ValidDate: dateStr
            }));

            // 2. Credit revenue account
            const revenueAccount = tx.category === 'drinks' ? ACCOUNTS.DRINKS_SALES :
                tx.category === 'takeaway' ? ACCOUNTS.TAKEAWAY_SALES :
                    ACCOUNTS.FOOD_SALES;

            entries.push(createEntry({
                JournalCode, JournalLib,
                EcritureNum: ecritureNum.toString().padStart(6, '0'),
                EcritureDate: dateStr,
                CompteNum: revenueAccount.num,
                CompteLib: revenueAccount.lib,
                PieceRef, PieceDate: dateStr,
                EcritureLib: tx.description,
                Debit: '',
                Credit: formatAmount(tx.amountHT),
                ValidDate: dateStr
            }));

            // 3. Credit VAT account
            const vatAccount = tx.vatRate === 10 ? ACCOUNTS.VAT_10 :
                tx.vatRate === 20 ? ACCOUNTS.VAT_20 :
                    ACCOUNTS.VAT_55;

            entries.push(createEntry({
                JournalCode, JournalLib,
                EcritureNum: ecritureNum.toString().padStart(6, '0'),
                EcritureDate: dateStr,
                CompteNum: vatAccount.num,
                CompteLib: vatAccount.lib,
                PieceRef, PieceDate: dateStr,
                EcritureLib: `TVA ${tx.vatRate}% sur ${tx.description}`,
                Debit: '',
                Credit: formatAmount(tx.vatAmount),
                ValidDate: dateStr
            }));

        } else if (tx.type === 'purchase') {
            // Purchase transaction
            const JournalCode = 'AC';
            const JournalLib = 'Achats';
            const PieceRef = `ACH-${tx.id}`;

            // 1. Debit purchase account
            entries.push(createEntry({
                JournalCode, JournalLib,
                EcritureNum: ecritureNum.toString().padStart(6, '0'),
                EcritureDate: dateStr,
                CompteNum: ACCOUNTS.FOOD_PURCHASES.num,
                CompteLib: ACCOUNTS.FOOD_PURCHASES.lib,
                PieceRef, PieceDate: dateStr,
                EcritureLib: tx.description,
                Debit: formatAmount(tx.amountHT),
                Credit: '',
                ValidDate: dateStr
            }));

            // 2. Debit VAT deductible
            entries.push(createEntry({
                JournalCode, JournalLib,
                EcritureNum: ecritureNum.toString().padStart(6, '0'),
                EcritureDate: dateStr,
                CompteNum: ACCOUNTS.VAT_DEDUCTIBLE.num,
                CompteLib: ACCOUNTS.VAT_DEDUCTIBLE.lib,
                PieceRef, PieceDate: dateStr,
                EcritureLib: `TVA déductible sur ${tx.description}`,
                Debit: formatAmount(tx.vatAmount),
                Credit: '',
                ValidDate: dateStr
            }));

            // 3. Credit supplier account
            entries.push(createEntry({
                JournalCode, JournalLib,
                EcritureNum: ecritureNum.toString().padStart(6, '0'),
                EcritureDate: dateStr,
                CompteNum: ACCOUNTS.SUPPLIERS.num,
                CompteLib: ACCOUNTS.SUPPLIERS.lib,
                PieceRef, PieceDate: dateStr,
                EcritureLib: tx.description,
                Debit: '',
                Credit: formatAmount(totalTTC),
                ValidDate: dateStr
            }));
        }

        ecritureNum++;
    });

    // Generate TAB-separated file content
    const lines = [headers.join('\t')];
    entries.forEach(entry => {
        lines.push([
            entry.JournalCode,
            entry.JournalLib,
            entry.EcritureNum,
            entry.EcritureDate,
            entry.CompteNum,
            entry.CompteLib,
            entry.CompAuxNum,
            entry.CompAuxLib,
            entry.PieceRef,
            entry.PieceDate,
            entry.EcritureLib,
            entry.Debit,
            entry.Credit,
            entry.EcritureLet,
            entry.DateLet,
            entry.ValidDate,
            entry.Montantdevise,
            entry.Idevise
        ].join('\t'));
    });

    return lines.join('\n');
}

/**
 * Download FEC file
 */
export function downloadFEC(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Generate FEC filename according to regulations
 * Format: SIREN_FEC_YYYYMMDD.txt
 */
export function generateFECFilename(siret: string, endDate: Date): string {
    const siren = siret.substring(0, 9);
    const dateStr = formatDate(endDate);
    return `${siren}FEC${dateStr}.txt`;
}

// Helper functions
function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}${month}${day}`;
}

function formatAmount(amount: number): string {
    return amount > 0 ? amount.toFixed(2) : '';
}

function createEntry(data: Partial<FECEntry>): FECEntry {
    return {
        JournalCode: data.JournalCode || '',
        JournalLib: data.JournalLib || '',
        EcritureNum: data.EcritureNum || '',
        EcritureDate: data.EcritureDate || '',
        CompteNum: data.CompteNum || '',
        CompteLib: data.CompteLib || '',
        CompAuxNum: data.CompAuxNum || '',
        CompAuxLib: data.CompAuxLib || '',
        PieceRef: data.PieceRef || '',
        PieceDate: data.PieceDate || '',
        EcritureLib: data.EcritureLib || '',
        Debit: data.Debit || '',
        Credit: data.Credit || '',
        EcritureLet: data.EcritureLet || '',
        DateLet: data.DateLet || '',
        ValidDate: data.ValidDate || '',
        Montantdevise: data.Montantdevise || '',
        Idevise: data.Idevise || 'EUR'
    };
}
