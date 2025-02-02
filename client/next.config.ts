import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  images: {
    domains: ["randomfox.ca"],
  },
};

export default nextConfig;
