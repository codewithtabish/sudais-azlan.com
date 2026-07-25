export interface Testimonial {
  id: string;
  /** Client's name */
  name: string;
  /** Client's role / company */
  role: string;
  /** The testimonial quote */
  quote: string;
  /** Client photo */
  image: string;
  /** Optional 1-5 star rating */
  rating?: number;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Founder, Loopwave",
    quote:
      "Rebuilt our entire dashboard in three weeks and it's genuinely faster than the one our last agency shipped in three months. Communicated clearly the whole way through.",
    image: "/images/testimonials/one.webp",
    rating: 5,
  },
  {
    id: "2",
    name: "Marcus Webb",
    role: "CTO, Northline Logistics",
    quote:
      "Walked into a messy legacy backend and untangled it without breaking a single client integration. That kind of care is rare.",
    image: "/images/testimonials/two.webp",
    rating: 5,
  },
  {
    id: "3",
    name: "Priya Nair",
    role: "Product Lead, Fenwick Health",
    quote:
      "Our mobile app went from prototype to App Store in six weeks, offline support and all. Users noticed the difference immediately.",
    image: "/images/testimonials/three.webp",
    rating: 5,
  },
  {
    id: "4",
    name: "Daniel Osei",
    role: "Founder, Kite & Co",
    quote:
      "The AI workflow he built now handles what used to take our team two full days every week. It just quietly runs in the background now.",
    image: "/images/testimonials/four.webp",
    rating: 5,
  },
];
