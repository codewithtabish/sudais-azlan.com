"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggler } from "@/components/common/(themes)/mode-toggler";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const mobileList = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const mobileItem = {
  hidden: { opacity: 0, x: -12 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 22 },
  },
};

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const activeHref = hovered ?? pathname;

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-sm font-semibold tracking-tight"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md border border-border/60 bg-muted/40 text-primary">
            <Terminal className="h-3.5 w-3.5" />
          </span>
          tabish<span className="text-primary">.dev</span>
        </Link>

        {/* Desktop nav with sliding line indicator */}
        <nav
          className="relative hidden items-center gap-1 md:flex"
          onMouseLeave={() => setHovered(null)}
        >
          {LINKS.map((link) => {
            const isActive = activeHref === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onMouseEnter={() => setHovered(link.href)}
                className="relative px-3 py-2 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-1 -bottom-[1px] h-[2px] rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={isActive ? "text-foreground" : undefined}>
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right side: theme toggle + CTA + mobile trigger */}
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <ThemeToggler />
          </div>
          <Button
            size="sm"
            variant="outline"
            className="hidden rounded-full px-4 md:inline-flex"
          >
            Resume
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex"
                >
                  <X className="h-5 w-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex"
                >
                  <Menu className="h-5 w-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-md md:hidden"
          >
            <motion.nav
              variants={mobileList}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-1 px-6 py-4"
            >
              {LINKS.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div key={link.href} variants={mobileItem}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-center justify-between rounded-md px-2 py-3 font-mono text-base"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">
                          0{i + 1}
                        </span>
                        <span
                          className={
                            isActive
                              ? "text-primary"
                              : "text-foreground/90 transition-colors group-hover:text-primary"
                          }
                        >
                          {link.label}
                        </span>
                      </span>
                      <motion.span
                        className="h-px flex-1 mx-4 origin-left scale-x-0 bg-primary/40 group-hover:scale-x-100"
                        transition={{ duration: 0.25 }}
                      />
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div variants={mobileItem} className="mt-3 flex items-center justify-between">
                <ThemeToggler />
                <Button size="sm" className="rounded-full px-5">
                  Resume
                </Button>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
