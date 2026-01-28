/**
 * GROUPS & EVENTS TYPES
 */

export type EventType =
    | 'wedding'         // Mariage
    | 'birthday'        // Anniversaire
    | 'corporate'       // Entreprise
    | 'seminar'         // Séminaire
    | 'cocktail'        // Cocktail
    | 'gala'            // Gala
    | 'private_dinner'  // Dîner privé
    | 'product_launch'  // Lancement produit
    | 'press_event'     // Événement presse
    | 'charity'         // Caritatif
    | 'other';

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
    wedding: 'Mariage',
    birthday: 'Anniversaire',
    corporate: 'Entreprise',
    seminar: 'Séminaire',
    cocktail: 'Cocktail',
    gala: 'Gala',
    private_dinner: 'Dîner privé',
    product_launch: 'Lancement produit',
    press_event: 'Événement presse',
    charity: 'Caritatif',
    other: 'Autre'
};

export const EVENT_TYPE_ICONS: Record<EventType, string> = {
    wedding: '💒',
    birthday: '🎂',
    corporate: '🏢',
    seminar: '📊',
    cocktail: '🥂',
    gala: '🎭',
    private_dinner: '🍽️',
    product_launch: '🚀',
    press_event: '📰',
    charity: '❤️',
    other: '📋'
};

export type SpaceConfiguration = 'banquet' | 'cocktail' | 'theater' | 'classroom' | 'u_shape' | 'cabaret';

export interface PrivatizableSpace {
    id: string;
    establishmentId: string;

    name: string;
    description?: string;

    // Capacités par configuration
    capacities: {
        configuration: SpaceConfiguration;
        minGuests: number;
        maxGuests: number;
        isDefault: boolean;
    }[];

    // Équipements
    amenities: string[];
    // Ex: ['Écran', 'Vidéoprojecteur', 'Sonorisation', 'Micro', 'WiFi', 'Climatisation']

    // Tarification
    pricing: {
        type: 'minimum_spend' | 'rental_fee' | 'per_person' | 'package';
        minimumSpend?: number;
        rentalFee?: number;
        perPersonPrice?: number;
        packagePrice?: number;
        weekendSurcharge?: number;
        eveningSurcharge?: number;
    };

    // Horaires disponibilité
    availability: {
        days: number[]; // 0-6
        slots: { start: string; end: string }[];
    };

    // Images
    images: { url: string; alt: string }[];

    isActive: boolean;
}

export type GroupEventStatus =
    | 'inquiry'         // Demande initiale
    | 'quote_pending'   // Devis en attente
    | 'quote_sent'      // Devis envoyé
    | 'confirmed'       // Confirmé
    | 'deposit_paid'    // Acompte versé
    | 'preparation'     // En préparation
    | 'in_progress'     // En cours
    | 'completed'       // Terminé
    | 'invoiced'        // Facturé
    | 'paid'            // Payé
    | 'cancelled';      // Annulé

export const GROUP_EVENT_STATUS_CONFIG: Record<GroupEventStatus, { label: string; color: string; bgColor: string }> = {
    inquiry: { label: 'Demande', color: 'text-slate-600', bgColor: 'bg-slate-100' },
    quote_pending: { label: 'Devis en cours', color: 'text-amber-600', bgColor: 'bg-amber-100' },
    quote_sent: { label: 'Devis envoyé', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    confirmed: { label: 'Confirmé', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
    deposit_paid: { label: 'Acompte versé', color: 'text-green-600', bgColor: 'bg-green-100' },
    preparation: { label: 'Préparation', color: 'text-purple-600', bgColor: 'bg-purple-100' },
    in_progress: { label: 'En cours', color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
    completed: { label: 'Terminé', color: 'text-slate-600', bgColor: 'bg-slate-100' },
    invoiced: { label: 'Facturé', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    paid: { label: 'Payé', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
    cancelled: { label: 'Annulé', color: 'text-red-600', bgColor: 'bg-red-100' }
};

export interface GroupEvent {
    id: string;
    eventNumber: string; // EVT-2026-00045
    establishmentId: string;

    // Type
    type: EventType;
    name: string;
    description?: string;

    // Organisateur
    organizer: {
        type: 'individual' | 'company';
        name: string;
        companyName?: string;
        email: string;
        phone: string;
        address?: {
            street: string;
            city: string;
            postalCode: string;
            country: string;
        };
    };

    // Espace et timing
    spaceId: string;
    spaceName: string;
    configuration: SpaceConfiguration;

    eventDate: string;
    startTime: string;
    endTime: string;

    // Guests
    guests: {
        initial: number;      // À la demande
        confirmed: number;    // Confirmés
        final: number;        // Présents
        minimum: number;      // Minimum facturable
    };

    // Menu et extras
    menu?: {
        type: 'set_menu' | 'buffet' | 'cocktail' | 'custom';
        name?: string;
        pricePerPerson: number;
        items?: string[];
    };

    extras: {
        id: string;
        name: string;
        quantity: number;
        unitPrice: number;
        total: number;
    }[];

    // Dietary requirements
    dietaryRequirements?: {
        vegetarian: number;
        vegan: number;
        glutenFree: number;
        allergies: string[];
        other: string[];
    };

    // Financial
    financial: {
        quoteId?: string;
        quoteNumber?: string;
        quoteTotalTTC?: number;

        depositRequired: number;
        depositPaid: number;
        depositPaidAt?: string;

        extrasDuringEvent: number;

        invoiceId?: string;
        invoiceNumber?: string;
        invoiceTotalTTC?: number;

        finalPaymentDue?: string;
        finalPaymentPaidAt?: string;
    };

    // Staff assignment
    staffing?: {
        manager?: string;
        servers?: string[];
        kitchen?: string[];
        bartenders?: string[];
    };

    // Checklist
    checklist?: {
        id: string;
        task: string;
        assignedTo?: string;
        dueDate?: string;
        completed: boolean;
        completedAt?: string;
        completedBy?: string;
    }[];

    // Documents
    documents: {
        id: string;
        type: 'quote' | 'contract' | 'menu' | 'floor_plan' | 'invoice' | 'other';
        name: string;
        url: string;
        uploadedAt: string;
    }[];

    // Notes
    specialRequests?: string;
    internalNotes?: string;

    // Status
    status: GroupEventStatus;

    // Métadonnées
    createdAt: string;
    createdBy: string;
    updatedAt: string;
}
