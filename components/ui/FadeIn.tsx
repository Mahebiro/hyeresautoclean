"use client";

import { useRef, type ReactNode } from "react";
import { EASE_SOFT, gsap, prefersReducedMotion, useIsomorphicLayoutEffect } from "../motion/gsap";
import { onceInView } from "../motion/inView";

/**
 * Apparition au scroll : fondu + légère montée, une seule fois.
 * `delay` décale les éléments d'une même liste (index × 0,1 s).
 * Mouvement réduit : simple fondu.
 */
export function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    // État de départ posé en CSS ([data-reveal]) : aucune mesure au chargement.
    const reduced = prefersReducedMotion();
    let tween: gsap.core.Tween | undefined;
    const stop = onceInView(el, () => {
      tween = gsap.to(el, {
        autoAlpha: 1,
        y: 0,
        duration: reduced ? 0.6 : 0.9,
        delay,
        ease: EASE_SOFT,
        onComplete: () => {
          el.style.transform = "none";
        },
      });
    });
    return () => {
      stop();
      tween?.kill();
    };
  }, [delay]);

  return (
    <div ref={ref} data-reveal="" className={className}>
      {children}
    </div>
  );
}
