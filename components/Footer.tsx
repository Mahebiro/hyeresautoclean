import Link from "next/link";
import { company } from "@/content/site-data";
import { Container } from "./ui/Container";

const footerLinks = [
  { href: "#top", label: "Accueil" },
  { href: "#formules", label: "Formules" },
  { href: "#simulateur", label: "Simulateur" },
  { href: "#reservation", label: "Réservation" },
  { href: "#galerie", label: "Réalisations" },
  { href: "#histoire", label: "À propos" },
  { href: "#contact", label: "Contact" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-white/70">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold text-white">{company.name}</p>
          <p className="mt-2 text-sm">{company.activity}</p>
          <p className="mt-1 text-sm italic text-sky-300">« {company.slogan} »</p>
          <p className="mt-1 text-sm">{company.zone}</p>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">
            Navigation
          </p>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">Contact</p>
          <ul className="space-y-2 text-sm">
            <li>
              <a href={company.phoneHref} className="flex items-center gap-2 transition-colors hover:text-white">
                <PhoneIcon /> {company.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${company.email}`}
                className="flex items-center gap-2 transition-colors hover:text-white"
              >
                <MailIcon /> {company.email}
              </a>
            </li>
            <li>
              <a
                href={company.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-white"
              >
                <InstaIcon /> {company.instagramHandle}
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs sm:flex-row">
          <p>
            © {year} {company.name}. Tous droits réservés.
          </p>
          <Link href="/mentions-legales" className="hover:text-white">
            Mentions légales
          </Link>
        </Container>
      </div>
    </footer>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9 6 9-6" />
    </svg>
  );
}

function InstaIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
