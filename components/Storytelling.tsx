import { storytelling } from "@/content/site-data";
import { Container } from "./ui/Container";
import { FadeIn } from "./ui/FadeIn";

export function Storytelling() {
  return (
    <section id="histoire" className="bg-white py-20 sm:py-28">
      <Container className="max-w-2xl text-center">
        <FadeIn>
          <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">
            Mon histoire
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            {storytelling.title}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-navy-700/85">{storytelling.paragraph}</p>
          <p className="mt-6 font-display font-semibold text-navy-900">— {storytelling.author}</p>
        </FadeIn>
      </Container>
    </section>
  );
}
