"use client";

import { useEffect, useRef } from "react";
import { avis, lienAvisGoogle, noteMoyenne, type Avis as AvisType } from "@/data/avis";
import { AnimatedNumber } from "./motion/AnimatedNumber";
import { gsap, prefersReducedMotion, ScrollTrigger } from "./motion/gsap";
import { SplitHeading } from "./motion/SplitHeading";
import { Container } from "./ui/Container";
import { FadeIn } from "./ui/FadeIn";
import { Stars } from "./ui/Stars";

/**
 * Avis clients : note moyenne en grand, puis deux rangées de citations qui
 * défilent en boucle dans des sens opposés (ralenties au survol).
 * Les avis se modifient dans data/avis.ts.
 */
export function Avis() {
  const moyenne = noteMoyenne();
  if (moyenne === null) return null;

  const rangeeA = avis;
  const rangeeB = [...avis].reverse();

  return (
    <section id="avis" className="overflow-hidden bg-navy-950 py-20 sm:py-28">
      <Container>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <FadeIn>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-sky-300">Avis clients</p>
            </FadeIn>
            <SplitHeading className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ils m&apos;ont confié leur voiture
            </SplitHeading>
          </div>

          <FadeIn delay={0.15}>
            <div className="flex items-center gap-5">
              <p className="font-display text-7xl font-bold leading-none tracking-tight text-white sm:text-8xl">
                <AnimatedNumber value={moyenne} decimals={1} duration={1.4} />
              </p>
              <div>
                <Stars rating={moyenne} size={22} className="text-white" />
                <p className="mt-2 text-sm text-white/60">
                  Note moyenne sur {avis.length} avis Google
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </Container>

      <div className="mt-14 space-y-6 sm:mt-16">
        <Rangee items={rangeeA} direction="gauche" />
        <Rangee items={rangeeB} direction="droite" />
      </div>

      <Container>
        <FadeIn>
          <div className="mt-12 flex justify-center">
            <a
              href={lienAvisGoogle}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline inline-flex items-center gap-2 text-sm font-semibold text-white/85 transition-colors hover:text-white"
            >
              Voir tous les avis sur Google
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}

/** Nombre minimum de cartes par demi-rangée, pour remplir les grands écrans. */
const MIN_PAR_DEMI = 6;

function Rangee({ items, direction }: { items: AvisType[]; direction: "gauche" | "droite" }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion()) return;

    // Le HTML ne contient chaque avis qu'une fois (page plus légère) : les
    // copies nécessaires à la boucle sont créées ici, masquées aux lecteurs
    // d'écran. Demi-piste = au moins MIN_PAR_DEMI cartes, puis doublée.
    const originals = Array.from(track.children);
    const clones: Element[] = [];
    const addClone = (node: Element) => {
      const clone = node.cloneNode(true) as Element;
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
      clones.push(clone);
    };
    const repetitions = Math.max(1, Math.ceil(MIN_PAR_DEMI / originals.length));
    for (let r = 1; r < repetitions; r++) originals.forEach(addClone);
    Array.from(track.children).forEach(addClone);

    // La piste contient deux moitiés identiques : on la décale d'une moitié,
    // puis on recommence (boucle sans raccord).
    const [from, to] = direction === "gauche" ? [0, -50] : [-50, 0];
    const largeur = track.scrollWidth / 2;
    const loop = gsap.fromTo(
      track,
      { xPercent: from },
      { xPercent: to, duration: largeur / 38, ease: "none", repeat: -1, paused: true },
    );
    // Ne tourne que lorsque la rangée est à l'écran (aucun calcul inutile).
    const visibility = ScrollTrigger.create({
      trigger: track,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
    });
    if (visibility.isActive) loop.play();
    const slow = () => gsap.to(loop, { timeScale: 0.15, duration: 0.8, ease: "power3.out", overwrite: true });
    const resume = () => gsap.to(loop, { timeScale: 1, duration: 1.2, ease: "power3.out", overwrite: true });
    track.addEventListener("pointerenter", slow);
    track.addEventListener("pointerleave", resume);
    return () => {
      track.removeEventListener("pointerenter", slow);
      track.removeEventListener("pointerleave", resume);
      visibility.kill();
      loop.kill();
      clones.forEach((clone) => clone.remove());
      gsap.set(track, { clearProps: "transform" });
    };
  }, [direction]);

  return (
    <div className="avis-rangee">
      <div ref={trackRef} className="avis-piste flex w-max">
        {items.map((item) => (
          <CarteAvis key={item.id} avis={item} />
        ))}
      </div>
    </div>
  );
}

function CarteAvis({ avis: item }: { avis: AvisType }) {
  const details = [item.ville, item.formule ? `Formule ${item.formule}` : null].filter(Boolean).join(" · ");

  return (
    <figure
      className="avis-carte mr-6 flex w-[300px] shrink-0 flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-7 sm:w-[440px] sm:p-9"
    >
      <div className="flex items-center justify-between gap-3">
        <Stars rating={item.note} size={16} className="text-white" />
        {!item.verifie ? (
          <span className="rounded-full border border-amber-300/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-200">
            Exemple
          </span>
        ) : null}
      </div>
      <blockquote className="mt-5 flex-1 font-display text-[17px] leading-snug text-white sm:text-lg">
        <span aria-hidden="true" className="mr-1 text-sky-300">
          «
        </span>
        {item.texte}
        <span aria-hidden="true" className="ml-1 text-sky-300">
          »
        </span>
      </blockquote>
      <figcaption className="mt-6 flex items-end justify-between gap-4 border-t border-white/10 pt-5">
        <div>
          <p className="font-semibold text-white">{item.prenom}</p>
          {details ? <p className="mt-0.5 text-sm text-white/55">{details}</p> : null}
        </div>
        <p className="shrink-0 text-xs text-white/45">
          Avis {item.source} · {item.date}
        </p>
      </figcaption>
    </figure>
  );
}
