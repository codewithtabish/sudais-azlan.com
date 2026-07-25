"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Zap,
  ArrowRight,
  Terminal,
  GraduationCap,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import CursorCard from "@/components/ui/cursor-card";
import { SectionHeader } from "@/components/common/(headers)/section-header";

gsap.registerPlugin(ScrollTrigger);

/* ─── Data ─── */

const techStack = {
  Frontend: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  Backend: ["Node.js", "Express.js", "REST APIs", "Server Actions"],
  Database: ["PostgreSQL", "Prisma ORM", "Drizzle ORM", "Neon"],
  "Cloud & DevOps": ["Docker", "AWS S3", "Redis", "Vercel", "GitHub"],
  Mobile: ["React Native", "Expo"],
};

const education = [
  {
    institution: "Abdul Wali Khan University Mardan",
    role: "Graduate",
    location: "Mardan, Pakistan",
  },
  {
    institution: "Postgraduate College Mardan",
    role: "Higher Education",
    location: "Mardan, Pakistan",
  },
];

const cursorHighlights = [
  {
    word: "Next.js",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
    description: "Production-grade React framework for SEO-friendly apps.",
  },
  {
    word: "React",
    image: "https://images.unsplash.com/photo-1633356122102-3fe601e15764?w=400&h=250&fit=crop",
    description: "Component-based UI library for interactive experiences.",
  },
  {
    word: "TypeScript",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=250&fit=crop",
    description: "Type-safe development for scalable codebases.",
  },
  {
    word: "Node.js",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop",
    description: "High-performance JavaScript runtime for backends.",
  },
  {
    word: "PostgreSQL",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=250&fit=crop",
    description: "Advanced open-source relational database system.",
  },
  {
    word: "Docker",
    image: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&h=250&fit=crop",
    description: "Containerization for consistent deployments.",
  },
  {
    word: "AWS",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop",
    description: "Cloud infrastructure for global-scale applications.",
  },
];

/* ─── Component ─── */

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);
  const techRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Bio lines stagger
      const bioLines = bioRef.current?.querySelectorAll(".bio-line");
      if (bioLines) {
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

      // Education cards
      const eduCards = educationRef.current?.querySelectorAll(".edu-card");
      if (eduCards) {
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

      // Tech pills
      const techGroups = techRef.current?.querySelectorAll(".tech-group");
      if (techGroups) {
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Helper to wrap highlighted words with CursorCard
  const renderBioWithHighlights = (text: string) => {
    let result: React.ReactNode[] = [text];
    cursorHighlights.forEach(({ word, image, description }) => {
      result = result.flatMap((node) => {
        if (typeof node !== "string") return node;
        const parts = node.split(new RegExp(`(${word})`, "g"));
        return parts.map((part, i) =>
          part === word ? (
            <CursorCard
              key={`${word}-${i}`}
              image={image}
              description={description}
              className="font-semibold text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary transition-all"
            >
              {part}
            </CursorCard>
          ) : (
            part
          )
        );
      });
    });
    return result;
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative  px-6 overflow-hidden "
    >
      {/* Subtle grid pattern — works in both modes */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* ── Section Label ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-12"
        >
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          <span className="px-3 py-1 rounded-full border border-border bg-muted/50 text-xs font-mono text-muted-foreground tracking-widest uppercase">
            About Me
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        </motion.div>

        {/* ── Header ── */}
        <SectionHeader
          title="I'm Tabish"
          description="A passionate Full-Stack Software Engineer from Pakistan turning ambitious ideas into modern, scalable digital products."
        />

        {/* ── Bio ── */}
        <div ref={bioRef} className="mt-16 mb-20 space-y-6 max-w-3xl mx-auto">
          <p className="bio-line text-lg md:text-xl leading-relaxed text-foreground/80">
            I specialize in building high-performance web and mobile applications
            using technologies like{" "}
            {renderBioWithHighlights(
              "Next.js, React, TypeScript, Node.js, Express.js, PostgreSQL, Prisma, Drizzle ORM, Tailwind CSS, Docker, AWS, and Redis"
            )}
            . My focus is on creating clean, maintainable, and enterprise-grade
            software that delivers exceptional user experiences.
          </p>

          <p className="bio-line text-base md:text-lg leading-relaxed text-muted-foreground">
            Over the years, I've worked on AI-powered SaaS platforms, resume
            builders, CMS systems, business automation tools, rental platforms,
            and mobile applications. I enjoy solving complex technical challenges
            and designing systems that are secure, scalable, and built for
            long-term growth.
          </p>

          <p className="bio-line text-base md:text-lg leading-relaxed text-muted-foreground">
            I believe great software is more than just writing code — it's about
            understanding problems, designing thoughtful solutions, and building
            products that create real value for users and businesses.
          </p>
        </div>

        {/* ── Education ── */}
        <div ref={educationRef} className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap className="w-5 h-5 text-primary" />
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
              Education <span className="text-primary">& Academia</span>
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {education.map((edu) => (
              <motion.div
                key={edu.institution}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="edu-card group relative p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {edu.institution}
                  </h4>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{edu.role}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {edu.location}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Tech Stack ── */}
        <div ref={techRef} className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Terminal className="w-5 h-5 text-primary" />
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
              Tech <span className="text-primary">Stack</span>
            </h3>
          </div>

          <div className="space-y-6">
            {Object.entries(techStack).map(([category, items]) => (
              <div key={category} className="tech-group">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  {category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <motion.span
                      key={item}
                      whileHover={{ scale: 1.08, y: -2 }}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium border transition-colors cursor-default",
                        "bg-secondary/50 border-border text-secondary-foreground",
                        "hover:bg-primary/10 hover:border-primary/30 hover:text-primary"
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

        {/* ── CTA ── */}
        <div ref={ctaRef} className="text-center">
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-lg shadow-lg hover:shadow-primary/25 transition-shadow group"
          >
            Let's Build Something Together
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.a>
          <p className="mt-4 text-sm text-muted-foreground">
            Open for freelance, contract, and full-time opportunities.
          </p>
        </div>
      </div>
    </section>
  );
}