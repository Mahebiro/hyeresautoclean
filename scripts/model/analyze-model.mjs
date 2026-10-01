// Analyse d'un modèle .glb : liste les maillages et matériaux, et indique
// pour chacun la pièce reconnue (peinture, vitres, pneus, jantes, étriers,
// phares, feux arrière, logos…) d'après components/showroom-hero/config.js.
//
// Usage : npm run model:analyze -- [fichier.glb] [--overrides corresp.json]
//         (par défaut public/assets/gt3rs.glb)

import { getBounds } from "@gltf-transform/core";
import { classifyPart, PART_LABELS, isHiddenPart } from "../../components/showroom-hero/classify.js";
import { createIO, parseArgs } from "./shared.mjs";

const {
  files: [file],
  modelConfig,
} = parseArgs(process.argv.slice(2), ["public/assets/gt3rs.glb"]);
const io = await createIO();

let document;
try {
  document = await io.read(file);
} catch (error) {
  console.error(`Impossible de lire « ${file} » : ${error.message}`);
  process.exit(1);
}

const root = document.getRoot();
const hex = (rgb) =>
  "#" + rgb.slice(0, 3).map((c) => Math.round(Math.min(1, Math.max(0, c)) ** (1 / 2.2) * 255).toString(16).padStart(2, "0")).join("");

function triangleCount(mesh) {
  return mesh.listPrimitives().reduce((sum, prim) => {
    const indices = prim.getIndices();
    const count = indices ? indices.getCount() : prim.getAttribute("POSITION")?.getCount() ?? 0;
    return sum + Math.floor(count / 3);
  }, 0);
}

// --- Encombrement global -----------------------------------------------------
const scene = root.getDefaultScene() || root.listScenes()[0];
const bounds = getBounds(scene);
const size = bounds.max.map((v, i) => v - bounds.min[i]);
const axes = ["X", "Y", "Z"];
const longest = axes[size.indexOf(Math.max(size[0], size[2]))];

console.log(`\nModèle : ${file}`);
console.log(`Dimensions (unités du fichier) : X ${size[0].toFixed(3)} · Y ${size[1].toFixed(3)} · Z ${size[2].toFixed(3)}`);
console.log(`Axe le plus long (longueur de la voiture) : ${longest}${longest === "X" ? " → essayez model.rotationY = 90 ou -90" : ""}`);

// --- Maillages ---------------------------------------------------------------
const rows = [];
for (const node of root.listNodes()) {
  const mesh = node.getMesh();
  if (!mesh) continue;
  for (const prim of mesh.listPrimitives()) {
    const material = prim.getMaterial();
    const names = {
      nodeName: node.getName(),
      meshName: mesh.getName(),
      materialName: material?.getName() ?? "",
    };
    const part = classifyPart(names, modelConfig);
    const indices = prim.getIndices();
    const tris = Math.floor((indices ? indices.getCount() : prim.getAttribute("POSITION").getCount()) / 3);
    rows.push({ ...names, part, tris, hidden: isHiddenPart(part, modelConfig) });
  }
}

const byPart = {};
for (const row of rows) (byPart[row.part] ||= []).push(row);

console.log(`\n${rows.length} primitives, ${root.listMeshes().length} maillages, ${root.listMaterials().length} matériaux, ${root.listTextures().length} textures\n`);
const order = ["body", "glass", "tires", "rims", "calipers", "headlights", "taillights", "logos", "plates", "trim", "keep", "unknown"];
for (const part of order) {
  const list = byPart[part];
  if (!list) continue;
  console.log(`■ ${PART_LABELS[part]} (${list.length})`);
  for (const row of list.slice(0, 40)) {
    console.log(`    ${row.nodeName || "—"} / ${row.meshName || "—"}  [mat: ${row.materialName || "—"}]  ${row.tris} tri.`);
  }
  if (list.length > 40) console.log(`    … et ${list.length - 40} autres`);
}

// --- Matériaux ---------------------------------------------------------------
console.log("\nMatériaux :");
for (const material of root.listMaterials()) {
  const part = classifyPart({ materialName: material.getName() }, modelConfig);
  const textures = [
    material.getBaseColorTexture() && "couleur",
    material.getNormalTexture() && "normales",
    material.getMetallicRoughnessTexture() && "métal/rugosité",
    material.getEmissiveTexture() && "émissif",
    material.getOcclusionTexture() && "occlusion",
  ].filter(Boolean);
  const emissive = material.getEmissiveFactor();
  const hasEmissive = emissive.some((c) => c > 0);
  console.log(
    `  ${material.getName() || "(sans nom)"} → ${PART_LABELS[part]}` +
      `  couleur ${hex(material.getBaseColorFactor())} métal ${material.getMetallicFactor().toFixed(2)} rugosité ${material.getRoughnessFactor().toFixed(2)}` +
      `${material.getAlphaMode() !== "OPAQUE" ? ` alpha ${material.getAlphaMode()}` : ""}` +
      `${hasEmissive ? ` émissif ${hex(emissive)}` : ""}` +
      `${textures.length ? `  textures : ${textures.join(", ")}` : ""}`,
  );
}

// Indice : un petit maillage avec une texture couleur et de la transparence
// est souvent un autocollant ou un badge.
const suspects = root
  .listMeshes()
  .filter((mesh) =>
    mesh.listPrimitives().some((prim) => {
      const mat = prim.getMaterial();
      return mat && mat.getAlphaMode() !== "OPAQUE" && mat.getBaseColorTexture() && triangleCount(mesh) < 4000;
    }),
  )
  .map((mesh) => mesh.getName());
if (suspects.length) {
  console.log(`\nÀ vérifier (petits maillages texturés transparents, souvent des logos/autocollants) : ${suspects.join(", ")}`);
}

const unknown = byPart.unknown?.length ?? 0;
console.log(
  unknown
    ? `\n${unknown} primitive(s) non reconnue(s) : elles gardent leur matériau d'origine. Ajoutez-les dans model.overrides (config.js) si besoin.\n`
    : "\nToutes les pièces sont reconnues.\n",
);
