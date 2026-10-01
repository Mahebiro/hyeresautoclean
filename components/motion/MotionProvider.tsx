"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, hasFinePointer, prefersReducedMotion, ScrollTrigger } from "./gsap";

let lenisInstance: Lenis | null = null;

/** Instance Lenis active (null si le mouvement réduit est demandé). */
export function getLenis() {
  return lenisInstance;
}

/** Fait défiler jusqu'à une section (doux si Lenis est actif), sous le header. */
export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const offset = -(document.querySelector("header")?.getBoundingClientRect().height ?? 0);
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { offset });
  } else {
    const top = target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }
}

/**
 * Défilement doux (Lenis) synchronisé avec ScrollTrigger, pour tout le site
 * (souris / trackpad). Désactivé sur écran tactile et quand l'utilisateur
 * demande moins d'animations.
 */
export function MotionProvider() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);

    // Écrans tactiles : Lenis ne lisse pas le défilement au doigt, inutile de
    // faire tourner sa boucle (le défilement natif est conservé).
    if (prefersReducedMotion() || !hasFinePointer()) {
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
