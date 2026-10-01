"use client";

import { useRef, type ElementType } from "react";
import SplitType from "split-type";
import { EASE, gsap, prefersReducedMotion, useIsomorphicLayoutEffect } from "./gsap";
import { onceInView } from "./inView";

/**
 * Titre qui apparaît ligne par ligne au scroll : chaque ligne monte depuis
 * un masque. Une fois l'animation jouée, le découpage est retiré (le titre
 * redevient un texte normal, qui se recompose librement au redimensionnement).
 */
export function SplitHeading({
  as: Tag = "h2",
  className = "",
  children,
}: {
  as?: ElementType;
  className?: string;
  children: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = prefersReducedMotion();
    // Masqué en CSS ([data-split-heading]) jusqu'à son apparition ; le
    // découpage en lignes (qui mesure la mise en page) n'a lieu qu'à ce
    // moment-là, pas au chargement.
    let split: SplitType | null = null;
    let tween: gsap.core.Tween | undefined;

    const stop = onceInView(el, () => {
      if (reduced) {
        tween = gsap.to(el, { autoAlpha: 1, duration: 0.6 });
        return;
      }
      split = new SplitType(el, { types: "lines", lineClass: "split-line" });
      for (const line of split.lines ?? []) {
        const mask = document.createElement("span");
        mask.className = "split-mask";
        line.parentNode?.insertBefore(mask, line);
        mask.appendChild(line);
      }
      gsap.set(split.lines, { yPercent: 115 });
      gsap.set(el, { autoAlpha: 1 });
      tween = gsap.to(split.lines, {
        yPercent: 0,
        duration: 1.15,
        ease: EASE,
        stagger: 0.09,
        onComplete: () => split?.revert(),
      });
    });
    return () => {
      stop();
      tween?.kill();
      split?.revert();
    };
  }, [children]);

  return (
    <Tag ref={ref} data-split-heading="" className={className}>
      {children}
    </Tag>
  );
}
