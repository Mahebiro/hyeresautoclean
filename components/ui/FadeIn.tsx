"use client";

import { useRef, type ReactNode } from "react";
import { EASE_SOFT, gsap, prefersReducedMotion, REVEAL_START, useIsomorphicLayoutEffect } from "../motion/gsap";

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
    const reduced = prefersReducedMotion();
    const tween = gsap.fromTo(
      el,
      { autoAlpha: 0, y: reduced ? 0 : 28 },
      {
        autoAlpha: 1,
        y: 0,
        duration: reduced ? 0.6 : 0.9,
        delay,
        ease: EASE_SOFT,
        clearProps: "transform",
        scrollTrigger: { trigger: el, start: REVEAL_START, once: true },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
