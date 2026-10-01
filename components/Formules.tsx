"use client";

import { useEffect, useRef } from "react";
import { addons, formulas, type FormulaId } from "@/content/site-data";
import { useSelection } from "@/context/SelectionContext";
import { AnimatedNumber } from "./motion/AnimatedNumber";
import { EASE_SOFT, gsap, hasFinePointer, prefersReducedMotion } from "./motion/gsap";
import { onceInView } from "./motion/inView";
import { scrollToSection } from "./motion/MotionProvider";
import { Button } from "./ui/Button";
import { Container } from "./ui/Container";
import { FadeIn } from "./ui/FadeIn";
import { SectionHeading } from "./ui/SectionHeading";

export function Formules() {
  const { pickFormula } = useSelection();
  const activeAddons = addons.filter((addon) => addon.active);

  return (
    <section id="formules" className="bg-navy-50/60 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Nos formules"
          title="Deux formules, un seul objectif : un intérieur impeccable"
          subtitle="Vitres intérieures incluses dans les deux formules."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-2 lg:items-center">
          {formulas.map((formula, index) => (
            <FadeIn key={formula.id} delay={index * 0.1}>
              <FormulaCard
                formula={formula}
                onChoose={() => {
                  pickFormula(formula.id);
                  // Défilement explicite : fonctionne même si le clic a eu lieu
                  // avant la fin du chargement (React rejoue alors le clic, mais
                  // pas la navigation vers l'ancre).
                  scrollToSection("reservation");
                }}
              />
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.2}>
          <p className="mt-10 text-center text-sm font-medium text-navy-700/80">
            Même prix pour toutes les voitures, quelle que soit leur taille — citadine, berline ou
            SUV.
          </p>
        </FadeIn>

        {activeAddons.length > 0 ? (
          <FadeIn delay={0.25}>
            <div className="mt-16">
              <h3 className="text-center font-display text-xl font-bold text-navy-900">
                Suppléments à la carte
              </h3>
              <div className="mx-auto mt-8 max-w-xl overflow-hidden rounded-2xl border border-navy-900/10 bg-white shadow-sm">
                <ul className="divide-y divide-navy-900/10">
                  {activeAddons.map((addon) => (
                    <li key={addon.id} className="flex items-center justify-between px-6 py-4">
                      <span className="text-navy-800">{addon.label}</span>
                      <span className="font-semibold text-navy-900">+{addon.price} €</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeIn>
        ) : null}
      </Container>
    </section>
  );
}

function FormulaCard({
  formula,
  onChoose,
}: {
  formula: (typeof formulas)[number];
  onChoose: () => void;
}) {
  const isPremium = formula.id === ("premium" as FormulaId);
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Tilt 3D amorti au survol (desktop), avec un reflet qui suit la souris.
  useEffect(() => {
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!card || !glare || !hasFinePointer() || prefersReducedMotion()) return;
    gsap.set(card, { transformPerspective: 1000 });
    const rotX = gsap.quickTo(card, "rotationX", { duration: 0.8, ease: EASE_SOFT });
    const rotY = gsap.quickTo(card, "rotationY", { duration: 0.8, ease: EASE_SOFT });
    const glareX = gsap.quickTo(glare, "x", { duration: 0.8, ease: EASE_SOFT });
    const glareY = gsap.quickTo(glare, "y", { duration: 0.8, ease: EASE_SOFT });
    const onMove = (event: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      rotY(px * 7);
      rotX(-py * 5);
      glareX(px * rect.width);
      glareY(py * rect.height);
      gsap.to(glare, { autoAlpha: 1, duration: 0.6, overwrite: "auto" });
    };
    const onLeave = () => {
      rotX(0);
      rotY(0);
      gsap.to(glare, { autoAlpha: 0, duration: 0.8, overwrite: "auto" });
    };
    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerleave", onLeave);
    return () => {
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf([card, glare]);
    };
  }, []);

  // Les prestations arrivent une par une, chaque coche se dessine
  // (état de départ en CSS : [data-checklist]).
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const reduced = prefersReducedMotion();
    let tl: gsap.core.Timeline | undefined;
    const stop = onceInView(list, () => {
      tl = gsap.timeline();
      tl.to(list.querySelectorAll("li"), {
        autoAlpha: 1,
        x: 0,
        duration: reduced ? 0.6 : 0.8,
        ease: EASE_SOFT,
        stagger: 0.09,
      });
      tl.to(
        list.querySelectorAll("path"),
        { strokeDashoffset: 0, duration: reduced ? 0.01 : 0.6, ease: "power2.out", stagger: 0.09 },
        0.15,
      );
    });
    return () => {
      stop();
      tl?.kill();
    };
  }, []);

  return (
    <div className={isPremium ? "lg:scale-105" : undefined}>
      <div
        ref={cardRef}
        className={`relative flex h-full flex-col rounded-3xl border p-8 [transform-style:preserve-3d] ${
          isPremium
            ? "premium-halo border-navy-900 bg-navy-900 text-white shadow-premium"
            : "border-navy-900/10 bg-white text-navy-900"
        }`}
      >
        {/* Reflets : balayage lent (Premium) et reflet qui suit la souris. */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
          {isPremium ? <span className="card-sheen absolute inset-y-0 -left-1/2 w-1/2" /> : null}
          <span
            ref={glareRef}
            className={`invisible absolute left-1/2 top-1/2 -ml-40 -mt-40 h-80 w-80 rounded-full opacity-0 blur-2xl ${
              isPremium ? "bg-white/[0.12]" : "bg-sky-200/50"
            }`}
          />
        </span>

        {formula.badge ? (
          <span className="absolute -top-3 left-8 rounded-full bg-sky-400 px-3 py-1 text-xs font-bold uppercase tracking-wide text-navy-950">
            {formula.badge}
          </span>
        ) : null}

        <h3 className="font-display text-2xl font-bold">{formula.name}</h3>
        <p className={`mt-2 text-sm ${isPremium ? "text-white/75" : "text-navy-700/80"}`}>
          {formula.tagline}
        </p>

        <p className="mt-6">
          <span className="font-display text-4xl font-bold">
            <AnimatedNumber value={formula.priceFrom} duration={1.1} /> €
          </span>
        </p>

        <ul ref={listRef} data-checklist="" className="mt-6 flex-1 space-y-3">
          {formula.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm">
              <CheckIcon className={isPremium ? "text-sky-300" : "text-sky-600"} />
              <span className={isPremium ? "text-white/90" : "text-navy-800"}>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="relative mt-8">
          <Button
            href="#reservation"
            onClick={onChoose}
            variant={isPremium ? "secondary" : "primary"}
            className="w-full"
          >
            Choisir cette formule
          </Button>
        </div>
      </div>
    </div>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className={`mt-0.5 shrink-0 ${className}`}
    >
      <path pathLength={1} strokeDasharray="1" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
