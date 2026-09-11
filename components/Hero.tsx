import Image from "next/image";
import { company } from "@/content/site-data";
import { Button } from "./ui/Button";
import { Container } from "./ui/Container";
import { FadeIn } from "./ui/FadeIn";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-navy-950">
      <div className="absolute inset-0">
        <Image
          src="/images/hero/hero-placeholder.svg"
          alt="Intérieur de voiture propre après un nettoyage Hyères Auto Clean"
          fill
          priority
          unoptimized
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/70 via-navy-950/70 to-navy-950" />
      </div>

      <Container className="relative flex min-h-[85vh] flex-col items-center justify-center py-24 text-center sm:min-h-[90vh]">
        <FadeIn>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
            {company.zone}
          </p>
        </FadeIn>
        <FadeIn delay={0.05}>
          <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-6xl">
            {company.name}
          </h1>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="mt-5 max-w-xl text-lg text-white/85 sm:text-xl">{company.activity}</p>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="mt-3 font-display text-xl italic text-sky-300">« {company.slogan} »</p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button href="#reservation" size="lg">
              Réserver un nettoyage
            </Button>
            <Button href="#formules" variant="outlineLight" size="lg">
              Découvrir nos formules
            </Button>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
