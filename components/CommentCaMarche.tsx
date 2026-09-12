import { steps } from "@/content/site-data";
import { Container } from "./ui/Container";
import { FadeIn } from "./ui/FadeIn";
import { SectionHeading } from "./ui/SectionHeading";

const icons = [ChecklistIcon, CalendarIcon, VanIcon];

export function CommentCaMarche() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Étapes" title="Comment ça marche ?" />

        {/* Version desktop : timeline horizontale connectée */}
        <div className="relative mt-16 hidden sm:grid sm:grid-cols-3 sm:gap-8">
          <div
            className="absolute top-8 h-0.5 bg-navy-200"
            style={{ left: "16.666%", right: "16.666%" }}
          />
          {steps.map((step, index) => {
            const Icon = icons[index] ?? ChecklistIcon;
            return (
              <FadeIn key={step.number} delay={index * 0.1}>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-navy-900 text-white shadow-premium">
                    <Icon />
                    <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-sky-400 text-xs font-bold text-navy-950">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold text-navy-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-[22ch] text-sm leading-relaxed text-navy-700/80">
                    {step.description}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* Version mobile : timeline verticale */}
        <div className="mt-12 sm:hidden">
          {steps.map((step, index) => {
            const Icon = icons[index] ?? ChecklistIcon;
            const isLast = index === steps.length - 1;
            return (
              <FadeIn key={step.number} delay={index * 0.08}>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center self-stretch">
                    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-navy-900 text-white">
                      <Icon />
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-sky-400 text-[10px] font-bold text-navy-950">
                        {step.number}
                      </span>
                    </div>
                    {!isLast ? <div className="my-2 w-0.5 flex-1 bg-navy-200" /> : null}
                  </div>
                  <div className={isLast ? "pb-0" : "pb-8"}>
                    <h3 className="pt-3 font-display text-base font-bold text-navy-900">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-navy-700/80">
                      {step.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function ChecklistIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l1.5 1.5L13.5 7M9 15h6" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path strokeLinecap="round" d="M4 10h16M8 3v4M16 3v4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l2 2 4-4" />
    </svg>
  );
}

function VanIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16V8a1 1 0 011-1h9l4 4v5a1 1 0 01-1 1H4a1 1 0 01-1-1z"
      />
      <circle cx="8" cy="17" r="1.6" />
      <circle cx="16.5" cy="17" r="1.6" />
    </svg>
  );
}
