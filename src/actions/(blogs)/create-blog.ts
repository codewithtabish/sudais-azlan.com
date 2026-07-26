"use server";

import prisma from "@/lib/prisam-client";
import { revalidatePath } from "next/cache";
import { OpenAI } from "openai";
import { revalidateFeaturedBlogCache } from "./get-featured-blogs";
// import { revalidateBlogCache } from "./blogs-all-actions";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// ============================================
// TYPES
// ============================================
type CreateBlogInput = {
  title: string;
  slug: string;
  content: any;
  ogImage: string;
  bannerImage: string;
  featured: boolean;
  tableOfContents?: { id: string; title: string; slug: string }[];
};

// ============================================
// EXTRACT TEXT FROM EDITORJS FOR AI
// ============================================
function extractTextFromContent(content: any): string {
  if (!content?.blocks) return "";

  return content.blocks
    .map((block: any) => {
      if (block.type === "paragraph") return block.data?.text || "";
      if (block.type === "header") return `## ${block.data?.text || ""}`;
      if (block.type === "list") return (block.data?.items || []).join("\n");
      if (block.type === "quote") return `> ${block.data?.text || ""}`;
      if (block.type === "raw") {
        const html = block.data?.html || "";
        return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      }
      return "";
    })
    .filter(Boolean)
    .join("\n\n");
}

// ============================================
// OPENAI: GENERATE SEO, SHORT DESCRIPTION & METADATA
// ============================================
async function generateSEOWithAI(title: string, contentText: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert SEO specialist and content marketer. Based on the blog title and content provided, generate professional SEO metadata AND a compelling short description.

STRICT RULES:
- DO NOT change or modify the title
- DO NOT change or modify the slug
- shortDescription must be 1-2 sentences, max 160 characters, engaging, click-worthy
- shortDescription should summarize what the reader will learn
- Generate compelling, click-worthy SEO metadata
- Keep meta descriptions under 160 characters
- Keep meta titles under 60 characters
- Make Open Graph descriptions engaging for social sharing
- Return ONLY a valid JSON object

Return this exact JSON structure:
{
  "shortDescription": "Compelling 1-2 sentence summary max 160 chars",
  "metaTitle": "SEO-optimized title under 60 chars",
  "metaDescription": "Compelling meta description under 160 chars",
  "ogDescription": "Engaging social media description",
  "twitterDescription": "Twitter-optimized description",
  "keywords": ["relevant", "seo", "keywords", "max", "10"],
  "summary": "2-3 sentence summary of the blog"
}`,
        },
        {
          role: "user",
          content: `Blog Title: ${title}\n\nBlog Content:\n${contentText.slice(0, 3000)}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const aiResponse = response.choices[0]?.message?.content || "";
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);


    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        shortDescription: parsed.shortDescription || `Learn about ${title} — a comprehensive guide with expert insights.`,
        metaTitle: parsed.metaTitle || title,
        metaDescription: parsed.metaDescription || `Read about ${title}. Discover detailed insights and information.`,
        ogDescription: parsed.ogDescription || `Learn more about ${title}`,
        twitterDescription: parsed.twitterDescription || parsed.ogDescription || `Learn about ${title}`,
        keywords: parsed.keywords || [],
        summary: parsed.summary || "",
      };
    }

    throw new Error("Invalid AI response format");
  } catch (error) {
    console.error("OpenAI generation error:", error);
    return {
      shortDescription: `Learn about ${title} — a comprehensive guide with expert insights and practical tips.`,
      metaTitle: title,
      metaDescription: `Read about ${title}. Discover detailed insights, tips, and comprehensive information in this in-depth guide.`,
      ogDescription: `Explore ${title} - a comprehensive guide with expert insights and practical information.`,
      twitterDescription: `Learn about ${title} - expert insights and comprehensive guide.`,
      keywords: [title.toLowerCase().replace(/\s+/g, "-")],
      summary: `A comprehensive guide about ${title}.`,
    };
  }
}

// ============================================
// SERVER ACTION: Create Blog
// ============================================
export async function createBlogAction(data: CreateBlogInput) {
  try {
    console.log("📥 Creating blog:", data.title, "| TOC items:", data.tableOfContents?.length || 0);

    // Step 1: Check for duplicate slug
    const existingBlog = await prisma.blog.findUnique({
      where: { slug: data.slug },
    });

    if (existingBlog) {
      return {
        success: false,
        error: "A blog with this slug already exists",
      };
    }

    // Step 2: Use TOC from client (manual entries)

    // Step 3: Extract text for AI
    const contentText = extractTextFromContent(data.content);

    // Step 4: Generate SEO metadata + shortDescription with OpenAI
    console.log("🤖 Generating SEO & shortDescription with OpenAI...");
    const seoData = await generateSEOWithAI(data.title, contentText);
    console.log("✅ AI Generated shortDescription:", seoData.shortDescription);

    // Step 5: Build canonical URL
    const canonicalUrl = `${BASE_URL}/blogs/${data.slug}`;

    // Step 6: Create Blog + SEO in database
    const blog = await prisma.blog.create({
      data: {
        title: data.title,
        slug: data.slug,
        shortDescription: seoData.shortDescription,  // ✅ AI GENERATED
        content: data.content,
        bannerImage: data.bannerImage,
        bannerImageAlt: data.title,
        featured: data.featured,
        status: "PUBLISHED",
        publishedAt: new Date(),

        seo: {
          create: {
            metaTitle: seoData.metaTitle,
            metaDescription: seoData.metaDescription,
            canonicalUrl: canonicalUrl,
            noIndex: false,
            noFollow: false,
            ogTitle: data.title,
            ogDescription: seoData.ogDescription,
            ogImage: data.ogImage,
            twitterTitle: data.title,
            twitterDescription: seoData.twitterDescription,
            twitterImage: data.ogImage,
            schemaType: "Article",
          },
        },
      },
      include: {
        seo: true,
      },
    });


    if(blog.featured){
      // Refresh featured blogs cache (only if this blog is featured)
  await revalidateFeaturedBlogCache();
  revalidatePath("/dashboard/blogs")
  revalidatePath("/")
  revalidatePath("/blogs")
  

    }

// 
    console.log("✅ Blog created:", blog.id, "| shortDescription:", blog.shortDescription);

    // Step 7: REVALIDATE CACHE so new blog appears in lists immediately
    // await revalidateBlogCache();
    console.log("🔄 Cache revalidated after blog creation");

    // Refresh dashboard blog list
revalidatePath("/dashboard/blogs");

// Refresh create page

// Refresh public blogs page
revalidatePath("/blogs");

// Refresh the newly created blog page
// revalidatePath(`/blogs/${blog.slug}`);

    return {
      success: true,
      data: {
        blog: {
          id: blog.id,
          title: blog.title,
          slug: blog.slug,
          shortDescription: blog.shortDescription,
          featured: blog.featured,
          status: blog.status,
          publishedAt: blog.publishedAt,
          createdAt: blog.createdAt,
        },
        seo: {
          metaTitle: blog.seo?.metaTitle,
          metaDescription: blog.seo?.metaDescription,
          canonicalUrl: blog.seo?.canonicalUrl,
          ogDescription: blog.seo?.ogDescription,
          twitterDescription: blog.seo?.twitterDescription,
        },
        aiGenerated: {
          shortDescription: seoData.shortDescription,
          keywords: seoData.keywords,
          summary: seoData.summary,
        },
      },
    };
  } catch (error) {
    console.error("❌ Create blog error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create blog",
    };
  }
}