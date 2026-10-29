"use client";

import Image from "next/image";
import { useState } from "react";
import { withBasePath } from "@/lib/basePath";

// Comparateur avant/après : on fait glisser (souris, doigt ou clavier une
// fois l'curseur dessus) pour révéler progressivement la photo "après".
// Le curseur natif <input type="range"> gère le glissé et l'accessibilité ;
// seul son rendu visuel est masqué au profit de la poignée dessinée ci-dessous.
export function BeforeAfterSlider({
  before,
  after,
  alt,
  sizes,
}: {
  before: string;
  after: string;
  alt: string;
  sizes?: string;
}) {
  const [percent, setPercent] = useState(50);

  return (
    <div className="relative aspect-[4/5] w-full select-none overflow-hidden rounded-2xl bg-white">
      <Image
        src={withBasePath(after)}
        alt={`${alt} — après le nettoyage intérieur par Hyères Auto Clean`}
        fill
        sizes={sizes}
        className="pointer-events-none object-cover"
      />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}>
        <Image
          src={withBasePath(before)}
          alt={`${alt} — avant le nettoyage intérieur par Hyères Auto Clean`}
          fill
          sizes={sizes}
          className="pointer-events-none object-cover"
        />
      </div>

      <span className="pointer-events-none absolute left-2 top-2 rounded-full bg-navy-900/80 px-2.5 py-1 text-xs font-semibold text-white">
        Avant
      </span>
      <span className="pointer-events-none absolute right-2 top-2 rounded-full bg-sky-500 px-2.5 py-1 text-xs font-semibold text-white">
        Après
      </span>

      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgba(10,23,48,0.15)]"
        style={{ left: `${percent}%` }}
      />
      <div
        className="pointer-events-none absolute top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy-900 shadow-premium"
        style={{ left: `${percent}%` }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
        </svg>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={percent}
        onChange={(event) => setPercent(Number(event.target.value))}
        aria-label={`Faire glisser pour comparer avant/après — ${alt}`}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
