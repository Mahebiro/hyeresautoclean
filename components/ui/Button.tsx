"use client";

import { useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { gsap, hasFinePointer, prefersReducedMotion } from "../motion/gsap";

type Variant = "primary" | "secondary" | "ghost" | "outlineLight";
type Size = "md" | "lg";

// Couleur de fond, et couleur de « remplissage » qui monte au survol.
const variantClasses: Record<Variant, { base: string; fill: string }> = {
  primary: {
    base: "bg-navy-900 text-white shadow-premium disabled:bg-navy-300",
    fill: "bg-navy-600",
  },
  secondary: {
    base: "bg-white text-navy-900 hover:text-white border border-navy-200 disabled:text-navy-300",
    fill: "bg-navy-900",
  },
  ghost: {
    base: "bg-transparent text-navy-900 hover:text-white border border-navy-900/20 disabled:text-navy-300",
    fill: "bg-navy-900",
  },
  outlineLight: {
    base: "bg-transparent text-white hover:text-navy-900 border border-white/60 disabled:text-white/40",
    fill: "bg-white",
  },
};

const sizeClasses: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

const baseClasses =
  "group relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:cursor-not-allowed";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

interface ButtonAsLink extends CommonProps {
  href: string;
  onClick?: () => void;
}

interface ButtonAsButton
  extends CommonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> {
  href?: undefined;
}

type ButtonProps = ButtonAsLink | ButtonAsButton;

/**
 * Effet magnétique (desktop) : le bouton suit légèrement la souris, puis
 * revient en place avec un retour élastique amorti.
 */
function useMagnetic<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !hasFinePointer() || prefersReducedMotion()) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
    const onMove = (event: PointerEvent) => {
      if ((el as unknown as HTMLButtonElement).disabled) return;
      const rect = el.getBoundingClientRect();
      // Attraction proportionnelle, plafonnée : quelques pixels au maximum,
      // même pour les boutons pleine largeur.
      xTo(gsap.utils.clamp(-10, 10, (event.clientX - (rect.left + rect.width / 2)) * 0.25));
      yTo(gsap.utils.clamp(-6, 6, (event.clientY - (rect.top + rect.height / 2)) * 0.35));
    };
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 1.1, ease: "elastic.out(1, 0.55)", overwrite: true });
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el);
    };
  }, []);
  return ref;
}

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className = "", children } = props;
  const { base, fill } = variantClasses[variant];
  const classes = `${baseClasses} ${base} ${sizeClasses[size]} ${className}`;
  const linkRef = useMagnetic<HTMLAnchorElement>();
  const buttonRef = useMagnetic<HTMLButtonElement>();

  const inner = (
    <>
      {/* Remplissage fluide qui monte depuis le bas au survol. */}
      <span
        aria-hidden="true"
        className={`btn-fill pointer-events-none absolute inset-0 -z-10 rounded-[inherit] ${fill}`}
      />
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </>
  );

  if ("href" in props && props.href) {
    return (
      <a ref={linkRef} href={props.href} onClick={props.onClick} className={classes}>
        {inner}
      </a>
    );
  }

  const { type = "button", variant: _v, size: _s, className: _c, children: _ch, ...rest } = props as ButtonAsButton;
  void _v;
  void _s;
  void _c;
  void _ch;
  return (
    <button ref={buttonRef} type={type} className={classes} {...rest}>
      {inner}
    </button>
  );
}
