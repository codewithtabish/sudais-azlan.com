import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow all local development origins
  allowedDevOrigins: ["*"],

  // Enable Next.js 16 Cache Components
  cacheComponents: true,
  reactStrictMode: false,

  // Server Actions config — raise body size limit for image uploads.
  // Note: since the client sends the file as a number[] (JSON array of bytes),
  // a 5MB image inflates to well over 5MB as JSON — so the limit here needs
  // to be set generously above the actual file size you want to allow.
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },

  // Remote images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    qualities: [75, 90],
  },
};

export default nextConfig;