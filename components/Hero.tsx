import { company, formulas } from "@/content/site-data";
import { avis, noteMoyenne } from "@/data/avis";
import { Button } from "./ui/Button";
import { Container } from "./ui/Container";

/**
 * Haut de page : le nom en grand, la phrase d'accroche et les deux boutons,
 * centrés. Une ligne de repères (prix, déplacement, note Google) complète
 * l'espace sans surcharger. Sans image ni animation : affichage immédiat.
 */
export function Hero() {
  const moyenne = noteMoyenne();
  const prix = formulas.map((formula) => `${formula.name} ${formula.priceFrom} €`).join(" · ");
  const reperes = [
    prix,
    "Je me déplace chez vous",
    moyenne !== null ? `${moyenne.toLocaleString("fr-FR")} ★ sur ${avis.length} avis Google` : null,
  ].filter((item): item is string => Boolean(item));

  return (
    <section
      id="top"
      data-header-overlay
      className="relative overflow-hidden bg-gradient-to-b from-[#0f0f0f] to-[#2a2a2a]"
      style={{ marginTop: "calc(-1 * var(--header-h))" }}
    >
      {/* Halo discret derrière le titre. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[min(900px,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-300/[0.07] blur-3xl"
      />

      <Container className="relative flex min-h-[88svh] flex-col items-center justify-center pb-16 pt-[calc(var(--header-h)+2rem)] text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300 sm:text-sm">
          {company.zone}
        </p>

        <h1 className="mt-5 font-display text-[2.6rem] font-black leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-8xl">
          {company.name}
        </h1>

        <p className="mt-4 text-xs font-medium uppercase tracking-widest text-neutral-300 sm:text-sm">
          {company.activity}
        </p>

        <p className="mt-6 max-w-xl text-lg text-neutral-100 sm:text-2xl">{company.slogan}</p>

        <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <Button href="#reservation" size="lg">
            Réserver
          </Button>
          <Button href="#formules" variant="secondary" size="lg">
            Voir les formules
          </Button>
        </div>

        <ul className="mt-12 flex flex-col items-center gap-2 text-sm text-neutral-300 sm:flex-row sm:gap-0">
          {reperes.map((item, index) => (
            <li key={item} className="flex items-center">
              {index > 0 ? (
                <span aria-hidden="true" className="mx-4 hidden h-1 w-1 rounded-full bg-white/30 sm:inline-block" />
              ) : null}
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
