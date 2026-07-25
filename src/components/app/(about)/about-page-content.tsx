"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowRight,
  GraduationCap,
  MapPin,
  Terminal,
  Compass as CompassIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { education, missionVision, servicesOffered, techStack } from "@/types/about-data";
import { WhyUsSection } from "../(landing)/(why-us)/why-choose-us";


gsap.registerPlugin(ScrollTrigger);

// Same vertical rhythm as the shared Section component, applied inline
// here since this file intentionally doesn't import it — the parent page
// wraps the whole thing.
const sectionPadding = "py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28";
// Same inner width/gutter as the shared AppContainer, applied inline too.
const containerWidth =
  "mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16";

export function AboutPageContent() {
  const rootRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);
  const techRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // intro
        gsap.set("[data-about-eyebrow]", { opacity: 0, y: -8 });
        gsap.set("[data-about-heading]", { opacity: 0, y: 16 });
        gsap.set("[data-about-sub]", { opacity: 0, y: 16 });

        gsap
          .timeline({
            scrollTrigger: { trigger: rootRef.current, start: "top 80%" },
            defaults: { ease: "power3.out", duration: 0.7 },
          })
          .to("[data-about-eyebrow]", { opacity: 1, y: 0 })
          .to("[data-about-heading]", { opacity: 1, y: 0 }, "-=0.4")
          .to("[data-about-sub]", { opacity: 1, y: 0 }, "-=0.45");

        // bio lines — blurred stagger reveal
        const bioLines = bioRef.current?.querySelectorAll(".bio-line");
        if (bioLines?.length) {
          gsap.fromTo(
            bioLines,
            { opacity: 0, y: 40, filter: "blur(6px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.9,
              stagger: 0.12,
              ease: "power3.out",
              scrollTrigger: {
                trigger: bioRef.current,
                start: "top 75%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // mission / vision cards
        gsap.fromTo(
          "[data-mv-card]",
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: "[data-mv-section]",
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // what-we-build chips
        gsap.fromTo(
          "[data-build-chip]",
          { opacity: 0, y: 20, scale: 0.92 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: "[data-build-section]",
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // education cards
        const eduCards = educationRef.current?.querySelectorAll(".edu-card");
        if (eduCards?.length) {
          gsap.fromTo(
            eduCards,
            { opacity: 0, y: 50, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              stagger: 0.15,
              ease: "back.out(1.4)",
              scrollTrigger: {
                trigger: educationRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // tech groups
        const techGroups = techRef.current?.querySelectorAll(".tech-group");
        if (techGroups?.length) {
          gsap.fromTo(
            techGroups,
            { opacity: 0, x: -30 },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              stagger: 0.15,
              ease: "power3.out",
              scrollTrigger: {
                trigger: techRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // CTA
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  const cardHoverTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 300, damping: 20 };

  return (
    <div ref={rootRef}>
      {/* ── Intro ── */}
      <section className={cn(sectionPadding, "relative overflow-hidden")}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.15] [background-image:radial-gradient(hsl(var(--muted-foreground))_1px,transparent_1px)] [background-size:28px_28px]"
        />
        <div className={cn(containerWidth, "relative max-w-3xl text-center")}>
          <span
            data-about-eyebrow
            className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-3 py-1 font-mono text-xs tracking-wide text-muted-foreground"
          >
            About CodeWithTabish
          </span>

          <h1
            data-about-heading
            className="mt-5 font-display text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl"
          >
            We build products, not just projects.
          </h1>

          <p
            data-about-sub
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            CodeWithTabish is a small, focused studio building web apps,
            mobile apps, AI automation, and the backend systems behind them —
            for founders who need it done right, not just done.
          </p>
        </div>
      </section>

      {/* ── Story ── */}
      <section className={sectionPadding}>
        <div className={containerWidth}>
          <div ref={bioRef} className="mx-auto  space-y-6">
            <p className="bio-line text-lg leading-relaxed text-foreground/90 md:text-xl">
              We specialize in building high-performance web and mobile
              applications using{" "}
              <span className="font-semibold text-primary underline decoration-primary/30 underline-offset-4">
                Next.js, React, TypeScript, Node.js, Express.js, PostgreSQL,
                Prisma, Drizzle ORM, Tailwind CSS, Docker, AWS, and Redis
              </span>
              . Our focus is on clean, maintainable, enterprise-grade software
              that delivers a genuinely good user experience.
            </p>

            <p className="bio-line text-base leading-relaxed text-muted-foreground md:text-lg">
              Under CodeWithTabish, we&apos;ve shipped AI-powered SaaS platforms,
              resume builders, CMS systems, business automation tools, rental
              platforms, and mobile applications — end to end, from database
              schema to the last pixel.
            </p>

            <p className="bio-line text-base leading-relaxed text-muted-foreground md:text-lg">
              We believe great software is more than writing code — it&apos;s
              understanding the problem, designing a thoughtful solution, and
              building something that creates real value for the people using
              it.
            </p>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section data-mv-section className={cn(sectionPadding, "bg-muted/20")}>
        <div className={containerWidth}>
          <div className="grid gap-6 sm:grid-cols-2">
            {missionVision.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  data-mv-card
                  whileHover={shouldReduceMotion ? undefined : { y: -6 }}
                  transition={cardHoverTransition}
                  className="rounded-2xl border border-border/60 bg-card p-8 shadow-sm"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-primary">
                    <Icon className="h-6 w-6" aria-hidden />
                  </div>
                  <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── What We Build ── */}
      <section data-build-section className={sectionPadding}>
        <div className={containerWidth}>
          <div className="mb-10 flex items-center gap-3">
            <CompassIcon className="h-5 w-5 text-primary" aria-hidden />
            <h3 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
              What We <span className="text-primary">Build</span>
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {servicesOffered.map((service) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.label}
                  data-build-chip
                  whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.03 }}
                  transition={cardHoverTransition}
                  className="flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 py-8 text-center shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-primary">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {service.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Education ── */}
      <section className={sectionPadding}>
        <div className={containerWidth}>
          <div ref={educationRef}>
            <div className="mb-8 flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-primary" aria-hidden />
              <h3 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
                Education <span className="text-primary">& Academia</span>
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {education.map((edu) => (
                <motion.div
                  key={edu.institution}
                  whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.02 }}
                  transition={cardHoverTransition}
                  className="edu-card group relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur-xl"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative z-10">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                      <GraduationCap className="h-5 w-5 text-primary" aria-hidden />
                    </div>
                    <h4 className="mb-1 font-semibold text-foreground transition-colors group-hover:text-primary">
                      {edu.institution}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span>{edu.role}</span>
                      <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" aria-hidden />
                        {edu.location}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section className={cn(sectionPadding, "bg-muted/20")}>
        <div className={containerWidth}>
          <div ref={techRef}>
            <div className="mb-8 flex items-center gap-3">
              <Terminal className="h-5 w-5 text-primary" aria-hidden />
              <h3 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
                Tech <span className="text-primary">Stack</span>
              </h3>
            </div>

            <div className="space-y-6">
              {Object.entries(techStack).map(([category, items]) => (
                <div key={category} className="tech-group">
                  <h4 className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    {category}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <motion.span
                        key={item}
                        whileHover={shouldReduceMotion ? undefined : { scale: 1.08, y: -2 }}
                        transition={cardHoverTransition}
                        className={cn(
                          "cursor-default rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                          "border-border/60 bg-secondary/50 text-secondary-foreground",
                          "hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                        )}
                      >
                        {item}
                      </motion.span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ──
          Already built separately — drop it in wherever it fits your page
          order best. Remove this import + usage if you're placing it
          elsewhere in the layout instead. */}
      <WhyUsSection />

      {/* ── CTA ── */}
      <section className={sectionPadding}>
        <div className={cn(containerWidth, "max-w-2xl text-center")}>
          <div ref={ctaRef}>
            <motion.a
              href="#contact"
              whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-lg transition-shadow hover:shadow-primary/25"
            >
              Let&apos;s Build Something Together
              <ArrowRight
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                aria-hidden
              />
            </motion.a>
            <p className="mt-4 text-sm text-muted-foreground">
              Open for freelance, contract, and full-time opportunities.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPageContent;
