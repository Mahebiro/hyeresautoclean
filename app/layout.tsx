import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CookieConsent } from "@/components/CookieConsent";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SelectionProvider } from "@/context/SelectionContext";
import { company, faq, formulas, seo, serviceCities } from "@/content/site-data";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(company.website),
  title: {
    default: seo.title,
    template: seo.titleTemplate,
  },
  description: seo.description,
  keywords: seo.keywords,
  alternates: {
    canonical: company.website,
  },
  // L'aperçu GitHub Pages ne doit pas être indexé : seul le vrai domaine
  // (une fois en ligne sur Vercel) doit apparaître dans les résultats Google.
  robots:
    process.env.GITHUB_PAGES === "true"
      ? { index: false, follow: false }
      : { index: true, follow: true },
  openGraph: {
    title: seo.title,
    description: seo.description,
    url: company.website,
    siteName: company.name,
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const allPrices = formulas.map((formula) => formula.priceFrom);
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const areaServed = serviceCities.map((cityName) => ({ "@type": "City", name: cityName }));

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoWash",
    name: company.name,
    description: seo.description,
    areaServed,
    telephone: company.phone,
    email: company.email,
    url: company.website,
    image: `${company.website}/images/logo/logo.jpg`,
    priceRange: `${minPrice}€–${maxPrice}€`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Hyères",
      addressRegion: "Var",
      addressCountry: "FR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 43.1198,
      longitude: 6.1286,
    },
    sameAs: [company.instagramUrl],
    makesOffer: formulas.map((formula) => ({
      "@type": "Offer",
      name: `Formule ${formula.name} — Nettoyage intérieur automobile`,
      description: formula.tagline,
      priceCurrency: "EUR",
      price: formula.priceFrom,
      url: `${company.website}/#formules`,
      areaServed,
    })),
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <html lang="fr">
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <SelectionProvider>
          <Header />
          {children}
          <Footer />
        </SelectionProvider>
        <CookieConsent />
      </body>
    </html>
  );
}
