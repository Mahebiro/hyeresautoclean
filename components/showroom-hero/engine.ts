import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { SHOWROOM_CONFIG as C } from "./config";
import { classifyPart, isHiddenPart } from "./classify";
import { bakeContactShadow, FLOOR_LAYER, ReflectiveFloor } from "./floor";

export type Quality = "desktop" | "mobile" | "lite";

type Vec3 = [number, number, number];

/** Niveaux d'allumage (0 → 1), animés par l'intro. */
export interface LightLevels {
  strips: number[];
  environment: number;
  headlights: number;
  taillights: number;
}

interface Strip {
  light: THREE.RectAreaLight;
  panel: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
}

const deg = THREE.MathUtils.degToRad;

/** Interpolation Catmull-Rom (trajectoire de caméra sans à-coups). */
function catmullRom(p0: number, p1: number, p2: number, p3: number, t: number) {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}

type PathKey = Exclude<keyof (typeof C.camera.path)[number], "at">;

function samplePath(progress: number) {
  const path = C.camera.path;
  const p = THREE.MathUtils.clamp(progress, 0, 1);
  let i = 0;
  while (i < path.length - 2 && p > path[i + 1].at) i++;
  const a = path[i];
  const b = path[i + 1];
  const t = (p - a.at) / Math.max(1e-6, b.at - a.at);
  const prev = path[Math.max(0, i - 1)];
  const next = path[Math.min(path.length - 1, i + 2)];
  const value = (key: PathKey) => catmullRom(prev[key], a[key], b[key], next[key], t);
  return {
    azimuth: value("azimuth"),
    elevation: value("elevation"),
    distance: value("distance"),
    targetY: value("targetY"),
  };
}

export class Showroom {
  readonly levels: LightLevels = {
    strips: C.strips.map(() => 0),
    environment: 0,
    headlights: 0,
    taillights: 0,
  };
  /** Avancement du scroll (0 → 1), déjà lissé par GSAP. */
  progress = 0;
  quality: Quality;
  onQualityChange?: (quality: Quality) => void;

  private readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly envScene = new THREE.Scene();
  private readonly pmrem: THREE.PMREMGenerator;
  private envTarget: THREE.WebGLRenderTarget | null = null;
  private envKey = "";
  private composer: EffectComposer | null = null;
  private bloom: UnrealBloomPass | null = null;
  floor: ReflectiveFloor | null = null;
  shadow: { mesh: THREE.Mesh; dispose: () => void } | null = null;
  readonly strips: Strip[] = [];
  private readonly headlightMaterials: THREE.MeshPhysicalMaterial[] = [];
  private readonly taillightMaterials: THREE.MeshPhysicalMaterial[] = [];
  private car: THREE.Object3D | null = null;
  private carSize = new THREE.Vector3(4.57, 1.3, 1.9);
  private width = 1;
  private height = 1;
  private frame = 0;
  private running = false;
  private visible = true;
  private needsRender = true;
  private pointer = new THREE.Vector2();
  private pointerSmooth = new THREE.Vector2();
  private fpsSample: { start: number; frames: number } | null = null;
  private readonly resizeObserver: ResizeObserver;
  private readonly disposables: { dispose: () => void }[] = [];

  constructor(
    private readonly canvas: HTMLCanvasElement,
    options: { quality: Quality; adaptive: boolean },
  ) {
    this.quality = options.quality;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      premultipliedAlpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = C.postfx.exposure;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.pmrem = new THREE.PMREMGenerator(this.renderer);

    this.camera = new THREE.PerspectiveCamera(C.camera.fov, 1, 0.1, 100);
    this.camera.layers.enable(FLOOR_LAYER);

    RectAreaLightUniformsLib.init();
    this.buildStrips();
    this.applyQuality();

    if (options.adaptive && this.quality !== "lite") {
      this.fpsSample = { start: -1, frames: 0 };
    }

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.resize();
  }

  // --- Chargement ------------------------------------------------------------

  async load(urls: { model: string; hdri: string }, onProgress: (ratio: number) => void) {
    let modelRatio = 0;
    let hdriRatio = 0;
    const report = () => onProgress(Math.min(0.99, modelRatio * 0.9 + hdriRatio * 0.1));

    const hdriPromise = new HDRLoader().loadAsync(urls.hdri, (event) => {
      hdriRatio = event.total ? event.loaded / event.total : Math.min(0.95, event.loaded / 600_000);
      report();
    });

    const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
    const gltfPromise = loader.loadAsync(urls.model, (event) => {
      const total = event.total || C.model.approxBytes;
      modelRatio = Math.min(1, event.loaded / total);
      report();
    });

    const [hdri, gltf] = await Promise.all([hdriPromise, gltfPromise]);
    hdri.mapping = THREE.EquirectangularReflectionMapping;
    this.disposables.push(hdri);
    this.setupEnvironment(hdri);
    this.setupCar(gltf.scene);
    // Compile les shaders avant l'intro pour éviter un à-coup au premier rendu.
    await this.renderer.compileAsync(this.scene, this.camera);
    onProgress(1);
  }

  private setupEnvironment(hdri: THREE.Texture) {
    // Scène « studio » utilisée uniquement pour calculer les reflets :
    // l'HDRI très atténué + les bandes lumineuses + un sol noir.
    this.envScene.background = hdri;
    this.envScene.backgroundRotation.y = deg(C.environment.rotationY);
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(30, 32).rotateX(-Math.PI / 2),
      // Sol noir : le bas de caisse reflète du noir, comme dans un vrai studio.
      new THREE.MeshBasicMaterial({ color: 0x000000 }),
    );
    ground.position.y = 0;
    this.envScene.add(ground);
    this.disposables.push(ground.geometry, ground.material);
  }

  private buildStrips() {
    for (const cfg of C.strips) {
      const [w, h] = cfg.size;
      const light = new THREE.RectAreaLight(0xffffff, 0, w, h);
      light.position.set(...(cfg.position as Vec3));
      light.lookAt(...(cfg.lookAt as Vec3));
      this.scene.add(light);

      // Plan émissif de la scène de reflets uniquement.
      const geometry = new THREE.PlaneGeometry(w, h);
      const material = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide, toneMapped: false });
      this.disposables.push(geometry, material);
      const panel = new THREE.Mesh(geometry, material);
      panel.position.copy(light.position);
      panel.quaternion.copy(light.quaternion);
      this.envScene.add(panel);
      this.strips.push({ light, panel });
    }
  }

  private setupCar(root: THREE.Object3D) {
    root.rotation.y = deg(C.model.rotationY);
    root.updateMatrixWorld(true);

    const paint = new THREE.MeshPhysicalMaterial({
      color: C.colors.paint,
      ...C.materials.paint,
    });
    const glass = new THREE.MeshPhysicalMaterial({
      color: C.materials.glass.color,
      metalness: 0,
      roughness: C.materials.glass.roughness,
      transparent: true,
      opacity: C.materials.glass.opacity,
      envMapIntensity: C.materials.glass.envMapIntensity,
      clearcoat: 1,
      clearcoatRoughness: 0,
      depthWrite: false,
    });
    const tires = new THREE.MeshStandardMaterial({ ...C.materials.tires });
    const rims = new THREE.MeshPhysicalMaterial({ color: C.colors.rims, ...C.materials.rims });
    const calipers = new THREE.MeshPhysicalMaterial({ color: C.colors.calipers, ...C.materials.calipers });
    const trim = new THREE.MeshStandardMaterial({ color: C.colors.trim, ...C.materials.trim });
    this.disposables.push(paint, glass, tires, rims, calipers, trim);

    const lightMaterial = (base: THREE.Material, emissive: string, tint: string) => {
      const source = base as THREE.MeshStandardMaterial;
      const material = new THREE.MeshPhysicalMaterial({
        color: tint,
        roughness: 0.08,
        metalness: 0.1,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        emissive: new THREE.Color(emissive),
        emissiveIntensity: 0,
        transparent: source.transparent,
        opacity: source.opacity,
        side: source.side,
      });
      this.disposables.push(material);
      return material;
    };

    const findPart = (mesh: THREE.Mesh, material: THREE.Material) => {
      // 1) pièce inscrite par le script de compression, 2) reconnaissance par nom
      for (let o: THREE.Object3D | null = mesh; o; o = o.parent) {
        if (typeof o.userData.part === "string") return o.userData.part as string;
      }
      if (typeof material.userData.part === "string") return material.userData.part as string;
      return classifyPart({ nodeName: mesh.parent?.name, meshName: mesh.name, materialName: material.name }, C.model);
    };

    const hidden: THREE.Mesh[] = [];
    root.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh) return;
      const original = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
      const part = findPart(mesh, original);
      if (isHiddenPart(part, C.model)) {
        hidden.push(mesh);
        return;
      }
      switch (part) {
        case "body":
          // La texture d'origine est volontairement abandonnée : aucun logo ni
          // inscription peints dans la texture ne peuvent réapparaître.
          mesh.material = paint;
          break;
        case "glass":
          mesh.material = glass;
          mesh.renderOrder = 2;
          break;
        case "tires":
          mesh.material = tires;
          break;
        case "rims":
          mesh.material = rims;
          break;
        case "calipers":
          mesh.material = calipers;
          break;
        case "trim":
          mesh.material = trim;
          break;
        case "headlights": {
          const m = lightMaterial(original, C.materials.headlights.color, "#15171a");
          this.headlightMaterials.push(m);
          mesh.material = m;
          break;
        }
        case "taillights": {
          const m = lightMaterial(original, C.materials.taillights.color, "#2a0204");
          this.taillightMaterials.push(m);
          mesh.material = m;
          break;
        }
        default: {
          // Pièces non reconnues : matériau d'origine conservé.
          const m = original as THREE.MeshStandardMaterial;
          if ("envMapIntensity" in m) m.envMapIntensity = 1;
        }
      }
    });
    hidden.forEach((mesh) => mesh.removeFromParent());

    // Mise à l'échelle (longueur réelle), centrage, roues posées au sol.
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const scale = C.model.lengthMeters / Math.max(size.z, 1e-6);
    root.scale.multiplyScalar(scale);
    root.updateMatrixWorld(true);
    box.setFromObject(root);
    const center = box.getCenter(new THREE.Vector3());
    root.position.x -= center.x;
    root.position.z -= center.z;
    root.position.y -= box.min.y;
    root.updateMatrixWorld(true);
    box.setFromObject(root);
    box.getSize(this.carSize);

    const car = new THREE.Group();
    car.add(root);
    this.scene.add(car);
    this.car = car;

    // Sol réfléchissant + ombre de contact.
    const reflectionScale = C.performance.reflectionScale[this.quality];
    this.floor = new ReflectiveFloor({
      radius: C.floor.radius,
      strength: C.floor.reflectivity * (this.quality === "desktop" ? 1 : C.performance.simplifiedReflection),
      blur: C.floor.blur + (this.quality === "desktop" ? 0 : 1),
      fade: C.floor.reflectionFade,
      carHalfSize: new THREE.Vector2(this.carSize.x / 2, this.carSize.z / 2),
      scale: reflectionScale,
      taps: this.quality === "desktop" ? 8 : 3,
    });
    this.scene.add(this.floor.mesh);
    this.floor.setSize(this.width * this.renderer.getPixelRatio(), this.height * this.renderer.getPixelRatio());

    this.shadow = bakeContactShadow(this.renderer, car, {
      width: this.carSize.x + 1.4,
      depth: this.carSize.z + 1.4,
      height: 0.9,
      opacity: C.floor.shadowOpacity,
      blur: C.floor.shadowBlur,
      resolution: 512,
    });
    this.scene.add(this.shadow.mesh);

    this.applyLevels(true);
    this.updateCamera();
  }

  // --- Qualité ---------------------------------------------------------------

  private applyQuality() {
    const maxRatio = C.performance.maxPixelRatio[this.quality];
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxRatio));

    if (this.quality === "desktop" && !this.composer) {
      const target = new THREE.WebGLRenderTarget(1, 1, {
        type: THREE.HalfFloatType,
        samples: C.performance.msaaSamples,
      });
      const composer = new EffectComposer(this.renderer, target);
      composer.addPass(new RenderPass(this.scene, this.camera));
      const { strength, radius, threshold } = C.postfx.bloom;
      this.bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), strength, radius, threshold);
      composer.addPass(this.bloom);
      composer.addPass(new OutputPass());
      this.composer = composer;
    } else if (this.quality !== "desktop" && this.composer) {
      this.composer.dispose();
      this.bloom?.dispose();
      this.composer = null;
      this.bloom = null;
    }
    this.floor?.setQuality(
      C.performance.reflectionScale[this.quality],
      this.quality === "desktop" ? 8 : 3,
      C.floor.reflectivity * (this.quality === "desktop" ? 1 : C.performance.simplifiedReflection),
    );
    this.resize();
  }

  private downgrade() {
    if (this.quality === "lite") return;
    this.quality = "lite";
    this.applyQuality();
    this.onQualityChange?.(this.quality);
  }

  // --- Boucle de rendu ---------------------------------------------------------

  start() {
    if (this.running) return;
    this.running = true;
    const tick = (time: number) => {
      if (!this.running) return;
      this.frame = requestAnimationFrame(tick);
      if (this.visible) this.renderFrame(time);
    };
    this.frame = requestAnimationFrame(tick);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.frame);
  }

  /** Rendu unique (version sans animation). */
  renderOnce() {
    this.needsRender = true;
    this.renderFrame(performance.now());
  }

  setVisible(visible: boolean) {
    this.visible = visible;
    if (visible) this.needsRender = true;
  }

  /** Position normalisée de la souris (-1 → 1). */
  setPointer(x: number, y: number) {
    this.pointer.set(x, y);
  }

  private renderFrame(time: number) {
    if (!this.car) return;

    if (this.fpsSample) {
      // Détection des GPU faibles sur les premières secondes de rendu.
      if (this.fpsSample.start < 0) this.fpsSample.start = time;
      this.fpsSample.frames++;
      const elapsed = time - this.fpsSample.start;
      if (elapsed >= C.performance.sampleMs) {
        const fps = (this.fpsSample.frames * 1000) / elapsed;
        this.fpsSample = null;
        if (fps < C.performance.minFps) this.downgrade();
      }
    }

    // Suivi amorti de la souris.
    const k = C.camera.mouse.damping;
    const before = this.pointerSmooth.clone();
    this.pointerSmooth.lerp(this.pointer, k);
    const pointerMoving = before.distanceToSquared(this.pointerSmooth) > 1e-8;

    const lightsChanged = this.applyLevels(false);
    const cameraChanged = this.updateCamera();
    if (!lightsChanged && !cameraChanged && !pointerMoving && !this.needsRender) return;
    this.needsRender = false;

    this.floor?.update(this.renderer, this.scene, this.camera);
    if (this.composer) this.composer.render();
    else this.renderer.render(this.scene, this.camera);
  }

  private lastCamera = "";

  private updateCamera() {
    const pose = samplePath(this.progress);
    const azimuth = deg(pose.azimuth + this.pointerSmooth.x * C.camera.mouse.yaw);
    const elevation = deg(pose.elevation + this.pointerSmooth.y * C.camera.mouse.pitch);

    // Distance de cadrage : la voiture entière tient dans l'image, quelle que
    // soit l'orientation de l'écran (vertical sur mobile → caméra reculée).
    const { x: width, y: height, z: length } = this.carSize;
    const visibleWidth = Math.abs(Math.sin(azimuth)) * length + Math.abs(Math.cos(azimuth)) * width;
    const visibleDepth = Math.abs(Math.cos(azimuth)) * length + Math.abs(Math.sin(azimuth)) * width;
    const vfov = deg(this.camera.fov);
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * this.camera.aspect);
    const framing = this.width < 768 ? C.camera.framing.mobile : C.camera.framing.desktop;
    const fitH = (visibleWidth / 2) / Math.tan(hfov / 2);
    const fitV = (height * 1.9) / 2 / Math.tan(vfov / 2);
    const distance = (Math.max(fitH, fitV) * framing + visibleDepth / 2) * pose.distance;

    const target = new THREE.Vector3(0, C.camera.targetY + pose.targetY, 0);
    this.camera.position.set(
      target.x + distance * Math.cos(elevation) * Math.sin(azimuth),
      target.y + distance * Math.sin(elevation),
      target.z + distance * Math.cos(elevation) * Math.cos(azimuth),
    );
    this.camera.lookAt(target);

    const key = this.camera.position.toArray().map((v) => v.toFixed(4)).join(",");
    const changed = key !== this.lastCamera;
    this.lastCamera = key;
    return changed;
  }

  private lastLevels = "";

  /** Applique les niveaux d'allumage ; renvoie true si quelque chose a changé. */
  private applyLevels(force: boolean) {
    const { strips, environment, headlights, taillights } = this.levels;
    const key = [...strips, environment, headlights, taillights].join(",");
    if (!force && key === this.lastLevels) return false;
    this.lastLevels = key;

    C.strips.forEach((cfg, i) => {
      const level = this.levels.strips[i] ?? 0;
      const strip = this.strips[i];
      strip.light.intensity = cfg.intensity * level;
      strip.panel.material.color.setScalar(cfg.glow * level);
    });
    this.headlightMaterials.forEach((m) => (m.emissiveIntensity = C.materials.headlights.intensity * this.levels.headlights));
    this.taillightMaterials.forEach((m) => (m.emissiveIntensity = C.materials.taillights.intensity * this.levels.taillights));
    this.updateEnvironment();
    return true;
  }

  /** Recalcule la carte de reflets quand l'allumage des bandes change. */
  private updateEnvironment() {
    if (!this.envScene.background) return;
    const key = [this.levels.environment, ...this.levels.strips].map((v) => v.toFixed(2)).join(",");
    if (key === this.envKey) return;
    this.envKey = key;
    this.envScene.backgroundIntensity = C.environment.intensity * this.levels.environment;
    const previous = this.envTarget;
    this.envTarget = this.pmrem.fromScene(this.envScene, 0, 0.1, 50, {
      size: this.quality === "desktop" ? 256 : 128,
      position: new THREE.Vector3(0, 0.62, 0),
    });
    this.scene.environment = this.envTarget.texture;
    previous?.dispose();
  }

  // --- Divers ----------------------------------------------------------------

  private resize() {
    const rect = this.canvas.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    this.width = width;
    this.height = height;
    this.renderer.setSize(width, height, false);
    const ratio = this.renderer.getPixelRatio();
    this.composer?.setPixelRatio(ratio);
    this.composer?.setSize(width, height);
    this.floor?.setSize(width * ratio, height * ratio);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.needsRender = true;
    if (!this.running && this.car) this.renderFrame(performance.now());
  }

  dispose() {
    this.stop();
    this.resizeObserver.disconnect();
    this.floor?.dispose();
    this.shadow?.dispose();
    this.envTarget?.dispose();
    this.composer?.dispose();
    this.bloom?.dispose();
    this.pmrem.dispose();
    this.disposables.forEach((d) => d.dispose());
    this.scene.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (mesh.isMesh) mesh.geometry.dispose();
    });
    this.renderer.dispose();
  }
}
