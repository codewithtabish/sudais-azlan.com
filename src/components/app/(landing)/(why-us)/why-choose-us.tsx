"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldCheck } from "lucide-react";
import { WhyUsRow } from "./why-us-row";
import { whyUsItems } from "@/types/choose-us";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: "3+", label: "Years experience" },
  { value: "40+", label: "Projects shipped" },
  { value: "100%", label: "Direct communication" },
];

export function WhyUsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const rows = gsap.utils.toArray<HTMLElement>("[data-why-row]");

        gsap.set(rows, { opacity: 0, y: 32 });
        gsap.set("[data-why-eyebrow]", { opacity: 0, y: -8 });
        gsap.set("[data-why-heading]", { opacity: 0, y: 16 });
        gsap.set("[data-why-sub]", { opacity: 0, y: 16 });
        gsap.set("[data-why-stat]", { opacity: 0, y: 16 });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
          defaults: { ease: "power3.out", duration: 0.7 },
        });

        tl.to("[data-why-eyebrow]", { opacity: 1, y: 0 })
          .to("[data-why-heading]", { opacity: 1, y: 0 }, "-=0.4")
          .to("[data-why-sub]", { opacity: 1, y: 0 }, "-=0.45")
          .to(
            "[data-why-stat]",
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
            "-=0.3"
          )
          .to(
            rows,
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" },
            "-=0.2"
          );

        // slow parallax drift on the ambient glow
        gsap.to("[data-why-orb]", {
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
      id="why-us"
      aria-labelledby="why-us-heading"
      className="relative isolate overflow-hidden bg-background  text-foreground "
    >
      {/* dot-grid background, consistent with Hero / Services / Testimonials */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.15] [background-image:radial-gradient(hsl(var(--muted-foreground))_1px,transparent_1px)] [background-size:28px_28px]"
      />
      <div
        data-why-orb
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-[420px] w-[420px] translate-x-1/3 rounded-full bg-primary/10 blur-[120px]"
      />

      <div className="relative mx-auto max-w-4xl px-6">
        <div className="text-center">
          <span
            data-why-eyebrow
            className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-3 py-1 font-mono text-xs tracking-wide text-muted-foreground"
          >
            <ShieldCheck className="h-3 w-3 text-primary" aria-hidden />
            Why Us
          </span>

          <h2
            id="why-us-heading"
            data-why-heading
            className="mt-5 font-display text-4xl font-semibold tracking-tight sm:text-5xl"
          >
            Not Just Code. A Partner Who Ships.
          </h2>

          <p
            data-why-sub
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Plenty of people can write code. Here&apos;s what you actually get
            working with me.
          </p>
        </div>

        <div className="mx-auto mt-12 flex max-w-md flex-wrap justify-center gap-x-10 gap-y-4 border-b border-border/60 pb-12 sm:max-w-none sm:justify-around">
          {STATS.map((stat) => (
            <div key={stat.label} data-why-stat className="text-center">
              <div className="font-display text-3xl font-semibold text-foreground">
                {stat.value}
              </div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          {whyUsItems.map((item, index) => (
            <WhyUsRow key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
