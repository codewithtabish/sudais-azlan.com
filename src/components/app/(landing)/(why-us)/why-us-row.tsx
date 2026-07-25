"use client";

import { WhyUsItem } from "@/types/choose-us";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface WhyUsRowProps {
  item: WhyUsItem;
  index: number;
}

const tintVariants: Variants = {
  rest: { scaleX: 0 },
  hover: { scaleX: 1 },
};

const iconVariants: Variants = {
  rest: { rotate: 0, scale: 1 },
  hover: { rotate: -8, scale: 1.08 },
};

const arrowVariants: Variants = {
  rest: { x: 0, opacity: 0.4 },
  hover: { x: 4, opacity: 1 },
};

export function WhyUsRow({ item, index }: WhyUsRowProps) {
  const Icon = item.icon;
  const shouldReduceMotion = useReducedMotion();
  const spring = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 260, damping: 22 };

  return (
    <motion.div
      data-why-row
      tabIndex={0}
      initial="rest"
      whileHover="hover"
      whileFocus="hover"
      className="group relative flex flex-col gap-4 border-b border-border/60 py-8 outline-none first:border-t sm:flex-row sm:items-center sm:gap-8"
    >
      {/* hover tint sliding in from the left */}
      <motion.span
        aria-hidden
        variants={tintVariants}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{ transformOrigin: "left center" }}
        className="pointer-events-none absolute inset-0 -z-10 bg-muted/40"
      />

      <div className="flex items-center gap-4 sm:w-64 sm:flex-shrink-0">
        <motion.div
          variants={iconVariants}
          transition={spring}
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-border/60 bg-card text-primary"
        >
          <Icon className="h-5 w-5" aria-hidden />
        </motion.div>

        <span className="font-mono text-xs text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
        </span>

        <h3 className="font-display text-lg font-semibold tracking-tight text-foreground sm:hidden">
          {item.title}
        </h3>
      </div>

      <div className="flex-1 pl-16 sm:pl-0">
        <h3 className="hidden font-display text-lg font-semibold tracking-tight text-foreground sm:block">
          {item.title}
        </h3>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {item.description}
        </p>
      </div>

      <motion.div
        variants={arrowVariants}
        transition={spring}
        className="hidden flex-shrink-0 text-primary sm:block"
        aria-hidden
      >
        <ArrowUpRight className="h-5 w-5" />
      </motion.div>
    </motion.div>
  );
}
