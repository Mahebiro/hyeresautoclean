"use client";

// Point d'entrée unique de GSAP côté client : les plugins sont enregistrés
// une seule fois, et tous les composants partagent le même langage de
// mouvement (durées 0,6–1,2 s, easing expo.out / power3.out).
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useLayoutEffect } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

export const EASE = "expo.out";
export const EASE_SOFT = "power3.out";

/** Déclenchement standard d'une apparition au scroll (une seule fois). */
export const REVEAL_START = "top 88%";

/** useLayoutEffect côté client, sans avertissement au rendu serveur. */
export const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Souris précise (desktop) : condition des effets magnétiques et tilts. */
export function hasFinePointer() {
  return typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}
