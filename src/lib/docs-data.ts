import {
    LayoutGrid,
    Calendar,
    Map,
    Zap,
    ChefHat,
    Heart,
    BrainCircuit,
    Package,
    ClipboardCheck,
    Wine,
    BookOpen,
    CalendarRange,
    BarChart3,
    Instagram,
    Bot,
    Briefcase,
    Settings,
    Users,
    Globe
} from 'lucide-react';


export const CATEGORY_DOCS: Record<string, {
    title: string;
    description: string;
    icon: any;
    color: string;
    isRecipe?: boolean;
    recipe?: {
        name: string;
        description: string;
        image: string;
        prepTime: string;
        difficulty: string;
        ingredients: { name: string; quantity: string }[];
        steps: { order: string; instruction: string; time: string }[];
        allergens: string[];
    };
    details: {
        label: string;
        content: string;
    }[];
    fullTutorial?: {
        title: string;
        icon: string;
        content: string;
        points: string[];
    }[];
}> = {
    'dashboard': {
        title: 'Tableau de Bord Stratégique',
        description: 'Le centre de commandement "Executive Intelligence" offre une vision 360° en temps réel sur la performance globale de votre établissement. Il agrège les données financières, opérationnelles et relationnelles pour une prise de décision éclairée basée sur des données consolidées en temps réel.',
        icon: LayoutGrid,
        color: '#1c3c2d',
        details: [
            { label: 'Indicateurs Clés (KPI)', content: 'Suivi du CA brut, CA net, ticket moyen par couvert et taux d\'occupation dynamique. Comparez vos performances avec N-1.' },
            { label: 'Centre de Notifications', content: 'Alertes critiques sur les stocks bas (Seuils de rupture), les DLC courtes et les arrivées imminentes de vos clients VIP.' },
            { label: 'Analyse Prédictive IA', content: 'Comparaison automatique entre le réalisé du jour et les prévisions générées par l\'IA selon l\'historique et la météo.' },
            { label: 'Flux d\'Activité Live', content: 'Visualisation en direct des commandes en cours, des tables prêtes pour le départ et de l\'état des services de cuisine.' },
            { label: 'Objectifs Stratégiques', content: 'Suivi de progression vers les objectifs de chiffre d\'affaires et de ratio de coût matière définis pour la période.' },
            { label: 'Radar de Performance', content: 'Vue consolidée de l\'efficacité de votre brigade, du temps d\'envoi moyen et de la satisfaction client digitale.' }
        ],
        fullTutorial: [
            {
                title: "Pilotage des Indicateurs Stratégiques",
                icon: "💰",
                content: "Le tableau de bord est votre tour de contrôle. Chaque chiffre est cliquable pour une analyse en profondeur.",
                points: [
                    "Voir le détail du CA → [PATH:/] Cliquez sur la carte 'Chiffre d'Affaires' → Un panneau latéral affiche la ventilation par catégorie.",
                    "Analyser le Ticket Moyen → Cliquez sur la valeur '€/couvert' → Consultez l'évolution sur 7 jours.",
                    "Identifier les goulots → Cliquez sur 'Radar de Performance' → Inspectez les temps moyens par station (Cuisine, Bar)."
                ]
            },
            {
                title: "Intelligence Prédictive & Alertes",
                icon: "🧠",
                content: "L'IA scanne vos données pour anticiper les besoins du service. Voici comment l'exploiter.",
                points: [
                    "Consulter les prévisions → [PATH:/] Cliquez sur l'icône 'Cerveau' en haut à droite → Sélectionnez 'Prévisions du jour'.",
                    "Traiter une alerte stock → Cliquez sur la notification rouge 'Stock Critique' → Puis 'Commander' pour créer un bon fournisseur.",
                    "Préparer l'accueil VIP → Cliquez sur 'Arrivées Attendues' → Icône étoile à côté du nom → Voir préférences client."
                ]
            }
        ]
    },
    'reservations': {
        title: 'Manifeste & Réservations',
        description: 'Un système de conciergerie digitale conçu pour maximiser le taux d\'occupation et fluidifier l\'accueil. Il gère l\'intégralité du cycle de vie du convive, de la demande initiale à son départ, en optimisant chaque mètre carré de votre salle.',
        icon: Calendar,
        color: '#1B4332',
        details: [
            { label: 'Timeline de Service', content: 'Visualisation linéaire des flux arrivants. Glissez-deposez pour modifier les horaires ou changer l\'affectation de table.' },
            { label: 'Attribution Intelligente', content: 'L\'IA suggère automatiquement la meilleure table selon le nombre de couverts, le rang du serveur et les préférences clients.' },
            { label: 'Cyclage des Convives', content: 'Suivi précis des statuts : Attendu, Arrivé, Installé, Mise à feu, Dessert, Addition demandée, Départ.' },
            { label: 'Liste d\'Attente Mobile', content: 'Gestion prioritaire des clients sans réservation avec estimation précise du temps d\'attente envoyée par SMS.' },
            { label: 'No-Show Protection', content: 'Système d\'empreinte bancaire sécurisée et relances automatiques multicanaux pour garantir votre taux de remplissage.' },
            { label: 'Profil de Réservation', content: 'Chaque réservation est liée à un profil CRM riche incluant allergies, habitudes alimentaires et historique de dépenses.' }
        ],
        fullTutorial: [
            {
                title: "Créer & Gérer une Réservation",
                icon: "🗓️",
                content: "Optimisez votre remplissage en maîtrisant le flux de réservations.",
                points: [
                    "Nouvelle réservation → [PATH:/reservations] Cliquez sur '+ Nouvelle Résa' (coin supérieur droit) [CLICK] → Remplissez Nom, Tél, Date, Heure, Couverts → Validez.",
                    "Modifier une résa → Cliquez sur la ligne de réservation dans la liste → Modifiez les champs → 'Enregistrer'.",
                    "Annuler une résa → Cliquez sur la réservation → Bouton 'Annuler' (rouge) en bas du panneau → Confirmez."
                ]
            },
            {
                title: "Accueil & Cyclage Client",
                icon: "🚪",
                content: "Suivez le parcours client depuis l'arrivée jusqu'au départ.",
                points: [
                    "Pointer l'arrivée → Cliquez sur la résa 'Attendue' → Bouton 'Client Arrivé' → Le statut passe à 'Arrivé'.",
                    "Installer à table → Cliquez sur 'Installer' → Sélectionnez la table sur le plan → Confirmez l'installation.",
                    "Marquer le départ → Après paiement, cliquez sur la table → Bouton 'Libérer Table' → La table repasse en 'Libre'."
                ]
            }
        ]
    },
    'floor-plan': {
        title: 'Plan de Salle Interactif',
        description: 'Interface visuelle 1:1 de votre établissement permettant une gestion géographique des services. Le plan de salle communique en temps réel avec le POS et le système de réservations pour une synchronisation totale.',
        icon: Map,
        color: '#C5A059',
        details: [
            { label: 'Visualisation Dynamique', content: 'Code couleur par état de table : Libre, Occupée (Temps de repas), Demandée (Action requise), Réservée (Arrivée imminente).' },
            { label: 'Multi-Zones Premium', content: 'Gestion isolée ou globale de vos espaces : Salon Alpha, Terrasse, Private Lounge ou Bar, avec configuration spécifique par zone.' },
            { label: 'Contrôle Terminal', content: 'Lancez les "suites", demandez l\'addition ou validez un paiement directement depuis la vue plan sur tablette mobile.' },
            { label: 'Modularité de Salle', content: 'Fusionnez ou séparez vos tables virtuellement en un clic pour accueillir de grands groupes tout en conservant la traçabilité.' },
            { label: 'Alertes d\'Inactivité', content: 'Indication visuelle clignotante si une table n\'a reçu aucune interaction (boisson, suite) depuis un délai pré-défini.' },
            { label: 'Statistiques de Zone', content: 'Superposition de données analytiques montrant la rentabilité et le ticket moyen réel par zone géographique de la salle.' }
        ],
        fullTutorial: [
            {
                title: "Navigation & Contrôle Visuel",
                icon: "🗺️",
                content: "Le plan de salle est votre interface de commande principale pour le service.",
                points: [
                    "Voir une table → [PATH:/floor-plan] Cliquez sur n'importe quelle table → Un panneau latéral affiche le statut, la commande en cours et le temps écoulé.",
                    "Changer de zone → Cliquez sur les onglets 'Terrasse', 'Salon', 'Bar' en haut → Seules les tables de cette zone sont affichées.",
                    "Ajouter une table → Bouton '+ Table' (coin supérieur droit) → Choisissez forme et capacité → Placez sur le plan."
                ]
            },
            {
                title: "Actions Rapides en Salle",
                icon: "⚡",
                content: "Exécutez les opérations courantes sans quitter la vue plan.",
                points: [
                    "Fusionner des tables → Maintenez 'Shift' + Cliquez sur 2 tables → Bouton 'Fusionner' → Validez.",
                    "Demander l'addition → Cliquez sur la table → Bouton 'Addition' (icône €) → La table passe en statut 'Paiement'.",
                    "Libérer une table → Après encaissement, cliquez sur la table → 'Libérer' → Elle repasse en vert (Libre)."
                ]
            }
        ]
    },
    'pos': {
        title: 'Point de Vente (POS) Haute Performance',
        description: 'Outil de production conçu pour la vitesse d\'exécution. L\'interface réduit les frictions cognitives pour les serveurs, permettant une concentration totale sur l\'excellence du service et la relation client.',
        icon: Zap,
        color: '#C5A059',
        details: [
            { label: 'Vente Suggestive IA', content: 'L\'IA analyse le panier en temps réel et suggère des accords mets-vins ou des accompagnements à forte marge.' },
            { label: 'Encaissement Agile', content: 'Division de note ultra-rapide par article, par montant exact ou par personne avec calcul automatique des pourboires.' },
            { label: 'Précision Culinaire', content: 'Gestion granulaire des cuissons, modifications d\'ingrédients et demandes "Spéciales Client" avec transmission KDS prioritaire.' },
            { label: 'Paiements Unifiés', content: 'Intégration native des TPE, QR Code à table (Pay-at-table), titres-restaurant dématérialisés et comptes clients VIP.' },
            { label: 'Mode Hors-Ligne', content: 'Technologie de résilience permettant de continuer les ventes même en cas de coupure réseau, avec synchronisation différée.' },
            { label: 'Contrôle des Remises', content: 'Protocole de gestion des pertes, invitations d\'entreprise et gestes commerciaux avec workflow d\'approbation manager.' }
        ],
        fullTutorial: [
            {
                title: "Prise de Commande Efficace",
                icon: "⌨️",
                content: "Le POS est optimisé pour minimiser le nombre de touches nécessaires.",
                points: [
                    "Sélectionner une table → [PATH:/pos] Écran d'accueil POS → Cliquez sur la table dans la grille [CLICK] → L'interface de commande s'ouvre.",
                    "Ajouter un plat → Cliquez sur la catégorie (ex: 'Entrées') → Puis sur le plat souhaité → Il s'ajoute au panier.",
                    "Modifier un plat → Cliquez sur le plat dans le panier → Choisissez cuisson/accompagnement dans le pop-up → Validez."
                ]
            },
            {
                title: "Envoi & Encaissement",
                icon: "💳",
                content: "Finalisez le service avec fluidité.",
                points: [
                    "Envoyer en cuisine → Bouton 'Envoi' (icône toque) en bas du panier → Les plats partent au KDS.",
                    "Diviser l'addition → Bouton 'Diviser' → Sélectionnez les articles par convive → Encaissez chaque part séparément.",
                    "Encaisser → Bouton 'Payer' → Choisissez le mode (CB, Espèces, Titre-resto) → Validez le montant."
                ]
            }
        ]
    },
    'kds': {
        title: 'Cuisine (KDS) & Coordination',
        description: 'La passerelle digitale entre la salle et la cuisine. Le Kitchen Display System organise les bons de commande par priorité chronologique, temps de cuisson et profil client.',
        icon: ChefHat,
        color: '#8B7355',
        details: [
            { label: 'Routage par Station', content: 'Dispatching automatique des articles vers les postes concernés : Saucier, Garde-manger, Pâtisserie ou Passe.' },
            { label: 'Synchronisation des Temps', content: 'Coordination intelligente des plats à temps de cuisson différents pour une sortie de commande simultanée et chaude.' },
            { label: 'Séquençage Chrono', content: 'Affichage clair des étapes du repas : Amuse-bouche, Entrée, Plat, Suite demandée, Fromage, Dessert, Café.' },
            { label: 'Bouclier Allergènes', content: 'Signalétique visuelle agressive et bloquante pour toute modification de recette liée à une allergie critique déclarée.' },
            { label: 'Gestion des "Pieds"', content: 'Suivi des réclamations "Suite en cuisine" (Mise à feu) avec notification sonore pour la brigade.' },
            { label: 'Analytics de Passe', content: 'Rapport détaillé sur les temps moyens de préparation par plat pour identifier les goulots d\'étranglement en cuisine.' }
        ],
        fullTutorial: [
            {
                title: "Gestion des Tickets de Production",
                icon: "👨‍🍳",
                content: "Gérez le flux de production avec précision.",
                points: [
                    "Voir les tickets → [PATH:/kds] Les bons s'affichent automatiquement par ordre d'arrivée → Les plus anciens à gauche.",
                    "Valider un plat → Cliquez sur l'article terminé → Il passe en vert → La salle est notifiée.",
                    "Marquer 'Prêt' → Quand tous les articles sont verts → Bouton 'PRÊT' → Le bon disparaît et passe en livraison."
                ]
            },
            {
                title: "Alertes & Priorités",
                icon: "📢",
                content: "Gérez les urgences et les modifications.",
                points: [
                    "Voir une note client → Icône orange sur l'article → Cliquez dessus → La note s'affiche (ex: 'Sans sel').",
                    "Signaler une rupture → Appuyez longuement sur un plat → 'Rupture' → Il est retiré de la carte en salle.",
                    "Gérer un rappel → Si un plat clignote en rouge → C'est une alerte de temps → Priorisez ce bon."
                ]
            }
        ]
    },
    'kitchen': {
        title: 'Fiche Technique & Standardisation',
        description: 'Standardisation de l\'excellence culinaire et contrôle strict du Food Cost. Centralisez votre patrimoine créatif pour une qualité constante sur chaque assiette.',
        icon: ChefHat,
        color: '#8B7355',
        recipe: {
            name: 'Burrata Crémeuse',
            description: 'Burrata des Pouilles sélectionnée, lit de tomates cerises anciennes confites, pesto basilic maison et crumble de pistaches de Sicile.',
            image: 'https://images.unsplash.com/photo-1594910350538-40624bbdec27?q=80&w=1200&auto=format&fit=crop',
            prepTime: '25 min',
            difficulty: 'moyen',
            ingredients: [
                { name: 'Burrata di Bufala DOP (125g)', quantity: '1 pièce' },
                { name: 'Tomates cerises anciennes', quantity: '150 g' },
                { name: 'Pesto basilic frais maison', quantity: '30 g' },
                { name: 'Huile d\'olive extra vierge Sicile', quantity: '20 ml' },
                { name: 'Vinaigre balsamique de Modène', quantity: '10 ml' },
                { name: 'Pistaches de Sicile concassées', quantity: '15 g' },
                { name: 'Feuilles de basilic frais', quantity: '6 feuilles' },
                { name: 'Fleur de sel de Guérande', quantity: '1 pincée' },
                { name: 'Poivre noir du moulin', quantity: 'QS' },
                { name: 'Pain de campagne (croutons)', quantity: '40 g' }
            ],
            steps: [
                { order: '01', instruction: 'Sortir la burrata du réfrigérateur 20 minutes avant le service pour qu\'elle soit à température ambiante. Vérifier la DLC et l\'intégrité de l\'emballage.', time: '2 MIN' },
                { order: '02', instruction: 'Laver et sécher les tomates cerises. Les couper en deux et les disposer sur une plaque. Assaisonner d\'huile d\'olive, sel et poivre. Passer au four à 180°C pendant 8 minutes pour les confire légèrement.', time: '10 MIN' },
                { order: '03', instruction: 'Réaliser le crumble de pistaches : mixer grossièrement les pistaches et les mélanger avec un filet d\'huile d\'olive. Réserver à température ambiante.', time: '3 MIN' },
                { order: '04', instruction: 'Chauffer l\'assiette de service à 45°C. Étaler le pesto en un cercle irrégulier au centre de l\'assiette chaude à l\'aide d\'une cuillère, en créant un mouvement fluide.', time: '2 MIN' },
                { order: '05', instruction: 'Disposer les tomates cerises confites autour du pesto. Déposer délicatement la burrata au centre. Ouvrir légèrement le dessus de la burrata pour révéler la stracciatella crémeuse.', time: '5 MIN' },
                { order: '06', instruction: 'Finition : Parsemer de pistaches concassées, ajouter les feuilles de basilic, un filet d\'huile d\'olive, une touche de balsamique en cercles et la fleur de sel. Servir immédiatement avec les croutons à côté.', time: '3 MIN' }
            ],
            allergens: ['Lait', 'Gluten', 'Fruits à coque']
        },

        details: [
            { label: 'Codification Recettes', content: 'Fiches techniques avec étapes de préparation, photos de dressage et calcul automatique du Food Cost théorique.' },
            { label: 'Mise en Place Live', content: 'Liste des tâches de préparation par service avec attribution individuelle et suivi de progression numérique.' },
            { label: 'Registre des Pertes', content: 'Saisie simplifiée du gaspillage (Casse, Erreur, Périmé) pour un ajustement précis de la valeur de stock.' },
            { label: 'Calcul des Rendements', content: 'Prise en compte du coefficient de perte lors de la transformation des produits bruts (ex: parage viande).' },
            { label: 'Exemple Pratique', content: 'Consultez la fiche "Burrata Crémeuse" pour voir un exemple de standardisation haute fidélité.' },
            { label: 'Alerte Ratio Marge', content: 'Notification automatique si le prix d\'achat dynamique d\'un ingrédient risque de dégrader la marge cible du plat.' }
        ],
        fullTutorial: [
            {
                title: "Créer & Consulter une Fiche Technique",
                icon: "📖",
                content: "La fiche technique standardise vos recettes pour une qualité constante.",
                points: [
                    "Créer une recette → [PATH:/kitchen] Bouton '+ Nouvelle Recette' → Remplissez Nom, Description, Temps de préparation → Suivant.",
                    "Ajouter des ingrédients → Onglet 'Ingrédients' → Recherchez l'ingrédient → Entrez la quantité → Ajoutez.",
                    "Consulter le Food Cost → Icône '€' à côté de la recette → Le coût théorique s'affiche avec la marge."
                ]
            },
            {
                title: "Mise en Place & Pertes",
                icon: "🔪",
                content: "Gérez la préparation quotidienne et enregistrez les pertes.",
                points: [
                    "Créer une tâche Mise en Place → Bouton '+ Tâche' → Sélectionnez la recette → Assignez un cuisinier → Validez.",
                    "Valider une tâche → Cliquez sur la tâche terminée → Bouton 'Fait' → Elle passe en vert.",
                    "Enregistrer une perte → Menu 'Pertes' → '+ Perte' → Sélectionnez produit, quantité, motif → Enregistrer."
                ]
            }
        ]
    },
    'crm': {
        title: 'CRM Hôtelier & Intelligence Client',
        description: 'Le cœur de votre stratégie de fidélisation. Le CRM stocke et analyse chaque interaction pour recréer une expérience ultra-personnalisée, transformant chaque convive en ambassadeur régulier de votre établissement.',
        icon: Heart,
        color: '#1c3c2d',
        details: [
            { label: 'Fiches Hôtes Riches', content: 'Base de données centralisée incluant identité, anniversaires, préférences de table, allergies et historique de consommations.' },
            { label: 'Segmentation IA', content: 'Tagage automatique des profils : VIP, Critique, Habitué, Client à Risque (Désengagement), ou Presse/Influent.' },
            { label: 'Engagement RFM', content: 'Analyse automatique de la Récence, Fréquence et Montant pour identifier vos clients les plus profitables (Top Spenders).' },
            { label: 'Marketing Prédictif', content: 'Déclenchement d\'e-mails ou SMS de courtoisie pour les événements spéciaux ou après une période d\'inactivité prolongée.' },
            { label: 'Historique des Notes', content: 'Accès aux commentaires confidentiels laissés par les différents maîtres d\'hôtel pour un accueil "Nommé" immédiat.' },
            { label: 'Tracking de Satisfaction', content: 'Agrégation des avis Google/TripAdvisor directement liés à la fiche client pour un suivi qualité individualisé.' }
        ],
        fullTutorial: [
            {
                title: "Gérer les Fiches Clients",
                icon: "🤝",
                content: "Chaque client a un profil riche pour un accueil personnalisé.",
                points: [
                    "Créer un client → [PATH:/crm] Bouton '+ Client' → Remplissez Nom, Prénom, Tél, Email → Onglet 'Préférences' pour allergies/table → Enregistrer.",
                    "Ajouter une note → Ouvrez la fiche client → Onglet 'Notes' → '+ Note' → Tapez votre commentaire → Enregistrer.",
                    "Consulter l'historique → Fiche client → Onglet 'Visites' → Liste des réservations passées avec montants dépensés."
                ]
            },
            {
                title: "Analyse & Marketing",
                icon: "📈",
                content: "Exploitez les données pour fidéliser et réactiver.",
                points: [
                    "Voir le score RFM → Liste clients → Colonne 'Score' → Cliquez sur un client → Détail Récence/Fréquence/Montant.",
                    "Filtrer les VIP → Barre de filtres → Tag 'VIP' → Seuls les clients premium s'affichent.",
                    "Lancer une campagne → Menu 'Marketing' → '+ Campagne' → Sélectionnez segment → Rédigez message → Envoyer."
                ]
            }
        ]
    },
    'intelligence': {
        title: 'Executive Intelligence & Simulations',
        description: 'Le cerveau stratégique du Restaurant OS. Utilisez la puissance de l\'intelligence artificielle pour modéliser le futur de votre établissement et anticiper les fluctuations du marché.',
        icon: BrainCircuit,
        color: '#C5A059',
        details: [
            { label: 'What-If Simulator', content: 'Testez l\'impact d\'une hausse du prix des vins ou d\'une modification de la carte sur votre bénéfice net annuel.' },
            { label: 'Forecast Affluence', content: 'Algorithme prédisant le nombre de couverts à 7 jours selon l\'historique, la météo et les événements locaux.' },
            { label: 'Menu Engineering', content: 'Identification des plats "Stars" et "Chiens" via l\'analyse croisée de la popularité et de la rentabilité (Matrice BCG).' },
            { label: 'Auto-Sentiment Analysis', content: 'L\'IA lit et synthétise tous vos avis digitaux pour vous fournir un rapport mensuel sur les points d\'amélioration.' },
            { label: 'Optimisation Staffing', content: 'Analyse des flux de service pour suggérer le nombre idéal de personnel par station et ainsi réduire la masse salariale.' },
            { label: 'Détection d\'Anomalies', content: 'Surveillance intelligente des opérations de caisse (Offerts, Annulations) pour prévenir la fraude ou les erreurs répétées.' }
        ],
        fullTutorial: [
            {
                title: "Simulateur What-If",
                icon: "🧪",
                content: "Testez vos décisions stratégiques avant de les appliquer.",
                points: [
                    "Lancer une simulation → [PATH:/intelligence] Menu 'Simulations' → '+ Nouveau Scénario' [CLICK] → Choisissez le type (Prix, Carte, Staff).",
                    "Modifier un paramètre → Ajustez le curseur (ex: +10% sur le prix du vin) → Le graphique se met à jour en temps réel.",
                    "Sauvegarder → Bouton 'Enregistrer Scénario' → Donnez un nom → Retrouvez-le dans 'Mes Scénarios'."
                ]
            },
            {
                title: "Prévisions & Menu Engineering",
                icon: "🔮",
                content: "Anticipez l'affluence et optimisez votre carte.",
                points: [
                    "Voir les prévisions → Onglet 'Forecast' → Sélectionnez la semaine → Consultez les couverts prévus par jour.",
                    "Analyser le Menu → Menu 'Engineering' → Graphique Stars/Dogs s'affiche → Cliquez sur un plat pour détails.",
                    "Appliquer une recommandation → Pop-up 'Action Suggérée' → 'Appliquer' → Le changement est programmé."
                ]
            }
        ]
    },
    'inventory': {
        title: 'Stocks & Logistique Supply Chain',
        description: 'Un contrôle militaire sur vos approvisionnements et votre valeur de stock. L\'inventaire est interconnecté avec les ventes pour un suivi théorique vs réel d\'une précision chirurgicale.',
        icon: Package,
        color: '#1B4332',
        details: [
            { label: 'Inventaire Temps Réel', content: 'Décrémentation automatique des ingrédients lors de chaque vente enregistrée au POS via les fiches techniques.' },
            { label: 'Centrale d\'Achat', content: 'Gestion des catalogues fournisseurs, des mercuriales et des conditions tarifaires négociées par groupe.' },
            { label: 'Bons de Commande IA', content: 'Génération assistée des commandes basées sur les seuils critiques et les prévisions de service à venir.' },
            { label: 'Contrôle Réception', content: 'Procédure de validation des BL, scan des températures de livraison et vérification des DLC pour une sécurité totale.' },
            { label: 'Valorisation Comptable', content: 'Calcul automatique de la valeur du stock au PMP (Prix Moyen Pondéré) pour une intégration bilan simplifiée.' },
            { label: 'Lutte contre le Gaspi', content: 'Suivi FEFO (First Expired, First Out) et alertes de péremption pour minimiser drastiquement votre démarque inconnue.' }
        ],
        fullTutorial: [
            {
                title: "Gérer les Stocks & Réceptions",
                icon: "📦",
                content: "Suivez vos entrées et sorties de marchandises.",
                points: [
                    "Voir le stock → [PATH:/inventory] Menu 'Inventaire' → Liste des produits avec quantités → Barre rouge = Stock critique.",
                    "Réceptionner → Bouton 'Réception' → Scannez ou saisissez le BL → Validez les quantités → Enregistrer.",
                    "Créer une commande → '+ Commande Fournisseur' → Sélectionnez articles → Quantités → Envoyez."
                ]
            },
            {
                title: "Alertes & Valorisation",
                icon: "💰",
                content: "Maîtrisez vos alertes et votre valeur de stock.",
                points: [
                    "Configurer une alerte → Fiche produit → Champ 'Seuil Critique' → Entrez la quantité min → Enregistrer.",
                    "Voir les DLC → Onglet 'Expirations' → Liste triée par date → Produits en rouge = à utiliser en priorité.",
                    "Exporter la valeur → Menu 'Rapports' → 'Valorisation Stock' → Choisissez PMP ou FIFO → Télécharger PDF."
                ]
            }
        ]
    },
    'haccp': {
        title: 'Sécurité Alimentaire & HACCP',
        description: 'La garantie d\'une hygiène irréprochable. Ce module digitalise l\'ensemble des registres obligatoires et automatise les relevés sanitaires pour une sérénité totale face aux contrôles.',
        icon: ClipboardCheck,
        color: '#C5A059',
        details: [
            { label: 'IoT Température', content: 'Relevés automatiques 24h/24 des enceintes froides avec alertes immédiates en cas de rupture de la chaîne du froid.' },
            { label: 'Traçabilité Photo', content: 'Numérisation instantanée des étiquettes sanitaires et numéros de lots lors de la réception des marchandises.' },
            { label: 'Plan de Nettoyage (PMS)', content: 'Checklists interactives des protocoles d\'hygiène par station avec validation par signature électronique du responsable.' },
            { label: 'Registre des Huiles', content: 'Suivi des changements d\'huile de friture et contrôles des composés polaires avec archivage des résultats.' },
            { label: 'Dossier d\'Inspection', content: 'Génération en un clic du dossier sanitaire complet prêt pour une présentation aux services vétérinaires (DDPP).' },
            { label: 'Check réception', content: 'Protocole de vérification des températures et de l\'état des colis à l\'arrivée du camion fournisseur.' }
        ],
        fullTutorial: [
            {
                title: "Relevés & Checklists Quotidiennes",
                icon: "🌡️",
                content: "Assurez une traçabilité irréprochable avec des protocoles automatisés.",
                points: [
                    "Voir les températures → [PATH:/haccp] Onglet 'Capteurs' → Graphique temps réel par enceinte → Cliquez pour l'historique.",
                    "Fréquence de contrôle → Définissez l'intervalle (ex: toutes les 4h) dans les paramètres avancés.",
                    "Alerte de dépassement → Configurez les délais d'alerte (Délai Alerte vs Délai Critique) pour une réactivité maximale."
                ]
            },
            {
                title: "Audits & Export Réglementaire",
                icon: "🛡️",
                content: "Préparez vos inspections avec des données certifiées.",
                points: [
                    "Générer le dossier DDPP → Menu 'Rapports' → 'Dossier Sanitaire' → Sélectionnez la période → Télécharger.",
                    "Intégration Capteurs → Activez la synchronisation IoT pour des relevés immuables sans intervention humaine.",
                    "Plan de Conservation → Définissez les seuils de rétention des logs (par défaut 90 jours) pour la conformité légale."
                ]
            }
        ]
    },
    'bar': {
        title: 'Bar, Vins & Sommellerie',
        description: 'Gestion spécialisée des liquides et de la cave. De la mixologie de précision à la gestion des grands crus, assurez une traçabilité et une rentabilité millimétrée.',
        icon: Wine,
        color: '#8B7355',
        details: [
            { label: 'Cave Digitale Live', content: 'Inventaire dynamique des bouteilles avec mise à jour automatique des stocks lors de la commande au bar.' },
            { label: 'Accords Mets-Vins', content: 'Base de données intelligente suggérant le meilleur vin au serveur selon le plat sélectionné par le client.' },
            { label: 'Gestion des Débits', content: 'Suivi des consommations au verre, pesée des fûts ou intégration avec débitmètres pour éviter la démarque inconnue.' },
            { label: 'Mixologie & Coût', content: 'Calcul du "Food Cost" au centilitre pour chaque cocktail création incluant les garnitures et alcools premium.' },
            { label: 'Menu Sommelier', content: 'Option de carte des vins interactive sur tablette pour les clients avec fiches descriptives et terroirs.' },
            { label: 'Sorties de Cave', content: 'Procédure sécurisée de déstockage des bouteilles de prestige avec validation par le sommelier responsable.' }
        ],
        fullTutorial: [
            {
                title: "Gestion de la Cave",
                icon: "🍷",
                content: "Organisez et suivez votre inventaire de vins.",
                points: [
                    "Ajouter une bouteille → [PATH:/bar] Menu 'Cave' → '+ Entrée' → Scannez l'étiquette ou saisissez manuellement → Enregistrer.",
                    "Sortir une bouteille → Fiche du vin → Bouton 'Sortie' → Indiquez la raison (Vente, Casse, Dégustation) → Valider.",
                    "Voir le stock par région → Onglet 'Cave' → Filtres en haut → Sélectionnez 'Bourgogne', 'Bordeaux', etc."
                ]
            },
            {
                title: "Cocktails & Rentabilité Bar",
                icon: "🍸",
                content: "Optimisez vos marges sur la carte boissons.",
                points: [
                    "Créer une fiche cocktail → Menu 'Cocktails' → '+ Nouveau' → Ingrédients + quantités en cl → Le coût se calcule.",
                    "Analyser les ventes → Onglet 'Analytics Bar' → Top 10 des cocktails → Comparez marge vs volume.",
                    "Configurer une promo → Menu 'Happy Hour' → Définissez horaires + remise → Activez → Visible au POS."
                ]
            }
        ]
    },
    'accounting': {
        title: 'Finance & Console Comptable',
        description: 'Transparence financière absolue et conformité fiscale. Le module convertit vos opérations quotidiennes en écritures comptables exploitables par votre direction financière.',
        icon: BookOpen,
        color: '#1c3c2d',
        details: [
            { label: 'Journal de Ventes', content: 'Génération automatique des journaux de recettes et des brouillards comptables exportables en format standard (FEC).' },
            { label: 'Dématérialisation OCR', content: 'Numérisation et extraction automatique des données des factures fournisseurs pour une saisie comptable zéro-papier.' },
            { label: 'Gestion de Trésorerie', content: 'Rapprochement bancaire, suivi des encaissements multi-modes et contrôle des flux de cash en caisse.' },
            { label: 'Reporting P&L Live', content: 'Tableau de bord de rentabilité mensuel (Profits & Pertes) par centre de coût ou par catégorie de produits.' },
            { label: 'Tableaux de Bord TVA', content: 'Calcul automatique de la TVA collectée et déductible par service pour vos déclarations périodiques.' },
            { label: 'Audit & Conformité', content: 'Archivage sécurisé de tous les tickets et documents fiscaux répondant aux exigences anti-fraude (NF525).' }
        ],
        fullTutorial: [
            {
                title: "Suivi Financier Quotidien",
                icon: "🧾",
                content: "Gardez le contrôle sur votre trésorerie.",
                points: [
                    "Voir le journal de caisse → [PATH:/accounting] Menu 'Comptabilité' → 'Journal du Jour' → Détail des encaissements par mode.",
                    "Exporter pour comptable → Bouton 'Export FEC' → Choisissez la période → Téléchargez le fichier.",
                    "Consulter le P&L → Onglet 'Tableau de Bord' → Graphique P&L → Cliquez sur une ligne pour détails."
                ]
            },
            {
                title: "Factures & OCR",
                icon: "📁",
                content: "Digitalisez vos factures fournisseurs.",
                points: [
                    "Scanner une facture → Bouton '+ Facture' → Prenez en photo → L'IA extrait montant, TVA, fournisseur.",
                    "Valider les données → Vérifiez les champs extraits → Corrigez si nécessaire → 'Valider'.",
                    "Voir le rapport TVA → Menu 'Rapports' → 'TVA' → Sélectionnez trimestre → Visualisez collectée vs déductible."
                ]
            }
        ]
    },
    'planning': {
        title: 'Planning & Capital Humain',
        description: 'Optimisation de la masse salariale et épanouissement des équipes. Gérez vos ressources humaines avec agilité, prévision et conformité au droit du travail.',
        icon: CalendarRange,
        color: '#C5A059',
        details: [
            { label: 'Planning Drag & Drop', content: 'Conception ergonomique des shifts par station de travail avec contrôle automatique des repos légaux.' },
            { label: 'Productivité Salaire', content: 'Visualisation immédiate du ratio de masse salariale par rapport au chiffre d\'affaires prévisionnel de la journée.' },
            { label: 'Pointeuse Intelligente', content: 'Enregistrement sécurisé des heures réelles de prise et de fin de poste pour une paie sans aucune contestation.' },
            { label: 'Espace Collaborateur', content: 'Portail mobile pour les employés : consultation de planning, demandes de congés et accès aux documents RH.' },
            { label: 'Variables de Paie', content: 'Compilation automatisée des heures supplémentaires, primes, et absences pour transfert direct au cabinet de paie.' },
            { label: 'Tutoriels d\'Intégration', content: 'Accès direct aux vidéos de formation interne pour accélérer l\'onboarding des nouveaux arrivants.' }
        ],
        fullTutorial: [
            {
                title: "Créer & Modifier le Planning",
                icon: "📅",
                content: "Gérez les shifts de votre équipe.",
                points: [
                    "Ajouter un shift → [PATH:/planning] Cliquez sur une case vide (jour + employé) → Pop-up s'ouvre → Entrez horaires → Enregistrer.",
                    "Modifier un shift → Cliquez sur le shift existant → Modifiez les horaires → Ou glissez-déposez vers un autre jour.",
                    "Dupliquer la semaine → Bouton 'Dupliquer' en haut → Sélectionnez la semaine cible → Validez."
                ]
            },
            {
                title: "Pointage & Congés",
                icon: "👥",
                content: "Suivez les présences et gérez les absences.",
                points: [
                    "Valider un pointage → Menu 'Pointeuse' → Liste des entrées/sorties → Cliquez pour valider ou corriger.",
                    "Traiter une demande de congé → Icône cloche → Section 'Congés' → 'Approuver' ou 'Refuser' → Le planning se met à jour.",
                    "Voir le ratio masse salariale → Bandeau en haut du planning → Pourcentage affiché → Cliquez pour détails par poste."
                ]
            }
        ]
    },
    'analytics': {
        title: 'Business Intelligence & BI',
        description: 'Exploration profonde de vos données opérationnelles. Transformez les millions de points de données de votre restaurant en insights actionnables pour booster votre rentabilité.',
        icon: BarChart3,
        color: '#1c3c2d',
        details: [
            { label: 'Cubes de Données', content: 'Navigation multi-dimensionnelle permettant de filtrer vos ventes par serveur, par heure ou par groupe de produits.' },
            { label: 'Analyse Panier (Basket)', content: 'Détermination des articles les plus souvent achetés ensemble pour optimiser vos menus et vos promotions.' },
            { label: 'Tracking de Rétention', content: 'Mesure du taux de retour de vos clients et identification des cohortes les plus fidèles ou les plus dépensières.' },
            { label: 'Performance Multi-site', content: 'Comparaison en temps réel des performances si vous gérez plusieurs établissements au sein d\'un même groupe.' },
            { label: 'Exports Dynamiques', content: 'Génération de rapports PDF élégants ou exports CSV/Excel pour des analyses complémentaires sur mesure.' },
            { label: 'Suivi de Conversion', content: 'Mesure de l\'efficacité de vos campagnes marketing (Instagram/Ads) sur votre chiffre d\'affaires réel en salle.' }
        ],
        fullTutorial: [
            {
                title: "Explorer les Données de Vente",
                icon: "📊",
                content: "Analysez vos performances en profondeur.",
                points: [
                    "Voir les ventes par catégorie → [PATH:/analytics] Menu 'Analytics' → Onglet 'Ventes' → Sélectionnez la période → Graphique par catégorie.",
                    "Analyser par serveur → Filtre 'Serveur' → Sélectionnez un nom → Comparez CA et ticket moyen.",
                    "Identifier les heures creuses → Onglet 'Heatmap' → Visualisez l'intensité des ventes par heure → Spots foncés = pic."
                ]
            },
            {
                title: "Exporter & Partager",
                icon: "🚀",
                content: "Générez des rapports pour votre direction.",
                points: [
                    "Exporter un rapport → Bouton 'Exporter' → Choisissez PDF ou Excel → Téléchargez.",
                    "Programmer un envoi auto → Menu 'Rapports' → '+ Rapport Programmé' → Fréquence + destinataires → Activez.",
                    "Comparer des périodes → Icône 'Comparer' → Sélectionnez 2 périodes (ex: Sem. actuelle vs N-1) → Graphique comparatif."
                ]
            }
        ]
    },
    'social-marketing': {
        title: 'Marketing & Rayonnement Social',
        description: 'Gérez votre e-réputation et votre présence digitale. Ce module centralise vos réseaux sociaux et vos avis pour une image de marque cohérente et prestigieuse.',
        icon: Instagram,
        color: '#833ab4',
        details: [
            { label: 'Gestionnaire d\'Avis', content: 'Interface unifiée pour répondre aux avis Google, TripAdvisor et Yelp avec des suggestions de réponses par IA.' },
            { label: 'Planificateur Social', content: 'Programmation de vos publications Instagram et Facebook mettant en avant vos plats signatures et vos événements.' },
            { label: 'Analyse Reputation', content: 'Suivi de votre note moyenne et analyse sémantique des commentaires pour identifier les points forts/faibles.' },
            { label: 'Base de données Image', content: 'Photothèque centralisée pour vos équipes marketing incluant les visuels professionnels de vos plats.' },
            { label: 'Campagnes Couponing', content: 'Création de codes promotionnels traçables pour mesurer le ROI exact de vos campagnes publicitaires.' },
            { label: 'Surveille de Concurrence', content: 'Veille automatique sur les prix et les avis de vos concurrents directs dans votre zone géographique.' }
        ],
        fullTutorial: [
            {
                title: "Répondre aux Avis",
                icon: "📸",
                content: "Gérez votre e-réputation efficacement.",
                points: [
                    "Voir les nouveaux avis → [PATH:/social-marketing] Menu 'Avis' → Liste triée par date → Points rouges = non répondus.",
                    "Répondre avec IA → Cliquez sur un avis → Bouton 'Suggestion IA' → Adaptez le texte → Publier.",
                    "Voir l'évolution de la note → Onglet 'Tendance' → Graphique de votre note moyenne → Survolez pour détails."
                ]
            },
            {
                title: "Planifier des Publications",
                icon: "🕵️",
                content: "Programmez votre présence sur les réseaux.",
                points: [
                    "Créer une publication → Menu 'Social' → '+ Post' → Ajoutez image + texte → Sélectionnez date/heure → Programmer.",
                    "Utiliser la photothèque → Lors de la création → Icône 'Bibliothèque' → Sélectionnez un visuel validé.",
                    "Créer un code promo → Menu 'Campagnes' → '+ Code' → Définissez remise + validité → Générez le code traçable."
                ]
            }
        ]
    },
    'ai-referencing': {
        title: 'Référencement IA & SEO Local',
        description: 'Optimisez votre visibilité sur les moteurs de recherche et les assistants vocaux. L\'IA travaille pour que votre restaurant apparaisse toujours en première position.',
        icon: Bot,
        color: '#C5A059',
        details: [
            { label: 'Optimisation GMB', content: 'Mise à jour automatique de votre fiche Google Business Profile avec vos horaires, menus et actualités.' },
            { label: 'SEO Sémantique', content: 'Analyse des mots-clés recherchés par vos clients potentiels pour adapter le contenu de votre menu digital.' },
            { label: 'Local Citations', content: 'Synchronisation de vos coordonnées sur plus de 50 annuaires et guides gastronomiques en ligne.' },
            { label: 'Assistant Vocal Ready', content: 'Formatage de vos données pour être indexé parfaitement par Siri, Alexa et Google Assistant.' },
            { label: 'Tracking de Position', content: 'Rapport hebdomadaire sur votre classement dans les résultats de recherche locaux.' },
            { label: 'Intelligence Menu', content: 'L\'IA réécrit vos descriptions de plats pour maximiser leur indexation et leur pouvoir de conversion.' }
        ],
        fullTutorial: [
            {
                title: "Optimiser Google Business",
                icon: "🌐",
                content: "Dominez les résultats de recherche locaux.",
                points: [
                    "Mettre à jour la fiche → [PATH:/ai-referencing] Menu 'SEO' → 'Google Business' → Modifiez horaires, photos, description → Synchroniser.",
                    "Voir le classement → Onglet 'Positions' → Tableau des mots-clés → Colonne 'Rang' indique votre position.",
                    "Réécrire avec IA → Sélectionnez un plat → Bouton 'Optimiser IA' → Nouvelle description générée → Appliquer."
                ]
            },
            {
                title: "Citations & Assistants Vocaux",
                icon: "🎙️",
                content: "Soyez trouvable partout.",
                points: [
                    "Synchroniser les annuaires → Menu 'Citations' → Vérifiez le statut → 'Mettre à jour' pour corriger les incohérences.",
                    "Tester la recherche vocale → Bouton 'Test Vocal' → Dictez 'Restaurant italien près de moi' → Vérifiez si vous apparaissez.",
                    "Voir le rapport hebdo → Icône enveloppe → Rapport 'Performance SEO' → Ouvrez le PDF ou consultez en ligne."
                ]
            }
        ]
    },
    'seo': {
        title: 'SEO & Référencement',
        description: 'Optimisez la visibilité de votre site web sur les moteurs de recherche. Suivez vos scores, analysez votre trafic et améliorez vos méta-données pour attirer plus de convives.',
        icon: Globe,
        color: '#3B82F6',
        details: [
            { label: 'Score Global', content: 'Évaluation en temps réel de votre santé SEO basée sur plus de 50 critères techniques et sémantiques.' },
            { label: 'Indicateurs de Performance', content: 'Suivi du trafic organique, du taux de clics (CTR) et du nombre de pages indexées.' },
            { label: 'Audit par Page', content: 'Détail précis des optimisations nécessaires pour chaque page de votre établissement (Menu, Réservation, Accueil).' },
            { label: 'Google Business', content: 'Lien direct avec votre fiche établissement pour assurer la cohérence des informations locales.' }
        ],
        fullTutorial: [
            {
                title: "Analyser vos Performances",
                icon: "📈",
                content: "Comprenez comment les clients vous trouvent en ligne.",
                points: [
                    "Vérifier le score global → [PATH:/seo] Regardez la jauge principale → Un score > 80 est excellent. [SELECTOR:#seo-score-gauge]",
                    "Suivre le trafic organique → Examinez la carte 'Trafic Organique' → Identifiez les tendances de recherche. [SELECTOR:#seo-traffic-stat]",
                    "Voir les pages indexées → Carte 'Pages Indexées' → Assurez-vous que tout votre menu est visible. [SELECTOR:#seo-indexed-stat]"
                ]
            },
            {
                title: "Optimiser les Pages",
                icon: "🛠️",
                content: "Améliorez chaque page individuellement.",
                points: [
                    "Identifier les problèmes → Liste des pages → Regardez les badges rouges 'Issue' → Cliquez pour voir le détail. [SELECTOR:#seo-pages-list]",
                    "Modifier les Métas → Cliquez sur l'icône édition d'une page → Ajustez le titre et la description → Valider. [SELECTOR:#seo-edit-page-0]"
                ]
            }
        ]
    },
    'onboarding': {
        title: 'Onboarding & Culture Équipe',
        description: 'Créez une culture d\'excellence dès le premier jour. Le module Onboarding assure une intégration professionnelle et standardisée de chaque nouveau collaborateur.',
        icon: Briefcase,
        color: '#1c3c2d',
        details: [
            { label: 'Parcours de Formation', content: 'Module interactif de bienvenue avec présentation de la vision et des valeurs de l\'établissement.' },
            { label: 'Checklist Prise de Poste', content: 'Guide pas à pas pour les premières heures de travail (Tenue, Casier, Outils, Codes de caisse).' },
            { label: 'Académie Vidéo', content: 'Bibliothèque de micro-learning pour apprendre les procédures signatures (Service au guéridon, Mixologie).' },
            { label: 'Validation Acquis', content: 'Quiz rapides pour valider la connaissance de la carte et des allergènes avant le premier service.' },
            { label: 'Documents Numériques', content: 'Signature dématérialisée du règlement intérieur, des fiches de sécurité et du livret d\'accueil.' },
            { label: 'Lien de Parrainage', content: 'Affectation d\'un "Buddy" (mentor) pour accompagner le nouveau recru durant sa première semaine.' }
        ],
        fullTutorial: [
            {
                title: "Intégrer un Nouveau Collaborateur",
                icon: "🎓",
                content: "Lancez le parcours d'intégration.",
                points: [
                    "Créer un profil → [PATH:/onboarding] Menu 'Staff' → '+ Employé' → Remplissez les infos → Cochez 'Activer Onboarding' → Enregistrer.",
                    "Suivre la progression → Fiche employé → Onglet 'Onboarding' → Barre de progression + tâches restantes.",
                    "Affecter un mentor → Champ 'Buddy' → Sélectionnez un collègue expérimenté → Enregistrer."
                ]
            },
            {
                title: "Quiz & Documents",
                icon: "✅",
                content: "Validez les compétences avant le premier service.",
                points: [
                    "Lancer un quiz → Fiche employé → Onglet 'Formation' → Bouton 'Quiz Allergènes' → L'employé reçoit un lien.",
                    "Faire signer un document → Onglet 'Documents' → Sélectionnez le livret → 'Envoyer pour signature' → Statut 'Signé' apparaît.",
                    "Voir les vidéos → Menu 'Académie' → Liste des tutoriels → Cliquez pour visionner → Marquez 'Vu' quand terminé."
                ]
            }
        ]
    },
    'staff': {
        title: 'Ressources Humaines & Talents',
        description: 'Gérez votre capital humain avec la même précision que vos stocks. Centralisez les carrières, les contrats et le développement des compétences de vos équipes.',
        icon: Users,
        color: '#1c3c2d',
        details: [
            { label: 'Coffre-fort Salarié', content: 'Archivage sécurisé des contrats, pièces d\'identité, diplômes et visites médicales de chaque employé.' },
            { label: 'Suivi des Compétences', content: 'Cartographie des talents (Matrice de polyvalence) pour organiser au mieux vos brigades de service.' },
            { label: 'Entretiens Annuels', content: 'Planification et archivage des entretiens de progrès et de l\'évolution de la rémunération.' },
            { label: 'Alertes Légales RH', content: 'Notifications automatiques pour les renouvellements de contrats ou les fins de périodes d\'essai.' },
            { label: 'Variable de Paie', content: 'Historique des primes, heures sup et avantages en nature pour une transparence totale.' },
            { label: 'Registre du Personnel', content: 'Tenue automatique du registre unique du personnel répondant aux obligations légales.' }
        ],
        fullTutorial: [
            {
                title: "Gérer les Dossiers Employés",
                icon: "📁",
                content: "Centralisez la documentation RH.",
                points: [
                    "Ajouter un document → [PATH:/staff] Fiche employé → Onglet 'Coffre-fort' → '+ Document' → Uploadez le fichier → Catégorisez.",
                    "Voir le registre du personnel → Menu 'RH' → 'Registre' → Liste automatique des employés → Export PDF possible.",
                    "Configurer une alerte → Fiche employé → Champ 'Fin de Contrat' → L'alerte se déclenche 30 jours avant."
                ]
            },
            {
                title: "Compétences & Entretiens",
                icon: "🌟",
                content: "Développez vos talents.",
                points: [
                    "Créer la matrice polyvalence → Menu 'Compétences' → Tableau employés × postes → Cochez les maîtrises → Enregistrer.",
                    "Planifier un entretien → Fiche employé → '+ Entretien' → Date + Objectifs → Le RDV apparaît dans l'agenda.",
                    "Exporter les variables paie → Menu 'Paie' → Sélectionnez la période → 'Exporter' → Fichier prêt pour le cabinet."
                ]
            }
        ]
    },
    'settings': {
        title: 'Configuration Système & Sécurité',
        description: 'Le cerveau technique de votre Restaurant OS. Personnalisez l\'intégralité des modules et gérez les droits d\'accès pour une sécurité maximale.',
        icon: Settings,
        color: '#525252',
        details: [
            { label: 'Matrice de Sécurité', content: 'Double authentification (2FA), timeouts de session automatiques et politique de rétention des logs de sécurité.' },
            { label: 'Gestion Nodale RH', content: 'Configuration des lois du travail (Heures max, OT) et des bonus temporels (Nuits 10-25%, Dimanches 25-100%).' },
            { label: 'Stripe & Webhooks', content: 'Intégration directe des flux de paiement avec synchronisation par Webhooks (Signal Events) haute fidélité.' },
            { label: 'Logistique Delivery', content: 'Configuration nodale du Click & Collect, gestion des zones géographiques et temps de préparation dynamiques.' },
            { label: 'Routage Notifications', content: 'Configuration granulaire des sons globaux, mode Ne Pas Déranger et routage par canal (Push, SMS, Email).' },
            { label: 'Thématisation Elite', content: 'Personnalisation de l\'interface aux couleurs et à l\'identité graphique de votre marque avec persistance Cloud.' }
        ],
        fullTutorial: [
            {
                title: "Sécurité & Contrôle d'Accès",
                icon: "🔐",
                content: "Protégez vos données with des protocoles de niveau bancaire.",
                points: [
                    "Double Authentification (2FA) → [PATH:/settings] Activez le module 'Security' pour exiger une validation TOTP lors de la connexion. [CLICK]",
                    "Gestion des Rôles → Créez un nouveau rôle pour définir des permissions granulaires. [CLICK]",
                    "Rétention des Logs → Paramétrez la durée de conservation des audits (90 jours min. conseillé). [CLICK]"
                ]
            },
            {
                title: "Intégrations & Automatisation",
                icon: "⚙️",
                content: "Connectez votre restaurant au reste du monde digital.",
                points: [
                    "Configuration Stripe → Insérez vos clés API directes et activez le Webhook Secret. [CLICK]",
                    "Législation du Travail → Définissez les plafonds hebdos (35h/45h) et les bonus temporels. [CLICK]",
                    "Click & Collect → Activez le module 'Delivery' pour gérer les zones de livraison. [CLICK]"
                ]
            },
            {
                title: "HACCP & Objectifs Stratégiques",
                icon: "🎯",
                content: "Définissez vos cibles financières et vos protocoles sanitaires.",
                points: [
                    "Cible Chiffre d'Affaires → Fixez votre objectif de recettes journalier pour le calcul des performances. [CLICK]",
                    "Ratio Masse Salariale → Définissez le pourcentage cible du coût personnel (ex: 30%). [CLICK]",
                    "Fréquence Relevés HACCP → Configurez l'intervalle automatique des vérifications de température. [CLICK]",
                    "Délai d'Alerte → Ajustez le temps avant déclenchement d'une notification d'anomalie thermique. [CLICK]"
                ]
            },
            {
                title: "Menu & Recettes",
                icon: "🍳",
                content: "Structurez votre offre culinaire et vos fiches techniques.",
                points: [
                    "Visuels Produits → Activez l'affichage des photos sur les terminaux de commande. [CLICK]",
                    "Mode Tarifaire → Basculez l'affichage des prix entre HT et TTC pour le contrôle de gestion. [CLICK]",
                    "Nouvelle Catégorie → Créez une section 'Desserts' ou 'Vins' pour organiser votre carte. [CLICK]",
                    "Rendement Standard → Définissez le nombre de portions par défaut pour vos fiches techniques. [CLICK]",
                    "Cible Food Cost → Fixez votre objectif de marge brute théorique (ex: 28%). [CLICK]"
                ]
            },
            {
                title: "Stocks & Approvisionnements",
                icon: "📦",
                content: "Automatisez la gestion de vos réserves et commandes.",
                points: [
                    "Alerte Stock Bas → Définissez le seuil de déclenchement des notifications de rupture (ex: 20%). [CLICK]",
                    "Réassort Auto → Autorisez le système à générer des brouillons de commande fournisseurs. [CLICK]",
                    "Fréquence d'Inventaire → Paramétrez le rythme de vos audits de stock (Hebdo recommandé). [CLICK]"
                ]
            },
            {
                title: "POS & Réservations",
                icon: "💳",
                content: "Optimisez l'encaissement et la prise de rendez-vous.",
                points: [
                    "Devise Principale → Sélectionnez l'unité monétaire de votre établissement. [CLICK]",
                    "Mode de Service → Configurez l'interface pour le service à table ou au comptoir. [CLICK]",
                    "Pourboires Digitaux → Activez la suggestion de tips sur le TPE virtuel. [CLICK]",
                    "Délai de Réservation → Imposez un temps minimum avant l'heure du repas (ex: 2h). [CLICK]",
                    "Durée du Créneau → Ajustez la rotation moyenne de vos tables (ex: 90 min). [CLICK]",
                    "Acomptes → Activez le module d'empreinte bancaire pour réduire les No-Shows. [CLICK]"
                ]
            },
            {
                title: "Planning & RH",
                icon: "📅",
                content: "Gérez les emplois du temps et la législation du travail.",
                points: [
                    "Début de Semaine → Alignez le planning sur votre cycle comptable (Lundi/Dimanche). [CLICK]",
                    "Plafond Hebdomadaire → Définissez la durée légale du travail pour les alertes planning. [CLICK]",
                    "Heures Supplémentaires → Activez le tracking des dépassements horaires. [CLICK]"
                ]
            }
        ]
    },
    'general': {
        title: 'Guide Utilisateur & Tutoriels',
        description: 'Bienvenue dans le centre d\'aide Restaurant OS. Accédez à tous les tutoriels, fiches techniques et guides de configuration pour maîtriser votre système.',
        icon: BookOpen,
        color: '#525252',
        details: [
            { label: 'Prise en Main', content: 'Découvrez l\'interface et les concepts clés de navigation.' },
            { label: 'Modules Opérationnels', content: 'Guides pour le POS, KDS, Réservations et Plan de Salle.' },
            { label: 'Gestion & Finance', content: 'Tutoriels sur la comptabilité, les stocks et les analyses de performance.' },
            { label: 'Configuration', content: 'Aide pour le paramétrage de vote établissement et des droits utilisateurs.' }
        ],
        fullTutorial: [
            {
                title: "Navigation Principale",
                icon: "🧭",
                content: "Apprenez à naviguer fluidement dans l'application.",
                points: [
                    "Barre Latérale → Utilisez le menu de gauche pour accéder aux différents modules.",
                    "Recherche Globale → [CMD+K] pour ouvrir la palette de commandes et tout trouver.",
                    "Aide Contextuelle → Cliquez sur le bouton 'Livre' dans le menu pour l'aide de la page active."
                ]
            },
            {
                title: "Premiers Pas",
                icon: "🚀",
                content: "Les actions essentielles pour démarrer la journée.",
                points: [
                    "Ouvrir la Caisse → Module POS → 'Ouvrir Caisse' → Saisir fond de caisse.",
                    "Vérifier les Réservations → Module Réservations → Consulter les arrivées prévues.",
                    "Briefing Équipe → Module Planning → Voir les assignations du jour."
                ]
            }
        ]
    }
};
