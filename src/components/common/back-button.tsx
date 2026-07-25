// components/common/back-button.tsx
"use client";

import * as React from "react";
import { useRef, useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion, useMotionValue, useMotionTemplate, useReducedMotion } from "framer-motion";
import gsap from "gsap";

interface BackButtonProps {
  fallbackHref?: string;
  label?: string;
  className?: string;
}

export function BackButton({
  fallbackHref = "/",
  label = "Go back",
  className = "",
}: BackButtonProps) {
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [isPressed, setIsPressed] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Cursor-tracking glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowGradient = useMotionTemplate`radial-gradient(120px circle at ${mouseX}px ${mouseY}px, hsl(var(--primary) / 0.35), transparent 80%)`;

  // GSAP entrance animation
  useEffect(() => {
    if (prefersReducedMotion || !buttonRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        buttonRef.current,
        {
          opacity: 0,
          x: -40,
          scale: 0.85,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          delay: 0.15,
        }
      );
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Handle mouse move for cursor glow
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current || prefersReducedMotion) return;
      const rect = buttonRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY, prefersReducedMotion]
  );

  // Handle click with ripple + navigation
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      // Ripple origin
      if (buttonRef.current && rippleRef.current && !prefersReducedMotion) {
        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        gsap.fromTo(
          rippleRef.current,
          {
            x,
            y,
            scale: 0,
            opacity: 0.4,
          },
          {
            scale: 3,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
          }
        );
      }

      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 150);

      // Navigate
      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back();
      } else {
        router.push(fallbackHref);
      }
    },
    [router, fallbackHref, prefersReducedMotion]
  );

  // Keyboard handler for ripple on Enter/Space
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        if (buttonRef.current && rippleRef.current && !prefersReducedMotion) {
          const rect = buttonRef.current.getBoundingClientRect();
          const x = rect.width / 2;
          const y = rect.height / 2;

          gsap.fromTo(
            rippleRef.current,
            {
              x,
              y,
              scale: 0,
              opacity: 0.4,
            },
            {
              scale: 3,
              opacity: 0,
              duration: 0.6,
              ease: "power2.out",
            }
          );
        }
      }
    },
    [prefersReducedMotion]
  );

  return (
    <motion.button
      ref={buttonRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onKeyDown={handleKeyDown}
      aria-label={label}
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      whileHover={prefersReducedMotion ? {} : { y: -3 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
      transition={
        prefersReducedMotion
          ? {}
          : { type: "spring", stiffness: 400, damping: 25 }
      }
      className={[
        "group relative isolate inline-flex items-center gap-2.5 overflow-hidden",
        "rounded-full px-5 py-2.5",
        "bg-background/60 backdrop-blur-xl",
        "border border-border/50",
        "text-sm font-medium text-foreground",
        "shadow-[0_2px_16px_-4px_rgba(0,0,0,0.1)]",
        "transition-colors duration-300",
        "hover:bg-background/80 hover:border-primary/30 hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.15)]",
        "dark:shadow-[0_2px_16px_-4px_rgba(0,0,0,0.3)]",
        "dark:hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "active:scale-[0.97]",
        isPressed ? "scale-[0.97]" : "",
        className,
      ].join(" ")}
      style={{
        opacity: prefersReducedMotion ? 1 : undefined,
      }}
    >
      {/* Animated border glow layer */}
      <span
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary) / 0.4), hsl(var(--primary) / 0.1), hsl(var(--primary) / 0.4))",
          backgroundSize: "200% 200%",
          animation: prefersReducedMotion ? "none" : "border-glow 3s ease infinite",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
        aria-hidden
      />

      {/* Cursor-following glow */}
      {!prefersReducedMotion && (
        <motion.div
          ref={glowRef}
          className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glowGradient }}
          aria-hidden
        />
      )}

      {/* Ripple */}
      <span
        ref={rippleRef}
        className="pointer-events-none absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30"
        style={{ opacity: 0 }}
        aria-hidden
      />

      {/* Arrow icon with slide animation */}
      <motion.span
        className="relative inline-flex items-center justify-center"
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <ArrowLeft
          className="h-4 w-4 transition-transform duration-300 ease-out group-hover:-translate-x-0.5"
          strokeWidth={2}
        />
      </motion.span>

      {/* Label text */}
      <span className="relative tracking-wide">Back</span>

      {/* Subtle inner highlight for glass depth */}
      <span
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 60%)",
        }}
        aria-hidden
      />
    </motion.button>
  );
}