"use client";

import Image from "next/image";
import { useState } from "react";
import { galleryItems } from "@/content/site-data";
import { Container } from "./ui/Container";
import { FadeIn } from "./ui/FadeIn";
import { SectionHeading } from "./ui/SectionHeading";

export function Galerie() {
  return (
    <section id="galerie" className="bg-navy-50/60 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Réalisations"
          title="Le résultat en images"
          subtitle="Faites glisser le curseur pour comparer l'avant et l'après."
        />

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {galleryItems.map((item, index) => (
            <FadeIn key={item.id} delay={index * 0.1}>
              <BeforeAfterSlider before={item.before} after={item.after} label={item.label} />
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}

function BeforeAfterSlider({
  before,
  after,
  label,
}: {
  before: string;
  after: string;
  label: string;
}) {
  const [position, setPosition] = useState(50);

  return (
    <div>
      <div className="relative aspect-[4/3] w-full select-none overflow-hidden rounded-2xl border border-navy-900/10 shadow-sm">
        <Image src={after} alt={`${label} — après nettoyage`} fill unoptimized className="object-cover" />
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Image
            src={before}
            alt={`${label} — avant nettoyage`}
            fill
            unoptimized
            className="object-cover"
          />
        </div>

        <div
          className="absolute inset-y-0 w-0.5 bg-white shadow"
          style={{ left: `${position}%` }}
        />

        <input
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          aria-label={`Comparer avant/après — ${label}`}
          className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent"
        />

        <span className="pointer-events-none absolute left-2 top-2 rounded-full bg-navy-900/70 px-2.5 py-1 text-xs font-semibold text-white">
          Avant
        </span>
        <span className="pointer-events-none absolute right-2 top-2 rounded-full bg-sky-500/90 px-2.5 py-1 text-xs font-semibold text-white">
          Après
        </span>
      </div>
      <p className="mt-3 text-center text-sm font-medium text-navy-800">{label}</p>
    </div>
  );
}
