import { Container } from "./ui/Container";
import { FadeIn } from "./ui/FadeIn";

export function PresentationCourte() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <Container className="max-w-3xl text-center">
        <FadeIn>
          <h2 className="font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            Votre voiture mérite mieux qu&apos;un simple coup d&apos;aspirateur.
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="mt-6 text-lg leading-relaxed text-navy-700/85">
            Je me déplace directement chez vous pour redonner à l&apos;intérieur de votre véhicule
            toute son propreté, avec une méthode soignée et minutieuse. Pas de raccourci, pas de
            promesse en l&apos;air : uniquement du nettoyage intérieur, réalisé avec attention,
            pour un résultat qui se voit et se ressent à chaque trajet.
          </p>
        </FadeIn>
      </Container>
    </section>
  );
}
