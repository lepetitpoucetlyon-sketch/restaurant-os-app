# Restaurant OS - Architecture

Vue d'ensemble de l'architecture technique du projet.

---

## 🏗️ Stack Technique

| Catégorie | Technologie |
|-----------|-------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Animations** | Framer Motion |
| **State Management** | React Context + useState |
| **Base de données locale** | Dexie.js (IndexedDB) |
| **Icons** | Lucide React |
| **Charts** | Recharts, D3.js |
| **PDF** | jsPDF |
| **Canvas** | Konva (floor plan) |

---

## 📁 Structure du Projet

```
restaurant-os-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Layout racine
│   │   ├── page.tsx            # Page d'accueil (Dashboard)
│   │   ├── reservations/       # Module Réservations
│   │   ├── pos/                # Module Point de Vente
│   │   ├── planning/           # Module Planning
│   │   ├── inventory/          # Module Inventaire
│   │   ├── staff/              # Module RH
│   │   ├── accounting/         # Module Comptabilité
│   │   └── settings/           # Paramètres
│   │
│   ├── components/
│   │   ├── ui/                 # Composants UI atomiques
│   │   │   ├── PremiumCard.tsx
│   │   │   ├── SearchInput.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── index.ts
│   │   ├── layout/             # Composants de structure
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── PageLayout.tsx
│   │   │   └── index.ts
│   │   ├── reservations/       # Composants domaine
│   │   ├── pos/
│   │   ├── planning/
│   │   └── ...
│   │
│   ├── context/                # React Contexts
│   │   ├── AuthContext.tsx
│   │   ├── TablesContext.tsx
│   │   ├── OrdersContext.tsx
│   │   ├── ReservationsContext.tsx
│   │   └── SettingsContext.tsx
│   │
│   ├── hooks/                  # Custom hooks
│   │   ├── useIsMobile.ts
│   │   └── index.ts
│   │
│   ├── lib/                    # Utilitaires
│   │   ├── utils.ts            # Helpers (cn, formatters)
│   │   ├── motion.ts           # Variants Framer Motion
│   │   └── db.ts               # Configuration Dexie
│   │
│   └── types/                  # Types TypeScript
│       ├── auth.types.ts
│       ├── orders.types.ts
│       ├── reservations.types.ts
│       ├── inventory.types.ts
│       ├── accounting.types.ts
│       ├── staff.types.ts
│       └── index.ts            # Barrel export
│
├── docs/                       # Documentation
│   ├── COMPONENT_LIBRARY.md
│   ├── CODING_STANDARDS.md
│   └── ARCHITECTURE.md
│
└── public/                     # Assets statiques
```

---

## 🔄 Flow de Données

### Architecture des Contexts

```
┌─────────────────────────────────────────────────────────────┐
│                      RootLayout                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                   AuthProvider                           ││
│  │  ┌─────────────────────────────────────────────────────┐││
│  │  │                SettingsProvider                      │││
│  │  │  ┌─────────────────────────────────────────────────┐│││
│  │  │  │              TablesProvider                      ││││
│  │  │  │  ┌─────────────────────────────────────────────┐││││
│  │  │  │  │             OrdersProvider                   │││││
│  │  │  │  │  ┌─────────────────────────────────────────┐│││││
│  │  │  │  │  │       ReservationsProvider              ││││││
│  │  │  │  │  │  ┌─────────────────────────────────────┐│││││││
│  │  │  │  │  │  │              UIProvider             ││││││││
│  │  │  │  │  │  │         (Modal, Toast, etc)         ││││││││
│  │  │  │  │  │  │  ┌─────────────────────────────────┐│││││││││
│  │  │  │  │  │  │  │           App Content           ││││││││││
│  │  │  │  │  │  │  └─────────────────────────────────┘│││││││││
│  │  │  │  │  │  └─────────────────────────────────────┘││││││││
│  │  │  │  │  └─────────────────────────────────────────┘│││││││
│  │  │  │  └─────────────────────────────────────────────┘││││││
│  │  │  └─────────────────────────────────────────────────┘│││││
│  │  └─────────────────────────────────────────────────────┘││││
│  └─────────────────────────────────────────────────────────┘│││
└─────────────────────────────────────────────────────────────┘
```

### Flow des Données

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   UI Event   │────▶│   Context    │────▶│  IndexedDB   │
│  (onClick)   │     │  (dispatch)  │     │   (Dexie)    │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │   Re-render  │
                     │  Components  │
                     └──────────────┘
```

---

## 🎨 Système de Design

### Tokens CSS

```css
/* Définis dans globals.css via @theme */

/* Couleurs */
--color-bg-primary      /* Fond principal */
--color-bg-secondary    /* Fond secondaire */
--color-bg-tertiary     /* Fond tertiaire */
--color-text-primary    /* Texte principal */
--color-text-secondary  /* Texte secondaire */
--color-text-muted      /* Texte atténué */
--color-accent          /* Couleur d'accent (Or #C5A059) */
--color-border          /* Bordures */

/* Automatiquement inversés en dark mode */
```

### Classes Tailwind Sémantiques

```tsx
// Au lieu de:
<div className="bg-white dark:bg-[#0A0A0A] text-black dark:text-white">

// Utiliser:
<div className="bg-bg-primary text-text-primary">
```

### Hiérarchie Typographique

| Élément | Classes |
|---------|---------|
| H1 (Hero) | `text-4xl font-serif font-bold` |
| H2 (Section) | `text-2xl font-serif font-bold` |
| H3 (Card) | `text-xl font-serif font-medium italic` |
| Body | `text-sm text-text-primary` |
| Label | `text-[10px] font-black uppercase tracking-[0.2em]` |
| Micro | `text-[8px] font-black uppercase tracking-[0.3em]` |

---

## 📦 Modules Applicatifs

### Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                         RESTAURANT OS                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │   POS    │  │ Réserva- │  │ Planning │  │Inventaire│        │
│  │          │  │  tions   │  │          │  │          │        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
│       │             │             │             │               │
│       └─────────────┼─────────────┼─────────────┘               │
│                     │             │                              │
│              ┌──────┴─────┐ ┌────┴────┐                         │
│              │   Tables   │ │  Staff  │                         │
│              │  (Konva)   │ │   (HR)  │                         │
│              └────────────┘ └─────────┘                         │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │Comptabi- │  │Analytics │  │  HACCP   │  │Marketing │        │
│  │   lité   │  │          │  │          │  │  Social  │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Dépendances entre Modules

| Module | Dépend de |
|--------|-----------|
| POS | Tables, Orders, Products |
| Réservations | Tables, Customers |
| Planning | Staff |
| Inventaire | Products, Suppliers |
| Comptabilité | Orders, Expenses |
| Analytics | Tous (read-only) |

---

## 🔐 Sécurité (Note)

> ⚠️ **État Actuel** : L'authentification est simulée (PIN local).
> 
> Pour une mise en production, implémenter :
> - Backend avec authentification JWT
> - Chiffrement des données sensibles
> - Rate limiting
> - Audit logs

---

## 🚀 Performance

### Optimisations Implémentées

1. **Code Splitting** : Chaque page est chargée dynamiquement
2. **Lazy Loading** : Composants lourds chargés au besoin
3. **IndexedDB** : Données persistées localement
4. **Memoization** : useMemo/useCallback pour calculs coûteux

### Recommandations

```tsx
// Lazy loading de composants lourds
const FloorPlanEditor = dynamic(
    () => import('@/components/floor-plan/Editor'),
    { loading: () => <PageSkeleton /> }
);
```

---

## 📱 Responsive Design

### Breakpoints

| Breakpoint | Largeur | Usage |
|------------|---------|-------|
| Default | < 640px | Mobile |
| `sm` | ≥ 640px | Mobile large |
| `md` | ≥ 768px | Tablet |
| `lg` | ≥ 1024px | Desktop |
| `xl` | ≥ 1280px | Desktop large |
| `2xl` | ≥ 1536px | Ultra-wide |

### Patterns

```tsx
// Navigation
<Sidebar className="hidden lg:flex" />    // Desktop
<MobileNavBar className="lg:hidden" />    // Mobile

// Grilles
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

// Padding
<div className="p-4 md:p-6 lg:p-8">
```
