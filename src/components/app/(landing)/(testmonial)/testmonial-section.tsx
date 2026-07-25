"use client";

import { testimonials } from "@/types/testmonail";
import { MessageSquareQuote } from "lucide-react";
import TestimonialsCard from "./testmonial-card";
import { SectionHeader } from "@/components/common/(headers)/section-header";

export function TestimonialsSection() {
  return (
    <div
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="relative isolate overflow-hidden"
    >
      {/* dot-grid background, consistent with Hero / Services */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.15] [background-image:radial-gradient(hsl(var(--muted-foreground))_1px,transparent_1px)] [background-size:28px_28px]"
      />

      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-3 py-1 font-mono text-xs tracking-wide text-muted-foreground">
            <MessageSquareQuote className="h-3 w-3 text-primary" aria-hidden />
            Testimonials
          </span>

          <SectionHeader          title="What Our Clients Say"
          description="   Real feedback from the founders and teams I&apos;ve built products
            with, in their own words."

          />

       
        </div>

        <div className="mt-16 flex justify-center">
          <TestimonialsCard items={testimonials} autoPlay autoPlayInterval={6000} />
        </div>
      </div>
    </div>
  );
}
