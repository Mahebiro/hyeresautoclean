// ============================================================================
// FICHIER DE CONTENU CENTRALISÉ — HYÈRES AUTO CLEAN
// ----------------------------------------------------------------------------
// Toutes les informations modifiables du site (textes, prix, formules,
// suppléments, coordonnées, FAQ...) sont regroupées ici.
// Vous pouvez modifier les valeurs ci-dessous sans toucher aux autres
// fichiers du site : le design se met à jour automatiquement.
// Voir le README.md à la racine du projet pour le guide complet.
// ============================================================================

// --- Coordonnées de l'entreprise -------------------------------------------

export const company = {
  name: "HYÈRES AUTO CLEAN",
  activity: "Nettoyage intérieur automobile à domicile",
  slogan: "Chaque détail compte",
  zone: "Hyères & alentours",
  phone: "06 98 24 92 82",
  phoneHref: "tel:+33698249282",
  email: "mahebiro@yahoo.com",
  instagramHandle: "@hyeres_auto_clean",
  instagramUrl: "https://www.instagram.com/hyeres_auto_clean",
  website: "https://hyeresautoclean.com",
};

// --- Formulaire de réservation ------------------------------------------
// Adresse à laquelle les demandes de réservation sont envoyées par email.
export const reservationFormEndpoint = "https://formspree.io/f/xkjnawng";

// --- Formules ----------------------------------------------------------

export type FormulaId = "essentiel" | "premium";

export interface Formula {
  id: FormulaId;
  name: string;
  tagline: string;
  priceFrom: number;
  features: string[];
  badge?: string;
}

export const formulas: Formula[] = [
  {
    id: "essentiel",
    name: "Essentiel",
    tagline: "L'entretien courant de votre intérieur",
    priceFrom: 55,
    features: [
      "Aspiration complète de l'habitacle",
      "Traitement des tapis",
      "Nettoyage et traitement des plastiques",
      "Nettoyage des vitres intérieures",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Le nettoyage complet pour retrouver un intérieur impeccable",
    priceFrom: 95,
    features: [
      "Aspiration et traitement approfondi de l'habitacle",
      "Shampouinage des sièges",
      "Nettoyage des plastiques",
      "Nettoyage du coffre",
      "Nettoyage des vitres intérieures",
    ],
    badge: "LA FORMULE LA PLUS COMPLÈTE",
  },
];

// --- Tailles de véhicule -------------------------------------------------

export type SizeId = "citadine" | "berline" | "suv";

export interface VehicleSize {
  id: SizeId;
  label: string;
  examples: string;
}

export const vehicleSizes: VehicleSize[] = [
  { id: "citadine", label: "Citadine", examples: "Clio, 208, Polo…" },
  { id: "berline", label: "Berline / Break", examples: "308, Mégane, A3 Break…" },
  { id: "suv", label: "SUV", examples: "Duster, Tiguan, monospaces…" },
];

// --- Grille tarifaire ------------------------------------------------------
// Prix (en euros) pour chaque combinaison formule × taille de véhicule.
// Règle actuelle : +10 € entre Citadine et Berline/Break, +10 € entre
// Berline/Break et SUV (cumulatif). Vous pouvez changer chaque valeur
// individuellement si besoin.

export const pricingGrid: Record<FormulaId, Record<SizeId, number>> = {
  essentiel: { citadine: 55, berline: 65, suv: 75 },
  premium: { citadine: 95, berline: 105, suv: 115 },
};

// --- Suppléments à la carte ------------------------------------------------
// Mettez "active: true" pour afficher un supplément sur le site (dans le
// simulateur et le formulaire de réservation), ou "active: false" pour le
// masquer sans le supprimer. Vous pouvez ajouter de nouvelles lignes suivant
// le même modèle.

export interface Addon {
  id: string;
  label: string;
  price: number;
  active: boolean;
}

export const addons: Addon[] = [
  {
    id: "poils-habitacle-coffre",
    label: "Poils d'animaux — habitacle + coffre",
    price: 25,
    active: true,
  },
  {
    id: "poils-habitacle",
    label: "Poils d'animaux — habitacle uniquement",
    price: 15,
    active: true,
  },
  {
    id: "vitres-exterieures",
    label: "Vitres extérieures",
    price: 10,
    active: true,
  },
  // Suppléments proposés mais pas encore confirmés : passez "active" à
  // true dès que vous avez validé le prix pour les activer sur le site.
  {
    id: "sable-terre",
    label: "Sable / terre incrustée",
    price: 20,
    active: false,
  },
  {
    id: "desodorisation",
    label: "Désodorisation / traitement anti-odeurs",
    price: 10,
    active: false,
  },
  {
    id: "desinfection",
    label: "Désinfection habitacle (ozone ou vapeur)",
    price: 20,
    active: false,
  },
  {
    id: "cuir",
    label: "Protection / entretien cuir",
    price: 15,
    active: false,
  },
];

// --- Pourquoi nous ----------------------------------------------------------

export const whyUs = [
  {
    title: "À domicile",
    description: "Pas besoin de vous déplacer, je viens directement jusqu'à vous.",
  },
  {
    title: "Un travail minutieux",
    description: "Chaque intervention est réalisée avec attention, du sol au coffre.",
  },
  {
    title: "Une attention portée aux détails",
    description:
      "L'objectif n'est pas simplement de nettoyer, mais de retrouver un intérieur propre et agréable.",
  },
  {
    title: "Simple à réserver",
    description:
      "Choisissez votre formule, votre taille de véhicule et votre créneau directement en ligne.",
  },
];

// --- Storytelling ------------------------------------------------------

export const storytelling = {
  title: "Une jeune entreprise, une vraie envie d'entreprendre.",
  paragraph:
    "Je m'appelle Mahé Biro, j'ai 19 ans et j'ai toujours eu envie d'entreprendre. En mars 2026, j'ai décidé de passer de l'idée à l'action en lançant HYÈRES AUTO CLEAN. J'ai choisi le nettoyage automobile parce que j'aime le travail concret, le contact avec les clients et surtout la satisfaction de voir un véhicule retrouver un intérieur propre et soigné. Aujourd'hui, je développe cette activité localement à Hyères et ses alentours avec une idée simple : proposer un service sérieux, pratique et réalisé avec attention, directement à domicile. Chaque détail compte.",
  author: "Mahé Biro",
};

// --- Comment ça marche -------------------------------------------------

export const steps = [
  {
    number: "01",
    title: "Choisissez votre formule et votre véhicule",
    description: "Utilisez le simulateur pour connaître le prix exact.",
  },
  {
    number: "02",
    title: "Choisissez votre créneau",
    description: "Réservez directement votre intervention.",
  },
  {
    number: "03",
    title: "Je viens à votre domicile",
    description: "Votre véhicule est nettoyé directement chez vous.",
  },
];

// --- Galerie / réalisations ----------------------------------------------
// Simples photos en attendant d'avoir assez de contenu pour un format
// "avant / après". Ajoutez une ligne par photo (chemin + légende) ; vous
// pourrez remettre un format avant/après plus tard si vous le souhaitez.

export const galleryItems = [
  {
    id: "1",
    image: "/images/galerie/citroen-c1-interieur.jpg",
    label: "Citroën C1",
  },
  {
    id: "2",
    image: "/images/galerie/mercedes-classe-a-interieur.jpg",
    label: "Mercedes Classe A",
  },
];

// --- FAQ ---------------------------------------------------------------

export const faq = [
  {
    question: "Où intervenez-vous ?",
    answer: "J'interviens à Hyères et dans les communes alentour.",
  },
  {
    question: "Dois-je fournir quelque chose pour le nettoyage ?",
    answer:
      "Non, je viens avec tout mon matériel. Il vous suffit de me donner accès à votre véhicule au créneau convenu.",
  },
  {
    question: "Combien de temps dure une intervention ?",
    answer:
      "La durée dépend de la taille du véhicule et de la formule choisie. Je vous communique une estimation précise au moment de la réservation.",
  },
  {
    question: "Puis-je réserver pour quelqu'un d'autre ?",
    answer:
      "Oui, il suffit d'indiquer les bonnes coordonnées et l'adresse d'intervention dans le formulaire de réservation.",
  },
  {
    question: "Quelle formule choisir ?",
    answer:
      "La formule Essentiel convient pour un entretien courant de l'habitacle. La formule Premium est recommandée pour un nettoyage plus complet, avec shampouinage des sièges et nettoyage du coffre.",
  },
  {
    question: "Comment est calculé le prix selon la taille du véhicule ?",
    answer:
      "Le prix augmente selon la taille du véhicule : citadine, puis berline/break, puis SUV. Utilisez le simulateur pour obtenir un prix exact en quelques clics.",
  },
  {
    question: "Comment fonctionne la réservation ?",
    answer:
      "Vous choisissez votre formule et votre véhicule dans le simulateur, puis vous complétez le formulaire de réservation. Je vous recontacte ensuite pour confirmer le créneau.",
  },
  {
    question: "Faites-vous aussi le nettoyage extérieur ?",
    answer: "Non, je propose uniquement le nettoyage intérieur.",
  },
  {
    question: "Les vitres sont-elles incluses ?",
    answer: "Oui, le nettoyage des vitres intérieures est inclus dans les deux formules.",
  },
];

// --- SEO -----------------------------------------------------------------

export const seo = {
  title: "Nettoyage voiture Hyères — Nettoyage intérieur automobile à domicile",
  titleTemplate: "%s | HYÈRES AUTO CLEAN",
  description:
    "Nettoyage intérieur automobile à domicile à Hyères et ses alentours. Prix instantané avec simulateur, deux formules, vitres intérieures incluses. Chaque détail compte.",
  keywords: [
    "nettoyage voiture Hyères",
    "nettoyage intérieur voiture Hyères",
    "nettoyage automobile à domicile Hyères",
    "nettoyage voiture à domicile Hyères",
  ],
};
