"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Star } from "lucide-react";

// Matches what getFeaturedBlogsAction actually returns at runtime.
// NOTE: the BlogListItem type in your server action is missing
// `shortDescription` even though the Prisma `select` includes it —
// this type is the source of truth for this component instead.
export type BlogCardData = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  bannerImage: string;
  bannerImageAlt: string | null;
  featured: boolean;
  status: string;
  // `unstable_cache` in the server action serializes its return value
  // through JSON, which turns Date objects into ISO strings. So these
  // arrive here as strings at runtime even though the DB/Prisma layer
  // produces real Dates — typed as a union to reflect that honestly.
  publishedAt: Date | string | null;
  createdAt: Date | string;
};

interface BlogCardProps {
  blog: BlogCardData;
  index: number;
}

function formatPublishedDate(
  date: Date | string | null,
  fallback: Date | string
) {
  const raw = date ?? fallback;
  const parsed = raw instanceof Date ? raw : new Date(raw);

  if (Number.isNaN(parsed.getTime())) {
    return "Unpublished";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

export function BlogCard({ blog, index }: BlogCardProps) {
  const displayDate = formatPublishedDate(blog.publishedAt, blog.createdAt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.02, y: -6 }}
      className="group"
    >
      <Link
        href={`/blogs/${blog.slug}`}
        className="block h-full rounded-2xl border border-border bg-card shadow-sm transition-[box-shadow,border-color] duration-300 hover:border-primary/40 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {/* Banner */}
        <div className="relative aspect-[16/9] overflow-hidden rounded-t-2xl">
          <Image
            src={blog.bannerImage}
            alt={blog.bannerImageAlt ?? blog.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08] group-hover:brightness-[0.85]"
          />

          {blog.featured && (
            <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full border border-primary/30 bg-background/90 px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm">
              <Star className="size-3 fill-primary" />
              Featured
            </span>
          )}
        </div>

        {/* Content */}
        <div className="space-y-3 p-6">
          <h3 className="line-clamp-2 text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
            {blog.title}
          </h3>

          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {blog.shortDescription}
          </p>

          <div className="flex items-center justify-between border-t border-border pt-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="size-3.5" />
              <span>{displayDate}</span>
            </div>

            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              Read Article
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
