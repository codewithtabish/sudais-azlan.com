"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";
import { Testimonial } from "@/types/testmonail";

interface TestimonialsCardProps {
  /** Array of testimonials to display */
  items: Testimonial[];
  /** Additional CSS classes for the outer container */
  className?: string;
  /** Square size of the photo stack in px (default: 320). This no longer
   *  affects the text column — they're sized independently. */
  imageSize?: number;
  /** Max width of the whole card (photo + text combined), in px.
   *  Default 880 — wide enough for the quote to breathe at desktop. */
  maxWidth?: number;
  /** Whether to show navigation arrows (default: true) */
  showNavigation?: boolean;
  /** Whether to show the counter (default: true) */
  showCounter?: boolean;
  /** Whether to enable auto-play (default: false) */
  autoPlay?: boolean;
  /** Auto-play interval in ms (default: 5000) */
  autoPlayInterval?: number;
}

export function TestimonialsCard({
  items,
  className,
  imageSize = 320,
  maxWidth = 880,
  showNavigation = true,
  showCounter = true,
  autoPlay = false,
  autoPlayInterval = 5000,
}: TestimonialsCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const activeItem = items[activeIndex];

  // Auto-play, loops back to the start
  React.useEffect(() => {
    if (!autoPlay || items.length <= 1) return;

    const interval = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, items.length]);

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  // Pre-calculated tilt per card for the stacked-photos look
  const rotations = useMemo(() => [4, -2, -9, 7], []);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-col items-center gap-10 md:flex-row md:items-center md:gap-12",
        className
      )}
      style={{ maxWidth: `${maxWidth}px`, perspective: "1400px" }}
    >
      {/* Photo stack — fixed square, independent of text width */}
      <div
        className="relative w-full max-w-[280px] flex-shrink-0 md:max-w-none"
        style={{ width: imageSize, height: imageSize }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-6 -z-10 rounded-full bg-primary/10 blur-3xl"
        />

        <AnimatePresence custom={direction}>
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            const offset = index - activeIndex;

            return (
              <motion.div
                key={item.id}
                className="absolute inset-0 h-full w-full overflow-hidden rounded-2xl border-[6px] border-background bg-muted shadow-2xl shadow-black/10 dark:shadow-black/40"
                initial={{
                  x: offset * 15,
                  y: Math.abs(offset) * 6,
                  z: -150 * Math.abs(offset),
                  scale: 0.85 - Math.abs(offset) * 0.04,
                  rotateZ: rotations[index % 4],
                  opacity: isActive ? 1 : 0.5,
                  zIndex: 10 - Math.abs(offset),
                }}
                animate={
                  isActive
                    ? {
                        x: [offset * 15, direction === 1 ? -200 : 200, 0],
                        y: [Math.abs(offset) * 6, 0, 0],
                        z: [-200, 150, 250],
                        scale: [0.85, 1.05, 1],
                        rotateZ: [rotations[index % 4], -5, 0],
                        opacity: 1,
                        zIndex: 100,
                      }
                    : {
                        x: offset * 15,
                        y: Math.abs(offset) * 6,
                        z: -150 * Math.abs(offset),
                        rotateZ: rotations[index % 4],
                        scale: 0.85 - Math.abs(offset) * 0.04,
                        opacity: 0.55,
                        zIndex: 10 - Math.abs(offset),
                      }
                }
                exit={{
                  x: direction === 1 ? -250 : 250,
                  z: -260,
                  scale: 0.75,
                  rotateZ: direction === 1 ? -10 : 10,
                  opacity: 0,
                }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* {item.image} */}
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes={`${imageSize}px`}
                  priority={isActive}
                  className="object-cover"
                  draggable={false}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>

        <span
          aria-hidden
          className="pointer-events-none absolute -left-2 -top-2 z-[110] h-6 w-6 rounded-tl-lg border-l-2 border-t-2 border-primary"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-2 -right-2 z-[110] h-6 w-6 rounded-br-lg border-b-2 border-r-2 border-primary"
        />
      </div>

      {/* Text column — its own flex column, so nothing can overlap it */}
      <div className="flex w-full min-w-0 flex-1 flex-col text-center md:text-left">
        {showCounter && (
          <div className="mb-3 font-mono text-xs tracking-widest text-muted-foreground md:text-right">
            {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </div>
        )}

        <Quote className="mx-auto mb-3 h-6 w-6 flex-shrink-0 text-primary/50 md:mx-0" aria-hidden />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {activeItem.rating && (
              <div className="mb-3 flex items-center justify-center gap-0.5 md:justify-start">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3.5 w-3.5",
                      i < activeItem.rating!
                        ? "fill-primary text-primary"
                        : "fill-transparent text-muted-foreground/30"
                    )}
                    aria-hidden
                  />
                ))}
              </div>
            )}

            <p className="text-balance text-base leading-relaxed text-foreground sm:text-lg">
              &ldquo;{activeItem.quote}&rdquo;
            </p>

            <div className="mt-5 font-display text-base font-semibold text-foreground">
              {activeItem.name}
            </div>
            <div className="font-mono text-xs text-muted-foreground">
              {activeItem.role}
            </div>
          </motion.div>
        </AnimatePresence>

        {showNavigation && items.length > 1 && (
          <div className="mx-auto mt-6 flex gap-2 md:mx-0">
            <button
              onClick={handlePrev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card text-foreground transition-all hover:scale-105 hover:border-primary/40 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNext}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card text-foreground transition-all hover:scale-105 hover:border-primary/40 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              aria-label="Next testimonial"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TestimonialsCard;
