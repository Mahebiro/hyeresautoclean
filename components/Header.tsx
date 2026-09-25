"use client";

import { useState } from "react";
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

  return (
    <header className="sticky top-0 z-50 border-b border-navy-900/10 bg-white/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between sm:h-20">
        <a href="#top" className="flex items-center gap-2.5">
          <Image
            src={withBasePath("/images/logo/logo.jpg")}
            alt="Logo Hyères Auto Clean"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <span className="font-display text-sm font-bold tracking-wide text-navy-900 sm:text-base">
            {company.name}
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-navy-700 transition-colors hover:text-navy-900"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button href="#reservation" size="md" className="hidden sm:inline-flex">
            Réserver
          </Button>
          <button
            aria-label="Ouvrir le menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-navy-900/15 text-navy-900 lg:hidden"
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
