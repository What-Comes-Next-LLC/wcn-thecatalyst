// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Serve showcase at root, and pretty URL for DITL
    return [
      { source: "/", destination: "/showcase.html" },
      { source: "/me", destination: "/founderspage.html" },
      { source: "/home", destination: "/showcase.html" },
      { source: "/ditl", destination: "/ditl.html" },
      { source: "/founderspage", destination: "/founderspage.html" },
    ];
  },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
