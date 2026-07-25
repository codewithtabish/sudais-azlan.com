"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

// Tells React to render `false` on the server and during the initial
// client render (matching hydration), then `true` from then on — with
// no effect and no setState call, so there's no extra render cascade.
function useHasMounted() {
  return React.useSyncExternalStore(
    () => () => {}, // subscribe: nothing to subscribe to, this never changes
    () => true, // client snapshot
    () => false // server snapshot
  );
}

export function ThemeToggler() {
  const { theme, setTheme } = useTheme();
  const mounted = useHasMounted();

  const isDark = theme === "dark";

  if (!mounted) {
    // Stable placeholder to avoid hydration mismatch
    return <div className="h-9 w-9 rounded-full border border-border/60" />;
  }

  return (
    <motion.button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.88, rotate: isDark ? -25 : 25 }}
      className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-muted/30 text-foreground shadow-sm"
    >
      {/* animated glow that shifts color with theme */}
      <motion.span
        className="pointer-events-none absolute inset-0 rounded-full blur-md"
        animate={{
          background: isDark
            ? "radial-gradient(circle, hsl(var(--primary)/0.45), transparent 70%)"
            : "radial-gradient(circle, rgba(250,204,21,0.4), transparent 70%)",
        }}
        transition={{ duration: 0.4 }}
        aria-hidden
      />

      {/* rotating halo ring, only visible on hover */}
      <motion.span
        className="pointer-events-none absolute inset-0 rounded-full border border-dashed border-primary/40 opacity-0"
        whileHover={{ opacity: 1, rotate: 90 }}
        transition={{ duration: 0.6, ease: "linear" }}
        aria-hidden
      />

      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={{ y: 14, opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
            exit={{ y: -14, opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 340, damping: 22 }}
            className="relative z-10 flex"
          >
            <Moon className="h-[1.1rem] w-[1.1rem] text-primary" />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ y: -14, opacity: 0, rotate: 90, scale: 0.5 }}
            animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
            exit={{ y: 14, opacity: 0, rotate: -90, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 340, damping: 22 }}
            className="relative z-10 flex"
          >
            <Sun className="h-[1.1rem] w-[1.1rem] text-amber-500" />
          </motion.span>
        )}
      </AnimatePresence>

      <span className="sr-only">Toggle theme</span>
    </motion.button>
  );
}
