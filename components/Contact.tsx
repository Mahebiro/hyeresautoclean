import type { ReactNode } from "react";
import { company, serviceCities } from "@/content/site-data";
import { Container } from "./ui/Container";
import { FadeIn } from "./ui/FadeIn";
import { ReservationCta } from "./ui/ReservationCta";
import { SectionHeading } from "./ui/SectionHeading";

export function Contact() {
  const items = [
    {
      label: "Téléphone",
      value: company.phone,
      href: company.phoneHref,
      icon: <PhoneIcon />,
    },
    {
      label: "Email",
      value: company.email,
      href: `mailto:${company.email}`,
      icon: <MailIcon />,
    },
    {
      label: "Instagram",
      value: company.instagramHandle,
      href: company.instagramUrl,
      icon: <InstaIcon />,
      external: true,
    },
    {
      label: "Zone d'intervention",
      value: serviceCities.join(", "),
      icon: <PinIcon />,
    },
  ];

  return (
    <section id="contact" className="bg-navy-50/60 py-20 sm:py-28">
      <Container className="max-w-4xl">
        <SectionHeading eyebrow="Contact" title="Une question ? Contactez-moi directement" />

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {items.map((item, index) => (
            <FadeIn key={item.label} delay={index * 0.08}>
              <ContactCard {...item} />
            </FadeIn>
          ))}
        </div>

        <ReservationCta text="Ou passez directement à l'action." />
      </Container>
    </section>
  );
}

function ContactCard({
  label,
  value,
  href,
  icon,
  external,
}: {
  label: string;
  value: string;
  href?: string;
  icon: ReactNode;
  external?: boolean;
}) {
  const content = (
    <div className="flex items-center gap-4 rounded-2xl border border-navy-900/10 bg-white p-5 transition-colors hover:border-navy-400">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-white">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">{label}</p>
        <p className="font-semibold text-navy-900">{value}</p>
      </div>
    </div>
  );

  if (!href) return content;

  return (
    <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
      {content}
    </a>
  );
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 5c0 8.284 6.716 15 15 15l3-3-5-4-2 2c-2.5-1-4.5-3-5.5-5.5l2-2-4-5-3 3z"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9 6 9-6" />
    </svg>
  );
}

function InstaIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s-7-6.2-7-11a7 7 0 1114 0c0 4.8-7 11-7 11z"
      />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
