"use client";

import { formulas, vehicleSizes } from "@/content/site-data";
import { useSelection } from "@/context/SelectionContext";
import { formatPriceBreakdownText, getActiveAddons, getPriceBreakdown } from "@/lib/pricing";
import { Container } from "./ui/Container";
import { FadeIn } from "./ui/FadeIn";
import { SectionHeading } from "./ui/SectionHeading";

export function Simulateur() {
  const { selection, setVehicleModel, setSize, setFormula, toggleAddon } = useSelection();
  const activeAddons = getActiveAddons();
  const breakdown = getPriceBreakdown(selection.formula, selection.size, selection.addonIds);

  return (
    <section id="simulateur" className="bg-white py-20 sm:py-28">
      <Container className="max-w-4xl">
        <SectionHeading
          eyebrow="Simulateur"
          title="Obtenez votre prix exact en quelques clics"
          subtitle="Sélectionnez votre véhicule, votre formule et vos options : le prix se met à jour instantanément."
        />

        <FadeIn delay={0.1}>
          <div className="mt-12 space-y-10 rounded-3xl border border-navy-900/10 bg-navy-50/50 p-6 sm:p-10">
            {/* 1. Modèle du véhicule */}
            <div>
              <label htmlFor="vehicleModel" className="block text-sm font-semibold text-navy-900">
                1. Modèle de votre véhicule{" "}
                <span className="font-normal text-navy-700/70">(facultatif, pour préparer l&apos;intervention)</span>
              </label>
              <input
                id="vehicleModel"
                type="text"
                value={selection.vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                placeholder="Ex : Peugeot 208"
                className="mt-3 w-full rounded-xl border border-navy-900/15 bg-white px-4 py-3 text-navy-900 placeholder:text-navy-400 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-200"
              />
            </div>

            {/* 2. Taille du véhicule */}
            <div>
              <p className="text-sm font-semibold text-navy-900">
                2. Taille de votre véhicule{" "}
                <span className="font-normal text-navy-700/70">
                  (même prix pour tous les véhicules, utile pour préparer l&apos;intervention)
                </span>
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {vehicleSizes.map((size) => (
                  <button
                    key={size.id}
                    type="button"
                    onClick={() => setSize(size.id)}
                    className={`rounded-xl border p-4 text-left transition-colors ${
                      selection.size === size.id
                        ? "border-navy-900 bg-navy-900 text-white"
                        : "border-navy-900/15 bg-white text-navy-900 hover:border-navy-400"
                    }`}
                  >
                    <span className="block font-semibold">{size.label}</span>
                    <span
                      className={`mt-1 block text-xs ${
                        selection.size === size.id ? "text-white/70" : "text-navy-700/70"
                      }`}
                    >
                      {size.examples}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Formule */}
            <div>
              <p className="text-sm font-semibold text-navy-900">3. Formule</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {formulas.map((formula) => (
                  <button
                    key={formula.id}
                    type="button"
                    onClick={() => setFormula(formula.id)}
                    className={`rounded-xl border p-4 text-left transition-colors ${
                      selection.formula === formula.id
                        ? "border-navy-900 bg-navy-900 text-white"
                        : "border-navy-900/15 bg-white text-navy-900 hover:border-navy-400"
                    }`}
                  >
                    <span className="block font-semibold">{formula.name}</span>
                    <span
                      className={`mt-1 block text-xs ${
                        selection.formula === formula.id ? "text-white/70" : "text-navy-700/70"
                      }`}
                    >
                      {formula.tagline}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Suppléments */}
            {activeAddons.length > 0 ? (
              <div>
                <p className="text-sm font-semibold text-navy-900">4. Suppléments (optionnels)</p>
                <div className="mt-3 space-y-2">
                  {activeAddons.map((addon) => (
                    <label
                      key={addon.id}
                      className="flex cursor-pointer items-center justify-between rounded-xl border border-navy-900/15 bg-white px-4 py-3 text-sm"
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selection.addonIds.includes(addon.id)}
                          onChange={() => toggleAddon(addon.id)}
                          className="h-4 w-4 rounded border-navy-300 text-navy-900 focus:ring-navy-500"
                        />
                        <span className="text-navy-800">{addon.label}</span>
                      </span>
                      <span className="font-semibold text-navy-900">+{addon.price} €</span>
                    </label>
                  ))}
                </div>
              </div>
            ) : null}

            {/* 5 & 6. Prix + CTA */}
            <div className="rounded-2xl bg-navy-900 p-6 text-white sm:p-8">
              {breakdown.isComplete ? (
                <>
                  <p className="text-sm text-white/70">{formatPriceBreakdownText(breakdown)}</p>
                  <p className="mt-2 font-display text-4xl font-bold">{breakdown.total} €</p>
                </>
              ) : (
                <p className="text-white/80">
                  Sélectionnez une taille de véhicule et une formule pour afficher le prix.
                </p>
              )}

              <div className="mt-6">
                {breakdown.isComplete ? (
                  <a
                    href="#reservation"
                    className="inline-flex w-full items-center justify-center rounded-full bg-white px-7 py-3.5 text-base font-semibold text-navy-900 transition-colors hover:bg-sky-50 sm:w-auto"
                  >
                    Réserver ce prix
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-full bg-white/30 px-7 py-3.5 text-base font-semibold text-white/60 sm:w-auto"
                  >
                    Réserver ce prix
                  </button>
                )}
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
