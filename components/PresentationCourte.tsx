import { Container } from "./ui/Container";
import { SplitHeading } from "./motion/SplitHeading";
import { FadeIn } from "./ui/FadeIn";

export function PresentationCourte() {
  return (
    <section className="bg-[#0f0f0f] py-20 sm:py-28">
      <Container className="max-w-3xl text-center">
        <SplitHeading className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Un intérieur propre et agréable, sans bouger de chez vous.
        </SplitHeading>
        <FadeIn delay={0.1}>
          <p className="mt-6 text-lg leading-relaxed text-neutral-300">
            Je me déplace directement chez vous, à Hyères, à Toulon et dans les environs, pour
            nettoyer l&apos;intérieur de votre véhicule pendant que vous restez chez vous. Deux
            formules à prix clair, une intervention rapide, et un habitacle propre et agréable à
            retrouver au quotidien. Pas de promesse en l&apos;air : uniquement du nettoyage
            intérieur automobile, réalisé sérieusement.
          </p>
        </FadeIn>
      </Container>
    </section>
  );
}
