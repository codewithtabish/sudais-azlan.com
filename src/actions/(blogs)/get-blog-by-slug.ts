"use server";

import prisma from "@/lib/prisam-client";
import { SLUG_CACHE_TAG } from "@/lib/cache-tags";
import { cacheTag, revalidateTag } from "next/cache";
import { cacheLife } from "next/cache";

// ============================================
// TYPES
// ============================================

export type BlogBySlugResult = Awaited<
  ReturnType<typeof getCachedBlogBySlug>
>;

// ============================================
// CACHED DATABASE QUERY
// ============================================

async function getCachedBlogBySlug(slug: string) {
  "use cache";


  // Cache forever until manually revalidated
  cacheLife("max");


  // Cache Tags
  cacheTag(`${SLUG_CACHE_TAG}-${slug}`);

console.log("🔥🔥🔥 DATABASE QUERY EXECUTED 🔥🔥🔥", slug);
  return prisma.blog.findUnique({
    where: {
      slug,
    },
    include: {
      seo: true,
    },
  });
}

// ============================================
// SERVER ACTION
// ============================================

export async function getBlogBySlugAction(slug: string) {
  try {
    const blog = await getCachedBlogBySlug(slug);

    if (!blog) {
      return {
        success: false,
        error: "Blog not found",
        data: null,
      };
    }

    return {
      success: true,
      data: blog,
    };
  } catch (error) {
    console.error("❌ Get blog by slug error:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch blog",
      data: null,
    };
  }
}

// ============================================
// REVALIDATE SINGLE BLOG
// ============================================


// ============================================
// REVALIDATE SINGLE BLOG CACHE
// ============================================

export async function revalidateSlugBlogCache(slug: string) {
  try {
    revalidateTag(`${SLUG_CACHE_TAG}-${slug}`, "default");

    console.log(`🔄 Cache revalidated for blog: ${slug}`);

    return {
      success: true,
      message: `Cache revalidated for "${slug}".`,
    };
  } catch (error) {
    console.error("❌ Revalidate cache error:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to revalidate cache.",
    };
  }
}