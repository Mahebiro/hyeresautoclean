import Image from "next/image";
import { beforeAfterItems } from "@/content/site-data";
import { withBasePath } from "@/lib/basePath";
import { Container } from "./ui/Container";
import { FadeIn } from "./ui/FadeIn";
import { ReservationCta } from "./ui/ReservationCta";
import { SectionHeading } from "./ui/SectionHeading";

export function Galerie() {
  return (
    <section id="galerie" className="bg-navy-50/60 py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Réalisations" title="Avant / après" />

        <div className="mx-auto mt-14 grid max-w-6xl gap-8 sm:grid-cols-3">
          {beforeAfterItems.map((item, index) => (
            <FadeIn key={item.id} delay={index * 0.1}>
              <div className="overflow-hidden rounded-2xl border border-navy-900/10 bg-white shadow-sm">
                <div className="grid grid-cols-2 gap-px bg-navy-900/10">
                  <div className="relative aspect-[4/5] w-full bg-white">
                    <Image
                      src={withBasePath(item.before)}
                      alt={`${item.label} — avant le nettoyage intérieur par Hyères Auto Clean`}
                      fill
                      sizes="(min-width: 640px) 16vw, 50vw"
                      className="object-cover"
                    />
                    <span className="absolute left-2 top-2 rounded-full bg-navy-900/80 px-2.5 py-1 text-xs font-semibold text-white">
                      Avant
                    </span>
                  </div>
                  <div className="relative aspect-[4/5] w-full bg-white">
                    <Image
                      src={withBasePath(item.after)}
                      alt={`${item.label} — après le nettoyage intérieur par Hyères Auto Clean`}
                      fill
                      sizes="(min-width: 640px) 16vw, 50vw"
                      className="object-cover"
                    />
                    <span className="absolute left-2 top-2 rounded-full bg-sky-500 px-2.5 py-1 text-xs font-semibold text-white">
                      Après
                    </span>
                  </div>
                </div>
                <p className="py-3 text-center text-sm font-medium text-navy-800">{item.label}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <ReservationCta text="Votre voiture mérite le même résultat." />
      </Container>
    </section>
  );
}
