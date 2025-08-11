// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/", destination: "/showcase.html" },
    ];
  },

  eslint: {
    ignoreDuringBuilds: true, // rely on IDE/local linting
  },
};

export default nextConfig;

