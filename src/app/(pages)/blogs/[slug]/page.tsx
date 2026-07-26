import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getBlogBySlugAction } from "@/actions/(blogs)/get-blog-by-slug";
import { Section } from "@/components/app/(layouts)/section-container";
import { SingleBlogPreviewer } from "@/components/app/(blogs)/single-blogs-previewer";
import { AppContainer } from "@/components/app/(layouts)/app-container";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function SingleBlogPage({ params }: PageProps) {
  const { slug } = await params;

  const result = await getBlogBySlugAction(slug);

  if (!result.success || !result.data) {
    notFound();
  }

  const blog = result.data;

  

  // ✅ Parse content
  const parsedContent =
    typeof blog.content === "string"
      ? JSON.parse(blog.content)
      : blog.content;



  return (
   
    <main>
      {/* ========== TOP BAR: Back + Mode Toggle ========== */}
      <div className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto">
          <Button
            variant="secondary"
            size="sm"
            
            className="backdrop-blur-md bg-white/80 py-5  dark:bg-black/80 border border-border/50 shadow-lg hover:bg-white dark:hover:bg-black"
          >
            <Link href="/blogs" className="flex flex-row  items-center">
              <ArrowLeft className="h-4 w-4 mr-2  text-sm" />
              <span className="text-[11px]">
              Back to Blogs

              </span>
            </Link>
          </Button>
        </div>
        
        <div className="pointer-events-auto">
        </div>
      </div>

      {/* ========== BANNER SECTION ========== */}
      <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">

        <Image
          src={blog.bannerImage}
          alt={blog.bannerImageAlt || blog.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0">
          <Section>
            <AppContainer>

           <div className="max-w-3xl">
              {blog.status === "PUBLISHED" && blog.publishedAt && (
                <time className="text-sm text-white/80">
                  {/* {format(new Date(blog.publishedAt), "MMMM d, yyyy")} */}
                </time>
              )}
              <h1 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                {blog.title}
              </h1>
              {blog.shortDescription && (
                <p className="mt-4 text-lg text-white/90 leading-relaxed max-w-2xl">
                  {blog.shortDescription}
                </p>
              )}
            </div>
                    </AppContainer>

          </Section>
        </div>
      </section>

      {/* ========== BLOG CONTENT + TABLE OF CONTENTS ========== */}
      <Section className="py-12 md:py-16 lg:w-[80%]">
        <div className="flex gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <SingleBlogPreviewer content={parsedContent}  />
          </div>

       
        </div>
      </Section>
    </main>
  )
}