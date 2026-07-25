"use client";

import { AppSidebar } from "@/components/app/(dashboard)/app-sidebar";
import { DashboardContainer } from "@/components/app/(layouts)/dashboard-container";
import { AnimatedGlow } from "@/components/common/(themes)/anumated-glow";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <DashboardContainer className="flex ">
        <AnimatedGlow/>
      <AppSidebar />
      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>
    </DashboardContainer>
  );
};

export default DashboardLayout;