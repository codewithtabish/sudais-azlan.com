"use client";

import React, { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MapPin,
  GraduationCap,
  Code2,
  Sparkles,
  ArrowUpRight,
  Download,
  Globe,
  ArrowRight,
} from "lucide-react";
import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from "@/components/kibo-ui/marquee";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WhyUsSection } from "../(landing)/(why-us)/why-choose-us";

gsap.registerPlugin(ScrollTrigger);

/* ─── Data ─── */

const EDUCATION = [
  {
    school: "Abdul Wali Khan University Mardan",
    detail: "Graduate",
    location: "Mardan, Pakistan",
  },
  {
    school: "Postgraduate College Mardan",
    detail: "Higher Education",
    location: "Mardan, Pakistan",
  },
];

const ACHIEVEMENTS = [
  { value: "3+", label: "Years experience" },
  { value: "40+", label: "Projects shipped" },
  { value: "12", label: "Countries served" },
  { value: "50+", label: "Technologies mastered" },
];

const TECH_MARQUEE = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "Prisma",
  "Drizzle ORM",
  "Tailwind CSS",
  "Docker",
  "AWS S3",
  "Redis",
  "Expo",
  "React Native",
  "BullMQ",
  "GitHub",
];

const CONTENT_SECTIONS = [
  {
    title: "My Vision",
    content:
      "I believe great software is more than just writing code — it's about understanding problems, designing thoughtful solutions, and building products that create real value for users and businesses. I'm constantly expanding my expertise in software architecture, cloud technologies, DevOps, distributed systems, and artificial intelligence.",
  },
  {
    title: "My Approach",
    content:
      "From AI-powered SaaS platforms to business automation tools, I bring the same obsession for detail to every project. I specialize in creating clean, maintainable, and enterprise-grade software that delivers exceptional user experiences. Staying up to date with modern development practices allows me to deliver solutions that are fast, reliable, and future-ready.",
  },
];

/* ─── Component ─── */

export function AboutSectionPage() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const bentoRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const achievementsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const shouldReduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Heading word reveal
      const words = headingRef.current?.querySelectorAll("[data-word]");
      gsap.fromTo(
        words ?? [],
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Bio paragraph
      gsap.fromTo(
        "[data-bio]",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Bento cards
      const bentoCards = bentoRef.current?.querySelectorAll(".bento-card");
      if (bentoCards) {
        gsap.fromTo(
          bentoCards,
          { opacity: 0, y: 60, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: bentoRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Marquee
      gsap.fromTo(
        marqueeRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: marqueeRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Achievements
      const achItems = achievementsRef.current?.querySelectorAll(".ach-item");
      if (achItems) {
        gsap.fromTo(
          achItems,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: achievementsRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Content sections
      const contentBlocks = contentRef.current?.querySelectorAll(".content-block");
      if (contentBlocks) {
        gsap.fromTo(
          contentBlocks,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // CTA
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 40, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-background py-24 md:py-32 lg:py-40"
    >
      {/* Dot-grid background */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />

      {/* Ambient orbs */}
      <div
        className="pointer-events-none absolute left-[15%] top-[20%] h-[350px] w-[350px] rounded-full bg-primary/5 blur-[100px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-[10%] bottom-[10%] h-[300px] w-[300px] rounded-full bg-primary/5 blur-[90px]"
        aria-hidden="true"
      />

      {/* Floating decorative rings */}
      <motion.div
        className="pointer-events-none absolute right-[8%] top-[18%] hidden h-20 w-20 rounded-full border border-primary/20 lg:block"
        animate={shouldReduceMotion ? {} : { y: [0, -14, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <motion.div
        className="pointer-events-none absolute left-[6%] bottom-[14%] hidden h-14 w-14 rounded-full border border-primary/15 lg:block"
        animate={shouldReduceMotion ? {} : { y: [0, 12, 0], x: [0, 6, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* ── Section Header ── */}
        <div className="mb-14 flex flex-col gap-5 lg:w-2/3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1 font-mono text-xs tracking-wide text-muted-foreground">
              <MapPin className="h-3 w-3 text-primary" aria-hidden="true" />
              Mardan, Pakistan
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-3 py-1 font-mono text-xs tracking-wide text-muted-foreground">
              <Globe className="h-3 w-3 text-primary" aria-hidden="true" />
              Open to remote · worldwide
            </span>
          </div>

          <div ref={headingRef} className="overflow-hidden">
            <h2 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              <span className="block overflow-hidden">
                <span data-word className="inline-block">
                  The
                </span>{" "}
                <span
                  data-word
                  className="inline-block bg-gradient-to-r from-primary via-fuchsia-400 to-primary bg-[length:200%_auto] bg-clip-text text-transparent"
                >
                  Engineer
                </span>
              </span>
              <span className="block overflow-hidden">
                <span data-word className="inline-block text-muted-foreground">
                  Behind
                </span>{" "}
                <span data-word className="inline-block text-muted-foreground">
                  The
                </span>{" "}
                <span data-word className="inline-block text-primary">
                  Code
                </span>
              </span>
            </h2>
          </div>

          <p data-bio className="text-lg text-muted-foreground md:text-xl leading-relaxed">
            Hi, I'm <span className="font-semibold text-foreground">Tabish</span> — a passionate
            Full-Stack Software Engineer who loves turning ambitious ideas into modern, scalable
            digital products. I specialize in Next.js, React, TypeScript, Node.js, and cloud
            infrastructure.
          </p>
        </div>

        {/* ── Bento Grid ── */}
        <div ref={bentoRef} className="grid gap-7 lg:grid-cols-3 mb-20">
          {/* Main bio card */}
          <div className="bento-card relative flex flex-col justify-center rounded-2xl border border-border/60 bg-card/40 backdrop-blur-xl p-8 md:p-10 lg:col-span-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-primary/[0.03] pointer-events-none" />

            <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground mb-4">
              Building for the <span className="text-primary">Real World</span>
            </h3>
            <p className="text-base leading-relaxed text-muted-foreground mb-4">
              Over the years, I've shipped AI-powered SaaS platforms, resume builders, CMS systems,
              business automation tools, rental management platforms, and mobile applications. I
              enjoy solving complex technical challenges and designing systems that are secure,
              scalable, and built for long-term growth.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              I believe great software is more than just writing code — it's about understanding
              problems, designing thoughtful solutions, and building products that create real value
              for users and businesses.
            </p>
          </div>

          {/* Side column: Education + Portrait */}
          <div className="flex flex-col gap-7 md:flex-row lg:flex-col">
            {/* Education breakout card */}
            <motion.div
              whileHover={shouldReduceMotion ? {} : { y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bento-card flex flex-col justify-between gap-6 rounded-2xl border border-border/60 bg-card/40 backdrop-blur-xl p-7 md:w-1/2 lg:w-auto"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="mb-3 text-lg font-semibold text-foreground">Education</p>
                <div className="space-y-3">
                  {EDUCATION.map((edu) => (
                    <div key={edu.school} className="group">
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {edu.school}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {edu.detail} · {edu.location}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <Button variant="outline" className="mr-auto rounded-full group" asChild>
                <a href="#contact">
                  Get in touch
                  <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </Button>
            </motion.div>

            {/* Portrait frame card — echoes Hero aesthetic */}
            <motion.div
              whileHover={shouldReduceMotion ? {} : { y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bento-card relative grow basis-0 overflow-hidden rounded-2xl border border-border/60 bg-card/40 backdrop-blur-xl p-4 md:w-1/2 lg:min-h-0 lg:w-auto"
            >
              <div className="relative mx-auto w-full max-w-[240px]">
                {/* Idle float */}
                <motion.div
                  animate={shouldReduceMotion ? {} : { y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  {/* Conic halo */}
                  <motion.div
                    className="pointer-events-none absolute -inset-3 rounded-[1.5rem] opacity-60 blur-md"
                    style={{
                      background:
                        "conic-gradient(from 0deg, hsl(var(--primary)) 0deg, transparent 90deg, hsl(var(--primary)) 180deg, transparent 270deg, hsl(var(--primary)) 360deg)",
                    }}
                    animate={shouldReduceMotion ? {} : { rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    aria-hidden="true"
                  />

                  {/* Orbiting chips */}
                  <motion.div
                    className="pointer-events-none absolute inset-0"
                    animate={shouldReduceMotion ? {} : { rotate: 360 }}
                    transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                    aria-hidden="true"
                  >
                    <span className="absolute -top-2 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border border-border/60 bg-background shadow-md">
                      <Code2 className="h-3.5 w-3.5 text-primary" />
                    </span>
                  </motion.div>
                  <motion.div
                    className="pointer-events-none absolute inset-0"
                    animate={shouldReduceMotion ? {} : { rotate: -360 }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    aria-hidden="true"
                  >
                    <span className="absolute -bottom-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border border-border/60 bg-background shadow-md">
                      <Sparkles className="h-3 w-3 text-primary" />
                    </span>
                  </motion.div>

                  {/* Frame */}
                  <div className="relative aspect-square w-full [perspective:1000px]">
                    <span className="absolute -left-2 -top-2 h-8 w-8 rounded-tl-xl border-l-2 border-t-2 border-primary" />
                    <span className="absolute -bottom-2 -right-2 h-8 w-8 rounded-br-xl border-b-2 border-r-2 border-primary" />

                    <motion.div
                      className="pointer-events-none absolute -inset-2 rounded-[1.25rem] border border-dashed border-primary/20"
                      animate={shouldReduceMotion ? {} : { rotate: 360 }}
                      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                      aria-hidden="true"
                    />

                    {/* Portrait container */}
                    <div className="relative h-full w-full overflow-hidden rounded-xl border border-border/60 bg-card shadow-xl">
                      {/* Replace with your actual photo */}
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-background">
                        <span className="font-display text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-primary to-fuchsia-400">
                          TT
                        </span>
                      </div>

                      {/* Shine sweep */}
                      <motion.div
                        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={shouldReduceMotion ? {} : { x: ["0%", "420%"] }}
                        transition={{
                          duration: 3.2,
                          repeat: Infinity,
                          repeatDelay: 2.4,
                          ease: "easeInOut",
                        }}
                        aria-hidden="true"
                      />

                      {/* Gradient wash */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />

                      {/* Badge */}
                      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-2.5 py-1 font-mono text-[11px] text-muted-foreground backdrop-blur">
                        <Sparkles className="h-3 w-3 text-primary" />
                        open to work
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Tech Marquee ── */}
        <div ref={marqueeRef} className="py-16 border-y border-border/40">
          <p className="text-center font-mono text-xs tracking-widest text-muted-foreground uppercase mb-8">
            Tech Stack
          </p>
          <Marquee>
            <MarqueeContent speed={35}>
              {TECH_MARQUEE.map((tech, idx) => (
                <MarqueeItem
                  key={tech + idx}
                  className="mx-4 flex items-center"
                >
                  <span className="inline-flex items-center rounded-full border border-border/60 bg-muted/30 px-4 py-2 font-mono text-sm text-muted-foreground whitespace-nowrap">
                    {tech}
                  </span>
                </MarqueeItem>
              ))}
            </MarqueeContent>
            <MarqueeFade side="left" />
            <MarqueeFade side="right" />
          </Marquee>
        </div>

        {/* ── Achievements ── */}
        <div
          ref={achievementsRef}
          className="relative my-20 overflow-hidden rounded-2xl border border-border/60 bg-muted/30 p-8 md:p-12"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="flex flex-col gap-4 text-center md:text-left">
            <h3 className="font-display text-3xl font-medium tracking-tight text-foreground md:text-4xl">
              Impact in <span className="text-primary">Numbers</span>
            </h3>
            <p className="max-w-xl text-muted-foreground">
              Delivering reliable, scalable software solutions for startups and businesses across
              the globe.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:flex md:flex-wrap md:justify-between">
            {ACHIEVEMENTS.map((item) => (
              <div
                key={item.label}
                className="ach-item flex flex-col gap-2 text-center md:text-left"
              >
                <span className="font-mono text-4xl font-semibold text-foreground md:text-5xl">
                  {item.value}
                </span>
                <p className="text-sm text-muted-foreground md:text-base">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Content Sections ── */}
        <div
          ref={contentRef}
          className="mx-auto grid max-w-5xl gap-16 pb-20 md:grid-cols-2 md:gap-28"
        >
          {CONTENT_SECTIONS.map((section) => (
            <div key={section.title} className="content-block">
              <h3 className="font-display mb-5 text-3xl font-medium tracking-tight text-foreground">
                {section.title}
              </h3>
              <p className="text-lg leading-8 text-muted-foreground whitespace-pre-line">
                {section.content}
              </p>
            </div>
          ))}
        </div>

              <WhyUsSection/>




        {/* ── Bottom CTA ── */}
        <div ref={ctaRef} className="text-center pb-8">
          <h3 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Ready to Build Something{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-fuchsia-400">
              Amazing?
            </span>
          </h3>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            I'm always open to discussing new projects, creative ideas, or opportunities to be
            part of your vision.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" className="rounded-full px-6 group" asChild>
              <a href="#contact">
                Start a Conversation
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-6" asChild>
              <a href="/resume.pdf" target="_blank">
                <Download className="mr-2 h-4 w-4" />
                Download CV
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}