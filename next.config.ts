import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow all local development origins
  allowedDevOrigins: ["*"],

  // Enable Next.js 16 Cache Components
  // cacheComponents: true,
  reactStrictMode: false,

  

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