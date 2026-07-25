"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MessageCircle,
  ArrowUp,
  Mail,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

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
    [1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0],
    [1,0,1,1,1,0,1,0,1],
    [1,0,1,1,1,0,1,0,0],
    [1,0,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,0],
    [1,1,1,1,1,1,1,0,1],
    [0,0,0,0,0,0,0,0,0],
    [1,0,1,0,1,0,1,0,1],
  ];

  return (
    <div
      className="grid gap-[2px] w-24 h-24 bg-white p-1.5 rounded-lg"
      style={{ gridTemplateColumns: "repeat(9, 1fr)" }}
    >
      {pattern.flat().map((cell, i) => (
        <div
          key={i}
          className={cn(
            "rounded-[1px]",
            cell ? "bg-black" : "bg-transparent"
          )}
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
  assets: [
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
    color: "hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] hover:border-[#0A66C2]/30",
  },
  {
    name: "Twitter / X",
    icon: XIcon,
    href: "https://twitter.com/yourhandle",
    color: "hover:bg-foreground/10 hover:text-foreground hover:border-foreground/30",
  },
  {
    name: "WhatsApp",
    icon: MessageCircle,
    href: "https://wa.me/YOUR_NUMBER",
    color: "hover:bg-[#25D366]/10 hover:text-[#25D366] hover:border-[#25D366]/30",
  },
];

/* ─── Component ─── */

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const colsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cols = colsRef.current?.querySelectorAll(".footer-col");
      if (cols) {
        gsap.fromTo(
          cols,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: colsRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      gsap.fromTo(
        contactRef.current,
        { opacity: 0, scale: 0.95, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: contactRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        bottomRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          delay: 0.3,
          scrollTrigger: {
            trigger: bottomRef.current,
            start: "top 95%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      ref={footerRef}
      className="relative pt-24 pb-8 px-6 overflow-hidden border-t border-border"
    >
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* ── Top CTA Text ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Let's Build{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-cyan-500">
              The Future
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Open for worldwide collaboration. Ready to turn your next big idea
            into reality.
          </p>
        </motion.div>

        {/* ── Links Grid ── */}
        <div
          ref={colsRef}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-20"
        >
          {/* Brand Column */}
          <div className="footer-col col-span-2 md:col-span-4 lg:col-span-1">
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 mb-4">
              Tabish
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
              Full-Stack Software Engineer crafting scalable, AI-powered digital
              products from Pakistan to the world.
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
                    "w-10 h-10 rounded-xl border border-border bg-secondary/50 flex items-center justify-center transition-colors",
                    social.color
                  )}
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Blogs */}
          <div className="footer-col">
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
              Blogs
            </h4>
            <ul className="space-y-3">
              {footerLinks.blogs.map((link) => (
                <li key={link.label}>
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 4 }}
                    className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Projects */}
          <div className="footer-col">
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
              Projects
            </h4>
            <ul className="space-y-3">
              {footerLinks.projects.map((link) => (
                <li key={link.label}>
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 4 }}
                    className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div className="footer-col">
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
              About
            </h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 4 }}
                    className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Assets */}
          <div className="footer-col">
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
              Assets
            </h4>
            <ul className="space-y-3">
              {footerLinks.assets.map((link) => (
                <li key={link.label}>
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 4 }}
                    className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Contact Card ── */}
        <div
          ref={contactRef}
          className="relative mb-16 rounded-3xl border border-border bg-card/40 backdrop-blur-xl overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <div className="relative z-10 p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* Left: Text + Socials */}
            <div className="text-center lg:text-left space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold">
                Ready to <span className="text-primary">Connect?</span>
              </h3>
              <p className="text-muted-foreground max-w-md">
                Whether you have a startup idea, need an enterprise solution, or
                just want to say hello — my inbox is always open.
              </p>

              <div className="flex items-center justify-center lg:justify-start gap-4 pt-2">
                {socials.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-colors",
                      "border-border bg-secondary/50 text-secondary-foreground",
                      social.color
                    )}
                  >
                    <social.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{social.name}</span>
                  </motion.a>
                ))}
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-muted-foreground pt-2">
                <Mail className="w-4 h-4" />
                <span>hello@tabish.dev</span>
              </div>
            </div>

            {/* Right: WhatsApp QR */}
            <div className="flex flex-col items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative group cursor-pointer"
              >
                <div className="absolute -inset-3 bg-gradient-to-r from-[#25D366]/20 to-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative bg-card border border-border rounded-2xl p-4 shadow-xl">
                  <QRGrid />
                </div>
              </motion.div>
              
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  WhatsApp Business
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground/60">
                Scan to start a conversation
              </p>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div
          ref={bottomRef}
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border"
        >
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            © {new Date().getFullYear()} Tabish. Crafted with
            <Heart className="w-3 h-3 text-red-500 fill-red-500 mx-1" />
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
              className="w-10 h-10 rounded-full border border-border bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}