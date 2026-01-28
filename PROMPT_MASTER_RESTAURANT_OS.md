# RESTAURANT OS - MASTER PRODUCT REQUIREMENT DOCUMENT (PRD)
**Version:** 2.0 (Ultimate)
**Status:** In Development
**Vision:** Créer l'OS de gestion de restaurant le plus beau, fluide et intelligent au monde.

---

## 1. ARCHITECTURE GLOBALE & STACK TECHNIQUE

### **Stack**
*   **Core:** Next.js (App Router), TypeScript, React 19.
*   **Styling:** Tailwind CSS (v4 si possible, sinon v3), Framer Motion (Animations complexes), Lucide React (Icônes).
*   **State Management:** React Context + Hooks personnalisés (pas de Redux).
*   **Database (Local/Low-code):** Dexie.js (IndexedDB wrapper) pour la persistence client-side rapide, simulation d'API.
*   **Internationalisation (i18n):** Système custom (`LanguageContext`, `translations.ts`) supportant FR, EN, ES, PT, JA.

### **Design System (The "Restaurant OS" Feel)**
*   **Philosophie:** "Luxe Minimaliste & Fonctionnalité Absolue".
*   **Thème:** Dark Mode par défaut (élégant pour les cuisines et salles tamisées) + Light Mode (Glassmorphism).
*   **Composants Clés:**
    *   *Glass Cards:* Transparence, flou d'arrière-plan (`backdrop-blur-md`), bordures subtiles (`border-white/10`).
    *   *Micro-Interactions:* Feedback tactile à chaque clic (scale, glow).
    *   *Typographie:* Serif (Titres élégants) + Sans-Serif (Data/UI lisible).

---

## 2. MODULE : LANDING PAGE (MARKETING SITE)
**Objectif:** Vendre le Restaurant OS comme un logiciel SaaS premium.

### **Fonctionnalités & Sections**
*   **Hero Section Immersive:**
    *   Vidéo de fond ou animation 3D subtile de l'interface.
    *   Headline: "L'Intelligence Exécutive pour Restaurateurs Visionnaires".
    *   CTA: "Demander une Démonstration" (Glow effect).
*   **Showcase Interactif:**
    *   Carrousel 3D ou onglets montrant : Cuisine, Salle, Finance, RH.
    *   Au survol, l'interface simulée réagit.
*   **Preuve Sociale & Trust:**
    *   Logos de restaurants étoilés fictifs ou réels.
    *   Témoignages (Design type "carte de visite").
*   **Pricing (Tarification):**
    *   3 Tiers : "Essential", "Professional" (Populaire), "Enterprise".
    *   Comparator table (Checklist features).
*   **Footer:**
    *   Liens légaux, Newsletter, Réseaux sociaux.

### **Prompt Intégré (Pour implémentation)**
```markdown
Agis comme un Expert Frontend et Designer Awwwards.
Crée la Landing Page pour "Restaurant OS" dans `src/app/landing/page.tsx`.
Design:
- Utilise un fond noir profond (#0a0a0a) avec des dégradés radiaux subtils (spotlights).
- Typography: Titres en police Serif élégante (Playfair Display ou similaire), Texte en Inter.
- Hero: H1 centré, énorme, blanc pur. Sous-titre gris argenté. 2 Boutons CTA (Primary Glass, Secondary Outline).
- Feature Grid: Bento Grid layout (inspiré d'Apple/Linear). Chaque case montre un screenshot partiel de l'app avec un effet de tilt au survol (Framer Motion).
- Tech: Next.js, Tailwind, Framer Motion.
- Contenu: Invente un copywritting persuasif, orienté "Luxe & Performance".
```

### **Checklist QA**
- [ ] Le responsive est parfait sur Mobile (Stack vertical) et Desktop.
- [ ] Les animations ne ralentissent pas le scroll (pas de Layout Shift).
- [ ] Les formulaires de contact (Demo) ont une validation client-side.
- [ ] SEO : Meta tags présents (Title, Description, OG Images).

---

## 3. MODULE : GESTION CUISINE & RECETTES (DÉTAILLÉ)
**Objectif:** Centraliser le savoir-faire et optimiser la production (KDS).

### **Fonctionnalités Avancées**
*   **Livre de Recettes Numérique 2.0:**
    *   Support Images HD (Unsplash/Upload).
    *   Calcul coût matière en temps réel (Lien avec Stock).
    *   Mode "Cuisine" (Step-by-step grand écran, timers intégrés).
    *   Gestion des variantes (Sans Gluten, Végan).
*   **KDS (Kitchen Display System):**
    *   Tri des tickets par poste (Froid, Chaud, Pâtisserie).
    *   Codes couleurs temps d'attente (Vert > Orange > Rouge).
    *   Alertes sonores ou visuelles pour les modifications.
*   **Mise en Place (Prep Sheets):**
    *   Génération automatique des quantités à produire selon les réservations prévues.
    *   Checklists interactives pour chaque chef de partie.

### **Prompt Intégré**
```markdown
Agis comme un Lead Dev Fullstack. Améliore le module `src/app/kitchen`.
Tâches:
1. Implémente le mode "Step-by-Step" pour une recette : une vue plein écran avec slider pour passer d'une étape à l'autre.
2. Ajoute un calcul dynamique de la marge : Si je change le prix d'un ingrédient dans le contexte, la marge de la recette se met à jour.
3. Crée le composant `KDSView` : un tableau Kanban (À faire, En cours, Prêt) avec Drag & Drop (dnd-kit ou framer-motion reorder).
4. UX: Ajoute des sons subtils (bruit de validation) lors du check d'une tâche de mise en place.
```

### **Checklist QA**
- [ ] Les images des recettes se chargent avec un placeholder/blur.
- [ ] Le calcul du coût matière est juste au centime près.
- [ ] Le mode "Plein écran" empêche la mise en veille de l'écran (Wake Lock API).

---

## 4. MODULE : STOCKS & INVENTAIRE (INTELLIGENT)
**Objectif:** Zéro rupture, zéro gaspillage (-20% food cost).

### **Fonctionnalités Avancées**
*   **Inventaire Mobile First:**
    *   Mode "Scan" (Caméra ou Douchette Bluetooth).
    *   Saisie rapide par swipe (Gestionnaire type Tinder pour validation).
*   **Prédictions IA:**
    *   "D'après les réservations de la semaine prochaine, vous manquerez de 5kg de Saumon mardi."
    *   Commande fournisseur suggérée en 1 clic.
*   **Gestion Fournisseurs:**
    *   Annuaire complet (Contacts, Jours de livraison).
    *   Envoi de commandes par Email/PDF généré automatiquement.

### **Prompt Intégré**
```markdown
Agis comme un Data Engineer et UI Developer.
Refond `src/app/inventory` pour inclure l'Intelligence Artificielle.
1. Crée un composant `StockPredictionCard` qui analyse l'historique (mocké) et les réservations futures pour suggérer une commande.
2. Implémente la vue "Commande Fournisseur" : Un panier qui regroupe les articles par fournisseur automatiquement.
3. Ajoute un bouton "Générer Bon de Commande" qui crée un PDF (via `react-pdf` ou simple print CSS) propre et professionnel.
```

### **Checklist QA**
- [ ] La conversion des unités (g -> kg) est gérée sans erreur.
- [ ] Les alertes "Stock Critique" apparaissent bien sur le Dashboard principal.
- [ ] La liste des fournisseurs est triable par catégorie de produits.

---

## 5. MODULE : RH & PLANIFICATION (SOCIAL)
**Objectif:** Gérer les humains aussi bien que les produits.

### **Fonctionnalités Avancées**
*   **Planning Intelligent:**
    *   Vue Calendrier (Semaine/Mois).
    *   Drag & Drop des shifts.
    *   Alerte légale (pas plus de X heures/semaine).
*   **Gestion des Congés & Absences:**
    *   Workflow : Demande employé -> Notif Manager -> Validation/Refus.
    *   Compteur de jours restants.
*   **Dossier Staff:**
    *   Contrats, Avenants, Fiches de paie (PDF viewer).
    *   Performance (Note moyenne des tips/service).

### **Prompt Intégré**
```markdown
Agis comme un Développeur RH/SaaS.
Crée le module `src/app/hr` ou `src/app/team`.
1. Implémente un calendrier de planning (type FullCalendar custom ou react-big-calendar sytlé).
2. Crée un formulaire "Demande de Congés" stylé (Date range picker, Type de congé, Motif).
3. Ajoute une logique de validation : Le manager voit une liste de demandes en attente avec boutons "Approuver" (Vert) / "Refuser" (Rouge).
4. UX: Utilise des avatars (photos de profil) partout pour humaniser l'interface.
```

### **Checklist QA**
- [ ] Impossible de planifier un employé sur une plage où il a un congé validé.
- [ ] Les compteurs de congés se décrémentent correctement.
- [ ] Confidentialité : Un employé ne voit pas les salaires des autres.

---

## 6. MODULE : FINANCE & DEVIS (ERP)
**Objectif:** Pilotage financier chirurgical.

### **Fonctionnalités Avancées**
*   **Générateur de Devis (Traiteur/Groupes):**
    *   Sélection des recettes existantes -> Calcul coût -> Ajout marge -> Prix final.
    *   Export PDF élégant.
*   **Dashboard Financier:**
    *   P&L (Produits & Charges) en temps réel.
    *   Cash Flow prévisionnel.
    *   Objectifs (Jauges visuelles).

### **Prompt Intégré**
```markdown
Agis comme un Expert Fintech.
Développe `src/app/finance` et `src/app/quotes`.
1. Crée un éditeur de Devis WYSIWYG : Je glisse des "Blocs" (Entrées, Plats, Boissons) et le total se calcule.
2. Le devis doit avoir un statut (Brouillon, Envoyé, Signé, Acompté).
3. Sur le Dashboard Finance, ajoute un graph "Break-even point" (Point mort) interactif.
```

### **Checklist QA**
- [ ] Les calculs de TVA sont exacts (5.5%, 10%, 20%).
- [ ] Les devis générés ont bien les mentions légales obligatoires.
- [ ] Les graphiques (Recharts/Chart.js) sont interactifs (tooltip au survol).

---

## 7. MODULE : QUALITÉ & HACCP (RÉGLEMENTAIRE)
**Objectif:** Conformité hygiène absolue sans papier.

### **Comparatif & Features**
*   **Relevés de Température:**
    *   Grille rapide (Frigo 1, Congèl 2, etc.).
    *   Photo obligatoire si anomalie.
*   **Nettoyage:**
    *   Plan de nettoyage digitalisé.
    *   Signature sur écran (Canvas).
*   **Traçabilité:**
    *   Scan des étiquettes produits (OCR ou Code barre) lors de la réception.

### **Prompt Intégré**
```markdown
Agis comme un Ingénieur Qualité.
Développe `src/app/quality`.
1. Crée une interface mobile-first pour les relevés de température (gros boutons, sliders pour la température).
2. Ajoute un module "Signature" : Zone de dessin pour signer les contrôles de nettoyage.
3. Stocke les relevés dans Dexie.js avec un Timestamp inaltérable.
```

### **Checklist QA**
- [ ] Les alertes sanitaires bloquent l'utilisation si non résolues.
- [ ] L'historique est exportable en PDF pour inspection sanitaire.

---

## 8. INSTRUCTIONS GÉNÉRALES POUR L'IA (SYSTEM PROMPT)

**Rôle:** Tu es Antigravity, l'architecte du Restaurant OS.
**Style de Code:**
*   Toujours typer strictement (TypeScript strict mode).
*   Séparer la logique (Hooks) de la vue (Components).
*   Utiliser des constantes pour les "Magic Numbers" ou les couleurs.
*   **Sécurité:** Valider toutes les entrées formulaires (Zod).

**Processus de Développement:**
1.  Analyser le `PROMPT_MASTER_RESTAURANT_OS.md`.
2.  Identifier le module demandé.
3.  Vérifier les composants existants pour réutilisation (`Button`, `Card`, `Input`...).
4.  Générer le code en priorisant l'UX (Animations, Feedback).
5.  Vérifier la checklist QA associée.

---
**Fin du Document Maître.**
