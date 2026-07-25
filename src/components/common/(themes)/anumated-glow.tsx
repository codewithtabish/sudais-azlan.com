"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface AnimatedGlowProps {
  /** Diameter in px. Default 420. */
  size?: number;
  /** Blur radius in px. Default 110. */
  blur?: number;
  /** Any Tailwind bg + opacity utility. Stays theme-aware if you use a
   *  semantic token like bg-primary/25 (default) or bg-foreground/10. */
  colorClassName?: string;
  /** Glow drifts toward the cursor. Set false for a static ambient glow. */
  followCursor?: boolean;
  /** Extra classes, e.g. to reposition or restrict to a section instead
   *  of the full viewport. */
  className?: string;
}

/**
 * Drop this once near the top of any page/layout:
 *
 *   import { AnimatedGlow } from "@/components/animated-glow";
 *   ...
 *   <AnimatedGlow />
 *
 * It renders a fixed, full-viewport, non-interactive ambient glow behind
 * your content (-z-10). Uses bg-primary by default so it automatically
 * adapts to light/dark mode via your shadcn theme tokens — no hardcoded
 * colors. Respects prefers-reduced-motion (falls back to a static glow).
 */
export function AnimatedGlow({
  size = 420,
  blur = 110,
  colorClassName = "bg-primary/25",
  followCursor = true,
  className = "",
}: AnimatedGlowProps) {
  const glowRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!followCursor || !glowRef.current) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const xTo = gsap.quickTo(glowRef.current, "x", {
        duration: 1.1,
        ease: "power3.out",
      });
      const yTo = gsap.quickTo(glowRef.current, "y", {
        duration: 1.1,
        ease: "power3.out",
      });

      const handleMove = (e: MouseEvent) => {
        xTo(e.clientX - size / 2);
        yTo(e.clientY - size / 2);
      };

      window.addEventListener("mousemove", handleMove);
      return () => window.removeEventListener("mousemove", handleMove);
    });

    return () => mm.revert();
  }, [followCursor, size]);

  return (
    <div
      ref={glowRef}
      aria-hidden
      className={`pointer-events-none fixed left-0 top-1/3 -z-10 rounded-full motion-reduce:transition-none ${colorClassName} ${className}`}
      style={{
        width: size,
        height: size,
        filter: `blur(${blur}px)`,
        transform: followCursor
          ? undefined
          : `translateX(calc(50vw - ${size / 2}px))`,
      }}
    />
  );
}
