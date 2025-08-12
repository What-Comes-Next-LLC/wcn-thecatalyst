// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/", destination: "/showcase.html" },
    ];

    return [
      { source: "/ditl", destination: "/ditl.html" },
    ];

  },
  eslint: {
    ignoreDuringBuilds: true, // rely on IDE/local linting
  },
};

export default nextConfig;

