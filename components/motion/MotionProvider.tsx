"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "./gsap";

let lenisInstance: Lenis | null = null;

/** Instance Lenis active (null si le mouvement réduit est demandé). */
export function getLenis() {
  return lenisInstance;
}

/**
 * Défilement doux (Lenis) synchronisé avec ScrollTrigger, pour tout le site.
 * Désactivé quand l'utilisateur demande moins d'animations.
 */
export function MotionProvider() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);

    if (prefersReducedMotion()) {
      return () => window.removeEventListener("load", refresh);
    }

    const lenis = new Lenis({ anchors: { offset: -80 }, lerp: 0.085 });
    lenisInstance = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return null;
}
