"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  LayoutDashboard,
  BarChart3,
  FolderKanban,
  Users,
  MessageSquare,
  Settings,
  ChevronsLeft,
  Sun,
  Moon,
  LogOut,
  Images,
  FileText,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { ThemeToggler } from "@/components/common/(themes)/mode-toggler";

// ---------------------------------------------------------------------------
// Nav config — swap these for your own routes/icons. Grouping is rendered
// as separate sections with a small label above each group.
// ---------------------------------------------------------------------------
const navGroups = [
  {
    label: "Overview",
    items: [
{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Blogs", href: "/dashboard/blogs", icon: FileText },
      { label: "Projects", href: "/dashboard/projects", icon: FolderKanban },
      { label: "Assets", href: "/dashboard/Assets", icon: Images },
      { label: "Users", href: "/dashboard/users", icon: Users },
    ],
  },
  {
    label: "Work",
    items: [
      { label: "Projects", href: "/projects", icon: FolderKanban },
      { label: "Team", href: "/team", icon: Users },
      { label: "Messages", href: "/messages", icon: MessageSquare },
    ],
  },
];

interface AppSidebarProps {
  user?: {
    name: string;
    email: string;
    imageUrl?: string | null;
  };
  className?: string;
}

export function AppSidebar({ user, className }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const navRef = useRef<HTMLDivElement>(null);

  // Stagger the nav items in on mount — GSAP handles this rather than
  // Framer since it's a one-shot entrance sequence, not a state-driven
  // transition (that's what Framer's layout/exit animations are for below).
  useGSAP(
    () => {
      const items = navRef.current?.querySelectorAll("[data-nav-item]");
      if (!items?.length) return;

      gsap.fromTo(
        items,
        { opacity: 0, x: -12 },
        {
          opacity: 1,
          x: 0,
          duration: 0.45,
          stagger: 0.045,
          ease: "power3.out",
          delay: 0.1,
        }
      );
    },
    { scope: navRef }
  );

  // Magnetic hover on the collapse toggle — small, deliberate, not overdone.
  const toggleRef = useRef<HTMLButtonElement>(null);
  useGSAP(() => {
    const el = toggleRef.current;
    if (!el) return;

    const onEnter = () =>
      gsap.to(el, { scale: 1.08, duration: 0.2, ease: "power2.out" });
    const onLeave = () =>
      gsap.to(el, { scale: 1, duration: 0.3, ease: "power2.out" });

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 264 }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      className={cn(
        "relative flex h-screen flex-col border-r border-border bg-background",
        className
      )}
    >
      {/* Logo + collapse toggle */}
      <div className="flex h-16 shrink-0 items-center justify-between px-4">
        <AnimatePresence mode="wait" initial={false}>
          {!collapsed && (
            <motion.span
              key="logo-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-lg font-semibold tracking-tight text-foreground"
            >
              Yourapp
            </motion.span>
          )}
        </AnimatePresence>

        <button
          ref={toggleRef}
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <motion.span
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ChevronsLeft className="size-4" />
          </motion.span>
        </button>
      </div>

      {/* Nav */}
      <nav ref={navRef} className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.15 }}
                  className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  {group.label}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    data-nav-item
                    className={cn(
                      "relative flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {isActive && (
                      // Shared layoutId — Framer animates this pill sliding
                      // between whichever items are active, rather than
                      // fading in/out at each location.
                      <motion.span
                        layoutId="active-nav-pill"
                        className="absolute inset-0 rounded-md bg-accent"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <Icon className="relative z-10 size-[18px] shrink-0" />
                    <AnimatePresence initial={false}>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.15 }}
                          className="relative z-10 overflow-hidden whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Settings, theme toggle, user */}
      <div className="shrink-0 border-t border-border p-3">
        <Link
          href="/settings"
          className="mb-1 flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <Settings className="size-[18px] shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>
<div className="py-2 px-4">
     <ThemeToggler/>

</div>

        {user && (
          <div className="flex items-center gap-3 rounded-md border border-border bg-muted/40 px-2.5 py-2">
            <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent text-xs font-medium text-accent-foreground">
              {user.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.imageUrl} alt={user.name} className="size-full object-cover" />
              ) : (
                user.name.slice(0, 2).toUpperCase()
              )}
            </div>
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="min-w-0 flex-1 overflow-hidden"
                >
                  <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </motion.div>
              )}
            </AnimatePresence>
            {!collapsed && (
              <button
                aria-label="Log out"
                className="shrink-0 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="size-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </motion.aside>
  );
}
