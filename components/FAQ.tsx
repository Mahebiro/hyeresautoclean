"use client";

import { useState } from "react";
import { faq } from "@/content/site-data";
import { Container } from "./ui/Container";
import { FadeIn } from "./ui/FadeIn";
import { SectionHeading } from "./ui/SectionHeading";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white py-20 sm:py-28">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="Questions fréquentes" title="Foire aux questions" />

        <div className="mt-12 divide-y divide-navy-900/10 rounded-2xl border border-navy-900/10">
          {faq.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <FadeIn key={item.question} delay={index * 0.03}>
                <div>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-semibold text-navy-900">{item.question}</span>
                    <span
                      className={`shrink-0 text-navy-500 transition-transform ${isOpen ? "rotate-45" : ""}`}
                    >
                      <PlusIcon />
                    </span>
                  </button>
                  {isOpen ? (
                    <p className="px-6 pb-5 text-sm leading-relaxed text-navy-700/85">{item.answer}</p>
                  ) : null}
                </div>
              </FadeIn>
            );
          })}
        </div>
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
