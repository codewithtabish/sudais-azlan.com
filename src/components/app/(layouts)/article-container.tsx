import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ArticleContainerProps {
  children: ReactNode;
  className?: string;
}

export function ArticleContainer({
  children,
  className,
}: ArticleContainerProps) {
  return (
    <article
      className={cn(
        "mx-auto w-full max-w-4xl",
        "px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      {children}
    </article>
  );
}