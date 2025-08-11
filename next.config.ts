import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/', destination: '/showcase.html' }
  },

  eslint: {
    ignoreDuringBuilds: true, // We'll rely on IDE/local linting instead of build-time linting
  },
};

export default nextConfig;
