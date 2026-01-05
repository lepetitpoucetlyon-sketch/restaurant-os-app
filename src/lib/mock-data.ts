import { Product, Category, Option, OptionGroup, ProductIngredient } from '@/types';

export const CATEGORIES = [
    { id: "antipasti", name: "Antipasti", color: "bg-[#FF9900]" },
    { id: "pizzas", name: "Pizzas", color: "bg-[#00D764]" },
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
        color: "bg-[#00D764]/10",
        image: "pizza_prosciutto",
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
        color: "bg-[#00D764]/10",
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
        image: "carbonara_pasta_studio_premium",
        description: "Authentique recette italienne : guanciale, pecorino, oeuf.",
        optionGroups: [SUPPLEMENTS_OPTIONS]
    },
    {
        id: "pas_2",
        categoryId: "pasta",
        name: "Risotto aux Truffes",
        price: 26.00,
        color: "bg-[#3B82F6]/10",
        image: "risotto_tranches_truffes",
        description: "Riz Carnaroli, truffes fraîches d'été, parmesan 24 mois."
    },

    // Viandes
    {
        id: "via_1",
        categoryId: "viandes",
        name: "Burger Signature",
        price: 22.00,
        color: "bg-[#EF4444]/10",
        image: "burger_signature",
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
        image: "cocktail_spritz",
        description: "Aperol, Prosecco, trait de soda, orange fraîche."
    },

    // Desserts
    {
        id: "des_1",
        categoryId: "desserts",
        name: "Tiramisu Classico",
        price: 9.50,
        color: "bg-[#EC4899]/10",
        image: "tiramisu_glass_premium_studio",
        description: "Mascarpone, biscuits imbibés au café, cacao amer."
    },
];
