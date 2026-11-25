import { company } from "@/content/site-data";
import { withBasePath } from "@/lib/basePath";
import { Button } from "./ui/Button";
import { Container } from "./ui/Container";

// Photo du hero, déclinée en trois largeurs (WebP) : le navigateur choisit
// la plus adaptée à l'écran. Pour la remplacer, déposez vos fichiers dans
// public/images/hero/ avec les mêmes noms (ou changez les chemins ici).
const HERO_IMAGES = [
  { src: "/images/hero/hero-interieur-480.webp", width: 480 },
  { src: "/images/hero/hero-interieur-720.webp", width: 720 },
  { src: "/images/hero/hero-interieur-960.webp", width: 960 },
];

/**
 * Haut de page : photo à gauche et nom de l'entreprise à droite sur
 * ordinateur, empilés et centrés sur mobile. Sans animation ni vidéo, pour
 * un affichage immédiat.
 */
export function Hero() {
  const srcSet = HERO_IMAGES.map((image) => `${withBasePath(image.src)} ${image.width}w`).join(", ");

  return (
    <section
      id="top"
      data-header-overlay
      className="relative overflow-hidden bg-gradient-to-b from-[#0f0f0f] to-[#2a2a2a]"
      style={{ marginTop: "calc(-1 * var(--header-h))" }}
    >
      <Container className="flex min-h-[100svh] flex-col items-center justify-center gap-8 pb-14 pt-[calc(var(--header-h)+1.5rem)] md:flex-row md:gap-14 lg:gap-20">
        <div className="relative w-[52vw] max-w-[230px] shrink-0 md:w-[340px] md:max-w-none lg:w-[380px]">
          <div aria-hidden="true" className="absolute -inset-6 rounded-[2.5rem] bg-sky-300/10 blur-3xl" />
          {/* eslint-disable-next-line @next/next/no-img-element -- srcSet WebP préparé à la main (export statique) */}
          <img
            src={withBasePath(HERO_IMAGES[1].src)}
            srcSet={srcSet}
            sizes="(min-width: 1024px) 380px, (min-width: 768px) 340px, 52vw"
            width={720}
            height={1278}
            alt="Intérieur d'un véhicule : nettoyage intérieur automobile à domicile par Hyères Auto Clean"
            fetchPriority="high"
            decoding="async"
            className="relative aspect-[4/5] w-full rounded-3xl border border-white/10 object-cover shadow-2xl"
          />
        </div>

        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300 sm:text-sm">
            {company.zone}
          </p>
          <h1 className="mt-4 font-display text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {company.name}
          </h1>
          <p className="mt-4 text-sm font-medium uppercase tracking-widest text-neutral-300">
            {company.activity}
          </p>
          <p className="mt-6 max-w-md text-xl text-neutral-100 sm:text-2xl">{company.slogan}</p>
          <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <Button href="#reservation" size="lg">
              Réserver
            </Button>
            <Button href="#formules" variant="secondary" size="lg">
              Voir les formules
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
