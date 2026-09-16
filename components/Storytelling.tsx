import Image from "next/image";
import { storytelling } from "@/content/site-data";
import { withBasePath } from "@/lib/basePath";
import { Container } from "./ui/Container";
import { FadeIn } from "./ui/FadeIn";

export function Storytelling() {
  return (
    <section id="histoire" className="bg-white py-20 sm:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <FadeIn>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl shadow-premium">
              <Image
                src={withBasePath("/images/mahe/mahe-biro.jpg")}
                alt="Mahé Biro, fondateur de Hyères Auto Clean"
                fill
                className="object-cover"
              />
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">
              Mon histoire
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
              {storytelling.title}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-navy-700/85">{storytelling.paragraph}</p>
            <p className="mt-6 font-display font-semibold text-navy-900">— {storytelling.author}</p>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
