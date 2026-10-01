"use client";

import type { MotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import { GROUND_Y_PERCENT, PHASES } from "./constants";

// Toutes les particules (gouttes, mousse, étincelles) sont dessinées dans un
// seul canvas, en lecture directe de la progression du scroll à chaque
// frame : aucune particule n'a d'état "temps réel" propre, donc remonter
// dans le scroll fait exactement rembobiner l'animation.

interface Particle {
  seed: number;
  x: number; // 0..1 du canvas
  y: number; // 0..1 du canvas
}

function seededRandom(seed: number) {
  const x = Math.sin(seed * 999.17) * 43758.5453;
  return x - Math.floor(x);
}

function makeParticles(count: number, xMin: number, xMax: number, yMin: number, yMax: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      seed: i,
      x: xMin + seededRandom(i * 7 + 1) * (xMax - xMin),
      y: yMin + seededRandom(i * 13 + 2) * (yMax - yMin),
    });
  }
  return particles;
}

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

export function WashParticles({
  progress,
  reduceParticles,
}: {
  progress: MotionValue<number>;
  reduceParticles: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dropCount = reduceParticles ? 7 : 14;
    const foamCount = reduceParticles ? 20 : 42;
    const sparkleCount = reduceParticles ? 8 : 16;

    const carXMin = 0.3;
    const carXMax = 0.7;
    const carYMin = GROUND_Y_PERCENT / 100 - 0.26;
    const carYMax = GROUND_Y_PERCENT / 100 - 0.02;

    const drops = makeParticles(dropCount, carXMin + 0.02, carXMax - 0.02, carYMin - 0.05, carYMin + 0.02);
    const foam = makeParticles(foamCount, carXMin, carXMax, carYMin, carYMax);
    const sparkles = makeParticles(sparkleCount, carXMin - 0.08, carXMax + 0.08, carYMin - 0.1, carYMax + 0.05);

    let frameId = 0;
    let visible = true;

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
    }

    resize();
    window.addEventListener("resize", resize);

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    function draw() {
      if (!canvas || !ctx) return;
      frameId = requestAnimationFrame(draw);
      if (!visible) return;

      const p = progress.get();
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // --- 1. Prélavage : des gouttes tombent, la saleté diminue un peu ---
      const dropLocal = clamp01((p - PHASES.arriveEnd) / (PHASES.wash1End - PHASES.arriveEnd));
      if (dropLocal > 0 && dropLocal < 1) {
        ctx.fillStyle = "rgba(190, 225, 255, 0.85)";
        for (const d of drops) {
          const startOffset = seededRandom(d.seed * 3 + 5) * 0.4;
          const fall = clamp01((dropLocal - startOffset) / (1 - startOffset));
          if (fall <= 0 || fall >= 1) continue;
          const y = (carYMin - 0.05 + fall * 0.3) * h;
          const x = d.x * w;
          const alpha = fall < 0.85 ? 1 : 1 - (fall - 0.85) / 0.15;
          ctx.globalAlpha = Math.max(0, alpha);
          ctx.beginPath();
          ctx.ellipse(x, y, w * 0.0025, w * 0.006, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // --- 2 & 3. Mousse active puis rinçage ---
      const foamIn = clamp01((p - PHASES.wash1End) / (PHASES.wash2End - PHASES.wash1End));
      const foamOut = clamp01((p - PHASES.wash2End) / (PHASES.wash3End - PHASES.wash2End));
      if (foamIn > 0) {
        for (const f of foam) {
          const threshold = seededRandom(f.seed * 5 + 9);
          const appear = clamp01((foamIn - threshold * 0.7) / 0.3);
          const shrink = 1 - foamOut;
          const scale = appear * shrink;
          if (scale <= 0.02) continue;
          const radius = (w * 0.016 + seededRandom(f.seed * 11 + 4) * w * 0.012) * scale;
          const x = f.x * w + Math.sin(f.seed) * w * 0.01;
          const y = f.y * h + foamOut * h * 0.05 * seededRandom(f.seed * 17 + 1);
          ctx.globalAlpha = 0.9 * scale + 0.1;
          ctx.fillStyle = "rgba(255,255,255,0.95)";
          ctx.beginPath();
          ctx.arc(x, y, Math.max(0, radius), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // --- 4. Étincelles finales ---
      const sparkleLocal = clamp01((p - PHASES.washEnd) / (PHASES.resultEnd - PHASES.washEnd));
      if (sparkleLocal > 0) {
        for (const s of sparkles) {
          const phase = seededRandom(s.seed * 23 + 6);
          const twinkle = 0.5 + 0.5 * Math.sin((sparkleLocal + phase) * Math.PI * 4);
          const alpha = sparkleLocal * twinkle;
          if (alpha <= 0.05) continue;
          const x = s.x * w;
          const y = s.y * h;
          const size = w * 0.006 * (0.6 + 0.4 * twinkle);
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = "rgba(255,255,255,0.95)";
          ctx.lineWidth = Math.max(1, w * 0.0012);
          ctx.beginPath();
          ctx.moveTo(x - size, y);
          ctx.lineTo(x + size, y);
          ctx.moveTo(x, y - size);
          ctx.lineTo(x, y + size);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }
    }

    frameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, [progress, reduceParticles]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />;
}
