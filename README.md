# Site HYÈRES AUTO CLEAN

Bienvenue ! Ce document explique, **sans jargon technique**, comment faire tourner votre site en local, comment modifier les textes/prix/photos, comment configurer l'envoi des demandes de réservation par email, et comment mettre le site en ligne.

Vous n'avez pas besoin de savoir coder pour suivre ce guide. Prenez votre temps, étape par étape.

---

## 0. Voir le site tout de suite (aperçu automatique)

Un aperçu du site est publié automatiquement sur **GitHub Pages** à chaque mise à jour de cette branche, pour que vous puissiez visualiser le résultat sans rien installer.

**Adresse de l'aperçu :** `https://mahebiro.github.io/hyeresautoclean/`

> ⚠️ Il y a une seule chose à activer, une seule fois, à la main (je ne peux pas le faire à votre place) : dans le repo GitHub → **Settings** → **Pages** → section "Build and deployment" → **Source : "GitHub Actions"**. Une fois ce réglage fait, l'adresse ci-dessus affichera le site dans les 1-2 minutes qui suivent (le temps que la publication se termine), et se mettra à jour automatiquement à chaque nouvelle modification poussée sur GitHub.

Cet aperçu GitHub Pages est uniquement pratique pour visualiser le site pendant que vous travaillez dessus. **Pour la mise en ligne définitive avec votre nom de domaine, utilisez Vercel** (voir section 6) : c'est la méthode prévue pour ce projet, plus complète et plus simple à faire évoluer.

---

## 1. Comprendre les grandes lignes

Le site est fait avec **Next.js** (un outil très utilisé pour créer des sites modernes) et se déploie facilement sur **Vercel**, un service gratuit (pour ce type de site) qui met votre site en ligne automatiquement à chaque modification que vous poussez sur GitHub — exactement comme vous le faisiez avec Framer.

Tout ce qui est **modifiable sans toucher au code** se trouve dans **un seul fichier** :

```
content/site-data.ts
```

C'est le fichier le plus important pour vous. Il contient :
- vos coordonnées (téléphone, email, Instagram) ;
- les deux formules (Essentiel / Premium) et leurs prestations ;
- la grille de prix par taille de véhicule ;
- les suppléments (poils d'animaux, etc.) ;
- les textes (présentation, histoire, FAQ...) ;
- les informations pour le référencement (SEO).

Vous pouvez ouvrir ce fichier directement sur GitHub (bouton crayon "Edit"), modifier une valeur entre guillemets, et valider ("Commit changes"). Vercel republiera automatiquement le site avec la modification, en général en 1 à 2 minutes.

---

## 2. Lancer le site en local (sur votre ordinateur)

Cette étape est utile si vous voulez voir vos modifications avant de les mettre en ligne, ou si quelqu'un doit faire des changements plus poussés pour vous.

1. Installez [Node.js](https://nodejs.org) (version 20 ou plus récente) si ce n'est pas déjà fait.
2. Ouvrez un terminal dans le dossier du projet.
3. Installez les dépendances (une seule fois, ou après chaque changement de version) :
   ```
   npm install
   ```
4. Lancez le site en local :
   ```
   npm run dev
   ```
5. Ouvrez votre navigateur à l'adresse : [http://localhost:3000](http://localhost:3000)

Le site se met à jour automatiquement à chaque modification de fichier.

Pour arrêter le serveur : `Ctrl + C` dans le terminal.

---

## 3. Modifier les textes, les prix et les formules

Tout se passe dans `content/site-data.ts`. Voici les sections principales :

### Vos coordonnées
```ts
export const company = {
  name: "HYÈRES AUTO CLEAN",
  phone: "06 98 24 92 82",
  email: "hyeresautoclean@gmail.com",
  instagramHandle: "@hyeres_auto_clean",
  ...
};
```

### Les formules (Essentiel / Premium)
```ts
export const formulas = [
  {
    id: "essentiel",
    name: "Essentiel",
    priceFrom: 55,
    features: [ "Aspiration complète de l'habitacle", ... ],
  },
  ...
];
```
Vous pouvez changer les textes, ajouter ou retirer une ligne de prestation (`features`), ou changer le prix affiché "à partir de" (`priceFrom`).

### La grille de prix par taille de véhicule
```ts
export const pricingGrid = {
  essentiel: { citadine: 55, berline: 65, suv: 75 },
  premium: { citadine: 95, berline: 105, suv: 115 },
};
```
Changez simplement les chiffres. Le simulateur et le formulaire de réservation se mettent à jour automatiquement, partout sur le site.

### Les suppléments
```ts
export const addons = [
  { id: "poils-habitacle-coffre", label: "Poils d'animaux — habitacle + coffre", price: 25, active: true },
  { id: "sable-terre", label: "Sable / terre incrustée", price: 20, active: false },
  ...
];
```
- `active: true` → le supplément est visible sur le site.
- `active: false` → le supplément existe dans le fichier mais n'est pas affiché.

Pour activer un supplément proposé (sable/terre, désodorisation, désinfection, cuir), passez simplement `active` à `true` une fois que vous avez validé son prix. Vous pouvez aussi ajouter une nouvelle ligne en suivant le même modèle, avec un `id` unique (sans espace ni accent).

### La FAQ
```ts
export const faq = [
  { question: "Où intervenez-vous ?", answer: "..." },
  ...
];
```
Ajoutez, modifiez ou supprimez des questions/réponses librement.

### Les textes SEO (référencement)
```ts
export const seo = {
  title: "...",
  description: "...",
  keywords: [...],
};
```
Le site est optimisé pour le référencement naturel autour de : nettoyage automobile, lavage intérieur, à domicile, Hyères, Toulon, Var. Le titre et la description sont repris automatiquement dans Google, sur les réseaux sociaux (partage) et dans les données structurées (`app/layout.tsx`) qui aident Google à comprendre votre activité, votre zone et vos prix. Si votre zone d'intervention change (par exemple si vous couvrez davantage de villes), pensez à mettre à jour `company.zone` dans ce même fichier, la FAQ "Où intervenez-vous ?", et le JSON-LD dans `app/layout.tsx` (`areaServed`).

> ℹ️ L'aperçu GitHub Pages (section 0) est volontairement exclu des moteurs de recherche (`noindex`) pour ne pas entrer en concurrence avec votre vrai domaine une fois en ligne sur Vercel.

> ⚠️ Après toute modification, enregistrez le fichier. En local, le site se recharge tout seul. En ligne, il faut valider ("commit") le changement sur GitHub pour que Vercel republie le site.

---

## 4. Ajouter vos photos

Les images sont dans le dossier `public/images/`, organisées par sous-dossier :

```
public/images/
├── hero/     → photo d'arrière-plan de la première section
├── galerie/  → photos "avant / après" de vos réalisations
├── mahe/     → votre photo personnelle (section "Mon histoire")
└── logo/     → votre logo
```

Actuellement, ces dossiers contiennent des **images de remplacement** (fond bleu marine avec du texte) qui indiquent où vos vraies photos doivent aller.

### Pour remplacer une image :

1. Préparez votre photo (format JPG ou PNG de préférence, pas trop lourde : entre 200 Ko et 1,5 Mo est idéal).
2. Donnez-lui **exactement le même nom de fichier** que le placeholder à remplacer (par exemple `hero-placeholder.svg` devient `hero-placeholder.jpg`), **ou** changez le nom du fichier importé dans le composant concerné (un peu plus technique — demandez de l'aide si besoin).
3. La méthode la plus simple : remplacez le fichier directement sur GitHub (glisser-déposer dans le bon dossier), avec le même nom mais votre extension (`.jpg`/`.png`).
4. Si le nom de fichier change, il faut aussi mettre à jour le chemin dans le fichier concerné :
   - Photo de fond du Hero → `components/Hero.tsx`
   - Votre photo personnelle → `components/Storytelling.tsx`
   - Logo → `components/Header.tsx` et `app/layout.tsx`
   - Photos avant/après → `content/site-data.ts`, tableau `galleryItems`

### Une précision technique importante
Les images actuelles sont au format SVG (vectoriel, ce sont juste des placeholders) et affichées avec l'option `unoptimized` (pas d'optimisation automatique, inutile pour un simple aperçu). **Quand vous ajoutez de vraies photos JPG/PNG**, vous pouvez retirer `unoptimized={true}` dans le composant correspondant pour profiter de l'optimisation automatique des images par Next.js (chargement plus rapide). Ce n'est pas obligatoire, mais recommandé une fois vos vraies photos en place.

---

## 5. Configurer l'envoi des demandes de réservation par email

Le formulaire de réservation utilise un service gratuit et très simple appelé **Formspree**, qui transmet chaque demande directement dans votre boîte email. Aucune compétence technique n'est nécessaire.

### Étapes :

1. Allez sur [https://formspree.io](https://formspree.io) et créez un compte gratuit avec votre adresse email (`hyeresautoclean@gmail.com`).
2. Cliquez sur **"New Form"** (Nouveau formulaire), donnez-lui un nom (ex : "Réservation Hyères Auto Clean").
3. Formspree vous donne une adresse qui ressemble à :
   ```
   https://formspree.io/f/abcdwxyz
   ```
4. Copiez cette adresse.
5. Ouvrez le fichier `content/site-data.ts` et remplacez cette ligne :
   ```ts
   export const reservationFormEndpoint = "https://formspree.io/f/VOTRE_ID_FORMSPREE";
   ```
   par votre propre adresse Formspree.
6. Validez un email de confirmation que Formspree vous envoie (étape obligatoire la première fois).
7. C'est terminé ! Chaque demande de réservation vous arrivera directement par email, avec tous les détails (coordonnées du client, véhicule, formule, suppléments, prix estimé, créneau souhaité).

**Formspree gratuit** permet un certain nombre de messages par mois (largement suffisant pour démarrer). Si votre activité grandit, vous pourrez passer à une offre payante directement depuis leur site.

---

## 6. Déployer le site sur Vercel

Vous avez dit avoir déjà mis en ligne un site (Framer) et savoir gérer un nom de domaine — la procédure avec Vercel est tout aussi simple.

1. Mettez le code du projet sur un dépôt **GitHub** (si ce n'est pas déjà fait).
2. Allez sur [https://vercel.com](https://vercel.com) et connectez-vous avec votre compte GitHub.
3. Cliquez sur **"Add New Project"**, puis sélectionnez le dépôt du site.
4. Vercel détecte automatiquement qu'il s'agit d'un projet Next.js — vous n'avez rien à configurer, cliquez sur **"Deploy"**.
5. Après 1 à 2 minutes, votre site est en ligne sur une adresse du type `hyeresautoclean.vercel.app`.
6. Pour utiliser votre propre nom de domaine (`hyeresautoclean.com`) :
   - Dans Vercel, allez dans **Project → Settings → Domains**.
   - Ajoutez votre domaine.
   - Vercel vous indique les enregistrements DNS à ajouter chez votre registrar (là où vous avez acheté le nom de domaine) — comme vous l'avez déjà fait pour votre site Framer.

**Ensuite, à chaque fois que vous modifiez un fichier sur GitHub** (par exemple un prix dans `content/site-data.ts`), Vercel republie automatiquement le site avec la mise à jour, sans aucune action supplémentaire de votre part.

---

## 7. Structure du projet (pour information)

```
content/site-data.ts     → TOUT le contenu modifiable (le plus important pour vous)
lib/pricing.ts            → logique de calcul du prix (utilise les données ci-dessus)
context/                  → mémorise la sélection du simulateur pour la réservation
components/               → chaque section du site (Header, Hero, Formules, Simulateur...)
app/                       → pages du site et réglages techniques (SEO, sitemap...)
public/images/             → toutes les images et photos
```

---

## 8. Ce qu'il vous reste à fournir ou valider

Le site est fonctionnel et fidèle au brief, mais certains éléments dépendent de vous :

1. ~~Logo~~ et ~~2 photos (Citroën C1, Mercedes Classe A)~~ — **fournis et déjà intégrés** (logo dans le header, photos en fond du Hero et dans la section Réalisations, en simples photos sans montage avant/après pour l'instant).
2. **Photos avant/après pour la galerie** — dès que vous avez de vraies paires avant/après, dites-le-moi : je remets le format slider interactif à la place des simples photos actuelles.
3. ~~Votre photo personnelle~~ — ✅ fournie et intégrée dans la section "Mon histoire".
4. **Adresse Formspree** — ✅ déjà branchée (`content/site-data.ts`, `reservationFormEndpoint`).
5. **Prix des suppléments non confirmés** — sable/terre incrustée, désodorisation, désinfection, protection cuir sont présents dans le code mais **masqués** (`active: false`) car vous n'avez pas encore validé leurs prix. Dès que c'est fait, passez `active` à `true` dans `content/site-data.ts`. (Le supplément "Vitres extérieures" à 10 € est lui déjà actif.)
6. **Mentions légales** — une page modèle a été créée (`/mentions-legales`, accessible depuis le pied de page) mais elle contient des champs à compléter avec vos vraies informations : statut juridique exact, numéro de SIRET, adresse, hébergeur. C'est une obligation légale pour un site professionnel en France.
7. **Durée d'une intervention** — la FAQ reste volontairement générale sur ce point (« la durée dépend de la taille du véhicule et de la formule »). Si vous souhaitez indiquer une fourchette précise, vous pouvez modifier la réponse correspondante dans `content/site-data.ts`.
8. **Activer l'aperçu GitHub Pages** — ✅ fait, l'aperçu est en ligne (voir section 0).

Aucune fausse information (avis clients, notes, chiffres, badges) n'a été inventée sur le site, conformément à votre demande.

---

## Besoin d'aide ?

Revenez simplement échanger avec Claude Code pour toute demande de modification, ajout de fonctionnalité, ou question sur ce projet.
