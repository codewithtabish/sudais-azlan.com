import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
}

export function Section({
  children,
  className,
}: SectionProps) {
  return (
    <section
      className={cn(
        "py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28",
        className
      )}
    >
      {children}
    </section>
  );
}