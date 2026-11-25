"use client";

import { useEffect, useRef } from "react";
import { addons, formatAddonPrice, formulas } from "@/content/site-data";
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
    <section id="formules" className="bg-[#171717] py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Nos formules"
          title="Deux formules pour un intérieur propre et agréable"
          subtitle="Vitres intérieures incluses dans les deux formules."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {formulas.map((formula, index) => (
            <FadeIn key={formula.id} delay={index * 0.1} className="h-full">
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
          <p className="mt-10 text-center text-sm font-medium text-neutral-300">
            Même prix pour toutes les voitures, quelle que soit leur taille — citadine, berline ou
            SUV.
          </p>
        </FadeIn>

        {activeAddons.length > 0 ? (
          <FadeIn delay={0.25}>
            <div className="mt-16">
              <h3 className="text-center font-display text-xl font-bold text-white">Suppléments</h3>
              <p className="mt-2 text-center text-sm text-neutral-400">
                À ajouter à la formule choisie, selon vos besoins.
              </p>
              <div className="mx-auto mt-8 max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                <ul className="divide-y divide-white/10">
                  {activeAddons.map((addon) => (
                    <li key={addon.id} className="flex items-center justify-between gap-4 px-6 py-4">
                      <span>
                        <span className="block text-neutral-100">{addon.label}</span>
                        {addon.description ? (
                          <span className="block text-sm text-neutral-400">{addon.description}</span>
                        ) : null}
                      </span>
                      <span className="shrink-0 font-semibold text-white">+{formatAddonPrice(addon)}</span>
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
  // Formule mise en avant (badge « La plus choisie »).
  const isFeatured = Boolean(formula.badge);
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
    <div className={`h-full ${isFeatured ? "lg:scale-[1.03]" : ""}`}>
      <div
        ref={cardRef}
        id={`formule-${formula.id}`}
        className={`relative flex h-full scroll-mt-28 flex-col rounded-3xl border p-8 text-white [transform-style:preserve-3d] ${
          isFeatured
            ? "premium-halo border-sky-300/40 bg-[#222224]"
            : "border-white/10 bg-white/[0.04]"
        }`}
      >
        {/* Reflets : balayage lent (formule mise en avant) et reflet qui suit la souris. */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
          {isFeatured ? <span className="card-sheen absolute inset-y-0 -left-1/2 w-1/2" /> : null}
          <span
            ref={glareRef}
            className={`invisible absolute left-1/2 top-1/2 -ml-40 -mt-40 h-80 w-80 rounded-full opacity-0 blur-2xl ${
              isFeatured ? "bg-white/[0.12]" : "bg-white/[0.08]"
            }`}
          />
        </span>

        {formula.badge ? (
          <span className="absolute -top-3 left-8 rounded-full bg-sky-300 px-3 py-1 text-xs font-bold uppercase tracking-wide text-neutral-950">
            {formula.badge}
          </span>
        ) : null}

        <h3 className="font-display text-2xl font-bold">{formula.name}</h3>
        <p className="mt-2 text-sm text-neutral-300">{formula.tagline}</p>

        <p className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-display text-4xl font-bold">
            <AnimatedNumber value={formula.priceFrom} duration={1.1} /> €
          </span>
          <span className="text-sm text-neutral-300">Durée : {formula.duration}</span>
        </p>

        <ul ref={listRef} data-checklist="" className="mt-6 flex-1 space-y-3">
          {formula.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm">
              <CheckIcon className="text-sky-300" />
              <span className="text-neutral-100">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Prestations non incluses : affichées clairement, pas en petit. */}
        {formula.excluded?.map((item) => (
          <div key={item.label} className="mt-5 rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3">
            <p className="flex items-start gap-2.5 font-semibold text-red-200">
              <span aria-hidden="true" className="text-lg leading-5">
                ✗
              </span>
              {item.label}
            </p>
            {item.hint ? (
              <p className="mt-1 pl-6 text-sm text-neutral-200">
                <a href="#formule-confort" className="underline underline-offset-2 hover:text-white">
                  {item.hint}
                </a>
              </p>
            ) : null}
          </div>
        ))}

        <div className="relative mt-8">
          <Button
            href="#reservation"
            onClick={onChoose}
            variant={isFeatured ? "primary" : "secondary"}
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
