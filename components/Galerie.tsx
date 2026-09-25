import Image from "next/image";
import { galleryItems } from "@/content/site-data";
import { withBasePath } from "@/lib/basePath";
import { Container } from "./ui/Container";
import { FadeIn } from "./ui/FadeIn";
import { ReservationCta } from "./ui/ReservationCta";
import { SectionHeading } from "./ui/SectionHeading";

export function Galerie() {
  return (
    <section id="galerie" className="bg-navy-50/60 py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Réalisations" title="Le résultat en images" />

        <div className="mx-auto mt-14 grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {galleryItems.map((item, index) => (
            <FadeIn key={item.id} delay={index * 0.1}>
              <div className="overflow-hidden rounded-2xl border border-navy-900/10 shadow-sm">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={withBasePath(item.image)}
                    alt={`Nettoyage intérieur automobile à domicile à Hyères et Toulon — ${item.label}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="bg-white py-3 text-center text-sm font-medium text-navy-800">
                  {item.label}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        <ReservationCta text="Votre voiture mérite le même résultat." />
      </Container>
    </section>
  );
}
