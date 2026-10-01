"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { preload } from "react-dom";
import { company } from "@/content/site-data";
import { withBasePath } from "@/lib/basePath";
import { Button } from "../ui/Button";
import { SHOWROOM_CONFIG as C } from "./config";
import type { Quality } from "./engine";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const MOBILE_QUERY = "(max-width: 767px), (pointer: coarse)";

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const getReducedMotion = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;
const getReducedMotionServer = () => false;

/**
 * Accélération graphique disponible ? Sans GPU (rendu logiciel SwiftShader,
 * llvmpipe…), la scène 3D saturerait le processeur : on affiche alors une
 * image fixe de la voiture, et la 3D n'est même pas téléchargée.
 */
function hasHardwareGpu() {
  try {
    // failIfMajorPerformanceCaveat : sans vraie accélération, le navigateur
    // refuse le contexte au lieu de démarrer un rendu logiciel coûteux.
    const gl = document
      .createElement("canvas")
      .getContext("webgl", { failIfMajorPerformanceCaveat: true, powerPreference: "low-power" });
    if (!gl) return false;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
  } catch {
    return false;
  }
}

/** Qualité de départ ; `?showroom=desktop|mobile|lite` force un mode (tests). */
function pickQuality(): { quality: Quality; adaptive: boolean } {
  const forced = new URLSearchParams(window.location.search).get("showroom");
  if (forced === "desktop" || forced === "mobile" || forced === "lite") return { quality: forced, adaptive: false };
  return { quality: window.matchMedia(MOBILE_QUERY).matches ? "mobile" : "desktop", adaptive: true };
}

type Status = "loading" | "ready" | "error" | "poster";

// Le titre est découpé en lettres pour l'apparition lettre par lettre.
const TITLE_LINES = ["HYÈRES", "AUTO CLEAN"];

/**
 * Hero « Allumage du showroom » : la GT3 RS sculptée par la lumière dans un
 * studio noir, intro automatique puis rotation de caméra au scroll.
 * Tous les réglages sont dans ./config.js.
 */
export function ShowroomHero() {
  // Image fixe préchargée dès le <head> : premier affichage rapide (LCP).
  preload(withBasePath("/assets/hero-poster-mobile.webp"), { as: "image", fetchPriority: "high", media: "(max-width: 767px)" });
  preload(withBasePath("/assets/hero-poster-desktop.webp"), { as: "image", fetchPriority: "high", media: "(min-width: 768px)" });
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const contentScrollRef = useRef<HTMLDivElement>(null);
  const blackoutRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [percent, setPercent] = useState(0);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, getReducedMotionServer);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    let disposed = false;
    const cleanups: (() => void)[] = [];

    (async () => {
      const forced = new URLSearchParams(window.location.search).has("showroom");
      if (!forced && !hasHardwareGpu()) {
        setStatus("poster");
        return;
      }

      const [{ Showroom }, { gsap }, { ScrollTrigger }, intro] = await Promise.all([
        import("./engine"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("./intro"),
      ]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);

      // Le défilement doux (Lenis) est géré pour tout le site par MotionProvider.

      const { quality, adaptive } = pickQuality();
      const engine = new Showroom(canvas, { quality, adaptive: adaptive && !reducedMotion });
      cleanups.push(() => engine.dispose());
      section.dataset.quality = engine.quality;
      // Mode test (`?showroom=…`) : moteur accessible depuis la console.
      if (new URLSearchParams(window.location.search).has("showroom")) {
        (window as unknown as { __showroom: unknown }).__showroom = engine;
      }
      engine.onQualityChange = (q) => (section.dataset.quality = q);

      try {
        await engine.load(
          { model: withBasePath(C.model.url), hdri: withBasePath(C.environment.hdri) },
          (ratio) => !disposed && setPercent(Math.round(ratio * 100)),
        );
      } catch (error) {
        console.warn("[ShowroomHero] chargement impossible :", error);
        if (!disposed) setStatus("error");
        return;
      }
      if (disposed) return;
      setStatus("ready");

      // Pause du rendu quand le hero n'est plus à l'écran.
      const observer = new IntersectionObserver(([entry]) => engine.setVisible(entry.isIntersecting));
      observer.observe(section);
      cleanups.push(() => observer.disconnect());

      const letters = Array.from(titleRef.current?.querySelectorAll("[data-letter]") ?? []);

      if (reducedMotion) {
        // Pas d'intro ni de scroll épinglé : voiture éclairée, de 3/4 avant.
        intro.setFinalLevels(engine.levels);
        engine.progress = 0;
        engine.renderOnce();
        return;
      }

      const timeline = intro.createIntroTimeline(gsap, engine.levels, {
        letters,
        content: contentRef.current,
        blackout: blackoutRef.current,
      });
      cleanups.push(() => timeline.kill());
      if (new URLSearchParams(window.location.search).has("showroom")) {
        (window as unknown as { __showroomIntro: unknown }).__showroomIntro = timeline;
      }
      engine.start();
      // Laisse le loader disparaître avant l'allumage.
      gsap.delayedCall(0.45, () => timeline.play());

      // Caméra pilotée par le scroll (section épinglée, scrub lissé).
      const proxy = { progress: 0 };
      const scrollTween = gsap.to(proxy, {
        progress: 1,
        ease: "sine.inOut",
        onUpdate: () => (engine.progress = proxy.progress),
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: C.camera.scrub,
          invalidateOnRefresh: true,
        },
      });
      // Le texte d'accroche s'efface dès le début du scroll.
      const contentTween = gsap.to(contentScrollRef.current, {
        autoAlpha: 0,
        y: -30,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * 0.35}`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      cleanups.push(() => {
        scrollTween.scrollTrigger?.kill();
        scrollTween.kill();
        contentTween.scrollTrigger?.kill();
        contentTween.kill();
      });

      // Suivi léger de la souris (desktop uniquement).
      if (window.matchMedia("(pointer: fine)").matches) {
        const onMove = (event: PointerEvent) =>
          engine.setPointer((event.clientX / window.innerWidth) * 2 - 1, (event.clientY / window.innerHeight) * 2 - 1);
        window.addEventListener("pointermove", onMove, { passive: true });
        cleanups.push(() => window.removeEventListener("pointermove", onMove));
      }
    })();

    return () => {
      disposed = true;
      cleanups.reverse().forEach((cleanup) => cleanup());
    };
  }, [reducedMotion]);

  const showStatic = reducedMotion || status === "error" || status === "poster";
  // Fond de studio : léger halo gris derrière la voiture, noir sur les bords.
  const backdrop = `radial-gradient(ellipse 85% 65% at 50% 58%, ${C.colors.backgroundGlow} 0%, ${C.colors.background} 75%)`;
  const scrollLength = showStatic ? 0 : C.camera.scrollLength;

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-label={`${company.name} — ${company.activity}`}
      className="showroom-hero relative"
      data-header-overlay
      data-status={status}
      data-static={showStatic ? "true" : "false"}
      style={{
        height: `${(1 + scrollLength) * 100}svh`,
        // Le hero passe sous la barre du haut (transparente à cet endroit).
        marginTop: "calc(-1 * var(--header-h))",
        background: backdrop,
      }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Image fixe de la scène : visible (assombrie) pendant le chargement,
            puis remplacée par la 3D — ou conservée sur les appareils sans
            accélération graphique et si le modèle ne peut pas être chargé. */}
        <picture className="showroom-poster">
            <source media="(max-width: 767px)" srcSet={withBasePath("/assets/hero-poster-mobile.webp")} />
            <img
              src={withBasePath("/assets/hero-poster-desktop.webp")}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              fetchPriority="high"
            />
        </picture>

        {/* Titre géant, derrière la voiture (le canvas est transparent). */}
        <h1
          ref={titleRef}
          aria-label={company.name}
          className="showroom-title pointer-events-none absolute inset-x-0 top-[26%] select-none text-center font-display font-black uppercase leading-[0.86] tracking-[-0.02em] text-white md:top-[15%]"
          style={{ opacity: C.title.opacity }}
        >
          {TITLE_LINES.map((line) => (
            <span key={line} aria-hidden="true" className="block whitespace-nowrap">
              {Array.from(line).map((char, i) => (
                <span key={i} data-letter className="inline-block">
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <canvas ref={canvasRef} className="showroom-canvas absolute inset-0 h-full w-full" aria-hidden="true" />

        {/* Voile noir de départ de l'intro (levé par GSAP). */}
        {!showStatic && (
          <div
            ref={blackoutRef}
            className="pointer-events-none absolute inset-0"
            style={{ background: backdrop, opacity: C.intro.veilOpacity }}
          />
        )}

        {/* Vignette et grain filmique (calques CSS très légers). */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 75% 70% at 50% 48%, transparent 45%, rgba(0,0,0,${C.postfx.vignette}) 100%)`,
          }}
        />
        <div className="showroom-grain pointer-events-none absolute inset-[-50%]" style={{ opacity: C.postfx.grain }} />

        <div ref={contentScrollRef} className="absolute inset-x-0 bottom-0 z-10">
          <div ref={contentRef} className="showroom-content flex flex-col items-center px-4 pb-8 text-center sm:pb-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/55 sm:text-xs">
              {company.zone}
            </p>
            <p className="mt-3 max-w-xl text-base text-white/85 sm:text-lg">
              {company.activity} — <span className="italic text-white/70">« {company.slogan} »</span>
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button href="#reservation" variant="secondary" size="lg">
                Réserver un nettoyage
              </Button>
              <Button href="#formules" variant="outlineLight" size="lg">
                Découvrir nos formules
              </Button>
            </div>
          </div>
        </div>

        {/* Loader : compteur qui suit le vrai chargement du modèle. */}
        <div
          className="showroom-loader pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-5"
          style={{ background: "radial-gradient(circle at 50% 50%, rgba(13, 14, 16, 0.6), transparent 65%)" }}
          aria-hidden={status !== "loading"}
        >
          <span className="font-display text-xs font-semibold uppercase tracking-[0.45em] text-white/70 sm:text-sm">
            {company.name}
          </span>
          <div className="h-px w-40 overflow-hidden bg-white/15 sm:w-56">
            <div className="h-full bg-white/80 transition-[width] duration-200" style={{ width: `${percent}%` }} />
          </div>
          <span className="font-display text-sm font-light tabular-nums text-white/60" role="status" aria-live="polite">
            {percent}%
          </span>
        </div>
      </div>
    </section>
  );
}
