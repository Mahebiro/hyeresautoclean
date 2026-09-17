import type { MetadataRoute } from "next";
import { company } from "@/content/site-data";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // L'aperçu publié sur GitHub Pages (voir .github/workflows/deploy-pages.yml)
  // ne doit jamais être indexé par les moteurs de recherche : seul le vrai
  // domaine (hyeresautoclean.com, une fois déployé sur Vercel) doit apparaître
  // dans Google, pour éviter tout contenu dupliqué.
  if (process.env.GITHUB_PAGES === "true") {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${company.website}/sitemap.xml`,
  };
}
