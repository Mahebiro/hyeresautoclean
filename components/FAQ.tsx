"use client";

import { useState } from "react";
import { faq } from "@/content/site-data";
import { Container } from "./ui/Container";
import { FadeIn } from "./ui/FadeIn";
import { ReservationCta } from "./ui/ReservationCta";
import { SectionHeading } from "./ui/SectionHeading";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-[#0f0f0f] py-20 sm:py-28">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="Questions fréquentes" title="Foire aux questions" />

        {/* La liste apparaît d'un seul bloc : chaque question est toujours
            visible et cliquable, quelle que soit sa position à l'écran. */}
        <FadeIn>
          <div className="mt-12 divide-y divide-white/10 rounded-2xl border border-white/10">
            {faq.map((item, index) => {
              const isOpen = openIndex === index;
              const answerId = `faq-reponse-${index}`;
              return (
                <div key={item.question}>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    >
                      <span className="font-semibold text-white">{item.question}</span>
                      <span
                        className={`shrink-0 text-neutral-400 transition-transform ${isOpen ? "rotate-45" : ""}`}
                      >
                        <PlusIcon />
                      </span>
                    </button>
                    <p
                      id={answerId}
                      hidden={!isOpen}
                      className="px-6 pb-5 text-sm leading-relaxed text-neutral-300"
                    >
                      {item.answer}
                    </p>
                  </div>
              );
            })}
          </div>
        </FadeIn>

        <ReservationCta text="Une dernière question ? Réservez, je réponds au reste par téléphone." />
      </Container>
    </section>
  );
}

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" d="M12 5v14M5 12h14" />
    </svg>
  );
}
