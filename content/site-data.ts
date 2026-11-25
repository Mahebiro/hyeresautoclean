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
  slogan: "Votre voiture propre, sans bouger de chez vous.",
  zone: "Hyères, Toulon & alentours",
  phone: "06 98 24 92 82",
  phoneHref: "tel:+33698249282",
  email: "hyeresautoclean@gmail.com",
  instagramHandle: "@hyeres_auto_clean",
  instagramUrl: "https://www.instagram.com/hyeres_auto_clean",
  website: "https://hyeresautoclean.com",
  // À COMPLÉTER : horaires d'intervention et frais de déplacement, affichés
  // dans la section Contact et dans l'étape « Date et créneau » de la
  // réservation.
  hours: "[HORAIRES]",
  travelFees: "[FRAIS DE DÉPLACEMENT]",
  // Bouton WhatsApp flottant : numéro au format international, sans « + »,
  // et message prérempli.
  whatsappNumber: "33698249282",
  whatsappMessage: "Bonjour, je souhaite réserver un nettoyage. Voici une photo de mon véhicule :",
};

// --- Communes desservies -------------------------------------------------
// Liste précise utilisée dans la FAQ, la fiche Contact et les données
// structurées (JSON-LD) pour le référencement local. Le champ "zone"
// ci-dessus reste volontairement court pour l'affichage (Hero, pied de page) :
// c'est ici que vous ajoutez ou retirez une commune couverte.
export const serviceCities = [
  "Hyères",
  "Toulon",
  "La Garde",
  "La Crau",
  "La Londe-les-Maures",
  "Pierrefeu-du-Var",
  "Cuers",
];

// --- Formulaire de réservation ------------------------------------------
// Adresse à laquelle les demandes de réservation sont envoyées par email.
export const reservationFormEndpoint = "https://formspree.io/f/xkjnawng";

// --- Formules ----------------------------------------------------------
// "priceFrom" est le prix fixe de la formule, le même pour toutes les
// voitures (on ne demande pas la taille du véhicule). Changez simplement ce
// nombre pour ajuster un tarif : le formulaire de réservation se met à jour
// automatiquement, partout sur le site.

export type FormulaId = "essentiel" | "confort";

export interface Formula {
  id: FormulaId;
  name: string;
  tagline: string;
  priceFrom: number;
  duration: string;
  features: string[];
  // Prestations NON incluses, affichées en évidence (✗) sur la carte.
  excluded?: { label: string; hint?: string }[];
  badge?: string;
}

export const formulas: Formula[] = [
  {
    id: "essentiel",
    name: "Essentiel",
    tagline: "L'entretien courant de votre intérieur, sans les sièges",
    priceFrom: 59,
    duration: "1h15 à 1h30",
    features: [
      "Aspiration complète de l'habitacle",
      "Nettoyage des plastiques",
      "Tapis et moquettes",
      "Vitres intérieures",
      "Coffre",
    ],
    excluded: [
      {
        label: "Nettoyage des sièges non inclus",
        hint: "Pour les sièges, choisissez la formule Confort.",
      },
    ],
  },
  {
    id: "confort",
    name: "Confort",
    tagline: "Le nettoyage complet de l'habitacle, sièges compris",
    priceFrom: 89,
    duration: "2h à 2h30",
    features: ["Tout le contenu de la formule Essentiel", "+ Nettoyage des sièges"],
    badge: "La plus choisie",
  },
];

// --- Suppléments à la carte ------------------------------------------------
// "price" : prix fixe. Pour un prix variable selon l'état du véhicule,
// renseignez aussi "priceMax" (ex : 10 à 20 €) : le site affiche alors une
// fourchette, ajustée sur place.

export interface Addon {
  id: string;
  label: string;
  price: number;
  priceMax?: number;
  description?: string;
  active: boolean;
  // Options d'un même groupe exclusif : en choisir une retire les autres.
  exclusiveGroup?: string;
}

export const addons: Addon[] = [
  {
    id: "vehicule-tres-sale",
    label: "Véhicule très sale",
    price: 10,
    priceMax: 20,
    description: "Selon l'état du véhicule, ajusté sur place",
    active: true,
  },
  {
    id: "poils-animaux",
    label: "Poils d'animaux",
    price: 15,
    active: true,
  },
  {
    id: "protection-plastiques",
    label: "Traitement protection plastiques",
    price: 5,
    active: true,
  },
  {
    id: "ceramique-cuir",
    label: "Traitement céramique cuir",
    price: 5,
    active: true,
  },
];

/** Prix d'un supplément pour l'affichage : « 15 € » ou « 10 à 20 € ». */
export function formatAddonPrice(addon: Pick<Addon, "price" | "priceMax">) {
  return addon.priceMax ? `${addon.price} à ${addon.priceMax} €` : `${addon.price} €`;
}

// --- Pourquoi nous ----------------------------------------------------------

export const whyUs = [
  {
    title: "À domicile",
    description: "Pas besoin de vous déplacer, je viens directement jusqu'à vous.",
  },
  {
    title: "Rapide",
    description: "Comptez 1h15 à 1h30 pour la formule Essentiel, 2h à 2h30 pour la formule Confort.",
  },
  {
    title: "Un prix clair",
    description:
      "59 € ou 89 €, quelle que soit la taille de votre voiture. Un éventuel supplément vous est annoncé avant de commencer.",
  },
  {
    title: "Simple à réserver",
    description:
      "Choisissez votre formule et votre créneau directement en ligne.",
  },
];

// --- Storytelling ------------------------------------------------------

export const storytelling = {
  title: "Une jeune entreprise, une vraie envie d'entreprendre.",
  paragraph:
    "Je m'appelle Mahé Biro, j'ai 19 ans et j'ai toujours eu envie d'entreprendre. En mars 2026, j'ai décidé de passer de l'idée à l'action en lançant HYÈRES AUTO CLEAN. J'ai choisi le nettoyage automobile parce que j'aime le travail concret, le contact avec les clients et surtout la satisfaction de voir un véhicule retrouver un intérieur propre et soigné. Aujourd'hui, je développe cette activité localement à Hyères et ses alentours avec une idée simple : proposer un service sérieux, pratique et au prix clair, directement à domicile.",
  author: "Mahé Biro",
};

// --- Comment ça marche -------------------------------------------------

export const steps = [
  {
    number: "01",
    title: "Choisissez votre formule et votre véhicule",
    description: "Renseignez-les directement dans le formulaire de réservation.",
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
// Chaque ligne est une paire avant/après (même voiture, même zone).
// Ajoutez une ligne pour chaque nouvelle paire de photos ; retirez-en une si
// vous ne voulez plus l'afficher.

export const beforeAfterItems = [
  {
    id: "ford-tableau",
    label: "Ford F-150",
    before: "/images/galerie/avant-apres/ford-tableau-avant.webp",
    after: "/images/galerie/avant-apres/ford-tableau-apres.webp",
  },
  {
    id: "bmw-pied",
    label: "BMW",
    before: "/images/galerie/avant-apres/bmw-pied-avant.webp",
    after: "/images/galerie/avant-apres/bmw-pied-apres.webp",
  },
  {
    id: "bmw-boite-gants",
    label: "BMW",
    before: "/images/galerie/avant-apres/bmw-boite-gants-avant.webp",
    after: "/images/galerie/avant-apres/bmw-boite-gants-apres.webp",
  },
];

// --- FAQ ---------------------------------------------------------------

export const faq = [
  {
    question: "Où intervenez-vous ?",
    answer: `J'interviens à domicile à ${serviceCities.join(", ")}, ainsi que dans les communes alentour du Var.`,
  },
  {
    question: "Dois-je fournir quelque chose pour le nettoyage ?",
    answer:
      "Non, je viens avec tout mon matériel. Il vous suffit de me donner accès à votre véhicule au créneau convenu.",
  },
  {
    question: "Combien de temps dure une intervention ?",
    answer:
      "Comptez environ 1h15 à 1h30 pour la formule Essentiel et 2h à 2h30 pour la formule Confort. La durée peut varier selon la taille et l'état du véhicule.",
  },
  {
    question: "Puis-je réserver pour quelqu'un d'autre ?",
    answer:
      "Oui, il suffit d'indiquer les bonnes coordonnées et l'adresse d'intervention dans le formulaire de réservation.",
  },
  {
    question: "Quelle formule choisir ?",
    answer:
      "La formule Essentiel (59 €) convient pour un entretien courant : aspiration complète, plastiques, tapis et moquettes, vitres intérieures et coffre, sans les sièges. La formule Confort (89 €) reprend tout le contenu de l'Essentiel et ajoute le nettoyage des sièges.",
  },
  {
    question: "Les sièges sont-ils nettoyés dans la formule Essentiel ?",
    answer: "Non, le nettoyage des sièges est inclus dans la formule Confort.",
  },
  {
    question: "Le prix est-il le même pour toutes les voitures ?",
    answer:
      "Oui, le prix est fixe : 59 € pour la formule Essentiel et 89 € pour la formule Confort, quelle que soit la taille de votre voiture. Des suppléments peuvent s'ajouter (véhicule très sale, poils d'animaux, traitements des plastiques ou du cuir).",
  },
  {
    question: "Que se passe-t-il si mon véhicule est très sale ?",
    answer:
      "Un supplément de 10 à 20 € peut s'appliquer selon l'état du véhicule ; je vous préviens avant de commencer. Vous pouvez m'envoyer une photo sur WhatsApp pour avoir une estimation.",
  },
  {
    question: "Le résultat sera-t-il comme neuf ?",
    answer:
      "Je propose un nettoyage complet pour un intérieur propre et agréable. Les taches incrustées ou la rénovation (detailing) ne sont pas incluses.",
  },
  {
    question: "Comment fonctionne la réservation ?",
    answer:
      "Vous complétez le formulaire de réservation avec votre formule, votre véhicule et vos coordonnées. Je vous recontacte ensuite pour confirmer le créneau.",
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
  title: "Nettoyage Auto Hyères & Toulon à Domicile | Hyères Auto Clean",
  titleTemplate: "%s | HYÈRES AUTO CLEAN",
  // Titre des aperçus de partage (Facebook, WhatsApp, X…).
  ogTitle: "Hyères Auto Clean — Nettoyage intérieur auto à domicile, formules à 59 € et 89 €",
  description:
    "Nettoyage intérieur automobile à domicile à Hyères, Toulon et dans le Var. Formule Essentiel 59 €, formule Confort 89 € (sièges inclus). Je me déplace chez vous, prix clair, réservation en ligne.",
};
