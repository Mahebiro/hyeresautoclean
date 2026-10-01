"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { company } from "@/content/site-data";
import { withBasePath } from "@/lib/basePath";
import { Button } from "./ui/Button";
import { Container } from "./ui/Container";

const navLinks = [
  { href: "#formules", label: "Formules" },
  { href: "#galerie", label: "Réalisations" },
  { href: "#histoire", label: "À propos" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  // Au-dessus du hero sombre (élément marqué data-header-overlay), la barre
  // est transparente et se fond dans la scène ; elle redevient blanche dès
  // que la section suivante passe dessous.
  // Sur l'accueil, la page s'ouvre sur le hero : transparente dès le départ
  // (pas de flash blanc avant l'hydratation).
  const isHome = usePathname() === "/";
  const [overHero, setOverHero] = useState(isHome);

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-header-overlay]");
    if (!hero) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const headerHeight = document.querySelector("header")?.offsetHeight ?? 0;
      setOverHero(hero.getBoundingClientRect().bottom > headerHeight);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Menu mobile ouvert : on repasse en blanc pour la lisibilité.
  const transparent = overHero && !open;

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-500 ${
        transparent ? "border-transparent bg-transparent" : "border-navy-900/10 bg-white/90 backdrop-blur"
      }`}
    >
      <Container className="flex h-16 items-center justify-between sm:h-20">
        <a href="#top" className="flex items-center gap-2.5">
          <Image
            src={withBasePath("/images/logo/logo.jpg")}
            alt="Logo Hyères Auto Clean"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <span
            className={`font-display text-sm font-bold tracking-wide transition-colors duration-500 sm:text-base ${
              transparent ? "text-white" : "text-navy-900"
            }`}
          >
            {company.name}
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors duration-500 ${
                transparent ? "text-white/80 hover:text-white" : "text-navy-700 hover:text-navy-900"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button
            href="#reservation"
            size="md"
            variant={transparent ? "secondary" : "primary"}
            className="hidden sm:inline-flex"
          >
            Réserver
          </Button>
          <button
            aria-label="Ouvrir le menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-500 lg:hidden ${
              transparent ? "border-white/30 text-white" : "border-navy-900/15 text-navy-900"
            }`}
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </Container>

      {open ? (
        <div className="border-t border-navy-900/10 bg-white lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-navy-800 hover:bg-navy-50"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 px-3">
              <Button href="#reservation" size="md" className="w-full" onClick={() => setOpen(false)}>
                Réserver
              </Button>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
