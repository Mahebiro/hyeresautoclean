// Outils communs aux scripts d'analyse et de compression du modèle.
import { readFileSync } from "node:fs";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { MeshoptDecoder, MeshoptEncoder } from "meshoptimizer";
import draco3d from "draco3dgltf";
import { SHOWROOM_CONFIG } from "../../components/showroom-hero/config.js";

export async function createIO() {
  await Promise.all([MeshoptDecoder.ready, MeshoptEncoder.ready]);
  return new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
    "meshopt.decoder": MeshoptDecoder,
    "meshopt.encoder": MeshoptEncoder,
    "draco3d.decoder": await draco3d.createDecoderModule(),
  });
}

/**
 * Lit les arguments : fichiers positionnels + option `--overrides fichier.json`
 * (correspondances supplémentaires nom → famille, fusionnées avec config.js)
 * et `--rotate degrés` (rotation autour de l'axe vertical, inscrite dans le fichier).
 */
export function parseArgs(argv, defaults) {
  const positional = [];
  let overridesFile = null;
  let rotate = 0;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--overrides") overridesFile = argv[++i];
    else if (argv[i] === "--rotate") rotate = Number(argv[++i]) || 0;
    else positional.push(argv[i]);
  }
  const extra = overridesFile ? JSON.parse(readFileSync(overridesFile, "utf8")) : {};
  const modelConfig = {
    ...SHOWROOM_CONFIG.model,
    overrides: { ...SHOWROOM_CONFIG.model.overrides, ...extra },
  };
  return { files: defaults.map((d, i) => positional[i] || d), modelConfig, rotate };
}
