"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { JourneyScene } from "./JourneyScene";
import { StaticJourney } from "./StaticJourney";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

// Le rendu serveur ne connaît pas la préférence de l'utilisateur : on
// démarre toujours sur la version animée (comme ci-dessous) puis on bascule
// juste après l'hydratation si besoin, sans jamais provoquer de mismatch.
function getReducedMotionServerSnapshot() {
  return false;
}

// Section animée "De la route au brillant" : une scène épinglée (sticky) qui
// joue au rythme du scroll, entre la présentation et les formules.
export function CarWashJourney() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isNear, setIsNear] = useState(false);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (prefersReducedMotion) {
    return <StaticJourney />;
  }

  return (
    <section ref={sectionRef} className="relative h-[260vh] bg-white md:h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center px-4">
        <div className="relative h-[60vh] w-full max-w-6xl overflow-hidden rounded-3xl shadow-premium md:h-[70vh]">
          {isNear ? (
            <JourneyScene sectionRef={sectionRef} />
          ) : (
            <div className="h-full w-full bg-gradient-to-b from-sky-200 via-sky-50 to-white" />
          )}
        </div>
      </div>
    </section>
  );
}
