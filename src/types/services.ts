import type { LucideIcon } from "lucide-react";
import { Laptop, Server, Smartphone, Sparkles } from "lucide-react";

export interface Service {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
  features: string[];
}

export const services: Service[] = [
  {
    id: "web",
    title: "Web Application Development",
    icon: Laptop,
    description:
      "Modern, responsive, SEO-friendly websites and enterprise web applications built with Next.js, React, TypeScript, and Tailwind CSS.",
    features: [
      "Landing Pages",
      "SaaS Platforms",
      "Admin Dashboards",
      "Enterprise Applications",
    ],
  },
  {
    id: "backend",
    title: "Backend Development",
    icon: Server,
    description:
      "Secure, scalable backend systems with REST APIs, authentication, databases, cloud storage, queues, caching, and modern architecture.",
    features: ["REST APIs", "Authentication", "PostgreSQL", "Redis", "Docker", "AWS"],
  },
  {
    id: "mobile",
    title: "Mobile App Development",
    icon: Smartphone,
    description:
      "Beautiful cross-platform mobile applications for Android and iOS using React Native and Expo with native performance.",
    features: [
      "Android",
      "iOS",
      "Expo",
      "React Native",
      "Push Notifications",
      "Offline Support",
    ],
  },
  {
    id: "ai",
    title: "AI Automation",
    icon: Sparkles,
    description:
      "AI-powered workflows, intelligent chatbots, voice agents, and business automation that save time and improve productivity.",
    features: [
      "AI Chatbots",
      "Voice Agents",
      "AI Workflows",
      "OpenAI Integration",
      "Automation",
      "Business Tools",
    ],
  },
];
