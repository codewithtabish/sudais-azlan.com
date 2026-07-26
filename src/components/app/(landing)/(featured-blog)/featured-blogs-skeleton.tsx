import { Skeleton } from "@/components/ui/skeleton";

function BlogCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* Banner */}
      <Skeleton className="aspect-[16/9] w-full rounded-none" />

      {/* Content */}
      <div className="space-y-3 p-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-4/5" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
    </div>
  );
}

export function FeaturedBlogsListSkeleton() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section heading — mirrors FeaturedBlogsList's SectionWrapper so
            nothing shifts in height once real content swaps in. */}
        <div className="mb-16 flex flex-col items-center text-center">
          <Skeleton className="mb-3 h-4 w-40" />
          <Skeleton className="mb-4 h-11 w-72" />
          <Skeleton className="h-5 w-full max-w-2xl" />
          <Skeleton className="mt-2 h-5 w-3/4 max-w-2xl" />
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
