/** @type {import('next').NextConfig} */
const isGithubPagesBuild = process.env.GITHUB_PAGES === "true";

// Ces deux réglages ne s'activent que pour l'aperçu automatique publié sur
// GitHub Pages (voir .github/workflows/deploy-pages.yml), qui a besoin d'un
// export purement statique. En local (npm run dev) et lors d'un déploiement
// sur Vercel (méthode recommandée, voir README.md), ces variables ne sont
// pas définies et le site tourne normalement.
const nextConfig = {
  reactStrictMode: true,
  ...(isGithubPagesBuild && {
    output: "export",
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
    images: { unoptimized: true },
  }),
};

module.exports = nextConfig;
