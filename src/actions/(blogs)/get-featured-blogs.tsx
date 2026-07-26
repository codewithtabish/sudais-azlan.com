"use server";

import { FEATURED_CACHE_TAG } from "@/lib/cache-tags";
import prisma from "@/lib/prisam-client";
import {
  cacheLife,
  cacheTag,
  revalidateTag,
} from "next/cache";

// ============================================
// TYPES
// ============================================

type BlogListItem = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  bannerImage: string;
  bannerImageAlt: string | null;
  featured: boolean;
  status: string;
  publishedAt: Date | null;
  createdAt: Date;
};

// ============================================
// CACHED DATABASE QUERY
// ============================================

async function getFeaturedBlogsCached(): Promise<BlogListItem[]> {
  "use cache";

  // Cache forever until manually revalidated
  cacheLife("max");

  // Cache tag
  cacheTag(FEATURED_CACHE_TAG);

  console.log("🏃 [CACHE MISS] Fetching featured blogs from DB");

  return prisma.blog.findMany({
    where: {
      featured: true,
      status: "PUBLISHED",
    },
    orderBy: {
      publishedAt: "desc",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      bannerImage: true,
      bannerImageAlt: true,
      featured: true,
      status: true,
      publishedAt: true,
      createdAt: true,
      shortDescription: true,
    },
  });
}

// ============================================
// SERVER ACTION
// ============================================

export async function getFeaturedBlogsAction() {
  try {
    const blogs = await getFeaturedBlogsCached();

    console.log("✅ Featured blogs returned:", blogs.length);
    

    return {
      success: true,
      data: blogs,
      count: blogs.length,
    };
  } catch (error) {
    console.error("❌ Get featured blogs error:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to get featured blogs",
      data: [],
      count: 0,
    };
  }
}

// ============================================
// REVALIDATE FEATURED BLOG CACHE
// ============================================

export async function revalidateFeaturedBlogCache() {
  try {
    revalidateTag(FEATURED_CACHE_TAG, "default");

    console.log("🔄 Featured blogs cache revalidated");

    return {
      success: true,
      message: "Cache revalidated",
    };
  } catch (error) {
    console.error("❌ Revalidate cache error:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to revalidate cache",
    };
  }
}