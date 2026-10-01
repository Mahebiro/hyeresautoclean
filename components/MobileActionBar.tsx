"use client";

import { useEffect, useState } from "react";
import { company } from "@/content/site-data";

/**
 * Barre d'action fixe, uniquement sur mobile (< 768 px) : « Appeler » et
 * « Réserver ». Elle glisse depuis le bas une fois le hero dépassé, et se
 * retire dès que la section Réservation ou le pied de page est visible.
 */
export function MobileActionBar() {
  const [pastHero, setPastHero] = useState(false);
  const [targetsVisible, setTargetsVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const targets = [document.getElementById("reservation"), document.querySelector("footer")].filter(
      (el): el is HTMLElement => Boolean(el),
    );
    const visible = new Set<Element>();

    const heroObserver = new IntersectionObserver(([entry]) => {
      setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    if (hero) heroObserver.observe(hero);

    const targetObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      setTargetsVisible(visible.size > 0);
    });
    targets.forEach((el) => targetObserver.observe(el));

    return () => {
      heroObserver.disconnect();
      targetObserver.disconnect();
    };
  }, []);

  const shown = pastHero && !targetsVisible;

  return (
    <div
      className="mobile-action-bar fixed inset-x-0 bottom-0 z-40 border-t border-navy-900/10 bg-white/80 px-4 pt-3 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      data-shown={shown ? "true" : "false"}
      aria-hidden={!shown}
      inert={!shown}
    >
      <div className="flex gap-3">
        <a
          href={company.phoneHref}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-navy-900/20 bg-white py-3 text-sm font-semibold text-navy-900"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path
              d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Appeler
        </a>
        <a
          href="#reservation"
          className="flex flex-[1.4] items-center justify-center rounded-full bg-navy-900 py-3 text-sm font-semibold text-white shadow-premium"
        >
          Réserver
        </a>
      </div>
    </div>
  );
}
