import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DashboardContainerProps {
  children: ReactNode;
  className?: string;
}

export function DashboardContainer({
  children,
  className,
}: DashboardContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-screen-2xl",
        "px-4 sm:px-6 md:px-8 lg:px-8 xl:px-10 2xl:px-12",
        className
      )}
    >
      {children}
    </div>
  );
}