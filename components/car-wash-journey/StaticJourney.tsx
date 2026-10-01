import Image from "next/image";
import { carWashJourney } from "@/content/site-data";
import { withBasePath } from "@/lib/basePath";
import { Button } from "../ui/Button";
import { Container } from "../ui/Container";
import { FadeIn } from "../ui/FadeIn";
import { SectionHeading } from "../ui/SectionHeading";

const img = (name: string) => withBasePath(`/images/car-wash-journey/${name}`);

// Version statique affichée quand l'utilisateur a activé "réduire les
// animations" (prefers-reduced-motion) : même message, sans scroll épinglé
// ni animation, avec du vrai texte HTML.
export function StaticJourney() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <Container className="max-w-4xl">
        <SectionHeading
          eyebrow={carWashJourney.eyebrow}
          title={carWashJourney.resultTitle}
          subtitle={carWashJourney.reducedMotion.description}
        />

        <FadeIn delay={0.1}>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-navy-900/10 bg-navy-50/60">
              <p className="px-5 pt-5 text-sm font-semibold uppercase tracking-wide text-navy-500">
                {carWashJourney.reducedMotion.beforeLabel}
              </p>
              <div className="relative mt-3 aspect-[5/2]">
                <Image
                  src={img("car-clean.webp")}
                  alt="Voiture avant le nettoyage, salie par le sable et le sel marin"
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-contain p-4"
                />
                <Image
                  src={img("car-dirt.webp")}
                  alt=""
                  aria-hidden
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-contain p-4"
                />
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-navy-900/10 bg-navy-50/60">
              <p className="px-5 pt-5 text-sm font-semibold uppercase tracking-wide text-navy-500">
                {carWashJourney.reducedMotion.afterLabel}
              </p>
              <div className="relative mt-3 aspect-[5/2]">
                <Image
                  src={img("car-clean.webp")}
                  alt="Voiture après le nettoyage par Hyères Auto Clean, propre et brillante"
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-contain p-4"
                />
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="mt-10 flex justify-center">
            <Button href="#reservation" size="lg">
              {carWashJourney.resultCta}
            </Button>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
