// ============================================================================
// AVIS CLIENTS — section « Avis » (juste après « Réalisations »)
// ----------------------------------------------------------------------------
// Pour ajouter un avis : copiez un bloc { ... } ci-dessous et remplacez les
// valeurs. Pour en retirer un : supprimez son bloc.
//
//   texte    : le texte de l'avis, tel que publié par le client
//   prenom   : prénom affiché (et initiale du nom, si vous le souhaitez)
//   ville    : facultatif — mettez null si vous ne la connaissez pas
//   formule  : facultatif — "Essentiel", "Premium" ou null
//   note     : de 1 à 5
//   date     : mois de l'intervention ou de l'avis (texte libre)
//   verifie  : true pour un vrai avis publié par un client. Tant que
//              verifie vaut false, l'avis s'affiche avec un badge « Exemple »
//              (à n'utiliser que pour des tests, jamais en ligne).
//
// La note moyenne affichée en grand est calculée automatiquement.
// ============================================================================

export type FormuleAvis = "Essentiel" | "Premium";

export interface Avis {
  id: string;
  texte: string;
  prenom: string;
  ville: string | null;
  formule: FormuleAvis | null;
  note: 1 | 2 | 3 | 4 | 5;
  source: "Google";
  date: string;
  verifie: boolean;
}

// Lien du bouton « Voir tous les avis sur Google ».
// À REMPLACER par le lien de votre fiche Google (dans Google Maps : votre
// fiche → « Partager » → « Copier le lien »). En attendant, ce lien lance une
// recherche Google Maps sur le nom de l'entreprise.
export const lienAvisGoogle = "https://www.google.com/maps/search/?api=1&query=Hy%C3%A8res%20Auto%20Clean";

export const avis: Avis[] = [
  {
    id: "marilyne",
    texte:
      "L'habitacle de ma voiture était en bien piteux état après la saison estivale : beaucoup de sable, d'épines de pin… tout ce qu'il est fastidieux de nettoyer et d'enlever. Je l'ai retrouvé comme neuf. Je suis très satisfaite de la prestation. Mahé est un jeune homme sérieux et méticuleux. Je recommande !",
    prenom: "Marilyne C.",
    ville: null,
    formule: null,
    note: 4,
    source: "Google",
    date: "Septembre 2026",
    verifie: true,
  },
  {
    id: "julien",
    // Texte coupé dans la capture d'écran fournie : à compléter avec la fin
    // de l'avis publié sur Google (« … très bon rapport qualité-prix et … »).
    texte:
      "Super expérience ! Le travail est vraiment propre et minutieux, ma voiture est ressortie comme neuve. Le service à domicile est un vrai plus, c'est pratique et très professionnel. On voit qu'ils prennent le temps de bien faire les choses et les finitions sont au rendez-vous.",
    prenom: "Julien T.",
    ville: null,
    formule: null,
    note: 5,
    source: "Google",
    date: "Septembre 2026",
    verifie: true,
  },
  {
    id: "aude",
    texte: "Nettoyage de ma voiture impeccable. Jeune homme sérieux et appliqué. Je recommande.",
    prenom: "Aude D.",
    ville: null,
    formule: null,
    note: 5,
    source: "Google",
    date: "Septembre 2026",
    verifie: true,
  },

  // Modèle à copier pour un nouvel avis (À REMPLACER) :
  // {
  //   id: "prenom-unique",
  //   texte: "Le texte de l'avis…",
  //   prenom: "Prénom N.",
  //   ville: "Hyères",
  //   formule: "Premium",
  //   note: 5,
  //   source: "Google",
  //   date: "Octobre 2026",
  //   verifie: true,
  // },
];

/** Note moyenne (une décimale), ou null s'il n'y a aucun avis. */
export function noteMoyenne(liste: Avis[] = avis): number | null {
  if (liste.length === 0) return null;
  const somme = liste.reduce((total, a) => total + a.note, 0);
  return Math.round((somme / liste.length) * 10) / 10;
}
