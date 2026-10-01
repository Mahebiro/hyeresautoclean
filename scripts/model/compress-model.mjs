// Prépare le modèle pour le web :
//   1. reconnaît chaque pièce (voir config.js) et l'inscrit dans le fichier
//      (extras.part), pour que le site applique les bons matériaux ;
//   2. SUPPRIME les logos, badges et autocollants de marque (et les plaques) ;
//   3. retire l'inutile (doublons, éléments orphelins) ;
//   4. textures en WebP (2048 px max) ;
//   5. géométrie compressée en meshopt (décodeur léger, sans fichier externe).
//
// Usage : npm run model:compress -- [entrée.glb] [sortie.glb] [--overrides corresp.json] [--rotate 180]
//         --rotate : tourne le modèle (degrés) pour que l'avant regarde vers +Z.
//         (par défaut public/assets/gt3rs.glb → public/assets/gt3rs.opt.glb)

import { statSync } from "node:fs";
import { dedup, meshopt, prune, textureCompress, weld } from "@gltf-transform/functions";
import { MeshoptEncoder } from "meshoptimizer";
import sharp from "sharp";
import { classifyPart, isHiddenPart } from "../../components/showroom-hero/classify.js";
import { createIO, parseArgs } from "./shared.mjs";

const TARGET_BYTES = 5 * 1024 * 1024;
const {
  files: [input, output],
  modelConfig,
  rotate,
} = parseArgs(process.argv.slice(2), ["public/assets/gt3rs.glb", "public/assets/gt3rs.opt.glb"]);

const io = await createIO();
const document = await io.read(input);
const root = document.getRoot();
// Si le fichier source est en Draco, on le réécrit en meshopt (décodage plus
// léger côté navigateur, sans fichier .wasm à héberger).
for (const extension of root.listExtensionsUsed()) {
  if (extension.extensionName === "KHR_draco_mesh_compression") extension.dispose();
}

// --- 1 & 2 : reconnaissance des pièces, suppression des logos ----------------
const removed = [];
const counts = {};
for (const node of root.listNodes()) {
  const mesh = node.getMesh();
  if (!mesh) continue;
  // Un maillage peut regrouper plusieurs matériaux : on classe chaque
  // primitive, et on retire uniquement celles à masquer.
  const parts = new Set();
  for (const prim of mesh.listPrimitives()) {
    const part = classifyPart(
      { nodeName: node.getName(), meshName: mesh.getName(), materialName: prim.getMaterial()?.getName() ?? "" },
      modelConfig,
    );
    if (isHiddenPart(part, modelConfig)) {
      mesh.removePrimitive(prim);
      removed.push(`${node.getName() || mesh.getName()} [${prim.getMaterial()?.getName() ?? "—"}] (${part})`);
      continue;
    }
    parts.add(part);
    counts[part] = (counts[part] || 0) + 1;
    // La pièce est aussi notée sur le matériau (repli si les nœuds sont fusionnés).
    prim.getMaterial()?.setExtras({ ...prim.getMaterial().getExtras(), part });
  }
  if (mesh.listPrimitives().length === 0) {
    node.dispose();
    continue;
  }
  if (parts.size === 1) node.setExtras({ ...node.getExtras(), part: [...parts][0] });
}
// Un matériau partagé par des pièces différentes ne doit pas porter d'étiquette.
for (const material of root.listMaterials()) {
  const users = material
    .listParents()
    .filter((p) => p.propertyType === "Primitive")
    .map((prim) => prim.getMaterial()?.getExtras()?.part);
  if (new Set(users).size > 1) material.setExtras({});
}

console.log(`Pièces supprimées (logos / plaques) : ${removed.length ? "\n  - " + removed.join("\n  - ") : "aucune"}`);
console.log("Pièces conservées :", counts);

// Rotation éventuelle (avant de la voiture vers +Z), appliquée aux racines.
if (rotate) {
  const half = (rotate * Math.PI) / 360;
  const q = [0, Math.sin(half), 0, Math.cos(half)];
  const multiply = (a, b) => [
    a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
    a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
    a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
    a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2],
  ];
  for (const scene of root.listScenes()) {
    for (const node of scene.listChildren()) {
      const t = node.getTranslation();
      const c = Math.cos((rotate * Math.PI) / 180);
      const s = Math.sin((rotate * Math.PI) / 180);
      node.setTranslation([c * t[0] + s * t[2], t[1], -s * t[0] + c * t[2]]);
      node.setRotation(multiply(q, node.getRotation()));
    }
  }
}

// --- 3 à 5 : optimisation ------------------------------------------------------
await document.transform(
  dedup(),
  prune({ keepExtras: true }),
  weld(),
  textureCompress({ encoder: sharp, targetFormat: "webp", resize: [2048, 2048], quality: 82 }),
  meshopt({ encoder: MeshoptEncoder, level: "medium" }),
);

await io.write(output, document);
const before = statSync(input).size;
const after = statSync(output).size;
const mb = (b) => (b / 1024 / 1024).toFixed(2) + " Mo";
console.log(`\n${input} (${mb(before)}) → ${output} (${mb(after)})`);
if (after > TARGET_BYTES) {
  console.warn(
    "⚠ Le fichier dépasse 5 Mo. Pistes : réduire les textures (resize: [1024, 1024]) ou passer level: \"high\".",
  );
}
