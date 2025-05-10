import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // We'll rely on IDE/local linting instead of build-time linting
  },
};

export default nextConfig;
