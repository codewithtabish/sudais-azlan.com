import type { LucideIcon } from "lucide-react";
import {
  MessagesSquare,
  Zap,
  Code2,
  Layers,
  LifeBuoy,
  ReceiptText,
} from "lucide-react";

export interface WhyUsItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const whyUsItems: WhyUsItem[] = [
  {
    id: "direct",
    title: "Direct communication",
    description:
      "No account managers or middlemen — you talk to the person actually writing the code, every step of the way.",
    icon: MessagesSquare,
  },
  {
    id: "fast",
    title: "Fast turnaround",
    description:
      "Most projects ship in weeks, not months. Clear scope and tight feedback loops keep timelines from drifting.",
    icon: Zap,
  },
  {
    id: "clean",
    title: "Clean, maintainable code",
    description:
      "Typed, tested, and documented — built so the next developer, or future you, can pick it up without guesswork.",
    icon: Code2,
  },
  {
    id: "ownership",
    title: "Full-stack ownership",
    description:
      "From database schema to the last pixel — one person accountable for the whole system, not just a slice of it.",
    icon: Layers,
  },
  {
    id: "support",
    title: "Post-launch support",
    description:
      "Shipping isn't the finish line. I stick around for the bug fixes and questions that come up in week three.",
    icon: LifeBuoy,
  },
  {
    id: "pricing",
    title: "Transparent pricing",
    description:
      "Fixed quotes agreed upfront — no surprise invoices, no scope creep billed quietly on the side.",
    icon: ReceiptText,
  },
];