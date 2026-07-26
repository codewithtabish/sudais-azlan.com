"use server";

import { FEATURED_CACHE_TAG } from "@/lib/cache-tags";
import prisma from "@/lib/prisam-client";
import { revalidateTag } from "next/cache";
import { unstable_cache } from "next/cache";

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
// GET FEATURED BLOGS (cached)
// ============================================
const getFeaturedBlogsCached = unstable_cache(
  async (): Promise<BlogListItem[]> => {
    console.log("🏃 [CACHE MISS] Fetching featured blogs from DB");

    const blogs = await prisma.blog.findMany({
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

    return blogs;
  },
  ["featured-blogs"],
  {
    revalidate: false,
    tags: [FEATURED_CACHE_TAG],
  }
);

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
      error: error instanceof Error ? error.message : "Failed to get featured blogs",
      data: [],
      count: 0,
    };
  }
}

// ============================================
// REVALIDATE CACHE (call after create/update/delete)
// ============================================
export async function revalidateFeaturedBlogCache() {
  try {
    // Next.js 15+ requires second argument: cache profile
    // Using "default" profile - works with standard cache
    revalidateTag(FEATURED_CACHE_TAG, "default");

    console.log("🔄 Blog cache revalidated");

    return { success: true, message: "Cache revalidated" };
  } catch (error) {
    console.error("❌ Revalidate cache error:", error);
    return { success: false, error: "Failed to revalidate cache" };
  }
}