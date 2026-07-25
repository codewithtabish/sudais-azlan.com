import type { LucideIcon } from "lucide-react";
import { Laptop, Server, Smartphone, Sparkles, Target, Compass } from "lucide-react";

export const techStack: Record<string, string[]> = {
  Frontend: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  Backend: ["Node.js", "Express.js", "REST APIs", "Server Actions"],
  Database: ["PostgreSQL", "Prisma ORM", "Drizzle ORM", "Neon"],
  "Cloud & DevOps": ["Docker", "AWS S3", "Redis", "Vercel", "GitHub"],
  Mobile: ["React Native", "Expo"],
};

export interface EducationItem {
  institution: string;
  role: string;
  location: string;
}

export const education: EducationItem[] = [
  {
    institution: "Abdul Wali Khan University Mardan",
    role: "Graduate",
    location: "Mardan, Pakistan",
  },
  {
    institution: "Postgraduate College Mardan",
    role: "Higher Education",
    location: "Mardan, Pakistan",
  },
];

export interface ServiceOffering {
  label: string;
  icon: LucideIcon;
}

export const servicesOffered: ServiceOffering[] = [
  { label: "Web Development", icon: Laptop },
  { label: "Mobile Apps", icon: Smartphone },
  { label: "AI Automation", icon: Sparkles },
  { label: "Backend Systems", icon: Server },
];

export interface MissionVisionItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const missionVision: MissionVisionItem[] = [
  {
    title: "Our Mission",
    icon: Target,
    description:
      "To help ambitious founders and businesses turn ideas into fast, reliable software — without the overhead of a traditional agency.",
  },
  {
    title: "Our Vision",
    icon: Compass,
    description:
      "To be the team clients call first when they need something built right the first time — across web, mobile, backend, and AI.",
  },
];