"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles } from "lucide-react";
import { ServiceCard } from "./services-card";
import { services } from "@/types/services";

gsap.registerPlugin(ScrollTrigger);

// Bento offsets — breaks the literal 2x2 grid so cards read as intentionally
// unequal rather than a repeated tile. Applied at sm+ only; mobile stays
// single column, tablet stays a clean 2-col grid.
const OFFSET_CLASS: Record<number, string> = {
  1: "lg:mt-10",
  2: "lg:-mt-10",
};

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Full entrance choreography — skipped entirely under
      // prefers-reduced-motion, so content just renders in place.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-service-card]");

        gsap.set(cards, { opacity: 0, y: 48 });
        gsap.set("[data-services-eyebrow]", { opacity: 0, y: -8 });
        gsap.set("[data-services-heading]", { opacity: 0, y: 16 });
        gsap.set("[data-services-sub]", { opacity: 0, y: 16 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
          defaults: { ease: "power3.out", duration: 0.7 },
        });

        tl.to("[data-services-eyebrow]", { opacity: 1, y: 0 })
          .to("[data-services-heading]", { opacity: 1, y: 0 }, "-=0.4")
          .to("[data-services-sub]", { opacity: 1, y: 0 }, "-=0.45")
          .to(
            cards,
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out" },
            "-=0.3"
          );

        // gentle parallax drift on the ambient glow as the section scrolls
        gsap.to("[data-services-orb]", {
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });

        return () => {
          tl.scrollTrigger?.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      aria-labelledby="services-heading"
      className="relative isolate overflow-hidden bg-background  text-foreground  "
    >
      {/* dot-grid background, consistent with hero/about */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.15] [background-image:radial-gradient(hsl(var(--muted-foreground))_1px,transparent_1px)] [background-size:28px_28px]"
      />
      <div
        data-services-orb
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span
            data-services-eyebrow
            className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-3 py-1 font-mono text-xs tracking-wide text-muted-foreground"
          >
            <Sparkles className="h-3 w-3 text-primary" aria-hidden />
            Services
          </span>

          <h2
            id="services-heading"
            data-services-heading
            className=" font-display text-4xl font-semibold tracking-tight sm:text-5xl"
          >
            Building Digital Products That Scale
          </h2>

          <p
            data-services-sub
            className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            From modern web applications to AI-powered automation and
            cross-platform mobile apps, I build fast, scalable, and
            user-focused software that solves real business problems.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              className={OFFSET_CLASS[index] ?? ""}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
