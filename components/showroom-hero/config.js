// ============================================================================
// HERO 3D « ALLUMAGE DU SHOWROOM » — FICHIER DE RÉGLAGES UNIQUE
// ----------------------------------------------------------------------------
// Tous les réglages artistiques de l'animation du haut de page sont ici :
// couleurs, matières, lumières, sol, trajet de caméra, rythme de l'intro,
// post-traitement et seuils de performance. Modifiez une valeur, enregistrez,
// la page se met à jour (en local avec `npm run dev`).
//
// Repères :
//   - Unités 3D en mètres. La voiture est recentrée à l'origine, roues posées
//     sur le sol (y = 0), avant tourné vers +Z, côté conducteur (gauche) vers +X.
//   - Angles en degrés. Couleurs au format CSS hexadécimal.
//   - Les intensités de lumière sont relatives : 1 = valeur de référence.
//
// Ce fichier est aussi lu par les scripts Node du dossier scripts/model/
// (analyse et compression du modèle) : gardez-le en JavaScript pur.
// ============================================================================

export const SHOWROOM_CONFIG = {
  // --- Modèle 3D -------------------------------------------------------------
  model: {
    // Fichier optimisé produit par `npm run model:compress` (dans /public).
    url: "/assets/gt3rs.opt.glb",
    // Taille approximative du fichier, utilisée par le compteur de chargement
    // si le serveur n'indique pas la taille réelle (en octets).
    approxBytes: 4_500_000,
    // Rotation à appliquer pour que l'avant de la voiture regarde vers +Z.
    // Lancez `npm run model:analyze` : le script indique l'axe le plus long.
    // Essayez 0, 90, 180 ou -90 si la voiture apparaît de travers.
    rotationY: 0,
    // Longueur réelle de la voiture (une 911 GT3 RS mesure 4,57 m). Le modèle
    // est mis à l'échelle sur cette longueur, quelle que soit son unité.
    lengthMeters: 4.57,

    // Reconnaissance des pièces. Chaque motif (expression régulière, sans
    // tenir compte des majuscules) est testé sur « nom du nœud + nom du
    // maillage + nom du matériau ». L'ordre compte : la première famille
    // reconnue l'emporte (ex. « headlight_glass » → phares, pas vitres).
    parts: {
      logos: "logo|badge|emblem|emblème|crest|wappen|decal|sticker|lettering|script|signature|brand|marque",
      plates: "plate|plaque|kennzeichen|licen[cs]e|immat",
      headlights: "head_?light|head_?lamp|front_?light|front_?lamp|phare|scheinwerfer|drl|outer_?clear",
      taillights: "outer_?red|tail_?light|tail_?lamp|rear_?light|rear_?lamp|brake_?light|stop_?light|feu|rueckleuchte|rückleuchte",
      calipers: "caliper|calliper|etrier|étrier|bremssattel",
      tires: "tire|tyre|pneu|reifen|rubber",
      rims: "(?<!t)rim|(?<!steering_?)wheel|jante|felge|spoke",
      glass: "glass|window|windshield|windscreen|vitre|scheibe|verre",
      trim: "trim|carbon|plastic|grill|grille|diffus|splitter|wiper|black",
      body: "paint|body|carross|lack|karosserie|shell|exterior",
    },
    // Correspondances forcées, prioritaires sur les motifs ci-dessus, pour les
    // modèles dont les noms sont génériques (« Object_12 »…). Clé = nom exact
    // du maillage OU du matériau (voir la sortie de `npm run model:analyze`),
    // valeur = famille : "body", "glass", "tires", "rims", "calipers",
    // "headlights", "taillights", "logos", "plates", "trim" (plastiques noirs)
    // ou "keep" (garder le matériau d'origine).
    overrides: {
      // Réglages propres au modèle 991.2 GT3 RS fourni (noms Sketchfab).
      Porsche_911GT3RSReward_2018_Wheel1A_3D_3DWheel1A_Material1: "tires",
      Porsche_911GT3RSReward_2018CalliperGloss_Material1: "calipers",
      Porsche_911GT3RSReward_2018CalliperBadgeA_Material1: "logos",
      "_991_2:M_Glass_WindowSurroundFront_Max__991_2:phong19SG1_0": "trim",
      "_991_2:M_GlassOpaque_Mirror_Max__991_2:phong14SG1_0": "keep",
      "_991_2:M_CarPaint_Max__991_2:phong3SG1_0": "trim",
      // Habitacle : la texture d'origine contient l'écusson du volant, on la
      // remplace par une matière sombre unie (vue à travers les vitres teintées).
      "_991_2:M_Interior_SetRS_Max__991_2:phong9SG1_0": "trim",
      "_991_2:M_InteriorTiled_Common_Max__991_2:phong11SG1_0": "trim",
    },
    // Les plaques d'immatriculation sont masquées (elles portent du texte).
    hidePlates: true,
  },

  // --- Couleurs --------------------------------------------------------------
  colors: {
    // Fond du studio : bords quasi noirs et halo gris derrière la voiture
    // (évite l'impression d'écran éteint à l'arrivée).
    background: "#0D0E10",
    backgroundGlow: "#2B2D33",
    // Peinture de carrosserie : gris « craie » clair. Exemples :
    // blanc "#E9E9E6", noir "#0E0F11", bleu Requin "#1E5B9C", vert "#2E6B4F".
    paint: "#C8C7C1",
    // Jantes (satinées) — rouge des photos de référence.
    rims: "#9A1C20",
    // Étriers de frein.
    calipers: "#D9A21B",
    // Plastiques bruts / carbone (prises d'air, diffuseur, aileron…).
    trim: "#121214",
  },

  // --- Matières --------------------------------------------------------------
  materials: {
    paint: {
      metalness: 0.45, // peinture métallisée : paillettes visibles sans effet chrome
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      envMapIntensity: 1,
    },
    glass: {
      color: "#0B0D10", // teinte légère
      opacity: 0.62,
      roughness: 0.02,
      envMapIntensity: 1.6, // vitres bien réfléchissantes
    },
    tires: { color: "#0D0D0E", roughness: 0.92 },
    rims: { metalness: 0.75, roughness: 0.32 }, // satiné
    calipers: { metalness: 0.2, roughness: 0.35, clearcoat: 0.6 },
    trim: { metalness: 0.1, roughness: 0.55 },
    headlights: { color: "#F4F7FF", intensity: 0.7 }, // émissif une fois allumés
    taillights: { color: "#FF1A12", intensity: 7 },
  },

  // --- Éclairage -------------------------------------------------------------
  environment: {
    // HDRI de studio Poly Haven (CC0), dans /public/assets/hdri/.
    hdri: "/assets/hdri/studio_small_03_512.hdr",
    // Intensité faible : l'HDRI ne fait que déboucher les noirs.
    intensity: 0.2,
    rotationY: 0,
  },

  // Les trois bandes de lumière. Chacune combine une RectAreaLight (éclairage
  // doux et reflets mats) et un plan émissif qui n'existe que dans la scène de
  // reflets : il dessine les longues lignes blanches dans le vernis sans
  // jamais masquer la voiture. Elles s'allument dans cet ordre pendant l'intro.
  //   position  : centre de la bande [x, y, z]
  //   lookAt    : point visé par la face lumineuse
  //   size      : [longueur, largeur] en mètres
  //   intensity : puissance d'éclairage (RectAreaLight)
  //   glow      : luminosité du reflet net dans le vernis
  //   at        : instant d'allumage dans l'intro (secondes)
  strips: [
    {
      name: "Arrière & aileron",
      position: [0.2, 2.5, -2.4],
      lookAt: [0, 0.7, -1.7],
      size: [4.2, 0.32],
      intensity: 1.3,
      glow: 8,
      at: 0.35,
    },
    {
      name: "Profil",
      position: [3.4, 0.95, 0.1],
      lookAt: [0, 0.55, 0],
      size: [9, 0.26],
      intensity: 1,
      glow: 4.5,
      at: 1.15,
    },
    {
      name: "Avant",
      position: [-0.2, 2.5, 2.4],
      lookAt: [0, 0.5, 1.7],
      size: [4.2, 0.32],
      intensity: 1.2,
      glow: 8,
      at: 1.95,
    },
  ],

  // --- Sol -------------------------------------------------------------------
  floor: {
    // Force du reflet de la voiture dans le sol (0 = mat, 1 = miroir).
    reflectivity: 0.22,
    // Flou du reflet (niveau de mipmap, 0 = net).
    blur: 3,
    // Atténuation du reflet avec la distance (en mètres).
    reflectionFade: 1.1,
    // Ombre de contact sous la voiture.
    shadowOpacity: 0.95,
    shadowBlur: 2.2,
    // Rayon du sol visible, au-delà il se fond dans le fond de page.
    radius: 9,
  },

  // --- Intro (au chargement, sans action de l'utilisateur) -------------------
  intro: {
    // Opacité du voile sombre au tout début (1 = noir complet, la voiture est
    // invisible ; 0.6 = silhouette devinée dans la pénombre).
    veilOpacity: 0.6,
    // Durée du scintillement néon à l'allumage d'une bande (secondes).
    flickerDuration: 0.45,
    // Montée progressive de l'HDRI de fond [début, fin] (secondes).
    environmentFade: [0.6, 3.2],
    headlightsAt: 2.55,
    taillightsAt: 3.05,
    // Apparition du titre lettre par lettre.
    titleAt: 2.7,
    titleStagger: 0.06,
    // Le texte d'accroche et les boutons apparaissent ensuite.
    contentAt: 3.6,
  },

  // --- Titre géant derrière la voiture --------------------------------------
  title: {
    opacity: 0.1, // blanc à 10 %
  },

  // --- Caméra & scroll -------------------------------------------------------
  camera: {
    fov: 30, // focale « téléobjectif » : peu de déformation, aspect pub
    // Hauteur visée (m) et marge autour de la voiture (1 = juste cadrée).
    targetY: 0.55,
    framing: { desktop: 1.18, mobile: 0.94 },
    // Sur mobile (écran vertical), la voiture est cadrée sur la largeur de
    // l'écran : la caméra recule automatiquement pour qu'elle tienne entière.
    // Trajet au scroll : points clés de 0 (début) à 1 (fin de section).
    //   azimuth   : 0 = face avant, 90 = profil gauche, 180 = face arrière
    //   elevation : hauteur de la caméra (degrés au-dessus de l'horizon)
    //   distance  : multiplicateur de la distance de cadrage
    //   targetY   : décalage vertical du point visé (m)
    path: [
      { at: 0, azimuth: 38, elevation: 7, distance: 1.0, targetY: 0 },
      { at: 0.5, azimuth: 90, elevation: 9, distance: 1.08, targetY: 0 },
      { at: 1, azimuth: 148, elevation: 21, distance: 1.0, targetY: 0.12 },
    ],
    // Longueur de scroll de la section épinglée (en hauteurs d'écran).
    scrollLength: 2,
    // Lissage GSAP du scrub (secondes).
    scrub: 1,
    // Suivi de la souris (desktop) : amplitude max (degrés) et amortissement.
    mouse: { yaw: 3, pitch: 1.5, damping: 0.045 },
  },

  // --- Post-traitement -------------------------------------------------------
  postfx: {
    bloom: { strength: 0.2, radius: 0.35, threshold: 1.8 },
    // Vignette et grain sont des calques CSS légers (identiques partout).
    vignette: 0.45, // opacité des bords
    grain: 0.07, // opacité du grain
    exposure: 1.12,
  },

  // --- Performance -----------------------------------------------------------
  performance: {
    maxPixelRatio: { desktop: 2, mobile: 1.5, lite: 1 },
    // Sous ce nombre d'images/seconde pendant les premières secondes de
    // rendu, la version allégée est activée (pas de bloom, reflet simplifié).
    minFps: 30,
    sampleMs: 2000,
    // Force du reflet sur mobile / version allégée (fraction de floor.reflectivity),
    // le reflet basse résolution y est volontairement plus discret.
    simplifiedReflection: 0.6,
    // Résolution du reflet du sol (fraction de l'écran).
    reflectionScale: { desktop: 0.5, mobile: 0.25, lite: 0.25 },
    msaaSamples: 4,
  },
};
