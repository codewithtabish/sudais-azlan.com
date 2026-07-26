import Link from "next/link";
import { getFeaturedBlogsAction } from "@/actions/(blogs)/get-featured-blogs";
import { FileText, AlertCircle, ArrowRight } from "lucide-react";
import { BlogCard } from "./blog-card";
import { Button } from "@/components/ui/button";

// Homepage only ever shows a couple of featured posts — the full list
// lives at /blogs. Bump this if you ever want to show more here.
const HOMEPAGE_FEATURED_LIMIT = 2;

function SectionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <section className="">
        {children}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 px-6 py-20 text-center">
      <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-muted">
        <FileText className="size-7 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">
        No Featured Blogs Yet
      </h3>
      <p className="max-w-sm text-sm text-muted-foreground">
        Featured articles will appear here once they are published.
      </p>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-20 text-center">
      <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="size-7 text-destructive" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">
        Something went wrong
      </h3>
      <p className="max-w-sm text-sm text-muted-foreground">
        Unable to load featured blogs.
      </p>
    </div>
  );
}

export async function FeaturedBlogsList() {
  const result = await getFeaturedBlogsAction();

  if (!result.success) {
    return (
      <SectionWrapper>
        <ErrorState />
      </SectionWrapper>
    );
  }

  if (result.data.length === 0) {
    return (
      <SectionWrapper>
        <EmptyState />
      </SectionWrapper>
    );
  }

  const featured = result.data.slice(0, HOMEPAGE_FEATURED_LIMIT);

  return (
    <SectionWrapper>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {featured.map((blog, index) => (
          <BlogCard key={blog.id} blog={blog} index={index} />
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Button variant="outline" size="lg" className="group gap-2" asChild>
          <Link href="/blogs">
            Explore All Articles
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </SectionWrapper>
  );
}
