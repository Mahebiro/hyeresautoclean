import Image from "next/image";
import { storytelling } from "@/content/site-data";
import { withBasePath } from "@/lib/basePath";
import { Container } from "./ui/Container";
import { SplitHeading } from "./motion/SplitHeading";
import { FadeIn } from "./ui/FadeIn";

export function Storytelling() {
  return (
    <section id="histoire" className="bg-white py-20 sm:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <FadeIn>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl shadow-premium">
              <Image
                src={withBasePath("/images/mahe/mahe-biro.png")}
                alt="Mahé Biro, fondateur de Hyères Auto Clean"
                fill
                className="object-cover"
              />
            </div>
          </FadeIn>

          <div>
            <FadeIn delay={0.1}>
              <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">
                Mon histoire
              </p>
            </FadeIn>
            <SplitHeading className="mt-3 font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
              {storytelling.title}
            </SplitHeading>
            <FadeIn delay={0.2}>
              <p className="mt-6 text-lg leading-relaxed text-navy-700/85">{storytelling.paragraph}</p>
              <p className="mt-6 font-display font-semibold text-navy-900">— {storytelling.author}</p>
            </FadeIn>
          </div>
        </div>
      </Container>
    </section>
  );
}
