import { SplitHeading } from "../motion/SplitHeading";
import { FadeIn } from "./FadeIn";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  // Conservé pour compatibilité : le site est désormais entièrement sur fond
  // sombre, les titres sont toujours clairs.
  light?: boolean;
}) {
  const alignClasses = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-2xl ${alignClasses}`}>
      {eyebrow ? (
        <FadeIn>
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-sky-300">
            {eyebrow}
          </p>
        </FadeIn>
      ) : null}
      <SplitHeading
        className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
      >
        {title}
      </SplitHeading>
      {subtitle ? (
        <FadeIn delay={0.15}>
          <p className="mt-4 text-lg text-neutral-300">{subtitle}</p>
        </FadeIn>
      ) : null}
    </div>
  );
}
