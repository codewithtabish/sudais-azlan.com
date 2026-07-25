"use client";

import { Service } from "@/types/services";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface ServiceCardProps {
  service: Service;
  /** Extra classes — used by ServicesSection to stagger row offsets on desktop. */
  className?: string;
}

const cardVariants: Variants = {
  rest: { y: 0 },
  hover: { y: -6 },
};

const iconVariants: Variants = {
  rest: { rotate: 0, scale: 1 },
  hover: { rotate: -8, scale: 1.08 },
};

const arrowVariants: Variants = {
  rest: { x: 0, y: 0, opacity: 0.55 },
  hover: { x: 4, y: -4, opacity: 1 },
};

const decorationVariants: Variants = {
  rest: { rotate: 0 },
  hover: { rotate: 30 },
};

const chipContainer: Variants = {
  rest: {},
  hover: { transition: { staggerChildren: 0.04 } },
};

const chipItem: Variants = {
  rest: { y: 0 },
  hover: { y: -3 },
};

export function ServiceCard({ service, className = "" }: ServiceCardProps) {
  const Icon = service.icon;
  const shouldReduceMotion = useReducedMotion();
  const spring = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 260, damping: 20 };

  return (
    <motion.article
      data-service-card
      tabIndex={0}
      aria-label={service.title}
      initial="rest"
      whileHover="hover"
      whileFocus="hover"
      whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
      variants={cardVariants}
      transition={spring}
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card p-8 shadow-sm outline-none transition-shadow duration-300 hover:shadow-2xl hover:shadow-primary/10 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${className}`}
    >
      {/* border brightens on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent transition-colors duration-300 group-hover:border-primary/40 group-focus-visible:border-primary/40"
      />

      {/* slowly rotating dashed ring — background decoration */}
      <motion.span
        aria-hidden
        variants={decorationVariants}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full border border-dashed border-primary/15"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-primary/5 blur-2xl transition-opacity duration-300 group-hover:opacity-80"
      />

      <motion.div
        variants={iconVariants}
        transition={spring}
        className="relative z-10 mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-primary"
      >
        <Icon className="h-6 w-6" aria-hidden />
      </motion.div>

      <h3 className="relative z-10 font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        {service.title}
      </h3>

      <p className="relative z-10 mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
        {service.description}
      </p>

      <motion.ul
        variants={chipContainer}
        className="relative z-10 mt-6 flex flex-wrap gap-2"
        aria-label={`${service.title} capabilities`}
      >
        {service.features.map((feature) => (
          <motion.li
            key={feature}
            variants={chipItem}
            transition={spring}
            className="rounded-md border border-border/60 bg-muted/30 px-2.5 py-1 font-mono text-xs text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:text-foreground"
          >
            {feature}
          </motion.li>
        ))}
      </motion.ul>

      <motion.div
        variants={arrowVariants}
        transition={spring}
        className="relative z-10 mt-auto flex items-center gap-1 pt-8 font-mono text-xs uppercase tracking-widest text-primary"
      >
        Learn more
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
      </motion.div>
    </motion.article>
  );
}
