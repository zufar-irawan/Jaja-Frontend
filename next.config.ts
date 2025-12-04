import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: ["jaja.id", "nimda.jaja.id", "seller.jaja.id"],
  },
};

export default nextConfig;
