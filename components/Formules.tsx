"use client";

import { addons, formulas, type FormulaId } from "@/content/site-data";
import { useSelection } from "@/context/SelectionContext";
import { Button } from "./ui/Button";
import { Container } from "./ui/Container";
import { FadeIn } from "./ui/FadeIn";
import { SectionHeading } from "./ui/SectionHeading";

export function Formules() {
  const { setFormula } = useSelection();
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
              <FormulaCard formula={formula} onChoose={() => setFormula(formula.id)} />
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

  return (
    <div
      className={`relative flex h-full flex-col rounded-3xl border p-8 ${
        isPremium
          ? "border-navy-900 bg-navy-900 text-white shadow-premium lg:scale-105"
          : "border-navy-900/10 bg-white text-navy-900"
      }`}
    >
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
        <span className="font-display text-4xl font-bold">{formula.priceFrom} €</span>
      </p>

      <ul className="mt-6 flex-1 space-y-3">
        {formula.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm">
            <CheckIcon className={isPremium ? "text-sky-300" : "text-sky-600"} />
            <span className={isPremium ? "text-white/90" : "text-navy-800"}>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8">
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
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
