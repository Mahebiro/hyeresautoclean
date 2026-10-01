import { SplitHeading } from "../motion/SplitHeading";
import { FadeIn } from "./FadeIn";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  light?: boolean;
}) {
  const alignClasses = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-2xl ${alignClasses}`}>
      {eyebrow ? (
        <FadeIn>
          <p
            className={`mb-3 text-sm font-semibold uppercase tracking-widest ${
              light ? "text-sky-300" : "text-sky-600"
            }`}
          >
            {eyebrow}
          </p>
        </FadeIn>
      ) : null}
      <SplitHeading
        className={`font-display text-3xl font-bold tracking-tight sm:text-4xl ${
          light ? "text-white" : "text-navy-900"
        }`}
      >
        {title}
      </SplitHeading>
      {subtitle ? (
        <FadeIn delay={0.15}>
          <p className={`mt-4 text-lg ${light ? "text-white/80" : "text-navy-700/80"}`}>{subtitle}</p>
        </FadeIn>
      ) : null}
    </div>
  );
}
