"use client";

import * as React from "react";
import { useRef, useState, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
} from "framer-motion";
import { ArrowUpRight, GitGraph, Link, Sparkles, Code2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const ROLES = [
  "Backend Developer",
  "Mobile App Developer",
  "Next.js Developer",
  "DevOps Engineer",
  "AI Engineer",
];

const STACK = ["TypeScript", "React", "Next.js", "Node", "PostgreSQL", "GSAP"];

const STATS = [
  { value: "3+", label: "Years experience" },
  { value: "40+", label: "Projects shipped" },
  { value: "12", label: "Countries served" },
];

// --- Framer Motion variants ---
const ctaContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 1.4 },
  },
};

const ctaItem = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 20 },
  },
};

const badgeContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05, delayChildren: 1.8 },
  },
};

const badgeItem = {
  hidden: { opacity: 0, scale: 0.85, y: 8 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 22 },
  },
};

const statContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 2.0 } },
};

const statItem = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 22 },
  },
};

// --- Rotating role text, cycles on its own ---
function RoleCycler() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % ROLES.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative inline-flex h-[1.2em] items-center overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={ROLES[index]}
          initial={{ y: "100%", opacity: 0, filter: "blur(6px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          className="inline-block text-muted-foreground"
        >
          {ROLES[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function HeroSection() {
  const rootRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);

  // --- Spotlight glare that tracks the cursor over the portrait only ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlight = useMotionTemplate`radial-gradient(220px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.22), transparent 75%)`;

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // --- Headline: split into words, stagger up-reveal ---
      const words = headlineRef.current?.querySelectorAll("[data-word]");
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.set(words ?? [], { yPercent: 120, opacity: 0 })
        .set("[data-eyebrow]", { opacity: 0, y: -8 })
        .set("[data-sub]", { opacity: 0, y: 12 })
        .set(underlineRef.current, { scaleX: 0, transformOrigin: "left center" })
        .set(frameRef.current, { opacity: 0, scale: 0.9, rotate: -3 })
        .to("[data-eyebrow]", { opacity: 1, y: 0, duration: 0.5 })
        .to(
          words ?? [],
          { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.08 },
          "-=0.25"
        )
        .to(
          underlineRef.current,
          { scaleX: 1, duration: 0.7, ease: "power4.inOut" },
          "-=0.55"
        )
        .to("[data-sub]", { opacity: 1, y: 0, duration: 0.6 }, "-=0.35")
        .to(
          frameRef.current,
          { opacity: 1, scale: 1, rotate: 0, duration: 0.9, ease: "back.out(1.4)" },
          "-=0.4"
        );

      // --- Ambient glow: subtle parallax follow on mouse move ---
      const glowX = gsap.quickTo(glowRef.current, "x", {
        duration: 1.2,
        ease: "power3.out",
      });
      const glowY = gsap.quickTo(glowRef.current, "y", {
        duration: 1.2,
        ease: "power3.out",
      });

      // --- Portrait: gentle 3D tilt toward the cursor ---
      const tiltX = gsap.quickTo(frameRef.current, "rotationX", {
        duration: 0.6,
        ease: "power3.out",
      });
      const tiltY = gsap.quickTo(frameRef.current, "rotationY", {
        duration: 0.6,
        ease: "power3.out",
      });
      const liftZ = gsap.quickTo(frameRef.current, "z", {
        duration: 0.6,
        ease: "power3.out",
      });

      const handleMove = (e: MouseEvent) => {
        const rect = rootRef.current?.getBoundingClientRect();
        if (!rect) return;
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;
        glowX(relX * 60);
        glowY(relY * 60);
        tiltX(relY * -10);
        tiltY(relX * 12);
        liftZ(30);
      };

      const handleLeave = () => {
        tiltX(0);
        tiltY(0);
        liftZ(0);
      };

      const node = rootRef.current;
      node?.addEventListener("mousemove", handleMove);
      node?.addEventListener("mouseleave", handleLeave);
      return () => {
        node?.removeEventListener("mousemove", handleMove);
        node?.removeEventListener("mouseleave", handleLeave);
      };
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative isolate overflow-hidden bg-background text-foreground"
    >
      {/* Premium ambient background gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] translate-x-1/3 translate-y-1/3 rounded-full bg-fuchsia-500/5 blur-[100px]" />
      </div>

      {/* Subtle noise texture overlay for premium feel */}
      <div 
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Ambient glow */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[80px] sm:h-[400px] sm:w-[400px]"
        aria-hidden
      />

      {/* Floating decorative rings */}
      <motion.div
        className="pointer-events-none absolute right-[8%] top-[12%] hidden h-24 w-24 rounded-full border border-primary/30 lg:block"
        animate={{ y: [0, -16, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute left-[6%] bottom-[10%] hidden h-14 w-14 rounded-full border border-primary/20 lg:block"
        animate={{ y: [0, 14, 0], x: [0, 8, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-6xl flex-col-reverse gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:flex-row lg:items-center lg:gap-12 lg:px-8 lg:py-24">
        {/* Left: headline */}
        <div className="flex-1 min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-2 sm:mb-6">
            <span
              data-eyebrow
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1 font-mono text-xs tracking-wide text-muted-foreground"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              ~/portfolio <span className="text-primary">$</span> available for work
            </span>
            <span
              data-eyebrow
              className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-3 py-1 font-mono text-xs tracking-wide text-muted-foreground"
            >
              <MapPin className="h-3 w-3 text-primary" />
              open to remote · worldwide
            </span>
          </div>

          <h1
            ref={headlineRef}
            className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            <span className="relative inline-block overflow-visible pb-3 sm:pb-4">
              <span
                data-word
                className="relative inline-block italic bg-gradient-to-r from-primary via-fuchsia-400 to-primary bg-[length:200%_auto] bg-clip-text text-transparent"
                style={{ animation: "gradient-shift 5s ease infinite" }}
              >
                Azlan
              </span>

              {/* Curved premium underline */}
              <span
                ref={underlineRef}
                className="pointer-events-none absolute -bottom-0.5 left-0 w-full origin-left sm:-bottom-1"
                aria-hidden
              >
                <svg
                  viewBox="0 0 300 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-auto w-full overflow-visible"
                >
                  <path
                    d="M5 18C65 5 170 5 295 15"
                    stroke="url(#underlineGradient)"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />

                  <defs>
                    <linearGradient
                      id="underlineGradient"
                      x1="0"
                      y1="0"
                      x2="300"
                      y2="0"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="hsl(var(--primary))" />
                      <stop offset="0.5" stopColor="#e879f9" />
                      <stop offset="1" stopColor="hsl(var(--primary))" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </span>
          
            <span className="block overflow-hidden text-muted-foreground">
              <span data-word className="inline-block">
                <RoleCycler />
              </span>
            </span>
            <span className="block overflow-hidden">
              <span data-word className="inline-block text-primary">
                that ships.
              </span>
            </span>
          </h1>

          <p
            data-sub
            className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg"
          >
            Full-stack developer crafting fast, accessible interfaces and the
            systems behind them — from database schema to the last pixel.
          </p>

          <motion.div
            className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8"
            variants={ctaContainer}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={ctaItem} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button size="lg" className="group relative overflow-hidden rounded-full px-5 sm:px-6">
                <span className="relative z-10 flex items-center text-sm sm:text-base">
                  View my work
                  <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
                <motion.span
                  className="absolute inset-0 -z-0 bg-gradient-to-r from-primary/0 via-white/25 to-primary/0"
                  initial={{ x: "-120%" }}
                  whileHover={{ x: "120%" }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                />
              </Button>
            </motion.div>

            <motion.div variants={ctaItem} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button size="lg" variant="outline" className="rounded-full px-5 sm:px-6">
                <GitGraph className="mr-2 h-4 w-4" />
                <span className="text-sm sm:text-base">GitHub</span>
              </Button>
            </motion.div>

            <motion.div variants={ctaItem} whileHover={{ scale: 1.1, rotate: -6 }} whileTap={{ scale: 0.9 }}>
              <Button size="icon" variant="ghost" className="rounded-full">
                <Link className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-8 flex flex-wrap gap-2 sm:mt-10"
            variants={badgeContainer}
            initial="hidden"
            animate="show"
          >
            {STACK.map((tech) => (
              <motion.span
                key={tech}
                variants={badgeItem}
                whileHover={{ y: -3, scale: 1.06 }}
                className="cursor-default rounded-md border border-border/60 bg-muted/30 px-2.5 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-border/60 pt-5 sm:mt-10 sm:gap-x-8 sm:pt-6"
            variants={statContainer}
            initial="hidden"
            animate="show"
          >
            {STATS.map((stat) => (
              <motion.div key={stat.label} variants={statItem}>
                <div className="font-display text-xl font-semibold text-foreground sm:text-2xl">
                  {stat.value}
                </div>
                <div className="font-mono text-[10px] text-muted-foreground sm:text-[11px]">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right: portrait — at top on mobile due to flex-col-reverse */}
        <div className="w-full shrink-0 lg:flex-1 lg:max-w-sm">
          {/* Outer wrapper: idle float loop */}
          <motion.div
            className="relative mx-auto w-full max-w-[240px] sm:max-w-[280px] lg:max-w-none"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Spinning conic-gradient halo */}
            <motion.div
              className="pointer-events-none absolute -inset-3 rounded-[2rem] opacity-60 blur-md sm:-inset-4 sm:opacity-70"
              style={{
                background:
                  "conic-gradient(from 0deg, hsl(var(--primary)) 0deg, transparent 90deg, hsl(var(--primary)) 180deg, transparent 270deg, hsl(var(--primary)) 360deg)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              aria-hidden
            />

            {/* Orbiting satellite chips */}
            <motion.div
              className="pointer-events-none absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              aria-hidden
            >
              <span className="absolute -top-3 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border border-border/60 bg-background/80 shadow-md backdrop-blur-sm sm:-top-4 sm:h-8 sm:w-8">
                <Code2 className="h-3 w-3 text-primary sm:h-3.5 sm:w-3.5" />
              </span>
            </motion.div>
            <motion.div
              className="pointer-events-none absolute inset-0"
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              aria-hidden
            >
              <span className="absolute -bottom-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border border-border/60 bg-background/80 shadow-md backdrop-blur-sm sm:-bottom-3 sm:-right-3 sm:h-7 sm:w-7">
                <Sparkles className="h-2.5 w-2.5 text-primary sm:h-3 sm:w-3" />
              </span>
            </motion.div>

            <div
              ref={frameRef}
              className="relative aspect-square w-full [perspective:1000px] [transform-style:preserve-3d]"
            >
              {/* corner brackets */}
              <span className="absolute -left-2 -top-2 h-6 w-6 rounded-tl-xl border-l-2 border-t-2 border-primary sm:-left-2.5 sm:-top-2.5 sm:h-8 sm:w-8" />
              <span className="absolute -bottom-2 -right-2 h-6 w-6 rounded-br-xl border-b-2 border-r-2 border-primary sm:-bottom-2.5 sm:-right-2.5 sm:h-8 sm:w-8" />

              {/* rotating dashed ring accent */}
              <motion.span
                className="pointer-events-none absolute -inset-2 rounded-[1.5rem] border border-dashed border-primary/25 sm:-inset-3 sm:rounded-[1.75rem]"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                aria-hidden
              />

              {/* glow ring behind the portrait */}
              <div
                className="absolute inset-3 -z-10 rounded-2xl bg-primary/20 blur-2xl sm:inset-4 sm:bg-primary/30"
                aria-hidden
              />

              <motion.div
                ref={imageWrapRef}
                className="group relative h-full w-full overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xl shadow-primary/10 sm:rounded-2xl"
                whileHover="hover"
                initial="rest"
                animate="rest"
                onMouseMove={handleImageMouseMove}
              >
                <motion.div
                  className="relative h-full w-full"
                  variants={{ rest: { scale: 1 }, hover: { scale: 1.08 } }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <Image
                    src="/images/profile_three.webp"
                    alt="Portrait of Azlan"
                    fill
                    priority
                    sizes="(min-width: 1024px) 384px, (min-width: 640px) 280px, 240px"
                    className="object-cover grayscale transition-[filter] duration-500 group-hover:grayscale-0"
                  />
                </motion.div>

                {/* cursor-tracking spotlight glare */}
                <motion.div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 mix-blend-overlay"
                  style={{ background: spotlight }}
                  aria-hidden
                />

                {/* diagonal shine sweep */}
                <motion.div
                  className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                  animate={{ x: ["0%", "420%"] }}
                  transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 2.4, ease: "easeInOut" }}
                  aria-hidden
                />

                {/* soft gradient wash */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />

                {/* sparkle badge */}
                <motion.div
                  className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full border border-border/60 bg-background/80 px-2 py-0.5 font-mono text-[10px] text-muted-foreground backdrop-blur sm:bottom-3 sm:right-3 sm:px-2.5 sm:py-1 sm:text-[11px]"
                  variants={{
                    rest: { opacity: 0, y: 8 },
                    hover: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.25 }}
                >
                  <Sparkles className="h-2.5 w-2.5 text-primary sm:h-3 sm:w-3" />
                  open to work
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="pointer-events-none absolute bottom-4 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1.5 text-muted-foreground sm:bottom-6 lg:flex"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="font-mono text-[10px] tracking-widest">SCROLL</span>
        <span className="h-6 w-px bg-gradient-to-b from-primary to-transparent sm:h-8" />
      </motion.div>

      <style jsx>{`
        @keyframes gradient-shift {
          0% {
            background-position: 0% center;
          }
          100% {
            background-position: 200% center;
          }
        }
      `}</style>
    </section>
  );
}