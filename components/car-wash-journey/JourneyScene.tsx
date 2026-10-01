"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { type RefObject, useEffect, useState } from "react";
import { carWashJourney } from "@/content/site-data";
import { withBasePath } from "@/lib/basePath";
import { Button } from "../ui/Button";
import {
  CAR_ASPECT_RATIO,
  GROUND_Y_PERCENT,
  PHASES,
  WHEEL_DIAMETER_PERCENT,
  WHEEL_LEFT_X_PERCENT,
  WHEEL_RIGHT_X_PERCENT,
  WHEEL_Y_PERCENT,
} from "./constants";
import { WashParticles } from "./WashParticles";

const img = (name: string) => withBasePath(`/images/car-wash-journey/${name}`);

function ParallaxLayer({
  src,
  x,
  top,
  height,
}: {
  src: string;
  x: MotionValue<number>;
  top: string;
  height: string;
}) {
  return (
    <motion.div
      aria-hidden
      className="absolute left-0 w-full"
      style={{
        top,
        height,
        backgroundImage: `url(${src})`,
        backgroundRepeat: "repeat-x",
        backgroundSize: "auto 100%",
        backgroundPositionX: x,
        backgroundPositionY: "bottom",
      }}
    />
  );
}

function Wheel({ isDriving, side }: { isDriving: boolean; side: "left" | "right" }) {
  const xPercent = side === "left" ? WHEEL_LEFT_X_PERCENT : WHEEL_RIGHT_X_PERCENT;
  return (
    <div
      className="absolute"
      style={{
        left: `${xPercent}%`,
        top: `${WHEEL_Y_PERCENT}%`,
        width: `${WHEEL_DIAMETER_PERCENT}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <motion.img
        src={img("wheel.webp")}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        className="block w-full"
        animate={isDriving ? { rotate: 360 } : {}}
        transition={isDriving ? { duration: 0.5, repeat: Infinity, ease: "linear" } : { duration: 0.2 }}
      />
    </div>
  );
}

export function JourneyScene({ sectionRef }: { sectionRef: RefObject<HTMLDivElement | null> }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isDriving, setIsDriving] = useState(true);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { scrollYProgress: rawScrollProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  // La scène termine son déroulé un peu avant la fin réelle du scroll
  // disponible : ça laisse une marge pendant laquelle la scène reste épinglée
  // avec le résultat final déjà stable, au lieu de faire coïncider l'instant
  // où l'animation atteint 100 % avec l'instant exact où elle se désépingle
  // (ce qui provoque un clignotement d'une frame sur certains navigateurs).
  const scrollYProgress = useTransform(rawScrollProgress, [0, 0.93], [0, 1], { clamp: true });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setIsDriving(v < PHASES.roadEnd);
  });

  const farX = useTransform(scrollYProgress, [0, PHASES.roadEnd], [0, -500]);
  const midX = useTransform(scrollYProgress, [0, PHASES.roadEnd], [0, -1100]);
  const nearX = useTransform(scrollYProgress, [0, PHASES.roadEnd], [0, -2200]);

  const dirtOpacity = useTransform(
    scrollYProgress,
    [0, PHASES.roadEnd, PHASES.wash2End, PHASES.wash3End],
    [0, 1, 1, 0],
  );
  const shopOpacity = useTransform(scrollYProgress, [PHASES.roadEnd - 0.03, PHASES.arriveEnd], [0, 1]);
  const carTilt = useTransform(scrollYProgress, [PHASES.roadEnd, PHASES.arriveEnd], [0, -3]);

  const caption1 = useTransform(scrollYProgress, [0.02, 0.06, 0.11, 0.15], [0, 1, 1, 0]);
  const caption2 = useTransform(scrollYProgress, [0.17, 0.21, 0.26, 0.3], [0, 1, 1, 0]);
  const caption3 = useTransform(scrollYProgress, [0.32, 0.36, 0.41, 0.45], [0, 1, 1, 0]);

  const stage1Opacity = useTransform(
    scrollYProgress,
    [PHASES.arriveEnd, PHASES.arriveEnd + 0.015, PHASES.wash1End - 0.015, PHASES.wash1End],
    [0, 1, 1, 0],
  );
  const stage2Opacity = useTransform(
    scrollYProgress,
    [PHASES.wash1End, PHASES.wash1End + 0.015, PHASES.wash2End - 0.015, PHASES.wash2End],
    [0, 1, 1, 0],
  );
  const stage3Opacity = useTransform(
    scrollYProgress,
    [PHASES.wash2End, PHASES.wash2End + 0.015, PHASES.wash3End - 0.015, PHASES.wash3End],
    [0, 1, 1, 0],
  );
  const stage4Opacity = useTransform(
    scrollYProgress,
    [PHASES.wash3End, PHASES.wash3End + 0.015, PHASES.washEnd - 0.015, PHASES.washEnd],
    [0, 1, 1, 0],
  );

  const shineOpacity = useTransform(
    scrollYProgress,
    [PHASES.wash3End, PHASES.wash3End + 0.02, PHASES.washEnd - 0.02, PHASES.washEnd],
    [0, 1, 1, 0],
  );
  const shineX = useTransform(scrollYProgress, [PHASES.wash3End, PHASES.washEnd], ["-40%", "220%"]);

  const resultOpacity = useTransform(scrollYProgress, [PHASES.washEnd, PHASES.washEnd + 0.05], [0, 1]);
  const resultY = useTransform(scrollYProgress, [PHASES.washEnd, PHASES.washEnd + 0.05], [20, 0]);

  const sparkleOpacity = useTransform(scrollYProgress, [PHASES.washEnd, PHASES.washEnd + 0.03], [0, 1]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-sky-200 via-sky-50 to-white">
      <ParallaxLayer src={img("bg-far.webp")} x={farX} top="0%" height="62%" />
      <ParallaxLayer src={img("bg-mid.webp")} x={midX} top="36%" height="36%" />

      {/* route */}
      <div
        className="absolute inset-x-0 bottom-0 bg-gradient-to-b from-navy-800 to-navy-950"
        style={{ top: `${GROUND_Y_PERCENT}%` }}
      />
      <div
        className="absolute inset-x-0 opacity-90"
        style={{ bottom: `${100 - GROUND_Y_PERCENT}%`, height: "2px", background: "rgba(255,255,255,0.35)" }}
      />

      <ParallaxLayer
        src={img("bg-near.webp")}
        x={nearX}
        top={`${GROUND_Y_PERCENT - 19}%`}
        height="19%"
      />

      {/* façade : positionnée pour que l'enseigne reste visible au-dessus du
          toit de la voiture (voir public/images/car-wash-journey/README.md
          si vous changez les proportions de shop-front.webp) */}
      <motion.img
        src={img("shop-front.webp")}
        alt="Façade de Hyères Auto Clean"
        loading="lazy"
        decoding="async"
        className="absolute left-1/2 h-auto w-[92%] max-w-none -translate-x-1/2 object-contain"
        style={{
          top: "26%",
          opacity: shopOpacity,
        }}
      />

      {/* voiture */}
      <div
        className="absolute left-1/2"
        style={{
          top: `${GROUND_Y_PERCENT}%`,
          width: "30%",
          transform: "translate(-50%, -100%)",
        }}
      >
        <motion.div style={{ rotate: carTilt }}>
          <motion.div
            animate={isDriving ? { y: [0, -5, 0] } : { y: 0 }}
            transition={isDriving ? { duration: 0.65, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
            className="relative w-full"
            style={{ aspectRatio: CAR_ASPECT_RATIO }}
          >
            <img
              src={img("car-clean.webp")}
              alt=""
              aria-hidden
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-contain"
            />
            <motion.img
              src={img("car-dirt.webp")}
              alt=""
              aria-hidden
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-contain"
              style={{ opacity: dirtOpacity }}
            />

            <Wheel isDriving={isDriving} side="left" />
            <Wheel isDriving={isDriving} side="right" />

            <WashParticles progress={scrollYProgress} reduceParticles={isMobile} />

            <motion.div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ opacity: shineOpacity }}>
              <motion.div
                className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-white/80 to-transparent mix-blend-screen"
                style={{ x: shineX }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* textes de la route */}
      <div className="pointer-events-none absolute inset-x-0 top-[8%] flex justify-center px-6 text-center sm:top-[10%]">
        <motion.p style={{ opacity: caption1 }} className="absolute font-display text-lg font-semibold text-navy-900 drop-shadow-sm sm:text-2xl">
          {carWashJourney.roadCaptions[0]}
        </motion.p>
        <motion.p style={{ opacity: caption2 }} className="absolute font-display text-lg font-semibold text-navy-900 drop-shadow-sm sm:text-2xl">
          {carWashJourney.roadCaptions[1]}
        </motion.p>
        <motion.p style={{ opacity: caption3 }} className="absolute font-display text-lg font-semibold text-navy-900 drop-shadow-sm sm:text-2xl">
          {carWashJourney.roadCaptions[2]}
        </motion.p>
      </div>

      {/* étapes du lavage */}
      <div className="pointer-events-none absolute inset-x-0 top-[10%] flex justify-center px-6 text-center">
        {carWashJourney.washSteps.map((step, index) => {
          const opacity = [stage1Opacity, stage2Opacity, stage3Opacity, stage4Opacity][index];
          return (
            <motion.div
              key={step.title}
              style={{ opacity }}
              className="absolute rounded-full bg-navy-900/90 px-5 py-2 text-sm font-semibold text-white shadow-premium sm:text-base"
            >
              {step.title} <span className="font-normal text-white/75">— {step.description}</span>
            </motion.div>
          );
        })}
      </div>

      {/* étincelles autour de la carrosserie lors du résultat */}
      <motion.div
        style={{ opacity: sparkleOpacity }}
        className="pointer-events-none absolute inset-0"
        aria-hidden
      />

      {/* résultat final : réutilise la même zone (haut de la scène) que les
          textes de la route et les étapes du lavage, qui ont disparu à ce
          stade du scroll */}
      <motion.div
        style={{ opacity: resultOpacity, y: resultY }}
        className="pointer-events-auto absolute inset-x-0 top-[6%] flex flex-col items-center gap-4 px-6 text-center"
      >
        <h3 className="font-display text-2xl font-bold text-navy-900 drop-shadow-sm sm:text-3xl">
          {carWashJourney.resultTitle}
        </h3>
        <Button href="#reservation" size="lg">
          {carWashJourney.resultCta}
        </Button>
      </motion.div>

      {/* barre de progression */}
      <div className="absolute inset-x-6 bottom-3 h-1 overflow-hidden rounded-full bg-navy-900/10">
        <motion.div
          className="h-full origin-left rounded-full bg-navy-900"
          style={{ scaleX: scrollYProgress }}
        />
      </div>
    </div>
  );
}
