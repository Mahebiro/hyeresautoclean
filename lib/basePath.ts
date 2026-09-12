// En usage normal (local, Vercel), le site est servi à la racine du domaine
// et cette variable est vide. Elle n'est définie que pour l'aperçu publié
// automatiquement sur GitHub Pages (voir .github/workflows/deploy-pages.yml),
// qui sert le site depuis un sous-dossier (ex : /hyeresautoclean).
// next/image ne préfixe pas automatiquement basePath sur les images non
// optimisées (nécessaire pour un export statique) : on l'ajoute donc ici.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function withBasePath(path: string): string {
  return `${basePath}${path}`;
}
