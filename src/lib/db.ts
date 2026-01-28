import Dexie, { type Table } from 'dexie';
import type {
    Table as RestaurantTable,
    Order,
    Ingredient,
    SupplierOrder,
    Customer,
    Reservation,
    User,
    AuditLog,
    Notification,
    SensorReading,
    HACCPChecklistItem,
    Recipe,
    MiseEnPlaceTask,
    WasteLog,
    JournalEntry,
    ExpenseClaim,
    Account,
    FiscalPeriod,
    BankTransaction,
    StockItem,
    Preparation,
    StorageLocation,
    TemperatureLog,
    InventoryMovement
} from '@/types';

export class RestaurantDB extends Dexie {
    diningTables!: Table<RestaurantTable>;
    orders!: Table<Order>;
    ingredients!: Table<Ingredient>;
    supplierOrders!: Table<SupplierOrder>;
    customers!: Table<Customer>;
    reservations!: Table<Reservation>;
    users!: Table<User>;
    notifications!: Table<Notification>;
    sensors!: Table<SensorReading>;
    haccpChecklist!: Table<HACCPChecklistItem>;
    recipes!: Table<Recipe>;
    prepTasks!: Table<MiseEnPlaceTask>;
    wasteLogs!: Table<WasteLog>;
    journalEntries!: Table<JournalEntry>;
    expenseClaims!: Table<ExpenseClaim>;
    auditLogs!: Table<AuditLog>;
    // Professional Accounting Tables
    accounts!: Table<Account>;
    fiscalPeriods!: Table<FiscalPeriod>;
    bankTransactions!: Table<BankTransaction>;
    // Stock Management Tables
    stockItems!: Table<StockItem>;
    preparations!: Table<Preparation>;
    storageLocations!: Table<StorageLocation>;
    temperatureLogs!: Table<TemperatureLog>;
    inventoryMovements!: Table<InventoryMovement>;

    constructor() {
        super('RestaurantOS_DB');
        this.version(3).stores({
            diningTables: 'id, number, status, zoneId',
            orders: 'id, tableId, tableNumber, status, timestamp, serverName',
            ingredients: 'id, name, category, supplier, defaultStorageLocation',
            supplierOrders: 'id, supplier, status, orderDate',
            customers: 'id, lastName, email, phone',
            reservations: 'id, tableId, customerName, date, status',
            users: 'id, email, pin, role',
            notifications: 'id, type, read, timestamp',
            sensors: 'id, name, type, status',
            haccpChecklist: 'id, frequency, completed',
            recipes: 'id, name, category',
            prepTasks: 'id, name, assignedTo, isCompleted',
            wasteLogs: 'id, name, reason, timestamp',
            journalEntries: 'id, date, pieceNumber, referenceId, referenceType, isValidated',
            expenseClaims: 'id, userId, status, date',
            auditLogs: 'id, timestamp, userId, action',
            shifts: 'id, userId, date, type, status',
            // Professional Accounting
            accounts: 'id, code, type, class, isActive',
            fiscalPeriods: 'id, startDate, endDate, status',
            bankTransactions: 'id, date, isReconciled',
            // Stock Management
            stockItems: 'id, ingredientId, storageLocationId, category, status, dlc, receptionDate',
            preparations: 'id, name, type, storageLocationId, status, dlc, preparationDate',
            storageLocations: 'id, name, type, zone, isActive',
            temperatureLogs: 'id, storageLocationId, recordedAt, isCompliant',
            inventoryMovements: 'id, type, ingredientId, performedAt, performedBy'
        });

        // Debug database events


        this.on('blocked', () => {
            console.warn('⚠️ Database is blocked. Please close other tabs.');
        });

        this.on('versionchange', () => {
            // Using logger for consistent, prefixed output
            if (typeof window !== 'undefined') {
                window.location.reload();
            }
        });
    }

    async init() {
        try {
            if (!this.isOpen()) {
                await this.open();
            }
        } catch (err) {
            console.error('❌ Failed to open database:', err);
            throw err;
        }
    }
}

export const db = new RestaurantDB();
