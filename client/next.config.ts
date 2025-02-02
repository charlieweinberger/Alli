import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: false,
  },
  images: {
    domains: ["randomfox.ca"],
  },
};

export default nextConfig;
