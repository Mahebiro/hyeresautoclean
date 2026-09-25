"use client";

import Image from "next/image";
import { useState } from "react";
import { beforeAfterItems, galleryItems } from "@/content/site-data";
import { withBasePath } from "@/lib/basePath";
import { Container } from "./ui/Container";
import { FadeIn } from "./ui/FadeIn";
import { SectionHeading } from "./ui/SectionHeading";

export function Galerie() {
  return (
    <section id="galerie" className="bg-navy-50/60 py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Réalisations" title="Le résultat en images" />

        <div className="mx-auto mt-14 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item, index) => (
            <FadeIn key={item.id} delay={index * 0.1}>
              <div className="overflow-hidden rounded-2xl border border-navy-900/10 shadow-sm">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={withBasePath(item.image)}
                    alt={`Nettoyage intérieur automobile à domicile à Hyères et Toulon — ${item.label}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="bg-white py-3 text-center text-sm font-medium text-navy-800">
                  {item.label}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.15}>
          <div className="mx-auto mt-20 max-w-5xl text-center">
            <h3 className="font-display text-xl font-bold text-navy-900">Avant / après</h3>
            <p className="mt-2 text-sm text-navy-700/80">
              Faites glisser le curseur pour comparer l&apos;avant et l&apos;après.
            </p>
          </div>
        </FadeIn>

        <div className="mx-auto mt-8 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {beforeAfterItems.map((item, index) => (
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
        <Image
          src={withBasePath(after)}
          alt={`Nettoyage intérieur automobile à domicile à Hyères et Toulon — ${label}, après`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <Image
            src={withBasePath(before)}
            alt={`Nettoyage intérieur automobile à domicile à Hyères et Toulon — ${label}, avant`}
            fill
            className="object-cover"
          />
        </div>

        <div className="absolute inset-y-0 w-0.5 bg-white shadow" style={{ left: `${position}%` }} />

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
