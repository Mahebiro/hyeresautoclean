import { whyUs } from "@/content/site-data";
import { Container } from "./ui/Container";
import { FadeIn } from "./ui/FadeIn";
import { SectionHeading } from "./ui/SectionHeading";

const icons = [HomeIcon, DetailIcon, SearchIcon, ClickIcon];

export function PourquoiNous() {
  return (
    <section className="bg-navy-50/60 py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Pourquoi nous" title="Pourquoi choisir Hyères Auto Clean ?" />

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {whyUs.map((item, index) => {
            const Icon = icons[index] ?? HomeIcon;
            return (
              <FadeIn key={item.title} delay={index * 0.08}>
                <div className="flex h-full flex-col items-start rounded-2xl border border-navy-900/10 bg-white p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-white">
                    <Icon />
                  </div>
                  <h3 className="mt-5 font-display font-bold text-navy-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-700/80">{item.description}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 11l8-7 8 7M6 10v9h12v-9" />
    </svg>
  );
}

function DetailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
    </svg>
  );
}

function ClickIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l4-4 8 3-3.5 1.5L19 16l-2 2-2.5-2.5L13 19l-3-8-1 1z"
      />
    </svg>
  );
}
