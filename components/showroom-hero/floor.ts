import * as THREE from "three";
import { FullScreenQuad } from "three/examples/jsm/postprocessing/Pass.js";
import { HorizontalBlurShader } from "three/examples/jsm/shaders/HorizontalBlurShader.js";
import { VerticalBlurShader } from "three/examples/jsm/shaders/VerticalBlurShader.js";

/** Calque réservé au sol : invisible pour la caméra du reflet. */
export const FLOOR_LAYER = 1;

// Échantillons de Poisson pour adoucir le reflet (en plus du flou par mipmaps).
const POISSON = [
  [-0.613, 0.617], [0.17, -0.04], [-0.299, -0.792], [0.645, 0.493],
  [-0.651, -0.106], [0.421, -0.69], [-0.09, 0.45], [0.95, -0.1],
];

/**
 * Sol noir brillant : reflet flouté de la voiture (équivalent vanilla du
 * MeshReflectorMaterial de drei). Le sol est transparent hors reflet, pour
 * laisser voir le fond de page et le titre HTML placé derrière le canvas.
 */
export class ReflectiveFloor {
  readonly mesh: THREE.Mesh<THREE.CircleGeometry, THREE.ShaderMaterial>;
  private readonly target: THREE.WebGLRenderTarget;
  private readonly mirrorCamera = new THREE.PerspectiveCamera();
  private readonly textureMatrix = new THREE.Matrix4();
  private scale: number;

  constructor(options: {
    radius: number;
    strength: number;
    blur: number;
    fade: number;
    carHalfSize: THREE.Vector2;
    scale: number;
    taps: number;
  }) {
    this.scale = options.scale;
    this.target = new THREE.WebGLRenderTarget(16, 16, {
      type: THREE.HalfFloatType,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
      magFilter: THREE.LinearFilter,
    });

    const material = new THREE.ShaderMaterial({
      transparent: true,
      premultipliedAlpha: true,
      depthWrite: false,
      defines: { TAPS: Math.max(1, Math.min(POISSON.length, options.taps)) },
      uniforms: {
        tReflection: { value: this.target.texture },
        textureMatrix: { value: this.textureMatrix },
        uStrength: { value: options.strength },
        uBias: { value: options.blur },
        uSpread: { value: 0.0035 * options.blur },
        uFade: { value: options.fade },
        uRadius: { value: options.radius },
        uCarHalfSize: { value: options.carHalfSize },
        uPoisson: { value: POISSON.map(([x, y]) => new THREE.Vector2(x, y)) },
      },
      vertexShader: /* glsl */ `
        uniform mat4 textureMatrix;
        varying vec4 vReflUv;
        varying vec3 vWorld;
        void main() {
          vec4 world = modelMatrix * vec4(position, 1.0);
          vWorld = world.xyz;
          vReflUv = textureMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * viewMatrix * world;
        }`,
      fragmentShader: /* glsl */ `
        uniform sampler2D tReflection;
        uniform float uStrength, uBias, uSpread, uFade, uRadius;
        uniform vec2 uCarHalfSize;
        uniform vec2 uPoisson[8];
        varying vec4 vReflUv;
        varying vec3 vWorld;
        void main() {
          vec2 uv = vReflUv.xy / vReflUv.w;
          vec3 refl = vec3(0.0);
          for (int i = 0; i < TAPS; i++) {
            refl += texture2D(tReflection, uv + uPoisson[i] * uSpread, uBias).rgb;
          }
          refl /= float(TAPS);
          // Le reflet s'estompe en s'éloignant de l'empreinte de la voiture,
          // puis le sol entier se fond dans le fond de page.
          vec2 outside = max(abs(vWorld.xz) - uCarHalfSize, 0.0);
          float fade = exp(-length(outside) / uFade);
          fade *= smoothstep(uRadius, uRadius * 0.35, length(vWorld.xz));
          vec3 color = refl * uStrength * fade;
          float alpha = clamp(max(color.r, max(color.g, color.b)) * 1.5, 0.0, 1.0);
          gl_FragColor = vec4(color, alpha);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    });

    this.mesh = new THREE.Mesh(new THREE.CircleGeometry(options.radius, 96), material);
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.renderOrder = -2;
    this.mesh.layers.set(FLOOR_LAYER);
  }

  setSize(width: number, height: number) {
    this.target.setSize(Math.max(1, Math.round(width * this.scale)), Math.max(1, Math.round(height * this.scale)));
  }

  setQuality(scale: number, taps: number, strength: number) {
    this.scale = scale;
    this.mesh.material.uniforms.uStrength.value = strength;
    this.mesh.material.defines.TAPS = taps;
    this.mesh.material.needsUpdate = true;
  }

  /** Rend la scène vue « dans le miroir » du sol (plan y = 0). */
  update(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
    const mirror = this.mirrorCamera;
    // La matrice du sol doit être à jour dès le tout premier rendu.
    this.mesh.updateMatrixWorld();
    // Miroir par rapport au plan y = 0 : on réfléchit la position et la visée.
    const position = camera.getWorldPosition(new THREE.Vector3());
    const direction = camera.getWorldDirection(new THREE.Vector3());
    if (position.y <= 0) return;
    mirror.position.set(position.x, -position.y, position.z);
    mirror.up.set(0, -1, 0);
    mirror.lookAt(position.x + direction.x, -position.y - direction.y, position.z + direction.z);
    mirror.projectionMatrix.copy(camera.projectionMatrix);
    mirror.updateMatrixWorld();
    mirror.layers.set(0);

    this.textureMatrix.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);
    this.textureMatrix.multiply(mirror.projectionMatrix);
    this.textureMatrix.multiply(mirror.matrixWorldInverse);
    this.textureMatrix.multiply(this.mesh.matrixWorld);

    // Plan de coupe oblique : rien de ce qui est sous le sol n'est reflété.
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0).applyMatrix4(mirror.matrixWorldInverse);
    const clip = new THREE.Vector4(plane.normal.x, plane.normal.y, plane.normal.z, plane.constant);
    const p = mirror.projectionMatrix.elements;
    const q = new THREE.Vector4(
      (Math.sign(clip.x) + p[8]) / p[0],
      (Math.sign(clip.y) + p[9]) / p[5],
      -1,
      (1 + p[10]) / p[14],
    );
    clip.multiplyScalar(2 / clip.dot(q));
    p[2] = clip.x;
    p[6] = clip.y;
    p[10] = clip.z + 1;
    p[14] = clip.w;

    const previousTarget = renderer.getRenderTarget();
    const previousAlpha = renderer.getClearAlpha();
    renderer.setRenderTarget(this.target);
    renderer.setClearAlpha(0);
    renderer.clear();
    renderer.render(scene, mirror);
    renderer.setRenderTarget(previousTarget);
    renderer.setClearAlpha(previousAlpha);
  }

  dispose() {
    this.target.dispose();
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}

/**
 * Ombre de contact douce, calculée une seule fois (la voiture ne bouge pas,
 * seule la caméra tourne) : la voiture est vue d'en dessous, sa « hauteur »
 * devient de l'opacité, puis le résultat est flouté (méthode ContactShadows
 * de drei).
 */
export function bakeContactShadow(
  renderer: THREE.WebGLRenderer,
  car: THREE.Object3D,
  options: { width: number; depth: number; height: number; opacity: number; blur: number; resolution: number },
) {
  const { width, depth, height, resolution } = options;
  const targets = [0, 1].map(() => new THREE.WebGLRenderTarget(resolution, resolution));
  const shadowCamera = new THREE.OrthographicCamera(-width / 2, width / 2, depth / 2, -depth / 2, 0, height);
  shadowCamera.rotation.x = Math.PI / 2;
  shadowCamera.updateMatrixWorld();

  const depthMaterial = new THREE.MeshDepthMaterial();
  depthMaterial.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      "gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );",
      // Plus la surface est proche du sol, plus l'ombre est dense (courbe douce).
      "gl_FragColor = vec4( vec3( 0.0 ), pow( 1.0 - fragCoordZ, 2.2 ) );",
    );
  };
  depthMaterial.side = THREE.DoubleSide;

  const scene = new THREE.Scene();
  const parent = car.parent;
  scene.add(car);
  scene.overrideMaterial = depthMaterial;

  const previousTarget = renderer.getRenderTarget();
  const previousAlpha = renderer.getClearAlpha();
  renderer.setClearAlpha(0);
  renderer.setRenderTarget(targets[0]);
  renderer.clear();
  renderer.render(scene, shadowCamera);
  if (parent) parent.add(car);

  const horizontal = new THREE.ShaderMaterial(HorizontalBlurShader);
  const vertical = new THREE.ShaderMaterial(VerticalBlurShader);
  const quad = new FullScreenQuad();
  // Plusieurs passes de flou de rayon décroissant : pénombre large et douce.
  for (const radius of [options.blur * 2.2, options.blur * 1.2, options.blur * 0.6]) {
    horizontal.uniforms.tDiffuse.value = targets[0].texture;
    horizontal.uniforms.h.value = radius / 256;
    quad.material = horizontal;
    renderer.setRenderTarget(targets[1]);
    quad.render(renderer);

    vertical.uniforms.tDiffuse.value = targets[1].texture;
    vertical.uniforms.v.value = radius / 256;
    quad.material = vertical;
    renderer.setRenderTarget(targets[0]);
    quad.render(renderer);
  }
  renderer.setRenderTarget(previousTarget);
  renderer.setClearAlpha(previousAlpha);

  quad.dispose();
  horizontal.dispose();
  vertical.dispose();
  depthMaterial.dispose();
  targets[1].dispose();

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width, depth),
    new THREE.MeshBasicMaterial({
      map: targets[0].texture,
      color: 0x000000,
      transparent: true,
      side: THREE.DoubleSide,
      opacity: options.opacity,
      depthWrite: false,
    }),
  );
  // La caméra d'ombre regarde vers le haut : l'axe vertical de la texture est
  // inversé pour la poser au sol dans le bon sens.
  mesh.scale.set(1, -1, 1);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.002;
  mesh.renderOrder = -1;
  mesh.layers.set(FLOOR_LAYER);
  return {
    mesh,
    dispose: () => {
      targets[0].dispose();
      mesh.geometry.dispose();
      mesh.material.dispose();
    },
  };
}
