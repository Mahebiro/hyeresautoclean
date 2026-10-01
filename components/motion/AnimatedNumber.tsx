"use client";

import { useEffect, useRef } from "react";
import { EASE, gsap, prefersReducedMotion } from "./gsap";
import { onceInView } from "./inView";

const format = (value: number, decimals: number) =>
  value.toLocaleString("fr-FR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/**
 * Nombre animé.
 *  - mode "inView" : compte de 0 jusqu'à la valeur quand il apparaît à l'écran
 *  - mode "change" : glisse de l'ancienne à la nouvelle valeur (totaux en direct)
 * Le texte final est rendu côté serveur (accessible et indexable).
 */
export function AnimatedNumber({
  value,
  decimals = 0,
  mode = "inView",
  duration = 1.2,
  className = "",
}: {
  value: number;
  decimals?: number;
  mode?: "inView" | "change";
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const current = useRef({ value: mode === "inView" ? 0 : value });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const state = current.current;
    const render = () => (el.textContent = format(state.value, decimals));

    if (prefersReducedMotion()) {
      state.value = value;
      render();
      return;
    }

    const tween = gsap.to(state, {
      value,
      duration: mode === "change" ? 0.6 : duration,
      ease: EASE,
      onUpdate: render,
      paused: mode === "inView",
    });

    let stop: (() => void) | undefined;
    if (mode === "inView") {
      render();
      stop = onceInView(el, () => tween.play());
    }
    return () => {
      stop?.();
      tween.kill();
    };
  }, [value, decimals, mode, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {format(value, decimals)}
    </span>
  );
}
