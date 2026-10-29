import { beforeAfterItems } from "@/content/site-data";
import { BeforeAfterSlider } from "./ui/BeforeAfterSlider";
import { Container } from "./ui/Container";
import { FadeIn } from "./ui/FadeIn";
import { ReservationCta } from "./ui/ReservationCta";
import { SectionHeading } from "./ui/SectionHeading";

export function Galerie() {
  return (
    <section id="galerie" className="bg-navy-50/60 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Réalisations"
          title="Avant / après"
          subtitle="Faites glisser chaque photo pour voir la différence."
        />

        <div className="mx-auto mt-14 grid max-w-6xl gap-8 sm:grid-cols-3">
          {beforeAfterItems.map((item, index) => (
            <FadeIn key={item.id} delay={index * 0.1}>
              <div className="overflow-hidden rounded-2xl border border-navy-900/10 bg-white shadow-sm">
                <BeforeAfterSlider
                  before={item.before}
                  after={item.after}
                  alt={item.label}
                  sizes="(min-width: 640px) 33vw, 100vw"
                />
              </div>
            </FadeIn>
          ))}
        </div>

        <ReservationCta text="Votre voiture mérite le même résultat." />
      </Container>
    </section>
  );
}
