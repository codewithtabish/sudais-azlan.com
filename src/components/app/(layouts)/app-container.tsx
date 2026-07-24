import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface AppContainerProps {
  children: ReactNode;
  className?: string;
}

export function AppContainer({
  children,
  className,
}: AppContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1440px]",
        "px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16",
        className
      )}
    >
      {children}
    </div>
  );
}