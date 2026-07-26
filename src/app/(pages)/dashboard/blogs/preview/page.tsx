"use client";

import { BlogPreviewer } from "@/components/app/(dashboard)/(blogs)/blog-previewer";
import React, { useState } from "react";
// import { BlogPreviewer } from "@/components/dashboard/blogs/create-blog/blog-previewer";

// @ts-ignore

export default function BlogPreviewPage() {
  const [content] = useState(() => {
    if (typeof window === "undefined") return null;

    try {
      const stored = sessionStorage.getItem("blog_preview_content");
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error("Failed to parse content:", e);
      return null;
    }
  });

  if (!content?.content?.blocks?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <p>No content to preview. Go back and click Preview and again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-4xl mx-auto prose dark:prose-invert">
        <BlogPreviewer content={content.content} />
      </div>
    </div>
  );
}
