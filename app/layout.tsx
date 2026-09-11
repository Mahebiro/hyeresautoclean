import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SelectionProvider } from "@/context/SelectionContext";
import { company, seo } from "@/content/site-data";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(company.website),
  title: {
    default: seo.title,
    template: seo.titleTemplate,
  },
  description: seo.description,
  keywords: seo.keywords,
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: company.name,
    description: seo.description,
    areaServed: company.zone,
    telephone: company.phone,
    email: company.email,
    url: company.website,
    image: `${company.website}/images/logo/logo-placeholder.svg`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Hyères",
      addressRegion: "Provence-Alpes-Côte d'Azur",
      addressCountry: "FR",
    },
    sameAs: [company.instagramUrl],
  };

  return (
    <html lang="fr">
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SelectionProvider>
          <Header />
          {children}
          <Footer />
        </SelectionProvider>
      </body>
    </html>
  );
}
