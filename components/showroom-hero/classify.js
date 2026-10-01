// Reconnaissance des pièces de la voiture à partir des noms du fichier .glb.
// Partagé entre le navigateur (application des matériaux) et les scripts Node
// (analyse et compression du modèle) : JavaScript pur, sans dépendance.

/** Familles dans l'ordre de priorité (la première reconnue l'emporte). */
export const PART_ORDER = [
  "logos",
  "plates",
  "headlights",
  "taillights",
  "calipers",
  "tires",
  "rims",
  "glass",
  "trim",
  "body",
];

/** Libellés français pour l'affichage de l'analyse. */
export const PART_LABELS = {
  logos: "Logo / badge (masqué)",
  plates: "Plaque (masquée)",
  headlights: "Phares",
  taillights: "Feux arrière",
  calipers: "Étriers de frein",
  tires: "Pneus",
  rims: "Jantes",
  glass: "Vitres",
  body: "Peinture carrosserie",
  trim: "Plastique / carbone",
  keep: "Matériau d'origine",
  unknown: "Non reconnu",
};

/**
 * @param {{ nodeName?: string, meshName?: string, materialName?: string }} names
 * @param {{ parts: Record<string, string>, overrides: Record<string, string> }} modelConfig
 * @returns {string} famille de la pièce, ou "unknown"
 */
export function classifyPart(names, modelConfig) {
  const { nodeName = "", meshName = "", materialName = "" } = names;
  const overrides = modelConfig.overrides || {};
  for (const key of [nodeName, meshName, materialName]) {
    if (key && overrides[key]) return overrides[key];
  }
  const haystack = `${nodeName} ${meshName} ${materialName}`.toLowerCase();
  for (const part of PART_ORDER) {
    const pattern = modelConfig.parts[part];
    if (pattern && new RegExp(pattern, "i").test(haystack)) return part;
  }
  return "unknown";
}

/** Pièces à ne jamais afficher (logos de marque, plaques). */
export function isHiddenPart(part, modelConfig) {
  return part === "logos" || (part === "plates" && modelConfig.hidePlates);
}
