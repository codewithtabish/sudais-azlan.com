"use client";

import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { Sparkles } from "lucide-react";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  badge,
  title,
  description,
  align = "center",
}: SectionHeaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 80%",
        },
      });

      tl.from("[data-badge]", {
        opacity: 0,
        y: -15,
        duration: 0.5,
      })
        .from(
          "[data-title]",
          {
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: "power4.out",
          },
          "-=0.2"
        )
        .from(
          underlineRef.current,
          {
            drawSVG: "0%",
            duration: 1,
            ease: "power3.out",
          },
          "-=0.5"
        )
        .from(
          "[data-description]",
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
          },
          "-=0.5"
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className={`relative mb-16 flex flex-col ${
        align === "center" ? "items-center text-center" : "items-start"
      }`}
    >
      <motion.div
        data-badge
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{
          type: "spring",
          stiffness: 260,
        }}
        className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-4 py-1.5 text-xs font-medium backdrop-blur"
      >
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        {badge}
      </motion.div>

      <div className="relative">
        <motion.h2
          data-title
          className="text-4xl font-bold tracking-tight sm:text-5xl"
          whileHover={{
            scale: 1.02,
          }}
        >
          {title}
        </motion.h2>

        <motion.svg
          viewBox="0 0 320 28"
          className="absolute -bottom-4 left-1/2 w-[220px] -translate-x-1/2 overflow-visible"
          animate={{
            y: [0, 2, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut",
          }}
        >
          <defs>
            <linearGradient
              id="section-gradient"
              x1="0%"
              x2="100%"
            >
              <stop stopColor="hsl(var(--primary))" />
              <stop offset="50%" stopColor="#d946ef" />
              <stop offset="100%" stopColor="hsl(var(--primary))" />
            </linearGradient>
          </defs>

          <motion.path
            ref={underlineRef}
            d="M8 18 C70 2 170 2 312 15"
            stroke="url(#section-gradient)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            initial={{
              pathLength: 0,
            }}
            whileInView={{
              pathLength: 1,
            }}
            transition={{
              duration: 1.4,
              ease: "easeOut",
            }}
          />
        </motion.svg>
      </div>

      {description && (
        <motion.p
          data-description
          initial={{
            opacity: 0,
            y: 15,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.3,
          }}
          className="mt-8 max-w-2xl text-muted-foreground leading-8"
        >
          {description}
        </motion.p>
      )}

      <motion.div
        className="absolute top-8 h-40 w-40 rounded-full bg-primary/20 blur-[80px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.25, 0.5, 0.25],
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
        }}
      />
    </div>
  );
}