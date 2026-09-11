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
    <FadeIn>
      <div className={`max-w-2xl ${alignClasses}`}>
        {eyebrow ? (
          <p
            className={`mb-3 text-sm font-semibold uppercase tracking-widest ${
              light ? "text-sky-300" : "text-sky-600"
            }`}
          >
            {eyebrow}
          </p>
        ) : null}
        <h2
          className={`font-display text-3xl font-bold tracking-tight sm:text-4xl ${
            light ? "text-white" : "text-navy-900"
          }`}
        >
          {title}
        </h2>
        {subtitle ? (
          <p className={`mt-4 text-lg ${light ? "text-white/80" : "text-navy-700/80"}`}>{subtitle}</p>
        ) : null}
      </div>
    </FadeIn>
  );
}
