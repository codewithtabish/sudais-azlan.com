"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import {
  MessageCircle,
  ArrowUp,
  Mail,
  Heart,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* ─── Inline Social Icons (no lucide import issues) ─── */

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/* ─── QR Pattern Component ─── */
function QRGrid() {
  const pattern = [
    [1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0],
    [1, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 0],
    [1, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0, 1],
  ];

  return (
    <div
      className="grid h-24 w-24 gap-[2px] rounded-lg bg-white p-1.5"
      style={{ gridTemplateColumns: "repeat(9, 1fr)" }}
    >
      {pattern.flat().map((cell, i) => (
        <div
          key={i}
          className={cn("rounded-[1px]", cell ? "bg-black" : "bg-transparent")}
        />
      ))}
    </div>
  );
}

/* ─── Data ─── */

const footerLinks = {
  blogs: [
    { label: "Scalable SaaS Architecture", href: "#" },
    { label: "Docker & DevOps Guide", href: "#" },
    { label: "AI in Web Development", href: "#" },
  ],
  projects: [
    { label: "AI Resume Builder", href: "#" },
    { label: "Rental Management System", href: "#" },
    { label: "Business Automation Tool", href: "#" },
  ],
  about: [
    { label: "My Story", href: "#about" },
    { label: "Education", href: "#" },
    { label: "Experience", href: "#" },
  ],
  resources: [
    { label: "Download CV", href: "#" },
    { label: "GitHub", href: "#" },
    { label: "Design System", href: "#" },
  ],
};

const socials = [
  {
    name: "LinkedIn",
    icon: LinkedInIcon,
    href: "https://linkedin.com/in/yourprofile",
    color:
      "hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] hover:border-[#0A66C2]/30",
  },
  {
    name: "Twitter / X",
    icon: XIcon,
    href: "https://twitter.com/yourhandle",
    color:
      "hover:bg-foreground/10 hover:text-foreground hover:border-foreground/30",
  },
  {
    name: "WhatsApp",
    icon: MessageCircle,
    href: "https://wa.me/YOUR_NUMBER",
    color:
      "hover:bg-[#25D366]/10 hover:text-[#25D366] hover:border-[#25D366]/30",
  },
];

/* ─── Animation variants ───
   whileInView + IntersectionObserver means: no stale scroll-position cache,
   no manual refresh, and correct behavior on short pages where the footer
   is already in the viewport on first paint. */

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ─── Component ─── */

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden border-t border-border px-6 pb-8 pt-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* ── Top CTA ── */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUpVariants}
          className="mb-20 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Let&apos;s Build{" "}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-cyan-500 bg-clip-text text-transparent">
              The Future
            </span>
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground">
            Open for worldwide collaboration. Ready to turn your next big idea
            into reality.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" className="group gap-2" asChild>
              <a href="#contact">
                Start a Project
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#projects">View My Work</a>
            </Button>
          </div>
        </motion.div>

        {/* ── Links Grid ── */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
          className="mb-20 grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5"
        >
          {/* Brand Column */}
          <motion.div
            variants={itemVariants}
            className="col-span-2 md:col-span-4 lg:col-span-1"
          >
            <h3 className="mb-4 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-2xl font-bold text-transparent">
              Tabish
            </h3>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Full-Stack Software Engineer crafting scalable, AI-powered
              digital products from Pakistan to the world.
            </p>
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "flex size-10 items-center justify-center rounded-xl border border-border bg-secondary/50 transition-colors",
                    social.color
                  )}
                  aria-label={social.name}
                >
                  <social.icon className="size-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Blogs */}
          <motion.div variants={itemVariants}>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Blogs
            </h4>
            <ul className="space-y-3">
              {footerLinks.blogs.map((link) => (
                <li key={link.label}>
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 4 }}
                    className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <span className="size-1 rounded-full bg-primary/50 transition-colors group-hover:bg-primary" />
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Projects */}
          <motion.div variants={itemVariants}>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Projects
            </h4>
            <ul className="space-y-3">
              {footerLinks.projects.map((link) => (
                <li key={link.label}>
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 4 }}
                    className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <span className="size-1 rounded-full bg-primary/50 transition-colors group-hover:bg-primary" />
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div variants={itemVariants}>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 4 }}
                    className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <span className="size-1 rounded-full bg-primary/50 transition-colors group-hover:bg-primary" />
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* About */}
          <motion.div variants={itemVariants}>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              About
            </h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 4 }}
                    className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <span className="size-1 rounded-full bg-primary/50 transition-colors group-hover:bg-primary" />
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* ── Contact Card ── */}
        {/* NOTE: overflow-hidden removed here on purpose — it was clipping
            the QR code's hover glow, which extends outside this card's
            bounds. The top hairline below doesn't need clipping since it's
            already flush with the border. */}
        <motion.div
          id="contact"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 40, scale: 0.97 },
            show: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
            },
          }}
          className="relative mb-16 rounded-3xl border border-border bg-card/40 backdrop-blur-xl"
        >
          <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <div className="relative z-10 flex flex-col items-center justify-between gap-10 p-8 md:p-12 lg:flex-row">
            {/* Left: Text + Socials */}
            <div className="space-y-4 text-center lg:text-left">
              <h3 className="text-2xl font-bold md:text-3xl">
                Ready to <span className="text-primary">Connect?</span>
              </h3>
              <p className="max-w-md text-muted-foreground">
                Whether you have a startup idea, need an enterprise solution,
                or just want to say hello — my inbox is always open.
              </p>

              <div className="flex items-center justify-center gap-4 pt-2 lg:justify-start">
                {socials.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
                      "border-border bg-secondary/50 text-secondary-foreground",
                      social.color
                    )}
                  >
                    <social.icon className="size-4" />
                    <span className="hidden sm:inline">{social.name}</span>
                  </motion.a>
                ))}
              </div>

              <div className="flex flex-col items-center gap-2 pt-2 text-sm text-muted-foreground lg:items-start">
                <div className="flex items-center gap-2">
                  <Mail className="size-4" />
                  <span>hello@tabish.dev</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="size-4" />
                  <span>Lahore, Pakistan</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4" />
                  <span className="inline-flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    Available for new projects
                  </span>
                </div>
              </div>
            </div>

            {/* Right: WhatsApp QR */}
            <div className="flex flex-col items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="group relative cursor-pointer"
              >
                <div className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-[#25D366]/20 to-primary/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative rounded-2xl border border-border bg-card p-4 shadow-xl">
                  <QRGrid />
                </div>
              </motion.div>

              <div className="flex items-center gap-2">
                <MessageCircle className="size-4 text-[#25D366]" />
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  WhatsApp Business
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground/60">
                Scan to start a conversation
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Bottom Bar ── */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { duration: 0.6 } },
          }}
          className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row"
        >
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            {/* © {new Date().getFullYear()} */}
             Tabish. Crafted with
            <Heart className="mx-1 size-3 fill-red-500 text-red-500" />
            in Pakistan
          </p>

          <div className="flex items-center gap-6">
            <span className="text-xs text-muted-foreground">
              Available Worldwide 🌍
            </span>

            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="flex size-10 items-center justify-center rounded-full border border-border bg-secondary/50 text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
              aria-label="Back to top"
            >
              <ArrowUp className="size-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
