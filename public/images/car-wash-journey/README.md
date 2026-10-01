# Images de la section "De la route au brillant"

Cette section (entre "Votre voiture mérite mieux..." et "Nos formules") utilise
7 images. Deux sont déjà vos vraies photos retouchées, trois sont vos photos
utilisées telles quelles, et deux sont des **illustrations provisoires** à
remplacer dès que vous avez les bonnes images (voir le tableau).

| Fichier | Statut | Contenu | Dimensions conseillées | Fond |
|---|---|---|---|---|
| `car-clean.webp` | ✅ généré depuis votre photo | Voiture de profil, propre | ~1650×660 px | Transparent |
| `car-dirt.webp` | ✅ généré depuis vos 2 photos | Calque de saleté uniquement (découpé automatiquement à partir de la différence entre votre photo propre et votre photo sale) | même cadrage que `car-clean.webp` | Transparent |
| `wheel.webp` | ✅ généré depuis votre photo | Une roue seule, vue de face | ~1250×1250 px (carré) | Transparent |
| `bg-far.webp` | ✅ généré depuis votre photo (mer/îles) | Arrière-plan, rendu répétable par effet miroir | ~3500×700 px | Opaque (plein cadre) |
| `bg-mid.webp` | ✅ généré depuis votre photo (salins/flamants) | Plan médian, rendu répétable par effet miroir | ~6100×620 px | Opaque (plein cadre) |
| `bg-near.webp` | ⚠️ illustration provisoire | Premier plan : palmiers + glissière | ~900×320 px, répétable horizontalement | Transparent |
| `shop-front.webp` | ⚠️ illustration provisoire | Façade "HYÈRES AUTO CLEAN" | ~1600×900 px | Transparent (hors bâtiment) |

## Pourquoi deux illustrations provisoires ?

Vous avez envoyé 5 photos pour cette section (voiture propre, voiture sale,
roue, mer, salins). Il en manquait deux : le premier plan (palmiers /
glissière) et la façade du local. Vous avez ensuite envoyé ces deux images
directement dans la conversation, mais sans qu'elles soient enregistrées comme
fichiers exploitables de mon côté — je ne peux donc pas (encore) les découper
automatiquement. En attendant, j'ai dessiné deux illustrations simples dans les
couleurs du site pour que la section soit complète et testable dès maintenant.

**Pour les remplacer par vos vraies photos :**
1. Enregistrez vos deux photos sur votre ordinateur (clic droit → Enregistrer
   l'image, ou export depuis l'outil qui les a générées).
2. Déposez-les dans ce dossier (`public/images/car-wash-journey/`) sous les
   noms `bg-near.webp` et `shop-front.webp` en respectant les dimensions et
   fonds ci-dessus (vous pouvez aussi les envoyer en pièce jointe dans une
   prochaine conversation pour que je les découpe/intègre moi-même).
2bis. **Important pour `shop-front.webp`** : si l'image provient d'un outil
   d'IA qui appose son propre logo (filigrane) dessus, pensez à le retirer
   (recadrage ou retouche) avant de la mettre en ligne — un logo d'un outil
   tiers n'a pas sa place sur votre site.
3. Le fond doit être transparent (sauvegardez en PNG ou WebP avec canal
   alpha) : sinon un rectangle blanc apparaîtra autour de l'image dans la
   scène.
4. `bg-near.webp` doit être "répétable" horizontalement : son bord gauche et
   son bord droit doivent se raccorder sans coupure visible (c'est ce qui
   permet à la bande de défiler à l'infini pendant l'animation).

## Remplacer les trois images déjà traitées

Rien ne vous empêche de fournir une meilleure version de `car-clean.webp`,
`car-dirt.webp`, `wheel.webp`, `bg-far.webp` ou `bg-mid.webp` plus tard (par
exemple de vraies photos prises à Hyères plutôt que des rendus génériques) :
il suffit de renvoyer les photos sources et je refais le même traitement
(détourage du fond, découpe de la saleté, mise en tuile).

Dans tous les cas, aucune modification de code n'est nécessaire : le
composant lit toujours les mêmes noms de fichiers dans ce dossier.
