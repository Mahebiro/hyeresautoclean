"use client";

import { useRef, type ElementType } from "react";
import SplitType from "split-type";
import { EASE, gsap, prefersReducedMotion, REVEAL_START, useIsomorphicLayoutEffect } from "./gsap";

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

    if (prefersReducedMotion()) {
      const tween = gsap.fromTo(
        el,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.6, scrollTrigger: { trigger: el, start: REVEAL_START, once: true } },
      );
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    }

    const split = new SplitType(el, { types: "lines", lineClass: "split-line" });
    for (const line of split.lines ?? []) {
      const mask = document.createElement("span");
      mask.className = "split-mask";
      line.parentNode?.insertBefore(mask, line);
      mask.appendChild(line);
    }
    gsap.set(split.lines, { yPercent: 115 });
    const tween = gsap.to(split.lines, {
      yPercent: 0,
      duration: 1.15,
      ease: EASE,
      stagger: 0.09,
      scrollTrigger: { trigger: el, start: REVEAL_START, once: true },
      onComplete: () => split.revert(),
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      split.revert();
    };
  }, [children]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
