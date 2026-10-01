"use client";

// Un seul IntersectionObserver partagé pour toutes les apparitions au
// scroll : aucune mesure de mise en page au chargement (contrairement à un
// ScrollTrigger par élément), ce qui garde la page fluide sur mobile.

type Callback = () => void;

const callbacks = new WeakMap<Element, Callback>();
let observer: IntersectionObserver | null = null;

function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // Visible, ou déjà dépassé (saut d'ancre, contenu raccourci) : on
          // révèle aussi, pour ne jamais laisser un élément invisible.
          if (!entry.isIntersecting && entry.boundingClientRect.bottom >= 0) continue;
          const callback = callbacks.get(entry.target);
          observer?.unobserve(entry.target);
          callbacks.delete(entry.target);
          callback?.();
        }
      },
      // Déclenche quand l'élément entre dans les 88 % hauts de l'écran.
      { rootMargin: "0px 0px -12% 0px" },
    );
  }
  return observer;
}

/** Appelle `callback` une seule fois, quand l'élément apparaît à l'écran. */
export function onceInView(element: Element, callback: Callback) {
  callbacks.set(element, callback);
  getObserver().observe(element);
  return () => {
    callbacks.delete(element);
    observer?.unobserve(element);
  };
}
