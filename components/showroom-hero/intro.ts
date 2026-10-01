import type { gsap as GSAP } from "gsap";
import { SHOWROOM_CONFIG as C } from "./config";
import type { LightLevels } from "./engine";

/**
 * Allumage d'un tube de studio : quelques ratés irréguliers puis pleine
 * puissance (proportions de la durée totale de scintillement).
 */
const FLICKER: [level: number, duration: number][] = [
  [0.55, 0.06],
  [0.04, 0.08],
  [0.8, 0.05],
  [0.12, 0.1],
  [0.35, 0.04],
  [0.02, 0.07],
  [1, 0.6],
];

function flicker(gsap: typeof GSAP, target: object, key: string, duration: number) {
  const total = FLICKER.reduce((sum, [, d]) => sum + d, 0);
  return gsap.to(target, {
    keyframes: FLICKER.map(([level, d]) => ({
      [key]: level,
      duration: (d / total) * duration,
      ease: d > 0.5 ? "power2.out" : "none",
    })),
  });
}

/**
 * Timeline de l'intro « Allumage du showroom » (~4 s) : bandes une par une
 * (arrière, profil, avant), phares, feux arrière, puis titre lettre par lettre.
 */
export function createIntroTimeline(
  gsap: typeof GSAP,
  levels: LightLevels,
  elements: { letters: Element[]; content: Element | null; blackout: Element | null },
) {
  const I = C.intro;
  const tl = gsap.timeline({ paused: true });

  // Pénombre au départ (silhouette à peine visible) : le voile se lève au
  // premier scintillement.
  if (elements.blackout) {
    tl.fromTo(elements.blackout, { opacity: I.veilOpacity }, { opacity: 0, duration: 0.5, ease: "power1.out" }, C.strips[0].at);
  }

  C.strips.forEach((strip, i) => {
    tl.add(flicker(gsap, levels.strips, String(i), I.flickerDuration), strip.at);
  });

  const [envStart, envEnd] = I.environmentFade;
  tl.to(levels, { environment: 1, duration: envEnd - envStart, ease: "sine.inOut" }, envStart);
  // Les phares s'allument avec un léger temps de chauffe, les feux d'un coup.
  tl.add(flicker(gsap, levels, "headlights", 0.3), I.headlightsAt);
  tl.to(levels, { taillights: 1, duration: 0.35, ease: "power2.out" }, I.taillightsAt);

  if (elements.letters.length) {
    tl.fromTo(
      elements.letters,
      { opacity: 0, y: 24, filter: "blur(8px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.9,
        ease: "power3.out",
        stagger: I.titleStagger,
      },
      I.titleAt,
    );
  }
  if (elements.content) {
    tl.fromTo(
      elements.content,
      { autoAlpha: 0, y: 16 },
      { autoAlpha: 1, y: 0, duration: 1, ease: "power2.out" },
      I.contentAt,
    );
  }
  return tl;
}

/** État final de l'intro, appliqué directement (prefers-reduced-motion). */
export function setFinalLevels(levels: LightLevels) {
  levels.strips = levels.strips.map(() => 1);
  levels.environment = 1;
  levels.headlights = 1;
  levels.taillights = 1;
}
